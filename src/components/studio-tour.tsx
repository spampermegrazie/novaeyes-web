"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

// The distribution studio: a looping render of the whole operation, with eight
// hotspots. Positions are the 3D anchors projected to the frame (x, y in 0..1).
// The render's background is the page background, and the edges fade out, so the
// diorama sits directly on the page with no box around it.
const STOPS = [
  { key: "brief", x: 0.1725, y: 0.3685, title: "The brief", body: "You tell us the goal, the content and the rules. Every clipper works from the same brief." },
  { key: "source", x: 0.2282, y: 0.5375, title: "Source desk", body: "Your long videos come in here. We mark the best moments and the vertical crops." },
  { key: "clippers", x: 0.5809, y: 0.4828, title: "The clippers", body: "Clippers cut, caption and hook every clip. They only earn when their clips get views." },
  { key: "posting", x: 0.5865, y: 0.2106, title: "Posting", body: "Each clip goes live on TikTok, Instagram Reels, YouTube Shorts and X, across many accounts." },
  { key: "review", x: 0.6557, y: 0.2889, title: "Review gate", body: "Every clip is checked against your brief, and every view is verified on the platform before it counts." },
  { key: "views", x: 0.3515, y: 0.2443, title: "Live tracking", body: "Views are tracked live, so you see what is working while the campaign runs." },
  { key: "payout", x: 0.4752, y: 0.49, title: "Payouts", body: "Clippers are paid on verified views only. No views, no payout." },
  { key: "control", x: 0.8009, y: 0.2731, title: "Control room", body: "We move the budget to the formats that win, and the loop runs again." },
];

const EDGE_FADE = {
  maskImage:
    "linear-gradient(to right, transparent, #000 7%, #000 93%, transparent), linear-gradient(to bottom, transparent, #000 9%, #000 90%, transparent)",
  WebkitMaskImage:
    "linear-gradient(to right, transparent, #000 7%, #000 93%, transparent), linear-gradient(to bottom, transparent, #000 9%, #000 90%, transparent)",
  maskComposite: "intersect",
  WebkitMaskComposite: "source-in",
} as const;

const pad = (n: number) => String(n).padStart(2, "0");
const isDesktop = () => typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches;

