import Link from "next/link";
import { facts } from "@/content/facts";
import { FounderPortrait } from "@/components/founder-portrait";
import { CountUp } from "@/components/ui/count-up";

// Homepage founder block, in the site's own language: eyebrow and two-tone heading like the
// other sections, a raised panel with the hero's dot grid and blue glow, stats that count up
// like the numbers band, and Andrea's cut-out standing on the bottom edge of the panel the way
// the featured client stands in the results showcase.
const views = facts.stats.find((s) => s.label === "Views delivered")?.value ?? "600M+";
const stats = [
  { value: "500K+", label: "Followers built" },
  { value: `${facts.clippersLabel}+`, label: "Clippers" },
  { value: views, label: "Views delivered" },
];

export function FounderSection() {
  return (
    <section id="founder" className="mx-auto max-w-6xl px-6 py-24 sm:px-10 lg:px-12">
      <p className="font-label text-[10px] tracking-[0.14em] text-muted uppercase">The founder</p>
      <h2 className="mt-4 max-w-3xl text-3xl tracking-tight text-balance sm:text-4xl">
        Built by an operator. <span className="text-muted">Not a spectator.</span>
      </h2>

      <div className="relative isolate mt-12 overflow-hidden rounded-3xl border border-line bg-bg-raised/50">
        {/* dot grid and glow, gathered behind the portrait */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(var(--line)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_60%_80%_at_78%_55%,#000_30%,transparent_100%)] [background-size:24px_24px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute right-[-10%] bottom-[-30%] -z-10 aspect-square w-[70%] rounded-full bg-[radial-gradient(closest-side,rgb(var(--glow)/0.16),rgb(var(--glow)/0.05)_50%,transparent)]"
        />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />

        <div className="grid lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
          <div className="relative z-10 p-7 sm:p-10 lg:p-12 lg:pr-4">
            <p className="font-label text-[10px] tracking-[0.14em] text-accent uppercase">Founder, {facts.name}</p>
            <h3 className="mt-3 text-3xl tracking-tight sm:text-4xl">{facts.founder}</h3>
            <p className="mt-5 max-w-lg leading-relaxed text-muted">
              Andrea built a media network past 500,000 followers before turning what he learned into NovaEyes. Today the
              network has {facts.clippersLabel} clippers and has delivered hundreds of millions of views for brands, artists
              and creators.
            </p>

            <figure className="mt-10">
              <span aria-hidden className="block h-px w-10 bg-accent shadow-[0_0_10px_rgb(var(--glow))]" />
              <blockquote className="mt-5 max-w-lg font-display text-[22px] leading-snug font-semibold tracking-tight sm:text-[28px]">
                <span className="block">Anyone can make content.</span>
                <span className="block">We decide who sees it.</span>
              </blockquote>
            </figure>

            <dl className="mt-10 grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-line bg-line">
              {stats.map((s, i) => (
                <div key={s.label} className="flex flex-col-reverse justify-end bg-bg px-3 py-5 sm:px-5">
                  <dt className="mt-1.5 font-label text-[8px] leading-relaxed tracking-[0.1em] text-muted uppercase sm:text-[9px] sm:tracking-[0.12em]">{s.label}</dt>
                  <dd className="font-display text-xl font-bold tracking-tight sm:text-2xl">
                    <CountUp value={s.value} delay={i * 0.12} />
                  </dd>
                </div>
              ))}
            </dl>

            <Link href="/about" className="mt-8 inline-block font-display text-sm font-semibold text-accent transition-colors hover:text-fg">
              More about NovaEyes →
            </Link>
          </div>

          <div className="relative flex items-end justify-center px-8 pt-2 lg:px-0 lg:pt-20">
            {/* where and since when, in the status-line style of the engine diagrams */}
            <p className="absolute top-8 right-8 hidden items-center gap-2 font-label text-[9px] tracking-[0.14em] text-muted uppercase lg:flex">
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_8px_rgb(var(--glow))]" />
              {facts.location}, since {facts.foundingYear}
            </p>
            <FounderPortrait className="w-full max-w-sm lg:-ml-[14%] lg:w-[124%] lg:max-w-none" />
          </div>
        </div>
      </div>
    </section>
  );
}
