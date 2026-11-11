import { estimatorConfig, type Niche } from "@/content/estimator-config";

export type EstimateInput =
  | { mode: "budget"; budgetUsd: number; nicheId: string }
  | { mode: "views"; targetViews: number; nicheId: string };

export type Range = { low: number; high: number };

export type Estimate = {
  mode: "budget" | "views";
  niche: Niche;
  views: Range;
  budgetUsd: Range;
  cpmUsd: Range;
  clips: Range;
};

export function getNiche(id: string): Niche | undefined {
  return estimatorConfig.niches.find((n) => n.id === id);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function estimate(input: EstimateInput): Estimate {
  const niche = getNiche(input.nicheId);
  if (!niche) throw new Error(`Unknown niche: ${input.nicheId}`);

  const cpm = { low: niche.cpmLowUsd, high: niche.cpmHighUsd };

  let views: Range;
  let budgetUsd: Range;

  if (input.mode === "budget") {
    const budget = clamp(
      input.budgetUsd,
      estimatorConfig.minimumBudgetUsd,
      estimatorConfig.maximumBudgetUsd,
    );
    budgetUsd = { low: budget, high: budget };
    // Higher CPM means fewer views, so the low end of views uses the high CPM.
    views = {
      low: Math.round((budget / cpm.high) * 1000),
      high: Math.round((budget / cpm.low) * 1000),
    };
  } else {
    const target = clamp(
      input.targetViews,
      estimatorConfig.minimumViews,
      estimatorConfig.maximumViews,
    );
    views = { low: target, high: target };
    budgetUsd = {
      low: Math.max(estimatorConfig.minimumBudgetUsd, Math.round((target / 1000) * cpm.low)),
      high: Math.max(estimatorConfig.minimumBudgetUsd, Math.round((target / 1000) * cpm.high)),
    };
  }

  const clipCap = (spend: number) => Math.round(spend * estimatorConfig.maxClipsPerDollar);
  const clips = {
    low: Math.max(1, Math.min(Math.round(views.low / niche.viewsPerClip), clipCap(budgetUsd.low))),
    high: Math.max(1, Math.min(Math.round(views.high / niche.viewsPerClip), clipCap(budgetUsd.high))),
  };

  return { mode: input.mode, niche, views, budgetUsd, cpmUsd: cpm, clips };
}

export function formatCompact(n: number) {
  return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(n);
}

export function formatUsd(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: n < 10 ? 2 : 0,
  }).format(n);
}

export function formatRange(r: Range, format: (n: number) => string) {
  return r.low === r.high ? format(r.low) : `${format(r.low)} to ${format(r.high)}`;
}
