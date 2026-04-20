"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";
import { Send, Sparkles, RotateCcw, BookOpen, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { askQuestion, clearAskHistory } from "./actions";

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
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const composerRef = useRef<HTMLTextAreaElement>(null);

  const empty = messages.length === 0;

  // Autoscroll to the latest message on mount + when messages change.
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages.length, pending]);

  // Autosize the composer textarea up to 160px.
  useEffect(() => {
    const el = composerRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [draft]);

  const send = (question: string) => {
    const q = question.trim();
    if (!q || pending) return;

    // Optimistic user message
    const tempUser: AskMessage = {
      id: `temp-${Date.now()}`,
      role: "user",
      content: q,
      citation: null,
      created_at: new Date().toISOString(),
    };
    setMessages((m) => [...m, tempUser]);
    setDraft("");
    setError(null);

    const fd = new FormData();
    fd.set("question", q);
    if (scope) fd.set("tool", scope.id);

    startTransition(async () => {
      const res = await askQuestion(fd);
      if (res?.error || !res.ok) {
        setError(res?.error ?? "Something went wrong.");
        // Roll back optimistic user bubble
        setMessages((m) => m.filter((x) => x.id !== tempUser.id));
        return;
      }
      // Reconcile: replace temp user id with real id, then append assistant
      setMessages((m) =>
        m
          .map((x) =>
            x.id === tempUser.id && res.userMessageId
              ? { ...x, id: res.userMessageId }
              : x,
          )
          .concat({
            id: res.assistantMessageId ?? `ai-${Date.now()}`,
            role: "assistant",
            content: res.assistantContent ?? "",
            citation: res.citation ?? null,
            created_at: new Date().toISOString(),
          }),
      );
    });
  };

  const clear = () => {
    if (!confirm("Clear your entire chat history with Tatsam?")) return;
    startTransition(async () => {
      await clearAskHistory();
      setMessages([]);
    });
  };

  return (
    // Break out of the dashboard layout's padded container so the chat can fill
    // the viewport end-to-end. These negatives cancel the layout's wrapper.
    <div className="-mx-6 lg:-mx-10 -my-8 lg:-my-14 flex flex-col h-[calc(100svh-3.5rem-4rem-env(safe-area-inset-bottom))] lg:h-screen bg-ivory">
      {/* Header */}
      <header className="shrink-0 border-b border-gold/25 bg-ivory/90 backdrop-blur-xl px-5 lg:px-8 h-14 flex items-center justify-between gap-4">
        <div className="min-w-0 flex items-center gap-2">
          {scope ? (
            <Link
              href="/tools"
              className="shrink-0 p-1 -ml-1 text-brown/55 hover:text-maroon"
              aria-label="Back to tools"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
          ) : (
            <Sparkles className="w-4 h-4 text-gold shrink-0" />
          )}
          <div className="min-w-0">
            <p className="text-sm font-display text-brown truncate leading-none">
              {scope ? scope.name : "Ask the scriptures"}
            </p>
            <p className="text-[10px] font-mono text-brown/50 truncate mt-0.5">
              {scope ? `Tatsam · ${scope.source}` : "Tatsam · cited from classical sources"}
            </p>
          </div>
        </div>
        {messages.length > 0 ? (
          <button
            type="button"
            onClick={clear}
            disabled={pending}
            className="inline-flex items-center gap-1.5 text-xs font-mono text-brown/55 hover:text-maroon disabled:opacity-50"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            New chat
          </button>
        ) : null}
      </header>

      {/* Scrollable conversation */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="max-w-[820px] mx-auto px-5 lg:px-8 py-8 lg:py-10">
          {empty ? (
            <EmptyState
              firstName={firstName}
              starterPrompts={starterPrompts}
              onPick={(p) => send(p)}
              disabled={pending}
              scope={scope}
            />
          ) : (
            <div className="space-y-6">
              {messages.map((m) => (
                <MessageBubble key={m.id} message={m} userInitial={userInitial} />
              ))}
              {pending ? <ThinkingBubble /> : null}
            </div>
          )}
        </div>
      </div>

      {/* Composer */}
      <div className="shrink-0 border-t border-gold/25 bg-ivory/90 backdrop-blur-xl">
        <div className="max-w-[820px] mx-auto px-5 lg:px-8 py-4">
          {error ? (
            <p className="mb-2 text-sm text-maroon">{error}</p>
          ) : null}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(draft);
            }}
            className="flex items-end gap-3"
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
                  ? `Ask Tatsam anything — Gita, Upanishads, your chart, a decision…`
                  : `Reply, or ask another question…`
              }
              className="flex-1 resize-none bg-white border border-gold/30 rounded-2xl px-4 py-3 text-brown placeholder:text-brown/40 focus:outline-none focus:border-maroon leading-relaxed min-h-[48px] max-h-[160px]"
              disabled={pending}
            />
            <Button
              type="submit"
              disabled={pending || !draft.trim()}
              className="h-12 w-12 p-0 rounded-full bg-maroon text-ivory hover:bg-maroon/90 shrink-0 disabled:opacity-40"
              aria-label="Send question"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
          <p className="mt-2 text-[10px] font-mono text-brown/40 text-center">
            Answers are drawn from classical texts and should be read as
            guidance, not prescription. <kbd className="font-mono">Enter</kbd> to send ·{" "}
            <kbd className="font-mono">Shift + Enter</kbd> for a newline.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Bubbles
