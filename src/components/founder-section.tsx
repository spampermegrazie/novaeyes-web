import Link from "next/link";
import { facts } from "@/content/facts";
import { FounderPortrait } from "@/components/founder-portrait";

// Homepage founder block, poster style: ANDREA CORINDO in the footer wordmark's face (Manrope
// ExtraBold), sized to the full content width, with his cut-out standing in front of it. On
// phones the name stacks on two lines so it stays big. Where the browser supports scroll-driven
// animation the name drifts a little slower than the page (.founder-name in globals.css), so he
// reads as standing in front of it. The quote, his name and the short bio sit underneath.
export function FounderSection() {
  return (
    <section id="founder" className="mx-auto max-w-6xl px-6 py-24 sm:px-10 lg:px-12">
      <p className="font-label text-[10px] tracking-[0.14em] text-muted uppercase">The founder</p>

      <div className="@container relative isolate mt-10">
        {/* dot grid and glow behind him */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-10 bottom-0 -z-10 bg-[radial-gradient(var(--line)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_45%_70%_at_50%_55%,#000_20%,transparent_100%)] [background-size:24px_24px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute top-[55%] left-1/2 -z-10 aspect-square w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(var(--glow)/0.2),rgb(var(--glow)/0.06)_50%,transparent)] lg:w-[55%]"
        />

        {/* the name, behind him */}
        <p
          aria-hidden
          className="founder-name pointer-events-none absolute inset-x-0 bottom-[18%] z-0 bg-gradient-to-b from-fg via-fg/80 to-accent/25 bg-clip-text text-center font-display text-[21.5cqw] leading-[0.8] font-extrabold tracking-[-0.03em] whitespace-nowrap text-transparent select-none lg:bottom-[24%] lg:text-[11.6cqw]"
        >
          <span className="block lg:inline">ANDREA</span> <span className="block lg:inline">CORINDO</span>
        </p>

        <FounderPortrait className="relative z-10 mx-auto w-[78%] max-w-[480px] lg:w-[44%]" />
        <div aria-hidden className="relative z-10 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent" />
      </div>

      <div className="mt-12 grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] md:items-start md:gap-16">
        <h2 className="text-3xl leading-[1.1] tracking-tight sm:text-4xl">
          <span className="block text-balance text-muted">Anyone can make content.</span>
          <span className="block text-balance">We decide who sees it.</span>
        </h2>
        <div>
          <h3 className="text-lg leading-tight">{facts.founder}</h3>
          <p className="mt-1 font-label text-[10px] tracking-[0.14em] text-muted uppercase">Founder, {facts.name}</p>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            Andrea built a media network past 500,000 followers before turning what he learned into NovaEyes. Today the network
            has {facts.clippersLabel} clippers and has delivered hundreds of millions of views for brands, artists and creators.
          </p>
          <Link href="/about" className="mt-5 inline-block font-display text-sm font-semibold text-accent transition-colors hover:text-fg">
            More about NovaEyes →
          </Link>
        </div>
      </div>
    </section>
  );
}
