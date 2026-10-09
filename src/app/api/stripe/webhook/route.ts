import { NextResponse, type NextRequest } from "next/server";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

/**
 * Stripe webhook — the fulfillment half of coach billing.
 *
 * Records a paid plan against the buyer's practice and claims a founding seat
 * for the lifetime plan. Activation of roster/client access is NOT done here:
 * paying and being approved are two independent gates (organizations.status),
 * and the superadmin approves practices in /admin — that decision stays human,
 * since a paid-but-unknown practice is exactly the shape of a fraudulent
 * coach account.
 *
 * Matching purchase -> practice: the buyer pays while logged in, so the
 * checkout session carries their Supabase user id via the client's metadata
 * (set at session-creation time). Matches by that first, falling back to the
 * email they paid with when there's no session (they bought logged out) —
 * in which case the payment is recorded against the email and linked when
 * the practice is created/next seen.
 *
 * The signature is verified against STRIPE_WEBHOOK_SECRET so a forged request
 * can never grant itself a plan.
 */
export async function POST(request: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!secretKey || !webhookSecret || !supabaseUrl || !serviceKey) {
    return NextResponse.json({ error: "Webhook not configured." }, { status: 503 });
  }

  const payload = await request.text();
  const signature = request.headers.get("stripe-signature") ?? "";

  // Verify the signature over the raw body (Stripe's scheme: v1 = HMAC-SHA256
  // of `${timestamp}.${payload}`), with a 5-minute tolerance.
  const parts = signature.split(",").map((s) => s.split("="));
  const timestamp = parts.find((p) => p[0] === "t")?.[1];
  const v1 = parts.find((p) => p[0] === "v1")?.[1];
  if (!timestamp || !v1) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  }
  const age = Math.abs(Date.now() / 1000 - Number(timestamp));
  if (age > 300) {
    return NextResponse.json({ error: "Signature timestamp outside tolerance." }, { status: 400 });
  }
  const { createHmac } = await import("node:crypto");
  const expected = createHmac("sha256", webhookSecret).update(`${timestamp}.${payload}`).digest("hex");
  if (!timingSafeEqualHex(expected, v1)) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  let event: {
    type: string;
    data: { object: Record<string, unknown> };
  };
  try {
    event = JSON.parse(payload);
  } catch {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  // Only fulfillment events matter here; anything else is acknowledged.
  if (
    event.type !== "checkout.session.completed" &&
    event.type !== "invoice.payment_succeeded" &&
    event.type !== "invoice.payment_failed" &&
    event.type !== "customer.subscription.deleted"
  ) {
    return NextResponse.json({ received: true });
  }

  const admin = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
  const obj = event.data.object;

  try {
    if (event.type === "checkout.session.completed") {
      const planId = String(obj.client_reference_id ?? "");
      if (!["lifetime", "monthly", "annual"].includes(planId)) {
        return NextResponse.json({ received: true });
      }
      const details = obj.customer_details as { email?: string } | null | undefined;
      const email = typeof details?.email === "string" ? details.email : null;
      const customerId = typeof obj.customer === "string" ? obj.customer : null;
      const subscriptionId = typeof obj.subscription === "string" ? obj.subscription : null;
      const meta = obj.metadata as { supabase_user_id?: string } | null | undefined;
      const supabaseUserId = typeof meta?.supabase_user_id === "string" ? meta.supabase_user_id : null;

      const orgId = await findOrgForBuyer(admin, supabaseUserId, email);
      if (!orgId) {
        // Paid but no practice yet (or the email doesn't match one): record it
        // against the email so it can be linked manually in /admin. Never
        // silently drop a real payment.
        await admin.from("coach_billing_pending").insert({
          email,
          stripe_customer_id: customerId,
          stripe_subscription_id: subscriptionId,
          plan: planId,
          supabase_user_id: supabaseUserId,
        });
        return NextResponse.json({ received: true, linked: false });
      }

      await recordPlan(admin, orgId, planId, customerId, subscriptionId);
      return NextResponse.json({ received: true, linked: true });
    }

    if (event.type === "invoice.payment_succeeded") {
      // Subscription renewal — keep the period end fresh.
      const subscriptionId = typeof obj.subscription === "string" ? obj.subscription : null;
      if (subscriptionId) {
        await admin
          .from("coach_billing")
          .update({ billing_state: "active", current_period_end: periodEnd(obj) })
          .eq("stripe_subscription_id", subscriptionId);
      }
      return NextResponse.json({ received: true });
    }

    if (event.type === "invoice.payment_failed") {
      const subscriptionId = typeof obj.subscription === "string" ? obj.subscription : null;
      if (subscriptionId) {
        await admin
          .from("coach_billing")
          .update({ billing_state: "past_due" })
          .eq("stripe_subscription_id", subscriptionId);
      }
      return NextResponse.json({ received: true });
    }

    if (event.type === "customer.subscription.deleted") {
      const subscriptionId = typeof obj.id === "string" ? obj.id : null;
      if (subscriptionId) {
        await admin
          .from("coach_billing")
          .update({ billing_state: "canceled" })
          .eq("stripe_subscription_id", subscriptionId);
      }
      return NextResponse.json({ received: true });
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    // Stripe retries on non-2xx — return 500 so a transient Supabase failure
    // is retried rather than dropped.
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Webhook handler failed." },
      { status: 500 }
    );
  }
}

