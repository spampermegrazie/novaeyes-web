import type { NextConfig } from "next";

// The client and admin dashboards are the Lovable app, deployed as its own Vercel
// project. Its routes already live under /app (/app/login, /app/admin, /app/client...),
// so this site proxies those paths to it and visitors only ever see nova-eyes.com/app.
// The Vite build loads its JS and CSS from /assets, and the temp-password flow
// uses /change-password, so both are proxied too.
// Set DASHBOARD_ORIGIN in Vercel, e.g. https://novaeyes-app.vercel.app (no trailing slash).
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
      { source: "/assets/:path+", destination: `${DASHBOARD_ORIGIN}/assets/:path+` },
      { source: "/change-password", destination: `${DASHBOARD_ORIGIN}/change-password` },
    ];
  },
  async redirects() {
    return [
      // Legacy URLs from the current site.
      { source: "/bravecf-case", destination: "/case-studies/brave-cf", permanent: true },
      { source: "/alexschor-case", destination: "/case-studies/alex-schor", permanent: true },
      { source: "/robthebank-case", destination: "/case-studies/rob-the-bank", permanent: true },
      { source: "/familyties-case", destination: "/case-studies/family-ties", permanent: true },
      { source: "/contact", destination: "/book", permanent: true },
      { source: "/attention-monopoly-system", destination: "/how-it-works", permanent: true },
      { source: "/client", destination: "/app/client", permanent: false },
      { source: "/admin", destination: "/app/admin", permanent: false },
    ];
  },
  async headers() {
    return [
      { source: "/app/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
      { source: "/change-password", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
    ];
  },
};

export default nextConfig;
