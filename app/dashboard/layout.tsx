import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "./actions";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-ivory text-brown">
      <header className="sticky top-0 z-30 bg-ivory/80 backdrop-blur-xl border-b border-gold/20">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-xl font-display text-brown">Tatsam</span>
            <span className="text-[10px] text-brown/50 font-mono">तत्सम्</span>
          </Link>

          <nav className="flex items-center gap-8 text-sm">
            <Link href="/dashboard" className="text-brown/70 hover:text-brown transition-colors">
              Overview
            </Link>
            <Link
              href="/dashboard/book"
              className="text-brown/70 hover:text-brown transition-colors"
            >
              Book a reading
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
