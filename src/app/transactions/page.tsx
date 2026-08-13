"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useDebts } from "@/lib/data/useDebts";
import { usePayments } from "@/lib/data/usePayments";
import { useStatementTxns } from "@/lib/data/useStatementTxns";
import { useCurrency } from "@/lib/currency/currency";
import type { Payment } from "@/lib/data/payments";

const monthKey = (iso: string) => iso.slice(0, 7); // yyyy-mm
const monthLabel = (key: string) =>
  new Date(key + "-01T00:00:00").toLocaleDateString("en-US", { month: "long", year: "numeric" });
const dayLabel = (iso: string) =>
  new Date(iso + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" });

const todayISO = () => new Date().toISOString().slice(0, 10);

export default function TransactionsPage() {
  const { debts } = useDebts();
  const { payments, loading, demo, add, remove } = usePayments();
  const { txns, remove: removeTxn } = useStatementTxns();
  const { format } = useCurrency();

  const nameFor = useMemo(() => {
    const m = new Map(debts.map((d) => [d.accountId, d.creditor || d.accountId]));
    return (accountId: string) => m.get(accountId) ?? accountId;
  }, [debts]);

  const [accountId, setAccountId] = useState("");
  const [amount, setAmount] = useState("");
  const [paidOn, setPaidOn] = useState(todayISO());
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const total = useMemo(() => payments.reduce((s, p) => s + p.amount, 0), [payments]);
  const thisMonthTotal = useMemo(() => {
    const key = todayISO().slice(0, 7);
    return payments.filter((p) => monthKey(p.paidOn) === key).reduce((s, p) => s + p.amount, 0);
  }, [payments]);

  // Group payments by month for a readable ledger.
  const groups = useMemo(() => {
    const by = new Map<string, Payment[]>();
    for (const p of payments) {
      const k = monthKey(p.paidOn);
      if (!by.has(k)) by.set(k, []);
      by.get(k)!.push(p);
    }
    return [...by.entries()].sort((a, b) => (a[0] < b[0] ? 1 : -1));
  }, [payments]);

  // ---- Statement transactions (spending) ----
  const spend = useMemo(
    () => txns.filter((t) => t.direction === "debit").reduce((s, t) => s + t.amount, 0),
    [txns]
  );
  const txnGroups = useMemo(() => {
    const by = new Map<string, typeof txns>();
    for (const t of txns) {
      const k = monthKey(t.txnDate);
      if (!by.has(k)) by.set(k, []);
      by.get(k)!.push(t);
    }
    return [...by.entries()].sort((a, b) => (a[0] < b[0] ? 1 : -1));
  }, [txns]);

  // Group debits by merchant (first token) to surface recurring spend.
  const topMerchants = useMemo(() => {
    const by = new Map<string, { total: number; count: number; label: string }>();
    for (const t of txns) {
      if (t.direction !== "debit") continue;
      const key = t.description.toUpperCase().split(/\s+/)[0] || t.description.toUpperCase();
      const cur = by.get(key) ?? { total: 0, count: 0, label: t.description };
      cur.total += t.amount;
      cur.count += 1;
      by.set(key, cur);
    }
    return [...by.values()].sort((a, b) => b.total - a.total).slice(0, 8);
  }, [txns]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    const value = Math.max(0, Number(amount));
    if (!accountId) { setMsg("Choose which debt this payment was for."); return; }
    if (!value) { setMsg("Enter an amount greater than 0."); return; }
    setBusy(true);
    try {
      await add({ accountId, amount: value, paidOn: paidOn || todayISO(), note: note.trim() });
      setAmount("");
      setNote("");
      setMsg("Payment recorded.");
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Couldn't record the payment.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="container">
      <h1 style={{ color: "var(--moss)" }}>Transactions</h1>
      {demo && <div className="banner">Demo mode — sample payments shown; new entries are not saved.</div>}
      <p className="tagline">
        Every debt payment you&apos;ve recorded. Marking a due date paid on the{" "}
        <Link href="/calendar">Calendar</Link> logs here automatically.
      </p>

      <div className="stat-grid" style={{ marginBottom: 16 }}>
        <div className="stat">
          <div className="label">Total paid (all time)</div>
          <div className="value">{format(total, { maximumFractionDigits: 0 })}</div>
        </div>
        <div className="stat">
          <div className="label">Paid this month</div>
          <div className="value">{format(thisMonthTotal, { maximumFractionDigits: 0 })}</div>
        </div>
      </div>

      <section className="card">
        <h2 style={{ marginTop: 0, fontSize: "1.05rem" }}>Record a payment</h2>
        <form onSubmit={submit}>
          <div className="field-grid">
            <div>
              <label htmlFor="account">Debt</label>
              <select id="account" value={accountId} onChange={(e) => setAccountId(e.target.value)}>
                <option value="">Select…</option>
                {debts.map((d) => (
                  <option key={d.accountId} value={d.accountId}>{d.creditor || d.accountId}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="amount">Amount</label>
              <input id="amount" type="number" min={0} step="0.01" value={amount}
                onChange={(e) => setAmount(e.target.value)} />
            </div>
            <div>
              <label htmlFor="paidOn">Date paid</label>
              <input id="paidOn" type="date" value={paidOn} onChange={(e) => setPaidOn(e.target.value)} />
            </div>
            <div>
              <label htmlFor="note">Note (optional)</label>
              <input id="note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. extra payment" />
            </div>
          </div>
          <div className="row-actions" style={{ marginTop: 12 }}>
            <button type="submit" className="primary" disabled={busy}>{busy ? "Saving…" : "Add payment"}</button>
          </div>
          {msg && <p className="note" style={{ marginTop: 10 }}>{msg}</p>}
        </form>
      </section>

      <section className="card">
        <h2 style={{ marginTop: 0, fontSize: "1.05rem" }}>History</h2>
        {loading ? (
          <p className="muted">Loading…</p>
        ) : payments.length === 0 ? (
          <p className="muted">No payments yet. Record one above, or mark a due date paid on the Calendar.</p>
        ) : (
          groups.map(([key, rows]) => {
            const monthTotal = rows.reduce((s, p) => s + p.amount, 0);
            return (
              <div key={key} style={{ marginBottom: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <strong style={{ color: "var(--moss)" }}>{monthLabel(key)}</strong>
                  <span className="muted">{format(monthTotal, { maximumFractionDigits: 0 })}</span>
                </div>
                <table>
                  <thead>
                    <tr><th>Date</th><th>Debt</th><th>Note</th><th style={{ textAlign: "right" }}>Amount</th><th></th></tr>
                  </thead>
                  <tbody>
                    {rows.map((p) => (
                      <tr key={p.id}>
                        <td>{dayLabel(p.paidOn)}</td>
                        <td>{nameFor(p.accountId)}</td>
                        <td className="muted">{p.note || "—"}</td>
                        <td style={{ textAlign: "right" }}>{format(p.amount, { maximumFractionDigits: 0 })}</td>
                        <td>
                          {p.id && (
                            <button type="button" className="danger-btn" onClick={() => remove(p.id!)}>Delete</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })
        )}
      </section>

      <section className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 8 }}>
          <h2 style={{ margin: 0, fontSize: "1.05rem" }}>Spending from statements</h2>
          <span className="muted">Total spend: {format(spend, { maximumFractionDigits: 0 })}</span>
        </div>
        <p className="note">
          Line items read from your uploaded statements. Upload more on the{" "}
          <Link href="/debts">Debts</Link> page to build spending history.
        </p>

        {txns.length === 0 ? (
          <p className="muted">No statement transactions yet — upload a PDF statement to populate this.</p>
        ) : (
          <>
            {topMerchants.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <strong style={{ color: "var(--moss)", fontSize: "0.9rem" }}>Top merchants</strong>
                <table>
                  <thead>
                    <tr><th>Merchant</th><th>Count</th><th style={{ textAlign: "right" }}>Total</th></tr>
                  </thead>
                  <tbody>
                    {topMerchants.map((m) => (
                      <tr key={m.label}>
                        <td>
                          {m.label}
                          {m.count >= 2 && <span className="pill" style={{ marginLeft: 8 }}>recurring?</span>}
                        </td>
                        <td>{m.count}×</td>
                        <td style={{ textAlign: "right" }}>{format(m.total, { maximumFractionDigits: 0 })}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="note" style={{ marginTop: 6 }}>
                  Merchants seen more than once are likely recurring — candidates to review or cancel.
                </p>
              </div>
            )}

            {txnGroups.map(([key, rows]) => (
              <div key={key} style={{ marginBottom: 16 }}>
                <strong style={{ color: "var(--moss)" }}>{monthLabel(key)}</strong>
                <table>
                  <thead>
                    <tr><th>Date</th><th>Description</th><th>Account</th><th style={{ textAlign: "right" }}>Amount</th><th></th></tr>
                  </thead>
                  <tbody>
                    {rows.map((t) => (
                      <tr key={t.id}>
                        <td>{dayLabel(t.txnDate)}</td>
                        <td>{t.description}</td>
                        <td className="muted">{nameFor(t.accountId)}</td>
                        <td style={{ textAlign: "right", color: t.direction === "credit" ? "var(--money)" : undefined }}>
                          {t.direction === "credit" ? "+" : ""}{format(t.amount, { maximumFractionDigits: 0 })}
                        </td>
                        <td>
                          {t.id && <button type="button" className="danger-btn" onClick={() => removeTxn(t.id!)}>Delete</button>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </>
        )}
      </section>
    </main>
  );
}
