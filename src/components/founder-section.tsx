import Link from "next/link";
import { facts } from "@/content/facts";
import { FounderPortrait } from "@/components/founder-portrait";

// Homepage founder block. No panel and no numbers: the line Andrea built the company on is the
// heading, set big and two-tone like the other section headings, signed with his name. His
// cut-out stands on a glowing horizon line (the edge light of the studio platform) over the
// hero's dot grid. On phones the portrait sits between the line and the signature.
export function FounderSection() {
  return (
    <section id="founder" className="mx-auto max-w-6xl px-6 py-24 sm:px-10 lg:px-12">
      <div className="grid items-center gap-x-16 gap-y-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        <div className="lg:col-start-1 lg:row-start-1 lg:self-end">
          <p className="font-label text-[10px] tracking-[0.14em] text-muted uppercase">The founder</p>
          <h2 className="mt-5 text-4xl leading-[1.05] tracking-tight sm:text-5xl lg:text-[56px]">
            <span className="block text-balance text-muted">Anyone can make content.</span>
            <span className="block text-balance">We decide who sees it.</span>
          </h2>
        </div>

        <div className="relative isolate mx-auto w-full max-w-sm lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:max-w-none">
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-x-10 -top-10 bottom-0 -z-10 bg-[radial-gradient(var(--line)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_65%_70%_at_50%_60%,#000_25%,transparent_100%)] [background-size:24px_24px]"
          />
          <FounderPortrait className="w-full" />
          {/* the horizon he stands on: a line of light with a soft pool under it */}
          <div aria-hidden className="pointer-events-none absolute inset-x-[-12%] bottom-0 h-px bg-gradient-to-r from-transparent via-accent/80 to-transparent" />
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-0 left-1/2 h-20 w-[90%] -translate-x-1/2 translate-y-1/2 rounded-[100%] bg-[radial-gradient(closest-side,rgb(var(--glow)/0.28),transparent)]"
          />
        </div>

        <div className="lg:col-start-1 lg:row-start-2 lg:self-start">
          <div className="flex items-center gap-4">
            <span aria-hidden className="h-px w-10 shrink-0 bg-accent shadow-[0_0_10px_rgb(var(--glow))]" />
            <div>
              <h3 className="text-lg leading-tight">{facts.founder}</h3>
              <p className="mt-1 font-label text-[10px] tracking-[0.14em] text-muted uppercase">Founder, {facts.name}</p>
            </div>
          </div>
          <p className="mt-6 max-w-md leading-relaxed text-muted">
            Andrea built a media network past 500,000 followers before turning what he learned into NovaEyes. Today the network
            has {facts.clippersLabel} clippers and has delivered hundreds of millions of views for brands, artists and creators.
          </p>
          <Link href="/about" className="mt-6 inline-block font-display text-sm font-semibold text-accent transition-colors hover:text-fg">
            More about NovaEyes →
          </Link>
        </div>
      </div>
    </section>
  );
}
