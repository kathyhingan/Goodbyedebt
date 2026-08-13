import type { Debt } from "../engine/types";

/** One extracted field: the parsed value plus the raw source text it came from,
 * so the confirm screen can show the user exactly where each number originated. */
export interface ParsedField<T> {
  value: T | null;
  raw: string | null;
}

export type BankName = "BDO" | "Security Bank" | "Unknown";

export interface ParsedStatement {
  bank: BankName;
  creditor: string;
  accountId: string | null;
  cardMasked: string | null;
  balance: ParsedField<number>; // Total Amount Due
  minimumPayment: ParsedField<number>; // Minimum Amount Due
  /** Annual APR (monthly rate × 12). */
  apr: ParsedField<number>;
  /** The raw monthly rate string, e.g. "3.00%", shown to explain the ×12. */
  aprMonthlyRaw: string | null;
  /** True when APR came from a stated rate that the user should double-check. */
  aprNeedsReview: boolean;
  dueDate: ParsedField<string>; // ISO yyyy-mm-dd — Payment Due Date
  statementDate: ParsedField<string>; // ISO — Statement Date
  creditLimit: ParsedField<number>;
  /** Fields we couldn't find — surfaced so the user knows what to fill in. */
  missing: string[];
}

const MONTHS: Record<string, number> = {
  jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6,
  jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12,
};

/**
 * Parses common PH statement date formats to ISO (no timezone drift):
 *  - "August 3, 2026" / "Aug 28, 2026"  (Month D, YYYY — BDO)
 *  - "24 JUL 2026" / "14 AUG 2026"      (D Mon YYYY — Security Bank)
 */
