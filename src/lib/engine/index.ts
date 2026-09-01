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
