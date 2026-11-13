import { facts } from "@/content/facts";
import { MARK_PATH, MARK_VIEWBOX } from "./brand";
import { siInstagram, siTiktok, siX, siYoutubeshorts } from "simple-icons";

// Homepage: what a clipping agency is. The definition stays plain text for search engines and AI
// answers; the picture shows the one idea that matters: one video going out through hundreds of
// pages at once, instead of one account. Built from the engine diagrams' pieces (ne-* in
// globals.css). Pulses are SMIL, which reduced-motion users can't pause, so they are dropped there
// by CSS (.cx-motion).

const STEPS = [
  { title: "Long video in", body: "A podcast, a fight, a song, a stream or an interview." },
  { title: "Best moments cut", body: "Clippers turn it into short vertical clips." },
  { title: "Posted everywhere", body: "On their own TikTok, Reels, Shorts and X pages." },
  { title: "Paid per view", body: `You pay only for verified views. From ${facts.minimumBudgetLabel}.` },
];

const C = 200;
const INNER = Array.from({ length: 8 }, (_, i) => {
  const a = (i / 8) * Math.PI * 2 - Math.PI / 2 + Math.PI / 8;
  return { x: C + Math.cos(a) * 92, y: C + Math.sin(a) * 92 };
});
const PLATFORMS = [siTiktok, siInstagram, siYoutubeshorts, siX];
const OUTER = Array.from({ length: 16 }, (_, i) => {
  const a = (i / 16) * Math.PI * 2 - Math.PI / 2;
  return { x: C + Math.cos(a) * 165, y: C + Math.sin(a) * 165, platform: i % 4 === 2 ? PLATFORMS[(i - 2) / 4] : null };
});
// each inner page feeds the two outer pages nearest to it
const LINKS = INNER.flatMap((p, i) => [OUTER[(i * 2 + 1) % 16], OUTER[(i * 2 + 2) % 16]].map((o) => ({ from: p, to: o })));

export function ClippingExplainer() {
  return (
    <section id="what-is-a-clipping-agency" className="mx-auto max-w-6xl px-6 pb-24 sm:px-10 lg:px-12">
      <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:gap-16">
        <div>
          <p className="font-label text-[10px] tracking-[0.14em] text-muted uppercase">The basics</p>
          <h2 className="mt-4 max-w-2xl text-3xl tracking-tight text-balance sm:text-4xl">
            What is a clipping agency? <span className="text-muted">Your video, posted by hundreds of pages at once.</span>
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
            A clipping agency takes your long videos, cuts the best moments into short clips and gets them posted by a large
            network of creators, called clippers, on their own TikTok, Instagram, YouTube and X pages. Instead of growing one
            account, your content shows up on hundreds of accounts at the same time.
          </p>

          <ol className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
            {STEPS.map((s, i) => (
              <li key={s.title} className="bg-bg p-5 sm:p-6">
                <p className="font-label text-[10px] tracking-[0.14em] text-accent">{String(i + 1).padStart(2, "0")}</p>
                <p className="mt-3 font-display font-semibold">{s.title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{s.body}</p>
              </li>
            ))}
          </ol>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted">
            NovaEyes works on performance: you fund a view pool, our {facts.clippersLabel} clippers post, and you pay only for
            the views that are verified.
          </p>
        </div>

        <figure className="relative isolate mx-auto w-full max-w-md">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-[8%] -z-10 rounded-full bg-[radial-gradient(closest-side,rgb(var(--glow)/0.18),rgb(var(--glow)/0.05)_55%,transparent)]"
          />
          <svg viewBox="0 0 400 400" className="h-auto w-full overflow-visible" role="img" aria-label="One video going out through hundreds of clipper pages on TikTok, Instagram, YouTube and X">
            {/* rings */}
            <circle cx={C} cy={C} r="92" fill="none" stroke="var(--line)" strokeDasharray="2 5" />
            <circle cx={C} cy={C} r="165" fill="none" stroke="var(--line)" strokeDasharray="2 5" />

            {/* wires */}
            {INNER.map((p, i) => (
              <path key={`s${i}`} d={`M${C},${C} L${p.x},${p.y}`} className="ne-flow ne-flow-on" />
            ))}
            {LINKS.map((l, i) => (
              <path key={`l${i}`} d={`M${l.from.x},${l.from.y} L${l.to.x},${l.to.y}`} className="ne-flow" />
            ))}

            {/* clips travelling out */}
            <g className="cx-motion">
              {INNER.map((p, i) => (
                <circle key={`p${i}`} r="2.6" className="ne-pkt">
                  <animateMotion dur="2.4s" begin={`-${(i * 0.3).toFixed(1)}s`} repeatCount="indefinite" path={`M${C},${C} L${p.x},${p.y}`} />
                </circle>
              ))}
              {LINKS.map((l, i) => (
                <circle key={`q${i}`} r="2" className="ne-pkt">
                  <animateMotion
                    dur="2.4s"
                    begin={`-${((i * 0.37) % 2.4).toFixed(2)}s`}
                    repeatCount="indefinite"
                    path={`M${l.from.x},${l.from.y} L${l.to.x},${l.to.y}`}
                  />
                </circle>
              ))}
            </g>

            {/* clipper pages */}
            {INNER.map((p, i) => (
              <g key={`n${i}`} transform={`translate(${p.x},${p.y})`}>
                <circle r="16" fill="none" stroke="rgb(var(--glow) / 0.35)" className="ne-live" style={{ animationDelay: `${i * 0.28}s` }} />
                <circle r="12" className="ne-node ne-node-on" />
                <circle cy="-2.6" r="2.6" fill="var(--fg)" />
                <path d="M-5,6 a5,4.2 0 0 1 10,0" fill="var(--fg)" />
              </g>
            ))}
            {OUTER.map((o, i) =>
              o.platform ? (
                <g key={`o${i}`} transform={`translate(${o.x - 13},${o.y - 13})`}>
                  <rect width="26" height="26" rx="7" className="ne-node ne-node-on" />
                  <svg x="6.5" y="6.5" width="13" height="13" viewBox="0 0 24 24" aria-hidden>
                    <path d={o.platform.path} fill="var(--fg)" />
                  </svg>
                </g>
              ) : (
                <g key={`o${i}`} transform={`translate(${o.x},${o.y})`}>
                  <circle r="8" className="ne-node" />
                  <circle cy="-1.7" r="1.8" fill="var(--muted)" />
                  <path d="M-3.4,4 a3.4,2.9 0 0 1 6.8,0" fill="var(--muted)" />
                </g>
              ),
            )}

            {/* your video */}
            <rect x={C - 34} y={C - 30} width="68" height="60" rx="16" fill="none" stroke="rgb(var(--glow) / .45)" className="ne-ring" />
            <rect x={C - 30} y={C - 26} width="60" height="52" rx="14" className="ne-node ne-hub" />
            <svg x={C - 18} y={C - 6.2} width="36" height="12.3" viewBox={MARK_VIEWBOX} aria-hidden>
              <path fillRule="evenodd" d={MARK_PATH} fill="var(--fg)" />
            </svg>
            <text x={C} y={C + 50} textAnchor="middle" className="ne-caption">
              Your video
            </text>
          </svg>
          <figcaption className="mt-4 text-center font-label text-[9px] tracking-[0.14em] text-muted uppercase">
            One video. Hundreds of pages.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
