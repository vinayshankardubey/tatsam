// Streaming proxy: browser → Next.js → Vertex AI Agent Engine
// (Reasoning Engine `:streamQuery` endpoint, deployed via agents-cli).
//
// We emit our OWN stable SSE contract to the client so the UI never has to
// learn the upstream's event shape:
//   event: delta   data: {"text": "…"}                       — text increments
//   event: done    data: {"userMessageId","assistantMessageId","assistantContent","citation"}
//   event: error   data: {"message": "…"}
//
// The upstream is NDJSON (one JSON event per line) — ADK Runner events with
// shape: { author, content: { parts: [{ text }], role }, ... }

import { GoogleAuth } from "google-auth-library";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PROJECT = process.env.GOOGLE_CLOUD_PROJECT!;
const LOCATION = process.env.VERTEX_REASONING_ENGINE_LOCATION ?? "us-central1";
const ENGINE_ID = process.env.VERTEX_REASONING_ENGINE_ID!;
const ENDPOINT = `https://${LOCATION}-aiplatform.googleapis.com/v1/projects/${PROJECT}/locations/${LOCATION}/reasoningEngines/${ENGINE_ID}:streamQuery`;

// Auth accepts two credential shapes so the same code runs locally + on Vercel:
//   • Local dev: GOOGLE_APPLICATION_CREDENTIALS=path/to/key.json  (file on disk)
//   • Vercel:    GOOGLE_CREDENTIALS_JSON='{"type":"service_account",...}' (inline)
function buildAuth(): GoogleAuth {
  const scopes = ["https://www.googleapis.com/auth/cloud-platform"];
  const inline = process.env.GOOGLE_CREDENTIALS_JSON;
  if (inline) {
    return new GoogleAuth({ credentials: JSON.parse(inline), scopes });
  }
  return new GoogleAuth({ scopes });
}
const auth = buildAuth();

type Citation = { source: string; ref: string; passage?: string } | null;

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const { question, tool } = (await req.json().catch(() => ({}))) as {
    question?: string;
    tool?: string;
  };
  const q = (question ?? "").trim();
  if (!q) return new Response("question required", { status: 400 });
  if (q.length > 8000) return new Response("question too long", { status: 400 });

  const { data: userMsg, error: userErr } = await supabase
    .from("ask_messages")
    .insert({ user_id: user.id, role: "user", content: q })
    .select("id")
    .single();
  if (userErr) return new Response(userErr.message, { status: 500 });

  const token = await (await auth.getClient()).getAccessToken();
  if (!token.token) return new Response("auth failed", { status: 500 });

  const upstream = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      class_method: "stream_query",
      input: {
        user_id: user.id,
        message: q + (tool ? `\n\n[scope: ${tool}]` : ""),
      },
    }),
  });

  if (!upstream.ok || !upstream.body) {
    const detail = await upstream.text().catch(() => "");
    return new Response(`upstream ${upstream.status}: ${detail.slice(0, 500)}`, {
      status: 502,
    });
  }

  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  const MARKER = "---STRUCTURED_DATA---";
  let lineBuf = "";
  let assistantText = "";
  let proseSent = 0;
  let markerHit = false;

  const flushProse = (controller: ReadableStreamDefaultController<Uint8Array>) => {
    if (markerHit) return;
    const idx = assistantText.indexOf(MARKER, proseSent);
    if (idx !== -1) {
      const tail = assistantText.slice(proseSent, idx);
      if (tail) {
        controller.enqueue(
          encoder.encode(`event: delta\ndata: ${JSON.stringify({ text: tail })}\n\n`),
        );
      }
      proseSent = assistantText.length;
      markerHit = true;
      return;
    }
    const safeEnd = Math.max(proseSent, assistantText.length - (MARKER.length - 1));
    if (safeEnd > proseSent) {
      const tail = assistantText.slice(proseSent, safeEnd);
      controller.enqueue(
        encoder.encode(`event: delta\ndata: ${JSON.stringify({ text: tail })}\n\n`),
      );
      proseSent = safeEnd;
    }
  };

  const out = new ReadableStream<Uint8Array>({
    async start(controller) {
      const reader = upstream.body!.getReader();
      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          lineBuf += decoder.decode(value, { stream: true });
          let nl;
          while ((nl = lineBuf.indexOf("\n")) !== -1) {
            const line = lineBuf.slice(0, nl).trim();
            lineBuf = lineBuf.slice(nl + 1);
            if (!line) continue;
            const chunk = extractAdkEventText(line);
            if (chunk) assistantText += chunk;
          }
          flushProse(controller);
        }
        // Trailing partial line, if any
        if (lineBuf.trim()) {
          const chunk = extractAdkEventText(lineBuf.trim());
          if (chunk) assistantText += chunk;
          lineBuf = "";
        }
        // No marker found → flush the held-back tail too.
        if (!markerHit && proseSent < assistantText.length) {
          const tail = assistantText.slice(proseSent);
          controller.enqueue(
            encoder.encode(`event: delta\ndata: ${JSON.stringify({ text: tail })}\n\n`),
          );
          proseSent = assistantText.length;
        }
      } catch (e) {
        controller.enqueue(
          encoder.encode(
            `event: error\ndata: ${JSON.stringify({ message: String(e) })}\n\n`,
          ),
        );
      }

      const { prose, citation } = splitStructured(assistantText);

      let savedId: string | null = null;
      if (prose.trim()) {
        const { data: aiMsg } = await supabase
          .from("ask_messages")
          .insert({
            user_id: user.id,
            role: "assistant",
            content: prose.slice(0, 8000),
            citation,
          })
          .select("id")
          .single();
        savedId = aiMsg?.id ?? null;
      }

      controller.enqueue(
        encoder.encode(
          `event: done\ndata: ${JSON.stringify({
            userMessageId: userMsg.id,
            assistantMessageId: savedId,
            assistantContent: prose,
            citation,
          })}\n\n`,
        ),
      );
      controller.close();
    },
    cancel(reason) {
      try {
        upstream.body?.cancel(reason);
      } catch {}
    },
  });

  return new Response(out, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}

