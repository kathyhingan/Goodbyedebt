"use client";

/**
 * Profit First split calculator (member tool, client-side).
 *
 * Kathy's scope rule: input an income amount, get the split recommendation.
 * That is the whole job. This component has no data layer at all: it does not
 * import the debts or payments providers, it never reads a transaction, and it
 * never writes one. Nothing typed here is saved anywhere, which is exactly why
 * a member can play with the numbers freely.
 *
 * Default split is 10 / 5 / 30 / 55 (Tax / Profit / Owner's Pay / OpEx), the
 * locked split from Kathy's own cashflow system. Every percentage is editable
 * so a member can run their own split. The 5 percent bucket is labelled
 * "Profit" and never "DOT".
 */

import { useMemo, useState } from "react";
import { useCurrency } from "@/lib/currency/currency";
import {
  DEFAULT_SPLIT,
  parseAmount,
  parsePercent,
  percentTotal,
  profitFirstSplit,
  splitIsComplete,
  type SplitBucket,
} from "@/lib/tools/profitFirst";

const PRESET = DEFAULT_SPLIT.map((b) => b.percent);

export default function ProfitFirstCalculator() {
  const { format } = useCurrency();
  const [income, setIncome] = useState("50000");
  const [percents, setPercents] = useState<string[]>(PRESET.map(String));

  const buckets: Pick<SplitBucket, "key" | "label" | "percent">[] = useMemo(
    () =>
      DEFAULT_SPLIT.map((b, i) => ({
        key: b.key,
        label: b.label,
        percent: parsePercent(percents[i] ?? ""),
      })),
    [percents]
  );

  const incomeN = parseAmount(income);
  const total = percentTotal(buckets);
  const complete = splitIsComplete(buckets);
  const result = useMemo(() => profitFirstSplit(incomeN, buckets), [incomeN, buckets]);

  const money = (n: number) => format(n, { maximumFractionDigits: 2 });
  const amountOf = (key: string) => result.lines.find((l) => l.key === key)?.amount ?? 0;
  const hasIncome = incomeN > 0;

  const setPercent = (i: number, v: string) =>
    setPercents((prev) => prev.map((p, j) => (j === i ? v : p)));

  // Split bar: proportional to the percentages, so an incomplete split shows
  // its own gap instead of a bar that always fills the row.
  const barSegments = [
    { key: "tax", color: "var(--primary)" },
    { key: "profit", color: "var(--primary-strong)" },
    { key: "owners-pay", color: "var(--success)" },
    { key: "opex", color: "var(--accent)" },
  ];

  return (
    <section className="card" aria-label="Profit First split calculator">
      <div className="heading-md" style={{ marginBottom: 4 }}>
        Profit First split
      </div>
      <p className="note" style={{ marginTop: 0 }}>
        Type an income amount and it tells you how to split it. Nothing here is saved, and it
        never touches your transactions.
      </p>

      <div className="controls" style={{ marginTop: 16, alignItems: "flex-end" }}>
        <div style={{ flex: "1 1 240px" }}>
          <label htmlFor="pf-income">Income received</label>
          <input
            id="pf-income"
            type="text"
            inputMode="decimal"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
            aria-label="Income amount to split"
            style={{ width: "100%", fontFamily: "var(--font-fig)" }}
          />
        </div>
        <div className="note" style={{ paddingBottom: 10 }}>
          {hasIncome ? money(incomeN) : "Enter an amount"}
        </div>
      </div>

      <div
        className="controls"
        style={{ justifyContent: "space-between", alignItems: "baseline", marginTop: 4 }}
      >
        <div className="label">Your split</div>
        <div className="note">
          Total{" "}
          <strong
            className="figure-cell"
            style={{ color: complete ? "var(--success-ink)" : "var(--danger-ink)" }}
          >
            {total}%
          </strong>
          {!complete && (
            <button
              type="button"
              className="link-btn"
              onClick={() => setPercents(PRESET.map(String))}
              style={{ marginLeft: 8 }}
            >
              Reset to {PRESET.join(" / ")}
            </button>
          )}
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Bucket</th>
            <th style={{ width: 90 }}>Percent</th>
            <th style={{ width: 130 }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {DEFAULT_SPLIT.map((b, i) => (
            <tr key={b.key}>
              <td>
                <strong>{b.label}</strong>
                <span className="note" style={{ display: "block" }}>
                  {b.note}
                </span>
              </td>
              <td>
                <input
                  type="text"
                  inputMode="numeric"
                  value={percents[i] ?? ""}
                  onChange={(e) => setPercent(i, e.target.value)}
                  aria-label={`${b.label} percent of the split`}
                  style={{ width: 72, fontFamily: "var(--font-fig)", textAlign: "right" }}
                />
              </td>
              <td className="figure-cell">{hasIncome ? money(amountOf(b.key)) : "0"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {hasIncome && (
        <>
          <div className="stackbar" style={{ marginTop: 14, background: "var(--surface-sunken)" }}>
            {barSegments.map((s) => {
              const pct = buckets.find((b) => b.key === s.key)?.percent ?? 0;
              if (pct <= 0) return null;
              return (
                <span
                  key={s.key}
                  style={{ width: `${pct}%`, background: s.color, display: "block", height: "100%" }}
                />
              );
            })}
          </div>
          <div className="legend-row">
            {DEFAULT_SPLIT.map((b, i) => (
              <span className="it" key={b.key}>
                <span className="sw" style={{ background: barSegments[i].color }} />
                {b.label} {parsePercent(percents[i] ?? "")}%
              </span>
            ))}
          </div>
        </>
      )}

      {hasIncome && !complete && (
        <p className="warn" style={{ marginTop: 14 }}>
          Your percentages add up to {total}%, so {money(result.unallocated)} of this income is
          not assigned to a bucket yet.
        </p>
      )}

      {hasIncome && complete && (
        <p className="note" style={{ marginTop: 14 }}>
          Every peso assigned: {DEFAULT_SPLIT.map((b) => money(amountOf(b.key))).join(" / ")}.
        </p>
      )}

      <div className="assumption">
        <strong>Recommendation only.</strong> This calculator does not read your transactions, and
        nothing you type is saved. Whether a split was actually followed is something only you can
        see, so the app never claims to check it.
      </div>
    </section>
  );
}
