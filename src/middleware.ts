import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  // Run on all routes except static assets and the service worker. .txt is
  // included so verification files at the site root (IndexNow key) are
  // reachable without a session: search engines must fetch them raw.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|manifest.webmanifest|sw.js|icons/|.*\\.(?:png|svg|ico|txt)$).*)",
  ],
};
