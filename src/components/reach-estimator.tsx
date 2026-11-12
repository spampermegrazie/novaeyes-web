"use client";

// Reach estimator as a short process: 1 start from budget or views, 2 set the
// amount, 3 pick the niche, 4 leave an email and see the estimate.
// Desktop: the steps on the left, and on the right a mini engine plus a summary
// that fills in as you go. The estimate is not in the page until the email is in;
// after that the numbers follow any change live.

import { useEffect, useState } from "react";
import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { siInstagram, siTiktok, siX, siYoutubeshorts } from "simple-icons";
import { estimatorConfig } from "@/content/estimator-config";
import { estimate, formatCompact, formatRange, formatUsd } from "@/lib/estimator";
import { BUDGET_SCALE, VIEWS_SCALE, parseAmount, positionOf, stepFrom, valueAt } from "@/lib/scale";
import { getAttribution } from "@/lib/attribution";
import { MARK_PATH, MARK_VIEWBOX } from "./brand";
import { BookCall } from "./book-call";
import { CountUp } from "./ui/count-up";

type Mode = "budget" | "views";
const STEP_NAMES = ["Start", "Amount", "Niche", "Estimate"];
const DEFAULTS = { budget: 10_000, views: 10_000_000 };
const PLATFORM_ICONS = [
  { name: "TikTok", path: siTiktok.path },
  { name: "Instagram Reels", path: siInstagram.path },
  { name: "YouTube Shorts", path: siYoutubeshorts.path },
  { name: "X", path: siX.path },
];

const fmt = (mode: Mode, n: number) => (mode === "budget" ? formatUsd(n) : formatCompact(n));

