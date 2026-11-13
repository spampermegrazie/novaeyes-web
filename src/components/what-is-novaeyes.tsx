import { facts } from "@/content/facts";
import { MARK_PATH, MARK_VIEWBOX } from "./brand";
import { siInstagram, siTiktok, siX, siYoutubeshorts } from "simple-icons";

// Homepage: what NovaEyes is. The opening paragraph defines a clipping agency in plain text (for
// search and AI answers), then three tiles on how it differs from the alternatives: growing one
// account, an influencer deal and an ad campaign. How a campaign runs (review, budget, dashboard)
// lives only in the engine section below. Motion lives in globals.css (wn-*) and stops with
// reduced motion.

// 01: one video fanned out to clippers, then to the platforms. Sized for a third-width tile.
const PLATFORMS = [siTiktok, siInstagram, siYoutubeshorts, siX];
const CLIPPER_Y = [22, 51, 80, 110, 139, 168];
const PLATFORM_Y = [28, 73, 118, 163];
const LINKS: [number, number][] = [
  [0, 0],
  [1, 0],
  [1, 1],
  [2, 1],
  [3, 2],
  [4, 2],
  [4, 3],
  [5, 3],
];
const fan = (y: number) => `M56,95 C100,95 104,${y} 138,${y}`;
const out = (yc: number, yp: number) => `M162,${yc} C215,${yc} 218,${yp} 262,${yp}`;

function Network() {
  return (
    <svg viewBox="0 0 300 190" className="h-auto w-full max-w-80 overflow-visible" aria-hidden>
      {CLIPPER_Y.map((y) => (
        <path key={`f${y}`} d={fan(y)} className="ne-flow ne-flow-on" />
      ))}
      {LINKS.map(([c, p]) => (
        <path key={`l${c}${p}`} d={out(CLIPPER_Y[c], PLATFORM_Y[p])} className="ne-flow" />
      ))}
      <g className="wn-motion">
        {CLIPPER_Y.map((y, i) => (
          <circle key={`p${y}`} r="2.2" className="ne-pkt">
            <animateMotion dur="1.8s" begin={`-${(i * 0.31).toFixed(2)}s`} repeatCount="indefinite" path={fan(y)} />
          </circle>
        ))}
        {LINKS.map(([c, p], i) => (
          <circle key={`q${c}${p}`} r="1.9" className="ne-pkt">
            <animateMotion dur="1.8s" begin={`-${((i * 0.23) % 1.8).toFixed(2)}s`} repeatCount="indefinite" path={out(CLIPPER_Y[c], PLATFORM_Y[p])} />
          </circle>
        ))}
      </g>
      <rect x="6" y="70" width="50" height="50" rx="13" className="ne-node ne-hub" />
      <svg x="16" y="90" width="30" height="10.3" viewBox={MARK_VIEWBOX}>
        <path fillRule="evenodd" d={MARK_PATH} fill="var(--fg)" />
      </svg>
      <text x="31" y="137" textAnchor="middle" className="ne-caption">
        Your video
      </text>
      {CLIPPER_Y.map((y, i) => (
        <g key={`c${y}`} transform={`translate(150,${y})`}>
          <circle r="15" fill="none" stroke="rgb(var(--glow) / 0.3)" className="ne-live" style={{ animationDelay: `${i * 0.3}s` }} />
          <circle r="11.5" className="ne-node ne-node-on" />
          <circle cy="-2.5" r="2.5" fill="var(--fg)" />
          <path d="M-4.8,5.8 a4.8,4 0 0 1 9.6,0" fill="var(--fg)" />
        </g>
      ))}
      {PLATFORM_Y.map((y, i) => (
        <g key={`pl${y}`} transform={`translate(262,${y - 15})`}>
          <rect width="30" height="30" rx="8" className="ne-node ne-node-on" />
          <svg x="8" y="8" width="14" height="14" viewBox="0 0 24 24">
            <path d={PLATFORMS[i].path} fill="var(--fg)" />
          </svg>
        </g>
      ))}
    </svg>
  );
}

// 02: the same campaign two ways. The influencer fee is spent the moment the post is booked,
// whatever it gets; with NovaEyes the cost only grows as verified views come in.
function Meter({ label, fill, anim, to, delay = 0 }: { label: string; fill: string; anim: string; to: number; delay?: number }) {
  return (
    <div className="mt-2.5 flex items-center gap-2.5">
      <span className="w-9 shrink-0 font-[family-name:var(--font-geist-mono)] text-[10px] text-muted">{label}</span>
      <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-line">
        <span
          className={`block h-full origin-left rounded-full ${fill} ${anim}`}
          style={{ animationDelay: `${delay}s`, ["--to" as string]: to }}
        />
      </span>
    </div>
  );
}

