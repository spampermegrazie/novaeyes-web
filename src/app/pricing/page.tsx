import type { Metadata } from "next";
import Link from "next/link";
import { facts } from "@/content/facts";
import { publicCampaigns } from "@/content/campaigns";
import { Cta } from "@/components/cta";
import { ShinyButton } from "@/components/ui/shiny-button";
import { FeeSplit } from "@/components/pricing/fee-split";
import { ViewsCalculator } from "@/components/pricing/views-calculator";
import { JsonLd, faqJsonLd, breadcrumbJsonLd, serviceJsonLd } from "@/components/json-ld";

// Pricing, in the homepage's language: one idea per section, one picture per idea, every answer
// in the server HTML. What is public: the $3,000 minimum, pay per verified view, and a management
// fee that is a percentage of the budget, on top of it or taken out of it. What is not: the
// percentage itself, or any other fee.

const UPDATED = "2026-11-17";
const UPDATED_LABEL = "November 17, 2026";

export const metadata: Metadata = {
  title: "Clipping Agency Pricing: Cost, CPM and Fees",
  description: `Clipping campaigns start at ${facts.minimumBudgetLabel}. You pay per 1,000 verified views, plus a management fee on top of or inside the budget. Past CPMs: ${facts.cpmRangeLabel}.`,
  alternates: { canonical: "/pricing" },
};

const faqs = [
  {
    q: "How much does a clipping campaign cost?",
    a: `${facts.pricingSummary} You get the full cost in writing before anything is signed.`,
  },
  {
    q: "What is the minimum budget for a clipping campaign?",
    a: `${facts.minimumBudgetLabel}. Below that, there isn't enough budget for clippers to pick up the campaign and for us to learn what works.`,
  },
  {
    q: "Does NovaEyes charge a management fee?",
    a: "Yes. The management fee is a percentage of the budget and pays for running the campaign: strategy, the creative brief, managing the clipper network, reviewing every clip, verifying views and audience, the live dashboard and the reports.",
  },
  {
    q: "Is the management fee on top of the budget or taken out of it?",
    a: "Either, depending on the campaign's complexity, deadlines and scale. On top, the whole budget funds the view pool and the fee is added to it. Taken out, the fee comes out of the budget and the rest funds the view pool. Which one applies is agreed in writing before launch.",
  },
  {
    q: "What decides the management fee percentage?",
    a: "Three things: complexity (formats, platforms, countries, languages, audience targeting and brand rules), deadlines (a fixed launch date or a tight window) and scale (the size of the budget, and how many clippers, clips and markets the campaign runs on).",
  },
  {
    q: "Why isn't the exact percentage published?",
    a: "Because it is set per campaign. A one-market campaign with an open timeline takes less work than a launch across five countries tied to a release date, so the percentage is worked out for your campaign and agreed in writing before launch.",
  },
  {
    q: "What is CPM in clipping?",
    a: `CPM means cost per 1,000 views. At a $0.20 CPM, 1,000 verified views cost 20 cents, so a ${facts.minimumBudgetLabel} view pool buys about 15 million views.`,
  },
  {
    q: "What changes the CPM?",
    a: "Your content, your niche, the platforms, how tight your audience targeting is and how strict your brand rules are. Content with strong moments gets cheaper views because clippers can make more clips that spread.",
  },
  {
    q: "Do I pay for clips that get no views or miss my audience?",
    a: "No. The view pool only pays clippers for approved clips, per 1,000 verified views from your target audience. A clip that flops, or reaches the wrong audience, earns nothing from your pool.",
  },
  {
    q: "Is there a contract or retainer?",
    a: "No retainer and no monthly commitment. You fund the campaign you want and can scale up, pause or stop. If you stop early, what is left of the budget moves to a new campaign.",
  },
  {
    q: "Do you refund unspent budget?",
    a: `No. ${facts.noRefunds}`,
  },
  {
    q: "How fast does a campaign start?",
    a: facts.launchTime,
  },
];

const PARTS = [
  {
    n: "01",
    title: "The view pool",
    body: "Pays clippers per 1,000 verified views from the audience you choose. A clip that flops, or misses your audience, earns nothing.",
  },
  {
    n: "02",
    title: "The management fee",
    body: "A percentage of the budget, for running the campaign. It depends on complexity, deadlines and scale.",
  },
];

