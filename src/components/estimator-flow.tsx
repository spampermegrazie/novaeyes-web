import { MARK_PATH, MARK_VIEWBOX } from "./brand";
import { formatCompact, formatRange, formatUsd, type Estimate } from "@/lib/estimator";
import { BUDGET_SCALE, VIEWS_SCALE, positionOf } from "@/lib/scale";

// The reach estimator's side panel: one number turning into the other. Budget on top, views at
// the bottom, NovaEyes between them with the niche's rates. The number you picked shows where it
// sits on its slider; the other side is a ruler where the estimate lands as a glowing range. Until
// the estimate is unlocked that ruler just scans, "estimating". Pulses run from what you picked to
// what you get: down from a budget, up from a view target.

type Mode = "budget" | "views";
type Props = {
  mode: Mode | null;
  value: number;
  nicheLabel: string | null;
  estimate: Estimate | null;
  unlocked: boolean;
  reduced: boolean;
};

// Rulers for the estimate, in powers of ten.
const RULERS = {
  views: { from: 6, to: 10, ticks: ["1M", "10M", "100M", "1B", "10B"] },
  budget: { from: 2, to: 6, ticks: ["$100", "$1K", "$10K", "$100K", "$1M"] },
};
const onRuler = (r: { from: number; to: number }, n: number) => Math.min(1, Math.max(0, (Math.log10(Math.max(n, 1)) - r.from) / (r.to - r.from)));

export function EstimatorFlow({ mode, value, nicheLabel, estimate, unlocked, reduced }: Props) {
  const side = (which: Mode) => {
    const isInput = mode === which;
    const range = estimate ? (which === "budget" ? estimate.budgetUsd : estimate.views) : null;
    const fmt = which === "budget" ? formatUsd : formatCompact;
    return {
      which,
      caption: which === "budget" ? "Budget" : "Views",
      badge: mode === null ? null : isInput ? "Your number" : "Estimate",
      text: mode === null ? null : isInput ? fmt(value) : unlocked && range ? formatRange(range, fmt) : null,
      isInput,
      pos: isInput ? positionOf(which === "budget" ? BUDGET_SCALE : VIEWS_SCALE, value) : 0,
      scaleEnds: which === "budget" ? [formatUsd(BUDGET_SCALE.min), formatUsd(BUDGET_SCALE.max)] : [formatCompact(VIEWS_SCALE.min), formatCompact(VIEWS_SCALE.max)],
      band: !isInput && unlocked && range ? [onRuler(RULERS[which], range.low), onRuler(RULERS[which], range.high)] : null,
      scanning: !isInput && mode !== null && !unlocked,
    };
  };
  const label =
    mode === null
      ? "Your estimate: pick a starting point"
      : `Your estimate: ${mode === "budget" ? formatUsd(value) : `${formatCompact(value)} views`}, ${nicheLabel ?? "no niche yet"}${
          unlocked && estimate ? `, ${mode === "budget" ? `${formatRange(estimate.views, formatCompact)} views` : formatRange(estimate.budgetUsd, formatUsd)}` : ""
        }`;

  return (
    <div role="img" aria-label={label} className="flex flex-1 flex-col">
      <Side {...side("budget")} reduced={reduced} />
      <Link mode={mode} nicheLabel={nicheLabel} reduced={reduced} />
      <Side {...side("views")} reduced={reduced} />
    </div>
  );
}

