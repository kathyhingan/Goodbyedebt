"use client";

import { useCallback, useEffect, useState } from "react";
import { isSupabaseConfigured } from "../supabase/config";
import { createClient } from "../supabase/client";
import { listPayments, addPayment, deletePayment, type Payment } from "./payments";

// Demo data so the Transactions tab isn't blank before the backend is wired.
const DEMO: Payment[] = [
  { id: "d1", accountId: "amex-blue", amount: 70, paidOn: "2026-08-05", note: "Minimum" },
  { id: "d2", accountId: "chase-sapphire", amount: 300, paidOn: "2026-08-02", note: "Extra to priority" },
];

let demoSeq = 100;

export interface UsePayments {
  payments: Payment[];
  loading: boolean;
  error: string | null;
  demo: boolean;
  add: (p: Payment) => Promise<void>;
  remove: (id: string) => Promise<void>;
  reload: () => Promise<void>;
}

export function usePayments(): UsePayments {
  const demo = !isSupabaseConfigured;
  const [payments, setPayments] = useState<Payment[]>(demo ? DEMO : []);
  const [loading, setLoading] = useState(!demo);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (demo) return;
    setLoading(true);
    setError(null);
    try {
      setPayments(await listPayments(createClient()));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load payments.");
    } finally {
      setLoading(false);
    }
  }, [demo]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const add = useCallback(
    async (p: Payment) => {
      if (demo) {
        setPayments((prev) => [{ ...p, id: `demo-${demoSeq++}` }, ...prev]);
        return;
      }
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      if (!data.user) throw new Error("Not signed in.");
      await addPayment(supabase, data.user.id, p);
      await reload();
    },
    [demo, reload]
  );

  const remove = useCallback(
    async (id: string) => {
      if (demo) {
        setPayments((prev) => prev.filter((p) => p.id !== id));
        return;
      }
      await deletePayment(createClient(), id);
      await reload();
    },
    [demo, reload]
  );

  return { payments, loading, error, demo, add, remove, reload };
}
