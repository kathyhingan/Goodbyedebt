"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getMyOrganization, createOrganization, type Organization } from "@/lib/data/coach";
import { CoachOrgProvider } from "@/lib/data/coachOrgContext";
import { DEMO_ORG } from "@/lib/data/coachDemo";

function describeError(e: unknown, fallback: string): string {
  if (e && typeof e === "object" && "message" in e && typeof (e as { message: unknown }).message === "string") {
    return (e as { message: string }).message || fallback;
  }
  return fallback;
}

const TABS = [
  { href: "/coach", label: "Overview", exact: true },
  { href: "/coach/clients", label: "Clients", exact: false },
  { href: "/coach/analytics", label: "Analytics", exact: true },
  { href: "/coach/messages", label: "Messages", exact: true },
];

/**
 * Shared chrome for the whole Coach console (design's 4-tab structure:
 * Overview / Clients / Analytics / Messages). Owns the one-time org load and
 * the pending/suspended/no-practice gating so individual pages don't repeat
 * it — see useCoachOrg() for how pages read the loaded org.
 *
 * The main app Nav hides itself on /coach/* routes; this tab strip is the
 * console's own nav, matching the design's "badge-coach COACH CONSOLE" +
 * Overview/Clients/Analytics/Messages pattern.
 */
export default function CoachLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [org, setOrg] = useState<Organization | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [practiceName, setPracticeName] = useState("");

  const load = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      setOrg(await getMyOrganization(createClient()));
    } catch (e) {
      setError(describeError(e, "Failed to load your practice."));
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

  if (!isSupabaseConfigured) {
    return (
      <CoachOrgProvider org={DEMO_ORG} reload={() => {}}>
        <div className="console-topbar">
          <div className="console-topbar-inner">
            <Link href="/coach" className="nav-brand">
              Goodbye<span>Debt</span>
            </Link>
            <span className="badge-coach">COACH CONSOLE</span>
            <div className="console-tabs">
              {TABS.map((t) => {
                const active = t.exact ? pathname === t.href : pathname.startsWith(t.href);
                return (
                  <Link key={t.href} href={t.href} className={active ? "active" : ""}>
                    {t.label}
                  </Link>
                );
              })}
            </div>
            <div className="avatar" style={{ marginLeft: "auto" }}>DC</div>
          </div>
        </div>
        <div className="banner" style={{ margin: "12px 24px", maxWidth: 960 }}>
          Demo mode — showing a sample practice. Connect the backend to manage real clients.
        </div>
        {children}
      </CoachOrgProvider>
    );
  }

  if (loading) {
    return (
      <main className="container">
        <div className="brand"><h1>Coach console</h1></div>
        <p className="tagline">Loading...</p>
      </main>
    );
  }

  if (!org) {
    return (
      <main className="container" style={{ maxWidth: 480 }}>
        <div className="brand"><h1>Coach console</h1></div>
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
          {error && <p className="warn" style={{ marginTop: 12 }}>{error}</p>}
        </section>
        <section className="card">
          <p className="note" style={{ margin: 0 }}>
            New practices start in review. You can set up while you wait, but inviting clients and
            seeing their plans unlock once the platform team approves your practice — usually within
            a day or two.
          </p>
        </section>
      </main>
    );
  }

  if (org.status !== "active") {
    return (
      <main className="container" style={{ maxWidth: 480 }}>
        <div className="brand"><h1>{org.name}</h1></div>
        <p className="tagline">Your coaching practice on Goodbye Debt.</p>
        <section className="card">
          <div style={{ marginBottom: 8 }}>
            {org.status === "pending" ? (
              <span className="chip chip-warning">in review</span>
            ) : (
              <span className="chip chip-danger">suspended</span>
            )}
          </div>
          {org.status === "pending" ? (
            <p style={{ margin: 0 }}>
              Your practice is waiting for platform approval. Inviting clients and seeing their
              plans unlock once it&apos;s approved — usually within a day or two.
            </p>
          ) : (
            <p style={{ margin: 0 }}>
              This practice has been suspended. Your clients keep their own data and accounts. If
              you think this is a mistake, contact the platform team.
            </p>
          )}
        </section>
      </main>
    );
  }

  return (
    <CoachOrgProvider org={org} reload={load}>
      <div className="console-topbar">
        <div className="console-topbar-inner">
          <Link href="/coach" className="nav-brand">
            Goodbye<span>Debt</span>
          </Link>
          <span className="badge-coach">COACH CONSOLE</span>
          <div className="console-tabs">
            {TABS.map((t) => {
              const active = t.exact ? pathname === t.href : pathname.startsWith(t.href);
              return (
                <Link key={t.href} href={t.href} className={active ? "active" : ""}>
                  {t.label}
                </Link>
              );
            })}
          </div>
          <div className="avatar" style={{ marginLeft: "auto" }} title={org.name}>
            {org.name.slice(0, 2).toUpperCase()}
          </div>
        </div>
      </div>
      {children}
    </CoachOrgProvider>
  );
}
