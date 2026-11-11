"use client";

// How a campaign works, drawn as the engine it is: what you send flows into the
// NovaEyes hub, out through the clippers and onto the four platforms. Below it,
// how budget moves to what wins, and the rule that only verified views get paid.
// Adapted from the ink-orbit features bento, rebuilt on the site's own tokens.
// All copy is rendered on the server; only the diagrams animate.

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { facts } from "@/content/facts";

export type EngineStep = { title: string; body: string };

type Props = {
  steps: [EngineStep, EngineStep, EngineStep];
  rule: EngineStep;
};

const PLATFORMS = ["TikTok", "Reels", "Shorts", "X"];

export function EngineSteps({ steps, rule }: Props) {
  const reduced = useReducedMotion() ?? false;
  const [side, setSide] = useState<"" | "in" | "out">("");

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Frame className="md:col-span-2">
        <div className="pt-2">
          <div className="hidden md:block">
            <Pipeline orient="h" side={side} setSide={setSide} reduced={reduced} />
          </div>
          <div className="md:hidden">
            <Pipeline orient="v" side={side} setSide={setSide} reduced={reduced} />
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          <StepCopy n="01" step={steps[0]} onHover={(on) => setSide(on ? "in" : "")} />
          <StepCopy n="02" step={steps[1]} onHover={(on) => setSide(on ? "out" : "")} />
        </div>
      </Frame>

      <Frame>
        <BudgetChart reduced={reduced} />
        <StepCopy n="03" step={steps[2]} />
      </Frame>

      <Frame>
        <ReviewGate reduced={reduced} />
        <StepCopy n="Every clip" step={rule} />
      </Frame>
    </div>
  );
}

/* ------------------------------------------------------------- framing */

function Frame({ children, className = "" }: { children: ReactNode; className?: string }) {
  const corner =
    "pointer-events-none absolute h-3 w-3 border-[#2e2f3b] transition duration-300 group-hover:border-accent";
  return (
    <div className={`group relative ${className}`}>
      <span aria-hidden className={`${corner} -top-1.5 -left-1.5 border-t-[1.5px] border-l-[1.5px] group-hover:-translate-x-[3px] group-hover:-translate-y-[3px]`} />
      <span aria-hidden className={`${corner} -top-1.5 -right-1.5 border-t-[1.5px] border-r-[1.5px] group-hover:translate-x-[3px] group-hover:-translate-y-[3px]`} />
      <span aria-hidden className={`${corner} -bottom-1.5 -left-1.5 border-b-[1.5px] border-l-[1.5px] group-hover:-translate-x-[3px] group-hover:translate-y-[3px]`} />
      <span aria-hidden className={`${corner} -right-1.5 -bottom-1.5 border-r-[1.5px] border-b-[1.5px] group-hover:translate-x-[3px] group-hover:translate-y-[3px]`} />
      <div className="flex h-full flex-col gap-6 rounded-md border border-line bg-gradient-to-b from-bg-raised to-bg p-5 transition-[border-color,box-shadow] duration-300 group-hover:border-[#2a2b36] group-hover:shadow-[0_20px_60px_-30px_rgb(var(--glow)/0.35)] sm:p-6">
        {children}
      </div>
    </div>
  );
}

function StepCopy({ n, step, onHover }: { n: string; step: EngineStep; onHover?: (on: boolean) => void }) {
  return (
    <div onMouseEnter={() => onHover?.(true)} onMouseLeave={() => onHover?.(false)}>
      <p className="font-mono text-xs tracking-widest text-accent uppercase">{n}</p>
      <h3 className="mt-2 text-lg font-medium">{step.title}</h3>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">{step.body}</p>
    </div>
  );
}

function Eye({ x, y, size }: { x: number; y: number; size: number }) {
  const s = size / 24;
  return (
    <g transform={`translate(${x - size / 2},${y - size / 2}) scale(${s})`}>
      <path d="M1.5 12C4.6 6.6 8.1 4 12 4s7.4 2.6 10.5 8c-3.1 5.4-6.6 8-10.5 8S4.6 17.4 1.5 12z" fill="none" stroke="var(--fg)" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="3.6" fill="var(--accent)" />
      <circle cx="13.3" cy="10.7" r="1.1" fill="var(--fg)" opacity=".85" />
    </g>
  );
}

