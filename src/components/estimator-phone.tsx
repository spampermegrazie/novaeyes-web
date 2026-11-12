"use client";

import { motion } from "motion/react";
import { MARK_PATH, MARK_VIEWBOX, Wordmark } from "./brand";
import { formatCompact, formatRange, formatUsd, type Estimate } from "@/lib/estimator";
import { BUDGET_SCALE, VIEWS_SCALE, positionOf } from "@/lib/scale";

// The reach estimator's side panel: a phone playing a short clip, with the estimate on it the way
// a view count sits on a real post. While the estimate is still locked the number spins like a
// slot machine (faster for bigger amounts); once it unlocks it lands on the range. The clip
// follows your niche, and the handle follows the name typed in the form.

type Mode = "budget" | "views";
type Props = {
  mode: Mode | null;
  value: number;
  nicheId: string | null;
  estimate: Estimate | null;
  unlocked: boolean;
  company: string;
  reduced: boolean;
};

type Scene = { caption: string; icon: React.ReactNode; glow: string };
const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 1.4, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
const SCENES: Record<string, Scene> = {
  none: {
    caption: "your clip, posted by thousands of pages",
    icon: <path d="M8 5.5v13l11-6.5-11-6.5Z" {...stroke} />,
    glow: "50% 38%",
  },
  logo: {
    caption: "wait for the logo at the end",
    icon: (
      <g>
        <rect x="2.5" y="7" width="19" height="10" rx="2.5" {...stroke} strokeDasharray="2 1.6" />
        <text x="12" y="13.6" textAnchor="middle" fontSize="4.2" fontWeight="700" letterSpacing="0.6" fill="currentColor">
          LOGO
        </text>
      </g>
    ),
    glow: "50% 34%",
  },
  sports: {
    caption: "the knockout everyone is talking about",
    icon: <path d="M13 2 4 14h8l-1 8 9-12h-8l1-8Z" {...stroke} />,
    glow: "40% 36%",
  },
  podcast: {
    caption: "he really said this on the pod",
    icon: (
      <g {...stroke}>
        <rect x="9" y="2.5" width="6" height="11.5" rx="3" />
        <path d="M5.5 10.5a6.5 6.5 0 0 0 13 0 M12 17v4.5 M8.5 21.5h7" />
      </g>
    ),
    glow: "58% 36%",
  },
  music: {
    caption: "this song has been stuck in my head all week",
    icon: (
      <g {...stroke}>
        <path d="M9 18V5.5l11-2V16" />
        <circle cx="6.5" cy="18" r="2.5" />
        <circle cx="17.5" cy="16" r="2.5" />
      </g>
    ),
    glow: "46% 32%",
  },
  creator: {
    caption: "a day in my life running the brand",
    icon: (
      <g {...stroke}>
        <rect x="2.5" y="6" width="13.5" height="12" rx="2.5" />
        <path d="m16 10.5 5.5-3v9l-5.5-3" />
      </g>
    ),
    glow: "54% 38%",
  },
  product: {
    caption: "i did not expect this to actually work",
    icon: (
      <g {...stroke}>
        <path d="M5.5 8h13l-1 13h-11l-1-13Z" />
        <path d="M9 8V6a3 3 0 0 1 6 0v2" />
      </g>
    ),
    glow: "50% 40%",
  },
};

const handleOf = (company: string) => {
  const slug = company.toLowerCase().replace(/[^a-z0-9]+/g, "").slice(0, 18);
  return `@${slug || "yourbrand"}`;
};

