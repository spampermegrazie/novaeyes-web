import type { Metadata } from "next";

// Placeholder, on purpose. Andrea wants a page about what it is like working with NovaEyes
// (the timeline from first call to final report, and so on). Content not written yet.
// Not linked anywhere, not in the sitemap, and kept out of search until it is filled in.

export const metadata: Metadata = {
  title: "Working With NovaEyes",
  description: "What it is like to work with NovaEyes, from the first call to the final report.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/working-with-us" },
};

export default function WorkingWithUs() {
  return (
    <section className="mx-auto max-w-6xl px-6 pt-20 pb-32 sm:px-10 lg:px-12">
      <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">Working with us</h1>
    </section>
  );
}
