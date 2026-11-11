import type { Metadata } from "next";
import Link from "next/link";
import { facts } from "@/content/facts";
import { publicCampaigns } from "@/content/campaigns";
import { verticals } from "@/content/verticals";
import { homeFaqs } from "@/content/faqs";
import { heroClips } from "@/content/hero-clips";
import { CampaignCard } from "@/components/campaign-card";
import { Cta } from "@/components/cta";
import { JsonLd, faqJsonLd } from "@/components/json-ld";
import { ClipCurtainHero } from "@/components/ui/clip-curtain-hero";
import { EngineSteps, type EngineStep } from "@/components/ui/engine-steps";

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
    title: "Optimize",
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
  const featured = publicCampaigns.slice(0, 3);

  return (
    <>
      <JsonLd data={faqJsonLd(homeFaqs)} />

      {/* Stage 1: ignition. The clips part like a curtain as you scroll. */}
      <ClipCurtainHero clips={heroClips}>
        <p className="text-[11px] tracking-[0.18em] text-muted uppercase sm:text-sm sm:tracking-[0.3em]">{facts.tagline}</p>
        <h1 className="mx-auto mt-6 text-5xl leading-[1.02] font-semibold tracking-tight text-balance sm:text-6xl lg:text-[64px]">
          Short-form reach, <br className="hidden md:block" />
          paid per verified view.
        </h1>
        <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-muted sm:text-lg">
          {facts.clippersLabel} clippers post your content across TikTok, Reels, Shorts and X. You pay only for the views
          that are verified.
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

      <section id="what-is-a-clipping-agency" className="mx-auto max-w-3xl px-4 pb-24 sm:px-6">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">What is a clipping agency?</h2>
        <p className="mt-6 text-lg leading-relaxed text-muted">
          A clipping agency takes your long videos, cuts the best moments into short clips and gets them posted by a large
          network of creators, called clippers, on their own TikTok, Instagram, YouTube and X pages. Instead of growing one
          account, your content shows up on hundreds of accounts at the same time.
        </p>
        <p className="mt-4 text-lg leading-relaxed text-muted">
          NovaEyes works on performance. You fund a view pool, our {facts.clippersLabel} clippers post, and you pay only for
          the views that are verified. Campaigns start at {facts.minimumBudgetLabel}.
        </p>
      </section>

      {/* Stage 2: the engine */}
      <section id="how-it-works" className="ne-hatch border-y border-line bg-bg-raised/40">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
          <div className="text-center">
            <p className="inline-block rounded-full border border-line bg-bg px-3 py-1 font-mono text-[11px] tracking-[0.18em] text-muted uppercase">
              The engine
            </p>
            <h2 className="mt-5 text-3xl font-semibold tracking-tight text-balance sm:text-5xl">
              How a campaign works
              <span className="block text-muted">One video in, thousands of clips out.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg text-muted">
              This is distribution, not a video editing service. You only pay for what performs.
            </p>
          </div>
          <div className="mt-16">
            <EngineSteps steps={steps} />
          </div>
        </div>
      </section>

      {/* Stage 3: telemetry */}
      <section id="results" className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <div className="flex items-end justify-between gap-6">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-5xl">Results, in views</h2>
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

      <section id="who-we-clip-for" className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Who we clip for</h2>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {verticals.map((v) => (
            <li key={v.path}>
              <Link href={v.path} className="block h-full rounded-2xl border border-line p-6 transition-colors hover:border-muted/40">
                <p className="font-medium">{v.h1}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">{verticalBlurbs[v.path]}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section id="clipping-vs-influencers" className="mx-auto max-w-3xl px-4 pb-24 sm:px-6">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">How is clipping different from influencer marketing?</h2>
        <p className="mt-6 text-lg leading-relaxed text-muted">
          An influencer deal pays a fixed fee for one post from one creator, whether it works or not. A clipping campaign
          puts hundreds of creators on your content at once, and each one only earns when their clip gets real views. Your
          cost follows the results instead of a promise.
        </p>
      </section>

      <section id="founder" className="border-y border-line bg-bg-raised">
        <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
          <p className="text-sm tracking-widest text-muted uppercase">Built by operators, not spectators</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">{facts.founder}</h2>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
            Andrea built a media network past 500,000 followers before turning what he learned into NovaEyes. Today the
            network has {facts.clippersLabel} clippers and has delivered hundreds of millions of views for brands, artists
            and creators.
          </p>
          <blockquote className="mt-10 border-l-2 border-accent pl-6 text-2xl font-medium sm:text-3xl">
            Anyone can make content. We decide who sees it.
          </blockquote>
          <Link href="/about" className="mt-8 inline-block text-sm text-accent">
            More about NovaEyes
          </Link>
        </div>
      </section>

      {/* Stage 4: control panel */}
      <section id="faq" className="mx-auto max-w-3xl px-4 py-24 sm:px-6">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Questions buyers ask</h2>
        <dl className="mt-10 divide-y divide-line border-y border-line">
          {homeFaqs.map((f) => (
            <div key={f.q} className="py-6">
              <dt className="font-medium">{f.q}</dt>
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
