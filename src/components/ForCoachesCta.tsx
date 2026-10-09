"use client";

import { useEffect, useState } from "react";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { PlanId } from "@/lib/billing/plans";

/**
 * The interactive half of the /for-coaches pricing section: reads the live
 * founding-seats counter, sends each plan's button to the checkout API, and
 * surfaces real errors (sold out, Stripe unconfigured) instead of a dead
 * button.
 */
export function ForCoachesCta({ plans }: { plans: PlanId[] }) {
  const [seats, setSeats] = useState<number | null>(null);
  const [busy, setBusy] = useState<PlanId | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    let cancelled = false;
    (async () => {
      try {
        const { createClient } = await import("@/lib/supabase/client");
        const supabase = createClient();
        const { data, error } = await supabase.rpc("founding_coach_count");
        if (!error && !cancelled && typeof data === "number") {
          setSeats(data);
        }
      } catch {
        /* counter is best-effort; the page works without it */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    // The plan buttons live in the server-rendered markup; expose the handler
    // globally so their inline wiring can reach React state from there.
    (window as unknown as { __fcCheckout?: (plan: PlanId) => void }).__fcCheckout = (plan) => {
      void checkout(plan);
    };
    // Wire the buttons once on mount (server component renders them; this
    // client component owns their behavior).
    const buttons = document.querySelectorAll<HTMLButtonElement>(".fc-tier-btn[data-plan]");
    const handlers = new Map<HTMLButtonElement, () => void>();
    buttons.forEach((btn) => {
      const h = () => void checkout(btn.dataset.plan as PlanId);
      handlers.set(btn, h);
      btn.addEventListener("click", h);
    });
    return () => {
      handlers.forEach((h, btn) => btn.removeEventListener("click", h));
      delete (window as unknown as { __fcCheckout?: unknown }).__fcCheckout;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [busy]);

  async function checkout(plan: PlanId) {
    setErr(null);
    setBusy(plan);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (!res.ok || !data?.url) {
        setErr(data?.error ?? "Couldn't start checkout. Please try again.");
        setBusy(null);
        return;
      }
      // Stripe hosts the page — send the browser there.
      window.location.href = data.url;
    } catch {
      setErr("Couldn't reach the checkout. Check your connection and try again.");
      setBusy(null);
    }
  }

  return (
    <div>
      {seats != null && (
        <p style={{ margin: "12px 0 0", fontWeight: 700, color: "var(--gold)", fontSize: 13, letterSpacing: "0.04em" }}>
          {seats} of 25 founding seats claimed.
        </p>
      )}
      {err && (
        <p style={{ margin: "12px 0 0", color: "#ff9d7a", fontWeight: 600, fontSize: 13.5 }}>
          {err}
        </p>
      )}
    </div>
  );
}
