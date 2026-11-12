import type { Metadata } from "next";
import Link from "next/link";
import { ReachEstimator } from "@/components/reach-estimator";
import { JsonLd, faqJsonLd, breadcrumbJsonLd } from "@/components/json-ld";
import { facts } from "@/content/facts";

export const metadata: Metadata = {
  title: "Clipping Reach Estimator: Views for Your Budget",
  description:
    "Estimate how many short-form views a clipping campaign delivers for your budget, or what budget you need for a view target. Based on past NovaEyes campaigns.",
  alternates: { canonical: "/reach-estimator" },
};

const faqs = [
  {
    q: "How is the estimate worked out?",
    a: "We take the cost per 1,000 views that campaigns in your niche have run at, and apply it to your budget or your view target. The range is wide on purpose: the same budget can do very different numbers depending on your content.",
  },
  {
    q: "Is the estimate a guarantee?",
    a: "No. It is a range from past campaigns. You pay per verified view, so your budget turns into views at the rate the campaign actually runs at, and we agree on a target before launch.",
  },
  {
    q: "Why do you ask for my email?",
    a: "So we can send you the estimate and follow up if you want to talk. We do not sell or share it, and the newsletter is only if you tick the box.",
  },
  {
    q: "What is the smallest campaign you run?",
    a: `${facts.minimumBudgetLabel}. Below that, there is not enough budget for clippers to pick up the campaign and for us to learn what works.`,
  },
];

export default function ReachEstimatorPage() {
  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Reach estimator", path: "/reach-estimator" }])} />
      <section className="mx-auto max-w-6xl px-6 pt-20 pb-24 sm:px-10 lg:px-12">
        <nav aria-label="Breadcrumb" className="text-sm text-muted">
          <Link href="/" className="hover:text-fg">
            Home
          </Link>{" "}
          / <span>Reach estimator</span>
        </nav>
        <p className="mt-8 font-label text-[10px] tracking-[0.14em] text-muted uppercase">Reach estimator</p>
        <h1 className="mt-4 max-w-4xl text-4xl tracking-tight text-balance sm:text-5xl lg:text-6xl">
          Estimate your reach. <span className="text-muted">See what your budget turns into.</span>
        </h1>
        <div className="mt-16">
          <ReachEstimator />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24 sm:px-10 lg:px-12 *:max-w-3xl">
        <h2 className="text-3xl tracking-tight sm:text-4xl">Questions about the estimate</h2>
        <dl className="mt-10 divide-y divide-line border-y border-line">
          {faqs.map((f) => (
            <div key={f.q} className="py-6">
              <dt className="font-display font-semibold">{f.q}</dt>
              <dd className="mt-2 leading-relaxed text-muted">{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>
    </>
  );
}
