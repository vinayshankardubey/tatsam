import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LoginForm } from "./login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect } = await searchParams;
  const safeRedirect = redirect && redirect.startsWith("/") ? redirect : "/dashboard";

  return (
    <main className="min-h-screen flex items-center justify-center bg-ivory px-6 py-16 relative overflow-hidden">
      {/* Soft amber glow top-right */}
      <div
        className="pointer-events-none absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full blur-3xl opacity-30"
        style={{ background: "radial-gradient(closest-side, #F4B860, transparent)" }}
      />
      {/* Gold glow bottom-left */}
      <div
        className="pointer-events-none absolute -bottom-40 -left-40 w-[520px] h-[520px] rounded-full blur-3xl opacity-25"
        style={{ background: "radial-gradient(closest-side, #C9A35A, transparent)" }}
      />

      {/* Back to home */}
      <Link
        href="/"
        aria-label="Back to home"
        className="absolute top-5 left-5 z-20 inline-flex items-center gap-2 h-10 pl-3 pr-4 rounded-full bg-white/70 border border-gold/30 text-brown/75 hover:text-maroon hover:border-maroon/40 backdrop-blur-sm transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm">Home</span>
      </Link>

      <div className="relative z-10 w-full flex justify-center">
        <LoginForm redirect={safeRedirect} />
      </div>
    </main>
  );
}
