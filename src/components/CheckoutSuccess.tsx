"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

/**
 * Post-checkout confirmation, shown when the Stripe redirect lands back with
 * ?checkout=success.
 *
 * Renders as a full-width band at the very TOP of the page (between the nav
 * and the hero), not inside the pricing section further down. Stripe's
 * redirect is a fresh page load that starts scrolled to the top — a
 * confirmation placed mid-page needs the user to scroll down to ever see it,
 * which is exactly the gap Kathy hit: payment went through, page reloaded at
 * the hero, nothing told her it had worked.
 *
 * Three states, checked against the live session (not assumed):
 *  - Signed in: payment confirmed + the direct next step (create your practice
 *    or go to the console), since a paying coach who already has an account
 *    should never be told to sign up.
 *  - Signed out: payment confirmed + prompt to create the coach account —
 *    paying with the same email the webhook saw links it automatically.
 *  - Everything else (no param): renders nothing, page unchanged.
 */
function CheckoutSuccessInner() {
  const params = useSearchParams();
  const success = params.get("checkout") === "success";
  const plan = params.get("plan") ?? "";
  const [status, setStatus] = useState<"loading" | "signed-in" | "signed-out" | "anon">("loading");

  useEffect(() => {
    if (!success) return;
    if (!isSupabaseConfigured) {
      setStatus("anon");
      return;
    }
    (async () => {
      try {
        const { data } = await createClient().auth.getUser();
        setStatus(data.user ? "signed-in" : "signed-out");
      } catch {
        setStatus("anon");
      }
    })();
  }, [success]);

  if (!success) return null;

  const planLabel =
    plan === "lifetime" ? "Founding Lifetime" : plan === "monthly" ? "Monthly" : plan === "annual" ? "Annual" : "";

  return (
    <div
      style={{
        background: "linear-gradient(180deg, rgba(201,162,77,0.16), rgba(201,162,77,0.04))",
        borderBottom: "1px solid var(--gold)",
        padding: "28px 0",
      }}
    >
      <div className="fc-wrap">
        <div style={{ fontSize: 24, fontWeight: 800, color: "var(--gold)" }}>
          ✓ Payment confirmed{planLabel ? ` — ${planLabel}` : ""}
        </div>
        {status === "loading" && (
          <p style={{ margin: "10px 0 0", color: "var(--muted)", fontSize: 14 }}>Checking your account…</p>
        )}

        {status === "signed-out" && (
          <>
            <p style={{ margin: "12px 0 0", color: "var(--text)", fontSize: 15, lineHeight: 1.6, maxWidth: 640 }}>
              Your payment went through. The last step is yours: create your coach account with the
              same email you paid with, and your purchase is linked to your practice automatically.
            </p>
            <div className="fc-ctas" style={{ marginTop: 18 }}>
              <Link href="/login?mode=signup" className="fc-btn-primary">
                Create your coach account &rarr;
              </Link>
            </div>
          </>
        )}

        {status === "signed-in" && (
          <>
            <p style={{ margin: "12px 0 0", color: "var(--text)", fontSize: 15, lineHeight: 1.6, maxWidth: 640 }}>
              Your payment went through and is linked to your account. Set up your practice (or head
              straight to the console if it's already set up). Practice review usually completes
              within a day or two.
            </p>
            <div className="fc-ctas" style={{ marginTop: 18 }}>
              <Link href="/coach" className="fc-btn-primary">
                Go to your coach console &rarr;
              </Link>
            </div>
          </>
        )}

        {status === "anon" && (
          <p style={{ margin: "12px 0 0", color: "var(--muted)", fontSize: 14 }}>
            Your payment went through. Sign in to link it to your practice.
          </p>
        )}
      </div>
    </div>
  );
}

export function CheckoutSuccess() {
  return (
    <Suspense fallback={null}>
      <CheckoutSuccessInner />
    </Suspense>
  );
}
