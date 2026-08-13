"use client";

import { useCallback, useEffect, useState } from "react";
import { isSupabaseConfigured } from "../supabase/config";
import { createClient } from "../supabase/client";
import { loadProfile, saveProfile, syncProgress, fetchLeaderboard, type Profile, type LeaderboardEntry } from "./profile";
import { generatePseudonym } from "../community/profile";

function defaultProfile(currentTotalDebt: number): Profile {
  return {
    displayName: generatePseudonym(),
    country: "PH",
    photoUrl: null,
    story: "",
    journeyStartDate: new Date().toISOString().slice(0, 10),
    // First snapshot: today's total becomes the "original" baseline.
    originalTotalDebt: currentTotalDebt,
    currentTotalDebt,
    isPublic: false,
    supportLinks: [],
  };
}

const DEMO_LEADERBOARD: LeaderboardEntry[] = [
  { id: "d1", displayName: "DebtSlayer_2043", country: "PH", photoUrl: null, story: "Cutting subscriptions and attacking my highest-APR card first.", percentPaidOff: 62.5, journeyStartDate: "2026-01-10", supportLinks: [{ platform: "GCash", handle: "0917-XXX-1234" }] },
  { id: "d2", displayName: "SlayQueen", country: "CA", photoUrl: null, story: "Two cards down, one to go!", percentPaidOff: 48, journeyStartDate: "2025-11-01", supportLinks: [] },
  { id: "d3", displayName: "DebtSlayer_8890", country: "SG", photoUrl: null, story: "Avalanche method, no new debt since March.", percentPaidOff: 33.2, journeyStartDate: "2026-03-15", supportLinks: [] },
];

export interface UseProfile {
  profile: Profile | null;
  loading: boolean;
  demo: boolean;
  save: (p: Profile) => Promise<void>;
  reload: () => Promise<void>;
}

/** Loads/saves the current user's profile, seeding a default (with today's
 * debt total as the baseline) on first use. `currentTotalDebt` keeps the synced
 * progress fields current. */
export function useProfile(currentTotalDebt: number): UseProfile {
  const demo = !isSupabaseConfigured;
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(!demo);

  const reload = useCallback(async () => {
    if (demo) {
      setProfile((p) => p ?? defaultProfile(currentTotalDebt));
      return;
    }
    setLoading(true);
    try {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        setProfile(defaultProfile(currentTotalDebt));
        return;
      }
      const existing = await loadProfile(supabase, data.user.id);
      if (existing) {
        setProfile({ ...existing, currentTotalDebt });
        // Keep the leaderboard fresh with live progress.
        void syncProgress(supabase, data.user.id, currentTotalDebt, existing.originalTotalDebt).catch(() => {});
      } else {
        setProfile(defaultProfile(currentTotalDebt));
      }
    } catch {
      // The profiles table may not exist yet, or a transient error — still
      // render a usable default rather than spinning forever.
      setProfile(defaultProfile(currentTotalDebt));
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [demo]);

  useEffect(() => {
    void reload();
  }, [reload]);

  // Reflect live debt changes into the in-memory profile.
  useEffect(() => {
    setProfile((p) => (p ? { ...p, currentTotalDebt } : p));
  }, [currentTotalDebt]);

  const save = useCallback(
    async (p: Profile) => {
      setProfile(p);
      if (demo) return;
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      if (!data.user) throw new Error("Not signed in.");
      await saveProfile(supabase, data.user.id, p);
    },
    [demo]
  );

  return { profile, loading, demo, save, reload };
}

export function useLeaderboard(): { entries: LeaderboardEntry[]; loading: boolean; demo: boolean } {
  const demo = !isSupabaseConfigured;
  const [entries, setEntries] = useState<LeaderboardEntry[]>(demo ? DEMO_LEADERBOARD : []);
  const [loading, setLoading] = useState(!demo);

  useEffect(() => {
    if (demo) return;
    (async () => {
      try {
        setEntries(await fetchLeaderboard(createClient()));
      } catch {
        setEntries([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [demo]);

  return { entries, loading, demo };
}
