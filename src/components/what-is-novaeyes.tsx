import { facts } from "@/content/facts";
import { MARK_PATH, MARK_VIEWBOX } from "./brand";
import { siInstagram, siTiktok, siX, siYoutubeshorts } from "simple-icons";

// Homepage: what NovaEyes is. The opening paragraph still defines a clipping agency in plain
// text (for search and AI answers), then a bento of what you actually get, each tile with a small
// live picture. Motion lives in globals.css (wn-*) and stops with reduced motion.

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
const fan = (y: number) => `M96,95 C170,95 180,${y} 247,${y}`;
const out = (yc: number, yp: number) => `M273,${yc} C360,${yc} 370,${yp} 452,${yp}`;

function Tile({ n, title, body, children, className = "" }: { n: string; title: string; body: string; children: React.ReactNode; className?: string }) {
  return (
    <li className={`relative flex flex-col overflow-hidden rounded-2xl border border-line bg-bg-raised/40 ${className}`}>
      <div className="relative flex min-h-44 flex-1 items-center justify-center px-6 pt-6">{children}</div>
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
        our network of {facts.clippersLabel} clippers on their own TikTok, Instagram, YouTube and X pages. Instead of growing one
        account, your content shows up on hundreds of accounts at the same time, and you pay only for the views that are
        verified.
      </p>

      <ul className="mt-12 grid gap-4 md:grid-cols-3">
        {/* one brief, the whole network */}
        <Tile
          n="01"
          title={`${facts.clippersLabel} clippers on your content`}
          body="One brief goes out to the network. Clippers cut your best moments and post them on their own pages, on every platform at once."
          className="md:col-span-2"
        >
          <svg viewBox="0 0 520 190" className="h-auto w-full max-w-xl overflow-visible" aria-hidden>
            {CLIPPER_Y.map((y) => (
              <path key={`f${y}`} d={fan(y)} className="ne-flow ne-flow-on" />
            ))}
            {LINKS.map(([c, p]) => (
              <path key={`l${c}${p}`} d={out(CLIPPER_Y[c], PLATFORM_Y[p])} className="ne-flow" />
            ))}
            <g className="wn-motion">
              {CLIPPER_Y.map((y, i) => (
                <circle key={`p${y}`} r="2.4" className="ne-pkt">
                  <animateMotion dur="2.2s" begin={`-${(i * 0.37).toFixed(2)}s`} repeatCount="indefinite" path={fan(y)} />
                </circle>
              ))}
              {LINKS.map(([c, p], i) => (
                <circle key={`q${c}${p}`} r="2" className="ne-pkt">
                  <animateMotion dur="2.2s" begin={`-${((i * 0.29) % 2.2).toFixed(2)}s`} repeatCount="indefinite" path={out(CLIPPER_Y[c], PLATFORM_Y[p])} />
                </circle>
              ))}
            </g>
            <rect x="28" y="67" width="68" height="56" rx="15" className="ne-node ne-hub" />
            <svg x="44" y="89" width="36" height="12.3" viewBox={MARK_VIEWBOX}>
              <path fillRule="evenodd" d={MARK_PATH} fill="var(--fg)" />
            </svg>
            <text x="62" y="142" textAnchor="middle" className="ne-caption">
              Your video
            </text>
            {CLIPPER_Y.map((y, i) => (
              <g key={`c${y}`} transform={`translate(260,${y})`}>
                <circle r="16" fill="none" stroke="rgb(var(--glow) / 0.3)" className="ne-live" style={{ animationDelay: `${i * 0.3}s` }} />
                <circle r="12" className="ne-node ne-node-on" />
                <circle cy="-2.6" r="2.6" fill="var(--fg)" />
                <path d="M-5,6 a5,4.2 0 0 1 10,0" fill="var(--fg)" />
              </g>
            ))}
            {PLATFORM_Y.map((y, i) => (
              <g key={`pl${y}`} transform={`translate(452,${y - 15})`}>
                <rect width="30" height="30" rx="8" className="ne-node ne-node-on" />
                <svg x="8" y="8" width="14" height="14" viewBox="0 0 24 24">
                  <path d={PLATFORMS[i].path} fill="var(--fg)" />
                </svg>
              </g>
            ))}
          </svg>
        </Tile>

        {/* the ledger: only verified views on approved clips get paid */}
        <Tile n="02" title="Paid per verified view" body="Clippers only earn on verified views from approved clips. No retainers, no paying for clips that flop.">
          <ul className="w-full max-w-60 space-y-2 font-[family-name:var(--font-geist-mono)] text-[11px]">
            {[
              { id: "clip 0841", state: "approved", paid: true },
              { id: "clip 0842", state: "rejected", paid: false },
              { id: "clip 0843", state: "approved", paid: true },
            ].map((r, i) => (
              <li key={r.id} className="wn-row flex items-center justify-between rounded-lg border border-line bg-bg px-3 py-2" style={{ animationDelay: `${i * 0.6}s` }}>
                <span className="text-muted">{r.id}</span>
                <span className={r.paid ? "text-accent" : "text-muted/60"}>{r.paid ? `${r.state} · paid` : `${r.state} · $0`}</span>
              </li>
            ))}
          </ul>
        </Tile>

        {/* review gate */}
        <Tile n="03" title="Every clip reviewed" body="Clips are checked against your brief and brand rules before they can earn a single view.">
          <div className="relative h-24 w-full max-w-64">
            <div className="absolute inset-x-0 top-1/2 h-px bg-line" />
            <div className="absolute top-1/2 left-1/2 h-20 w-12 -translate-x-1/2 -translate-y-1/2 rounded-t-full border-x border-t border-accent/60 shadow-[0_0_24px_rgb(var(--glow)/0.25)]" />
            <span className="wn-gate absolute top-1/2 left-1/2 flex h-6 w-6 -translate-x-1/2 -translate-y-[58px] items-center justify-center rounded-full bg-accent text-accent-ink shadow-[0_0_14px_rgb(var(--glow)/0.8)]">
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m3.5 8.5 3 3 6-7" />
              </svg>
            </span>
            <span className="wn-clip absolute top-1/2 h-12 w-7 -translate-y-1/2 rounded-md border border-white/15 bg-[linear-gradient(160deg,#2a2d3a,#12131a)]" />
          </div>
        </Tile>

        {/* budget follows the winners */}
        <Tile n="04" title="Budget follows the winners" body="Every day, spend moves to the clips and formats that perform, so more of it goes where the views are.">
          <div className="flex h-24 w-full max-w-56 items-end justify-between gap-2">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <span
                key={i}
                className="wn-bar h-full flex-1 origin-bottom rounded-t-md bg-gradient-to-t from-accent/25 to-accent"
                style={{ animationDelay: `${-i * 1.1}s` }}
              />
            ))}
          </div>
        </Tile>

        {/* live dashboard */}
        <Tile n="05" title="A live dashboard" body="Views for every clip as they come in, plus a weekly report and a final report when the campaign ends.">
          <div className="relative w-full max-w-64">
            <span className="absolute -top-1 right-0 flex items-center gap-1.5 font-label text-[8px] tracking-[0.14em] text-muted uppercase">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent shadow-[0_0_8px_rgb(var(--glow))]" />
              Live
            </span>
            <svg viewBox="0 0 240 90" className="mt-4 h-auto w-full overflow-visible">
              <defs>
                <linearGradient id="wn-area" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0" stopColor="rgb(59 130 246 / 0.35)" />
                  <stop offset="1" stopColor="rgb(59 130 246 / 0)" />
                </linearGradient>
              </defs>
              {[22, 45, 68].map((y) => (
                <line key={y} x1="0" x2="240" y1={y} y2={y} stroke="var(--line)" strokeDasharray="2 4" />
              ))}
              <path d="M0,82 L24,76 L48,79 L72,66 L96,68 L120,52 L144,55 L168,38 L192,30 L216,22 L240,10 L240,90 L0,90 Z" fill="url(#wn-area)" />
              <path
                d="M0,82 L24,76 L48,79 L72,66 L96,68 L120,52 L144,55 L168,38 L192,30 L216,22 L240,10"
                fill="none"
                stroke="var(--accent)"
                strokeWidth="2"
                strokeLinejoin="round"
                pathLength={1}
                className="wn-spark"
              />
              <circle cx="240" cy="10" r="3.5" fill="var(--accent)" className="wn-motion" style={{ filter: "drop-shadow(0 0 6px rgb(59 130 246))" }} />
            </svg>
          </div>
        </Tile>
      </ul>
    </section>
  );
}
