import type { SupabaseClient } from "@supabase/supabase-js";
import type { Debt } from "../engine/types";
import { debtToRow, rowToDebt, type DebtRow } from "./mapping";

/**
 * Data-access layer for debts, backed by Supabase with RLS. All calls operate
 * on the current authenticated user's rows only (enforced by RLS policies).
 */
export async function listDebts(supabase: SupabaseClient): Promise<Debt[]> {
  const { data, error } = await supabase
    .from("debts")
    .select("*")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data as DebtRow[]).map(rowToDebt);
}

export async function upsertDebt(
  supabase: SupabaseClient,
  userId: string,
  debt: Debt
): Promise<void> {
  const payload = { ...debtToRow(debt), user_id: userId };
  const { error } = await supabase
    .from("debts")
    .upsert(payload, { onConflict: "user_id,account_id" });
  if (error) throw error;
}

/**
 * Bulk upsert for CSV import — matches on (user_id, account_id) so re-uploads
 * consolidate onto existing debts instead of duplicating (SOW §4.1).
 */
export async function upsertDebts(
  supabase: SupabaseClient,
  userId: string,
  debts: Debt[]
): Promise<void> {
  if (debts.length === 0) return;
  const rows = debts.map((d) => ({ ...debtToRow(d), user_id: userId }));
  const { error } = await supabase
    .from("debts")
    .upsert(rows, { onConflict: "user_id,account_id" });
  if (error) throw error;
}

export async function deleteDebt(
  supabase: SupabaseClient,
  accountId: string
): Promise<void> {
  const { error } = await supabase.from("debts").delete().eq("account_id", accountId);
  if (error) throw error;
}
