import Image from "next/image";
import Link from "next/link";
import { cpmText, getCampaign, type Campaign } from "@/content/campaigns";
import { facts } from "@/content/facts";
import { getLocation, type Location } from "@/content/locations";
import { Cta } from "./cta";
import { JsonLd, faqJsonLd, serviceJsonLd, breadcrumbJsonLd } from "./json-ld";
import { WhoWeClipFor } from "./who-we-clip-for";
import { Eyebrow, FaqSection, HeaderActions, PageHeader, Rule, SECTION, SectionHead } from "./page-kit";

// Location pages (/clipping-agency/[slug]), in the site style: a header with the market's
// short-form audience, audience targeting, the market, the ad disclosure rules with a source,
// results, what we clip, short answers, other markets. Open layouts, collapsible FAQs. Every word is in the server HTML, and the
// question headings are H2s for search and AI answers. Data lives in content/locations.ts.

export const LOCATIONS_UPDATED = "November 2026";

function Mark({ ok }: { ok: boolean }) {
  return ok ? (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 text-accent" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m3.5 8.5 3 3 6-7" />
    </svg>
  ) : (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 text-muted/70" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
      <path d="m4.5 4.5 7 7m0-7-7 7" />
    </svg>
  );
}

export function LocationPage({ location: l }: { location: Location }) {
  const proof = l.proofSlugs.map((s) => getCampaign(s)).filter((c): c is Campaign => c !== undefined && c.publicApproved);
  const nearby = l.nearby.map((s) => getLocation(s)).filter((x): x is Location => x !== undefined);
  const path = `/clipping-agency/${l.slug}`;
  const h1 = `Clipping agency ${l.inName}`;
  const faqs = [
    ...l.faqs,
    { q: `How fast can a campaign ${l.inName} go live?`, a: facts.launchTime },
    {
      q: `What does a clipping campaign ${l.inName} cost?`,
      a: `${facts.pricingSummary} Past campaigns ran ${facts.cpmRangeLabel} per 1,000 views; your rate depends on your content, your audience and your goals.`,
    },
  ];
  const stats = [
    { k: "TikTok users, 18+", v: l.stats.tiktok },
    { k: "YouTube reach", v: l.stats.youtube },
    { k: "Instagram reach", v: l.stats.instagram },
    { k: "Social media users", v: l.stats.social },
  ];

  return (
    <>
      <JsonLd data={serviceJsonLd(h1, l.description, path, l.name)} />
      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Solutions", path: "/solutions" },
          { name: l.name, path },
        ])}
      />

      <article>
        <PageHeader
          crumbs={[{ name: "Home", href: "/" }, { name: "Solutions", href: "/solutions" }, { name: l.name }]}
          title={`${h1}.`}
          muted="Paid per verified view."
          lead={l.lead.map((p) => (
            <p key={p}>{p}</p>
          ))}
          actions={<HeaderActions />}
          after={<p className="mt-6 text-xs text-muted/70">Updated {LOCATIONS_UPDATED}</p>}
          aside={
            <div className="relative">
              <div aria-hidden className="pointer-events-none absolute -inset-10 hidden bg-[radial-gradient(closest-side,rgb(var(--glow)/0.16),transparent)] lg:block" />
              <div className="relative">
                <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                  <p className="min-w-0 font-label text-[10px] tracking-[0.14em] text-muted uppercase">Short-form audience {l.inName}</p>
                  <span className="flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-2.5 py-1 text-[11px] font-semibold text-accent">
                    <Mark ok />
                    Targetable
                  </span>
                </div>
                <dl className="mt-6 grid grid-cols-2 gap-x-8 gap-y-7">
                  {stats.map((s) => (
                    <div key={s.k} className="border-t border-line pt-4">
                      <dt className="text-xs text-muted">{s.k}</dt>
                      <dd className="mt-1.5 font-display text-2xl font-bold tracking-tight tabular-nums">{s.v}</dd>
                    </div>
                  ))}
                </dl>
                <dl className="mt-7 space-y-2 border-t border-line pt-4 text-sm">
                  <div className="flex gap-3">
                    <dt className="w-24 shrink-0 text-muted">Languages</dt>
                    <dd className="text-fg/85">{l.languages}</dd>
                  </div>
                  <div className="flex gap-3">
                    <dt className="w-24 shrink-0 text-muted">Time zone</dt>
                    <dd className="text-fg/85">{l.timeZone}</dd>
                  </div>
                </dl>
                <p className="mt-4 text-[11px] text-muted/80">
                  Ad reach in late 2025.{" "}
                  <a href={l.stats.sourceUrl} target="_blank" rel="noopener" className="underline decoration-line underline-offset-2 hover:text-fg">
                    Source: DataReportal, Digital 2026
                  </a>
                </p>
              </div>
            </div>
          }
        />

        {/* audience targeting */}
        <section id="targeting" className={`${SECTION} grid grid-cols-1 gap-14 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:items-center lg:gap-20`}>
          <div className="min-w-0">
            <SectionHead
              eyebrow="Audience targeting"
              title={`Can you target viewers ${l.inName} only?`}
              muted="Yes."
            />
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-fg/85">
              You choose {l.inName.replace(/^in /, "")} as the target, plus the age groups and genders you want, and
              only views from that audience count. We brief clippers whose audiences are there, track where every clip&apos;s viewers are,
              and show the audience split in your dashboard and every report.
            </p>
            <p className="mt-4 max-w-2xl leading-relaxed text-muted">
              Clips that miss your audience are not paid, even if they follow the rules, go viral and the views are real. That is the
              difference between buying views and buying the right views.
            </p>
          </div>
          <ul className="min-w-0 font-[family-name:var(--font-geist-mono)] text-xs" aria-label="Example: which views get paid">
            <li className="pb-3 font-label text-[9px] tracking-[0.14em] text-muted uppercase">Example: which views get paid</li>
            {[
              { k: `Viewers ${l.inName}, in your age range`, ok: true },
              { k: "Viewers in other countries", ok: false },
              { k: "Outside your age range", ok: false },
              { k: "Views that cannot be verified", ok: false },
            ].map((r) => (
              <li key={r.k} className="flex items-center justify-between gap-4 border-t border-line py-4 last:border-b">
                <span className={r.ok ? "text-fg" : "text-muted"}>{r.k}</span>
                <span className={`flex shrink-0 items-center gap-1.5 ${r.ok ? "text-accent [text-shadow:0_0_12px_rgb(var(--glow)/0.6)]" : "text-muted/70"}`}>
                  <Mark ok={r.ok} />
                  {r.ok ? "paid" : "$0"}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* the market and the ad rules */}
        <section id="market" className={`${SECTION} grid grid-cols-1 gap-14 md:grid-cols-2 md:gap-16`}>
          <div className="min-w-0">
            <Rule on />
            <Eyebrow className="mt-6">The market</Eyebrow>
            <h2 className="mt-3 text-2xl tracking-tight text-balance">{l.market.heading}</h2>
            {l.market.body.map((p) => (
              <p key={p} className="mt-3 leading-relaxed text-muted">
                {p}
              </p>
            ))}
          </div>
          <div className="min-w-0">
            <Rule />
            <Eyebrow className="mt-6">Ad rules</Eyebrow>
            <h2 className="mt-3 text-2xl tracking-tight text-balance">{l.rules.heading}</h2>
            {l.rules.body.map((p) => (
              <p key={p} className="mt-3 leading-relaxed text-muted">
                {p}
              </p>
            ))}
            <p className="mt-4 text-xs text-muted">
              Source:{" "}
              <a href={l.rules.sourceUrl} target="_blank" rel="noopener" className="underline decoration-line underline-offset-2 hover:text-fg">
                {l.rules.sourceLabel}
              </a>
              . A summary, not legal advice.
            </p>
          </div>
        </section>

        {/* results */}
        {proof.length > 0 && (
          <section id="results" className={SECTION}>
            <SectionHead eyebrow="Results" title="Documented results." muted="Counted on the platforms." intro={l.proofNote} />
            <ul className="mt-10 divide-y divide-line border-y border-line">
              {proof.map((c) => (
                <li key={c.slug}>
                  <Link href={`/case-studies/${c.slug}`} className="group flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:gap-8">
                    <div className="flex min-w-48 items-center gap-3">
                      {c.visual && (
                        <span className="h-10 w-10 overflow-hidden rounded-full border border-line bg-bg">
                          <Image src={c.visual.avatar} alt="" width={40} height={40} className="h-full w-full object-cover" />
                        </span>
                      )}
                      <div>
                        <p className="font-display font-semibold transition-colors group-hover:text-accent">{c.client}</p>
                        <p className="font-label text-[9px] tracking-[0.14em] text-muted uppercase">{c.category}</p>
                      </div>
                    </div>
                    <dl className="grid flex-1 grid-cols-3 gap-4 sm:flex sm:gap-10">
                      <div>
                        <dt className="text-xs text-muted">Views</dt>
                        <dd className="font-display text-xl font-bold tabular-nums">{c.viewsLabel}</dd>
                      </div>
                      {cpmText(c) && (
                        <div>
                          <dt className="text-xs text-muted">Per 1K views</dt>
                          <dd className="font-display text-xl font-bold tabular-nums">{cpmText(c)}</dd>
                        </div>
                      )}
                      {c.clips !== undefined && (
                        <div>
                          <dt className="text-xs text-muted">Clips</dt>
                          <dd className="font-display text-xl font-bold tabular-nums">{c.clips.toLocaleString("en-US")}</dd>
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
          </section>
        )}
      </article>

      <WhoWeClipFor
        eyebrow={`What we clip ${l.inName}`}
        title={
          <>
            Every kind of content. <span className="text-muted">Aimed at viewers {l.inName}.</span>
          </>
        }
        className="pb-24"
        id="services"
      />

      <FaqSection
        items={faqs}
        title={`Clipping ${l.inName}.`}
        side={
          <div className="mt-12">
            <Eyebrow>Other markets</Eyebrow>
            <ul className="mt-4 space-y-2.5">
              {nearby.map((n) => (
                <li key={n.slug}>
                  <Link href={`/clipping-agency/${n.slug}`} className="font-display text-sm font-semibold text-fg/85 transition-colors hover:text-accent">
                    {n.name} →
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/solutions" className="mt-5 inline-block font-display text-sm font-semibold text-accent transition-colors hover:text-fg">
              All solutions →
            </Link>
          </div>
        }
      />
      <Cta />
    </>
  );
}
