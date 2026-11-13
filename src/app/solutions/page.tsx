import type { Metadata } from "next";
import Link from "next/link";
import { facts } from "@/content/facts";
import { verticals } from "@/content/verticals";
import { locations, REGIONS } from "@/content/locations";
import { Cta } from "@/components/cta";
import { ShinyButton } from "@/components/ui/shiny-button";
import { BLURBS, ClipPhone } from "@/components/who-we-clip-for";
import { JsonLd, breadcrumbJsonLd, itemListJsonLd, faqJsonLd } from "@/components/json-ld";

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

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="font-label text-[10px] tracking-[0.14em] text-muted uppercase">{children}</p>;
}

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

      <header className="mx-auto max-w-6xl px-6 pt-16 pb-16 sm:px-10 lg:px-12 lg:pt-20">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-y-1 font-label text-[10px] tracking-[0.14em] text-muted uppercase">
          <Link href="/" className="transition-colors hover:text-fg">
            Home
          </Link>
          <span className="mx-2 text-muted/50">/</span>
          <span className="text-fg/80">Solutions</span>
        </nav>
        <h1 className="mt-6 max-w-4xl text-5xl leading-[1.02] font-bold tracking-tight text-balance sm:text-6xl">
          All solutions. <span className="text-muted">Every kind of content, every market.</span>
        </h1>
        <p className="mt-7 max-w-2xl text-lg leading-relaxed text-fg/85">
          NovaEyes is a clipping agency: {facts.clippersLabel} clippers turn your content into short clips on TikTok, Instagram Reels,
          YouTube Shorts and X, and you pay only for verified views from the audience you choose. Pick your kind of content, your
          market, or both.
        </p>
        <div className="mt-8 flex flex-wrap gap-2">
          <a href="#by-content" className="rounded-xl border border-line bg-bg-raised/50 px-4 py-2 font-display text-sm font-semibold transition-colors hover:border-accent/50">
            By content · {verticals.length}
          </a>
          <a href="#locations" className="rounded-xl border border-line bg-bg-raised/50 px-4 py-2 font-display text-sm font-semibold transition-colors hover:border-accent/50">
            By location · {locations.length}
          </a>
        </div>
      </header>

      {/* by content type */}
      <section id="by-content" className="mx-auto max-w-6xl scroll-mt-24 px-6 pb-24 sm:px-10 lg:px-12">
        <Eyebrow>By content</Eyebrow>
        <h2 className="mt-4 max-w-3xl text-3xl tracking-tight text-balance sm:text-4xl">
          What do you want clipped? <span className="text-muted">{verticals.length} kinds of content.</span>
        </h2>
        <ul className="mt-10 grid gap-3 sm:grid-cols-2">
          {verticals.map((v, i) => (
            <li key={v.path}>
              <Link
                href={v.path}
                className="group flex h-full items-center gap-5 rounded-2xl border border-line bg-bg-raised/40 p-4 pr-6 transition-[border-color,background-color] duration-300 hover:border-accent/50 hover:bg-bg-raised/70"
              >
                {/* the vertical's clip, at 70% */}
                <div className="relative h-[105px] w-[59px] shrink-0" aria-hidden>
                  <div className="absolute top-0 left-0 origin-top-left scale-[0.7]">
                    <ClipPhone path={v.path} delay={-i * 1.3} />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="flex items-center justify-between gap-2 text-lg tracking-tight">
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
      <section id="locations" className="mx-auto max-w-6xl scroll-mt-24 px-6 pb-24 sm:px-10 lg:px-12">
        <Eyebrow>By location</Eyebrow>
        <h2 className="mt-4 max-w-3xl text-3xl tracking-tight text-balance sm:text-4xl">
          Where is your audience? <span className="text-muted">Only views from there count.</span>
        </h2>
        <p className="mt-5 max-w-2xl leading-relaxed text-muted">
          Every campaign can be locked to the countries you choose, plus age and gender. Each market page covers the audience size, the
          local ad rules and our results there.
        </p>
        <div className="mt-10 space-y-8">
          {REGIONS.map((region) => {
            const list = locations.filter((l) => l.region === region);
            if (!list.length) return null;
            return (
              <div key={region}>
                <h3 className="font-label text-[10px] tracking-[0.14em] text-accent uppercase">{region}</h3>
                <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {list.map((l) => (
                    <li key={l.slug}>
                      <Link
                        href={`/clipping-agency/${l.slug}`}
                        className="group flex h-full flex-col rounded-2xl border border-line bg-bg-raised/40 p-5 transition-[border-color,background-color] duration-300 hover:border-accent/50 hover:bg-bg-raised/70"
                      >
                        <span className="flex items-center justify-between gap-2 font-display text-lg font-semibold tracking-tight">
                          Clipping agency {l.inName}
                          <span className="text-muted transition-[color,translate] duration-300 group-hover:translate-x-0.5 group-hover:text-accent" aria-hidden>
                            →
                          </span>
                        </span>
                        <span className="mt-3 flex items-baseline gap-2">
                          <span className="font-display text-2xl font-bold tabular-nums">{l.stats.tiktok}</span>
                          <span className="text-xs text-muted">TikTok users 18+</span>
                        </span>
                        <span className="mt-1 text-xs text-muted">{l.languages.split(".")[0]}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
        <p className="mt-6 text-xs text-muted">
          TikTok ad reach for adults 18+ in late 2025, from DataReportal&apos;s Digital 2026 country reports.
        </p>
      </section>

      {/* short answers */}
      <section id="faq" className="mx-auto max-w-6xl px-6 pb-16 sm:px-10 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-16">
          <div>
            <Eyebrow>FAQ</Eyebrow>
            <h2 className="mt-4 text-3xl tracking-tight text-balance sm:text-4xl">
              Not sure where you fit? <span className="text-muted">Short answers.</span>
            </h2>
            <div className="mt-8">
              <ShinyButton href="/book" className="px-6 py-3 text-sm">
                Book a 15-minute reach audit
              </ShinyButton>
            </div>
          </div>
          <dl className="space-y-3">
            {FAQS.map((f, i) => (
              <div key={f.q} className="rounded-2xl border border-line bg-bg-raised/40 p-5 sm:p-6">
                <dt className="flex gap-4 font-display font-semibold">
                  <span className="font-label text-[10px] leading-6 tracking-[0.14em] text-accent">{String(i + 1).padStart(2, "0")}</span>
                  {f.q}
                </dt>
                <dd className="mt-2 leading-relaxed text-muted sm:pl-9">{f.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
      <Cta />
    </>
  );
}
