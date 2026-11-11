"use client";

import { useMemo, useState } from "react";
import { estimatorConfig } from "@/content/estimator-config";
import { estimate, formatCompact, formatRange, formatUsd, type Estimate } from "@/lib/estimator";
import { getAttribution } from "@/lib/attribution";
import { BookCall } from "./book-call";

type Mode = "budget" | "views";
type Step = "input" | "gate" | "result";

const BUDGET_STEPS = [3_000, 5_000, 10_000, 15_000, 25_000, 50_000, 100_000, 250_000];
const VIEW_STEPS = [1_000_000, 5_000_000, 10_000_000, 25_000_000, 50_000_000, 100_000_000, 250_000_000, 500_000_000];

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

  const value = mode === "budget" ? BUDGET_STEPS[stepIndex] : VIEW_STEPS[stepIndex];

  const result: Estimate = useMemo(
    () =>
      mode === "budget"
        ? estimate({ mode, budgetUsd: value, nicheId })
        : estimate({ mode, targetViews: value, nicheId }),
    [mode, value, nicheId],
  );

  const summary =
    mode === "budget"
      ? `${formatUsd(value)} budget, ${result.niche.label}: ${formatRange(result.views, formatCompact)} views`
      : `${formatCompact(value)} views, ${result.niche.label}: ${formatRange(result.budgetUsd, formatUsd)}`;

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
      setStep("result");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="rounded-3xl border border-line bg-bg-raised p-6 sm:p-10">
      {step !== "result" && (
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-8">
            <fieldset>
              <legend className="text-sm text-muted">Start from</legend>
              <div className="mt-3 inline-flex rounded-full border border-line p-1 text-sm">
                {(["budget", "views"] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => {
                      setMode(m);
                      setStepIndex(2);
                      setStep("input");
                    }}
                    className={`rounded-full px-4 py-2 ${mode === m ? "bg-fg text-bg" : "text-muted hover:text-fg"}`}
                    aria-pressed={mode === m}
                  >
                    {m === "budget" ? "My budget" : "Views I want"}
                  </button>
                ))}
              </div>
            </fieldset>

            <div>
              <label htmlFor="amount" className="text-sm text-muted">
                {mode === "budget" ? "Campaign budget" : "Target views"}
              </label>
              <p className="mt-2 font-mono text-4xl font-semibold tracking-tight">
                {mode === "budget" ? formatUsd(value) : formatCompact(value)}
              </p>
              <input
                id="amount"
                type="range"
                min={0}
                max={(mode === "budget" ? BUDGET_STEPS : VIEW_STEPS).length - 1}
                step={1}
                value={stepIndex}
                onChange={(e) => setStepIndex(Number(e.target.value))}
                className="mt-4 w-full accent-[var(--accent)]"
              />
            </div>

            <div>
              <label htmlFor="niche" className="text-sm text-muted">
                Niche
              </label>
              <select
                id="niche"
                value={nicheId}
                onChange={(e) => setNicheId(e.target.value)}
                className="mt-2 w-full rounded-xl border border-line bg-bg px-4 py-3"
              >
                {estimatorConfig.niches.map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-2xl border border-line bg-bg p-6">
            {step === "input" ? (
              <>
                <div>
                  <p className="text-sm text-muted">Your estimate is ready</p>
                  {/* Placeholder digits, so the real figure isn't sitting in the page before the gate. */}
                  <p className="mt-3 font-mono text-4xl font-semibold tracking-tight blur-sm select-none" aria-hidden>
                    {mode === "budget" ? "00.0M to 00.0M" : "$00,000 to $00,000"}
                  </p>
                  <p className="mt-2 text-sm text-muted">Based on ranges from past campaigns.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setStep("gate")}
                  className="mt-8 rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-ink hover:opacity-90"
                >
                  Show my estimate
                </button>
              </>
            ) : (
              <form onSubmit={submit} className="space-y-4">
                <p className="text-sm text-muted">Where should we send it?</p>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="Work email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-line bg-bg-raised px-4 py-3"
                />
                <input
                  type="text"
                  required
                  autoComplete="organization"
                  placeholder="Company or artist name"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full rounded-xl border border-line bg-bg-raised px-4 py-3"
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
                  <input
                    type="checkbox"
                    checked={newsletter}
                    onChange={(e) => setNewsletter(e.target.checked)}
                    className="mt-1"
                  />
                  Send me campaign results and clipping insights every two weeks. Unsubscribe anytime.
                </label>
                {error && <p className="text-sm text-red-400">{error}</p>}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-ink hover:opacity-90 disabled:opacity-50"
                >
                  {submitting ? "Calculating" : "Show my estimate"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {step === "result" && (
        <div className="space-y-8">
          <div>
            <p className="text-sm text-muted">{result.niche.label}</p>
            <h2 className="mt-2 font-mono text-4xl font-semibold tracking-tight sm:text-5xl">
              {mode === "budget" ? formatRange(result.views, formatCompact) : formatRange(result.budgetUsd, formatUsd)}
            </h2>
            <p className="mt-1 text-muted">
              {mode === "budget" ? `estimated views for ${formatUsd(value)}` : `estimated budget for ${formatCompact(value)} views`}
            </p>
          </div>
          <dl className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-line p-5">
              <dt className="text-sm text-muted">CPM range</dt>
              <dd className="mt-1 font-mono text-xl">{formatRange(result.cpmUsd, formatUsd)}</dd>
            </div>
            <div className="rounded-2xl border border-line p-5">
              <dt className="text-sm text-muted">Estimated clips</dt>
              <dd className="mt-1 font-mono text-xl">{formatRange(result.clips, (n) => n.toLocaleString("en-US"))}</dd>
            </div>
            <div className="rounded-2xl border border-line p-5">
              <dt className="text-sm text-muted">Platforms</dt>
              <dd className="mt-1 text-sm">TikTok, Reels, Shorts, X</dd>
            </div>
          </dl>
          <p className="text-sm text-muted">Based on past campaign ranges, not a guarantee. A copy is on its way to {email}.</p>
          {!showBooking ? (
            <button
              type="button"
              onClick={() => setShowBooking(true)}
              className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-ink hover:opacity-90"
            >
              Book a 15-minute reach audit
            </button>
          ) : (
            <BookCall prefill={{ email, company, estimate: summary }} />
          )}
        </div>
      )}
    </div>
  );
}
