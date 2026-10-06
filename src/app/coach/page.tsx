"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  getMyOrganization,
  createOrganization,
  listClients,
  listInvitations,
  inviteClient,
  revokeInvitation,
  removeClient,
  type Organization,
  type OrgClient,
  type Invitation,
} from "@/lib/data/coach";

/** Supabase/Postgrest errors carry a .message but aren't always a strict
 * `instanceof Error` — check structurally so the real database message
 * always reaches the screen instead of falling back to a generic one. */
function describeError(e: unknown, fallback: string): string {
  if (e && typeof e === "object" && "message" in e && typeof (e as { message: unknown }).message === "string") {
    const msg = (e as { message: string }).message;
    return msg || fallback;
  }
  return fallback;
}

const money = (n: number) => `$${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

export default function CoachPage() {
  const [loading, setLoading] = useState(true);
  const [org, setOrg] = useState<Organization | null>(null);
  const [clients, setClients] = useState<OrgClient[]>([]);
  const [invites, setInvites] = useState<Invitation[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const [practiceName, setPracticeName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteLink, setInviteLink] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const o = await getMyOrganization(supabase);
      setOrg(o);
      if (o) {
        const [c, i] = await Promise.all([listClients(supabase, o.id), listInvitations(supabase, o.id)]);
        setClients(c);
        setInvites(i);
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

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!practiceName.trim()) return;
    setBusy(true);
    setError(null);
    try {
      await createOrganization(createClient(), practiceName.trim());
      setPracticeName("");
      await load();
    } catch (err) {
      setError(describeError(err, "Couldn't create your practice."));
    } finally {
      setBusy(false);
    }
  }

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    if (!org || !inviteEmail.trim()) return;
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
    if (!org) return;
    if (!window.confirm("Remove this client from your roster? They keep their own data and account.")) return;
    setBusy(true);
    try {
      await removeClient(createClient(), org.id, clientUserId);
      await load();
    } finally {
      setBusy(false);
    }
  }

  if (!isSupabaseConfigured) {
    return (
      <main className="container">
        <div className="brand">
          <h1>
            Coach<span> Dashboard</span>
          </h1>
        </div>
        <p className="tagline">Backend not configured yet.</p>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="container">
        <div className="brand">
          <h1>
            Coach<span> Dashboard</span>
          </h1>
        </div>
        <p className="tagline">Loading...</p>
      </main>
    );
  }

  if (!org) {
    return (
      <main className="container" style={{ maxWidth: 480 }}>
        <div className="brand">
          <h1>
            Coach<span> Dashboard</span>
          </h1>
        </div>
        <p className="tagline">
          Set up your practice to invite clients and see their payoff plans in one place.
        </p>
        <section className="card">
          <form onSubmit={handleCreate}>
            <label htmlFor="practiceName">Practice name</label>
            <input
              id="practiceName"
              value={practiceName}
              onChange={(e) => setPracticeName(e.target.value)}
              placeholder="e.g. Maria Santos Financial Coaching"
              style={{ width: "100%", marginBottom: 12 }}
              required
            />
            <button type="submit" className="primary" disabled={busy}>
              {busy ? "Creating..." : "Create your practice"}
            </button>
          </form>
          {error && (
            <p className="warn" style={{ marginTop: 12 }}>
              {error}
            </p>
          )}
        </section>
      </main>
    );
  }

  const activeClients = clients.filter((c) => c.status === "active");
  const pendingInvites = invites.filter((i) => i.status === "pending");

  return (
    <main className="container">
      <div className="brand">
        <h1>{org.name}</h1>
      </div>
      <p className="tagline">Your coaching practice on Goodbye Debt.</p>

      <section className="card">
        <div className="stat-grid">
          <div className="stat">
            <div className="label">Active clients</div>
            <div className="value">{activeClients.length}</div>
          </div>
          <div className="stat">
            <div className="label">Pending invites</div>
            <div className="value">{pendingInvites.length}</div>
          </div>
        </div>
      </section>

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
            Send this link to your client yourself (text, email, however you'd normally reach them) —
            it&apos;s single-use and tied to that exact email:
            <br />
            <code style={{ wordBreak: "break-all" }}>{inviteLink}</code>
          </div>
        )}
        {error && (
          <p className="warn" style={{ marginTop: 12 }}>
            {error}
          </p>
        )}
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
        {activeClients.length === 0 ? (
          <p className="note">No clients yet — invite your first one above.</p>
        ) : (
          activeClients.map((c) => (
            <div key={c.clientUserId} className="timeline-item">
              <div>
                <Link href={`/coach/clients/${c.clientUserId}`} style={{ fontWeight: 700 }}>
                  {c.displayName}
                </Link>
                <div className="muted" style={{ fontSize: "0.85rem" }}>{c.email}</div>
                <div className="note" style={{ marginTop: 2 }}>
                  {c.debtCount === 0
                    ? "No debts added yet"
                    : `${money(c.totalBalance)} across ${c.debtCount} debt${c.debtCount === 1 ? "" : "s"}`}
                </div>
              </div>
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
