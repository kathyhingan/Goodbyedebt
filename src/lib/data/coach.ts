import type { SupabaseClient } from "@supabase/supabase-js";
import type { Debt } from "../engine/types";
import { rowToDebt, type DebtRow } from "./mapping";

/**
 * Data-access layer for the coach/client white-label feature. Backed by
 * Supabase with RLS (see supabase/migrations/0006_coach_client_layer.sql and
 * 0008_platform_roles_admin.sql).
 * Phase 1: coaches get read-only access to linked clients' data — no write
 * paths here by design. Practices start 'pending' and only an approved
 * (status='active') practice can invite clients or read their data.
 */

export interface Organization {
  id: string;
  name: string;
  ownerUserId: string;
  brandColor: string | null;
  logoUrl: string | null;
  /** 'pending' until the superadmin approves; 'suspended' blocks the coach features. */
  status: "pending" | "active" | "suspended";
  createdAt: string;
}

export interface OrgClient {
  orgId: string;
  clientUserId: string;
  status: "active" | "removed";
  addedAt: string;
  displayName: string;
  email: string;
  totalBalance: number;
  debtCount: number;
  /** Cumulative missed cycles across their debts (a due_date sitting in the
   * past means that many monthly cycles were never advanced — see the RPC
   * comment in 0009_messaging_notes_milestones.sql). 0 = nothing overdue. */
  missedCount: number;
  /** Days until their nearest upcoming due date, or null if none/all overdue. */
  daysUntilDue: number | null;
}

/** Danger (missed payments) > warning (due within a week) > success —
 * the sort/status order the design spec requires everywhere a roster shows
 * urgency ("needs attention" always sorts danger -> warning -> success). */
export type ClientUrgency = "danger" | "warning" | "success";

export function clientUrgency(c: Pick<OrgClient, "missedCount" | "daysUntilDue">): ClientUrgency {
  if (c.missedCount > 0) return "danger";
  if (c.daysUntilDue != null && c.daysUntilDue <= 7) return "warning";
  return "success";
}

export function clientStatusLabel(c: Pick<OrgClient, "missedCount" | "daysUntilDue">): string {
  if (c.missedCount > 0) return `${c.missedCount} missed payment${c.missedCount === 1 ? "" : "s"}`;
  if (c.daysUntilDue != null && c.daysUntilDue <= 7) return "Due soon";
  return "On track";
}

/**
 * Roster sort the design spec requires wherever a list shows urgency:
 * danger -> warning -> success first, then worse-off first within a tier
 * (more missed cycles, or a sooner due date). One implementation so Overview
 * and Analytics can't drift apart.
 */
export function sortByUrgency<T extends Pick<OrgClient, "missedCount" | "daysUntilDue">>(rows: T[]): T[] {
  const order = { danger: 0, warning: 1, success: 2 } as const;
  return [...rows].sort((a, b) => {
    const ua = clientUrgency(a);
    const ub = clientUrgency(b);
    if (order[ua] !== order[ub]) return order[ua] - order[ub];
    if (ua === "danger") return b.missedCount - a.missedCount;
    if (ua === "warning") return (a.daysUntilDue ?? 99) - (b.daysUntilDue ?? 99);
    return 0;
  });
}

export interface Invitation {
  id: string;
  orgId: string;
  email: string;
  token: string;
  status: "pending" | "accepted" | "revoked";
  createdAt: string;
}

interface OrgRow {
  id: string;
  name: string;
  owner_user_id: string;
  brand_color: string | null;
  logo_url: string | null;
  status: "pending" | "active" | "suspended";
  created_at: string;
}

function rowToOrg(row: OrgRow): Organization {
  return {
    id: row.id,
    name: row.name,
    ownerUserId: row.owner_user_id,
    brandColor: row.brand_color,
    logoUrl: row.logo_url,
    status: row.status ?? "pending",
    createdAt: row.created_at,
  };
}

