"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getMyOrganization, getMyCoachLink } from "@/lib/data/coach";

/**
 * Member app navigation. Primary row is every core, everyday destination —
 * Kathy's call: Dashboard (new landing), Plan and Community both get their
 * own place, Debts stays its own page (the original design folded debts
 * into Dashboard/Plan with no standalone nav item — we deviate on purpose).
 * "My Coach" (a member's own connection to their assigned coach) joins the
 * primary row only once they actually have one.
 *
 * Role destinations — the Coach console and Admin — live in the avatar menu,
 * not the primary row: they're not everyday member navigation, and the Coach
 * console has its own full-width tab chrome once you're inside it (see
 * src/app/coach/layout.tsx), so Nav hides entirely on /coach/* routes.
 *
 * Naming note: the design mockup called the member's own coach-chat screen
 * "Coach" and the practice-owner's console also "Coach" — two different
 * audiences, same word. Resolved here as "My Coach" (member) vs. "Coach
 * console" (practice owner) so they're never ambiguous in the UI.
 */

const PRIMARY = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/plan", label: "Plan" },
  { href: "/debts", label: "Debts" },
  { href: "/calendar", label: "Calendar" },
  { href: "/community", label: "Community" },
];

const SECONDARY = [
  { href: "/transactions", label: "Transactions" },
  { href: "/guides", label: "Guides" },
  { href: "/roadmap", label: "Roadmap" },
  { href: "/profile", label: "Profile" },
  { href: "/settings", label: "Settings" },
];

export function Nav() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [initials, setInitials] = useState<string | null>(null);
  const [isCoach, setIsCoach] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [hasCoach, setHasCoach] = useState(false);

  // Who's signed in: initials for the avatar, plus role/relationship flags
  // for which links exist at all. Best-effort — never blocks the nav.
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    let cancelled = false;
    (async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase.auth.getUser();
        if (!data.user || cancelled) return;
        const prefix = (data.user.email ?? "").split("@")[0] || "m";
        const parts = prefix.split(/[._-]+/).filter(Boolean);
        const ini = ((parts[0]?.[0] ?? "m") + (parts[1]?.[0] ?? "")).toUpperCase();
        setInitials(ini || "M");
        const [admin, org, coachLink] = await Promise.all([
          supabase.rpc("is_platform_admin"),
          getMyOrganization(supabase),
          getMyCoachLink(supabase),
        ]);
        if (cancelled) return;
        setIsAdmin(Boolean(admin.data));
        setIsCoach(Boolean(org));
        setHasCoach(Boolean(coachLink));
      } catch {
        /* never block the nav on this */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Hide on public marketing pages (their own dark header/footer) and on the
  // whole Coach console (it has its own chrome — see coach/layout.tsx).
  if (
    path === "/" ||
    path === "/login" ||
    path === "/guides" ||
    path.startsWith("/guides/") ||
    path.startsWith("/coach")
  ) {
    return null;
  }

  const primaryLinks = [...PRIMARY, ...(hasCoach ? [{ href: "/my-coach", label: "My Coach" }] : [])];
  const secondaryLinks = [
    ...SECONDARY,
    ...(isCoach ? [{ href: "/coach", label: "Coach console" }] : []),
    ...(isAdmin ? [{ href: "/admin", label: "Admin" }] : []),
  ];

  const renderLink = (l: { href: string; label: string }) => (
    <Link
      key={l.href}
      href={l.href}
      className={path === l.href ? "active" : ""}
      onClick={() => {
        setOpen(false);
        setUserOpen(false);
      }}
    >
      {l.label}
    </Link>
  );

  const signOutForm = isSupabaseConfigured ? (
    <form action="/auth/signout" method="post" className="nav-signout">
      <button type="submit" className="link-btn">Sign out</button>
    </form>
  ) : null;

  return (
    <nav className="nav">
      <div className="nav-inner">
        <Link href="/dashboard" className="nav-brand" onClick={() => setOpen(false)}>
          Goodbye<span>Debt</span>
        </Link>

        <div className={`nav-links ${open ? "open" : ""}`}>
          {primaryLinks.map(renderLink)}
          {/* Secondary items live in the avatar menu on desktop; the mobile
              hamburger panel carries them too (rendered from the same array,
              hidden on desktop by CSS). */}
          <div className="nav-secondary-group">
            {secondaryLinks.map(renderLink)}
            {signOutForm}
          </div>
        </div>

        <button
          type="button"
          className="nav-toggle"
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "✕" : "☰"}
        </button>

        {initials && (
          <div className="nav-user">
            <button
              type="button"
              className="nav-avatar"
              aria-label="Account menu"
              aria-expanded={userOpen}
              onClick={() => setUserOpen((v) => !v)}
            >
              {initials}
            </button>
            <div className={`nav-user-panel ${userOpen ? "open" : ""}`}>
              {secondaryLinks.map(renderLink)}
              {signOutForm}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
