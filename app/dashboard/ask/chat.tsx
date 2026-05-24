"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import {
  Send,
  Sparkles,
  RotateCcw,
  BookOpen,
  ArrowLeft,
  Copy,
  Check,
  ArrowDown,
  CornerDownLeft,
  Square,
} from "lucide-react";
import { clearAskHistory } from "./actions";

export type AskMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  citation: { source: string; ref: string; passage?: string } | null;
  created_at: string;
};

export type ChatScope = {
  id: string;
  name: string;
  sanskrit: string | null;
  source: string;
  intro: string;
  tagline: string;
};

export function AskChat({
  firstName,
  userInitial,
  initialMessages,
  starterPrompts,
  scope,
}: {
  firstName: string;
  userInitial: string;
  initialMessages: AskMessage[];
  starterPrompts: string[];
  scope: ChatScope | null;
}) {
  const [messages, setMessages] = useState<AskMessage[]>(initialMessages);
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState(false);
  const [clearing, startClearing] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const composerRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const empty = messages.length === 0;

  // Track whether the user is near the bottom of the conversation so we
  // don't yank them away if they've scrolled up to re-read something.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const threshold = 80;
      const distance = el.scrollHeight - el.scrollTop - el.clientHeight;
      setIsAtBottom(distance < threshold);
    };
    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [messages.length]);

  // Autoscroll only if the user is at the bottom (or when we transition
  // into pending — they're asking right now, show them the thinking state).
  useEffect(() => {
    if (!isAtBottom && !pending) return;
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages.length, pending, isAtBottom]);

  useEffect(() => {
    const el = composerRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, [draft]);

  const send = async (question: string) => {
    const q = question.trim();
    if (!q || pending) return;

    const tempUserId = `temp-user-${Date.now()}`;
    const tempAssistantId = `temp-ai-${Date.now()}`;
    const now = new Date().toISOString();

    setMessages((m) => [
      ...m,
      { id: tempUserId, role: "user", content: q, citation: null, created_at: now },
      { id: tempAssistantId, role: "assistant", content: "", citation: null, created_at: now },
    ]);
    setDraft("");
    setError(null);
    setPending(true);

    const ac = new AbortController();
    abortRef.current = ac;

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q, tool: scope?.id ?? null }),
        signal: ac.signal,
      });
      if (!res.ok || !res.body) {
        throw new Error(await res.text().catch(() => "Request failed."));
      }
      await consumeSse(res.body, {
        onDelta: (text) => {
          setMessages((m) =>
            m.map((x) =>
              x.id === tempAssistantId ? { ...x, content: x.content + text } : x,
            ),
          );
        },
        onDone: (final) => {
          setMessages((m) =>
            m.map((x) => {
              if (x.id === tempUserId && final.userMessageId) {
                return { ...x, id: final.userMessageId };
              }
              if (x.id === tempAssistantId) {
                return {
                  ...x,
                  id: final.assistantMessageId ?? x.id,
                  content: final.assistantContent || x.content,
                  citation: final.citation ?? null,
                };
              }
              return x;
            }),
          );
        },
        onError: (msg) => {
          throw new Error(msg);
        },
      });
    } catch (e) {
      const message = e instanceof Error ? e.message : "Something went wrong.";
      if (message !== "aborted") setError(message);
      setMessages((m) =>
        m.filter((x) => x.id !== tempUserId && x.id !== tempAssistantId),
      );
    } finally {
      setPending(false);
      abortRef.current = null;
    }
  };

  const stop = () => {
    abortRef.current?.abort();
  };

  const clear = () => {
    if (!confirm("Start a new conversation? Your past chat will be archived.")) return;
    startClearing(async () => {
      await clearAskHistory();
      setMessages([]);
    });
  };

  // Follow-up chips: up to 3 starter prompts the user hasn't already sent,
  // surfaced under the last assistant message.
  const followUps = useMemo(() => {
    const asked = new Set(
      messages.filter((m) => m.role === "user").map((m) => m.content.trim().toLowerCase()),
    );
    return starterPrompts.filter((p) => !asked.has(p.trim().toLowerCase())).slice(0, 3);
  }, [messages, starterPrompts]);

  const lastAssistantIdx = (() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === "assistant") return i;
    }
    return -1;
  })();

  return (
    <div className="fixed left-0 right-0 top-14 lg:top-0 lg:left-[240px] bottom-[calc(4rem+env(safe-area-inset-bottom))] lg:bottom-0 bg-ivory flex flex-col z-20">
      {/* Floating scope pill — only for tool-scoped chats. Acts as a
          back-link to /tatsam while also reminding the seeker which
          source is grounding the answers. */}
      {scope ? (
        <div className="shrink-0 relative">
          <div className="max-w-[1040px] mx-auto px-3 sm:px-5 lg:px-8 pt-3 sm:pt-4">
            <Link
              href="/tatsam"
              className="inline-flex items-center gap-2 h-8 pl-2 pr-3 rounded-full bg-white/70 border border-gold/30 backdrop-blur-sm text-xs text-brown/75 hover:border-maroon/40 hover:text-maroon transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="font-display text-brown">{scope.name}</span>
              <span className="text-brown/30">·</span>
              <span className="font-mono text-[11px] text-brown/55 inline-flex items-center gap-1">
                <BookOpen className="w-3 h-3 text-gold" />
                {scope.source}
              </span>
            </Link>
          </div>
        </div>
      ) : null}

      {/* ── Messages ───────────────────────────────────────────── */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto overscroll-contain relative"
      >
        <div className="max-w-[1040px] mx-auto px-4 sm:px-6 lg:px-10 py-5 sm:py-8">
          {empty ? (
            <EmptyState
              firstName={firstName}
              starterPrompts={starterPrompts}
              onPick={(p) => send(p)}
              disabled={pending}
              scope={scope}
            />
          ) : (
            <div className="space-y-8">
              {messages.map((m, i) => {
                const isLast = i === lastAssistantIdx;
                const streaming = pending && isLast && m.role === "assistant";
                return (
                  <Message
                    key={m.id}
                    message={m}
                    userInitial={userInitial}
                    isLastAssistant={isLast && !pending}
                    followUps={isLast && !pending ? followUps : null}
                    onFollowUp={send}
                    streaming={streaming}
                    scope={scope}
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* Scroll-to-bottom button */}
        {!isAtBottom && messages.length > 0 ? (
          <button
            type="button"
            onClick={() =>
              scrollRef.current?.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: "smooth",
              })
            }
            className="sticky bottom-4 ml-auto mr-4 sm:mr-6 float-right w-9 h-9 rounded-full bg-brown text-ivory flex items-center justify-center shadow-lg hover:bg-maroon transition-colors"
            aria-label="Scroll to latest"
          >
            <ArrowDown className="w-4 h-4" />
          </button>
        ) : null}
      </div>

      {/* ── Composer ───────────────────────────────────────────── */}
      <div className="shrink-0 bg-ivory">
        <div
          className="max-w-[1040px] mx-auto px-3 sm:px-5 lg:px-10 pt-3 pb-3 sm:pt-4 sm:pb-4"
          style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
        >
          {error ? (
            <div className="mb-2 rounded-lg border border-maroon/30 bg-maroon/5 px-3 py-2 text-sm text-maroon">
              {error}
            </div>
          ) : null}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(draft);
            }}
          >
            <div
              className={`group relative flex items-end rounded-3xl bg-white border transition-all ${
                pending
                  ? "border-gold/30"
                  : "border-gold/30 focus-within:border-maroon focus-within:shadow-[0_0_0_4px_rgba(139,44,44,0.06)]"
              }`}
            >
              <textarea
                ref={composerRef}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send(draft);
                  }
                }}
                rows={1}
                placeholder={
                  empty
                    ? scope
                      ? `Ask ${scope.name} a question…`
                      : `Ask Tatsam anything…`
                    : `Reply, or ask another question…`
                }
                className="flex-1 min-w-0 resize-none bg-transparent pl-4 sm:pl-5 pr-2 py-3.5 text-base text-brown placeholder:text-brown/40 focus:outline-none leading-relaxed min-h-[52px] max-h-[200px]"
                disabled={pending}
              />
              <div className="flex items-center gap-1 pr-2 pb-2">
                {pending ? (
                  <button
                    type="button"
                    onClick={stop}
                    className="h-9 w-9 rounded-full bg-maroon text-ivory hover:bg-maroon/90 shrink-0 flex items-center justify-center transition-all active:scale-95"
                    aria-label="Stop"
                  >
                    <Square className="w-3.5 h-3.5 fill-current" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!draft.trim()}
                    className="h-9 w-9 rounded-full bg-maroon text-ivory hover:bg-maroon/90 shrink-0 disabled:bg-brown/15 disabled:text-brown/40 disabled:cursor-not-allowed flex items-center justify-center transition-all active:scale-95"
                    aria-label="Send"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </form>

          <ComposerFooter
            scope={scope}
            pending={pending || clearing}
            onReset={clear}
            canReset={messages.length > 0}
          />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Messages
// ─────────────────────────────────────────────────────────────

function Message({
  message,
  userInitial,
  isLastAssistant,
  followUps,
  onFollowUp,
  streaming,
  scope,
}: {
  message: AskMessage;
  userInitial: string;
  isLastAssistant: boolean;
  followUps: string[] | null;
  onFollowUp: (q: string) => void;
  streaming: boolean;
  scope: ChatScope | null;
}) {
  if (message.role === "user") {
    return <UserBubble content={message.content} initial={userInitial} />;
  }
  return (
    <AssistantMessage
      message={message}
      isLast={isLastAssistant}
      followUps={followUps}
      onFollowUp={onFollowUp}
      streaming={streaming}
      scope={scope}
    />
  );
}

function UserBubble({ content, initial }: { content: string; initial: string }) {
  return (
    <div className="flex gap-3 justify-end group">
      <div className="max-w-[78%] sm:max-w-[70%] min-w-0">
        <div className="inline-block text-left rounded-2xl rounded-br-md bg-maroon text-ivory px-4 py-2.5 text-[15px] leading-relaxed whitespace-pre-wrap break-words">
          {content}
        </div>
      </div>
      <span
        className="w-8 h-8 rounded-full bg-brown text-ivory flex items-center justify-center shrink-0 mt-1 font-display text-sm ring-2 ring-gold/40"
        aria-hidden
      >
        {initial}
      </span>
    </div>
  );
}

function AssistantMessage({
  message,
  isLast,
  followUps,
  onFollowUp,
  streaming,
  scope,
}: {
  message: AskMessage;
  isLast: boolean;
  followUps: string[] | null;
  onFollowUp: (q: string) => void;
  streaming: boolean;
  scope: ChatScope | null;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="group flex gap-3 sm:gap-4">
      <span
        className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-gold/30 via-amber/25 to-gold/15 flex items-center justify-center ring-1 ring-gold/30 mt-0.5"
        aria-hidden
      >
        <Sparkles className="w-4 h-4 text-maroon" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="font-display text-sm text-brown">Tatsam</span>
          <span className="text-[10px] font-mono text-brown/40">
            {streaming
              ? message.content
                ? "reading…"
                : scope
                  ? `consulting ${scope.source}…`
                  : "consulting the scriptures…"
              : message.citation
                ? "cited"
                : "uncited"}
          </span>
        </div>

        <div className="prose prose-sm max-w-none text-[15.5px] leading-[1.7] text-brown/90 whitespace-pre-wrap break-words">
          {message.content}
          {streaming ? <StreamingCaret /> : null}
        </div>

        {message.citation ? (
          <div className="mt-3 inline-flex items-center gap-2 text-[11px] font-mono bg-amber/15 border border-gold/30 rounded-lg px-3 py-1.5 max-w-full">
            <BookOpen className="w-3 h-3 text-gold shrink-0" />
            <span className="text-brown truncate">{message.citation.source}</span>
            <span className="text-brown/35">·</span>
            <span className="text-brown/70 truncate">{message.citation.ref}</span>
          </div>
        ) : null}

        {/* Hover actions */}
        <div className="mt-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={copy}
            className="inline-flex items-center gap-1 h-7 px-2 rounded-md text-[11px] font-mono text-brown/55 hover:text-maroon hover:bg-amber/20 transition-colors"
            aria-label="Copy answer"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3" /> Copied
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" /> Copy
              </>
            )}
          </button>
        </div>

        {/* Follow-up suggestions — only under the last assistant msg */}
        {isLast && followUps && followUps.length > 0 ? (
          <div className="mt-5">
            <p className="text-[10px] font-mono text-brown/45 uppercase tracking-wider mb-2">
              Keep reading with
            </p>
            <div className="flex flex-wrap gap-2">
              {followUps.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => onFollowUp(f)}
                  className="text-left text-[13px] text-brown/80 bg-white hover:bg-amber/15 border border-gold/30 hover:border-maroon/40 rounded-full px-3.5 py-1.5 transition-colors leading-snug"
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function StreamingCaret() {
  return (
    <span
      className="inline-block w-[7px] h-4 align-text-bottom ml-0.5 bg-maroon/70 rounded-sm"
      style={{ animation: "pulse 1.1s ease-in-out infinite" }}
      aria-hidden
    />
  );
}

function Thinking({ scope }: { scope: ChatScope | null }) {
  return (
    <div className="flex gap-3 sm:gap-4">
      <span
        className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-gold/30 via-amber/25 to-gold/15 flex items-center justify-center ring-1 ring-gold/30 mt-0.5"
        aria-hidden
      >
        <Sparkles className="w-4 h-4 text-maroon animate-pulse" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="font-display text-sm text-brown">Tatsam</span>
          <span className="text-[10px] font-mono text-brown/40">reading…</span>
        </div>
        <div className="inline-flex items-center gap-2 text-sm text-brown/55">
          <Dot delay="0ms" />
          <Dot delay="150ms" />
          <Dot delay="300ms" />
          <span className="ml-1 text-xs font-mono">
            {scope
              ? `consulting ${scope.source}…`
              : "consulting the scriptures…"}
          </span>
        </div>
      </div>
    </div>
  );
}

function Dot({ delay }: { delay: string }) {
  return (
    <span
      className="inline-block w-1.5 h-1.5 rounded-full bg-gold"
      style={{ animation: "pulse 1.2s ease-in-out infinite", animationDelay: delay }}
    />
  );
}

// ─────────────────────────────────────────────────────────────
// Composer footer
// ─────────────────────────────────────────────────────────────

function ComposerFooter({
  scope,
  pending,
  onReset,
  canReset,
}: {
  scope: ChatScope | null;
  pending: boolean;
  onReset: () => void;
  canReset: boolean;
}) {
  return (
    <div className="mt-2 flex items-center justify-between gap-3 text-[10px] font-mono text-brown/45">
      <div className="flex items-center gap-2 min-w-0">
        <span className="flex items-center gap-1.5 min-w-0">
          {scope ? (
            <>
              <BookOpen className="w-3 h-3 text-gold shrink-0" />
              <span className="truncate">Scope · {scope.source}</span>
            </>
          ) : (
            <span className="truncate">Tatsam cites every answer.</span>
          )}
        </span>
        {canReset ? (
          <>
            <span className="text-brown/25 hidden sm:inline">·</span>
            <button
              type="button"
              onClick={onReset}
              disabled={pending}
              className="inline-flex items-center gap-1 text-brown/55 hover:text-maroon disabled:opacity-50 transition-colors"
              aria-label="Start a new conversation"
            >
              <RotateCcw className="w-3 h-3" />
              <span>New chat</span>
            </button>
          </>
        ) : null}
      </div>
      <div className="hidden sm:flex items-center gap-2 shrink-0">
        <span className="inline-flex items-center gap-1">
          <kbd className="inline-flex items-center gap-0.5 bg-white border border-gold/30 rounded px-1.5 py-0.5 text-brown/60">
            <CornerDownLeft className="w-2.5 h-2.5" />
          </kbd>
          send
        </span>
        <span className="text-brown/30">·</span>
        <span className="inline-flex items-center gap-1">
          <kbd className="bg-white border border-gold/30 rounded px-1.5 py-0.5 text-brown/60">
            Shift + Enter
          </kbd>
          newline
        </span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Empty state
// ─────────────────────────────────────────────────────────────

function EmptyState({
  firstName,
  starterPrompts,
  onPick,
  disabled,
  scope,
}: {
  firstName: string;
  starterPrompts: string[];
  onPick: (q: string) => void;
  disabled: boolean;
  scope: ChatScope | null;
}) {
  return (
    <div className="max-w-xl mx-auto pt-2 sm:pt-8">
      <div className="text-center">
        <span className="inline-flex w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-gold/35 via-amber/25 to-gold/15 items-center justify-center ring-4 ring-ivory shadow-sm">
          <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-maroon" />
        </span>
        {scope ? (
          <>
            <h1 className="mt-5 sm:mt-6 text-2xl sm:text-3xl md:text-4xl font-display text-brown leading-tight">
              {scope.name}
            </h1>
            {scope.sanskrit ? (
              <p className="mt-1 text-sm font-mono text-brown/55">{scope.sanskrit}</p>
            ) : null}
            <p className="mt-3 text-sm sm:text-base text-brown/70 leading-relaxed max-w-md mx-auto">
              {scope.intro || scope.tagline}
            </p>
            <p className="mt-3 text-[11px] font-mono text-brown/45">
              Answers are drawn only from {scope.source}.
            </p>
          </>
        ) : (
          <>
            <h1 className="mt-5 sm:mt-6 text-2xl sm:text-3xl md:text-4xl font-display text-brown leading-tight">
              Ask, {firstName}.
            </h1>
            <p className="mt-3 text-sm sm:text-base text-brown/70 leading-relaxed max-w-md mx-auto">
              Any question — about your life, your chart, your numbers, your day.
              I&rsquo;ll return with a grounded answer from the classical texts,
              citation included.
            </p>
          </>
        )}
      </div>

      {starterPrompts.length > 0 ? (
        <div className="mt-8 sm:mt-10">
          <p className="text-[10px] font-mono text-brown/50 uppercase tracking-wider mb-3 text-center">
            Try one of these
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {starterPrompts.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => onPick(p)}
                disabled={disabled}
                className="group text-left px-4 py-3 rounded-xl bg-white border border-gold/30 hover:border-maroon/40 hover:bg-amber/10 text-brown text-sm leading-relaxed transition-colors disabled:opacity-50"
              >
                <span className="block">{p}</span>
                <span className="mt-1 inline-block text-[10px] font-mono text-brown/40 group-hover:text-maroon">
                  Ask →
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {scope ? (
        <div className="mt-8 sm:mt-10 text-center">
          <Link
            href="/tatsam"
            className="text-xs font-mono text-brown/55 hover:text-maroon inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Choose a different tool
          </Link>
        </div>
      ) : null}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SSE consumer — parses /api/ask events: `delta`, `done`, `error`.
// ─────────────────────────────────────────────────────────────

type DoneFinal = {
  userMessageId?: string;
  assistantMessageId?: string;
  assistantContent?: string;
  citation?: { source: string; ref: string; passage?: string } | null;
};

async function consumeSse(
  body: ReadableStream<Uint8Array>,
  handlers: {
    onDelta: (text: string) => void;
    onDone: (final: DoneFinal) => void;
    onError: (message: string) => void;
  },
) {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buf = "";
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    let split;
    while ((split = buf.indexOf("\n\n")) !== -1) {
      const raw = buf.slice(0, split);
      buf = buf.slice(split + 2);
      let event = "message";
      const dataLines: string[] = [];
      for (const line of raw.split("\n")) {
        if (line.startsWith("event:")) event = line.slice(6).trim();
        else if (line.startsWith("data:")) dataLines.push(line.slice(5).trimStart());
      }
      if (dataLines.length === 0) continue;
      let payload: unknown;
      try {
        payload = JSON.parse(dataLines.join("\n"));
      } catch {
        continue;
      }
      if (event === "delta" && payload && typeof payload === "object") {
        const t = (payload as { text?: unknown }).text;
        if (typeof t === "string") handlers.onDelta(t);
      } else if (event === "done") {
        handlers.onDone(payload as DoneFinal);
      } else if (event === "error") {
        const m = (payload as { message?: unknown }).message;
        handlers.onError(typeof m === "string" ? m : "Stream error");
      }
    }
  }
}
