"use client";

import { useEffect, useRef, useState } from "react";
import {
  Sparkles,
  Flame,
  Gem,
  BookOpen,
  CalendarDays,
  Compass,
  type LucideIcon,
} from "lucide-react";

export type CategoryKey =
  | "oracle"
  | "remedy"
  | "talisman"
  | "chart"
  | "counsel"
  | "daily";

export type CategoryChipItem = {
  id: CategoryKey;
  label: string;
  count: number;
  isNew?: boolean;
};

const ICON: Record<CategoryKey, LucideIcon> = {
  oracle:   Sparkles,
  remedy:   Flame,
  talisman: Gem,
  chart:    Compass,
  counsel:  BookOpen,
  daily:    CalendarDays,
};

const GRADIENT: Record<CategoryKey, string> = {
  oracle:   "from-[#F4D88A]/55 via-amber/30 to-[#F4B860]/20",
  remedy:   "from-[#E2A36C]/45 via-amber/30 to-[#C9A35A]/25",
  talisman: "from-[#F4D88A]/60 via-[#F7E3B5]/50 to-[#E9C889]/35",
  chart:    "from-[#C9A35A]/30 via-ivory to-[#E6DED6]/60",
  counsel:  "from-[#F4B860]/35 via-[#F7E3B5]/40 to-ivory",
  daily:    "from-[#F7E3B5]/55 via-ivory to-[#E6DED6]/60",
};

const ACCENT: Record<CategoryKey, string> = {
  oracle:   "text-[#8B2C2C]",
  remedy:   "text-[#8B2C2C]",
  talisman: "text-[#6B4416]",
  chart:    "text-[#2B1F1A]",
  counsel:  "text-[#8B2C2C]",
  daily:    "text-[#2B1F1A]",
};

export function CategoryChips({
  items,
  stickyTopClass = "top-14",
}: {
  items: CategoryChipItem[];
  /** Tailwind class(es) for the nav's pinned offset (e.g. "top-14 lg:top-0"). */
  stickyTopClass?: string;
}) {
  const [stuck, setStuck] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    // The nav is pinned at top: 56px (below the app-bar). When the sentinel
    // — placed right before the nav — scrolls out of the viewport (after
    // accounting for that 56px offset), the rail is pinned.
    const io = new IntersectionObserver(
      ([entry]) => setStuck(!entry.isIntersecting),
      { rootMargin: "-57px 0px 0px 0px", threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <>
      {/* Sentinel — invisible, used only to detect pinned state */}
      <div ref={sentinelRef} aria-hidden="true" className="h-px w-full" />

      <nav
        aria-label="Tool categories"
        data-stuck={stuck ? "true" : "false"}
        className={`sticky ${stickyTopClass} z-20 border-y border-gold/20 bg-ivory/90 backdrop-blur-xl transition-[padding] duration-200`}
      >
        <div className="max-w-[1200px] mx-auto">
          <div
            className={`flex overflow-x-auto no-scrollbar px-5 lg:px-8 snap-x snap-mandatory transition-[gap,padding] duration-200 ${
              stuck ? "gap-2 md:gap-3 py-2" : "gap-3 md:gap-5 py-3 md:py-4"
            }`}
          >
            {items.map((it) => (
              <Chip key={it.id} item={it} stuck={stuck} />
            ))}
          </div>
        </div>
      </nav>
    </>
  );
}

function Chip({ item, stuck }: { item: CategoryChipItem; stuck: boolean }) {
  const Icon = ICON[item.id];

  // Stuck: compact pill (icon + label on one line).
  if (stuck) {
    return (
      <a
        href={`#cat-${item.id}`}
        className={`shrink-0 snap-start inline-flex items-center gap-2 h-9 pl-2 pr-3 rounded-full border border-gold/30 bg-gradient-to-br ${GRADIENT[item.id]} hover:border-maroon/40 hover:shadow-sm transition-all`}
      >
        <span className="relative w-6 h-6 rounded-full bg-white/60 border border-gold/25 flex items-center justify-center">
          <Icon className={`w-3.5 h-3.5 ${ACCENT[item.id]}`} strokeWidth={1.75} />
          {item.isNew ? (
            <span
              aria-label="new category"
              className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-maroon ring-2 ring-ivory"
            />
          ) : null}
        </span>
        <span className="text-[12px] text-brown/85 whitespace-nowrap">
          {item.label}
        </span>
        {item.count > 0 ? (
          <span className="text-[9px] font-mono text-brown/45 leading-none">
            {item.count}
          </span>
        ) : null}
      </a>
    );
  }

  // Default: stacked circle with label below (original, roomier look).
  return (
    <a
      href={`#cat-${item.id}`}
      className="shrink-0 snap-start flex flex-col items-center gap-1.5 group w-[68px] md:w-[88px]"
    >
      <span
        className={`relative w-14 h-14 md:w-[68px] md:h-[68px] rounded-full bg-gradient-to-br ${GRADIENT[item.id]} border border-gold/30 flex items-center justify-center transition-all group-hover:border-maroon/40 group-hover:shadow-sm`}
      >
        <Icon
          className={`w-5 h-5 md:w-6 md:h-6 ${ACCENT[item.id]}`}
          strokeWidth={1.75}
        />
        {item.isNew ? (
          <span
            aria-label="new category"
            className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-maroon ring-2 ring-ivory"
          />
        ) : null}
      </span>
      <span className="text-[10px] md:text-xs text-brown/80 text-center leading-tight line-clamp-2 max-w-full">
        {item.label}
      </span>
      {item.count > 0 ? (
        <span className="text-[9px] font-mono text-brown/40 leading-none">
          {item.count}
        </span>
      ) : null}
    </a>
  );
}
