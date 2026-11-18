import type { Metadata } from "next";
import { allFaqs, faqGroups } from "@/content/faqs";
import { Cta } from "@/components/cta";
import { JsonLd, faqJsonLd, breadcrumbJsonLd } from "@/components/json-ld";
import { CONTAINER, Eyebrow, FaqList, PageHeader } from "@/components/page-kit";

export const metadata: Metadata = {
  title: "Clipping Agency FAQ: Pricing, Platforms, Results",
  description:
    "Answers to common questions about NovaEyes performance clipping: pricing model, platforms, brand safety, timelines and reporting.",
  alternates: { canonical: "/faq" },
};

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

// Every answer stays in the HTML (and in the FAQPage schema); the list just starts collapsed, so the
// page reads as a menu of questions instead of a wall of text.
export default function Faq() {
  return (
    <>
      <JsonLd data={faqJsonLd(allFaqs)} />
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "FAQ", path: "/faq" }])} />

      <PageHeader crumbs={[{ name: "Home", href: "/" }, { name: "FAQ" }]} title="FAQ." muted="Short answers to what clients ask." />

      <section className={`${CONTAINER} pb-16`}>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,3fr)_minmax(0,8fr)] lg:gap-20">
          <nav aria-label="FAQ sections" className="min-w-0 lg:sticky lg:top-28 lg:self-start">
            <Eyebrow>Topics</Eyebrow>
            <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2.5 lg:flex-col">
              {faqGroups.map((g) => (
                <li key={g.title}>
                  <a href={`#${slug(g.title)}`} className="font-display text-sm font-semibold text-muted transition-colors hover:text-accent">
                    {g.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="min-w-0 space-y-20">
            {faqGroups.map((g) => (
              <div key={g.title} id={slug(g.title)} className="scroll-mt-28">
                <h2 className="text-2xl tracking-tight sm:text-3xl">{g.title}</h2>
                <div className="mt-6">
                  <FaqList items={g.items} firstOpen={false} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Cta />
    </>
  );
}
