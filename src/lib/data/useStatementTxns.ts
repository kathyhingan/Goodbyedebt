"use client";

import { useCallback, useEffect, useState } from "react";
import { isSupabaseConfigured } from "../supabase/config";
import { createClient } from "../supabase/client";
import { listTransactions, addTransactions, deleteTransaction, type StoredTxn } from "./statementTxns";
import type { StatementTxn } from "../pdf/statement";

const DEMO: StoredTxn[] = [
  { id: "t1", accountId: "chase-sapphire", txnDate: "2026-08-01", description: "Google Workspace", amount: 534.8, direction: "debit", raw: "" },
  { id: "t2", accountId: "chase-sapphire", txnDate: "2026-07-15", description: "APPLE.COM/BILL", amount: 604.99, direction: "debit", raw: "" },
  { id: "t3", accountId: "chase-sapphire", txnDate: "2026-07-01", description: "Google Workspace", amount: 303.55, direction: "debit", raw: "" },
  { id: "t4", accountId: "amex-blue", txnDate: "2026-07-19", description: "Netflix", amount: 549, direction: "debit", raw: "" },
];

let demoSeq = 100;

export interface UseStatementTxns {
  txns: StoredTxn[];
  loading: boolean;
  error: string | null;
  demo: boolean;
  addMany: (accountId: string, txns: StatementTxn[]) => Promise<void>;
  remove: (id: string) => Promise<void>;
  reload: () => Promise<void>;
}

function dedupeKey(accountId: string, t: StatementTxn): string {
  return `${accountId}|${t.txnDate}|${t.description}|${t.amount}|${t.direction}`;
}

export function useStatementTxns(): UseStatementTxns {
  const demo = !isSupabaseConfigured;
  const [txns, setTxns] = useState<StoredTxn[]>(demo ? DEMO : []);
  const [loading, setLoading] = useState(!demo);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (demo) return;
    setLoading(true);
    setError(null);
    try {
      setTxns(await listTransactions(createClient()));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load transactions.");
    } finally {
      setLoading(false);
    }
  }, [demo]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const addMany = useCallback(
    async (accountId: string, incoming: StatementTxn[]) => {
      if (incoming.length === 0) return;
      if (demo) {
        setTxns((prev) => {
          const seen = new Set(prev.map((t) => dedupeKey(t.accountId, t)));
          const fresh = incoming
            .filter((t) => !seen.has(dedupeKey(accountId, t)))
            .map((t) => ({ ...t, accountId, id: `demo-${demoSeq++}` }));
          return [...fresh, ...prev].sort((a, b) => (a.txnDate < b.txnDate ? 1 : -1));
        });
        return;
      }
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      if (!data.user) throw new Error("Not signed in.");
      await addTransactions(supabase, data.user.id, accountId, incoming);
      await reload();
    },
    [demo, reload]
  );

  const remove = useCallback(
    async (id: string) => {
      if (demo) {
        setTxns((prev) => prev.filter((t) => t.id !== id));
        return;
      }
      await deleteTransaction(createClient(), id);
      await reload();
    },
    [demo, reload]
  );

  return { txns, loading, error, demo, addMany, remove, reload };
}