export function parseStatementDate(input: string): string | null {
  const iso = (y: number, mo: number, d: number) =>
    `${y}-${String(mo).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

  let m = input.match(/([A-Za-z]{3,9})\.?\s+(\d{1,2}),\s*(\d{4})/); // Month D, YYYY
  if (m) {
    const mo = MONTHS[m[1].slice(0, 3).toLowerCase()];
    if (mo) return iso(Number(m[3]), mo, Number(m[2]));
  }
  m = input.match(/(\d{1,2})\s+([A-Za-z]{3,9})\.?\s+(\d{4})/); // D Mon YYYY
  if (m) {
    const mo = MONTHS[m[2].slice(0, 3).toLowerCase()];
    if (mo) return iso(Number(m[3]), mo, Number(m[1]));
  }
  return null;
}

function parseAmount(input: string | undefined | null): number | null {
  if (!input) return null;
  const n = Number(input.replace(/,/g, ""));
  return Number.isFinite(n) ? n : null;
}

function firstMatch(text: string, re: RegExp): string | null {
  const m = text.match(re);
  return m ? m[1] : null;
}

/** Grabs the first 16-digit grouped card number and returns its last 4. */
function cardLast4(text: string): string | null {
  const m = text.match(/(\d{4}-\d{4}-\d{4}-\d{4})/);
  return m ? m[1].replace(/\D/g, "").slice(-4) : null;
}

/** Detects the issuing bank from statement text. Order matters — check the
 * bank-specific brand tokens, not generic phrases like "Statement of Account". */
export function detectBank(text: string): BankName {
  if (/security bank|securitybank|SBMastercard/i.test(text)) return "Security Bank";
  if (/BDO Unibank|bdo\.com\.ph/i.test(text)) return "BDO";
  return "Unknown";
}

function missingList(s: {
  balance: ParsedField<number>;
  minimumPayment: ParsedField<number>;
  apr: ParsedField<number>;
  dueDate: ParsedField<string>;
}): string[] {
  const missing: string[] = [];
  if (s.balance.value == null) missing.push("Total Amount Due (balance)");
  if (s.minimumPayment.value == null) missing.push("Minimum Amount Due");
  if (s.apr.value == null) missing.push("APR / interest rate");
  if (s.dueDate.value == null) missing.push("Payment Due Date");
  return missing;
}

/** BDO Statement of Account (credit / installment card). */
export function parseBdoStatement(text: string): ParsedStatement {
  const totalRaw = firstMatch(text, /Total Amount Due\s*(?:PHP|₱)?\s*([\d,]+\.\d{2})/i);
  const minRaw = firstMatch(text, /Minimum Amount Due\s*(?:PHP|₱)?\s*([\d,]+\.\d{2})/i);
  const monthlyRaw = firstMatch(text, /Interest Rate per Month\s*([\d.]+)\s*%/i);
  const dueRaw = firstMatch(text, /Payment Due Date\s*([A-Za-z]{3,9}\.?\s+\d{1,2},\s*\d{4})/i);
  const stmtRaw = firstMatch(text, /Statement Date\s*([A-Za-z]{3,9}\.?\s+\d{1,2},\s*\d{4})/i);
  const limitRaw = firstMatch(text, /Credit Limit\s*(?:PHP|₱)?\s*([\d,]+(?:\.\d{2})?)/i);

  const monthly = monthlyRaw ? Number(monthlyRaw) : null;
  const apr = monthly != null && Number.isFinite(monthly) ? round3(monthly * 12) : null;
  const last4 = cardLast4(text);

  const s = {
    balance: { value: parseAmount(totalRaw), raw: totalRaw },
    minimumPayment: { value: parseAmount(minRaw), raw: minRaw },
    apr: { value: apr, raw: apr != null ? `${apr}%` : null },
    dueDate: { value: dueRaw ? parseStatementDate(dueRaw) : null, raw: dueRaw },
  };

  return {
    bank: "BDO",
    creditor: /INSTALLMENT CARD/i.test(text) ? "BDO Installment Card" : "BDO Credit Card",
    accountId: last4 ? `bdo-${last4}` : null,
    cardMasked: last4 ? `•••• ${last4}` : null,
    balance: s.balance,
    minimumPayment: s.minimumPayment,
    apr: s.apr,
    aprMonthlyRaw: monthlyRaw ? `${monthlyRaw}%` : null,
    aprNeedsReview: false,
    dueDate: s.dueDate,
    statementDate: { value: stmtRaw ? parseStatementDate(stmtRaw) : null, raw: stmtRaw },
    creditLimit: { value: parseAmount(limitRaw), raw: limitRaw },
    missing: missingList(s),
  };
}

/** Security Bank Statement of Account (Mastercard / Visa credit card). */
export function parseSbcStatement(text: string): ParsedStatement {
  const amt = /\s*(?:PHP|₱)?\s*([\d,]+\.\d{2})/i.source;
  const totalRaw = firstMatch(text, new RegExp(`TOTAL AMOUNT DUE${amt}`, "i"));
  const minRaw = firstMatch(text, new RegExp(`MINIMUM AMOUNT DUE${amt}`, "i"));
  const limitRaw = firstMatch(text, new RegExp(`CREDIT LIMIT${amt}`, "i"));
  const stmtRaw = firstMatch(text, /CUT-OFF STATEMENT DATE\s+(\d{1,2}\s+[A-Za-z]{3}\s+\d{4})/i);
  // The due date value can print either after the label or on the line above it.
  const dueRaw =
    firstMatch(text, /PAYMENT DUE DATE\s+(\d{1,2}\s+[A-Za-z]{3}\s+\d{4})/i) ??
    firstMatch(text, /(\d{1,2}\s+[A-Za-z]{3}\s+\d{4})\s*\n\s*PAYMENT DUE DATE/i);

  // SBC states the rate in prose: "3% per month (or 36% per annum)".
  const rate = text.match(/([\d.]+)%\s*per month\s*\(or\s*([\d.]+)%\s*per annum\)/i);
  const monthlyRaw = rate ? rate[1] : null;
  const apr = rate ? round3(Number(rate[2])) : null;
  const last4 = cardLast4(text);

  const s = {
    balance: { value: parseAmount(totalRaw), raw: totalRaw },
    minimumPayment: { value: parseAmount(minRaw), raw: minRaw },
    apr: { value: apr, raw: apr != null ? `${apr}%` : null },
    dueDate: { value: dueRaw ? parseStatementDate(dueRaw) : null, raw: dueRaw },
  };

  return {
    bank: "Security Bank",
    creditor: "Security Bank Credit Card",
    accountId: last4 ? `sbc-${last4}` : null,
    cardMasked: last4 ? `•••• ${last4}` : null,
    balance: s.balance,
    minimumPayment: s.minimumPayment,
    apr: s.apr,
    aprMonthlyRaw: monthlyRaw ? `${monthlyRaw}%` : null,
    aprNeedsReview: apr != null, // stated-rate; ask the user to confirm
    dueDate: s.dueDate,
    statementDate: { value: stmtRaw ? parseStatementDate(stmtRaw) : null, raw: stmtRaw },
    creditLimit: { value: parseAmount(limitRaw), raw: limitRaw },
    missing: missingList(s),
  };
}

/** Detects the bank and parses the statement accordingly. */
export function parseStatement(text: string): ParsedStatement {
  const bank = detectBank(text);
  if (bank === "BDO") return parseBdoStatement(text);
  if (bank === "Security Bank") return parseSbcStatement(text);
  return {
    bank: "Unknown",
    creditor: "",
    accountId: null,
    cardMasked: null,
    balance: { value: null, raw: null },
    minimumPayment: { value: null, raw: null },
    apr: { value: null, raw: null },
    aprMonthlyRaw: null,
    aprNeedsReview: false,
    dueDate: { value: null, raw: null },
    statementDate: { value: null, raw: null },
    creditLimit: { value: null, raw: null },
    missing: ["Total Amount Due (balance)", "Minimum Amount Due", "APR / interest rate", "Payment Due Date"],
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
