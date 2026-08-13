"use client";

import { useRef, useState } from "react";
import type { Debt, DebtType } from "@/lib/engine";
import { useDebts } from "@/lib/data/useDebts";
import { useCurrency } from "@/lib/currency/currency";
import { parseDebtsCsv, type RowError } from "@/lib/csv/parse";
import { csvTemplate, DEBT_TYPES } from "@/lib/csv/template";
import { debtsToCsv } from "@/lib/csv/serialize";
import { extractPdfLines } from "@/lib/pdf/read";
import { parseBdoStatement, statementToDebt, type ParsedStatement } from "@/lib/pdf/bdo";

const EMPTY: Debt = {
  accountId: "",
  creditor: "",
  balance: 0,
  apr: 0,
  minimumPayment: 0,
  debtType: "credit_card",
};

function download(name: string, text: string) {
  const url = URL.createObjectURL(new Blob([text], { type: "text/csv" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

export default function DebtsPage() {
  const { debts, loading, demo, save, bulkSave, remove } = useDebts();
  const { format } = useCurrency();
  const [form, setForm] = useState<Debt>(EMPTY);
  const [editing, setEditing] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [errors, setErrors] = useState<RowError[]>([]);
  const [parsed, setParsed] = useState<ParsedStatement | null>(null);
  const [pdfBusy, setPdfBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const pdfRef = useRef<HTMLInputElement>(null);

  const set = <K extends keyof Debt>(k: K, v: Debt[K]) => setForm((f) => ({ ...f, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    if (!form.accountId.trim()) { setMsg("Account ID is required."); return; }
    try {
      await save({ ...form, lastUpdated: new Date().toISOString() });
      setForm(EMPTY);
      setEditing(false);
      setParsed(null);
      setMsg("Saved.");
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Save failed.");
    }
  }

  function edit(d: Debt) {
    setForm(d);
    setEditing(true);
    setMsg(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function onCsv(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setMsg(null);
    setErrors([]);
    const text = await file.text();
    const { debts: parsed, errors: errs } = parseDebtsCsv(text);
    setErrors(errs);
    if (parsed.length > 0) {
      try {
        await bulkSave(parsed);
        setMsg(`Imported ${parsed.length} debt${parsed.length === 1 ? "" : "s"} (matched by Account ID).`);
      } catch (err) {
        setMsg(err instanceof Error ? err.message : "Import failed.");
      }
    } else if (errs.length > 0) {
      setMsg("No valid rows imported — see errors below.");
    }
    if (fileRef.current) fileRef.current.value = "";
  }

  async function onPdf(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (pdfRef.current) pdfRef.current.value = "";
    if (!file) return;
    setMsg(null);
    setErrors([]);
    setParsed(null);
    setPdfBusy(true);
    try {
      const text = await extractPdfLines(file);
      const result = parseBdoStatement(text);
      if (result.bank === "Unknown") {
        setMsg(
          "This doesn't look like a BDO statement yet. You can still add the debt manually below — or send us the bank so we can add support."
        );
        return;
      }
      // Prefill the form as the confirm step; the user reviews, then saves.
      setForm(statementToDebt(result));
      setEditing(false);
      setParsed(result);
      if (result.missing.length > 0) {
        setMsg(`Imported from your BDO statement — please fill in: ${result.missing.join(", ")}.`);
      } else {
        setMsg("Imported from your BDO statement — review the highlighted figures below, then Add debt.");
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setMsg("Couldn't read that PDF. If it's password-protected, remove the password and try again.");
    } finally {
      setPdfBusy(false);
    }
  }

  return (
    <main className="container">
      <h1 style={{ color: "var(--moss)" }}>Your debts</h1>
      {demo && <div className="banner">Demo mode — changes are not saved. Connect the backend to persist.</div>}

      <section className="card">
        <h2 style={{ marginTop: 0, fontSize: "1.05rem" }}>{editing ? "Edit debt" : "Add a debt"}</h2>

        {!editing && (
          <div className="row-actions" style={{ marginBottom: 14, flexWrap: "wrap" }}>
            <button type="button" onClick={() => pdfRef.current?.click()} disabled={pdfBusy}>
              {pdfBusy ? "Reading statement…" : "📄 Upload bank statement (PDF)"}
            </button>
            <span className="note">BDO statements supported — we read the figures for you to confirm.</span>
            <input ref={pdfRef} type="file" accept="application/pdf,.pdf" hidden onChange={onPdf} />
          </div>
        )}

        {parsed && (
          <div className="detected">
            <div className="detected-head">
              Detected from your {parsed.creditor}
              {parsed.cardMasked ? ` (${parsed.cardMasked})` : ""} — confirm before saving:
            </div>
            <ul>
              <li>
                <span>Balance (Total Amount Due)</span>
                <strong>{parsed.balance.raw ? `₱${parsed.balance.raw}` : "— not found"}</strong>
              </li>
              <li>
                <span>Minimum payment (Minimum Amount Due)</span>
                <strong>{parsed.minimumPayment.raw ? `₱${parsed.minimumPayment.raw}` : "— not found"}</strong>
              </li>
              <li>
                <span>APR</span>
                <strong>
                  {parsed.apr.value != null
                    ? `${parsed.apr.value}% / yr (${parsed.aprMonthlyRaw} per month × 12)`
                    : "— not found"}
                </strong>
              </li>
              <li>
                <span>Payment due date</span>
                <strong>{parsed.dueDate.value ?? "— not found"}</strong>
              </li>
              <li>
                <span>Statement date</span>
                <strong>{parsed.statementDate.value ?? "— not found"}</strong>
              </li>
            </ul>
            <p className="note" style={{ margin: "8px 0 0" }}>
              BDO bills interest monthly (3% ≈ 36% APR). Edit any field below if it looks off, then Add debt.
            </p>
          </div>
        )}

        <form onSubmit={submit}>
          <div className="field-grid">
            <div>
              <label htmlFor="accountId">Account ID / nickname *</label>
              <input id="accountId" value={form.accountId} disabled={editing}
                onChange={(e) => set("accountId", e.target.value)} placeholder="e.g. visa-personal" />
            </div>
            <div>
              <label htmlFor="creditor">Creditor</label>
              <input id="creditor" value={form.creditor} onChange={(e) => set("creditor", e.target.value)} />
            </div>
            <div>
              <label htmlFor="balance">Balance</label>
              <input id="balance" type="number" min={0} step="0.01" value={form.balance}
                onChange={(e) => set("balance", Number(e.target.value))} />
            </div>
            <div>
              <label htmlFor="apr">APR %</label>
              <input id="apr" type="number" min={0} step="0.01" value={form.apr}
                onChange={(e) => set("apr", Number(e.target.value))} />
            </div>
            <div>
              <label htmlFor="min">Minimum payment</label>
              <input id="min" type="number" min={0} step="0.01" value={form.minimumPayment}
                onChange={(e) => set("minimumPayment", Number(e.target.value))} />
            </div>
            <div>
              <label htmlFor="type">Type</label>
              <select id="type" value={form.debtType} onChange={(e) => set("debtType", e.target.value as DebtType)}>
                {DEBT_TYPES.map((t) => <option key={t} value={t}>{t.replace(/_/g, " ")}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="due">Due date</label>
              <input id="due" type="date" value={form.dueDate ?? ""} onChange={(e) => set("dueDate", e.target.value || undefined)} />
            </div>
            <div>
              <label htmlFor="bill">Billing date</label>
              <input id="bill" type="date" value={form.billingDate ?? ""} onChange={(e) => set("billingDate", e.target.value || undefined)} />
            </div>
          </div>
          <div className="row-actions" style={{ marginTop: 14 }}>
            <button type="submit" className="primary">{editing ? "Save changes" : "Add debt"}</button>
            {(editing || parsed) && <button type="button" onClick={() => { setForm(EMPTY); setEditing(false); setParsed(null); }}>Cancel</button>}
          </div>
          {msg && <p className="note" style={{ marginTop: 10 }}>{msg}</p>}
        </form>
      </section>

      <section className="card">
        <h2 style={{ marginTop: 0, fontSize: "1.05rem" }}>Bulk CSV</h2>
        <p className="note">
          Re-uploads match existing debts by <strong>Account ID</strong> — an existing ID updates
          that debt; a new ID adds one. Creditor name is never used for matching.
        </p>
        <div className="row-actions" style={{ flexWrap: "wrap" }}>
          <button type="button" onClick={() => download("goodbyedebt-template.csv", csvTemplate())}>Download template</button>
          <button type="button" onClick={() => fileRef.current?.click()}>Upload CSV</button>
          <button type="button" disabled={debts.length === 0}
            onClick={() => download("my-debts.csv", debtsToCsv(debts))}>Export my debts</button>
          <input ref={fileRef} type="file" accept=".csv,text/csv" hidden onChange={onCsv} />
        </div>
        {errors.length > 0 && (
          <div style={{ marginTop: 12 }}>
            <p className="warn">{errors.length} row error{errors.length === 1 ? "" : "s"}:</p>
            <ul className="note">
              {errors.slice(0, 12).map((e, i) => (
                <li key={i}>Row {e.row}{e.field ? ` · ${e.field}` : ""}: {e.message}</li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <section className="card">
        <h2 style={{ marginTop: 0, fontSize: "1.05rem" }}>Tracked debts ({debts.length})</h2>
        {loading ? (
          <p className="muted">Loading…</p>
        ) : debts.length === 0 ? (
          <p className="muted">Nothing yet — add one above or upload a CSV.</p>
        ) : (
          <table>
            <thead>
              <tr><th>Account</th><th>Balance</th><th>APR</th><th>Min</th><th>Due</th><th></th></tr>
            </thead>
            <tbody>
              {debts.map((d) => (
                <tr key={d.accountId}>
                  <td><strong>{d.creditor || d.accountId}</strong><br /><span className="muted" style={{ fontSize: "0.75rem" }}>{d.accountId}</span></td>
                  <td>{format(d.balance, { maximumFractionDigits: 0 })}</td>
                  <td>{d.apr}%</td>
                  <td>{format(d.minimumPayment, { maximumFractionDigits: 0 })}</td>
                  <td>{d.dueDate ?? "—"}</td>
                  <td>
                    <div className="row-actions">
                      <button type="button" onClick={() => edit(d)}>Edit</button>
                      <button type="button" className="danger-btn" onClick={() => remove(d.accountId)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}
