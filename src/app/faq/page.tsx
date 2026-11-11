import type { Metadata } from "next";
import { allFaqs, faqGroups } from "@/content/faqs";
import { Cta } from "@/components/cta";
import { JsonLd, faqJsonLd } from "@/components/json-ld";

export const metadata: Metadata = {
  title: "Clipping Agency FAQ: Pricing, Platforms, Results",
  description:
    "Answers to common questions about NovaEyes performance clipping: pricing model, platforms, brand safety, timelines and reporting.",
  alternates: { canonical: "/faq" },
};

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export default function Faq() {
  return (
    <>
      <JsonLd data={faqJsonLd(allFaqs)} />
      <section className="mx-auto max-w-3xl px-4 pt-24 pb-12 sm:px-6">
        <h1 className="text-5xl font-semibold tracking-tight">FAQ</h1>
        <nav aria-label="FAQ sections" className="mt-8 flex flex-wrap gap-2">
          {faqGroups.map((g) => (
            <a key={g.title} href={`#${slug(g.title)}`} className="rounded-full border border-line px-4 py-1.5 text-sm text-muted hover:text-fg">
              {g.title}
            </a>
          ))}
        </nav>
        {faqGroups.map((g) => (
          <div key={g.title} id={slug(g.title)} className="mt-16 scroll-mt-24">
            <h2 className="text-2xl font-semibold tracking-tight">{g.title}</h2>
            <dl className="mt-6 divide-y divide-line border-y border-line">
              {g.items.map((f) => (
                <div key={f.q} className="py-6">
                  <dt className="font-medium">{f.q}</dt>
                  <dd className="mt-2 text-muted">{f.a}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </section>
      <Cta />
    </>
  );
}
