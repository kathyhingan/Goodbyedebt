/**
 * Profit First split math. Pure functions, no storage, no ledger.
 *
 * Scope rule (product decision, Kathy): this is a calculator, like the debt
 * payoff calculator. Income in, recommendation out. It never reads, writes, or
 * compares anything against a member's transactions. Whether someone actually
 * followed the split is a human judgment the app cannot see, so the app does
 * not pretend to check it.
 *
 * Default split is the locked one from Kathy's own cashflow system:
 * Tax 10, Profit 5, Owner's Pay 30, OpEx 55. Members can edit the percentages.
 *
 * "Profit" is the label, always. It is the owner's own money (savings or
 * investments), never operations, never debt, never household spending.
 */

export interface SplitBucket {
  key: string;
  label: string;
  percent: number;
  /** One line explaining what the bucket is for. */
  note: string;
}

export const DEFAULT_SPLIT: SplitBucket[] = [
  {
    key: "tax",
    label: "Tax",
    percent: 10,
    note: "Set aside for tax and hold it until the bill is due.",
  },
  {
    key: "profit",
    label: "Profit",
    percent: 5,
    note: "Yours to keep: savings or investments. Not operations, not debt, not household.",
  },
  {
    key: "owners-pay",
    label: "Owner's Pay",
    percent: 30,
    note: "Your own pay, the money you live on.",
  },
  {
    key: "opex",
    label: "OpEx",
    percent: 55,
    note: "Everything it costs to run the business.",
  },
];

export interface SplitLine {
  key: string;
  label: string;
  percent: number;
  amount: number;
}

export interface SplitResult {
  lines: SplitLine[];
  /** Sum of the bucket amounts. */
  allocated: number;
  /**
   * Income the percentages did not assign. Zero on a split that adds up to
   * 100 percent; a positive number is the honest answer to a split that does
   * not, and the UI says so rather than quietly rescaling.
   */
  unallocated: number;
  totalPercent: number;
}

/**
 * Digits out of a typed field, minus signs included. Stripping non-numeric
 * characters would turn a typed "-500" into 500, so a leading minus is caught
 * before the strip and read as "not a usable number" (a minus sign is never
 * meant as a positive amount here).
 */
function numericInput(v: string | number): number {
  if (typeof v === "number") return Number.isFinite(v) ? v : NaN;
  const s = String(v).trim();
  if (s.startsWith("-")) return NaN;
  return parseFloat(s.replace(/[^0-9.]/g, ""));
}

/** Clamp to the 0 to 100 band and round to 2 decimals (display unit is percent). */
export function parsePercent(v: string | number): number {
  const n = numericInput(v);
  if (!Number.isFinite(n) || n <= 0) return 0;
  return Math.min(100, Math.round(n * 100) / 100);
}

/** Money typed by a member, as a number. Anything unparseable is 0. */
export function parseAmount(v: string | number): number {
  const n = numericInput(v);
  if (!Number.isFinite(n) || n <= 0) return 0;
  return Math.round(n * 100) / 100;
}

export function percentTotal(buckets: Pick<SplitBucket, "percent">[]): number {
  return Math.round(buckets.reduce((s, b) => s + (Number.isFinite(b.percent) ? b.percent : 0), 0) * 100) / 100;
}

/** True when the percentages assign every peso: they add up to exactly 100. */
export function splitIsComplete(buckets: Pick<SplitBucket, "percent">[]): boolean {
  return percentTotal(buckets) === 100;
}

/**
 * Split an income amount across buckets.
 *
 * Works in centavos and hands out the rounding remainder by largest fractional
 * part, so the bucket amounts always add back up to the amount actually
 * allocated. No bucket drifts a centavo off the number the member is reading.
 */
export function profitFirstSplit(
  income: number,
  buckets: Pick<SplitBucket, "key" | "label" | "percent">[]
): SplitResult {
  const totalPercent = percentTotal(buckets);
  const cents = Math.round(parseAmount(income) * 100);

  const empty: SplitLine[] = buckets.map((b) => ({
    key: b.key,
    label: b.label,
    percent: Number.isFinite(b.percent) ? b.percent : 0,
    amount: 0,
  }));

  if (cents <= 0 || totalPercent <= 0) {
    return { lines: empty, allocated: 0, unallocated: 0, totalPercent };
  }

  // The pool is the share of income the buckets actually claim.
  const pool = Math.round((cents * totalPercent) / 100);
  const raw = buckets.map((b) => (pool * (Number.isFinite(b.percent) ? b.percent : 0)) / totalPercent);
  const floors = raw.map((r) => Math.floor(r));
  let left = pool - floors.reduce((s, f) => s + f, 0);

  // Largest fractional part first; ties fall to the earlier bucket so the
  // result is stable for the same input.
  const order = raw
    .map((r, i) => ({ i, frac: r - Math.floor(r) }))
    .sort((a, b) => b.frac - a.frac || a.i - b.i);
  for (const { i } of order) {
    if (left <= 0) break;
    floors[i] += 1;
    left -= 1;
  }

  const lines = buckets.map((b, i) => ({
    key: b.key,
    label: b.label,
    percent: Number.isFinite(b.percent) ? b.percent : 0,
    amount: floors[i] / 100,
  }));
  const allocated = Math.round(lines.reduce((s, l) => s + l.amount, 0) * 100) / 100;

  return {
    lines,
    allocated,
    unallocated: Math.round((cents - pool) / 100 * 100) / 100,
    totalPercent,
  };
}
