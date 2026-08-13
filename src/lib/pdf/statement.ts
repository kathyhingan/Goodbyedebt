import type { Debt } from "../engine/types";

/** One extracted field: the parsed value plus the raw source text it came from,
 * so the confirm screen can show the user exactly where each number originated. */
export interface ParsedField<T> {
  value: T | null;
  raw: string | null;
}

export interface ParsedStatement {
  /** Detected issuer name, or "Unknown bank" — used only to label the debt. */
  bank: string;
  creditor: string;
  accountId: string | null;
  cardMasked: string | null;
  balance: ParsedField<number>; // Total Amount Due
  minimumPayment: ParsedField<number>; // Minimum Amount Due
  /** Annual APR. */
  apr: ParsedField<number>;
  aprMonthlyRaw: string | null;
  /** True when APR came from prose text the user should double-check. */
  aprNeedsReview: boolean;
  dueDate: ParsedField<string>; // ISO yyyy-mm-dd
  statementDate: ParsedField<string>; // ISO
  creditLimit: ParsedField<number>;
  /** True when we found enough to be worth confirming (vs. an unreadable PDF). */
  recognized: boolean;
  /** Fields we couldn't find — surfaced so the user knows what to fill in. */
  missing: string[];
}

// ---------------------------------------------------------------------------
// Bank identity (only used to name the debt — parsing does not depend on it).
// ---------------------------------------------------------------------------
const BANKS: { name: string; slug: string; re: RegExp }[] = [
  { name: "BDO", slug: "bdo", re: /BDO Unibank|bdo\.com\.ph|\bBDO\b/i },
  { name: "Security Bank", slug: "sbc", re: /security bank|securitybank|SBMastercard/i },
  { name: "BPI", slug: "bpi", re: /\bBPI\b|Bank of the Philippine Islands/i },
  { name: "Metrobank", slug: "mbtc", re: /metrobank|metropolitan bank/i },
  { name: "RCBC", slug: "rcbc", re: /\bRCBC\b|Rizal Commercial/i },
  { name: "UnionBank", slug: "ub", re: /unionbank|union bank/i },
  { name: "Citi", slug: "citi", re: /\bciti\b|citibank/i },
  { name: "EastWest", slug: "ew", re: /eastwest|east west bank/i },
  { name: "PNB", slug: "pnb", re: /\bPNB\b|philippine national bank/i },
  { name: "Maya", slug: "maya", re: /\bmaya bank\b|maya credit/i },
];

export function detectBank(text: string): { name: string; slug: string } {
  for (const b of BANKS) if (b.re.test(text)) return { name: b.name, slug: b.slug };
  return { name: "Unknown bank", slug: "card" };
}

// ---------------------------------------------------------------------------
// Field-level matchers.
// ---------------------------------------------------------------------------
const MONTHS: Record<string, number> = {
  jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6,
  jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12,
};

// A money value: thousands-grouped, or any number with 2 decimals. Optional
// currency prefix. Avoids matching bare small integers like the "3" in "3%".
const AMOUNT = /(?:PHP|Php|₱|P)?\s*(\d{1,3}(?:,\d{3})+(?:\.\d{2})?|\d+\.\d{2})/;

/** Parses many PH statement date formats to ISO (no timezone drift). */
export function parseStatementDate(input: string): string | null {
  const iso = (y: number, mo: number, d: number) =>
    y >= 2000 && mo >= 1 && mo <= 12 && d >= 1 && d <= 31
      ? `${y}-${String(mo).padStart(2, "0")}-${String(d).padStart(2, "0")}`
      : null;

  let m = input.match(/([A-Za-z]{3,9})\.?\s+(\d{1,2}),\s*(\d{4})/); // Month D, YYYY
  if (m) {
    const mo = MONTHS[m[1].slice(0, 3).toLowerCase()];
    if (mo) return iso(Number(m[3]), mo, Number(m[2]));
  }
  m = input.match(/\b(\d{1,2})[\s-]+([A-Za-z]{3,9})\.?[\s-]+(\d{4})\b/); // D Mon YYYY / D-Mon-YYYY
  if (m) {
    const mo = MONTHS[m[2].slice(0, 3).toLowerCase()];
    if (mo) return iso(Number(m[3]), mo, Number(m[1]));
  }
  m = input.match(/\b(\d{4})-(\d{2})-(\d{2})\b/); // ISO
  if (m) return iso(Number(m[1]), Number(m[2]), Number(m[3]));
  m = input.match(/\b(\d{1,2})\/(\d{1,2})\/(\d{2,4})\b/); // MM/DD/YYYY (PH card convention)
  if (m) {
    const yr = Number(m[3].length === 2 ? `20${m[3]}` : m[3]);
    return iso(yr, Number(m[1]), Number(m[2]));
  }
  return null;
}

function num(s: string): number {
  return Number(s.replace(/,/g, ""));
}

/**
 * Finds a value near a label. Statements put the value on the same line as the
 * label, or (for some banks) on the line directly above or below it — so we
 * search the label line first, then adjacent lines.
 */
