import type { SupabaseClient } from "@supabase/supabase-js";

export interface Payment {
  id?: string;
  accountId: string;
  amount: number;
  paidOn: string; // ISO yyyy-mm-dd
  note?: string;
  createdAt?: string;
}

interface PaymentRow {
  id: string;
  account_id: string;
  amount: number | string;
  paid_on: string;
  note: string | null;
  created_at: string;
}

function rowToPayment(r: PaymentRow): Payment {
  return {
    id: r.id,
    accountId: r.account_id,
    amount: Number(r.amount),
    paidOn: r.paid_on,
    note: r.note ?? "",
    createdAt: r.created_at,
  };
}

/** Lists the current user's payments, newest first (RLS-scoped). */
export async function listPayments(supabase: SupabaseClient): Promise<Payment[]> {
  const { data, error } = await supabase
    .from("payments")
    .select("*")
    .order("paid_on", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as PaymentRow[]).map(rowToPayment);
}

export async function addPayment(
  supabase: SupabaseClient,
  userId: string,
  payment: Payment
): Promise<void> {
  const { error } = await supabase.from("payments").insert({
    user_id: userId,
    account_id: payment.accountId,
    amount: payment.amount,
    paid_on: payment.paidOn,
    note: payment.note ?? "",
  });
  if (error) throw error;
}

export async function deletePayment(supabase: SupabaseClient, id: string): Promise<void> {
  const { error } = await supabase.from("payments").delete().eq("id", id);
  if (error) throw error;
}
