"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

/**
 * Nav items shown on the landing page. We keep two sets: one for visitors
 * (discovery-focused — real pages, not in-page anchors) and a shorter
 * logged-in set that jumps straight into product surfaces.
 */
const PUBLIC_LINKS: Array<{ name: string; href: string }> = [
  { name: "Explore",       href: "/tatsam"        },
  { name: "Daily panchang", href: "/panchang"     },
  { name: "How we answer", href: "/how-we-answer" },
  { name: "Sources",       href: "/sources"       },
  { name: "Apps",          href: "/apps"          },
];

const SIGNED_IN_LINKS: Array<{ name: string; href: string }> = [
  { name: "Today",      href: "/dashboard"          },
  { name: "Tatsam",     href: "/tatsam"             },
  { name: "Kundli",     href: "/dashboard/kundli"   },
  { name: "Readings",   href: "/dashboard/readings" },
];

export function Navigation({ isSignedIn = false }: { isSignedIn?: boolean }) {
  const navLinks = isSignedIn ? SIGNED_IN_LINKS : PUBLIC_LINKS;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 left-0 right-0 z-50">
      <nav
        className={`mx-auto max-w-[1400px] ${
          isMobileMenuOpen
            ? "bg-background/80 backdrop-blur-xl border border-foreground/10"
            : "bg-transparent"
        }`}
      >
        <div className="flex items-center justify-between px-6 lg:px-8 h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-display tracking-tight text-brown text-2xl">Tatsam</span>
            <span className="font-mono text-brown/55 text-xs mt-1">तत्सम्</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm text-brown/70 hover:text-brown transition-colors duration-300 relative group whitespace-nowrap"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-maroon transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            {isSignedIn ? (
              <Link href="/dashboard" className="text-sm text-brown/70 hover:text-brown">
                Dashboard
              </Link>
            ) : (
              <Link href="/login" className="text-sm text-brown/70 hover:text-brown">
                Sign in
              </Link>
            )}
            <Button
              asChild
              size="sm"
              className="rounded-full bg-maroon text-ivory hover:bg-maroon/90 px-6"
            >
              <Link href="/dashboard/ask">Ask a question</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open menu"
            className={`md:hidden p-2 text-brown/80 transition-opacity duration-200 ${
              isMobileMenuOpen ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

      </nav>

      {/* Mobile Menu - Full Screen Overlay */}
      <div
        className={`md:hidden fixed inset-0 bg-background z-40 transition-all duration-500 ${
          isMobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        style={{ top: 0 }}
      >
        <div className="flex flex-col h-full px-8 pt-28 pb-8">
          {/* Close button — explicit top-right exit from the overlay */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close menu"
            className="absolute top-5 right-5 z-10 w-11 h-11 rounded-full bg-brown text-ivory flex items-center justify-center shadow-sm"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Navigation Links */}
          <div className="flex-1 flex flex-col justify-center gap-6">
            {navLinks.map((link, i) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-4xl md:text-5xl font-display text-foreground hover:text-muted-foreground transition-all duration-500 ${
                  isMobileMenuOpen
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: isMobileMenuOpen ? `${i * 75}ms` : "0ms" }}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Bottom CTAs */}
          <div className={`flex gap-4 pt-8 border-t border-foreground/10 transition-all duration-500 ${
            isMobileMenuOpen
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: isMobileMenuOpen ? "300ms" : "0ms" }}
          >
            <Button
              asChild
              variant="outline"
              className="flex-1 rounded-full h-14 text-base"
            >
              <Link href={isSignedIn ? "/dashboard" : "/login"} onClick={() => setIsMobileMenuOpen(false)}>
                {isSignedIn ? "Dashboard" : "Sign in"}
              </Link>
            </Button>
            <Button
              asChild
              className="flex-1 bg-foreground text-background rounded-full h-14 text-base"
            >
              <Link href="/dashboard/ask" onClick={() => setIsMobileMenuOpen(false)}>
                Ask a question
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
