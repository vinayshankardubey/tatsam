// One-off: create a test seeker on the configured Supabase.
// Reads URL + service-role key from .env.local.
// Run: node supabase/scripts/create-test-user.mjs

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, "../../.env.local");
const env = Object.fromEntries(
  readFileSync(envPath, "utf8")
    .split("\n")
    .filter((l) => l && !l.startsWith("#") && l.includes("="))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    }),
);

const URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SR = env.SUPABASE_SERVICE_ROLE_KEY;
if (!URL || !SR) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");

const admin = createClient(URL, SR, { auth: { persistSession: false, autoRefreshToken: false } });

const EMAIL = process.argv[2] ?? "test@tatsam.app";
const NAME = process.argv[3] ?? "Test User";
const ROLE = process.argv[4] ?? "seeker"; // seeker | acharya | admin

const { data: list, error: listErr } = await admin.auth.admin.listUsers();
if (listErr) throw listErr;

let user = list.users.find((u) => u.email === EMAIL);
if (user) {
  console.log(`Already exists: ${EMAIL}  (id: ${user.id})`);
} else {
  const { data, error } = await admin.auth.admin.createUser({ email: EMAIL, email_confirm: true });
  if (error) throw error;
  user = data.user;
  console.log(`Created: ${EMAIL}  (id: ${user.id})`);
}

const profileFields = {
  full_name: NAME,
  language: "en",
  role: ROLE,
  ...(ROLE === "seeker"
    ? { dob: "1995-06-15", tob: "10:30", birth_place: "Delhi, India" }
    : {}),
};

const { error: upErr } = await admin
  .from("profiles")
  .update(profileFields)
  .eq("id", user.id);

if (upErr) {
  if (upErr.code === "PGRST205") {
    console.log(`\n⚠️  profiles table missing on this Supabase — auth user created, but role='${ROLE}' NOT set. Apply migrations and re-run.`);
  } else {
    throw upErr;
  }
} else {
  const { data: profile } = await admin
    .from("profiles")
    .select("id, full_name, role, language")
    .eq("id", user.id)
    .single();
  console.log("Profile:", profile);
}

console.log(`\nLogin in dev: email=${EMAIL}, OTP=${env.DEV_DEMO_OTP ?? "000000"}`);
