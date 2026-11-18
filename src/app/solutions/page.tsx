import type { Metadata } from "next";
import Link from "next/link";
import { facts } from "@/content/facts";
import { verticals } from "@/content/verticals";
import { locations, REGIONS } from "@/content/locations";
import { Cta } from "@/components/cta";
import { BLURBS, ClipPhone } from "@/components/who-we-clip-for";
import { JsonLd, breadcrumbJsonLd, itemListJsonLd, faqJsonLd } from "@/components/json-ld";
import { FaqSection, PageHeader, SECTION, SectionHead } from "@/components/page-kit";

// All solutions: every kind of content we clip and every market we run campaigns in, on one page.
// The hub for internal links (every service and location page is one click from here) and an
// ItemList for search and AI answers.

export const metadata: Metadata = {
  title: "Clipping Solutions by Niche and Location",
  description: `Every NovaEyes clipping solution: sports, gaming, music, podcasts, apps, logo and product clipping, for the US, UK, Europe, the UAE and more.`,
  alternates: { canonical: "/solutions" },
};

const FAQS = [
  {
    q: "What kinds of content can NovaEyes clip?",
    a: `Sports and combat sports, gaming, music, podcasts, apps and startups, and brand campaigns through logo clipping and product clipping. If you have video worth watching, or a product worth showing, ${facts.clippersLabel} clippers can turn it into short clips.`,
  },
  {
    q: "Which countries do you run clipping campaigns in?",
    a: "We run campaigns for audiences in the United States, the UK, Germany, Austria, Switzerland, Italy, Spain, France, the Netherlands, the UAE, Canada and Australia, and you can lock any campaign to the countries you choose.",
  },
  {
    q: "Can one campaign cover several countries?",
    a: "Yes. You choose the countries and the audience, like age and gender, and only views from that audience count. Clips that miss it are not paid, even if they go viral.",
  },
];

export default function Solutions() {
  const items = [
    ...verticals.map((v) => ({ name: v.h1, path: v.path })),
    ...locations.map((l) => ({ name: `Clipping agency ${l.inName}`, path: `/clipping-agency/${l.slug}` })),
  ];

  return (
    <>
      <JsonLd data={itemListJsonLd("NovaEyes clipping solutions", items)} />
      <JsonLd data={faqJsonLd(FAQS)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Solutions", path: "/solutions" },
        ])}
      />

      <PageHeader
        crumbs={[{ name: "Home", href: "/" }, { name: "Solutions" }]}
        title="All solutions."
        muted="Every kind of content, every market."
        lead={
          <p>
            NovaEyes is a clipping agency: {facts.clippersLabel} clippers turn your content into short clips on TikTok, Instagram Reels,
            YouTube Shorts and X, and you pay only for verified views from the audience you choose. Pick your kind of content, your market,
            or both.
          </p>
        }
        after={
          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
            <a href="#by-content" className="font-display text-sm font-semibold text-accent transition-colors hover:text-fg">
              By content · {verticals.length} →
            </a>
            <a href="#locations" className="font-display text-sm font-semibold text-accent transition-colors hover:text-fg">
              By location · {locations.length} →
            </a>
          </div>
        }
      />

      {/* by content type */}
      <section id="by-content" className={`${SECTION} scroll-mt-24`}>
        <SectionHead eyebrow="By content" title="What do you want clipped?" muted={`${verticals.length} kinds of content.`} />
        <ul className="mt-12 grid grid-cols-1 gap-x-12 sm:grid-cols-2">
          {verticals.map((v, i) => (
            <li key={v.path} className="min-w-0 border-t border-line">
              <Link href={v.path} className="group flex items-center gap-5 py-5">
                {/* the vertical's clip, at 60% */}
                <div className="relative h-[90px] w-[50px] shrink-0" aria-hidden>
                  <div className="absolute top-0 left-0 origin-top-left scale-[0.6]">
                    <ClipPhone path={v.path} delay={-i * 1.3} />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="flex items-center justify-between gap-2 text-lg tracking-tight transition-colors group-hover:text-accent">
                    {v.h1}
                    <span className="text-muted transition-[color,translate] duration-300 group-hover:translate-x-0.5 group-hover:text-accent" aria-hidden>
                      →
                    </span>
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{BLURBS[v.path] ?? v.description}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* by location */}
      <section id="locations" className={`${SECTION} scroll-mt-24`}>
        <SectionHead
          eyebrow="By location"
          title="Where is your audience?"
          muted="Only views from there count."
          intro="Every campaign can be locked to the countries you choose, plus age and gender. Each market page covers the audience size, the local ad rules and our results there."
        />
        <div className="mt-12 space-y-12">
          {REGIONS.map((region) => {
            const list = locations.filter((l) => l.region === region);
            if (!list.length) return null;
            return (
              <div key={region}>
                <h3 className="font-label text-[10px] tracking-[0.14em] text-accent uppercase">{region}</h3>
                <ul className="mt-3 grid grid-cols-1 gap-x-12 sm:grid-cols-2 lg:grid-cols-3">
                  {list.map((l) => (
                    <li key={l.slug} className="min-w-0 border-t border-line">
                      <Link href={`/clipping-agency/${l.slug}`} className="group flex items-baseline justify-between gap-4 py-4">
                        <span className="font-display font-semibold transition-colors group-hover:text-accent">Clipping agency {l.inName}</span>
                        <span className="shrink-0 text-right">
                          <span className="block font-display text-sm font-bold tabular-nums">{l.stats.tiktok}</span>
                          <span className="block text-[10px] text-muted">TikTok users 18+</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
        <p className="mt-8 text-xs text-muted">TikTok ad reach for adults 18+ in late 2025, from DataReportal&apos;s Digital 2026 country reports.</p>
      </section>

      <FaqSection items={FAQS} title="Not sure where you fit?" />
      <Cta />
    </>
  );
}
