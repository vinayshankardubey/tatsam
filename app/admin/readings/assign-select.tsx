"use client";

import { useTransition } from "react";
import { assignAcharya } from "../actions";

export function AssignAcharyaSelect({
  readingId,
  currentAcharyaId,
  acharyas,
}: {
  readingId: string;
  currentAcharyaId: string | null;
  acharyas: { id: string; full_name: string | null }[];
}) {
  const [pending, startTransition] = useTransition();

  return (
    <form
      action={(fd) =>
        startTransition(async () => {
          await assignAcharya(fd);
        })
      }
    >
      <input type="hidden" name="reading_id" value={readingId} />
      <select
        name="acharya_id"
        defaultValue={currentAcharyaId ?? ""}
        disabled={pending}
        onChange={(e) => {
          const form = e.currentTarget.form;
          if (form && e.currentTarget.value) form.requestSubmit();
        }}
        className="h-8 px-2 rounded bg-ivory border border-gold/30 focus:outline-none focus:border-maroon text-brown text-xs"
      >
        <option value="" disabled>
          Assign…
        </option>
        {acharyas.map((a) => (
          <option key={a.id} value={a.id}>
            {a.full_name ?? "Acharya"}
          </option>
        ))}
      </select>
    </form>
  );
}
