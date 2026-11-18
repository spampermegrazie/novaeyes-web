import Image from "next/image";
import Link from "next/link";
import { siInstagram, siTiktok, siX, siYoutubeshorts } from "simple-icons";
import { cpmText, getCampaign, type Campaign } from "@/content/campaigns";
import { verticals, type Vertical } from "@/content/verticals";
import { facts } from "@/content/facts";
import { Cta } from "./cta";
import { JsonLd, faqJsonLd, serviceJsonLd, breadcrumbJsonLd } from "./json-ld";
import { CountUp } from "@/components/ui/count-up";
import { StatsBand } from "./stats-band";
import { ClipPhone, WhoWeClipFor } from "./who-we-clip-for";
import { MarketsRow } from "./markets-row";
import { Check, Eyebrow, FaqSection, HeaderActions, PageHeader, Rule, SECTION, SectionHead } from "./page-kit";

// Service pages, in the homepage style: a header with the vertical's clip, documented results, why it
// works, formats, how a campaign runs, what you send and who it is for, short answers, then the other
// services. Open layouts with hairlines instead of boxes; FAQs collapse. Every word is in the server
// HTML, and the question headings from verticals.ts stay as H2s for search and AI answers.

const PLATFORMS = [siTiktok, siInstagram, siYoutubeshorts, siX];

