"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useDebts } from "@/lib/data/useDebts";
import { usePayments } from "@/lib/data/usePayments";
import { useCurrency } from "@/lib/currency/currency";
import { accruedBalance } from "@/lib/engine";
import { upcomingDueDates, addOneMonthISO, nextDueDate } from "@/lib/reminders/dueDates";

const fmt = (iso: string) =>
  new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

const WEEKDAY_HEADS = ["S", "M", "T", "W", "T", "F", "S"];

export default function CalendarPage() {
  const { debts, loading, demo, save } = useDebts();
  const { payments, add: addPayment } = usePayments();
  const { format } = useCurrency();
  const upcoming = useMemo(() => upcomingDueDates(debts, new Date(), 60), [debts]);
  // Balances carried forward to today — interest keeps compounding monthly
  // even if no payment or new statement has landed yet this cycle.
  const asOfToday = useMemo(() => debts.map((d) => ({ ...d, balance: accruedBalance(d) })), [debts]);
  const byId = useMemo(() => new Map(asOfToday.map((d) => [d.accountId, d])), [asOfToday]);
  const totalOwed = useMemo(() => asOfToday.reduce((s, d) => s + Math.max(0, d.balance), 0), [asOfToday]);

  // Payment entry state, keyed by accountId.
  const [payingId, setPayingId] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [paidIds, setPaidIds] = useState<Set<string>>(new Set());

  // Month grid navigation — current month by default.
  const [monthOffset, setMonthOffset] = useState(0);
  const gridMonth = useMemo(() => {
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() + monthOffset);
    return d;
  }, [monthOffset]);

  // Which calendar days (this grid month) have a due date or a recorded
  // payment — computed from the real due-date recurrence + payment history,
  // not placeholder data.
  const dueDays = useMemo(() => {
    const set = new Set<number>();
    const y = gridMonth.getFullYear();
    const m = gridMonth.getMonth();
    for (const d of debts) {
      if (!d.dueDate) continue;
      // Check the recurrence for this specific grid month (not just "today").
      const probe = new Date(y, m, 1);
      const next = nextDueDate(d.dueDate, probe);
      if (next.getFullYear() === y && next.getMonth() === m) set.add(next.getDate());
    }
    return set;
  }, [debts, gridMonth]);

  const paidDays = useMemo(() => {
    const set = new Set<number>();
    const y = gridMonth.getFullYear();
    const m = gridMonth.getMonth();
    for (const p of payments) {
      const d = new Date(p.paidOn + "T00:00:00");
      if (d.getFullYear() === y && d.getMonth() === m) set.add(d.getDate());
    }
    return set;
  }, [payments, gridMonth]);

  const todayMarker = useMemo(() => {
    const t = new Date();
    return t.getFullYear() === gridMonth.getFullYear() && t.getMonth() === gridMonth.getMonth() ? t.getDate() : -1;
  }, [gridMonth]);

  const gridCells = useMemo(() => {
    const y = gridMonth.getFullYear();
    const m = gridMonth.getMonth();
    const firstDow = new Date(y, m, 1).getDay();
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const prevDays = new Date(y, m, 0).getDate();
    const cells: { day: number; inMonth: boolean }[] = [];
    for (let i = firstDow - 1; i >= 0; i--) cells.push({ day: prevDays - i, inMonth: false });
    for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, inMonth: true });
    while (cells.length % 7 !== 0) cells.push({ day: cells.length - (firstDow + daysInMonth) + 1, inMonth: false });
    return cells;
  }, [gridMonth]);

  const recentPayments = useMemo(
    () => [...payments].sort((a, b) => (a.paidOn < b.paidOn ? 1 : -1)).slice(0, 8),
    [payments]
  );

  function startPaying(accountId: string) {
    const d = byId.get(accountId);
    setPayingId(accountId);
    setAmount(d ? String(d.minimumPayment || "") : "");
    setMsg(null);
  }

  async function record(accountId: string, currentDue?: string) {
    // `byId` already carries today's accrued balance (this month's interest
    // included), so the payment is deducted from what's actually owed now —
    // not from a stale figure frozen at the last statement or payment.
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
    <main className="container" style={{ maxWidth: 1040 }}>
      <div className="brand"><h1>Calendar</h1></div>
      {demo && <div className="banner">Demo mode — payments update the plan on-screen but are not saved.</div>}
      <p className="tagline">
        Every account&apos;s next payment, soonest first. Mark each one paid to keep your plan and
        totals up to date.
      </p>

      {!loading && debts.length > 0 && (
        <div className="stat" style={{ marginBottom: 16, maxWidth: 280 }}>
          <div className="label">Total owed across all accounts</div>
          <div className="value">{format(totalOwed, { maximumFractionDigits: 0 })}</div>
        </div>
      )}

      {msg && <p className="note" style={{ color: "var(--success-ink)", fontWeight: 600 }}>{msg}</p>}

      <div className="grid2" style={{ gridTemplateColumns: "1.6fr 1fr" }}>
        <section className="card">
          <div className="gd-row gd-between" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <span className="heading-sm">
              {gridMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </span>
            <div style={{ display: "flex", gap: 6 }}>
              <button type="button" className="link-btn" style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-sm)" }} onClick={() => setMonthOffset((v) => v - 1)}>‹</button>
              <button type="button" className="link-btn" style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-sm)" }} onClick={() => setMonthOffset((v) => v + 1)}>›</button>
            </div>
          </div>
          <div className="cal">
            {WEEKDAY_HEADS.map((w, i) => <div className="cal-h" key={i}>{w}</div>)}
            {gridCells.map((c, i) => {
              const hasDue = c.inMonth && dueDays.has(c.day);
              const isPaid = c.inMonth && paidDays.has(c.day);
              const isToday = c.inMonth && c.day === todayMarker;
              const cls = ["cal-cell"];
              if (hasDue) cls.push("has-due");
              else if (isPaid) cls.push("is-paid");
              if (isToday) cls.push("is-today");
              return (
                <div key={i} className={cls.join(" ")} style={{ opacity: c.inMonth ? 1 : 0.35 }}>
                  {c.day}
                  {(hasDue || isPaid) && <span className="cal-dot" />}
                </div>
              );
            })}
          </div>
          <div className="cal-legend">
            <div className="cal-legend-item"><span className="cal-dot" style={{ position: "static", color: "var(--warning-ink)" }} /> <span className="caption muted">Payment due</span></div>
            <div className="cal-legend-item"><span className="cal-dot" style={{ position: "static", color: "var(--success-ink)" }} /> <span className="caption muted">Paid</span></div>
          </div>
        </section>

        <section className="card">
          <div className="heading-sm" style={{ marginBottom: 10 }}>Recent transactions</div>
          {recentPayments.length === 0 ? (
            <p className="note">No payments recorded yet.</p>
          ) : (
            recentPayments.map((p, i) => (
              <div className="timeline-item" key={p.id ?? i}>
                <div>
                  <div className="body-sm">{byId.get(p.accountId)?.creditor || p.accountId}</div>
                  <div className="caption muted">{fmt(p.paidOn)}</div>
                </div>
                <span className="figure">{format(p.amount, { maximumFractionDigits: 0 })}</span>
              </div>
            ))
          )}
        </section>
      </div>

      <section className="card">
        <div className="heading-sm" style={{ marginBottom: 10 }}>Upcoming</div>
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
