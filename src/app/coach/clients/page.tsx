"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { useCoachOrg } from "@/lib/data/coachOrgContext";
import {
  listClients,
  listInvitations,
  inviteClient,
  revokeInvitation,
  removeClient,
  clientUrgency,
  clientStatusLabel,
  sortByUrgency,
  type OrgClient,
  type Invitation,
} from "@/lib/data/coach";
import { DEMO_CLIENTS } from "@/lib/data/coachDemo";

function describeError(e: unknown, fallback: string): string {
  if (e && typeof e === "object" && "message" in e && typeof (e as { message: unknown }).message === "string") {
    return (e as { message: string }).message || fallback;
  }
  return fallback;
}

const money = (n: number) => `$${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

function statusChip(c: OrgClient) {
  const u = clientUrgency(c);
  const cls = u === "danger" ? "chip-danger" : u === "warning" ? "chip-warning" : "chip-success";
  return <span className={`chip ${cls}`}>{clientStatusLabel(c)}</span>;
}

export default function CoachClientsPage() {
  const { org } = useCoachOrg();
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState<OrgClient[]>([]);
  const [invites, setInvites] = useState<Invitation[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteLink, setInviteLink] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setClients(DEMO_CLIENTS);
      setInvites([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const [c, i] = await Promise.all([listClients(supabase, org.id), listInvitations(supabase, org.id)]);
      setClients(c);
      setInvites(i);
    } catch (e) {
      setError(describeError(e, "Failed to load."));
    } finally {
      setLoading(false);
    }
  }, [org.id]);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    setBusy(true);
    setError(null);
    setInviteLink(null);
    try {
      const link = await inviteClient(createClient(), org.id, inviteEmail.trim());
      setInviteLink(link);
      setInviteEmail("");
      await load();
    } catch (err) {
      setError(describeError(err, "Couldn't send that invite."));
    } finally {
      setBusy(false);
    }
  }

  async function handleRevoke(id: string) {
    setBusy(true);
    try {
      await revokeInvitation(createClient(), id);
      await load();
    } finally {
      setBusy(false);
    }
  }

  async function handleRemove(clientUserId: string) {
    if (!window.confirm("Remove this client from your roster? They keep their own data and account.")) return;
    setBusy(true);
    try {
      await removeClient(createClient(), org.id, clientUserId);
      await load();
    } finally {
      setBusy(false);
    }
  }

  const activeClients = sortByUrgency(clients.filter((c) => c.status === "active"));
  const pendingInvites = invites.filter((i) => i.status === "pending");

  return (
    <main className="container" style={{ maxWidth: 1040 }}>
      <div className="brand"><h1>Clients</h1></div>
      <p className="tagline">{activeClients.length} active, {pendingInvites.length} pending invite{pendingInvites.length === 1 ? "" : "s"}.</p>

      <section className="card">
        <h2 style={{ marginTop: 0, fontSize: "1.05rem" }}>Invite a client</h2>
        <p className="note">
          They sign in (or create an account) with this exact email, then land connected to you
          automatically. Read-only on your side — you see their plan, you never edit their numbers.
        </p>
        <form onSubmit={handleInvite} className="row-actions" style={{ marginTop: 10 }}>
          <input
            type="email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="client@email.com"
            required
            style={{ flex: 1, minWidth: 220 }}
          />
          <button type="submit" className="primary" disabled={busy}>
            Invite
          </button>
        </form>
        {inviteLink && (
          <div className="banner" style={{ marginTop: 12 }}>
            Send this link to your client yourself (text, email, however you&apos;d normally reach them) —
            it&apos;s single-use and tied to that exact email:
            <br />
            <code style={{ wordBreak: "break-all" }}>{inviteLink}</code>
          </div>
        )}
        {error && <p className="warn" style={{ marginTop: 12 }}>{error}</p>}
      </section>

      {pendingInvites.length > 0 && (
        <section className="card">
          <h2 style={{ marginTop: 0, fontSize: "1.05rem" }}>Pending invites</h2>
          {pendingInvites.map((inv) => (
            <div key={inv.id} className="timeline-item">
              <div>
                {inv.email} <span className="pill soon">pending</span>
              </div>
              <button className="danger-btn" onClick={() => handleRevoke(inv.id)} disabled={busy}>
                Revoke
              </button>
            </div>
          ))}
        </section>
      )}

      <section className="card">
        <h2 style={{ marginTop: 0, fontSize: "1.05rem" }}>Your clients</h2>
        {loading ? (
          <p className="muted">Loading…</p>
        ) : activeClients.length === 0 ? (
          <p className="note">No clients yet — invite your first one above.</p>
        ) : (
          activeClients.map((c) => (
            <div key={c.clientUserId} className="client-card">
              <span className="avatar">{(c.displayName[0] || "?").toUpperCase()}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <Link href={`/coach/clients/${c.clientUserId}`} style={{ fontWeight: 700, color: "var(--ink)" }}>
                  {c.displayName}
                </Link>
                <div className="muted" style={{ fontSize: "0.85rem" }}>{c.email}</div>
                <div className="note" style={{ marginTop: 2 }}>
                  {c.debtCount === 0
                    ? "No debts added yet"
                    : `${money(c.totalBalance)} across ${c.debtCount} debt${c.debtCount === 1 ? "" : "s"}`}
                </div>
              </div>
              {statusChip(c)}
              <button className="danger-btn" onClick={() => handleRemove(c.clientUserId)} disabled={busy}>
                Remove
              </button>
            </div>
          ))
        )}
      </section>
    </main>
  );
}
