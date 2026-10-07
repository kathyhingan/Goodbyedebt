"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { useCoachOrg } from "@/lib/data/coachOrgContext";
import {
  getCoachInbox,
  listThread,
  sendMessage,
  markThreadRead,
  listUpcomingAppointments,
  createAppointment,
  type InboxEntry,
  type Message,
  type Appointment,
} from "@/lib/data/messaging";
import { DEMO_INBOX, DEMO_THREAD, DEMO_APPOINTMENTS } from "@/lib/data/coachDemo";

function timeAgo(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function MessagesInner() {
  const { org } = useCoachOrg();
  const searchParams = useSearchParams();
  const [inbox, setInbox] = useState<InboxEntry[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [thread, setThread] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [appts, setAppts] = useState<Appointment[]>([]);
  const [myUserId, setMyUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [schedTitle, setSchedTitle] = useState("");
  const [schedWhen, setSchedWhen] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const loadInbox = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setInbox(DEMO_INBOX);
      setAppts(DEMO_APPOINTMENTS);
      setMyUserId("demo-coach");
      return DEMO_INBOX;
    }
    const supabase = createClient();
    const [inboxRows, apptRows, userRes] = await Promise.all([
      getCoachInbox(supabase, org.id),
      listUpcomingAppointments(supabase, org.id),
      supabase.auth.getUser(),
    ]);
    setInbox(inboxRows);
    setAppts(apptRows);
    setMyUserId(userRes.data.user?.id ?? null);
    return inboxRows;
  }, [org.id]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const rows = await loadInbox();
      const fromQuery = searchParams.get("client");
      const initial = fromQuery && rows.some((r) => r.clientUserId === fromQuery) ? fromQuery : rows[0]?.clientUserId ?? null;
      setSelected(initial);
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [org.id]);

  useEffect(() => {
    if (!selected) return;
    if (!isSupabaseConfigured) {
      setThread(DEMO_THREAD.filter((m) => m.clientUserId === selected));
      return;
    }
    (async () => {
      const supabase = createClient();
      const t = await listThread(supabase, org.id, selected);
      setThread(t);
      await markThreadRead(supabase, org.id, selected);
      void loadInbox();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, org.id]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [thread]);

  const activeEntry = useMemo(() => inbox.find((i) => i.clientUserId === selected), [inbox, selected]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!selected || !draft.trim()) return;
    setSending(true);
    try {
      if (!isSupabaseConfigured) {
        setThread((prev) => [
          ...prev,
          { id: `demo-${prev.length}`, orgId: org.id, clientUserId: selected, senderUserId: "demo-coach", body: draft.trim(), readAt: null, createdAt: new Date().toISOString() },
        ]);
        setDraft("");
        return;
      }
      await sendMessage(createClient(), org.id, selected, draft.trim());
      setDraft("");
      setThread(await listThread(createClient(), org.id, selected));
      void loadInbox();
    } finally {
      setSending(false);
    }
  }

  async function handleAddAppt(e: React.FormEvent) {
    e.preventDefault();
    if (!selected || !schedTitle.trim() || !schedWhen) return;
    if (!isSupabaseConfigured) {
      setAppts((prev) => [...prev, { id: `demo-${prev.length}`, orgId: org.id, clientUserId: selected, title: schedTitle.trim(), scheduledAt: new Date(schedWhen).toISOString() }]);
      setSchedTitle("");
      setSchedWhen("");
      return;
    }
    try {
      await createAppointment(createClient(), org.id, selected, schedTitle.trim(), new Date(schedWhen).toISOString());
      setSchedTitle("");
      setSchedWhen("");
      setAppts(await listUpcomingAppointments(createClient(), org.id));
    } catch {
      /* best-effort */
    }
  }

  if (loading) {
    return (
      <main className="container" style={{ maxWidth: 1100 }}>
        <div className="brand"><h1>Messages</h1></div>
        <p className="tagline">Loading…</p>
      </main>
    );
  }

  return (
    <main className="container" style={{ maxWidth: 1100 }}>
      <div className="brand"><h1>Messages</h1></div>
      {inbox.length === 0 ? (
        <section className="card"><p className="note">No clients to message yet.</p></section>
      ) : (
        <div className="layout3">
          <div className="inbox">
            {inbox.map((entry) => (
              <button
                key={entry.clientUserId}
                type="button"
                className={`inbox-item ${selected === entry.clientUserId ? "is-active" : ""}`}
                onClick={() => setSelected(entry.clientUserId)}
              >
                <span className="avatar sm">{(entry.displayName[0] || "?").toUpperCase()}</span>
                <div className="inbox-body">
                  <div className="name">{entry.displayName}</div>
                  <div className="preview">{entry.lastFromMe ? "You: " : ""}{entry.lastBody ?? "No messages yet"}</div>
                </div>
                {entry.unreadCount > 0 && <span className="unread-dot" />}
              </button>
            ))}
          </div>

          <div className="thread-col">
            {activeEntry && (
              <div className="thread-head">
                <span className="avatar sm">{(activeEntry.displayName[0] || "?").toUpperCase()}</span>
                <span className="body" style={{ fontWeight: 600 }}>{activeEntry.displayName}</span>
              </div>
            )}
            <div className="thread" ref={scrollRef}>
              {thread.length === 0 ? (
                <p className="note">No messages yet — say hello below.</p>
              ) : (
                thread.map((m) => (
                  <div key={m.id} className={`msg ${m.senderUserId === myUserId ? "me" : "them"}`}>
                    {m.body}
                    <span className="msg-time">{timeAgo(m.createdAt)}</span>
                  </div>
                ))
              )}
            </div>
            <form onSubmit={handleSend} className="composer">
              <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Write a message..." disabled={sending} />
              <button type="submit" className="primary" style={{ padding: "8px 16px", fontSize: 13 }} disabled={sending || !draft.trim()}>Send</button>
            </form>
          </div>

          <div className="sched">
            <div className="caption muted" style={{ textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>
              This week
            </div>
            {appts.length === 0 ? (
              <p className="note" style={{ fontSize: 12 }}>Nothing scheduled.</p>
            ) : (
              appts.map((a) => (
                <div className="sched-item" key={a.id}>
                  <div className="when">
                    {new Date(a.scheduledAt).toLocaleDateString("en-US", { weekday: "short" })} ·{" "}
                    {new Date(a.scheduledAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                  </div>
                  <div>{a.title}</div>
                </div>
              ))
            )}
            {selected && (
              <form onSubmit={handleAddAppt} style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: 6 }}>
                <input
                  value={schedTitle}
                  onChange={(e) => setSchedTitle(e.target.value)}
                  placeholder={`Call — ${activeEntry?.displayName ?? "client"}`}
                  style={{ fontSize: 12 }}
                />
                <input type="datetime-local" value={schedWhen} onChange={(e) => setSchedWhen(e.target.value)} style={{ fontSize: 12 }} />
                <button type="submit" style={{ border: "1px solid var(--border-strong)", padding: "6px 10px", fontSize: 12 }} disabled={!schedTitle.trim() || !schedWhen}>
                  + Add to schedule
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

export default function CoachMessagesPage() {
  return (
    <Suspense fallback={null}>
      <MessagesInner />
    </Suspense>
  );
}
