"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useDebts } from "@/lib/data/useDebts";
import { useCurrency } from "@/lib/currency/currency";
import { upcomingDueDates } from "@/lib/reminders/dueDates";

const fmt = (iso: string) =>
  new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

export default function CalendarPage() {
  const { debts, loading, demo } = useDebts();
  const { format } = useCurrency();
  const upcoming = useMemo(() => upcomingDueDates(debts, new Date(), 60), [debts]);

  return (
    <main className="container">
      <h1 style={{ color: "var(--moss)" }}>Upcoming due dates</h1>
      {demo && <div className="banner">Demo mode — sample due dates shown.</div>}
      <p className="tagline">
        Every account&apos;s next payment, soonest first. Pay each minimum on time — the payoff
        plan never asks you to skip one.
      </p>

      <section className="card">
        {loading ? (
          <p className="muted">Loading…</p>
        ) : upcoming.length === 0 ? (
          <p className="muted">
            No due dates in the next 60 days. Add due dates on the <Link href="/debts">Debts</Link> page.
          </p>
        ) : (
          upcoming.map((u) => (
            <div className="timeline-item" key={u.accountId}>
              <div>
                <strong>{u.creditor || u.accountId}</strong>
                <div className="muted" style={{ fontSize: "0.8rem" }}>
                  Min {format(u.minimumPayment, { maximumFractionDigits: 0 })}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div>{fmt(u.dueDate)}</div>
                <span className={`pill ${u.daysUntil <= 3 ? "soon" : ""}`}>
                  {u.daysUntil === 0 ? "Due today" : `in ${u.daysUntil} day${u.daysUntil === 1 ? "" : "s"}`}
                </span>
              </div>
            </div>
          ))
        )}
      </section>

      <p className="note">
        Reminder timing is configurable on the <Link href="/settings">Settings</Link> page. On
        devices without push support, this calendar is your reminder — no notification is ever a
        hard blocker (SOW §10).
      </p>
    </main>
  );
}
