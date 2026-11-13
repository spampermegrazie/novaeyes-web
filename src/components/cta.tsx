import Link from "next/link";
import { ShinyButton } from "@/components/ui/shiny-button";
import { LogoMark } from "@/components/brand";

export function Cta({
  title = "See what your budget buys",
  body = "Get a reach estimate in under a minute, or book a 15-minute reach audit.",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24 sm:px-10 lg:px-12">
      <div className="relative overflow-hidden rounded-3xl border border-line bg-bg-raised/40 px-6 py-16 text-center sm:px-12 sm:py-20">
        {/* dot grid, a glow rising from the bottom and a light running along the top edge */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(var(--line-strong)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_60%_70%_at_50%_100%,#000_20%,transparent_100%)] [background-size:22px_22px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-40 left-1/2 h-80 w-[46rem] max-w-[140%] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(var(--glow)/0.3),transparent)]"
        />
        <span aria-hidden className="sb-sweep pointer-events-none absolute top-0 left-0 h-px w-1/4 bg-gradient-to-r from-transparent via-accent to-transparent" />
        <div className="relative">
          <LogoMark className="mx-auto h-5 w-auto text-fg/80" />
          <h2 className="mx-auto mt-6 max-w-2xl text-3xl tracking-tight text-balance sm:text-5xl">{title}</h2>
          <p className="mx-auto mt-4 max-w-xl text-balance text-muted sm:text-lg">{body}</p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <ShinyButton href="/book">Book a 15-minute reach audit</ShinyButton>
            <Link
              href="/reach-estimator"
              className="font-display rounded-xl border border-line bg-bg/60 px-6 py-3 text-sm font-semibold backdrop-blur transition-colors hover:border-muted/50"
            >
              Estimate your reach
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
