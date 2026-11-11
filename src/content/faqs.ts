import { facts } from "./facts";

export const homeFaqs = [
  {
    q: "What is a clipping agency?",
    a: "A clipping agency pays a network of creators, called clippers, to cut your long-form content into short clips and post them on their own pages. You get reach across many accounts at once instead of relying on your own.",
  },
  {
    q: "How does NovaEyes pricing work?",
    a: `${facts.model} Campaigns start at ${facts.minimumBudgetLabel}.`,
  },
  {
    q: "Which platforms do clips go out on?",
    a: `${facts.platforms.join(", ")}.`,
  },
  {
    q: "How do I see results?",
    a: "Views are tracked per clip in a campaign dashboard you can open at any time, plus a report when the campaign ends.",
  },
  {
    q: "What do I need to provide?",
    a: "The source content: episodes, fight footage, a song, product shots. Clippers make the clips, and we set the brief, review quality and optimise the campaign every week.",
  },
];

// TODO: add the remaining FAQs from the current /faq page once the repo is connected.
export const allFaqs = [...homeFaqs];
