"use client";

import { useEffect, useMemo, useState } from "react";
import { useDebts } from "@/lib/data/useDebts";
import { usePayments } from "@/lib/data/usePayments";
import { useCurrency } from "@/lib/currency/currency";
import { accruedBalance } from "@/lib/engine";
import { addOneMonthISO } from "@/lib/reminders/dueDates";

/**
 * Log a payment / transaction, from anywhere (Dashboard "Log a payment",
 * Calendar "Log a transaction").
 *
 * Handles the case the old Calendar flow didn't: a payment that is NOT the
 * full scheduled payment. The carve-up is explicit —
 *   * the balance always drops by what you actually paid;
 *   * the scheduled due date only advances when the payment covers that
 *     account's minimum, so a partial or extra payment is logged honestly
 *     as a transaction instead of pretending the cycle is settled.
 */
export function LogPaymentModal({
  open,
  onClose,
  defaultAccountId,
}: {
  open: boolean;
  onClose: () => void;
  defaultAccountId?: string;
}) {
  const { debts, save } = useDebts();
  const { add } = usePayments();
  const { format } = useCurrency();

  const [accountId, setAccountId] = useState("");
  const [amount, setAmount] = useState("");
  const [paidOn, setPaidOn] = useState(() => new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  // Today's balances (interest accrued by now), the same basis Calendar uses.
  const byId = useMemo(
    () => new Map(debts.map((d) => [d.accountId, { ...d, balance: accruedBalance(d) }])),
    [debts]
  );

  useEffect(() => {
    if (!open) return;
    setMsg(null);
    setAmount("");
    setNote("");
    setPaidOn(new Date().toISOString().slice(0, 10));
    setAccountId(defaultAccountId ?? debts[0]?.accountId ?? "");
  }, [open, defaultAccountId, debts]);

  const debt = byId.get(accountId);
  const amt = Math.max(0, Number(amount) || 0);
  const coversMinimum = debt ? amt + 0.01 >= debt.minimumPayment : false;

  if (!open) return null;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!debt) return;
    if (amt <= 0) {
      setMsg("Enter an amount greater than 0.");
      return;
    }
    setBusy(true);
    setMsg(null);
    try {
      const newBalance = Math.max(0, debt.balance - amt);
      const nextDue = coversMinimum && debt.dueDate ? addOneMonthISO(debt.dueDate) : debt.dueDate;
      await save({ ...debt, balance: newBalance, dueDate: nextDue, lastUpdated: new Date().toISOString() });
      // The payment log is best-effort — a missing payments table must never
      // block the balance update that already succeeded.
      try {
        await add({ accountId, amount: amt, paidOn, note });
      } catch {
        /* payments table may not exist yet */
      }
      setMsg(
        `Logged ${format(amt)} to ${debt.creditor || accountId}.` +
          (newBalance === 0 ? " 🎉 This debt is cleared!" : ` New balance: ${format(newBalance)}.`)
      );
      setAmount("");
      setNote("");
      setTimeout(onClose, 900);
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Couldn't log that payment.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2 style={{ marginTop: 0, fontSize: "1.15rem" }}>Log a payment</h2>

        {debts.length === 0 ? (
          <p className="note">No debts yet — add one first.</p>
        ) : (
          <form onSubmit={submit}>
            <label htmlFor="lp-account">Debt</label>
            <select
              id="lp-account"
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              style={{ width: "100%", marginBottom: 12 }}
            >
              {debts.map((d) => (
                <option key={d.accountId} value={d.accountId}>
                  {d.creditor || d.accountId}
                </option>
              ))}
            </select>

            <label htmlFor="lp-amount">Amount</label>
            <input
              id="lp-amount"
              type="number"
              min={0}
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              style={{ width: "100%", marginBottom: 6 }}
              autoFocus
            />
            {debt && (
              <div className="row-actions" style={{ marginBottom: 12 }}>
                <button
                  type="button"
                  className="link-btn"
                  style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-sm)" }}
                  onClick={() => setAmount(String(debt.minimumPayment || ""))}
                >
                  Use minimum ({format(debt.minimumPayment, { maximumFractionDigits: 0 })})
                </button>
                <button
                  type="button"
                  className="link-btn"
                  style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-sm)" }}
                  onClick={() => setAmount(String(Math.round(debt.balance * 100) / 100))}
                >
                  Pay off in full
                </button>
              </div>
            )}

            <label htmlFor="lp-date">Date</label>
            <input
              id="lp-date"
              type="date"
              value={paidOn}
              onChange={(e) => setPaidOn(e.target.value)}
              style={{ width: "100%", marginBottom: 12 }}
            />

            <label htmlFor="lp-note">Note (optional)</label>
            <input
              id="lp-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. extra to the priority card"
              style={{ width: "100%", marginBottom: 12 }}
            />

            {debt && amt > 0 && (
              <p className="note" style={{ marginTop: 0 }}>
                {format(debt.balance, { maximumFractionDigits: 0 })} → <strong>{format(Math.max(0, debt.balance - amt), { maximumFractionDigits: 0 })}</strong>
                {" · "}
                {coversMinimum
                  ? "covers the minimum, so the due date moves to the next cycle."
                  : `under the ${format(debt.minimumPayment, { maximumFractionDigits: 0 })} minimum, so it logs as a transaction and the due date stays put.`}
              </p>
            )}

            {msg && <p className="note" style={{ color: "var(--success-ink)", fontWeight: 600 }}>{msg}</p>}

            <div className="row-actions" style={{ marginTop: 14 }}>
              <button type="submit" className="primary" disabled={busy || amt <= 0}>
                {busy ? "Saving…" : "Log payment"}
              </button>
              <button type="button" onClick={onClose} disabled={busy}>
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
