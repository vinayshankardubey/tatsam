"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import {
  Check,
  Pencil,
  LogOut,
  ShieldCheck,
  UserCog,
  LayoutDashboard,
  AlertTriangle,
  CalendarClock,
  MapPin,
  Globe,
  Phone,
  User as UserIcon,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signOut, updateProfile } from "../actions";
import type { Profile } from "@/lib/supabase/types";

const LANG_LABEL: Record<string, string> = {
  en: "English",
  hi: "हिन्दी (Hindi)",
};

export function ProfileManager({ profile }: { profile: Profile }) {
  const name = profile.full_name ?? "";
  const initial = (name.trim()[0] ?? "S").toUpperCase();
  const [signOutOpen, setSignOutOpen] = useState(false);

  const required: Array<{ key: string; label: string; filled: boolean }> = [
    { key: "full_name",   label: "Your full name",  filled: !!profile.full_name },
    { key: "dob",         label: "Date of birth",   filled: !!profile.dob },
    { key: "tob",         label: "Time of birth",   filled: !!profile.tob },
    { key: "birth_place", label: "Place of birth",  filled: !!profile.birth_place },
  ];
  const done = required.filter((r) => r.filled).length;
  const chartReady = done === required.length;

  return (
    <div className="space-y-6">
      {/* ── Hero identity ─────────────────────────────────────── */}
      <section className="rounded-2xl bg-gradient-to-br from-amber/25 via-ivory to-gold/15 border border-gold/30 p-5 md:p-7">
        <div className="flex items-center gap-4 md:gap-5">
          <span className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-brown text-ivory flex items-center justify-center font-display text-xl md:text-2xl ring-4 ring-gold/40 shrink-0">
            {initial}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-mono text-brown/50 uppercase tracking-[0.2em]">
              {profile.role === "admin"
                ? "Admin"
                : profile.role === "acharya"
                  ? "Acharya"
                  : "Seeker"}
            </p>
            <h1 className="text-xl md:text-2xl font-display text-brown leading-tight mt-0.5 truncate">
              {name || "Name yourself"}
            </h1>
            {profile.email ? (
              <p className="text-xs md:text-sm text-brown/55 truncate mt-0.5">
                {profile.email}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={() => setSignOutOpen(true)}
            className="shrink-0 inline-flex items-center gap-1.5 h-9 px-3 sm:px-4 rounded-full border border-maroon/40 text-maroon text-xs sm:text-sm hover:bg-maroon/5 transition-colors"
            aria-label="Sign out of Tatsam"
          >
            <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </section>

      {/* ── Chart-ready strip ─────────────────────────────────── */}
      <ChartReadinessStrip required={required} done={done} complete={chartReady} />

      {/* ── Detail cards ──────────────────────────────────────── */}
      <div className="grid gap-6 xl:grid-cols-2">
      {/* ── About you ─────────────────────────────────────────── */}
      <EditableCard
        title="About you"
        caption="Name, phone, and reading language."
        onSave={updateProfile}
        readView={
          <dl>
            <Row
              icon={<UserIcon className="w-4 h-4" />}
              label="Full name"
              value={profile.full_name}
              missingHint="Required for your chart"
            />
            <Row
              icon={<Phone className="w-4 h-4" />}
              label="Phone"
              value={profile.phone}
              optional
            />
            <Row
              icon={<Globe className="w-4 h-4" />}
              label="Language"
              value={LANG_LABEL[profile.language] ?? "English"}
            />
          </dl>
        }
        editView={
          <div className="space-y-4">
            <FieldLabel label="Full name" required>
              <Input
                name="full_name"
                defaultValue={profile.full_name ?? ""}
                placeholder="As it appears on your chart"
                className="h-11 bg-white border-gold/30 focus-visible:border-maroon"
                autoFocus
              />
            </FieldLabel>
            <FieldLabel label="Phone (optional)">
              <Input
                name="phone"
                type="tel"
                inputMode="tel"
                defaultValue={profile.phone ?? ""}
                placeholder="+91…"
                className="h-11 bg-white border-gold/30 focus-visible:border-maroon"
              />
            </FieldLabel>
            <FieldLabel label="Preferred reading language">
              <select
                name="language"
                defaultValue={profile.language}
                className="h-11 px-3 rounded-md bg-white border border-gold/30 focus:outline-none focus:border-maroon text-brown w-full"
              >
                <option value="en">English</option>
                <option value="hi">हिन्दी (Hindi)</option>
              </select>
            </FieldLabel>
          </div>
        }
      />

      {/* ── Birth coordinates ─────────────────────────────────── */}
      <EditableCard
        title="Birth coordinates"
        caption="Your chart is cast from these. Change only if the earlier values were wrong."
        sensitive
        onSave={updateProfile}
        readView={
          <dl>
            <Row
              icon={<CalendarClock className="w-4 h-4" />}
              label="Date of birth"
              value={formatDob(profile.dob)}
              missingHint="Required for your chart"
            />
            <Row
              icon={<CalendarClock className="w-4 h-4" />}
              label="Time of birth"
              value={formatTob(profile.tob)}
              missingHint="Required — down to the minute"
            />
            <Row
              icon={<MapPin className="w-4 h-4" />}
              label="Place of birth"
              value={profile.birth_place}
              missingHint="Required — city is enough"
            />
          </dl>
        }
        editView={
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <FieldLabel label="Date of birth" required>
                <Input
                  name="dob"
                  type="date"
                  defaultValue={profile.dob ?? ""}
                  className="h-11 bg-white border-gold/30 focus-visible:border-maroon"
                />
              </FieldLabel>
              <FieldLabel label="Time of birth" required>
                <Input
                  name="tob"
                  type="time"
                  step={60}
                  defaultValue={profile.tob ?? ""}
                  className="h-11 bg-white border-gold/30 focus-visible:border-maroon"
                />
              </FieldLabel>
            </div>
            <FieldLabel label="Place of birth" required>
              <Input
                name="birth_place"
                defaultValue={profile.birth_place ?? ""}
                placeholder="City, state, country"
                className="h-11 bg-white border-gold/30 focus-visible:border-maroon"
              />
            </FieldLabel>
            {profile.dob || profile.tob || profile.birth_place ? (
              <p className="flex items-start gap-2 text-xs text-brown/60 bg-amber/15 border border-gold/25 rounded-lg px-3 py-2">
                <AlertTriangle className="w-3.5 h-3.5 text-gold shrink-0 mt-0.5" />
                <span>
                  Your reading is built from these coordinates. Changing them will
                  invalidate any past chart you&rsquo;ve been sent.
                </span>
              </p>
            ) : null}
          </div>
        }
      />

      {/* ── Workspaces (role-conditional) ─────────────────────── */}
      {profile.role === "admin" || profile.role === "acharya" ? (
        <section className="rounded-2xl bg-white border border-gold/30 p-5 md:p-6">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="w-4 h-4 text-gold" />
            <h2 className="font-display text-lg text-brown">Your workspaces</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {profile.role === "admin" ? (
              <JumpTile
                icon={<LayoutDashboard className="w-4 h-4" />}
                title="Admin console"
                body="Analytics, readings, users, acharya performance."
                href="/admin"
              />
            ) : null}
            {profile.role === "acharya" ? (
              <JumpTile
                icon={<UserCog className="w-4 h-4" />}
                title="Acharya console"
                body="Your queue, assigned readings and seeker messages."
                href="/astrologer"
              />
            ) : null}
          </div>
        </section>
      ) : null}

      </div>

      {/* ── Sign-out confirmation dialog ─────────────────────── */}
      <SignOutDialog
        open={signOutOpen}
        email={profile.email ?? null}
        onClose={() => setSignOutOpen(false)}
      />
    </div>
  );
}

// ───────────────────────────────────────────────────────────────
// Sign-out confirmation dialog
// ───────────────────────────────────────────────────────────────

function SignOutDialog({
  open,
  email,
  onClose,
}: {
  open: boolean;
  email: string | null;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="signout-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-brown/50 backdrop-blur-sm"
      />

      {/* Card */}
      <div className="relative w-full max-w-sm rounded-2xl bg-ivory border border-gold/30 shadow-2xl p-6 md:p-7">
        <div className="flex items-start gap-4">
          <span className="shrink-0 w-11 h-11 rounded-full bg-maroon/10 text-maroon flex items-center justify-center">
            <LogOut className="w-5 h-5" />
          </span>
          <div className="min-w-0">
            <h2
              id="signout-title"
              className="font-display text-xl text-brown leading-tight"
            >
              Sign out of Tatsam?
            </h2>
            <p className="text-sm text-brown/65 mt-1.5 leading-relaxed">
              {email ? (
                <>
                  You&rsquo;ll need to enter your one-time code sent to{" "}
                  <span className="text-brown font-medium">{email}</span> to sign
                  back in.
                </>
              ) : (
                <>You&rsquo;ll need your email again to sign back in.</>
              )}
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-2 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="h-10 px-5 rounded-full text-sm text-brown/70 hover:text-brown hover:bg-amber/15 transition-colors"
          >
            Cancel
          </button>
          <form action={signOut}>
            <button
              type="submit"
              className="h-10 px-5 rounded-full bg-maroon text-ivory text-sm hover:bg-maroon/90 transition-colors inline-flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────
// Chart-readiness strip
// ───────────────────────────────────────────────────────────────

function ChartReadinessStrip({
  required,
  done,
  complete,
}: {
  required: Array<{ key: string; label: string; filled: boolean }>;
  done: number;
  complete: boolean;
}) {
  if (complete) {
    return (
      <section className="rounded-2xl bg-[#EFF7EF] border border-[#2F6A3E]/20 p-4 md:p-5 flex items-center gap-3">
        <span className="w-9 h-9 rounded-full bg-[#2F6A3E] text-ivory flex items-center justify-center shrink-0">
          <Check className="w-4 h-4" strokeWidth={3} />
        </span>
        <div className="min-w-0">
          <p className="font-display text-[#2F6A3E] text-base leading-tight">
            Your chart is ready.
          </p>
          <p className="text-xs text-[#2F6A3E]/75 mt-0.5">
            Every required coordinate is in place. Ask away.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-2xl bg-amber/15 border border-gold/30 p-4 md:p-5">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <p className="font-display text-brown text-base leading-tight">
            Complete your chart basics
          </p>
          <p className="text-xs text-brown/60 mt-0.5">
            {done} of {required.length} required details filled.
          </p>
        </div>
        <span className="text-xs font-mono text-brown/60 shrink-0">
          {done}/{required.length}
        </span>
      </div>

      {/* Progress dots */}
      <div className="flex gap-1.5 mb-4">
        {required.map((r) => (
          <span
            key={r.key}
            className={`flex-1 h-1.5 rounded-full ${
              r.filled ? "bg-maroon" : "bg-gold/25"
            }`}
          />
        ))}
      </div>

      {/* Checklist */}
      <ul className="grid gap-1.5">
        {required.map((r) => (
          <li key={r.key} className="flex items-center gap-2 text-sm">
            <span
              className={`w-4 h-4 rounded-full shrink-0 flex items-center justify-center ${
                r.filled ? "bg-maroon text-ivory" : "bg-white border border-gold/40"
              }`}
            >
              {r.filled ? <Check className="w-2.5 h-2.5" strokeWidth={3} /> : null}
            </span>
            <span className={r.filled ? "text-brown" : "text-brown/60"}>
              {r.label}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

// ───────────────────────────────────────────────────────────────
// EditableCard + bits
// ───────────────────────────────────────────────────────────────

function EditableCard({
  title,
  caption,
  readView,
  editView,
  onSave,
  sensitive,
}: {
  title: string;
  caption?: string;
  readView: React.ReactNode;
  editView: React.ReactNode;
  onSave: (fd: FormData) => Promise<{ ok?: boolean; error?: string } | undefined>;
  sensitive?: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [pending, startTransition] = useTransition();
  const [flash, setFlash] = useState<"idle" | "saved" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [formKey, setFormKey] = useState(0);

  const cancel = () => {
    setFormKey((k) => k + 1);
    setEditing(false);
    setError(null);
    setFlash("idle");
  };

  return (
    <section
      className={`rounded-2xl bg-white border transition-colors ${
        editing ? "border-maroon/40" : "border-gold/30"
      }`}
    >
      <header className="flex items-start justify-between gap-3 px-5 pt-5 pb-3 md:px-6 md:pt-6">
        <div className="min-w-0">
          <h2 className="font-display text-lg text-brown leading-tight">{title}</h2>
          {caption ? (
            <p className="text-xs text-brown/55 mt-1 leading-relaxed">{caption}</p>
          ) : null}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {flash === "saved" && !editing ? (
            <span className="inline-flex items-center gap-1 text-xs text-[#2F6A3E] font-mono">
              <Check className="w-3.5 h-3.5" strokeWidth={3} /> Saved
            </span>
          ) : null}
          {!editing ? (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className={`inline-flex items-center gap-1.5 h-8 px-3 rounded-full text-xs transition-colors ${
                sensitive
                  ? "border border-gold/40 text-brown hover:bg-amber/15"
                  : "bg-amber/15 text-brown hover:bg-amber/25"
              }`}
            >
              <Pencil className="w-3.5 h-3.5" />
              Edit
            </button>
          ) : (
            <button
              type="button"
              onClick={cancel}
              aria-label="Cancel editing"
              className="inline-flex items-center justify-center w-8 h-8 rounded-full text-brown/55 hover:text-maroon hover:bg-amber/15 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </header>

      {editing ? (
        <form
          key={formKey}
          action={(fd) => {
            startTransition(async () => {
              setError(null);
              setFlash("idle");
              const res = await onSave(fd);
              if (res?.error) {
                setError(res.error);
                setFlash("error");
                return;
              }
              setFlash("saved");
              setEditing(false);
              setTimeout(() => setFlash("idle"), 1800);
            });
          }}
        >
          <div className="px-5 md:px-6 pt-1 pb-3">{editView}</div>
          <footer className="px-5 md:px-6 pb-5 md:pb-6 flex items-center gap-3 flex-wrap">
            <Button
              type="submit"
              disabled={pending}
              className="h-10 px-5 rounded-full bg-maroon hover:bg-maroon/90 text-ivory disabled:opacity-60"
            >
              {pending ? "Saving…" : "Save"}
            </Button>
            <button
              type="button"
              onClick={cancel}
              disabled={pending}
              className="h-10 px-4 rounded-full text-sm text-brown/60 hover:text-brown disabled:opacity-60"
            >
              Cancel
            </button>
            {error ? <span className="text-sm text-maroon">{error}</span> : null}
          </footer>
        </form>
      ) : (
        <div className="px-5 md:px-6 pb-5 md:pb-6">{readView}</div>
      )}
    </section>
  );
}

function Row({
  icon,
  label,
  value,
  missingHint,
  optional,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  missingHint?: string;
  optional?: boolean;
}) {
  const missing = !value;
  return (
    <div className="flex items-start gap-3 py-3 first:pt-2 last:pb-0 border-b border-gold/15 last:border-b-0">
      <span className="w-7 h-7 rounded-full bg-amber/20 text-brown/70 flex items-center justify-center shrink-0 mt-0.5">
        {icon}
      </span>
      <div className="min-w-0 flex-1 grid sm:grid-cols-[140px_1fr] gap-1 sm:gap-4 sm:items-baseline">
        <dt className="text-xs font-mono text-brown/55 uppercase tracking-wider">
          {label}
        </dt>
        <dd className="text-sm text-brown break-words">
          {missing ? (
            <span className="text-brown/45 italic">
              {optional ? "Not set — optional" : missingHint ?? "Not set"}
            </span>
          ) : (
            value
          )}
        </dd>
      </div>
    </div>
  );
}

function FieldLabel({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-mono text-brown/60 uppercase tracking-wider">
        {label}
        {required ? <span className="text-maroon ml-1">*</span> : null}
      </span>
      {children}
    </label>
  );
}

function JumpTile({
  icon,
  title,
  body,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group block rounded-xl bg-white border border-gold/30 p-4 hover:border-maroon/40 transition-colors"
    >
      <div className="flex items-center gap-2 text-maroon">
        {icon}
        <p className="font-display text-brown">{title}</p>
      </div>
      <p className="text-xs text-brown/55 mt-1 leading-relaxed">{body}</p>
      <span className="block mt-2 text-xs text-maroon group-hover:translate-x-1 transition-transform">
        Open →
      </span>
    </Link>
  );
}

// ───────────────────────────────────────────────────────────────
// Formatting
// ───────────────────────────────────────────────────────────────

function formatDob(dob: string | null): string | null {
  if (!dob) return null;
  const d = new Date(dob + "T00:00:00");
  if (Number.isNaN(d.getTime())) return dob;
  return d.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatTob(tob: string | null): string | null {
  if (!tob) return null;
  const [hh, mm] = tob.split(":");
  const h = Number(hh);
  if (Number.isNaN(h)) return tob;
  const suffix = h >= 12 ? "PM" : "AM";
  const h12 = ((h + 11) % 12) + 1;
  return `${tob}  (${h12}:${mm ?? "00"} ${suffix})`;
}
