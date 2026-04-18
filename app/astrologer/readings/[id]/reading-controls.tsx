"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  type Reading,
  type ReadingRemedy,
  type ReadingStatus,
  type RemedyCategory,
  REMEDY_LABEL,
  STATUS_LABEL,
} from "@/lib/supabase/types";
import { updateReading, addRemedy, deleteRemedy } from "../../actions";

const STATUSES: ReadingStatus[] = ["pending", "in_review", "delivered", "cancelled"];
const CATEGORIES: RemedyCategory[] = ["mantra", "gemstone", "ritual", "practice", "charity"];

export function ReadingControls({
  reading,
  remedies,
}: {
  reading: Reading;
  remedies: ReadingRemedy[];
}) {
  const [status, setStatus] = useState<ReadingStatus>(reading.status);
  const [pending, startTransition] = useTransition();
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <section className="space-y-8">
      <h2 className="text-xs font-mono text-brown/50 uppercase tracking-wider">
        Acharya actions
      </h2>

      <div className="rounded-xl bg-white border border-gold/30 p-6 md:p-8 space-y-5">
        <form
          action={(fd) =>
            startTransition(async () => {
              setError(null);
              const res = await updateReading(fd);
              if (res?.error) setError(res.error);
              else setSavedAt(Date.now());
            })
          }
          className="space-y-5"
        >
          <input type="hidden" name="reading_id" value={reading.id} />

          <div>
            <p className="text-xs font-mono text-brown/55 uppercase tracking-wider mb-2">
              Status
            </p>
            <div className="flex flex-wrap gap-2">
              {STATUSES.map((s) => (
                <label
                  key={s}
                  className={`px-3 h-9 rounded-full text-sm border cursor-pointer inline-flex items-center ${
                    status === s
                      ? "bg-maroon text-ivory border-maroon"
                      : "bg-white border-gold/40 text-brown/70 hover:border-maroon/50"
                  }`}
                >
                  <input
                    type="radio"
                    name="status"
                    value={s}
                    className="hidden"
                    checked={status === s}
                    onChange={() => setStatus(s)}
                  />
                  {STATUS_LABEL[s]}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-mono text-brown/55 uppercase tracking-wider mb-2 block">
              Summary for the seeker
            </label>
            <textarea
              name="acharya_summary"
              rows={4}
              defaultValue={reading.acharya_summary ?? ""}
              placeholder="A kind, clear paragraph — the heart of your reading."
              className="w-full p-3 rounded-md bg-ivory border border-gold/30 focus:outline-none focus:border-maroon text-brown text-sm resize-none"
            />
          </div>

          <div>
            <label className="text-xs font-mono text-brown/55 uppercase tracking-wider mb-2 block">
              Report URL (PDF)
            </label>
            <Input
              name="report_url"
              type="url"
              defaultValue={reading.report_url ?? ""}
              placeholder="https://…/report.pdf"
              className="h-11 bg-ivory border-gold/30 focus-visible:border-maroon"
            />
          </div>

          <div className="flex items-center gap-4 pt-1">
            <Button
              type="submit"
              disabled={pending}
              className="h-11 px-6 bg-maroon text-ivory rounded-full hover:bg-maroon/90"
            >
              {pending ? "Saving…" : "Save changes"}
            </Button>
            {savedAt ? (
              <span className="text-sm text-[#2F6A3E]">Saved.</span>
            ) : null}
            {error ? (
              <span className="text-sm text-maroon">{error}</span>
            ) : null}
          </div>
        </form>
      </div>

      {/* Remedies */}
      <div className="rounded-xl bg-white border border-gold/30 p-6 md:p-8">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-xs font-mono text-brown/55 uppercase tracking-wider">
            Prescribed remedies
          </p>
        </div>

        {remedies.length === 0 ? (
          <p className="text-sm text-brown/55">No remedies yet. Add the first.</p>
        ) : (
          <ul className="space-y-3 mb-6">
            {remedies.map((re) => (
              <li
                key={re.id}
                className="flex items-start justify-between gap-4 p-4 rounded-lg bg-ivory border border-gold/20"
              >
                <div className="min-w-0">
                  <p className="text-[10px] font-mono text-brown/50 uppercase tracking-wider">
                    {REMEDY_LABEL[re.category]}
                  </p>
                  <p className="text-brown font-medium">{re.title}</p>
                  {re.detail ? (
                    <p className="text-sm text-brown/65 mt-1 whitespace-pre-wrap">
                      {re.detail}
                    </p>
                  ) : null}
                </div>
                <form action={(fd) => startTransition(async () => { await deleteRemedy(fd); })}>
                  <input type="hidden" name="remedy_id" value={re.id} />
                  <input type="hidden" name="reading_id" value={reading.id} />
                  <button
                    type="submit"
                    className="text-xs text-brown/45 hover:text-maroon"
                  >
                    Remove
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}

        <form
          action={(fd) =>
            startTransition(async () => {
              const res = await addRemedy(fd);
              if (res?.error) setError(res.error);
            })
          }
          className="grid md:grid-cols-[160px_1fr_auto] gap-3 items-start"
        >
          <input type="hidden" name="reading_id" value={reading.id} />
          <select
            name="category"
            defaultValue="mantra"
            className="h-11 px-3 rounded-md bg-ivory border border-gold/30 focus:outline-none focus:border-maroon text-brown"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {REMEDY_LABEL[c]}
              </option>
            ))}
          </select>
          <div className="grid gap-2">
            <Input
              name="title"
              required
              placeholder="Title (e.g. Chant Gayatri Mantra 108 times)"
              className="h-11 bg-ivory border-gold/30 focus-visible:border-maroon"
            />
            <textarea
              name="detail"
              rows={2}
              placeholder="Detail (optional): when, how, for how long"
              className="p-3 rounded-md bg-ivory border border-gold/30 focus:outline-none focus:border-maroon text-brown text-sm resize-none"
            />
          </div>
          <Button
            type="submit"
            disabled={pending}
            className="h-11 px-5 bg-maroon text-ivory rounded-full hover:bg-maroon/90"
          >
            Add remedy
          </Button>
        </form>
      </div>
    </section>
  );
}
