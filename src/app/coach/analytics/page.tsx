"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { useCoachOrg } from "@/lib/data/coachOrgContext";
import {
  getPortfolioStats,
  getPortfolioMonthly,
  listClients,
  clientUrgency,
  clientStatusLabel,
  sortByUrgency,
  type PortfolioStats,
  type MonthlyAmount,
  type OrgClient,
} from "@/lib/data/coach";
import { DEMO_CLIENTS } from "@/lib/data/coachDemo";

const DEMO_STATS: PortfolioStats = {
  totalReduced: 8640,
  activeThisWeek: 3,
  activeTotal: 4,
  avgProgress: 54,
  onTrackCount: 2,
  dueSoonCount: 1,
  atRiskCount: 1,
};
const DEMO_MONTHLY: MonthlyAmount[] = [
  { monthLabel: "May", amount: 6200 },
  { monthLabel: "Jun", amount: 7100 },
  { monthLabel: "Jul", amount: 6800 },
  { monthLabel: "Aug", amount: 9400 },
  { monthLabel: "Sep", amount: 8900 },
  { monthLabel: "Oct", amount: 8640 },
];

const money = (n: number) => `$${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

export default function CoachAnalyticsPage() {
  const { org } = useCoachOrg();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<PortfolioStats | null>(null);
  const [monthly, setMonthly] = useState<MonthlyAmount[]>([]);
  const [clients, setClients] = useState<OrgClient[]>([]);

  const load = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setStats(DEMO_STATS);
      setMonthly(DEMO_MONTHLY);
      setClients(DEMO_CLIENTS);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const supabase = createClient();
      const [s, m, c] = await Promise.all([
        getPortfolioStats(supabase, org.id),
        getPortfolioMonthly(supabase, org.id),
        listClients(supabase, org.id),
      ]);
      setStats(s);
      setMonthly(m);
      setClients(c.filter((x) => x.status === "active"));
    } finally {
      setLoading(false);
    }
  }, [org.id]);

  useEffect(() => {
    void load();
  }, [load]);

  const maxMonthly = Math.max(1, ...monthly.map((m) => m.amount));
  const needsAttention = sortByUrgency(clients.filter((c) => clientUrgency(c) !== "success")).slice(0, 5);

  if (loading || !stats) {
    return (
      <main className="container" style={{ maxWidth: 1040 }}>
        <div className="brand"><h1>Analytics</h1></div>
        <p className="tagline">Loading…</p>
      </main>
    );
  }

  const total = stats.onTrackCount + stats.dueSoonCount + stats.atRiskCount;
  const pct = (n: number) => (total > 0 ? (n / total) * 100 : 0);

  return (
    <main className="container" style={{ maxWidth: 1040 }}>
      <div className="gd-row gd-between" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 className="heading-lg" style={{ margin: 0 }}>Portfolio analytics</h1>
      </div>
      <p className="note" style={{ marginTop: 4 }}>
        &ldquo;Debt reduced&rdquo; is payments logged in the window — a close read on real repayment, not
        a perfectly isolated principal figure (interest is mixed in).
      </p>

      <div className="grid-3" style={{ margin: "16px 0" }}>
        <div className="card tight" style={{ margin: 0 }}>
          <div className="caption muted">Debt reduced, last 30 days</div>
          <div className="figure-lg">{money(stats.totalReduced)}</div>
        </div>
        <div className="card tight" style={{ margin: 0 }}>
          <div className="caption muted">Active this week</div>
          <div className="figure-lg">{stats.activeThisWeek} / {stats.activeTotal}</div>
        </div>
        <div className="card tight" style={{ margin: 0 }}>
          <div className="caption muted">Avg. progress</div>
          <div className="figure-lg">{Math.round(stats.avgProgress)}%</div>
        </div>
      </div>

      <div className="grid2" style={{ gridTemplateColumns: "1.3fr 1fr" }}>
        <section className="card">
          <div className="heading-sm" style={{ marginBottom: 14 }}>Debt reduced per month, across all clients</div>
          <div className="bars">
            {monthly.map((m, i) => (
              <div className="bar-col" key={i}>
                <div className="bar-fill" style={{ height: `${Math.max(2, (m.amount / maxMonthly) * 100)}%` }} />
                <span className="caption muted">{m.monthLabel}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="card">
          <div className="heading-sm" style={{ marginBottom: 10 }}>Client status</div>
          <div className="stackbar">
            {pct(stats.onTrackCount) > 0 && <div className="seg-success" style={{ width: `${pct(stats.onTrackCount)}%` }} />}
            {pct(stats.dueSoonCount) > 0 && <div className="seg-warning" style={{ width: `${pct(stats.dueSoonCount)}%` }} />}
            {pct(stats.atRiskCount) > 0 && <div className="seg-danger" style={{ width: `${pct(stats.atRiskCount)}%` }} />}
          </div>
          <div className="legend-row">
            <span className="it"><span className="sw" style={{ background: "var(--success)" }} /> {stats.onTrackCount} on track</span>
            <span className="it"><span className="sw" style={{ background: "var(--warning-ink)" }} /> {stats.dueSoonCount} due soon</span>
            <span className="it"><span className="sw" style={{ background: "var(--danger)" }} /> {stats.atRiskCount} at risk</span>
          </div>

          <div style={{ marginTop: 18, paddingTop: 14, borderTop: "1px solid var(--border)" }}>
            <div className="caption muted" style={{ marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Needs attention first
            </div>
            {needsAttention.length === 0 ? (
              <p className="note" style={{ margin: 0 }}>Everyone&apos;s on track.</p>
            ) : (
              needsAttention.map((c) => {
                const u = clientUrgency(c);
                const cls = u === "danger" ? "chip-danger" : "chip-warning";
                return (
                  <div key={c.clientUserId} className="gd-row gd-between" style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}>
                    <span className="body-sm">{c.displayName}</span>
                    <span className={`chip ${cls}`}>{clientStatusLabel(c)}</span>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
