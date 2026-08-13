import type { Debt } from "../engine/types";

/** One extracted field: the parsed value plus the raw source text it came from,
 * so the confirm screen can show the user exactly where each number originated. */
export interface ParsedField<T> {
  value: T | null;
  raw: string | null;
}

export interface ParsedStatement {
  bank: "BDO" | "Unknown";
  creditor: string;
  accountId: string | null;
  cardMasked: string | null;
  balance: ParsedField<number>; // Total Amount Due
  minimumPayment: ParsedField<number>; // Minimum Amount Due
  /** Annual APR (monthly rate × 12). */
  apr: ParsedField<number>;
  /** The raw monthly rate string, e.g. "3.00%", shown to explain the ×12. */
  aprMonthlyRaw: string | null;
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

/** "Aug 28, 2026" / "August 3, 2026" → "2026-08-28" (no timezone drift). */
export function parseStatementDate(input: string): string | null {
  const m = input.match(/([A-Za-z]{3,9})\.?\s+(\d{1,2}),\s*(\d{4})/);
  if (!m) return null;
  const month = MONTHS[m[1].slice(0, 3).toLowerCase()];
  if (!month) return null;
  const day = Number(m[2]);
  const year = Number(m[3]);
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
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

/**
 * Parses the text of a BDO Statement of Account (credit / installment card).
 * Operates on line-reconstructed text (see extractPdfLines) so labels and
 * their values sit on the same line.
 */
export function parseBdoStatement(text: string): ParsedStatement {
  const isBdo = /BDO Unibank|bdo\.com\.ph|BDO Credit Card|Statement of Account/i.test(text);

  const totalRaw = firstMatch(text, /Total Amount Due\s*₱?\s*([\d,]+\.\d{2})/i);
  const minRaw = firstMatch(text, /Minimum Amount Due\s*₱?\s*([\d,]+\.\d{2})/i);
  const monthlyRaw = firstMatch(text, /Interest Rate per Month\s*([\d.]+)\s*%/i);
  const dueRaw = firstMatch(text, /Payment Due Date\s*([A-Za-z]{3,9}\.?\s+\d{1,2},\s*\d{4})/i);
  const stmtRaw = firstMatch(text, /Statement Date\s*([A-Za-z]{3,9}\.?\s+\d{1,2},\s*\d{4})/i);
  const cardRaw = firstMatch(text, /Card Number\s*(\d{4}-\d{4}-\d{4}-\d{4})/i);
  const limitRaw = firstMatch(text, /Credit Limit\s*₱?\s*([\d,]+(?:\.\d{2})?)/i);

  const monthly = monthlyRaw ? Number(monthlyRaw) : null;
  const apr = monthly != null && Number.isFinite(monthly) ? Math.round(monthly * 12 * 1000) / 1000 : null;

  const last4 = cardRaw ? cardRaw.replace(/\D/g, "").slice(-4) : null;
  const cardMasked = cardRaw ? `•••• ${last4}` : null;

  const creditor = /INSTALLMENT CARD/i.test(text)
    ? "BDO Installment Card"
    : "BDO Credit Card";

  const balance = parseAmount(totalRaw);
  const minimumPayment = parseAmount(minRaw);
  const dueDate = dueRaw ? parseStatementDate(dueRaw) : null;
  const statementDate = stmtRaw ? parseStatementDate(stmtRaw) : null;

  const missing: string[] = [];
  if (balance == null) missing.push("Total Amount Due (balance)");
  if (minimumPayment == null) missing.push("Minimum Amount Due");
  if (apr == null) missing.push("Interest Rate per Month (APR)");
  if (dueDate == null) missing.push("Payment Due Date");

  return {
    bank: isBdo ? "BDO" : "Unknown",
    creditor,
    accountId: last4 ? `bdo-${last4}` : null,
    cardMasked,
    balance: { value: balance, raw: totalRaw },
    minimumPayment: { value: minimumPayment, raw: minRaw },
    apr: { value: apr, raw: apr != null ? `${apr}%` : null },
    aprMonthlyRaw: monthlyRaw ? `${monthlyRaw}%` : null,
    dueDate: { value: dueDate, raw: dueRaw },
    statementDate: { value: statementDate, raw: stmtRaw },
    creditLimit: { value: parseAmount(limitRaw), raw: limitRaw },
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
