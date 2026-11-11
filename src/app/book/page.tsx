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
      <h1 className="text-5xl font-semibold tracking-tight">Book a 15-minute reach audit</h1>
      <p className="mt-6 max-w-2xl text-lg text-muted">
        Bring the content you want to push. You leave with a view estimate, a CPM range and a campaign outline.
      </p>
      <div className="mt-12">
        <BookCall />
      </div>
    </section>
  );
}
