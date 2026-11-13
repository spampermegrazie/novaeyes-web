// Full FAQ, rewritten from the old /faq page in plain language.
// Every answer starts with the direct answer, then adds detail.
// Fixed from the old page: founded 2025, Alex Schor is music (not podcast), Family Ties is podcast (not music).
// The fee structure stays off the site until Andrea decides whether to publish it.

import { facts } from "./facts";

export type FaqItem = { q: string; a: string };
export type FaqGroup = { title: string; items: FaqItem[] };

export const faqGroups: FaqGroup[] = [
  {
    title: "About NovaEyes",
    items: [
      {
        q: "What is NovaEyes?",
        a: `NovaEyes is a clipping agency that works on performance. We turn your videos into short clips and get them posted by ${facts.clippersLabel} clippers across TikTok, Instagram Reels, YouTube Shorts and X. You pay for verified views, not for hours or deliverables.`,
      },
      {
        q: "When was NovaEyes founded?",
        a: `In ${facts.foundingYear}, by ${facts.founder}.`,
      },
      {
        q: "Where is NovaEyes based?",
        a: "Our team is in Ferrara, Italy. The clippers are all over the world, and we work with clients in English.",
      },
      {
        q: "How big is the clipper network?",
        a: `More than ${facts.clippersLabel} active clippers. They post on TikTok, Instagram Reels, YouTube Shorts and X.`,
      },
      {
        q: "Who do you work with?",
        a: "Anyone with something worth seeing and a budget to push it: musicians, podcasters, fight promotions, founders, creators, and brands selling a product or an app.",
      },
    ],
  },
  {
    title: "Services",
    items: [
      {
        q: "What is a clipping campaign?",
        a: "A clipping campaign takes your long videos, like podcast episodes, fights, interviews or streams, and turns them into hundreds or thousands of short clips posted by other creators. You get reach on four platforms without hiring editors or managing anyone.",
      },
      {
        q: "What is logo clipping?",
        a: "Logo clipping is for brands that don't have their own video. Clippers put your logo, promo code and link on short clips that already perform, and post them on their pages.",
      },
      {
        q: "What is content clipping?",
        a: "Content clipping uses the videos you already have. Clippers pick the best moments and turn them into short clips with hooks and captions made for each platform.",
      },
      {
        q: "Do you handle the editing?",
        a: "Yes. The clippers do the cutting, hooks, captions and formatting. You agree on the creative direction with us at the start.",
      },
      {
        q: "Which platforms do you post on?",
        a: "TikTok, Instagram Reels, YouTube Shorts and X. The same network covers all four.",
      },
      {
        q: "Can I pick which platforms to focus on?",
        a: "Yes. We set the platform mix on the first call and change it each week based on what is working.",
      },
      {
        q: "Do you make content from scratch?",
        a: "No. We clip content that already exists, or put your brand on clips that already perform. If you have no video yet, logo clipping is the place to start.",
      },
    ],
  },
  {
    title: "Pricing and payment",
    items: [
      {
        q: "How does pricing work?",
        a: "You pay per 1,000 verified views. You fund a view pool, and clippers are paid from it as their clips earn views. There is no retainer, and clips that don't get views cost you nothing.",
      },
      {
        q: "Is the view pool the full cost?",
        a: "The view pool is what pays the clippers. Your full cost, including our fee for running the campaign, is set out in writing before anything is signed.",
      },
      {
        q: "What does running the campaign include?",
        a: "Onboarding, the creative brief, managing the clippers, approving clips, weekly reports and moving budget to what works.",
      },
      {
        q: "Is there a minimum budget?",
        a: `Yes, ${facts.minimumBudgetLabel}. Below that, there isn't enough budget for clippers to pick up the campaign and for us to learn what works.`,
      },
      {
        q: "Do I have to sign a long contract?",
        a: "No. There is no retainer and no monthly commitment beyond the campaign you fund. You can scale up, scale down, pause or stop.",
      },
      {
        q: "How are clippers paid?",
        a: "Per 1,000 verified views on clips we approved. A clip that isn't approved, or doesn't get views, earns nothing.",
      },
      {
        q: "How do I pay?",
        a: "By bank transfer against an invoice. Payment terms are agreed during onboarding.",
      },
      {
        q: "Do you offer refunds?",
        a: "The view pool is only spent on verified views. If budget is left at the end of a campaign, it either rolls into the next one or is refunded, depending on your agreement.",
      },
    ],
  },
  {
    title: "Results",
    items: [
      {
        q: "What CPMs have you delivered?",
        a: "Our lowest was $0.13 per 1,000 views on the Alex Schor music campaign, which reached 189,974,866 views. BRAVE CF and Sparkle both came in at $0.21, Ahmed Amwell at $0.36 and Family Ties at $0.41.",
      },
      {
        q: "How fast can a campaign start?",
        a: `${facts.launchTime} That assumes your content and creative direction are ready.`,
      },
      {
        q: "How quickly do views come in?",
        a: "The first clips usually go up within 48 hours of launch. Views build over the first one to two weeks, as more clippers join the campaign and the best clips keep spreading.",
      },
      {
        q: "Can you guarantee a number of views?",
        a: "No. We aim for a CPM, not a fixed view count. Because clippers are paid per verified view, your budget turns into views at the agreed rate, but the final number depends on your content and the campaign settings.",
      },
      {
        q: "How do you count views?",
        a: "We pull view counts from TikTok, Instagram, YouTube and X themselves, then total them per clip, per clipper and per platform. You see them in your dashboard and in a weekly report.",
      },
      {
        q: "Do views turn into followers or sales?",
        a: "They can, when the campaign is set up for it. Alex Schor went from 170,000 to 650,000 monthly listeners on Spotify, and the Family Ties podcast picked up more than 2 million extra YouTube views. Sales depend on your funnel and how well you can track it.",
      },
    ],
  },
  {
    title: "Compared to other options",
    items: [
      {
        q: "How is this different from influencer marketing?",
        a: "With an influencer, you pay a fixed fee for one post from one person, whether it works or not. With clipping, hundreds of creators post at once and each one only earns when their clip gets views. Your cost follows the results.",
      },
      {
        q: "How is this different from paid ads?",
        a: "Paid social ads often cost several dollars per 1,000 impressions. Our past campaigns ran between $0.13 and $0.41 per 1,000 views. The clips are organic posts on real creator pages, so the best ones keep getting pushed by the algorithm after they go up.",
      },
      {
        q: "Why not build a clipping team in house?",
        a: "You would need to hire editors, find and manage creators, review every clip and keep optimizing each week. We already run all of that. You pay for verified views instead of salaries and recruiting.",
      },
      {
        q: "How is this different from a UGC agency?",
        a: "A UGC agency usually hands you a set number of videos to run as ads. We get your content seen through organic posts on real creator pages, so the views happen on their accounts, not in your ad account.",
      },
      {
        q: "Can clipping work alongside paid ads?",
        a: "Yes. A lot of clients use clipping for reach and brand searches, then retarget those people with ads.",
      },
    ],
  },
  {
    title: "How it works",
    items: [
      {
        q: "What happens after I book a call?",
        a: "We talk through your goals, content, platforms and budget. Then we set up the brief and the rules, launch to the network, and send you a report every week with what to scale, change or drop.",
      },
      {
        q: "What should I bring to the first call?",
        a: "What you want out of it, like views, listeners, subscribers or sales. The kind of content you have, a rough budget and when you want to launch.",
      },
      {
        q: "What does setup involve?",
        a: "We collect your content, agree on the creative direction, write the brand rules and the hook and format guidelines, and put together the brief the clippers work from. Platform mix and the CPM target are set here too.",
      },
      {
        q: "Do I get to approve clips?",
        a: "Yes. Every clip is reviewed before it can earn. You can set the rules up front or review clips yourself.",
      },
      {
        q: "How long does a campaign run?",
        a: "As long as you fund it. Some clients run all year, others run 30 to 90 day pushes around a release or launch.",
      },
      {
        q: "Can I run more than one campaign at a time?",
        a: "Yes. You can run separate campaigns for different products, songs, shows or audiences.",
      },
    ],
  },
  {
    title: "Reporting",
    items: [
      {
        q: "What do you report on?",
        a: "Verified views, CPM, how many clips went out, results per platform, your top clips, and results further down the funnel when they can be tracked.",
      },
      {
        q: "Do I get a dashboard?",
        a: "Yes. Every client gets a live dashboard with views, spend, CPM, clip count, platform split and top clips. It updates as new data comes in.",
      },
      {
        q: "How often do I get reports?",
        a: "Every week, on top of the live dashboard. Each report says what to scale, what to change and what to drop.",
      },
      {
        q: "How do you check that views are real?",
        a: "We take the numbers from the platforms, remove duplicates and check each clip against the account that posted it. Views that can't be verified are not paid.",
      },
    ],
  },
  {
    title: "Brand safety and rights",
    items: [
      {
        q: "How do you keep clips brand safe?",
        a: "We agree on the rules before launch: tone, topics to avoid, words not to use, no competitor mentions, and formats that are off limits. Every clip is checked against them before it can be paid.",
      },
      {
        q: "How do you keep the quality up?",
        a: "Clips have to be approved to earn. We also give the best clippers feedback and send out a fresh brief each week with what is working and what to stop doing.",
      },
      {
        q: "Who owns the clips?",
        a: "You keep the rights to your content. Clippers can keep the clips up on their pages as agreed in the network terms, and we put this in writing during setup.",
      },
      {
        q: "Is clipping legal?",
        a: "Yes, as long as the campaign has the rights to the content and follows the platform rules on copyright and ad disclosure. We only clip content our clients own or have the rights to.",
      },
      {
        q: "What about copyright takedowns?",
        a: "They are rare, because we only clip content we have the rights to. When one happens, we replace the clip and update the brief.",
      },
      {
        q: "Can clippers post whatever they want?",
        a: "No. They work inside the brief and the brand rules. Clips that go off brief are not approved and not paid.",
      },
    ],
  },
  {
    title: "Who it is for",
    items: [
      {
        q: "Which industries do you work in?",
        a: "Music, podcasts, combat sports, creators and personal brands, and brands selling a product or an app. Our case studies cover music (Alex Schor, Sparkle), podcasts (Family Ties), combat sports (BRAVE CF) and ecommerce (Rob The Bank).",
      },
      {
        q: "Do you work with musicians?",
        a: "Yes. The Alex Schor campaign reached 189,974,866 views at $0.13 per 1,000 and took his Spotify monthly listeners from 170,000 to 650,000. Sparkle reached 4.7 million views in 3 days.",
      },
      {
        q: "Do you work with podcasts?",
        a: "Yes. We clipped 5 episodes of Family Ties, the podcast with Tobi Brown, for 7.2 million views. The show also picked up more than 2 million extra views on YouTube.",
      },
      {
        q: "Do you work with fight promotions?",
        a: "Yes. The BRAVE CF campaign reached 52,131,046 views at $0.21 per 1,000.",
      },
      {
        q: "Do you work with ecommerce brands?",
        a: "Yes. Logo clipping and product clipping are both made for brands. Logo clipping puts your logo, code and link on clips that already perform. Product clipping has creators show the product itself.",
      },
      {
        q: "Do you work with founders and personal brands?",
        a: "Yes. If you put out podcasts, interviews or any long video regularly, you are a good fit.",
      },
    ],
  },
  {
    title: "For clippers",
    items: [
      {
        q: "How do I join the clipper network?",
        a: "Email andrea@nova-eyes.com with links to your accounts and some clips you have made. We look at your pages, past work and engagement before giving you access to live campaigns.",
      },
      {
        q: "How much can a clipper earn?",
        a: "It depends on the campaign rate and how many verified views your approved clips get. The best clippers work several campaigns at the same time.",
      },
      {
        q: "When do clippers get paid?",
        a: "On the campaign payout cycle, once your clips are approved and the views are verified. The schedule is in the network terms.",
      },
    ],
  },
  {
    title: "Getting started",
    items: [
      {
        q: "How do I start a campaign?",
        a: "Book a call at nova-eyes.com/book or email andrea@nova-eyes.com. We reply within 24 hours, and campaigns launch within 24 hours of the onboarding call.",
      },
      {
        q: "How long is the call?",
        a: "15 minutes. We look at your content, goals and budget and tell you what a campaign could do for you.",
      },
      {
        q: "How fast do you reply?",
        a: "Within 24 hours.",
      },
      {
        q: "What if I don't have any content yet?",
        a: "Start with logo clipping. You send your brand assets, and we put them on clips that already perform.",
      },
    ],
  },
];
