"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { projectPayoff, accruedBalance } from "@/lib/engine";
import type { Debt } from "@/lib/engine/types";
import { listDebtsForClient, listPaymentsForClient, type ClientPayment } from "@/lib/data/coach";
import { formatDuration, formatMonthYear } from "@/lib/format/duration";

const money = (n: number) => `$${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

export default function CoachClientDetailPage() {
  const params = useParams<{ clientId: string }>();
  const clientId = params.clientId;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [payments, setPayments] = useState<ClientPayment[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const [d, p] = await Promise.all([
        listDebtsForClient(supabase, clientId),
        listPaymentsForClient(supabase, clientId),
      ]);
      setDebts(d);
      setPayments(p);
    } catch (e) {
      setError(
        e && typeof e === "object" && "message" in e && typeof (e as { message: unknown }).message === "string"
          ? (e as { message: string }).message
          : "Couldn't load this client. You may no longer be connected to them."
      );
    } finally {
      setLoading(false);
    }
  }, [clientId]);

  useEffect(() => {
    void load();
  }, [load]);

  // Same "carry balances forward to today" step /plan uses, so the coach
  // sees exactly the numbers the client sees on their own dashboard.
  const asOfToday = debts.map((d) => ({ ...d, balance: accruedBalance(d) }));
  const totalBalance = asOfToday.reduce((s, d) => s + Math.max(0, d.balance), 0);
  const plan = asOfToday.length > 0 ? projectPayoff(asOfToday, { name: "avalanche" }, { monthlyExtra: 0 }) : null;

  return (
    <main className="container">
      <p className="note" style={{ marginBottom: 4 }}>
        <Link href="/coach">&larr; Back to your clients</Link>
      </p>
      <div className="brand">
        <h1>
          Client plan <span className="pill">read-only</span>
        </h1>
      </div>
      <p className="tagline">You&apos;re viewing their numbers exactly as they see them. Nothing here is editable.</p>

      {loading && <p className="note">Loading...</p>}
      {error && <p className="warn">{error}</p>}

      {!loading && !error && (
        <>
          <section className="card">
            <div className="stat-grid">
              <div className="stat">
                <div className="label">Total balance</div>
                <div className="value">{money(totalBalance)}</div>
              </div>
              <div className="stat">
                <div className="label">Debts</div>
                <div className="value">{debts.length}</div>
              </div>
            </div>
            {plan && !plan.unpayable && (
              <p className="note" style={{ marginTop: 12 }}>
                At current minimums, avalanche order: debt-free in{" "}
                <strong>{formatDuration(plan.monthsToDebtFree)}</strong>, around{" "}
                <strong>{formatMonthYear(plan.debtFreeDate)}</strong>.
              </p>
            )}
            {plan?.unpayable && (
              <p className="warn" style={{ marginTop: 12 }}>
                At least one debt&apos;s minimum payment doesn&apos;t cover its monthly interest.
              </p>
            )}
          </section>

          <section className="card">
            <h2 style={{ marginTop: 0, fontSize: "1.05rem" }}>Debts</h2>
            {asOfToday.length === 0 ? (
              <p className="note">No debts on file yet.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Creditor</th>
                    <th>Balance</th>
                    <th>APR</th>
                    <th>Min. payment</th>
                  </tr>
                </thead>
                <tbody>
                  {asOfToday.map((d) => (
                    <tr key={d.accountId}>
                      <td>{d.creditor || d.accountId}</td>
                      <td>{money(d.balance)}</td>
                      <td>{d.apr}%</td>
                      <td>{money(d.minimumPayment)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>

          <section className="card">
            <h2 style={{ marginTop: 0, fontSize: "1.05rem" }}>Recent payments</h2>
            {payments.length === 0 ? (
              <p className="note">No payments recorded yet.</p>
            ) : (
              payments.slice(0, 10).map((p, i) => (
                <div key={i} className="timeline-item">
                  <div>
                    {p.accountId}
                    {p.note ? ` — ${p.note}` : ""}
                  </div>
                  <div>
                    {money(p.amount)} <span className="muted">{p.paidOn}</span>
                  </div>
                </div>
              ))
            )}
          </section>
        </>
      )}
    </main>
  );
}
