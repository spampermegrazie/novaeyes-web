import { facts } from "@/content/facts";
import { CountUp } from "./ui/count-up";

// Homepage: the headline numbers right under the hero. One panel, four cells, each with a small
// live picture along its bottom edge that matches the number: a field of clippers coming online,
// views climbing, clips rolling out, reach spreading. Numbers stay in the server HTML (CountUp
// only animates them). Motion lives in globals.css (sb-*) and stops with reduced motion.

// Deterministic scatter so server and client render the same dots.
const rand = (i: number) => (((i + 1) * 2654435761) >>> 0) % 1000 / 1000;

function Clippers() {
  const cols = 30;
  const rows = 5;
  const dots = Array.from({ length: cols * rows }, (_, i) => ({ x: 8 + (i % cols) * 11, y: 10 + Math.floor(i / cols) * 11, r: rand(i) }));
  return (
    <svg width={cols * 11 + 6} height={rows * 11 + 8} className="absolute bottom-3 left-4" aria-hidden>
      {dots.map((d, i) => (
        <circle
          key={i}
          cx={d.x}
          cy={d.y}
          r="1.7"
          className={d.r < 0.38 ? `sb-dot sb-blink${d.r < 0.12 ? " sb-keep" : ""}` : "sb-dot"}
          style={d.r < 0.38 ? { animationDelay: `${(-d.r * 13.7).toFixed(2)}s` } : undefined}
        />
      ))}
    </svg>
  );
}

const VIEWS_LINE = "M0,74 C22,72 34,70 52,66 S86,64 104,57 S136,52 156,44 S190,40 208,30 S244,22 262,15 S288,8 300,5";

function Views() {
  return (
    <svg viewBox="0 0 300 80" className="absolute inset-x-0 bottom-0 h-auto w-full overflow-visible" aria-hidden>
      <defs>
        <linearGradient id="sb-area" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="rgb(59 130 246 / 0.3)" />
          <stop offset="1" stopColor="rgb(59 130 246 / 0)" />
        </linearGradient>
      </defs>
      <path d={`${VIEWS_LINE} L300,80 L0,80 Z`} fill="url(#sb-area)" />
      <path d={VIEWS_LINE} fill="none" stroke="rgb(59 130 246 / 0.55)" strokeWidth="1.6" />
      <path d={VIEWS_LINE} fill="none" stroke="#9cc3ff" strokeWidth="2.4" strokeLinecap="round" pathLength={1} className="sb-glint" />
    </svg>
  );
}

// Blues only, from deep navy to the brand blue.
const CARD_TONES = [
  "from-[#1e3a8a] to-[#0b1230]",
  "from-[#2563eb]/55 to-[#0c1633]",
  "from-[#172554] to-[#0a0f24]",
  "from-[#1d4ed8]/70 to-[#0d1530]",
  "from-[#1e40af] to-[#0b1128]",
  "from-[#3b82f6]/45 to-[#0a0f24]",
];

function Clips() {
  const cards = Array.from({ length: 12 }, (_, i) => i);
  const belt = (copy: number) =>
    cards.map((i) => {
      const hot = i % 4 === 1;
      return (
        <span
          key={`${copy}-${i}`}
          className={`relative mr-2 h-14 w-8 shrink-0 overflow-hidden rounded-md border bg-gradient-to-b ${CARD_TONES[i % CARD_TONES.length]} ${
            hot ? "border-accent/70 shadow-[0_0_14px_rgb(var(--glow)/0.4)]" : "border-[#3b82f6]/20"
          }`}
        >
          <span className="absolute inset-x-1.5 bottom-1.5 h-0.5 rounded-full bg-[#3b82f6]/20">
            <span className={`block h-full rounded-full ${hot ? "bg-accent" : "bg-[#9cc3ff]/50"}`} style={{ width: `${30 + Math.round(rand(i + 40) * 60)}%` }} />
          </span>
          <span className="absolute top-1.5 right-1.5 h-1 w-1 rounded-full bg-[#9cc3ff]/45" />
        </span>
      );
    });
  return (
    <div className="absolute inset-x-0 bottom-3 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_18%,#000_82%,transparent)]" aria-hidden>
      <div className="sb-belt flex w-max">
        {belt(0)}
        {belt(1)}
      </div>
    </div>
  );
}

