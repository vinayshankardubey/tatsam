"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Sparkles,
  Inbox,
  User,
  UserCog,
  Users,
  FileText,
  LayoutDashboard,
  MessageCircle,
  BookOpen,
  Calendar,
  Star,
  Heart,
  Feather,
  Compass,
  type LucideIcon,
} from "lucide-react";

/**
 * Icon names accepted by the sidebar. Kept as strings so layouts (server
 * components) can describe their nav without passing component references
 * across the server→client boundary.
 */
export type IconName =
  | "home"
  | "sparkles"
  | "inbox"
  | "user"
  | "user-cog"
  | "users"
  | "file-text"
  | "layout-dashboard"
  | "message"
  | "book"
  | "calendar"
  | "star"
  | "heart"
  | "feather"
  | "compass";

const ICONS: Record<IconName, LucideIcon> = {
  home: Home,
  sparkles: Sparkles,
  inbox: Inbox,
  user: User,
  "user-cog": UserCog,
  users: Users,
  "file-text": FileText,
  "layout-dashboard": LayoutDashboard,
  message: MessageCircle,
  book: BookOpen,
  calendar: Calendar,
  star: Star,
  heart: Heart,
  feather: Feather,
  compass: Compass,
};

export type NavItem = {
  href: string;
  label: string;
  icon: IconName;
  /** Exact path match (vs prefix match). Default: false. */
  exact?: boolean;
};

export type NavGroup = {
  /** Optional section header (rendered small, uppercase, mono). */
  label?: string;
  items: NavItem[];
};

export type MobileTab = NavItem & {
  /** Renders the tab as a circular avatar with the user's initial. */
  isProfile?: boolean;
  /** Renders the tab as a raised maroon FAB (primary action). */
  isPrimary?: boolean;
};

export function DashboardSidebar({
  brand = "Tatsam",
  brandSub = "तत्सम्",
  badge,
  userLabel,
  userEmail,
  userInitial,
  profileHref = "/dashboard/profile",
  groups,
  mobileTabs,
}: {
  brand?: string;
  brandSub?: string;
  badge?: string;
  userLabel: string;
  userEmail?: string | null;
  userInitial: string;
  profileHref?: string;
  groups: NavGroup[];
  mobileTabs: MobileTab[];
}) {
  const pathname = usePathname();

  const isActive = (it: NavItem) =>
    it.exact ? pathname === it.href : pathname === it.href || pathname?.startsWith(it.href + "/");

  const Brand = ({ small = false }: { small?: boolean }) => (
    <Link href="/" className="flex items-center gap-2 min-w-0">
      <span className={`font-display text-brown truncate ${small ? "text-lg" : "text-xl"}`}>
        {brand}
      </span>
      {badge ? (
        <span className="text-[10px] font-mono text-brown/55 uppercase tracking-wider shrink-0">
          {badge}
        </span>
      ) : (
        <span className="text-[10px] font-mono text-brown/40 shrink-0">{brandSub}</span>
      )}
    </Link>
  );

  const DesktopNav = () => (
    <nav className="flex flex-col gap-5">
      {groups.map((g, gi) => (
        <div key={g.label ?? `group-${gi}`} className="flex flex-col gap-0.5">
          {g.label ? (
            <p className="px-4 mb-1 text-[10px] font-mono text-brown/45 uppercase tracking-[0.14em]">
              {g.label}
            </p>
          ) : null}
          {g.items.map((it) => {
            const active = isActive(it);
            const Icon = ICONS[it.icon];
            return (
              <Link
                key={it.href + it.label}
                href={it.href}
                className={[
                  "group flex items-center gap-3 px-4 h-10 rounded-lg text-sm transition-colors",
                  active
                    ? "bg-maroon text-ivory"
                    : "text-brown/75 hover:text-brown hover:bg-amber/15",
                ].join(" ")}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    active ? "text-ivory" : "text-brown/55 group-hover:text-maroon"
                  }`}
                />
                <span className="truncate">{it.label}</span>
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );

  const ProfilePod = () => {
    const onProfile = pathname === profileHref;
    return (
      <Link
        href={profileHref}
        className={`flex items-center gap-3 px-3 py-3 rounded-xl border transition-colors ${
          onProfile
            ? "border-maroon/40 bg-amber/15"
            : "border-gold/25 bg-white hover:border-maroon/30"
        }`}
      >
        <span className="w-9 h-9 rounded-full bg-brown text-ivory flex items-center justify-center font-display text-sm shrink-0 ring-2 ring-gold/40">
          {userInitial}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm text-brown truncate">{userLabel}</span>
          {userEmail ? (
            <span className="block text-[11px] text-brown/50 font-mono truncate">
              {userEmail}
            </span>
          ) : null}
        </span>
      </Link>
    );
  };

  return (
    <>
      {/* ── Desktop sidebar (≥ lg) ───────────────────────────────── */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 z-30 w-[240px] flex-col bg-ivory border-r border-gold/25">
        <div className="px-5 h-16 flex items-center border-b border-gold/25 shrink-0">
          <Brand />
        </div>
        <div className="flex-1 overflow-y-auto p-3 pb-4">
          <DesktopNav />
        </div>
        <div className="p-3 border-t border-gold/25">
          <ProfilePod />
        </div>
      </aside>

      {/* ── Mobile top title bar (< lg) ──────────────────────────── */}
      <div className="lg:hidden sticky top-0 z-30 bg-ivory/85 backdrop-blur-xl border-b border-gold/25 h-14 px-5 flex items-center">
        <Brand small />
      </div>

      {/* ── Mobile bottom tab bar (< lg) ─────────────────────────── */}
      <nav
        className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-brown/95 backdrop-blur-xl border-t border-ivory/10"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="flex items-stretch justify-around h-16 px-1">
          {mobileTabs.slice(0, 5).map((it) => {
            const active = isActive(it);
            const Icon = ICONS[it.icon];

            if (it.isPrimary) {
              return (
                <Link
                  key={it.href + it.label}
                  href={it.href}
                  className="flex-1 flex items-center justify-center active:scale-[0.98] transition-transform"
                >
                  <span className="flex flex-col items-center justify-center gap-0.5">
                    <span className="w-11 h-11 -mt-5 rounded-full bg-maroon text-ivory flex items-center justify-center shadow-md shadow-black/30 ring-4 ring-brown">
                      <Icon className="w-5 h-5" strokeWidth={2.25} />
                    </span>
                    <span
                      className={`text-[10px] font-medium tracking-wide ${
                        active ? "text-gold" : "text-gold/80"
                      }`}
                    >
                      {it.label}
                    </span>
                  </span>
                </Link>
              );
            }

            if (it.isProfile) {
              return (
                <Link
                  key={it.href}
                  href={it.href}
                  className="flex-1 flex flex-col items-center justify-center gap-1 min-w-0 active:scale-[0.98] transition-transform"
                >
                  <span
                    className={`w-7 h-7 rounded-full bg-ivory/10 text-ivory flex items-center justify-center text-xs font-display ring-2 transition-all ${
                      active ? "ring-gold bg-gold/20 text-gold" : "ring-ivory/20"
                    }`}
                  >
                    {userInitial}
                  </span>
                  <span
                    className={`text-[10px] font-medium tracking-wide truncate px-1 ${
                      active ? "text-gold" : "text-ivory/55"
                    }`}
                  >
                    {it.label}
                  </span>
                </Link>
              );
            }

            return (
              <Link
                key={it.href + it.label}
                href={it.href}
                className="flex-1 flex flex-col items-center justify-center gap-1 min-w-0 active:scale-[0.98] transition-transform"
              >
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
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
