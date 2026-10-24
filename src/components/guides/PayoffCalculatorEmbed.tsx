"use client";

/**
 * In-guide debt payoff calculator (signup-gated, client-side).
 *
 * Kathy's rule: readers must sign up to use it. Server render and anonymous
 * visitors get the signup gate; only a confirmed session flips the embed to
 * the calculator, and the flip happens client-side after the auth check.
 *
 * Runs the real Goodbye Debt projection engine (src/lib/engine) on editable
 * example debts so a signed-in reader can see avalanche vs snowball on numbers
 * like theirs without leaving the article. This is a sandbox: nothing is saved.
 * A saved plan on the reader's real debts starts in the app's free plan.
 *
 * Rates are entered the way Philippine lenders quote them (percent per
 * MONTH, e.g. 3 for a BSP-capped credit card) and converted to APR for the
 * engine (x12). Amounts are pesos.
 */

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  compareToMinimumsOnly,
  prioritize,
  type Debt,
  type Strategy,
} from "@/lib/engine";

interface RowState {
  creditor: string;
  balance: string;
  monthlyRate: string;
  minPayment: string;
}

const DEFAULT_ROWS: RowState[] = [
  { creditor: "Tala loan", balance: "8000", monthlyRate: "11.5", minPayment: "2600" },
  { creditor: "BDO credit card", balance: "45000", monthlyRate: "3", minPayment: "1350" },
  { creditor: "SSS salary loan", balance: "20000", monthlyRate: "1", minPayment: "1200" },
];

const MAX_ROWS = 5;
const MAX_MONTHS_DISPLAY = 600;

