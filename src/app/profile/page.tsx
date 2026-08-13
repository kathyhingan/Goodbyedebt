"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useDebts } from "@/lib/data/useDebts";
import { useProfile } from "@/lib/data/useProfile";
import { useCurrency } from "@/lib/currency/currency";
import { projectPayoff } from "@/lib/engine";
import { COUNTRIES, flagEmoji, percentPaidOff } from "@/lib/community/profile";
import type { Profile, SupportLink } from "@/lib/data/profile";

const MILESTONES = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

/** Downscale an uploaded image to a small JPEG data URL (kept off any server). */
function resizeImage(file: File, max = 256): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, max / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("no canvas"));
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.8));
      };
      img.onerror = reject;
      img.src = reader.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ProfilePage() {
  const { debts } = useDebts();
  const { format } = useCurrency();
  const currentTotal = useMemo(() => debts.reduce((s, d) => s + Math.max(0, d.balance), 0), [debts]);
  const { profile, loading, demo, save } = useProfile(currentTotal);

  const [form, setForm] = useState<Profile | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [confirmingPublic, setConfirmingPublic] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (profile) setForm(profile);
  }, [profile]);

  const projection = useMemo(
    () => (debts.length ? projectPayoff(debts, { name: "avalanche" }, {}) : null),
    [debts]
  );

  if (loading || !form) {
    return <main className="container"><h1 style={{ color: "var(--moss)" }}>My Profile</h1><p className="muted">Loading…</p></main>;
  }

  const percent = percentPaidOff(form.originalTotalDebt, currentTotal);
  const set = <K extends keyof Profile>(k: K, v: Profile[K]) => setForm((f) => (f ? { ...f, [k]: v } : f));

  async function persist(next: Profile, note = "Saved.") {
    setBusy(true);
    setMsg(null);
    try {
      await save(next);
      setMsg(demo ? "Demo mode — not saved." : note);
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Save failed.");
    } finally {
      setBusy(false);
    }
  }

  async function onPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !form) return;
    try {
      set("photoUrl", await resizeImage(file));
    } catch {
      setMsg("Couldn't read that image.");
    }
  }

  function updateLink(i: number, patch: Partial<SupportLink>) {
    if (!form) return;
    const links = form.supportLinks.map((l, idx) => (idx === i ? { ...l, ...patch } : l));
    set("supportLinks", links);
  }

  return (
    <main className="container">
      <h1 style={{ color: "var(--moss)" }}>My Profile</h1>
      {demo && <div className="banner">Demo mode — profile changes aren&apos;t saved.</div>}
      <p className="tagline">Build your <strong>Debt Slayer</strong> profile. Nothing is public until you turn it on.</p>

      {/* Current stats */}
      <div className="stat-grid" style={{ marginBottom: 16 }}>
        <div className="stat"><div className="label">Paid off</div><div className="value">{percent}%</div></div>
        <div className="stat"><div className="label">Remaining</div><div className="value">{Math.max(0, Math.round((100 - percent) * 10) / 10)}%</div></div>
        <div className="stat"><div className="label">Projected debt-free</div><div className="value" style={{ fontSize: "1rem" }}>{projection && !projection.unpayable ? projection.debtFreeDate : "—"}</div></div>
        <div className="stat"><div className="label">Current balance</div><div className="value" style={{ fontSize: "1rem" }}>{format(currentTotal, { maximumFractionDigits: 0 })}</div></div>
      </div>

      {/* Journey timeline */}
      <section className="card">
        <h2 style={{ marginTop: 0, fontSize: "1.05rem" }}>Journey since {form.journeyStartDate}</h2>
        <div className="milestones">
          {MILESTONES.map((m) => (
            <div key={m} className={`milestone ${percent >= m ? "hit" : ""}`}>
              <div className="dot">{percent >= m ? "★" : ""}</div>
              <div className="mlabel">{m}%</div>
            </div>
          ))}
        </div>
        <p className="note" style={{ marginTop: 8 }}>
          Baseline debt at start: {format(form.originalTotalDebt, { maximumFractionDigits: 0 })} (snapshot — never recalculated).
        </p>
      </section>

      {/* Builder */}
      <section className="card">
        <h2 style={{ marginTop: 0, fontSize: "1.05rem" }}>Profile details</h2>
        <div className="field-grid">
          <div>
            <label htmlFor="dn">Display name</label>
            <input id="dn" value={form.displayName} onChange={(e) => set("displayName", e.target.value)} />
            <p className="note" style={{ marginTop: 4 }}>A pseudonym is fine — your real name is never required.</p>
          </div>
          <div>
            <label htmlFor="ct">Country</label>
            <select id="ct" value={form.country} onChange={(e) => set("country", e.target.value)}>
              {COUNTRIES.map((c) => <option key={c.code} value={c.code}>{flagEmoji(c.code)} {c.name}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="photo">Photo (optional)</label>
            <input id="photo" type="file" accept="image/*" onChange={onPhoto} />
          </div>
          {form.photoUrl && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={form.photoUrl} alt="Your profile" style={{ width: 64, height: 64, borderRadius: "50%", objectFit: "cover" }} />
          )}
        </div>
        <div style={{ marginTop: 12 }}>
          <label htmlFor="story">Your story</label>
          <textarea id="story" value={form.story} maxLength={500} rows={3} style={{ width: "100%" }}
            placeholder="Share your journey — what are you working toward?"
            onChange={(e) => set("story", e.target.value)} />
          <p className="note">{form.story.length}/500</p>
        </div>
        <div className="row-actions" style={{ marginTop: 8 }}>
          <button type="button" className="primary" disabled={busy} onClick={() => persist(form)}>Save profile</button>
        </div>
      </section>

      {/* Support links (§4.4) */}
      <section className="card">
        <h2 style={{ marginTop: 0, fontSize: "1.05rem" }}>Support links (optional)</h2>
        <p className="note">
          Add your <strong>own</strong> payment handles (e.g. GCash, PayPal.me). GoodbyeDebt never
          processes, holds, or moves money — supporters send directly to you, at their discretion.
        </p>
        {form.supportLinks.map((l, i) => (
          <div key={i} className="row-actions" style={{ marginBottom: 8 }}>
            <input placeholder="Platform (e.g. GCash)" value={l.platform} onChange={(e) => updateLink(i, { platform: e.target.value })} />
            <input placeholder="Handle or link" value={l.handle} onChange={(e) => updateLink(i, { handle: e.target.value })} style={{ flex: 1 }} />
            <button type="button" className="danger-btn" onClick={() => set("supportLinks", form.supportLinks.filter((_, idx) => idx !== i))}>Remove</button>
          </div>
        ))}
        <div className="row-actions">
          <button type="button" onClick={() => set("supportLinks", [...form.supportLinks, { platform: "", handle: "" }])}>+ Add link</button>
          <button type="button" className="primary" disabled={busy} onClick={() => persist(form)}>Save</button>
        </div>
      </section>

      {/* Public/private toggle (§4.3) */}
      <section className="card">
        <h2 style={{ marginTop: 0, fontSize: "1.05rem" }}>Visibility</h2>
        {form.isPublic ? (
          <>
            <p className="note" style={{ color: "var(--moss)", fontWeight: 600 }}>
              Your profile is <strong>public</strong> on the <Link href="/community">Community</Link> leaderboard.
            </p>
            <button type="button" disabled={busy} onClick={() => persist({ ...form, isPublic: false }, "Profile is now private.")}>
              Make private
            </button>
          </>
        ) : confirmingPublic ? (
          <div className="banner" style={{ background: "#eef6ef", borderColor: "#cfe3d3" }}>
            <p style={{ margin: "0 0 10px" }}>
              Your debt percentage, country, story, photo, and any support links will be visible to
              <strong> everyone</strong> using the app. You can turn this off anytime.
            </p>
            <div className="row-actions">
              <button type="button" className="primary" disabled={busy}
                onClick={() => { setConfirmingPublic(false); void persist({ ...form, isPublic: true }, "You're on the leaderboard!"); }}>
                Yes, make my profile public
              </button>
              <button type="button" onClick={() => setConfirmingPublic(false)}>Cancel</button>
            </div>
          </div>
        ) : (
          <>
            <p className="note">Your profile is private. Opt in to appear on the Community leaderboard.</p>
            <button type="button" className="primary" onClick={() => setConfirmingPublic(true)}>Make my profile public</button>
          </>
        )}
      </section>

      {msg && <p className="note" style={{ color: "var(--moss)", fontWeight: 600 }}>{msg}</p>}
    </main>
  );
}
