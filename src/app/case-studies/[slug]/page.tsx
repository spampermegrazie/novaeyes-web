import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cpmText, getCampaign, publicCampaigns } from "@/content/campaigns";
import { Cta } from "@/components/cta";
import { CountUp } from "@/components/ui/count-up";
import { JsonLd, breadcrumbJsonLd, faqJsonLd } from "@/components/json-ld";
import { facts } from "@/content/facts";

// Unknown slugs fall through to notFound() below.
export function generateStaticParams() {
  return publicCampaigns.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata(props: PageProps<"/case-studies/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const c = getCampaign(slug);
  if (!c) return {};
  const cpm = cpmText(c);
  return {
    title: `${c.client} Clipping Case Study: ${c.viewsLabel} Views`,
    description: `How NovaEyes delivered ${c.viewsLabel} short-form views for ${c.client}${cpm ? ` at ${cpm} per 1,000 views` : ""}. ${c.highlight}.`,
    alternates: { canonical: `/case-studies/${c.slug}` },
  };
}

export default async function CaseStudy(props: PageProps<"/case-studies/[slug]">) {
  const { slug } = await props.params;
  const c = getCampaign(slug);
  if (!c) notFound();

  const cpm = cpmText(c);
  const stats = [
    cpm ? { label: "Per 1,000 views", value: cpm } : null,
    c.clips !== undefined ? { label: "Clips", value: c.clips.toLocaleString("en-US") } : null,
    c.timeframe ? { label: "Timeframe", value: c.timeframe } : null,
  ].filter((s): s is { label: string; value: string } => s !== null);
  const exact = c.views % 100_000 !== 0 ? c.views.toLocaleString("en-US") : c.viewsLabel;
  const v = c.visual;
  const fade =
    v?.kind === "portrait"
      ? "linear-gradient(to bottom, #000 55%, transparent 95%), linear-gradient(to right, transparent 0%, #000 45%)"
      : "linear-gradient(to right, transparent 0%, #000 50%)";

  // Short answers built only from the campaign's own numbers, so search and AI answers can quote
  // the result in one passage. Nothing here that is not already in campaigns.ts.
  const outcomeText = c.outcomes.map((o) => (/[.!?]$/.test(o) ? o : `${o}.`)).join(" ");
  const qa = [
    {
      q: `How many views did the ${c.client} clipping campaign get?`,
      a: `${exact} verified views${c.clips !== undefined ? ` from ${c.clips.toLocaleString("en-US")} clips` : ""}${c.timeframe ? ` in ${c.timeframe}` : ""}${cpm ? `, at ${cpm} per 1,000 views` : ""}.`,
    },
    ...(c.outcomes.length ? [{ q: `What did the campaign achieve for ${c.client}?`, a: outcomeText }] : []),
    {
      q: `Can NovaEyes run a campaign like this for me?`,
      a: `Yes. Campaigns start at ${facts.minimumBudgetLabel}, launch within 24 hours of the onboarding call, and you pay only for verified views from your target audience.`,
    },
  ];

  return (
    <>
      <JsonLd data={faqJsonLd(qa)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Case studies", path: "/case-studies" },
          { name: c.client, path: `/case-studies/${c.slug}` },
        ])}
      />
      <article>
        <header className="relative isolate mx-auto max-w-6xl px-6 pt-20 pb-12 sm:px-10 lg:px-12">
          {v && (
            <div
              aria-hidden
              className={`pointer-events-none absolute right-6 -z-10 sm:right-10 lg:right-12 ${
                v.kind === "portrait" ? "top-10 h-[300px] w-[60%] opacity-40 sm:h-[380px] lg:opacity-75" : "top-36 h-[180px] w-[60%] opacity-[0.13]"
              }`}
              style={{ maskImage: fade, WebkitMaskImage: fade, maskComposite: "intersect", WebkitMaskComposite: "source-in" }}
            >
              <Image
                src={v.src}
                alt=""
                fill
                priority
                sizes="(min-width: 1024px) 560px, 60vw"
                className={v.kind === "portrait" ? "object-contain object-right-bottom" : "object-contain object-right drop-shadow-[0_0_40px_rgb(59_130_246/0.6)]"}
              />
            </div>
          )}
          <nav aria-label="Breadcrumb" className="text-sm text-muted">
            <Link href="/" className="hover:text-fg">
              Home
            </Link>{" "}
            /{" "}
            <Link href="/case-studies" className="hover:text-fg">
              Case studies
            </Link>{" "}
            / <span>{c.client}</span>
          </nav>
          <p className="mt-8 font-label text-[10px] tracking-[0.14em] text-accent uppercase">{c.category}</p>
          <h1 className="mt-3 text-5xl tracking-tight sm:text-6xl">{c.client}</h1>
          <p className="mt-10 font-display text-5xl leading-none font-bold tracking-tight sm:text-7xl lg:text-8xl">
            <CountUp value={exact} />
          </p>
          <p className="mt-3 font-label text-[10px] tracking-[0.14em] text-muted uppercase">Verified views</p>
          <p className="mt-10 max-w-2xl text-lg leading-relaxed text-muted">{c.summary}</p>
        </header>

        <div className="mx-auto max-w-6xl px-6 sm:px-10 lg:px-12">
          {stats.length > 0 && (
            <dl className="grid grid-cols-3 border-y border-line py-6">
              {stats.map((s) => (
                <div key={s.label} className="pr-3">
                  <dd className="font-display text-xl font-bold tabular-nums sm:text-3xl">{s.value}</dd>
                  <dt className="mt-1 font-label text-[9px] tracking-[0.12em] text-muted uppercase">{s.label}</dt>
                </div>
              ))}
            </dl>
          )}
          <p className="mt-6 flex max-w-2xl gap-3 text-lg leading-relaxed">
            <span aria-hidden className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-accent shadow-[0_0_8px_rgb(var(--glow))]" />
            {c.highlight}
          </p>

          <section aria-labelledby="in-short" className="mt-12">
            <h2 id="in-short" className="font-label text-[10px] tracking-[0.14em] text-muted uppercase">
              The {c.client} campaign in short
            </h2>
            <dl className="mt-4 grid gap-3 md:grid-cols-3">
              {qa.map((x) => (
                <div key={x.q} className="rounded-2xl border border-line bg-bg-raised/40 p-5">
                  <dt className="font-display font-semibold">{x.q}</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-muted">{x.a}</dd>
                </div>
              ))}
            </dl>
          </section>

          {c.story ? (
            <div className="max-w-3xl py-10">
              {c.story.map((section) => (
                <section key={section.heading} className="py-8">
                  <h2 className="text-2xl tracking-tight sm:text-3xl">{section.heading}</h2>
                  {section.body?.map((p) => (
                    <p key={p} className="mt-4 text-lg leading-relaxed text-muted">
                      {p}
                    </p>
                  ))}
                  {section.points && (
                    <ul className="mt-5 space-y-3">
                      {section.points.map((p) => (
                        <li key={p} className="flex gap-3 text-lg leading-relaxed">
                          <span aria-hidden className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
            </div>
          ) : (
            c.outcomes.length > 1 && (
              <ul className="max-w-3xl space-y-3 py-12">
                {c.outcomes.slice(1).map((o) => (
                  <li key={o} className="flex gap-3 text-lg leading-relaxed">
                    <span aria-hidden className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    {o}
                  </li>
                ))}
              </ul>
            )
          )}
          {/* TODO: port the brief, approach and example clips from the live pages for the other campaigns. */}
        </div>
      </article>
      <Cta />
    </>
  );
}
