// Campaign results, aligned with the live case study pages.
// Numbers come from NovaEyes campaign dashboards. Never add a number here
// that isn't in a dashboard.

// A case study section: a question as the heading, then plain paragraphs and/or short points.
export type StorySection = { heading: string; body?: string[]; points?: string[] };

export type Campaign = {
  slug: string;
  client: string;
  category: string;
  vertical: "combat-sports" | "music" | "podcast" | "business" | "brand";
  summary: string;
  views: number;
  viewsLabel: string;
  cpmUsd?: number;
  // For campaigns billed in another currency, the cost per 1,000 views as shown (e.g. €0.36).
  cpmLabel?: string;
  spendUsd?: number;
  clips?: number;
  timeframe?: string;
  outcomes: string[];
  // One short result line, shown with the blue dot on the homepage.
  highlight: string;
  // Long-form case study, rendered on /case-studies/[slug].
  story?: StorySection[];
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
    // Source: Oktagon 94 campaign report (Oct 19, 2026), same numbers as the dashboard.
    // Never publish the budget or how it splits; the CPM below is on what went to creators.
    slug: "oktagon-mma",
    client: "Oktagon MMA",
    category: "Sports, combat sports",
    vertical: "combat-sports",
    summary:
      "We ran short-form distribution for Oktagon 94, the MMA stadium show at Deutsche Bank Park in Frankfurt. 5,297 clips across YouTube Shorts, TikTok and Instagram Reels brought in 20.8 million views in 19 days.",
    views: 20_833_959,
    viewsLabel: "20.8M",
    cpmLabel: "€0.36",
    clips: 5_297,
    timeframe: "19 days",
    outcomes: ["20.8M views, inside the 15M to 25M we projected before launch", "One YouTube Short reached 5,788,676 views on its own"],
    highlight: "Inside the 15M to 25M views we projected before launch",
    story: [
      {
        heading: "What did Oktagon want?",
        body: [
          "Oktagon 94 was a stadium show in Frankfurt and the biggest night on their calendar. The goal was reach, not ticket sales. They wanted the event to feel like a moment people talked about, with the Oktagon name in front of as many people as possible before and after fight night.",
        ],
      },
      {
        heading: "How did the campaign run?",
        body: [
          "Clippers started two days before fight night and kept going for sixteen days after it. They cut fights, walkouts and the biggest moments into short clips for YouTube Shorts, TikTok and Instagram Reels, with Oktagon tagged in every caption and named in the text hook.",
          "The broadcaster kept the biggest fight footage to itself for the first seven days, so those moments could only go out from day 7. Every clip was reviewed before it could earn, and clippers were only paid on approved clips.",
        ],
      },
      {
        heading: "What were the results?",
        points: [
          "20,833,959 views across 5,297 clips",
          "€0.36 per 1,000 views",
          "454,813 likes, comments and shares",
          "Inside the 15M to 25M views we projected before launch, with more clips than projected",
          "Buying the same views as ads, at a typical €10 to €30 per 1,000, would have cost 21 to 63 times more",
        ],
      },
      {
        heading: "Where did the views come from?",
        body: [
          "YouTube Shorts brought 14.88 million views, 71% of the total. TikTok brought 5.27 million and had the best engagement at 4.3%, about twice the campaign average. Instagram Reels brought 0.68 million. On average a Short got ten times the views of a Reel.",
        ],
      },
      {
        heading: "What happened on day 7?",
        body: [
          "October 3 was the first day the fight footage was free to use. Clips posted that day brought in 6.49 million views, and 5.79 million of them came from a single YouTube Short. From day 7 on, the campaign added 10.94 million views in six days, more than half of the total.",
        ],
      },
      {
        heading: "Is it normal that a few clips get most of the views?",
        body: [
          "Yes. The top 100 clips made up 77% of all views. Most clips stay small and a few take off, and nobody can tell in advance which ones will. That is why a campaign posts a lot.",
          "It also shows how paying per approved clip works out. Most of the payouts went to 258 approved clips. The other 5,039 clips were never paid and still brought in 6.92 million views.",
        ],
      },
      {
        heading: "What would we do differently?",
        points: [
          "Start five to seven days before the event, not two. The first two days brought 2% of the views.",
          "Brief clippers on the day 7 footage before the event, so it goes out the moment the window ends.",
          "Put fewer clips on Instagram and more on Shorts and TikTok.",
          "Keep a budget running between events, so clippers stay on the campaign instead of moving on.",
        ],
      },
    ],
    visual: { kind: "logo", src: "/clients/oktagon-logo.png", avatar: "/clients/oktagon-avatar.webp", width: 600, height: 600 },
    // Andrea confirmed Patrick's OK on Nov 12, 2026.
    publicApproved: true,
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

// Cost per 1,000 views as displayed: dollars by default, or the campaign's own label.
export function cpmText(c: Campaign) {
  if (c.cpmUsd !== undefined) return `$${c.cpmUsd.toFixed(2)}`;
  return c.cpmLabel;
}
