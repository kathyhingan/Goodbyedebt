import { NextResponse, type NextRequest } from "next/server";
import { getPlan, PLANS } from "@/lib/billing/plans";
import { isSupabaseConfigured, SUPABASE_URL, SUPABASE_ANON_KEY } from "@/lib/supabase/config";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

/**
 * Creates a Stripe Checkout session for a coach plan and returns the redirect
 * URL. Called from the /for-coaches page's "Get started" buttons.
 *
 * Two gates, two different postures:
 *  - Payment/Stripe does the gating for WHO can pay (anyone with a card).
 *  - The platform still approves the practice separately in /admin — paying
 *    does not auto-activate roster/client access, because a paid-but-unknown
 *    practice is exactly the shape of a fraudulent coach account. The webhook
 *    records the payment and claims a founding seat; activation stays manual.
 *
 * Prices are inline (price_data) — no need to pre-create products in Stripe.
 * Founding-lifetime capacity is checked here AND again in the webhook, so a
 * race between two buyers can't oversell the 25 seats.
 */
export async function POST(request: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json(
      { error: "Stripe isn't configured yet. Set STRIPE_SECRET_KEY to enable checkout." },
      { status: 503 }
    );
  }

  let planId = "";
  try {
    const body = await request.json();
    planId = String(body?.plan ?? "");
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
  const plan = getPlan(planId);
  if (!plan) {
    return NextResponse.json(
      { error: `Unknown plan. Choose one of: ${PLANS.map((p) => p.id).join(", ")}.` },
      { status: 400 }
    );
  }

  // Founding-seat capacity check (best effort here; enforced for real in the
  // webhook where the payment is actually recorded).
  if (isSupabaseConfigured && plan.cap) {
    try {
      const admin = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      const { data, error } = await admin.rpc("founding_coach_count");
      if (!error && typeof data === "number" && data >= plan.cap) {
        return NextResponse.json(
          { error: "All founding lifetime seats are claimed. Choose Monthly or Annual instead." },
          { status: 409 }
        );
      }
    } catch {
      /* fall through to checkout; the webhook enforces the cap for real */
    }
  }

  const origin = request.headers.get("origin") ?? new URL(request.url).origin;

  // Who is paying? The session-protected page passes the logged-in user's id
  // and email so the webhook can match the purchase to their practice. When
  // unconfigured/unauthenticated the page sends no metadata — the webhook
  // then matches by email only.
  let supabaseUserId: string | null = null;
  let userEmail: string | null = null;
  if (isSupabaseConfigured) {
    try {
      const { createServerClient } = await import("@supabase/ssr");
      const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll() {
            /* read-only context; no session refresh needed for a POST */
          },
        },
      });
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        supabaseUserId = data.user.id;
        userEmail = data.user.email ?? null;
      }
    } catch {
      /* not signed in — proceed without metadata */
    }
  }

  const bodyParams = new URLSearchParams();
  bodyParams.set("mode", plan.mode);
  bodyParams.set("success_url", `${origin}/for-coaches?checkout=success&plan=${plan.id}`);
  bodyParams.set("cancel_url", `${origin}/for-coaches?checkout=cancelled`);
  bodyParams.set("client_reference_id", plan.id);
  if (supabaseUserId) {
    bodyParams.set("metadata[supabase_user_id]", supabaseUserId);
  }
  if (userEmail) {
    bodyParams.set("customer_email", userEmail);
  }

  if (plan.mode === "subscription") {
    bodyParams.set("line_items[0][quantity]", "1");
    bodyParams.set("line_items[0][price_data][currency]", "usd");
    bodyParams.set("line_items[0][price_data][unit_amount]", String(plan.amount * 100));
    bodyParams.set("line_items[0][price_data][recurring][interval]", plan.interval!);
    bodyParams.set("line_items[0][price_data][product_data][name]", `GoodbyeDebt for Coaches — ${plan.name}`);
    bodyParams.set("line_items[0][price_data][product_data][description]", plan.tagline);
  } else {
    bodyParams.set("line_items[0][quantity]", "1");
    bodyParams.set("line_items[0][price_data][currency]", "usd");
    bodyParams.set("line_items[0][price_data][unit_amount]", String(plan.amount * 100));
    bodyParams.set("line_items[0][price_data][product_data][name]", `GoodbyeDebt for Coaches — ${plan.name} (Founding)`);
    bodyParams.set("line_items[0][price_data][product_data][description]", plan.tagline);
  }

  try {
    const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: bodyParams,
    });
    const data = await res.json();
    if (!res.ok) {
      const msg = data?.error?.message ?? `Stripe returned ${res.status}`;
      return NextResponse.json({ error: msg }, { status: 502 });
    }
    return NextResponse.json({ url: data.url });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Couldn't reach Stripe." },
      { status: 502 }
    );
  }
}
