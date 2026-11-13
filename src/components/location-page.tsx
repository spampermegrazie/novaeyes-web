import Image from "next/image";
import Link from "next/link";
import { cpmText, getCampaign, type Campaign } from "@/content/campaigns";
import { facts } from "@/content/facts";
import { getLocation, type Location } from "@/content/locations";
import { Cta } from "./cta";
import { JsonLd, faqJsonLd, serviceJsonLd, breadcrumbJsonLd } from "./json-ld";
import { ShinyButton } from "@/components/ui/shiny-button";
import { WhoWeClipFor } from "./who-we-clip-for";

// Location pages (/clipping-agency/[slug]), in the site style: a hero with the market's
// short-form audience, audience targeting, the market, the ad disclosure rules with a source,
// results, what we clip, short answers, other markets. Every word is in the server HTML, and the
// question headings are H2s for search and AI answers. Data lives in content/locations.ts.

export const LOCATIONS_UPDATED = "November 2026";

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="font-label text-[10px] tracking-[0.14em] text-muted uppercase">{children}</p>;
}

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
      a: `Campaigns start at ${facts.minimumBudgetLabel} and you pay per 1,000 verified views from your target audience. Past campaigns ran $0.13 to $0.41 per 1,000 views; your rate depends on your content, your audience and your goals.`,
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
        {/* hero */}
        <header className="mx-auto grid max-w-6xl gap-12 px-6 pt-16 pb-20 sm:px-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-center lg:gap-10 lg:px-12 lg:pt-20">
          <div className="min-w-0">
            <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-y-1 font-label text-[10px] tracking-[0.14em] text-muted uppercase">
              <Link href="/" className="transition-colors hover:text-fg">
                Home
              </Link>
              <span className="mx-2 text-muted/50">/</span>
              <Link href="/solutions" className="transition-colors hover:text-fg">
                Solutions
              </Link>
              <span className="mx-2 text-muted/50">/</span>
              <span className="text-fg/80">{l.name}</span>
            </nav>
            <h1 className="mt-6 text-4xl leading-[1.02] font-bold tracking-tight break-words text-balance min-[400px]:text-5xl sm:text-6xl">
              {h1}. <span className="text-muted">Paid per verified view.</span>
            </h1>
            {l.lead.map((p, i) => (
              <p key={p} className={`max-w-2xl text-lg leading-relaxed ${i === 0 ? "mt-7 text-fg/85" : "mt-4 text-muted"}`}>
                {p}
              </p>
            ))}
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <ShinyButton href="/book">Book a 15-minute reach audit</ShinyButton>
              <Link
                href="/reach-estimator"
                className="rounded-xl border border-line bg-bg/60 px-6 py-3 text-center font-display text-sm font-semibold backdrop-blur transition-colors hover:border-muted/50"
              >
                Estimate your reach
              </Link>
            </div>
            <p className="mt-6 text-xs text-muted">Updated {LOCATIONS_UPDATED}</p>
          </div>

          {/* the market at a glance */}
          <div className="relative min-w-0">
            <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(closest-side,rgb(var(--glow)/0.18),transparent)] lg:-inset-10" />
            <div className="relative overflow-hidden rounded-2xl border border-line bg-bg-raised/60">
              <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-line px-5 py-4">
                <p className="min-w-0 font-label text-[10px] tracking-[0.14em] text-muted uppercase">Short-form audience {l.inName}</p>
                <span className="flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-2.5 py-1 text-[11px] font-semibold text-accent">
                  <Mark ok />
                  Targetable
                </span>
              </div>
              <dl className="grid grid-cols-2 gap-px bg-line">
                {stats.map((s) => (
                  <div key={s.k} className="flex flex-col justify-between bg-bg px-5 py-5">
                    <dt className="text-xs text-muted">{s.k}</dt>
                    <dd className="mt-1.5 font-display text-2xl font-bold tracking-tight tabular-nums">{s.v}</dd>
                  </div>
                ))}
              </dl>
              <dl className="space-y-2 border-t border-line px-5 py-4 text-sm">
                <div className="flex gap-3">
                  <dt className="w-24 shrink-0 text-muted">Languages</dt>
                  <dd className="text-fg/85">{l.languages}</dd>
                </div>
                <div className="flex gap-3">
                  <dt className="w-24 shrink-0 text-muted">Time zone</dt>
                  <dd className="text-fg/85">{l.timeZone}</dd>
                </div>
              </dl>
              <p className="border-t border-line px-5 py-3 text-[11px] text-muted">
                Ad reach in late 2025.{" "}
                <a href={l.stats.sourceUrl} target="_blank" rel="noopener" className="underline decoration-line underline-offset-2 hover:text-fg">
                  Source: DataReportal, Digital 2026
                </a>
              </p>
            </div>
          </div>
        </header>

        {/* audience targeting */}
        <section id="targeting" className="mx-auto grid max-w-6xl gap-10 px-6 pb-24 sm:px-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-center lg:px-12">
          <div>
            <Eyebrow>Audience targeting</Eyebrow>
            <h2 className="mt-4 text-3xl tracking-tight text-balance sm:text-4xl">
              Can you target viewers {l.inName} only? <span className="text-muted">Yes.</span>
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-fg/85">
              You choose {l.inName.replace(/^in /, "")} as the target, plus the age groups and genders you want, and
              only views from that audience count. We brief clippers whose audiences are there, track where every clip&apos;s viewers are,
              and show the audience split in your dashboard and every report.
            </p>
            <p className="mt-4 max-w-2xl leading-relaxed text-muted">
              Clips that miss your audience are not paid, even if they follow the rules, go viral and the views are real. That is the
              difference between buying views and buying the right views.
            </p>
          </div>
          <ul className="space-y-2.5 rounded-2xl border border-line bg-bg-raised/40 p-5 font-[family-name:var(--font-geist-mono)] text-xs sm:p-6" aria-label="Example: which views get paid">
            <li className="pb-1 font-label text-[9px] tracking-[0.14em] text-muted uppercase">Example: which views get paid</li>
            {[
              { k: `Viewers ${l.inName}, in your age range`, ok: true },
              { k: "Viewers in other countries", ok: false },
              { k: "Outside your age range", ok: false },
              { k: "Views that cannot be verified", ok: false },
            ].map((r) => (
              <li key={r.k} className={`flex items-center justify-between gap-4 rounded-lg border px-3.5 py-2.5 ${r.ok ? "border-accent/40 bg-accent/[0.06]" : "border-line bg-bg"}`}>
                <span className={r.ok ? "text-fg" : "text-muted"}>{r.k}</span>
                <span className={`flex items-center gap-1.5 ${r.ok ? "text-accent" : "text-muted/70"}`}>
                  <Mark ok={r.ok} />
                  {r.ok ? "paid" : "$0"}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* the market */}
        <section id="market" className="mx-auto max-w-6xl px-6 pb-24 sm:px-10 lg:px-12">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-line bg-bg-raised/40 p-6 sm:p-8">
              <Eyebrow>The market</Eyebrow>
              <h2 className="mt-3 text-2xl tracking-tight text-balance">{l.market.heading}</h2>
              {l.market.body.map((p) => (
                <p key={p} className="mt-3 leading-relaxed text-muted">
                  {p}
                </p>
              ))}
            </div>
            <div className="rounded-2xl border border-line bg-bg-raised/40 p-6 sm:p-8">
              <Eyebrow>Ad rules</Eyebrow>
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
          </div>
        </section>

        {/* results */}
        {proof.length > 0 && (
          <section id="results" className="mx-auto max-w-6xl px-6 pb-24 sm:px-10 lg:px-12">
            <Eyebrow>Results</Eyebrow>
            <h2 className="mt-4 max-w-3xl text-3xl tracking-tight text-balance sm:text-4xl">
              Documented results. <span className="text-muted">Counted on the platforms.</span>
            </h2>
            {l.proofNote && <p className="mt-4 max-w-2xl text-muted">{l.proofNote}</p>}
            <ul className={`mt-8 grid gap-4 ${proof.length > 1 ? "md:grid-cols-2" : ""}`}>
              {proof.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/case-studies/${c.slug}`}
                    className="group flex h-full flex-col gap-5 rounded-2xl border border-line bg-bg-raised/40 p-6 transition-colors hover:border-accent/50"
                  >
                    <div className="flex items-center gap-3">
                      {c.visual && (
                        <span className="h-10 w-10 overflow-hidden rounded-full border border-line bg-bg">
                          <Image src={c.visual.avatar} alt="" width={40} height={40} className="h-full w-full object-cover" />
                        </span>
                      )}
                      <div>
                        <p className="font-display font-semibold">{c.client}</p>
                        <p className="font-label text-[9px] tracking-[0.14em] text-muted uppercase">{c.category}</p>
                      </div>
                    </div>
                    <dl className="grid grid-cols-3 gap-4">
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
                    <span className="mt-auto font-display text-sm font-semibold text-accent transition-colors group-hover:text-fg">
                      Read the {c.client} case study →
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

      {/* short answers + other markets */}
      <section id="faq" className="mx-auto max-w-6xl px-6 pb-16 sm:px-10 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-16">
          <div>
            <Eyebrow>FAQ</Eyebrow>
            <h2 className="mt-4 text-3xl tracking-tight text-balance sm:text-4xl">
              Clipping {l.inName}. <span className="text-muted">Short answers.</span>
            </h2>
            <div className="mt-10">
              <Eyebrow>Other markets</Eyebrow>
              <ul className="mt-3 flex flex-wrap gap-2">
                {nearby.map((n) => (
                  <li key={n.slug}>
                    <Link
                      href={`/clipping-agency/${n.slug}`}
                      className="inline-flex rounded-xl border border-line bg-bg-raised/50 px-3.5 py-2 font-display text-sm font-semibold transition-colors hover:border-accent/50"
                    >
                      {n.name}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link href="/solutions" className="mt-5 inline-block font-display text-sm font-semibold text-accent transition-colors hover:text-fg">
                All solutions →
              </Link>
            </div>
          </div>
          <dl className="space-y-3">
            {faqs.map((f, i) => (
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
