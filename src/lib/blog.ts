import { cacheLife, cacheTag } from "next/cache";

// Blog posts come from the same database the admin blog builder writes to,
// through the existing public endpoints of the Lovable app's `api` edge function:
//   GET /functions/v1/api/blog-posts             published posts
//   GET /functions/v1/api/blog-posts/slug/:slug  one post
// Results are cached for hours and tagged "blog", so /api/revalidate can refresh them on publish.

export type BlogAuthor = {
  id: string;
  name: string;
  role: string;
  tagline: string;
  avatar_url: string | null;
};

export type BlogPostListItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  cover_image_url: string | null;
  author_name: string;
  author?: BlogAuthor | null;
  tags: string[];
  published_at: string | null;
};

export type BlogPost = BlogPostListItem & {
  body: string; // HTML from the admin editor
  updated_at: string;
};

const SUPABASE_URL = process.env.SUPABASE_URL;
const PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY;

async function callApi<T>(path: string): Promise<T | null> {
  if (!SUPABASE_URL || !PUBLISHABLE_KEY) return null;
  try {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/api/${path}`, {
      headers: { apikey: PUBLISHABLE_KEY, Authorization: `Bearer ${PUBLISHABLE_KEY}` },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as T & { error?: string };
    if (data && typeof data === "object" && "error" in data && data.error) return null;
    return data;
  } catch {
    return null;
  }
}

export async function getPosts(): Promise<BlogPostListItem[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("blog");
  const posts = await callApi<BlogPostListItem[]>("blog-posts");
  return Array.isArray(posts) ? posts : [];
}

export async function getPost(slug: string): Promise<BlogPost | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("blog");
  return callApi<BlogPost>(`blog-posts/slug/${encodeURIComponent(slug)}`);
}

// Defence in depth: posts are written by admins, but strip anything executable anyway.
export function sanitizePostHtml(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<(iframe|object|embed)[\s\S]*?>[\s\S]*?<\/\1>/gi, "")
    .replace(/\son[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/(href|src)\s*=\s*("|')\s*javascript:[^"']*\2/gi, '$1="#"');
}

export function formatDate(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}
