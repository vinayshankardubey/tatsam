import Link from "next/link";
import {
  TATSAM_TOOLS,
  CATEGORY_LABEL,
  CATEGORY_HINT,
  type TatsamTool,
  type ToolCategory,
} from "@/lib/tatsam-tools";
import { createClient } from "@/lib/supabase/server";

const ORDER: ToolCategory[] = ["oracle", "chart", "counsel", "daily"];

export const metadata = {
  title: "Tatsam — Tools from the ancient corpus",
  description:
    "Shri Ram Shalaka, Gita Shalaka, Kundli, Numerology, Upanishadic counsel and more — classical tools, asked clearly.",
};

export default async function ToolsPage() {
  // We allow the page to render to unauthed users. If someone IS signed in,
  // we know it so we can show a subtle "welcome back" strip.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const grouped = new Map<ToolCategory, TatsamTool[]>();
  for (const t of TATSAM_TOOLS) {
    const arr = grouped.get(t.category) ?? [];
    arr.push(t);
    grouped.set(t.category, arr);
  }

  return (
    <div className="min-h-screen bg-ivory text-brown pb-24 lg:pb-20">
      {/* Top bar — minimal, shared styling across signed-in and out */}
      <header className="sticky top-0 z-30 bg-ivory/85 backdrop-blur-xl border-b border-gold/25 h-14">
        <div className="max-w-[1200px] h-full mx-auto px-5 lg:px-8 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 min-w-0">
            <span className="text-lg font-display text-brown">Tatsam</span>
            <span className="text-[10px] font-mono text-brown/40">तत्सम्</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            {user ? (
              <Link href="/dashboard" className="text-brown/70 hover:text-brown">
                Dashboard
              </Link>
            ) : (
              <Link href="/login" className="text-brown/70 hover:text-brown">
                Sign in
              </Link>
            )}
          </nav>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-5 lg:px-8 py-10 lg:py-14">
        {/* Hero */}
        <section className="mb-12 lg:mb-16">
          <p className="text-xs font-mono text-brown/55 uppercase tracking-[0.2em] mb-3">
            Tatsam
          </p>
          <h1 className="text-4xl md:text-6xl font-display text-brown leading-[1.02] lg:leading-none">
            Ancient instruments,
            <br />
            <span className="text-brown/50">asked the modern way.</span>
          </h1>
          <p className="mt-5 text-brown/70 text-lg leading-relaxed max-w-2xl">
            Each tile opens a conversation scoped to a single classical source —
            from the Ramcharitmanas and the Gita to Brihat Parashara Hora,
            Patanjali and Chanakya. Pick where you want to ask from.
          </p>
        </section>

        {/* Tool groups */}
        {ORDER.map((cat) => {
          const tools = grouped.get(cat) ?? [];
          if (tools.length === 0) return null;
          return (
            <section key={cat} className="mb-14 lg:mb-20">
              <div className="mb-5 lg:mb-6">
                <p className="text-xs font-mono text-brown/55 uppercase tracking-wider">
                  {CATEGORY_LABEL[cat]}
                </p>
                <h2 className="mt-1 text-xl md:text-2xl font-display text-brown">
                  {CATEGORY_HINT[cat]}
                </h2>
              </div>
              <div className="grid gap-3 md:gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {tools.map((t) => (
                  <ToolCard key={t.id} tool={t} />
                ))}
              </div>
            </section>
          );
        })}

        {/* Footer strip */}
        <section className="mt-16 rounded-2xl border border-gold/30 bg-white p-6 md:p-8 flex items-center justify-between gap-4 flex-wrap">
          <div className="min-w-0">
            <p className="text-brown font-display text-lg">
              Tatsam reads only from classical sources.
            </p>
            <p className="text-brown/60 text-sm mt-1 max-w-xl">
              Every answer cites the verse or chapter it drew from, so you can
              go read it yourself.
            </p>
          </div>
          <Link
            href={user ? "/dashboard/ask" : "/login?redirect=/dashboard/ask"}
            className="inline-flex items-center h-11 px-6 rounded-full bg-maroon text-ivory hover:bg-maroon/90 shrink-0"
          >
            Ask anything
          </Link>
        </section>
      </main>
    </div>
  );
}

function ToolCard({ tool }: { tool: TatsamTool }) {
  // If the tool has a direct `href`, link there (e.g. existing Kundli page).
  // Otherwise link to the Ask chat scoped by tool id.
  const href = tool.href ?? `/dashboard/ask?tool=${tool.id}`;

  return (
    <Link
      href={href}
      className="group relative flex flex-col justify-between gap-6 p-5 md:p-6 rounded-2xl bg-white border border-gold/30 hover:border-maroon/40 hover:bg-amber/5 transition-colors min-h-[180px]"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="font-display text-xl text-brown leading-tight">
            {tool.name}
          </p>
          {tool.sanskrit ? (
            <p className="text-xs font-mono text-brown/50 mt-1 truncate">
              {tool.sanskrit}
            </p>
          ) : null}
        </div>
        <span
          aria-hidden="true"
          className="shrink-0 w-11 h-11 rounded-full bg-gradient-to-br from-gold/25 to-amber/20 text-maroon flex items-center justify-center font-display text-base ring-4 ring-ivory"
        >
          {tool.glyph}
        </span>
      </div>

      <p className="text-sm text-brown/65 leading-relaxed line-clamp-3">
        {tool.tagline}
      </p>

      <div className="flex items-center justify-between gap-2 pt-1 border-t border-gold/15">
        <span className="text-[10px] font-mono text-brown/45 uppercase tracking-wider truncate">
          {tool.source}
        </span>
        <span className="text-sm text-maroon font-medium transition-transform group-hover:translate-x-1">
          Open →
        </span>
      </div>
    </Link>
  );
}
