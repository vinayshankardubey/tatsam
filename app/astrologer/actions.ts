"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/supabase/require-role";
import { createAdminClient } from "@/lib/supabase/admin";
import type { ReadingStatus, RemedyCategory } from "@/lib/supabase/types";

export async function claimReading(formData: FormData) {
  const { profile } = await requireRole("acharya");
  const reading_id = String(formData.get("reading_id") ?? "");
  if (!reading_id) return { error: "Missing reading id." };

  const admin = createAdminClient();
  const { error } = await admin
    .from("readings")
    .update({
      acharya_id: profile.id,
      acharya_name: profile.full_name ?? "An acharya",
      status: "in_review",
    })
    .eq("id", reading_id)
    .is("acharya_id", null);

  if (error) return { error: error.message };
  revalidatePath("/astrologer");
  revalidatePath(`/astrologer/readings/${reading_id}`);
  return { ok: true };
}

export async function updateReading(formData: FormData) {
  const { profile } = await requireRole("acharya");
  const reading_id = String(formData.get("reading_id") ?? "");
  if (!reading_id) return { error: "Missing reading id." };

  const status = String(formData.get("status") ?? "") as ReadingStatus;
  const acharya_summary = String(formData.get("acharya_summary") ?? "").trim() || null;
  const report_url = String(formData.get("report_url") ?? "").trim() || null;

  if (!["pending", "in_review", "delivered", "cancelled"].includes(status)) {
    return { error: "Invalid status." };
  }

  const admin = createAdminClient();

  // Load the reading first to verify authorisation (acharya assigned or admin).
  const { data: reading } = await admin
    .from("readings")
    .select("acharya_id")
    .eq("id", reading_id)
    .single();

  if (!reading) return { error: "Reading not found." };
  if (
    profile.role === "acharya" &&
    reading.acharya_id !== profile.id
  ) {
    return { error: "This reading is assigned to another acharya." };
  }

  const patch: Record<string, unknown> = {
    status,
    acharya_summary,
    report_url,
  };
  if (status === "delivered") patch.delivered_at = new Date().toISOString();

  const { error } = await admin.from("readings").update(patch).eq("id", reading_id);
  if (error) return { error: error.message };

  revalidatePath("/astrologer");
  revalidatePath(`/astrologer/readings/${reading_id}`);
  revalidatePath(`/dashboard/readings/${reading_id}`);
  return { ok: true };
}

export async function addRemedy(formData: FormData) {
  const { profile } = await requireRole("acharya");
  const reading_id = String(formData.get("reading_id") ?? "");
  const category = String(formData.get("category") ?? "") as RemedyCategory;
  const title = String(formData.get("title") ?? "").trim();
  const detail = String(formData.get("detail") ?? "").trim() || null;

  if (!reading_id || !title) return { error: "Give the remedy a title." };
  if (!["mantra", "gemstone", "ritual", "practice", "charity"].includes(category)) {
    return { error: "Pick a remedy category." };
  }

  const admin = createAdminClient();
  const { data: reading } = await admin
    .from("readings")
    .select("acharya_id")
    .eq("id", reading_id)
    .single();
  if (!reading) return { error: "Reading not found." };
  if (profile.role === "acharya" && reading.acharya_id !== profile.id) {
    return { error: "This reading isn't assigned to you." };
  }

  const { error } = await admin
    .from("reading_remedies")
    .insert({ reading_id, category, title, detail });
  if (error) return { error: error.message };

  revalidatePath(`/astrologer/readings/${reading_id}`);
  revalidatePath(`/dashboard/readings/${reading_id}`);
  return { ok: true };
}

export async function deleteRemedy(formData: FormData) {
  const { profile } = await requireRole("acharya");
  const remedy_id = String(formData.get("remedy_id") ?? "");
  const reading_id = String(formData.get("reading_id") ?? "");
  if (!remedy_id) return { error: "Missing remedy id." };

  const admin = createAdminClient();
  // Verify ownership via join.
  const { data: row } = await admin
    .from("reading_remedies")
    .select("reading_id, readings!inner(acharya_id)")
    .eq("id", remedy_id)
    .single();
  const acharyaId = (row as { readings?: { acharya_id: string | null } } | null)?.readings
    ?.acharya_id;
  if (profile.role === "acharya" && acharyaId !== profile.id) {
    return { error: "Not your remedy to remove." };
  }

  const { error } = await admin.from("reading_remedies").delete().eq("id", remedy_id);
  if (error) return { error: error.message };

  revalidatePath(`/astrologer/readings/${reading_id}`);
  revalidatePath(`/dashboard/readings/${reading_id}`);
  return { ok: true };
}

export async function acharyaSendMessage(formData: FormData) {
  const { profile } = await requireRole("acharya");
  const reading_id = String(formData.get("reading_id") ?? "");
  const body = String(formData.get("body") ?? "").trim();
  if (!reading_id || !body) return { error: "Write something first." };
  if (body.length > 4000) return { error: "Message too long." };

  const admin = createAdminClient();
  // Authorisation: acharya must be assigned (admin bypasses).
  const { data: reading } = await admin
    .from("readings")
    .select("acharya_id")
    .eq("id", reading_id)
    .single();
  if (!reading) return { error: "Reading not found." };
  if (profile.role === "acharya" && reading.acharya_id !== profile.id) {
    return { error: "Not assigned to you." };
  }

  const { error } = await admin.from("reading_messages").insert({
    reading_id,
    sender_id: profile.id,
    body,
  });
  if (error) return { error: error.message };

  revalidatePath(`/astrologer/readings/${reading_id}`);
  revalidatePath(`/dashboard/readings/${reading_id}`);
  return { ok: true };
}

export async function signOut() {
  const { supabase } = await requireRole("acharya");
  await supabase.auth.signOut();
  redirect("/");
}
