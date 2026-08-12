# Statement of Work
## Debt Payoff Optimization App

**Prepared for:** [Kathy / Project Owner]
**Prepared by:** [Dev Team / Agency Name]
**Date:** August 6, 2026
**Version:** 1.0 — Draft for Review

---

## 1. Project Overview

A mobile/web application that helps users pay off multiple debts as fast as possible while minimizing total interest paid. Users input all their debts (balance, APR, minimum payment, due date, billing date), and the app calculates and maintains an optimized repayment order — recommending exactly where extra payment dollars should go each cycle to reduce total debt and interest fastest.

This is not a budgeting app. It does one thing well: **debt payoff sequencing and optimization.**

---

## 2. Objectives

- Give users a single source of truth for all debts across multiple creditors/accounts
- Calculate the mathematically optimal payoff order (interest-minimizing) by default
- Let users toggle between strategies (interest-minimizing vs. momentum-based) without doing the math themselves
- Track due dates and billing dates so no payment is ever late, regardless of which account is prioritized
- Show users, in real numbers, how much interest and time they save vs. minimum-payments-only

---

## 3. Target User

Individuals managing 2+ debts (credit cards, personal loans, lines of credit, BNPL) who want a clear, non-negotiable payoff plan rather than a general budgeting tool. Primary use case: revolving high-interest debt (credit cards) mixed with fixed installment debt (loans).

### 3.1 Visual Design Direction
No existing brand/design system — greenfield. Direction: earth-tone greens paired with "money" green accents (the growth/wealth association, not a literal currency reference), avoiding a clinical or corporate-bank feel. Exact palette, typography, and component styling to be finalized during design phase, not locked in this SOW.

---

## 4. In-Scope Functionality

### 4.1 Debt Input & Management
- Add/edit/delete debt accounts, each with:
  - Creditor/account name
  - Current balance
  - Interest rate (APR)
  - Minimum payment amount
  - Payment due date
  - Billing/statement date
  - Debt type (credit card, personal loan, auto loan, student loan, BNPL, other)
  - Optional: promotional/introductory rate + expiration date
- **Data input method: manual entry and CSV upload only.** No bank-account linking (e.g., Plaid) in this or future scope — this is a deliberate product decision, not a placeholder.
  - Manual entry: add/edit one debt at a time via form
  - CSV upload: bulk-import or bulk-update multiple debts at once (template provided to user for correct formatting)
- **Re-upload consolidation (prevents duplicate debts):** each debt has a unique Account ID/nickname field assigned on first entry. On re-upload, the app matches incoming CSV rows against existing debts by this Account ID — a match updates the existing record (balance, rate, etc.); no match creates a new debt. Matching by creditor name alone is not used, since typos or naming inconsistency (e.g., "Chase" vs. "Chase Bank") would create false duplicates.
- Balance updates happen via manual re-entry or re-upload of an updated CSV — user stays in control of when and how their data is refreshed

### 4.2 Prioritization Engine (Core Feature)
- **Default strategy — Avalanche (interest-minimizing):** ranks debts by highest APR first; all extra payment dollars go to the highest-interest debt while minimums are maintained on all others
- **Alternate strategy — Snowball (balance-minimizing):** ranks by lowest balance first, for users who want quick wins for motivation
- **Hybrid/custom mode:** user-set weighting between "fastest debt-free date" and "lowest total interest paid," with the engine recalculating the order accordingly
- Engine recalculates automatically whenever: a balance changes, a new debt is added, an extra payment amount changes, or an interest rate changes (e.g., promo rate expiring)
- Clear "why this order" explanation shown to the user — not a black box

### 4.3 Due Date & Billing Date Tracking
- Calendar/timeline view of all upcoming due dates across every account
- Billing date tracking so users know when a statement closes (relevant for promo-rate and utilization timing)
- Reminders/notifications ahead of due dates — configurable (e.g., 5 days, 1 day)
- Payment sequencing logic must never recommend a plan that causes a missed minimum payment on any account — this is a hard constraint, not a preference

