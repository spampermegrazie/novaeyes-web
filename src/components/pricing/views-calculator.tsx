"use client";

import { useState } from "react";

// Pricing: what a view pool buys at a given CPM. Plain arithmetic (views = pool / CPM x 1,000),
// with the CPMs of past campaigns marked on the track. The default (a $3,000 pool at $0.20) is
// rendered on the server, so the number is in the HTML.

type Past = { client: string; cpm: number };

const POOLS = [3_000, 5_000, 10_000, 25_000];
const MIN = 0.1;
const MAX = 0.5;

const pct = (cpm: number) => ((cpm - MIN) / (MAX - MIN)) * 100;
// The thumb is 20px wide, so it travels from 10px to (100% - 10px).
const along = (cpm: number) => `calc(10px + ${pct(cpm) / 100} * (100% - 20px))`;
const usd = (n: number) => `$${n.toLocaleString("en-US")}`;

export function ViewsCalculator({ past }: { past: Past[] }) {
  const [pool, setPool] = useState(POOLS[0]);
  const [cpm, setCpm] = useState(0.2);
  const views = Math.round((pool / cpm) * 1000);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-line bg-bg-raised/30 px-6 py-10 sm:px-10 sm:py-12">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-96 w-[48rem] max-w-[160%] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(var(--glow)/0.18),transparent)]"
      />
      <span aria-hidden className="sb-sweep pointer-events-none absolute top-0 left-0 h-px w-1/4 bg-gradient-to-r from-transparent via-accent to-transparent" />

      <div className="relative text-center">
        <div className="inline-flex justify-center gap-1 rounded-full border border-line bg-bg p-1" role="group" aria-label="View pool">
          {POOLS.map((p) => (
            <button
              key={p}
              type="button"
              aria-pressed={pool === p}
              onClick={() => setPool(p)}
              className={`rounded-full px-3.5 py-1.5 font-display text-xs font-semibold tabular-nums transition-colors duration-300 sm:px-4 sm:text-sm ${
                pool === p ? "bg-accent text-accent-ink shadow-[0_0_18px_rgb(var(--glow)/0.45)]" : "text-muted hover:text-fg"
              }`}
            >
              <span aria-hidden>${p / 1000}k</span>
              <span className="sr-only">{usd(p)}</span>
            </button>
          ))}
        </div>

        <p className="mt-10 font-display text-[2.6rem] leading-none font-bold tracking-tight tabular-nums [text-shadow:0_0_40px_rgb(var(--glow)/0.35)] min-[400px]:text-5xl sm:text-7xl lg:text-8xl" aria-live="polite">
          {views.toLocaleString("en-US")}
        </p>
        <p className="mt-4 font-label text-[10px] tracking-[0.14em] text-muted uppercase">
          Verified views from a {usd(pool)} view pool at a ${cpm.toFixed(2)} CPM
        </p>

        {/* CPM track with past campaigns marked on it */}
        <div className="mx-auto mt-12 max-w-2xl">
          <div className="relative h-5" aria-hidden>
            {past.map((c) => (
              <span
                key={c.client}
                className="absolute top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#9cc3ff]/70 shadow-[0_0_8px_rgb(var(--glow)/0.8)]"
                style={{ left: along(c.cpm) }}
              />
            ))}
          </div>
          <input
            type="range"
            min={MIN}
            max={MAX}
            step={0.01}
            value={cpm}
            onChange={(e) => setCpm(Number(e.target.value))}
            aria-label="CPM, cost per 1,000 views"
            aria-valuetext={`$${cpm.toFixed(2)} per 1,000 views`}
            className="pr-range"
            style={{ ["--p" as string]: `${pct(cpm)}%` }}
          />
          <div className="mt-1 flex justify-between font-label text-[9px] tracking-[0.14em] text-muted uppercase">
            <span>${MIN.toFixed(2)} CPM</span>
            <span>${MAX.toFixed(2)} CPM</span>
          </div>
        </div>

        <div className="mx-auto mt-8 max-w-2xl">
          <p className="font-label text-[9px] tracking-[0.14em] text-muted uppercase">Past campaigns, tap to use their CPM</p>
          <ul className="mt-3 flex flex-wrap justify-center gap-2">
            {past.map((c) => {
              const on = Math.abs(c.cpm - cpm) < 0.001;
              return (
                <li key={c.client}>
                  <button
                    type="button"
                    onClick={() => setCpm(c.cpm)}
                    aria-pressed={on}
                    className={`rounded-full border px-3.5 py-1.5 text-xs transition-colors duration-300 sm:text-sm ${
                      on ? "border-accent/70 bg-accent/10 text-fg" : "border-line bg-bg text-muted hover:border-muted/50 hover:text-fg"
                    }`}
                  >
                    {c.client} <span className="font-display font-semibold text-accent tabular-nums">${c.cpm.toFixed(2)}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
        <p className="mx-auto mt-8 max-w-md text-xs leading-relaxed text-muted/80">
          Arithmetic, not a forecast. View pool only: if the fee is taken out of the budget, the pool is the budget minus the fee.
        </p>
      </div>
    </div>
  );
}
