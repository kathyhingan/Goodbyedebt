import type { Debt, Strategy } from "./types";

/**
 * Returns the effective APR for a debt at a given month offset, honoring an
 * active promotional rate until it expires. `monthOffset` is months from the
 * simulation start; `startDate` anchors the calendar.
 */
export function effectiveApr(
  debt: Debt,
  monthOffset: number,
  startDate: Date
): number {
  if (debt.promoRate == null || !debt.promoExpiry) return debt.apr;
  const asOf = new Date(startDate);
  asOf.setMonth(asOf.getMonth() + monthOffset);
  const expiry = new Date(debt.promoExpiry + "T00:00:00");
  return asOf < expiry ? debt.promoRate : debt.apr;
}

/**
 * Ranks debts into a payoff priority order (highest priority first) for the
 * given strategy. Pure and deterministic; ties break by accountId so the order
 * is stable across recalculations (SOW 4.2).
 */
export function prioritize(debts: Debt[], strategy: Strategy): string[] {
  const active = debts.filter((d) => d.balance > 0);
  const byId = (a: Debt, b: Debt) => a.accountId.localeCompare(b.accountId);

  if (strategy.name === "avalanche") {
    return [...active]
      .sort((a, b) => b.apr - a.apr || byId(a, b))
      .map((d) => d.accountId);
  }

  if (strategy.name === "snowball") {
    return [...active]
      .sort((a, b) => a.balance - b.balance || byId(a, b))
      .map((d) => d.accountId);
  }

  // Hybrid: blend a normalized APR score (higher = more urgent) with a
  // normalized inverse-balance score (smaller balance = more urgent).
  const w = clamp01(strategy.interestWeight ?? 0.5);
  const aprs = active.map((d) => d.apr);
  const bals = active.map((d) => d.balance);
  const maxApr = Math.max(...aprs, 1);
  const maxBal = Math.max(...bals, 1);

  return [...active]
    .map((d) => {
      const aprScore = d.apr / maxApr; // 0..1, higher = pay first
      const balScore = 1 - d.balance / maxBal; // 0..1, smaller balance = pay first
      const score = w * aprScore + (1 - w) * balScore;
      return { id: d.accountId, score, d };
    })
    .sort((a, b) => b.score - a.score || byId(a.d, b.d))
    .map((x) => x.id);
}

function clamp01(n: number): number {
  if (Number.isNaN(n)) return 0.5;
  return Math.min(1, Math.max(0, n));
}
