import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ProfileForm } from "./profile-form";
import {
  type Profile,
  type Reading,
  PLAN_META,
  STATUS_LABEL,
} from "@/lib/supabase/types";
import {
  lifePathNumber,
  expressionNumber,
  soulUrgeNumber,
  personalityNumber,
  LIFE_PATH_MEANING,
} from "@/lib/numerology";
import { sunSignFromDob, SIGN_BLURBS } from "@/lib/astro";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const [{ data: profile }, { data: readings }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase
      .from("readings")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
  ]);

  const p = (profile ?? null) as Profile | null;
  const profileComplete = isProfileComplete(p);
  const lifePath = lifePathNumber(p?.dob);
  const expression = expressionNumber(p?.full_name);
  const soul = soulUrgeNumber(p?.full_name);
  const personality = personalityNumber(p?.full_name);
  const sign = sunSignFromDob(p?.dob);
  const meaning = lifePath ? LIFE_PATH_MEANING[lifePath] : null;

  const readingsList = (readings ?? []) as Reading[];
  const active = readingsList.filter((r) => r.status !== "delivered" && r.status !== "cancelled");
  const delivered = readingsList.filter((r) => r.status === "delivered");

  return (
    <div className="space-y-16">
      {/* Role callouts for non-seeker roles */}
      {p?.role === "admin" ? (
        <RoleBanner
          tone="maroon"
          title="Signed in as Admin"
          body="Open the admin console for analytics and assignment."
          href="/admin"
          cta="Open admin"
        />
      ) : null}
      {p?.role === "acharya" ? (
        <RoleBanner
          tone="gold"
          title="Signed in as Acharya"
          body="Your reading queue and seeker messages are in the astrologer console."
          href="/astrologer"
          cta="Open queue"
        />
      ) : null}

      {/* Greeting */}
      <section>
        <p className="text-xs font-mono text-brown/50 uppercase tracking-[0.2em] mb-3">
          Namaste
        </p>
        <h1 className="text-4xl md:text-5xl font-display text-brown leading-tight">
          {p?.full_name ?? "Seeker"}.
        </h1>
        <p className="mt-3 text-brown/60 max-w-xl">
          {profileComplete
            ? "Your birth details are on file. Your chart — and every reading you take — lives here."
            : "A few birth details from you, and we can cast your chart with precision. This takes under a minute."}
        </p>
      </section>

      {/* Birth-details banner (only until complete) */}
      {!profileComplete ? (
        <section className="rounded-2xl border border-gold/40 bg-amber/10 p-6 md:p-8">
          <div className="flex items-start gap-3 mb-5">
            <span className="mt-1 inline-block w-2 h-2 rounded-full bg-maroon" />
            <div>
              <h2 className="text-lg font-display text-brown">
                Complete your birth details
              </h2>
              <p className="text-sm text-brown/60">
                Date, time, and place of birth are the four coordinates every
                kundli is drawn from.
              </p>
            </div>
          </div>
          {p ? <ProfileForm profile={p} /> : null}
        </section>
      ) : null}

      {/* Insights: sun sign + numerology */}
      {profileComplete ? (
        <section>
          <div className="mb-6">
            <p className="text-xs font-mono text-brown/50 uppercase tracking-wider mb-2">
              Your insights
            </p>
            <h2 className="text-2xl md:text-3xl font-display text-brown">
              A first glance at your chart
            </h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-4">
            {/* Sun sign */}
            {sign ? (
              <div className="lg:col-span-1 rounded-xl bg-gradient-to-br from-amber/20 to-ivory border border-gold/30 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-[10px] font-mono text-brown/50 uppercase tracking-wider">
                      Sun sign (Sayana)
                    </p>
                    <h3 className="text-2xl font-display text-brown mt-1">
                      {sign.name}
                    </h3>
                    <p className="text-sm text-brown/60">
                      {sign.sanskrit} · ruled by {sign.ruler}
                    </p>
                  </div>
                  <span className="text-5xl text-gold" aria-hidden>
                    {sign.symbol}
                  </span>
                </div>
                <p className="text-sm text-brown/70 leading-relaxed">
                  {SIGN_BLURBS[sign.name]}
                </p>
                <p className="mt-4 text-[11px] font-mono text-brown/40">
                  Moon sign &amp; nakshatra are cast by your acharya.
                </p>
              </div>
            ) : null}

            {/* Life path */}
            {lifePath && meaning ? (
              <div className="lg:col-span-2 rounded-xl bg-white border border-gold/30 p-6">
                <p className="text-[10px] font-mono text-brown/50 uppercase tracking-wider">
                  Life Path number
                </p>
                <div className="flex items-baseline gap-4 mt-1">
                  <span className="text-6xl font-display text-maroon leading-none">
                    {lifePath}
                  </span>
                  <div>
                    <h3 className="text-xl font-display text-brown">
                      {meaning.keyword}
                    </h3>
                  </div>
                </div>
                <p className="mt-4 text-brown/70 leading-relaxed">
                  {meaning.blurb}
                </p>
              </div>
            ) : null}
          </div>

          {/* Full numerology strip */}
          {(expression ?? soul ?? personality) != null ? (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <NumCard label="Expression" value={expression} hint="Who you are becoming" />
              <NumCard label="Soul urge" value={soul} hint="What your heart wants" />
              <NumCard label="Personality" value={personality} hint="How others meet you" />
            </div>
          ) : null}
        </section>
      ) : null}

      {/* Active readings */}
      <section>
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-xs font-mono text-brown/50 uppercase tracking-wider mb-2">
              Active readings
            </p>
            <h2 className="text-2xl md:text-3xl font-display text-brown">
              In progress
            </h2>
          </div>
          <Link
            href="/dashboard/book"
            className="text-sm px-5 h-10 inline-flex items-center rounded-full bg-maroon text-ivory hover:bg-maroon/90 transition-colors"
          >
            Book a reading
          </Link>
        </div>

        {active.length > 0 ? (
          <div className="grid gap-4">
            {active.map((r) => (
              <ReadingCard key={r.id} reading={r} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl bg-white border border-gold/30 p-10 text-center">
            <p className="text-brown/70 mb-4">
              No active readings. Start with a Darshan snapshot or a full Signature.
            </p>
            <Link
              href="/dashboard/book"
              className="inline-flex items-center h-11 px-6 rounded-full bg-maroon text-ivory hover:bg-maroon/90 transition-colors"
            >
              Book your first reading
            </Link>
          </div>
        )}
      </section>

      {/* Delivered / history */}
      {delivered.length > 0 ? (
        <section>
          <div className="mb-6">
            <p className="text-xs font-mono text-brown/50 uppercase tracking-wider mb-2">
              Delivered
            </p>
            <h2 className="text-2xl md:text-3xl font-display text-brown">
              Your reading library
            </h2>
          </div>
          <div className="grid gap-4">
            {delivered.map((r) => (
              <ReadingCard key={r.id} reading={r} />
            ))}
          </div>
        </section>
      ) : null}

      {/* Profile settings */}
      {profileComplete && p ? (
        <section>
          <div className="mb-6">
            <p className="text-xs font-mono text-brown/50 uppercase tracking-wider mb-2">
              Your details
            </p>
            <h2 className="text-2xl md:text-3xl font-display text-brown">
              Birth &amp; contact information
            </h2>
          </div>
          <div className="rounded-xl bg-white border border-gold/30 p-6 md:p-8">
            <ProfileForm profile={p} />
          </div>
        </section>
      ) : null}
    </div>
  );
}

function RoleBanner({
  tone,
  title,
  body,
  href,
  cta,
}: {
  tone: "maroon" | "gold";
  title: string;
  body: string;
  href: string;
  cta: string;
}) {
  const styles =
    tone === "maroon"
      ? "bg-maroon/10 border-maroon/30 text-brown"
      : "bg-gold/15 border-gold/40 text-brown";
  return (
    <div className={`rounded-xl border ${styles} p-4 flex items-center justify-between gap-4`}>
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-brown/60">{body}</p>
      </div>
      <Link
        href={href}
        className="text-sm font-medium px-4 h-9 inline-flex items-center rounded-full bg-maroon text-ivory hover:bg-maroon/90"
      >
        {cta}
      </Link>
    </div>
  );
}

function NumCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: number | null;
  hint: string;
}) {
  return (
    <div className="rounded-xl bg-white border border-gold/30 p-5 flex items-center gap-5">
      <span className="text-4xl font-display text-gold leading-none">
        {value ?? "—"}
      </span>
      <div>
        <p className="text-sm font-medium text-brown">{label} number</p>
        <p className="text-xs text-brown/55">{hint}</p>
      </div>
    </div>
  );
}

