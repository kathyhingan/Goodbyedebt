import type { SupabaseClient } from "@supabase/supabase-js";

export interface ReminderSettings {
  leadDays: number[];
  pushEnabled: boolean;
}

export const DEFAULT_SETTINGS: ReminderSettings = { leadDays: [5, 1], pushEnabled: false };

export async function loadSettings(supabase: SupabaseClient, userId: string): Promise<ReminderSettings> {
  const { data, error } = await supabase
    .from("reminder_settings")
    .select("lead_days, push_enabled")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  if (!data) return DEFAULT_SETTINGS;
  return { leadDays: data.lead_days ?? [5, 1], pushEnabled: Boolean(data.push_enabled) };
}

export async function saveSettings(
  supabase: SupabaseClient,
  userId: string,
  settings: ReminderSettings
): Promise<void> {
  const { error } = await supabase.from("reminder_settings").upsert({
    user_id: userId,
    lead_days: settings.leadDays,
    push_enabled: settings.pushEnabled,
    updated_at: new Date().toISOString(),
  });
  if (error) throw error;
}
