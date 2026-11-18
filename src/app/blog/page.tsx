import type { Metadata } from "next";
import Link from "next/link";
import { getPosts, formatDate } from "@/lib/blog";
import { Cta } from "@/components/cta";
import { CONTAINER, PageHeader } from "@/components/page-kit";

export const metadata: Metadata = {
  title: "Clipping and Short-Form Distribution Blog",
  description: "Guides and breakdowns on performance clipping, short-form distribution and creator-led growth from the NovaEyes team.",
  alternates: { canonical: "/blog" },
};

export default async function Blog() {
  const posts = await getPosts();
  const [lead, ...rest] = posts;

  return (
    <>
      <PageHeader
        crumbs={[{ name: "Home", href: "/" }, { name: "Blog" }]}
        title="Blog."
        muted="Guides on clipping, short-form distribution and what moves views."
      />

      <section className={`${CONTAINER} pb-24`}>
        {!lead ? (
          <p className="text-muted">New posts are on the way.</p>
        ) : (
          <>
            {/* the latest post, big */}
            <Link
              href={`/blog/${lead.slug}`}
              className={`group grid grid-cols-1 items-center gap-8 lg:gap-14 ${lead.cover_image_url ? "lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]" : "max-w-3xl"}`}
            >
              {lead.cover_image_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={lead.cover_image_url}
                  alt=""
                  className="aspect-[16/9] w-full rounded-2xl border border-line object-cover transition-[border-color] duration-300 group-hover:border-accent/50"
                />
              )}
              <div className="min-w-0">
                <p className="font-label text-[10px] tracking-[0.14em] text-accent uppercase">Latest · {formatDate(lead.published_at)}</p>
                <h2 className="mt-4 text-3xl leading-tight tracking-tight text-balance transition-colors group-hover:text-accent sm:text-4xl">{lead.title}</h2>
                <p className="mt-4 line-clamp-3 leading-relaxed text-muted">{lead.excerpt}</p>
              </div>
            </Link>

            {rest.length > 0 && (
              <ul className="mt-24 grid grid-cols-1 gap-x-10 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
                {rest.map((p) => (
                  <li key={p.id} className="min-w-0">
                    <Link href={`/blog/${p.slug}`} className="group block">
                      {p.cover_image_url && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={p.cover_image_url}
                          alt=""
                          loading="lazy"
                          className="aspect-[16/9] w-full rounded-xl border border-line object-cover transition-[border-color] duration-300 group-hover:border-accent/50"
                        />
                      )}
                      <p className="mt-5 text-xs text-muted">{formatDate(p.published_at)}</p>
                      <h2 className="mt-2 text-lg leading-snug font-semibold text-balance transition-colors group-hover:text-accent">{p.title}</h2>
                      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">{p.excerpt}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </section>
      <Cta />
    </>
  );
}