/** The organization the current user owns/belongs to, or null if they're not a coach. */
export async function getMyOrganization(supabase: SupabaseClient): Promise<Organization | null> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return null;
  // A user can only own one practice in Phase 1 — keeps onboarding and the
  // dashboard unambiguous. Multiple practices per coach is a later phase.
  const { data, error } = await supabase
    .from("organizations")
    .select("*")
    .eq("owner_user_id", userData.user.id)
    .maybeSingle();
  if (error) throw error;
  return data ? rowToOrg(data as OrgRow) : null;
}

/** Creates a new coaching practice with the current user as owner. */
export async function createOrganization(
  supabase: SupabaseClient,
  name: string
): Promise<Organization> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error("Not signed in.");
  // Plain insert — no .select().single() chained onto it. Chaining one asks
  // Postgres to hand the new row straight back (RETURNING), and RLS checks
  // that against the SELECT policy (is_org_member) *before* the AFTER INSERT
  // bootstrap trigger (which makes the creator a member) has finished. The
  // creator isn't a member yet at that instant, so the RETURNING clause gets
  // rejected and the whole insert errors out — even though the row itself
  // would otherwise be created fine. Insert first, then re-fetch in a
  // separate query once the trigger has had a chance to run.
  const { error: insertError } = await supabase
    .from("organizations")
    .insert({ name, owner_user_id: userData.user.id });
  if (insertError) throw insertError;

  const org = await getMyOrganization(supabase);
  if (!org) throw new Error("Practice created, but couldn't load it back — refresh the page.");
  return org;
}

/** Active + removed clients linked to this org, with email, display name,
 * and a quick debt total — all from one security-definer RPC (see
 * supabase/migrations/0007_coach_roster_summary.sql) so the roster doesn't
 * need a round trip per client. */
export async function listClients(
  supabase: SupabaseClient,
  orgId: string
): Promise<OrgClient[]> {
  const { data, error } = await supabase.rpc("get_my_clients", { check_org_id: orgId });
  if (error) throw error;
  const rows = (data ?? []) as {
    client_user_id: string;
    status: "active" | "removed";
    added_at: string;
    email: string;
    display_name: string;
    total_balance: number | string;
    debt_count: number;
    missed_count: number;
    days_until_due: number | null;
  }[];
  return rows.map((r) => ({
    orgId,
    clientUserId: r.client_user_id,
    status: r.status,
    addedAt: r.added_at,
    displayName: r.display_name || r.email,
    email: r.email,
    totalBalance: Number(r.total_balance),
    debtCount: r.debt_count,
    missedCount: r.missed_count ?? 0,
    daysUntilDue: r.days_until_due ?? null,
  }));
}

/** Pending/revoked invitations for this org (accepted ones become clients). */
export async function listInvitations(
  supabase: SupabaseClient,
  orgId: string
): Promise<Invitation[]> {
  const { data, error } = await supabase
    .from("invitations")
    .select("id, org_id, email, token, status, created_at")
    .eq("org_id", orgId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((r) => ({
    id: r.id,
    orgId: r.org_id,
    email: r.email,
    token: r.token,
    status: r.status,
    createdAt: r.created_at,
  }));
}

/** Creates an invite for a client email. Returns the shareable accept link. */
export async function inviteClient(
  supabase: SupabaseClient,
  orgId: string,
  email: string
): Promise<string> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error("Not signed in.");
  const { data, error } = await supabase
    .from("invitations")
    .insert({ org_id: orgId, email: email.trim().toLowerCase(), invited_by: userData.user.id })
    .select("token")
    .single();
  if (error) throw error;
  const token = (data as { token: string }).token;
  const base = typeof window !== "undefined" ? window.location.origin : "https://www.almostdebtfree.com";
  return `${base}/invite/accept?token=${token}`;
}

/** Revokes a pending invite (does not remove an already-accepted client). */
export async function revokeInvitation(supabase: SupabaseClient, invitationId: string): Promise<void> {
  const { error } = await supabase
    .from("invitations")
    .update({ status: "revoked" })
    .eq("id", invitationId);
  if (error) throw error;
}

/** Soft-removes a client from the roster (coach-side; client keeps their own data). */
export async function removeClient(
  supabase: SupabaseClient,
  orgId: string,
  clientUserId: string
): Promise<void> {
  const { error } = await supabase
    .from("organization_clients")
    .update({ status: "removed" })
    .eq("org_id", orgId)
    .eq("client_user_id", clientUserId);
  if (error) throw error;
}

