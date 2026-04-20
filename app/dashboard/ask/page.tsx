import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/supabase/types";
import { AskChat, type AskMessage } from "./chat";
import { STARTER_PROMPTS } from "@/lib/ask-stub";
import { findTool } from "@/lib/tatsam-tools";

export default async function AskPage({
  searchParams,
}: {
  searchParams: Promise<{ tool?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { tool: toolId } = await searchParams;
  const tool = findTool(toolId);

  const [{ data: profile }, { data: messagesRaw }] = await Promise.all([
    supabase
      .from("profiles")
      .select("full_name, email, dob")
      .eq("id", user.id)
      .single(),
    supabase
      .from("ask_messages")
      .select("id, role, content, citation, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true }),
  ]);

  const p = (profile ?? null) as Pick<Profile, "full_name" | "email" | "dob"> | null;
  const firstName = (p?.full_name ?? "").split(" ")[0] || "seeker";
  const initialMessages = (messagesRaw ?? []) as AskMessage[];

  // Tool-scoped chat uses the tool's prompts + intro + header labels.
  const starterPrompts = tool && tool.starterPrompts.length > 0 ? tool.starterPrompts : STARTER_PROMPTS;
  const scope = tool
    ? {
        id: tool.id,
        name: tool.name,
        sanskrit: tool.sanskrit ?? null,
        source: tool.source,
        intro: tool.introMessage,
        tagline: tool.tagline,
      }
    : null;

  return (
    <AskChat
      firstName={firstName}
      userInitial={(p?.full_name?.trim()[0] ?? "S").toUpperCase()}
      initialMessages={initialMessages}
      starterPrompts={starterPrompts}
      scope={scope}
    />
  );
}
