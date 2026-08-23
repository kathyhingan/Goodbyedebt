"use client";

import { useEffect, useState } from "react";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/client";
import { fetchMemberCount } from "@/lib/data/members";

const MILESTONES = [
  { target: 100, phase: "Phase 2 · Education" },
  { target: 1000, phase: "Phase 3 · Earning Opportunities" },
  { target: 10000, phase: "Phase 4 · Skill Development" },
];

/** Live signup count with a progress bar toward the next phase milestone. */
export function MemberProgress() {
  const demo = !isSupabaseConfigured;
  const [count, setCount] = useState<number | null>(demo ? 37 : null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (demo) return;
    fetchMemberCount(createClient()).then(setCount).catch(() => setFailed(true));
  }, [demo]);

  // Fail quietly if the member_count function isn't installed yet.
  if (failed) return null;
  if (count == null) {
    return <section className="card"><p className="muted">Loading member count…</p></section>;
  }

  const next = MILESTONES.find((m) => count < m.target);
  const pct = next ? Math.min(100, Math.round((count / next.target) * 100)) : 100;
  const foundingLeft = Math.max(0, 100 - count);

  return (
    <section className="card" style={{ background: "var(--money-soft)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 8 }}>
        <h2 style={{ margin: 0, fontSize: "1.15rem", color: "var(--moss)" }}>
          {count.toLocaleString()} member{count === 1 ? "" : "s"} strong
        </h2>
        {next && (
          <span className="muted">
            {(next.target - count).toLocaleString()} to unlock <strong>{next.phase}</strong>
          </span>
        )}
      </div>
      <div className="progress-track" style={{ height: 14, marginTop: 12 }}>
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <p className="note" style={{ marginTop: 10 }}>
        {next
          ? `${count.toLocaleString()} / ${next.target.toLocaleString()} on the way to unlocking ${next.phase}.`
          : "🎉 Every phase is unlocked — thank you for building this with us!"}
        {foundingLeft > 0 && ` · ${foundingLeft} founding free-forever seat${foundingLeft === 1 ? "" : "s"} left.`}
      </p>
    </section>
  );
}