/** Called by the invited user after they're authenticated, from the accept-invite page. */
export async function acceptInvitation(
  supabase: SupabaseClient,
  token: string
): Promise<{ ok: boolean; error?: string; orgId?: string }> {
  const { data, error } = await supabase.rpc("accept_invitation", { invite_token: token });
  if (error) return { ok: false, error: error.message };
  const result = data as { ok: boolean; error?: string; org_id?: string };
  return { ok: result.ok, error: result.error, orgId: result.org_id };
}

/** The org(s) the current user is connected to as a CLIENT (not as the coach). */
export async function getMyCoachLink(
  supabase: SupabaseClient
): Promise<{ orgId: string; orgName: string } | null> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return null;
  const { data, error } = await supabase
    .from("organization_clients")
    .select("org_id, organizations(name)")
    .eq("client_user_id", userData.user.id)
    .eq("status", "active")
    .maybeSingle();
  if (error || !data) return null;
  const row = data as unknown as { org_id: string; organizations: { name: string } | null };
  return { orgId: row.org_id, orgName: row.organizations?.name ?? "your coach" };
}

/** Read-only: a specific client's debts, for the coach drill-in view. RLS
 * (is_coach_of) enforces that this only returns rows if the caller is
 * actually that client's coach — the explicit filter here just keeps the
 * result scoped to one client instead of every linked client at once. */
export async function listDebtsForClient(
  supabase: SupabaseClient,
  clientUserId: string
): Promise<Debt[]> {
  const { data, error } = await supabase
    .from("debts")
    .select("*")
    .eq("user_id", clientUserId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data as DebtRow[]).map(rowToDebt);
}

export interface ClientPayment {
  accountId: string;
  amount: number;
  paidOn: string;
  note: string;
}

export async function listPaymentsForClient(
  supabase: SupabaseClient,
  clientUserId: string
): Promise<ClientPayment[]> {
  const { data, error } = await supabase
    .from("payments")
    .select("account_id, amount, paid_on, note")
    .eq("user_id", clientUserId)
    .order("paid_on", { ascending: false })
    .limit(50);
  if (error) throw error;
  return (data ?? []).map((r) => ({
    accountId: r.account_id,
    amount: Number(r.amount),
    paidOn: r.paid_on,
    note: r.note ?? "",
  }));
}

// ---------------------------------------------------------------------------
// Portfolio analytics (Coach console, Analytics tab)
// ---------------------------------------------------------------------------

export interface PortfolioStats {
  totalReduced: number;
  activeThisWeek: number;
  activeTotal: number;
  avgProgress: number;
  onTrackCount: number;
  dueSoonCount: number;
  atRiskCount: number;
}

export async function getPortfolioStats(supabase: SupabaseClient, orgId: string): Promise<PortfolioStats | null> {
  const { data, error } = await supabase.rpc("get_portfolio_stats", { check_org_id: orgId });
  if (error) throw error;
  const r = (data ?? [])[0] as Record<string, unknown> | undefined;
  if (!r) return null;
  return {
    totalReduced: Number(r.total_reduced ?? 0),
    activeThisWeek: Number(r.active_this_week ?? 0),
    activeTotal: Number(r.active_total ?? 0),
    avgProgress: Number(r.avg_progress ?? 0),
    onTrackCount: Number(r.on_track_count ?? 0),
    dueSoonCount: Number(r.due_soon_count ?? 0),
    atRiskCount: Number(r.at_risk_count ?? 0),
  };
}

export interface MonthlyAmount {
  monthLabel: string;
  amount: number;
}

export async function getPortfolioMonthly(supabase: SupabaseClient, orgId: string): Promise<MonthlyAmount[]> {
  const { data, error } = await supabase.rpc("get_portfolio_monthly", { check_org_id: orgId });
  if (error) throw error;
  const rows = (data ?? []) as Record<string, unknown>[];
  return rows.map((r) => ({ monthLabel: r.month_label as string, amount: Number(r.amount ?? 0) }));
}
