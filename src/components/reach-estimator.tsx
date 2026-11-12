"use client";

// Reach estimator, in the style of the engine and results sections.
// Left: pick budget or view target, slide to a value, pick a niche.
// Right: a small engine that runs faster as the budget grows, and the estimate.
// The estimate stays locked until the visitor leaves a work email; the real figure
// is not in the page before that. After unlocking, the numbers follow the controls live.

import { useMemo, useRef, useState } from "react";
import { siInstagram, siTiktok, siX, siYoutubeshorts } from "simple-icons";
import { estimatorConfig } from "@/content/estimator-config";
import { estimate, formatCompact, formatRange, formatUsd, type Estimate } from "@/lib/estimator";
import { getAttribution } from "@/lib/attribution";
import { MARK_PATH, MARK_VIEWBOX } from "./brand";
import { BookCall } from "./book-call";
import { CountUp } from "./ui/count-up";

type Mode = "budget" | "views";
type Step = "input" | "gate" | "result";

const BUDGET_STEPS = [3_000, 5_000, 10_000, 15_000, 25_000, 50_000, 100_000, 250_000];
const VIEW_STEPS = [1_000_000, 5_000_000, 10_000_000, 25_000_000, 50_000_000, 100_000_000, 250_000_000, 500_000_000];
const PLATFORM_ICONS = [
  { name: "TikTok", path: siTiktok.path },
  { name: "Instagram Reels", path: siInstagram.path },
  { name: "YouTube Shorts", path: siYoutubeshorts.path },
  { name: "X", path: siX.path },
];

