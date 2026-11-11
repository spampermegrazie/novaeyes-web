// Campaign results. Numbers come from NovaEyes campaign dashboards.
// Anything marked TODO needs confirming from the current site or the dashboard
// before launch. Never add a number here that isn't in a dashboard.

export type Campaign = {
  slug: string;
  client: string;
  vertical: "combat-sports" | "music" | "creator" | "podcast" | "brand" | "unknown";
  summary: string;
  views: number;
  viewsLabel: string;
  cpmUsd?: number;
  clips?: number;
  timeframe?: string;
  outcomes: string[];
  // Whether the client has approved naming them with figures in public material.
  // Existing site pages already name these clients; new ones need approval first.
  publicApproved: boolean;
};

export const campaigns: Campaign[] = [
  {
    slug: "alex-schor",
    client: "Alex Schor",
    vertical: "music",
    summary: "Music campaign for a meme rapper, built to turn short-form reach into streams.",
    views: 189_974_866,
    viewsLabel: "189.9M",
    cpmUsd: 0.13,
    clips: 2_444,
    outcomes: ["Spotify monthly listeners grew from 170K to 650K"],
    publicApproved: true,
  },
  {
    slug: "brave-cf",
    client: "BRAVE CF",
    vertical: "combat-sports",
    summary: "Combat sports campaign for a global MMA promotion.",
    views: 52_131_046,
    viewsLabel: "52.1M",
    cpmUsd: 0.21,
    clips: 5_247,
    timeframe: "6 weeks",
    outcomes: ["$700K in attributed revenue impact"],
    publicApproved: true,
  },
  {
    slug: "oktagon-mma",
    client: "Oktagon MMA",
    vertical: "combat-sports",
    summary: "Event campaign around Oktagon 94 in Frankfurt.",
    views: 21_000_000,
    viewsLabel: "21M",
    timeframe: "2 weeks",
    outcomes: [],
    // New case study: needs client approval before it goes live.
    publicApproved: false,
  },
  {
    slug: "rob-the-bank",
    client: "Rob The Bank",
    vertical: "unknown", // TODO confirm vertical from current site
    summary: "TODO: one-line summary from the current case study page.",
    views: 9_000_000,
    viewsLabel: "9M+",
    outcomes: ["$186K to $267K in revenue impact"],
    publicApproved: true,
  },
  {
    slug: "ahmed-amwell",
    client: "Ahmed Amwell",
    vertical: "unknown", // TODO confirm vertical from current site
    summary: "TODO: one-line summary from the current case study page.",
    views: 8_400_000,
    viewsLabel: "8.4M",
    cpmUsd: 0.36,
    clips: 1_706,
    outcomes: [],
    publicApproved: true,
  },
  {
    slug: "family-ties",
    client: "Family Ties",
    vertical: "creator",
    summary: "Creator campaign for the Sidemen brothers' Family Ties, with Tobi Brown.",
    views: 7_200_000,
    viewsLabel: "7.2M",
    cpmUsd: 0.41,
    clips: 843,
    outcomes: ["2M+ additional YouTube views"],
    publicApproved: true,
  },
  {
    slug: "sparkle",
    client: "Sparkle",
    vertical: "unknown", // TODO confirm vertical from current site
    summary: "TODO: one-line summary from the current case study page.",
    views: 4_700_000,
    viewsLabel: "4.7M",
    cpmUsd: 0.21,
    clips: 119,
    timeframe: "3 days",
    outcomes: [],
    publicApproved: true,
  },
];

export const publicCampaigns = campaigns.filter((c) => c.publicApproved);

export function getCampaign(slug: string) {
  return publicCampaigns.find((c) => c.slug === slug);
}

export const totalPublicViews = publicCampaigns.reduce((sum, c) => sum + c.views, 0);
