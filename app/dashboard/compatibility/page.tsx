import Link from "next/link";
import { getCurrentUser, getCurrentProfile } from "@/lib/supabase/current-user";
import { CompatibilityForm } from "./compatibility-form";

export default async function CompatibilityPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const p = await getCurrentProfile();
  const hasChart = !!(p?.full_name && p?.dob);

  if (!hasChart) {
    return (
      <div className="max-w-2xl space-y-6">
        <div>
          <p className="text-xs font-mono text-brown/50 uppercase tracking-[0.2em] mb-2">
            Compatibility
          </p>
          <h1 className="text-3xl md:text-4xl font-display text-brown">
            First, your chart.
          </h1>
          <p className="mt-3 text-brown/60 max-w-lg">
            We&rsquo;ll need your own date of birth and full name before we can
            compare it with someone else&rsquo;s.
          </p>
        </div>
        <Link
          href="/dashboard/profile"
          className="inline-flex items-center h-11 px-6 rounded-full bg-maroon text-ivory hover:bg-maroon/90"
        >
          Complete profile
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <section className="rounded-2xl bg-gradient-to-br from-amber/20 via-ivory to-gold/15 border border-gold/30 p-6 md:p-10">
        <p className="text-xs font-mono text-brown/60 uppercase tracking-[0.2em] mb-2">
          Compatibility
        </p>
        <h1 className="text-3xl md:text-5xl font-display text-brown leading-tight">
          Is your rhythm aligned?
        </h1>
        <p className="mt-3 text-brown/70 max-w-xl">
          A playful first look, using sun signs and life-path numbers. For the
          full Vedic Guna Milan — 36/36 points, Nadi dosha, Bhakut — book a
          Signature reading and we&rsquo;ll analyse both charts side by side.
        </p>
      </section>

      {/* You */}
      <section className="rounded-2xl bg-white border border-gold/30 p-5 md:p-6">
        <p className="text-[10px] font-mono text-brown/50 uppercase tracking-wider mb-2">
          You
        </p>
        <div className="flex items-center gap-4">
          <span className="w-12 h-12 rounded-full bg-brown text-ivory flex items-center justify-center font-display text-base ring-2 ring-gold/40 shrink-0">
            {(p!.full_name!.trim()[0] ?? "S").toUpperCase()}
          </span>
          <div>
            <p className="text-brown font-display text-lg">{p!.full_name}</p>
            <p className="text-sm text-brown/60">Born {p!.dob}</p>
          </div>
        </div>
      </section>

      {/* Partner input + results */}
      <CompatibilityForm
        selfName={p!.full_name!}
        selfDob={p!.dob!}
      />

      {/* Upsell */}
      <section className="rounded-2xl bg-white border border-gold/30 p-6 md:p-8 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p className="text-brown font-display text-lg">
            Ready for the full Guna Milan?
          </p>
          <p className="text-brown/60 text-sm mt-1">
            36-point Ashtakoota matching, Nadi dosha check, and a muhurat
            recommendation by your acharya.
          </p>
        </div>
        <Link
          href="/dashboard/book?plan=signature"
          className="inline-flex items-center h-11 px-6 rounded-full bg-maroon text-ivory hover:bg-maroon/90"
        >
          Book Signature
        </Link>
      </section>
    </div>
  );
}
