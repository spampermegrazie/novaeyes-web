"use client";

// How a campaign works, told as one loop through one engine.
// Desktop: the title, the current step and the diagram pin together as one unit.
// Scrolling moves through the three steps; the left side shows only the current
// step and the diagram lights only that step's part. 1 Set up: what you send flows
// into NovaEyes. 2 Distribute: NovaEyes routes it through the clippers onto the
// platforms. 3 Feedback loop: verified views come back and budget moves to the
// winning clips, then it loops.
// Mobile: a rail joins the steps, each with its own crop of the same diagram.
// All step copy is in the server HTML; only the diagram animates.

import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { motion, useInView, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "motion/react";
import { siInstagram, siTiktok, siX, siYoutubeshorts } from "simple-icons";
import { facts } from "@/content/facts";
import { MARK_PATH, MARK_VIEWBOX } from "@/components/brand";

export type EngineStep = { title: string; body: string };
type Stage = 0 | 1 | 2;

// Platform icons from Simple Icons, all drawn in one colour.
const PLATFORMS = [
  { name: "TikTok", path: siTiktok.path },
  { name: "Instagram Reels", path: siInstagram.path },
  { name: "YouTube Shorts", path: siYoutubeshorts.path },
  { name: "X", path: siX.path },
];
// Average width of one caption character in the label font at its set size.
const CAP_CH = 8.1;
// Clippers whose clips win in step 3, so budget visibly moves to them.
const WINNERS = [0, 3];

export function EngineSteps({ steps, intro }: { steps: [EngineStep, EngineStep, EngineStep]; intro: ReactNode }) {
  const reduced = useReducedMotion() ?? false;
  const desktop = useMediaQuery("(min-width: 1024px)");
  const trackRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  // Desktop: the section pins and the scroll through the track drives the steps.
  // Mobile: the steps scroll normally and the one at the middle of the screen is active.
  const { scrollYProgress: trackP } = useScroll({ target: trackRef, offset: ["start 64px", "end end"] });
  const { scrollYProgress: listP } = useScroll({ target: listRef, offset: ["start center", "end center"] });
  const [active, setActive] = useState(0);
  const pick = (v: number) => setActive(Math.min(2, Math.max(0, Math.floor(v * 3))));
  useMotionValueEvent(trackP, "change", (v) => desktop && pick(v));
  useMotionValueEvent(listP, "change", (v) => !desktop && pick(v));
  // Mobile rail: the line between two steps fills while the first of them is active.
  const fill0 = useTransform(() => (reduced ? 1 : clamp01(listP.get() * 3)));
  const fill1 = useTransform(() => (reduced ? 1 : clamp01(listP.get() * 3 - 1)));
  const fills = [fill0, fill1];

  return (
    <div ref={trackRef} className="lg:h-[260vh]">
      <div className="lg:sticky lg:top-16 lg:flex lg:h-[calc(100vh-4rem)] lg:flex-col lg:justify-center">
        <div className="mb-14">{intro}</div>

        <div className="lg:grid lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:items-center lg:gap-16">
          <div>
            <ol ref={listRef} className="lg:grid">
              {steps.map((s, i) => {
                const reached = i <= active;
                const shown = i === active;
                return (
                  <li
                    key={s.title}
                    className={`relative pb-20 pl-14 last:pb-2 lg:col-start-1 lg:row-start-1 lg:p-0 lg:transition-[opacity,translate] lg:duration-500 motion-reduce:transition-none ${
                      shown ? "lg:translate-y-0 lg:opacity-100" : "lg:pointer-events-none lg:translate-y-3 lg:opacity-0"
                    }`}
                  >
                    {i < 2 && (
                      <span aria-hidden className="absolute top-4 -bottom-4 left-[15.5px] w-px bg-line lg:hidden">
                        <motion.span className="absolute inset-0 origin-top bg-accent" style={{ scaleY: fills[i] }} />
                      </span>
                    )}
                    <span
                      aria-hidden
                      className={`absolute top-0 left-0 z-10 flex h-8 w-8 items-center justify-center rounded-full border font-label text-[11px] transition-all duration-500 lg:hidden ${
                        reached || reduced
                          ? "border-accent bg-accent text-accent-ink shadow-[0_0_24px_rgb(var(--glow)/0.5)]"
                          : "border-line bg-bg text-muted"
                      }`}
                    >
                      {i + 1}
                    </span>
                    <p className="pt-2 font-label text-[10px] tracking-[0.14em] text-accent uppercase lg:hidden">Step {i + 1}</p>
                    <p aria-hidden className="hidden items-baseline gap-3 font-label lg:flex">
                      <span className="text-5xl text-accent">0{i + 1}</span>
                      <span className="text-sm text-muted">/ 03</span>
                    </p>
                    <h3 className="mt-2 text-2xl tracking-tight lg:mt-6 lg:text-4xl">{s.title}</h3>
                    <p className="mt-3 max-w-md leading-relaxed text-muted lg:mt-4">{s.body}</p>
                    <div className="mt-10 max-w-md lg:hidden">
                      <Pipeline orient="v" stage={i as Stage} crop={V_CROPS[i]} reduced={reduced} />
                    </div>
                  </li>
                );
              })}
            </ol>
            <div aria-hidden className="mt-10 hidden h-px max-w-xs bg-line lg:block">
              <motion.div className="h-px origin-left bg-accent" style={{ scaleX: trackP }} />
            </div>
          </div>

          <div className="hidden lg:block">
            <Pipeline orient="h" stage={active as Stage} reduced={reduced} numbered stepNames={steps.map((s) => s.title)} />
          </div>
        </div>
      </div>
    </div>
  );
}

function clamp01(v: number) {
  return Math.min(1, Math.max(0, v));
}

function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (cb) => {
      const m = window.matchMedia(query);
      m.addEventListener("change", cb);
      return () => m.removeEventListener("change", cb);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/* -------------------------------------------------------- the pipeline */

type Layout = {
  w: number;
  h: number;
  inputs: { m: number; c: number[]; w: number; h: number };
  hub: { m: number; c: number; w: number; h: number };
  clippers: { m: number; c: number[]; r: number };
  platforms: { m: number; c: number[]; s: number };
  // The loop: verified views travel from the platforms back into the hub.
  back: { d: string; label: { x: number; y: number } };
};

const H_LAYOUT: Layout = {
  w: 600,
  h: 320,
  inputs: { m: 82, c: [74, 134, 194], w: 144, h: 40 },
  hub: { m: 300, c: 134, w: 116, h: 64 },
  clippers: { m: 440, c: [54, 94, 134, 174, 214], r: 11 },
  platforms: { m: 556, c: [68, 112, 156, 200], s: 34 },
  back: {
    d: "M556,217 C556,266 530,284 486,284 L360,284 C320,284 300,260 300,166",
    label: { x: 430, y: 308 },
  },
};

const V_LAYOUT: Layout = {
  w: 380,
  h: 548,
  inputs: { m: 52, c: [60, 180, 300], w: 108, h: 40 },
  hub: { m: 200, c: 180, w: 116, h: 60 },
  clippers: { m: 336, c: [60, 120, 180, 240, 300], r: 11 },
  platforms: { m: 466, c: [75, 145, 215, 285], s: 40 },
  back: {
    d: "M285,486 C285,514 352,516 352,484 L352,228 C352,210 336,200 238,200",
    label: { x: 250, y: 536 },
  },
};

// Each step on mobile shows only its part of the vertical diagram.
const V_CROPS = ["0 0 380 248", "0 160 380 344", "0 160 380 388"];

const INPUTS = [
  { label: "Your video", icon: "play" },
  { label: "Brand rules", icon: "shield" },
  { label: "View pool", icon: "coin" },
] as const;

function Pipeline({
  orient,
  stage,
  crop,
  reduced,
  numbered = false,
  stepNames = ["Set up", "Distribute", "Feedback loop"],
}: {
  orient: "h" | "v";
  stage: Stage;
  crop?: string;
  reduced: boolean;
  numbered?: boolean;
  stepNames?: string[];
}) {
  const L = orient === "h" ? H_LAYOUT : V_LAYOUT;
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { amount: 0.25 });
  const [tick, setTick] = useState(0);
  const live = inView && !reduced;

  useEffect(() => {
    if (!live) return;
    const t = setInterval(() => setTick((n) => n + 1), 1500);
    return () => clearInterval(t);
  }, [live]);

  const litIn = stage === 0;
  const litOut = stage === 1;
  const litBack = stage === 2;
  const platformOn = live && litOut ? tick % PLATFORMS.length : -1;

  const at = (m: number, c: number) => (orient === "h" ? { x: m, y: c } : { x: c, y: m });
  const half = (w: number, h: number) => (orient === "h" ? w / 2 : h / 2);
  const link = (am: number, ac: number, ah: number, bm: number, bc: number, bh: number) => {
    const s = am + ah;
    const e = bm - bh;
    const mid = (s + e) / 2;
    return orient === "h"
      ? `M${s},${ac} C${mid},${ac} ${mid},${bc} ${e},${bc}`
      : `M${ac},${s} C${ac},${mid} ${bc},${mid} ${bc},${e}`;
  };

  const hubHalf = half(L.hub.w, L.hub.h);
  const ps = L.platforms.s;
  const inLinks = L.inputs.c.map((c) => link(L.inputs.m, c, half(L.inputs.w, L.inputs.h), L.hub.m, L.hub.c, hubHalf));
  const outLinks = L.clippers.c.map((c, i) => ({
    d: link(L.hub.m, L.hub.c, hubHalf, L.clippers.m, c, L.clippers.r),
    win: WINNERS.includes(i),
  }));
  const postLinks = L.clippers.c.flatMap((c, i) =>
    [i % 4, (i + 1) % 4].map((p, k) => ({
      d: link(L.clippers.m, c, L.clippers.r, L.platforms.m, L.platforms.c[p], ps / 2),
      p,
      main: k === 0,
      win: WINNERS.includes(i) && k === 0,
    })),
  );

  const hub = at(L.hub.m, L.hub.c);

  const packets: { d: string; dur: number; begin: number; back?: boolean }[] = [];
  if (live) {
    if (litIn) inLinks.forEach((d, i) => packets.push({ d, dur: 2.2 + (i % 2) * 0.5, begin: i * 0.4 }));
    if (litOut) {
      outLinks.forEach((l, i) => packets.push({ d: l.d, dur: 1.9 + (i % 3) * 0.35, begin: 0.5 + i * 0.3 }));
      postLinks.filter((l) => l.main).forEach((l, i) => packets.push({ d: l.d, dur: 1.6 + (i % 2) * 0.4, begin: 1 + i * 0.3 }));
    }
    if (litBack) {
      outLinks.filter((l) => l.win).forEach((l, i) => packets.push({ d: l.d, dur: 1.4, begin: i * 0.5 }));
      postLinks.filter((l) => l.win).forEach((l, i) => packets.push({ d: l.d, dur: 1.2, begin: 0.6 + i * 0.5 }));
      [0, 1, 2].forEach((i) => packets.push({ d: L.back.d, dur: 3, begin: i, back: true }));
    }
  }

  // Dim what the current step isn't about, so the eye follows the step.
  const inOpacity = litIn ? 1 : 0.35;
  const outOpacity = litOut || litBack ? 1 : 0.35;

  // Glow: a soft radial behind the hub, drawn in CSS so it fades out on its own
  // instead of stopping at the edge of the drawing.
  const [vx, vy, vw, vh] = (crop ?? `0 0 ${L.w} ${L.h}`).split(" ").map(Number);
  const glowX = ((hub.x - vx) / vw) * 100;
  const glowY = ((hub.y - vy) / vh) * 100;

  const caption = (m: number, text: string, n?: number, y = 18) => {
    if (orient === "h") {
      const w = text.length * CAP_CH;
      const on = n !== undefined && stage === n - 1;
      const withBadge = numbered && n !== undefined;
      return (
        <g className="pointer-events-none">
          {withBadge && <Badge x={m + 11 - w / 2 - 14} y={y - 3} n={n} on={on} />}
          <text x={withBadge ? m + 11 : m} y={y} textAnchor="middle" className="ne-caption" style={on ? { fill: "var(--fg)" } : undefined}>
            {text}
          </text>
        </g>
      );
    }
    const w = text.length * CAP_CH + 18;
    const py = m - 34;
    return (
      <g className="pointer-events-none">
        <rect x={L.hub.c - w / 2} y={py - 10} width={w} height="17" rx="8.5" fill="var(--bg)" stroke="var(--line-strong)" />
        <text x={L.hub.c} y={py + 2} textAnchor="middle" className="ne-caption">
          {text}
        </text>
      </g>
    );
  };

  const markW = L.hub.w * 0.56;
  const markH = (markW * 660) / 1940;

  return (
    <div className="relative isolate">
      <div
        aria-hidden
        className="pointer-events-none absolute -z-10 aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(59_130_246/0.2),rgb(59_130_246/0.07)_45%,transparent)]"
        style={{ left: `${glowX}%`, top: `${glowY}%`, width: orient === "h" ? "70%" : "120%" }}
      />
      <svg
        ref={ref}
        viewBox={crop ?? `0 0 ${L.w} ${L.h}`}
        className={`h-auto w-full ${crop ? "overflow-hidden" : "overflow-visible"}`}
        role="img"
        aria-label={`Your video, brand rules and view pool go into NovaEyes. NovaEyes briefs ${facts.clippersLabel} clippers, who post clips on TikTok, Instagram Reels, YouTube Shorts and X. Verified views come back to NovaEyes, and budget moves to the clips that win.`}
      >
        {/* step 3: the loop back */}
        <g style={{ opacity: litBack ? 1 : 0.22, transition: "opacity .5s" }}>
          <path d={L.back.d} className={`ne-flow ne-dash${litBack ? " ne-flow-back" : ""}`} />
          {orient === "h" ? (
            caption(L.back.label.x, stepNames[2], 3, L.back.label.y)
          ) : (
            <text x={L.back.label.x} y={L.back.label.y} textAnchor="middle" className="ne-caption">
              {stepNames[2]}
            </text>
          )}
        </g>

        {/* step 1: what you send */}
        <g style={{ opacity: inOpacity, transition: "opacity .5s" }}>
          {inLinks.map((d, i) => (
            <path key={d} d={d} className={`ne-flow${litIn ? " ne-flow-on" : ""}${i === 1 ? " ne-dash" : ""}`} />
          ))}
          {L.inputs.c.map((c, i) => {
            const p = at(L.inputs.m, c);
            const { w, h } = L.inputs;
            return (
              <g key={i} transform={`translate(${p.x - w / 2},${p.y - h / 2})`}>
                <rect width={w} height={h} rx="9" className={`ne-node${litIn ? " ne-node-on" : ""}`} />
                <g transform={`translate(${orient === "h" ? 14 : 10},${h / 2 - 7})`}>
                  <InputIcon kind={INPUTS[i].icon} />
                </g>
                <text x={orient === "h" ? 38 : 30} y={h / 2 + 4} className="ne-label">
                  {INPUTS[i].label}
                </text>
              </g>
            );
          })}
          {orient === "h" ? caption(L.inputs.m, stepNames[0], 1) : caption(L.inputs.m, "You send")}
        </g>

        {/* step 2: through the clippers onto the platforms */}
        <g style={{ opacity: outOpacity, transition: "opacity .5s" }}>
          {outLinks.map((l, i) => (
            <path
              key={l.d}
              d={l.d}
              className={`ne-flow${litOut ? " ne-flow-on" : ""}${litBack && l.win ? " ne-flow-win" : ""}${i % 2 && !litBack ? " ne-dash" : ""}`}
              opacity={litBack && !l.win ? 0.3 : 1}
            />
          ))}
          {postLinks.map((l) => (
            <path
              key={l.d}
              d={l.d}
              className={`ne-flow${litOut && l.p === platformOn && l.main ? " ne-flow-on" : ""}${litBack && l.win ? " ne-flow-win" : ""}`}
              opacity={litBack ? (l.win ? 1 : 0.25) : l.main ? 1 : 0.5}
            />
          ))}
          {L.clippers.c.map((c, i) => {
            const p = at(L.clippers.m, c);
            const on = litOut || (litBack && WINNERS.includes(i));
            return (
              <g key={i} opacity={litBack && !WINNERS.includes(i) ? 0.45 : 1} style={{ transition: "opacity .5s" }}>
                <circle cx={p.x} cy={p.y} r={L.clippers.r} className={`ne-node${on ? " ne-node-on" : ""}`} />
                <circle cx={p.x} cy={p.y - 2.5} r="3" fill="var(--muted)" />
                <path d={`M${p.x - 5.5},${p.y + 6.5} a5.5,4.5 0 0 1 11,0`} fill="var(--muted)" />
                <circle
                  cx={p.x + 8}
                  cy={p.y - 8}
                  r="2.6"
                  fill="#22c55e"
                  stroke="var(--bg)"
                  className={reduced ? undefined : "ne-live"}
                  style={{ animationDelay: `${i * 0.37}s` }}
                />
              </g>
            );
          })}
          {L.platforms.c.map((c, i) => {
            const p = at(L.platforms.m, c);
            const on = i === platformOn;
            const icon = ps * 0.5;
            return (
              <g key={PLATFORMS[i].name} transform={`translate(${p.x - ps / 2},${p.y - ps / 2})`}>
                <title>{PLATFORMS[i].name}</title>
                <rect width={ps} height={ps} rx={ps * 0.28} className={`ne-node${on ? " ne-node-on" : ""}`} />
                <g transform={`translate(${(ps - icon) / 2},${(ps - icon) / 2}) scale(${icon / 24})`}>
                  <path d={PLATFORMS[i].path} fill="var(--fg)" />
                </g>
              </g>
            );
          })}
          {orient === "h" ? (
            <>
              {caption((L.clippers.m + L.platforms.m) / 2, stepNames[1], 2)}
              <text x={L.clippers.m} y={L.clippers.c[L.clippers.c.length - 1] + 34} textAnchor="middle" className="ne-caption">
                {facts.clippersLabel} clippers
              </text>
            </>
          ) : (
            <>
              {caption(L.clippers.m, `${facts.clippersLabel} clippers`)}
              {caption(L.platforms.m, "They post on")}
            </>
          )}
        </g>

        {/* packets: blue is your content going out, white is verified views coming back */}
        {packets.map((p, i) => (
          <circle key={`${stage}-${i}`} r={p.back ? 2.4 : 2.6} className={p.back ? "ne-pkt-back" : "ne-pkt"}>
            <animateMotion dur={`${p.dur}s`} begin={`${p.begin}s`} repeatCount="indefinite" path={p.d} />
          </circle>
        ))}

        {/* the hub, NovaEyes, sits on top of everything */}
        <g transform={`translate(${hub.x - L.hub.w / 2},${hub.y - L.hub.h / 2})`}>
          <title>NovaEyes</title>
          <rect
            x="-5"
            y="-5"
            width={L.hub.w + 10}
            height={L.hub.h + 10}
            rx="19"
            fill="none"
            stroke="rgb(59 130 246 / .45)"
            className={reduced ? undefined : "ne-ring"}
          />
          <rect width={L.hub.w} height={L.hub.h} rx="14" className="ne-node ne-hub" />
          <svg x={(L.hub.w - markW) / 2} y={(L.hub.h - markH) / 2} width={markW} height={markH} viewBox={MARK_VIEWBOX}>
            <path fillRule="evenodd" d={MARK_PATH} fill="var(--fg)" />
          </svg>
        </g>
      </svg>
    </div>
  );
}

function Badge({ x, y, n, on }: { x: number; y: number; n: number; on: boolean }) {
  return (
    <g>
      <circle cx={x} cy={y} r="8.5" fill={on ? "var(--accent)" : "var(--bg)"} stroke={on ? "var(--accent)" : "var(--line-strong)"} />
      <text x={x} y={y + 3.2} textAnchor="middle" className="ne-status" style={{ fill: on ? "#fff" : "var(--muted)", fontSize: 9 }}>
        {n}
      </text>
    </g>
  );
}

function InputIcon({ kind }: { kind: "play" | "shield" | "coin" }) {
  const common = { fill: "none", stroke: "var(--fg)", strokeWidth: 1.4, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (kind === "play")
    return (
      <g>
        <rect x="0" y="0" width="16" height="14" rx="3" {...common} />
        <path d="M6.5 4.2v5.6L11 7z" fill="var(--accent)" />
      </g>
    );
  if (kind === "shield")
    return (
      <g>
        <path d="M8 0.5 14.5 3v4.5c0 3.4-2.6 5.6-6.5 6.8C4.1 13.1 1.5 10.9 1.5 7.5V3z" {...common} />
        <path d="M5 7.4 7.2 9.5 11 5.4" {...common} stroke="var(--accent)" />
      </g>
    );
  return (
    <g>
      <circle cx="8" cy="7" r="6.8" {...common} />
      <path
        d="M10 4.6c-.6-.6-1.3-.9-2.1-.9-1.2 0-2 .6-2 1.5 0 2.1 4.3 1.1 4.3 3.4 0 .9-.9 1.6-2.2 1.6-.9 0-1.8-.4-2.4-1M8 2.6v1.1M8 10.2v1.2"
        {...common}
        stroke="var(--accent)"
        strokeWidth={1.2}
      />
    </g>
  );
}
