"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  Home,
  Compass,
  MoreHorizontal,
  X,
  LogIn,
  LayoutDashboard,
  CalendarDays,
  BookOpen,
  MessageCircle,
  Smartphone,
  ScrollText,
  Mail,
  ShieldCheck,
  FileText,
} from "lucide-react";

type PrimaryTab = {
  key: string;
  label: string;
  /** Route destination. Use `home` for the landing page (scrolls-to-top when already there). */
  href: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  primary?: boolean;
  home?: boolean;
};

// Signed-out tabs — discovery focused. Panchang and Sources replace the old
// in-page "Topics" / "Pricing" anchors so every tab lands on a real page.
const PUBLIC_TABS: PrimaryTab[] = [
  { key: "home",     label: "Home",     href: "/",         icon: Home,         home: true },
  { key: "panchang", label: "Panchang", href: "/panchang", icon: CalendarDays },
  { key: "tatsam",   label: "Tatsam",   href: "/tatsam",   icon: Compass,      primary: true },
  { key: "sources",  label: "Sources",  href: "/sources",  icon: BookOpen },
];

// Signed-in tabs — product-surface focused.
const SIGNED_IN_TABS: PrimaryTab[] = [
  { key: "home",    label: "Home",    href: "/",              icon: Home,         home: true },
  { key: "today",   label: "Today",   href: "/dashboard",     icon: LayoutDashboard },
  { key: "tatsam",  label: "Tatsam",  href: "/tatsam",        icon: Compass,      primary: true },
  { key: "ask",     label: "Ask",     href: "/dashboard/ask", icon: MessageCircle },
];

type SecondaryItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

const PUBLIC_SECONDARY: SecondaryItem[] = [
  { label: "How we answer", href: "/how-we-answer", icon: ScrollText },
  { label: "Daily panchang", href: "/panchang",     icon: CalendarDays },
  { label: "Sources we read", href: "/sources",     icon: BookOpen },
  { label: "Apps",          href: "/apps",          icon: Smartphone },
  { label: "Contact us",    href: "/contact",       icon: Mail },
  { label: "Privacy",       href: "/privacy",       icon: ShieldCheck },
  { label: "Terms",         href: "/terms",         icon: FileText },
];

const SIGNED_IN_SECONDARY: SecondaryItem[] = [
  { label: "Panchang",      href: "/dashboard/panchang",  icon: CalendarDays },
  { label: "Kundli",        href: "/dashboard/kundli",    icon: BookOpen },
  { label: "Readings",      href: "/dashboard/readings",  icon: ScrollText },
  { label: "Profile",       href: "/dashboard/profile",   icon: LayoutDashboard },
  { label: "Apps",          href: "/apps",                icon: Smartphone },
  { label: "Contact us",    href: "/contact",             icon: Mail },
  { label: "Privacy",       href: "/privacy",             icon: ShieldCheck },
];

export function LandingBottomNav({ isSignedIn = false }: { isSignedIn?: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const onLanding = pathname === "/";
  const [openMenu, setOpenMenu] = useState(false);

  const tabs = isSignedIn ? SIGNED_IN_TABS : PUBLIC_TABS;
  const secondary = isSignedIn ? SIGNED_IN_SECONDARY : PUBLIC_SECONDARY;

  const isActive = (tab: PrimaryTab) => {
    if (tab.home) return onLanding;
    return pathname === tab.href || pathname?.startsWith(tab.href + "/");
  };

  const onHomeTap = (e: React.MouseEvent) => {
    // When already on /, scroll to top instead of a no-op navigation.
    if (onLanding) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <>
      <nav
        className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-brown/95 backdrop-blur-xl border-t border-ivory/10"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        aria-label="Primary navigation"
      >
        <div className="flex items-stretch justify-around h-16 px-1">
          {tabs.map((it) => {
            const active = isActive(it);
            const Icon = it.icon;

            const inner = it.primary ? (
              <span className="flex flex-col items-center justify-center gap-0.5">
                <span className="w-11 h-11 -mt-5 rounded-full bg-maroon text-ivory flex items-center justify-center shadow-md shadow-black/30 ring-4 ring-brown">
                  <Icon className="w-5 h-5" strokeWidth={2.25} />
                </span>
                <span className={`text-[10px] font-medium tracking-wide ${active ? "text-gold" : "text-gold/80"}`}>
                  {it.label}
                </span>
              </span>
            ) : (
              <span className="flex flex-col items-center justify-center gap-1">
                <Icon
                  className={`w-[22px] h-[22px] ${active ? "text-gold" : "text-ivory/55"}`}
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

            return (
              <Link
                key={it.key}
                href={it.href}
                onClick={it.home ? onHomeTap : undefined}
                className="flex-1 flex items-center justify-center active:scale-[0.98] transition-transform"
                aria-current={active ? "page" : undefined}
              >
                {inner}
              </Link>
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
        <div
          className="absolute inset-0 bg-brown/40 backdrop-blur-sm"
          onClick={() => setOpenMenu(false)}
        />
        <aside
          className={[
            "absolute inset-x-0 bottom-0 bg-ivory border-t border-gold/25 rounded-t-3xl flex flex-col max-h-[85vh]",
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

          <div className="px-3 py-2 overflow-y-auto">
            <p className="px-2 pb-2 text-[10px] font-mono text-brown/45 uppercase tracking-wider">
              Explore Tatsam
            </p>
            <nav className="grid grid-cols-2 gap-1">
              {secondary.map((s) => {
                const Icon = s.icon;
                return (
                  <Link
                    key={s.href}
                    href={s.href}
                    onClick={() => setOpenMenu(false)}
                    className="flex items-center gap-2.5 px-3 h-11 rounded-lg text-sm text-brown/80 hover:bg-amber/15 hover:text-brown transition-colors"
                  >
                    <Icon className="w-4 h-4 text-brown/55 shrink-0" />
                    <span className="truncate">{s.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="px-3 py-3 border-t border-gold/25">
            <Link
              href={isSignedIn ? "/dashboard" : "/login"}
              onClick={() => setOpenMenu(false)}
              className="flex items-center gap-3 px-3 h-11 rounded-lg text-sm text-brown hover:bg-amber/15"
            >
              {isSignedIn ? (
                <LayoutDashboard className="w-4 h-4 text-brown/60" />
              ) : (
                <LogIn className="w-4 h-4 text-brown/60" />
              )}
              <span>{isSignedIn ? "Go to dashboard" : "Sign in"}</span>
            </Link>
            <Link
              href="/dashboard/ask"
              onClick={() => setOpenMenu(false)}
              className="mt-2 flex items-center justify-center gap-2 h-11 rounded-full bg-maroon text-ivory text-sm"
            >
              Ask Tatsam a question
            </Link>
          </div>
        </aside>
      </div>
    </>
  );
}