// ─────────────────────────────────────────────────────────────────────
// ADK Runner event → visible text.
// Each NDJSON line is a JSON object roughly shaped like:
//   { author, content: { role: "model", parts: [{ text: "…" }] }, ... }
// We only surface text from "model" (assistant) parts, and skip tool
// calls / function responses (they're internal routing chatter).
// ─────────────────────────────────────────────────────────────────────
function extractAdkEventText(jsonLine: string): string {
  let evt: unknown;
  try {
    evt = JSON.parse(jsonLine);
  } catch {
    return "";
  }
  if (!evt || typeof evt !== "object") return "";
  const o = evt as Record<string, unknown>;
  const content = o.content as { role?: string; parts?: unknown[] } | undefined;
  if (!content || typeof content !== "object") return "";
  if (content.role && content.role !== "model") return "";
  const parts = Array.isArray(content.parts) ? content.parts : [];
  let acc = "";
  for (const p of parts) {
    if (p && typeof p === "object") {
      const pp = p as Record<string, unknown>;
      // Skip function calls / responses — those are routing internals.
      if ("function_call" in pp || "function_response" in pp) continue;
      if (typeof pp.text === "string") acc += pp.text;
    }
  }
  return acc;
}

// The shastra_agent / numerology_agent system prompts end every reply with
// `---STRUCTURED_DATA---\n{…}\n---END_STRUCTURED_DATA---`. Strip that block
// off the visible text, parse it, lift a citation out for the UI card.
function splitStructured(full: string): { prose: string; citation: Citation } {
  const m = full.match(
    /---STRUCTURED_DATA---\s*([\s\S]*?)\s*---END_STRUCTURED_DATA---/,
  );
  if (!m) return { prose: full, citation: null };
  const prose = (full.slice(0, m.index) + full.slice(m.index! + m[0].length))
    .trim();
  let citation: Citation = null;
  try {
    const data = JSON.parse(m[1]);
    const sr = data?.scripture_response;
    if (sr?.primary_source && sr?.reference) {
      citation = {
        source: String(sr.primary_source),
        ref: String(sr.reference),
        passage:
          typeof sr.original_text === "string" ? sr.original_text : undefined,
      };
    }
  } catch {}
  return { prose, citation };
}
