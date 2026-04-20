"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Home,
  Sparkles,
  Compass,
  IndianRupee,
  MoreHorizontal,
  X,
  LogIn,
} from "lucide-react";

const PRIMARY: Array<{
  key: string;
  label: string;
  // Either `anchor` (on-page section) or `href` (route).
  anchor?: string;
  href?: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  primary?: boolean;
}> = [
  { key: "home",     label: "Home",     anchor: "#top",      icon: Home },
  { key: "topics",   label: "Topics",   anchor: "#features", icon: Sparkles },
  { key: "tatsam",   label: "Tatsam",   href:   "/tools",    icon: Compass, primary: true },
  { key: "pricing",  label: "Pricing",  anchor: "#pricing",  icon: IndianRupee },
];

const SECONDARY = [
  { label: "How it works",  anchor: "#how-it-works" },
  { label: "Reach",         anchor: "#infra" },
  { label: "Sources we read", anchor: "#integrations" },
  { label: "How we answer", anchor: "#developers" },
  { label: "Privacy",       anchor: "#security" },
];

export function LandingBottomNav() {
  const [openMenu, setOpenMenu] = useState(false);
  const [activeAnchor, setActiveAnchor] = useState("#top");

  // Observe landing sections so the right tab highlights as the user scrolls.
  useEffect(() => {
    const candidates = ["#top", "#features", "#pricing"];
    const targets = candidates
      .map((id) => (id === "#top" ? document.body : document.querySelector(id)))
      .filter(Boolean) as Element[];
    if (targets.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        // Pick the one with the largest intersectionRatio that is intersecting.
        const best = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!best) return;
        const id =
          best.target === document.body
            ? "#top"
            : `#${best.target.id}`;
        setActiveAnchor(id);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  const scrollTo = (anchor: string) => {
    if (anchor === "#top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      document.querySelector(anchor)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      <nav
        className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-brown/95 backdrop-blur-xl border-t border-ivory/10"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="flex items-stretch justify-around h-16 px-1">
          {PRIMARY.map((it) => {
            const active = it.anchor ? activeAnchor === it.anchor : false;
            const Icon = it.icon;

            const inner = it.primary ? (
              <span className="flex flex-col items-center justify-center gap-0.5">
                <span className="w-11 h-11 -mt-5 rounded-full bg-maroon text-ivory flex items-center justify-center shadow-md shadow-black/30 ring-4 ring-brown">
                  <Icon className="w-5 h-5" strokeWidth={2.25} />
                </span>
                <span className="text-[10px] font-medium tracking-wide text-gold">
                  {it.label}
                </span>
              </span>
            ) : (
              <span className="flex flex-col items-center justify-center gap-1">
                <Icon
                  className={`w-[22px] h-[22px] ${
                    active ? "text-gold" : "text-ivory/55"
                  }`}
                  strokeWidth={active ? 2.25 : 1.75}
                />
                <span
                  className={`text-[10px] font-medium tracking-wide truncate px-1 ${
                    active ? "text-gold" : "text-ivory/55"
                  }`}
                >
                  {it.label}
                </span>
              </span>
            );

            return it.href ? (
              <Link
                key={it.key}
                href={it.href}
                className="flex-1 flex items-center justify-center active:scale-[0.98] transition-transform"
              >
                {inner}
              </Link>
            ) : (
              <button
                key={it.key}
                type="button"
                onClick={() => scrollTo(it.anchor!)}
                className="flex-1 flex items-center justify-center active:scale-[0.98] transition-transform"
              >
                {inner}
              </button>
            );
          })}

          {/* Menu */}
          <button
            type="button"
            onClick={() => setOpenMenu(true)}
            className="flex-1 flex flex-col items-center justify-center gap-1 active:scale-[0.98] transition-transform"
            aria-label="Open menu"
          >
            <MoreHorizontal
              className={`w-[22px] h-[22px] ${openMenu ? "text-gold" : "text-ivory/55"}`}
              strokeWidth={openMenu ? 2.25 : 1.75}
            />
            <span
              className={`text-[10px] font-medium tracking-wide ${
                openMenu ? "text-gold" : "text-ivory/55"
              }`}
            >
              Menu
            </span>
          </button>
        </div>
      </nav>

      {/* Bottom-sheet menu */}
      <div
        className={[
          "lg:hidden fixed inset-0 z-50 transition-opacity",
          openMenu ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        ].join(" ")}
        aria-hidden={!openMenu}
      >
        <div className="absolute inset-0 bg-brown/30" onClick={() => setOpenMenu(false)} />
        <aside
          className={[
            "absolute inset-x-0 bottom-0 bg-ivory border-t border-gold/25 rounded-t-2xl flex flex-col",
            "transition-transform duration-300",
            openMenu ? "translate-y-0" : "translate-y-full",
          ].join(" ")}
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          <div className="relative px-5 pt-3 pb-2">
            <span className="block w-10 h-1 rounded-full bg-gold/30 mx-auto" aria-hidden />
            <button
              type="button"
              onClick={() => setOpenMenu(false)}
              className="absolute right-3 top-3 p-2 text-brown/60 hover:text-brown"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="px-3 py-2">
            <p className="px-2 pb-2 text-[10px] font-mono text-brown/45 uppercase tracking-wider">
              Explore Tatsam
            </p>
            <nav className="grid grid-cols-2 gap-1">
              {SECONDARY.map((s) => (
                <button
                  key={s.anchor}
                  type="button"
                  onClick={() => {
                    setOpenMenu(false);
                    setTimeout(() => scrollTo(s.anchor), 150);
                  }}
                  className="text-left px-3 h-11 rounded-lg text-sm text-brown/80 hover:bg-amber/15"
                >
                  {s.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="px-3 py-3 border-t border-gold/25">
            <Link
              href="/login"
              onClick={() => setOpenMenu(false)}
              className="flex items-center gap-3 px-3 h-11 rounded-lg text-sm text-brown hover:bg-amber/15"
            >
              <LogIn className="w-4 h-4 text-brown/60" />
              <span>Sign in</span>
            </Link>
            <Link
              href="/tools"
              onClick={() => setOpenMenu(false)}
              className="mt-2 flex items-center justify-center gap-2 h-11 rounded-full bg-maroon text-ivory text-sm"
            >
              Explore Tatsam
            </Link>
          </div>
        </aside>
      </div>
    </>
  );
}
