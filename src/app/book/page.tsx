import type { Metadata } from "next";
import { BookCall } from "@/components/book-call";
import { CONTAINER, PageHeader, Rule } from "@/components/page-kit";

export const metadata: Metadata = {
  title: "Book a 15-Minute Reach Audit",
  description: "Book a 15-minute call with NovaEyes. We look at your content and tell you what a clipping campaign could deliver.",
  alternates: { canonical: "/book" },
};

const WHAT = [
  { t: "15 minutes", b: "We look at your content, your goals and your budget." },
  { t: "A clear answer", b: "What a campaign could deliver, at what cost per 1,000 views, for which audience." },
  { t: "Live in 24 hours", b: "If you go ahead, the campaign launches within 24 hours of the onboarding call." },
];

export default function Book() {
  return (
    <>
      <PageHeader
        crumbs={[{ name: "Home", href: "/" }, { name: "Book a call" }]}
        title="Book a 15-minute reach audit."
        lead={<p>Bring the content you want to push. You leave with a view estimate, a CPM range and a campaign outline.</p>}
        after={
          <ul className="mt-12 grid max-w-4xl grid-cols-1 gap-10 sm:grid-cols-3">
            {WHAT.map((x, i) => (
              <li key={x.t} className="min-w-0">
                <Rule on={i === 0} />
                <p className="mt-5 font-display font-semibold">{x.t}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{x.b}</p>
              </li>
            ))}
          </ul>
        }
      />
      <section className={`${CONTAINER} pb-24`}>
        <BookCall />
      </section>
    </>
  );
}
