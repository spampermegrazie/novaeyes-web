import type { Metadata } from "next";
import { allFaqs } from "@/content/faqs";
import { Cta } from "@/components/cta";
import { JsonLd, faqJsonLd } from "@/components/json-ld";

export const metadata: Metadata = {
  title: "Clipping Agency FAQ",
  description: "Answers on how NovaEyes clipping campaigns work: pricing, platforms, results tracking and what you need to provide.",
  alternates: { canonical: "/faq" },
};

export default function Faq() {
  return (
    <>
      <JsonLd data={faqJsonLd(allFaqs)} />
      <section className="mx-auto max-w-3xl px-4 pt-24 pb-12 sm:px-6">
        <h1 className="text-5xl font-semibold tracking-tight">FAQ</h1>
        <dl className="mt-12 divide-y divide-line border-y border-line">
          {allFaqs.map((f) => (
            <div key={f.q} className="py-6">
              <dt className="font-medium">{f.q}</dt>
              <dd className="mt-2 text-muted">{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>
      <Cta />
    </>
  );
}
