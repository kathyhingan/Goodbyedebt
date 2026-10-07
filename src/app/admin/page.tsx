"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  isAdmin,
  listCoaches,
  listMembers,
  platformStats,
  setOrgStatus,
  type AdminCoach,
  type AdminMember,
  type PlatformStats,
} from "@/lib/data/admin";

function describeError(e: unknown, fallback: string): string {
  if (e && typeof e === "object" && "message" in e && typeof (e as { message: unknown }).message === "string") {
    return (e as { message: string }).message || fallback;
  }
  return fallback;
}

const money = (n: number) => `$${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
const shortDate = (iso: string) => {
  try {
    return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return iso;
  }
};

function statusChip(status: AdminCoach["status"]) {
  if (status === "active") return <span className="chip chip-success">active</span>;
  if (status === "pending") return <span className="chip chip-warning">pending</span>;
  return <span className="chip chip-danger">suspended</span>;
}

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [coaches, setCoaches] = useState<AdminCoach[]>([]);
  const [members, setMembers] = useState<AdminMember[]>([]);
  const [tab, setTab] = useState<"coaches" | "members">("coaches");

  const load = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const a = await isAdmin(supabase);
      setAdmin(a);
      if (a) {
        const [s, c, m] = await Promise.all([
          platformStats(supabase),
          listCoaches(supabase),
          listMembers(supabase),
        ]);
        setStats(s);
        setCoaches(c);
        setMembers(m);
      }
    } catch (e) {
      setError(describeError(e, "Failed to load."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleStatus(orgId: string, status: "active" | "suspended" | "pending") {
    setBusy(true);
    setError(null);
    try {
      const res = await setOrgStatus(createClient(), orgId, status);
      if (!res.ok) setError(res.error ?? "Couldn't update that practice.");
      await load();
    } catch (e) {
      setError(describeError(e, "Couldn't update that practice."));
    } finally {
      setBusy(false);
    }
  }

  if (!isSupabaseConfigured || loading) {
    return (
      <main className="container">
        <div className="brand"><h1>Admin</h1></div>
        <p className="tagline">{loading ? "Loading..." : "Backend not configured yet."}</p>
      </main>
    );
  }

  // Non-admins get a quiet wall, not an error screen or a data leak.
  if (!admin) {
    return (
      <main className="container" style={{ maxWidth: 420 }}>
        <div className="brand"><h1>Admin</h1></div>
        <p className="tagline">You don't have access to this area.</p>
      </main>
    );
  }

  return (
    <main className="container">
      <div className="brand">
        <h1>Admin <span className="chip chip-primary">superadmin</span></h1>
      </div>
      <p className="tagline">The whole platform: coaches, members, signups.</p>

      {error && <p className="warn">{error}</p>}

      {stats && (
        <section className="card">
          <div className="stat-grid">
            <div className="stat"><div className="label">Members</div><div className="value">{stats.totalMembers}</div></div>
            <div className="stat"><div className="label">Coaches</div><div className="value">{stats.totalCoaches}</div></div>
            <div className="stat">
              <div className="label">Active / pending practices</div>
              <div className="value">{stats.activeCoaches} / {stats.pendingCoaches}</div>
            </div>
            <div className="stat"><div className="label">Connected clients</div><div className="value">{stats.totalClients}</div></div>
            <div className="stat"><div className="label">Debts tracked</div><div className="value">{stats.totalDebts}</div></div>
            <div className="stat"><div className="label">Total debt on platform</div><div className="value" style={{ fontSize: "1.1rem" }}>{money(stats.totalDebtValue)}</div></div>
          </div>
        </section>
      )}

      <div className="controls">
        <button type="button" className={tab === "coaches" ? "primary" : ""} onClick={() => setTab("coaches")}>
          Coaches ({coaches.length})
        </button>
        <button type="button" className={tab === "members" ? "primary" : ""} onClick={() => setTab("members")}>
          Members ({members.length})
        </button>
      </div>

      {tab === "coaches" && (
        <section className="card">
          <h2 style={{ marginTop: 0, fontSize: "1.05rem" }}>All coach practices</h2>
          {coaches.length === 0 ? (
            <p className="note">No practices created yet.</p>
          ) : (
            coaches.map((c) => (
              <div key={c.orgId} className="timeline-item">
                <div>
                  <div style={{ fontWeight: 600 }}>
                    {c.name} {statusChip(c.status)}
                  </div>
                  <div className="muted" style={{ fontSize: "0.85rem" }}>
                    {c.ownerEmail}{c.ownerName ? ` — ${c.ownerName}` : ""}
                  </div>
                  <div className="note" style={{ marginTop: 2 }}>
                    {c.clientCount} client{c.clientCount === 1 ? "" : "s"}
                    {c.pendingInvites > 0 ? `, ${c.pendingInvites} pending invite${c.pendingInvites === 1 ? "" : "s"}` : ""}
                    {" "}— created {shortDate(c.createdAt)}
                  </div>
                </div>
                <div className="row-actions">
                  {c.status !== "active" && (
                    <button className="primary" style={{ padding: "4px 10px" }} disabled={busy} onClick={() => handleStatus(c.orgId, "active")}>
                      Approve
                    </button>
                  )}
                  {c.status === "active" && (
                    <button className="danger-btn" disabled={busy} onClick={() => handleStatus(c.orgId, "suspended")}>
                      Suspend
                    </button>
                  )}
                  {c.status === "suspended" && (
                    <button className="link-btn" disabled={busy} onClick={() => handleStatus(c.orgId, "pending")}>
                      Back to pending
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </section>
      )}

      {tab === "members" && (
        <section className="card">
          <h2 style={{ marginTop: 0, fontSize: "1.05rem" }}>All members</h2>
          {members.length === 0 ? (
            <p className="note">No members yet.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Debts</th>
                  <th>Signed up</th>
                </tr>
              </thead>
              <tbody>
                {members.map((m) => (
                  <tr key={m.userId}>
                    <td>
                      {m.email || <span className="muted">(no email)</span>}
                      {m.displayName ? <div className="note">{m.displayName}</div> : null}
                    </td>
                    <td>
                      {m.isAdmin ? <span className="chip chip-primary">superadmin</span> :
                        m.isCoach ? <span className="chip chip-neutral">coach</span> :
                        <span className="chip chip-neutral">member</span>}
                    </td>
                    <td>
                      {m.debtCount === 0 ? <span className="muted">—</span> :
                        <>{money(m.totalBalance)} <span className="muted">({m.debtCount})</span></>}
                    </td>
                    <td className="muted">{shortDate(m.signupAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      )}
    </main>
  );
}