function toNumber(v: string): number {
  const n = parseFloat(String(v).replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

function toDebt(row: RowState, i: number): Debt {
  return {
    accountId: `debt-${i}`,
    creditor: row.creditor.trim() || `Debt ${i + 1}`,
    balance: toNumber(row.balance),
    apr: toNumber(row.monthlyRate) * 12,
    minimumPayment: toNumber(row.minPayment),
    debtType: "other",
  };
}

function pesos(n: number): string {
  return "\u20B1" + Math.round(n).toLocaleString("en-PH");
}

function monthsLabel(m: number): string {
  if (m >= MAX_MONTHS_DISPLAY) return "600+ months";
  const yrs = Math.floor(m / 12);
  const rem = m % 12;
  if (yrs === 0) return `${m} month${m === 1 ? "" : "s"}`;
  return `${yrs} yr${yrs === 1 ? "" : "s"} ${rem} mo`;
}

interface StrategyResult {
  name: string;
  order: string[];
  months: number;
  interest: number;
  unpayable: boolean;
  interestSaved: number;
  monthsSaved: number;
  comparable: boolean;
}

function runStrategy(debts: Debt[], strategy: Strategy, extra: number): StrategyResult {
  const cmp = compareToMinimumsOnly(debts, strategy, {
    monthlyExtra: extra,
    startDate: new Date("2026-11-01"),
  });
  return {
    name: strategy.name === "avalanche" ? "Avalanche" : "Snowball",
    order: prioritize(debts, strategy),
    months: cmp.plan.monthsToDebtFree,
    interest: cmp.plan.totalInterestPaid,
    unpayable: cmp.plan.unpayable,
    interestSaved: cmp.interestSaved,
    monthsSaved: cmp.monthsSaved,
    comparable: cmp.comparable,
  };
}

export default function PayoffCalculatorEmbed({ slug = "which-debt-to-pay-off-first" }: { slug?: string }) {
  const [rows, setRows] = useState<RowState[]>(DEFAULT_ROWS);
  const [extra, setExtra] = useState("2000");
  // Gated by default so the static prerender ships the gate, never the
  // calculator. Only a verified signed-in session unlocks it.
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    let cancelled = false;
    (async () => {
      try {
        const { data } = await createClient().auth.getUser();
        if (!cancelled && data.user) setUnlocked(true);
      } catch {
        /* any auth failure stays gated */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const debts = useMemo(
    () => rows.map((r, i) => toDebt(r, i)).filter((d) => d.balance > 0),
    [rows]
  );

  const results = useMemo(() => {
    if (debts.length === 0) return null;
    const extraN = Math.round(toNumber(extra));
    return {
      avalanche: runStrategy(debts, { name: "avalanche" }, extraN),
      snowball: runStrategy(debts, { name: "snowball" }, extraN),
      extra: extraN,
    };
  }, [debts, extra]);

  const nameOf = (id: string) => debts.find((d) => d.accountId === id)?.creditor ?? id;

  function updateRow(i: number, field: keyof RowState, value: string) {
    setRows((prev) => prev.map((r, j) => (j === i ? { ...r, [field]: value } : r)));
  }

  return (
    <div className="gd-calc" aria-label="Debt payoff calculator">
      <style
        dangerouslySetInnerHTML={{
          __html: `
.gd-calc{margin:26px 0 34px; border:1px solid var(--line); border-left:4px solid var(--green-bright); border-radius:14px; background:var(--panel2); padding:22px;}
.gd-calc .calc-kicker{font-family:'JetBrains Mono',monospace; font-size:11px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:var(--gold); margin-bottom:6px;}
.gd-calc .calc-title{font-weight:800; font-size:17px; color:var(--text); margin:0 0 6px;}
.gd-calc .calc-sub{font-size:13.5px; line-height:1.6; color:var(--muted); margin:0 0 18px;}
.gd-calc .calc-rows{display:flex; flex-direction:column; gap:10px; margin-bottom:14px;}
.gd-calc .calc-row{display:grid; grid-template-columns: 1.4fr 1fr 1fr 1fr 30px; gap:8px; align-items:center;}
.gd-calc .calc-row.head{display:none;}
@media(min-width:640px){.gd-calc .calc-row.head{display:grid; font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:1px; text-transform:uppercase; color:var(--gold); font-weight:700;}}
.gd-calc input{width:100%; background:var(--panel); border:1px solid var(--line); border-radius:8px; color:var(--text); font-size:14px; padding:9px 10px; font-family:'Inter',sans-serif;}
.gd-calc input:focus{outline:none; border-color:var(--green-bright);}
.gd-calc .calc-x{background:none; border:none; color:var(--muted); font-size:16px; cursor:pointer; padding:4px; line-height:1;}
.gd-calc .calc-x:hover{color:var(--red);}
.gd-calc .calc-add{background:none; border:1px dashed var(--line); color:var(--muted); font-size:13px; border-radius:8px; padding:8px 12px; cursor:pointer; margin-bottom:16px;}
.gd-calc .calc-add:hover{color:var(--text); border-color:var(--green-bright);}
.gd-calc .calc-extra{display:flex; align-items:center; gap:10px; margin-bottom:20px; font-size:14px; color:var(--text);}
.gd-calc .calc-extra input{max-width:140px;}
.gd-calc table{width:100%; border-collapse:collapse; font-size:13.5px; margin-bottom:10px;}
.gd-calc th{font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:0.5px; text-transform:uppercase; color:var(--gold); text-align:left; padding:8px 10px; border-bottom:1px solid var(--line);}
.gd-calc td{padding:10px; border-bottom:1px solid var(--line); color:#d8d3c5; vertical-align:top; line-height:1.5;}
.gd-calc tr:last-child td{border-bottom:none;}
.gd-calc .calc-method{font-weight:800; color:var(--text); white-space:nowrap;}
.gd-calc .calc-order{display:block; font-size:12.5px; color:var(--muted); margin-top:2px;}
.gd-calc .calc-strong{color:var(--green-bright); font-weight:700;}
.gd-calc .calc-note{font-size:12.5px; line-height:1.6; color:var(--muted); margin:10px 0 0;}
.gd-calc .calc-warn{color:var(--red); font-weight:600;}
.gd-calc .calc-cta{display:inline-block; margin-top:18px; background:var(--green); color:#fff; font-weight:800; font-size:13.5px; padding:12px 20px; border-radius:100px; letter-spacing:0.3px;}
.gd-calc .calc-cta:hover{transform:scale(1.03);}
.gd-calc .calc-disclaimer{font-size:11.5px; color:var(--muted); margin-top:14px; line-height:1.5;}
.gd-calc .calc-gate-cta{display:inline-block; margin-top:16px; background:var(--green); color:#fff; font-weight:800; font-size:13.5px; padding:12px 20px; border-radius:100px; letter-spacing:0.3px; text-decoration:none;}
.gd-calc .calc-gate-cta:hover{transform:scale(1.03);}
.gd-calc .calc-gate-cta + .calc-disclaimer a, .gd-calc .calc-disclaimer a{color:var(--green-bright);}
@media(max-width:639px){
  .gd-calc .calc-row{grid-template-columns:1fr 1fr; }
  .gd-calc .calc-row .calc-cred{grid-column:1 / -1;}
  .gd-calc .calc-row .calc-del{display:none;}
  .gd-calc table{font-size:12.5px;}
  .gd-calc th, .gd-calc td{padding:7px 6px;}
}
`,
        }}
      />
      {unlocked ? (
        <>
      <div className="calc-kicker">Try it right here</div>
      <p className="calc-title">See both orders on your own numbers</p>
      <p className="calc-sub">
        The rows below are the example debts from this article, editable. Type your
        own balances and monthly rates, add your extra budget, and the calculator
        runs both methods with the same engine that powers the app.
      </p>

      <div className="calc-rows">
        <div className="calc-row head" aria-hidden="true">
          <span>Creditor</span>
          <span>Balance</span>
          <span>Rate %/mo</span>
          <span>Min payment</span>
          <span></span>
        </div>
        {rows.map((row, i) => (
          <div className="calc-row" key={i}>
            <input
              className="calc-cred"
              type="text"
              value={row.creditor}
              onChange={(e) => updateRow(i, "creditor", e.target.value)}
              aria-label={`Debt ${i + 1} name`}
            />
            <input
              type="text"
              inputMode="numeric"
              value={row.balance}
              onChange={(e) => updateRow(i, "balance", e.target.value)}
              aria-label={`Debt ${i + 1} balance in pesos`}
            />
            <input
              type="text"
              inputMode="decimal"
              value={row.monthlyRate}
              onChange={(e) => updateRow(i, "monthlyRate", e.target.value)}
              aria-label={`Debt ${i + 1} monthly interest rate percent`}
            />
            <input
              type="text"
              inputMode="numeric"
              value={row.minPayment}
              onChange={(e) => updateRow(i, "minPayment", e.target.value)}
              aria-label={`Debt ${i + 1} minimum monthly payment`}
            />
            <button
              className="calc-del calc-x"
              type="button"
              onClick={() => setRows((prev) => prev.filter((_, j) => j !== i))}
              aria-label={`Remove debt ${i + 1}`}
            >
              &times;
            </button>
          </div>
        ))}
      </div>
      {rows.length < MAX_ROWS ? (
        <button
          className="calc-add"
          type="button"
          onClick={() =>
            setRows((prev) => [
              ...prev,
              { creditor: "", balance: "", monthlyRate: "", minPayment: "" },
            ])
          }
        >
          + Add a debt
        </button>
      ) : null}

      <div className="calc-extra">
        <label htmlFor="gd-calc-extra">Extra per month</label>
        <input
          id="gd-calc-extra"
          type="text"
          inputMode="numeric"
          value={extra}
          onChange={(e) => setExtra(e.target.value)}
        />
        <span style={{ color: "var(--muted)", fontSize: 13 }}>on top of the minimums</span>
      </div>

      {results ? (
        <table>
          <thead>
            <tr>
              <th>Method</th>
              <th>Debt-free in</th>
              <th>Total interest</th>
            </tr>
          </thead>
          <tbody>
            {[results.avalanche, results.snowball].map((r) => (
              <tr key={r.name}>
                <td>
                  <span className="calc-method">{r.name}</span>
                  <span className="calc-order">
                    Order: {r.order.map(nameOf).join(" \u2192 ")}
                  </span>
                </td>
                <td>
                  {r.unpayable ? (
                    <span className="calc-warn">Minimums never clear this</span>
                  ) : (
                    monthsLabel(r.months)
                  )}
                </td>
                <td>{r.unpayable ? <span className="calc-warn">No payoff</span> : pesos(r.interest)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="calc-note">Enter at least one balance to see results.</p>
      )}

      {results && !results.avalanche.unpayable && results.extra > 0 && results.avalanche.comparable ? (
        <p className="calc-note">
          Your extra {pesos(results.extra)}/month saves{" "}
          <span className="calc-strong">{pesos(results.avalanche.interestSaved)}</span> in
          interest and{" "}
          <span className="calc-strong">{monthsLabel(results.avalanche.monthsSaved)}</span>{" "}
          versus paying minimums only (avalanche).
        </p>
      ) : null}
      {results && (results.avalanche.unpayable || results.snowball.unpayable) ? (
        <p className="calc-note calc-warn">
          With these minimums the balances grow faster than you pay them down. Raise a
          minimum or add budget until the table shows real dates.
        </p>
      ) : null}

      <a className="calc-cta" href="/dashboard">
        Open your plan in the app &rarr;
      </a>

      <p className="calc-disclaimer">
        Illustration only: the calculator uses the numbers you type and the standard
        monthly interest math, not your actual statements. Nothing you enter here is
        saved or sent anywhere. Your rates may differ; check your own loan terms.
      </p>
        </>
      ) : (
        <div>
          <div className="calc-kicker">For Debt Slayers</div>
          <p className="calc-title">Create a free account to run the calculator</p>
          <p className="calc-sub">
            The payoff calculator runs on the same engine as the app, on numbers you
            type in. It lives inside your free Goodbye Debt account: sign up, add your
            real debts, and see your full plan, your exact debt-free date, and what
            every extra peso saves you.
          </p>
          <a
            className="calc-gate-cta"
            href={`/login?mode=signup&utm_source=blog&utm_medium=payoff-calculator&utm_campaign=${slug}`}
          >
            Create my free account &rarr;
          </a>
          <p className="calc-disclaimer">
            Free forever for the first 100 founding members. Already have an account?{" "}
            <a href="/login">Sign in</a> and the calculator unlocks on this page.
          </p>
        </div>
      )}
    </div>
  );
}
