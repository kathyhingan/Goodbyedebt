import type { SupabaseClient } from "@supabase/supabase-js";
import type { StatementTxn } from "../pdf/statement";

export interface StoredTxn extends StatementTxn {
  id?: string;
  accountId: string;
}

interface TxnRow {
  id: string;
  account_id: string;
  txn_date: string;
  description: string;
  amount: number | string;
  direction: "debit" | "credit";
}

function rowToTxn(r: TxnRow): StoredTxn {
  return {
    id: r.id,
    accountId: r.account_id,
    txnDate: r.txn_date,
    description: r.description,
    amount: Number(r.amount),
    direction: r.direction,
    raw: "",
  };
}

export async function listTransactions(supabase: SupabaseClient): Promise<StoredTxn[]> {
  const { data, error } = await supabase
    .from("statement_transactions")
    .select("*")
    .order("txn_date", { ascending: false });
  if (error) throw error;
  return (data as TxnRow[]).map(rowToTxn);
}

/**
 * Inserts transactions for one statement. Uses upsert on the natural dedup key
 * so re-uploading the same statement won't create duplicates.
 */
export async function addTransactions(
  supabase: SupabaseClient,
  userId: string,
  accountId: string,
  txns: StatementTxn[]
): Promise<void> {
  if (txns.length === 0) return;
  const rows = txns.map((t) => ({
    user_id: userId,
    account_id: accountId,
    txn_date: t.txnDate,
    description: t.description,
    amount: t.amount,
    direction: t.direction,
  }));
  const { error } = await supabase
    .from("statement_transactions")
    .upsert(rows, {
      onConflict: "user_id,account_id,txn_date,description,amount,direction",
      ignoreDuplicates: true,
    });
  if (error) throw error;
}

export async function deleteTransaction(supabase: SupabaseClient, id: string): Promise<void> {
  const { error } = await supabase.from("statement_transactions").delete().eq("id", id);
  if (error) throw error;
}
