"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

// Pricing: the management fee on top of the budget or taken out of it, drawn against one budget
// bracket. The switch flips on its own every few seconds until someone uses it, so it reads as
// something you can change. Not to scale, and it never shows a percentage.

const MODES = {
  top: {
    label: "Fee on top",
    short: "On top",
    sub: "Added to your budget",
    pool: 80,
    pay: "Budget + fee",
    caption: "The whole budget funds the view pool. The fee is added to it.",
  },
  out: {
    label: "Fee taken out",
    short: "Taken out",
    sub: "Inside your budget",
    pool: 64,
    pay: "Budget",
    caption: "The fee comes out of the budget. The rest funds the view pool.",
  },
} as const;

type Mode = keyof typeof MODES;
const ORDER: Mode[] = ["top", "out"];
const FEE = 16;

function SwapIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 5h9.5M10 2.5 12.5 5 10 7.5M13 11H3.5M6 8.5 3.5 11 6 13.5" />
    </svg>
  );
}

export function FeeSplit() {
  const [mode, setMode] = useState<Mode>("top");
  const [touched, setTouched] = useState(false);
  const reduced = useReducedMotion();
  const m = MODES[mode];

  useEffect(() => {
    if (touched || reduced) return;
    const id = setInterval(() => setMode((x) => (x === "top" ? "out" : "top")), 3200);
    return () => clearInterval(id);
  }, [touched, reduced]);

  const pick = (k: Mode) => {
    setTouched(true);
    setMode(k);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-line bg-bg-raised/30 p-5 sm:p-8">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(var(--line)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_55%,#000_30%,transparent_100%)] [background-size:22px_22px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 h-72 w-[36rem] max-w-[140%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(var(--glow)/0.14),transparent)]"
      />

      <div className="relative">
        {/* the switch */}
        <div className="flex items-center justify-between gap-3">
          <p className="font-label text-[9px] tracking-[0.14em] text-muted uppercase">Where the fee sits</p>
          <p className={`flex items-center gap-1.5 text-[11px] text-accent transition-opacity duration-500 ${touched ? "opacity-0" : "opacity-100"}`} aria-hidden>
            <SwapIcon className="h-3.5 w-3.5 animate-pulse" />
            Tap to switch
          </p>
        </div>
        <div
          role="radiogroup"
          aria-label="Where the management fee sits"
          className="relative mt-3 grid grid-cols-2 rounded-2xl border border-[var(--line-strong)] bg-bg p-1.5 shadow-[inset_0_1px_0_rgb(255_255_255/0.03)]"
        >
          <span
            aria-hidden
            className="absolute top-1.5 bottom-1.5 left-1.5 w-[calc(50%-6px)] rounded-xl bg-gradient-to-b from-[#4b8ff8] to-accent shadow-[0_0_24px_rgb(var(--glow)/0.5),inset_0_1px_0_rgb(255_255_255/0.25)] transition-[translate] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{ translate: mode === "out" ? "100% 0" : "0 0" }}
          />
          {ORDER.map((k) => {
            const on = mode === k;
            return (
              <button
                key={k}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => pick(k)}
                className={`group relative z-10 flex cursor-pointer flex-col items-center rounded-xl px-2 py-2.5 text-center transition-colors duration-300 sm:py-3 ${
                  on ? "text-accent-ink" : "text-muted hover:bg-white/[0.03] hover:text-fg"
                }`}
              >
                <span className="flex items-center gap-2 font-display text-sm font-semibold sm:text-base">
                  <span
                    aria-hidden
                    className={`flex h-3.5 w-3.5 items-center justify-center rounded-full border transition-colors duration-300 ${
                      on ? "border-white bg-white/20" : "border-muted/60 group-hover:border-fg"
                    }`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full bg-white transition-opacity duration-300 ${on ? "opacity-100" : "opacity-0"}`} />
                  </span>
                  <span className="min-[420px]:hidden">{MODES[k].short}</span>
                  <span className="hidden min-[420px]:inline">{MODES[k].label}</span>
                </span>
                <span className={`mt-0.5 text-[11px] transition-colors duration-300 ${on ? "text-white/80" : "text-muted/80"}`}>{MODES[k].sub}</span>
              </button>
            );
          })}
        </div>

        {/* the budget bracket and the bar under it */}
        <div className="relative mt-14" aria-hidden>
          <div className="absolute -top-8 left-0 w-[80%]">
            <span className="absolute -top-1 left-1/2 -translate-x-1/2 font-label text-[9px] tracking-[0.14em] whitespace-nowrap text-fg/70 uppercase">
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

        <div className="mt-8 grid gap-4 border-t border-line pt-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
          <p className="text-sm leading-relaxed text-muted" aria-live="polite">
            {m.caption}
          </p>
          <p>
            <span className="block font-label text-[9px] tracking-[0.14em] text-muted uppercase">You pay</span>
            <span className="font-display text-2xl font-bold tracking-tight">{m.pay}</span>
          </p>
        </div>
        <p className="mt-4 text-[11px] text-muted/80">Not to scale. Your percentage is set per campaign.</p>
      </div>
    </div>
  );
}
