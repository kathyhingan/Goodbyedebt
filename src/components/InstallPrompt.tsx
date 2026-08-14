"use client";

import { useEffect, useState } from "react";

const DISMISS_KEY = "goodbyedebt.installDismissed";

interface BIPEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: string }>;
}

export function InstallPrompt() {
  const [show, setShow] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [deferred, setDeferred] = useState<BIPEvent | null>(null);

  useEffect(() => {
    // Already installed / running as an installed app — nothing to prompt.
    const standalone =
      window.matchMedia?.("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    if (standalone) return;
    try {
      if (window.localStorage.getItem(DISMISS_KEY)) return;
    } catch {
      /* ignore */
    }

    const ua = window.navigator.userAgent;
    const ios = /iphone|ipad|ipod/i.test(ua);
    const isSafari = /safari/i.test(ua) && !/crios|fxios|edgios/i.test(ua);

    if (ios) {
      // iOS has no install event — show the manual Share → Add to Home Screen tip.
      if (isSafari) setIsIOS(true), setShow(true);
      return;
    }

    // Android / desktop Chromium: capture the native install prompt.
    const onBip = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BIPEvent);
      setShow(true);
    };
    window.addEventListener("beforeinstallprompt", onBip);
    return () => window.removeEventListener("beforeinstallprompt", onBip);
  }, []);

  function dismiss() {
    setShow(false);
    try {
      window.localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* ignore */
    }
  }

  async function install() {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    dismiss();
  }

  if (!show) return null;

  return (
    <div className="install-prompt" role="dialog" aria-label="Install GoodbyeDebt">
      <div className="install-body">
        {isIOS ? (
          <span>
            <strong>Install GoodbyeDebt:</strong> tap the Share icon{" "}
            <span aria-hidden="true">⎋</span>, then <strong>Add to Home Screen</strong>.
          </span>
        ) : (
          <span>
            <strong>Install GoodbyeDebt</strong> for a full-screen, app-like experience.
          </span>
        )}
      </div>
      <div className="install-actions">
        {!isIOS && (
          <button type="button" className="primary" onClick={install}>Install</button>
        )}
        <button type="button" className="install-close" aria-label="Dismiss" onClick={dismiss}>✕</button>
      </div>
    </div>
  );
}
