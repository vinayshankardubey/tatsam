"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PLAN_META, type ReadingPlan } from "@/lib/supabase/types";

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const full_name = String(formData.get("full_name") ?? "").trim() || null;
  const phone = String(formData.get("phone") ?? "").trim() || null;
  const dob = String(formData.get("dob") ?? "").trim() || null;
  const tob = String(formData.get("tob") ?? "").trim() || null;
  const birth_place = String(formData.get("birth_place") ?? "").trim() || null;
  const language = String(formData.get("language") ?? "en").trim() || "en";

  const { error } = await supabase
    .from("profiles")
    .update({ full_name, phone, dob, tob, birth_place, language })
    .eq("id", user.id);

  if (error) return { error: error.message };
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function sendMessage(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const reading_id = String(formData.get("reading_id") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  if (!reading_id || !body) return { error: "Please write a message." };
  if (body.length > 4000) return { error: "Message is too long." };

  const { error } = await supabase.from("reading_messages").insert({
    reading_id,
    sender_id: user.id,
    body,
  });
  if (error) return { error: error.message };
  revalidatePath(`/dashboard/readings/${reading_id}`);
  return { ok: true };
}

export async function bookReading(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const plan = String(formData.get("plan") ?? "") as ReadingPlan;
  const seeker_note = String(formData.get("seeker_note") ?? "").trim() || null;

  if (!["darshan", "signature", "legacy"].includes(plan)) {
    return { error: "Please choose a valid plan." };
  }

  const { data, error } = await supabase
    .from("readings")
    .insert({
      user_id: user.id,
      plan,
      seeker_note,
      price_inr: PLAN_META[plan].priceInr,
    })
    .select("id")
    .single();

  if (error) return { error: error.message };
  revalidatePath("/dashboard");
  redirect(`/dashboard/readings/${data.id}`);
}
