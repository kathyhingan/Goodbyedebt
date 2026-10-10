"use client";

import { useEffect, useState } from "react";

export interface ConfirmRequest {
  title: string;
  body: string;
  confirmLabel?: string;
  /** Resolved with the user's choice. */
  resolve: (yes: boolean) => void;
}

/**
 * In-app replacement for window.confirm. Native confirm() dies two ways that
 * both look like "the button doesn't work": a browser's "prevent this page
 * from creating additional dialogs" check (toggled once) makes every future
 * confirm() return false instantly with no dialog at all, and some in-app /
 * embedded browsers suppress it entirely. Neither can happen here: the dialog
 * is plain app UI, always renders, and always resolves one way or the other.
 *
 * Usage: confirmAction({title, body}).then(ok => { if (ok) ... })
 */
let setPending: ((r: ConfirmRequest | null) => void) | null = null;

export function confirmAction(opts: Omit<ConfirmRequest, "resolve">): Promise<boolean> {
  return new Promise((resolve) => {
    if (setPending) setPending({ ...opts, resolve });
  });
}

/** Mounts once (in the app layout) and renders the dialog for the whole app. */
export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [pending, _setPending] = useState<ConfirmRequest | null>(null);

  useEffect(() => {
    setPending = _setPending;
    return () => {
      setPending = null;
    };
  }, [_setPending]);

  function answer(yes: boolean) {
    pending?.resolve(yes);
    _setPending(null);
  }

  return (
    <>
      {children}
      {pending && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            background: "rgba(8, 12, 10, 0.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
          }}
          role="dialog"
          aria-modal="true"
          aria-label={pending.title}
        >
          <div
            className="card"
            style={{
              maxWidth: 380,
              width: "100%",
              margin: 0,
              boxShadow: "0 24px 64px rgba(0,0,0,0.35)",
            }}
          >
            <h2 style={{ marginTop: 0, fontSize: "1.05rem" }}>{pending.title}</h2>
            <p style={{ marginBottom: 16 }}>{pending.body}</p>
            <div className="row-actions" style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button type="button" onClick={() => answer(false)} autoFocus>
                Cancel
              </button>
              <button type="button" className="danger-btn" onClick={() => answer(true)}>
                {pending.confirmLabel ?? "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
