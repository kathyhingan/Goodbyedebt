"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { StrategyName } from "@/lib/engine";
import { projectPayoff, compareToMinimumsOnly } from "@/lib/engine";
import { useDebts } from "@/lib/data/useDebts";
import { useCurrency } from "@/lib/currency/currency";
import { formatDuration, formatMonthYear } from "@/lib/format/duration";

export default function Home() {
  const { debts, loading, demo } = useDebts();
  const { format } = useCurrency();
  const money = (n: number) => format(n, { maximumFractionDigits: 0 });
  // Pending control values (what the user is editing).
  const [strategy, setStrategy] = useState<StrategyName>("avalanche");
  const [extra, setExtra] = useState(300);
  const [weight, setWeight] = useState(0.5);

  // Applied snapshot the plan is actually computed from. Clicking "Apply"
  // commits the pending values, so the recalculation is explicit.
  const [applied, setApplied] = useState<{ strategy: StrategyName; extra: number; weight: number }>({
    strategy: "avalanche",
    extra: 300,
    weight: 0.5,
  });

  const dirty =
    applied.strategy !== strategy || applied.extra !== extra || applied.weight !== weight;

  const plan = useMemo(
    () =>
      projectPayoff(
        debts,
        { name: applied.strategy, interestWeight: applied.weight },
        { monthlyExtra: applied.extra }
      ),
    [debts, applied]
  );
  const savings = useMemo(
    () =>
      compareToMinimumsOnly(
        debts,
        { name: applied.strategy, interestWeight: applied.weight },
        { monthlyExtra: applied.extra }
      ),
    [debts, applied]
  );
  const byId = useMemo(() => new Map(debts.map((d) => [d.accountId, d])), [debts]);

  // Side-by-side comparison of the strategies at the applied extra payment, so
  // the user can see which actually saves the most (or that they're close).
  const comparison = useMemo(() => {
    const names: { name: StrategyName; label: string }[] = [
      { name: "avalanche", label: "Avalanche" },
      { name: "snowball", label: "Snowball" },
      { name: "hybrid", label: "Hybrid" },
    ];
    const rows = names.map((s) => ({
      ...s,
      result: projectPayoff(
        debts,
        { name: s.name, interestWeight: applied.weight },
        { monthlyExtra: applied.extra }
      ),
    }));
    const payable = rows.filter((r) => !r.result.unpayable);
    const bestInterest = payable.length ? Math.min(...payable.map((r) => r.result.totalInterestPaid)) : null;
    const bestMonths = payable.length ? Math.min(...payable.map((r) => r.result.monthsToDebtFree)) : null;
    return { rows, bestInterest, bestMonths };
  }, [debts, applied]);

  return (
    <main className="container">
      <div className="brand">
        <h1>Goodbye<span>Debt</span></h1>
      </div>
      <p className="tagline">One plan. Every debt. See exactly where each extra dollar should go.</p>

      {demo && (
        <div className="banner">
          Demo mode — showing sample data. Connect the backend (Supabase env vars) to save your
          real debts.
        </div>
      )}

      {loading ? (
        <section className="card"><p className="muted">Loading your plan…</p></section>
      ) : debts.length === 0 ? (
        <section className="card">
          <p>No debts yet. <Link href="/debts">Add your first debt →</Link></p>
        </section>
      ) : (
        <>
          <section className="card">
            <div className="controls">
              <div>
                <label htmlFor="strategy">Strategy</label>
                <select id="strategy" value={strategy} onChange={(e) => setStrategy(e.target.value as StrategyName)}>
                  <option value="avalanche">Avalanche (lowest interest)</option>
                  <option value="snowball">Snowball (quick wins)</option>
                  <option value="hybrid">Hybrid (custom)</option>
                </select>
              </div>
              <div>
                <label htmlFor="extra">Extra / month</label>
                <input id="extra" type="number" min={0} step={25} value={extra}
                  onChange={(e) => setExtra(Math.max(0, Number(e.target.value)))} style={{ width: 110 }} />
              </div>
              {strategy === "hybrid" && (
                <div>
                  <label htmlFor="weight">Interest ↔ speed ({weight.toFixed(2)})</label>
                  <input id="weight" type="range" min={0} max={1} step={0.05} value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))} />
                </div>
              )}
              <div style={{ alignSelf: "end" }}>
                <button type="button" className="primary" onClick={() => setApplied({ strategy, extra, weight })} disabled={!dirty}>
                  {dirty ? "Apply" : "✓ Applied"}
                </button>
              </div>
            </div>
            {dirty && (
              <p className="note" style={{ marginTop: 8 }}>
                You changed the {applied.strategy !== strategy ? "strategy" : "inputs"} — click <strong>Apply</strong> to recalculate the plan.
              </p>
            )}

            {plan.unpayable ? (
              <div className="payoff-hero warn-hero">
                <div className="payoff-lead">Debt-free date can&apos;t be reached</div>
                <div className="payoff-sub">
                  At the current extra payment, at least one balance never clears. Increase your
                  monthly extra to see a payoff timeline.
                </div>
              </div>
            ) : (
              <div className="payoff-hero">
                <div className="payoff-lead">
                  You&apos;ll be debt-free in <strong>{formatDuration(plan.monthsToDebtFree)}</strong>
                </div>
                <div className="payoff-sub">
                  On track to clear every balance by <strong>{formatMonthYear(plan.debtFreeDate)}</strong>
                  {" — "}paying about {money(plan.totalInterestPaid)} in total interest along the way.
                </div>
              </div>
            )}

            <div className="stat-grid">
              <div className="stat"><div className="label">Debt-free date</div><div className="value">{plan.debtFreeDate}</div></div>
              <div className="stat"><div className="label">Months to debt-free</div><div className="value">{plan.monthsToDebtFree}</div></div>
              <div className="stat"><div className="label">Interest saved vs. minimums</div><div className="value">{money(savings.interestSaved)}</div></div>
              <div className="stat"><div className="label">Time saved</div><div className="value">{savings.monthsSaved} mo</div></div>
            </div>
            {plan.unpayable && (
              <p className="warn">⚠ At least one minimum payment doesn&apos;t cover its interest — increase the extra payment.</p>
            )}
          </section>

          <section className="card">
            <h2 style={{ marginTop: 0, fontSize: "1.1rem" }}>Debt totals</h2>
            <div className="stat-grid">
              <div className="stat">
                <div className="label">Total debt owed</div>
                <div className="value">{money(plan.startingBalance)}</div>
              </div>
              <div className="stat">
                <div className="label">Total interest ({applied.strategy})</div>
                <div className="value">{plan.unpayable ? "—" : money(plan.totalInterestPaid)}</div>
              </div>
              <div className="stat">
                <div className="label">Total debt repayment</div>
                <div className="value">
                  {plan.unpayable ? "—" : money(plan.startingBalance + plan.totalInterestPaid)}
                </div>
              </div>
              <div className="stat">
                <div className="label">Accounts</div>
                <div className="value">{debts.length}</div>
              </div>
            </div>
            <p className="note" style={{ marginTop: 10 }}>
              Total repayment = what you owe today ({money(plan.startingBalance)}) plus the interest you&apos;ll
              pay clearing it under the {applied.strategy} plan.
            </p>
          </section>

          <section className="card">
            <h2 style={{ marginTop: 0, fontSize: "1.1rem" }}>Compare strategies</h2>
            <p className="note">
              Same debts and {money(applied.extra)}/month extra, run under each strategy. Lower total
              interest and an earlier date are better.
            </p>
            <table>
              <thead>
                <tr>
                  <th>Strategy</th>
                  <th>Debt-free date</th>
                  <th>Time</th>
                  <th style={{ textAlign: "right" }}>Total interest</th>
                </tr>
              </thead>
              <tbody>
                {comparison.rows.map((r) => {
                  const best =
                    !r.result.unpayable &&
                    comparison.bestInterest != null &&
                    Math.abs(r.result.totalInterestPaid - comparison.bestInterest) < 0.5;
                  return (
                    <tr key={r.name}>
                      <td>
                        <strong style={{ textTransform: "capitalize" }}>{r.label}</strong>
                        {best && <span className="pill" style={{ marginLeft: 8 }}>Lowest interest</span>}
                      </td>
                      <td>{r.result.unpayable ? "—" : r.result.debtFreeDate}</td>
                      <td>{r.result.unpayable ? "—" : formatDuration(r.result.monthsToDebtFree)}</td>
                      <td style={{ textAlign: "right", fontWeight: best ? 700 : 400, color: best ? "var(--moss)" : undefined }}>
                        {r.result.unpayable ? "—" : money(r.result.totalInterestPaid)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <p className="note" style={{ marginTop: 8 }}>
              {(() => {
                const av = comparison.rows.find((r) => r.name === "avalanche")?.result;
                const sn = comparison.rows.find((r) => r.name === "snowball")?.result;
                if (!av || !sn || av.unpayable || sn.unpayable) return "Add an extra payment to compare strategies.";
                const diff = Math.round(sn.totalInterestPaid - av.totalInterestPaid);
                if (Math.abs(diff) < 1) return "At this extra payment the strategies cost the same — increase your monthly extra to see Avalanche pull ahead on interest.";
                return diff > 0
                  ? `Avalanche saves about ${money(diff)} in interest vs. Snowball at this extra payment. Raising your extra widens the gap.`
                  : `Snowball costs about ${money(-diff)} less interest here — unusual, and usually means increasing the extra will favor Avalanche.`;
              })()}
            </p>
          </section>

          <section className="card">
            <h2 style={{ marginTop: 0, fontSize: "1.1rem" }}>
              This cycle&apos;s plan <span className="muted" style={{ fontWeight: 400, fontSize: "0.85rem" }}>· {applied.strategy}</span>
            </h2>
            <table>
              <thead>
                <tr><th>Priority</th><th>Account</th><th>Balance</th><th>APR</th><th>Due</th></tr>
              </thead>
              <tbody>
                {plan.order.map((id, i) => {
                  const d = byId.get(id)!;
                  return (
                    <tr key={id}>
                      <td className={i === 0 ? "priority" : ""}>{i === 0 ? "★ Extra here" : `#${i + 1}`}</td>
                      <td>{d.creditor}</td>
                      <td>{money(d.balance)}</td>
                      <td>{d.apr}%</td>
                      <td>{d.dueDate ?? "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <p className="note">Pay every minimum on time, then send your {money(applied.extra)} extra to the ★ account.</p>
          </section>
        </>
      )}
    </main>
  );
}
