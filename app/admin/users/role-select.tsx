"use client";

import { useTransition } from "react";
import { promoteUser } from "../actions";
import type { UserRole } from "@/lib/supabase/types";

const ROLES: UserRole[] = ["seeker", "acharya", "admin"];

export function RoleSelect({
  userId,
  currentRole,
}: {
  userId: string;
  currentRole: UserRole;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <form
      action={(fd) =>
        startTransition(async () => {
          await promoteUser(fd);
        })
      }
    >
      <input type="hidden" name="user_id" value={userId} />
      <select
        name="role"
        defaultValue={currentRole}
        disabled={pending}
        onChange={(e) => {
          const form = e.currentTarget.form;
          if (form) form.requestSubmit();
        }}
        className="h-8 px-2 rounded bg-ivory border border-gold/30 focus:outline-none focus:border-maroon text-brown text-xs"
      >
        {ROLES.map((r) => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </select>
    </form>
  );
}
