"use client";

import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateProfile } from "./actions";
import type { Profile } from "@/lib/supabase/types";

export function ProfileForm({ profile }: { profile: Profile }) {
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <form
      action={(fd) => {
        startTransition(async () => {
          const res = await updateProfile(fd);
          if (res?.error) {
            setStatus("error");
            setErrorMsg(res.error);
          } else {
            setStatus("saved");
            setErrorMsg(null);
            setTimeout(() => setStatus("idle"), 2000);
          }
        });
      }}
      className="grid gap-5"
    >
      <div className="grid md:grid-cols-2 gap-5">
        <Field label="Full name">
          <Input
            name="full_name"
            defaultValue={profile.full_name ?? ""}
            placeholder="As it appears on your chart"
            className="h-11 bg-white border-gold/30 focus-visible:border-maroon"
          />
        </Field>
        <Field label="Phone (optional)">
          <Input
            name="phone"
            type="tel"
            defaultValue={profile.phone ?? ""}
            placeholder="+91…"
            className="h-11 bg-white border-gold/30 focus-visible:border-maroon"
          />
        </Field>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <Field label="Date of birth">
          <Input
            name="dob"
            type="date"
            defaultValue={profile.dob ?? ""}
            className="h-11 bg-white border-gold/30 focus-visible:border-maroon"
          />
        </Field>
        <Field label="Time of birth">
          <Input
            name="tob"
            type="time"
            step={60}
            defaultValue={profile.tob ?? ""}
            className="h-11 bg-white border-gold/30 focus-visible:border-maroon"
          />
        </Field>
      </div>

      <Field label="Place of birth">
        <Input
          name="birth_place"
          defaultValue={profile.birth_place ?? ""}
          placeholder="City, state, country"
          className="h-11 bg-white border-gold/30 focus-visible:border-maroon"
        />
      </Field>

      <Field label="Preferred reading language">
        <select
          name="language"
          defaultValue={profile.language}
          className="h-11 px-3 rounded-md bg-white border border-gold/30 focus:outline-none focus:border-maroon text-brown"
        >
          <option value="en">English</option>
          <option value="hi">हिन्दी (Hindi)</option>
        </select>
      </Field>

      <div className="flex items-center gap-4 pt-2">
        <Button
          type="submit"
          disabled={pending}
          className="bg-maroon hover:bg-maroon/90 text-ivory rounded-full h-11 px-6"
        >
          {pending ? "Saving…" : "Save details"}
        </Button>
        {status === "saved" ? (
          <span className="text-sm text-[#2F6A3E]">Saved.</span>
        ) : null}
        {status === "error" ? (
          <span className="text-sm text-maroon">{errorMsg}</span>
        ) : null}
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-xs font-mono text-brown/60 uppercase tracking-wider">
        {label}
      </span>
      {children}
    </label>
  );
}
