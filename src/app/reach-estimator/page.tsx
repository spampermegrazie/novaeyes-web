import type { Metadata } from "next";
import { ReachEstimator } from "@/components/reach-estimator";
import { JsonLd, faqJsonLd, breadcrumbJsonLd } from "@/components/json-ld";
import { facts } from "@/content/facts";
import { Breadcrumb, FaqSection, H1_CLASS } from "@/components/page-kit";

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
      <section className="mx-auto max-w-6xl px-6 pt-16 pb-24 sm:px-10 lg:px-12 lg:pt-20">
        <Breadcrumb items={[{ name: "Home", href: "/" }, { name: "Reach estimator" }]} />
        <h1 className={`mt-8 max-w-4xl ${H1_CLASS}`}>
          Estimate your reach. <span className="text-muted">See what your budget turns into.</span>
        </h1>
        <div className="mt-16">
          <ReachEstimator />
        </div>
      </section>

      <FaqSection items={faqs} title="Questions about the estimate." />
    </>
  );
}
