"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { fetchMemberCount } from "@/lib/data/members";

/** Founding-member cap. "Seats left" is always this minus real signups. */
export const FOUNDING_TOTAL = 100;

/**
 * Fills in "N Founding Debt Slayers seats left" on the landing page.
 *
 * The landing markup is one big HTML string rendered via
 * dangerouslySetInnerHTML (see src/app/page.tsx), so the number is written
 * into the placeholder element by id rather than re-rendered through React.
 * Reads the same public `member_count` RPC the app's own member counter uses;
 * if it can't be read, the server-rendered fallback is left in place.
 */
export function FoundingSeats() {
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    let cancelled = false;
    (async () => {
      try {
        const count = await fetchMemberCount(createClient());
        if (cancelled) return;
        const el = document.getElementById("gd-seats-left");
        if (el) el.textContent = String(Math.max(0, FOUNDING_TOTAL - count));
      } catch {
        /* leave the server-rendered fallback */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);
  return null;
}
