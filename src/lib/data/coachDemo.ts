import type { Organization, OrgClient } from "./coach";
import type { Message, InboxEntry, Appointment, MilestoneRow } from "./messaging";

/**
 * Local-only demo data for the Coach console, used exactly when
 * !isSupabaseConfigured — the same convention every other page in the app
 * follows (useDebts' DEMO array, usePayments' DEMO array, etc.) so the
 * console is clickable locally and in preview builds without a backend.
 */

export const DEMO_ORG: Organization = {
  id: "demo-org",
  name: "Demo Coaching Practice",
  ownerUserId: "demo-coach",
  brandColor: null,
  logoUrl: null,
  status: "active",
  createdAt: "2026-01-10T00:00:00Z",
};

export const DEMO_CLIENTS: OrgClient[] = [
  {
    orgId: "demo-org",
    clientUserId: "demo-client-1",
    status: "active",
    addedAt: "2026-01-15T00:00:00Z",
    displayName: "Jordan Cruz",
    email: "jordan@example.com",
    totalBalance: 18420,
    debtCount: 3,
    missedCount: 0,
    daysUntilDue: 6,
  },
  {
    orgId: "demo-org",
    clientUserId: "demo-client-2",
    status: "active",
    addedAt: "2026-02-02T00:00:00Z",
    displayName: "Priya Santos",
    email: "priya@example.com",
    totalBalance: 31900,
    debtCount: 4,
    missedCount: 0,
    daysUntilDue: 2,
  },
  {
    orgId: "demo-org",
    clientUserId: "demo-client-3",
    status: "active",
    addedAt: "2026-03-20T00:00:00Z",
    displayName: "Marcus Lee",
    email: "marcus@example.com",
    totalBalance: 44180,
    debtCount: 5,
    missedCount: 2,
    daysUntilDue: null,
  },
  {
    orgId: "demo-org",
    clientUserId: "demo-client-4",
    status: "active",
    addedAt: "2026-04-01T00:00:00Z",
    displayName: "Anna Reyes",
    email: "anna@example.com",
    totalBalance: 5220,
    debtCount: 1,
    missedCount: 0,
    daysUntilDue: 20,
  },
];

export const DEMO_INBOX: InboxEntry[] = DEMO_CLIENTS.map((c, i) => ({
  clientUserId: c.clientUserId,
  displayName: c.displayName,
  email: c.email,
  lastBody: ["Sounds good — free after 3pm Thursday.", "Can we move my call?", "Sorry, missed this month", "Thank you!!"][i],
  lastAt: "2026-10-0" + (i + 1) + "T10:00:00Z",
  lastFromMe: i === 0,
  unreadCount: i === 1 || i === 2 ? 1 : 0,
}));

export const DEMO_THREAD: Message[] = [
  { id: "m1", orgId: "demo-org", clientUserId: "demo-client-1", senderUserId: "demo-coach", body: "Great month — you beat your snowball target by $140.", readAt: null, createdAt: "2026-10-01T09:00:00Z" },
  { id: "m2", orgId: "demo-org", clientUserId: "demo-client-1", senderUserId: "demo-coach", body: "Let's talk renewal timing this week?", readAt: null, createdAt: "2026-10-01T09:01:00Z" },
  { id: "m3", orgId: "demo-org", clientUserId: "demo-client-1", senderUserId: "demo-client-1", body: "Sounds good — free after 3pm Thursday.", readAt: "2026-10-01T10:00:00Z", createdAt: "2026-10-01T09:30:00Z" },
];

export const DEMO_APPOINTMENTS: Appointment[] = [
  { id: "a1", orgId: "demo-org", clientUserId: "demo-client-1", title: "Call — Jordan Cruz", scheduledAt: "2026-10-08T15:00:00Z" },
  { id: "a2", orgId: "demo-org", clientUserId: "demo-client-2", title: "Check-in — Priya Santos", scheduledAt: "2026-10-09T10:30:00Z" },
];

export const DEMO_MILESTONES: MilestoneRow[] = [
  { kind: "debt_threshold", accountId: "demo-card", threshold: 50, achievedAt: "2026-10-03T00:00:00Z" },
  { kind: "streak", accountId: null, threshold: 6, achievedAt: "2026-09-12T00:00:00Z" },
];

export const DEMO_CLIENT_DEBTS = [
  { accountId: "demo-card", creditor: "Security Bank Credit Card", balance: 7860, apr: 24, minimumPayment: 280, debtType: "credit_card" as const },
  { accountId: "demo-install", creditor: "BDO Installment Card", balance: 4120, apr: 19.5, minimumPayment: 210, debtType: "credit_card" as const },
  { accountId: "demo-loan", creditor: "Personal Loan — Family", balance: 6440, apr: 0, minimumPayment: 300, debtType: "personal_loan" as const },
];

export const DEMO_CLIENT_PAYMENTS = [
  { accountId: "demo-card", amount: 280, paidOn: "2026-10-01", note: "" },
  { accountId: "demo-install", amount: 420, paidOn: "2026-09-29", note: "" },
  { accountId: "demo-card", amount: 300, paidOn: "2026-09-02", note: "" },
];
