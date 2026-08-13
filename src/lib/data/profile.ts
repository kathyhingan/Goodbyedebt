import type { SupabaseClient } from "@supabase/supabase-js";
import { percentPaidOff } from "../community/profile";

export interface SupportLink {
  platform: string;
  handle: string;
}

export interface Profile {
  displayName: string;
  country: string;
  photoUrl: string | null;
  story: string;
  journeyStartDate: string; // ISO date
  originalTotalDebt: number;
  currentTotalDebt: number;
  isPublic: boolean;
  supportLinks: SupportLink[];
}

export interface LeaderboardEntry {
  id: string;
  displayName: string;
  country: string;
  photoUrl: string | null;
  story: string;
  percentPaidOff: number;
  journeyStartDate: string;
  supportLinks: SupportLink[];
}

interface ProfileRow {
  display_name: string;
  country: string;
  photo_url: string | null;
  story: string;
  journey_start_date: string;
  original_total_debt: number | string;
  current_total_debt: number | string;
  is_public: boolean;
  support_links: SupportLink[] | null;
}

function rowToProfile(r: ProfileRow): Profile {
  return {
    displayName: r.display_name,
    country: r.country,
    photoUrl: r.photo_url,
    story: r.story,
    journeyStartDate: r.journey_start_date,
    originalTotalDebt: Number(r.original_total_debt),
    currentTotalDebt: Number(r.current_total_debt),
    isPublic: Boolean(r.is_public),
    supportLinks: Array.isArray(r.support_links) ? r.support_links : [],
  };
}

export async function loadProfile(
  supabase: SupabaseClient,
  userId: string
): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  return data ? rowToProfile(data as ProfileRow) : null;
}

export async function saveProfile(
  supabase: SupabaseClient,
  userId: string,
  profile: Profile
): Promise<void> {
  const percent = percentPaidOff(profile.originalTotalDebt, profile.currentTotalDebt);
  const { error } = await supabase.from("profiles").upsert({
    user_id: userId,
    display_name: profile.displayName,
    country: profile.country,
    photo_url: profile.photoUrl,
    story: profile.story,
    journey_start_date: profile.journeyStartDate,
    original_total_debt: profile.originalTotalDebt,
    current_total_debt: profile.currentTotalDebt,
    percent_paid_off: percent,
    is_public: profile.isPublic,
    support_links: profile.supportLinks,
    updated_at: new Date().toISOString(),
  });
  if (error) throw error;
}

/** Keeps the leaderboard fresh: updates only the synced progress fields. */
export async function syncProgress(
  supabase: SupabaseClient,
  userId: string,
  currentTotalDebt: number,
  originalTotalDebt: number
): Promise<void> {
  const percent = percentPaidOff(originalTotalDebt, currentTotalDebt);
  const { error } = await supabase
    .from("profiles")
    .update({
      current_total_debt: currentTotalDebt,
      percent_paid_off: percent,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId);
  if (error) throw error;
}

export async function fetchLeaderboard(supabase: SupabaseClient): Promise<LeaderboardEntry[]> {
  const { data, error } = await supabase.rpc("get_leaderboard");
  if (error) throw error;
  return (data as Record<string, unknown>[]).map((r) => ({
    id: String(r.id),
    displayName: String(r.display_name ?? ""),
    country: String(r.country ?? ""),
    photoUrl: (r.photo_url as string | null) ?? null,
    story: String(r.story ?? ""),
    percentPaidOff: Number(r.percent_paid_off ?? 0),
    journeyStartDate: String(r.journey_start_date ?? ""),
    supportLinks: Array.isArray(r.support_links) ? (r.support_links as SupportLink[]) : [],
  }));
}
