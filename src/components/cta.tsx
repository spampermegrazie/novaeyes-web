import Link from "next/link";
import { ShinyButton } from "@/components/ui/shiny-button";

export function Cta({
  title = "See what your budget buys",
  body = "Get a reach estimate in under a minute, or book a 15-minute reach audit.",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24 sm:px-10 lg:px-12">
      <div className="rounded-3xl border border-line bg-bg-raised px-6 py-14 text-center sm:px-12">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
        <p className="mx-auto mt-4 max-w-xl text-muted">{body}</p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <ShinyButton href="/book">Book a 15-minute reach audit</ShinyButton>
          <Link href="/reach-estimator" className="font-display font-semibold rounded-xl border border-line px-6 py-3 text-sm hover:border-muted/50">
            Estimate your reach
          </Link>
        </div>
      </div>
    </section>
  );
}
