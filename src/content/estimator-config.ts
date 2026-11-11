// Estimator inputs per campaign type.
//
// CPM ranges are the ones published on the live site's estimator. They are
// wide (creator campaigns span 10x), so ranges in the result are wide too.
// Tighten them from campaign dashboard data when possible.
//
// viewsPerClip comes from the live estimator's internal baseline
// (52M views across 9,200 clips). The live estimator also applied a 15%
// momentum discount to CPM; this one does not, so estimates match the
// published ranges exactly.

export type Niche = {
  id: string;
  label: string;
  cpmLowUsd: number;
  cpmHighUsd: number;
  viewsPerClip: number;
};

const VIEWS_PER_CLIP = Math.round(52_000_000 / 9_200);

export const estimatorConfig = {
  minimumBudgetUsd: 3_000,
  maximumBudgetUsd: 250_000,
  minimumViews: 1_000_000,
  maximumViews: 500_000_000,
  // The live estimator capped clips at 1.35 clips per dollar of budget.
  maxClipsPerDollar: 1.35,
  niches: [
    { id: "logo", label: "Logo campaign", cpmLowUsd: 0.01, cpmHighUsd: 0.5, viewsPerClip: VIEWS_PER_CLIP },
    { id: "sports", label: "Sports", cpmLowUsd: 0.2, cpmHighUsd: 2, viewsPerClip: VIEWS_PER_CLIP },
    { id: "podcast", label: "Podcast", cpmLowUsd: 0.3, cpmHighUsd: 2, viewsPerClip: VIEWS_PER_CLIP },
    { id: "music", label: "Music", cpmLowUsd: 0.1, cpmHighUsd: 0.6, viewsPerClip: VIEWS_PER_CLIP },
    { id: "creator", label: "Creator or personal brand", cpmLowUsd: 0.3, cpmHighUsd: 3, viewsPerClip: VIEWS_PER_CLIP },
    { id: "product", label: "Product", cpmLowUsd: 0.1, cpmHighUsd: 1, viewsPerClip: VIEWS_PER_CLIP },
  ] satisfies Niche[],
} as const;
