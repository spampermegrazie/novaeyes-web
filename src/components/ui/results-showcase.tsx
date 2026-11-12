"use client";

// Homepage results: a list of campaigns on the left that advances on its own like
// stories, and the selected campaign on the right with its views counting up out
// of a blur. Every campaign's numbers are in the server HTML; only one is shown at
// a time. Clicking a campaign takes over from the auto-advance.

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { cpmText, type Campaign } from "@/content/campaigns";
import { CountUp } from "./count-up";

const SLIDE_MS = 7000;

// Exact counts read better in full (189,974,866); rounded ones keep their label (8.4M).
function viewsText(c: Campaign) {
  return c.views % 100_000 !== 0 ? c.views.toLocaleString("en-US") : c.viewsLabel;
}

function stats(c: Campaign) {
  const out: { label: string; value: string }[] = [];
  const cpm = cpmText(c);
  if (cpm) out.push({ label: "Per 1,000 views", value: cpm });
  if (c.clips !== undefined) out.push({ label: "Clips", value: c.clips.toLocaleString("en-US") });
  if (c.timeframe) out.push({ label: "Timeframe", value: c.timeframe });
  return out;
}

export function ResultsShowcase({ campaigns }: { campaigns: Campaign[] }) {
  const reduced = useReducedMotion() ?? false;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.35 });
  const [active, setActive] = useState(0);
  const [manual, setManual] = useState(false);
  const auto = !reduced && !manual;
  const next = () => setActive((a) => (a + 1) % campaigns.length);

  const select = (i: number) => {
    setActive(i);
    setManual(true);
  };

  // Story-style progress line under the active campaign; when it fills, move on.
  const progress = (i: number) =>
    auto && i === active ? (
      <span
        key={`p-${active}`}
        aria-hidden
        className="ne-story absolute inset-x-0 bottom-0 h-px origin-left bg-accent group-hover/list:[animation-play-state:paused]"
        style={{ animationDuration: `${SLIDE_MS}ms`, animationPlayState: inView ? "running" : "paused" }}
        onAnimationEnd={next}
      />
    ) : null;

  return (
    <div ref={ref} className="grid gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-16">
      {/* Mobile: campaigns as a swipeable row */}
      <div role="tablist" aria-label="Campaigns" className="group/list -mx-6 flex snap-x scroll-px-6 gap-2 overflow-x-auto px-6 pb-1 lg:hidden">
        {campaigns.map((c, i) => (
          <button
            key={c.slug}
            role="tab"
            aria-selected={i === active}
            aria-controls={`result-${c.slug}`}
            onClick={() => select(i)}
            className={`relative flex shrink-0 snap-start items-center gap-2 overflow-hidden rounded-xl border py-1.5 pr-4 pl-1.5 font-display text-sm font-semibold transition-colors ${
              i === active ? "border-accent/60 text-fg" : "border-line text-muted"
            }`}
          >
            {c.visual && <Avatar src={c.visual.avatar} on={i === active} size={24} />}
            {c.client}
            {progress(i)}
          </button>
        ))}
      </div>

      {/* Desktop: the list */}
      <div role="tablist" aria-label="Campaigns" aria-orientation="vertical" className="group/list hidden lg:block">
        {campaigns.map((c, i) => {
          const on = i === active;
          return (
            <button
              key={c.slug}
              role="tab"
              aria-selected={on}
              aria-controls={`result-${c.slug}`}
              onClick={() => select(i)}
              className={`relative flex w-full items-center gap-4 border-b border-line py-4 text-left transition-colors ${on ? "text-fg" : "text-muted hover:text-fg"}`}
            >
              {c.visual ? (
                <Avatar src={c.visual.avatar} on={on} size={36} />
              ) : (
                <span className={`font-label text-[10px] ${on ? "text-accent" : ""}`}>0{i + 1}</span>
              )}
              <span className="min-w-0 flex-1">
                <span className="block font-display text-lg font-semibold">{c.client}</span>
                <span className="mt-0.5 block font-label text-[9px] tracking-[0.12em] uppercase opacity-70">{c.category}</span>
              </span>
              <span className="font-display text-sm font-semibold tabular-nums">{c.viewsLabel}</span>
              {progress(i)}
            </button>
          );
        })}
      </div>

      {/* The selected campaign. All panels are in the HTML, stacked; one is visible. */}
      <div className="relative isolate grid">
        <div
          aria-hidden
          className="pointer-events-none absolute top-[38%] left-[30%] -z-10 aspect-square w-[85%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(59_130_246/0.18),rgb(59_130_246/0.06)_45%,transparent)]"
        />
        {campaigns.map((c, i) => {
          const on = i === active;
          const s = stats(c);
          return (
            <article
              key={c.slug}
              id={`result-${c.slug}`}
              role="tabpanel"
              aria-label={c.client}
              className={`relative isolate col-start-1 row-start-1 transition-[opacity,translate] duration-500 motion-reduce:transition-none ${
                on ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"
              }`}
            >
              {c.visual && <Visual visual={c.visual} on={on} />}
              <p className="font-label text-[10px] tracking-[0.14em] text-accent uppercase">{c.category}</p>
              <h3 className="mt-3 text-3xl tracking-tight sm:text-4xl">{c.client}</h3>

              <p className="mt-8 font-display text-5xl leading-none font-bold tracking-tight sm:text-7xl lg:text-8xl">
                {on ? <CountUp key={`n-${c.slug}-${active}`} value={viewsText(c)} /> : viewsText(c)}
              </p>
              <p className="mt-3 font-label text-[10px] tracking-[0.14em] text-muted uppercase">Verified views</p>

              {s.length > 0 && (
                <dl className="mt-10 grid grid-cols-3 gap-y-6 border-y border-line py-6">
                  {s.map((x) => (
                    <div key={x.label} className="pr-3">
                      <dd className="font-display text-xl font-bold tabular-nums sm:text-2xl">{x.value}</dd>
                      <dt className="mt-1 font-label text-[9px] tracking-[0.12em] text-muted uppercase">{x.label}</dt>
                    </div>
                  ))}
                </dl>
              )}

              <div className={`${s.length > 0 ? "mt-6" : "mt-10 border-t border-line pt-6"} flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between`}>
                <p className="flex max-w-md gap-3 leading-relaxed">
                  <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent shadow-[0_0_8px_rgb(var(--glow))]" />
                  {c.highlight}
                </p>
                <Link
                  href={`/case-studies/${c.slug}`}
                  tabIndex={on ? 0 : -1}
                  className="shrink-0 font-display text-sm font-semibold text-accent hover:text-fg"
                >
                  Read the case study →
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

function Avatar({ src, on, size }: { src: string; on: boolean; size: number }) {
  return (
    <span
      className={`relative shrink-0 overflow-hidden rounded-full ring-1 transition-[box-shadow,opacity] duration-300 ${
        on ? "opacity-100 ring-accent shadow-[0_0_14px_rgb(var(--glow)/0.55)]" : "opacity-55 ring-line"
      }`}
      style={{ width: size, height: size }}
    >
      <Image src={src} alt="" width={size * 2} height={size * 2} className="h-full w-full object-cover" />
    </span>
  );
}

// People: a cut-out, blue-tinted portrait dissolving into the panel behind the number.
// Brands: the logo in white, faint, like part of the glow.
function Visual({ visual, on }: { visual: NonNullable<Campaign["visual"]>; on: boolean }) {
  const portrait = visual.kind === "portrait";
  const fade = portrait
    ? "linear-gradient(to bottom, #000 55%, transparent 95%), linear-gradient(to right, transparent 0%, #000 45%)"
    : "linear-gradient(to right, transparent 0%, #000 50%)";
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute right-0 -z-10 transition-[scale] duration-[1200ms] ease-out motion-reduce:transition-none ${
        portrait ? "-top-8 h-[260px] w-[72%] opacity-45 sm:h-[320px] lg:-top-10 lg:h-[340px] lg:w-[62%] lg:opacity-80" : "top-16 h-[160px] w-[80%] opacity-[0.13] lg:h-[220px]"
      } ${on ? "scale-100" : "scale-105"}`}
      style={{ maskImage: fade, WebkitMaskImage: fade, maskComposite: "intersect", WebkitMaskComposite: "source-in" }}
    >
      <Image
        src={visual.src}
        alt=""
        fill
        sizes="(min-width: 1024px) 480px, 70vw"
        className={portrait ? "object-contain object-right-bottom" : "object-contain object-right drop-shadow-[0_0_40px_rgb(59_130_246/0.6)]"}
      />
    </div>
  );
}
