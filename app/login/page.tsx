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
      <div className="relative z-10 w-full flex justify-center">
        <LoginForm redirect={safeRedirect} />
      </div>
    </main>
  );
}
