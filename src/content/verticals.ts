import type { Campaign } from "./campaigns";

// Vertical landing pages. Facts come from the live site and the campaign dashboards.
// Writing rules: plain words, the answer first, real numbers, no claims about competitors.

export type Vertical = {
  path: string;
  name: string; // short label for links
  campaignSlugs: Campaign["slug"][];
  title: string; // <title>, the template adds "| NovaEyes"
  description: string; // meta description, under ~160 characters
  h1: string;
  lead: string[]; // first paragraphs: what it is, the proof, who it's for
  sections: { heading: string; body: string[] }[];
  steps: string[]; // how a campaign runs
  sendUs: string[]; // what the client provides
  forWho: string[];
  faqs: { q: string; a: string }[];
};

export const verticals: Vertical[] = [
  {
    path: "/combat-sports-clipping",
    name: "Combat sports",
    campaignSlugs: ["brave-cf", "oktagon-mma"],
    title: "Combat Sports Clipping for MMA and Boxing",
    description:
      "We turn fight footage into thousands of short clips across TikTok, Reels, Shorts and X. BRAVE CF got 52.1M views at $0.21 CPM. You pay per verified view.",
    h1: "Combat sports clipping",
    lead: [
      "Combat sports clipping means turning your fight footage into short clips that thousands of creators post on their own pages. You pay only for the views that are verified.",
      "For BRAVE CF we did this with 5,247 clips. The campaign reached 52.1 million views in six weeks at $0.21 per thousand views.",
    ],
    sections: [
      {
        heading: "Why does fight footage work so well as short clips?",
        body: [
          "Knockouts, submissions and walkouts already last 15 to 60 seconds, so there is very little editing to do. The best moments are short by nature.",
          "Fans also go looking for highlights between events, so clips find an audience quickly. And every fight card has a build-up window, which means clips can push ticket and pay-per-view interest right when it matters.",
        ],
      },
      {
        heading: "Which platforms do the clips go out on?",
        body: [
          "TikTok, Instagram Reels, YouTube Shorts and X, all from the same footage. Fans tend to discover fighters on TikTok, follow them on Instagram and watch full breakdowns on YouTube, so one campaign reaches all of it at once.",
        ],
      },
    ],
    steps: [
      "We go through your footage and pick the moments with the strongest hooks: finishes, trash talk, walkouts and crowd reactions.",
      "We brief our clippers. They cut each moment for every platform and post it on their own pages.",
      "Every week we check what is working and move the budget toward the clips and formats that perform.",
    ],
    sendUs: [
      "Full fights from events you own",
      "Highlights and recap videos",
      "Press conferences, face-offs and interviews",
      "Walkouts, training and behind-the-scenes footage",
    ],
    forWho: [
      "MMA promotions, from regional to international",
      "Boxing, kickboxing and Muay Thai events",
      "Grappling and BJJ organizations",
      "Combat sports media channels",
      "Fighters building their own brand",
    ],
    faqs: [
      {
        q: "Do you only work with big promotions?",
        a: "No. What matters is how much strong footage you have, not how big your promotion is. Regional events with good footage they own do well.",
      },
      {
        q: "Can you clip moments our broadcaster has rights to?",
        a: "We only use footage you own, and we follow the timing rules your broadcaster sets, such as holding back finishes for a set number of days after the event.",
      },
      {
        q: "How much does a combat sports campaign cost?",
        a: "Campaigns start at $3,000 and you pay per verified view. At the $0.21 CPM from the BRAVE CF campaign, $3,000 would buy about 14 million views, but your CPM depends on your footage and your goals.",
      },
      {
        q: "How was the $700,000 revenue figure for BRAVE CF worked out?",
        a: "It is an estimate based on revenue across tracked channels during the campaign period. It is not a directly tracked conversion number.",
      },
    ],
  },
  {
    path: "/music-clipping",
    name: "Music",
    campaignSlugs: ["alex-schor", "sparkle"],
    title: "Music Clipping for Artists and Labels",
    description:
      "Music clipping puts your song in thousands of short clips across TikTok, Reels, Shorts and X. Alex Schor grew from 170K to 650K monthly Spotify listeners.",
    h1: "Music clipping",
    lead: [
      "Music clipping means getting your song into thousands of short clips that creators post on their own pages, so people keep hearing it in their feed. You pay only for the views that are verified.",
      "For Alex Schor that meant 2,444 clips and 189.9 million views at $0.13 per thousand views. His monthly Spotify listeners went from 170,000 to 650,000.",
    ],
    sections: [
      {
        heading: "How do short clips turn into streams?",
        body: [
          "Someone hears a hook in a clip, looks the song up and streams it. When the same song shows up on hundreds of pages in the same week, that happens a lot.",
          "During the Alex Schor campaign, 480,000 new monthly listeners came in on Spotify.",
        ],
      },
      {
        heading: "Can a small budget still work?",
        body: [
          "Yes. Sparkle ran two singles from a comeback EP through a focused campaign. $1,000 bought 4.7 million views in three days, at $0.21 per thousand views.",
        ],
      },
    ],
    steps: [
      "We pick the moments most likely to send people to your song: hooks, punchlines, freestyles and reactions.",
      "Clippers cut those moments for each platform and post them across TikTok, Reels, Shorts and X.",
      "Every week we put more budget behind the clips that are working.",
    ],
    sendUs: [
      "Music videos and visualizers",
      "Studio sessions and freestyles",
      "Behind-the-scenes and tour footage",
      "Interviews, podcast appearances and live performances",
    ],
    forWho: [
      "Independent artists with a library of content",
      "Artists with a single, EP or album coming out",
      "Labels running campaigns for several artists",
      "Personality-driven artists with freestyles, studio footage and reactions",
    ],
    faqs: [
      {
        q: "Can you guarantee more streams?",
        a: "No. Results depend on the song, the content and how the platforms behave that week. The Alex Schor numbers are a real result, not a promise.",
      },
      {
        q: "Do you work with independent artists?",
        a: "Yes. What matters is the content and whether it fits an audience, not whether you have a label.",
      },
      {
        q: "How much does a music campaign cost?",
        a: "Campaigns start at $3,000 and you pay per verified view. Our past music campaigns ran at $0.13 and $0.21 per thousand views.",
      },
      {
        q: "Do I need a music video?",
        a: "No. Studio clips, freestyles, interviews or live footage all work, as long as you own the content or have the rights to it.",
      },
    ],
  },
  {
    path: "/podcast-clipping",
    name: "Podcasts",
    campaignSlugs: ["family-ties"],
    title: "Podcast Clipping: Turn Episodes Into Reach",
    description:
      "We turn podcast episodes into hundreds of clips across TikTok, Reels, Shorts and X. 5 Family Ties episodes became 843 clips and 7.2M views for $3,000.",
    h1: "Podcast clipping",
    lead: [
      "Podcast clipping means turning your episodes into short clips that thousands of creators post on their own pages, so new people find your show. You pay only for the views that are verified.",
      "We did this for the Family Ties podcast with Tobi Brown. Five episodes became 843 clips and 7.2 million views on a $3,000 budget, and the show's YouTube channel picked up 2 million extra views.",
    ],
    sections: [
      {
        heading: "How many clips can one episode make?",
        body: [
          "A one-hour episode usually has 20 to 40 moments that work on their own. Different clippers cut the same moment in different ways, which is how five Family Ties episodes turned into 843 clips.",
          "You don't need to record anything new. The debates, stories and reactions your show already has are the clips.",
        ],
      },
      {
        heading: "How do clips grow the main show?",
        body: [
          "Clips are how people discover you. Someone sees a moment, wants the full conversation and goes to your channel. During the campaign, the Family Ties YouTube channel got 2 million extra views.",
        ],
      },
    ],
    steps: [
      "We go through your episodes and pick the debates, stories and reactions most likely to stop someone scrolling.",
      "Clippers cut those moments for TikTok, Reels, Shorts and X and post them on their own pages.",
      "Every week we look at what is working and push more budget behind it.",
    ],
    sendUs: ["Video episodes, edited or raw", "Your channel links, so clips can point back to the show", "Any topics or guests to keep out"],
    forWho: [
      "Shows with a library of video episodes",
      "Weekly shows with regular guests",
      "Personality-driven podcasts with loyal fans",
      "YouTube shows that want short-form reach",
      "Podcast networks with several shows",
    ],
    faqs: [
      {
        q: "How many episodes do I need to start?",
        a: "There is no fixed minimum. Family Ties started with five. More episodes give clippers more angles to work with.",
      },
      {
        q: "Does this work for audio-only podcasts?",
        a: "Clipping needs video. If your show is audio only, you would need to start recording video first, and we can suggest simple, low-cost setups.",
      },
      {
        q: "Can you guarantee more subscribers?",
        a: "No. Results depend on the show, the clips and the platforms during the campaign. The Family Ties numbers are a real result, not a promise.",
      },
      {
        q: "How much does a podcast campaign cost?",
        a: "Campaigns start at $3,000 and you pay per verified view. Family Ties ran at $0.41 per thousand views.",
      },
    ],
  },
  {
    path: "/logo-clipping",
    name: "Logo clipping",
    campaignSlugs: [],
    title: "Logo Clipping: Your Brand on Clips That Perform",
    description:
      "No video of your own? Logo clipping puts your logo, promo code and link on short clips that already perform, posted by creators. Pay per verified view.",
    h1: "Logo clipping",
    lead: [
      "Logo clipping puts your logo, promo code and website on short clips that already get attention, posted by thousands of creators on their own pages. You pay only for the views that are verified.",
      "It is made for brands that don't have their own video to clip. You send a logo and a link, and the clippers do the rest.",
    ],
    sections: [
      {
        heading: "How is logo clipping different from content clipping?",
        body: [
          "Content clipping cuts clips from your own videos and grows your own channels. Logo clipping puts your brand on other content that already holds attention, so the goal is awareness, brand searches and promo code use.",
        ],
      },
      {
        heading: "Why does logo clipping work?",
        body: [
          "You skip production entirely. Your brand rides on clips that are already proven to perform, instead of betting on new creative. And a promo code with a link gives viewers something to do, which you can track.",
        ],
      },
    ],
    steps: [
      "You send your logo, promo code, link and placement rules.",
      "Clippers add your brand to clips that already perform in your audience's niche and post them on their own pages.",
      "Every week we check which pages and formats bring the most views and code use, and shift budget there.",
    ],
    sendUs: [
      "Your logo in high resolution, ideally with a transparent background",
      "A promo code, if you have one",
      "The website or landing page to send people to",
      "Brand guidelines for how and where the logo can appear",
    ],
    forWho: [
      "Supplement and wellness brands without video production",
      "Apps and software products",
      "VPNs and consumer software",
      "Any brand that wants awareness and promo code use without making video",
    ],
    faqs: [
      {
        q: "Do I need my own video content?",
        a: "No. Logo clipping is made for brands without a content library. Your logo, code and link go on clips that already perform.",
      },
      {
        q: "How much does logo clipping cost?",
        a: "Campaigns start at $3,000 and you pay per verified view. Across our past campaigns, CPMs ranged from $0.13 to $0.41 per thousand views.",
      },
      {
        q: "How do I measure results?",
        a: "Views are tracked per clip in your campaign dashboard. Promo code use and visits from your link show you what those views turned into.",
      },
    ],
  },
  {
    path: "/product-clipping",
    name: "Product clipping",
    campaignSlugs: [],
    title: "Product Clipping: Creator Demos and Unboxings",
    description:
      "Product clipping gets creators to show your product in new short clips: demos, unboxings and reactions, posted across thousands of pages. Pay per verified view.",
    h1: "Product clipping",
    lead: [
      "Product clipping means creators make new short clips with your product in them: using it, unboxing it or reacting to it. Those clips go out across TikTok, Reels, Shorts and X on thousands of pages, and you pay only for the views that are verified.",
      "It is for brands that have a product but no video library to clip from.",
    ],
    sections: [
      {
        heading: "How is product clipping different from logo clipping?",
        body: [
          "Logo clipping puts your logo on content that already exists. Product clipping puts the product itself in the clip, so people see it being used.",
        ],
      },
      {
        heading: "Why show the product instead of a logo?",
        body: [
          "Seeing a product in use answers questions a logo can't. Unboxings, demos and reactions are also formats that already do well on short-form platforms, so the clips fit right into the feed.",
        ],
      },
      {
        heading: "How do creators get the product?",
        body: [
          "We coordinate sending samples to the creators in the campaign. For apps and other digital products, we give them access instead.",
        ],
      },
    ],
    steps: [
      "We agree on the angles and the key points every clip should show.",
      "Creators make clips with your product and post them on their own pages.",
      "Every week we see which formats and pages perform and put more budget behind them.",
    ],
    sendUs: [
      "Product samples, or access to your digital product",
      "Brand guidelines and the key points to get across",
      "A promo code and link, if you have them",
      "Any disclosures your product category requires",
    ],
    forWho: [
      "Supplement and wellness brands",
      "Gaming peripherals and tech accessories",
      "Apps with an interface worth showing",
      "Consumer electronics and gadgets",
      "Any product that is easier to show than to describe",
    ],
    faqs: [
      {
        q: "Do I need existing video content?",
        a: "No. Creators make new clips around your product, so you don't need a video library.",
      },
      {
        q: "Are the clips marked as sponsored?",
        a: "Yes. Clips carry the disclosures the platforms and your product category require.",
      },
      {
        q: "How much does product clipping cost?",
        a: "Campaigns start at $3,000 and you pay per verified view. Across our past campaigns, CPMs ranged from $0.13 to $0.41 per thousand views.",
      },
    ],
  },
];

export function getVertical(path: string) {
  const v = verticals.find((x) => x.path === path);
  if (!v) throw new Error(`Unknown vertical ${path}`);
  return v;
}
