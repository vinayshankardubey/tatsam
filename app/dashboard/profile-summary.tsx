"use client";

import { useState } from "react";
import type { Profile } from "@/lib/supabase/types";
import { ProfileForm } from "./profile-form";

export function ProfileSummary({ profile }: { profile: Profile }) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <div className="rounded-xl bg-white border border-gold/30 p-6 md:p-8">
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-brown/60">Editing your details</p>
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="text-sm text-brown/60 hover:text-maroon"
          >
            Cancel
          </button>
        </div>
        <ProfileForm profile={profile} />
      </div>
    );
  }

  const items: Array<[string, string | null | undefined]> = [
    ["Full name", profile.full_name],
    ["Email", profile.email],
    ["Phone", profile.phone],
    ["Date of birth", profile.dob],
    ["Time of birth", profile.tob],
    ["Place of birth", profile.birth_place],
    ["Language", profile.language === "hi" ? "हिन्दी" : "English"],
  ];

  return (
    <div className="rounded-xl bg-white border border-gold/30 p-6 md:p-8">
      <div className="grid md:grid-cols-2 gap-x-10 gap-y-4">
        {items.map(([label, value]) => (
          <div key={label} className="grid grid-cols-[140px_1fr] gap-4 text-sm">
            <span className="text-brown/50 font-mono text-xs uppercase tracking-wider pt-0.5">
              {label}
            </span>
            <span className="text-brown">{value || "—"}</span>
          </div>
        ))}
      </div>
      <div className="mt-6 flex items-center justify-end">
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="text-sm px-5 h-10 rounded-full border border-gold/40 text-brown hover:bg-amber/15 transition-colors"
        >
          Edit details
        </button>
      </div>
    </div>
  );
}
