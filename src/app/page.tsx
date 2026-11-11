import Link from "next/link";
import { facts, verticalLinks } from "@/content/facts";
import { publicCampaigns } from "@/content/campaigns";
import { CampaignCard } from "@/components/campaign-card";
import { Cta } from "@/components/cta";
import { JsonLd, faqJsonLd } from "@/components/json-ld";
import { homeFaqs } from "@/content/faqs";

// Every word on this page is in the server HTML. The scroll stages (task: design
// pass) animate these sections; they never inject content, so crawlers read it all.

const steps = [
  { title: "Fund a view pool", body: `Set a budget from ${facts.minimumBudgetLabel}. You only pay for views that are verified.` },
  {
    title: `${facts.clippersLabel} clippers go to work`,
    body: `Clippers cut your content into short-form clips and post them on ${facts.platforms.join(", ")}.`,
  },
  { title: "Track every view", body: "Views are tracked per clip in a campaign dashboard you can open anytime." },
];

export default function Home() {
  const featured = publicCampaigns.slice(0, 3);

  return (
    <>
      <JsonLd data={faqJsonLd(homeFaqs)} />

      {/* Stage 1: ignition */}
      <section id="ignition" className="mx-auto max-w-6xl px-4 pt-28 pb-24 sm:px-6 sm:pt-36">
        <p className="text-sm tracking-widest text-muted uppercase">{facts.tagline}</p>
        <h1 className="mt-6 max-w-4xl text-5xl font-semibold tracking-tight sm:text-7xl">
          Short-form reach, paid per verified view.
        </h1>
        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted">{facts.oneLiner}</p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/book"
            className="rounded-full bg-accent px-6 py-3 text-center text-sm font-medium text-accent-ink hover:opacity-90"
          >
            Book a 15-minute reach audit
          </Link>
          <Link
            href="/reach-estimator"
            className="rounded-full border border-line px-6 py-3 text-center text-sm hover:border-muted/50"
          >
            Estimate your reach
          </Link>
        </div>
      </section>

      {/* Stage 2: the network */}
      <section id="network" className="border-y border-line bg-bg-raised">
        <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
          <h2 className="max-w-3xl text-3xl font-semibold tracking-tight sm:text-5xl">
            One piece of content. {facts.clippersLabel} clippers. Four platforms at once.
          </h2>
          <ol className="mt-14 grid gap-6 md:grid-cols-3">
            {steps.map((s, i) => (
              <li key={s.title} className="rounded-2xl border border-line bg-bg p-6">
                <p className="font-mono text-sm text-accent">0{i + 1}</p>
                <h3 className="mt-4 text-lg font-medium">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Stage 3: telemetry */}
      <section id="telemetry" className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <div className="flex items-end justify-between gap-6">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-5xl">Results, in views.</h2>
          <Link href="/case-studies" className="hidden text-sm text-muted hover:text-fg sm:inline">
            All case studies
          </Link>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {featured.map((c) => (
            <CampaignCard key={c.slug} campaign={c} />
          ))}
        </div>
      </section>

      <section id="verticals" className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <h2 className="text-2xl font-semibold tracking-tight">Clipping for</h2>
        <ul className="mt-6 flex flex-wrap gap-3">
          {verticalLinks.map((v) => (
            <li key={v.href}>
              <Link href={v.href} className="inline-block rounded-full border border-line px-5 py-2 text-sm hover:border-muted/50">
                {v.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Stage 4: control panel */}
      <section id="control-panel" className="mx-auto max-w-6xl px-4 pb-8 sm:px-6">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-5xl">Questions buyers ask</h2>
        <dl className="mt-10 divide-y divide-line border-y border-line">
          {homeFaqs.map((f) => (
            <div key={f.q} className="py-6">
              <dt className="font-medium">{f.q}</dt>
              <dd className="mt-2 max-w-3xl text-muted">{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Stage 5: launch */}
      <Cta title="Ready when you are" />
    </>
  );
}
