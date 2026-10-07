export * from "./types";
export { prioritize, effectiveApr } from "./strategies";
export {
  projectPayoff,
  compareToMinimumsOnly,
  accruedBalance,
  amortizeDebt,
  type ProjectionOptions,
  type SavingsComparison,
  type AmortizationRow,
  type AmortizationSchedule,
} from "./projection";
export {
  perDebtProgress,
  onTimeStreakMonths,
  onTimeMonthsThisYear,
  paidThisYear,
  paidLastYear,
  detectCurrentMilestones,
  interestShortfalls,
  MILESTONE_THRESHOLDS,
  STREAK_THRESHOLDS,
  type DebtProgress,
  type DetectedMilestone,
  type InterestShortfall,
} from "./progress";
