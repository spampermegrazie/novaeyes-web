import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCampaign, publicCampaigns } from "@/content/campaigns";
import { Cta } from "@/components/cta";
import { JsonLd, breadcrumbJsonLd } from "@/components/json-ld";

// Unknown slugs fall through to notFound() below.
export function generateStaticParams() {
  return publicCampaigns.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata(props: PageProps<"/case-studies/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const c = getCampaign(slug);
  if (!c) return {};
  const cpm = c.cpmUsd !== undefined ? ` at $${c.cpmUsd.toFixed(2)} CPM` : "";
  return {
    title: `${c.client} Clipping Case Study: ${c.viewsLabel} Views`,
    description: `How NovaEyes delivered ${c.viewsLabel} short-form views for ${c.client}${cpm}.${c.outcomes[0] ? ` ${c.outcomes[0]}.` : ""}`,
    alternates: { canonical: `/case-studies/${c.slug}` },
  };
}

export default async function CaseStudy(props: PageProps<"/case-studies/[slug]">) {
  const { slug } = await props.params;
  const c = getCampaign(slug);
  if (!c) notFound();

  const stats = [
    { label: "Views", value: c.views.toLocaleString("en-US") },
    c.cpmUsd !== undefined ? { label: "CPM", value: `$${c.cpmUsd.toFixed(2)}` } : null,
    c.clips !== undefined ? { label: "Clips", value: c.clips.toLocaleString("en-US") } : null,
    c.timeframe ? { label: "Timeframe", value: c.timeframe } : null,
  ].filter((s): s is { label: string; value: string } => s !== null);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Case studies", path: "/case-studies" },
          { name: c.client, path: `/case-studies/${c.slug}` },
        ])}
      />
      <article>
        <header className="mx-auto max-w-6xl px-4 pt-24 pb-12 sm:px-6">
          <p className="text-sm tracking-widest text-muted uppercase">Case study</p>
          <h1 className="mt-4 text-5xl font-semibold tracking-tight sm:text-6xl">{c.client}</h1>
          <p className="mt-6 max-w-2xl text-lg text-muted">{c.summary}</p>
        </header>
        <section className="mx-auto max-w-6xl px-4 sm:px-6">
          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="rounded-2xl border border-line bg-bg-raised p-6">
                <dt className="text-sm text-muted">{s.label}</dt>
                <dd className="mt-2 font-mono text-3xl font-semibold tracking-tight">{s.value}</dd>
              </div>
            ))}
          </dl>
        </section>
        {c.outcomes.length > 0 && (
          <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
            <h2 className="text-2xl font-semibold tracking-tight">Outcome</h2>
            <ul className="mt-4 space-y-2 text-lg">
              {c.outcomes.map((o) => (
                <li key={o}>{o}</li>
              ))}
            </ul>
          </section>
        )}
        {/* TODO: port the brief, approach and example clips from the current case study page. */}
      </article>
      <Cta />
    </>
  );
}
