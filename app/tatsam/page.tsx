import Link from "next/link";
import {
  Sparkles,
  Flame,
  Gem,
  BookOpen,
  CalendarDays,
  Compass,
  ArrowRight,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import {
  TATSAM_TOOLS,
  CATEGORY_LABEL,
  CATEGORY_HINT,
  findTool,
  type TatsamTool,
  type ToolCategory,
} from "@/lib/tatsam-tools";
import { getCurrentUser, getCurrentProfile } from "@/lib/supabase/current-user";
import { LandingBottomNav } from "@/components/landing/bottom-nav";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { buildDashboardNav } from "@/lib/dashboard-nav";
import { CategoryChips, type CategoryChipItem } from "./category-chips";

const ORDER: ToolCategory[] = [
  "oracle",
  "remedy",
  "talisman",
  "chart",
  "counsel",
  "daily",
];

const CATEGORY_ICON: Record<ToolCategory, LucideIcon> = {
  oracle:   Sparkles,
  remedy:   Flame,
  talisman: Gem,
  chart:    Compass,
  counsel:  BookOpen,
  daily:    CalendarDays,
};

// Category-specific visuals — gradient for backgrounds, accent for
// icons/pills, and a single-word descriptor used as a badge.
const CATEGORY_GRADIENT: Record<ToolCategory, string> = {
  oracle:   "from-[#F4D88A]/55 via-amber/30 to-[#F4B860]/20",
  remedy:   "from-[#E2A36C]/45 via-amber/30 to-[#C9A35A]/25",
  talisman: "from-[#F4D88A]/60 via-[#F7E3B5]/50 to-[#E9C889]/35",
  chart:    "from-[#C9A35A]/30 via-ivory to-[#E6DED6]/60",
  counsel:  "from-[#F4B860]/35 via-[#F7E3B5]/40 to-ivory",
  daily:    "from-[#F7E3B5]/55 via-ivory to-[#E6DED6]/60",
};

const CATEGORY_ACCENT: Record<ToolCategory, string> = {
  oracle:   "text-[#8B2C2C]",
  remedy:   "text-[#8B2C2C]",
  talisman: "text-[#6B4416]",
  chart:    "text-[#2B1F1A]",
  counsel:  "text-[#8B2C2C]",
  daily:    "text-[#2B1F1A]",
};

// Tools we surface as the featured quad.
const FEATURED_IDS = [
  "shri-ram-shalaka",
  "grahan-dosh-shanti",
  "rudraksha",
  "kundli",
];

// A lightweight "new" flag for the recently-added categories.
const NEW_CATEGORIES: ToolCategory[] = ["remedy", "talisman"];

export const metadata = {
  title: "Tatsam — Tools from the ancient corpus",
  description:
    "Shri Ram Shalaka, Gita Shalaka, Kundli, Numerology, Upanishadic counsel, poojas and talismans — classical tools, asked clearly.",
};

export default async function ToolsPage() {
  const user = await getCurrentUser();
  const profile = user ? await getCurrentProfile() : null;
  const signedIn = !!user;

  const fullName = profile?.full_name ?? "Seeker";
  const userInitial = (fullName.trim()[0] ?? "S").toUpperCase();
  const userEmail = profile?.email ?? user?.email ?? "";
  const { groups, mobileTabs } = buildDashboardNav(profile);

  const grouped = new Map<ToolCategory, TatsamTool[]>();
  for (const t of TATSAM_TOOLS) {
    const arr = grouped.get(t.category) ?? [];
    arr.push(t);
    grouped.set(t.category, arr);
  }

  const featured = FEATURED_IDS
    .map((id) => findTool(id))
    .filter((t): t is TatsamTool => !!t);

  const totalTools = TATSAM_TOOLS.length;
  const totalSources = new Set(TATSAM_TOOLS.map((t) => t.source)).size;

  const chipItems: CategoryChipItem[] = ORDER.map((cat) => ({
    id: cat,
    label: CATEGORY_LABEL[cat],
    count: grouped.get(cat)?.length ?? 0,
    isNew: NEW_CATEGORIES.includes(cat),
  }));

  return (
    <div className="min-h-screen bg-ivory text-brown">
      {signedIn ? (
        <DashboardSidebar
          groups={groups}
          mobileTabs={mobileTabs}
          userLabel={fullName}
          userEmail={userEmail}
          userInitial={userInitial}
        />
      ) : (
        <header className="sticky top-0 z-30 bg-ivory/85 backdrop-blur-xl border-b border-gold/25 h-14">
          <div className="max-w-[1200px] h-full mx-auto px-5 lg:px-8 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 min-w-0">
              <span className="text-lg font-display text-brown">Tatsam</span>
              <span className="text-[10px] font-mono text-brown/40">तत्सम्</span>
            </Link>
            <nav className="flex items-center gap-4 text-sm">
              <Link href="/login" className="text-brown/70 hover:text-brown">
                Sign in
              </Link>
            </nav>
          </div>
        </header>
      )}

      <main
        className={
          signedIn
            ? "lg:pl-[240px] pb-24 lg:pb-20"
            : "pb-24 lg:pb-20"
        }
      >
      {/* Hero */}
      <Hero totalTools={totalTools} totalSources={totalSources} />

      {/* Category chip rail */}
      <CategoryChips
        items={chipItems}
        stickyTopClass={signedIn ? "top-14 lg:top-0" : "top-14"}
      />

      {/* Featured */}
      {featured.length > 0 ? (
        <section className="max-w-[1200px] mx-auto px-5 lg:px-8 mt-10 lg:mt-14">
          <SectionHeader
            eyebrow="Featured"
            title="Seekers open these first"
            hint="Four places the corpus most often answers."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            {featured.map((t) => (
              <FeaturedTile key={t.id} tool={t} />
            ))}
          </div>
        </section>
      ) : null}

      {/* Per-category sections */}
      {ORDER.map((cat) => {
        const tools = grouped.get(cat) ?? [];
        if (tools.length === 0) return null;
        return <CategorySection key={cat} category={cat} tools={tools} />;
      })}

      {/* Footer CTA */}
      <section className="max-w-[1200px] mx-auto px-5 lg:px-8 mt-16 lg:mt-24">
        <div className="relative overflow-hidden rounded-3xl border border-gold/30 bg-gradient-to-br from-[#F4D88A]/30 via-ivory to-[#C9A35A]/15 p-7 md:p-12 flex items-center justify-between gap-4 flex-wrap">
          <div
            aria-hidden="true"
            className="absolute -right-24 -top-24 w-[320px] h-[320px] rounded-full pointer-events-none opacity-50"
            style={{
              background:
                "conic-gradient(from 0deg, rgba(244,184,96,0.45), rgba(201,163,90,0.15), rgba(244,184,96,0.45))",
              filter: "blur(50px)",
            }}
          />
          <div className="relative min-w-0 flex-1">
            <p className="text-brown font-display text-xl md:text-2xl leading-tight">
              Tatsam reads only from classical sources.
            </p>
            <p className="text-brown/65 text-sm md:text-base mt-2 max-w-xl leading-relaxed">
              Every answer cites the verse or chapter it drew from — so you can
              go read it yourself.
            </p>
          </div>
          <Link
            href={signedIn ? "/dashboard/ask" : "/login?redirect=/dashboard/ask"}
            className="relative inline-flex items-center gap-2 h-12 px-7 rounded-full bg-maroon text-ivory text-sm md:text-base hover:bg-maroon/90 shrink-0 transition-colors"
          >
            Ask anything
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
      </main>

      {!signedIn ? <LandingBottomNav isSignedIn={false} /> : null}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Hero
// ─────────────────────────────────────────────────────────────

function Hero({
  totalTools,
  totalSources,
}: {
  totalTools: number;
  totalSources: number;
}) {
  return (
    <section className="relative overflow-hidden">
      {/* Decorative mandala glow — intentionally large and soft */}
      <div
        aria-hidden="true"
        className="absolute -right-32 -top-32 w-[520px] h-[520px] rounded-full pointer-events-none opacity-60"
        style={{
          background:
            "conic-gradient(from 0deg, rgba(244,184,96,0.35), rgba(201,163,90,0.1), rgba(244,184,96,0.35))",
          filter: "blur(80px)",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute -left-24 top-12 w-[260px] h-[260px] rounded-full pointer-events-none opacity-40"
        style={{
          background:
            "radial-gradient(circle, rgba(244,184,96,0.4) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      <div className="relative max-w-[1200px] mx-auto px-5 lg:px-8 pt-10 lg:pt-20 pb-6 lg:pb-10">
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-brown/60 uppercase tracking-[0.2em] bg-white/60 border border-gold/25 rounded-full px-2.5 py-1 backdrop-blur-sm">
            <Sparkles className="w-3 h-3 text-gold" />
            Tatsam · तत्सम्
          </span>
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-display text-brown leading-[1.02]">
          Ancient instruments,
          <br />
          <span className="text-brown/50">asked the modern way.</span>
        </h1>

        <p className="mt-5 md:mt-6 text-brown/75 text-base md:text-lg leading-relaxed max-w-2xl">
          Pick a tool and step into a conversation scoped to a single
          classical source — from the Ramcharitmanas and the Gita to Brihat
          Parashara Hora, Rudraksha Jabala and Chanakya Niti.
        </p>

        {/* Stat pills */}
        <div className="mt-7 flex flex-wrap gap-2">
          <StatPill icon={<Sparkles className="w-3.5 h-3.5 text-gold" />}>
            {totalTools} tools
          </StatPill>
          <StatPill icon={<BookOpen className="w-3.5 h-3.5 text-gold" />}>
            {totalSources} classical sources
          </StatPill>
          <StatPill icon={<ShieldCheck className="w-3.5 h-3.5 text-gold" />}>
            every answer cited
          </StatPill>
        </div>
      </div>
    </section>
  );
}

function StatPill({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-2 text-xs md:text-sm text-brown/80 bg-white/70 border border-gold/25 rounded-full px-3 py-1.5 backdrop-blur-sm">
      {icon}
      <span>{children}</span>
    </span>
  );
}

function SectionHeader({
  eyebrow,
  title,
  hint,
  right,
}: {
  eyebrow: React.ReactNode;
  title: string;
  hint?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex items-end justify-between gap-4 mb-4 md:mb-5">
      <div className="min-w-0">
        <p className="text-[11px] font-mono text-brown/55 uppercase tracking-wider">
          {eyebrow}
        </p>
        <h2 className="mt-1 font-display text-xl md:text-2xl text-brown leading-tight">
          {title}
        </h2>
        {hint ? (
          <p className="mt-1 text-sm text-brown/55 max-w-xl">{hint}</p>
        ) : null}
      </div>
      {right}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Category chips
// ─────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────
// Featured tile
// ─────────────────────────────────────────────────────────────

function FeaturedTile({ tool }: { tool: TatsamTool }) {
  const href = tool.href ?? `/dashboard/ask?tool=${tool.id}`;
  return (
    <Link
      href={href}
      className={`group relative overflow-hidden rounded-3xl border border-gold/30 hover:border-maroon/40 hover:shadow-lg transition-all min-h-[220px] md:min-h-[260px] p-6 md:p-8 flex flex-col justify-between bg-gradient-to-br ${CATEGORY_GRADIENT[tool.category]}`}
    >
      {/* Big faded glyph in the background */}
      <span
        aria-hidden="true"
        className="absolute -right-6 -bottom-10 text-[160px] md:text-[220px] font-display text-maroon/[0.06] leading-none select-none pointer-events-none rotate-3"
      >
        {tool.glyph}
      </span>

      {/* Header row — source + category pill */}
      <div className="relative flex items-center justify-between gap-2 flex-wrap">
        <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-brown/70 uppercase tracking-wider bg-white/70 border border-gold/30 rounded-full px-2.5 py-1 backdrop-blur-sm max-w-[220px]">
          <BookOpen className="w-3 h-3 text-gold shrink-0" />
          <span className="truncate">{tool.source}</span>
        </span>
        <span className="inline-flex items-center gap-1 text-[10px] font-mono text-brown/60 uppercase tracking-wider">
          <Sparkles className="w-3 h-3 text-gold" />
          Popular
        </span>
      </div>

      {/* Body */}
      <div className="relative mt-8">
        <h3 className="font-display text-[26px] md:text-[32px] text-brown leading-tight">
          {tool.name}
        </h3>
        {tool.sanskrit ? (
          <p className="mt-1 text-xs md:text-sm font-mono text-brown/55">
            {tool.sanskrit}
          </p>
        ) : null}
        <p className="mt-3 md:mt-4 text-sm md:text-[15px] text-brown/75 leading-relaxed line-clamp-2 max-w-md">
          {tool.tagline}
        </p>
        <span className="mt-5 md:mt-6 inline-flex items-center gap-2 text-sm font-medium text-maroon">
          Open
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}

// ─────────────────────────────────────────────────────────────
// Category section (responsive — scroll on mobile, grid on desktop)
// ─────────────────────────────────────────────────────────────

function CategorySection({
  category,
  tools,
}: {
  category: ToolCategory;
  tools: TatsamTool[];
}) {
  const Icon = CATEGORY_ICON[category];
  const isNew = NEW_CATEGORIES.includes(category);

  return (
    <section
      id={`cat-${category}`}
      className="max-w-[1200px] mx-auto px-5 lg:px-8 mt-12 md:mt-16 scroll-mt-32"
    >
      <SectionHeader
        eyebrow={
          <span className="inline-flex items-center gap-2">
            <Icon className={`w-3.5 h-3.5 ${CATEGORY_ACCENT[category]}`} />
            {CATEGORY_LABEL[category]}
            {isNew ? (
              <span className="inline-flex items-center text-[9px] font-mono text-ivory bg-maroon rounded-full px-1.5 py-0.5 uppercase tracking-wider">
                New
              </span>
            ) : null}
          </span>
        }
        title={CATEGORY_HINT[category]}
        right={
          <span className="shrink-0 text-[11px] font-mono text-brown/45 hidden sm:inline">
            {tools.length} {tools.length === 1 ? "tool" : "tools"}
          </span>
        }
      />

      {/* Cards — horizontal scroll on mobile, grid on desktop */}
      <div className="-mx-5 md:mx-0">
        <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 overflow-x-auto md:overflow-visible no-scrollbar px-5 md:px-0 pb-1 snap-x snap-mandatory md:snap-none">
          {tools.map((t) => (
            <ToolCard key={t.id} tool={t} />
          ))}
        </div>
      </div>
    </section>
  );
}

// Rich, always-readable tool card. Sized to suit horizontal scroll on
// mobile and responsive grid on larger viewports.
function ToolCard({ tool }: { tool: TatsamTool }) {
  const href = tool.href ?? `/dashboard/ask?tool=${tool.id}`;
  return (
    <Link
      href={href}
      className="group shrink-0 md:shrink w-[260px] md:w-auto relative overflow-hidden rounded-2xl bg-white border border-gold/30 hover:border-maroon/40 hover:shadow-md transition-all snap-start"
    >
      {/* Glyph header — gradient strip with big character */}
      <div
        className={`relative h-24 md:h-28 bg-gradient-to-br ${CATEGORY_GRADIENT[tool.category]} flex items-center justify-center overflow-hidden`}
      >
        <span
          aria-hidden="true"
          className="absolute -right-2 -bottom-4 text-[90px] md:text-[110px] font-display text-maroon/10 leading-none select-none"
        >
          {tool.glyph}
        </span>
        <span className="relative font-display text-3xl md:text-4xl text-maroon">
          {tool.glyph}
        </span>
      </div>

      {/* Body */}
      <div className="p-4 md:p-5">
        <h3 className="font-display text-base md:text-lg text-brown leading-tight line-clamp-2">
          {tool.name}
        </h3>
        {tool.sanskrit ? (
          <p className="mt-0.5 text-[11px] font-mono text-brown/50 truncate">
            {tool.sanskrit}
          </p>
        ) : null}
        <p className="mt-2 text-[13px] text-brown/65 leading-relaxed line-clamp-2 min-h-[38px]">
          {tool.tagline}
        </p>
        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1 text-[10px] font-mono text-brown/45 min-w-0">
            <BookOpen className="w-3 h-3 text-gold shrink-0" />
            <span className="truncate">{tool.source}</span>
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-maroon shrink-0 transition-transform group-hover:translate-x-1">
            Open
            <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}
