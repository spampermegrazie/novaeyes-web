import type { Metadata } from "next";
import Link from "next/link";
import { facts } from "@/content/facts";
import { publicCampaigns } from "@/content/campaigns";
import { Cta } from "@/components/cta";
import { JsonLd, faqJsonLd } from "@/components/json-ld";

export const metadata: Metadata = {
  title: "Clipping Campaign Pricing: How Much Does Clipping Cost?",
  description: `How clipping campaigns are priced: fund a view pool, pay only for verified views, campaigns from ${facts.minimumBudgetLabel}. Real CPMs from past NovaEyes campaigns.`,
  alternates: { canonical: "/pricing" },
};

const faqs = [
  {
    q: "How much does a clipping campaign cost?",
    a: `NovaEyes campaigns start at ${facts.minimumBudgetLabel}. You fund a view pool and pay only for verified views, so the budget sets how many views you buy.`,
  },
  {
    q: "What is CPM in clipping?",
    a: "CPM is the cost per 1,000 views. A $0.20 CPM means 1,000 verified views cost 20 cents, so $3,000 buys about 15 million views.",
  },
  {
    q: "What changes the CPM?",
    a: "Mainly the niche, how shareable the source content is, and which platforms carry the campaign.",
  },
];

export default function Pricing() {
  const withCpm = publicCampaigns.filter((c) => c.cpmUsd !== undefined).sort((a, b) => a.cpmUsd! - b.cpmUsd!);

  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />
      <section className="mx-auto max-w-6xl px-4 pt-24 pb-12 sm:px-6">
        <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl">Pricing</h1>
        <p className="mt-6 max-w-2xl text-lg text-muted">
          {facts.model} Campaigns start at {facts.minimumBudgetLabel}.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <h2 className="text-2xl font-semibold tracking-tight">CPMs from past campaigns</h2>
        <div className="mt-6 overflow-x-auto rounded-2xl border border-line">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line text-muted">
              <tr>
                <th className="px-5 py-3 font-normal">Campaign</th>
                <th className="px-5 py-3 font-normal">Views</th>
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
                  <td className="px-5 py-3 font-mono">{c.viewsLabel}</td>
                  <td className="px-5 py-3 font-mono">${c.cpmUsd!.toFixed(2)}</td>
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

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <h2 className="text-2xl font-semibold tracking-tight">Questions</h2>
        <dl className="mt-6 divide-y divide-line border-y border-line">
          {faqs.map((f) => (
            <div key={f.q} className="py-6">
              <dt className="font-medium">{f.q}</dt>
              <dd className="mt-2 max-w-3xl text-muted">{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>
      <Cta />
    </>
  );
}
