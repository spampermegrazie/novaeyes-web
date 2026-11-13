import type { Metadata } from "next";
import Link from "next/link";
import { facts } from "@/content/facts";
import { publicCampaigns } from "@/content/campaigns";
import { verticals } from "@/content/verticals";
import { homeFaqs } from "@/content/faqs";
import { heroClips } from "@/content/hero-clips";
import { Cta } from "@/components/cta";
import { JsonLd, faqJsonLd } from "@/components/json-ld";
import { ClipCurtainHero } from "@/components/ui/clip-curtain-hero";
import { ResultsShowcase } from "@/components/ui/results-showcase";
import { StudioTour } from "@/components/studio-tour";
import { FounderPortrait } from "@/components/founder-portrait";
import { StatsBand } from "@/components/stats-band";
import { EngineSteps, type EngineStep } from "@/components/ui/engine-steps";
import { ShinyButton } from "@/components/ui/shiny-button";
import { WhatIsNovaEyes } from "@/components/what-is-novaeyes";
import { FitCheck } from "@/components/fit-check";

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

const verticalBlurbs: Record<string, string> = {
  "/combat-sports-clipping": "Fight footage cut into thousands of highlight clips.",
  "/music-clipping": "Your song in thousands of clips, so people go and stream it.",
  "/podcast-clipping": "Episodes turned into clips that bring new listeners to the show.",
  "/logo-clipping": "Your logo and promo code on clips that already perform.",
  "/product-clipping": "Creators showing your product in new short clips.",
};

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
        <p className="font-label text-[10px] tracking-[0.14em] text-muted uppercase sm:text-xs sm:tracking-[0.18em]">{facts.tagline}</p>
        <h1 className="mx-auto mt-6 text-5xl leading-[1.02] font-bold tracking-tight text-balance sm:text-6xl lg:text-[64px]">
          Short-form reach, <br className="hidden md:block" />
          paid per verified view.
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

      {/* Stage 4: the studio. The whole operation in one picture, with a stop at every station. */}
      <section id="the-team">
        <div className="mx-auto max-w-6xl px-6 pb-24 sm:px-10 lg:px-12">
          <p className="font-label text-[10px] tracking-[0.14em] text-muted uppercase">The team</p>
          <h2 className="mt-4 mb-10 max-w-3xl text-3xl tracking-tight text-balance sm:text-4xl">
            See your new distribution team at work. <span className="text-muted">Eight stations, one loop.</span>
          </h2>
          <StudioTour />
        </div>
      </section>

      <section id="who-we-clip-for" className="mx-auto max-w-6xl px-6 pb-24 sm:px-10 lg:px-12">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Who we clip for</h2>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {verticals.map((v) => (
            <li key={v.path}>
              <Link href={v.path} className="block h-full rounded-2xl border border-line p-6 transition-colors hover:border-muted/40">
                <p className="font-display font-semibold">{v.h1}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">{verticalBlurbs[v.path]}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <FitCheck />

      <section id="clipping-vs-influencers" className="mx-auto max-w-6xl px-6 pb-24 sm:px-10 lg:px-12 *:max-w-3xl">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">How is clipping different from influencer marketing?</h2>
        <p className="mt-6 text-lg leading-relaxed text-muted">
          An influencer deal pays a fixed fee for one post from one creator, whether it works or not. A clipping campaign
          puts hundreds of creators on your content at once, and each one only earns when their clip gets real views. Your
          cost follows the results instead of a promise.
        </p>
      </section>

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

      {/* Stage 4: control panel */}
      <section id="faq" className="mx-auto max-w-6xl px-6 py-24 sm:px-10 lg:px-12 *:max-w-3xl">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Questions buyers ask</h2>
        <dl className="mt-10 divide-y divide-line border-y border-line">
          {homeFaqs.map((f) => (
            <div key={f.q} className="py-6">
              <dt className="font-display font-semibold">{f.q}</dt>
              <dd className="mt-2 leading-relaxed text-muted">{f.a}</dd>
            </div>
          ))}
        </dl>
        <Link href="/faq" className="mt-6 inline-block text-sm text-accent">
          All questions
        </Link>
      </section>

      {/* Stage 5: launch */}
      <Cta title="See what your budget buys" />
    </>
  );
}
