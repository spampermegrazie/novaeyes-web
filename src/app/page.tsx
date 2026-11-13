import type { Metadata } from "next";
import Link from "next/link";
import { facts } from "@/content/facts";
import { publicCampaigns } from "@/content/campaigns";
import { homeFaqs } from "@/content/faqs";
import { heroClips } from "@/content/hero-clips";
import { Cta } from "@/components/cta";
import { JsonLd, faqJsonLd } from "@/components/json-ld";
import { ClipCurtainHero } from "@/components/ui/clip-curtain-hero";
import { ResultsShowcase } from "@/components/ui/results-showcase";
import { FounderPortrait } from "@/components/founder-portrait";
import { StatsBand } from "@/components/stats-band";
import { EngineSteps, type EngineStep } from "@/components/ui/engine-steps";
import { ShinyButton } from "@/components/ui/shiny-button";
import { WhatIsNovaEyes } from "@/components/what-is-novaeyes";
import { FitCheck } from "@/components/fit-check";
import { WhoWeClipFor } from "@/components/who-we-clip-for";

// Every word on this page is in the server HTML. The hero animates its text in,
// but never injects it, so crawlers and AI tools read the full page.

const steps: [EngineStep, EngineStep, EngineStep] = [
  {
    title: "Set up",
    body: "You send us your video, your brand rules and your budget. We turn them into a brief for our clippers and set the payouts, so every clip sends people where you want them: Spotify, YouTube, your socials or your website.",
  },
  {
    title: "Distribute",
    body: "Our clippers take that brief, cut the best moments into short clips and post them across TikTok, Instagram Reels, YouTube Shorts and X, hundreds of times a day. Every clip is reviewed before it can earn.",
  },
  {
    title: "Feedback loop",
    body: "The views come back from the platforms and we verify them. You pay only for verified views on approved clips. Every day the budget moves to the clips and formats that win, and the loop runs again. You can watch it all in a live dashboard.",
  },
];

export const metadata: Metadata = {
  title: { absolute: "NovaEyes: Clipping Agency Paid Per Verified View" },
  description: `NovaEyes is a clipping agency with ${facts.clippersLabel} clippers posting your content on TikTok, Reels, Shorts and X. You pay only for verified views. From ${facts.minimumBudgetLabel}.`,
  alternates: { canonical: "/" },
};

