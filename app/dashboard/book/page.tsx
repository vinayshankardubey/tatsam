import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { bookReading } from "../actions";
import { PLAN_META, type Profile, type ReadingPlan } from "@/lib/supabase/types";

const PLAN_COPY: Record<ReadingPlan, { tagline: string; bullets: string[] }> = {
  darshan: {
    tagline: "A first glimpse into your chart.",
    bullets: [
      "Janma Kundli snapshot",
      "Life Path & Destiny number",
      "Current dasha at a glance",
      "8-page PDF, delivered in 48hr",
    ],
  },
  signature: {
    tagline: "The full Tatsam reading.",
    bullets: [
      "Detailed Kundli & Navamsa",
      "Full numerology: 9 core numbers",
      "Year-ahead dasha forecast",
      "Personalised remedies & muhurats",
      "20-min voice note from your acharya",
    ],
  },
  legacy: {
    tagline: "For lifelong seekers & families.",
    bullets: [
      "Everything in Signature",
      "60-min live call with your acharya",
      "Compatibility reading for partner",
      "Child-name & muhurat consulting",
      "Priority acharya access",
    ],
  },
};

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string }>;
}) {
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

  const { plan: planParam } = await searchParams;
  const requestedPlan = (["darshan", "signature", "legacy"] as const).includes(
    planParam as ReadingPlan,
  )
    ? (planParam as ReadingPlan)
    : "signature";

  const profileComplete = isProfileComplete(profile as Profile | null);

  if (!profileComplete) {
    return (
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-display text-brown mb-3">
          A little about you first.
        </h1>
        <p className="text-brown/60 mb-8">
          Your acharya needs your date, time, and place of birth before casting
          your chart. Please complete your profile and come back.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center h-11 px-6 rounded-full bg-maroon text-ivory hover:bg-maroon/90 transition-colors"
        >
          Fill birth details
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm text-brown/60 hover:text-maroon mb-8"
      >
        ← Back to dashboard
      </Link>

      <h1 className="text-3xl md:text-4xl font-display text-brown mb-3">
        Book a reading
      </h1>
      <p className="text-brown/60 mb-10 max-w-xl">
        Choose the depth of reading you&rsquo;d like. Your acharya will confirm
        within 24 hours and begin preparing your chart.
      </p>

      <form action={bookReading} className="space-y-8">
        <div className="grid gap-4">
          {(["darshan", "signature", "legacy"] as const).map((plan) => (
            <label
              key={plan}
              className="group flex gap-5 p-6 rounded-xl bg-white border border-gold/30 hover:border-maroon/50 transition-colors cursor-pointer has-[:checked]:border-maroon has-[:checked]:bg-amber/10"
            >
              <input
                type="radio"
                name="plan"
                value={plan}
                defaultChecked={plan === requestedPlan}
                required
                className="mt-1.5 accent-[#8B2C2C]"
              />
              <div className="flex-1">
                <div className="flex items-baseline justify-between gap-4 mb-1">
                  <span className="text-xl font-display text-brown">
                    {PLAN_META[plan].label}
                  </span>
                  <span className="text-brown/70 font-mono text-sm">
                    {PLAN_META[plan].priceInr != null
                      ? `₹${PLAN_META[plan].priceInr}`
                      : "Custom"}
                  </span>
                </div>
                <p className="text-sm text-brown/60 mb-3">
                  {PLAN_COPY[plan].tagline}
                </p>
                <ul className="grid gap-1.5 text-sm text-brown/70">
                  {PLAN_COPY[plan].bullets.map((b) => (
                    <li key={b} className="flex gap-2">
                      <span className="text-gold">◆</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </label>
          ))}
        </div>

        <label className="flex flex-col gap-2">
          <span className="text-xs font-mono text-brown/60 uppercase tracking-wider">
            Anything specific you&rsquo;d like your acharya to focus on?
          </span>
          <textarea
            name="seeker_note"
            rows={4}
            placeholder="Career, marriage, a specific concern, or leave blank for a full reading."
            className="p-3 rounded-md bg-white border border-gold/30 focus:outline-none focus:border-maroon text-brown resize-none"
          />
        </label>

        <button
          type="submit"
          className="w-full md:w-auto inline-flex items-center justify-center h-12 px-8 rounded-full bg-maroon text-ivory text-base hover:bg-maroon/90 transition-colors"
        >
          Request reading
        </button>
        <p className="text-xs text-brown/50 font-mono">
          No payment collected here — your acharya will share a secure payment
          link once your request is confirmed.
        </p>
      </form>
    </div>
  );
}

function isProfileComplete(p: Profile | null) {
  return !!(p?.full_name && p?.dob && p?.tob && p?.birth_place);
}
