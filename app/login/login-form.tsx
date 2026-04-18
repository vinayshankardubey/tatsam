"use client";

import { useEffect, useState, useTransition } from "react";
import { sendOtp, verifyOtp } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const IS_DEV = process.env.NODE_ENV === "development";
const RESEND_COOLDOWN_SEC = 60;

export function LoginForm({ redirect }: { redirect: string }) {
  const [email, setEmail] = useState("");
  const [stage, setStage] = useState<"email" | "otp">("email");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [resendIn, setResendIn] = useState(0);

  // Tick down the resend cooldown.
  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  const resend = () => {
    if (resendIn > 0 || !email) return;
    setError(null);
    setInfo(null);
    const fd = new FormData();
    fd.set("email", email);
    startTransition(async () => {
      const result = await sendOtp(fd);
      if (result.error) setError(result.error);
      else {
        setInfo("A fresh code is on its way.");
        setResendIn(RESEND_COOLDOWN_SEC);
      }
    });
  };

  return (
    <div className="w-full max-w-md">
      <div className="mb-10 text-center">
        <div className="inline-flex items-center gap-2 mb-6">
          <span className="text-3xl font-display text-brown">Tatsam</span>
          <span className="text-xs text-brown/50 font-mono">तत्सम्</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-display text-brown leading-tight mb-3">
          {stage === "email" ? "Welcome, seeker." : "Check your email."}
        </h1>
        <p className="text-brown/60 text-sm leading-relaxed">
          {stage === "email"
            ? "Enter your email. We'll send you a one-time code to sign in."
            : `We sent a 6-digit code to ${email}. Enter it below to continue.`}
        </p>
      </div>

      {stage === "email" ? (
        <form
          action={(fd) => {
            setError(null);
            setInfo(null);
            startTransition(async () => {
              const result = await sendOtp(fd);
              if (result.error) setError(result.error);
              else if (result.email) {
                setEmail(result.email);
                setStage("otp");
                setResendIn(RESEND_COOLDOWN_SEC);
              }
            });
          }}
          className="space-y-4"
        >
          <Input
            type="email"
            name="email"
            required
            autoFocus
            placeholder="you@example.com"
            className="h-12 bg-white border-gold/30 focus-visible:border-maroon focus-visible:ring-gold/30"
          />
          <Button
            type="submit"
            disabled={pending}
            className="w-full h-12 bg-maroon hover:bg-maroon/90 text-ivory text-base rounded-full"
          >
            {pending ? "Sending code…" : "Send me a code"}
          </Button>
        </form>
      ) : (
        <form
          action={(fd) => {
            setError(null);
            setInfo(null);
            fd.set("email", email);
            fd.set("redirect", redirect);
            startTransition(async () => {
              const result = await verifyOtp(fd);
              if (result?.error) setError(result.error);
            });
          }}
          className="space-y-4"
        >
          <Input
            type="text"
            name="token"
            required
            autoFocus
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="\d{6}"
            maxLength={6}
            placeholder="6-digit code"
            className="h-14 text-center text-2xl tracking-[0.5em] font-mono bg-white border-gold/30 focus-visible:border-maroon focus-visible:ring-gold/30"
          />
          <Button
            type="submit"
            disabled={pending}
            className="w-full h-12 bg-maroon hover:bg-maroon/90 text-ivory text-base rounded-full"
          >
            {pending ? "Verifying…" : "Verify & continue"}
          </Button>

          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={() => {
                setStage("email");
                setError(null);
                setInfo(null);
                setResendIn(0);
              }}
              className="text-sm text-brown/60 hover:text-maroon transition-colors"
            >
              Use a different email
            </button>
            <button
              type="button"
              onClick={resend}
              disabled={resendIn > 0 || pending}
              className="text-sm text-brown/60 hover:text-maroon transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resendIn > 0 ? `Resend in ${resendIn}s` : "Resend code"}
            </button>
          </div>
        </form>
      )}

      {error ? (
        <p className="mt-6 text-sm text-maroon text-center">{error}</p>
      ) : null}
      {info && !error ? (
        <p className="mt-6 text-sm text-[#2F6A3E] text-center">{info}</p>
      ) : null}

      {IS_DEV && stage === "otp" ? (
        <div className="mt-6 text-center text-xs font-mono text-brown/50">
          dev mode — any code works: <span className="text-brown">000000</span>
        </div>
      ) : null}

      <p className="mt-10 text-xs text-center text-brown/50 leading-relaxed">
        By continuing you agree to our terms. We&rsquo;ll never share your birth
        details or email.
      </p>
    </div>
  );
}
