"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { facts } from "@/content/facts";
import { MARK_PATH, MARK_VIEWBOX } from "./brand";
import { ShinyButton } from "./ui/shiny-button";

// Homepage: a quick fit check. Visitors switch on what is true for them, the ring fills, and the
// verdict and next step change with it. The deal breakers sit underneath as plain chips. Every
// line is in the server HTML, so crawlers read it like a normal list.

const CRITERIA = [
  { id: "content", label: "I have video worth clipping", hint: "Podcasts, fights, music, streams or interviews. Or a logo or product to put on clips that already get views." },
  { id: "scale", label: "I want millions of views, not one viral post", hint: "Reach across TikTok, Reels, Shorts and X at the same time." },
  { id: "performance", label: "I would rather pay per verified view", hint: "No flat fees per post. Clippers only earn when their clips get real views." },
  { id: "budget", label: `I can put ${facts.minimumBudgetLabel} or more into it`, hint: "The minimum for clippers to pick a campaign up and for us to learn what works." },
  { id: "rights", label: "I own the content, or can let others repost it", hint: "Clips go out on our clippers' own pages." },
];

const DEAL_BREAKERS = [
  `Budget under ${facts.minimumBudgetLabel}`,
  "You need guaranteed sales",
  "Views must land on your own account",
  "No rights to the content",
  "You want one polished ad, not volume",
];

const VERDICTS = [
  { title: "Tick what is true for you", body: "Five quick checks. It takes ten seconds." },
  { title: "Not a fit yet", body: "Clipping works best when most of these are true. See what a campaign could do anyway." },
  { title: "Not a fit yet", body: "Clipping works best when most of these are true. See what a campaign could do anyway." },
  { title: "Close. Worth a call.", body: "A few things to sort out, and we can tell you in 15 minutes if it works." },
  { title: "Almost there", body: "One thing left to check. Book a call and we will go through it with you." },
  { title: "You are a fit", body: "Everything lines up. Book a 15-minute reach audit and we will plan the campaign." },
];

export function FitCheck() {
  const [on, setOn] = useState<Record<string, boolean>>({});
  const reduced = useReducedMotion();
  const score = CRITERIA.filter((c) => on[c.id]).length;
  const verdict = VERDICTS[score];
  const R = 54;
  const C = 2 * Math.PI * R;

  return (
    <section id="is-novaeyes-a-fit" className="mx-auto max-w-6xl px-6 pb-24 sm:px-10 lg:px-12">
      <p className="font-label text-[10px] tracking-[0.14em] text-muted uppercase">Fit check</p>
      <h2 className="mt-4 max-w-3xl text-3xl tracking-tight text-balance sm:text-4xl">
        Is NovaEyes a fit? <span className="text-muted">Find out in ten seconds.</span>
      </h2>

      <div className="mt-10 grid gap-4 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        {/* the checks */}
        <ul className="space-y-3">
          {CRITERIA.map((c) => {
            const checked = !!on[c.id];
            return (
              <li key={c.id}>
                <button
                  type="button"
                  role="switch"
                  aria-checked={checked}
                  onClick={() => setOn((s) => ({ ...s, [c.id]: !s[c.id] }))}
                  className={`group flex w-full cursor-pointer items-center gap-5 rounded-2xl border p-5 text-left transition-[border-color,background-color,box-shadow] duration-300 sm:p-6 ${
                    checked ? "border-accent/50 bg-accent/[0.06] shadow-[0_0_40px_rgb(var(--glow)/0.08)]" : "border-line bg-bg-raised/30 hover:border-muted/40"
                  }`}
                >
                  <span className="min-w-0 flex-1">
                    <span className={`block font-display font-semibold transition-colors ${checked ? "text-fg" : "text-fg/85"}`}>{c.label}</span>
                    <span className="mt-1 block text-sm leading-relaxed text-muted">{c.hint}</span>
                  </span>
                  {/* switch */}
                  <span className={`relative h-7 w-12 shrink-0 rounded-full border transition-colors duration-300 ${checked ? "border-accent bg-accent" : "border-line bg-bg"}`}>
                    <span
                      className={`absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-fg shadow transition-[left] duration-300 ${checked ? "left-[calc(100%-1.4rem)]" : "left-[3px]"}`}
                    />
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        {/* the verdict */}
        <div className="relative overflow-hidden rounded-2xl border border-line bg-bg-raised/40 p-7 lg:sticky lg:top-28 lg:self-start sm:p-8">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(var(--glow)/0.35),transparent)] transition-opacity duration-500"
            style={{ opacity: 0.25 + (score / CRITERIA.length) * 0.75 }}
          />
          <div className="relative mx-auto h-40 w-40">
            <svg viewBox="0 0 140 140" className="h-full w-full -rotate-90" aria-hidden>
              <circle cx="70" cy="70" r={R} fill="none" stroke="var(--line)" strokeWidth="6" />
              <circle
                cx="70"
                cy="70"
                r={R}
                fill="none"
                stroke="var(--accent)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={C}
                strokeDashoffset={C * (1 - score / CRITERIA.length)}
                style={{ transition: reduced ? "none" : "stroke-dashoffset 0.6s cubic-bezier(0.16,1,0.3,1)", filter: score ? "drop-shadow(0 0 6px rgb(59 130 246 / 0.8))" : "none" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <svg viewBox={MARK_VIEWBOX} className={`h-3 w-auto transition-opacity duration-300 ${score === CRITERIA.length ? "opacity-100" : "opacity-40"}`} aria-hidden>
                <path fillRule="evenodd" d={MARK_PATH} fill="var(--fg)" />
              </svg>
              <p className="mt-2 font-display text-3xl font-bold tabular-nums" aria-live="polite">
                {score}
                <span className="text-lg text-muted">/{CRITERIA.length}</span>
              </p>
            </div>
          </div>

          <div className="relative mt-6 min-h-36 text-center">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={verdict.title + score}
                initial={reduced ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                <p className="text-xl font-semibold tracking-tight">{verdict.title}</p>
                <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-muted">{verdict.body}</p>
              </motion.div>
            </AnimatePresence>
            <div className="mt-6 flex justify-center">
              {score >= 3 ? (
                <ShinyButton href="/book" className="px-6 py-3 text-sm">
                  Book a 15-minute reach audit
                </ShinyButton>
              ) : (
                <Link href="/reach-estimator" className="font-display text-sm font-semibold text-accent transition-colors hover:text-fg">
                  Estimate your reach →
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* deal breakers */}
      <div className="mt-8 flex flex-wrap items-center gap-2.5">
        <span className="mr-2 font-label text-[10px] tracking-[0.14em] text-muted uppercase">Not a fit if</span>
        {DEAL_BREAKERS.map((d) => (
          <span key={d} className="inline-flex items-center gap-2 rounded-xl border border-line bg-bg-raised/30 px-3.5 py-2 text-sm text-muted">
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 text-muted/70" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
              <path d="m4.5 4.5 7 7m0-7-7 7" />
            </svg>
            {d}
          </span>
        ))}
      </div>
    </section>
  );
}
