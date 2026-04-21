import "server-only";
import { cache } from "react";
import { createClient } from "./server";
import type { Profile } from "./types";

/**
 * Within a single request, multiple server components (layout + page) often
 * both need the signed-in user + their profile. These helpers are wrapped in
 * React's `cache()` so the gotrue `getUser()` call + the profile query each
 * hit the network at most once per request — subsequent calls in the same
 * render tree dedupe.
 */

/**
 * Returns true only when the Supabase env vars we need at runtime are
 * present. On the landing and other public surfaces, we'd rather render a
 * signed-out view than crash the whole page if Supabase isn't reachable —
 * e.g. mis-configured prod env, a brief outage, or preview deploys.
 */
function hasSupabaseEnv(): boolean {
  return (
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export const getCurrentUser = cache(async () => {
  if (!hasSupabaseEnv()) return null;
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  } catch (err) {
    // Network error, bad URL, auth service unreachable. Treat as signed-out
    // on public pages; protected pages have middleware that will redirect.
    console.error("[getCurrentUser] supabase unreachable:", err);
    return null;
  }
});

export const getCurrentProfile = cache(async (): Promise<Profile | null> => {
  const user = await getCurrentUser();
  if (!user) return null;
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single<Profile>();
    return data ?? null;
  } catch (err) {
    console.error("[getCurrentProfile] supabase unreachable:", err);
    return null;
  }
});
