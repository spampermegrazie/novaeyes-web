import Link from "next/link";
import { getCampaign } from "@/content/campaigns";
import { verticals, type Vertical } from "@/content/verticals";
import { facts } from "@/content/facts";
import { CampaignCard } from "./campaign-card";
import { Cta } from "./cta";
import { JsonLd, faqJsonLd, serviceJsonLd, breadcrumbJsonLd } from "./json-ld";
import { ShinyButton } from "@/components/ui/shiny-button";

export function VerticalPage({ vertical }: { vertical: Vertical }) {
  const proof = vertical.campaignSlugs.map((slug) => getCampaign(slug)).filter((c) => c !== undefined);
  const faqs = [
    ...vertical.faqs,
    { q: "How fast can a campaign go live?", a: facts.launchTime },
  ];
  const others = verticals.filter((v) => v.path !== vertical.path);

  return (
    <>
      <JsonLd data={serviceJsonLd(vertical.h1, vertical.description, vertical.path)} />
      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: vertical.h1, path: vertical.path }])} />

      <article>
        <header className="mx-auto max-w-3xl px-4 pt-24 pb-10 sm:px-6">
          <nav aria-label="Breadcrumb" className="text-sm text-muted">
            <Link href="/" className="hover:text-fg">
              Home
            </Link>{" "}
            / <span>{vertical.h1}</span>
          </nav>
          <h1 className="mt-6 text-5xl font-bold tracking-tight sm:text-6xl">{vertical.h1}</h1>
          {vertical.lead.map((p) => (
            <p key={p} className="mt-6 text-lg leading-relaxed text-muted">
              {p}
            </p>
          ))}
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <ShinyButton href="/book">Book a 15-minute reach audit</ShinyButton>
            <Link href="/reach-estimator" className="font-display font-semibold rounded-full border border-line px-6 py-3 text-center text-sm hover:border-muted/50">
              Estimate your reach
            </Link>
          </div>
        </header>

        {proof.length > 0 && (
          <section aria-label="Results" className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
            <div className={`grid gap-4 ${proof.length > 1 ? "md:grid-cols-2" : "md:max-w-md"}`}>
              {proof.map((c) => (
                <CampaignCard key={c.slug} campaign={c} />
              ))}
            </div>
          </section>
        )}

        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          {vertical.sections.map((s) => (
            <section key={s.heading} className="py-10">
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{s.heading}</h2>
              {s.body.map((p) => (
                <p key={p} className="mt-4 text-lg leading-relaxed text-muted">
                  {p}
                </p>
              ))}
            </section>
          ))}

          <section className="py-10">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">How does a campaign run?</h2>
            <ol className="mt-6 space-y-4">
              {vertical.steps.map((step, i) => (
                <li key={step} className="flex gap-4 rounded-2xl border border-line p-5">
                  <span className="font-label text-xs text-accent">0{i + 1}</span>
                  <span className="leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </section>

          <section className="grid gap-10 py-10 sm:grid-cols-2">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">What you send us</h2>
              <ul className="mt-4 space-y-2 text-muted">
                {vertical.sendUs.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="text-accent">·</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-semibold tracking-tight">Who it is for</h2>
              <ul className="mt-4 space-y-2 text-muted">
                {vertical.forWho.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="text-accent">·</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="py-10">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Questions</h2>
            <dl className="mt-6 divide-y divide-line border-y border-line">
              {faqs.map((f) => (
                <div key={f.q} className="py-6">
                  <dt className="font-display font-semibold">{f.q}</dt>
                  <dd className="mt-2 leading-relaxed text-muted">{f.a}</dd>
                </div>
              ))}
            </dl>
          </section>

          <nav aria-label="Other services" className="py-10">
            <h2 className="font-label text-[11px] tracking-[0.14em] text-muted uppercase">Other ways we clip</h2>
            <ul className="mt-4 flex flex-wrap gap-3">
              {others.map((v) => (
                <li key={v.path}>
                  <Link href={v.path} className="inline-block rounded-full border border-line px-4 py-2 text-sm hover:border-muted/50">
                    {v.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/pricing" className="inline-block rounded-full border border-line px-4 py-2 text-sm hover:border-muted/50">
                  Pricing
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </article>
      <Cta />
    </>
  );
}
