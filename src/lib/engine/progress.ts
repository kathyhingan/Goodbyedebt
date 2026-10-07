import type { Debt } from "./types";
import type { Payment } from "../data/payments";

/**
 * Progress math shared across the Member Dashboard ring, the Plan page's
 * per-debt "paid" column, and milestone detection.
 *
 * There's no stored "original balance" per debt (only current balance), so
 * per-debt progress is derived from logged payments: a debt's "paid" amount
 * is the sum of payments recorded against it, and percent paid is
 * paid / (paid + currentBalance). This is honest about what the app actually
 * knows — a debt added with no payments logged yet reads as 0% paid, even if
 * the person had already paid some of it down before using the app. It's the
 * same convention the portfolio-wide leaderboard % uses (originalTotalDebt vs
 * currentTotalDebt), just applied per-debt using payment history instead of a
 * stored baseline.
 */

export interface DebtProgress {
  accountId: string;
  paidAmount: number;
  percentPaid: number; // 0-100, one decimal
}

export function perDebtProgress(debts: Debt[], payments: Payment[]): DebtProgress[] {
  const paidByAccount = new Map<string, number>();
  for (const p of payments) {
    paidByAccount.set(p.accountId, (paidByAccount.get(p.accountId) ?? 0) + Math.max(0, p.amount));
  }
  return debts.map((d) => {
    const paid = paidByAccount.get(d.accountId) ?? 0;
    const denom = paid + Math.max(0, d.balance);
    const pct = denom > 0 ? (paid / denom) * 100 : 0;
    return { accountId: d.accountId, paidAmount: paid, percentPaid: Math.max(0, Math.min(100, Math.round(pct * 10) / 10)) };
  });
}

/** yyyy-MM key for grouping payments by calendar month. */
function monthKey(iso: string): string {
  return iso.slice(0, 7);
}

/**
 * Portfolio-level "on-time" streak: a simplification documented up front —
 * this checks whether total payments made in a month covered total minimums
 * due that month across CURRENT debts, not whether each individual payment
 * landed before its specific due date. It's a sufficiency streak, not a
 * true per-cycle on-time tracker (the app doesn't link payments to specific
 * billing cycles). Counts consecutive months back from the most recently
 * completed month.
 */
