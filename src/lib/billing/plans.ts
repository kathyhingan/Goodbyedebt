/**
 * Coach billing plans — the single source of truth shared by the /for-coaches
 * sales page, the checkout API, and the webhook. Prices live here (not in
 * Stripe) so the page can never drift from what checkout actually charges.
 *
 * One-time setup in Stripe is NOT required: checkout sessions are created with
 * inline price_data, so Stripe creates the line items on the fly. The only
 * Stripe setup is the secret key (and the webhook secret for fulfillment).
 */

export type PlanId = "lifetime" | "monthly" | "annual";

export interface Plan {
  id: PlanId;
  name: string;
  /** Stripe checkout mode: subscription for recurring, payment for one-time. */
  mode: "subscription" | "payment";
  interval: "month" | "year" | null;
  /** Amount in whole currency units (USD). */
  amount: number;
  tagline: string;
  blurb: string;
  highlight?: boolean;
  /** Only the lifetime plan is capped. */
  cap?: number;
}

export const PLANS: Plan[] = [
  {
    id: "lifetime",
    name: "Founding Lifetime",
    mode: "payment",
    interval: null,
    amount: 499,
    tagline: "One payment. Yours forever.",
    blurb:
      "The first 25 coaching practices get the whole platform for a single payment, locked in for the life of the product. Every phase we build lands in your console at no extra cost, forever.",
    highlight: true,
    cap: 25,
  },
  {
    id: "monthly",
    name: "Monthly",
    mode: "subscription",
    interval: "month",
    amount: 49,
    tagline: "Unlimited clients. Cancel anytime.",
    blurb:
      "The full console for a flat monthly fee. Every feature, unlimited clients, no per-client charges, no setup fees.",
  },
  {
    id: "annual",
    name: "Annual",
    mode: "subscription",
    interval: "year",
    amount: 490,
    tagline: "Two months free, billed yearly.",
    blurb:
      "Everything in Monthly at 10 months' price for 12. Locks your rate against any increase while you stay subscribed.",
  },
];

export function getPlan(id: string): Plan | undefined {
  return PLANS.find((p) => p.id === id);
}

/** Founder lifetime seats already claimed. */
export const FOUNDING_COACH_CAP = 25;