function HeroClip({ vertical, index }: { vertical: Vertical; index: number }) {
  return (
    <div className="relative mx-auto flex h-[340px] w-full max-w-sm items-center justify-center lg:h-[480px] lg:max-w-md" aria-hidden>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(closest-side,rgb(var(--glow)/0.28),transparent)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(var(--line-strong)_1px,transparent_1px)] [mask-image:radial-gradient(closest-side,#000_30%,transparent)] [background-size:20px_20px]" />
      <div className="relative h-[270px] w-[151px] lg:h-[360px] lg:w-[202px]">
        <div className="absolute top-0 left-0 origin-top-left scale-[1.8] lg:scale-[2.4]">
          <ClipPhone path={vertical.path} delay={-index * 1.7} />
        </div>
      </div>
      <span className="vp-float absolute top-[9%] left-0 flex items-center gap-2 rounded-xl border border-line bg-bg-raised/90 px-3 py-2 text-xs font-semibold shadow-[0_10px_30px_rgb(0_0_0/0.4)] backdrop-blur sm:left-[4%]">
        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-accent text-accent-ink">
          <svg viewBox="0 0 16 16" className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="m3.5 8.5 3 3 6-7" />
          </svg>
        </span>
        Verified views only
      </span>
      <span
        className="vp-float absolute right-0 bottom-[3%] flex items-center gap-2.5 rounded-xl border border-line bg-bg-raised/90 px-3 py-2 shadow-[0_10px_30px_rgb(0_0_0/0.4)] backdrop-blur sm:right-[4%]"
        style={{ animationDelay: "-2.5s" }}
      >
        {PLATFORMS.map((p) => (
          <svg key={p.slug} viewBox="0 0 24 24" className="h-3.5 w-3.5 text-fg/85">
            <path d={p.path} fill="currentColor" />
          </svg>
        ))}
      </span>
    </div>
  );
}

function Stat({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col justify-between bg-bg px-4 py-5 sm:px-6">
      <dt className="text-[11px] leading-tight text-muted sm:text-xs">{label}</dt>
      <dd className="mt-1.5 font-display text-lg font-bold tracking-tight tabular-nums sm:text-2xl">{children}</dd>
    </div>
  );
}

function Proof({ campaigns }: { campaigns: Campaign[] }) {
  const [lead, ...rest] = campaigns;
  return (
    <section id="results" className={SECTION}>
      <SectionHead eyebrow="Results" title="Documented results." muted="Counted on the platforms." />

      <Link
        href={`/case-studies/${lead.slug}`}
        className="group relative mt-12 grid overflow-hidden rounded-2xl border border-line bg-bg-raised/40 transition-colors hover:border-accent/50 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)]"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-[36rem] rounded-full bg-[radial-gradient(closest-side,rgb(var(--glow)/0.2),transparent)]"
        />
        <div className="relative p-6 sm:p-8">
          <div className="flex items-center gap-3">
            {lead.visual && (
              <span className="h-10 w-10 overflow-hidden rounded-full border border-line bg-bg">
                <Image src={lead.visual.avatar} alt="" width={40} height={40} className="h-full w-full object-cover" />
              </span>
            )}
            <div>
              <p className="font-display font-semibold">{lead.client}</p>
              <p className="font-label text-[9px] tracking-[0.14em] text-muted uppercase">{lead.category}</p>
            </div>
          </div>
          <p className="mt-8 font-display text-5xl font-bold tracking-tight sm:text-6xl">
            <CountUp value={lead.views.toLocaleString("en-US")} />
          </p>
          <p className="mt-1 font-label text-[10px] tracking-[0.14em] text-muted uppercase">Verified views</p>
          {lead.outcomes[0] && (
            <p className="mt-6 flex items-start gap-2.5 text-sm leading-relaxed">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent shadow-[0_0_8px_rgb(var(--glow))]" />
              {lead.outcomes[0]}
            </p>
          )}
          <span className="mt-6 inline-block font-display text-sm font-semibold text-accent transition-colors group-hover:text-fg">
            Read the {lead.client} case study →
          </span>
        </div>
        <dl className="relative grid grid-cols-3 gap-px border-t border-line bg-line lg:grid-cols-1 lg:border-t-0 lg:border-l">
          {cpmText(lead) && <Stat label="Cost per 1,000 views">{cpmText(lead)}</Stat>}
          {lead.clips !== undefined && <Stat label="Clips posted">{lead.clips.toLocaleString("en-US")}</Stat>}
          {lead.timeframe && <Stat label="Timeframe">{lead.timeframe}</Stat>}
        </dl>
      </Link>

      {rest.length > 0 && (
        <ul className="mt-6 divide-y divide-line border-y border-line">
          {rest.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/case-studies/${c.slug}`}
                className="group flex flex-col gap-4 py-5 transition-colors sm:flex-row sm:items-center sm:gap-8"
              >
                <div className="flex min-w-40 items-center gap-3">
                  {c.visual && (
                    <span className="h-9 w-9 overflow-hidden rounded-full border border-line bg-bg">
                      <Image src={c.visual.avatar} alt="" width={36} height={36} className="h-full w-full object-cover" />
                    </span>
                  )}
                  <p className="font-display font-semibold transition-colors group-hover:text-accent">{c.client}</p>
                </div>
                <dl className="grid flex-1 grid-cols-3 gap-4 sm:flex sm:gap-8">
                  <div>
                    <dt className="text-xs text-muted">Views</dt>
                    <dd className="font-display text-lg font-bold tabular-nums">{c.viewsLabel}</dd>
                  </div>
                  {cpmText(c) && (
                    <div>
                      <dt className="text-xs text-muted">Per 1K views</dt>
                      <dd className="font-display text-lg font-bold tabular-nums">{cpmText(c)}</dd>
                    </div>
                  )}
                  {c.clips !== undefined && (
                    <div>
                      <dt className="text-xs text-muted">Clips</dt>
                      <dd className="font-display text-lg font-bold tabular-nums">{c.clips.toLocaleString("en-US")}</dd>
                    </div>
                  )}
                </dl>
                <span className="hidden text-sm text-muted transition-colors group-hover:text-accent sm:inline" aria-hidden>
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function VerticalPage({ vertical }: { vertical: Vertical }) {
  const index = Math.max(0, verticals.findIndex((v) => v.path === vertical.path));
  const proof = vertical.campaignSlugs.map((slug) => getCampaign(slug)).filter((c): c is Campaign => c !== undefined);
  const faqs = [
    ...vertical.faqs,
    { q: "Can you target a specific country or audience?", a: facts.targeting },
    { q: "How fast can a campaign go live?", a: facts.launchTime },
  ];
  const cols = vertical.sections.length >= 3 ? "lg:grid-cols-3" : "md:grid-cols-2";

  return (
    <>
      <JsonLd data={serviceJsonLd(vertical.h1, vertical.description, vertical.path)} />
      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: vertical.h1, path: vertical.path }])} />

      <article>
        <PageHeader
          crumbs={[{ name: "Home", href: "/" }, { name: vertical.h1 }]}
          title={`${vertical.h1}.`}
          muted="Paid per verified view."
          lead={vertical.lead.map((p) => (
            <p key={p}>{p}</p>
          ))}
          actions={<HeaderActions />}
          aside={<HeroClip vertical={vertical} index={index} />}
        />

        {proof.length > 0 ? <Proof campaigns={proof} /> : <StatsBand />}

        {/* why it works: open columns, the question headings stay H2s */}
        <section className={SECTION}>
          <Eyebrow>Why it works</Eyebrow>
          <ul className={`mt-8 grid gap-12 ${cols} md:gap-10`}>
            {vertical.sections.map((s, i) => (
              <li key={s.heading} className="min-w-0">
                <Rule on={i === 0} />
                <p className="mt-6 font-label text-[10px] tracking-[0.14em] text-accent">{String(i + 1).padStart(2, "0")}</p>
                <h2 className="mt-3 text-xl tracking-tight text-balance">{s.heading}</h2>
                {s.body.map((p) => (
                  <p key={p} className="mt-3 leading-relaxed text-muted">
                    {p}
                  </p>
                ))}
              </li>
            ))}
          </ul>
        </section>

        {/* what we post */}
        {vertical.formats && vertical.formats.length > 0 && (
          <section id="formats" className={SECTION}>
            <SectionHead eyebrow="Formats" title="What we post." muted={`Formats that work for ${vertical.name.toLowerCase()}.`} />
            <div className="mt-12 grid grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
              <div className="relative mx-auto hidden lg:block" aria-hidden>
                <div className="pointer-events-none absolute -inset-16 bg-[radial-gradient(closest-side,rgb(var(--glow)/0.22),transparent)]" />
                <div className="relative origin-center scale-[1.5]">
                  <ClipPhone path={vertical.path} delay={-1.1} />
                </div>
              </div>
              <dl className="min-w-0 divide-y divide-line border-y border-line">
                {vertical.formats.map((f, i) => (
                  <div key={f.title} className="grid gap-2 py-5 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] sm:gap-8">
                    <dt className={`font-display text-lg font-semibold tracking-tight ${i === 0 ? "text-accent" : ""}`}>{f.title}</dt>
                    <dd className="leading-relaxed text-muted">{f.body}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>
        )}

        {/* how a campaign runs */}
        <section className={SECTION}>
          <SectionHead eyebrow="How it runs" title="How does a campaign run?" muted="Three steps, on repeat." />
          <ol className="relative mt-14 grid gap-12 md:grid-cols-3 md:gap-10">
            <span aria-hidden className="pointer-events-none absolute top-[18px] right-[8%] left-[8%] hidden h-px bg-gradient-to-r from-accent/70 via-accent/30 to-accent/0 md:block" />
            {vertical.steps.map((step, i) => (
              <li key={step} className="relative">
                <span className="relative flex h-9 w-9 items-center justify-center rounded-full border border-accent/60 bg-bg font-label text-[11px] text-accent shadow-[0_0_18px_rgb(var(--glow)/0.35)]">
                  {i + 1}
                </span>
                <p className="mt-6 leading-relaxed text-fg/85">{step}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* what you send us, who it is for */}
        <section className={`${SECTION} grid grid-cols-1 gap-14 md:grid-cols-2 md:gap-16`}>
          <div className="min-w-0">
            <Rule on />
            <Eyebrow className="mt-6">Your side</Eyebrow>
            <h2 className="mt-3 text-2xl tracking-tight">What you send us</h2>
            <ul className="mt-6 space-y-3.5">
              {vertical.sendUs.map((item) => (
                <li key={item} className="flex gap-3 leading-relaxed text-fg/85">
                  <Check />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="min-w-0">
            <Rule />
            <Eyebrow className="mt-6">Best fit</Eyebrow>
            <h2 className="mt-3 text-2xl tracking-tight">Who it is for</h2>
            <ul className="mt-6 space-y-3.5">
              {vertical.forWho.map((item) => (
                <li key={item} className="flex gap-3 leading-relaxed text-fg/85">
                  <span aria-hidden className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent shadow-[0_0_8px_rgb(var(--glow))]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <FaqSection
          items={faqs}
          side={
            vertical.guides &&
            vertical.guides.length > 0 && (
              <div className="mt-12">
                <Eyebrow>Read next</Eyebrow>
                <ul className="mt-4 space-y-3">
                  {vertical.guides.map((g) => (
                    <li key={g.href}>
                      <Link href={g.href} className="group text-sm leading-snug text-fg/85 transition-colors hover:text-accent">
                        {g.label}
                        <span className="ml-1 text-muted transition-colors group-hover:text-accent" aria-hidden>
                          →
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )
          }
        />
      </article>

      <WhoWeClipFor
        exclude={vertical.path}
        eyebrow="Other ways we clip"
        title={
          <>
            Same network. <span className="text-muted">Other kinds of content.</span>
          </>
        }
        className="pb-8"
      />
      <MarketsRow className="pb-4" />
      <Cta />
    </>
  );
}