function FeeVsViews() {
  return (
    <div className="w-full max-w-64 space-y-3">
      <div className="rounded-xl border border-line bg-bg p-3.5">
        <div className="flex items-baseline justify-between gap-2 text-xs">
          <span className="text-muted">Influencer post</span>
          <span className="font-[family-name:var(--font-geist-mono)] text-[10px] text-muted/70">fixed fee</span>
        </div>
        <Meter label="Views" fill="bg-fg/30" anim="wi-low" to={0.2} />
        <Meter label="Cost" fill="bg-fg/60" anim="wi-flat" to={1} />
      </div>
      <div className="rounded-xl border border-accent/40 bg-accent/[0.05] p-3.5 shadow-[0_0_30px_rgb(var(--glow)/0.12)]">
        <div className="flex items-baseline justify-between gap-2 text-xs">
          <span className="font-semibold">NovaEyes</span>
          <span className="font-[family-name:var(--font-geist-mono)] text-[10px] text-accent">per verified view</span>
        </div>
        <Meter label="Views" fill="bg-accent" anim="wi-grow" to={0.9} />
        <Meter label="Cost" fill="bg-accent/55" anim="wi-grow" to={0.9} delay={0.18} />
      </div>
    </div>
  );
}

// 03: a few ad creatives wearing out, next to a wall of clips where new ones keep landing.
const MOSAIC = Array.from({ length: 40 }, (_, i) => i);
const hash = (i: number) => (((i + 1) * 2654435761) >>> 0) % 1000 / 1000;

function AdsVsClips() {
  return (
    <div className="flex w-full max-w-80 items-end justify-center gap-5">
      <div className="flex flex-col items-center">
        <div className="relative h-[116px] w-28">
          {[-10, 0, 10].map((rot, i) => (
            <span
              key={rot}
              className="wa-tire absolute bottom-1 left-1/2 h-24 w-14 overflow-hidden rounded-lg border border-white/10 bg-gradient-to-b from-[#2a2d3a] to-[#12131a] shadow-[0_6px_18px_rgb(0_0_0/0.4)]"
              style={{ rotate: `${rot}deg`, translate: `${(i - 1) * 22 - 28}px 0`, transformOrigin: "50% 100%", animationDelay: `${-i * 1.1}s` }}
            >
              <span className="absolute top-1.5 left-1.5 rounded bg-white/15 px-1 font-[family-name:var(--font-geist-mono)] text-[8px] leading-3.5 text-fg/80">Ad</span>
              <span className="absolute inset-x-2 bottom-2 h-0.5 rounded-full bg-white/20" />
            </span>
          ))}
        </div>
        <span className="mt-3 font-label text-[9px] tracking-[0.14em] whitespace-nowrap text-muted uppercase">A few ads</span>
      </div>
      <div className="flex flex-col items-center">
        <div className="grid grid-cols-8 gap-1">
          {MOSAIC.map((i) => {
            const h = hash(i);
            return (
              <span
                key={i}
                className={`wa-pop h-5 w-3 rounded-[3px] ${h < 0.16 ? "bg-accent shadow-[0_0_8px_rgb(var(--glow)/0.7)]" : h < 0.45 ? "bg-[#323646]" : "bg-[#23252f]"}`}
                style={{ animationDelay: `${(-hash(i + 50) * 6).toFixed(2)}s` }}
              />
            );
          })}
        </div>
        <span className="mt-3 font-label text-[9px] tracking-[0.14em] whitespace-nowrap text-muted uppercase">Thousands of clips</span>
      </div>
    </div>
  );
}

function Tile({ n, title, body, children }: { n: string; title: string; body: string; children: React.ReactNode }) {
  return (
    <li className="relative flex flex-col overflow-hidden rounded-2xl border border-line bg-bg-raised/40">
      <div className="relative flex h-56 items-center justify-center px-6 pt-6">{children}</div>
      <div className="p-6 pt-5">
        <p className="font-label text-[10px] tracking-[0.14em] text-accent">{n}</p>
        <h3 className="mt-2 text-lg">{title}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-muted">{body}</p>
      </div>
    </li>
  );
}

export function WhatIsNovaEyes() {
  return (
    <section id="what-is-novaeyes" className="mx-auto max-w-6xl px-6 pb-24 sm:px-10 lg:px-12">
      <p className="font-label text-[10px] tracking-[0.14em] text-muted uppercase">What is NovaEyes</p>
      <h2 className="mt-4 max-w-3xl text-3xl tracking-tight text-balance sm:text-4xl">
        Your distribution team. <span className="text-muted">A clipping agency paid only for verified views.</span>
      </h2>
      <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted">
        NovaEyes is a clipping agency. We take your long videos, cut the best moments into short clips and get them posted by
        our network of {facts.clippersLabel} clippers on their own TikTok, Instagram, YouTube and X pages.
      </p>

      <ul className="mt-12 grid gap-4 lg:grid-cols-3">
        <Tile
          n="01"
          title="Not one account. Hundreds of pages."
          body="Instead of growing one account, your clips go out on hundreds of clipper pages at once, each with its own audience, across TikTok, Reels, Shorts and X."
        >
          <Network />
        </Tile>
        <Tile
          n="02"
          title="Not an influencer deal. You pay per verified view."
          body="An influencer deal pays a fixed fee for one post, whether it works or not. Here each clipper only earns when their clip gets verified views from your target audience, so your cost follows the results, not a promise."
        >
          <FeeVsViews />
        </Tile>
        <Tile
          n="03"
          title="Not an ad campaign. Thousands of clips."
          body="Ads run a handful of creatives until people start scrolling past them. A campaign puts thousands of different clips into the feed, each one posted by a real page."
        >
          <AdsVsClips />
        </Tile>
      </ul>
    </section>
  );
}
