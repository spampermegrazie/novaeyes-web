"use client";

// Homepage hero: a stack of short-form clips splits from behind the headline into two
// wings on load, then drifts outward as the page scrolls. Based on the curtain-split hero
// pattern, with two deliberate differences:
//   - no scroll hijacking: the page always scrolls normally, motion follows it
//   - the headline is visible from the first paint; clips move behind it

import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { HeroClip } from "@/content/hero-clips";

const SPRING = { stiffness: 65, damping: 22, mass: 0.5 };
const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

type Stage = { width: number; height: number; isMobile: boolean };

type CardProps = {
  clip: HeroClip;
  index: number;
  total: number;
  intro: MotionValue<number>;
  scroll: MotionValue<number>;
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
  stage: Stage;
  playing: boolean;
};

function ClipCard({ clip, index, total, intro, scroll, pointerX, pointerY, stage, playing }: CardProps) {
  const half = total / 2;
  const isLeft = index % 2 === 0;
  const wing = Math.floor(index / 2);
  const norm = wing / (half - 1) - 0.5; // -0.5 (top) to 0.5 (bottom)
  const side = isLeft ? -1 : 1;

  const width = stage.isMobile ? 84 : 132;
  const height = Math.round((width * 16) / 9);

  // On desktop the wings frame the headline; on mobile they hug the screen edges.
  const arch = Math.cos(norm * Math.PI) * stage.width * 0.03;
  const spread = stage.isMobile ? stage.width * 0.5 - width * 0.2 : stage.width * 0.36;
  const targetX = side * (spread + arch);
  const targetY = norm * stage.height * (stage.isMobile ? 0.72 : 0.62);
  const targetRotate = side * norm * 16;
  const parallax = stage.isMobile ? 0 : 14;

  const ease = (p: number) => 1 - Math.pow(1 - p, 3);

  const x = useTransform([intro, scroll, pointerX], ([p, s, px]: number[]) => {
    const e = ease(p);
    return targetX * e + side * s * stage.width * 0.08 + px * side * parallax * e;
  });
  const y = useTransform([intro, scroll, pointerY], ([p, s, py]: number[]) => {
    const e = ease(p);
    return targetY * e - s * stage.height * (0.12 + wing * 0.04) + py * parallax * e;
  });
  const rotate = useTransform([intro, scroll], ([p, s]: number[]) => {
    // Passes through a tilt mid-split, like a curtain swinging open, then settles.
    const mid = side * -14;
    const start = side * wing * 2;
    const r = p < 0.45 ? start + (mid - start) * (p / 0.45) : mid + (targetRotate - mid) * ((p - 0.45) / 0.55);
    return r + side * s * 6;
  });
  const scale = useTransform(intro, [0, 1], [0.86, 1]);
  const opacity = useTransform([intro, scroll], ([p, s]: number[]) => Math.min(1, p * 5) * (1 - s * 0.55));

  return (
    <motion.div
      className="absolute top-1/2 left-1/2 will-change-transform"
      style={{
        width,
        height,
        marginLeft: -width / 2,
        marginTop: -height / 2,
        zIndex: isLeft ? index + 1 : total - index,
        x,
        y,
        rotate,
        scale,
        opacity,
      }}
      whileHover={stage.isMobile ? undefined : { scale: 1.06, transition: SPRING }}
    >
      <div className="relative h-full w-full overflow-hidden rounded-xl bg-bg-raised shadow-2xl shadow-black/60 ring-1 ring-white/10">
        {clip.src ? <ClipVideo clip={clip} playing={playing} /> : <ClipPlaceholder clip={clip} index={index} />}
      </div>
    </motion.div>
  );
}

function ClipVideo({ clip, playing }: { clip: HeroClip; playing: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);

  // Only play while the hero is on screen, so eight videos never run in the background.
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (playing) video.play().catch(() => {});
    else video.pause();
  }, [playing]);

  return (
    <video
      ref={ref}
      src={clip.src}
      poster={clip.poster}
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden
      className="h-full w-full object-cover"
    />
  );
}

