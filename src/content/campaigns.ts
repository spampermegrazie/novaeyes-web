// Campaign results, aligned with the live case study pages.
// Numbers come from NovaEyes campaign dashboards. Never add a number here
// that isn't in a dashboard.

export type Campaign = {
  slug: string;
  client: string;
  category: string;
  vertical: "combat-sports" | "music" | "podcast" | "business" | "brand";
  summary: string;
  views: number;
  viewsLabel: string;
  cpmUsd?: number;
  spendUsd?: number;
  clips?: number;
  timeframe?: string;
  outcomes: string[];
  // One short result line, shown with the blue dot on the homepage.
  highlight: string;
  // Homepage visual: a tinted cut-out portrait for people, a white logo for brands.
  // Files live in public/clients. avatar is the small round image in the list.
  visual?: { kind: "portrait" | "logo"; src: string; avatar: string; width: number; height: number };
  // Whether the client has approved naming them with figures in public material.
  // The live site already names the approved ones; new ones need approval first.
  publicApproved: boolean;
};

export const campaigns: Campaign[] = [
  {
    slug: "alex-schor",
    client: "Alex Schor",
    category: "Music, artist",
    vertical: "music",
    summary:
      "We scaled a high-volume short-form pipeline for Alex Schor and distributed it through a pay-per-view creator network across Instagram, TikTok and YouTube.",
    views: 189_974_866,
    viewsLabel: "189.9M",
    cpmUsd: 0.13,
    clips: 2_444,
    timeframe: "4 months",
    outcomes: ["Spotify monthly listeners grew from 170K to 650K"],
    highlight: "Spotify monthly listeners from 170K to 650K",
    visual: { kind: "portrait", src: "/clients/alex.webp", avatar: "/clients/alex-avatar.webp", width: 670, height: 900 },
    publicApproved: true,
  },
  {
    slug: "brave-cf",
    client: "BRAVE CF",
    category: "Sports, combat sports",
    vertical: "combat-sports",
    summary: "We helped BRAVE Combat Federation generate 50M+ organic views with a distribution engine that only pays on results.",
    views: 52_131_046,
    viewsLabel: "52.1M",
    cpmUsd: 0.21,
    clips: 5_247,
    timeframe: "6 weeks",
    outcomes: ["$700K in attributed revenue impact"],
    highlight: "An estimated $700K in revenue impact",
    visual: { kind: "logo", src: "/clients/brave-logo.png", avatar: "/clients/brave-avatar.webp", width: 1200, height: 268 },
    publicApproved: true,
  },
  {
    slug: "oktagon-mma",
    client: "Oktagon MMA",
    category: "Sports, combat sports",
    vertical: "combat-sports",
    summary: "Event campaign around Oktagon 94 in Frankfurt.",
    views: 21_000_000,
    viewsLabel: "21M",
    timeframe: "2 weeks",
    outcomes: [],
    // TODO: final numbers and result line from Andrea, plus Patrick's OK to show it.
    highlight: "",
    visual: { kind: "logo", src: "/clients/oktagon-logo.png", avatar: "/clients/oktagon-avatar.webp", width: 600, height: 600 },
    publicApproved: false,
  },
  {
    slug: "rob-the-bank",
    client: "Rob The Bank",
    category: "Business, ecommerce",
    vertical: "business",
    summary:
      "We built Rob The Bank a fully branded content engine from scratch: dedicated pages, curated clips and a funnel that turned attention into digital product sales.",
    views: 9_000_000,
    viewsLabel: "9M+",
    clips: 430,
    timeframe: "4 months",
    outcomes: ["$186K to $267K in revenue impact"],
    highlight: "$186K to $267K in revenue impact",
    visual: { kind: "portrait", src: "/clients/robthebank.webp", avatar: "/clients/robthebank-avatar.webp", width: 778, height: 542 },
    publicApproved: true,
  },
  {
    slug: "ahmed-amwell",
    client: "Ahmed Amwell",
    category: "Business, luxury lifestyle",
    vertical: "business",
    summary:
      "We turned Ahmed Amwell's dormant YouTube catalog into 8.4 million organic views across TikTok, Instagram Reels and YouTube Shorts.",
    views: 8_400_000,
    viewsLabel: "8.4M",
    cpmUsd: 0.36,
    spendUsd: 3_000,
    clips: 1_706,
    timeframe: "20 days",
    outcomes: [],
    highlight: "A dormant YouTube catalog put back to work in 20 days",
    visual: { kind: "portrait", src: "/clients/ahmed.webp", avatar: "/clients/ahmed-avatar.webp", width: 785, height: 900 },
    publicApproved: true,
  },
  {
    slug: "family-ties",
    client: "Family Ties",
    category: "Entertainment, podcast",
    vertical: "podcast",
    summary: "We clipped 5 episodes of the Family Ties podcast, with Tobi Brown of the Sidemen, and generated millions of views.",
    views: 7_235_433,
    viewsLabel: "7.2M",
    cpmUsd: 0.41,
    spendUsd: 3_000,
    clips: 843,
    outcomes: ["2M+ additional YouTube views"],
    highlight: "2M+ additional YouTube views",
    visual: { kind: "portrait", src: "/clients/familyties.webp", avatar: "/clients/familyties-avatar.webp", width: 900, height: 581 },
    publicApproved: true,
  },
  {
    slug: "sparkle",
    client: "Sparkle",
    category: "Music, R&B",
    vertical: "music",
    summary:
      "We took two singles from Sparkle's comeback EP and ran a focused audio clipping campaign across TikTok, Instagram Reels and YouTube Shorts.",
    views: 4_686_637,
    viewsLabel: "4.7M",
    cpmUsd: 0.21,
    spendUsd: 1_000,
    clips: 119,
    timeframe: "3 days",
    outcomes: [],
    highlight: "39,383 average views per clip",
    visual: { kind: "portrait", src: "/clients/sparkle.webp", avatar: "/clients/sparkle-avatar.webp", width: 356, height: 510 },
    publicApproved: true,
  },
  {
    // TODO: numbers, result line and OK to show from Andrea. Hidden until then.
    slug: "dardan",
    client: "Dardan",
    category: "Music, German rap",
    vertical: "music",
    summary: "Music clipping campaign for Erinnerung, the single and music video by German rapper Dardan.",
    views: 0,
    viewsLabel: "",
    outcomes: [],
    highlight: "",
    visual: { kind: "portrait", src: "/clients/dardan.webp", avatar: "/clients/dardan-avatar.webp", width: 640, height: 571 },
    publicApproved: false,
  },
];

export const publicCampaigns = campaigns.filter((c) => c.publicApproved);

export function getCampaign(slug: string) {
  return publicCampaigns.find((c) => c.slug === slug);
}

export const totalPublicViews = publicCampaigns.reduce((sum, c) => sum + c.views, 0);