export function onTimeStreakMonths(debts: Debt[], payments: Payment[], asOf: Date = new Date()): number {
  const totalMinimums = debts.reduce((s, d) => s + Math.max(0, d.minimumPayment), 0);
  if (totalMinimums <= 0) return 0;
  const byMonth = new Map<string, number>();
  for (const p of payments) {
    const k = monthKey(p.paidOn);
    byMonth.set(k, (byMonth.get(k) ?? 0) + Math.max(0, p.amount));
  }
  let streak = 0;
  // Start from last month (the most recent fully-elapsed month), not the
  // current partial month, so a mid-month check doesn't falsely break a streak.
  const cursor = new Date(asOf.getFullYear(), asOf.getMonth() - 1, 1);
  for (let i = 0; i < 60; i++) {
    const key = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}`;
    const paid = byMonth.get(key) ?? 0;
    if (paid + 0.01 < totalMinimums) break;
    streak++;
    cursor.setMonth(cursor.getMonth() - 1);
  }
  return streak;
}

/** Sum of payments within the current calendar year (local time). */
export function paidThisYear(payments: Payment[], asOf: Date = new Date()): number {
  const y = String(asOf.getFullYear());
  return payments.filter((p) => p.paidOn.startsWith(y)).reduce((s, p) => s + Math.max(0, p.amount), 0);
}

/** Sum of payments within the prior calendar year — null if there's none on
 * record yet, so callers can skip a misleading "+X%" comparison. */
export function paidLastYear(payments: Payment[], asOf: Date = new Date()): number | null {
  const y = String(asOf.getFullYear() - 1);
  const rows = payments.filter((p) => p.paidOn.startsWith(y));
  if (rows.length === 0) return null;
  return rows.reduce((s, p) => s + Math.max(0, p.amount), 0);
}

/** Same sufficiency definition as onTimeStreakMonths, counted across this
 * calendar year's fully-elapsed months instead of a consecutive streak —
 * "10/10" meaning minimums were covered in 10 of the 10 months so far. */
export function onTimeMonthsThisYear(
  debts: Debt[],
  payments: Payment[],
  asOf: Date = new Date()
): { met: number; total: number } {
  const totalMinimums = debts.reduce((s, d) => s + Math.max(0, d.minimumPayment), 0);
  const byMonth = new Map<string, number>();
  for (const p of payments) {
    byMonth.set(monthKey(p.paidOn), (byMonth.get(monthKey(p.paidOn)) ?? 0) + Math.max(0, p.amount));
  }
  const year = asOf.getFullYear();
  const lastCompleteMonth = asOf.getMonth(); // 0-indexed current month -> months Jan..(current-1) are "complete"
  let met = 0;
  let total = 0;
  if (totalMinimums <= 0) return { met: 0, total: 0 };
  for (let m = 0; m < lastCompleteMonth; m++) {
    total++;
    const key = `${year}-${String(m + 1).padStart(2, "0")}`;
    if ((byMonth.get(key) ?? 0) + 0.01 >= totalMinimums) met++;
  }
  return { met, total };
}

export const MILESTONE_THRESHOLDS = [25, 50, 75, 100] as const;
export const STREAK_THRESHOLDS = [3, 6, 9, 12, 18, 24] as const;

export interface InterestShortfall {
  accountId: string;
  /** This debt's own monthly interest at its current balance and APR. */
  monthlyInterest: number;
  minimumPayment: number;
  /** monthlyInterest - minimumPayment; always positive when this debt is listed. */
  shortfall: number;
}

/**
 * Debts whose OWN minimum payment doesn't cover their OWN monthly interest
 * at today's balance. This is usually the exact, debt-level cause behind
 * projectPayoff's blanket `unpayable` flag — but not the only possible one:
 * a plan can also hit the 1200-month cap just from being extremely slow
 * (every minimum covers its own interest, but only barely, so the balance
 * shrinks at a crawl). Callers should check for that case separately rather
 * than assume an empty result here means the plan isn't actually unpayable.
 * When this IS the cause, it gives numbers a person can act on directly —
 * which account, what its real interest is, what the shortfall is — instead
 * of a vague "at least one minimum doesn't cover its interest."
 */
export function interestShortfalls(debts: Debt[]): InterestShortfall[] {
  return debts
    .map((d) => {
      const monthlyInterest = Math.round(Math.max(0, d.balance) * (d.apr / 100 / 12) * 100) / 100;
      const minimumPayment = Math.max(0, d.minimumPayment);
      return {
        accountId: d.accountId,
        monthlyInterest,
        minimumPayment,
        shortfall: Math.round((monthlyInterest - minimumPayment) * 100) / 100,
      };
    })
    .filter((x) => x.shortfall > 0.005)
    .sort((a, b) => b.shortfall - a.shortfall);
}

export type DetectedMilestone =
  | { kind: "debt_threshold"; accountId: string; threshold: number }
  | { kind: "streak"; threshold: number };

/** Which debt-threshold and streak milestones are currently true, for the
 * caller to persist (record_milestone RPC) the first time each is seen. */
export function detectCurrentMilestones(debts: Debt[], payments: Payment[]): DetectedMilestone[] {
  const out: DetectedMilestone[] = [];
  const progress = perDebtProgress(debts, payments);
  for (const p of progress) {
    for (const t of MILESTONE_THRESHOLDS) {
      if (p.percentPaid >= t) out.push({ kind: "debt_threshold", accountId: p.accountId, threshold: t });
    }
  }
  const streak = onTimeStreakMonths(debts, payments);
  for (const t of STREAK_THRESHOLDS) {
    if (streak >= t) out.push({ kind: "streak", threshold: t });
  }
  return out;
}
