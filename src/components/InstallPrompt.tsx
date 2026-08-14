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
  const [notSafari, setNotSafari] = useState(false);
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
    // iPadOS reports as Mac; detect touch to catch it.
    const ios =
      /iphone|ipad|ipod/i.test(ua) ||
      (/macintosh/i.test(ua) && (navigator.maxTouchPoints ?? 0) > 1);

    if (ios) {
      // iOS has no install event — always show the manual tip (it works only in
      // Safari, so the message tells non-Safari users to open it there).
      setIsIOS(true);
      setNotSafari(/crios|fxios|edgios|brave|arc/i.test(ua) || !/safari/i.test(ua));
      setShow(true);
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

  const ShareIcon = () => (
    <svg
      width="15" height="15" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      style={{ display: "inline", verticalAlign: "-2px", margin: "0 1px" }}
      aria-hidden="true"
    >
      <path d="M12 3v13M12 3l-4 4M12 3l4 4" />
      <path d="M5 12v7a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-7" />
    </svg>
  );

  return (
    <div className="install-prompt" role="dialog" aria-label="Install GoodbyeDebt">
      <div className="install-body">
        {isIOS ? (
          notSafari ? (
            <span>
              <strong>To install on iPhone/iPad:</strong> open this page in <strong>Safari</strong>,
              tap the Share button <ShareIcon />, then <strong>Add to Home Screen</strong>.
              (Add to Home Screen only works in Safari.)
            </span>
          ) : (
            <span>
              <strong>Install GoodbyeDebt:</strong> tap the Share button <ShareIcon /> in Safari&apos;s
              toolbar, then <strong>Add to Home Screen</strong>. On iPhone the Share button is in the
              bottom bar.
            </span>
          )
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
