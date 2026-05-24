import { createClient } from "@/lib/supabase/server";
import { getCurrentUser, getCurrentProfile } from "@/lib/supabase/current-user";
import { AskChat, type AskMessage } from "./chat";
import { findTool } from "@/lib/tatsam-tools";

const STARTER_PROMPTS = [
  "Should I take the role I was offered, or wait?",
  "I feel anxious about a decision I need to make this week.",
  "Tell me what my chart says about money this year.",
  "When is an auspicious time to begin something new?",
  "What is the Gita's view on commitment vs freedom?",
];

export default async function AskPage({
  searchParams,
}: {
  searchParams: Promise<{ tool?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) return null;

  const { tool: toolId } = await searchParams;
  const tool = findTool(toolId);

  const supabase = await createClient();
  const [p, { data: messagesRaw }] = await Promise.all([
    getCurrentProfile(),
    supabase
      .from("ask_messages")
      .select("id, role, content, citation, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true }),
  ]);
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
