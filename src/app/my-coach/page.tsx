"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getMyCoachLink } from "@/lib/data/coach";
import {
  listThread,
  sendMessage,
  getMyMilestones,
  describeMilestone,
  type Message,
  type MilestoneRow,
} from "@/lib/data/messaging";
import { useDebts } from "@/lib/data/useDebts";
import { formatMonthYear } from "@/lib/format/duration";

/**
 * The member's own view of their coach relationship (chat + shared
 * milestones). Named "My Coach" — not "Coach" — to stay unambiguous
 * alongside the practice-owner's "Coach console" (see Nav.tsx's naming note).
 */
export default function MyCoachPage() {
  const { debts } = useDebts();
  const [loading, setLoading] = useState(true);
  const [coachLink, setCoachLink] = useState<{ orgId: string; orgName: string } | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [thread, setThread] = useState<Message[]>([]);
  const [milestones, setMilestones] = useState<MilestoneRow[]>([]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const creditorByAccount = new Map(debts.map((d) => [d.accountId, d.creditor || d.accountId]));

  const load = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      if (!data.user) return;
      setUserId(data.user.id);
      const link = await getMyCoachLink(supabase);
      setCoachLink(link);
      if (link) {
        const [t, m] = await Promise.all([
          listThread(supabase, link.orgId, data.user.id),
          getMyMilestones(supabase, 10),
        ]);
        setThread(t);
        setMilestones(m);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't load your coach connection.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [thread]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!coachLink || !draft.trim()) return;
    setSending(true);
    try {
      await sendMessage(createClient(), coachLink.orgId, userId!, draft.trim());
      setDraft("");
      const t = await listThread(createClient(), coachLink.orgId, userId!);
      setThread(t);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't send that message.");
    } finally {
      setSending(false);
    }
  }

  async function handleScheduleRequest() {
    if (!coachLink || !userId) return;
    setSending(true);
    try {
      await sendMessage(
        createClient(),
        coachLink.orgId,
        userId,
        "Could we schedule a call? Let me know what times work for you."
      );
      setThread(await listThread(createClient(), coachLink.orgId, userId));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't send that request.");
    } finally {
      setSending(false);
    }
  }

  if (!isSupabaseConfigured || loading) {
    return (
      <main className="container">
        <div className="brand"><h1>My Coach</h1></div>
        <p className="tagline">{loading ? "Loading..." : "Backend not configured yet."}</p>
      </main>
    );
  }

  if (!coachLink) {
    return (
      <main className="container" style={{ maxWidth: 480 }}>
        <div className="brand"><h1>My Coach</h1></div>
        <p className="tagline">
          You&apos;re not connected to a coach yet. If a coach invited you, check your email for
          their invite link.
        </p>
      </main>
    );
  }

  return (
    <main className="container" style={{ maxWidth: 1040 }}>
      <div className="brand"><h1>My Coach</h1></div>
      {error && <p className="warn">{error}</p>}

      <div className="grid2" style={{ gridTemplateColumns: "1fr 1.6fr" }}>
        <div className="gd-stack" style={{ display: "flex", flexDirection: "column", gap: "var(--space-16)" }}>
          <section className="card">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div className="avatar alt">{coachLink.orgName.slice(0, 1).toUpperCase()}</div>
              <div>
                <div className="body" style={{ fontWeight: 600 }}>{coachLink.orgName}</div>
                <div className="caption muted">Your coach</div>
              </div>
            </div>
            <button
              type="button"
              style={{ marginTop: 12, width: "100%", border: "1px solid var(--border-strong)" }}
              onClick={handleScheduleRequest}
              disabled={sending}
            >
              Schedule a call
            </button>
          </section>

          <section className="card">
            <div className="heading-sm" style={{ marginBottom: 10 }}>Shared milestones</div>
            {milestones.length === 0 ? (
              <p className="note">Nothing yet — milestones show up here as you hit them.</p>
            ) : (
              milestones.map((m, i) => (
                <div key={i} className="achievement">
                  <span className="achievement-pin">✓</span>
                  <div>
                    <div className="achievement-title">{describeMilestone(m, creditorByAccount.get(m.accountId ?? ""))}</div>
                    <div className="achievement-date">{formatMonthYear(m.achievedAt.slice(0, 10))}</div>
                  </div>
                </div>
              ))
            )}
          </section>
        </div>

        <section className="card" style={{ display: "flex", flexDirection: "column", padding: 0, overflow: "hidden" }}>
          <div className="thread-head">
            <div className="avatar alt sm">{coachLink.orgName.slice(0, 1).toUpperCase()}</div>
            <span className="body" style={{ fontWeight: 600 }}>{coachLink.orgName}</span>
          </div>
          <div className="thread" ref={scrollRef} style={{ height: 420, padding: "16px 20px" }}>
            {thread.length === 0 ? (
              <p className="note">No messages yet — say hello below.</p>
            ) : (
              thread.map((m) => (
                <div key={m.id} className={`msg ${m.senderUserId === userId ? "me" : "them"}`}>
                  {m.body}
                  <span className="msg-time">
                    {new Date(m.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                </div>
              ))
            )}
          </div>
          <form onSubmit={handleSend} className="composer" style={{ padding: "12px 20px" }}>
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Write a message..."
              disabled={sending}
            />
            <button type="submit" className="primary" disabled={sending || !draft.trim()}>
              Send
            </button>
          </form>
        </section>
      </div>

      <p className="note" style={{ marginTop: 16 }}>
        Your coach can see your plan, debts, and progress (read-only), plus the messages you send
        here.
      </p>
    </main>
  );
}
