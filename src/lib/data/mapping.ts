import type { Debt, DebtType } from "../engine/types";

/** Shape of a row in public.debts (snake_case, as returned by Supabase). */
export interface DebtRow {
  id?: string;
  user_id?: string;
  account_id: string;
  creditor: string | null;
  balance: number | string;
  apr: number | string;
  minimum_payment: number | string;
  due_date: string | null;
  billing_date: string | null;
  debt_type: DebtType;
  promo_rate: number | string | null;
  promo_expiry: string | null;
  last_updated?: string | null;
}

const num = (v: number | string | null | undefined): number => {
  if (v == null) return 0;
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : 0;
};

/** DB row -> engine Debt. */
export function rowToDebt(row: DebtRow): Debt {
  const debt: Debt = {
    accountId: row.account_id,
    creditor: row.creditor ?? "",
    balance: num(row.balance),
    apr: num(row.apr),
    minimumPayment: num(row.minimum_payment),
    debtType: row.debt_type,
  };
  if (row.due_date) debt.dueDate = row.due_date;
  if (row.billing_date) debt.billingDate = row.billing_date;
  if (row.promo_rate != null) debt.promoRate = num(row.promo_rate);
  if (row.promo_expiry) debt.promoExpiry = row.promo_expiry;
  if (row.last_updated) debt.lastUpdated = row.last_updated;
  return debt;
}

/** engine Debt -> DB row payload (for insert/update). `user_id` is added by the caller. */
export function debtToRow(debt: Debt): Omit<DebtRow, "id" | "user_id" | "last_updated"> {
  return {
    account_id: debt.accountId,
    creditor: debt.creditor ?? "",
    balance: debt.balance,
    apr: debt.apr,
    minimum_payment: debt.minimumPayment,
    due_date: debt.dueDate ?? null,
    billing_date: debt.billingDate ?? null,
    debt_type: debt.debtType,
    promo_rate: debt.promoRate ?? null,
    promo_expiry: debt.promoExpiry ?? null,
  };
}
