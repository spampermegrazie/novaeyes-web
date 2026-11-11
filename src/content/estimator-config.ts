// Estimator inputs per niche.
//
// PLACEHOLDER VALUES. Replace with the ranges from the campaign dashboards
// before launch. cpmLow and cpmHigh are the all-in CPMs a client pays
// (total spend divided by views, times 1,000), so no internal fee structure
// is ever exposed. viewsPerClip is the typical views a single clip earns.

export type Niche = {
  id: string;
  label: string;
  cpmLowUsd: number;
  cpmHighUsd: number;
  viewsPerClip: number;
};

export const estimatorConfig = {
  placeholder: true,
  minimumBudgetUsd: 3_000,
  maximumBudgetUsd: 250_000,
  minimumViews: 1_000_000,
  maximumViews: 500_000_000,
  niches: [
    { id: "music", label: "Music and artists", cpmLowUsd: 0.13, cpmHighUsd: 0.3, viewsPerClip: 40_000 },
    { id: "combat-sports", label: "Combat sports", cpmLowUsd: 0.2, cpmHighUsd: 0.5, viewsPerClip: 10_000 },
    { id: "creators", label: "Creators and entertainment", cpmLowUsd: 0.25, cpmHighUsd: 0.45, viewsPerClip: 8_500 },
    { id: "podcasts", label: "Podcasts", cpmLowUsd: 0.25, cpmHighUsd: 0.5, viewsPerClip: 8_000 },
    { id: "brands", label: "Brands and products", cpmLowUsd: 0.3, cpmHighUsd: 0.6, viewsPerClip: 6_000 },
    { id: "apps", label: "Apps and startups", cpmLowUsd: 0.3, cpmHighUsd: 0.6, viewsPerClip: 6_000 },
  ] satisfies Niche[],
} as const;
