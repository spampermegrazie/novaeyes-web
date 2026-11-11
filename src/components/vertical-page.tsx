import { publicCampaigns } from "@/content/campaigns";
import type { Vertical } from "@/content/verticals";
import { facts } from "@/content/facts";
import { CampaignCard } from "./campaign-card";
import { Cta } from "./cta";
import { JsonLd, faqJsonLd, serviceJsonLd, breadcrumbJsonLd } from "./json-ld";

export function VerticalPage({ vertical }: { vertical: Vertical }) {
  const related = publicCampaigns.filter((c) => c.vertical === vertical.campaignVertical);
  const faqs = [
    ...vertical.faqs,
    {
      q: "How does a NovaEyes campaign work?",
      a: `${facts.model} ${facts.clippersLabel} clippers post across ${facts.platforms.join(", ")}. Campaigns start at ${facts.minimumBudgetLabel}.`,
    },
  ];

  return (
    <>
      <JsonLd data={serviceJsonLd(vertical.h1, vertical.description, vertical.path)} />
      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: vertical.h1, path: vertical.path }])} />

      <section className="mx-auto max-w-6xl px-4 pt-24 pb-16 sm:px-6">
        <p className="text-sm tracking-widest text-muted uppercase">NovaEyes</p>
        <h1 className="mt-4 max-w-3xl text-5xl font-semibold tracking-tight sm:text-6xl">{vertical.h1}</h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">{vertical.intro}</p>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <h2 className="text-2xl font-semibold tracking-tight">What our clippers make</h2>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {vertical.whatWeClip.map((item) => (
            <li key={item} className="rounded-2xl border border-line px-5 py-4">
              {item}
            </li>
          ))}
        </ul>
      </section>

      {related.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <h2 className="text-2xl font-semibold tracking-tight">Results</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {related.map((c) => (
              <CampaignCard key={c.slug} campaign={c} />
            ))}
          </div>
        </section>
      )}

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
