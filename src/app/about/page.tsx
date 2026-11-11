import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { facts } from "@/content/facts";
import { publicCampaigns } from "@/content/campaigns";
import { Cta } from "@/components/cta";
import { JsonLd, breadcrumbJsonLd, aboutPageJsonLd } from "@/components/json-ld";
import founderPhoto from "../../../public/andrea-corindo.jpg";

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
        <header className="mx-auto max-w-3xl px-4 pt-24 pb-10 sm:px-6">
          <nav aria-label="Breadcrumb" className="text-sm text-muted">
            <Link href="/" className="hover:text-fg">
              Home
            </Link>{" "}
            / <span>About</span>
          </nav>
          <h1 className="mt-6 text-5xl font-bold tracking-tight sm:text-6xl">About NovaEyes</h1>
          <p className="mt-6 text-lg leading-relaxed text-muted">
            NovaEyes is a clipping agency that gets videos seen. We run a network of {facts.clippersLabel} clippers who post
            short clips of our clients&apos; content on TikTok, Instagram Reels, YouTube Shorts and X. We get paid on views,
            not on promises.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            The company was founded in {facts.foundingYear} by {facts.founder} and is based in {facts.location}.
          </p>
        </header>

        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <section className="grid gap-8 py-10 sm:grid-cols-[200px_1fr] sm:items-start">
            <Image
              src={founderPhoto}
              alt={`${facts.founder}, founder of NovaEyes`}
              sizes="(min-width: 640px) 200px, 100vw"
              className="w-full max-w-[240px] rounded-2xl border border-line object-cover"
              placeholder="blur"
            />
            <div>
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Who started NovaEyes?</h2>
              <p className="mt-4 text-lg leading-relaxed text-muted">
                {facts.founder}. Before NovaEyes, Andrea grew a media network past 500,000 followers, and that is where he
                learned how short clips spread. NovaEyes turns what he learned into a service for brands, artists and
                creators.
              </p>
              <ul className="mt-6 flex flex-wrap gap-3">
                {profiles.map((p) => (
                  <li key={p.href}>
                    <a
                      href={p.href}
                      target="_blank"
                      rel="noopener noreferrer me"
                      className="inline-block rounded-full border border-line px-4 py-2 text-sm hover:border-muted/50"
                    >
                      Andrea on {p.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="py-10">
            <blockquote className="border-l-2 border-accent pl-6 text-2xl font-display font-semibold sm:text-3xl">
              Anyone can make content. We decide who sees it.
            </blockquote>
          </section>

          <section className="py-10">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Why do we only charge for verified views?</h2>
            <p className="mt-4 text-lg leading-relaxed text-muted">
              Because it keeps everyone honest. Clippers only earn when their clips get views, and clients only pay for views
              we can verify on the platforms. If a format stops working, the money moves to one that does. There is no
              retainer to hide behind.
            </p>
          </section>

          <section className="py-10">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">NovaEyes in numbers</h2>
            <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line">
              {facts.stats.map((s) => (
                <div key={s.label} className="bg-bg px-6 py-6">
                  <dd className="font-display text-2xl font-bold tracking-tight">{s.value}</dd>
                  <dt className="mt-1 text-sm text-muted">{s.label}</dt>
                </div>
              ))}
            </dl>
          </section>

          <section className="py-10">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Who have we worked with?</h2>
            <p className="mt-4 text-lg leading-relaxed text-muted">
              Musicians, podcasts, fight promotions, creators and ecommerce brands. A few of the campaigns we can show:
            </p>
            <ul className="mt-6 divide-y divide-line border-y border-line">
              {publicCampaigns.map((c) => (
                <li key={c.slug}>
                  <Link href={`/case-studies/${c.slug}`} className="flex items-baseline justify-between gap-4 py-4 hover:text-accent">
                    <span>
                      {c.client} <span className="text-sm text-muted">{c.category}</span>
                    </span>
                    <span className="font-display text-sm font-semibold tabular-nums">{c.viewsLabel} views</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="py-10">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">How do I get in touch?</h2>
            <p className="mt-4 text-lg leading-relaxed text-muted">
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
        </div>
      </article>
      <Cta />
    </>
  );
}
