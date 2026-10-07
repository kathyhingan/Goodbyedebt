import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from "./config";

/** Routes that require an authenticated session. */
const PROTECTED = ["/roadmap", "/plan", "/debts", "/calendar", "/transactions", "/community", "/profile", "/settings", "/coach", "/admin"];
/** Public routes: the marketing landing page, the guides, plus auth. */
const PUBLIC = ["/", "/guides", "/login", "/auth", "/invite"];

/** Refreshes the Supabase session cookie and gates protected routes. */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  // Without env configured there is no auth to enforce — let requests through
  // so the app still boots (demo posture).
  if (!isSupabaseConfigured) return response;

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  // "/" must match exactly (every path starts with "/"); /guides is public
  // marketing content; SEO metadata routes must stay crawlable; login/auth
  // match by prefix.
  const isPublic =
    path === "/" ||
    path === "/guides" ||
    path.startsWith("/guides/") ||
    path.startsWith("/invite") ||
    path.startsWith("/sitemap.xml") ||
    path.startsWith("/robots.txt") ||
    ["/login", "/auth"].some((p) => path.startsWith(p));

  if (!user && !isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", path);
    return NextResponse.redirect(url);
  }

  // Logged-in users skip the landing/login pages and go straight to the app.
  if (user && (path === "/login" || path === "/")) {
    const url = request.nextUrl.clone();
    url.pathname = "/plan";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return response;
}

export { PROTECTED };
