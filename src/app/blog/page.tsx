import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Clipping and Short-Form Distribution Blog",
  description: "Guides and data on clipping campaigns, short-form distribution and CPMs from NovaEyes.",
  alternates: { canonical: "/blog" },
};

// TODO: read published posts from the same table the admin blog builder writes to,
// and add /blog/[slug]. Needs the table schema from the Lovable repo.
export default function Blog() {
  return (
    <section className="mx-auto max-w-3xl px-4 pt-24 pb-24 sm:px-6">
      <h1 className="text-5xl font-semibold tracking-tight">Blog</h1>
      <p className="mt-6 text-lg text-muted">Posts are being moved to the new site.</p>
    </section>
  );
}
