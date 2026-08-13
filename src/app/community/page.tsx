"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useLeaderboard } from "@/lib/data/useProfile";
import { COUNTRIES, countryName, flagEmoji } from "@/lib/community/profile";
import type { LeaderboardEntry } from "@/lib/data/profile";

export default function CommunityPage() {
  const { entries, loading, demo } = useLeaderboard();
  const [country, setCountry] = useState("");
  const [active, setActive] = useState<LeaderboardEntry | null>(null);

  const rows = useMemo(() => {
    const filtered = country ? entries.filter((e) => e.country === country) : entries;
    return [...filtered].sort((a, b) => b.percentPaidOff - a.percentPaidOff);
  }, [entries, country]);

  const countriesPresent = useMemo(
    () => COUNTRIES.filter((c) => entries.some((e) => e.country === c.code)),
    [entries]
  );

  return (
    <main className="container">
      <h1 style={{ color: "var(--moss)" }}>Community</h1>
      {demo && <div className="banner">Demo mode — showing sample Debt Slayers.</div>}
      <p className="tagline">
        <strong>Debt Slayers</strong> ranked by percent of debt paid off — so ₱20,000 and $50,000
        stand as equals. <Link href="/profile">Build your profile</Link> to join.
      </p>

      {countriesPresent.length > 1 && (
        <div className="controls" style={{ marginBottom: 14 }}>
          <div>
            <label htmlFor="cf">Filter by country</label>
            <select id="cf" value={country} onChange={(e) => setCountry(e.target.value)}>
              <option value="">All countries</option>
              {countriesPresent.map((c) => <option key={c.code} value={c.code}>{flagEmoji(c.code)} {c.name}</option>)}
            </select>
          </div>
        </div>
      )}

      {loading ? (
        <section className="card"><p className="muted">Loading leaderboard…</p></section>
      ) : rows.length === 0 ? (
        <section className="card">
          <p className="muted">No public Debt Slayers yet. Be the first — <Link href="/profile">make your profile public</Link>.</p>
        </section>
      ) : (
        rows.map((e, i) => (
          <section className="card slayer" key={e.id}>
            <div className="slayer-rank">#{i + 1}</div>
            <div className="slayer-avatar">
              {e.photoUrl
                ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={e.photoUrl} alt="" />
                : <span>{(e.displayName[0] || "?").toUpperCase()}</span>}
            </div>
            <div className="slayer-body">
              <div className="slayer-name">
                {e.displayName} <span className="muted">{flagEmoji(e.country)} {countryName(e.country)}</span>
              </div>
              <div className="progress-track"><div className="progress-fill" style={{ width: `${Math.min(100, e.percentPaidOff)}%` }} /></div>
              <div className="slayer-pct">{e.percentPaidOff}% paid off</div>
              {e.story && <p className="note" style={{ margin: "6px 0 0" }}>{e.story}</p>}
            </div>
            {e.supportLinks.length > 0 && (
              <button type="button" className="primary" onClick={() => setActive(e)}>Help me be debt free</button>
            )}
          </section>
        ))
      )}

      {active && (
        <div className="modal-backdrop" onClick={() => setActive(null)}>
          <div className="modal" onClick={(ev) => ev.stopPropagation()}>
            <h2 style={{ marginTop: 0 }}>Support {active.displayName}</h2>
            <p className="note">Send directly to their own account using any handle below:</p>
            <ul style={{ paddingLeft: 18 }}>
              {active.supportLinks.map((l, i) => (
                <li key={i} style={{ marginBottom: 6 }}>
                  <strong>{l.platform || "Link"}:</strong> {isUrl(l.handle) ? <a href={l.handle} target="_blank" rel="noopener noreferrer">{l.handle}</a> : l.handle}
                </li>
              ))}
            </ul>
            <p className="note" style={{ borderTop: "1px solid var(--border)", paddingTop: 10 }}>
              GoodbyeDebt does not process, hold, or guarantee any funds. Any support you send goes
              directly and only to {active.displayName}&apos;s own personal account, at your own discretion.
            </p>
            <button type="button" onClick={() => setActive(null)}>Close</button>
          </div>
        </div>
      )}
    </main>
  );
}

function isUrl(s: string): boolean {
  return /^https?:\/\//i.test(s.trim());
}
