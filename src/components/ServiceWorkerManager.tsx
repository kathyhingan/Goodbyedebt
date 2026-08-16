"use client";

import { useEffect } from "react";

/**
 * Registers the service worker and, crucially, reloads the app when a new
 * version is deployed — otherwise an installed PWA keeps serving the old code
 * (stale data, missing fixes). Also checks for updates when the app regains
 * visibility, since installed PWAs resume rather than reload.
 */
export function ServiceWorkerManager() {
  useEffect(() => {
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;

    let refreshing = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    });

    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => {
        // A new worker installed while one already controls the page = update.
        reg.addEventListener("updatefound", () => {
          const nw = reg.installing;
          if (!nw) return;
          nw.addEventListener("statechange", () => {
            if (nw.state === "installed" && navigator.serviceWorker.controller) {
              // controllerchange (above) will reload once it takes over.
            }
          });
        });

        const checkForUpdate = () => {
          if (document.visibilityState === "visible") reg.update().catch(() => {});
        };
        document.addEventListener("visibilitychange", checkForUpdate);
      })
      .catch(() => {});
  }, []);

  return null;
}