export default function Home() {

  return (
    <>
      <JsonLd data={faqJsonLd(homeFaqs)} />

      {/* Stage 1: ignition. The clips part like a curtain as you scroll. */}
      <ClipCurtainHero clips={heroClips}>
        {/* The label sits inside the H1 so the main heading names the category for search. */}
        <h1>
          <span className="block font-label text-[10px] leading-normal font-normal tracking-[0.14em] text-muted uppercase sm:text-xs sm:tracking-[0.18em]">
            {facts.tagline}
          </span>
          <span className="sr-only">: </span>
          <span className="mx-auto mt-6 block text-5xl leading-[1.02] font-bold tracking-tight text-balance sm:text-6xl lg:text-[64px]">
            Short-form reach, <br className="hidden md:block" />
            paid per verified view.
          </span>
        </h1>
        <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-muted sm:text-lg">
          {facts.clippersLabel} clippers post your content across TikTok, Reels, Shorts and X. You pay only for the views
          that are verified.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <ShinyButton href="/book">Book a 15-minute reach audit</ShinyButton>
          <Link
            href="/reach-estimator"
            className="font-display font-semibold rounded-xl border border-line bg-bg/60 px-6 py-3 text-center text-sm backdrop-blur hover:border-muted/50"
          >
            Estimate your reach
          </Link>
        </div>
      </ClipCurtainHero>

      <StatsBand />

      <WhatIsNovaEyes />

      {/* Stage 2: the engine. Title, steps and diagram pin together as one unit. */}
      <section id="how-it-works">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:px-10 lg:px-12 lg:py-8">
          <EngineSteps
            steps={steps}
            intro={
              <div>
                <p className="font-label text-[10px] tracking-[0.14em] text-muted uppercase">The engine</p>
                <h2 className="mt-4 max-w-3xl text-3xl tracking-tight text-balance sm:text-4xl">
                  How a campaign works. <span className="text-muted">One video in, thousands of clips out.</span>
                </h2>
              </div>
            }
          />
          <Link
            href="/attention-monopoly-system#the-team"
            className="mt-10 inline-block font-display text-sm font-semibold text-accent transition-colors hover:text-fg lg:mt-6"
          >
            See the whole operation, station by station →
          </Link>
        </div>
      </section>

      {/* Stage 3: telemetry. Real campaigns, one at a time. */}
      <section id="results">
        <div className="mx-auto max-w-6xl px-6 py-24 sm:px-10 lg:px-12">
          <div className="mb-14 flex items-end justify-between gap-6">
            <div>
              <p className="font-label text-[10px] tracking-[0.14em] text-muted uppercase">Results</p>
              <h2 className="mt-4 max-w-3xl text-3xl tracking-tight text-balance sm:text-4xl">
                Results, in views. <span className="text-muted">Real campaigns, counted on the platforms.</span>
              </h2>
            </div>
            <Link href="/case-studies" className="hidden shrink-0 font-display text-sm font-medium text-muted hover:text-fg sm:inline">
              All case studies →
            </Link>
          </div>
          <ResultsShowcase campaigns={publicCampaigns} />
        </div>
      </section>

      <WhoWeClipFor />

      <FitCheck />

      <section id="founder">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-24 sm:px-10 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:gap-16 lg:px-12">
          <div className="order-2 lg:order-1">
            <p className="font-label text-[10px] tracking-[0.14em] text-muted uppercase">Built by operators, not spectators</p>
            <h2 className="mt-4 text-3xl tracking-tight sm:text-5xl">{facts.founder}</h2>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
              Andrea built a media network past 500,000 followers before turning what he learned into NovaEyes. Today the
              network has {facts.clippersLabel} clippers and has delivered hundreds of millions of views for brands, artists
              and creators.
            </p>
            <blockquote className="mt-10 border-l-2 border-accent pl-6 font-display text-2xl font-semibold sm:text-3xl">
              Anyone can make content. We decide who sees it.
            </blockquote>
            <Link href="/about" className="mt-8 inline-block font-display text-sm font-semibold text-accent hover:text-fg">
              More about NovaEyes →
            </Link>
          </div>
          <FounderPortrait className="order-1 mx-auto w-full max-w-md lg:order-2 lg:max-w-none" />
        </div>
      </section>

      {/* Stage 4: control panel. Three short answers, the rest live on /faq. */}
      <section id="faq" className="mx-auto max-w-6xl px-6 py-24 sm:px-10 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-16">
          <div>
            <p className="font-label text-[10px] tracking-[0.14em] text-muted uppercase">FAQ</p>
            <h2 className="mt-4 text-3xl tracking-tight text-balance sm:text-4xl">
              Questions buyers ask. <span className="text-muted">Short answers.</span>
            </h2>
            <Link href="/faq" className="mt-6 inline-block font-display text-sm font-semibold text-accent transition-colors hover:text-fg">
              All questions →
            </Link>
          </div>
          <dl className="space-y-3">
            {homeFaqs.map((f, i) => (
              <div key={f.q} className="rounded-2xl border border-line bg-bg-raised/40 p-5 sm:p-6">
                <dt className="flex gap-4 font-display font-semibold">
                  <span className="font-label text-[10px] leading-6 tracking-[0.14em] text-accent">{String(i + 1).padStart(2, "0")}</span>
                  {f.q}
                </dt>
                <dd className="mt-2 leading-relaxed text-muted sm:pl-9">{f.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Stage 5: launch */}
      <Cta title="See what your budget buys" />
    </>
  );
}
