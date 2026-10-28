"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { homeForRole } from "@/lib/auth/homeForRole";
import { gaEvent, utmParams } from "@/lib/analytics";

const LINK_BTN: React.CSSProperties = {
  marginTop: 12,
  fontSize: 14,
  background: "none",
  border: "none",
  padding: 0,
  color: "var(--primary)",
  textDecoration: "underline",
  cursor: "pointer",
};

function LoginForm() {
  const params = useSearchParams();
  const redirect = params.get("redirect") || "/dashboard";
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">(
    params.get("mode") === "signup" ? "signup" : "signin"
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // signup_visit: fired once per page load while the signup form is shown.
  // Lands in GA4 as a native event (no Admin-side derived event needed);
  // mark it a key event to count signup-landing conversions by utm_source.
  const firedVisit = useRef(false);
  useEffect(() => {
    if (mode !== "signup" || firedVisit.current) return;
    firedVisit.current = true;
    gaEvent("signup_visit", { mode: "signup", ...utmParams() });
  }, [mode]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    if (!isSupabaseConfigured) {
      setMsg("Backend not configured yet. Set Supabase env vars to enable sign-in.");
      return;
    }
    setBusy(true);
    const supabase = createClient();
    try {
      if (mode === "forgot") {
        // Same message whether or not the email is registered — matches the
        // "Invalid credentials" sign-in error already doing this, so neither
        // screen lets someone fish for which emails have accounts.
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        setMsg("If an account exists for that email, a reset link is on its way. Check your inbox.");
      } else if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        // With email confirmation off, signUp returns an active session, so
        // send the user straight into the app. If confirmation is on, there
        // is no session yet, so fall back to the check-your-email prompt.
        if (data.session) {
          // sign_up: the completed-signup conversion. Fired only when the
          // account actually exists and is usable. The short wait gives the
          // collect hit time to be issued before the redirect navigation.
          gaEvent("sign_up", { method: "email", ...utmParams() });
          await new Promise((r) => setTimeout(r, 250));
          const home = redirect !== "/dashboard" ? redirect : await homeForRole();
          window.location.assign(home);
        } else {
          setMsg("Check your email to confirm your account, then sign in.");
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        const home = redirect !== "/dashboard" ? redirect : await homeForRole();
        window.location.assign(home);
      }
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="container" style={{ maxWidth: 420 }}>
      <div className="brand">
        <h1>Goodbye<span>Debt</span></h1>
      </div>
      <p className="tagline">
        {mode === "forgot" ? "Reset your password." : "Sign in to your plan."}
      </p>

      <section className="card">
        {mode !== "forgot" && (
          <div className="controls" style={{ marginBottom: 16 }}>
            <button
              type="button"
              className={mode === "signin" ? "primary" : ""}
              onClick={() => { setMode("signin"); setMsg(null); }}
            >
              Sign in
            </button>
            <button
              type="button"
              className={mode === "signup" ? "primary" : ""}
              onClick={() => { setMode("signup"); setMsg(null); }}
            >
              Create account
            </button>
          </div>
        )}

        <form onSubmit={submit}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", marginBottom: 12 }}
          />
          {mode !== "forgot" && (
            <>
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: "100%", marginBottom: 16 }}
              />
            </>
          )}
          <button type="submit" className="primary" disabled={busy} style={{ width: "100%" }}>
            {busy
              ? "…"
              : mode === "forgot"
                ? "Send reset link"
                : mode === "signup"
                  ? "Create account"
                  : "Sign in"}
          </button>
        </form>

        {mode === "signin" && (
          <button
            type="button"
            style={LINK_BTN}
            onClick={() => { setMode("forgot"); setMsg(null); }}
          >
            Forgot password?
          </button>
        )}
        {mode === "forgot" && (
          <button
            type="button"
            style={LINK_BTN}
            onClick={() => { setMode("signin"); setMsg(null); }}
          >
            &larr; Back to sign in
          </button>
        )}

        {msg && <p className="note" style={{ marginTop: 12 }}>{msg}</p>}
      </section>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
