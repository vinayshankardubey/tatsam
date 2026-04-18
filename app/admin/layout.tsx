import Link from "next/link";
import { requireRole } from "@/lib/supabase/require-role";
import { signOut } from "./actions";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole("admin");

  return (
    <div className="min-h-screen bg-ivory text-brown">
      <header className="sticky top-0 z-30 bg-ivory/80 backdrop-blur-xl border-b border-gold/20">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="text-xl font-display text-brown">Tatsam</span>
            <span className="text-[10px] text-brown/50 font-mono tracking-wider uppercase">
              Admin
            </span>
          </Link>
          <nav className="flex items-center gap-8 text-sm">
            <Link href="/admin" className="text-brown/70 hover:text-brown">
              Overview
            </Link>
            <Link href="/admin/readings" className="text-brown/70 hover:text-brown">
              Readings
            </Link>
            <Link href="/admin/users" className="text-brown/70 hover:text-brown">
              Users
            </Link>
            <Link href="/astrologer" className="text-brown/70 hover:text-brown">
              Acharya view
            </Link>
            <form action={signOut}>
              <button
                type="submit"
                className="text-brown/70 hover:text-maroon"
              >
                Sign out
              </button>
            </form>
          </nav>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-6 lg:px-10 py-12 lg:py-16">
        {children}
      </main>
    </div>
  );
}
