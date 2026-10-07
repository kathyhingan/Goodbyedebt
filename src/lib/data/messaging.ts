import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Data-access for coach<->member messaging, private coach notes, the coach's
 * appointment schedule, and milestones. Backed by
 * supabase/migrations/0009_messaging_notes_milestones.sql.
 */

export interface Message {
  id: string;
  orgId: string;
  clientUserId: string;
  senderUserId: string;
  body: string;
  readAt: string | null;
  createdAt: string;
}

interface MessageRow {
  id: string;
  org_id: string;
  client_user_id: string;
  sender_user_id: string;
  body: string;
  read_at: string | null;
  created_at: string;
}

function rowToMessage(r: MessageRow): Message {
  return {
    id: r.id,
    orgId: r.org_id,
    clientUserId: r.client_user_id,
    senderUserId: r.sender_user_id,
    body: r.body,
    readAt: r.read_at,
    createdAt: r.created_at,
  };
}

/** Full thread for one (org, client) pair, oldest first. RLS scopes this to
 * the client themselves or their active coach. */
export async function listThread(
  supabase: SupabaseClient,
  orgId: string,
  clientUserId: string
): Promise<Message[]> {
  const { data, error } = await supabase
    .from("coach_messages")
    .select("*")
    .eq("org_id", orgId)
    .eq("client_user_id", clientUserId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data as MessageRow[]).map(rowToMessage);
}

export async function sendMessage(
  supabase: SupabaseClient,
  orgId: string,
  clientUserId: string,
  body: string
): Promise<void> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error("Not signed in.");
  const { error } = await supabase.from("coach_messages").insert({
    org_id: orgId,
    client_user_id: clientUserId,
    sender_user_id: userData.user.id,
    body: body.trim(),
  });
  if (error) throw error;
}

/** Marks every client-authored message in this thread read (coach side). */
export async function markThreadRead(
  supabase: SupabaseClient,
  orgId: string,
  clientUserId: string
): Promise<void> {
  const { error } = await supabase.rpc("mark_thread_read", { check_org_id: orgId, client: clientUserId });
  if (error) throw error;
}

export interface InboxEntry {
  clientUserId: string;
  displayName: string;
  email: string;
  lastBody: string | null;
  lastAt: string | null;
  lastFromMe: boolean;
  unreadCount: number;
}

/** Coach's Messages tab: one row per client, last message + unread count. */
export async function getCoachInbox(supabase: SupabaseClient, orgId: string): Promise<InboxEntry[]> {
  const { data, error } = await supabase.rpc("get_coach_inbox", { check_org_id: orgId });
  if (error) throw error;
  const rows = (data ?? []) as Record<string, unknown>[];
  return rows.map((r) => ({
    clientUserId: r.client_user_id as string,
    displayName: (r.display_name as string) || (r.email as string) || "",
    email: (r.email as string) ?? "",
    lastBody: (r.last_body as string) ?? null,
    lastAt: (r.last_at as string) ?? null,
    lastFromMe: Boolean(r.last_from_me),
    unreadCount: Number(r.unread_count ?? 0),
  }));
}

// ---------------------------------------------------------------------------
// Coach notes — single private note per (org, client)
// ---------------------------------------------------------------------------

export async function getCoachNote(
  supabase: SupabaseClient,
  orgId: string,
  clientUserId: string
): Promise<string> {
  const { data, error } = await supabase
    .from("coach_notes")
    .select("body")
    .eq("org_id", orgId)
    .eq("client_user_id", clientUserId)
    .maybeSingle();
  if (error) throw error;
  return (data as { body: string } | null)?.body ?? "";
}

export async function saveCoachNote(
  supabase: SupabaseClient,
  orgId: string,
  clientUserId: string,
  body: string
): Promise<void> {
  const { error } = await supabase
    .from("coach_notes")
    .upsert({ org_id: orgId, client_user_id: clientUserId, body, updated_at: new Date().toISOString() });
  if (error) throw error;
}

// ---------------------------------------------------------------------------
// Appointments — the coach's schedule
// ---------------------------------------------------------------------------

export interface Appointment {
  id: string;
  orgId: string;
  clientUserId: string;
  clientName?: string;
  title: string;
  scheduledAt: string;
}

export async function listUpcomingAppointments(
  supabase: SupabaseClient,
  orgId: string
): Promise<Appointment[]> {
  const { data, error } = await supabase
    .from("coach_appointments")
    .select("id, org_id, client_user_id, title, scheduled_at")
    .eq("org_id", orgId)
    .gte("scheduled_at", new Date(Date.now() - 24 * 3600 * 1000).toISOString())
    .order("scheduled_at", { ascending: true })
    .limit(20);
  if (error) throw error;
  return (data ?? []).map((r) => ({
    id: r.id,
    orgId: r.org_id,
    clientUserId: r.client_user_id,
    title: r.title,
    scheduledAt: r.scheduled_at,
  }));
}

export async function createAppointment(
  supabase: SupabaseClient,
  orgId: string,
  clientUserId: string,
  title: string,
  scheduledAtISO: string
): Promise<void> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error("Not signed in.");
  const { error } = await supabase.from("coach_appointments").insert({
    org_id: orgId,
    client_user_id: clientUserId,
    title,
    scheduled_at: scheduledAtISO,
    created_by: userData.user.id,
  });
  if (error) throw error;
}

export async function deleteAppointment(supabase: SupabaseClient, id: string): Promise<void> {
  const { error } = await supabase.from("coach_appointments").delete().eq("id", id);
  if (error) throw error;
}

// ---------------------------------------------------------------------------
// Milestones
// ---------------------------------------------------------------------------

export interface MilestoneRow {
  kind: "debt_threshold" | "streak";
  accountId: string | null;
  threshold: number;
  achievedAt: string;
}

export async function getMyMilestones(supabase: SupabaseClient, limit = 10): Promise<MilestoneRow[]> {
  const { data, error } = await supabase.rpc("get_my_milestones", { p_limit: limit });
  if (error) throw error;
  const rows = (data ?? []) as Record<string, unknown>[];
  return rows.map((r) => ({
    kind: r.kind as MilestoneRow["kind"],
    accountId: (r.account_id as string) ?? null,
    threshold: Number(r.threshold),
    achievedAt: r.achieved_at as string,
  }));
}

/** Records any newly-crossed milestones (no-ops for ones already recorded,
 * via the DB's on-conflict-do-nothing). Fire-and-forget; never block the UI
 * on this — it's an enhancement, not core functionality. */
export async function recordMilestones(
  supabase: SupabaseClient,
  detected: { kind: "debt_threshold" | "streak"; accountId?: string; threshold: number }[]
): Promise<void> {
  await Promise.all(
    detected.map((m) =>
      supabase.rpc("record_milestone", {
        p_kind: m.kind,
        p_account_id: m.accountId ?? null,
        p_threshold: m.threshold,
      })
    )
  );
}

/** Human label for a milestone row, matching the design's copy style. */
export function describeMilestone(m: MilestoneRow, creditorName?: string): string {
  if (m.kind === "debt_threshold") {
    const name = creditorName ?? m.accountId ?? "a debt";
    return m.threshold >= 100 ? `${name} fully paid off` : `${m.threshold}% of ${name} paid off`;
  }
  return `${m.threshold}-month on-time streak`;
}
