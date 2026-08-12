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

## Next up (not yet built)

- Persistence + user auth and encryption at rest (SOW §4.6) — a DB/backend
  (e.g. Supabase/Postgres) behind the engine; manual entry & CSV upload UIs.
- Due-date calendar view + Web Push reminders with in-app fallback (SOW §4.3, §10).
- Export (CSV/PDF), progress dashboard trends, per-account timelines (SOW §4.4).
- App icons at `public/icons/icon-192.png` / `icon-512.png` (referenced by the
  manifest; add real assets in the design phase).
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
