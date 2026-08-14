"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDebts } from "@/lib/data/useDebts";
import { statementsNeedingRefresh } from "@/lib/reminders/dueDates";

const dismissKey = (accountId: string, statementDate: string) =>
  `goodbyedebt.stmtDismiss.${accountId}.${statementDate}`;

/**
 * App-wide reminder: once a card/loan's statement (billing) date has passed and
 * the debt hasn't been updated since, nudge the user to upload the new
 * statement of account. Dismissible per statement cycle; reappears next cycle.
 */
export function StatementReminder() {
  const path = usePathname();
  const { debts } = useDebts();
  const [dismissedTick, setDismissedTick] = useState(0);

  const due = useMemo(
    () => statementsNeedingRefresh(debts, new Date()),
    [debts]
  );

  // Filter out cycles the user already dismissed.
  const active = useMemo(() => {
    return due.filter((s) => {
      try {
        return !window.localStorage.getItem(dismissKey(s.accountId, s.statementDate));
      } catch {
        return true;
      }
    });
    // dismissedTick forces re-eval after a dismiss.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [due, dismissedTick]);

  // Fire a one-time local device notification (only if already permitted).
  useEffect(() => {
    if (active.length === 0) return;
    try {
      if (typeof Notification === "undefined" || Notification.permission !== "granted") return;
      const sessionKey = "goodbyedebt.stmtNotified";
      if (sessionStorage.getItem(sessionKey)) return;
      sessionStorage.setItem(sessionKey, "1");
      const names = active.map((s) => s.creditor).join(", ");
      new Notification("Time to update your statement", {
        body: `A new statement has closed for ${names}. Upload it to keep your plan accurate.`,
        icon: "/icons/icon-192.png",
      });
    } catch {
      /* ignore */
    }
  }, [active]);

  if (path === "/" || path === "/login") return null;
  if (active.length === 0) return null;

  function dismiss() {
    try {
      for (const s of active) {
        window.localStorage.setItem(dismissKey(s.accountId, s.statementDate), "1");
      }
    } catch {
      /* ignore */
    }
    setDismissedTick((t) => t + 1);
  }

  return (
    <div className="stmt-reminder">
      <div className="stmt-reminder-body">
        📄 A new statement has closed for <strong>{active.map((s) => s.creditor).join(", ")}</strong>.
        Upload the updated statement so your balances and plan stay accurate.{" "}
        <Link href="/debts">Upload now →</Link>
      </div>
      <button type="button" className="stmt-reminder-close" aria-label="Dismiss" onClick={dismiss}>✕</button>
    </div>
  );
}
