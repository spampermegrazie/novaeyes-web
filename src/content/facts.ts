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
  founder: "Andrea Corindo",
  founderProfiles: [
    "https://instagram.com/andrea.corindo",
    "https://x.com/offcoree",
    "https://www.linkedin.com/in/andreacorindo",
  ],
  location: "Ferrara, Italy",
  clippers: 20_000,
  clippersLabel: "20,000",
  platforms: ["TikTok", "Instagram Reels", "YouTube Shorts", "X"],
  model: "Clients fund a view pool and pay only for verified views.",
  minimumBudgetUsd: 3_000,
  minimumBudgetLabel: "$3,000",
  launchTime: "Campaigns launch within 24 hours of the onboarding call.",
  // Audience targeting: a hard filter, not a hope. Used across the site (FAQ, service and location pages).
  targeting:
    "Yes. You choose the countries and the audience you want, like age and gender, and only views from that audience count. We brief clippers for it, track where every clip's viewers are, and show the audience split in your dashboard and every report. Clips that miss your audience are not paid, even if they go viral and the views are real.",
  // Headline stats as published on the live site. Update statsAsOf whenever the numbers change.
  statsAsOf: "November 2026",
  stats: [
    { value: "20,000+", label: "Active clippers" },
    { value: "600M+", label: "Views delivered" },
    { value: "21,000+", label: "Clips distributed" },
    { value: "44.5M+", label: "Cumulative followers reached" },
  ],
  // Company profiles (Clutch, LinkedIn company page, Trustpilot) go here once they exist.
  sameAs: [] as string[],
} as const;

export const nav = [
  { href: "/solutions", label: "Solutions" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/case-studies", label: "Case studies" },
  { href: "/pricing", label: "Pricing" },
  { href: "/reach-estimator", label: "Estimate reach" },
  { href: "/blog", label: "Blog" },
  { href: "/faq", label: "FAQ" },
] as const;

export const verticalLinks = [
  { href: "/sports-clipping", label: "Sports" },
  { href: "/combat-sports-clipping", label: "Combat sports" },
  { href: "/gaming-clipping", label: "Gaming" },
  { href: "/music-clipping", label: "Music" },
  { href: "/podcast-clipping", label: "Podcasts" },
  { href: "/app-and-startup-clipping", label: "Apps and startups" },
  { href: "/logo-clipping", label: "Logo clipping" },
  { href: "/product-clipping", label: "Product clipping" },
] as const;
