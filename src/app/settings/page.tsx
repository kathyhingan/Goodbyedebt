"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { DEFAULT_SETTINGS, loadSettings, saveSettings, type ReminderSettings } from "@/lib/reminders/settings";
import { enablePush, pushSupported } from "@/lib/push/subscribe";
import { CURRENCIES, useCurrency } from "@/lib/currency/currency";

const LEAD_OPTIONS = [1, 3, 5, 7, 14];

export default function SettingsPage() {
  const demo = !isSupabaseConfigured;
  const { currency, setCurrency, format } = useCurrency();
  const [settings, setSettings] = useState<ReminderSettings>(DEFAULT_SETTINGS);
  const [msg, setMsg] = useState<string | null>(null);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    setSupported(pushSupported());
    if (demo) return;
    (async () => {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      if (data.user) setSettings(await loadSettings(supabase, data.user.id));
    })().catch(() => {});
  }, [demo]);

  async function persist(next: ReminderSettings) {
    setSettings(next);
    if (demo) { setMsg("Demo mode — not saved."); return; }
    try {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      if (data.user) await saveSettings(supabase, data.user.id, next);
      setMsg("Saved.");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Save failed.");
    }
  }

  async function onEnablePush() {
    const ok = await enablePush();
    if (ok) {
      await persist({ ...settings, pushEnabled: true });
      setMsg("Push notifications enabled.");
    } else {
      setMsg("Push unavailable or denied — you'll still see reminders in the calendar.");
    }
  }

  return (
    <main className="container">
      <h1 style={{ color: "var(--moss)" }}>Settings</h1>
      {demo && <div className="banner">Demo mode — preferences are not saved.</div>}

      <section className="card">
        <h2 style={{ marginTop: 0, fontSize: "1.05rem" }}>Currency</h2>
        <p className="note">Used to display every balance, payment, and interest figure across the app.</p>
        <div className="controls">
          <div>
            <label htmlFor="currency">Display currency</label>
            <select
              id="currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value as typeof currency)}
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} — {c.label}
                </option>
              ))}
            </select>
          </div>
          <span className="note" style={{ alignSelf: "end" }}>
            Preview: {format(1234.5)}
          </span>
        </div>
      </section>

      <section className="card">
        <h2 style={{ marginTop: 0, fontSize: "1.05rem" }}>Reminder timing</h2>
        <p className="note">Get reminded this many days before each due date.</p>
        <div className="controls">
          {LEAD_OPTIONS.map((day) => (
            <button
              key={day}
              type="button"
              className={settings.leadDays.includes(day) ? "primary" : ""}
              onClick={() => persist({ ...settings, leadDays: toggle(settings.leadDays, day) })}
            >
              {day} day{day === 1 ? "" : "s"}
            </button>
          ))}
        </div>
      </section>

      <section className="card">
        <h2 style={{ marginTop: 0, fontSize: "1.05rem" }}>Push notifications</h2>
        {supported ? (
          <>
            <p className="note">
              {settings.pushEnabled
                ? "Push is enabled on this device."
                : "Enable browser push so reminders reach you even when the app is closed."}
            </p>
            <button type="button" className="primary" onClick={onEnablePush} disabled={settings.pushEnabled}>
              {settings.pushEnabled ? "Enabled" : "Enable push"}
            </button>
          </>
        ) : (
          <p className="note">
            This browser doesn&apos;t support Web Push. Reminders appear in the in-app calendar
            instead — never a hard blocker (SOW §10).
          </p>
        )}
      </section>

      {msg && <p className="note">{msg}</p>}
    </main>
  );
}

function toggle(list: number[], day: number): number[] {
  return list.includes(day) ? list.filter((d) => d !== day) : [...list, day].sort((a, b) => a - b);
}
