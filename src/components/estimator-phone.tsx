"use client";

import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "motion/react";
import { MARK_PATH, MARK_VIEWBOX } from "./brand";
import { formatCompact, formatRange, formatUsd, type Estimate } from "@/lib/estimator";
import { BUDGET_SCALE, VIEWS_SCALE, positionOf } from "@/lib/scale";

// The reach estimator's side panel: a phone playing a short clip. The clip's subject is your niche,
// and the text laid over it is the estimate, the way a hook sits on a real post: digits spinning
// like a slot machine while it is locked (faster for bigger amounts), then the range once it
// unlocks. The rail shows the likes, comments and shares a clip at that reach typically gets. The
// handle follows the company name typed in the form. The phone floats over a glow, and tilts
// toward the pointer like a 3D object. Once the estimate unlocks (stage "center") it swings into
// the middle of the page, bigger, turning in 3D on the way.

type Mode = "budget" | "views";
type Props = {
  mode: Mode | null;
  value: number;
  nicheId: string | null;
  estimate: Estimate | null;
  unlocked: boolean;
  company: string;
  reduced: boolean;
  stage: "side" | "center";
};


type Scene = { caption: string; icon: React.ReactNode };
const SCENES: Record<string, Scene> = {
  none: { caption: "your clip, posted by thousands of pages", icon: <path d="M7.5 4.6v14.8L19.8 12 7.5 4.6Z" /> },
  logo: {
    caption: "wait for the logo at the end",
    icon: (
      <>
        <rect x="2" y="6.5" width="20" height="11" rx="3" />
        <text x="12" y="13.7" textAnchor="middle" fontSize="4.4" fontWeight="800" letterSpacing="0.5" fill="#0d0d12">
          LOGO
        </text>
      </>
    ),
  },
  sports: { caption: "the knockout everyone is talking about", icon: <path d="M13.6 1.8 3.8 13.6h7.3l-1.3 8.6 10.4-12.4h-7.4l.8-8Z" /> },
  podcast: {
    caption: "he really said this on the pod",
    icon: (
      <>
        <rect x="8.5" y="2" width="7" height="12.5" rx="3.5" />
        <path d="M5 10.5a7 7 0 0 0 14 0h-1.8a5.2 5.2 0 0 1-10.4 0H5Zm6.1 8.3v2.4H8.3v1.6h7.4v-1.6h-2.8v-2.4h-1.8Z" />
      </>
    ),
  },
  music: {
    caption: "this song has been stuck in my head all week",
    icon: (
      <>
        <path d="M8.4 5.6 20.6 3v3.1L10.2 8.4v9H8.4V5.6Z M18.8 6.5h1.8v9h-1.8z" />
        <ellipse cx="6.7" cy="17.4" rx="3.3" ry="2.6" transform="rotate(-22 6.7 17.4)" />
        <ellipse cx="17.1" cy="15.4" rx="3.3" ry="2.6" transform="rotate(-22 17.1 15.4)" />
      </>
    ),
  },
  creator: {
    caption: "a day in my life running the brand",
    icon: (
      <>
        <rect x="2" y="6" width="14" height="12" rx="3" />
        <path d="m16.8 10.4 5.2-3v9.2l-5.2-3v-3.2Z" />
      </>
    ),
  },
  product: {
    caption: "i did not expect this to actually work",
    icon: <path d="M9 7V6a3 3 0 0 1 6 0v1h3.6l1 15H4.4l1-15H9Zm1.6 0h2.8V6a1.4 1.4 0 0 0-2.8 0v1Z" />,
  },
};

const handleOf = (company: string) => `@${company.toLowerCase().replace(/[^a-z0-9]+/g, "").slice(0, 18) || "yourbrand"}`;

