"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

/**
 * Post-checkout confirmation, shown over the pricing section when the Stripe
 * redirect lands back with ?checkout=success.
 *
 * Three states, checked against the live session (not assumed):
 *  - Signed in: payment confirmed + the direct next step (create your practice
 *    or go to the console), since a paying coach who already has an account
 *    should never be told to sign up.
 *  - Signed out: payment confirmed + prompt to create the coach account, with
 *    the email they paid with prefilled into the signup form's redirect.
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
        border: "1px solid var(--gold)",
        background: "rgba(201,162,77,0.08)",
        borderRadius: 16,
        padding: 28,
        marginTop: 24,
      }}
    >
      <div style={{ fontSize: 22, fontWeight: 800, color: "var(--gold)" }}>
        ✓ Payment confirmed{planLabel ? ` — ${planLabel}` : ""}
      </div>
      {status === "loading" && (
        <p style={{ margin: "10px 0 0", color: "var(--muted)", fontSize: 14 }}>Checking your account…</p>
      )}

      {status === "signed-out" && (
        <>
          <p style={{ margin: "12px 0 0", color: "var(--text)", fontSize: 15, lineHeight: 1.6 }}>
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
          <p style={{ margin: "12px 0 0", color: "var(--text)", fontSize: 15, lineHeight: 1.6 }}>
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
  );
}

export function CheckoutSuccess() {
  return (
    <Suspense fallback={null}>
      <CheckoutSuccessInner />
    </Suspense>
  );
}