### 4.4 Payoff Projection & Reporting
- "Debt-free date" projection based on current plan
- Total interest to be paid under current plan vs. minimum-payments-only baseline (dollar amount and time saved, shown prominently)
- Progress dashboard: total debt remaining, monthly trend, per-account payoff timeline
- What-if simulator: user adjusts extra monthly payment amount and instantly sees updated debt-free date and interest saved

### 4.5 Payment Guidance (Not Payment Processing — see Out of Scope)
- Each cycle, app tells user exactly: pay $X minimum to Account A, $X minimum to Account B, $X extra to Account C (the priority account)
- One-tap "mark as paid" to keep the plan in sync with reality

### 4.6 Account & Data
- User authentication and secure account creation
- Data encryption at rest and in transit for all financial data
- Export functionality (CSV/PDF of current plan and progress)

---

## 5. Out of Scope (v1 and Beyond)

- **Bank account linking/syncing (e.g., Plaid or equivalent) — permanently out of scope, by decision, not deferred.** Data input is manual entry and CSV upload only. Rationale: avoids opaque usage-based API costs, PCI/security overhead, and ongoing engineering burden of maintaining a bank-sync integration (industry estimates put production-grade bank-sync integration at $80K–$150K+ in year-one engineering cost alone) — none of which is required to deliver the core value of the app, which is the prioritization engine.
- Actual payment processing / money movement (app is a planning and guidance tool, not a payment rail)
- Full budgeting/expense tracking (YNAB-style categorization of all spending)
- Credit score monitoring or credit report integration
- Debt settlement/negotiation features
- Multi-currency support
- Native bank account opening or debt consolidation loan origination

*(Non-bank-sync items above are candidates for a v2 roadmap. Bank sync is not — see rationale above.)*

---

## 6. Subscription / Monetization Model

| Tier | Includes |
|------|----------|
| **Free** | Up to 2 debts tracked, avalanche method only, manual balance entry |
| **Paid (monthly/annual)** | Unlimited debts, all strategies (avalanche/snowball/hybrid), CSV bulk import, what-if simulator, notifications, export |

---

## 7. Technical Requirements (High-Level)

- **Platform: Web app, built as a Progressive Web App (PWA).** This reverses an earlier native-iOS decision — given the priorities of low cost, fastest possible launch, and needing a non-technical-friendly testing process, a PWA wins on all three: no App Store account, no App Store review cycle, and testing is just opening a URL in Safari. "Add to Home Screen" gives an app-like icon and full-screen experience on iPhone without any native build.
- Native iOS (Swift/SwiftUI) remains the logical v2 once the core engine is validated with real users — not part of this SOW.
- Responsive design targeting iPhone Safari first (primary user device), scaling to desktop/other devices as a secondary concern
- Local authentication via biometric unlock where the browser/OS supports it (e.g., Face ID via WebAuthn on iOS Safari) — not guaranteed on all browsers, treated as an enhancement, not a hard requirement
- Backend calculation engine for amortization and prioritization logic (must handle recalculation in real time as inputs change)
- Push notifications via Web Push API for due-date reminders (support varies by browser — flag any iOS Safari limitations during technical design)
- CSV upload/import handled via standard browser file picker
- Data security: encryption at rest/in transit; this app handles sensitive financial data and should be built to standard financial-app security practices from day one

---

## 8. Deliverables

1. Functional MVP covering Sections 4.1–4.5 (manual entry, CSV upload with re-upload consolidation, prioritization engine, due date tracking, projections, payment guidance)
2. CSV import template + validation logic (handles malformed rows, missing fields, Account-ID-based matching on re-upload)
3. Admin/analytics view (basic usage metrics — not user-facing)
4. Deployed web app (PWA), installable to iPhone Home Screen, accessible via URL for easy non-technical testing
5. Documentation: data model, calculation logic reference, CSV template spec, API docs if applicable

---

## 9. Assumptions

- Interest calculations assume standard compound interest methodology per debt type; exact creditor compounding rules (daily vs. monthly) to be confirmed during technical design
- Since balances are manually entered or CSV-uploaded rather than synced, accuracy of "current balance" depends on how recently the user updated it — UI should surface a "last updated" timestamp per debt to keep this visible
- Since Account ID is the matching key for CSV re-uploads, the CSV template and any user-facing documentation must make this field's importance clear to avoid accidental duplicate entries
- As a PWA, there is no App Store review cycle to plan around — deployment is effectively immediate once development is complete, which directly supports the "as soon as possible" launch goal
- Native iOS remains a future option once the app has validated demand; this SOW does not include native development

