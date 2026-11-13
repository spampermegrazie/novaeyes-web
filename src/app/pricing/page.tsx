import type { Metadata } from "next";
import Link from "next/link";
import { facts } from "@/content/facts";
import { publicCampaigns } from "@/content/campaigns";
import { Cta } from "@/components/cta";
import { JsonLd, faqJsonLd, breadcrumbJsonLd } from "@/components/json-ld";
import { formatUsd } from "@/lib/estimator";

export const metadata: Metadata = {
  title: "Clipping Agency Pricing: What a Campaign Costs",
  description: `What a clipping campaign costs. You pay per 1,000 verified views, campaigns start at ${facts.minimumBudgetLabel}, and past campaigns ran $0.13 to $0.41 per 1,000 views.`,
  alternates: { canonical: "/pricing" },
};

const faqs = [
  {
    q: "How much does a clipping campaign cost?",
    a: `NovaEyes campaigns start at ${facts.minimumBudgetLabel}. You pay per 1,000 verified views, so your budget decides how many views you buy.`,
  },
  {
    q: "What is CPM in clipping?",
    a: "CPM means cost per 1,000 views. At a $0.20 CPM, 1,000 verified views cost 20 cents, so $3,000 buys about 15 million views.",
  },
  {
    q: "What changes the CPM?",
    a: "Mostly the niche, how easy your content is to clip, which platforms the campaign runs on and how strict the brand rules are. Content with strong moments gets cheaper views because clippers can make more clips that spread.",
  },
  {
    q: "Is the view pool the full cost?",
    a: "The view pool is what pays the clippers. Your full cost, including our fee for running the campaign, is set out in writing before anything is signed.",
  },
  {
    q: "Do I pay for clips that get no views?",
    a: "No. Clippers are only paid for approved clips, per 1,000 verified views from your target audience. A clip that flops, or reaches the wrong audience, costs you nothing.",
  },
  {
    q: "Is there a contract or retainer?",
    a: "No retainer and no monthly commitment. You fund the campaign you want and can scale up, pause or stop.",
  },
  {
    q: "What happens to budget that isn't spent?",
    a: "It rolls into your next campaign or is refunded, depending on your agreement.",
  },
];

export default function Pricing() {
  const withCpm = publicCampaigns.filter((c) => c.cpmUsd !== undefined).sort((a, b) => a.cpmUsd! - b.cpmUsd!);
  const threeK = publicCampaigns.filter((c) => c.spendUsd === 3_000);

  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Pricing", path: "/pricing" }])} />

      <section className="mx-auto max-w-3xl px-4 pt-24 pb-10 sm:px-6">
        <nav aria-label="Breadcrumb" className="text-sm text-muted">
          <Link href="/" className="hover:text-fg">
            Home
          </Link>{" "}
          / <span>Pricing</span>
        </nav>
        <h1 className="mt-6 text-5xl font-bold tracking-tight sm:text-6xl">Clipping pricing</h1>
        <p className="mt-6 text-lg leading-relaxed text-muted">
          You pay per 1,000 verified views. Your budget goes into a view pool, and clippers are paid from it as their clips
          earn views. When the pool is spent, the campaign is done. Campaigns start at {facts.minimumBudgetLabel}.
        </p>
        <p className="mt-4 text-lg leading-relaxed text-muted">
          There is no retainer and no charge for clips that don&apos;t perform. Across our past campaigns, the cost ran from
          $0.13 to $0.41 per 1,000 views.
        </p>
      </section>

      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <section className="py-10">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">What does {facts.minimumBudgetLabel} get you?</h2>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            {threeK.length > 0 ? (
              <>
                Past {facts.minimumBudgetLabel} campaigns reached{" "}
                {threeK.map((c, i) => (
                  <span key={c.slug}>
                    {i > 0 && (i === threeK.length - 1 ? " and " : ", ")}
                    <Link href={`/case-studies/${c.slug}`} className="text-fg underline decoration-line underline-offset-4 hover:text-accent">
                      {c.viewsLabel} views for {c.client}
                    </Link>
                  </span>
                ))}
                .{" "}
              </>
            ) : null}
            Your number depends on the content and the niche, so take these as past results, not a promise.
          </p>
        </section>

        <section className="py-10">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">How is the price worked out?</h2>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            Everything is priced in CPM, the cost per 1,000 views. If your campaign runs at a $0.20 CPM, every 1,000 verified
            views costs 20 cents. A {facts.minimumBudgetLabel} budget at that rate buys about 15 million views.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            We agree on a target CPM before launch. Then we watch it every week and move budget to the clips and pages that
            bring views in cheapest.
          </p>
        </section>

        <section className="py-10">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">What makes views cheaper or more expensive?</h2>
          <ul className="mt-6 space-y-4 text-lg leading-relaxed text-muted">
            <li>
              <span className="text-fg">Your content.</span> Videos with strong moments, like a knockout, a hot take or a
              catchy hook, give clippers more to work with, and their clips spread further.
            </li>
            <li>
              <span className="text-fg">Your niche.</span> Some audiences share more than others. Music and combat sports
              tend to move fast.
            </li>
            <li>
              <span className="text-fg">The platforms.</span> Views cost more on some platforms than others, so the mix
              changes the average.
            </li>
            <li>
              <span className="text-fg">Your brand rules.</span> Strict rules mean fewer clips get approved. That keeps you
              safe, but it can raise the CPM.
            </li>
          </ul>
        </section>

        <section className="py-10">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">CPMs from past campaigns</h2>
          <div className="mt-6 overflow-x-auto rounded-2xl border border-line">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-line text-muted">
                <tr>
                  <th className="px-5 py-3 font-normal">Campaign</th>
                  <th className="px-5 py-3 font-normal">Type</th>
                  <th className="px-5 py-3 font-normal">Views</th>
                  <th className="px-5 py-3 font-normal">Budget</th>
                  <th className="px-5 py-3 font-normal">CPM</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {withCpm.map((c) => (
                  <tr key={c.slug}>
                    <td className="px-5 py-3">
                      <Link href={`/case-studies/${c.slug}`} className="hover:text-accent">
                        {c.client}
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-muted">{c.category}</td>
                    <td className="px-5 py-3 font-display font-semibold tabular-nums">{c.viewsLabel}</td>
                    <td className="px-5 py-3 font-display font-semibold tabular-nums">{c.spendUsd ? formatUsd(c.spendUsd) : "Not public"}</td>
                    <td className="px-5 py-3 font-display font-semibold tabular-nums">${c.cpmUsd!.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-muted">
            Want a figure for your niche?{" "}
            <Link href="/reach-estimator" className="text-accent">
              Run the reach estimator
            </Link>
            .
          </p>
        </section>

        <section className="py-10">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Questions about pricing</h2>
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
      <Cta />
    </>
  );
}
