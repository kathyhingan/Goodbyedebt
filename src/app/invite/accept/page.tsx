"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { acceptInvitation } from "@/lib/data/coach";

function AcceptInviteForm() {
  const params = useSearchParams();
  const token = params.get("token") || "";
  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<"ok" | "error" | null>(null);
  const [checkedSession, setCheckedSession] = useState(false);

  async function tryAccept() {
    setBusy(true);
    setMsg(null);
    try {
      const res = await acceptInvitation(createClient(), token);
      if (res.ok) {
        setResult("ok");
      } else {
        setResult("error");
        setMsg(
          res.error === "email_mismatch"
            ? "That invite was sent to a different email address. Sign in with the email your coach invited, not this one."
            : res.error === "invalid_or_used_invite"
            ? "This invite link is no longer valid — it may have already been used, or your coach may have revoked it."
            : "Something went wrong accepting the invite."
        );
      }
    } catch (e) {
      setResult("error");
      setMsg(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  // If already signed in (e.g. the link was opened while logged in on
  // another tab), accept immediately instead of showing the auth form.
  useEffect(() => {
    if (!isSupabaseConfigured || !token) {
      setCheckedSession(true);
      return;
    }
    (async () => {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      if (data.user) await tryAccept();
      setCheckedSession(true);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    if (!token) {
      setMsg("This invite link is missing its token — ask your coach to resend it.");
      return;
    }
    if (!isSupabaseConfigured) {
      setMsg("Backend not configured yet.");
      return;
    }
    setBusy(true);
    const supabase = createClient();
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        if (data.session) {
          await tryAccept();
        } else {
          setMsg("Check your email to confirm your account, then open this invite link again.");
          setBusy(false);
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        await tryAccept();
      }
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Something went wrong.");
      setBusy(false);
    }
  }

  if (!checkedSession) {
    return (
      <main className="container" style={{ maxWidth: 420 }}>
        <p className="tagline">Checking your invite...</p>
      </main>
    );
  }

  if (result === "ok") {
    return (
      <main className="container" style={{ maxWidth: 420 }}>
        <div className="brand">
          <h1>
            Goodbye<span>Debt</span>
          </h1>
        </div>
        <section className="card">
          <p>
            You&apos;re connected. Your coach can now see your plan to help guide you — your numbers
            stay yours, they can&apos;t edit them.
          </p>
          <Link href="/plan" className="primary" style={{ display: "inline-block", marginTop: 8, textDecoration: "none" }}>
            Go to your plan
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="container" style={{ maxWidth: 420 }}>
      <div className="brand">
        <h1>
          Goodbye<span>Debt</span>
        </h1>
      </div>
      <p className="tagline">
        Your coach invited you. Sign in or create an account with the email they invited to connect.
      </p>

      <section className="card">
        <div className="controls" style={{ marginBottom: 16 }}>
          <button type="button" className={mode === "signup" ? "primary" : ""} onClick={() => setMode("signup")}>
            Create account
          </button>
          <button type="button" className={mode === "signin" ? "primary" : ""} onClick={() => setMode("signin")}>
            Sign in
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", marginBottom: 16 }}
          />
          <button type="submit" className="primary" disabled={busy} style={{ width: "100%" }}>
            {busy ? "Working..." : mode === "signup" ? "Create account & connect" : "Sign in & connect"}
          </button>
        </form>
        {msg && (
          <p className={result === "error" ? "warn" : "note"} style={{ marginTop: 12 }}>
            {msg}
          </p>
        )}
      </section>
    </main>
  );
}

export default function AcceptInvitePage() {
  return (
    <Suspense
      fallback={
        <main className="container">
          <p className="tagline">Loading...</p>
        </main>
      }
    >
      <AcceptInviteForm />
    </Suspense>
  );
}
