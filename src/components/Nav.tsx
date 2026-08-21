"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/config";

const LINKS = [
  { href: "/roadmap", label: "Roadmap" },
  { href: "/plan", label: "Plan" },
  { href: "/debts", label: "Debts" },
  { href: "/calendar", label: "Calendar" },
  { href: "/transactions", label: "Transactions" },
  { href: "/community", label: "Community" },
  { href: "/profile", label: "Profile" },
  { href: "/settings", label: "Settings" },
];

export function Nav() {
  const path = usePathname();
  const [open, setOpen] = useState(false);

  // Hide the app nav on the public marketing landing page and the auth screen.
  if (path === "/" || path === "/login") return null;

  return (
    <nav className="nav">
      <div className="nav-inner">
        <Link href="/plan" className="nav-brand" onClick={() => setOpen(false)}>
          Goodbye<span>Debt</span>
        </Link>
        <button
          type="button"
          className="nav-toggle"
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "✕" : "☰"}
        </button>
        <div className={`nav-links ${open ? "open" : ""}`}>
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={path === l.href ? "active" : ""}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          {isSupabaseConfigured && (
            <form action="/auth/signout" method="post" className="nav-signout">
              <button type="submit" className="link-btn">Sign out</button>
            </form>
          )}
        </div>
      </div>
    </nav>
  );
}
