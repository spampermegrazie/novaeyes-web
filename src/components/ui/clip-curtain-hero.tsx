"use client";

// Homepage hero: a stack of short-form clips that parts like a curtain as you scroll,
// revealing the headline, then drifts outward before the page moves on.
//
// The scene is sticky inside a taller section, so the page scrolls natively the whole
// time: no wheel hijacking, and it works the same with touch, trackpad and keyboard.
// If a visitor doesn't scroll within a few seconds, the curtain opens on its own so the
// message is never hidden. With reduced motion, the clips simply start open.

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
const OPEN_AT = 0.55; // share of the scene's scroll distance it takes to fully open
const IDLE_OPEN_MS = 3000;

type Stage = { width: number; height: number; isMobile: boolean };

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const easeOutCubic = (p: number) => 1 - Math.pow(1 - p, 3);

type CardProps = {
  clip: HeroClip;
  index: number;
  total: number;
  progress: MotionValue<number>;
  drift: MotionValue<number>;
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
  stage: Stage;
  playing: boolean;
};

function ClipCard({ clip, index, total, progress, drift, pointerX, pointerY, stage, playing }: CardProps) {
  const half = total / 2;
  const isLeft = index % 2 === 0;
  const wing = Math.floor(index / 2);
  const norm = wing / (half - 1) - 0.5; // -0.5 (top) to 0.5 (bottom)
  const side = isLeft ? -1 : 1;

  const width = stage.isMobile ? 84 : 132;
  const height = Math.round((width * 16) / 9);

  // Closed: a neat stack in the middle. Open: two curved wings framing the headline
  // (on phones they hug the screen edges).
  const initialX = side * wing * 5;
  const initialY = norm * 12;
  const initialRotate = side * wing * 2;
  const arch = Math.cos(norm * Math.PI) * stage.width * 0.03;
  const spread = stage.isMobile ? stage.width * 0.5 - width * 0.2 : stage.width * 0.36;
  const targetX = side * (spread + arch);
  const targetY = norm * stage.height * (stage.isMobile ? 0.72 : 0.62);
  const targetRotate = side * norm * 16;
  const parallax = stage.isMobile ? 0 : 14;

  const x = useTransform([progress, drift, pointerX], ([p, d, px]: number[]) => {
    const e = easeOutCubic(p);
    return initialX + (targetX - initialX) * e + side * d * stage.width * 0.06 + px * side * parallax * e;
  });
  const y = useTransform([progress, drift, pointerY], ([p, d, py]: number[]) => {
    const e = easeOutCubic(p);
    return initialY + (targetY - initialY) * e - d * stage.height * (0.1 + wing * 0.04) + py * parallax * e;
  });
  const rotate = useTransform([progress, drift], ([p, d]: number[]) => {
    // Swings through a tilt mid-split, like a curtain opening, then settles.
    const mid = side * -14;
    const r =
      p < 0.45
        ? initialRotate + (mid - initialRotate) * (p / 0.45)
        : mid + (targetRotate - mid) * ((p - 0.45) / 0.55);
    return r + side * d * 6;
  });
  // The closed stack starts larger so the first screen isn't mostly empty.
  const scale = useTransform(progress, [0, 0.5, 1], [stage.isMobile ? 1.3 : 1.45, 1.05, 1]);
  const opacity = useTransform(drift, [0, 1], [1, 0.45]);

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
      <span className="absolute inset-0 flex -rotate-12 items-center justify-center font-label text-[10px] tracking-[0.14em] text-white/20 uppercase select-none">
        NovaEyes
      </span>
      <span className="absolute right-2 bottom-4 font-label text-[7px] tracking-[0.1em] text-white/45 uppercase select-none">
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
  const sceneRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [stage, setStage] = useState<Stage>({ width: 1200, height: 800, isMobile: false });
  const [playing, setPlaying] = useState(false);

  // Scroll through the tall section drives the scene. 0 = top of the page.
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start 64px", "end end"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.4 });

  // Fallback for visitors who don't scroll: the curtain opens on its own after a pause.
  const autoOpen = useMotionValue(0);

  // 0 = closed stack, 1 = open wings. Then `drift` takes over until the scene releases.
  const progress = useTransform(() =>
    reduce ? 1 : Math.max(clamp01(smooth.get() / OPEN_AT), autoOpen.get()),
  );
  const drift = useTransform(() => (reduce ? 0 : clamp01((smooth.get() - OPEN_AT) / (1 - OPEN_AT))));

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const pointerX = useSpring(rawX, SPRING);
  const pointerY = useSpring(rawY, SPRING);

  useEffect(() => {
    const el = sceneRef.current;
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

  useEffect(() => {
    if (reduce) return;
    let controls: ReturnType<typeof animate> | undefined;
    const timer = window.setTimeout(() => {
      if (scrollYProgress.get() < 0.02) {
        controls = animate(autoOpen, 1, { duration: 1.4, ease: [0.16, 1, 0.3, 1] });
      }
    }, IDLE_OPEN_MS);
    return () => {
      window.clearTimeout(timer);
      controls?.stop();
    };
  }, [reduce, autoOpen, scrollYProgress]);

  useEffect(() => {
    const el = sceneRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setPlaying(entry.isIntersecting), { threshold: 0.1 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduce || stage.isMobile || e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    rawX.set(((e.clientX - rect.left) / rect.width - 0.5) * 2);
    rawY.set(((e.clientY - rect.top) / rect.height - 0.5) * 2);
  };
  const onPointerLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  // A click on the closed stack scrolls to the point where the curtain is open.
  const openByClick = () => {
    const section = sectionRef.current;
    if (!section || progress.get() > 0.5) return;
    const distance = section.offsetHeight - window.innerHeight;
    window.scrollTo({ top: section.offsetTop - 64 + distance * OPEN_AT, behavior: "smooth" });
  };

  const textOpacity = useTransform(progress, [0.3, 0.8], [0, 1]);
  const textY = useTransform(progress, [0.25, 0.85], [30, 0]);
  const hintOpacity = useTransform(progress, [0, 0.15], [1, 0]);
  const scrimOpacity = useTransform(progress, [0.5, 1], [0, 1]);
  // Clips sit in front of the headline while closed, behind it once open.
  const cardsZ = useTransform(progress, (p) => (p > 0.55 ? 10 : 40));

  return (
    <section ref={sectionRef} className="relative h-[200svh] motion-reduce:h-auto">
      <div
        ref={sceneRef}
        onClick={openByClick}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        className="sticky top-16 flex h-[calc(100svh-4rem)] items-center justify-center overflow-hidden"
      >
        {/* Dot grid, fading toward the edges */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(var(--line)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,#000_40%,transparent_100%)] [background-size:24px_24px]" />
        {/* Accent glow behind the headline */}
        <div className="pointer-events-none absolute top-1/2 left-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[rgb(var(--glow)/0.10)] blur-3xl" />

        <motion.div className="absolute inset-0" style={{ zIndex: cardsZ }} aria-hidden>
          {clips.map((clip, i) => (
            <ClipCard
              key={i}
              clip={clip}
              index={i}
              total={clips.length}
              progress={progress}
              drift={drift}
              pointerX={pointerX}
              pointerY={pointerY}
              stage={stage}
              playing={playing}
            />
          ))}
        </motion.div>

        {/* On phones the open clips sit at the edges, so a soft scrim keeps the headline readable. */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-20 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,var(--bg)_30%,transparent_100%)] md:hidden"
          style={{ opacity: scrimOpacity }}
        />

        <motion.div className="relative z-30 px-4 text-center" style={{ opacity: textOpacity, y: textY }}>
          {children}
        </motion.div>

        <motion.p
          className="pointer-events-none absolute bottom-6 z-50 flex items-center gap-2 rounded-full border border-line bg-bg/70 px-3.5 py-1.5 text-[11px] text-muted backdrop-blur-md"
          style={{ opacity: hintOpacity }}
          aria-hidden
        >
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
          Scroll to open
        </motion.p>
      </div>
    </section>
  );
}
