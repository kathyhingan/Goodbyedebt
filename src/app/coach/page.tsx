"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { useCoachOrg } from "@/lib/data/coachOrgContext";
import { listClients, clientUrgency, clientStatusLabel, sortByUrgency, type OrgClient } from "@/lib/data/coach";
import { DEMO_CLIENTS } from "@/lib/data/coachDemo";

const money = (n: number) => `$${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

function statusChip(c: OrgClient) {
  const u = clientUrgency(c);
  const cls = u === "danger" ? "chip-danger" : u === "warning" ? "chip-warning" : "chip-success";
  return <span className={`chip ${cls}`}>{clientStatusLabel(c)}</span>;
}

export default function CoachOverviewPage() {
  const { org } = useCoachOrg();
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState<OrgClient[]>([]);

  const load = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setClients(DEMO_CLIENTS);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      setClients(await listClients(createClient(), org.id));
    } finally {
      setLoading(false);
    }
  }, [org.id]);

  useEffect(() => {
    void load();
  }, [load]);

  const active = clients.filter((c) => c.status === "active");
  const needsAttention = active.filter((c) => clientUrgency(c) !== "success").length;

  const sorted = sortByUrgency(active);

  return (
    <main className="container" style={{ maxWidth: 1040 }}>
      <div className="gd-row gd-between" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 className="heading-lg" style={{ margin: 0 }}>Good day, {org.name}</h1>
          <p className="tagline" style={{ margin: "4px 0 0" }}>
            {active.length} client{active.length === 1 ? "" : "s"} actively working their plan.
          </p>
        </div>
        <Link href="/coach/clients" className="primary" style={{ padding: "10px 16px", borderRadius: "var(--radius-md)", background: "var(--primary)", color: "var(--on-primary)", textDecoration: "none", fontWeight: 600, fontSize: 13 }}>
          + Invite a client
        </Link>
      </div>

      <div className="stat-grid cols-4" style={{ margin: "20px 0" }}>
        <div className="stat"><div className="label">Active clients</div><div className="value">{active.length}</div></div>
        <div className="stat"><div className="label">Debts tracked</div><div className="value">{active.reduce((s, c) => s + c.debtCount, 0)}</div></div>
        <div className="stat"><div className="label">Total client balance</div><div className="value">{money(active.reduce((s, c) => s + c.totalBalance, 0))}</div></div>
        <div className="stat"><div className="label">Needs attention</div><div className="value">{needsAttention}</div></div>
      </div>

      <section className="card">
        <div className="gd-row gd-between" style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
          <span className="heading-sm">Your roster</span>
          <Link href="/coach/clients" className="label" style={{ color: "var(--primary)", textDecoration: "none" }}>
            Manage clients →
          </Link>
        </div>
        {loading ? (
          <p className="muted">Loading…</p>
        ) : sorted.length === 0 ? (
          <p className="note">No clients yet — <Link href="/coach/clients">invite your first one</Link>.</p>
        ) : (
          sorted.slice(0, 8).map((c) => (
            <Link key={c.clientUserId} href={`/coach/clients/${c.clientUserId}`} className="roster-row" style={{ textDecoration: "none", color: "inherit" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span className="avatar sm">{(c.displayName[0] || "?").toUpperCase()}</span>
                <span className="body">{c.displayName}</span>
              </div>
              <span className="body-sm muted">{c.debtCount} debt{c.debtCount === 1 ? "" : "s"}</span>
              <span className="figure">{money(c.totalBalance)}</span>
              {statusChip(c)}
            </Link>
          ))
        )}
      </section>
    </main>
  );
}
