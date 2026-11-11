import Link from "next/link";
import { facts, verticalLinks } from "@/content/facts";
import { publicCampaigns } from "@/content/campaigns";
import { CampaignCard } from "@/components/campaign-card";
import { Cta } from "@/components/cta";
import { JsonLd, faqJsonLd } from "@/components/json-ld";
import { homeFaqs } from "@/content/faqs";
import { heroClips } from "@/content/hero-clips";
import { ClipCurtainHero } from "@/components/ui/clip-curtain-hero";

// Every word on this page is in the server HTML. The scroll stages (task: design
// pass) animate these sections; they never inject content, so crawlers read it all.

const steps = [
  { title: "Fund a view pool", body: `Set a budget from ${facts.minimumBudgetLabel}. You only pay for views that are verified.` },
  {
    title: `${facts.clippersLabel} clippers go to work`,
    body: `Clippers cut your content into short-form clips and post them on ${facts.platforms.join(", ")}.`,
  },
  { title: "Track every view", body: "Views are tracked per clip in a campaign dashboard you can open anytime." },
];

export default function Home() {
  const featured = publicCampaigns.slice(0, 3);

  return (
    <>
      <JsonLd data={faqJsonLd(homeFaqs)} />

      {/* Stage 1: ignition. Clips split from behind the headline, then drift as you scroll. */}
      <ClipCurtainHero clips={heroClips}>
        <p className="text-[11px] tracking-[0.18em] text-muted uppercase sm:text-sm sm:tracking-[0.3em]">{facts.tagline}</p>
        <h1 className="mx-auto mt-6 text-5xl leading-[1.02] font-semibold tracking-tight text-balance sm:text-6xl lg:text-[64px]">
          Short-form reach, <br className="hidden md:block" />
          paid per verified view.
        </h1>
        <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-muted sm:text-lg">
          {facts.clippersLabel} clippers post your content across TikTok, Reels, Shorts and X. You pay only for the
          views that are verified.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/book"
            className="rounded-full bg-accent px-6 py-3 text-center text-sm font-medium text-accent-ink shadow-[0_0_32px_rgb(var(--glow)/0.35)] hover:opacity-90"
          >
            Book a 15-minute reach audit
          </Link>
          <Link
            href="/reach-estimator"
            className="rounded-full border border-line bg-bg/60 px-6 py-3 text-center text-sm backdrop-blur hover:border-muted/50"
          >
            Estimate your reach
          </Link>
        </div>
      </ClipCurtainHero>

      <section aria-label="NovaEyes in numbers" className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-4">
          {facts.stats.map((s) => (
            <div key={s.label} className="bg-bg px-6 py-8">
              <dd className="font-mono text-3xl font-semibold tracking-tight">{s.value}</dd>
              <dt className="mt-1 text-sm text-muted">{s.label}</dt>
            </div>
          ))}
        </dl>
      </section>

      {/* Stage 2: the network */}
      <section id="network" className="border-y border-line bg-bg-raised">
        <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
          <h2 className="max-w-3xl text-3xl font-semibold tracking-tight sm:text-5xl">
            One piece of content. {facts.clippersLabel} clippers. Four platforms at once.
          </h2>
          <ol className="mt-14 grid gap-6 md:grid-cols-3">
            {steps.map((s, i) => (
              <li key={s.title} className="rounded-2xl border border-line bg-bg p-6">
                <p className="font-mono text-sm text-accent">0{i + 1}</p>
                <h3 className="mt-4 text-lg font-medium">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Stage 3: telemetry */}
      <section id="telemetry" className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <div className="flex items-end justify-between gap-6">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-5xl">Results, in views.</h2>
          <Link href="/case-studies" className="hidden text-sm text-muted hover:text-fg sm:inline">
            All case studies
          </Link>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {featured.map((c) => (
            <CampaignCard key={c.slug} campaign={c} />
          ))}
        </div>
      </section>

      <section id="verticals" className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <h2 className="text-2xl font-semibold tracking-tight">Clipping for</h2>
        <ul className="mt-6 flex flex-wrap gap-3">
          {verticalLinks.map((v) => (
            <li key={v.href}>
              <Link href={v.href} className="inline-block rounded-full border border-line px-5 py-2 text-sm hover:border-muted/50">
                {v.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section id="founder" className="border-y border-line bg-bg-raised">
        <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
          <p className="text-sm tracking-widest text-muted uppercase">Built by operators, not spectators</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">{facts.founder}</h2>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
            Andrea built a media network to over 500K followers before turning everything he learned into NovaEyes, a
            distribution engine now powering {facts.clippersLabel}+ creators and hundreds of millions of views for the brands
            and creators he works with.
          </p>
          <blockquote className="mt-10 border-l-2 border-accent pl-6 text-2xl font-medium sm:text-3xl">
            Anyone can make content. We decide who sees it.
          </blockquote>
        </div>
      </section>

      {/* Stage 4: control panel */}
      <section id="control-panel" className="mx-auto max-w-6xl px-4 pb-8 sm:px-6">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-5xl">Questions buyers ask</h2>
        <dl className="mt-10 divide-y divide-line border-y border-line">
          {homeFaqs.map((f) => (
            <div key={f.q} className="py-6">
              <dt className="font-medium">{f.q}</dt>
              <dd className="mt-2 max-w-3xl text-muted">{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Stage 5: launch */}
      <Cta title="Ready when you are" />
    </>
  );
}
