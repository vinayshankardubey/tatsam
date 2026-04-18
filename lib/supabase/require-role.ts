import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "./server";
import type { Profile, UserRole } from "./types";

/**
 * Server-side helper for layouts/pages.
 * Requires an authenticated session; if `role` is given, also requires the
 * user to hold that role (or be `admin`, which is a superset).
 */
export async function requireSession() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single<Profile>();

  if (!profile) redirect("/login");
  return { user, profile, supabase };
}

export async function requireRole(role: UserRole) {
  const session = await requireSession();
  const ok = session.profile.role === role || session.profile.role === "admin";
  if (!ok) redirect("/dashboard");
  return session;
}