export function ReachEstimator() {
  const [mode, setMode] = useState<Mode>("budget");
  const [stepIndex, setStepIndex] = useState(2);
  const [nicheId, setNicheId] = useState<string>(estimatorConfig.niches[0].id);
  const [step, setStep] = useState<Step>("input");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [newsletter, setNewsletter] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showBooking, setShowBooking] = useState(false);
  const [revealedFor, setRevealedFor] = useState<string | null>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  const steps = mode === "budget" ? BUDGET_STEPS : VIEW_STEPS;
  const value = steps[stepIndex];
  const fill = (stepIndex / (steps.length - 1)) * 100;

  const result: Estimate = useMemo(
    () => (mode === "budget" ? estimate({ mode, budgetUsd: value, nicheId }) : estimate({ mode, targetViews: value, nicheId })),
    [mode, value, nicheId],
  );

  const headline = mode === "budget" ? formatRange(result.views, formatCompact) : formatRange(result.budgetUsd, formatUsd);
  const summary =
    mode === "budget"
      ? `${formatUsd(value)} budget, ${result.niche.label}: ${headline} views`
      : `${formatCompact(value)} views, ${result.niche.label}: ${headline}`;
  const unlocked = step === "result";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          company,
          newsletter,
          website: honeypot,
          source: "reach-estimator",
          input: mode === "budget" ? { mode, budgetUsd: value, nicheId } : { mode, targetViews: value, nicheId },
          attribution: getAttribution(),
        }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error ?? "Something went wrong. Try again.");
      }
      setRevealedFor(summary);
      setStep("result");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="grid gap-16 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-20">
      {/* Controls */}
      <div>
        <div role="tablist" aria-label="Start from" className="flex gap-8 border-b border-line">
          {(["budget", "views"] as const).map((m) => (
            <button
              key={m}
              type="button"
              role="tab"
              aria-selected={mode === m}
              onClick={() => {
                setMode(m);
                setStepIndex(2);
              }}
              className={`relative -mb-px pb-3 font-display text-sm font-semibold transition-colors ${
                mode === m ? "text-fg" : "text-muted hover:text-fg"
              }`}
            >
              {m === "budget" ? "From a budget" : "From a view target"}
              {mode === m && <span aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-accent shadow-[0_0_10px_rgb(var(--glow))]" />}
            </button>
          ))}
        </div>

        <label htmlFor="amount" className="mt-10 block font-label text-[10px] tracking-[0.14em] text-muted uppercase">
          {mode === "budget" ? "Campaign budget" : "Target views"}
        </label>
        <p className="mt-3 font-display text-6xl leading-none font-bold tracking-tight tabular-nums sm:text-7xl">
          {mode === "budget" ? formatUsd(value) : formatCompact(value)}
        </p>
        <input
          id="amount"
          type="range"
          min={0}
          max={steps.length - 1}
          step={1}
          value={stepIndex}
          onChange={(e) => setStepIndex(Number(e.target.value))}
          aria-valuetext={mode === "budget" ? formatUsd(value) : `${formatCompact(value)} views`}
          className="ne-range mt-8 w-full"
          style={{ "--fill": `${fill}%` } as React.CSSProperties}
        />
        <div aria-hidden className="mt-2 flex justify-between font-label text-[9px] tracking-[0.1em] text-muted uppercase">
          <span>{mode === "budget" ? formatUsd(steps[0]) : formatCompact(steps[0])}</span>
          <span>{mode === "budget" ? formatUsd(steps[steps.length - 1]) : formatCompact(steps[steps.length - 1])}</span>
        </div>

        <p id="niche-label" className="mt-12 font-label text-[10px] tracking-[0.14em] text-muted uppercase">
          Your niche
        </p>
        <div role="radiogroup" aria-labelledby="niche-label" className="mt-4 flex flex-wrap gap-2">
          {estimatorConfig.niches.map((n) => {
            const on = n.id === nicheId;
            return (
              <button
                key={n.id}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => setNicheId(n.id)}
                className={`rounded-full border px-4 py-2 font-display text-sm font-semibold transition-all ${
                  on ? "border-accent/70 text-fg shadow-[0_0_18px_rgb(var(--glow)/0.35)]" : "border-line text-muted hover:border-muted/50 hover:text-fg"
                }`}
              >
                {n.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Readout */}
      <div className="relative isolate">
        <div
          aria-hidden
          className="pointer-events-none absolute top-[30%] left-1/2 -z-10 aspect-square w-[110%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(59_130_246/0.16),rgb(59_130_246/0.05)_45%,transparent)]"
        />
        <MiniEngine mode={mode} value={value} level={stepIndex} result={unlocked ? headline : null} />

        <p className="mt-10 font-label text-[10px] tracking-[0.14em] text-muted uppercase">
          {mode === "budget" ? "Estimated views" : "Estimated budget"} · {result.niche.label}
        </p>

        {unlocked ? (
          <p className="mt-3 font-display text-5xl leading-none font-bold tracking-tight tabular-nums sm:text-6xl">
            {revealedFor === summary ? <CountUpRange text={headline} /> : headline}
          </p>
        ) : (
          // Placeholder digits only: the real figure is not in the page until the email is in.
          <p aria-hidden className="mt-3 font-display text-5xl leading-none font-bold tracking-tight blur-md select-none sm:text-6xl">
            {mode === "budget" ? "00.0M to 00.0M" : "$00,000 to $00,000"}
          </p>
        )}

        {step === "input" && (
          <div className="mt-10">
            <p className="max-w-sm leading-relaxed text-muted">
              Your estimate is ready. Leave a work email and we&apos;ll show it here and send you a copy.
            </p>
            <button
              type="button"
              onClick={() => {
                setStep("gate");
                requestAnimationFrame(() => emailRef.current?.focus());
              }}
              className="mt-6 rounded-full bg-accent px-6 py-3 font-display text-sm font-semibold text-accent-ink shadow-[0_0_32px_rgb(var(--glow)/0.35)] hover:opacity-90"
            >
              Unlock my estimate
            </button>
          </div>
        )}

        {step === "gate" && (
          <form onSubmit={submit} className="mt-8 max-w-md space-y-5">
            <input
              ref={emailRef}
              type="email"
              required
              autoComplete="email"
              placeholder="Work email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-b border-line bg-transparent py-3 text-lg outline-none placeholder:text-muted/70 focus:border-accent"
            />
            <input
              type="text"
              required
              autoComplete="organization"
              placeholder="Company or artist name"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full border-b border-line bg-transparent py-3 text-lg outline-none placeholder:text-muted/70 focus:border-accent"
            />
            {/* Honeypot: hidden from people, filled by bots. */}
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              className="hidden"
              aria-hidden
            />
            <label className="flex items-start gap-3 text-sm text-muted">
              <input type="checkbox" checked={newsletter} onChange={(e) => setNewsletter(e.target.checked)} className="mt-1 accent-[var(--accent)]" />
              Send me campaign results and clipping insights every two weeks. Unsubscribe anytime.
            </label>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="rounded-full bg-accent px-6 py-3 font-display text-sm font-semibold text-accent-ink shadow-[0_0_32px_rgb(var(--glow)/0.35)] hover:opacity-90 disabled:opacity-50"
            >
              {submitting ? "Calculating" : "Show my estimate"}
            </button>
          </form>
        )}

        {unlocked && (
          <div className="mt-10">
            <dl className="grid grid-cols-3 border-y border-line py-6">
              <div className="pr-3">
                <dd className="font-display text-lg font-bold tabular-nums sm:text-xl">{formatRange(result.cpmUsd, formatUsd)}</dd>
                <dt className="mt-1 font-label text-[9px] tracking-[0.12em] text-muted uppercase">Per 1,000 views</dt>
              </div>
              <div className="pr-3">
                <dd className="font-display text-lg font-bold tabular-nums sm:text-xl">
                  {formatRange(result.clips, (n) => n.toLocaleString("en-US"))}
                </dd>
                <dt className="mt-1 font-label text-[9px] tracking-[0.12em] text-muted uppercase">Clips</dt>
              </div>
              <div>
                <dd className="flex h-7 items-center gap-3">
                  {PLATFORM_ICONS.map((p) => (
                    <svg key={p.name} viewBox="0 0 24 24" className="h-4 w-4 fill-fg" role="img" aria-label={p.name}>
                      <path d={p.path} />
                    </svg>
                  ))}
                </dd>
                <dt className="mt-1 font-label text-[9px] tracking-[0.12em] text-muted uppercase">Platforms</dt>
              </div>
            </dl>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Based on past campaign ranges, not a guarantee. Move the slider to try other numbers. A copy is on its way to {email}.
            </p>
            {!showBooking ? (
              <button
                type="button"
                onClick={() => setShowBooking(true)}
                className="mt-8 rounded-full bg-accent px-6 py-3 font-display text-sm font-semibold text-accent-ink shadow-[0_0_32px_rgb(var(--glow)/0.35)] hover:opacity-90"
              >
                Book a 15-minute reach audit
              </button>
            ) : (
              <div className="mt-8">
                <BookCall prefill={{ email, company, estimate: summary }} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Two numbers counting up together, e.g. 6M to 30M or $5,000 to $15,000.
function CountUpRange({ text }: { text: string }) {
  const parts = text.split(" to ");
  if (parts.length !== 2) return <CountUp value={text} />;
  return (
    <>
      <CountUp value={parts[0]} />
      <span className="text-muted"> to </span>
      <CountUp value={parts[1]} delay={0.12} />
    </>
  );
}

// Budget in, NovaEyes in the middle, views out. More budget, more and faster packets.
// Negative begin times start every packet mid-path, so none sits at the corner waiting.
function MiniEngine({ mode, value, level, result }: { mode: Mode; value: number; level: number; result: string | null }) {
  const count = 3 + level;
  const speed = 2.4 - level * 0.18;
  const left = "M150,60 C190,60 200,60 236,60";
  const right = "M324,60 C360,60 370,60 410,60";
  const known = mode === "budget" ? formatUsd(value) : formatCompact(value);
  return (
    <svg viewBox="0 0 560 120" className="h-auto w-full overflow-visible" role="img" aria-label="Your budget runs through NovaEyes and comes out as views">
      <path d={left} className="ne-flow ne-flow-on" />
      <path d={right} className="ne-flow ne-flow-on" />
      {Array.from({ length: count }).map((_, i) => (
        <circle key={`a-${level}-${i}`} r="2.4" className="ne-pkt">
          <animateMotion dur={`${speed}s`} begin={`-${(i * speed) / count}s`} repeatCount="indefinite" path={left} />
        </circle>
      ))}
      {Array.from({ length: count }).map((_, i) => (
        <circle key={`b-${level}-${i}`} r="2.4" className="ne-pkt">
          <animateMotion dur={`${speed}s`} begin={`-${(i * speed) / count + speed / 2}s`} repeatCount="indefinite" path={right} />
        </circle>
      ))}

      <g transform="translate(10,40)">
        <rect width="140" height="40" rx="10" className="ne-node ne-node-on" />
        <text x="70" y="17" textAnchor="middle" className="ne-caption" style={{ fontSize: 7 }}>
          Budget
        </text>
        <text x="70" y="31" textAnchor="middle" className="ne-label">
          {mode === "budget" ? known : (result ?? "• • •")}
        </text>
      </g>

      <g transform="translate(236,28)">
        <rect x="-5" y="-5" width="98" height="74" rx="19" fill="none" stroke="rgb(59 130 246 / .45)" className="ne-ring" />
        <rect width="88" height="64" rx="14" className="ne-node ne-hub" />
        <svg x="17" y="20" width="54" height="18.4" viewBox={MARK_VIEWBOX}>
          <path fillRule="evenodd" d={MARK_PATH} fill="var(--fg)" />
        </svg>
      </g>

      <g transform="translate(410,40)">
        <rect width="140" height="40" rx="10" className="ne-node ne-node-on" />
        <text x="70" y="17" textAnchor="middle" className="ne-caption" style={{ fontSize: 7 }}>
          Views
        </text>
        <text x="70" y="31" textAnchor="middle" className="ne-label">
          {mode === "views" ? known : (result ?? "• • •")}
        </text>
      </g>
    </svg>
  );
}
