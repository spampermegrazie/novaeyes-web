import type { Metadata } from "next";
import Link from "next/link";
import { facts } from "@/content/facts";
import { publicCampaigns } from "@/content/campaigns";
import { Cta } from "@/components/cta";
import { ShinyButton } from "@/components/ui/shiny-button";
import { JsonLd, faqJsonLd, breadcrumbJsonLd, serviceJsonLd } from "@/components/json-ld";
import { formatUsd } from "@/lib/estimator";

// Pricing. Written for buyers and for AI answers: every section opens with the direct answer.
// What is public: the $3,000 minimum, pay per verified view, and a management fee that is a percentage
// of the budget, on top of it or taken out of it. What is not: the percentage itself, or any other fee.

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

const AT_A_GLANCE = [
  { k: "Minimum campaign", v: facts.minimumBudgetLabel },
  { k: "You pay", v: "Per 1,000 views" },
  { k: "Management fee", v: "% of budget" },
  { k: "Past CPMs", v: facts.cpmRangeLabel },
  { k: "Retainer", v: "None" },
  { k: "Live within", v: "24 hours" },
];

const FEE_COVERS = [
  "Strategy and the creative brief",
  "Briefing and managing the clipper network",
  "Reviewing every clip before it can earn",
  "Verifying views and your target audience",
  "Live dashboard, weekly reports and a final report",
  "Moving budget to what works, every week",
];

const FEE_DRIVERS = [
  {
    n: "01",
    title: "Complexity",
    body: "How many formats, platforms, countries and languages the campaign runs in, how tight the audience targeting is and how strict the brand rules are. More moving parts means more briefing and more review.",
  },
  {
    n: "02",
    title: "Deadlines",
    body: "A campaign tied to a release, a fight night, a drop or a launch date needs clippers briefed and clips reviewed in a tighter window.",
  },
  {
    n: "03",
    title: "Scale",
    body: "The size of the budget and how many clippers, clips and markets the campaign runs on. Scale changes how much work a campaign takes and how it is run.",
  },
];

const CPM_FACTORS = [
  { title: "Your content", body: "Videos with strong moments, like a knockout, a hot take or a catchy hook, give clippers more to work with, and their clips spread further." },
  { title: "Your niche", body: "Some audiences share more than others. Music and combat sports tend to move fast." },
  { title: "The platforms", body: "Views cost more on some platforms than others, so the mix changes the average." },
  { title: "Your audience", body: "The tighter the targeting, the fewer views qualify. Locking a campaign to one country or a narrow age range can raise the CPM, but every view you pay for is one you wanted." },
  { title: "Your brand rules", body: "Strict rules mean fewer clips get approved. That keeps you safe, but it can raise the CPM." },
];

const COMPARE = {
  cols: ["Clipping with NovaEyes", "Influencer deals", "Paid social ads"],
  rows: [
    { k: "You pay for", v: ["Verified views from your audience, plus a management fee", "Posts, usually at a flat rate per post or package", "Impressions, clicks or actions, bought in an auction"] },
    { k: "Price set by", v: ["A CPM agreed before launch", "The creator's rate", "The auction, which moves with demand"] },
    { k: "If a post flops", v: ["The clipper earns nothing from your pool", "The post is already paid for", "On impression bidding, you pay for what was served"] },
    { k: "Who posts", v: ["Thousands of clipper pages", "One creator, or a handful", "Your own account, as an ad"] },
    { k: "Commitment", v: ["Per campaign, no retainer", "Per deal", "Ongoing, while the ads run"] },
  ],
};

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="font-label text-[10px] tracking-[0.14em] text-muted uppercase">{children}</p>;
}

function Check() {
  return (
    <svg viewBox="0 0 16 16" className="mt-1 h-4 w-4 shrink-0 text-accent" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="m3.5 8.5 3 3 6-7" />
    </svg>
  );
}

