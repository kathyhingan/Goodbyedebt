/**
 * Core data model for the Debt Payoff Optimization engine.
 * See SOW sections 4.1 (Debt Input) and 4.2 (Prioritization Engine).
 */

export type DebtType =
  | "credit_card"
  | "personal_loan"
  | "auto_loan"
  | "student_loan"
  | "bnpl"
  | "other";

export interface Debt {
  /**
   * Unique, user-assigned Account ID / nickname. This is the matching key for
   * CSV re-upload consolidation (SOW 4.1) — NOT the creditor name.
   */
  accountId: string;
  creditor: string;
  /** Current outstanding balance, in dollars. */
  balance: number;
  /** Nominal annual interest rate, as a percentage (e.g. 19.99 for 19.99%). */
  apr: number;
  /** Contractual minimum payment per cycle, in dollars. */
  minimumPayment: number;
  /** Payment due date (ISO yyyy-mm-dd). */
  dueDate?: string;
  /** Statement/billing close date (ISO yyyy-mm-dd). */
  billingDate?: string;
  debtType: DebtType;
  /** Optional promotional/intro APR (percentage). */
  promoRate?: number;
  /** ISO yyyy-mm-dd after which promoRate no longer applies. */
  promoExpiry?: string;
  /** ISO timestamp of last balance/data update — surfaced in UI (SOW 9). */
  lastUpdated?: string;
}

export type StrategyName = "avalanche" | "snowball" | "hybrid";

export interface Strategy {
  name: StrategyName;
  /**
   * Hybrid weighting, 0..1. Only used when name === "hybrid".
   * 1 = fully interest-minimizing (avalanche-like),
   * 0 = fully balance-minimizing (snowball-like).
   */
  interestWeight?: number;
}

export interface PerDebtResult {
  accountId: string;
  monthsToPayoff: number;
  interestPaid: number;
}

export interface ProjectionResult {
  /** Ordered priority list (accountIds) the extra dollars target, best first. */
  order: string[];
  /** Months until every debt is fully paid. */
  monthsToDebtFree: number;
  /** Total interest paid across all debts over the plan. */
  totalInterestPaid: number;
  /** Sum of all starting balances. */
  startingBalance: number;
  /** ISO yyyy-mm-dd projected debt-free date (from `startDate`). */
  debtFreeDate: string;
  perDebt: PerDebtResult[];
  /**
   * True when at least one debt's minimum payment does not cover its monthly
   * interest, so the plan cannot amortize within the iteration cap.
   */
  unpayable: boolean;
}
