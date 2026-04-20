import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ProfileForm } from "../profile-form";
import { signOut } from "../actions";
import type { Profile } from "@/lib/supabase/types";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const p = (profile ?? null) as Profile | null;
  const fullName = p?.full_name ?? "Seeker";
  const initial = (fullName.trim()[0] ?? "S").toUpperCase();

  return (
    <div className="space-y-10 max-w-3xl">
      {/* Identity card */}
      <section className="rounded-2xl bg-gradient-to-br from-amber/25 via-ivory to-gold/15 border border-gold/30 p-6 md:p-8">
        <div className="flex items-center gap-5">
          <span className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-brown text-ivory flex items-center justify-center font-display text-2xl md:text-3xl ring-4 ring-gold/40 shrink-0">
            {initial}
          </span>
          <div className="min-w-0">
            <p className="text-xs font-mono text-brown/50 uppercase tracking-[0.2em] mb-1">
              {p?.role === "admin" ? "Admin" : p?.role === "acharya" ? "Acharya" : "Seeker"}
            </p>
            <h1 className="text-2xl md:text-3xl font-display text-brown leading-tight">
              {fullName}
            </h1>
            {p?.email ? (
              <p className="text-sm text-brown/55 truncate">{p.email}</p>
            ) : null}
          </div>
        </div>
      </section>

      {/* Birth details form */}
      <section>
        <div className="mb-4">
          <p className="text-xs font-mono text-brown/50 uppercase tracking-wider mb-2">
            Birth &amp; contact details
          </p>
          <h2 className="text-xl font-display text-brown">
            The four coordinates of your chart
          </h2>
        </div>
        <div className="rounded-xl bg-white border border-gold/30 p-6 md:p-8">
          {p ? (
            <ProfileForm profile={p} />
          ) : (
            <p className="text-brown/55">Loading…</p>
          )}
        </div>
      </section>

      {/* Role jumps */}
      {p && (p.role === "admin" || p.role === "acharya") ? (
        <section>
          <div className="mb-4">
            <p className="text-xs font-mono text-brown/50 uppercase tracking-wider mb-2">
              Switch to
            </p>
            <h2 className="text-xl font-display text-brown">Your other workspaces</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {p.role === "admin" ? (
              <JumpTile
                title="Admin console"
                body="Analytics, readings, users, acharya performance."
                href="/admin"
              />
            ) : null}
            {p.role === "acharya" ? (
              <JumpTile
                title="Acharya console"
                body="Your queue, assigned readings and seeker messages."
                href="/astrologer"
              />
            ) : null}
          </div>
        </section>
      ) : null}

      {/* Danger zone — sign out */}
      <section>
        <div className="mb-4">
          <p className="text-xs font-mono text-brown/50 uppercase tracking-wider mb-2">
            Session
          </p>
          <h2 className="text-xl font-display text-brown">Sign out of Tatsam</h2>
          <p className="text-sm text-brown/55 mt-1">
            You&rsquo;ll need your email again to sign back in.
          </p>
        </div>
        <form action={signOut}>
          <button
            type="submit"
            className="inline-flex items-center justify-center h-11 px-6 rounded-full border border-maroon/40 text-maroon hover:bg-maroon/5 transition-colors"
          >
            Sign out
          </button>
        </form>
      </section>
    </div>
  );
}

function JumpTile({
  title,
  body,
  href,
}: {
  title: string;
  body: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group block rounded-xl bg-white border border-gold/30 p-5 hover:border-maroon/40 transition-colors"
    >
      <p className="text-base font-display text-brown">{title}</p>
      <p className="text-xs text-brown/55 mt-1">{body}</p>
      <span className="block mt-3 text-sm text-maroon group-hover:translate-x-1 transition-transform">
        Open →
      </span>
    </Link>
  );
}
