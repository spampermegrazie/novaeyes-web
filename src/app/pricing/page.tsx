import type { Metadata } from "next";
import Link from "next/link";
import { facts } from "@/content/facts";
import { publicCampaigns } from "@/content/campaigns";
import { Cta } from "@/components/cta";
import { ShinyButton } from "@/components/ui/shiny-button";
import { CountUp } from "@/components/ui/count-up";
import { FeeSplit } from "@/components/pricing/fee-split";
import { ViewsCalculator } from "@/components/pricing/views-calculator";
import { DashboardMock } from "@/components/pricing/dashboard-mock";
import { Eyebrow, FeeCovers, FeeDrivers, PayoutClips, CpmChart, CompareTable } from "@/components/pricing/pricing-visuals";
import { formatUsd } from "@/lib/estimator";
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

const STATS = [
  { value: facts.minimumBudgetLabel, label: "Minimum campaign" },
  { value: "$0.13", label: "Lowest past CPM, per 1,000 views" },
  { value: "15M", label: `Views a ${facts.minimumBudgetLabel} pool buys at a $0.20 CPM` },
  { value: "24h", label: "From onboarding call to live" },
];

const PARTS = [
  {
    n: "01",
    title: "The view pool",
    body: "Pays clippers per 1,000 verified views on approved clips, from the countries and audience you choose. Nothing else earns from it.",
  },
  {
    n: "02",
    title: "The management fee",
    body: "A percentage of the budget, paid to NovaEyes for running the campaign. Added on top of the budget or taken out of it.",
  },
];

