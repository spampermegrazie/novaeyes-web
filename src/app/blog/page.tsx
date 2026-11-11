import type { Metadata } from "next";
import Link from "next/link";
import { getPosts, formatDate } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Clipping and Short-Form Distribution Blog",
  description: "Guides and breakdowns on performance clipping, short-form distribution and creator-led growth from the NovaEyes team.",
  alternates: { canonical: "/blog" },
};

export default async function Blog() {
  const posts = await getPosts();

  return (
    <section className="mx-auto max-w-6xl px-4 pt-24 pb-24 sm:px-6">
      <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">Blog</h1>
      <p className="mt-6 max-w-2xl text-lg text-muted">
        Guides and breakdowns on clipping, short-form distribution and what moves views.
      </p>
      {posts.length === 0 ? (
        <p className="mt-16 text-muted">New posts are on the way.</p>
      ) : (
        <ul className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <li key={p.id}>
              <Link href={`/blog/${p.slug}`} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-bg-raised">
                {p.cover_image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.cover_image_url} alt="" loading="lazy" className="aspect-[16/9] w-full object-cover" />
                )}
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-xs text-muted">{formatDate(p.published_at)}</p>
                  <h2 className="mt-2 text-lg font-semibold leading-snug group-hover:text-accent">{p.title}</h2>
                  <p className="mt-3 line-clamp-3 text-sm text-muted">{p.excerpt}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
