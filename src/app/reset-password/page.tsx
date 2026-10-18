"use client";

import { Suspense, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { homeForRole } from "@/lib/auth/homeForRole";

/**
 * Where the "Forgot password?" email link lands. Supabase's client SDK
 * auto-detects the recovery token in the URL (detectSessionInUrl, on by
 * default) and fires a PASSWORD_RECOVERY auth event with a short-lived
 * session scoped ONLY to changing the password — not a normal sign-in.
 *
 * Until that event fires, the link in the email could be stale, already
 * used, or just slow to parse — so the form stays disabled with a "verifying
 * your link…" state rather than letting a doomed updateUser() call fire
 * immediately and confuse the error message.
 */
function ResetPasswordForm() {
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    const supabase = createClient();
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setReady(true);
    });
    // Covers the case where the event already fired before this listener
    // attached (SDK processes the URL hash on client creation) — if a
    // session already exists by the time we check, the link was valid.
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    if (password !== confirm) {
      setMsg("Those two passwords don't match.");
      return;
    }
    setBusy(true);
    try {
      const { error } = await createClient().auth.updateUser({ password });
      if (error) throw error;
      setDone(true);
      const home = await homeForRole();
      window.location.assign(home);
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Couldn't update your password.");
    } finally {
      setBusy(false);
    }
  }

  if (!isSupabaseConfigured) {
    return (
      <main className="container" style={{ maxWidth: 420 }}>
        <div className="brand"><h1>Goodbye<span>Debt</span></h1></div>
        <p className="tagline">Backend not configured yet.</p>
      </main>
    );
  }

  return (
    <main className="container" style={{ maxWidth: 420 }}>
      <div className="brand">
        <h1>Goodbye<span>Debt</span></h1>
      </div>
      <p className="tagline">Choose a new password.</p>

      <section className="card">
        {!ready && !msg && (
          <p className="note" style={{ margin: 0 }}>Verifying your reset link…</p>
        )}
        {ready && !done && (
          <form onSubmit={submit}>
            <label htmlFor="password">New password</label>
            <input
              id="password"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: "100%", marginBottom: 12 }}
            />
            <label htmlFor="confirm">Confirm new password</label>
            <input
              id="confirm"
              type="password"
              required
              minLength={8}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              style={{ width: "100%", marginBottom: 16 }}
            />
            <button type="submit" className="primary" disabled={busy} style={{ width: "100%" }}>
              {busy ? "…" : "Update password"}
            </button>
          </form>
        )}
        {done && <p className="note" style={{ margin: 0 }}>Password updated — taking you in…</p>}
        {msg && <p className="warn" style={{ marginTop: 12 }}>{msg}</p>}
        {!ready && !msg && (
          <p className="note" style={{ marginTop: 12 }}>
            If nothing happens after a few seconds, the link may have expired — request a new one
            from the <a href="/login">sign-in page</a>.
          </p>
        )}
      </section>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}
