import type { DebtType } from "../engine/types";

/**
 * Column order and headers for the CSV import/export template (SOW 8.2).
 * `accountId` is the required matching key for re-upload consolidation.
 */
export const CSV_COLUMNS = [
  "accountId",
  "creditor",
  "balance",
  "apr",
  "minimumPayment",
  "dueDate",
  "billingDate",
  "debtType",
  "promoRate",
  "promoExpiry",
] as const;

export type CsvColumn = (typeof CSV_COLUMNS)[number];

export const DEBT_TYPES: DebtType[] = [
  "credit_card",
  "personal_loan",
  "auto_loan",
  "student_loan",
  "bnpl",
  "other",
];

/** A blank template (header + one example row) to hand users for correct formatting. */
export function csvTemplate(): string {
  const header = CSV_COLUMNS.join(",");
  const example = [
    "visa-personal",
    "Chase Sapphire",
    "4200.00",
    "22.99",
    "95.00",
    "2026-09-15",
    "2026-08-28",
    "credit_card",
    "",
    "",
  ].join(",");
  return `${header}\n${example}\n`;
}