// Stand-in until real clips are added: a moving sheen, a playback bar and a NovaEyes
// watermark, the way a branded clip looks in a feed. No view counts, since they'd be invented.
function ClipPlaceholder({ clip, index }: { clip: HeroClip; index: number }) {
  return (
    <div className="relative h-full w-full bg-[linear-gradient(160deg,#1b1b24_0%,#0d0d12_60%,#101a2e_100%)]">
      <div className="clip-sheen absolute inset-0" style={{ animationDelay: `${index * -0.9}s` }} />
      <span className="absolute top-2 left-2 rounded-full bg-black/55 px-2 py-0.5 text-[9px] font-medium text-white/80">
        {clip.platform}
      </span>
      <span className="absolute inset-0 flex -rotate-12 items-center justify-center text-[10px] font-semibold tracking-[0.3em] text-white/20 uppercase select-none">
        NovaEyes
      </span>
      <span className="absolute right-2 bottom-4 text-[8px] font-semibold tracking-[0.2em] text-white/45 uppercase select-none">
        NovaEyes
      </span>
      <div className="absolute inset-x-2 bottom-2 h-0.5 overflow-hidden rounded-full bg-white/15">
        <div
          className="clip-progress h-full bg-white/70"
          style={{ animationDuration: `${6 + (index % 3) * 2}s`, animationDelay: `${index * -1.3}s` }}
        />
      </div>
    </div>
  );
}

export function ClipCurtainHero({ clips, children }: { clips: HeroClip[]; children: React.ReactNode }) {
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [stage, setStage] = useState<Stage>({ width: 1200, height: 800, isMobile: false });
  const [playing, setPlaying] = useState(false);

  // 0 = stacked behind the headline, 1 = split into two wings.
  const intro = useMotionValue(0);

  // 0 at the top of the page, 1 once the hero has scrolled out of view.
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const scroll = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const pointerX = useSpring(rawX, SPRING);
  const pointerY = useSpring(rawY, SPRING);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const update = () => {
      const rect = el.getBoundingClientRect();
      setStage({ width: rect.width, height: rect.height, isMobile: rect.width < 768 });
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // The split plays once on load. With reduced motion, the clips simply start in place.
  useEffect(() => {
    if (reduce) {
      intro.set(1);
      return;
    }
    const controls = animate(intro, 1, { duration: 1.6, ease: EASE_OUT_EXPO, delay: 0.2 });
    return () => controls.stop();
  }, [reduce, intro]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setPlaying(entry.isIntersecting), { threshold: 0.1 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const onPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (reduce || stage.isMobile || e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    rawX.set(((e.clientX - rect.left) / rect.width - 0.5) * 2);
    rawY.set(((e.clientY - rect.top) / rect.height - 0.5) * 2);
  };
  const onPointerLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  const textY = useTransform(scroll, [0, 1], [0, -70]);
  const textOpacity = useTransform(scroll, [0, 0.7], [1, 0]);

  return (
    <section
      ref={sectionRef}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className="relative flex min-h-[calc(100svh-4rem)] items-center justify-center overflow-hidden"
    >
      {/* Dot grid, fading toward the edges */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(var(--line)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,#000_40%,transparent_100%)] [background-size:24px_24px]" />
      {/* Accent glow behind the headline */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[rgb(var(--glow)/0.10)] blur-3xl" />

      <div className="absolute inset-0 z-10" aria-hidden>
        {clips.map((clip, i) => (
          <ClipCard
            key={i}
            clip={clip}
            index={i}
            total={clips.length}
            intro={intro}
            scroll={scroll}
            pointerX={pointerX}
            pointerY={pointerY}
            stage={stage}
            playing={playing}
          />
        ))}
      </div>

      {/* On phones the clips sit at the edges, so a soft scrim keeps the headline readable. */}
      <div className="pointer-events-none absolute inset-0 z-20 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,var(--bg)_30%,transparent_100%)] md:hidden" />

      <motion.div className="relative z-30 px-4 py-24 text-center" style={{ y: textY, opacity: textOpacity }}>
        {children}
      </motion.div>
    </section>
  );
}
