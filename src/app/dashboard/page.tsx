"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useDebts } from "@/lib/data/useDebts";
import { usePayments } from "@/lib/data/usePayments";
import { useProfile } from "@/lib/data/useProfile";
import { useCurrency } from "@/lib/currency/currency";
import { percentPaidOff } from "@/lib/community/profile";
import {
  accruedBalance,
  projectPayoff,
  paidThisYear,
  paidLastYear,
  onTimeMonthsThisYear,
  detectCurrentMilestones,
} from "@/lib/engine";
import { formatMonthYear } from "@/lib/format/duration";
import { upcomingDueDates } from "@/lib/reminders/dueDates";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getMyCoachLink } from "@/lib/data/coach";
import { listThread, getMyMilestones, recordMilestones, describeMilestone, type Message, type MilestoneRow } from "@/lib/data/messaging";
import { LogPaymentModal } from "@/components/LogPaymentModal";

const SWATCHES = ["var(--primary)", "var(--accent)", "var(--success)", "var(--warning-ink)"];

/** "Oct 12" from an ISO yyyy-mm-dd date — short form for the stat card. */
function shortDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function DashboardPage() {
  const { debts, loading, demo } = useDebts();
  const { payments } = usePayments();
  const { format } = useCurrency();
  const money = (n: number) => format(n, { maximumFractionDigits: 0 });

  const asOfToday = useMemo(() => debts.map((d) => ({ ...d, balance: accruedBalance(d) })), [debts]);
  const totalRemaining = useMemo(() => asOfToday.reduce((s, d) => s + Math.max(0, d.balance), 0), [asOfToday]);
  const { profile } = useProfile(totalRemaining, !loading);

  // "Ahead of plan" = the real benefit of rolling each cleared debt's minimum
  // into the next one, vs. just paying each debt's own shrinking minimum
  // forever. Both are genuine projections off the same data — not a
  // fabricated comparison.
  const planVsBaseline = useMemo(() => {
    if (asOfToday.length === 0) return null;
    const plan = projectPayoff(asOfToday, { name: "avalanche" }, { monthlyExtra: 0 });
    const baseline = projectPayoff(asOfToday, { name: "avalanche" }, { monthlyExtra: 0, rollover: false });
    return { plan, baseline };
  }, [asOfToday]);

  // Percent paid off is computed from the LIVE total remaining, not from
  // profile.currentTotalDebt. That synced field is written separately and can
  // drift (or hold a stale 0 from a load that raced the debts query) — which
  // is exactly how this card rendered "100% paid off" next to ₱4.9M still
  // owed. Only the baseline comes from the profile; the current figure is
  // whatever the debt list actually says right now.
  const originalDebt = profile && profile.originalTotalDebt > 0
    ? profile.originalTotalDebt
    : planVsBaseline?.plan.startingBalance ?? 0;
  const percent = percentPaidOff(originalDebt, totalRemaining);

  const thisYear = useMemo(() => paidThisYear(payments), [payments]);
  const lastYear = useMemo(() => paidLastYear(payments), [payments]);
  const yearDeltaPct = lastYear && lastYear > 0 ? Math.round(((thisYear - lastYear) / lastYear) * 100) : null;
  const onTime = useMemo(() => onTimeMonthsThisYear(debts, payments), [debts, payments]);
  const nextDue = useMemo(() => upcomingDueDates(debts, new Date(), 60)[0] ?? null, [debts]);

  // Coach connection: last message preview (if any) for the "From your
  // coach" card. Falls back to milestones when there's no coach yet.
  const [coachLink, setCoachLink] = useState<{ orgId: string; orgName: string } | null>(null);
  const [lastMsg, setLastMsg] = useState<Message | null>(null);
  const [milestones, setMilestones] = useState<MilestoneRow[]>([]);
  const [payOpen, setPayOpen] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    (async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase.auth.getUser();
        if (!data.user) return;
        const link = await getMyCoachLink(supabase);
        setCoachLink(link);
        if (link) {
          const thread = await listThread(supabase, link.orgId, data.user.id);
          setLastMsg(thread.at(-1) ?? null);
        }
        setMilestones(await getMyMilestones(supabase, 5));
      } catch {
        /* dashboard still works without the coach card */
      }
    })();
  }, []);

  // Best-effort milestone detection — fires whenever debts/payments load.
  // Never blocks the UI; a missed detection just gets caught next visit.
  useEffect(() => {
    if (!isSupabaseConfigured || debts.length === 0) return;
    const detected = detectCurrentMilestones(debts, payments);
    if (detected.length === 0) return;
    (async () => {
      try {
        await recordMilestones(createClient(), detected);
        setMilestones(await getMyMilestones(createClient(), 5));
      } catch {
        /* enhancement only */
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debts.length, payments.length]);

  const creditorByAccount = useMemo(() => new Map(debts.map((d) => [d.accountId, d.creditor || d.accountId])), [debts]);

  if (loading) {
    return (
      <main className="container">
        <div className="brand"><h1>Dashboard</h1></div>
        <p className="tagline">Loading your progress…</p>
      </main>
    );
  }

  if (debts.length === 0) {
    return (
      <main className="container">
        <div className="brand"><h1>Dashboard</h1></div>
        <p className="tagline">
          No debts yet. <Link href="/debts">Add your first debt</Link> to see your progress here.
        </p>
      </main>
    );
  }

  return (
    <main className="container" style={{ maxWidth: 1040 }}>
      <div className="brand"><h1>Dashboard</h1></div>
      {demo && <div className="banner">Demo mode — showing sample data.</div>}

      <section className="card">
        <div className="dash-hero">
          <div className="progress-ring lg" style={{ "--pct": percent } as React.CSSProperties}>
            <div className="ring-stack">
              <span className="figure-lg">{percent}%</span>
              <span className="caption muted">paid off</span>
            </div>
          </div>
          <div className="hero-copy">
            <div className="caption muted" style={{ textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Total remaining
            </div>
            <div className="display-lg">{money(totalRemaining)}</div>
            {planVsBaseline && !planVsBaseline.plan.unpayable && (
              <p className="body-sm muted" style={{ marginTop: 6 }}>
                of {money(planVsBaseline.plan.startingBalance)} original · on pace to be debt-free by{" "}
                <strong>{formatMonthYear(planVsBaseline.plan.debtFreeDate)}</strong>
                {planVsBaseline.baseline.monthsToDebtFree > planVsBaseline.plan.monthsToDebtFree && (
                  <>
                    , {planVsBaseline.baseline.monthsToDebtFree - planVsBaseline.plan.monthsToDebtFree} months ahead of
                    paying minimums alone
                  </>
                )}
                .
              </p>
            )}
            <div className="gd-row" style={{ display: "flex", gap: 12, marginTop: 12 }}>
              <button
                type="button"
                className="primary"
                onClick={() => setPayOpen(true)}
                style={{ padding: "10px 18px", borderRadius: "var(--radius-md)", fontWeight: 600, fontSize: 13 }}
              >
                Log a payment
              </button>
              <Link href="/debts" style={{ display: "inline-block", padding: "10px 18px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-strong)", color: "var(--ink)", textDecoration: "none", fontWeight: 600, fontSize: 13 }}>
                Upload statement
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="stat-grid cols-3" style={{ marginBottom: "var(--space-16)" }}>
        <div className="stat">
          <div className="label">Paid down this year</div>
          <div className="value">{money(thisYear)}</div>
          {yearDeltaPct != null && (
            <span className={`chip ${yearDeltaPct >= 0 ? "chip-success" : "chip-neutral"}`} style={{ marginTop: 6, display: "inline-block" }}>
              {yearDeltaPct >= 0 ? "+" : ""}{yearDeltaPct}% vs last year
            </span>
          )}
        </div>
        <div className="stat">
          <div className="label">On-time payments</div>
          <div className="value">{onTime.total > 0 ? `${onTime.met} / ${onTime.total}` : "—"}</div>
          {onTime.total > 0 && (
            <span className={`chip ${onTime.met === onTime.total ? "chip-success" : "chip-warning"}`} style={{ marginTop: 6, display: "inline-block" }}>
              {onTime.met === onTime.total ? "Perfect streak" : "Some months short"}
            </span>
          )}
        </div>
        <div className="stat">
          <div className="label">Next payment due</div>
          <div className="value">{nextDue ? shortDate(nextDue.dueDate) : "—"}</div>
          {nextDue && (
            <span className="chip chip-warning" style={{ marginTop: 6, display: "inline-block" }}>
              {nextDue.creditor} · {money(nextDue.minimumPayment)}
            </span>
          )}
        </div>
      </div>

      <div className="grid2" style={{ gridTemplateColumns: "2fr 1fr" }}>
        <section className="card">
          <div className="gd-row gd-between" style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span className="heading-sm">Your debts</span>
            <Link href="/plan" className="label" style={{ color: "var(--primary)", textDecoration: "none" }}>
              View full plan →
            </Link>
          </div>
          {asOfToday.map((d, i) => (
            <div key={d.accountId} className="timeline-item">
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span className="dot-swatch" style={{ background: SWATCHES[i % SWATCHES.length] }} />
                <span className="body">{d.creditor || d.accountId}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <span className="body-sm muted">{d.apr}% APR</span>
                <span className="figure">{money(d.balance)}</span>
              </div>
            </div>
          ))}
        </section>

        {coachLink ? (
          <section className="card">
            <div className="heading-sm" style={{ marginBottom: 10 }}>From your coach</div>
            {lastMsg ? (
              <>
                <div style={{ display: "flex", gap: 10 }}>
                  <div className="avatar alt">{coachLink.orgName.slice(0, 1).toUpperCase()}</div>
                  <p className="body-sm" style={{ margin: 0, background: "var(--surface-sunken)", padding: "10px 12px", borderRadius: "var(--radius-md)" }}>
                    {lastMsg.body}
                  </p>
                </div>
                <Link href="/my-coach" style={{ display: "inline-block", marginTop: 10, padding: "6px 12px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-strong)", fontSize: 12, fontWeight: 600, color: "var(--ink)", textDecoration: "none" }}>
                  Reply to {coachLink.orgName}
                </Link>
              </>
            ) : (
              <p className="note">No messages yet. <Link href="/my-coach">Say hello →</Link></p>
            )}
            {milestones[0] && (
              <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid var(--border)" }}>
                <div className="caption muted" style={{ marginBottom: 4 }}>Milestone unlocked</div>
                <span className="chip chip-success">{describeMilestone(milestones[0], creditorByAccount.get(milestones[0].accountId ?? ""))}</span>
              </div>
            )}
          </section>
        ) : (
          <section className="card">
            <div className="heading-sm" style={{ marginBottom: 10 }}>Your milestones</div>
            {milestones.length === 0 ? (
              <p className="note">Keep paying down your debts — milestones show up here as you hit them.</p>
            ) : (
              milestones.map((m, i) => (
                <div key={i} className="achievement">
                  <span className="achievement-pin">✓</span>
                  <div>
                    <div className="achievement-title">{describeMilestone(m, creditorByAccount.get(m.accountId ?? ""))}</div>
                    <div className="achievement-date">{formatMonthYear(m.achievedAt.slice(0, 10))}</div>
                  </div>
                </div>
              ))
            )}
          </section>
        )}
      </div>

      <LogPaymentModal open={payOpen} onClose={() => setPayOpen(false)} />
    </main>
  );
}
