"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/supabase/require-role";
import { createAdminClient } from "@/lib/supabase/admin";

export async function assignAcharya(formData: FormData) {
  await requireRole("admin");
  const reading_id = String(formData.get("reading_id") ?? "");
  const acharya_id = String(formData.get("acharya_id") ?? "");
  if (!reading_id || !acharya_id) return { error: "Pick a reading and acharya." };

  const admin = createAdminClient();
  const { data: acharya } = await admin
    .from("profiles")
    .select("full_name, role")
    .eq("id", acharya_id)
    .single();

  if (!acharya || acharya.role !== "acharya") {
    return { error: "That user is not an acharya." };
  }

  const { error } = await admin
    .from("readings")
    .update({
      acharya_id,
      acharya_name: acharya.full_name ?? "An acharya",
      status: "in_review",
    })
    .eq("id", reading_id);

  if (error) return { error: error.message };
  revalidatePath("/admin");
  return { ok: true };
}

export async function promoteUser(formData: FormData) {
  await requireRole("admin");
  const user_id = String(formData.get("user_id") ?? "");
  const role = String(formData.get("role") ?? "");
  if (!user_id || !["seeker", "acharya", "admin"].includes(role)) {
    return { error: "Invalid promotion." };
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from("profiles")
    .update({ role })
    .eq("id", user_id);
  if (error) return { error: error.message };

  revalidatePath("/admin/users");
  return { ok: true };
}

export async function signOut() {
  const { supabase } = await requireRole("admin");
  await supabase.auth.signOut();
  redirect("/");
}
