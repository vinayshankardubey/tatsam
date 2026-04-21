import Link from "next/link";
import { FooterSection } from "@/components/landing/footer-section";
import { LandingBottomNav } from "@/components/landing/bottom-nav";
import { getCurrentUser } from "@/lib/supabase/current-user";

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-ivory text-brown flex flex-col">
      <header className="sticky top-0 z-30 bg-ivory/85 backdrop-blur-xl border-b border-gold/25 h-14">
        <div className="max-w-[1200px] h-full mx-auto px-5 lg:px-8 flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2 min-w-0">
            <span className="text-lg font-display text-brown">Tatsam</span>
            <span className="text-[10px] font-mono text-brown/40">तत्सम्</span>
          </Link>
          <nav className="flex items-center gap-3 sm:gap-4 text-sm">
            {user ? (
              <Link href="/dashboard" className="text-brown/70 hover:text-brown">
                Dashboard
              </Link>
            ) : (
              <Link href="/login" className="text-brown/70 hover:text-brown">
                Sign in
              </Link>
            )}
            <Link
              href="/dashboard/ask"
              className="inline-flex items-center h-8 px-3 sm:px-4 rounded-full bg-maroon text-ivory hover:bg-maroon/90"
            >
              Ask a question
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <FooterSection />

      <LandingBottomNav isSignedIn={!!user} />
    </div>
  );
}