// Fee on top vs taken out, drawn against the same budget line. Not to scale, no percentage.
function FeeBars() {
  const rows = [
    {
      label: "Fee on top",
      pool: "84%",
      body: "The whole budget funds the view pool. The fee is added to it.",
    },
    {
      label: "Fee taken out",
      pool: "68%",
      body: "The fee comes out of the budget. The rest funds the view pool.",
    },
  ];
  return (
    <div className="rounded-2xl border border-line bg-bg-raised/40 p-6 sm:p-7">
      <h3 className="text-xl tracking-tight">On top, or taken out of the budget?</h3>
      <p className="mt-2 leading-relaxed text-muted">
        Both happen. Which one applies depends on the campaign&apos;s complexity, deadlines and scale, and is agreed in writing before launch.
      </p>
      <div className="relative mt-8" aria-hidden>
        {/* the budget line, shared by both rows */}
        <div className="absolute -top-5 bottom-0 left-[84%] w-px bg-fg/40">
          <span className="absolute -top-0.5 right-1.5 font-label text-[9px] tracking-[0.14em] whitespace-nowrap text-fg/70 uppercase">
            Your budget
          </span>
        </div>
        <div className="space-y-6">
          {rows.map((r) => (
            <div key={r.label}>
              <p className="font-label text-[10px] tracking-[0.14em] text-accent uppercase">{r.label}</p>
              <div className="mt-2 flex h-9 overflow-hidden rounded-lg">
                <div
                  className="flex items-center rounded-l-lg bg-gradient-to-r from-accent/45 to-accent/80 px-3 font-display text-xs font-semibold text-fg"
                  style={{ width: r.pool }}
                >
                  View pool
                </div>
                <div className="flex w-[16%] items-center justify-center rounded-r-lg border border-dashed border-accent/60 bg-accent/10 font-display text-xs font-semibold text-fg/80">
                  Fee
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        {rows.map((r) => (
          <li key={r.label} className="rounded-xl border border-line bg-bg px-4 py-3 text-sm leading-relaxed text-fg/85">
            <span className="font-display font-semibold">{r.label}.</span> {r.body}
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs text-muted">Illustration, not to scale. Your percentage is set per campaign.</p>
    </div>
  );
}

function millions(pool: number, cpm: number) {
  const m = pool / cpm / 1000;
  return `${m.toFixed(1).replace(/\.0$/, "")}M`;
}

export default function Pricing() {
  const withCpm = publicCampaigns.filter((c) => c.cpmUsd !== undefined).sort((a, b) => a.cpmUsd! - b.cpmUsd!);
  const threeK = publicCampaigns.filter((c) => c.spendUsd === facts.minimumBudgetUsd);
  const low = withCpm[0];
  const high = withCpm[withCpm.length - 1];
  const pool = facts.minimumBudgetUsd;
  const examples = [
    { cpm: low.cpmUsd!, note: `Lowest past CPM, ${low.client}` },
    { cpm: 0.2, note: "Example rate" },
    { cpm: high.cpmUsd!, note: `Highest past CPM, ${high.client}` },
  ];

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
      priceSpecification: {
        "@type": "PriceSpecification",
        minPrice: facts.minimumBudgetUsd,
        priceCurrency: "USD",
      },
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
        {/* hero: the answer first */}
        <header className="mx-auto max-w-6xl px-6 pt-16 pb-16 sm:px-10 lg:px-12 lg:pt-20">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-y-1 font-label text-[10px] tracking-[0.14em] text-muted uppercase">
            <Link href="/" className="transition-colors hover:text-fg">
              Home
            </Link>
            <span className="mx-2 text-muted/50">/</span>
            <span className="text-fg/80">Pricing</span>
          </nav>
          <h1 className="mt-6 max-w-4xl text-[2.6rem] leading-[1.02] font-bold tracking-tight text-balance min-[400px]:text-5xl sm:text-6xl">
            Clipping agency pricing. <span className="text-muted">From {facts.minimumBudgetLabel}, paid per verified view.</span>
          </h1>
          <div className="mt-7 grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-start">
            <div className="min-w-0">
              <p className="max-w-2xl text-lg leading-relaxed text-fg/85">
                NovaEyes clipping campaigns start at {facts.minimumBudgetLabel}. Every campaign has two costs: a view pool that pays clippers per
                1,000 verified views from your target audience, and a management fee for running the campaign. The fee is a percentage of the
                budget, added on top of it or taken out of it, depending on the campaign&apos;s complexity, deadlines and scale.
              </p>
              <p className="mt-4 max-w-2xl leading-relaxed text-muted">
                You get the full cost in writing before anything is signed. There is no retainer, clips that miss your audience are not paid, and
                past campaigns ran {facts.cpmRangeLabel} per 1,000 views.
              </p>
              <p className="mt-5 text-xs text-muted">
                Updated <time dateTime={UPDATED}>{UPDATED_LABEL}</time>
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ShinyButton href="/book">Get your exact cost</ShinyButton>
                <Link
                  href="/reach-estimator"
                  className="rounded-xl border border-line bg-bg/60 px-6 py-3 text-center font-display text-sm font-semibold backdrop-blur transition-colors hover:border-muted/50"
                >
                  Estimate your reach
                </Link>
              </div>
            </div>
            <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line">
              {AT_A_GLANCE.map((f) => (
                <div key={f.k} className="flex min-w-0 flex-col justify-between bg-bg px-5 py-5">
                  <dt className="text-xs text-muted">{f.k}</dt>
                  <dd className="mt-1.5 font-display text-lg font-bold tracking-tight sm:text-2xl">{f.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </header>

        {/* the two costs */}
        <section id="how-pricing-works" className="mx-auto max-w-6xl scroll-mt-24 px-6 pb-24 sm:px-10 lg:px-12">
          <Eyebrow>How it is priced</Eyebrow>
          <h2 className="mt-4 max-w-3xl text-3xl tracking-tight text-balance sm:text-4xl">
            How is a clipping campaign priced? <span className="text-muted">A view pool and a management fee.</span>
          </h2>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-line bg-bg-raised/40 p-6 sm:p-7">
              <p className="font-label text-[10px] tracking-[0.14em] text-accent">01</p>
              <h3 className="mt-3 text-xl tracking-tight">The view pool pays the clippers</h3>
              <p className="mt-2 leading-relaxed text-muted">
                Each clipper earns per 1,000 verified views on clips we approved, from the countries and audience you chose. A clip that is not
                approved, can&apos;t be verified or misses your audience earns nothing. When the pool is spent, the campaign is done. Budgets are not
                refunded: if you stop early, what is left moves to a new campaign.
              </p>
              <Link href="/how-it-works#budget" className="mt-5 inline-block font-display text-sm font-semibold text-accent transition-colors hover:text-fg">
                How views are verified →
              </Link>
            </div>
            <div className="rounded-2xl border border-accent/40 bg-accent/[0.05] p-6 shadow-[0_0_40px_rgb(var(--glow)/0.08)] sm:p-7">
              <p className="font-label text-[10px] tracking-[0.14em] text-accent">02</p>
              <h3 className="mt-3 text-xl tracking-tight">The management fee pays for running it</h3>
              <p className="mt-2 leading-relaxed text-muted">A percentage of the budget. It covers:</p>
              <ul className="mt-4 space-y-2">
                {FEE_COVERS.map((f) => (
                  <li key={f} className="flex gap-3 leading-relaxed text-fg/85">
                    <Check />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-4">
            <FeeBars />
          </div>
        </section>

        {/* what decides the fee */}
        <section id="management-fee" className="mx-auto max-w-6xl scroll-mt-24 px-6 pb-24 sm:px-10 lg:px-12">
          <Eyebrow>Management fee</Eyebrow>
          <h2 className="mt-4 max-w-3xl text-3xl tracking-tight text-balance sm:text-4xl">
            What decides the management fee? <span className="text-muted">Complexity, deadlines and scale.</span>
          </h2>
          <p className="mt-5 max-w-2xl leading-relaxed text-muted">
            The percentage, and whether it sits on top of the budget or inside it, is set per campaign. These are the three things that move it.
          </p>
          <ol className="mt-10 grid gap-4 md:grid-cols-3">
            {FEE_DRIVERS.map((d) => (
              <li key={d.n} className="rounded-2xl border border-line bg-bg-raised/40 p-6 sm:p-7">
                <p className="font-label text-[10px] tracking-[0.14em] text-accent">{d.n}</p>
                <h3 className="mt-3 text-xl tracking-tight">{d.title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{d.body}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* what the minimum buys */}
        <section id="minimum" className="mx-auto max-w-6xl scroll-mt-24 px-6 pb-24 sm:px-10 lg:px-12">
          <Eyebrow>The minimum</Eyebrow>
          <h2 className="mt-4 max-w-3xl text-3xl tracking-tight text-balance sm:text-4xl">
            What does {facts.minimumBudgetLabel} get you? <span className="text-muted">Two past campaigns at that budget.</span>
          </h2>
          <ul className="mt-10 grid gap-4 md:grid-cols-2">
            {threeK.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/case-studies/${c.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-line bg-bg-raised/40 p-6 transition-[border-color,background-color] duration-300 hover:border-accent/50 hover:bg-bg-raised/70 sm:p-7"
                >
                  <span className="font-label text-[10px] tracking-[0.14em] text-muted uppercase">{c.category}</span>
                  <span className="mt-3 flex items-center justify-between gap-2 font-display text-xl font-semibold tracking-tight">
                    {c.client}
                    <span className="text-muted transition-[color,translate] duration-300 group-hover:translate-x-0.5 group-hover:text-accent" aria-hidden>
                      →
                    </span>
                  </span>
                  <span className="mt-5 flex flex-wrap items-baseline gap-x-6 gap-y-2">
                    <span>
                      <span className="block font-display text-4xl font-bold tabular-nums">{c.viewsLabel}</span>
                      <span className="text-xs text-muted">verified views</span>
                    </span>
                    {c.cpmUsd !== undefined && (
                      <span>
                        <span className="block font-display text-4xl font-bold tabular-nums">${c.cpmUsd.toFixed(2)}</span>
                        <span className="text-xs text-muted">per 1,000 views</span>
                      </span>
                    )}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted">
            Past results, not a promise. Your number depends on your content, your niche and your audience.
          </p>
        </section>

        {/* CPM */}
        <section id="cpm" className="mx-auto max-w-6xl scroll-mt-24 px-6 pb-24 sm:px-10 lg:px-12">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
            <div className="min-w-0">
              <Eyebrow>CPM</Eyebrow>
              <h2 className="mt-4 text-3xl tracking-tight text-balance sm:text-4xl">
                What is CPM in clipping? <span className="text-muted">The cost per 1,000 views.</span>
              </h2>
              <p className="mt-5 leading-relaxed text-fg/85">
                CPM is what 1,000 verified views cost. At a $0.20 CPM, 1,000 views cost 20 cents, so a {facts.minimumBudgetLabel} view pool buys
                about 15 million views.
              </p>
              <p className="mt-4 leading-relaxed text-muted">
                We agree a target CPM before launch, then watch it every week and move budget to the clips and pages that bring views in
                cheapest. If the fee is taken out of the budget, the view pool is smaller than the budget, and the views scale with the pool.
              </p>
            </div>
            <div className="min-w-0 rounded-2xl border border-line bg-bg-raised/40 p-6 sm:p-7">
              <p className="font-[family-name:var(--font-geist-mono)] text-xs text-muted">views = view pool ÷ CPM × 1,000</p>
              <ul className="mt-5 space-y-2.5">
                {examples.map((e) => (
                  <li key={e.cpm} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 rounded-lg border border-line bg-bg px-4 py-3">
                    <span className="min-w-0">
                      <span className="block font-display text-sm font-semibold tabular-nums">
                        {formatUsd(pool)} at ${e.cpm.toFixed(2)}
                      </span>
                      <span className="text-xs text-muted">{e.note}</span>
                    </span>
                    <span className="font-display text-2xl font-bold text-accent tabular-nums">{millions(pool, e.cpm)} views</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-muted">View pool only. Arithmetic, not a forecast.</p>
            </div>
          </div>
        </section>

        {/* what moves the CPM */}
        <section id="cpm-factors" className="mx-auto max-w-6xl scroll-mt-24 px-6 pb-24 sm:px-10 lg:px-12">
          <Eyebrow>What moves the CPM</Eyebrow>
          <h2 className="mt-4 max-w-3xl text-3xl tracking-tight text-balance sm:text-4xl">
            What makes views cheaper or more expensive? <span className="text-muted">Five things.</span>
          </h2>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CPM_FACTORS.map((f) => (
              <li key={f.title} className="rounded-2xl border border-line bg-bg-raised/40 p-6">
                <h3 className="text-lg tracking-tight">{f.title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{f.body}</p>
              </li>
            ))}
            <li className="flex flex-col justify-between rounded-2xl border border-accent/40 bg-accent/[0.05] p-6">
              <p className="leading-relaxed text-fg/85">Want a number for your niche and your market?</p>
              <Link href="/reach-estimator" className="mt-4 font-display text-sm font-semibold text-accent transition-colors hover:text-fg">
                Run the reach estimator →
              </Link>
            </li>
          </ul>
        </section>

        {/* past CPMs */}
        <section id="past-cpms" className="mx-auto max-w-6xl scroll-mt-24 px-6 pb-24 sm:px-10 lg:px-12">
          <Eyebrow>Past campaigns</Eyebrow>
          <h2 className="mt-4 max-w-3xl text-3xl tracking-tight text-balance sm:text-4xl">
            What did past clipping campaigns cost? <span className="text-muted">{facts.cpmRangeLabel} per 1,000 views.</span>
          </h2>
          <div className="mt-10 overflow-x-auto rounded-2xl border border-line">
            <table className="w-full min-w-[560px] text-left text-sm">
              <caption className="sr-only">Cost per 1,000 views on past NovaEyes clipping campaigns</caption>
              <thead className="border-b border-line bg-bg-raised/40">
                <tr className="font-label text-[10px] tracking-[0.14em] text-muted uppercase">
                  <th scope="col" className="px-5 py-3.5 font-normal">Campaign</th>
                  <th scope="col" className="px-5 py-3.5 font-normal">Type</th>
                  <th scope="col" className="px-5 py-3.5 font-normal">Views</th>
                  <th scope="col" className="px-5 py-3.5 font-normal">Budget</th>
                  <th scope="col" className="px-5 py-3.5 font-normal">CPM</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {withCpm.map((c) => (
                  <tr key={c.slug} className="transition-colors hover:bg-bg-raised/40">
                    <th scope="row" className="px-5 py-4 text-left font-display font-semibold">
                      <Link href={`/case-studies/${c.slug}`} className="transition-colors hover:text-accent">
                        {c.client}
                      </Link>
                    </th>
                    <td className="px-5 py-4 text-muted">{c.category}</td>
                    <td className="px-5 py-4 font-display font-semibold tabular-nums">{c.viewsLabel}</td>
                    <td className="px-5 py-4 font-display font-semibold tabular-nums">{c.spendUsd ? formatUsd(c.spendUsd) : <span className="font-sans font-normal text-muted">Not public</span>}</td>
                    <td className="px-5 py-4 font-display font-semibold text-accent tabular-nums">${c.cpmUsd!.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-muted">
            CPMs as published in each{" "}
            <Link href="/case-studies" className="text-fg underline decoration-line underline-offset-4 hover:text-accent">
              case study
            </Link>
            .
          </p>
        </section>

        {/* compared */}
        <section id="compare" className="mx-auto max-w-6xl scroll-mt-24 px-6 pb-24 sm:px-10 lg:px-12">
          <Eyebrow>Compared</Eyebrow>
          <h2 className="mt-4 max-w-3xl text-3xl tracking-tight text-balance sm:text-4xl">
            How does clipping pricing compare? <span className="text-muted">Against influencer deals and paid ads.</span>
          </h2>
          <p className="mt-5 max-w-2xl leading-relaxed text-muted">
            The difference is what you pay for. Clipping pays per verified view, influencer deals pay per post, and paid social pays for what the
            auction serves.
          </p>
          <div className="mt-10 overflow-x-auto rounded-2xl border border-line">
            <table className="w-full min-w-[680px] text-left text-sm">
              <caption className="sr-only">Clipping pricing compared with influencer deals and paid social ads</caption>
              <thead className="border-b border-line bg-bg-raised/40">
                <tr>
                  <td className="w-[18%] px-5 py-3.5" />
                  {COMPARE.cols.map((c, i) => (
                    <th
                      key={c}
                      scope="col"
                      className={`px-5 py-3.5 font-display text-sm font-semibold ${i === 0 ? "text-accent" : "text-fg/80"}`}
                    >
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {COMPARE.rows.map((r) => (
                  <tr key={r.k}>
                    <th scope="row" className="px-5 py-4 align-top font-label text-[10px] font-normal tracking-[0.14em] text-muted uppercase">
                      {r.k}
                    </th>
                    {r.v.map((v, i) => (
                      <td key={i} className={`px-5 py-4 align-top leading-relaxed ${i === 0 ? "bg-accent/[0.04] text-fg" : "text-muted"}`}>
                        {v}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="mx-auto max-w-6xl scroll-mt-24 px-6 pb-16 sm:px-10 lg:px-12">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-16">
            <div className="min-w-0 lg:sticky lg:top-28 lg:self-start">
              <Eyebrow>FAQ</Eyebrow>
              <h2 className="mt-4 text-3xl tracking-tight text-balance sm:text-4xl">
                Questions about pricing. <span className="text-muted">Short answers.</span>
              </h2>
              <p className="mt-5 leading-relaxed text-muted">
                More on how campaigns run in{" "}
                <Link href="/how-it-works" className="text-fg underline decoration-line underline-offset-4 hover:text-accent">
                  how it works
                </Link>{" "}
                and the{" "}
                <Link href="/faq" className="text-fg underline decoration-line underline-offset-4 hover:text-accent">
                  full FAQ
                </Link>
                .
              </p>
              <div className="mt-8">
                <ShinyButton href="/book" className="px-6 py-3 text-sm">
                  Get your exact cost
                </ShinyButton>
              </div>
            </div>
            <dl className="space-y-3">
              {faqs.map((f, i) => (
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
      </article>
      <Cta />
    </>
  );
}
