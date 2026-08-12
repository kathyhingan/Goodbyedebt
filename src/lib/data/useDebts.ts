"use client";

import { useCallback, useEffect, useState } from "react";
import type { Debt } from "../engine/types";
import { isSupabaseConfigured } from "../supabase/config";
import { createClient } from "../supabase/client";
import { listDebts, upsertDebt, upsertDebts, deleteDebt } from "./debts";

// Demo data used only when the backend isn't configured yet, so the UI is
// never blank in local/preview builds.
const DEMO: Debt[] = [
  { accountId: "chase-sapphire", creditor: "Chase Sapphire", balance: 4200, apr: 22.99, minimumPayment: 95, debtType: "credit_card", dueDate: "2026-09-15" },
  { accountId: "amex-blue", creditor: "Amex Blue", balance: 2600, apr: 26.24, minimumPayment: 70, debtType: "credit_card", dueDate: "2026-09-05" },
  { accountId: "sofi-loan", creditor: "SoFi Personal Loan", balance: 9000, apr: 11.5, minimumPayment: 240, debtType: "personal_loan", dueDate: "2026-09-01" },
];

export interface UseDebts {
  debts: Debt[];
  loading: boolean;
  error: string | null;
  demo: boolean;
  save: (debt: Debt) => Promise<void>;
  bulkSave: (debts: Debt[]) => Promise<void>;
  remove: (accountId: string) => Promise<void>;
  reload: () => Promise<void>;
}

export function useDebts(): UseDebts {
  const demo = !isSupabaseConfigured;
  const [debts, setDebts] = useState<Debt[]>(demo ? DEMO : []);
  const [loading, setLoading] = useState(!demo);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (demo) return;
    setLoading(true);
    setError(null);
    try {
      const rows = await listDebts(createClient());
      setDebts(rows);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load debts.");
    } finally {
      setLoading(false);
    }
  }, [demo]);

  useEffect(() => {
    void reload();
  }, [reload]);

  async function currentUserId(): Promise<string> {
    const supabase = createClient();
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw new Error("Not signed in.");
    return data.user.id;
  }

  const save = useCallback(
    async (debt: Debt) => {
      if (demo) {
        setDebts((prev) => {
          const i = prev.findIndex((d) => d.accountId === debt.accountId);
          if (i === -1) return [...prev, debt];
          const next = [...prev];
          next[i] = debt;
          return next;
        });
        return;
      }
      await upsertDebt(createClient(), await currentUserId(), debt);
      await reload();
    },
    [demo, reload]
  );

  const bulkSave = useCallback(
    async (incoming: Debt[]) => {
      if (demo) {
        setDebts((prev) => {
          const byId = new Map(prev.map((d) => [d.accountId, d]));
          for (const d of incoming) byId.set(d.accountId, { ...byId.get(d.accountId), ...d });
          return [...byId.values()];
        });
        return;
      }
      await upsertDebts(createClient(), await currentUserId(), incoming);
      await reload();
    },
    [demo, reload]
  );

  const remove = useCallback(
    async (accountId: string) => {
      if (demo) {
        setDebts((prev) => prev.filter((d) => d.accountId !== accountId));
        return;
      }
      await deleteDebt(createClient(), accountId);
      await reload();
    },
    [demo, reload]
  );

  return { debts, loading, error, demo, save, bulkSave, remove, reload };
}
