import type { Metadata } from "next";

// Existing URL from the current sitemap. Content gets ported from the Lovable repo
// before launch; the path stays the same so nothing breaks.
export const metadata: Metadata = {
  title: "The Attention Monopoly System",
  description: "TODO: port the description from the current page.",
  alternates: { canonical: "/attention-monopoly-system" },
};

export default function AttentionMonopolySystem() {
  return (
    <section className="mx-auto max-w-3xl px-4 pt-24 pb-24 sm:px-6">
      <h1 className="text-5xl font-semibold tracking-tight">The Attention Monopoly System</h1>
      <p className="mt-6 text-lg text-muted">TODO: port content from the current page.</p>
    </section>
  );
}
