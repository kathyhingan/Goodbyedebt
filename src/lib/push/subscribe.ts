"use client";

import { createClient } from "../supabase/client";

const VAPID_PUBLIC = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? "";

/** True when this browser can register a service worker and receive Web Push. */
export function pushSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  );
}

function urlBase64ToUint8Array(base64: string): Uint8Array {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const raw = atob((base64 + padding).replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
}

/** Registers the service worker (safe to call repeatedly). */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!pushSupported()) return null;
  return navigator.serviceWorker.register("/sw.js");
}

/**
 * Requests notification permission, subscribes to push, and stores the
 * subscription for the current user. Returns false (no throw) when unsupported
 * or denied — reminders then fall back to the in-app calendar (SOW §10).
 */
export async function enablePush(): Promise<boolean> {
  if (!pushSupported() || !VAPID_PUBLIC) return false;
  const permission = await Notification.requestPermission();
  if (permission !== "granted") return false;

  const reg = await registerServiceWorker();
  if (!reg) return false;

  const sub = await reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC),
  });

  const json = sub.toJSON();
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return false;

  await supabase.from("push_subscriptions").upsert(
    {
      user_id: data.user.id,
      endpoint: sub.endpoint,
      p256dh: json.keys?.p256dh ?? "",
      auth: json.keys?.auth ?? "",
    },
    { onConflict: "user_id,endpoint" }
  );
  return true;
}
