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

export const getCurrentUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});

export const getCurrentProfile = cache(async (): Promise<Profile | null> => {
  const user = await getCurrentUser();
  if (!user) return null;
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single<Profile>();
  return data ?? null;
});
