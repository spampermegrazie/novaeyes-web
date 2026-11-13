// Estimator inputs per campaign type, for the public reach estimator.
//
// It runs the same engine as the client dashboard's Estimate Reach tab, always in Momentum
// mode and in dollars, but on fixed numbers instead of a client's campaign data:
// - CPM: a range per campaign type (below), with the Momentum discount taken off both ends.
// - Views per clip and engagement: from an internal sample (not real totals). Its own CPM
//   (about $3.46) is ignored in favour of the per-type ranges.
// The maths lives in src/lib/estimator.ts.

export type Niche = {
  id: string;
  label: string;
  cpmLowUsd: number;
  cpmHighUsd: number;
};

export const estimatorConfig = {
  minimumBudgetUsd: 3_000,
  maximumBudgetUsd: 250_000,
  minimumViews: 1_000_000,
  maximumViews: 500_000_000,
  // Internal sample the public tool's views per clip and engagement rates come from.
  sample: { views: 52_000_000, spentUsd: 180_000, clips: 9_200, likes: 3_120_000, shares: 416_000, comments: 208_000 },
  // Momentum mode: CPM 15% cheaper, 5% more views per clip, 6% more engagement.
  momentum: { cpm: 0.85, viewsPerClip: 1.05, engagement: 1.06 },
  // Projected clips are capped at the larger of 1,000 and 1.35 per dollar of budget.
  clipCap: { floor: 1_000, perDollar: 1.35 },
  niches: [
    { id: "logo", label: "Logo campaign", cpmLowUsd: 0.01, cpmHighUsd: 0.5 },
    { id: "sports", label: "Sports", cpmLowUsd: 0.2, cpmHighUsd: 2 },
    { id: "podcast", label: "Podcast", cpmLowUsd: 0.3, cpmHighUsd: 2 },
    { id: "music", label: "Music", cpmLowUsd: 0.1, cpmHighUsd: 0.6 },
    { id: "creator", label: "Creator or personal brand", cpmLowUsd: 0.3, cpmHighUsd: 3 },
    { id: "product", label: "Product", cpmLowUsd: 0.1, cpmHighUsd: 1 },
  ] satisfies Niche[],
} as const;
