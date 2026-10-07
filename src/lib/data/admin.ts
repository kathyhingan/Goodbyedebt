import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Superadmin data-access layer. Backed by the admin_* security-definer RPCs
 * (supabase/migrations/0008_platform_roles_admin.sql), each gated by
 * is_platform_admin() inside the function body. Every call returns
 * not_platform_admin for anyone but Kathy.
 */

export interface AdminCoach {
  orgId: string;
  name: string;
  status: "pending" | "active" | "suspended";
  ownerEmail: string;
  ownerName: string;
  clientCount: number;
  pendingInvites: number;
  createdAt: string;
}

export interface AdminMember {
  userId: string;
  email: string;
  displayName: string;
  isCoach: boolean;
  isAdmin: boolean;
  debtCount: number;
  totalBalance: number;
  signupAt: string;
}

export interface PlatformStats {
  totalMembers: number;
  totalCoaches: number;
  activeCoaches: number;
  pendingCoaches: number;
  totalClients: number;
  totalDebts: number;
  totalDebtValue: number;
}

export async function isAdmin(supabase: SupabaseClient): Promise<boolean> {
  const { data, error } = await supabase.rpc("is_platform_admin");
  if (error) return false;
  return Boolean(data);
}

export async function listCoaches(supabase: SupabaseClient): Promise<AdminCoach[]> {
  const { data, error } = await supabase.rpc("admin_list_coaches");
  if (error) throw error;
  const rows = (data ?? []) as Record<string, unknown>[];
  return rows.map((r) => ({
    orgId: r.org_id as string,
    name: r.name as string,
    status: (r.status as AdminCoach["status"]) ?? "pending",
    ownerEmail: (r.owner_email as string) ?? "",
    ownerName: (r.owner_name as string) ?? "",
    clientCount: Number(r.client_count ?? 0),
    pendingInvites: Number(r.pending_invites ?? 0),
    createdAt: r.created_at as string,
  }));
}

export async function listMembers(supabase: SupabaseClient): Promise<AdminMember[]> {
  const { data, error } = await supabase.rpc("admin_list_members");
  if (error) throw error;
  const rows = (data ?? []) as Record<string, unknown>[];
  return rows.map((r) => ({
    userId: r.user_id as string,
    email: (r.email as string) ?? "",
    displayName: (r.display_name as string) ?? "",
    isCoach: Boolean(r.is_coach),
    isAdmin: Boolean(r.is_admin),
    debtCount: Number(r.debt_count ?? 0),
    totalBalance: Number(r.total_balance ?? 0),
    signupAt: r.signup_at as string,
  }));
}

export async function platformStats(supabase: SupabaseClient): Promise<PlatformStats | null> {
  const { data, error } = await supabase.rpc("admin_platform_stats");
  if (error) return null;
  const r = (data ?? [])[0] as Record<string, unknown> | undefined;
  if (!r) return null;
  return {
    totalMembers: Number(r.total_members ?? 0),
    totalCoaches: Number(r.total_coaches ?? 0),
    activeCoaches: Number(r.active_coaches ?? 0),
    pendingCoaches: Number(r.pending_coaches ?? 0),
    totalClients: Number(r.total_clients ?? 0),
    totalDebts: Number(r.total_debts ?? 0),
    totalDebtValue: Number(r.total_debt_value ?? 0),
  };
}

export async function setOrgStatus(
  supabase: SupabaseClient,
  orgId: string,
  status: "pending" | "active" | "suspended"
): Promise<{ ok: boolean; error?: string }> {
  const { data, error } = await supabase.rpc("admin_set_org_status", {
    org: orgId,
    new_status: status,
  });
  if (error) return { ok: false, error: error.message };
  const r = data as { ok: boolean; error?: string };
  return { ok: r.ok, error: r.error };
}
