// Seed realistic data for dashboard smoke-testing.
// Run: node supabase/scripts/seed-realistic.mjs

import { createClient } from "@supabase/supabase-js";

const URL = "http://127.0.0.1:54421";
const SR = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU";
const admin = createClient(URL, SR, { auth: { persistSession: false, autoRefreshToken: false } });

async function upsertSeeker(email, name, dob, tob, place) {
  const { data: existing } = await admin.auth.admin.listUsers();
  let user = existing?.users?.find((u) => u.email === email);
  if (!user) {
    const created = await admin.auth.admin.createUser({ email, email_confirm: true });
    if (created.error) throw created.error;
    user = created.data.user;
  }
  await admin.from("profiles").update({
    full_name: name, dob, tob, birth_place: place, language: "en",
  }).eq("id", user.id);
  return user.id;
}

async function createReading({ user_id, acharya_id, plan, status, seeker_note, price_inr, summary, report_url, daysAgo, messages, remedies }) {
  const created_at = new Date(Date.now() - daysAgo * 864e5).toISOString();
  const { data: r, error } = await admin
    .from("readings")
    .insert({
      user_id, acharya_id, plan, status, seeker_note, price_inr,
      acharya_name: acharya_id ? "Acharya Narayan Iyer" : null,
      acharya_summary: summary ?? null,
      report_url: report_url ?? null,
      delivered_at: status === "delivered" ? new Date(Date.now() - (daysAgo - 2) * 864e5).toISOString() : null,
      created_at,
      updated_at: created_at,
    })
    .select("id")
    .single();
  if (error) throw error;
  for (const rem of remedies ?? []) {
    await admin.from("reading_remedies").insert({ reading_id: r.id, ...rem });
  }
  for (const m of messages ?? []) {
    await admin.from("reading_messages").insert({ reading_id: r.id, sender_id: m.sender_id, body: m.body });
  }
  return r.id;
}

async function main() {
  // Fetch our seeded acharyas.
  const { data: ac } = await admin.from("profiles").select("id, full_name").eq("role", "acharya");
  const acharyaNarayan = ac.find((a) => a.full_name?.includes("Narayan"))?.id;
  const acharyaMeera = ac.find((a) => a.full_name?.includes("Meera"))?.id;

  // A few seekers with full birth details.
  const anika = await upsertSeeker("anika@example.com", "Anika Shah", "1994-08-17", "06:42", "Varanasi, India");
  const rohan = await upsertSeeker("rohan@example.com", "Rohan Mehta", "1987-11-03", "14:20", "Mumbai, India");
  const priya = await upsertSeeker("priya@example.com", "Priya Nair", "1991-03-25", "09:05", "Kochi, India");

  // Wipe existing readings first for idempotency.
  for (const id of [anika, rohan, priya]) {
    await admin.from("readings").delete().eq("user_id", id);
  }

  // Anika: delivered Signature, full story.
  await createReading({
    user_id: anika,
    acharya_id: acharyaNarayan,
    plan: "signature",
    status: "delivered",
    seeker_note: "I'm at a career crossroads and unsure whether to leave my current role. Would love clarity.",
    price_inr: 2499,
    summary: `Anika ji,

Your Shukra Mahadasha is entering a warmer phase — the next 18 months favour creative risks over safe moves. Your 10th-house placement supports a lateral move into a role where your voice is heard, not hidden. The moment around Feb 2027 will be especially supportive for announcements and launches.

The internal conflict you named is reading as a Saturn-Moon transit echo, not a structural problem. Rest assured: the path you feel pulled toward is the one your chart is pointing at too.`,
    report_url: "https://example.com/reports/anika-signature.pdf",
    daysAgo: 4,
    messages: [
      { sender_id: anika, body: "Thank you so much — the summary captured exactly what I needed to hear." },
      { sender_id: acharyaNarayan, body: "You're welcome, Anika. Return anytime with follow-ups. Feb is your month." },
    ],
    remedies: [
      { category: "mantra", title: "Shukra Beej Mantra · 108×", detail: "Chant 'Om Shum Shukraya Namah' Friday mornings before sunrise.", sort_order: 1 },
      { category: "gemstone", title: "Opal (set in silver)", detail: "Wear on right ring finger, first worn on a Friday during Shukla Paksha.", sort_order: 2 },
      { category: "charity", title: "Donate white cloth to a young girl", detail: "On any Friday — symbolic offering to Shukra.", sort_order: 3 },
      { category: "practice", title: "Journal every evening for 21 days", detail: "Track what drained you vs what lit you up. Your body already knows the answer.", sort_order: 4 },
    ],
  });

  // Rohan: in_review, assigned, has messages + partial remedies.
  await createReading({
    user_id: rohan,
    acharya_id: acharyaMeera,
    plan: "darshan",
    status: "in_review",
    seeker_note: "Feeling stuck with finances. Is 2026 a year to consolidate or to expand?",
    price_inr: 499,
    summary: null,
    report_url: null,
    daysAgo: 2,
    messages: [
      { sender_id: acharyaMeera, body: "Rohan ji, looking at your chart now. I'll have a summary for you within 24 hours." },
      { sender_id: rohan, body: "Thank you, acharya ji. Take your time." },
    ],
    remedies: [
      { category: "practice", title: "Track expenses for 7 days before we talk", detail: "Nothing more — just awareness. Tells me what your money relationship actually is.", sort_order: 1 },
    ],
  });

  // Priya: pending, unassigned (just booked 2 hours ago).
  await createReading({
    user_id: priya,
    acharya_id: null,
    plan: "legacy",
    status: "pending",
    seeker_note: "Looking for a full reading for myself and a compatibility reading for my partner. We're planning engagement muhurat for March.",
    price_inr: null,
    daysAgo: 0,
  });

  // Another pending to stress the queue.
  await createReading({
    user_id: anika,
    acharya_id: null,
    plan: "darshan",
    status: "pending",
    seeker_note: "Quick follow-up — curious about my son's chart. DOB 2021-07-12, 04:15, Pune.",
    price_inr: 499,
    daysAgo: 1,
  });

  // Print summary
  const { data: rows } = await admin.from("readings").select("id, plan, status, acharya_id, created_at").order("created_at", { ascending: false });
  console.log(`Seeded. Total readings: ${rows.length}`);
  for (const r of rows) console.log(` - ${r.plan.padEnd(9)} ${r.status.padEnd(10)} ${r.acharya_id ? "assigned" : "open"}  ${r.created_at}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
