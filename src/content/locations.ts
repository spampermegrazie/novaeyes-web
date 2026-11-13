// Location pages: /clipping-agency/[slug]. One entry per market, each with its own market data,
// ad disclosure rules and questions, so no two pages are the same page with a new country name.
//
// Rules for this file (same as the rest of the site):
// - Market numbers come from DataReportal's Digital 2026 country reports (published November
//   2025, data for late 2025). They are ad reach figures from each platform's own ad tools.
// - Disclosure rules are summaries with a link to the source. Not legal advice.
// - Languages: our campaigns have run in English and German so far. Pages never claim Italian,
//   Spanish, French or Dutch campaigns we have not run.
// - Only real, approved case studies. When a market has none yet, the page says so.

export type Location = {
  slug: string;
  name: string; // Germany
  inName: string; // in Germany / in the United States
  region: "North America" | "Europe" | "Middle East" | "Oceania";
  title: string; // <= 60 characters with the brand suffix added by the layout template
  description: string; // ~150 characters
  lead: string[];
  languages: string;
  timeZone: string;
  stats: {
    tiktok: string; // TikTok ad reach, adults 18+
    youtube: string;
    instagram: string;
    social: string; // social media user identities
    sourceUrl: string;
  };
  market: { heading: string; body: string[] };
  rules: { heading: string; body: string[]; sourceLabel: string; sourceUrl: string };
  proofSlugs: string[];
  proofNote?: string;
  faqs: { q: string; a: string }[];
  nearby: string[];
};

const DR = (slug: string) => `https://datareportal.com/reports/digital-2026-${slug}`;

