import { LogoMark } from "@/components/brand";
import { CountUp } from "@/components/ui/count-up";
import { siInstagram, siTiktok, siX, siYoutubeshorts } from "simple-icons";

// Pricing header: an example of the live client dashboard. Shows what the budget buys you to watch:
// verified views, CPM, clips live, views over time, audience by country and the platform split.
// Labelled as an example; the numbers are illustrative, not a client's.

const KPIS = [
  { k: "Verified views", v: "8,412,330", count: true },
  { k: "CPM", v: "$0.21", count: false },
  { k: "Clips live", v: "1,284", count: true },
];

const COUNTRIES = [
  { k: "US", v: 54 },
  { k: "UK", v: 27 },
  { k: "CA", v: 19 },
];

const PLATFORMS = [
  { icon: siTiktok, v: 48 },
  { icon: siInstagram, v: 27 },
  { icon: siYoutubeshorts, v: 18 },
  { icon: siX, v: 7 },
];

// views per day, climbing with a couple of spikes
const LINE = "M0,92 C14,90 22,86 34,84 S58,80 70,74 S92,72 104,62 S124,58 136,60 S158,44 172,40 S196,38 210,30 S236,22 250,18 S272,10 300,6";

export function DashboardMock() {
  return (
    <figure className="relative mx-auto w-full max-w-lg pt-7 lg:max-w-none">
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 h-[28rem] w-[28rem] max-w-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(var(--glow)/0.2),transparent)]"
      />

      {/* floating notification */}
      <div
        aria-hidden
        className="vp-float absolute top-0 right-3 z-20 flex items-center gap-2 rounded-xl border border-accent/40 bg-bg/90 px-3 py-2 shadow-[0_10px_30px_rgb(0_0_0/0.45),0_0_20px_rgb(var(--glow)/0.25)] backdrop-blur"
      >
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-accent-ink">
          <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="m3.5 8.5 3 3 6-7" />
          </svg>
        </span>
        <span className="text-[11px] leading-tight">
          <span className="block font-semibold text-fg">Clip approved</span>
          <span className="block text-muted">+212K verified views</span>
        </span>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-line bg-[#101016] shadow-[0_30px_80px_rgb(0_0_0/0.55),0_0_60px_rgb(var(--glow)/0.12)]">
        {/* window bar */}
        <div className="flex items-center gap-3 border-b border-line bg-bg/60 px-4 py-3">
          <span aria-hidden className="flex gap-1.5 max-[359px]:hidden">
            <span className="h-2 w-2 rounded-full bg-fg/15" />
            <span className="h-2 w-2 rounded-full bg-fg/15" />
            <span className="h-2 w-2 rounded-full bg-fg/15" />
          </span>
          <LogoMark className="ml-1 h-3 w-auto shrink-0 text-fg/80" />
          <span className="truncate text-xs text-muted">Campaign dashboard</span>
          <span className="ml-auto flex shrink-0 items-center gap-1.5 rounded-full border border-line px-2 py-0.5 font-label text-[8px] tracking-[0.14em] text-muted uppercase">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inset-0 animate-ping rounded-full bg-accent/70" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
            Live example
          </span>
        </div>

        <div className="space-y-3 p-3 sm:p-4">
          {/* KPIs */}
          <dl className="grid grid-cols-3 gap-2 sm:gap-3">
            {KPIS.map((x) => (
              <div key={x.k} className="min-w-0 rounded-xl border border-line bg-bg/60 px-2.5 py-2.5 sm:px-3.5 sm:py-3">
                <dt className="text-[10px] leading-tight text-muted sm:text-[11px]">{x.k}</dt>
                <dd className="mt-1 truncate font-display text-sm font-bold tracking-tight tabular-nums sm:text-xl">
                  {x.count ? <CountUp value={x.v} /> : x.v}
                </dd>
              </div>
            ))}
          </dl>

          {/* views over time */}
          <div className="rounded-xl border border-line bg-bg/60 p-3 sm:p-4">
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-[11px] text-muted">Verified views, last 14 days</span>
              <span className="font-display text-[11px] font-semibold text-accent">+38% this week</span>
            </div>
            <svg viewBox="0 0 300 100" className="mt-2 h-auto w-full overflow-visible" aria-hidden>
              <defs>
                <linearGradient id="dm-area" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0" stopColor="rgb(59 130 246 / 0.35)" />
                  <stop offset="1" stopColor="rgb(59 130 246 / 0)" />
                </linearGradient>
              </defs>
              {[25, 50, 75].map((y) => (
                <line key={y} x1="0" x2="300" y1={y} y2={y} stroke="var(--line)" strokeDasharray="2 4" />
              ))}
              <path d={`${LINE} L300,100 L0,100 Z`} fill="url(#dm-area)" />
              <path d={LINE} fill="none" stroke="rgb(59 130 246 / 0.7)" strokeWidth="2" />
              <path d={LINE} fill="none" stroke="#9cc3ff" strokeWidth="2.6" strokeLinecap="round" pathLength={1} className="sb-glint" />
              <circle cx="300" cy="6" r="4" fill="var(--accent)" style={{ filter: "drop-shadow(0 0 6px rgb(59 130 246))" }} />
            </svg>
          </div>

          {/* audience and platforms */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <div className="min-w-0 rounded-xl border border-line bg-bg/60 p-3 sm:p-4">
              <div className="flex flex-wrap items-center justify-between gap-1">
                <span className="text-[11px] text-muted">Audience</span>
                <span className="shrink-0 rounded-full bg-accent/15 px-1.5 py-0.5 text-[9px] font-semibold text-accent">In target</span>
              </div>
              <ul className="mt-3 space-y-2">
                {COUNTRIES.map((c) => (
                  <li key={c.k} className="flex items-center gap-2">
                    <span className="w-5 shrink-0 font-[family-name:var(--font-geist-mono)] text-[10px] text-muted">{c.k}</span>
                    <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-line">
                      <span className="block h-full rounded-full bg-gradient-to-r from-[#1e3a8a] to-accent" style={{ width: `${c.v}%` }} />
                    </span>
                    <span className="w-7 shrink-0 text-right font-[family-name:var(--font-geist-mono)] text-[10px] text-fg/80">{c.v}%</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="min-w-0 rounded-xl border border-line bg-bg/60 p-3 sm:p-4">
              <span className="text-[11px] text-muted">Platforms</span>
              <div className="mt-3 flex h-2 overflow-hidden rounded-full">
                {PLATFORMS.map((p, i) => (
                  <span key={p.icon.title} className="h-full" style={{ width: `${p.v}%`, background: ["#3b82f6", "#2563eb", "#1d4ed8", "#1e3a8a"][i] }} />
                ))}
              </div>
              <ul className="mt-3 grid grid-cols-2 gap-x-2 gap-y-1.5">
                {PLATFORMS.map((p) => (
                  <li key={p.icon.title} className="flex items-center gap-1.5">
                    <svg viewBox="0 0 24 24" className="h-3 w-3 shrink-0" aria-hidden>
                      <path d={p.icon.path} fill="var(--fg)" opacity="0.75" />
                    </svg>
                    <span className="font-[family-name:var(--font-geist-mono)] text-[10px] text-fg/80">{p.v}%</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <figcaption className="mt-3 text-center text-xs text-muted">
        Example of the live dashboard every campaign gets: views, CPM, clips, audience and platforms.
      </figcaption>
    </figure>
  );
}
