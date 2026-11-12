"use client";

import { useEffect, useRef, useState } from "react";

// The distribution studio: a looping render of the whole operation, with eight
// hotspots. Positions are the 3D anchors projected to the frame (x, y in 0..1).
const STOPS = [
  { key: "brief", x: 0.1568, y: 0.3621, title: "The brief", body: "You tell us the goal, the content and the rules. Every clipper works from the same brief." },
  { key: "source", x: 0.2151, y: 0.5393, title: "Source desk", body: "Your long videos come in here. We mark the best moments and the vertical crops." },
  { key: "clippers", x: 0.5848, y: 0.482, title: "The clippers", body: "Clippers cut, caption and hook every clip. They only earn when their clips get views." },
  { key: "posting", x: 0.5906, y: 0.1966, title: "Posting", body: "Each clip goes live on TikTok, Instagram Reels, YouTube Shorts and X, across many accounts." },
  { key: "review", x: 0.6632, y: 0.2787, title: "Review gate", body: "Every clip is checked against your brief, and every view is verified on the platform before it counts." },
  { key: "views", x: 0.3443, y: 0.2319, title: "Live tracking", body: "Views are tracked live, so you see what is working while the campaign runs." },
  { key: "payout", x: 0.474, y: 0.4895, title: "Payouts", body: "Clippers are paid on verified views only. No views, no payout." },
  { key: "control", x: 0.8154, y: 0.2621, title: "Control room", body: "We move the budget to the formats that win, and the loop runs again." },
];

export function StudioTour() {
  const [active, setActive] = useState<number | null>(null);
  const [touring, setTouring] = useState(false);
  const cards = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    if (!touring) return;
    const id = setInterval(() => setActive((a) => ((a ?? -1) + 1) % STOPS.length), 3800);
    return () => clearInterval(id);
  }, [touring]);

  useEffect(() => {
    if (active === null) return;
    cards.current[active]?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [active]);

  const pick = (i: number) => {
    setTouring(false);
    setActive(i);
  };
  const stop = active === null ? null : STOPS[active];

  return (
    <div>
      <div className="relative overflow-hidden rounded-2xl border border-line bg-[#0d0d12]">
        <div
          className={`relative aspect-video transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${stop ? "max-sm:scale-[2.2]" : ""}`}
          style={{ transformOrigin: stop ? `${stop.x * 100}% ${stop.y * 100}%` : "50% 50%" }}
        >
          <video
            className="absolute inset-0 h-full w-full object-cover motion-reduce:hidden"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/studio/studio-poster.webp"
            aria-hidden
          >
            <source src="/studio/studio-loop.webm" type="video/webm" />
            <source src="/studio/studio-loop.mp4" type="video/mp4" />
          </video>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/studio/studio-poster.webp"
            alt="An isometric view of the NovaEyes studio: clippers around a conveyor of clips, a review gate, live analytics and stacks of coins."
            className="absolute inset-0 hidden h-full w-full object-cover motion-reduce:block"
            loading="lazy"
          />
          {STOPS.map((s, i) => (
            <button
              key={s.key}
              type="button"
              onClick={() => pick(i)}
              onMouseEnter={() => pick(i)}
              onFocus={() => pick(i)}
              aria-label={`${i + 1}. ${s.title}`}
              aria-pressed={active === i}
              className={`group absolute -translate-x-1/2 -translate-y-1/2 p-2 transition-transform duration-700 ${stop ? "max-sm:scale-50" : ""}`}
              style={{ left: `${s.x * 100}%`, top: `${s.y * 100}%` }}
            >
              <span
                className={`relative flex h-5 w-5 items-center justify-center rounded-full border font-display text-[9px] font-semibold transition-all duration-300 sm:h-7 sm:w-7 sm:text-[11px] ${
                  active === i
                    ? "scale-110 border-accent bg-accent text-white shadow-[0_0_24px_rgb(59_130_246/0.8)]"
                    : "border-white/70 bg-[#0d0d12]/85 text-white group-hover:border-accent"
                }`}
              >
                {active !== i && <span className="absolute inset-0 animate-ping rounded-full border border-accent/60 motion-reduce:hidden" />}
                {i + 1}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-4">
        <p className="text-sm text-muted">Tap a number to see what happens at each station.</p>
        <button
          type="button"
          onClick={() => {
            setTouring((t) => !t);
            if (!touring && active === null) setActive(0);
          }}
          className="shrink-0 rounded-full border border-line px-4 py-2 font-display text-sm font-semibold hover:border-muted/50"
        >
          {touring ? "Pause tour" : "Take the tour"}
        </button>
      </div>

      <ol className="mt-5 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 lg:grid lg:grid-cols-4 lg:overflow-visible lg:pb-0">
        {STOPS.map((s, i) => (
          <li
            key={s.key}
            ref={(el) => {
              cards.current[i] = el;
            }}
            className="w-[78%] shrink-0 snap-center sm:w-[44%] lg:w-auto"
          >
            <button
              type="button"
              onClick={() => (active === i ? (setTouring(false), setActive(null)) : pick(i))}
              aria-pressed={active === i}
              className={`h-full w-full rounded-xl border p-5 text-left transition-colors duration-300 ${
                active === i ? "border-accent/70 bg-accent/[0.07]" : "border-line hover:border-muted/40"
              }`}
            >
              <span className={`font-label text-[10px] tracking-[0.14em] ${active === i ? "text-accent" : "text-muted"}`}>0{i + 1}</span>
              <h3 className="mt-2 text-base">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{s.body}</p>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