/* -------------------------------------------------------- the pipeline */

type Pt = { x: number; y: number };
type Layout = {
  w: number;
  h: number;
  inputs: { m: number; c: number[]; w: number; h: number };
  hub: { m: number; c: number; w: number; h: number };
  clippers: { m: number; c: number[]; r: number };
  platforms: { m: number; c: number[]; w: number; h: number };
};

const H_LAYOUT: Layout = {
  w: 760,
  h: 250,
  inputs: { m: 92, c: [70, 130, 190], w: 148, h: 40 },
  hub: { m: 372, c: 130, w: 184, h: 60 },
  clippers: { m: 548, c: [50, 90, 130, 170, 210], r: 11 },
  platforms: { m: 688, c: [70, 110, 150, 190], w: 104, h: 32 },
};

const V_LAYOUT: Layout = {
  w: 360,
  h: 540,
  inputs: { m: 52, c: [60, 180, 300], w: 108, h: 40 },
  hub: { m: 200, c: 180, w: 184, h: 60 },
  clippers: { m: 336, c: [60, 120, 180, 240, 300], r: 11 },
  platforms: { m: 470, c: [45, 135, 225, 315], w: 80, h: 32 },
};

const INPUTS = [
  { label: "Your video", icon: "play" },
  { label: "Brand rules", icon: "shield" },
  { label: "View pool", icon: "coin" },
] as const;

