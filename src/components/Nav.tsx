"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/config";

const LINKS = [
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
  // Hide the app nav on the public marketing landing page and the auth screen.
  if (path === "/" || path === "/login") return null;
  return (
    <nav className="nav">
      <div className="nav-inner">
        <div className="nav-links">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className={path === l.href ? "active" : ""}>
              {l.label}
            </Link>
          ))}
        </div>
        {isSupabaseConfigured && (
          <form action="/auth/signout" method="post">
            <button type="submit" className="link-btn">Sign out</button>
          </form>
        )}
      </div>
    </nav>
  );
}
