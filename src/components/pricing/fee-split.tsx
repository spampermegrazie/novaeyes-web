"use client";

import { useState } from "react";

// Pricing: where the money goes, with the management fee on top of the budget or taken out of it.
// Drawn against one budget bracket so the difference is visible at a glance. Not to scale, and it
// never shows a percentage: the percentage is set per campaign.

const MODES = {
  top: {
    label: "Fee on top",
    pool: 80,
    pay: "Budget + fee",
    caption: "The whole budget funds the view pool. The fee is added to it.",
  },
  out: {
    label: "Fee taken out",
    pool: 64,
    pay: "Budget",
    caption: "The fee comes out of the budget. The rest funds the view pool.",
  },
} as const;

type Mode = keyof typeof MODES;
const FEE = 16;

export function FeeSplit() {
  const [mode, setMode] = useState<Mode>("top");
  const m = MODES[mode];

  return (
    <div className="relative overflow-hidden rounded-3xl border border-line bg-bg-raised/30 p-6 sm:p-8">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(var(--line)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_45%,#000_30%,transparent_100%)] [background-size:22px_22px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 h-72 w-[36rem] max-w-[140%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(var(--glow)/0.14),transparent)]"
      />

      <div className="relative">
        <div className="inline-flex rounded-full border border-line bg-bg p-1" role="group" aria-label="Where the management fee sits">
          {(Object.keys(MODES) as Mode[]).map((k) => (
            <button
              key={k}
              type="button"
              aria-pressed={mode === k}
              onClick={() => setMode(k)}
              className={`rounded-full px-4 py-1.5 font-display text-xs font-semibold transition-colors duration-300 sm:text-sm ${
                mode === k ? "bg-accent text-accent-ink shadow-[0_0_18px_rgb(var(--glow)/0.45)]" : "text-muted hover:text-fg"
              }`}
            >
              {MODES[k].label}
            </button>
          ))}
        </div>

        {/* the budget bracket and the bar under it */}
        <div className="relative mt-14 sm:mt-16" aria-hidden>
          <div className="absolute -top-8 left-0 w-[80%]">
            <span className="absolute -top-1 left-1/2 -translate-x-1/2 bg-transparent font-label text-[9px] tracking-[0.14em] whitespace-nowrap text-fg/70 uppercase">
              Your budget
            </span>
            <div className="mt-4 h-2.5 rounded-t-md border-x border-t border-fg/30" />
          </div>
          <div className="flex h-14 sm:h-16">
            <div
              className="flex items-center overflow-hidden rounded-l-xl bg-gradient-to-r from-[#1e3a8a] to-accent px-3 font-display text-xs font-semibold whitespace-nowrap text-fg shadow-[0_0_30px_rgb(var(--glow)/0.3)] transition-[width] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] sm:px-4 sm:text-sm"
              style={{ width: `${m.pool}%` }}
            >
              View pool
            </div>
            <div
              className="ml-1 flex items-center justify-center rounded-r-xl border border-dashed border-accent/70 bg-accent/10 font-display text-xs font-semibold text-fg/90 sm:text-sm"
              style={{ width: `calc(${FEE}% - 4px)` }}
            >
              Fee
            </div>
          </div>
        </div>

        <ul className="mt-9 grid gap-4 sm:grid-cols-2">
          <li className="flex gap-3">
            <span aria-hidden className="mt-1 h-3 w-3 shrink-0 rounded-[4px] bg-gradient-to-r from-[#1e3a8a] to-accent" />
            <span className="text-sm leading-relaxed">
              <span className="font-display font-semibold">View pool.</span>{" "}
              <span className="text-muted">Paid to clippers, per 1,000 verified views.</span>
            </span>
          </li>
          <li className="flex gap-3">
            <span aria-hidden className="mt-1 h-3 w-3 shrink-0 rounded-[4px] border border-dashed border-accent/70 bg-accent/10" />
            <span className="text-sm leading-relaxed">
              <span className="font-display font-semibold">Management fee.</span>{" "}
              <span className="text-muted">Paid to NovaEyes, a percentage of the budget.</span>
            </span>
          </li>
        </ul>

        <div className="mt-7 flex flex-col gap-3 border-t border-line pt-5 sm:flex-row sm:items-end sm:justify-between">
          <p className="max-w-xs text-sm leading-relaxed text-muted" aria-live="polite">
            {m.caption}
          </p>
          <p className="shrink-0">
            <span className="block font-label text-[9px] tracking-[0.14em] text-muted uppercase">You pay</span>
            <span className="font-display text-2xl font-bold tracking-tight">{m.pay}</span>
          </p>
        </div>
        <p className="mt-4 text-[11px] text-muted/80">Not to scale. Your percentage is set per campaign.</p>
      </div>
    </div>
  );
}