const COMPARE = [
  { name: "Clipping with NovaEyes", us: true, body: "You pay per verified view from your audience, plus a management fee. A clip that flops earns nothing from your pool." },
  { name: "Influencer deals", us: false, body: "You pay per post, up front, at the creator's rate. The post is paid for whatever it gets." },
  { name: "Paid social ads", us: false, body: "You pay what the auction asks, and the price moves with demand. On impression bidding, you pay for what was served." },
];

function Eyebrow({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <p className={`font-label text-[10px] tracking-[0.14em] text-muted uppercase ${className}`}>{children}</p>;
}

export default function Pricing() {
  const past = publicCampaigns
    .filter((c) => c.cpmUsd !== undefined)
    .sort((a, b) => a.cpmUsd! - b.cpmUsd!)
    .map((c) => ({ client: c.client, cpm: c.cpmUsd! }));
  const threeK = publicCampaigns.filter((c) => c.spendUsd === facts.minimumBudgetUsd);

  const offer = {
    ...serviceJsonLd(
      "Clipping campaigns",
      `Performance-based clipping campaigns on TikTok, Instagram Reels, YouTube Shorts and X. ${facts.pricingSummary}`,
      "/pricing",
    ),
    offers: {
      "@type": "Offer",
      url: `${facts.url}/pricing`,
      priceCurrency: "USD",
      priceSpecification: { "@type": "PriceSpecification", minPrice: facts.minimumBudgetUsd, priceCurrency: "USD" },
      description: facts.pricingSummary,
    },
  };

  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd data={offer} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Clipping agency pricing",
          url: `${facts.url}/pricing`,
          dateModified: UPDATED,
          about: { "@id": `${facts.url}/#organization` },
        }}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Pricing", path: "/pricing" },
        ])}
      />

      <article>
        {/* header: the answer, nothing else */}
        <header className="mx-auto max-w-6xl px-6 pt-16 pb-24 sm:px-10 lg:px-12 lg:pt-20 lg:pb-32">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-y-1 font-label text-[10px] tracking-[0.14em] text-muted uppercase">
            <Link href="/" className="transition-colors hover:text-fg">
              Home
            </Link>
            <span className="mx-2 text-muted/50">/</span>
            <span className="text-fg/80">Pricing</span>
          </nav>
          <h1 className="mt-8 max-w-3xl text-[2.6rem] leading-[1.02] font-bold tracking-tight text-balance min-[400px]:text-5xl sm:text-6xl">
            Clipping agency pricing. <span className="text-muted">From {facts.minimumBudgetLabel}, paid per verified view.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted">
            Campaigns start at {facts.minimumBudgetLabel}. Your view pool pays clippers per 1,000 verified views from your target audience, and a
            management fee, a percentage of the budget, pays for running it. You get the full cost in writing before anything is signed.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <ShinyButton href="/book">Get your exact cost</ShinyButton>
            <Link
              href="/reach-estimator"
              className="rounded-xl border border-line bg-bg/60 px-6 py-3 text-center font-display text-sm font-semibold backdrop-blur transition-colors hover:border-muted/50"
            >
              Estimate your reach
            </Link>
          </div>
          <p className="mt-8 text-xs text-muted/70">
            Updated <time dateTime={UPDATED}>{UPDATED_LABEL}</time>
          </p>
        </header>

        {/* how it is priced */}
        <section id="how-pricing-works" className="mx-auto max-w-6xl scroll-mt-24 px-6 pb-32 sm:px-10 lg:px-12">
          <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
            <div className="min-w-0">
              <Eyebrow>How it is priced</Eyebrow>
              <h2 className="mt-4 text-3xl tracking-tight text-balance sm:text-4xl">
                How is a campaign priced? <span className="text-muted">Two parts.</span>
              </h2>
              <ol className="mt-12 space-y-10">
                {PARTS.map((p) => (
                  <li key={p.n} className="grid grid-cols-[2.5rem_minmax(0,1fr)]">
                    <span className="font-label text-[10px] leading-7 tracking-[0.14em] text-accent">{p.n}</span>
                    <span>
                      <span className="block font-display text-lg font-semibold tracking-tight">{p.title}</span>
                      <span className="mt-2 block leading-relaxed text-muted">{p.body}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
            <FeeSplit />
          </div>
        </section>

        {/* what the minimum buys */}
        <section id="cpm" className="mx-auto max-w-6xl scroll-mt-24 px-6 pb-32 sm:px-10 lg:px-12">
          <div className="text-center">
            <Eyebrow>CPM</Eyebrow>
            <h2 className="mx-auto mt-4 max-w-3xl text-3xl tracking-tight text-balance sm:text-4xl">
              What does {facts.minimumBudgetLabel} buy? <span className="text-muted">It depends on the CPM.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl leading-relaxed text-muted">
              CPM is the cost per 1,000 views. At $0.20, a {facts.minimumBudgetLabel} view pool buys about 15 million views. Past campaigns ran{" "}
              {facts.cpmRangeLabel}.
            </p>
          </div>
          <div className="mt-14">
            <ViewsCalculator past={past} />
          </div>
          {threeK.length > 0 && (
            <p className="mx-auto mt-8 max-w-2xl text-center text-sm leading-relaxed text-muted">
              Real {facts.minimumBudgetLabel} campaigns:{" "}
              {threeK.map((c, i) => (
                <span key={c.slug}>
                  {i > 0 && (i === threeK.length - 1 ? " and " : ", ")}
                  <Link href={`/case-studies/${c.slug}`} className="text-fg underline decoration-line underline-offset-4 transition-colors hover:text-accent">
                    {c.client}, {c.viewsLabel} views
                  </Link>
                </span>
              ))}
              .
            </p>
          )}
        </section>

        {/* compared */}
        <section id="compare" className="mx-auto max-w-6xl scroll-mt-24 px-6 pb-32 sm:px-10 lg:px-12">
          <Eyebrow>Compared</Eyebrow>
          <h2 className="mt-4 max-w-3xl text-3xl tracking-tight text-balance sm:text-4xl">
            How does clipping pricing compare? <span className="text-muted">You pay for views, not posts.</span>
          </h2>
          <ul className="mt-14 grid gap-12 md:grid-cols-3 md:gap-10">
            {COMPARE.map((c) => (
              <li key={c.name}>
                <span
                  aria-hidden
                  className={`block h-px ${c.us ? "bg-gradient-to-r from-accent via-accent/40 to-transparent shadow-[0_0_12px_rgb(var(--glow)/0.6)]" : "bg-line"}`}
                />
                <h3 className={`mt-6 text-xl tracking-tight ${c.us ? "text-fg" : "text-fg/70"}`}>{c.name}</h3>
                <p className={`mt-3 leading-relaxed ${c.us ? "text-fg/80" : "text-muted"}`}>{c.body}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* FAQ */}
        <section id="faq" className="mx-auto max-w-6xl scroll-mt-24 px-6 pb-16 sm:px-10 lg:px-12">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-20">
            <div className="min-w-0 lg:sticky lg:top-28 lg:self-start">
              <Eyebrow>FAQ</Eyebrow>
              <h2 className="mt-4 text-3xl tracking-tight text-balance sm:text-4xl">
                Questions about pricing. <span className="text-muted">Short answers.</span>
              </h2>
              <Link href="/faq" className="mt-6 inline-block font-display text-sm font-semibold text-accent transition-colors hover:text-fg">
                All questions →
              </Link>
            </div>
            <div className="divide-y divide-line border-y border-line">
              {faqs.map((f, i) => (
                <details key={f.q} open={i === 0} className="group">
                  <summary className="flex cursor-pointer list-none items-start gap-4 py-6 font-display font-semibold [&::-webkit-details-marker]:hidden">
                    <span className="flex-1">{f.q}</span>
                    <span
                      aria-hidden
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-line text-base leading-none text-muted transition-[rotate,color,border-color] duration-300 group-open:rotate-45 group-open:border-accent/50 group-open:text-accent"
                    >
                      +
                    </span>
                  </summary>
                  <p className="-mt-2 pr-10 pb-6 leading-relaxed text-muted">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </article>
      <Cta
        title="Get your exact cost"
        body="Book a 15-minute call. You get the view pool, the fee and the full cost in writing before anything is signed."
      />
    </>
  );
}