export function EstimatorPhone({ mode, value, nicheId, estimate, unlocked, company, reduced, stage }: Props) {
  const center = stage === "center";
  const scene = SCENES[nicheId ?? "none"] ?? SCENES.none;
  const level = mode ? positionOf(mode === "budget" ? BUDGET_SCALE : VIEWS_SCALE, value) : 0;
  const final = unlocked && estimate ? (mode === "views" ? formatRange(estimate.budgetUsd, formatUsd) : formatRange(estimate.views, formatCompact)) : null;
  const heading = mode === null ? "Your estimate" : mode === "budget" ? "Estimated views" : "Estimated budget";
  const basis = mode === null ? "pick a starting point" : mode === "budget" ? `from a ${formatUsd(value)} budget` : `for ${formatCompact(value)} views`;
  // likes, comments and shares come with the full report, so the rail only spins
  const count = (seed: number) =>
    reduced || mode === null ? <span className="text-white/60">•••</span> : <Reels prefix="" digits={3} speed={0.9 + seed * 0.25} size="sm" />;

  // tilt toward the pointer
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const spring = { stiffness: 140, damping: 16, mass: 0.6 };
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-10, 10]), spring);
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [8, -8]), spring);
  const glareX = useTransform(px, [-0.5, 0.5], [15, 85]);
  const glareY = useTransform(py, [-0.5, 0.5], [10, 70]);
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgb(255 255 255 / 0.1), transparent 45%)`;

  return (
    <div className={`flex items-center justify-center [perspective:1400px] ${center ? "w-full pt-4" : "flex-1"}`}>
      <motion.div
        layout={!reduced}
        animate={center && !reduced ? { rotateY: [-34, 14, 0], rotateX: [12, -3, 0] } : { rotateY: 0, rotateX: 0 }}
        transition={{
          layout: { duration: 1.05, ease: [0.16, 1, 0.3, 1] },
          rotateY: { duration: 1.3, ease: [0.22, 1, 0.36, 1], times: [0, 0.55, 1] },
          rotateX: { duration: 1.3, ease: [0.22, 1, 0.36, 1], times: [0, 0.55, 1] },
        }}
        className="relative [perspective:1200px]"
        onPointerMove={(e) => {
          if (reduced || e.pointerType !== "mouse") return;
          const r = e.currentTarget.getBoundingClientRect();
          px.set((e.clientX - r.left) / r.width - 0.5);
          py.set((e.clientY - r.top) / r.height - 0.5);
        }}
        onPointerLeave={() => {
          px.set(0);
          py.set(0);
        }}
      >
        {/* light behind it and a soft shadow under it, so it floats in the page */}
        <div aria-hidden className="pointer-events-none absolute -inset-x-28 -inset-y-20 -z-10 rounded-full bg-[radial-gradient(closest-side,rgb(var(--glow)/0.42),rgb(var(--glow)/0.12)_50%,transparent)] blur-2xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-9 left-1/2 -z-10 h-12 w-[85%] -translate-x-1/2 rounded-[100%] bg-[radial-gradient(closest-side,rgb(0_0_0/0.85),rgb(var(--glow)/0.12)_70%,transparent)] blur-lg" />

        <motion.div
          style={reduced ? undefined : { rotateX, rotateY }}
          className={`relative aspect-[9/19] ${center ? "h-[min(700px,72vh)]" : "h-[min(540px,66vh)]"} ${reduced ? "" : "est-float"}`}
        >
          {/* bezel */}
          <div className="absolute inset-0 rounded-[44px] bg-[linear-gradient(145deg,#2a2d3a,#0b0c11_45%,#1b1e2a)] p-[2px] shadow-[0_40px_90px_rgb(0_0_0/0.65),0_0_0_1px_rgb(255_255_255/0.06)]">
            <div className="h-full w-full rounded-[42px] bg-[#06070a] p-[7px]">
              <div className="relative h-full w-full overflow-hidden rounded-[35px] bg-[linear-gradient(170deg,#141623_0%,#0b0c12_55%,#0f1830_100%)]">
                <div aria-hidden className="absolute top-2.5 left-1/2 z-10 h-[22px] w-[32%] -translate-x-1/2 rounded-full bg-black" />
                <div aria-hidden className="absolute inset-x-0 top-[46px] z-10 flex items-center justify-center text-white">
                  <span className="text-[12px] font-semibold text-white/60">Following</span>
                  <span className="mx-2.5 h-3 w-px bg-white/25" />
                  <span className="relative text-[12px] font-bold">
                    For You
                    <span className="absolute -bottom-1.5 left-1/2 h-[2px] w-5 -translate-x-1/2 rounded-full bg-white" />
                  </span>
                  <svg viewBox="0 0 24 24" className="absolute right-4 h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                    <circle cx="10.5" cy="10.5" r="6.5" />
                    <path d="m15.5 15.5 4.5 4.5" />
                  </svg>
                </div>
                {/* the clip: your niche, lit like a product shot */}
                <motion.div
                  key={nicheId ?? "none"}
                  initial={reduced ? false : { opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-x-0 top-[16%] flex justify-center"
                >
                  <div aria-hidden className="absolute top-1/2 left-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(var(--glow)/0.45),transparent)]" />
                  <svg viewBox="0 0 24 24" className="relative w-[34%] fill-white drop-shadow-[0_0_24px_rgb(59_130_246/0.7)]" aria-hidden>
                    {scene.icon}
                  </svg>
                </motion.div>

                {/* the estimate, laid over the clip like its hook text */}
                <div className="absolute inset-x-4 top-[47%] mr-9 text-center text-white">
                  <p className="font-label text-[7px] tracking-[0.18em] text-white/60 uppercase">{heading}</p>
                  <div className="mt-2 flex h-9 items-center justify-center font-display text-[28px] leading-9 font-extrabold tracking-tight tabular-nums [text-shadow:0_2px_18px_rgb(0_0_0/0.6)]">
                    {final ? (
                      <motion.span
                        key={final}
                        initial={reduced ? false : { opacity: 0, y: 12, filter: "blur(8px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="whitespace-nowrap"
                        style={{ fontSize: final.length > 16 ? 16 : final.length > 11 ? 20 : undefined }}
                      >
                        {final}
                      </motion.span>
                    ) : mode === null ? (
                      <span className="text-white/35">• • •</span>
                    ) : reduced ? (
                      <span className="text-[18px] text-white/60">Estimating</span>
                    ) : (
                      <Reels prefix={mode === "views" ? "$" : ""} digits={mode === "views" ? 5 : 7} speed={0.7 + level * 1.3} />
                    )}
                  </div>
                  <p className="mt-1.5 text-[10px] text-white/60">{basis}</p>
                </div>

                {/* right rail: profile, then the engagement a clip at this reach usually gets */}
                <div className="absolute right-2 bottom-[17%] flex w-10 flex-col items-center gap-3.5 text-white">
                  <span className="relative mb-1.5 flex h-9 w-9 items-center justify-center rounded-full border-[1.5px] border-white bg-[#171822]">
                    <svg viewBox={MARK_VIEWBOX} className="w-5" aria-hidden>
                      <path fillRule="evenodd" d={MARK_PATH} fill="currentColor" />
                    </svg>
                    <span className="absolute -bottom-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#fe2c55] text-[11px] leading-none font-bold">+</span>
                  </span>
                  <RailItem label={count(0)}>
                    <path d="M12 21.2C6.3 17 2.4 13.5 2.4 9.2A5 5 0 0 1 7.5 4c1.9 0 3.5 1 4.5 2.5C13 5 14.6 4 16.5 4a5 5 0 0 1 5.1 5.2c0 4.3-3.9 7.8-9.6 12Z" />
                  </RailItem>
                  <RailItem label={count(1)}>
                    <path d="M12 3c5.2 0 9.4 3.6 9.4 8s-4.2 8-9.4 8c-1.2 0-2.4-.2-3.5-.6L3.6 20.6l1.5-4.2C3.6 15 2.6 13.1 2.6 11c0-4.4 4.2-8 9.4-8Z" />
                    <circle cx="7.8" cy="11" r="1.25" fill="#0b0c12" />
                    <circle cx="12" cy="11" r="1.25" fill="#0b0c12" />
                    <circle cx="16.2" cy="11" r="1.25" fill="#0b0c12" />
                  </RailItem>
                  <RailItem label={count(2)}>
                    <path d="M13.2 3.5 22 11.6l-8.8 8v-4.4C7.6 15.2 4.2 17.1 2 20.6c.8-6.1 4.4-10.7 11.2-11.6V3.5Z" />
                  </RailItem>
                  <span className={`mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-[conic-gradient(#2b2f3d,#0d0e14,#2b2f3d,#0d0e14,#2b2f3d)] ring-[5px] ring-[#15171f] ${reduced ? "" : "animate-[spin_5s_linear_infinite]"}`}>
                    <span className="h-3 w-3 rounded-full bg-accent" />
                  </span>
                </div>

                {/* handle, caption and playback, like a post */}
                <div className="absolute inset-x-3.5 bottom-5 mr-11 text-white">
                  <p className="text-[12px] font-semibold">{handleOf(company)}</p>
                  <p className="mt-1 text-[11px] leading-snug text-white/85">{scene.caption}</p>
                </div>
                <div className="absolute inset-x-0 bottom-0 h-[3px] bg-white/15">
                  <div className="clip-progress h-full bg-white/80" style={{ animationDuration: "26s" }} />
                </div>

                {!reduced && <motion.div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: glare }} />}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

