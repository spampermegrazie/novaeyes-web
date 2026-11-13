import type { Metadata } from "next";
import { BookCall } from "@/components/book-call";

export const metadata: Metadata = {
  title: "Book a 15-Minute Reach Audit",
  description: "Book a 15-minute call with NovaEyes. We look at your content and tell you what a clipping campaign could deliver.",
  alternates: { canonical: "/book" },
};

export default function Book() {
  return (
    <section className="mx-auto max-w-4xl px-4 pt-24 pb-24 sm:px-6">
      <h1 className="text-5xl font-bold tracking-tight">Book a 15-minute reach audit</h1>
      <p className="mt-6 max-w-2xl text-lg text-muted">
        Bring the content you want to push. You leave with a view estimate, a CPM range and a campaign outline.
      </p>
      <ul className="mt-8 grid max-w-3xl gap-3 sm:grid-cols-3">
        {[
          { t: "15 minutes", b: "We look at your content, your goals and your budget." },
          { t: "A clear answer", b: "What a campaign could deliver, at what cost per 1,000 views, for which audience." },
          { t: "Live in 24 hours", b: "If you go ahead, the campaign launches within 24 hours of the onboarding call." },
        ].map((x) => (
          <li key={x.t} className="rounded-2xl border border-line bg-bg-raised/40 p-5">
            <p className="font-display font-semibold">{x.t}</p>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">{x.b}</p>
          </li>
        ))}
      </ul>
      <div className="mt-12">
        <BookCall />
      </div>
    </section>
  );
}