export function EstimatorPhone({ mode, value, nicheId, estimate, unlocked, company, reduced }: Props) {
  const scene = SCENES[nicheId ?? "none"] ?? SCENES.none;
  const level = mode ? positionOf(mode === "budget" ? BUDGET_SCALE : VIEWS_SCALE, value) : 0;
  const final = unlocked && estimate ? (mode === "views" ? formatRange(estimate.budgetUsd, formatUsd) : formatRange(estimate.views, formatCompact)) : null;
  const heading = mode === null ? "Your estimate" : mode === "budget" ? "Estimated views" : "Estimated budget";
  const basis = mode === null ? "pick a starting point" : mode === "budget" ? `from a ${formatUsd(value)} budget` : `for ${formatCompact(value)} views`;

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6">
      <div className="relative aspect-[9/19] h-[min(540px,66vh)]">
        {/* bezel */}
        <div className="absolute inset-0 rounded-[42px] border border-white/10 bg-[#07080c] p-[7px] shadow-[0_30px_80px_rgb(0_0_0/0.6),0_0_60px_rgb(var(--glow)/0.18)]">
          <div className="relative h-full w-full overflow-hidden rounded-[35px] bg-[linear-gradient(160deg,#1b1b24_0%,#0d0d12_58%,#101a2e_100%)]">
            {/* the clip */}
            <motion.div
              key={nicheId ?? "none"}
              initial={reduced ? false : { opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
              style={{ background: `radial-gradient(circle at ${scene.glow}, rgb(59 130 246 / 0.32), transparent 55%)` }}
            >
              <svg viewBox="0 0 24 24" className="absolute top-[30%] left-1/2 w-[38%] -translate-x-1/2 -translate-y-1/2 text-white/25" aria-hidden>
                {scene.icon}
              </svg>
            </motion.div>
            {!reduced && <div className="clip-sheen absolute inset-0" />}

            {/* status bar and feed tabs */}
            <div className="absolute top-2.5 left-1/2 h-5 w-[34%] -translate-x-1/2 rounded-full bg-black" />
            <p className="absolute inset-x-0 top-10 text-center text-[10px] font-semibold text-white/55">
              Following <span className="mx-1.5 text-white">For You</span>
            </p>

            {/* right rail */}
            <div className="absolute right-2.5 bottom-[30%] flex flex-col items-center gap-4 text-white/85">
              <span className="relative mb-1 flex h-8 w-8 items-center justify-center rounded-full border border-white/70 bg-[#171822]">
                <svg viewBox={MARK_VIEWBOX} className="w-5" aria-hidden>
                  <path fillRule="evenodd" d={MARK_PATH} fill="currentColor" />
                </svg>
                <span className="absolute -bottom-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-accent text-[9px] leading-none font-bold text-white">+</span>
              </span>
              <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
                <path d="M12 20.5s-7.5-4.6-7.5-10.1A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.5 2.8c0 5.5-7.5 10.1-7.5 10.1Z" fill="currentColor" />
              </svg>
              <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
                <path d="M12 4c4.7 0 8.5 3.1 8.5 7s-3.8 7-8.5 7c-1 0-2-.1-2.9-.4L4.5 20l1.2-3.6C4.3 15.1 3.5 13.1 3.5 11c0-3.9 3.8-7 8.5-7Z" fill="currentColor" />
              </svg>
              <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
                <path d="M13.5 5 21 11.5 13.5 18v-3.8C8.4 14.2 5.2 16 3 19.5c.7-5.3 3.9-9.6 10.5-10.6V5Z" fill="currentColor" />
              </svg>
            </div>

            {/* the estimate, where a post shows its views */}
            <div className="absolute inset-x-3 bottom-[25%] mr-12">
              <div className="rounded-2xl border border-white/10 bg-black/45 px-3.5 py-3 backdrop-blur-md">
                <p className="font-label text-[7px] tracking-[0.14em] text-white/60 uppercase">{heading}</p>
                <div className="mt-1.5 h-7 font-display text-[22px] leading-7 font-bold tracking-tight text-white tabular-nums">
                  {final ? (
                    <motion.span
                      key={final}
                      initial={reduced ? false : { opacity: 0, y: 10, filter: "blur(6px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      className="block whitespace-nowrap"
                      style={{ fontSize: final.length > 16 ? 15 : final.length > 11 ? 18 : undefined }}
                    >
                      {final}
                    </motion.span>
                  ) : mode === null ? (
                    <span className="text-white/40">• • •</span>
                  ) : reduced ? (
                    <span className="text-white/60">Estimating</span>
                  ) : (
                    <Reels prefix={mode === "views" ? "$" : ""} digits={mode === "views" ? 5 : 7} speed={0.7 + level * 1.3} />
                  )}
                </div>
                <p className="mt-1 text-[10px] text-white/55">{final || mode === null ? basis : `estimating, ${basis}`}</p>
              </div>
            </div>

            {/* handle, caption and playback, like a post */}
            <div className="absolute inset-x-3 bottom-5 mr-10 text-white">
              <p className="text-[11px] font-semibold">{handleOf(company)}</p>
              <p className="mt-1 text-[11px] leading-snug text-white/85">{scene.caption}</p>
            </div>
            <span className="absolute right-3 bottom-[18px] text-white/40">
              <Wordmark className="h-[5px] w-auto" />
            </span>
            <div className="absolute inset-x-3 bottom-2.5 h-0.5 overflow-hidden rounded-full bg-white/15">
              <div className="clip-progress h-full bg-white/70" style={{ animationDuration: "7s" }} />
            </div>
          </div>
        </div>
      </div>
      <p className="font-label text-[9px] tracking-[0.14em] text-muted uppercase">
        Based on past campaign ranges, not a guarantee
      </p>
    </div>
  );
}

// Digits spinning like a slot machine while the estimate is being worked out.
function Reels({ prefix, digits, speed }: { prefix: string; digits: number; speed: number }) {
  const columns = Array.from({ length: digits }, (_, i) => i);
  const comma = (i: number) => (digits - i) % 3 === 0 && i !== 0;
  return (
    <span className="inline-flex h-7 items-start overflow-hidden text-white/80 [mask-image:linear-gradient(transparent,#000_30%,#000_70%,transparent)]" aria-hidden>
      {prefix}
      {columns.map((i) => (
        <span key={i} className="inline-flex">
          {comma(i) && <span>,</span>}
          <span className="est-reel flex flex-col" style={{ animationDuration: `${(0.5 + ((i * 7) % 5) * 0.12) / speed}s` }}>
            {[...Array(20)].map((_, d) => (
              <span key={d} className="block h-7">
                {(d + i * 3) % 10}
              </span>
            ))}
          </span>
        </span>
      ))}
    </span>
  );
}
