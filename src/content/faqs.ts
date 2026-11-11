import { facts } from "./facts";
import { faqGroups } from "./faq-groups";

// Homepage FAQ. Written to answer the question in the first sentence, in plain words.
// The pricing answer leaves out the fee structure until Andrea decides whether to publish it.
export const homeFaqs = [
  {
    q: "How does pricing work?",
    a: `You fund a view pool, and that budget is paid out to clippers per 1,000 verified views their clips earn. There are no retainers, and you never pay for a clip that doesn't perform. Campaigns start at ${facts.minimumBudgetLabel}.`,
  },
  {
    q: "Which platforms do the clips go out on?",
    a: "TikTok, Instagram Reels, YouTube Shorts and X. The same network covers all four.",
  },
  {
    q: "How do you keep clips on brand?",
    a: "Every clip is reviewed before it can earn anything. Clippers follow rules set at the start of the campaign, covering tone, format, topics to avoid and your brand guidelines. Clips that break the rules are not approved and not paid.",
  },
  {
    q: "How fast can a campaign go live?",
    a: facts.launchTime,
  },
  {
    q: "How do I see the results?",
    a: "You get a live dashboard with views for every clip, plus a weekly report and a final report when the campaign ends.",
  },
];

export { faqGroups };
export const allFaqs = faqGroups.flatMap((g) => g.items);