function Pipeline({
  orient,
  side,
  setSide,
  reduced,
}: {
  orient: "h" | "v";
  side: "" | "in" | "out";
  setSide: (s: "" | "in" | "out") => void;
  reduced: boolean;
}) {
  const L = orient === "h" ? H_LAYOUT : V_LAYOUT;
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const [active, setActive] = useState(0);
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");

  useEffect(() => {
    if (reduced || !inView) return;
    const t = setInterval(() => setActive((a) => (a + 1) % PLATFORMS.length), 1500);
    return () => clearInterval(t);
  }, [reduced, inView]);

  const at = (m: number, c: number): Pt => (orient === "h" ? { x: m, y: c } : { x: c, y: m });
  // Half the node's size along the main axis, so links start and end at its edge.
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
  const inLinks = L.inputs.c.map((c) => link(L.inputs.m, c, half(L.inputs.w, L.inputs.h), L.hub.m, L.hub.c, hubHalf));
  const outLinks = L.clippers.c.map((c) => link(L.hub.m, L.hub.c, hubHalf, L.clippers.m, c, L.clippers.r));
  const postLinks = L.clippers.c.flatMap((c, i) =>
    [i % 4, (i + 1) % 4].map((p, k) => ({
      d: link(L.clippers.m, c, L.clippers.r, L.platforms.m, L.platforms.c[p], half(L.platforms.w, L.platforms.h)),
      p,
      main: k === 0,
    })),
  );

  const hub = at(L.hub.m, L.hub.c);
  const glow = `${uid}glow`;
  const status = !inView || reduced ? "brief · review · payouts" : `routing · ${PLATFORMS[active].toLowerCase()}`;

  // Hover zones: everything before the hub is setup, everything after it is distribution.
  const inZone = orient === "h" ? { x: 0, y: 0, w: L.hub.m - hubHalf, h: L.h } : { x: 0, y: 0, w: L.w, h: L.hub.m - hubHalf };
  const outZone =
    orient === "h"
      ? { x: L.hub.m + hubHalf, y: 0, w: L.w - L.hub.m - hubHalf, h: L.h }
      : { x: 0, y: L.hub.m + hubHalf, w: L.w, h: L.h - L.hub.m - hubHalf };

  // Column labels. In the stacked mobile layout they sit on the wires as small pills.
  const caption = (m: number, text: string) => {
    if (orient === "h")
      return (
        <text x={m} y="18" textAnchor="middle" className="ne-caption">
          {text}
        </text>
      );
    const w = text.length * 6.4 + 18;
    const y = m - 34;
    return (
      <g className="pointer-events-none">
        <rect x={L.w / 2 - w / 2} y={y - 10} width={w} height="17" rx="8.5" fill="var(--bg-raised)" stroke="var(--line-strong)" />
        <text x={L.w / 2} y={y + 2} textAnchor="middle" className="ne-caption">
          {text}
        </text>
      </g>
    );
  };

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${L.w} ${L.h}`}
      className="h-auto w-full overflow-visible"
      role="img"
      aria-label={`Your video, brand rules and view pool go into NovaEyes, which briefs ${facts.clippersLabel} clippers who post clips on TikTok, Instagram Reels, YouTube Shorts and X.`}
    >
      <defs>
        <radialGradient id={glow} cx={hub.x} cy={hub.y} r={orient === "h" ? 260 : 220} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="rgb(59 130 246)" stopOpacity=".16" />
          <stop offset="1" stopColor="rgb(59 130 246)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={L.w} height={L.h} fill={`url(#${glow})`} />


      <rect {...rectOf(inZone)} fill="transparent" onMouseEnter={() => setSide("in")} onMouseLeave={() => setSide("")} />
      <rect {...rectOf(outZone)} fill="transparent" onMouseEnter={() => setSide("out")} onMouseLeave={() => setSide("")} />

      {/* links */}
      {inLinks.map((d, i) => (
        <path key={d} d={d} className={`ne-flow pointer-events-none${side === "in" ? " ne-flow-on" : ""}${i === 1 ? " ne-dash" : ""}`} />
      ))}
      {outLinks.map((d, i) => (
        <path key={d} d={d} className={`ne-flow pointer-events-none${side === "out" ? " ne-flow-on" : ""}${i % 2 ? " ne-dash" : ""}`} />
      ))}
      {postLinks.map((l) => (
        <path
          key={l.d}
          d={l.d}
          className={`ne-flow pointer-events-none${side === "out" || (inView && !reduced && l.p === active && l.main) ? " ne-flow-on" : ""}`}
          opacity={l.main ? 1 : 0.5}
        />
      ))}

      {/* packets */}
      {inView &&
        !reduced &&
        [
          ...inLinks.map((d, i) => ({ d, dur: 2.4 + (i % 2) * 0.5, begin: i * 0.4 })),
          ...outLinks.map((d, i) => ({ d, dur: 2 + (i % 3) * 0.35, begin: 0.9 + i * 0.3 })),
          ...postLinks.filter((l) => l.main).map((l, i) => ({ d: l.d, dur: 1.6 + (i % 2) * 0.4, begin: 1.6 + i * 0.35 })),
        ].map((p, i) => (
          <circle key={i} r="2.6" className="ne-pkt pointer-events-none">
            <animateMotion dur={`${p.dur}s`} begin={`${p.begin}s`} repeatCount="indefinite" path={p.d} />
          </circle>
        ))}

      {/* inputs */}
      {L.inputs.c.map((c, i) => {
        const p = at(L.inputs.m, c);
        const { w, h } = L.inputs;
        return (
          <g key={i} transform={`translate(${p.x - w / 2},${p.y - h / 2})`} className="pointer-events-none">
            <rect width={w} height={h} rx="7" className={`ne-node${side === "in" ? " ne-node-on" : ""}`} />
            <g transform={`translate(${orient === "h" ? 14 : 10},${h / 2 - 7})`}>
              <InputIcon kind={INPUTS[i].icon} />
            </g>
            <text x={orient === "h" ? 38 : 30} y={h / 2 + 4} className="ne-label">
              {INPUTS[i].label}
            </text>
          </g>
        );
      })}

      {/* hub */}
      <g transform={`translate(${hub.x - L.hub.w / 2},${hub.y - L.hub.h / 2})`} className="pointer-events-none">
        <rect
          x="-5"
          y="-5"
          width={L.hub.w + 10}
          height={L.hub.h + 10}
          rx="13"
          fill="none"
          stroke="rgb(59 130 246 / .45)"
          className={reduced ? undefined : "ne-ring"}
        />
        <rect width={L.hub.w} height={L.hub.h} rx="10" className="ne-node ne-hub" />
        <Eye x={30} y={L.hub.h / 2} size={24} />
        <text x="54" y="27" className="ne-brand">
          NOVAEYES
        </text>
        <text x="54" y="43" className="ne-status">
          {status}
        </text>
      </g>

      {/* clippers */}
      {L.clippers.c.map((c, i) => {
        const p = at(L.clippers.m, c);
        return (
          <g key={i} className="pointer-events-none">
            <circle cx={p.x} cy={p.y} r={L.clippers.r} className={`ne-node${side === "out" ? " ne-node-on" : ""}`} />
            <circle cx={p.x} cy={p.y - 2.5} r="3" fill="var(--muted)" />
            <path d={`M${p.x - 5.5},${p.y + 6.5} a5.5,4.5 0 0 1 11,0`} fill="var(--muted)" />
            <circle
              cx={p.x + 8}
              cy={p.y - 8}
              r="2.6"
              fill="#22c55e"
              stroke="var(--bg-raised)"
              className={reduced ? undefined : "ne-live"}
              style={{ animationDelay: `${i * 0.37}s` }}
            />
          </g>
        );
      })}

      {/* platforms */}
      {L.platforms.c.map((c, i) => {
        const p = at(L.platforms.m, c);
        const { w, h } = L.platforms;
        const on = side === "out" || (inView && !reduced && i === active);
        return (
          <g key={PLATFORMS[i]} transform={`translate(${p.x - w / 2},${p.y - h / 2})`} className="pointer-events-none">
            <rect width={w} height={h} rx="6" className={`ne-node${on ? " ne-node-on" : ""}`} />
            <text x={w / 2} y={h / 2 + 4} textAnchor="middle" className={on ? "ne-label" : "ne-label ne-label-dim"}>
              {PLATFORMS[i]}
            </text>
          </g>
        );
      })}

      {caption(L.inputs.m, "You send")}
      {caption(L.clippers.m, `${facts.clippersLabel} clippers`)}
      {caption(L.platforms.m, "They post on")}
    </svg>
  );
}

