import { facts } from "./facts";
import { faqGroups } from "./faq-groups";

// Homepage FAQ, the four questions buyers ask first. Written to answer the question in the first
// sentence, in plain words. Everything else lives on /faq.
// The pricing answer leaves out the fee structure until Andrea decides whether to publish it.
export const homeFaqs = [
  {
    q: "How does pricing work?",
    a: `You fund a view pool, and that budget is paid out to clippers per 1,000 verified views their clips earn. There are no retainers, and you never pay for a clip that doesn't perform. Campaigns start at ${facts.minimumBudgetLabel}.`,
  },
  {
    q: "How do you keep clips on brand?",
    a: "Every clip is reviewed before it can earn anything. Clippers follow rules set at the start of the campaign, covering tone, format, topics to avoid and your brand guidelines. Clips that break the rules are not approved and not paid.",
  },
  {
    q: "Can you target a specific country or audience?",
    a: facts.targeting,
  },
  {
    q: "How fast can a campaign go live?",
    a: facts.launchTime,
  },
];

export { faqGroups };
export const allFaqs = faqGroups.flatMap((g) => g.items);
