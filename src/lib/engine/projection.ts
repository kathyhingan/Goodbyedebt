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

/**
 * The debt's balance projected forward to `asOf`, compounding monthly interest
 * (APR/12, honoring promo-rate expiry) for every full billing month elapsed
 * since `lastUpdated`. This is what lets the running balance keep growing with
 * interest month after month even when the user hasn't recorded a payment or
 * uploaded a new statement — without it, a balance saved from a payment or CSV
 * import would sit flat forever, understating what's actually owed.
 */
export function accruedBalance(debt: Debt, asOf: Date = new Date()): number {
  let balance = Math.max(0, debt.balance);
  if (balance <= 0 || !debt.lastUpdated) return balance;

  const last = new Date(debt.lastUpdated);
  const months = fullMonthsElapsed(last, asOf);
  for (let m = 0; m < months; m++) {
    const apr = effectiveApr(debt, m, last);
    balance += balance * (apr / 100 / 12);
  }
  return round2(balance);
}

/** Number of full calendar months between two dates (0 if `to` is before `from`). */
function fullMonthsElapsed(from: Date, to: Date): number {
  let months =
    (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth());
  if (to.getDate() < from.getDate()) months -= 1;
  return Math.max(0, months);
}

export interface AmortizationRow {
  month: number;
  date: string;
  startingBalance: number;
  interest: number;
  payment: number;
  endingBalance: number;
}

export interface AmortizationSchedule {
  rows: AmortizationRow[];
  totalInterest: number;
  monthsToPayoff: number;
  /** True when the minimum payment never covers a month's interest, so the balance never clears. */
  unpayable: boolean;
}

const AMORTIZATION_CAP = 600; // 50-year cap for a single minimums-only debt.

/**
 * Month-by-month schedule for a single debt paid at its minimum payment only
 * (no extra, no rollover from other debts) — "what happens if I just pay the
 * minimum on this one," from today's accrued balance until it hits zero.
 */
export function amortizeDebt(debt: Debt, asOf: Date = new Date()): AmortizationSchedule {
  let balance = accruedBalance(debt, asOf);
  const rows: AmortizationRow[] = [];
  let totalInterest = 0;
  let unpayable = false;

  let month = 0;
  while (balance > 0.005) {
    if (month >= AMORTIZATION_CAP) {
      unpayable = true;
      break;
    }
    const apr = effectiveApr(debt, month, asOf);
    const interest = balance * (apr / 100 / 12);
    const startingBalance = balance;
    balance += interest;
    const payment = Math.min(balance, Math.max(0, debt.minimumPayment));
    balance -= payment;
    totalInterest += interest;
    month += 1;
    rows.push({
      month,
      date: toISODate(addMonths(asOf, month)),
      startingBalance: round2(startingBalance),
      interest: round2(interest),
      payment: round2(payment),
      endingBalance: round2(balance),
    });
    // A payment that doesn't even cover interest means the balance can never
    // shrink to zero — stop instead of looping to the cap needlessly.
    if (payment <= interest + 0.005 && balance >= startingBalance - 0.005) {
      unpayable = true;
      break;
    }
  }

  return {
    rows,
    totalInterest: round2(totalInterest),
    monthsToPayoff: rows.length,
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
  // When the minimums-only baseline itself can't amortize (some debt's own
  // minimum doesn't cover its own monthly interest), its balance compounds
  // upward for the full 1200-month cap instead of converging, and
  // baseline.totalInterestPaid comes back astronomical (observed: >10^20)
  // rather than a real total. Diffing against that isn't "a big savings
  // number" — it's not a number at all, since minimums alone never pay the
  // debt off in the first place. Report 0 rather than a meaningless diff;
  // callers must check `baseline.unpayable` before treating these as real.
  if (baseline.unpayable) {
    return { plan, baseline, interestSaved: 0, monthsSaved: 0 };
  }
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
