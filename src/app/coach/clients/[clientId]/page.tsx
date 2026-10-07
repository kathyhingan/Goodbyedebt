"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useCoachOrg } from "@/lib/data/coachOrgContext";
import { projectPayoff, accruedBalance, perDebtProgress } from "@/lib/engine";
import type { Debt } from "@/lib/engine/types";
import { listDebtsForClient, listPaymentsForClient, listClients, clientUrgency, clientStatusLabel, type ClientPayment, type OrgClient } from "@/lib/data/coach";
import { getCoachNote, saveCoachNote, sendMessage, getMyMilestones, describeMilestone, type MilestoneRow } from "@/lib/data/messaging";
import { formatMonthYear } from "@/lib/format/duration";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { DEMO_CLIENTS, DEMO_CLIENT_DEBTS, DEMO_CLIENT_PAYMENTS, DEMO_MILESTONES } from "@/lib/data/coachDemo";
import { useCurrency } from "@/lib/currency/currency";

export default function CoachClientDetailPage() {
  const { org } = useCoachOrg();
  const router = useRouter();
  const { format } = useCurrency();
  const money = (n: number) => format(n, { maximumFractionDigits: 0 });
  const params = useParams<{ clientId: string }>();
  const clientId = params.clientId;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [payments, setPayments] = useState<ClientPayment[]>([]);
  const [client, setClient] = useState<OrgClient | null>(null);
  const [milestones, setMilestones] = useState<MilestoneRow[]>([]);
  const [note, setNote] = useState("");
  const [noteSaved, setNoteSaved] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    if (!isSupabaseConfigured) {
      setDebts(DEMO_CLIENT_DEBTS);
      setPayments(DEMO_CLIENT_PAYMENTS);
      setClient(DEMO_CLIENTS.find((c) => c.clientUserId === clientId) ?? DEMO_CLIENTS[0]);
      setNote("Ready to discuss refinancing once renewal opens in November.");
      setMilestones(DEMO_MILESTONES);
      setLoading(false);
      return;
    }
    try {
      const supabase = createClient();
      const [d, p, roster, savedNote] = await Promise.all([
        listDebtsForClient(supabase, clientId),
        listPaymentsForClient(supabase, clientId),
        listClients(supabase, org.id),
        getCoachNote(supabase, org.id, clientId),
      ]);
      setDebts(d);
      setPayments(p);
      setClient(roster.find((c) => c.clientUserId === clientId) ?? null);
      setNote(savedNote);
      // Milestones aren't scoped by RPC to one client (get_my_milestones is
      // "my own"), so a coach reads them straight off the table, gated by
      // the milestones_select_coach RLS policy (is_active_coach + is_coach_of).
      const { data: mData } = await supabase
        .from("milestones")
        .select("kind, account_id, threshold, achieved_at")
        .eq("user_id", clientId)
        .order("achieved_at", { ascending: false })
        .limit(10);
      setMilestones(
        (mData ?? []).map((r) => ({
          kind: r.kind,
          accountId: r.account_id,
          threshold: r.threshold,
          achievedAt: r.achieved_at,
        }))
      );
    } catch (e) {
      setError(
        e && typeof e === "object" && "message" in e && typeof (e as { message: unknown }).message === "string"
          ? (e as { message: string }).message
          : "Couldn't load this client. You may no longer be connected to them."
      );
    } finally {
      setLoading(false);
    }
  }, [clientId, org.id]);

  useEffect(() => {
    void load();
  }, [load]);

  const asOfToday = useMemo(() => debts.map((d) => ({ ...d, balance: accruedBalance(d) })), [debts]);
  const totalBalance = useMemo(() => asOfToday.reduce((s, d) => s + Math.max(0, d.balance), 0), [asOfToday]);
  const plan = asOfToday.length > 0 ? projectPayoff(asOfToday, { name: "avalanche" }, { monthlyExtra: 0 }) : null;
  const progress = useMemo(
    () => perDebtProgress(asOfToday, payments.map((p) => ({ accountId: p.accountId, amount: p.amount, paidOn: p.paidOn }))),
    [asOfToday, payments]
  );
  const totalPaid = progress.reduce((s, p) => s + p.paidAmount, 0);
  const overallPercent = totalPaid + totalBalance > 0 ? Math.round((totalPaid / (totalPaid + totalBalance)) * 100) : 0;
  const creditorByAccount = new Map(debts.map((d) => [d.accountId, d.creditor || d.accountId]));

  // Activity log: payments + milestones, merged newest-first.
  const activity = useMemo(() => {
    const rows: { label: string; date: string }[] = [];
    for (const p of payments) {
      rows.push({ label: `Logged payment — ${creditorByAccount.get(p.accountId) ?? p.accountId}, ${money(p.amount)}`, date: p.paidOn });
    }
    for (const m of milestones) {
      rows.push({ label: `Milestone — ${describeMilestone(m, creditorByAccount.get(m.accountId ?? ""))}`, date: m.achievedAt.slice(0, 10) });
    }
    return rows.sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 12);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payments, milestones]);

  async function handleSaveNote() {
    setBusy(true);
    try {
      if (!isSupabaseConfigured) {
        setNoteSaved(true);
        return;
      }
      await saveCoachNote(createClient(), org.id, clientId, note);
      setNoteSaved(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't save that note.");
    } finally {
      setBusy(false);
    }
  }

  async function handleNudge() {
    setBusy(true);
    try {
      if (!isSupabaseConfigured) return;
      await sendMessage(
        createClient(),
        org.id,
        clientId,
        "Just checking in — how's your plan going? Let me know if anything's come up."
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't send that nudge.");
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <main className="container">
        <p className="note">Loading...</p>
      </main>
    );
  }

  return (
    <main className="container" style={{ maxWidth: 1040 }}>
      <button type="button" className="back-link" style={{ background: "none", border: "none", cursor: "pointer" }} onClick={() => router.push("/coach/clients")}>
        ← All clients
      </button>
      <div className="gd-row gd-between" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span className="avatar">{(client?.displayName?.[0] || "?").toUpperCase()}</span>
          <div>
            <h1 className="heading-lg" style={{ margin: 0 }}>{client?.displayName ?? clientId}</h1>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
              {client && (() => {
                const u = clientUrgency(client);
                const cls = u === "danger" ? "chip-danger" : u === "warning" ? "chip-warning" : "chip-success";
                return <span className={`chip ${cls}`}>{clientStatusLabel(client)}</span>;
              })()}
              {client && <span className="caption muted">Client since {new Date(client.addedAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</span>}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button type="button" style={{ border: "1px solid var(--border-strong)" }} onClick={handleNudge} disabled={busy}>
            Send a nudge
          </button>
          <Link
            href={`/coach/messages?client=${clientId}`}
            className="primary"
            style={{ padding: "8px 16px", borderRadius: "var(--radius-md)", background: "var(--primary)", color: "var(--on-primary)", textDecoration: "none", fontWeight: 600, fontSize: 13, display: "inline-flex", alignItems: "center" }}
          >
            Message
          </Link>
        </div>
      </div>

      {error && <p className="warn">{error}</p>}

      <div className="grid2" style={{ gridTemplateColumns: "2fr 1fr" }}>
        <div className="gd-stack" style={{ display: "flex", flexDirection: "column", gap: "var(--space-16)" }}>
          <section className="card">
            <div style={{ display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
              <div className="progress-ring" style={{ "--pct": overallPercent } as React.CSSProperties}>
                <div className="ring-stack"><span className="figure">{overallPercent}%</span></div>
              </div>
              <div>
                <div className="caption muted">Remaining</div>
                <div className="figure-lg">{money(totalBalance)}</div>
                {plan && !plan.unpayable && (
                  <p className="note" style={{ marginTop: 4 }}>
                    Projected debt-free: <strong>{formatMonthYear(plan.debtFreeDate)}</strong>
                  </p>
                )}
                {plan?.unpayable && <p className="warn" style={{ marginTop: 4 }}>At least one minimum doesn&apos;t cover its interest.</p>}
              </div>
            </div>
          </section>

          <section className="card">
            <h2 style={{ marginTop: 0, fontSize: "1.05rem" }}>Activity log</h2>
            {activity.length === 0 ? (
              <p className="note">No activity yet.</p>
            ) : (
              activity.map((a, i) => (
                <div className="logrow" key={i}>
                  <span className="logdot" />
                  <div>
                    <div className="body-sm">{a.label}</div>
                    <div className="caption muted">{a.date}</div>
                  </div>
                </div>
              ))
            )}
          </section>

          <section className="card">
            <h2 style={{ marginTop: 0, fontSize: "1.05rem" }}>Debts</h2>
            {asOfToday.length === 0 ? (
              <p className="note">No debts on file yet.</p>
            ) : (
              <table>
                <thead>
                  <tr><th>Creditor</th><th>Balance</th><th>APR</th><th>Min. payment</th></tr>
                </thead>
                <tbody>
                  {asOfToday.map((d) => (
                    <tr key={d.accountId}>
                      <td>{d.creditor || d.accountId}</td>
                      <td className="figure-cell">{money(d.balance)}</td>
                      <td>{d.apr}%</td>
                      <td className="figure-cell">{money(d.minimumPayment)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        </div>

        <section className="card">
          <h2 style={{ marginTop: 0, fontSize: "1.05rem" }}>Coach notes</h2>
          <p className="caption muted" style={{ marginBottom: 8 }}>Private — only visible to you</p>
          <textarea
            className="note-field"
            value={note}
            onChange={(e) => { setNote(e.target.value); setNoteSaved(false); }}
            placeholder="Notes about this client — renewal timing, what to bring up next call..."
          />
          <button
            type="button"
            className="primary"
            style={{ marginTop: 8, width: "100%" }}
            onClick={handleSaveNote}
            disabled={busy || noteSaved}
          >
            {noteSaved ? "Saved" : busy ? "Saving..." : "Save note"}
          </button>
        </section>
      </div>
    </main>
  );
}
