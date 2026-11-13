import { facts } from "@/content/facts";
import { MARK_PATH, MARK_VIEWBOX } from "./brand";
import { siInstagram, siTiktok, siX, siYoutubeshorts } from "simple-icons";

// Homepage: what NovaEyes is. The opening paragraph defines a clipping agency in plain text (for
// search and AI answers), then two tiles on how it differs from the alternatives: one account, and
// an influencer deal. How a campaign runs (review, budget, dashboard) lives only in the engine
// section below. Motion lives in globals.css (wn-*) and stops with reduced motion.

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
        our network of {facts.clippersLabel} clippers on their own TikTok, Instagram, YouTube and X pages.
      </p>

      <ul className="mt-12 grid gap-4 md:grid-cols-3">
        {/* one brief, the whole network */}
        <Tile
          n="01"
          title="Not one account. Hundreds of pages."
          body="Instead of growing one account, your clips go out on hundreds of clipper pages at once, each with its own audience, across TikTok, Reels, Shorts and X."
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
        <Tile
          n="02"
          title="Not an influencer deal. You pay per verified view."
          body="An influencer deal pays a fixed fee for one post, whether it works or not. Here each clipper only earns when their clip gets verified views, so your cost follows the results, not a promise."
        >
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
      </ul>
    </section>
  );
}
