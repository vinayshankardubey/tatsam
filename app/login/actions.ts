"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export type ActionResult = { error?: string; email?: string };

const IS_DEV = process.env.NODE_ENV === "development";
const DEMO_OTP = process.env.DEV_DEMO_OTP ?? "000000";

export async function sendOtp(formData: FormData): Promise<ActionResult> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Please enter a valid email." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { shouldCreateUser: true },
  });

  if (error) return { error: error.message };
  return { email };
}

export async function verifyOtp(formData: FormData): Promise<ActionResult> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const token = String(formData.get("token") ?? "").trim();
  const redirectTo = String(formData.get("redirect") ?? "/dashboard");

  if (!email || !token) return { error: "Enter the 6-digit code we emailed you." };

  // Dev-only bypass: accept a fixed demo OTP for any email.
  // Prod never reaches this branch because NODE_ENV is "production".
  if (IS_DEV && token === DEMO_OTP) {
    const result = await devSignIn(email, redirectTo);
    if (result) return result;
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({ email, token, type: "email" });

  if (error) return { error: error.message };
  redirect(redirectTo || "/dashboard");
}

async function devSignIn(email: string, redirectTo: string): Promise<ActionResult | void> {
  const admin = createAdminClient();

  // Ensure the user exists (idempotent — ignore "already exists").
  const { error: createErr } = await admin.auth.admin.createUser({
    email,
    email_confirm: true,
  });
  if (createErr && !/already been registered|already exists/i.test(createErr.message)) {
    return { error: createErr.message };
  }

  // Mint a magic-link hash, then verify it to set the session cookie.
  const { data, error } = await admin.auth.admin.generateLink({
    type: "magiclink",
    email,
  });
  if (error) return { error: error.message };

  const hashedToken = data.properties?.hashed_token;
  if (!hashedToken) return { error: "Dev bypass: no hashed_token in generateLink response." };

  const supabase = await createClient();
  const { error: verifyErr } = await supabase.auth.verifyOtp({
    token_hash: hashedToken,
    type: "magiclink",
  });
  if (verifyErr) return { error: verifyErr.message };

  redirect(redirectTo || "/dashboard");
}
