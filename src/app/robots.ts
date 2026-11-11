import type { MetadataRoute } from "next";
import { facts } from "@/content/facts";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Client and admin dashboards, and API routes, stay out of search.
        disallow: ["/app", "/api/", "/change-password", "/thank-you"],
      },
    ],
    sitemap: `${facts.url}/sitemap.xml`,
  };
}
