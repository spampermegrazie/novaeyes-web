import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPost, getPosts, sanitizePostHtml, formatDate } from "@/lib/blog";
import { facts } from "@/content/facts";
import { Cta } from "@/components/cta";
import { JsonLd, breadcrumbJsonLd } from "@/components/json-ld";

// Cache Components needs at least one param at build time. If the posts can't be
// fetched during the build, a placeholder keeps the build valid and 404s at runtime.
export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.length ? posts.map((p) => ({ slug: p.slug })) : [{ slug: "__no-posts__" }];
}

export async function generateMetadata(props: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const post = await getPost(slug);
  if (!post) return { robots: { index: false } };
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      ...(post.cover_image_url ? { images: [post.cover_image_url] } : {}),
    },
  };
}

export default async function BlogPostPage(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;
  const post = await getPost(slug);
  if (!post) notFound();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.published_at ?? undefined,
    dateModified: post.updated_at,
    author: { "@type": "Person", name: post.author?.name ?? post.author_name },
    publisher: { "@id": `${facts.url}/#organization` },
    mainEntityOfPage: `${facts.url}/blog/${post.slug}`,
    ...(post.cover_image_url ? { image: post.cover_image_url } : {}),
  };

  return (
    <>
      <JsonLd data={articleJsonLd} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: post.title, path: `/blog/${post.slug}` },
        ])}
      />
      <article className="mx-auto max-w-3xl px-4 pt-24 pb-12 sm:px-6">
        <p className="text-sm text-muted">
          {formatDate(post.published_at)} · {post.author?.name ?? post.author_name}
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">{post.title}</h1>
        <p className="mt-6 text-lg text-muted">{post.excerpt}</p>
        {post.cover_image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.cover_image_url} alt="" className="mt-10 w-full rounded-2xl border border-line" />
        )}
        <div className="post-body mt-10" dangerouslySetInnerHTML={{ __html: sanitizePostHtml(post.body) }} />
      </article>
      <Cta />
    </>
  );
}
