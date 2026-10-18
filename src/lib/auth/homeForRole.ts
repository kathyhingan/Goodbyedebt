import { createClient } from "@/lib/supabase/client";

/**
 * Where a signed-in user lands when there's no specific ?redirect=:
 * superadmin -> /admin, active coach -> /coach, member -> /dashboard.
 * Checked against the live database at sign-in time (not a claim baked into
 * the session), so a role change takes effect on the person's next login.
 *
 * Shared by the login page and the password-reset page so both routes land
 * a person in the same place — one definition, can't drift apart.
 */
export async function homeForRole(): Promise<string> {
  try {
    const supabase = createClient();
    const admin = await supabase.rpc("is_platform_admin");
    if (admin.data) return "/admin";
    const coach = await supabase.rpc("is_active_coach");
    if (coach.data) return "/coach";
  } catch {
    /* fall through to the member default */
  }
  return "/dashboard";
}
