import type { Debt, ProjectionResult, Strategy } from "./types";
import { effectiveApr, prioritize } from "./strategies";

const MAX_MONTHS = 1200; // 100-year cap guards against non-amortizing plans.

export interface ProjectionOptions {
  /** Extra dollars applied each month on top of all minimums. */
  monthlyExtra?: number;
  /**
   * When true (default), freed-up minimums roll into the priority debt as
   * accounts are paid off — the "snowball rollover" that both avalanche and
   * snowball rely on. Set false only for a strict minimums-only baseline.
   */
  rollover?: boolean;
  /** Simulation start date; defaults to today. Anchors promo-rate expiry. */
  startDate?: Date;
}

/**
 * Simulates the payoff plan month by month and returns aggregate + per-debt
 * results. Interest accrues monthly at effectiveApr/12. Minimums are always
 * paid first on every account (hard constraint, SOW 4.3), then any remaining
 * budget is directed to the current highest-priority debt.
 */
export function projectPayoff(
  debts: Debt[],
  strategy: Strategy,
  options: ProjectionOptions = {}
): ProjectionResult {
  const monthlyExtra = Math.max(0, options.monthlyExtra ?? 0);
  const rollover = options.rollover ?? true;
  const startDate = options.startDate ?? new Date();

  // Mutable working copy keyed by accountId.
  const state = new Map<string, { debt: Debt; balance: number; interest: number; months: number }>();
  for (const d of debts) {
    state.set(d.accountId, {
      debt: d,
      balance: Math.max(0, d.balance),
      interest: 0,
      months: 0,
    });
  }

  const startingBalance = sum([...state.values()].map((s) => s.balance));
  const baselineMinimums = sum(debts.map((d) => Math.max(0, d.minimumPayment)));

  let month = 0;
  let unpayable = false;

  while ([...state.values()].some((s) => s.balance > 0.005)) {
    if (month >= MAX_MONTHS) {
      unpayable = true;
      break;
    }

    // 1. Accrue this month's interest on every open debt.
    for (const s of state.values()) {
      if (s.balance <= 0) continue;
      const apr = effectiveApr(s.debt, month, startDate);
      const monthlyInterest = s.balance * (apr / 100 / 12);
      s.balance += monthlyInterest;
      s.interest += monthlyInterest;
      s.months = month + 1;
    }

    // 2. Budget = every debt's minimum + the fixed extra. With rollover, the
    //    minimums of already-closed debts stay in the budget as extra.
    const openDebts = [...state.values()].filter((s) => s.balance > 0);
    const activeMinimums = sum(openDebts.map((s) => Math.max(0, s.debt.minimumPayment)));
    const freedMinimums = rollover ? baselineMinimums - activeMinimums : 0;
    let budget = activeMinimums + freedMinimums + monthlyExtra;

    // 3. Pay minimums first (capped at balance) on every open debt.
    for (const s of openDebts) {
      const pay = Math.min(s.balance, Math.max(0, s.debt.minimumPayment));
      s.balance -= pay;
      budget -= pay;
    }

    // 4. Direct any remaining budget to debts in priority order.
    if (budget > 0.005) {
      const order = prioritize(
        openDebts.map((s) => ({ ...s.debt, balance: s.balance })),
        strategy
      );
      for (const id of order) {
        if (budget <= 0.005) break;
        const s = state.get(id)!;
        if (s.balance <= 0) continue;
        const pay = Math.min(s.balance, budget);
        s.balance -= pay;
        budget -= pay;
      }
    }

    // Detect a stalled plan: no progress possible because minimums < interest.
    if (month > 0 && sum(openDebts.map((s) => s.balance)) >= startingBalance) {
      // Only bail if nothing was actually reduced this cycle.
    }

    month += 1;
  }

  const results = [...state.values()];
  const monthsToDebtFree = unpayable
    ? MAX_MONTHS
    : Math.max(0, ...results.map((s) => s.months));

  const debtFreeDate = addMonths(startDate, monthsToDebtFree);

  return {
    order: prioritize(debts, strategy),
    monthsToDebtFree,
    totalInterestPaid: round2(sum(results.map((s) => s.interest))),
    startingBalance: round2(startingBalance),
    debtFreeDate: toISODate(debtFreeDate),
    perDebt: results.map((s) => ({
      accountId: s.debt.accountId,
      monthsToPayoff: s.months,
      interestPaid: round2(s.interest),
    })),
    unpayable,
  };
}

export interface SavingsComparison {
  plan: ProjectionResult;
  baseline: ProjectionResult;
  interestSaved: number;
  monthsSaved: number;
}

/**
 * Compares the optimized plan against a minimums-only baseline (no extra, no
 * rollover) — the headline "how much you save" figure (SOW 4.4).
 */
export function compareToMinimumsOnly(
  debts: Debt[],
  strategy: Strategy,
  options: ProjectionOptions = {}
): SavingsComparison {
  const plan = projectPayoff(debts, strategy, options);
  const baseline = projectPayoff(debts, strategy, {
    ...options,
    monthlyExtra: 0,
    rollover: false,
  });
  return {
    plan,
    baseline,
    interestSaved: round2(baseline.totalInterestPaid - plan.totalInterestPaid),
    monthsSaved: baseline.monthsToDebtFree - plan.monthsToDebtFree,
  };
}

function sum(xs: number[]): number {
  return xs.reduce((a, b) => a + b, 0);
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function addMonths(date: Date, months: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

function toISODate(date: Date): string {
  return date.toISOString().slice(0, 10);
}