// ─────────────────────────────────────────────────────────────

function MessageBubble({
  message,
  userInitial,
}: {
  message: AskMessage;
  userInitial: string;
}) {
  const mine = message.role === "user";
  return (
    <div className={`flex gap-3 ${mine ? "justify-end" : "justify-start"}`}>
      {!mine ? (
        <span className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center shrink-0 mt-1" aria-hidden>
          <Sparkles className="w-4 h-4 text-gold" />
        </span>
      ) : null}
      <div className={`max-w-[82%] ${mine ? "text-right" : ""}`}>
        <div
          className={`inline-block rounded-2xl px-4 py-3 text-[15px] leading-relaxed whitespace-pre-wrap ${
            mine
              ? "bg-maroon text-ivory rounded-br-sm"
              : "bg-white border border-gold/25 text-brown rounded-bl-sm"
          }`}
        >
          {message.content}
        </div>
        {message.citation ? (
          <div className="mt-2 inline-flex items-center gap-2 text-[11px] font-mono text-brown/55 bg-amber/15 border border-gold/25 rounded-full px-3 py-1">
            <BookOpen className="w-3 h-3 text-gold" />
            {message.citation.source}
            <span className="text-brown/35">·</span>
            <span className="text-brown">{message.citation.ref}</span>
          </div>
        ) : null}
      </div>
      {mine ? (
        <span className="w-8 h-8 rounded-full bg-brown text-ivory flex items-center justify-center shrink-0 mt-1 font-display text-sm ring-2 ring-gold/40">
          {userInitial}
        </span>
      ) : null}
    </div>
  );
}

function ThinkingBubble() {
  return (
    <div className="flex gap-3 justify-start">
      <span className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center shrink-0 mt-1">
        <Sparkles className="w-4 h-4 text-gold animate-pulse" />
      </span>
      <div className="inline-flex items-center gap-1 rounded-2xl px-4 py-3 bg-white border border-gold/25 text-brown/55 rounded-bl-sm">
        <Dot delay="0ms" />
        <Dot delay="150ms" />
        <Dot delay="300ms" />
        <span className="ml-2 text-xs font-mono">consulting the scriptures…</span>
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
    <div className="text-center max-w-xl mx-auto">
      <span className="inline-flex w-14 h-14 rounded-full bg-gradient-to-br from-gold/30 to-amber/20 items-center justify-center ring-4 ring-ivory shadow-sm">
        <Sparkles className="w-6 h-6 text-maroon" />
      </span>
      {scope ? (
        <>
          <h1 className="mt-6 text-3xl md:text-4xl font-display text-brown leading-tight">
            {scope.name}
          </h1>
          {scope.sanskrit ? (
            <p className="mt-1 text-sm font-mono text-brown/55">{scope.sanskrit}</p>
          ) : null}
          <p className="mt-3 text-brown/65 leading-relaxed">
            {scope.intro || scope.tagline}
          </p>
          <p className="mt-3 text-[11px] font-mono text-brown/45">
            Answers are drawn only from {scope.source}.
          </p>
        </>
      ) : (
        <>
          <h1 className="mt-6 text-3xl md:text-4xl font-display text-brown leading-tight">
            Ask, {firstName}.
          </h1>
          <p className="mt-3 text-brown/65 leading-relaxed">
            Any question — about your life, your chart, your numbers, your day.
            I&rsquo;ll return with a grounded answer from the classical texts,
            citation included.
          </p>
        </>
      )}

      <div className="mt-10 text-left">
        <p className="text-[10px] font-mono text-brown/50 uppercase tracking-wider mb-3 text-center">
          Try one of these
        </p>
        <div className="grid gap-2">
          {starterPrompts.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onPick(p)}
              disabled={disabled}
              className="text-left px-4 py-3 rounded-xl bg-white border border-gold/30 hover:border-maroon/40 hover:bg-amber/10 text-brown text-sm leading-relaxed transition-colors disabled:opacity-50"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {scope ? (
        <div className="mt-10">
          <Link
            href="/tools"
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
