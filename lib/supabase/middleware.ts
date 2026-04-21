import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Middleware is the single biggest perf lever — it runs on EVERY request
 * that matches `middleware.ts`'s matcher, including landing + marketing
 * pages. We keep it lean:
 *
 *   1. Public paths → return immediately with zero Supabase work. Landing
 *      and /tatsam render without ever touching gotrue.
 *
 *   2. Auth-aware paths (/login, /dashboard, /astrologer, /admin) → check
 *      the session via `getSession()` (reads JWT from cookie locally; only
 *      hits the network when refreshing a near-expired token).
 *
 *   3. The page-level layout (RSC) is still responsible for the
 *      authoritative `getUser()` — that gives the *verified* identity and
 *      drives role-based gating in /astrologer and /admin.
 */

const PROTECTED_PREFIXES = ["/dashboard", "/astrologer", "/admin"] as const;

function isProtected(pathname: string): boolean {
  return PROTECTED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(p + "/"),
  );
}

export async function updateSession(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const protectedPath = isProtected(pathname);
  const isLogin = pathname === "/login";

  // Fast path: public route — no Supabase instantiation at all.
  if (!protectedPath && !isLogin) {
    return NextResponse.next({ request });
  }

  // We only reach here for /login and protected prefixes.
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // getSession reads + parses the JWT from cookies locally. It only hits
  // gotrue if the access token is near expiry (to refresh), which is rare.
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (protectedPath && !session) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname + request.nextUrl.search);
    return NextResponse.redirect(url);
  }

  if (isLogin && session) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return response;
}
