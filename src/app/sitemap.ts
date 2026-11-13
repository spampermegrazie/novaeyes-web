import type { MetadataRoute } from "next";
import { facts } from "@/content/facts";
import { publicCampaigns } from "@/content/campaigns";
import { verticals } from "@/content/verticals";
import { getPosts } from "@/lib/blog";

// Update a page's date here when its content changes, so lastmod stays honest.
const UPDATED = "2026-11-13";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const url = (path: string) => `${facts.url}${path}`;
  const posts = await getPosts();
  return [
    ...posts.map((p) => ({
      url: url(`/blog/${p.slug}`),
      lastModified: p.published_at ?? UPDATED,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    { url: url("/"), lastModified: UPDATED, changeFrequency: "weekly", priority: 1 },
    { url: url("/case-studies"), lastModified: UPDATED, changeFrequency: "monthly", priority: 0.8 },
    ...publicCampaigns.map((c) => ({
      url: url(`/case-studies/${c.slug}`),
      lastModified: UPDATED,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...verticals.map((v) => ({
      url: url(v.path),
      lastModified: UPDATED,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    { url: url("/about"), lastModified: UPDATED, changeFrequency: "yearly", priority: 0.7 },
    { url: url("/pricing"), lastModified: UPDATED, changeFrequency: "monthly", priority: 0.8 },
    { url: url("/reach-estimator"), lastModified: UPDATED, changeFrequency: "monthly", priority: 0.8 },
    { url: url("/faq"), lastModified: UPDATED, changeFrequency: "monthly", priority: 0.7 },
    { url: url("/book"), lastModified: UPDATED, changeFrequency: "yearly", priority: 0.6 },
    { url: url("/blog"), lastModified: UPDATED, changeFrequency: "weekly", priority: 0.8 },
    { url: url("/attention-monopoly-system"), lastModified: UPDATED, changeFrequency: "monthly", priority: 0.7 },
    // /best-clipping-agencies joins the sitemap once competitor rows are verified and it is indexable.
  ];
}
