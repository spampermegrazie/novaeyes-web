import type { Metadata } from "next";
import Link from "next/link";
import { facts } from "@/content/facts";
import { publicCampaigns } from "@/content/campaigns";
import { Cta } from "@/components/cta";
import { FounderPortrait } from "@/components/founder-portrait";
import { CountUp } from "@/components/ui/count-up";
import { JsonLd, breadcrumbJsonLd, aboutPageJsonLd } from "@/components/json-ld";
import { CONTAINER, PageHeader, SECTION } from "@/components/page-kit";

export const metadata: Metadata = {
  title: "About NovaEyes and Founder Andrea Corindo",
  description: `NovaEyes is a performance-based clipping agency founded in ${facts.foundingYear} by Andrea Corindo in Ferrara, Italy. ${facts.clippersLabel} clippers, paid only on verified views.`,
  alternates: { canonical: "/about" },
};

const profiles = [
  { href: facts.founderProfiles[0], label: "Instagram" },
  { href: facts.founderProfiles[1], label: "X" },
  { href: facts.founderProfiles[2], label: "LinkedIn" },
];

export default function About() {
  return (
    <>
      <JsonLd data={aboutPageJsonLd} />
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "About", path: "/about" }])} />

      <article>
        <PageHeader
          crumbs={[{ name: "Home", href: "/" }, { name: "About" }]}
          title="About NovaEyes."
          muted="Anyone can make content. We decide who sees it."
          lead={
            <>
              <p>
                NovaEyes is a clipping agency that gets videos seen. We run a network of {facts.clippersLabel} clippers who post short clips
                of our clients&apos; content on TikTok, Instagram Reels, YouTube Shorts and X. We get paid on views, not on promises.
              </p>
              <p>
                The company was founded in {facts.foundingYear} by {facts.founder} and is based in {facts.location}.
              </p>
            </>
          }
        />

        {/* the founder */}
        <section className={`${SECTION} grid grid-cols-1 items-center gap-14 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] md:gap-20`}>
          <FounderPortrait />
          <div className="min-w-0">
            <h2 className="text-3xl tracking-tight sm:text-4xl">Who started NovaEyes?</h2>
            <p className="mt-5 text-lg leading-relaxed text-muted">
              {facts.founder}. Before NovaEyes, Andrea grew a media network past 500,000 followers, and that is where he learned how short
              clips spread. NovaEyes turns what he learned into a service for brands, artists and creators.
            </p>
            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
              {profiles.map((p) => (
                <li key={p.href}>
                  <a
                    href={p.href}
                    target="_blank"
                    rel="noopener noreferrer me"
                    className="font-display text-sm font-semibold text-accent transition-colors hover:text-fg"
                  >
                    Andrea on {p.label} →
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* why verified views, in numbers */}
        <section className={`${SECTION} grid grid-cols-1 gap-14 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:gap-20`}>
          <div className="min-w-0">
            <h2 className="text-3xl tracking-tight text-balance sm:text-4xl">Why do we only charge for verified views?</h2>
            <p className="mt-5 text-lg leading-relaxed text-muted">
              Because it keeps everyone honest. Clippers only earn when their clips get views, and clients only pay for views we can verify
              on the platforms. If a format stops working, the money moves to one that does. There is no retainer to hide behind.
            </p>
          </div>
          <div className="min-w-0">
            <h2 className="font-label text-[10px] font-normal tracking-[0.14em] text-muted uppercase">NovaEyes in numbers</h2>
            <dl className="mt-4 grid grid-cols-2 gap-x-8 gap-y-8">
              {facts.stats.map((s, i) => (
                <div key={s.label} className="flex flex-col-reverse border-t border-line pt-4">
                  <dt className="mt-1 text-sm text-muted">{s.label}</dt>
                  <dd className="font-display text-3xl font-bold tracking-tight">
                    <CountUp value={s.value} delay={i * 0.12} />
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* who we have worked with */}
        <section className={`${SECTION} grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-20`}>
          <div className="min-w-0">
            <h2 className="text-3xl tracking-tight text-balance sm:text-4xl">Who have we worked with?</h2>
            <p className="mt-5 leading-relaxed text-muted">
              Musicians, podcasts, fight promotions, creators and ecommerce brands. A few of the campaigns we can show:
            </p>
          </div>
          <ul className="min-w-0 divide-y divide-line border-y border-line">
            {publicCampaigns.map((c) => (
              <li key={c.slug}>
                <Link href={`/case-studies/${c.slug}`} className="group flex items-baseline justify-between gap-4 py-4">
                  <span className="transition-colors group-hover:text-accent">
                    {c.client} <span className="text-sm text-muted">{c.category}</span>
                  </span>
                  <span className="shrink-0 font-display text-sm font-semibold tabular-nums">{c.viewsLabel} views</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* contact */}
        <section className={`rv ${CONTAINER} pb-16`}>
          <h2 className="text-3xl tracking-tight sm:text-4xl">How do I get in touch?</h2>
          <p className="mt-5 text-lg leading-relaxed text-muted">
            <Link href="/book" className="text-fg underline decoration-line underline-offset-4 hover:text-accent">
              Book a call
            </Link>{" "}
            or email{" "}
            <a href="mailto:andrea@nova-eyes.com" className="text-fg underline decoration-line underline-offset-4 hover:text-accent">
              andrea@nova-eyes.com
            </a>
            . We reply within 24 hours.
          </p>
        </section>
      </article>
      <Cta />
    </>
  );
}