export function StudioTour() {
  const [active, setActive] = useState<number | null>(null);
  const [touring, setTouring] = useState(false);
  const cards = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    if (!touring) return;
    const id = setInterval(() => setActive((a) => ((a ?? -1) + 1) % STOPS.length), 4200);
    return () => clearInterval(id);
  }, [touring]);

  // Mobile and tablet: keep the matching card in view.
  useEffect(() => {
    if (active === null || isDesktop()) return;
    cards.current[active]?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [active]);

  const pick = (i: number) => {
    setTouring(false);
    setActive(i);
  };
  const close = () => {
    setTouring(false);
    setActive(null);
  };
  const step = (dir: 1 | -1) => {
    setTouring(false);
    setActive((a) => ((a ?? 0) + dir + STOPS.length) % STOPS.length);
  };

  // Escape closes the pop-up, arrow keys move between stations.
  const isOpen = active !== null;
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setTouring(false);
        setActive(null);
      }
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        const dir = e.key === "ArrowRight" ? 1 : -1;
        setTouring(false);
        setActive((a) => ((a ?? 0) + dir + STOPS.length) % STOPS.length);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!isOpen) return;
    const onDown = (e: PointerEvent) => {
      if (root.current && !root.current.contains(e.target as Node)) {
        setTouring(false);
        setActive(null);
      }
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [isOpen]);
  const stop = active === null ? null : STOPS[active];

  return (
    <div ref={root}>
      <div className="relative aspect-video">
        {/* the scene, with soft edges so it melts into the page */}
        <div className="absolute inset-0 overflow-hidden" style={EDGE_FADE}>
          <div
            onClick={(e) => {
              if (e.target === e.currentTarget || (e.target as HTMLElement).tagName === "VIDEO" || (e.target as HTMLElement).tagName === "IMG") close();
            }}
            className={`relative h-full w-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${stop ? "max-sm:scale-[2.2]" : ""}`}
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
                onClick={() => (active === i ? close() : pick(i))}
                aria-label={`${i + 1}. ${s.title}`}
                aria-expanded={active === i}
                className={`group absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer p-2 transition-transform duration-700 ${stop ? "max-sm:scale-50" : ""}`}
                style={{ left: `${s.x * 100}%`, top: `${s.y * 100}%` }}
              >
                <span
                  className={`relative flex h-5 w-5 items-center justify-center rounded-full border font-display text-[9px] font-semibold transition-all duration-300 sm:h-7 sm:w-7 sm:text-[11px] ${
                    active === i
                      ? "scale-110 border-accent bg-accent text-white shadow-[0_0_24px_rgb(59_130_246/0.8)]"
                      : "border-white/70 bg-bg/85 text-white group-hover:scale-110 group-hover:border-accent"
                  }`}
                >
                  {active !== i && <span className="absolute inset-0 animate-ping rounded-full border border-accent/60 motion-reduce:hidden" />}
                  {i + 1}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* desktop: the station opens as a pop-up next to its number */}
        <div className="pointer-events-none absolute inset-0 hidden lg:block">
          <AnimatePresence mode="wait">
            {stop && active !== null && (
              <motion.div
                key={stop.key}
                role="dialog"
                aria-label={stop.title}
                initial={{ opacity: 0, scale: 0.96, filter: "blur(6px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.98, filter: "blur(4px)" }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="pointer-events-auto absolute w-80"
                style={{
                  left: `${stop.x * 100}%`,
                  top: `${stop.y * 100}%`,
                  translate: stop.x > 0.55 ? "calc(-100% - 26px) -50%" : "26px -50%",
                  transformOrigin: stop.x > 0.55 ? "100% 50%" : "0% 50%",
                }}
              >
                <div className="rounded-2xl border border-white/10 bg-bg-raised/90 p-5 shadow-[0_24px_64px_rgb(0_0_0/0.55),0_0_0_1px_rgb(59_130_246/0.12)] backdrop-blur-xl">
                  <div className="flex items-center justify-between">
                    <span className="font-label text-[10px] tracking-[0.14em] text-accent">
                      {pad(active + 1)} / {pad(STOPS.length)}
                    </span>
                    <button
                      type="button"
                      onClick={close}
                      aria-label="Close"
                      className="-m-1.5 cursor-pointer rounded-full p-1.5 text-muted transition-colors hover:text-fg"
                    >
                      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                        <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" />
                      </svg>
                    </button>
                  </div>
                  <h3 className="mt-3 text-lg">{stop.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{stop.body}</p>
                  <div className="mt-5 flex items-center justify-between border-t border-white/[0.06] pt-4">
                    <button type="button" onClick={() => step(-1)} className="cursor-pointer font-display text-sm font-medium text-muted transition-colors hover:text-fg">
                      ← Back
                    </button>
                    <div className="flex gap-1.5">
                      {STOPS.map((s, i) => (
                        <span key={s.key} className={`h-1 rounded-full transition-all duration-300 ${i === active ? "w-4 bg-accent" : "w-1 bg-white/20"}`} />
                      ))}
                    </div>
                    <button type="button" onClick={() => step(1)} className="cursor-pointer font-display text-sm font-medium text-fg transition-colors hover:text-accent">
                      Next →
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-4 lg:justify-center lg:gap-6">
        <p className="text-sm text-muted">
          <span className="lg:hidden">Tap a number to see what happens at each station.</span>
          <span className="hidden lg:inline">Click a number to see what happens at each station.</span>
        </p>
        <button
          type="button"
          onClick={() => {
            if (touring) return setTouring(false);
            setTouring(true);
            if (active === null) setActive(0);
          }}
          className="shrink-0 cursor-pointer rounded-full border border-line px-4 py-2 font-display text-sm font-semibold hover:border-muted/50"
        >
          {touring ? "Pause tour" : "Take the tour"}
        </button>
      </div>

      {/* Mobile and tablet: swipeable cards. On desktop the pop-up replaces them. */}
      <ol className="mt-5 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 lg:hidden">
        {STOPS.map((s, i) => (
          <li
            key={s.key}
            ref={(el) => {
              cards.current[i] = el;
            }}
            className="w-[78%] shrink-0 snap-center sm:w-[44%]"
          >
            <button
              type="button"
              onClick={() => (active === i ? close() : pick(i))}
              aria-pressed={active === i}
              className={`h-full w-full rounded-xl border p-5 text-left transition-colors duration-300 ${
                active === i ? "border-accent/70 bg-accent/[0.07]" : "border-line hover:border-muted/40"
              }`}
            >
              <span className={`font-label text-[10px] tracking-[0.14em] ${active === i ? "text-accent" : "text-muted"}`}>{pad(i + 1)}</span>
              <h3 className="mt-2 text-base">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{s.body}</p>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
