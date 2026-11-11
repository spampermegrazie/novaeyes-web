import type { NextConfig } from "next";

// The client and admin dashboards are a separate Vercel project (the Lovable app),
// built with base path /app. This site proxies /app to it, so visitors only ever
// see nova-eyes.com/app. Set DASHBOARD_ORIGIN in Vercel, e.g.
// https://novaeyes-app.vercel.app (no trailing slash).
const DASHBOARD_ORIGIN = process.env.DASHBOARD_ORIGIN;

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async rewrites() {
    if (!DASHBOARD_ORIGIN) return [];
    return [
      { source: "/app", destination: `${DASHBOARD_ORIGIN}/app` },
      { source: "/app/:path+", destination: `${DASHBOARD_ORIGIN}/app/:path+` },
    ];
  },
  async headers() {
    return [
      {
        source: "/app/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default nextConfig;
