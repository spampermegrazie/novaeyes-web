// Single source of truth for every public fact about NovaEyes.
// Pages, schema, llms.txt and the estimator all read from here.
// Change a fact here and it changes everywhere.

export const facts = {
  name: "NovaEyes",
  legalName: "NovaEyes",
  url: "https://nova-eyes.com",
  tagline: "Performance-based clipping agency",
  oneLiner:
    "NovaEyes is a performance-based clipping agency. Clients fund a view pool and pay only for verified short-form views, delivered by a network of 20,000 clippers across TikTok, Instagram Reels, YouTube Shorts and X.",
  foundingYear: 2025,
  founder: "Andrea",
  location: "Ferrara, Italy",
  clippers: 20_000,
  clippersLabel: "20,000",
  platforms: ["TikTok", "Instagram Reels", "YouTube Shorts", "X"],
  model: "Clients fund a view pool and pay only for verified views.",
  minimumBudgetUsd: 3_000,
  minimumBudgetLabel: "$3,000",
  // Fill in once the profiles exist. Used for Organization schema sameAs.
  sameAs: [] as string[],
} as const;

export const nav = [
  { href: "/case-studies", label: "Case studies" },
  { href: "/pricing", label: "Pricing" },
  { href: "/reach-estimator", label: "Estimate reach" },
  { href: "/blog", label: "Blog" },
  { href: "/faq", label: "FAQ" },
] as const;

export const verticalLinks = [
  { href: "/combat-sports-clipping", label: "Combat sports" },
  { href: "/music-clipping", label: "Music" },
  { href: "/podcast-clipping", label: "Podcasts" },
  { href: "/logo-clipping", label: "Logo clipping" },
  { href: "/product-clipping", label: "Product clipping" },
] as const;