export const locations: Location[] = [
  {
    slug: "united-states",
    name: "United States",
    inName: "in the United States",
    region: "North America",
    title: "Clipping Agency in the United States",
    description:
      "NovaEyes runs clipping campaigns for the US: thousands of clips on TikTok, Reels, Shorts and X, paid only for verified views from US viewers. From $3,000.",
    lead: [
      "NovaEyes is a clipping agency for brands, artists, creators and events that want reach in the United States. Our network of 20,000 clippers turns your long videos into short clips and posts them on TikTok, Instagram Reels, YouTube Shorts and X, and you pay only for verified views from viewers in the US.",
      "The US is the biggest short-form market in the world, and the most expensive one to buy ads in. Clipping gets you the same feeds without buying ad slots: real pages posting your clips, paid per verified view.",
    ],
    languages: "English",
    timeZone: "Eastern to Pacific time (UTC-5 to UTC-8)",
    stats: { tiktok: "153 million", youtube: "254 million", instagram: "182 million", social: "254 million", sourceUrl: DR("united-states-of-america") },
    market: {
      heading: "What does short-form reach look like in the United States?",
      body: [
        "TikTok had 153 million users aged 18 and over in the US in late 2025, and YouTube reached 254 million people, according to DataReportal. That is the largest English-speaking audience for short clips anywhere.",
        "Because the audience is so big, US campaigns work best with a clear target: a state or two, an age group, a niche. You choose it, and only views from that audience count.",
      ],
    },
    rules: {
      heading: "Do paid clips need an ad label in the United States?",
      body: [
        "Yes. Under the FTC's Endorsement Guides, anyone paid to post about a brand has to disclose it clearly, with a label like #ad, Sponsored or Advertisement, or the platform's paid partnership tool. The disclosure has to be easy to notice, not hidden in a pile of hashtags.",
      ],
      sourceLabel: "FTC, Disclosures 101 for Social Media Influencers",
      sourceUrl: "https://ftc.gov/system/files/documents/plain-language/1001a-influencer-guide-508_1.pdf",
    },
    proofSlugs: ["alex-schor", "brave-cf"],
    proofNote: "Two of our biggest campaigns. Every case study is counted on the platforms themselves.",
    faqs: [
      {
        q: "Can I target one US state or city?",
        a: "You choose the audience: a country, and inside it the age groups and genders you want. For narrower targeting, like a state, tell us on the call and we check what the platform data supports for your campaign.",
      },
      {
        q: "How much does a US clipping campaign cost?",
        a: "Campaigns start at $3,000 and you pay per 1,000 verified views. Past campaigns ran $0.13 to $0.41 per 1,000 views. US audiences usually cost more per view than global ones, and the exact CPM depends on your content and target.",
      },
      {
        q: "Do your clippers label paid clips for the FTC?",
        a: "The FTC expects paid posts to be disclosed clearly. The labeling rules for your target market go into the brief, and clips that break the brief are not approved and not paid.",
      },
    ],
    nearby: ["canada", "united-kingdom", "australia"],
  },
  {
    slug: "united-kingdom",
    name: "United Kingdom",
    inName: "in the UK",
    region: "Europe",
    title: "Clipping Agency in the UK",
    description:
      "NovaEyes runs clipping campaigns for the UK: short clips on TikTok, Reels, Shorts and X, paid only for verified views from UK viewers. From $3,000.",
    lead: [
      "NovaEyes is a clipping agency for brands, artists, podcasts and events that want reach in the UK. Our network of 20,000 clippers cuts your long videos into short clips and posts them on TikTok, Instagram Reels, YouTube Shorts and X, and you pay only for verified views from viewers in the UK.",
      "UK audiences live on podcasts, football, music and creator culture. For the Family Ties podcast, with Tobi Brown of the Sidemen, clips brought 7.2 million views and more than 2 million extra YouTube views.",
    ],
    languages: "English",
    timeZone: "UK time (GMT, UTC+0, BST in summer)",
    stats: { tiktok: "26.8 million", youtube: "55.5 million", instagram: "35.5 million", social: "55.5 million", sourceUrl: DR("united-kingdom") },
    market: {
      heading: "What does short-form reach look like in the UK?",
      body: [
        "TikTok had 26.8 million users aged 18 and over in the UK in late 2025, about 48% of all adults, and YouTube reached 55.5 million people, according to DataReportal.",
        "The UK is one of the most creator-driven markets in Europe. Podcasts, YouTube groups, football and grime and rap scenes all have big clip audiences, which makes it a strong market for content clipping.",
      ],
    },
    rules: {
      heading: "Do paid clips need an ad label in the UK?",
      body: [
        "Yes. The ASA, CAP and the CMA expect paid posts to be obviously identifiable as ads, with a clear label such as #ad placed up front, not buried at the end of a caption.",
      ],
      sourceLabel: "ASA, Influencers' guide to making clear that ads are ads",
      sourceUrl: "https://www.asa.org.uk/resource/influencers-guide.html",
    },
    proofSlugs: ["family-ties"],
    faqs: [
      {
        q: "Have you run campaigns for UK creators?",
        a: "Yes. The Family Ties podcast, with Tobi Brown of the Sidemen, reached 7.2 million views at $0.41 per 1,000 views from 843 clips, and picked up more than 2 million extra YouTube views.",
      },
      {
        q: "Can I only pay for views from the UK?",
        a: "Yes. You set the UK as the target, plus the age groups and genders you want, and only views from that audience count. Clips that miss it are not paid, even if they go viral.",
      },
      {
        q: "How do UK ad rules affect clips?",
        a: "Paid clips must be clearly labeled as ads, usually with #ad at the start. The labeling rules go into the brief, and clips that break it are not approved and not paid.",
      },
    ],
    nearby: ["united-states", "netherlands", "germany"],
  },
  {
    slug: "germany",
    name: "Germany",
    inName: "in Germany",
    region: "Europe",
    title: "Clipping Agency in Germany",
    description:
      "NovaEyes runs clipping campaigns in Germany, in German or English: short clips on TikTok, Reels, Shorts and X, paid only for verified views from German viewers.",
    lead: [
      "NovaEyes is a clipping agency for brands, artists, sports and events that want reach in Germany. Our network of 20,000 clippers cuts your long videos into short clips and posts them on TikTok, Instagram Reels, YouTube Shorts and X, in German or English, and you pay only for verified views from viewers in Germany.",
      "We have run campaigns across the DACH region in German and English, including Oktagon MMA, which reached 20.8 million views in 19 days around its Frankfurt event.",
    ],
    languages: "German and English",
    timeZone: "Central European Time (CET, UTC+1)",
    stats: { tiktok: "23.7 million", youtube: "64.7 million", instagram: "31.3 million", social: "64.7 million", sourceUrl: DR("germany") },
    market: {
      heading: "What does short-form reach look like in Germany?",
      body: [
        "TikTok had 23.7 million users aged 18 and over in Germany in late 2025, and YouTube reached 64.7 million people, according to DataReportal. It is the biggest short-form audience in the EU.",
        "German audiences respond best to clips in German, with German captions and hooks. We run campaigns in German across Germany, Austria and Switzerland, and in English when your audience is international.",
      ],
    },
    rules: {
      heading: "Do paid clips need an ad label in Germany?",
      body: [
        "Yes, and Germany is strict. Under the UWG and the Medienstaatsvertrag, paid posts must be clearly marked as advertising. The safe labels are Werbung or Anzeige. The media authorities say labels like #ad or #sponsored may not be enough, and fines can reach 500,000 euros.",
      ],
      sourceLabel: "Die Medienanstalten, Leitfaden Werbekennzeichnung bei Social Media",
      sourceUrl: "https://www.ma-hsh.de/files/infothek/publikationen/Leitfaden_Medienanstalten_Werbekennzeichnung_Social_Media.pdf",
    },
    proofSlugs: ["oktagon-mma"],
    faqs: [
      {
        q: "Can clips be in German?",
        a: "Yes. We run German-language campaigns across Germany, Austria and Switzerland: German hooks, German captions, posted by clippers whose audiences are German-speaking.",
      },
      {
        q: "Have you run campaigns in Germany?",
        a: "Yes. Oktagon MMA reached 20.8 million views in 19 days around its Frankfurt event, from 5,297 clips. We also run German-language campaigns for brands in the DACH region.",
      },
      {
        q: "How do German ad rules affect clips?",
        a: "Paid clips must be clearly marked as advertising, ideally with Werbung or Anzeige. The labeling rules go into the brief, and clips that break it are not approved and not paid.",
      },
    ],
    nearby: ["austria", "switzerland", "netherlands"],
  },
  {
    slug: "austria",
    name: "Austria",
    inName: "in Austria",
    region: "Europe",
    title: "Clipping Agency in Austria",
    description:
      "NovaEyes runs clipping campaigns in Austria, in German: short clips on TikTok, Reels, Shorts and X, paid only for verified views from Austrian viewers.",
    lead: [
      "NovaEyes is a clipping agency for brands, artists and events that want reach in Austria. Our network of 20,000 clippers cuts your long videos into short German-language clips and posts them on TikTok, Instagram Reels, YouTube Shorts and X, and you pay only for verified views from viewers in Austria.",
      "We run German-language campaigns across the DACH region, so an Austrian campaign can stay local or reach into Germany and Switzerland too.",
    ],
    languages: "German and English",
    timeZone: "Central European Time (CET, UTC+1)",
    stats: { tiktok: "2.49 million", youtube: "6.98 million", instagram: "3.35 million", social: "6.98 million", sourceUrl: DR("austria") },
    market: {
      heading: "What does short-form reach look like in Austria?",
      body: [
        "TikTok had 2.49 million users aged 18 and over in Austria in late 2025, about a third of all adults, and YouTube reached 6.98 million people, according to DataReportal.",
        "Austria is a small market where a focused campaign goes a long way. Many campaigns target Austria first, then open up to the rest of the German-speaking audience in Germany and Switzerland.",
      ],
    },
    rules: {
      heading: "Do paid clips need an ad label in Austria?",
      body: [
        "Yes. Section 26 of the Austrian Media Act requires paid content to be labeled with Anzeige, entgeltliche Einschaltung or Werbung, and the Austrian UWG bans hidden advertising. Fines under the Media Act can reach 20,000 euros.",
      ],
      sourceLabel: "Blck Alpaca, Labeling ads on social media in DACH",
      sourceUrl: "https://blckalpaca.at/en/knowledge-base/social-media/social-media-content-creation-formats/labeling-ads-social-media-dach",
    },
    proofSlugs: ["oktagon-mma"],
    proofNote: "Our German-language results so far come from the wider DACH region.",
    faqs: [
      {
        q: "Can I target only Austria?",
        a: "Yes. You set Austria as the target, plus the age groups and genders you want, and only views from that audience count. You can also add Germany and Switzerland to reach the whole German-speaking market.",
      },
      {
        q: "Are the clips in German?",
        a: "They can be. We run German-language campaigns across Austria, Germany and Switzerland, and English campaigns when your audience is international.",
      },
      {
        q: "How do Austrian ad rules affect clips?",
        a: "Paid clips must carry a label such as Werbung or Anzeige. The labeling rules go into the brief, and clips that break it are not approved and not paid.",
      },
    ],
    nearby: ["germany", "switzerland", "italy"],
  },
  {
    slug: "switzerland",
    name: "Switzerland",
    inName: "in Switzerland",
    region: "Europe",
    title: "Clipping Agency in Switzerland",
    description:
      "NovaEyes runs clipping campaigns in Switzerland, in German or English: short clips on TikTok, Reels, Shorts and X, paid only for verified views from Swiss viewers.",
    lead: [
      "NovaEyes is a clipping agency for brands, artists and events that want reach in Switzerland. Our network of 20,000 clippers cuts your long videos into short clips and posts them on TikTok, Instagram Reels, YouTube Shorts and X, in German or English, and you pay only for verified views from viewers in Switzerland.",
      "Switzerland is a high-income market with a small audience, which makes paying per verified view, instead of per post, especially worth it.",
    ],
    languages: "German and English",
    timeZone: "Central European Time (CET, UTC+1)",
    stats: { tiktok: "2.46 million", youtube: "7.27 million", instagram: "3.80 million", social: "7.27 million", sourceUrl: DR("switzerland") },
    market: {
      heading: "What does short-form reach look like in Switzerland?",
      body: [
        "TikTok had 2.46 million users aged 18 and over in Switzerland in late 2025, about a third of all adults, and YouTube reached 7.27 million people, according to DataReportal.",
        "Switzerland has four national languages. We run campaigns in German and English, which covers the German-speaking majority and international audiences. For French- or Italian-speaking regions, we plan the approach with you on the call.",
      ],
    },
    rules: {
      heading: "Do paid clips need an ad label in Switzerland?",
      body: [
        "Switzerland has no influencer-specific law, but the Unfair Competition Act (UWG) requires advertising to be recognizable as advertising, and the Swiss Fairness Commission handles complaints about hidden ads. Labeling paid clips clearly is the safe standard.",
      ],
      sourceLabel: "Blck Alpaca, Labeling ads on social media in DACH",
      sourceUrl: "https://blckalpaca.at/en/knowledge-base/social-media/social-media-content-creation-formats/labeling-ads-social-media-dach",
    },
    proofSlugs: ["oktagon-mma"],
    proofNote: "Our German-language results so far come from the wider DACH region.",
    faqs: [
      {
        q: "Can I target only Switzerland?",
        a: "Yes. You set Switzerland as the target, plus the age groups and genders you want, and only views from that audience count. Clips that miss it are not paid, even if they go viral.",
      },
      {
        q: "Which languages do you run in Switzerland?",
        a: "German and English. For French- or Italian-speaking audiences we plan the approach with you on the call, since our campaigns so far have run in English and German.",
      },
      {
        q: "Is clipping worth it in a small market?",
        a: "Small markets are where paying per verified view matters most. You only pay for views from Swiss viewers in your target audience, so the budget does not leak into countries you do not sell in.",
      },
    ],
    nearby: ["germany", "austria", "italy"],
  },
  {
    slug: "italy",
    name: "Italy",
    inName: "in Italy",
    region: "Europe",
    title: "Clipping Agency in Italy",
    description:
      "NovaEyes, based in Italy, runs clipping campaigns for Italian audiences: short clips on TikTok, Reels, Shorts and X, paid only for verified views from Italy.",
    lead: [
      "NovaEyes is a clipping agency based in Ferrara, Italy, for brands, artists, sports and events that want reach in Italy. Our network of 20,000 clippers cuts your long videos into short clips and posts them on TikTok, Instagram Reels, YouTube Shorts and X, and you pay only for verified views from viewers in Italy.",
      "Italy is one of Europe's biggest short-form markets, and one of the most Instagram-heavy. A clipping campaign puts your content on hundreds of pages at once instead of one account.",
    ],
    languages: "English today. Italian-language campaigns planned with you on the call",
    timeZone: "Central European Time (CET, UTC+1)",
    stats: { tiktok: "22.0 million", youtube: "41.2 million", instagram: "29.9 million", social: "41.2 million", sourceUrl: DR("italy") },
    market: {
      heading: "What does short-form reach look like in Italy?",
      body: [
        "TikTok had 22.0 million users aged 18 and over in Italy in late 2025, Instagram reached 29.9 million people and YouTube 41.2 million, according to DataReportal.",
        "Football, music, food and creator culture drive Italian feeds. Our campaigns so far have run in English and German. If you want Italian-language clips, we plan that with you on the call.",
      ],
    },
    rules: {
      heading: "Do paid clips need an ad label in Italy?",
      body: [
        "Yes. In July 2025 AGCOM approved guidelines and a code of conduct for relevant influencers, those with 500,000 followers or one million average monthly views on a platform. Everyone else still has to make advertising clearly recognizable, and the code points to the IAP Digital Chart for how to label it.",
      ],
      sourceLabel: "Teleborsa, Influencer: Agcom approva Linee guida e Codice di Condotta",
      sourceUrl: "https://www.teleborsa.it/DettaglioNews/17_2025-07-25_TLB/Influencer-Agcom-approva-Linee-guida-e-Codice-di-Condotta.html",
    },
    proofSlugs: ["alex-schor", "brave-cf"],
    proofNote: "We have not published an Italian case study yet. These are two of our biggest campaigns.",
    faqs: [
      {
        q: "Is NovaEyes an Italian company?",
        a: "NovaEyes was founded in 2025 by Andrea Corindo and is based in Ferrara, Italy. We run campaigns for clients worldwide, in English and German.",
      },
      {
        q: "Can the clips be in Italian?",
        a: "Our campaigns so far have run in English and German. If your audience needs Italian-language clips, we plan that with you on the call before anything starts.",
      },
      {
        q: "How do Italian ad rules affect clips?",
        a: "Paid clips must be clearly recognizable as advertising, and the biggest creators fall under AGCOM's code of conduct. The labeling rules go into the brief, and clips that break it are not approved and not paid.",
      },
    ],
    nearby: ["spain", "france", "switzerland"],
  },
  {
    slug: "spain",
    name: "Spain",
    inName: "in Spain",
    region: "Europe",
    title: "Clipping Agency in Spain",
    description:
      "NovaEyes runs clipping campaigns for Spanish audiences: short clips on TikTok, Reels, Shorts and X, paid only for verified views from viewers in Spain.",
    lead: [
      "NovaEyes is a clipping agency for brands, artists, sports and events that want reach in Spain. Our network of 20,000 clippers cuts your long videos into short clips and posts them on TikTok, Instagram Reels, YouTube Shorts and X, and you pay only for verified views from viewers in Spain.",
      "Spain has one of the highest TikTok adoption rates in Western Europe: more than half of all adults use it.",
    ],
    languages: "English today. Spanish-language campaigns planned with you on the call",
    timeZone: "Central European Time (CET, UTC+1)",
    stats: { tiktok: "20.9 million", youtube: "39.0 million", instagram: "26.4 million", social: "39.0 million", sourceUrl: DR("spain") },
    market: {
      heading: "What does short-form reach look like in Spain?",
      body: [
        "TikTok had 20.9 million users aged 18 and over in Spain in late 2025, 52% of all adults, and YouTube reached 39.0 million people, according to DataReportal.",
        "Football, music and creator content dominate Spanish feeds. Our campaigns so far have run in English and German. If you want Spanish-language clips, we plan that with you on the call.",
      ],
    },
    rules: {
      heading: "Do paid clips need an ad label in Spain?",
      body: [
        "Yes. Spain's audiovisual law requires commercial content to be clearly identified, and Royal Decree 444/2024 adds extra duties for the biggest creators: those earning 300,000 euros a year from content, with one million followers on one platform or two million in total, who publish at least 24 videos a year.",
      ],
      sourceLabel: "Letslaw, New influencer regulation in Spain",
      sourceUrl: "https://letslaw.es/en/nueva-normativa-influencers/",
    },
    proofSlugs: ["alex-schor", "brave-cf"],
    proofNote: "We have not published a Spanish case study yet. These are two of our biggest campaigns.",
    faqs: [
      {
        q: "Can I target only viewers in Spain?",
        a: "Yes. You set Spain as the target, plus the age groups and genders you want, and only views from that audience count. Clips that miss it are not paid, even if they go viral.",
      },
      {
        q: "Can the clips be in Spanish?",
        a: "Our campaigns so far have run in English and German. If your audience needs Spanish-language clips, we plan that with you on the call before anything starts.",
      },
      {
        q: "How do Spanish ad rules affect clips?",
        a: "Paid clips must be clearly identified as advertising. The labeling rules go into the brief, and clips that break it are not approved and not paid.",
      },
    ],
    nearby: ["italy", "france", "united-kingdom"],
  },
  {
    slug: "france",
    name: "France",
    inName: "in France",
    region: "Europe",
    title: "Clipping Agency in France",
    description:
      "NovaEyes runs clipping campaigns for French audiences: short clips on TikTok, Reels, Shorts and X, paid only for verified views from viewers in France.",
    lead: [
      "NovaEyes is a clipping agency for brands, artists, sports and events that want reach in France. Our network of 20,000 clippers cuts your long videos into short clips and posts them on TikTok, Instagram Reels, YouTube Shorts and X, and you pay only for verified views from viewers in France.",
      "France has its own influencer law, one of the strictest in Europe, which makes clear labeling and a clear brief part of every campaign.",
    ],
    languages: "English today. French-language campaigns planned with you on the call",
    timeZone: "Central European Time (CET, UTC+1)",
    stats: { tiktok: "23.4 million", youtube: "51.5 million", instagram: "28.2 million", social: "51.5 million", sourceUrl: DR("france") },
    market: {
      heading: "What does short-form reach look like in France?",
      body: [
        "TikTok had 23.4 million users aged 18 and over in France in late 2025, and YouTube reached 51.5 million people, according to DataReportal.",
        "Rap, football, gaming and creator content lead French feeds. Our campaigns so far have run in English and German. If you want French-language clips, we plan that with you on the call.",
      ],
    },
    rules: {
      heading: "Do paid clips need an ad label in France?",
      body: [
        "Yes. The law of 9 June 2023 on commercial influence requires sponsored content to carry Publicité or Collaboration commerciale, clearly and for the whole post. Retouched images need Image retouchée, AI images need Image virtuelle, and some products, like certain financial products and sports betting tips, cannot be promoted at all.",
      ],
      sourceLabel: "Bird & Bird, French law on commercial influence",
      sourceUrl: "https://www.twobirds.com/en/insights/2023/france/promulgation-de-la-loi-visant-a-encadrer-l-influence-commerciale",
    },
    proofSlugs: ["alex-schor", "brave-cf"],
    proofNote: "We have not published a French case study yet. These are two of our biggest campaigns.",
    faqs: [
      {
        q: "Can I target only viewers in France?",
        a: "Yes. You set France as the target, plus the age groups and genders you want, and only views from that audience count. Clips that miss it are not paid, even if they go viral.",
      },
      {
        q: "Can the clips be in French?",
        a: "Our campaigns so far have run in English and German. If your audience needs French-language clips, we plan that with you on the call before anything starts.",
      },
      {
        q: "How does the French influencer law affect clips?",
        a: "Paid clips must carry Publicité or Collaboration commerciale, and some products cannot be promoted. The rules go into the brief, and clips that break it are not approved and not paid.",
      },
    ],
    nearby: ["spain", "italy", "switzerland"],
  },
  {
    slug: "netherlands",
    name: "Netherlands",
    inName: "in the Netherlands",
    region: "Europe",
    title: "Clipping Agency in the Netherlands",
    description:
      "NovaEyes runs clipping campaigns for Dutch audiences, in English: short clips on TikTok, Reels, Shorts and X, paid only for verified views from the Netherlands.",
    lead: [
      "NovaEyes is a clipping agency for brands, artists, sports and events that want reach in the Netherlands. Our network of 20,000 clippers cuts your long videos into short clips and posts them on TikTok, Instagram Reels, YouTube Shorts and X, and you pay only for verified views from viewers in the Netherlands.",
      "Dutch audiences are among the most English-fluent in Europe, so English-language clips work for many campaigns from day one.",
    ],
    languages: "English. Dutch-language campaigns planned with you on the call",
    timeZone: "Central European Time (CET, UTC+1)",
    stats: { tiktok: "6.30 million", youtube: "15.3 million", instagram: "8.15 million", social: "15.3 million", sourceUrl: DR("netherlands") },
    market: {
      heading: "What does short-form reach look like in the Netherlands?",
      body: [
        "TikTok had 6.30 million users aged 18 and over in the Netherlands in late 2025, and YouTube reached 15.3 million people, 83% of the population, according to DataReportal.",
        "High English fluency means English clips travel well here. For Dutch-language clips, we plan the approach with you on the call, since our campaigns so far have run in English and German.",
      ],
    },
    rules: {
      heading: "Do paid clips need an ad label in the Netherlands?",
      body: [
        "Yes. The Dutch Advertising Code for social media and influencer marketing (RSM) applies to everyone, whatever their follower count: paid content must be clearly recognizable as advertising. Creators with more than 100,000 followers who post at least 24 videos a year and earn from them may also need to register with the Dutch Media Authority.",
      ],
      sourceLabel: "Ondernemersplein (Dutch government), Reclameregels voor social media",
      sourceUrl: "https://ondernemersplein.overheid.nl/wetten-en-regels/reclameregels-voor-social-media-influencer-marketing/",
    },
    proofSlugs: ["alex-schor", "brave-cf"],
    proofNote: "We have not published a Dutch case study yet. These are two of our biggest campaigns.",
    faqs: [
      {
        q: "Do English clips work in the Netherlands?",
        a: "For many campaigns, yes. Dutch audiences are among the most English-fluent in Europe. If your audience needs Dutch-language clips, we plan that with you on the call.",
      },
      {
        q: "Can I target only viewers in the Netherlands?",
        a: "Yes. You set the Netherlands as the target, plus the age groups and genders you want, and only views from that audience count. Clips that miss it are not paid, even if they go viral.",
      },
      {
        q: "How do Dutch ad rules affect clips?",
        a: "Paid clips must be clearly recognizable as advertising under the RSM code. The labeling rules go into the brief, and clips that break it are not approved and not paid.",
      },
    ],
    nearby: ["germany", "united-kingdom", "france"],
  },
  {
    slug: "uae",
    name: "United Arab Emirates",
    inName: "in the UAE",
    region: "Middle East",
    title: "Clipping Agency in the UAE and Dubai",
    description:
      "NovaEyes runs clipping campaigns for the UAE and Dubai, in English: short clips on TikTok, Reels, Shorts and X, paid only for verified views from UAE viewers.",
    lead: [
      "NovaEyes is a clipping agency for brands, artists, events and creators that want reach in the UAE, from Dubai to Abu Dhabi. Our network of 20,000 clippers cuts your long videos into short clips and posts them on TikTok, Instagram Reels, YouTube Shorts and X, and you pay only for verified views from viewers in the UAE.",
      "Most of the UAE's population are expats and English is the everyday language of business and social media, so English-language clips reach most of the market. In the Gulf, BRAVE CF, the Bahrain-based MMA promotion, reached 52.1 million views at $0.21 per 1,000 views with us.",
    ],
    languages: "English",
    timeZone: "Gulf Standard Time (GST, UTC+4)",
    stats: { tiktok: "12.5 million", youtube: "8.37 million", instagram: "8.05 million", social: "12.5 million", sourceUrl: DR("united-arab-emirates") },
    market: {
      heading: "What does short-form reach look like in the UAE?",
      body: [
        "TikTok's ad reach in the UAE was 12.5 million users aged 18 and over in late 2025, more than the country's 11.4 million population, which can happen because ad audiences include visitors and duplicate accounts, according to DataReportal. YouTube reached 8.37 million people.",
        "That makes TikTok the biggest short-form platform in the UAE. Luxury, real estate, events, combat sports and lifestyle brands all compete for the same feeds, which is where volume from hundreds of clipper pages helps.",
      ],
    },
    rules: {
      heading: "Do paid clips need an ad label or permit in the UAE?",
      body: [
        "The UAE Media Council now requires an Advertiser Permit for anyone posting promotional content on social media in the UAE, paid or unpaid. The deadline to get one was extended to 31 January 2026. Permits are free for the first three years for citizens and residents, and visitors register through a licensed agency.",
      ],
      sourceLabel: "The National, UAE extends deadline for influencers to get advertiser permits",
      sourceUrl: "https://www.thenationalnews.com/news/uae/2025/10/23/uae-extends-deadline-for-influencers-to-get-advertiser-permits",
    },
    proofSlugs: ["brave-cf"],
    proofNote: "Our Gulf results so far: BRAVE CF, the Bahrain-based MMA promotion.",
    faqs: [
      {
        q: "Do I need Arabic clips for the UAE?",
        a: "Usually not. Most of the UAE's population are expats and English is the everyday language of social media there, so English-language clips reach most of the market.",
      },
      {
        q: "Have you run campaigns in the Gulf?",
        a: "Yes. BRAVE CF, the Bahrain-based MMA promotion, reached 52.1 million views at $0.21 per 1,000 views from 5,247 clips over six weeks.",
      },
      {
        q: "How does the UAE Advertiser Permit affect clipping?",
        a: "The permit covers people posting promotional content in the UAE. We go through how it applies to your campaign on the call, before anything goes live.",
      },
    ],
    nearby: ["united-kingdom", "united-states", "italy"],
  },
  {
    slug: "canada",
    name: "Canada",
    inName: "in Canada",
    region: "North America",
    title: "Clipping Agency in Canada",
    description:
      "NovaEyes runs clipping campaigns for Canadian audiences, in English: short clips on TikTok, Reels, Shorts and X, paid only for verified views from Canada.",
    lead: [
      "NovaEyes is a clipping agency for brands, artists, sports and events that want reach in Canada. Our network of 20,000 clippers cuts your long videos into short clips and posts them on TikTok, Instagram Reels, YouTube Shorts and X, and you pay only for verified views from viewers in Canada.",
      "Canadian feeds overlap heavily with the US, which is why targeting matters: you can pay only for Canadian views, instead of spilling budget across the border.",
    ],
    languages: "English. French-language campaigns for Quebec planned with you on the call",
    timeZone: "Newfoundland to Pacific time (UTC-3:30 to UTC-8)",
    stats: { tiktok: "16.6 million", youtube: "33.0 million", instagram: "21.0 million", social: "33.0 million", sourceUrl: DR("canada") },
    market: {
      heading: "What does short-form reach look like in Canada?",
      body: [
        "TikTok had 16.6 million users aged 18 and over in Canada in late 2025, about half of all adults, and YouTube reached 33.0 million people, according to DataReportal.",
        "Hockey, music, comedy and creator content travel well in Canada, and so does a lot of US content. Targeting Canada directly keeps your budget on Canadian viewers.",
      ],
    },
    rules: {
      heading: "Do paid clips need an ad label in Canada?",
      body: [
        "Yes. The Competition Act bans misleading advertising, and Ad Standards' Influencer Marketing Disclosure Guidelines ask for a clear disclosure of any paid relationship, such as #ad or #sponsored, that people will actually see.",
      ],
      sourceLabel: "Ad Standards, Influencer Marketing Disclosure Guidelines",
      sourceUrl: "https://adstandards.ca/programs/influencer-marketing/",
    },
    proofSlugs: ["alex-schor", "brave-cf"],
    proofNote: "We have not published a Canadian case study yet. These are two of our biggest campaigns.",
    faqs: [
      {
        q: "Can I pay only for Canadian views?",
        a: "Yes. You set Canada as the target, plus the age groups and genders you want, and only views from that audience count. US views that spill over are not paid.",
      },
      {
        q: "Can the clips be in French for Quebec?",
        a: "Our campaigns so far have run in English and German. For a French-language campaign in Quebec, we plan the approach with you on the call before anything starts.",
      },
      {
        q: "How do Canadian ad rules affect clips?",
        a: "Paid clips must clearly disclose the paid relationship. The labeling rules go into the brief, and clips that break it are not approved and not paid.",
      },
    ],
    nearby: ["united-states", "united-kingdom", "australia"],
  },
  {
    slug: "australia",
    name: "Australia",
    inName: "in Australia",
    region: "Oceania",
    title: "Clipping Agency in Australia",
    description:
      "NovaEyes runs clipping campaigns for Australian audiences: short clips on TikTok, Reels, Shorts and X, paid only for verified views from viewers in Australia.",
    lead: [
      "NovaEyes is a clipping agency for brands, artists, sports and events that want reach in Australia. Our network of 20,000 clippers cuts your long videos into short clips and posts them on TikTok, Instagram Reels, YouTube Shorts and X, and you pay only for verified views from viewers in Australia.",
      "Australia is an English-speaking market where Instagram reaches more than half the population and TikTok reaches about half of all adults, close to US levels.",
    ],
    languages: "English",
    timeZone: "Australian Eastern to Western time (UTC+10 to UTC+8)",
    stats: { tiktok: "10.9 million", youtube: "21.0 million", instagram: "15.2 million", social: "21.0 million", sourceUrl: DR("australia") },
    market: {
      heading: "What does short-form reach look like in Australia?",
      body: [
        "TikTok had 10.9 million users aged 18 and over in Australia in late 2025, 51% of all adults, Instagram reached 15.2 million people and YouTube 21.0 million, according to DataReportal.",
        "Sport, music, comedy and lifestyle content lead Australian feeds. Because so much global English content reaches Australia, targeting Australian viewers keeps your budget local.",
      ],
    },
    rules: {
      heading: "Do paid clips need an ad label in Australia?",
      body: [
        "Yes. Section 2.7 of the AANA Code of Ethics requires advertising to be clearly distinguishable as advertising, and Ad Standards rules on complaints. A clear label such as #ad, placed where people will see it, is the standard.",
      ],
      sourceLabel: "Clayton Utz, Cracking down on influencer #Ads",
      sourceUrl: "https://www.claytonutz.com/insights/2021/may/cracking-down-on-influencer-ads",
    },
    proofSlugs: ["alex-schor", "brave-cf"],
    proofNote: "We have not published an Australian case study yet. These are two of our biggest campaigns.",
    faqs: [
      {
        q: "Can I pay only for Australian views?",
        a: "Yes. You set Australia as the target, plus the age groups and genders you want, and only views from that audience count. Clips that miss it are not paid, even if they go viral.",
      },
      {
        q: "Does the time difference matter?",
        a: "No. Campaigns run on the platforms around the clock, your dashboard updates as data comes in, and reports arrive every week. Calls are booked at a time that suits you.",
      },
      {
        q: "How do Australian ad rules affect clips?",
        a: "Paid clips must be clearly distinguishable as advertising under the AANA Code. The labeling rules go into the brief, and clips that break it are not approved and not paid.",
      },
    ],
    nearby: ["united-states", "united-kingdom", "canada"],
  },
];

export function getLocation(slug: string) {
  return locations.find((l) => l.slug === slug);
}

export const REGIONS: Location["region"][] = ["North America", "Europe", "Middle East", "Oceania"];
