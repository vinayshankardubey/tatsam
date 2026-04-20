"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { sunSignFromDob, signCompatibility } from "@/lib/astro";
import { lifePathNumber, lifePathCompatibility } from "@/lib/numerology";

export function CompatibilityForm({
  selfName,
  selfDob,
}: {
  selfName: string;
  selfDob: string;
}) {
  const [partnerName, setPartnerName] = useState("");
  const [partnerDob, setPartnerDob] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const selfSign = useMemo(() => sunSignFromDob(selfDob), [selfDob]);
  const selfLP = useMemo(() => lifePathNumber(selfDob), [selfDob]);

  const partnerSign = useMemo(() => (partnerDob ? sunSignFromDob(partnerDob) : null), [partnerDob]);
  const partnerLP = useMemo(() => (partnerDob ? lifePathNumber(partnerDob) : null), [partnerDob]);

  const signResult = useMemo(() => {
    if (!selfSign || !partnerSign) return null;
    return signCompatibility(selfSign.name, partnerSign.name);
  }, [selfSign, partnerSign]);

  const lpResult = useMemo(() => {
    if (selfLP == null || partnerLP == null) return null;
    return lifePathCompatibility(selfLP, partnerLP);
  }, [selfLP, partnerLP]);

  const overall = useMemo(() => {
    if (!signResult || !lpResult) return null;
    return Math.round((signResult.score + lpResult.score) / 2);
  }, [signResult, lpResult]);

  const canReveal = submitted && partnerName.trim() && partnerDob;

  return (
    <div className="space-y-6">
      {/* Partner form */}
      <section className="rounded-2xl bg-white border border-gold/30 p-5 md:p-6">
        <p className="text-[10px] font-mono text-brown/50 uppercase tracking-wider mb-4">
          The other person
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(true);
          }}
          className="grid md:grid-cols-[1fr_1fr_auto] gap-3 items-end"
        >
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-mono text-brown/60 uppercase tracking-wider">
              Full name
            </span>
            <Input
              value={partnerName}
              onChange={(e) => {
                setPartnerName(e.target.value);
                setSubmitted(false);
              }}
              placeholder="As they&rsquo;d write it"
              className="h-11 bg-ivory border-gold/30 focus-visible:border-maroon"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-mono text-brown/60 uppercase tracking-wider">
              Date of birth
            </span>
            <Input
              type="date"
              value={partnerDob}
              onChange={(e) => {
                setPartnerDob(e.target.value);
                setSubmitted(false);
              }}
              className="h-11 bg-ivory border-gold/30 focus-visible:border-maroon"
            />
          </label>
          <Button
            type="submit"
            disabled={!partnerName.trim() || !partnerDob}
            className="h-11 px-6 rounded-full bg-maroon text-ivory hover:bg-maroon/90"
          >
            Compare
          </Button>
        </form>
        <p className="mt-3 text-[11px] font-mono text-brown/45">
          We compute sun-sign and life-path compatibility right in your browser
          — nothing leaves your device.
        </p>
      </section>

      {/* Results */}
      {canReveal && overall != null ? (
        <>
          {/* Overall */}
          <section className="rounded-2xl bg-gradient-to-br from-gold/15 to-ivory border border-gold/30 p-6 md:p-10">
            <p className="text-[10px] font-mono text-brown/50 uppercase tracking-wider mb-2">
              Overall compatibility
            </p>
            <div className="flex items-baseline gap-4 flex-wrap">
              <span className="text-6xl md:text-7xl font-display text-maroon leading-none">
                {overall}
              </span>
              <span className="text-xl text-brown/60">out of 100</span>
            </div>
            <div className="mt-5 h-2 rounded-full bg-gold/20 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-gold via-amber to-maroon"
                style={{ width: `${overall}%` }}
              />
            </div>
            <p className="mt-5 text-brown/70 leading-relaxed max-w-2xl">
              {overall >= 85
                ? "A beautiful resonance — pay attention to what brings you close."
                : overall >= 70
                  ? "A warm match with real potential. Protect the rhythm."
                  : overall >= 55
                    ? "Workable with intention. Different tempos, rich conversations."
                    : "Tension is real; growth is possible with curiosity and time."}
            </p>
          </section>

          {/* Two factor cards */}
          <div className="grid md:grid-cols-2 gap-4">
            {selfSign && partnerSign && signResult ? (
              <ResultCard
                badge="Sun signs"
                headline={`${selfSign.name} × ${partnerSign.name}`}
                sub={`${selfSign.element} × ${partnerSign.element}`}
                score={signResult.score}
                note={signResult.note}
              />
            ) : null}
            {selfLP != null && partnerLP != null && lpResult ? (
              <ResultCard
                badge="Life path"
                headline={`${selfLP} × ${partnerLP}`}
                sub="Pythagorean numerology"
                score={lpResult.score}
                note={lpResult.note}
              />
            ) : null}
          </div>

          {/* Side-by-side summary */}
          <section className="rounded-2xl bg-white border border-gold/30 p-5 md:p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <PersonCol label={selfName} dob={selfDob} sign={selfSign?.name ?? "—"} lp={selfLP} />
              <PersonCol label={partnerName} dob={partnerDob} sign={partnerSign?.name ?? "—"} lp={partnerLP} />
            </div>
          </section>
        </>
      ) : null}

      {!canReveal && submitted ? (
        <p className="text-sm text-brown/55">
          Enter both a name and a date of birth to compare.
        </p>
      ) : null}
    </div>
  );
}

function ResultCard({
  badge,
  headline,
  sub,
  score,
  note,
}: {
  badge: string;
  headline: string;
  sub: string;
  score: number;
  note: string;
}) {
  return (
    <div className="rounded-xl bg-white border border-gold/30 p-6">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] font-mono text-brown/55 uppercase tracking-wider">
          {badge}
        </p>
        <span className="text-2xl font-display text-maroon">{score}</span>
      </div>
      <p className="text-xl font-display text-brown">{headline}</p>
      <p className="text-xs text-brown/55 mt-1">{sub}</p>
      <div className="mt-4 h-1.5 rounded-full bg-gold/20 overflow-hidden">
        <div className="h-full bg-maroon" style={{ width: `${score}%` }} />
      </div>
      <p className="mt-4 text-sm text-brown/70 leading-relaxed">{note}</p>
    </div>
  );
}

function PersonCol({
  label,
  dob,
  sign,
  lp,
}: {
  label: string;
  dob: string;
  sign: string;
  lp: number | null;
}) {
  return (
    <div>
      <p className="text-[10px] font-mono text-brown/50 uppercase tracking-wider mb-2">
        {label}
      </p>
      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-lg bg-ivory/60 border border-gold/25 p-3">
          <p className="text-[9px] font-mono text-brown/50 uppercase tracking-wider">
            DOB
          </p>
          <p className="text-brown text-sm mt-0.5 font-mono">{dob || "—"}</p>
        </div>
        <div className="rounded-lg bg-ivory/60 border border-gold/25 p-3">
          <p className="text-[9px] font-mono text-brown/50 uppercase tracking-wider">
            Sun
          </p>
          <p className="text-brown text-sm mt-0.5">{sign}</p>
        </div>
        <div className="rounded-lg bg-ivory/60 border border-gold/25 p-3">
          <p className="text-[9px] font-mono text-brown/50 uppercase tracking-wider">
            Life Path
          </p>
          <p className="text-brown text-sm mt-0.5">{lp ?? "—"}</p>
        </div>
      </div>
    </div>
  );
}
