"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { generateAnswer, type Citation } from "@/lib/ask-stub";

export type AskResult = {
  ok?: true;
  userMessageId?: string;
  assistantMessageId?: string;
  assistantContent?: string;
  citation?: Citation;
  error?: string;
};

export async function askQuestion(formData: FormData): Promise<AskResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const question = String(formData.get("question") ?? "").trim();
  const toolId = String(formData.get("tool") ?? "").trim() || null;
  if (!question) return { error: "Please write a question." };
  if (question.length > 8000) return { error: "That's a little long — trim to under 8000 characters." };

  // Persist the user question.
  const { data: userMsg, error: userErr } = await supabase
    .from("ask_messages")
    .insert({ user_id: user.id, role: "user", content: question })
    .select("id")
    .single();
  if (userErr) return { error: userErr.message };

  // Generate the scripture-grounded reply, scoped to a tool if provided.
  // Swap for Vertex AI here later (the tool's systemScope drives retrieval).
  const answer = generateAnswer(question, toolId);

  const { data: aiMsg, error: aiErr } = await supabase
    .from("ask_messages")
    .insert({
      user_id: user.id,
      role: "assistant",
      content: answer.content,
      citation: answer.citation,
    })
    .select("id")
    .single();
  if (aiErr) return { error: aiErr.message };

  revalidatePath("/dashboard/ask");
  return {
    ok: true,
    userMessageId: userMsg.id,
    assistantMessageId: aiMsg.id,
    assistantContent: answer.content,
    citation: answer.citation,
  };
}

export async function clearAskHistory() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase
    .from("ask_messages")
    .delete()
    .eq("user_id", user.id);
  if (error) return { error: error.message };

  revalidatePath("/dashboard/ask");
  return { ok: true };
}