export function ReachEstimator() {
  const reduced = useReducedMotion() ?? false;
  const [stage, setStage] = useState(0);
  const [mode, setMode] = useState<Mode | null>(null);
  const [value, setValue] = useState(DEFAULTS.budget);
  const [nicheId, setNicheId] = useState<string | null>(null);
  const [unlocked, setUnlocked] = useState(false);
  const [revealedFor, setRevealedFor] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [newsletter, setNewsletter] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showBooking, setShowBooking] = useState(false);

  const m: Mode = mode ?? "budget";
  const niche = estimatorConfig.niches.find((n) => n.id === nicheId) ?? null;
  const result = niche
    ? m === "budget"
      ? estimate({ mode: m, budgetUsd: value, nicheId: niche.id })
      : estimate({ mode: m, targetViews: value, nicheId: niche.id })
    : null;
  const headline = result ? (m === "budget" ? formatRange(result.views, formatCompact) : formatRange(result.budgetUsd, formatUsd)) : "";
  const summary = result
    ? m === "budget"
      ? `${formatUsd(value)} budget, ${result.niche.label}: ${headline} views`
      : `${formatCompact(value)} views, ${result.niche.label}: ${headline}`
    : "";

  const go = (s: number) => setStage(Math.max(0, Math.min(3, s)));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!niche) return;
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
          input: m === "budget" ? { mode: m, budgetUsd: value, nicheId: niche.id } : { mode: m, targetViews: value, nicheId: niche.id },
          attribution: getAttribution(),
        }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error ?? "Something went wrong. Try again.");
      }
      setRevealedFor(summary);
      setUnlocked(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const slide = reduced
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.15 } }
    : {
        initial: { opacity: 0, x: 28, filter: "blur(6px)" },
        animate: { opacity: 1, x: 0, filter: "blur(0px)" },
        exit: { opacity: 0, x: -28, filter: "blur(6px)" },
        transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const },
      };

  return (
    <div className="grid gap-16 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:gap-20">
      <div>
        <Progress stage={stage} reached={unlocked ? 3 : furthest(mode, nicheId)} onJump={go} />

        <div className="relative mt-12 min-h-[440px]">
          <AnimatePresence mode="wait" initial={false}>
            {stage === 0 && (
              <motion.div key="start" {...slide}>
                <StepHead n={1} title="What are you starting from?" hint="Pick the number you already have in mind." />
                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  {(["budget", "views"] as const).map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => {
                        if (opt !== mode) setValue(DEFAULTS[opt]);
                        setMode(opt);
                        go(1);
                      }}
                      className={`rounded-2xl border p-6 text-left transition-all ${
                        mode === opt ? "border-accent/70 shadow-[0_0_28px_rgb(var(--glow)/0.3)]" : "border-line hover:border-muted/50"
                      }`}
                    >
                      <p className="font-label text-[9px] tracking-[0.14em] text-accent uppercase">{opt === "budget" ? "Budget" : "Views"}</p>
                      <p className="mt-3 font-display text-xl font-semibold">{opt === "budget" ? "I have a budget" : "I have a view target"}</p>
                      <p className="mt-2 text-sm leading-relaxed text-muted">
                        {opt === "budget" ? "See how many views it can turn into." : "See what budget it takes to get there."}
                      </p>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {stage === 1 && (
              <motion.div key="amount" {...slide}>
                <StepHead
                  n={2}
                  title={m === "budget" ? "What is your budget?" : "How many views do you want?"}
                  hint="Drag the slider or type an exact number."
                />
                <AmountPicker key={m} mode={m} value={value} onChange={setValue} reduced={reduced} />
                <Nav onBack={() => go(0)} onNext={() => go(2)} />
              </motion.div>
            )}

            {stage === 2 && (
              <motion.div key="niche" {...slide}>
                <StepHead n={3} title="What are you promoting?" hint="Costs per view differ by niche, so this shapes the estimate." />
                <div role="radiogroup" aria-label="Niche" className="mt-8 grid gap-2 sm:grid-cols-2">
                  {estimatorConfig.niches.map((n) => {
                    const on = n.id === nicheId;
                    return (
                      <button
                        key={n.id}
                        type="button"
                        role="radio"
                        aria-checked={on}
                        onClick={() => {
                          setNicheId(n.id);
                          window.setTimeout(() => go(3), reduced ? 0 : 280);
                        }}
                        className={`flex items-center justify-between rounded-xl border px-5 py-4 text-left font-display font-semibold transition-all ${
                          on ? "border-accent/70 text-fg shadow-[0_0_22px_rgb(var(--glow)/0.3)]" : "border-line text-muted hover:border-muted/50 hover:text-fg"
                        }`}
                      >
                        {n.label}
                        <span aria-hidden className={`h-2 w-2 rounded-full transition-colors ${on ? "bg-accent shadow-[0_0_8px_rgb(var(--glow))]" : "bg-line"}`} />
                      </button>
                    );
                  })}
                </div>
                <Nav onBack={() => go(1)} onNext={nicheId ? () => go(3) : undefined} />
              </motion.div>
            )}

            {stage === 3 && (
              <motion.div key="estimate" {...slide}>
                {!unlocked ? (
                  <>
                    <StepHead n={4} title="Where should we send it?" hint="Your estimate is ready. We show it here and email you a copy." />
                    <form onSubmit={submit} className="mt-8 max-w-md space-y-5">
                      <input
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
                      <div className="flex items-center gap-6 pt-2">
                        <button type="button" onClick={() => go(2)} className="font-display text-sm font-semibold text-muted hover:text-fg">
                          ← Back
                        </button>
                        <button
                          type="submit"
                          disabled={submitting}
                          className="rounded-full bg-accent px-6 py-3 font-display text-sm font-semibold text-accent-ink shadow-[0_0_32px_rgb(var(--glow)/0.35)] hover:opacity-90 disabled:opacity-50"
                        >
                          {submitting ? "Calculating" : "Show my estimate"}
                        </button>
                      </div>
                    </form>
                  </>
                ) : (
                  result && (
                    <>
                      <p className="font-label text-[10px] tracking-[0.14em] text-accent uppercase">
                        {m === "budget" ? "Estimated views" : "Estimated budget"} · {result.niche.label}
                      </p>
                      <p className="mt-4 font-display text-5xl leading-none font-bold tracking-tight tabular-nums sm:text-7xl">
                        {revealedFor === summary ? <CountUpRange text={headline} /> : headline}
                      </p>
                      <p className="mt-3 text-muted">{m === "budget" ? `for a ${formatUsd(value)} budget` : `to reach ${formatCompact(value)} views`}</p>
                      <dl className="mt-10 grid grid-cols-3 border-y border-line py-6">
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
                      <p className="mt-4 text-sm leading-relaxed text-muted">Based on past campaign ranges, not a guarantee. A copy is on its way to {email}.</p>
                      <div className="mt-8 flex flex-wrap items-center gap-6">
                        {!showBooking && (
                          <button
                            type="button"
                            onClick={() => setShowBooking(true)}
                            className="rounded-full bg-accent px-6 py-3 font-display text-sm font-semibold text-accent-ink shadow-[0_0_32px_rgb(var(--glow)/0.35)] hover:opacity-90"
                          >
                            Book a 15-minute reach audit
                          </button>
                        )}
                        <button type="button" onClick={() => go(1)} className="font-display text-sm font-semibold text-muted hover:text-fg">
                          Try other numbers
                        </button>
                      </div>
                      {showBooking && (
                        <div className="mt-8">
                          <BookCall prefill={{ email, company, estimate: summary }} />
                        </div>
                      )}
                    </>
                  )
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Right: the engine and what you picked so far */}
      <aside aria-label="Your campaign" className="relative isolate hidden lg:block">
        <div
          aria-hidden
          className="pointer-events-none absolute top-[22%] left-1/2 -z-10 aspect-square w-[115%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(59_130_246/0.16),rgb(59_130_246/0.05)_45%,transparent)]"
        />
        <MiniEngine mode={m} value={mode ? value : null} result={unlocked ? headline : null} />
        <dl className="mt-12 divide-y divide-line border-y border-line">
          <SummaryRow label="Starting from" value={mode ? (mode === "budget" ? "A budget" : "A view target") : null} />
          <SummaryRow label={m === "budget" ? "Budget" : "Target views"} value={mode ? (m === "budget" ? formatUsd(value) : `${formatCompact(value)} views`) : null} />
          <SummaryRow label="Niche" value={niche?.label ?? null} />
          <SummaryRow label={m === "budget" ? "Estimated views" : "Estimated budget"} value={unlocked ? headline : null} locked={!unlocked && !!niche} />
        </dl>
      </aside>
    </div>
  );
}

// Furthest step someone can jump to from the progress bar.
function furthest(mode: Mode | null, nicheId: string | null) {
  if (!mode) return 0;
  if (!nicheId) return 2;
  return 3;
}

function Progress({ stage, reached, onJump }: { stage: number; reached: number; onJump: (s: number) => void }) {
  return (
    <div>
      <p className="flex items-baseline gap-3 font-label">
        <span className="text-3xl text-accent">0{stage + 1}</span>
        <span className="text-xs text-muted">/ 04</span>
      </p>
      <ol className="mt-5 grid grid-cols-4 gap-2">
        {STEP_NAMES.map((name, i) => (
          <li key={name}>
            <button
              type="button"
              disabled={i > reached}
              onClick={() => onJump(i)}
              aria-current={i === stage ? "step" : undefined}
              className="group w-full text-left disabled:cursor-default"
            >
              <span className="block h-0.5 overflow-hidden rounded-full bg-line">
                <span
                  className={`block h-full origin-left bg-accent transition-transform duration-500 ease-out ${i <= stage ? "scale-x-100" : "scale-x-0"} ${
                    i === stage ? "shadow-[0_0_10px_rgb(var(--glow))]" : ""
                  }`}
                />
              </span>
              <span
                className={`mt-2 block font-label text-[9px] tracking-[0.12em] uppercase transition-colors ${
                  i === stage ? "text-fg" : i <= reached ? "text-muted group-hover:text-fg" : "text-muted/50"
                }`}
              >
                {name}
              </span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

function StepHead({ n, title, hint }: { n: number; title: string; hint: string }) {
  return (
    <div>
      <p className="sr-only">Step {n} of 4</p>
      <h2 className="text-3xl tracking-tight sm:text-4xl">{title}</h2>
      <p className="mt-3 text-muted">{hint}</p>
    </div>
  );
}

function Nav({ onBack, onNext }: { onBack: () => void; onNext?: () => void }) {
  return (
    <div className="mt-12 flex items-center gap-6">
      <button type="button" onClick={onBack} className="font-display text-sm font-semibold text-muted hover:text-fg">
        ← Back
      </button>
      {onNext && (
        <button
          type="button"
          onClick={onNext}
          className="rounded-full bg-accent px-6 py-3 font-display text-sm font-semibold text-accent-ink shadow-[0_0_32px_rgb(var(--glow)/0.35)] hover:opacity-90"
        >
          Continue
        </button>
      )}
    </div>
  );
}

function SummaryRow({ label, value, locked = false }: { label: string; value: string | null; locked?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-6 py-4">
      <dt className="font-label text-[9px] tracking-[0.12em] text-muted uppercase">{label}</dt>
      <dd className="text-right font-display font-semibold tabular-nums">
        {value ? (
          <span className="flex items-center gap-2">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_8px_rgb(var(--glow))]" />
            {value}
          </span>
        ) : locked ? (
          <span className="text-muted">Locked</span>
        ) : (
          <span className="text-muted/50">Not set</span>
        )}
      </dd>
    </div>
  );
}

// Slider plus typed input. The slider moves continuously; the value snaps to the
// scale's steps and the big number glides to it through a spring.
function AmountPicker({ mode, value, onChange, reduced }: { mode: Mode; value: number; onChange: (v: number) => void; reduced: boolean }) {
  const scale = mode === "budget" ? BUDGET_SCALE : VIEWS_SCALE;
  const [pos, setPos] = useState(() => positionOf(scale, value));
  const [typed, setTyped] = useState("");
  const [note, setNote] = useState<string | null>(null);

  const target = useMotionValue(value);
  const spring = useSpring(target, { stiffness: 260, damping: 32, mass: 0.6 });
  const text = useTransform(spring, (v) => fmt(mode, Math.round(v)));
  useEffect(() => {
    if (reduced) {
      target.jump(value);
      spring.jump(value);
    } else target.set(value);
  }, [value, reduced, target, spring]);

  // Glide the thumb onto the exact spot of a value.
  const snapThumb = (v: number) => {
    const to = positionOf(scale, v);
    if (reduced) setPos(to);
    else animate(pos, to, { duration: 0.25, ease: [0.16, 1, 0.3, 1], onUpdate: setPos });
  };

  const commitTyped = () => {
    if (!typed.trim()) return;
    const n = parseAmount(typed);
    if (n === null) {
      setNote(mode === "budget" ? "Try a number like 15000 or 15k." : "Try a number like 25000000 or 25m.");
      return;
    }
    const clamped = Math.min(scale.max, Math.max(scale.min, n));
    const unit = mode === "views" ? " views" : "";
    setNote(
      n < scale.min
        ? `Campaigns start at ${fmt(mode, scale.min)}${unit}.`
        : n > scale.max
          ? `The estimator goes up to ${fmt(mode, scale.max)}${unit}. Book a call for more.`
          : null,
    );
    onChange(clamped);
    snapThumb(clamped);
    setTyped("");
  };

  return (
    <div className="mt-10">
      <label htmlFor="amount" className="font-label text-[10px] tracking-[0.14em] text-muted uppercase">
        {mode === "budget" ? "Campaign budget" : "Target views"}
      </label>
      <motion.p aria-live="polite" className="mt-3 font-display text-6xl leading-none font-bold tracking-tight tabular-nums sm:text-7xl">
        {text}
      </motion.p>

      <input
        id="amount"
        type="range"
        min={0}
        max={1000}
        step={1}
        value={Math.round(pos * 1000)}
        aria-valuetext={mode === "budget" ? formatUsd(value) : `${formatCompact(value)} views`}
        onPointerUp={() => snapThumb(value)}
        onChange={(e) => {
          const p = Number(e.target.value) / 1000;
          setPos(p);
          setNote(null);
          const v = valueAt(scale, p);
          if (v !== value) onChange(v);
        }}
        onKeyDown={(e) => {
          const dir = e.key === "ArrowRight" || e.key === "ArrowUp" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowDown" ? -1 : 0;
          if (!dir) return;
          e.preventDefault();
          const v = stepFrom(scale, value, dir);
          onChange(v);
          snapThumb(v);
        }}
        className="ne-range mt-8 w-full"
        style={{ "--fill": `${pos * 100}%` } as React.CSSProperties}
      />
      <div aria-hidden className="mt-2 flex justify-between font-label text-[9px] tracking-[0.1em] text-muted uppercase">
        <span>{fmt(mode, scale.min)}</span>
        <span>{fmt(mode, scale.max)}</span>
      </div>

      <div className="mt-8 flex max-w-sm items-center gap-3 border-b border-line focus-within:border-accent">
        <span aria-hidden className="font-display text-muted">
          {mode === "budget" ? "$" : "#"}
        </span>
        <input
          type="text"
          inputMode="decimal"
          placeholder={mode === "budget" ? "Or type an amount, e.g. 18,000" : "Or type views, e.g. 30m"}
          value={typed}
          onChange={(e) => setTyped(e.target.value)}
          onBlur={commitTyped}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              commitTyped();
            }
          }}
          aria-label={mode === "budget" ? "Type a budget" : "Type a view target"}
          className="w-full bg-transparent py-3 outline-none placeholder:text-muted/70"
        />
      </div>
      {note && <p className="mt-3 text-sm text-muted">{note}</p>}
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

// Budget in, NovaEyes in the middle, views out. The bigger the amount, the more and
// faster the packets. Negative begin times start every packet mid-path.
function MiniEngine({ mode, value, result }: { mode: Mode; value: number | null; result: string | null }) {
  const scale = mode === "budget" ? BUDGET_SCALE : VIEWS_SCALE;
  const level = value === null ? 0 : Math.round(positionOf(scale, value) * 7);
  const count = 3 + level;
  const speed = 2.4 - level * 0.18;
  const left = "M150,60 C190,60 200,60 236,60";
  const right = "M324,60 C360,60 370,60 410,60";
  const known = value === null ? "• • •" : fmt(mode, value);
  return (
    <svg viewBox="0 0 560 120" className="h-auto w-full overflow-visible" role="img" aria-label="Your budget runs through NovaEyes and comes out as views">
      <path d={left} className="ne-flow ne-flow-on" />
      <path d={right} className="ne-flow ne-flow-on" />
      {value !== null &&
        Array.from({ length: count }).flatMap((_, i) => [
          <circle key={`a-${level}-${i}`} r="2.4" className="ne-pkt">
            <animateMotion dur={`${speed}s`} begin={`-${(i * speed) / count}s`} repeatCount="indefinite" path={left} />
          </circle>,
          <circle key={`b-${level}-${i}`} r="2.4" className="ne-pkt">
            <animateMotion dur={`${speed}s`} begin={`-${(i * speed) / count + speed / 2}s`} repeatCount="indefinite" path={right} />
          </circle>,
        ])}
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
