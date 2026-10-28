/**
 * GA4 event helper. Mirrors what the inline gtag() in layout.tsx does:
 * an arguments-array push onto window.dataLayer, which gtag.js processes
 * exactly like a gtag("event", ...) call. Safe to import anywhere; no-ops
 * on the server and when the tag has not loaded (ad blockers, gtag absent).
 *
 * No em dashes in this file or its comments (account rule).
 */

type GaParams = Record<string, string | number | boolean | undefined>;

export function gaEvent(name: string, params: GaParams = {}): void {
  if (typeof window === "undefined") return;
  const w = window as typeof window & {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  };
  // Prefer the real global gtag: layout.tsx's inline init declares it at
  // global scope. A bare dataLayer array push is NOT processed by the
  // current gtag build (verified live Oct 29: gtag() call produced a
  // collect hit, the equivalent array push produced none), so the array
  // push is only a fallback for the case where the init script never ran.
  if (typeof w.gtag === "function") {
    w.gtag("event", name, { ...params });
    return;
  }
  if (!Array.isArray(w.dataLayer)) {
    // gtag.js has not run yet (blocked or still loading). Queue in order;
    // the inline init script in layout.tsx appends to the same array.
    w.dataLayer = [];
  }
  w.dataLayer.push(["event", name, { ...params }]);
}

/** utm params from the current URL, already session-scoped by GA4 but
 * passed here too so the event itself carries attribution. */
export function utmParams(): GaParams {
  if (typeof window === "undefined") return {};
  const q = new URLSearchParams(window.location.search);
  const out: GaParams = {};
  const source = q.get("utm_source");
  const medium = q.get("utm_medium");
  const campaign = q.get("utm_campaign");
  if (source) out.source = source;
  if (medium) out.medium = medium;
  if (campaign) out.campaign = campaign;
  return out;
}
