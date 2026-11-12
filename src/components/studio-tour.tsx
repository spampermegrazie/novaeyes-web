"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { StudioPoint } from "@/components/studio/studio-scene";
import type { StudioWorkerOut } from "@/components/studio/studio.worker";

// The distribution studio. A live 3D scene with eight stations. Desktop: hover a number for
// a quick look, click to zoom in, then move between stations with the camera gliding over.
// Mobile: tap to zoom, cards below.
// Loading: the scene's code is fetched when the browser is idle, the scene is built when the
// section is within ~1.5 screens, and it only draws while on screen. Where the browser can,
// it runs in a Web Worker on an OffscreenCanvas, so building it and drawing it never block
// the page; otherwise it runs here. Until it has drawn its first frame, a still shows.
// x and y are where each number sits in the default view, used before the scene loads.
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
    "linear-gradient(to right, transparent, #000 5%, #000 95%, transparent), linear-gradient(to bottom, transparent, #000 6%, #000 94%, transparent)",
  WebkitMaskImage:
    "linear-gradient(to right, transparent, #000 5%, #000 95%, transparent), linear-gradient(to bottom, transparent, #000 6%, #000 94%, transparent)",
  maskComposite: "intersect",
  WebkitMaskComposite: "source-in",
} as const;

const pad = (n: number) => String(n).padStart(2, "0");
const N = STOPS.length;

type Driver = {
  focus: (index: number | null, layout: "desktop" | "mobile") => void;
  setRunning: (on: boolean) => void;
  resize: (width: number, height: number, dpr: number) => void;
  dispose: () => void;
};

// Pixels drawn per CSS pixel. Desktop canvases are large, so they stop at 1.5 (with MSAA on
// top); phone canvases are small, so they can afford a little more.
const pixelRatio = (lowPower: boolean) => Math.min(window.devicePixelRatio || 1, lowPower ? 1.75 : 1.5);

const canUseWorker = () =>
  typeof Worker !== "undefined" && typeof OffscreenCanvas !== "undefined" && "transferControlToOffscreen" in HTMLCanvasElement.prototype;