const AUDIENCE = Array.from({ length: 22 }, (_, i) => {
  const ring = [34, 58, 84][i % 3];
  const a = Math.PI * (0.12 + rand(i + 7) * 0.76);
  return { x: Math.min(294, Math.max(6, 150 - Math.cos(a) * ring * 1.9)), y: 92 - Math.sin(a) * ring, r: rand(i + 3) };
});

function Reach() {
  return (
    <svg viewBox="0 0 300 80" className="absolute inset-x-0 bottom-0 h-auto w-full" aria-hidden>
      {[0, 1, 2].map((i) => (
        <ellipse
          key={i}
          cx="150"
          cy="92"
          rx="190"
          ry="100"
          fill="none"
          stroke="rgb(59 130 246 / 0.7)"
          strokeWidth="1.4"
          className="sb-ripple"
          style={{ animationDelay: `${(-i * 1.4).toFixed(1)}s`, ["--s" as string]: [0.35, 0.62, 0.9][i] }}
        />
      ))}
      {AUDIENCE.map((d, i) => (
        <circle
          key={i}
          cx={d.x.toFixed(1)}
          cy={d.y.toFixed(1)}
          r="1.8"
          className={`sb-dot sb-blink${d.r < 0.3 ? " sb-keep" : ""}`}
          style={{ animationDelay: `${(-d.r * 9.3).toFixed(2)}s` }}
        />
      ))}
      <circle cx="150" cy="80" r="5" fill="var(--accent)" style={{ filter: "drop-shadow(0 0 8px rgb(59 130 246))" }} />
    </svg>
  );
}

const PICTURES = [Clippers, Views, Clips, Reach];

export function StatsBand() {
  return (
    <section aria-label="NovaEyes in numbers" className="mx-auto max-w-6xl px-6 pb-24 sm:px-10 lg:px-12">
      <div className="relative overflow-hidden rounded-2xl border border-line bg-line">
        {/* a light running along the top edge */}
        <span aria-hidden className="sb-sweep pointer-events-none absolute top-0 left-0 z-10 h-px w-1/4 bg-gradient-to-r from-transparent via-accent to-transparent" />
        <dl className="grid grid-cols-2 gap-px md:grid-cols-4">
          {facts.stats.map((s, i) => {
            const Picture = PICTURES[i % PICTURES.length];
            return (
              <div key={s.label} className="group relative flex min-h-48 flex-col overflow-hidden bg-bg px-5 pt-6 transition-colors duration-300 hover:bg-[#101016] sm:min-h-56 sm:px-6 sm:pt-7">
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-[radial-gradient(60%_100%_at_50%_100%,rgb(var(--glow)/0.1),transparent)] opacity-60 transition-opacity duration-300 group-hover:opacity-100"
                />
                <dt className="relative order-2 mt-1 text-sm text-muted">{s.label}</dt>
                <dd className="relative order-1 font-display text-[28px] leading-tight font-bold tracking-tight sm:text-4xl lg:text-[44px]">
                  <CountUp value={s.value} delay={i * 0.12} />
                </dd>
                <div className="pointer-events-none absolute inset-0 opacity-70 transition-opacity duration-300 group-hover:opacity-100 [mask-image:linear-gradient(to_top,#000_55%,transparent_80%)]">
                  <Picture />
                </div>
              </div>
            );
          })}
        </dl>
      </div>
      <p className="mt-3 text-right font-label text-[9px] tracking-[0.14em] text-muted/70 uppercase">Network totals, {facts.statsAsOf}</p>
    </section>
  );
}
