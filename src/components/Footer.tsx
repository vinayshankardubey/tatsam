import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer" id="about">
      <div className="container">
        <div className="footer__grid">
          {/* Brand */}
          <div>
            <span className="footer__wordmark">Tatsam</span>
            <p className="footer__tagline">Know Your Stars, Know Yourself</p>
            <p className="footer__brand-desc">
              India&apos;s premium astrology platform — connecting seekers with ancient Vedic
              wisdom, AI-powered birth charts, and expert astrologers.
            </p>
            <div className="footer__social">
              <a href="#" className="footer__soc-btn" aria-label="Instagram">⊕</a>
              <a href="#" className="footer__soc-btn" aria-label="Twitter">✦</a>
              <a href="#" className="footer__soc-btn" aria-label="YouTube">○</a>
            </div>
          </div>

          {/* Explore */}
          <div>
            <span className="footer__col-head">Explore</span>
            <ul className="footer__links">
              <li><Link href="#readings">Birth Chart Reading</Link></li>
              <li><Link href="#readings">Live Consultations</Link></li>
              <li><Link href="#zodiac">Zodiac Explorer</Link></li>
              <li><Link href="#readings">Daily Horoscope</Link></li>
              <li><Link href="#readings">Compatibility Report</Link></li>
            </ul>
          </div>

          {/* Learn */}
          <div>
            <span className="footer__col-head">Learn</span>
            <ul className="footer__links">
              <li><Link href="#journal">Astrology Journal</Link></li>
              <li><Link href="#journal">Vedic Basics</Link></li>
              <li><Link href="#journal">Planet Transits</Link></li>
              <li><Link href="#journal">Moon Phases</Link></li>
              <li><Link href="#journal">Dasha System</Link></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <span className="footer__col-head">Connect</span>
            <ul className="footer__links">
              <li><a href="mailto:hello@tatsam.app">hello@tatsam.app</a></li>
              <li><a href="#">@tatsam.astro</a></li>
              <li><Link href="#">Partner With Us</Link></li>
              <li><Link href="#">About Tatsam</Link></li>
              <li><Link href="#">Careers</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__copy">© 2026 Tatsam Astrology. All rights reserved.</p>
          <div className="footer__legal">
            <Link href="#">FAQs</Link>
            <Link href="#">Privacy</Link>
            <Link href="#">Terms &amp; Conditions</Link>
            <Link href="#">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
