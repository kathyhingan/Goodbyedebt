"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

/**
 * Where each role lands after signing in (when the login didn't come from a
 * specific redirect): superadmin -> /admin, active coach -> /coach, member
 * -> /plan. Checked against the live database at sign-in, not a claim in
 * the session, so a role change takes effect on the next login.
 */
async function homeForRole(): Promise<string> {
  try {
    const supabase = createClient();
    const admin = await supabase.rpc("is_platform_admin");
    if (admin.data) return "/admin";
    const coach = await supabase.rpc("is_active_coach");
    if (coach.data) return "/coach";
  } catch {
    /* fall through to the member default */
  }
  return "/plan";
}

function LoginForm() {
  const params = useSearchParams();
  const redirect = params.get("redirect") || "/plan";
  const [mode, setMode] = useState<"signin" | "signup">(
    params.get("mode") === "signup" ? "signup" : "signin"
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    if (!isSupabaseConfigured) {
      setMsg("Backend not configured yet — set Supabase env vars to enable sign-in.");
      return;
    }
    setBusy(true);
    const supabase = createClient();
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        // With email confirmation off, signUp returns an active session — send
        // the user straight into the app. If confirmation is on, there's no
        // session yet, so fall back to the check-your-email prompt.
        if (data.session) {
          const home = redirect !== "/plan" ? redirect : await homeForRole();
          window.location.assign(home);
        } else {
          setMsg("Check your email to confirm your account, then sign in.");
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        const home = redirect !== "/plan" ? redirect : await homeForRole();
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
      <p className="tagline">Sign in to your plan.</p>

      <section className="card">
        <div className="controls" style={{ marginBottom: 16 }}>
          <button
            type="button"
            className={mode === "signin" ? "primary" : ""}
            onClick={() => setMode("signin")}
          >
            Sign in
          </button>
          <button
            type="button"
            className={mode === "signup" ? "primary" : ""}
            onClick={() => setMode("signup")}
          >
            Create account
          </button>
        </div>

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
          <button type="submit" className="primary" disabled={busy} style={{ width: "100%" }}>
            {busy ? "…" : mode === "signup" ? "Create account" : "Sign in"}
          </button>
        </form>
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
