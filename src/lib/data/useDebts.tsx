"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Debt } from "../engine/types";
import { isSupabaseConfigured } from "../supabase/config";
import { createClient } from "../supabase/client";
import { listDebts, upsertDebt, upsertDebts, deleteDebt } from "./debts";
import { reassignPayments } from "./payments";
import { reassignTransactions } from "./statementTxns";
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
  merge: (keepAccountId: string, removeAccountIds: string[], newBalance?: number) => Promise<void>;
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
      try {
        await upsertDebts(createClient(), await currentUserId(), incoming);
        await reload();
      } catch (e) {
        await reload(); // revert to server truth on failure
        throw e;
      }
    },
    [demo, reload]
  );

  const remove = useCallback(
    async (accountId: string) => {
      // Optimistic removal so the row disappears immediately — but if the
      // actual delete fails server-side (expired session, transient error,
      // anything), this must not be the only thing that happens: without
      // the catch below, the promise just rejects unseen (the Delete button
      // doesn't await or .catch() it), the row LOOKS gone, and then silently
      // reappears on the next reload/focus because it was never actually
      // deleted. Resync to server truth on failure, same as save()/bulkSave,
      // and rethrow so the caller can tell the user it didn't work.
      setDebts((prev) => prev.filter((d) => d.accountId !== accountId));
      if (demo) return;
      try {
        await deleteDebt(createClient(), accountId);
        await reload();
      } catch (e) {
        await reload();
        throw e;
      }
    },
    [demo, reload]
  );

  /**
   * Consolidates duplicate debts for the same real account into one row.
   * Keeps `keepAccountId`, re-points that account's payments and statement
   * line items from each removed id, then deletes the duplicates.
   *
   * Each history re-point is independent and best-effort: if one fails (say a
   * table isn't reachable), the merge still completes rather than aborting
   * partway with some rows deleted and some not. The duplicates are removed
   * last, so a failure before that leaves the data unmerged but intact.
   */
  const merge = useCallback(
    async (keepAccountId: string, removeAccountIds: string[], newBalance?: number) => {
      const targets = removeAccountIds.filter((id) => id && id !== keepAccountId);
      if (targets.length === 0) return;

      // Drop the duplicates and, when a merged balance is supplied, carry it
      // onto the kept row so the on-screen total drops immediately.
      setDebts((prev) =>
        prev
          .filter((d) => !targets.includes(d.accountId))
          .map((d) =>
            d.accountId === keepAccountId && newBalance != null
              ? { ...d, balance: newBalance, lastUpdated: new Date().toISOString() }
              : d
          )
      );
      if (demo) return;

      const supabase = createClient();
      try {
        // History first, balance second, deletion last — a failure before the
        // delete leaves the data unmerged but intact.
        for (const from of targets) {
          await reassignPayments(supabase, from, keepAccountId).catch(() => {});
          await reassignTransactions(supabase, from, keepAccountId).catch(() => {});
        }
        if (newBalance != null) {
          const keep = debts.find((d) => d.accountId === keepAccountId);
          if (keep) {
            await upsertDebt(supabase, await currentUserId(), {
              ...keep,
              balance: newBalance,
              lastUpdated: new Date().toISOString(),
            });
          }
        }
        for (const from of targets) {
          await deleteDebt(supabase, from);
        }
        await reload();
      } catch (e) {
        await reload(); // server truth wins; the un-merged rows come back
        throw e;
      }
    },
    [demo, reload, debts]
  );

  const value = useMemo(
    () => ({ debts, loading, error, demo, save, bulkSave, remove, merge, reload }),
    [debts, loading, error, demo, save, bulkSave, remove, merge, reload]
  );

  return <DebtsContext.Provider value={value}>{children}</DebtsContext.Provider>;
}

export function useDebts(): UseDebts {
  const ctx = useContext(DebtsContext);
  if (!ctx) throw new Error("useDebts must be used within a DebtsProvider");
  return ctx;
}
