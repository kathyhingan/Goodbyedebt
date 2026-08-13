import type { Debt } from "../engine/types";

export interface UpcomingDue {
  accountId: string;
  creditor: string;
  dueDate: string; // ISO yyyy-mm-dd of the next occurrence
  daysUntil: number;
  minimumPayment: number;
}

/** Parse an ISO yyyy-mm-dd as a local date (no timezone shift). */
function parseISO(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

function toISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function daysBetween(from: Date, to: Date): number {
  const ms = to.getTime() - from.getTime();
  return Math.round(ms / 86_400_000);
}

/**
 * Returns the next occurrence of a debt's monthly due date on or after `today`.
 * A stored due date of e.g. the 15th recurs monthly; day-of-month is clamped
 * to the target month's length (e.g. 31 -> 28/29/30).
 */
export function nextDueDate(dueDate: string, today: Date): Date {
  const anchor = parseISO(dueDate);
  const dom = anchor.getDate();
  const candidate = clampedDate(today.getFullYear(), today.getMonth(), dom);
  if (daysBetween(startOfDay(today), candidate) >= 0) return candidate;
  return clampedDate(today.getFullYear(), today.getMonth() + 1, dom);
}

function clampedDate(year: number, month: number, day: number): Date {
  const lastDay = new Date(year, month + 1, 0).getDate();
  return new Date(year, month, Math.min(day, lastDay));
}

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

/** Sorted list of upcoming due dates within `horizonDays` (default 45). */
export function upcomingDueDates(
  debts: Debt[],
  today: Date = new Date(),
  horizonDays = 45
): UpcomingDue[] {
  const t0 = startOfDay(today);
  const out: UpcomingDue[] = [];
  for (const d of debts) {
    if (!d.dueDate) continue;
    const next = nextDueDate(d.dueDate, t0);
    const daysUntil = daysBetween(t0, next);
    if (daysUntil <= horizonDays) {
      out.push({
        accountId: d.accountId,
        creditor: d.creditor,
        dueDate: toISO(next),
        daysUntil,
        minimumPayment: d.minimumPayment,
      });
    }
  }
  return out.sort((a, b) => a.daysUntil - b.daysUntil);
}

export interface StatementRefresh {
  accountId: string;
  creditor: string;
  /** ISO date of the most recent statement close that hasn't been updated. */
  statementDate: string;
}

/** The most recent monthly statement-close date on or before `today`. */
export function mostRecentStatementDate(billingDate: string, today: Date): Date {
  const dom = parseISO(billingDate).getDate();
  const thisMonth = clampedDate(today.getFullYear(), today.getMonth(), dom);
  if (daysBetween(startOfDay(today), thisMonth) <= 0) return thisMonth; // already passed
  return clampedDate(today.getFullYear(), today.getMonth() - 1, dom);
}

/**
 * Returns debts whose latest statement has closed (by billingDate) but whose
 * data hasn't been updated since — i.e. the user should upload a fresh
 * statement of account to keep the plan accurate. Fully-paid debts are skipped.
 */
export function statementsNeedingRefresh(
  debts: Debt[],
  today: Date = new Date()
): StatementRefresh[] {
  const t0 = startOfDay(today);
  const out: StatementRefresh[] = [];
  for (const d of debts) {
    if (!d.billingDate || d.balance <= 0) continue;
    const recent = mostRecentStatementDate(d.billingDate, t0);
    const updated = d.lastUpdated ? startOfDay(parseISO(d.lastUpdated.slice(0, 10))) : null;
    if (!updated || daysBetween(updated, recent) > 0) {
      out.push({ accountId: d.accountId, creditor: d.creditor, statementDate: toISO(recent) });
    }
  }
  return out.sort((a, b) => (a.statementDate < b.statementDate ? 1 : -1));
}

/**
 * Given lead-day preferences (e.g. [5, 1]), returns the debts whose next due
 * date is exactly `leadDay` days away today — i.e. a reminder should fire.
 */
export function dueForReminder(
  debts: Debt[],
  leadDays: number[],
  today: Date = new Date()
): UpcomingDue[] {
  const set = new Set(leadDays);
  return upcomingDueDates(debts, today, Math.max(0, ...leadDays, 0)).filter((u) =>
    set.has(u.daysUntil)
  );
}
