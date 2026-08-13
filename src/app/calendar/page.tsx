"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useDebts } from "@/lib/data/useDebts";
import { usePayments } from "@/lib/data/usePayments";
import { useCurrency } from "@/lib/currency/currency";
import { upcomingDueDates, statementsNeedingRefresh, addOneMonthISO } from "@/lib/reminders/dueDates";

const fmt = (iso: string) =>
  new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

export default function CalendarPage() {
  const { debts, loading, demo, save } = useDebts();
  const { add: addPayment } = usePayments();
  const { format } = useCurrency();
  const upcoming = useMemo(() => upcomingDueDates(debts, new Date(), 60), [debts]);
  const toRefresh = useMemo(() => statementsNeedingRefresh(debts, new Date()), [debts]);
  const byId = useMemo(() => new Map(debts.map((d) => [d.accountId, d])), [debts]);
  const totalOwed = useMemo(() => debts.reduce((s, d) => s + Math.max(0, d.balance), 0), [debts]);

  // Payment entry state, keyed by accountId.
  const [payingId, setPayingId] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [paidIds, setPaidIds] = useState<Set<string>>(new Set());

  function startPaying(accountId: string) {
    const d = byId.get(accountId);
    setPayingId(accountId);
    setAmount(d ? String(d.minimumPayment || "") : "");
    setMsg(null);
  }

  async function record(accountId: string, currentDue?: string) {
    const d = byId.get(accountId);
    if (!d) return;
    const paid = Math.max(0, Number(amount));
    if (!paid) { setMsg("Enter a payment amount greater than 0."); return; }
    setBusy(true);
    try {
      const newBalance = Math.max(0, d.balance - paid);
      // Advance this account's due date to next cycle so it doesn't keep
      // showing as due after it's been paid.
      const nextDue = currentDue ? addOneMonthISO(currentDue) : d.dueDate;
      await save({ ...d, balance: newBalance, dueDate: nextDue, lastUpdated: new Date().toISOString() });
      // Logging the payment is best-effort — a missing payments table must not
      // block the balance update.
      try {
        await addPayment({ accountId, amount: paid, paidOn: new Date().toISOString().slice(0, 10), note: "" });
      } catch {
        /* payments table may not exist yet */
      }
      setPaidIds((prev) => new Set(prev).add(accountId));
      setPayingId(null);
      setMsg(
        `Recorded ${format(paid)} to ${d.creditor || accountId}. New balance: ${format(newBalance)}.` +
          (newBalance === 0 ? " 🎉 This debt is cleared!" : "")
      );
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Couldn't record the payment.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="container">
      <h1 style={{ color: "var(--moss)" }}>Upcoming due dates</h1>
      {demo && <div className="banner">Demo mode — payments update the plan on-screen but are not saved.</div>}
      <p className="tagline">
        Every account&apos;s next payment, soonest first. Mark each one paid to keep your plan and
        totals up to date.
      </p>

      {!loading && debts.length > 0 && (
        <div className="stat" style={{ marginBottom: 16 }}>
          <div className="label">Total owed across all accounts</div>
          <div className="value">{format(totalOwed, { maximumFractionDigits: 0 })}</div>
        </div>
      )}

      {toRefresh.length > 0 && (
        <div className="banner" style={{ background: "#fff6e6", borderColor: "#f0d9a8" }}>
          📄 A new statement has closed for{" "}
          <strong>{toRefresh.map((s) => s.creditor).join(", ")}</strong>. Upload the updated statement
          of account so your balances and plan stay accurate.{" "}
          <Link href="/debts">Upload now →</Link>
        </div>
      )}

      {msg && <p className="note" style={{ color: "var(--moss)", fontWeight: 600 }}>{msg}</p>}

      <section className="card">
        {loading ? (
          <p className="muted">Loading…</p>
        ) : upcoming.length === 0 ? (
          <p className="muted">
            No due dates in the next 60 days. Add due dates on the <Link href="/debts">Debts</Link> page.
          </p>
        ) : (
          upcoming.map((u) => {
            const d = byId.get(u.accountId);
            const isPaying = payingId === u.accountId;
            const paid = paidIds.has(u.accountId);
            return (
              <div className="timeline-item" key={u.accountId} style={{ flexWrap: "wrap" }}>
                <div>
                  <strong>{u.creditor || u.accountId}</strong>
                  <div className="muted" style={{ fontSize: "0.8rem" }}>
                    Min {format(u.minimumPayment, { maximumFractionDigits: 0 })}
                    {d ? ` · Balance ${format(d.balance, { maximumFractionDigits: 0 })}` : ""}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div>{fmt(u.dueDate)}</div>
                  <span className={`pill ${u.daysUntil <= 3 ? "soon" : ""}`}>
                    {u.daysUntil === 0 ? "Due today" : `in ${u.daysUntil} day${u.daysUntil === 1 ? "" : "s"}`}
                  </span>
                </div>

                <div style={{ flexBasis: "100%", marginTop: 8 }}>
                  {isPaying ? (
                    <div className="row-actions" style={{ flexWrap: "wrap", alignItems: "center" }}>
                      <label htmlFor={`pay-${u.accountId}`} className="note" style={{ margin: 0 }}>
                        Amount paid
                      </label>
                      <input
                        id={`pay-${u.accountId}`}
                        type="number"
                        min={0}
                        step="0.01"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        style={{ width: 130 }}
                        autoFocus
                      />
                      <button type="button" className="primary" disabled={busy} onClick={() => record(u.accountId, u.dueDate)}>
                        {busy ? "Saving…" : "Record payment"}
                      </button>
                      <button type="button" onClick={() => setPayingId(null)} disabled={busy}>Cancel</button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className={paid ? "" : "primary"}
                      onClick={() => startPaying(u.accountId)}
                    >
                      {paid ? "✓ Paid — record another" : "Mark paid"}
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </section>

      <p className="note">
        Reminder timing is configurable on the <Link href="/settings">Settings</Link> page. On
        devices without push support, this calendar is your reminder — no notification is ever a
        hard blocker (SOW §10).
      </p>
    </main>
  );
}
