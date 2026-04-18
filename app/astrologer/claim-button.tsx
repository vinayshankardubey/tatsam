"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { claimReading } from "./actions";

export function ClaimButton({ readingId }: { readingId: string }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  return (
    <form
      action={(fd) =>
        startTransition(async () => {
          const res = await claimReading(fd);
          if (!res?.error) router.push(`/astrologer/readings/${readingId}`);
        })
      }
    >
      <input type="hidden" name="reading_id" value={readingId} />
      <Button
        type="submit"
        disabled={pending}
        className="h-9 rounded-full bg-maroon text-ivory hover:bg-maroon/90 text-sm"
      >
        {pending ? "Claiming…" : "Claim"}
      </Button>
    </form>
  );
}
