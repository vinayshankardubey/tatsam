"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav className={`navbar${scrolled ? " scrolled" : ""}`}>
      <div className="navbar__bar">
        {/* Left: ≡ MENU (morni style) */}
        <button className="navbar__menu-btn" aria-label="Open menu">
          <span className="navbar__hamburger">
            <span /><span /><span />
          </span>
          <span>Menu</span>
        </button>

        {/* Center: WORDMARK */}
        <Link href="/" className="navbar__wordmark">
          Tatsam
        </Link>

        {/* Right: icons */}
        <div className="navbar__actions">
          <button className="navbar__action-btn" aria-label="Search">🔍</button>
          <button className="navbar__action-btn" aria-label="Favourites">☽</button>
          <button className="navbar__action-btn" aria-label="Sign in">👤</button>
        </div>
      </div>
    </nav>
  );
}