function rectOf(z: { x: number; y: number; w: number; h: number }) {
  return { x: z.x, y: z.y, width: Math.max(0, z.w), height: Math.max(0, z.h) };
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
      <path d="M10 4.6c-.6-.6-1.3-.9-2.1-.9-1.2 0-2 .6-2 1.5 0 2.1 4.3 1.1 4.3 3.4 0 .9-.9 1.6-2.2 1.6-.9 0-1.8-.4-2.4-1M8 2.6v1.1M8 10.2v1.2" {...common} stroke="var(--accent)" strokeWidth={1.2} />
    </g>
  );
}

/* ---------------------------------------------------- 03: budget moves */

// Illustration of the weekly rebalance, not campaign data.
const WEEKS = [
  [25, 25, 25, 25],
  [34, 28, 22, 16],
  [45, 27, 17, 11],
  [56, 26, 11, 7],
];
const SEG = ["var(--accent)", "rgb(59 130 246 / .42)", "#363c4d", "#292d3a"];

function BudgetChart({ reduced }: { reduced: boolean }) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const [hover, setHover] = useState(-1);
  const shown = reduced || inView;
  const row = hover >= 0 ? hover : WEEKS.length - 1;
  const X0 = 46;
  const BW = 238;
  const y = (i: number) => 26 + i * 27;

  return (
    <svg
      ref={ref}
      viewBox="0 0 300 160"
      className="h-auto w-full cursor-crosshair overflow-visible"
      role="img"
      aria-label="Illustration: each week, more of the budget moves to the clip format that gets the most views."
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        const vy = ((e.clientY - r.top) / r.height) * 160;
        const i = Math.round((vy - 26) / 27);
        setHover(i >= 0 && i < WEEKS.length ? i : -1);
      }}
      onPointerLeave={() => setHover(-1)}
    >
      <text x="284" y="10" textAnchor="end" className="ne-status">
        illustration
      </text>
      {WEEKS.map((week, i) => {
        let x = X0;
        return (
          <g key={i} opacity={row === i ? 1 : 0.55} style={{ transition: "opacity .25s" }}>
            <text x={X0 - 8} y={y(i) + 4} textAnchor="end" className="ne-status">
              wk {i + 1}
            </text>
            <g
              style={{
                transform: shown ? "scaleX(1)" : "scaleX(0)",
                transformBox: "fill-box",
                transformOrigin: "left",
                transition: reduced ? "none" : `transform .9s cubic-bezier(.2,.8,.2,1) ${i * 0.18}s`,
              }}
            >
              {week.map((v, k) => {
                const w = (v / 100) * BW;
                const seg = <rect key={k} x={x} y={y(i) - 7} width={Math.max(0, w - 2)} height="14" rx="2" fill={SEG[k]} />;
                x += w;
                return seg;
              })}
            </g>
          </g>
        );
      })}
      <text x={X0} y="146" className="ne-label" style={{ fontSize: 10 }}>
        wk {row + 1} · <tspan fill="var(--accent)">{WEEKS[row][0]}%</tspan>
        <tspan className="ne-label-dim"> of budget on the top format</tspan>
      </text>
    </svg>
  );
}

