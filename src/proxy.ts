import { NextResponse, type NextRequest } from "next/server";
import { publicCampaigns } from "@/content/campaigns";

// Unknown case study slugs get a real 404 status instead of a streamed
// not-found page with a 200, so search engines don't log soft 404s.
const known = new Set(publicCampaigns.map((c) => c.slug));

const NOT_FOUND_HTML = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Case study not found | NovaEyes</title><style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#050507;color:#f4f4f6;font-family:system-ui,sans-serif;text-align:center}a{color:#7c8cff}</style></head><body><main><h1>Case study not found</h1><p><a href="/case-studies">See all case studies</a></p></main></body></html>`;

export function proxy(request: NextRequest) {
  const slug = request.nextUrl.pathname.split("/")[2];
  if (slug && !known.has(slug)) {
    // A direct response: a rewrite to the not-found page streams a 200 on first hit.
    return new NextResponse(NOT_FOUND_HTML, {
      status: 404,
      headers: { "content-type": "text/html; charset=utf-8", "x-robots-tag": "noindex" },
    });
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/case-studies/:slug",
};