function ReadingCard({ reading: r }: { reading: Reading }) {
  return (
    <Link
      href={`/dashboard/readings/${r.id}`}
      className="group flex items-center justify-between p-5 md:p-6 rounded-xl bg-white border border-gold/30 hover:border-maroon/50 transition-colors"
    >
      <div className="min-w-0">
        <div className="flex items-center gap-3 mb-1">
          <span className="text-lg font-display text-brown">
            {PLAN_META[r.plan].label} reading
          </span>
          <StatusPill status={r.status} />
        </div>
        <p className="text-sm text-brown/60 truncate">
          Requested {formatDate(r.created_at)}
          {r.acharya_name ? ` • Acharya ${r.acharya_name}` : ""}
          {r.report_url ? " • Report ready" : ""}
        </p>
      </div>
      <span className="text-brown/40 group-hover:text-maroon transition-colors shrink-0 ml-4">
        →
      </span>
    </Link>
  );
}

function StatusPill({ status }: { status: Reading["status"] }) {
  const tone =
    status === "delivered"
      ? "bg-[#E9F3EC] text-[#2F6A3E]"
      : status === "cancelled"
        ? "bg-maroon/10 text-maroon"
        : status === "in_review"
          ? "bg-gold/20 text-brown"
          : "bg-amber/25 text-brown";
  return (
    <span className={`text-[10px] uppercase tracking-wider font-mono px-2 py-0.5 rounded ${tone}`}>
      {STATUS_LABEL[status]}
    </span>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function isProfileComplete(p: Profile | null) {
  return !!(p?.full_name && p?.dob && p?.tob && p?.birth_place);
}
