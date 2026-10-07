"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getMyOrganization } from "@/lib/data/coach";

/**
 * Member app navigation, matching the design system's clean pattern:
 * a short primary row (Plan, Debts, Calendar) and an avatar menu carrying
 * everything else, per-role.
 *
 * Deliberate deviations from the design mockup, flagged not hidden:
 * - The design's first item is "Dashboard" — that page doesn't exist yet
 *   (the payoff overview at /plan doubles as it), so the primary row leads
 *   with "Plan". When the MemberDashboard ships, it takes this slot.
 * - The design's "Coach" item is the member's coach-connection surface,
 *   which isn't built; "Coach" here only appears for users who own a
 *   practice (their console lives at /coach). A member with no coach sees
 *   no Coach item at all.
 * - The design's bell icon has no notifications center behind it yet
 *   (due-date reminders surface in Calendar), so there's no bell.
 */

const PRIMARY = [
  { href: "/plan", label: "Plan" },
  { href: "/debts", label: "Debts" },
  { href: "/calendar", label: "Calendar" },
];

const SECONDARY = [
  { href: "/transactions", label: "Transactions" },
  { href: "/community", label: "Community" },
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

  // Who's signed in: initials for the avatar, plus role flags for which
  // links exist at all (Coach only for practice owners, Admin only for
  // the superadmin). Best-effort — never blocks the nav.
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
        const [admin, org] = await Promise.all([
          supabase.rpc("is_platform_admin"),
          getMyOrganization(supabase),
        ]);
        if (cancelled) return;
        setIsAdmin(Boolean(admin.data));
        setIsCoach(Boolean(org));
      } catch {
        /* never block the nav on this */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Hide the app nav on public marketing pages (landing, guides, auth);
  // those pages carry their own dark header/footer.
  if (path === "/" || path === "/login" || path === "/guides" || path.startsWith("/guides/")) return null;

  const roleLinks = [
    ...PRIMARY,
    ...(isCoach ? [{ href: "/coach", label: "Coach" }] : []),
    ...(isAdmin ? [{ href: "/admin", label: "Admin" }] : []),
  ];

  const renderLink = (l: { href: string; label: string }) => (
    <Link
      key={l.href}
      href={l.href}
      className={
        path === l.href || (l.href === "/coach" && path.startsWith("/coach/")) ? "active" : ""
      }
      onClick={() => {
        setOpen(false);
        setUserOpen(false);
      }}
    >
      {l.label}
    </Link>
  );

  const secondaryLinks = SECONDARY.map(renderLink);

  const signOutForm = isSupabaseConfigured ? (
    <form action="/auth/signout" method="post" className="nav-signout">
      <button type="submit" className="link-btn">Sign out</button>
    </form>
  ) : null;

  return (
    <nav className="nav">
      <div className="nav-inner">
        <Link href="/plan" className="nav-brand" onClick={() => setOpen(false)}>
          Goodbye<span>Debt</span>
        </Link>

        {/* Primary role links (desktop) / hamburger panel (mobile) */}
        <div className={`nav-links ${open ? "open" : ""}`}>
          {roleLinks.map(renderLink)}
          {/* Secondary items live in the avatar menu on desktop; the mobile
              hamburger panel carries them too (rendered from the same array,
              hidden on desktop by CSS). */}
          <div className="nav-secondary-group">
            {secondaryLinks}
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

        {/* Avatar + user menu (desktop only; mobile uses the hamburger) */}
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
              {secondaryLinks}
              {signOutForm}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
