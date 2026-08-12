# GoodbyeDebt — Debt Payoff Optimization App

A Progressive Web App that sequences and optimizes repayment across multiple
debts — telling users exactly where every extra dollar should go to be debt-free
faster and pay the least interest. Built to the
[Statement of Work](./docs/SOW.md) (v1.0).

> **This is a scaffold**, not the finished MVP. The core prioritization and
> projection engine (the SOW's highest-value piece) is fully implemented and
> tested; the surrounding app is a working foundation to build on.

## Tech stack

- **Next.js 14 (App Router) + React 18 + TypeScript** — one deployable that
  serves the PWA and hosts the calculation engine (SOW §7).
- **PWA**: web manifest + `themeColor`, `apple-web-app` meta for "Add to Home
  Screen" on iPhone Safari. Installable, no App Store cycle (SOW §7, §10).
- **Vitest** for the engine test suite.
- Security headers (HSTS, nosniff, frame-deny) set in `next.config.mjs` as a
  baseline for a financial-data app (SOW §4.6, §7).

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # run the engine + CSV test suite (17 tests)
npm run build      # production build / type-check
```

## What's implemented

| Area | Status | Where |
|---|---|---|
| Prioritization engine — avalanche / snowball / hybrid | ✅ Done + tested | `src/lib/engine/strategies.ts` |
| Payoff projection & amortization (months, interest, debt-free date) | ✅ Done + tested | `src/lib/engine/projection.ts` |
| Savings vs. minimums-only baseline | ✅ Done + tested | `projection.ts` → `compareToMinimumsOnly` |
| Promo-rate handling until expiry | ✅ Done + tested | `strategies.ts` → `effectiveApr` |
| "Never miss a minimum" hard constraint | ✅ Enforced in simulation | `projection.ts` |
| CSV import + validation | ✅ Done + tested | `src/lib/csv/parse.ts` |
| Account-ID re-upload consolidation (no false duplicates) | ✅ Done + tested | `parse.ts` → `mergeByAccountId` |
| CSV template spec | ✅ Done | `src/lib/csv/template.ts` |
| Dashboard / what-if UI (wired to engine, demo data) | ✅ Scaffold | `src/app/page.tsx` |
| PWA install (manifest, meta) | ✅ Scaffold | `public/manifest.webmanifest`, `layout.tsx` |

## Backend (Supabase)

Persistence and auth run on **Supabase** (Postgres + Auth). The schema lives in
`supabase/migrations/0001_init.sql` — a `debts` table plus `reminder_settings`
and `push_subscriptions`, all under **Row Level Security** so a user can only
ever touch their own rows (SOW §4.6). Data is encrypted at rest by Supabase
storage encryption and in transit over HTTPS.

To connect:

1. Apply `supabase/migrations/0001_init.sql` to your project (Supabase SQL
   editor or `supabase db push`).
2. Copy `.env.example` → `.env.local` and fill in `NEXT_PUBLIC_SUPABASE_URL`
   and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from your project's API settings.
3. (Optional) For Web Push, generate VAPID keys (`npx web-push
   generate-vapid-keys`) and set the `*_VAPID_*` vars.

Without env vars the app still boots in **demo mode** (sample data, no auth) so
previews never break.

## Features wired in this build

- **Auth** — email/password sign-in / sign-up (`/login`), session refresh + route
  guarding via `src/middleware.ts`, sign-out.
- **Manual entry** — add / edit / delete debts on `/debts`.
- **CSV** — upload (Account-ID consolidation), download template, export
  (`/debts`).
- **Calendar** — upcoming due-date timeline on `/calendar` (SOW §4.3).
- **Reminders** — configurable lead days + Web Push opt-in on `/settings`, with
  in-app calendar fallback when push is unsupported (SOW §10). Service worker at
  `public/sw.js`.

## Next up (not yet built)

- Scheduled push **delivery** — a cron/Edge Function that reads `reminder_settings`
  and sends Web Push on lead days (client subscription + SW receiver are done).
- Export to PDF; progress dashboard trends, per-account timelines (SOW §4.4).
- Real app icons at `public/icons/icon-192.png` / `icon-512.png`.
- Free vs. paid tier gating (SOW §6).

## The engine (core value)

The engine is a pure, dependency-free TypeScript module — deterministic and
fully unit-tested, so it can be validated independently and reused by a future
native iOS v2 (SOW §7).

```ts
import { projectPayoff, compareToMinimumsOnly, prioritize } from "@/lib/engine";

const plan = projectPayoff(debts, { name: "avalanche" }, { monthlyExtra: 300 });
// → { order, monthsToDebtFree, totalInterestPaid, debtFreeDate, perDebt, unpayable }

const savings = compareToMinimumsOnly(debts, { name: "avalanche" }, { monthlyExtra: 300 });
// → { interestSaved, monthsSaved, plan, baseline }
```

Interest accrues monthly at `APR/12`; minimums are always paid first on every
account (hard constraint), then remaining budget flows to debts in strategy
order, with freed-up minimums rolling into the priority debt as accounts close.

## Out of scope (per SOW §5)

Bank-account linking (Plaid) is permanently out of scope by product decision.
No payment processing, budgeting, or credit-score features. See the SOW for
rationale.
