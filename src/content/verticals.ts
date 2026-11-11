import type { Campaign } from "./campaigns";

export type Vertical = {
  path: string;
  campaignVertical: Campaign["vertical"];
  title: string; // <title>
  description: string; // meta description, unique per page
  h1: string;
  intro: string;
  whatWeClip: string[];
  faqs: { q: string; a: string }[];
};

// TODO: align intros and FAQs with the current site copy once the repo is connected.
export const verticals: Vertical[] = [
  {
    path: "/combat-sports-clipping",
    campaignVertical: "combat-sports",
    title: "Combat Sports Clipping Agency for MMA and Boxing Promotions",
    description:
      "Clipping campaigns for MMA, boxing and kickboxing promotions. 20,000 clippers turn fight footage into short-form reach, priced per verified view.",
    h1: "Combat sports clipping",
    intro:
      "Fight nights produce more moments than any promotion can post. Our clippers cut knockouts, walkouts, weigh-ins and press conferences into short-form clips and post them across TikTok, Reels, Shorts and X, so the event keeps travelling long after the last bell.",
    whatWeClip: ["Knockouts and finishes", "Walkouts and weigh-ins", "Press conferences and face-offs", "Event build-up and aftercare"],
    faqs: [
      {
        q: "Can clips go out while broadcast rights are exclusive?",
        a: "Yes. Campaigns follow the footage and timing rules your broadcaster sets, including holding back finals or decisions for an exclusivity window.",
      },
      {
        q: "How do you price a fight night campaign?",
        a: "You fund a view pool and pay only for verified views. The minimum campaign is $3,000.",
      },
    ],
  },
  {
    path: "/music-clipping",
    campaignVertical: "music",
    title: "Music Clipping Agency for Artists and Labels",
    description:
      "Music clipping campaigns that turn short-form views into streams. Pay per verified view across TikTok, Reels, Shorts and X.",
    h1: "Music clipping",
    intro:
      "A song spreads when thousands of clips use it at once. Our clippers build formats around your track and post them across creator pages, so listeners hear it in many places at the same time.",
    whatWeClip: ["Song-driven formats and trends", "Artist moments and interviews", "Music video and live footage", "Release week pushes"],
    faqs: [
      {
        q: "Do views turn into streams?",
        a: "They can. In our Alex Schor campaign, Spotify monthly listeners grew from 170K to 650K alongside 189.9M views.",
      },
      {
        q: "What is the minimum budget?",
        a: "Campaigns start at $3,000 and you pay only for verified views.",
      },
    ],
  },
  {
    path: "/podcast-clipping",
    campaignVertical: "podcast",
    title: "Podcast Clipping Agency: Short-Form Distribution for Shows",
    description:
      "Podcast clipping campaigns that put your best moments on TikTok, Reels, Shorts and X through 20,000 clippers. Pay per verified view.",
    h1: "Podcast clipping",
    intro:
      "Every episode holds a few minutes worth millions of views. Our clippers find them, cut them for each platform and post them across creator pages to bring new listeners back to the full show.",
    whatWeClip: ["Hot takes and debates", "Guest stories", "Funny and surprising moments", "Episode trailers"],
    faqs: [
      {
        q: "Do you edit the clips or do the clippers?",
        a: "Clippers cut and post the clips. We set the brief, review quality and optimise the campaign every week.",
      },
    ],
  },
  {
    path: "/logo-clipping",
    campaignVertical: "brand",
    title: "Logo Clipping: Brand Placement Across Viral Short-Form Clips",
    description:
      "Logo clipping campaigns that place your brand on viral short-form clips across 20,000 creator pages. Pay per verified view.",
    h1: "Logo clipping",
    intro:
      "Logo clipping is for brands without original video content. Creators place your logo, promo code and website URL on existing high-performing short-form content, producing awareness and brand search lift at efficient CPMs.",
    whatWeClip: ["Logo overlays on trending formats", "Promo codes and URLs on screen", "Niche-matched creator pages"],
    faqs: [
      {
        q: "Do I need my own video content?",
        a: "No. Logo clipping runs on existing high-performing content, so you only provide your logo, promo code and URL.",
      },
    ],
  },
  {
    path: "/product-clipping",
    campaignVertical: "brand",
    title: "Product Clipping: Short-Form Product Distribution at Scale",
    description:
      "Product clipping campaigns that put your product in short-form clips across TikTok, Reels, Shorts and X. Pay per verified view.",
    h1: "Product clipping",
    intro:
      "People buy what they keep seeing. Clippers build short-form content around your product and post it across their pages, so the product shows up in feeds again and again.",
    whatWeClip: ["Product in use", "Unboxings and reactions", "Problem and solution formats"],
    faqs: [
      {
        q: "How is product clipping priced?",
        a: "Like every campaign: you fund a view pool and pay only for verified views, from $3,000.",
      },
    ],
  },
];

export function getVertical(path: string) {
  const v = verticals.find((x) => x.path === path);
  if (!v) throw new Error(`Unknown vertical ${path}`);
  return v;
}
