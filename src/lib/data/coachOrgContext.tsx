"use client";

import { createContext, useContext } from "react";
import type { Organization } from "./coach";

/**
 * Shares the active coach's Organization down from the /coach layout (which
 * does the load + pending/suspended gating once) to every console page, so
 * Overview/Clients/ClientDetail/Analytics/Messages don't each re-fetch it.
 * Only mounted when org.status === 'active' — pages under it can assume a
 * usable org.
 */
const CoachOrgContext = createContext<{ org: Organization; reload: () => void } | null>(null);

export function CoachOrgProvider({
  org,
  reload,
  children,
}: {
  org: Organization;
  reload: () => void;
  children: React.ReactNode;
}) {
  return <CoachOrgContext.Provider value={{ org, reload }}>{children}</CoachOrgContext.Provider>;
}

export function useCoachOrg(): { org: Organization; reload: () => void } {
  const ctx = useContext(CoachOrgContext);
  if (!ctx) throw new Error("useCoachOrg must be used within the /coach layout");
  return ctx;
}
