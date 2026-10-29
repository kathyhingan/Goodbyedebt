"use client";

import { usePathname } from "next/navigation";

/**
 * Platform footer: the support contact inside the logged-in app.
 * Hidden on public marketing pages (they have their own footers):
 * landing, login, for-coaches, the guides hub and all guide articles.
 * Shown everywhere else (member app, coach console, admin) so members
 * and coaches both always have a path to support.
 *
 * Zero em dashes in this file (account rule).
 */

const FOOTER_STYLE: React.CSSProperties = {
  borderTop: "1px solid var(--line)",
  marginTop: 48,
  padding: "24px 16px",
  textAlign: "center",
  color: "var(--muted)",
  fontSize: 13,
};

export default function AppFooter() {
  const path = usePathname() || "/";
  if (
    path === "/" ||
    path === "/login" ||
    path === "/for-coaches" ||
    path === "/guides" ||
    path.startsWith("/guides/")
  ) {
    return null;
  }
  return (
    <footer style={FOOTER_STYLE}>
      <div>
        Questions, issues, or feedback? Email us at{" "}
        <a href="mailto:support@almostdebtfree.com" style={{ color: "var(--primary)" }}>
          support@almostdebtfree.com
        </a>
      </div>
    </footer>
  );
}
