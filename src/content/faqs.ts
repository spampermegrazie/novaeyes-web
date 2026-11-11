import { faqGroups } from "./faq-groups";

// Homepage FAQ, ported from the live homepage. The pricing answer leaves out the
// fee structure until Andrea decides whether to publish it (see faq-groups.ts).
export const homeFaqs = [
  {
    q: "How does pricing work?",
    a: "NovaEyes operates on a pay-per-1,000-views model. Clients fund a view pool, a budget that gets distributed to clippers as their clips generate verified views. There are no retainers, no flat fees, and no charges for content that does not perform.",
  },
  {
    q: "How is this different from influencer marketing?",
    a: "Influencer marketing pays a fixed fee for a single post from one creator, regardless of performance. NovaEyes deploys hundreds of clippers simultaneously, each paid only when their clips generate real views. The result is a volume of distribution that a single influencer deal cannot replicate, at a cost that scales with actual results rather than guarantees.",
  },
  {
    q: "What platforms does NovaEyes distribute content on?",
    a: "NovaEyes distributes content across TikTok, Instagram Reels, YouTube Shorts, and X through its network of over 20,000 vetted clippers.",
  },
  {
    q: "How do you ensure clip quality and brand safety?",
    a: "Every clip goes through an approval process before it is eligible for payout. Clippers operate within campaign rules set during the setup phase, which define tone, format, restricted topics, and any brand guidelines. Clips that do not meet the criteria do not get approved and the clipper does not earn from them.",
  },
  {
    q: "How fast can a campaign go live?",
    a: "Most campaigns are active within 48 hours of brief approval.",
  },
];

export { faqGroups };
export const allFaqs = faqGroups.flatMap((g) => g.items);
