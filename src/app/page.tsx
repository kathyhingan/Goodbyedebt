"use client";

import { useMemo, useState } from "react";
import type { Debt, StrategyName } from "@/lib/engine";
import { projectPayoff, compareToMinimumsOnly } from "@/lib/engine";

// Demo seed data so the scaffold renders something meaningful out of the box.
// Real data comes from manual entry / CSV upload (SOW 4.1) — wired in later.
const SEED: Debt[] = [
  { accountId: "chase-sapphire", creditor: "Chase Sapphire", balance: 4200, apr: 22.99, minimumPayment: 95, debtType: "credit_card", dueDate: "2026-09-15" },
  { accountId: "amex-blue", creditor: "Amex Blue", balance: 2600, apr: 26.24, minimumPayment: 70, debtType: "credit_card", dueDate: "2026-09-05" },
  { accountId: "sofi-loan", creditor: "SoFi Personal Loan", balance: 9000, apr: 11.5, minimumPayment: 240, debtType: "personal_loan", dueDate: "2026-09-01" },
];

const money = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export default function Home() {
  const [strategy, setStrategy] = useState<StrategyName>("avalanche");
  const [extra, setExtra] = useState(300);
  const [weight, setWeight] = useState(0.5);

  const strat = { name: strategy, interestWeight: weight };

  const plan = useMemo(
    () => projectPayoff(SEED, strat, { monthlyExtra: extra }),
    [strategy, extra, weight]
  );
  const savings = useMemo(
    () => compareToMinimumsOnly(SEED, strat, { monthlyExtra: extra }),
    [strategy, extra, weight]
  );

  const byId = useMemo(() => new Map(SEED.map((d) => [d.accountId, d])), []);

  return (
    <main className="container">
      <div className="brand">
        <h1>Goodbye<span>Debt</span></h1>
      </div>
      <p className="tagline">
        One plan. Every debt. See exactly where each extra dollar should go.
      </p>

      <section className="card">
        <div className="controls">
          <div>
            <label htmlFor="strategy">Strategy</label>
            <select
              id="strategy"
              value={strategy}
              onChange={(e) => setStrategy(e.target.value as StrategyName)}
            >
              <option value="avalanche">Avalanche (lowest interest)</option>
              <option value="snowball">Snowball (quick wins)</option>
              <option value="hybrid">Hybrid (custom)</option>
            </select>
          </div>
          <div>
            <label htmlFor="extra">Extra / month</label>
            <input
              id="extra"
              type="number"
              min={0}
              step={25}
              value={extra}
              onChange={(e) => setExtra(Math.max(0, Number(e.target.value)))}
              style={{ width: 110 }}
            />
          </div>
          {strategy === "hybrid" && (
            <div>
              <label htmlFor="weight">Interest ↔ speed ({weight.toFixed(2)})</label>
              <input
                id="weight"
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
              />
            </div>
          )}
        </div>

        <div className="stat-grid">
          <div className="stat">
            <div className="label">Debt-free date</div>
            <div className="value">{plan.debtFreeDate}</div>
          </div>
          <div className="stat">
            <div className="label">Months to debt-free</div>
            <div className="value">{plan.monthsToDebtFree}</div>
          </div>
          <div className="stat">
            <div className="label">Interest saved vs. minimums</div>
            <div className="value">{money(savings.interestSaved)}</div>
          </div>
          <div className="stat">
            <div className="label">Time saved</div>
            <div className="value">{savings.monthsSaved} mo</div>
          </div>
        </div>
        {plan.unpayable && (
          <p className="warn">
            ⚠ At least one minimum payment doesn&apos;t cover its interest — this plan can&apos;t pay
            off. Increase the extra payment.
          </p>
        )}
      </section>

      <section className="card">
        <h2 style={{ marginTop: 0, fontSize: "1.1rem" }}>This cycle&apos;s plan</h2>
        <table>
          <thead>
            <tr>
              <th>Priority</th>
              <th>Account</th>
              <th>Balance</th>
              <th>APR</th>
              <th>Due</th>
            </tr>
          </thead>
          <tbody>
            {plan.order.map((id, i) => {
              const d = byId.get(id)!;
              return (
                <tr key={id}>
                  <td className={i === 0 ? "priority" : ""}>
                    {i === 0 ? "★ Extra here" : `#${i + 1}`}
                  </td>
                  <td>{d.creditor}</td>
                  <td>{money(d.balance)}</td>
                  <td>{d.apr}%</td>
                  <td>{d.dueDate ?? "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p className="note">
          Pay every minimum on time, then send your {money(extra)} extra to the ★ account. Order
          recalculates automatically as balances and rates change.
        </p>
      </section>

      <p className="note">
        Demo data shown. Manual entry, CSV upload, auth, and notifications are scaffolded next —
        see <code>README.md</code> for the build map against the SOW.
      </p>
    </main>
  );
}