---

## 10. Kickoff Decisions (Resolved)

| Question | Decision |
|---|---|
| CSV re-upload behavior | Re-upload supported; consolidated via unique Account ID matching to prevent duplicate debt entries (see 4.1) |
| Platform | Web app (PWA) — see Section 7 for full rationale |
| Apple Developer account | Not needed for v1 (no App Store submission for a PWA); revisit only if/when native iOS v2 is pursued |
| Design system | Greenfield — earth-tone green + money-green direction (see 3.1) |
| Launch date / budget | ASAP, cost-minimized — PWA choice directly serves this |
| Browser/iOS support target | Minimum iOS Safari 16.4+ (Apple's Web Push API baseline, released March 2023). Given current iOS adoption rates, this covers effectively all active iPhones. App must remain fully functional without push notifications on any device below this threshold — due-date reminders fall back to in-app/calendar view only, never a hard blocker. |

All kickoff questions are resolved. No open items remain — this SOW is ready to hand off for development.

---

## 11. Future Phase — Community Debt Relief Fund (Not in Current Build Scope)

> **Sequencing decision: build and validate the core debt-tracking app first. This phase begins only after v1 is live — not in parallel, not blocking v1 development or launch.**

### 11.1 Concept
A donor-directed community fund, inspired by the Kiva model: members can choose to help pay off a specific other member's debt, rather than the app or an algorithm selecting a recipient. Donors give with no expectation of financial return (pure donation, not investment or loan-with-interest) — this is the design principle that keeps the fund legally distinct from a paluwagan/investment scheme.

### 11.2 Why This Requires a Separate Legal Entity
Philippine law requires a Public Solicitation Permit from the DSWD before any person or organization collects donations from the public for a charitable purpose, regardless of channel (app, GCash, bank transfer). This permit is issued to registered non-stock, non-profit organizations — not to a for-profit subscription app. This means the debt-tracking app (for-profit, subscription-based) **cannot legally be the entity that collects or redistributes public donations.**

### 11.3 Structure (Pending Legal Confirmation)
| Layer | Role |
|---|---|
| The app (for-profit) | Debt tracking, prioritization engine — stays exactly as scoped in Sections 1–10, unchanged |
| A registered Philippine non-stock, non-profit foundation | Holds the DSWD Solicitation Permit, BIR registration; legal recipient/distributor of donations |
| Licensed payment gateway (e.g., PayMongo, GCash for Business, Maya) | Handles actual money movement — the app/foundation should not custody funds directly |
| Donor-choice fund listings | Verified members can list a specific debt for community funding; donors choose which listing to fund |

### 11.4 Recipient Verification (Required Before Any Listing Goes Live)
- **Verification method: billing statement upload or signed debt contract/loan agreement upload**, required before a member's debt listing is published for donor funding
- Manual review step before listing goes live — self-reported, unverified debt claims are not permitted given real donor money is involved

### 11.5 Legal Prerequisites Before Any Development Work Begins
- [ ] Register non-stock, non-profit foundation with SEC
- [ ] Obtain DSWD Public Solicitation Permit for the specific fund campaign
- [ ] BIR registration for the foundation (and optionally donee-institution accreditation, which may make donations tax-deductible for donors)
- [ ] Select and contract a licensed payment gateway partner
- [ ] Philippine securities/fintech lawyer review of the full structure and donor-facing language before public launch — donor communications must never imply an expectation of return, guaranteed reciprocity, or investment-like framing

### 11.6 Status
**Concept only. No development scope, timeline, or cost estimate attached until legal prerequisites (11.5) are complete.** Revisit this section once the core app (Sections 1–10) is built and live.

---

*This SOW defines functional scope only. Timeline and cost estimate to be added by whoever picks up development. Section 11 (Community Fund) is a documented future concept, not current build scope — see 11.6 for status.*
