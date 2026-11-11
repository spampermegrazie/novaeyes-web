# nova-eyes.com

The public NovaEyes site: Next.js 16 on Vercel, every page served as real HTML so search engines and AI crawlers can read it.

## Where things live

| Path | What | Source |
| --- | --- | --- |
| `/` and all marketing pages | This repo | `src/app` |
| `/app/*` | Client and admin dashboards | The Lovable app, its own Vercel project, proxied here |
| Facts (network size, minimum, founding year) | One file | `src/content/facts.ts` |
| Campaign results | One file | `src/content/campaigns.ts` |
| Estimator CPM ranges per niche | One file, **placeholder values** | `src/content/estimator-config.ts` |

## Environment variables

Copy `.env.example` to `.env.local` for local work, and set the same keys in Vercel.

| Key | Purpose |
| --- | --- |
| `NEXT_PUBLIC_CAL_LINK` | Cal event, e.g. `novaeyes/reach-audit` |
| `DASHBOARD_ORIGIN` | Dashboard project URL for the `/app` proxy, e.g. `https://novaeyes-app.vercel.app` |
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | Lead storage (server only) |
| `RESEND_API_KEY`, `LEADS_FROM_EMAIL` | Estimate emails |

In production, the estimator refuses to accept a lead if storage isn't configured, so no lead is ever dropped silently.

## Setup checklist

1. Run `supabase/leads.sql` in the database the Lovable app uses.
2. Create the Cal booking questions listed at the top of `src/components/book-call.tsx`.
3. Deploy this repo to Vercel and add the environment variables.
4. Deploy the dashboard (below) and set `DASHBOARD_ORIGIN`.
5. Point nova-eyes.com at this Vercel project.

## Serving the dashboard at /app

The Lovable app needs to know it lives under `/app`. Make it switch on only in the Vercel build, so Lovable's own preview keeps working at the root:

```ts
// vite.config.ts in the Lovable repo
const base = process.env.VITE_BASE_PATH ?? "/";
export default defineConfig({
  base,
  build: { outDir: base === "/" ? "dist" : "dist/app" },
  // ...existing config
});
```

```tsx
// Router in the Lovable app
<BrowserRouter basename={import.meta.env.BASE_URL}>
```

```json
// vercel.json in the Lovable repo
{ "rewrites": [{ "source": "/app/(.*)", "destination": "/app/index.html" }, { "source": "/app", "destination": "/app/index.html" }] }
```

In the dashboard's Vercel project: set `VITE_BASE_PATH=/app/` and the output directory to `dist`. In Supabase auth settings, add `https://nova-eyes.com/app/**` to the allowed redirect URLs.

## Before launch

- [ ] Real palette, logo and favicon (placeholder tokens in `src/app/globals.css`)
- [ ] Estimator CPM ranges from the campaign dashboards
- [ ] Port copy for `/attention-monopoly-system`, case study details and the blog
- [ ] Oktagon case study approved by the client (`publicApproved` in `campaigns.ts`)
- [ ] Competitor rows on `/best-clipping-agencies` checked on each agency's own site, then remove `noindex`
- [ ] Real contact email in the footer
- [ ] Scroll stages and motion pass