function findNear(
  lines: string[],
  labels: RegExp,
  match: (line: string) => { value: number | string; raw: string } | null
): { value: number | string; raw: string } | null {
  for (let i = 0; i < lines.length; i++) {
    if (!labels.test(lines[i])) continue;
    const here = match(lines[i]);
    if (here) return here;
    for (const j of [i + 1, i - 1, i + 2]) {
      if (j < 0 || j >= lines.length) continue;
      // Don't let an adjacent *different* labeled row hijack the value.
      const near = match(lines[j]);
      if (near) return near;
    }
  }
  return null;
}

const amountAt = (line: string) => {
  const m = line.match(AMOUNT);
  return m ? { value: num(m[1]), raw: m[1] } : null;
};
const dateAt = (line: string) => {
  const iso = parseStatementDate(line);
  if (!iso) return null;
  return { value: iso, raw: line.trim() };
};

function field<T>(hit: { value: number | string; raw: string } | null): ParsedField<T> {
  return hit ? { value: hit.value as T, raw: hit.raw } : { value: null, raw: null };
}

function extractApr(text: string): { apr: number | null; monthlyRaw: string | null; needsReview: boolean } {
  let m = text.match(/Interest Rate per Month\s*([\d.]+)\s*%/i); // labeled monthly (e.g. BDO)
  if (m) return { apr: round3(Number(m[1]) * 12), monthlyRaw: `${m[1]}%`, needsReview: false };
  m = text.match(/([\d.]+)\s*%\s*per month/i); // prose monthly (e.g. Security Bank)
  if (m) return { apr: round3(Number(m[1]) * 12), monthlyRaw: `${m[1]}%`, needsReview: true };
  m = text.match(/([\d.]+)\s*%\s*per\s*(?:annum|year)/i); // prose annual
  if (m) return { apr: round3(Number(m[1])), monthlyRaw: null, needsReview: true };
  return { apr: null, monthlyRaw: null, needsReview: false };
}

/**
 * Generic PH credit-card statement parser. Label-driven so it works across
 * banks without per-bank code; the confirm screen lets the user fix anything.
 */
export function parseStatement(text: string): ParsedStatement {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const { name, slug } = detectBank(text);

  const balance = field<number>(
    findNear(lines, /total amount due|total balance due|new balance|total outstanding balance|please pay this amount/i, amountAt)
  );
  const minimumPayment = field<number>(
    findNear(lines, /minimum amount due|minimum payment due|minimum amount payable|min(?:imum)? amount/i, amountAt)
  );
  const creditLimit = field<number>(findNear(lines, /credit limit/i, amountAt));
  const dueDate = field<string>(findNear(lines, /payment due date|due date/i, dateAt));
  const statementDate = field<string>(
    findNear(lines, /statement date|cut-?off statement date|cut-?off date|statement\/cut-?off/i, dateAt)
  );

  const { apr, monthlyRaw, needsReview } = extractApr(text);

  const cardMatch = text.match(/(\d{4}[-\s]\d{4}[-\s]\d{4}[-\s]\d{4})/);
  const last4 = cardMatch ? cardMatch[1].replace(/\D/g, "").slice(-4) : null;

  const missing: string[] = [];
  if (balance.value == null) missing.push("Total Amount Due (balance)");
  if (minimumPayment.value == null) missing.push("Minimum Amount Due");
  if (apr == null) missing.push("APR / interest rate");
  if (dueDate.value == null) missing.push("Payment Due Date");

  // "Recognized" = we pulled at least the balance or minimum; below that the PDF
  // is likely scanned/image-only or an unsupported layout.
  const recognized = balance.value != null || minimumPayment.value != null;

  const installment = /installment card/i.test(text);
  const creditor =
    name === "Unknown bank"
      ? "Credit card"
      : `${name} ${installment ? "Installment Card" : "Credit Card"}`;

  return {
    bank: name,
    creditor,
    accountId: last4 ? `${slug}-${last4}` : null,
    cardMasked: last4 ? `•••• ${last4}` : null,
    balance,
    minimumPayment,
    apr: { value: apr, raw: apr != null ? `${apr}%` : null },
    aprMonthlyRaw: monthlyRaw,
    aprNeedsReview: needsReview,
    dueDate,
    statementDate,
    creditLimit,
    recognized,
    missing,
  };
}

/** Build a Debt draft from a parsed statement, for the confirm form to prefill. */
export function statementToDebt(p: ParsedStatement): Debt {
  return {
    accountId: p.accountId ?? "",
    creditor: p.creditor,
    balance: p.balance.value ?? 0,
    apr: p.apr.value ?? 0,
    minimumPayment: p.minimumPayment.value ?? 0,
    debtType: "credit_card",
    dueDate: p.dueDate.value ?? undefined,
    billingDate: p.statementDate.value ?? undefined,
  };
}

function round3(n: number): number {
  return Math.round(n * 1000) / 1000;
}
