import { createClient } from "@supabase/supabase-js";

const URL  = "http://127.0.0.1:54421";
const SR   = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU";
const ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0";
const APP = process.env.APP_URL ?? "http://127.0.0.1:3000";

const cookieName = "sb-127-auth-token";
const admin = createClient(URL, SR, { auth: { persistSession: false, autoRefreshToken: false }});

async function sign(email) {
  // Fresh anon client per call to avoid cross-session pollution.
  const anon = createClient(URL, ANON, { auth: { persistSession: false, autoRefreshToken: false }});
  const link = await admin.auth.admin.generateLink({ type: "magiclink", email });
  if (link.error) throw new Error(`generateLink ${email}: ${link.error.message}`);
  const v = await anon.auth.verifyOtp({ token_hash: link.data.properties.hashed_token, type: "magiclink" });
  if (v.error) throw new Error(`verifyOtp ${email}: ${v.error.message}`);
  const s = v.data.session;
  const payload = {
    access_token: s.access_token, token_type: "bearer", expires_in: 3600,
    expires_at: Math.floor(Date.now()/1000)+3600, refresh_token: s.refresh_token, user: v.data.user,
  };
  return `${cookieName}=${encodeURIComponent(JSON.stringify(payload))}`;
}

async function check(label, path, email, needs) {
  try {
    const cookie = await sign(email);
    const res = await fetch(`${APP}${path}`, { headers: { cookie }, redirect: "manual" });
    const text = await res.text();
    const missing = needs.filter((n) => !text.includes(n));
    const ok = res.status === 200 && missing.length === 0;
    console.log(`${ok ? "✅" : "⚠️ "} ${label.padEnd(30)} ${path.padEnd(30)} ${res.status}  ${text.length}b  ${ok ? "" : `missing: ${missing.join(", ")}`}`);
    if (!ok && process.env.DEBUG) console.log(text.slice(0, 3000));
  } catch (e) {
    console.log(`❌ ${label}: ${e.message}`);
  }
  await new Promise((r) => setTimeout(r, 600));
}

await check("seeker Today",                  "/dashboard",                   "anika@example.com",     ["Anika", "Tithi", "Upcoming sky events"]);
await check("seeker Kundli",                 "/dashboard/kundli",            "anika@example.com",     ["Your Kundli", "Sidereal", "Personal Year"]);
await check("seeker Readings index",         "/dashboard/readings",          "anika@example.com",     ["Every chart cast for you", "Delivered"]);
await check("seeker Ask chat",               "/dashboard/ask",               "anika@example.com",     ["Ask the scriptures", "Try one of these", "Send question"]);
await check("seeker Profile",                "/dashboard/profile",           "anika@example.com",     ["Birth", "Sign out"]);
await check("seeker Panchang",               "/dashboard/panchang",          "anika@example.com",     ["five limbs of time", "Brahma Muhurat", "Next 7 days"]);
await check("seeker Horoscope",              "/dashboard/horoscope",         "anika@example.com",     ["A line for today", "The week ahead"]);
await check("seeker Cosmos",                 "/dashboard/cosmos",            "anika@example.com",     ["year ahead in the sky", "Upcoming events"]);
await check("seeker Numerology",             "/dashboard/numerology",        "anika@example.com",     ["Your core five", "9-year cycle"]);
await check("seeker Compatibility",          "/dashboard/compatibility",     "anika@example.com",     ["Is your rhythm aligned", "The other person"]);
await check("seeker Remedies",               "/dashboard/remedies",          "anika@example.com",     ["Practices prescribed for you", "Daily practice"]);
await check("acharya aging + avg",           "/astrologer",             "acharya1@tatsam.local", ["waiting", "Avg turnaround"]);
await check("admin range + avg deliver",     "/admin",                  "admin@tatsam.local",    ["Avg time to deliver", "Readings over the last"]);
await check("admin 7d range",                "/admin?range=7",          "admin@tatsam.local",    ["7 days"]);
await check("admin readings search",         "/admin/readings?q=anika", "admin@tatsam.local",    ["All readings"]);
await check("admin users search",            "/admin/users?q=acharya",  "admin@tatsam.local",    ["acharya"]);
