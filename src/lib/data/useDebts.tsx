"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Debt } from "../engine/types";
import { isSupabaseConfigured } from "../supabase/config";
import { createClient } from "../supabase/client";
import { listDebts, upsertDebt, upsertDebts, deleteDebt } from "./debts";
import { loadProfile, updateProgress } from "./profile";

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

const DebtsContext = createContext<UseDebts | null>(null);

/**
 * Single shared source of truth for debts across every tab. Mutations update
 * this state optimistically and persist, so a payment recorded on one tab is
 * reflected on all of them immediately (no per-page stale copies).
 */
export function DebtsProvider({ children }: { children: React.ReactNode }) {
  const demo = !isSupabaseConfigured;
  const [debts, setDebts] = useState<Debt[]>(demo ? DEMO : []);
  const [loading, setLoading] = useState(!demo);
  const [error, setError] = useState<string | null>(null);

  // Keep the user's public profile progress (leaderboard %) in sync with the
  // live total, healing a zero baseline. Best-effort — never blocks the UI.
  const syncProfile = useCallback(async (rows: Debt[]) => {
    if (demo) return;
    try {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      if (!data.user) return;
      const existing = await loadProfile(supabase, data.user.id);
      if (!existing) return; // created when they first visit Profile
      const total = rows.reduce((s, d) => s + Math.max(0, d.balance), 0);
      const original = existing.originalTotalDebt > 0 ? existing.originalTotalDebt : total;
      await updateProgress(supabase, data.user.id, total, original);
    } catch {
      /* profiles table may not exist yet */
    }
  }, [demo]);

  const reload = useCallback(async () => {
    if (demo) return;
    setLoading(true);
    setError(null);
    try {
      const rows = await listDebts(createClient());
      setDebts(rows);
      void syncProfile(rows);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load debts.");
    } finally {
      setLoading(false);
    }
  }, [demo, syncProfile]);

  useEffect(() => {
    void reload();
  }, [reload]);

  // Installed PWAs resume their last snapshot without re-fetching. Reload debts
  // whenever the app regains focus/visibility so data is fresh on reopen.
  useEffect(() => {
    if (demo) return;
    const onVisible = () => {
      if (document.visibilityState === "visible") void reload();
    };
    window.addEventListener("focus", onVisible);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.removeEventListener("focus", onVisible);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [demo, reload]);

  async function currentUserId(): Promise<string> {
    const supabase = createClient();
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw new Error("Not signed in.");
    return data.user.id;
  }

  const save = useCallback(
    async (debt: Debt) => {
      // Optimistic update so every tab reflects it instantly.
      setDebts((prev) => {
        const i = prev.findIndex((d) => d.accountId === debt.accountId);
        if (i === -1) return [...prev, debt];
        const next = [...prev];
        next[i] = debt;
        return next;
      });
      if (demo) return;
      try {
        await upsertDebt(createClient(), await currentUserId(), debt);
        await reload();
      } catch (e) {
        await reload(); // revert to server truth on failure
        throw e;
      }
    },
    [demo, reload]
  );

  const bulkSave = useCallback(
    async (incoming: Debt[]) => {
      setDebts((prev) => {
        const byId = new Map(prev.map((d) => [d.accountId, d]));
        for (const d of incoming) byId.set(d.accountId, { ...byId.get(d.accountId), ...d });
        return [...byId.values()];
      });
      if (demo) return;
      await upsertDebts(createClient(), await currentUserId(), incoming);
      await reload();
    },
    [demo, reload]
  );

  const remove = useCallback(
    async (accountId: string) => {
      setDebts((prev) => prev.filter((d) => d.accountId !== accountId));
      if (demo) return;
      await deleteDebt(createClient(), accountId);
      await reload();
    },
    [demo, reload]
  );

  const value = useMemo(
    () => ({ debts, loading, error, demo, save, bulkSave, remove, reload }),
    [debts, loading, error, demo, save, bulkSave, remove, reload]
  );

  return <DebtsContext.Provider value={value}>{children}</DebtsContext.Provider>;
}

export function useDebts(): UseDebts {
  const ctx = useContext(DebtsContext);
  if (!ctx) throw new Error("useDebts must be used within a DebtsProvider");
  return ctx;
}