function RailItem({ label, children }: { label: React.ReactNode; children: React.ReactNode }) {
  return (
    <span className="flex flex-col items-center">
      <svg viewBox="0 0 24 24" className="h-7 w-7 fill-white drop-shadow-[0_1px_3px_rgb(0_0_0/0.5)]" aria-hidden>
        {children}
      </svg>
      <span className="mt-0.5 flex h-3.5 items-center text-[10px] leading-3.5 font-semibold tabular-nums [text-shadow:0_1px_3px_rgb(0_0_0/0.6)]">{label}</span>
    </span>
  );
}

// Digits spinning like a slot machine: the estimate while it is locked, and the engagement on the
// rail, which only comes with the full report.
function Reels({ prefix, digits, speed, size = "lg" }: { prefix: string; digits: number; speed: number; size?: "lg" | "sm" }) {
  const comma = (i: number) => (digits - i) % 3 === 0 && i !== 0;
  const h = size === "lg" ? "h-9" : "h-3.5";
  return (
    <span className={`inline-flex ${h} items-start overflow-hidden text-white/85 [mask-image:linear-gradient(transparent,#000_28%,#000_72%,transparent)]`} aria-hidden>
      {prefix}
      {Array.from({ length: digits }, (_, i) => (
        <span key={i} className="inline-flex">
          {comma(i) && <span>,</span>}
          <span className="est-reel flex flex-col" style={{ animationDuration: `${(0.5 + ((i * 7) % 5) * 0.12) / speed}s` }}>
            {Array.from({ length: 20 }, (_, d) => (
              <span key={d} className={`block ${h}`}>
                {(d + i * 3) % 10}
              </span>
            ))}
          </span>
        </span>
      ))}
    </span>
  );
}