/** Finds the practice a purchase belongs to: by Supabase user id first, then email. */
async function findOrgForBuyer(
  admin: SupabaseClient,
  supabaseUserId: string | null,
  email: string | null
): Promise<string | null> {
  // By the authenticated user's org (owner_user_id), when they paid logged in.
  if (supabaseUserId) {
    const { data } = await admin
      .from("organizations")
      .select("id")
      .eq("owner_user_id", supabaseUserId)
      .limit(1);
    if (data && data.length > 0) return data[0].id;
  }
  // By the email they paid with, when there's no session.
  if (email) {
    const { data: users, error: lookupErr } = await admin.rpc("admin_find_user_id_by_email", { lookup_email: email });
    if (!lookupErr && users && users.length > 0) {
      const row = users[0] as { user_id?: string };
      const uid = row?.user_id;
      if (uid) {
        const { data: byUser } = await admin
          .from("organizations")
          .select("id")
          .eq("owner_user_id", uid)
          .limit(1);
        if (byUser && byUser.length > 0) return byUser[0].id;
      }
    }
  }
  return null;
}

async function recordPlan(
  admin: SupabaseClient,
  orgId: string,
  planId: string,
  customerId: string | null,
  subscriptionId: string | null
) {
  // Founding-seat claim: atomic, so two concurrent checkouts can't take the
  // same seat. The unique (plan, founding_seat) pair plus the count check
  // keeps the 25-seat cap honest under a race.
  if (planId === "lifetime") {
    const { data: count, error } = await admin.rpc("founding_coach_count");
    if (error) throw error;
    if (typeof count === "number" && count >= 25) {
      throw new Error("All founding lifetime seats are claimed.");
    }
    const seat = (typeof count === "number" ? count : 0) + 1;
    const { error: upsertErr } = await admin.from("coach_billing").upsert(
      {
        org_id: orgId,
        plan: "lifetime",
        billing_state: "active",
        stripe_customer_id: customerId,
        founding_seat: seat,
        paid_at: new Date().toISOString(),
      },
      { onConflict: "org_id" }
    );
    if (upsertErr) throw upsertErr;
    return;
  }

  const { error } = await admin.from("coach_billing").upsert(
    {
      org_id: orgId,
      plan: planId,
      billing_state: "active",
      stripe_customer_id: customerId,
      stripe_subscription_id: subscriptionId,
      paid_at: new Date().toISOString(),
    },
    { onConflict: "org_id" }
  );
  if (error) throw error;
}

/** period_end from an invoice object (lines[].period.end, unix seconds). */
function periodEnd(obj: Record<string, unknown>): string | null {
  try {
    const lines = obj.lines as { data?: { period?: { end?: number } }[] } | undefined;
    const end = lines?.data?.[0]?.period?.end;
    return typeof end === "number" ? new Date(end * 1000).toISOString() : null;
  } catch {
    return null;
  }
}

/** Constant-time hex comparison (no early-exit timing leak). */
function timingSafeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
