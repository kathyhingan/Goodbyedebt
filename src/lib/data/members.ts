import type { SupabaseClient } from "@supabase/supabase-js";

/** Total number of signed-up accounts (via the public member_count function). */
export async function fetchMemberCount(supabase: SupabaseClient): Promise<number> {
  const { data, error } = await supabase.rpc("member_count");
  if (error) throw error;
  return Number(data ?? 0);
}