export function StudioTour() {
  const [active, setActive] = useState<number | null>(null);
  const [hover, setHover] = useState<number | null>(null);
  const [touring, setTouring] = useState(false);
  const [live, setLive] = useState(false);
  const [desktop, setDesktop] = useState(false);

  const root = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const host = useRef<HTMLDivElement>(null);
  const dots = useRef<(HTMLButtonElement | null)[]>([]);
  const pop = useRef<HTMLDivElement | null>(null);
  const popH = useRef(0);
  const stageSize = useRef<{ w: number; h: number } | null>(null);
  const cards = useRef<(HTMLLIElement | null)[]>([]);
  const studio = useRef<Driver | null>(null);
  const points = useRef<StudioPoint[] | null>(null);
  const shownRef = useRef<number | null>(null);

  const shown = desktop ? (hover ?? active) : null;
  const pinned = shown !== null && shown === active;

  // Put the pop-up next to its number, on whichever side has room. Sizes come from resize
  // observers and positions go out as transforms, so following the camera never forces layout.
  const placePopup = useCallback(() => {
    const el = pop.current;
    const box = stage.current;
    const i = shownRef.current;
    if (!el || !box || i === null) return;
    const size = stageSize.current ?? { w: box.clientWidth, h: box.clientHeight };
    const q = points.current?.[i];
    const x = q ? q.x : STOPS[i].x * size.w;
    const y = q ? q.y : STOPS[i].y * size.h;
    const h = popH.current;
    const onLeft = x > size.w * 0.6;
    const top = Math.min(Math.max(y, h / 2 + 8), size.h - h / 2 - 8);
    el.style.transform = `translate3d(${x}px, ${top}px, 0) ${onLeft ? "translate(calc(-100% - 30px), -50%)" : "translate(30px, -50%)"}`;
  }, []);
  const popRef = useCallback(
    (el: HTMLDivElement | null) => {
      pop.current = el;
      if (!el) return;
      const ro = new ResizeObserver(([e]) => {
        popH.current = e.contentRect.height;
        placePopup();
      });
      ro.observe(el);
      return () => ro.disconnect();
    },
    [placePopup],
  );

  // Numbers follow the camera. The scene reports only when they move; direct style writes, no re-render.
  const placeDots = useCallback(() => {
    const p = points.current;
    if (!p) return;
    p.forEach((q, i) => {
      const el = dots.current[i];
      if (!el) return;
      el.style.left = "0px";
      el.style.top = "0px";
      el.style.transform = `translate3d(${q.x}px, ${q.y}px, 0)`;
      el.style.opacity = q.on ? "" : "0";
      el.style.pointerEvents = q.on ? "" : "none";
    });
    placePopup();
  }, [placePopup]);

  useLayoutEffect(() => {
    shownRef.current = shown;
    placePopup();
  }, [shown, placePopup]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => setDesktop(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Load the scene ahead of time, build it when the section gets close, run it only while on screen.
  useEffect(() => {
    const el = stage.current;
    const box = host.current;
    if (!el || !box) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lowPower = window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768;
    // A fresh canvas per mount: a canvas handed to a worker can never be handed over again.
    const canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    canvas.style.cssText = "display:block;width:100%;height:100%";
    box.appendChild(canvas);

    let gone = false;
    let visible = false;
    let near = false;
    let mode: "unknown" | "worker" | "main" = "unknown";
    let worker: Worker | null = null;
    let mainScene: Promise<typeof import("@/components/studio/studio-scene")> | null = null;
    let driver: Driver | null = null;

    const measure = () => {
      const r = el.getBoundingClientRect();
      return { w: Math.max(1, Math.round(r.width)), h: Math.max(1, Math.round(r.height)) };
    };
    const onPoints = (p: StudioPoint[]) => {
      points.current = p;
      placeDots();
    };
    const run = () => driver?.setRunning(visible && !document.hidden);

    const start = async () => {
      if (gone || driver || !near || mode === "unknown") return;
      const { w, h } = stageSize.current ?? measure();
      const dpr = pixelRatio(lowPower);
      if (mode === "worker" && worker) {
        const wk = worker;
        const off = canvas.transferControlToOffscreen();
        wk.postMessage({ type: "init", canvas: off, width: w, height: h, dpr, reduceMotion, lowPower }, [off]);
        driver = {
          focus: (index, layout) => wk.postMessage({ type: "focus", index, layout }),
          setRunning: (on) => wk.postMessage({ type: "run", on }),
          resize: (width, height, ratio) => wk.postMessage({ type: "resize", width, height, dpr: ratio }),
          dispose: () => wk.terminate(),
        };
      } else if (mode === "main" && mainScene) {
        try {
          const mod = await mainScene;
          if (gone || driver) return;
          driver = mod.createStudio(canvas, { width: w, height: h, dpr, reduceMotion, lowPower, onReady: () => setLive(true), onPoints });
        } catch {
          return; // no WebGL or the scene failed: the still image and its numbers stay
        }
      }
      studio.current = driver;
      run();
    };
    const runOnMainThread = () => {
      worker?.terminate();
      worker = null;
      mode = "main";
      mainScene ??= import("@/components/studio/studio-scene");
      mainScene.catch(() => {});
      void start();
    };
    // Fetch and evaluate the scene code. In a worker that costs the page nothing.
    const prepare = () => {
      if (gone || mode !== "unknown" || worker) return;
      if (!canUseWorker()) return runOnMainThread();
      try {
        worker = new Worker(new URL("./studio/studio.worker.ts", import.meta.url), { type: "module" });
      } catch {
        return runOnMainThread();
      }
      worker.onmessage = (e: MessageEvent<StudioWorkerOut>) => {
        const m = e.data;
        if (m.type === "caps") {
          if (!m.webgl) return runOnMainThread();
          mode = "worker";
          void start();
        } else if (m.type === "ready") setLive(true);
        else if (m.type === "points") onPoints(m.points);
      };
      worker.onerror = () => {
        // before the canvas is handed over, fall back to the main thread; after, the still stays
        if (!driver) runOnMainThread();
      };
    };

    const idle = window.requestIdleCallback ? window.requestIdleCallback(prepare, { timeout: 4000 }) : window.setTimeout(prepare, 2500);
    const nearby = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        nearby.disconnect();
        near = true;
        prepare();
        void start();
      },
      { rootMargin: "1200px 0px" },
    );
    const seen = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      run();
    });
    nearby.observe(el);
    seen.observe(el);
    document.addEventListener("visibilitychange", run);
    const ro = new ResizeObserver(([e]) => {
      const w = Math.max(1, Math.round(e.contentRect.width));
      const h = Math.max(1, Math.round(e.contentRect.height));
      stageSize.current = { w, h };
      driver?.resize(w, h, pixelRatio(lowPower));
    });
    ro.observe(el);
    return () => {
      gone = true;
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle);
      window.clearTimeout(idle);
      nearby.disconnect();
      seen.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", run);
      driver?.dispose();
      worker?.terminate();
      canvas.remove();
      studio.current = null;
    };
  }, [placeDots]);

  // The camera follows the selected station.
  useEffect(() => {
    studio.current?.focus(active, desktop ? "desktop" : "mobile");
  }, [active, desktop, live]);

  // Tour: glide from station to station.
  useEffect(() => {
    if (!touring) return;
    const id = setInterval(() => setActive((a) => ((a ?? -1) + 1) % N), 4500);
    return () => clearInterval(id);
  }, [touring]);

  // Mobile: keep the matching card in view.
  useEffect(() => {
    if (active === null || desktop) return;
    cards.current[active]?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [active, desktop]);

  const open = (i: number) => {
    setTouring(false);
    setHover(null);
    setActive(i);
  };
  const close = useCallback(() => {
    setTouring(false);
    setActive(null);
  }, []);
  const step = useCallback((dir: 1 | -1) => {
    setTouring(false);
    setHover(null);
    setActive((a) => ((a ?? 0) + dir + N) % N);
  }, []);

  // Escape zooms out, arrows move between stations, a click elsewhere on the page zooms out.
  const isOpen = active !== null;
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    const onDown = (e: PointerEvent) => {
      if (root.current && !root.current.contains(e.target as Node)) close();
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [isOpen, close, step]);

  const stop = shown === null ? null : STOPS[shown];

  return (
    <div ref={root}>
      <div
        ref={stage}
        onPointerDown={(e) => {
          if (e.target === e.currentTarget || e.target instanceof HTMLCanvasElement) close();
        }}
        data-studio={live ? "live" : "still"}
        className={`relative -mx-6 aspect-video select-none sm:mx-0 ${isOpen ? "cursor-zoom-out" : ""}`}
      >
        <div className="pointer-events-none absolute inset-0" style={EDGE_FADE}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/studio/studio-poster.webp"
            alt="An isometric view of the NovaEyes studio: clippers around a conveyor of clips, a review gate, live analytics and stacks of coins."
            className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-700 ${live ? "opacity-0" : "opacity-100"}`}
            loading="lazy"
            decoding="async"
          />
        </div>
        <div
          ref={host}
          className={`absolute inset-0 transition-opacity duration-700 ${live ? "opacity-100" : "opacity-0"}`}
          style={EDGE_FADE}
        />

        {STOPS.map((s, i) => (
          <button
            key={s.key}
            ref={(el) => {
              dots.current[i] = el;
            }}
            type="button"
            onClick={() => (active === i ? close() : open(i))}
            onPointerEnter={(e) => {
              if (e.pointerType === "mouse" && desktop) setHover(i);
            }}
            onPointerLeave={(e) => {
              if (e.pointerType === "mouse") setHover((h) => (h === i ? null : h));
            }}
            onFocus={() => desktop && setHover(i)}
            onBlur={() => setHover((h) => (h === i ? null : h))}
            aria-label={`${i + 1}. ${s.title}`}
            aria-expanded={active === i}
            className="group absolute z-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer p-2 outline-none transition-opacity duration-300"
            style={{ left: `${s.x * 100}%`, top: `${s.y * 100}%` }}
          >
            <span
              className={`relative flex h-5 w-5 items-center justify-center rounded-full border font-display text-[9px] font-semibold transition-all duration-300 group-focus-visible:ring-2 group-focus-visible:ring-accent/70 sm:h-7 sm:w-7 sm:text-[11px] ${
                active === i
                  ? "scale-110 border-accent bg-accent text-white shadow-[0_0_24px_rgb(59_130_246/0.8)]"
                  : hover === i
                    ? "scale-110 border-accent bg-bg/90 text-white"
                    : "border-white/70 bg-bg/85 text-white"
              }`}
            >
              {active !== i && <span className="absolute inset-0 animate-ping rounded-full border border-accent/60 motion-reduce:hidden" />}
              {i + 1}
            </span>
          </button>
        ))}

        {/* desktop: hover shows a quick look, a click pins it while zoomed in */}
        {desktop && (
          <div ref={popRef} className="pointer-events-none absolute top-0 left-0 z-20 w-80">
            <AnimatePresence mode="wait">
              {stop && shown !== null && (
                <motion.div
                  key={`${stop.key}-${pinned}`}
                  role={pinned ? "dialog" : "tooltip"}
                  aria-label={stop.title}
                  initial={{ opacity: 0, scale: 0.96, filter: "blur(6px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scale: 0.98, filter: "blur(4px)" }}
                  transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                  className={pinned ? "pointer-events-auto" : ""}
                >
                  <div className="rounded-2xl border border-white/10 bg-bg-raised/90 p-5 shadow-[0_24px_64px_rgb(0_0_0/0.55),0_0_0_1px_rgb(59_130_246/0.12)] backdrop-blur-xl">
                    <div className="flex items-center justify-between">
                      <span className="font-label text-[10px] tracking-[0.14em] text-accent">
                        {pad(shown + 1)} / {pad(N)}
                      </span>
                      {pinned && (
                        <button
                          type="button"
                          onClick={close}
                          aria-label="Zoom out"
                          className="-m-1.5 cursor-pointer rounded-full p-1.5 text-muted transition-colors hover:text-fg"
                        >
                          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                            <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" />
                          </svg>
                        </button>
                      )}
                    </div>
                    <h3 className="mt-3 text-lg">{stop.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{stop.body}</p>
                    {pinned ? (
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
                    ) : (
                      <p className="mt-4 font-display text-xs font-medium text-accent">Click to zoom in</p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* mobile: back, next and zoom out while zoomed in */}
        <AnimatePresence>
          {!desktop && active !== null && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-x-3 bottom-3 z-20 flex items-center justify-between"
            >
              <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-bg-raised/85 p-1 backdrop-blur-md">
                <button type="button" onClick={() => step(-1)} aria-label="Previous station" className="flex h-8 w-8 items-center justify-center rounded-xl text-fg">
                  ←
                </button>
                <span className="px-1 font-label text-[10px] tracking-[0.14em] text-muted">
                  {pad(active + 1)} / {pad(N)}
                </span>
                <button type="button" onClick={() => step(1)} aria-label="Next station" className="flex h-8 w-8 items-center justify-center rounded-xl text-fg">
                  →
                </button>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="Zoom out"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-bg-raised/85 text-fg backdrop-blur-md"
              >
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                  <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" />
                </svg>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-5 flex items-center justify-between gap-4 lg:justify-center lg:gap-6">
        <p className="text-sm text-muted">
          <span className="lg:hidden">Tap a number to zoom in on that station.</span>
          <span className="hidden lg:inline">Hover a number for a quick look. Click to zoom in.</span>
        </p>
        <button
          type="button"
          onClick={() => {
            if (touring) return setTouring(false);
            setHover(null);
            setTouring(true);
            setActive((a) => a ?? 0);
          }}
          className="shrink-0 cursor-pointer rounded-xl border border-line px-4 py-2 font-display text-sm font-semibold hover:border-muted/50"
        >
          {touring ? "Pause tour" : "Take the tour"}
        </button>
      </div>

      {/* Mobile and tablet: swipeable cards. On desktop the pop-ups replace them. */}
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
              onClick={() => (active === i ? close() : open(i))}
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