function Side({
  which,
  caption,
  badge,
  text,
  isInput,
  pos,
  scaleEnds,
  band,
  scanning,
  reduced,
}: {
  which: Mode;
  caption: string;
  badge: string | null;
  text: string | null;
  isInput: boolean;
  pos: number;
  scaleEnds: string[];
  band: number[] | null;
  scanning: boolean;
  reduced: boolean;
}) {
  const lit = isInput || !!band;
  return (
    <div
      className={`rounded-2xl border p-6 transition-colors duration-500 ${
        lit ? "border-accent/50 bg-bg-raised/60 shadow-[0_0_40px_rgb(var(--glow)/0.12)]" : "border-line bg-bg-raised/30"
      }`}
    >
      <div className="flex items-baseline justify-between font-label text-[9px] tracking-[0.14em] uppercase">
        <span className="text-muted">{caption}</span>
        {badge && <span className="text-accent">{badge}</span>}
      </div>
      <p className={`mt-3 font-display text-3xl leading-none font-bold tracking-tight tabular-nums ${text ? "text-fg" : "text-muted/60"}`}>
        {text ?? (scanning ? <span className={reduced ? "" : "animate-pulse"}>Estimating</span> : "• • •")}
      </p>

      <div className="mt-6">
        {isInput ? (
          // where your number sits on its slider
          <>
            <div className="relative h-0.5 rounded-full bg-line">
              <div className="absolute inset-y-0 left-0 rounded-full bg-accent shadow-[0_0_10px_rgb(var(--glow))]" style={{ width: `${pos * 100}%` }} />
              <span
                className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fg shadow-[0_0_0_4px_rgb(var(--glow)/0.2),0_0_16px_rgb(var(--glow)/0.8)]"
                style={{ left: `${pos * 100}%` }}
              />
            </div>
            <div className="mt-2.5 flex justify-between font-label text-[8px] tracking-[0.1em] text-muted/70">
              <span>{scaleEnds[0]}</span>
              <span>{scaleEnds[1]}</span>
            </div>
          </>
        ) : (
          // the ruler the estimate lands on
          <>
            <div className="relative h-2.5 overflow-hidden rounded-full bg-line/70">
              {band && (
                <div
                  className="absolute inset-y-0 rounded-full bg-accent shadow-[0_0_14px_rgb(var(--glow))] transition-[left,width] duration-700"
                  style={{ left: `${band[0] * 100}%`, width: `${Math.max(2, (band[1] - band[0]) * 100)}%` }}
                />
              )}
              {scanning && !reduced && <div className="est-scan absolute inset-y-0 w-1/4 rounded-full bg-gradient-to-r from-transparent via-accent/70 to-transparent" />}
            </div>
            <div className="mt-2.5 flex justify-between font-label text-[8px] tracking-[0.1em] text-muted/70">
              {RULERS[which].ticks.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// NovaEyes between the two numbers, with the niche's rates beside it.
function Link({ mode, nicheLabel, reduced }: { mode: Mode | null; nicheLabel: string | null; reduced: boolean }) {
  const flowing = mode !== null && !reduced;
  const half = (key: string) => (
    <div key={key} className={`relative w-px flex-1 ${mode ? "bg-accent/40" : "bg-line"}`}>
      {flowing &&
        [0, 1, 2].map((i) => (
          <span
            key={i}
            className={`absolute left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-accent shadow-[0_0_8px_rgb(var(--glow))] ${mode === "budget" ? "est-down" : "est-up"}`}
            style={{ animationDelay: `${i * 0.5}s` }}
          />
        ))}
    </div>
  );
  return (
    <div className="relative flex min-h-24 flex-1 flex-col items-center py-1">
      {half("a")}
      <div className="relative my-2 flex items-center">
        <div className={`flex h-14 w-16 items-center justify-center rounded-2xl border bg-[#171822] ${mode ? "border-accent/60 shadow-[0_0_24px_rgb(var(--glow)/0.3)]" : "border-line"}`}>
          <svg viewBox={MARK_VIEWBOX} className="h-3.5 w-auto" aria-hidden>
            <path fillRule="evenodd" d={MARK_PATH} fill="var(--fg)" />
          </svg>
        </div>
        <p className="absolute left-full ml-4 w-36 font-label text-[9px] leading-relaxed tracking-[0.12em] text-muted uppercase">
          {nicheLabel ? (
            <>
              <span className="text-accent">×</span> {nicheLabel} rates
            </>
          ) : (
            "Pick a niche"
          )}
        </p>
      </div>
      {half("b")}
    </div>
  );
}