/* ------------------------------------------- every clip: review gate */

const CLIPS: ("pass" | "fail")[] = ["pass", "pass", "fail", "pass", "fail"];

function ReviewGate({ reduced }: { reduced: boolean }) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { amount: 0.2 });
  const playing = inView && !reduced;
  // Where each clip sits when motion is off: two through, one rejected.
  const still = ["translate(212px,0)", "translate(176px,0)", "translate(126px,36px)", "translate(36px,0)", "translate(0px,0)"];

  return (
    <svg
      ref={ref}
      viewBox="0 0 300 160"
      className="h-auto w-full overflow-visible"
      role="img"
      aria-label="Every clip passes through NovaEyes review. Approved clips earn on verified views. Clips that break the rules earn nothing."
    >
      <path d="M8 66H292" className="ne-flow ne-dash" />
      <path d="M150 92v28" className="ne-flow" strokeDasharray="2 3" />

      {CLIPS.map((kind, i) => (
        <g key={i} transform="translate(24,66)">
          <g
            className={reduced ? undefined : kind === "pass" ? "ne-clip-pass" : "ne-clip-fail"}
            style={
              reduced
                ? { transform: still[i], opacity: i > 2 ? 0.35 : 1 }
                : { animationDelay: `${-i * 1.2}s`, animationPlayState: playing ? "running" : "paused" }
            }
          >
            <rect x="-8" y="-13" width="16" height="26" rx="2.5" fill="var(--bg)" stroke="#2e2f3b" />
            <path d="M-2.2 -4v8l6-4z" fill="var(--muted)" />
            {kind === "pass" ? (
              <g
                className={reduced ? undefined : "ne-ok"}
                style={reduced ? { opacity: i < 2 ? 1 : 0 } : { animationDelay: `${-i * 1.2}s`, animationPlayState: playing ? "running" : "paused" }}
              >
                <circle cx="8" cy="-13" r="5.2" fill="var(--accent)" />
                <path d="M5.6 -13.2 7.4 -11.4 10.5 -14.8" fill="none" stroke="#fff" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </g>
            ) : (
              <g
                className={reduced ? undefined : "ne-no"}
                style={reduced ? { opacity: 1 } : { animationDelay: `${-i * 1.2}s`, animationPlayState: playing ? "running" : "paused" }}
              >
                <circle cx="8" cy="-13" r="5.2" fill="#ef4444" />
                <path d="M6 -15l4 4M10 -15l-4 4" stroke="#fff" strokeWidth="1.3" strokeLinecap="round" />
              </g>
            )}
          </g>
        </g>
      ))}

      <g transform="translate(130,38)">
        <rect x="-4" y="-4" width="48" height="64" rx="11" fill="none" stroke="rgb(59 130 246 / .4)" className={reduced ? undefined : "ne-ring"} />
        <rect width="40" height="56" rx="8" className="ne-node ne-hub" />
        <Eye x={20} y={28} size={22} />
      </g>

      <text x="34" y="108" textAnchor="middle" className="ne-status">
        submitted
      </text>
      <text x="150" y="134" textAnchor="middle" className="ne-status">
        off brief · not paid
      </text>
      <text x="254" y="108" textAnchor="middle" className="ne-status">
        verified · paid
      </text>
    </svg>
  );
}
