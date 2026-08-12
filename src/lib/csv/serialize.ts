import type { Debt } from "../engine/types";
import { CSV_COLUMNS } from "./template";

function cell(value: string | number | undefined): string {
  if (value == null) return "";
  const s = String(value);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/** Serializes debts to CSV using the shared template column order (SOW §4.6 export). */
export function debtsToCsv(debts: Debt[]): string {
  const header = CSV_COLUMNS.join(",");
  const rows = debts.map((d) =>
    [
      d.accountId,
      d.creditor,
      d.balance,
      d.apr,
      d.minimumPayment,
      d.dueDate,
      d.billingDate,
      d.debtType,
      d.promoRate,
      d.promoExpiry,
    ]
      .map(cell)
      .join(",")
  );
  return [header, ...rows].join("\n") + "\n";
}
