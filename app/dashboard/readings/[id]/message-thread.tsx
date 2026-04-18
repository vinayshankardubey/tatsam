"use client";

import { useRef, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { sendMessage } from "../../actions";
import type { ReadingMessage } from "@/lib/supabase/types";

export function MessageThread({
  readingId,
  myUserId,
  acharyaId,
  acharyaName,
  initialMessages,
}: {
  readingId: string;
  myUserId: string;
  acharyaId: string | null;
  acharyaName: string | null;
  initialMessages: ReadingMessage[];
}) {
  const [messages, setMessages] = useState<ReadingMessage[]>(initialMessages);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const submit = (fd: FormData) => {
    const body = String(fd.get("body") ?? "").trim();
    if (!body) return;
    setError(null);
    // Optimistic render
    const optimistic: ReadingMessage = {
      id: `temp-${Date.now()}`,
      reading_id: readingId,
      sender_id: myUserId,
      body,
      created_at: new Date().toISOString(),
    };
    setMessages((m) => [...m, optimistic]);
    formRef.current?.reset();

    startTransition(async () => {
      const res = await sendMessage(fd);
      if (res?.error) {
        setError(res.error);
        setMessages((m) => m.filter((x) => x.id !== optimistic.id));
      }
    });
  };

  return (
    <div className="rounded-xl bg-white border border-gold/30 p-5 md:p-6">
      {messages.length === 0 ? (
        <p className="text-sm text-brown/55 mb-4">
          {acharyaId
            ? `Say hello to ${acharyaName ?? "your acharya"} — they'll reply here.`
            : "Once an acharya is assigned, your conversation will appear here."}
        </p>
      ) : (
        <ul className="space-y-4 mb-6 max-h-[480px] overflow-y-auto pr-1">
          {messages.map((m) => {
            const mine = m.sender_id === myUserId;
            return (
              <li
                key={m.id}
                className={`flex ${mine ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                    mine
                      ? "bg-maroon text-ivory rounded-br-sm"
                      : "bg-amber/15 text-brown border border-gold/25 rounded-bl-sm"
                  }`}
                >
                  <p>{m.body}</p>
                  <p
                    className={`mt-1 text-[10px] font-mono ${
                      mine ? "text-ivory/65" : "text-brown/45"
                    }`}
                  >
                    {new Date(m.created_at).toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <form ref={formRef} action={submit} className="flex items-end gap-3">
        <input type="hidden" name="reading_id" value={readingId} />
        <textarea
          name="body"
          required
          rows={2}
          maxLength={4000}
          placeholder="Ask a follow-up question, share context, or say thanks…"
          className="flex-1 p-3 rounded-md bg-ivory border border-gold/30 focus:outline-none focus:border-maroon text-brown resize-none text-sm"
        />
        <Button
          type="submit"
          disabled={pending}
          className="h-11 px-5 bg-maroon hover:bg-maroon/90 text-ivory rounded-full text-sm"
        >
          Send
        </Button>
      </form>
      {error ? (
        <p className="mt-3 text-sm text-maroon">{error}</p>
      ) : null}
    </div>
  );
}
