import Link from "next/link";
import { requireRole } from "@/lib/supabase/require-role";
import { signOut } from "./actions";

export default async function AstrologerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile } = await requireRole("acharya");

  return (
    <div className="min-h-screen bg-ivory text-brown">
      <header className="sticky top-0 z-30 bg-ivory/80 backdrop-blur-xl border-b border-gold/20">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/astrologer" className="flex items-center gap-2">
              <span className="text-xl font-display text-brown">Tatsam</span>
              <span className="text-[10px] text-brown/50 font-mono tracking-wider uppercase">
                Acharya
              </span>
            </Link>
            <span className="hidden md:inline text-xs text-brown/55">
              {profile.full_name ?? "Acharya"}
            </span>
          </div>

          <nav className="flex items-center gap-8 text-sm">
            <Link href="/astrologer" className="text-brown/70 hover:text-brown transition-colors">
              Queue
            </Link>
            <Link href="/dashboard" className="text-brown/70 hover:text-brown transition-colors">
              My chart
            </Link>
            <form action={signOut}>
              <button
                type="submit"
                className="text-brown/70 hover:text-maroon transition-colors"
              >
                Sign out
              </button>
            </form>
          </nav>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-6 lg:px-10 py-12 lg:py-16">
        {children}
      </main>
    </div>
  );
}
