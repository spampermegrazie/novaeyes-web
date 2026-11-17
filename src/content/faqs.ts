import { facts } from "./facts";
import { faqGroups } from "./faq-groups";

// Homepage FAQ, the four questions buyers ask first. Written to answer the question in the first
// sentence, in plain words. Everything else lives on /faq.
// The pricing answer names the management fee as a percentage only. The percentage itself stays off the site.
export const homeFaqs = [
  {
    q: "How does pricing work?",
    a: `${facts.pricingSummary} There are no retainers, and a clip that doesn't perform earns nothing from your pool.`,
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
