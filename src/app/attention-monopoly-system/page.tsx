import type { Metadata } from "next";
import Link from "next/link";
import { facts } from "@/content/facts";
import { Cta } from "@/components/cta";
import { StudioTour } from "@/components/studio-tour";
import { JsonLd, faqJsonLd, breadcrumbJsonLd } from "@/components/json-ld";

// Ported from the live page (Lovable repo, src/pages/AttentionMonopolySystem.tsx) and rewritten in plain words.
// Dropped claims we can't back: guaranteed surface area, algorithms becoming irrelevant.

export const metadata: Metadata = {
  title: "The Attention Monopoly System",
  description:
    "The three steps behind every NovaEyes campaign: buy attention without ads, turn each strong moment into many clips, and post them on hundreds of pages.",
  alternates: { canonical: "/attention-monopoly-system" },
};

const steps = [
  {
    title: "Buy attention, without ads",
    body: `You fund a view pool, and our ${facts.clippersLabel} clippers are paid from it for every 1,000 verified views. You know roughly what reach your budget buys before you start, so you can plan around it instead of hoping.`,
    outcome: "Attention you can plan for",
  },
  {
    title: "Multiply every moment",
    body: "One good moment from a podcast, a fight or a song can become dozens of clips, each with a different hook, caption or cut. More versions means more chances for one of them to take off.",
    outcome: "One moment, many clips",
  },
  {
    title: "Fill the feed",
    body: "Those clips go out on hundreds of pages across TikTok, Instagram Reels, YouTube Shorts and X. Your audience keeps running into you, and every week builds on the one before.",
    outcome: "Hard to scroll past",
  },
];

const reasons = [
  {
    title: "Steady beats viral",
    body: "You don't need one post to blow up. You need reach that shows up every single week.",
  },
  {
    title: "Volume beats perfect",
    body: "The brands winning on short form aren't making one perfect video. They show up everywhere, all the time.",
  },
  {
    title: "Many pages beat one account",
    body: "When hundreds of pages post your clips, you don't depend on one account or one lucky day with the algorithm.",
  },
];

const youGet = [
  "A content engine that runs every week",
  "More usable clips from the content you already have",
  "Steady distribution that adds up over time",
  "A clear weekly rhythm of reports and decisions",
];

const forYou = [
  "You want steady attention, not one spike",
  "You are ready to run a system for more than a few days",
  "You want growth that builds over time",
  "You are a brand or creator who is serious about being seen",
];

const notForYou = [
  "You are hoping one viral post fixes everything",
  "You can't keep putting out content",
  "You only want to test it for a week",
  "You aren't ready to invest in momentum",
];

const faqs = [
  {
    q: "What is the Attention Monopoly System?",
    a: "It is the way NovaEyes runs every clipping campaign. Three steps: buy attention without ads, turn each strong moment into many clips, and post them on hundreds of pages so your audience keeps seeing you.",
  },
  {
    q: "Is this paid ads?",
    a: "No. Every view comes from organic posts on real creator pages. We don't run ads.",
  },
  {
    q: "Do I need a big audience?",
    a: "No. The clips go out on the clippers' pages, so your own follower count doesn't hold you back. The Sparkle campaign reached 4.7 million views in 3 days.",
  },
  {
    q: "How fast does it start working?",
    a: `${facts.launchTime} Most clients see clear traction in the first 2 to 3 weeks, and it keeps building from there.`,
  },
];

export default function AttentionMonopolySystem() {
  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "The Attention Monopoly System", path: "/attention-monopoly-system" },
        ])}
      />

      <article>
        <header className="mx-auto max-w-3xl px-4 pt-24 pb-10 sm:px-6">
          <nav aria-label="Breadcrumb" className="text-sm text-muted">
            <Link href="/" className="hover:text-fg">
              Home
            </Link>{" "}
            / <span>The Attention Monopoly System</span>
          </nav>
          <h1 className="mt-6 text-5xl font-bold tracking-tight sm:text-6xl">The Attention Monopoly System</h1>
          <p className="mt-6 text-lg leading-relaxed text-muted">
            This is how we run every NovaEyes campaign. Three steps: buy attention without ads, turn every strong moment into
            many clips, and post them on so many pages that your audience keeps running into you. The goal is steady
            attention every week, not one lucky viral post.
          </p>
        </header>

        {/* The studio: the whole operation in one picture, with a stop at every station. */}
        <section id="the-team" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-10 sm:px-10 lg:px-12">
          <p className="font-label text-[10px] tracking-[0.14em] text-muted uppercase">The team</p>
          <h2 className="mt-4 mb-10 max-w-3xl text-3xl tracking-tight text-balance sm:text-4xl">
            See your new distribution team at work. <span className="text-muted">Eight stations, one loop.</span>
          </h2>
          <StudioTour />
        </section>

        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <section className="py-10">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Why do most brands struggle for attention?</h2>
            <p className="mt-4 text-lg leading-relaxed text-muted">
              They post when they have time, hope something hits, and start again the next week. Sometimes it works. The
              problem is you can&apos;t plan around it. This system replaces that with something that runs every week
              whether or not one post goes viral.
            </p>
          </section>

          <section className="py-10">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">What are the three steps?</h2>
            <ol className="mt-6 space-y-4">
              {steps.map((s, i) => (
                <li key={s.title} className="rounded-2xl border border-line p-6">
                  <p className="font-label text-[11px] tracking-[0.14em] text-accent uppercase">Step {i + 1}</p>
                  <h3 className="mt-3 text-xl font-semibold">{s.title}</h3>
                  <p className="mt-3 leading-relaxed text-muted">{s.body}</p>
                  <p className="mt-4 text-sm">
                    <span className="text-muted">Result:</span> {s.outcome}
                  </p>
                </li>
              ))}
            </ol>
          </section>

          <section className="py-10">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Who posts the clips?</h2>
            <p className="mt-4 text-lg leading-relaxed text-muted">
              Our network of {facts.clippersLabel} clippers, posting across TikTok, Instagram, YouTube and X. Together their
              pages have more than {facts.stats[3].value.replace("+", "")} followers. They work from one brief, follow
              the same rules, and are only paid for approved clips that earn verified views.
            </p>
          </section>

          <section className="py-10">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Why does it work?</h2>
            <dl className="mt-6 grid gap-4 sm:grid-cols-3">
              {reasons.map((r) => (
                <div key={r.title} className="rounded-2xl border border-line p-5">
                  <dt className="font-display font-semibold">{r.title}</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-muted">{r.body}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="py-10">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">What do you get?</h2>
            <ul className="mt-4 space-y-2 text-lg text-muted">
              {youGet.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="text-accent">·</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="grid gap-10 py-10 sm:grid-cols-2">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">This is for you if</h2>
              <ul className="mt-4 space-y-2 text-muted">
                {forYou.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="text-accent">·</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-semibold tracking-tight">This is not for you if</h2>
              <ul className="mt-4 space-y-2 text-muted">
                {notForYou.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="text-muted">·</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="py-10">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Questions</h2>
            <dl className="mt-6 divide-y divide-line border-y border-line">
              {faqs.map((f) => (
                <div key={f.q} className="py-6">
                  <dt className="font-display font-semibold">{f.q}</dt>
                  <dd className="mt-2 leading-relaxed text-muted">{f.a}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>
      </article>
      <Cta />
    </>
  );
}