export default function Pricing() {
  const past = publicCampaigns
    .filter((c) => c.cpmUsd !== undefined)
    .sort((a, b) => a.cpmUsd! - b.cpmUsd!)
    .map((c) => ({ client: c.client, cpm: c.cpmUsd! }));
  const chartRows = publicCampaigns
    .filter((c) => c.cpmUsd !== undefined)
    .sort((a, b) => a.cpmUsd! - b.cpmUsd!)
    .map((c) => ({
      slug: c.slug,
      client: c.client,
      category: c.category,
      viewsLabel: c.viewsLabel,
      cpm: c.cpmUsd!,
      spend: c.spendUsd ? formatUsd(c.spendUsd) : undefined,
    }));
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
        {/* page header, like the other inner pages: breadcrumb, answer, and where the money goes */}
        <header className="mx-auto max-w-6xl px-6 pt-16 pb-16 sm:px-10 lg:px-12 lg:pt-20">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-y-1 font-label text-[10px] tracking-[0.14em] text-muted uppercase">
            <Link href="/" className="transition-colors hover:text-fg">
              Home
            </Link>
            <span className="mx-2 text-muted/50">/</span>
            <span className="text-fg/80">Pricing</span>
          </nav>
          <div className="mt-6 grid grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:gap-16">
            <div className="min-w-0">
              <h1 className="text-[2.6rem] leading-[1.02] font-bold tracking-tight text-balance min-[400px]:text-5xl sm:text-6xl">
                Clipping agency pricing. <span className="text-muted">From {facts.minimumBudgetLabel}, paid per verified view.</span>
              </h1>
              <p className="mt-7 max-w-xl text-lg leading-relaxed text-fg/85">
                NovaEyes campaigns start at {facts.minimumBudgetLabel}. Your view pool pays clippers per 1,000 verified views from your target
                audience, and a management fee, a percentage of the budget, pays for running the campaign.
              </p>
              <p className="mt-4 max-w-xl leading-relaxed text-muted">
                The fee is added on top of the budget or taken out of it, depending on complexity, deadlines and scale. You get the full cost in
                writing before anything is signed.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <ShinyButton href="/book">Get your exact cost</ShinyButton>
                <Link
                  href="/reach-estimator"
                  className="rounded-xl border border-line bg-bg/60 px-6 py-3 text-center font-display text-sm font-semibold backdrop-blur transition-colors hover:border-muted/50"
                >
                  Estimate your reach
                </Link>
              </div>
              <p className="mt-6 text-xs text-muted">
                Updated <time dateTime={UPDATED}>{UPDATED_LABEL}</time>
              </p>
            </div>
            <DashboardMock />
          </div>
        </header>

        {/* the numbers, in the same panel as the homepage stats */}
        <section aria-label="Pricing in numbers" className="mx-auto max-w-6xl px-6 pb-24 sm:px-10 lg:px-12">
          <div className="relative overflow-hidden rounded-2xl border border-line bg-line">
            <span aria-hidden className="sb-sweep pointer-events-none absolute top-0 left-0 z-10 h-px w-1/4 bg-gradient-to-r from-transparent via-accent to-transparent" />
            <dl className="grid grid-cols-2 gap-px md:grid-cols-4">
              {STATS.map((s, i) => (
                <div key={s.label} className="group relative flex min-h-36 flex-col overflow-hidden bg-bg px-5 pt-6 pb-6 transition-colors duration-300 hover:bg-[#101016] sm:min-h-44 sm:px-6 sm:pt-7">
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-[radial-gradient(60%_100%_at_50%_100%,rgb(var(--glow)/0.12),transparent)] opacity-60 transition-opacity duration-300 group-hover:opacity-100"
                  />
                  <dt className="relative order-2 mt-1 text-sm text-muted">{s.label}</dt>
                  <dd className="relative order-1 font-display text-[28px] leading-tight font-bold tracking-tight sm:text-4xl lg:text-[44px]">
                    <CountUp value={s.value} delay={i * 0.12} />
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* how it is priced */}
        <section id="how-pricing-works" className="mx-auto max-w-6xl scroll-mt-24 px-6 pb-24 sm:px-10 lg:px-12">
          <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
            <div className="min-w-0">
              <Eyebrow>How it is priced</Eyebrow>
              <h2 className="mt-4 text-3xl tracking-tight text-balance sm:text-4xl">
                How is a campaign priced? <span className="text-muted">Two parts.</span>
              </h2>
              <ol className="mt-10 space-y-8">
                {PARTS.map((p) => (
                  <li key={p.n} className="grid grid-cols-[2.25rem_minmax(0,1fr)]">
                    <span className="font-label text-[10px] leading-7 tracking-[0.14em] text-accent">{p.n}</span>
                    <span>
                      <span className="block font-display text-lg font-semibold tracking-tight">{p.title}</span>
                      <span className="mt-1.5 block leading-relaxed text-muted">{p.body}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
            <FeeSplit />
          </div>
        </section>

        {/* what the fee covers */}
        <section id="fee-covers" className="mx-auto max-w-6xl scroll-mt-24 px-6 pb-24 sm:px-10 lg:px-12">
          <Eyebrow>Management fee</Eyebrow>
          <h2 className="mt-4 max-w-3xl text-3xl tracking-tight text-balance sm:text-4xl">
            What does the management fee cover? <span className="text-muted">Running the whole campaign.</span>
          </h2>
          <FeeCovers />
        </section>

        {/* what decides the fee */}
        <section id="management-fee" className="mx-auto max-w-6xl scroll-mt-24 px-6 pb-24 sm:px-10 lg:px-12">
          <Eyebrow>The percentage</Eyebrow>
          <h2 className="mt-4 max-w-3xl text-3xl tracking-tight text-balance sm:text-4xl">
            What decides the management fee? <span className="text-muted">Complexity, deadlines and scale.</span>
          </h2>
          <p className="mt-5 max-w-2xl leading-relaxed text-muted">
            The percentage, and whether it sits on top of the budget or inside it, is set per campaign and agreed in writing before launch.
          </p>
          <FeeDrivers />
        </section>

        {/* what the pool pays for */}
        <section id="what-gets-paid" className="mx-auto max-w-6xl scroll-mt-24 px-6 pb-24 sm:px-10 lg:px-12">
          <Eyebrow>The view pool</Eyebrow>
          <h2 className="mt-4 max-w-3xl text-3xl tracking-tight text-balance sm:text-4xl">
            What does the view pool pay for? <span className="text-muted">Only verified views from your audience.</span>
          </h2>
          <p className="mt-5 max-w-2xl leading-relaxed text-muted">
            Every clip is reviewed before it can earn, and every view is checked on the platform and against your countries and demos. A clip
            that misses any of it earns nothing, even if it goes viral.
          </p>
          <PayoutClips />
          <Link href="/how-it-works#budget" className="mt-12 inline-block font-display text-sm font-semibold text-accent transition-colors hover:text-fg">
            How views are verified →
          </Link>
        </section>

        {/* what the minimum buys */}
        <section id="cpm" className="mx-auto max-w-6xl scroll-mt-24 px-6 pb-24 sm:px-10 lg:px-12">
          <Eyebrow>CPM</Eyebrow>
          <h2 className="mt-4 max-w-3xl text-3xl tracking-tight text-balance sm:text-4xl">
            What does {facts.minimumBudgetLabel} buy? <span className="text-muted">It depends on the CPM.</span>
          </h2>
          <p className="mt-5 max-w-2xl leading-relaxed text-muted">
            CPM is the cost per 1,000 views. At a $0.20 CPM, a {facts.minimumBudgetLabel} view pool buys about 15 million views. Move the
            slider, or tap a past campaign to use its CPM.
          </p>
          <div className="mt-12">
            <ViewsCalculator past={past} />
          </div>
          {threeK.length > 0 && (
            <p className="mt-6 max-w-2xl text-sm leading-relaxed text-muted">
              Real {facts.minimumBudgetLabel} campaigns:{" "}
              {threeK.map((c, i) => (
                <span key={c.slug}>
                  {i > 0 && (i === threeK.length - 1 ? " and " : ", ")}
                  <Link href={`/case-studies/${c.slug}`} className="text-fg underline decoration-line underline-offset-4 transition-colors hover:text-accent">
                    {c.client}, {c.viewsLabel} views
                  </Link>
                </span>
              ))}
              . Past results, not a promise.
            </p>
          )}
        </section>

        {/* past CPMs */}
        <section id="past-cpms" className="mx-auto max-w-6xl scroll-mt-24 px-6 pb-24 sm:px-10 lg:px-12">
          <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
            <div className="min-w-0">
              <Eyebrow>Past campaigns</Eyebrow>
              <h2 className="mt-4 text-3xl tracking-tight text-balance sm:text-4xl">
                What did past campaigns cost? <span className="text-muted">{facts.cpmRangeLabel} per 1,000 views.</span>
              </h2>
              <p className="mt-5 leading-relaxed text-muted">
                What moves the CPM: your content, your niche, the platforms, how tight your audience targeting is and how strict your brand
                rules are. Content with strong moments gets cheaper views.
              </p>
              <Link href="/case-studies" className="mt-8 inline-block font-display text-sm font-semibold text-accent transition-colors hover:text-fg">
                All case studies →
              </Link>
            </div>
            <CpmChart rows={chartRows} />
          </div>
        </section>

        {/* compared */}
        <section id="compare" className="mx-auto max-w-6xl scroll-mt-24 px-6 pb-24 sm:px-10 lg:px-12">
          <Eyebrow>Compared</Eyebrow>
          <h2 className="mt-4 max-w-3xl text-3xl tracking-tight text-balance sm:text-4xl">
            How does clipping pricing compare? <span className="text-muted">You pay for views, not posts.</span>
          </h2>
          <CompareTable />
        </section>

        {/* FAQ */}
        <section id="faq" className="mx-auto max-w-6xl scroll-mt-24 px-6 pb-8 sm:px-10 lg:px-12">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-16">
            <div className="min-w-0 lg:sticky lg:top-28 lg:self-start">
              <Eyebrow>FAQ</Eyebrow>
              <h2 className="mt-4 text-3xl tracking-tight text-balance sm:text-4xl">
                Questions about pricing. <span className="text-muted">Short answers.</span>
              </h2>
              <Link href="/faq" className="mt-6 inline-block font-display text-sm font-semibold text-accent transition-colors hover:text-fg">
                All questions →
              </Link>
            </div>
            <div className="space-y-3">
              {faqs.map((f, i) => (
                <details key={f.q} open={i === 0} className="group rounded-2xl border border-line bg-bg-raised/40 transition-colors open:border-accent/30">
                  <summary className="flex cursor-pointer list-none items-start gap-4 p-5 font-display font-semibold sm:p-6 [&::-webkit-details-marker]:hidden">
                    <span className="font-label text-[10px] leading-6 tracking-[0.14em] text-accent">{String(i + 1).padStart(2, "0")}</span>
                    <span className="flex-1">{f.q}</span>
                    <span
                      aria-hidden
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-line text-base leading-none text-muted transition-[rotate,color,border-color] duration-300 group-open:rotate-45 group-open:border-accent/50 group-open:text-accent"
                    >
                      +
                    </span>
                  </summary>
                  <p className="-mt-2 px-5 pb-5 leading-relaxed text-muted sm:-mt-3 sm:pr-14 sm:pb-6 sm:pl-[3.75rem]">{f.a}</p>
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
