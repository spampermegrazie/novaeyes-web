import Image from "next/image";
import Link from "next/link";
import { facts } from "@/content/facts";

// Homepage founder block, kept low-key: the section is about how NovaEyes is run, not about one
// person. The heading talks about the team, the quote and the short bio sit in a quiet note,
// and Andrea signs it with a small avatar. The big cut-out portrait stays on the About page.
export function FounderSection() {
  return (
    <section id="founder" className="mx-auto max-w-6xl px-6 py-24 sm:px-10 lg:px-12">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <div>
          <p className="font-label text-[10px] tracking-[0.14em] text-muted uppercase">Who runs it</p>
          <h2 className="mt-4 text-3xl tracking-tight text-balance sm:text-4xl">
            Run by operators. <span className="text-muted">Not spectators.</span>
          </h2>
        </div>

        <figure className="rounded-2xl border border-line bg-bg-raised/40 p-7 sm:p-9">
          <blockquote className="font-display text-xl leading-snug font-semibold tracking-tight text-balance sm:text-2xl">
            Anyone can make content. We decide who sees it.
          </blockquote>
          <p className="mt-5 leading-relaxed text-muted">
            Andrea built a media network past 500,000 followers before turning what he learned into NovaEyes. Today the network
            has {facts.clippersLabel} clippers and has delivered hundreds of millions of views for brands, artists and creators.
          </p>
          <figcaption className="mt-8 flex flex-wrap items-center justify-between gap-x-6 gap-y-4 border-t border-line pt-6">
            <span className="flex items-center gap-3">
              <Image
                src="/andrea-corindo-avatar.webp"
                alt={facts.founder}
                width={44}
                height={44}
                className="h-11 w-11 rounded-full ring-1 ring-line"
              />
              <span>
                <span className="block font-display text-sm font-semibold">{facts.founder}</span>
                <span className="mt-0.5 block font-label text-[9px] tracking-[0.12em] text-muted uppercase">Founder, {facts.name}</span>
              </span>
            </span>
            <Link href="/about" className="font-display text-sm font-semibold text-accent transition-colors hover:text-fg">
              More about NovaEyes →
            </Link>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
