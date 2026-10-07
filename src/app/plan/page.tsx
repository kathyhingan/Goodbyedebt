"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { StrategyName } from "@/lib/engine";
import { projectPayoff, compareToMinimumsOnly, accruedBalance, perDebtProgress, interestShortfalls } from "@/lib/engine";
import { useDebts } from "@/lib/data/useDebts";
import { usePayments } from "@/lib/data/usePayments";
import { useCurrency } from "@/lib/currency/currency";
import { formatDuration, formatMonthYear } from "@/lib/format/duration";

const STRATEGIES: { name: StrategyName; label: string }[] = [
  { name: "avalanche", label: "Avalanche" },
  { name: "snowball", label: "Snowball" },
  { name: "hybrid", label: "Hybrid" },
];

/** "Jun 2026" projected payoff date for a debt, from months-from-today. */
function payoffMonthLabel(monthsFromNow: number): string {
  const d = new Date();
  d.setDate(1);
  d.setMonth(d.getMonth() + Math.round(monthsFromNow));
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export default function PlanPage() {
  const { debts, loading, demo } = useDebts();
  const { payments } = usePayments();
  const { format } = useCurrency();
  const money = (n: number) => format(n, { maximumFractionDigits: 0 });
  // Pending control values (what the user is editing).
  const [strategy, setStrategy] = useState<StrategyName>("avalanche");
  const [extra, setExtra] = useState(0);
  const [weight, setWeight] = useState(0.5);

  // Applied snapshot the plan is actually computed from. Clicking "Apply"
  // commits the pending values, so the recalculation is explicit.
  const [applied, setApplied] = useState<{ strategy: StrategyName; extra: number; weight: number }>({
    strategy: "avalanche",
    extra: 0,
    weight: 0.5,
  });

  const dirty =
    applied.strategy !== strategy || applied.extra !== extra || applied.weight !== weight;

  // Balances carried forward to today: interest keeps compounding monthly
  // (APR/12) on top of whatever was last saved, so the plan doesn't understate
  // what's owed just because no new statement or payment has landed this month.
  const asOfToday = useMemo(
    () => debts.map((d) => ({ ...d, balance: accruedBalance(d) })),
    [debts]
  );

  const plan = useMemo(
    () =>
      projectPayoff(
        asOfToday,
        { name: applied.strategy, interestWeight: applied.weight },
        { monthlyExtra: applied.extra }
      ),
    [asOfToday, applied]
  );
  const savings = useMemo(
    () =>
      compareToMinimumsOnly(
        asOfToday,
        { name: applied.strategy, interestWeight: applied.weight },
        { monthlyExtra: applied.extra }
      ),
    [asOfToday, applied]
  );
  const byId = useMemo(() => new Map(asOfToday.map((d) => [d.accountId, d])), [asOfToday]);
  const shortfalls = useMemo(() => interestShortfalls(asOfToday), [asOfToday]);
  const progressByAccount = useMemo(
    () => new Map(perDebtProgress(asOfToday, payments).map((p) => [p.accountId, p])),
    [asOfToday, payments]
  );
  const totalMinimums = useMemo(
    () => debts.reduce((s, d) => s + Math.max(0, d.minimumPayment), 0),
    [debts]
  );
  // The honest "pay only each shrinking minimum, keep the freed cash" scenario,
  // so the rollover assumption behind the headline is transparent.
  const minimumsOnly = useMemo(
    () => projectPayoff(asOfToday, { name: "avalanche" }, { monthlyExtra: 0, rollover: false }),
    [asOfToday]
  );

  // Side-by-side comparison of the strategies at the applied extra payment, so
  // the user can see which actually saves the most (or that they're close).
  const comparison = useMemo(() => {
    const rows = STRATEGIES.map((s) => ({
      ...s,
      result: projectPayoff(
        asOfToday,
        { name: s.name, interestWeight: applied.weight },
        { monthlyExtra: applied.extra }
      ),
    }));
    const payable = rows.filter((r) => !r.result.unpayable);
    const bestInterest = payable.length ? Math.min(...payable.map((r) => r.result.totalInterestPaid)) : null;
    return { rows, bestInterest };
  }, [asOfToday, applied]);

  return (
    <main className="container" style={{ maxWidth: 1040 }}>
      <div className="brand">
        <h1>Your payoff plan</h1>
      </div>
      <p className="tagline">Ordered by what saves you the most — every extra dollar, sequenced.</p>

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
            <div className="gd-row gd-between" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 14 }}>
              <div className="seg" role="group" aria-label="Strategy">
                {STRATEGIES.map((s) => (
                  <button
                    key={s.name}
                    type="button"
                    className={`seg-opt ${strategy === s.name ? "is-active" : ""}`}
                    onClick={() => setStrategy(s.name)}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
              <div className="controls" style={{ margin: 0 }}>
                <div>
                  <label htmlFor="extra">Extra / month</label>
                  <input id="extra" type="number" min={0} step={25} value={extra}
                    onChange={(e) => setExtra(Math.max(0, Number(e.target.value)))} style={{ width: 110 }} />
                </div>
                <div style={{ alignSelf: "end" }}>
                  <button type="button" className="primary" onClick={() => setApplied({ strategy, extra, weight })} disabled={!dirty}>
                    {dirty ? "Apply" : "✓ Applied"}
                  </button>
                </div>
              </div>
            </div>
            {strategy === "hybrid" && (
              <div style={{ marginBottom: 14 }}>
                <label htmlFor="weight">Interest ↔ speed ({weight.toFixed(2)})</label>
                <input id="weight" type="range" min={0} max={1} step={0.05} value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))} style={{ width: "100%", maxWidth: 320 }} />
              </div>
            )}
            {dirty && (
              <p className="note" style={{ marginTop: -4, marginBottom: 14 }}>
                You changed the {applied.strategy !== strategy ? "strategy" : "inputs"} — click <strong>Apply</strong> to recalculate the plan.
              </p>
            )}

            {plan.unpayable ? (
              <div className="payoff-hero warn-hero">
                <div className="payoff-lead">Debt-free date can&apos;t be reached</div>
                <div className="payoff-sub">
                  {shortfalls.length > 0 ? (
                    <>
                      At today&apos;s balance, {shortfalls.length === 1 ? "this debt's minimum doesn't" : "these debts' minimums don't"} cover
                      {" "}{shortfalls.length === 1 ? "its own" : "their own"} monthly interest, so the balance grows no matter how the extra
                      {" "}is directed — raise the minimum or add enough extra to close the gap below.
                    </>
                  ) : (
                    <>
                      Every minimum covers its own interest, but barely — at this extra payment it would take over
                      100 years to clear. Increase your monthly extra to see a realistic payoff timeline.
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid-3" style={{ marginBottom: 20 }}>
                <div className="card tight" style={{ margin: 0 }}>
                  <div className="caption muted">Total remaining</div>
                  <div className="figure-lg">{money(plan.startingBalance)}</div>
                </div>
                <div className="card tight" style={{ margin: 0 }}>
                  <div className="caption muted">Interest saved vs. minimums</div>
                  <div className="figure-lg">{money(savings.interestSaved)}</div>
                </div>
                <div className="card tight" style={{ margin: 0 }}>
                  <div className="caption muted">Projected debt-free</div>
                  <div className="figure-lg">{formatMonthYear(plan.debtFreeDate)}</div>
                </div>
              </div>
            )}

            {/* Ranked payoff list — rank badge, % paid bar, rate, balance */}
            {plan.order.map((id, i) => {
              const d = byId.get(id);
              if (!d) return null;
              const prog = progressByAccount.get(id);
              return (
                <div className="planrow" key={id}>
                  <span className={`rank ${i === 0 ? "next" : ""}`}>{i + 1}</span>
                  <div style={{ minWidth: 0 }}>
                    <div className="body" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {d.creditor || d.accountId}
                      {d.dueDate && <span className="caption muted" style={{ marginLeft: 8 }}>due {d.dueDate}</span>}
                    </div>
                    <div className="progress-track" style={{ marginTop: 6 }}>
                      <div className="progress-fill primary" style={{ width: `${prog?.percentPaid ?? 0}%` }} />
                    </div>
                  </div>
                  <span className="body-sm muted plan-rate">{d.apr}%</span>
                  <span className="figure">{money(d.balance)}</span>
                  <span className="body-sm muted" style={{ textAlign: "right" }}>{prog?.percentPaid ?? 0}%</span>
                </div>
              );
            })}
            {plan.unpayable && shortfalls.length > 0 && (
              <div style={{ marginTop: 4 }}>
                {shortfalls.map((s) => {
                  const d = byId.get(s.accountId);
                  return (
                    <p className="warn" key={s.accountId} style={{ marginTop: 6 }}>
                      ⚠ {d?.creditor || s.accountId}: minimum {money(s.minimumPayment)} vs.{" "}
                      {money(s.monthlyInterest)}/month interest at {d?.apr}% APR — short by{" "}
                      <strong>{money(s.shortfall)}/month</strong>.
                    </p>
                  );
                })}
              </div>
            )}
          </section>

          {!plan.unpayable && (
            <section className="card">
              <h2 style={{ marginTop: 0, fontSize: "1.05rem" }}>Payoff timeline</h2>
              {/* Chronological order — which debt actually clears soonest —
                  not priority-rank order. The avalanche/snowball "order" is
                  where extra dollars go, which isn't necessarily the order
                  debts finish in once rollover redirects freed minimums. */}
              {[...plan.perDebt]
                .sort((a, b) => a.monthsToPayoff - b.monthsToPayoff)
                .map((pd) => {
                  const d = byId.get(pd.accountId);
                  if (!d) return null;
                  const isLast = Math.round(pd.monthsToPayoff) >= Math.round(plan.monthsToDebtFree);
                  const widthPct = Math.max(8, Math.min(100, (pd.monthsToPayoff / Math.max(1, plan.monthsToDebtFree)) * 100));
                  return (
                    <div className="tl-row" key={pd.accountId}>
                      <span className="body-sm" style={{ width: 160, flexShrink: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {d.creditor || d.accountId}
                      </span>
                      <div className={`tl ${isLast ? "is-last" : ""}`} style={{ width: `${widthPct}%` }}>
                        <span>
                          {isLast ? "debt-free " : "paid off "}
                          {payoffMonthLabel(pd.monthsToPayoff)}
                        </span>
                      </div>
                    </div>
                  );
                })}
            </section>
          )}

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
            <div className="assumption">
              <strong>How this timeline is calculated:</strong> it assumes you keep paying{" "}
              <strong>{money(totalMinimums + applied.extra)}/month total</strong> the whole way — as each
              debt clears, its freed-up minimum is rolled into the next debt (plus your {money(applied.extra)}{" "}
              extra). {applied.extra === 0 ? "No extra beyond your minimums is added." : ""}
              {!minimumsOnly.unpayable && (
                <>
                  {" "}If instead you pocket the freed-up cash and only pay each shrinking minimum, it takes{" "}
                  <strong>{formatDuration(minimumsOnly.monthsToDebtFree)}</strong> and{" "}
                  {money(minimumsOnly.totalInterestPaid)} in interest.
                </>
              )}
            </div>
          </section>

          <section className="card">
            <h2 style={{ marginTop: 0, fontSize: "1.1rem" }}>Compare strategies</h2>
            <p className="note">
              Same debts and {money(applied.extra)}/month extra, run under each strategy. Lower total
              interest and an earlier date are better.
              {applied.extra === 0 &&
                " With ₱0 extra the strategies come out nearly identical — add a monthly extra and Apply to see them separate."}
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
                {comparison.rows.map((r, i) => {
                  // Flag only the first (top-ranked) row at the lowest interest,
                  // so ties don't badge multiple strategies.
                  const isLowest =
                    !r.result.unpayable &&
                    comparison.bestInterest != null &&
                    Math.abs(r.result.totalInterestPaid - comparison.bestInterest) < 0.5;
                  const firstLowestIdx = comparison.rows.findIndex(
                    (x) => !x.result.unpayable && comparison.bestInterest != null &&
                      Math.abs(x.result.totalInterestPaid - comparison.bestInterest) < 0.5
                  );
                  const best = isLowest && i === firstLowestIdx;
                  return (
                    <tr key={r.name}>
                      <td>
                        <strong style={{ textTransform: "capitalize" }}>{r.label}</strong>
                        {best && <span className="pill" style={{ marginLeft: 8 }}>Lowest interest</span>}
                      </td>
                      <td>{r.result.unpayable ? "—" : r.result.debtFreeDate}</td>
                      <td>{r.result.unpayable ? "—" : formatDuration(r.result.monthsToDebtFree)}</td>
                      <td style={{ textAlign: "right", fontWeight: best ? 700 : 400, color: best ? "var(--primary)" : undefined }}>
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
        </>
      )}
    </main>
  );
}
