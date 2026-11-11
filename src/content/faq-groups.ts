// Ported from the current /faq page (Lovable repo, src/pages/Faq.tsx).
// Edits: founding year corrected to 2025; fee structure removed from the pricing answers.

export type FaqItem = { q: string; a: string };
export type FaqGroup = { title: string; items: FaqItem[] };

export const faqGroups: FaqGroup[] = [
  {
    title: "About NovaEyes",
    items: [
      {
        q: "What is NovaEyes?",
        a: "NovaEyes is a performance-based clipping agency. We turn long-form content and brand assets into short-form clips that get distributed across TikTok, Instagram Reels, YouTube Shorts, and X through a network of over 20,000 vetted creators. Clients pay per 1,000 verified views delivered.",
      },
      {
        q: "When was NovaEyes founded?",
        a: "NovaEyes was founded in 2025 by Andrea Corindo.",
      },
      {
        q: "Where is NovaEyes based?",
        a: "NovaEyes is headquartered in Ferrara, Italy. Our creator network is distributed globally.",
      },
      {
        q: "How big is the NovaEyes creator network?",
        a: "Over 20,000 active clippers distribute content through the NovaEyes network across TikTok, Instagram Reels, YouTube Shorts, and X.",
      },
      {
        q: "Who do you typically work with?",
        a: "Podcasters, combat sports promotions, musicians, supplement and ecommerce brands, streetwear labels, fintech companies, gaming creators, and personal brands. Any client with a content library or a brand worth amplifying.",
      },
    ],
  },
  {
    title: "Services and campaign formats",
    items: [
      {
        q: "What is a clipping campaign?",
        a: "A clipping campaign takes long-form video (podcast episodes, fight footage, interviews, gameplay, event highlights) and distributes short clips through a managed creator network. You get multi-platform organic reach without managing editors or creators in-house.",
      },
      {
        q: "What is logo clipping?",
        a: "Logo clipping is for brands without original video content. Creators place your logo, promo code, and website URL on existing high-performing short-form content. It produces awareness and brand search lift at efficient CPMs without requiring source content from you.",
      },
      {
        q: "What is content clipping?",
        a: "Content clipping uses your existing video library. We cut, hook, caption, and distribute short clips designed for TikTok, Instagram Reels, YouTube Shorts, and X.",
      },
      {
        q: "Do you handle editing?",
        a: "Yes. Clippers in our network handle editing, hooks, captions, formatting, and platform-specific optimization. You approve the creative direction during setup.",
      },
      {
        q: "What platforms do you distribute on?",
        a: "TikTok, Instagram Reels, YouTube Shorts, and X. All four platforms are covered by the same network.",
      },
      {
        q: "Can I choose which platforms to focus on?",
        a: "Yes. Platform mix is set during the strategy call and can be adjusted weekly based on what is performing.",
      },
      {
        q: "Do you create content from scratch?",
        a: "Our model is built around clipping existing content or branded assets. If you do not have source content, logo clipping is the right format.",
      },
    ],
  },
  {
    title: "Pricing and payment",
    items: [
      {
        q: "How does pricing work?",
        // TODO (Andrea): the live site publishes the fee structure here. Kept private
        // until you decide whether fee transparency is part of the positioning.
        a: "NovaEyes operates on a pay-per-1,000-views model. You fund a view pool that gets distributed to clippers as their clips generate verified views. Your quote covers the view pool, campaign management and launch. There are no retainers and no charges for content that does not perform.",
      },
      {
        q: "What does campaign management cover?",
        a: "Onboarding, creative briefing, creator coordination, clip approvals, weekly reporting and optimization.",
      },
      {
        q: "Is there a minimum spend?",
        a: "Yes. The minimum monthly clipping budget is $3,000 to make the campaign mathematically viable for both you and the network.",
      },
      {
        q: "Are there long-term contracts?",
        a: "No. There is no retainer and no minimum monthly commitment beyond the campaign you fund. You can scale up, scale down, pause, or stop at any time.",
      },
      {
        q: "How are clippers paid?",
        a: "Clippers are paid per 1,000 verified views their approved clips generate. They only earn from clips that get approved and that hit verified view milestones.",
      },
      {
        q: "What payment methods do you accept?",
        a: "Bank transfer and standard invoicing. Payment terms are agreed during onboarding.",
      },
      {
        q: "Do you offer refunds?",
        a: "The clipping budget is only spent against verified views. Any unspent budget at the end of a campaign cycle stays in your view pool or is refunded based on the agreement.",
      },
    ],
  },
  {
    title: "Performance and results",
    items: [
      {
        q: "What CPMs have you delivered?",
        a: "Documented case studies include $0.13 CPM on the Alex Schor podcast campaign (189,974,866 views), $0.21 CPM on the BRAVE CF combat sports campaign (52,131,046 views), $0.21 CPM on the Sparkle music campaign, and $0.36 CPM on the Ahmed Amwell campaign.",
      },
      {
        q: "What is the lowest CPM you have hit?",
        a: "$0.13 CPM on the Alex Schor podcast campaign, delivering 189,974,866 verified views. This is among the lowest publicly documented CPMs in managed podcast distribution.",
      },
      {
        q: "How fast can a campaign launch?",
        a: "Most campaigns are active within 48 hours of brief approval, assuming source content and creative direction are ready.",
      },
      {
        q: "How quickly do views show up?",
        a: "First clips typically go live within 48 hours of launch. View velocity ramps over the first 7 to 14 days as more clippers pick up the brief and as top-performing clips compound.",
      },
      {
        q: "Can you guarantee a specific view count?",
        a: "We target a CPM, not a guaranteed view count. Because clippers are paid per verified view, the budget converts to views at the negotiated CPM. Final delivery depends on content quality and campaign settings, both of which we optimize weekly.",
      },
      {
        q: "How do you measure views?",
        a: "Verified views from the native platforms (TikTok, Instagram, YouTube, X). We aggregate per clip, per clipper, per platform, with weekly reporting inside your client dashboard.",
      },
      {
        q: "Do views from clipping translate into followers or revenue?",
        a: "Yes, when the campaign is structured for it. Documented downstream outcomes include Spotify listener growth from 170,000 to 650,000 for Alex Schor and YouTube subscriber growth of over 2,000,000 across campaigns. Revenue attribution depends on the funnel.",
      },
    ],
  },
  {
    title: "Comparisons",
    items: [
      {
        q: "How is this different from influencer marketing?",
        a: "Influencer marketing pays a fixed fee for a single post from one creator, regardless of performance. NovaEyes deploys hundreds of clippers simultaneously, each paid only when their clips generate real views. The result is volume that a single influencer deal cannot replicate, at a cost that scales with results.",
      },
      {
        q: "How is this different from paid ads?",
        a: "Paid ads cost $5 to $40 CPM on most major platforms. NovaEyes campaigns have delivered CPMs as low as $0.13 to $0.21 in documented case studies. Reach is delivered through organic creator distribution, not paid placements, which also produces algorithmic compounding that paid ads do not.",
      },
      {
        q: "How is this different from building an in-house clipping team?",
        a: "In-house clipping requires hiring editors, recruiting and managing creators, building moderation workflows, and running weekly optimization. NovaEyes replaces all of that. You pay per verified view delivered, not for editorial labor or recruitment overhead.",
      },
      {
        q: "How is this different from a UGC agency?",
        a: "UGC agencies usually deliver a fixed number of finished assets for you to run as ads. NovaEyes delivers organic distribution at scale through real creator accounts, where the views happen on the creator's platform rather than in your ad account.",
      },
      {
        q: "Can clipping work alongside paid ads?",
        a: "Yes. Many clients use clipping for top-of-funnel reach and brand search lift, then retarget with paid ads. The two stack well.",
      },
    ],
  },
  {
    title: "Process and onboarding",
    items: [
      {
        q: "What happens after I book a strategy call?",
        a: "1) Strategy call (30 minutes) to align on goals, creative angles, platform mix, and rollout. 2) Setup including content intake and creative briefing. 3) Launch within days once content and approvals are ready. 4) Weekly reporting with scale, revise, or retire decisions.",
      },
      {
        q: "What do I need to bring to the first call?",
        a: "Your goals (views, downstream platform growth, revenue, awareness), your source content type if any, budget range, launch timing, and your vertical so we can map the right campaign format.",
      },
      {
        q: "What does setup look like?",
        a: "Content intake, creative direction, brand safety rules, hook and format guidelines, and the campaign brief that goes out to the network. We finalize platform mix and CPM targets here.",
      },
      {
        q: "Do I get to approve clips?",
        a: "Yes. Every clip goes through an approval process before it is eligible for payout. You can set approval rules upfront or review individually.",
      },
      {
        q: "How long does a campaign run?",
        a: "Campaigns run as long as you fund them. Some clients run continuous always-on campaigns; others run focused 30 to 90 day sprints around launches.",
      },
      {
        q: "Can I run multiple campaigns at the same time?",
        a: "Yes. Multiple campaigns can run in parallel for different products, artists, shows, or audiences.",
      },
    ],
  },
  {
    title: "Reporting and dashboard",
    items: [
      {
        q: "What metrics do you report on?",
        a: "Verified view counts, CPM benchmarks, clip volume distributed, platform-by-platform breakdown, top-performing clips, and downstream outcomes where attribution is clear.",
      },
      {
        q: "Do I get a dashboard?",
        a: "Yes. Every client gets access to a live dashboard with verified views, spend, CPM, clip count, platform distribution, and top performers. It updates as the network reports new data.",
      },
      {
        q: "How often do I get reports?",
        a: "Live dashboard access plus a weekly report summarizing performance, what to scale, what to revise, and what to retire.",
      },
      {
        q: "How do you verify views?",
        a: "Views are pulled from the native platforms. We deduplicate, validate against the clipper's account, and only count what the platform reports as real.",
      },
    ],
  },
  {
    title: "Creative, brand safety, and rights",
    items: [
      {
        q: "How do you ensure brand safety?",
        a: "Brand safety rules are set during onboarding: tone, restricted topics, forbidden words, competitor mentions, off-limits formats. Every clip is reviewed against those rules before it is approved for payout.",
      },
      {
        q: "How do you ensure clip quality?",
        a: "Approval gating, performance feedback loops to top clippers, and weekly creative briefs that surface what is working and what to drop.",
      },
      {
        q: "Who owns the clips?",
        a: "You retain rights to your source content. Clippers retain the right to host clips on their accounts as agreed in the network terms. We document this clearly during setup.",
      },
      {
        q: "Is clipping legal?",
        a: "Yes, when the campaign has rights to the source content and follows platform, copyright, and disclosure requirements. We use either client-owned content (content clipping) or logo-overlay formats that do not require third-party content rights.",
      },
      {
        q: "What about copyright takedowns?",
        a: "Because we only clip from client-owned content or use logo overlays on approved formats, takedowns are rare. When they happen, we replace the clip and adjust the brief.",
      },
      {
        q: "Can clippers post anything they want?",
        a: "No. Clippers operate inside the campaign brief and the brand safety rules. Off-brief or unsafe clips do not get approved and do not earn.",
      },
    ],
  },
  {
    title: "Verticals and use cases",
    items: [
      {
        q: "What verticals do you specialize in?",
        a: "Podcasts, combat sports, music, creator entertainment, supplements, gaming, streetwear, and fintech. Documented case studies span podcasts (Alex Schor), combat sports (BRAVE CF), music (Family Ties, Sparkle), and ecommerce (Rob The Bank).",
      },
      {
        q: "Do you work with podcasters?",
        a: "Yes. Podcasts are one of our strongest verticals. The Alex Schor campaign delivered 189,974,866 verified views at $0.13 CPM and grew Spotify monthly listeners from 170,000 to 650,000.",
      },
      {
        q: "Do you work with musicians?",
        a: "Yes. The Sparkle campaign delivered 4.7M views in 3 days at $0.21 CPM and the Family Ties campaign delivered 7.2M+ views at $0.41 CPM.",
      },
      {
        q: "Do you work with combat sports promotions?",
        a: "Yes. The BRAVE CF campaign delivered 52,131,046 verified views at $0.21 CPM.",
      },
      {
        q: "Do you work with ecommerce brands?",
        a: "Yes. Logo clipping is built for ecommerce. Clippers attach your logo, promo code, and URL to top-performing short-form content to drive brand search and direct response.",
      },
      {
        q: "Do you work with personal brands and founders?",
        a: "Yes. Founders with podcasts, interview footage, or any consistent long-form output are an ideal fit.",
      },
    ],
  },
  {
    title: "For creators and clippers",
    items: [
      {
        q: "How do I join the NovaEyes clipper network?",
        a: "Apply through the contact form on nova-eyes.com. We review platform footprint, prior clipping work, and engagement before granting access to active campaigns.",
      },
      {
        q: "How much can a clipper earn?",
        a: "Earnings depend on the campaign CPM and the verified views your approved clips generate. Top clippers earn from multiple campaigns simultaneously.",
      },
      {
        q: "When do clippers get paid?",
        a: "On the campaign payout cycle once views are verified and clips are approved. Payout cadence is documented in the network terms.",
      },
    ],
  },
  {
    title: "Getting started",
    items: [
      {
        q: "How do I start a campaign?",
        a: "Book a strategy call at nova-eyes.com/contact or email andrea@nova-eyes.com. Response within 24 hours. Campaign setup typically completes within days when content assets are ready.",
      },
      {
        q: "How long is the strategy call?",
        a: "30 minutes. We cover goals, content, budget, platforms, and a rollout plan.",
      },
      {
        q: "How fast do you respond to inquiries?",
        a: "Within 24 hours.",
      },
      {
        q: "What if I do not have content yet?",
        a: "Logo clipping is the right starting point. You bring brand assets, we handle distribution against existing high-performing short-form content.",
      },
    ],
  },
];
