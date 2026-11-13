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
  /** the CPM range after the Momentum discount, as shown */
  cpmUsd: Range;
  clips: Range;
  likes: Range;
  shares: Range;
  comments: Range;
  /** likes, shares and comments over views, in percent; the same for every type and budget */
  engagementPct: number;
};

export function getNiche(id: string): Niche | undefined {
  return estimatorConfig.niches.find((n) => n.id === id);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

// The shared engine, in Momentum mode, on the public sample:
//   views per clip = sample views / sample clips x 1.05
//   like, share, comment rate = sample count / sample views x 1.06
//   CPM = the type's range x 0.85
//   budget B: views = B / CPM x 1,000 (low end from the high CPM, high end from the low CPM)
//   clips = views / views per clip, capped at the larger of 1,000 and B x 1.35
//   likes, shares, comments = views x their rate
// From a view target the same CPM gives the budget: V / 1,000 x CPM, never below the minimum.
const { sample, momentum, clipCap } = estimatorConfig;
const VIEWS_PER_CLIP = (sample.views / sample.clips) * momentum.viewsPerClip;
const RATES = {
  likes: (sample.likes / sample.views) * momentum.engagement,
  shares: (sample.shares / sample.views) * momentum.engagement,
  comments: (sample.comments / sample.views) * momentum.engagement,
};

export function estimate(input: EstimateInput): Estimate {
  const niche = getNiche(input.nicheId);
  if (!niche) throw new Error(`Unknown niche: ${input.nicheId}`);

  const cpm = { low: niche.cpmLowUsd * momentum.cpm, high: niche.cpmHighUsd * momentum.cpm };

  let views: Range;
  let budgetUsd: Range;

  if (input.mode === "budget") {
    const budget = clamp(input.budgetUsd, estimatorConfig.minimumBudgetUsd, estimatorConfig.maximumBudgetUsd);
    budgetUsd = { low: budget, high: budget };
    // Higher CPM means fewer views, so the low end of views uses the high CPM.
    views = {
      low: Math.round((budget / cpm.high) * 1000),
      high: Math.round((budget / cpm.low) * 1000),
    };
  } else {
    const target = clamp(input.targetViews, estimatorConfig.minimumViews, estimatorConfig.maximumViews);
    views = { low: target, high: target };
    budgetUsd = {
      low: Math.max(estimatorConfig.minimumBudgetUsd, Math.round((target / 1000) * cpm.low)),
      high: Math.max(estimatorConfig.minimumBudgetUsd, Math.round((target / 1000) * cpm.high)),
    };
  }

  const cap = (spend: number) => Math.max(clipCap.floor, spend * clipCap.perDollar);
  const clips = {
    low: Math.max(1, Math.round(Math.min(views.low / VIEWS_PER_CLIP, cap(budgetUsd.low)))),
    high: Math.max(1, Math.round(Math.min(views.high / VIEWS_PER_CLIP, cap(budgetUsd.high)))),
  };
  const engaged = (rate: number) => ({ low: Math.round(views.low * rate), high: Math.round(views.high * rate) });

  return {
    mode: input.mode,
    niche,
    views,
    budgetUsd,
    cpmUsd: cpm,
    clips,
    likes: engaged(RATES.likes),
    shares: engaged(RATES.shares),
    comments: engaged(RATES.comments),
    engagementPct: Math.round((RATES.likes + RATES.shares + RATES.comments) * 10000) / 100,
  };
}

export function formatCompact(n: number) {
  return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(n);
}

export function formatUsd(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    // CPMs after the Momentum discount can be fractions of a cent, like $0.0085
    maximumFractionDigits: n < 0.1 ? 4 : n < 10 ? 3 : 0,
    minimumFractionDigits: n < 10 ? 2 : 0,
  }).format(n);
}

export function formatRange(r: Range, format: (n: number) => string) {
  return r.low === r.high ? format(r.low) : `${format(r.low)} to ${format(r.high)}`;
}
