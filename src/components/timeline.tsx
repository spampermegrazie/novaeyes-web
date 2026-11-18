"use client";

import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";

// How it works: the campaign timeline. As you scroll, a blue line fills down the rail and each step
// lights up when the line reaches its dot, the same way the homepage engine fills its rail.
// All text is server-rendered; steps not yet reached are only dimmed, never hidden.
// Reduced motion is handled in CSS (motion-reduce:), not in JS: a JS check renders differently on the
// server and the client, and React keeps the server markup, which left everything unlit.

export type TimelineStep = { when: string; title: string; you: string; us: string };

export function Timeline({ steps }: { steps: TimelineStep[] }) {
  const list = useRef<HTMLOListElement>(null);
  const dots = useRef<(HTMLSpanElement | null)[]>([]);
  const [reached, setReached] = useState(-1);
  // The line's tip sits at 60% of the screen height.
  const { scrollYProgress } = useScroll({ target: list, offset: ["start 60%", "end 60%"] });
  const tip = useTransform(scrollYProgress, (v) => `${v * 100}%`);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const el = list.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const y = r.top + 8 + v * (r.height - 16);
    let n = -1;
    dots.current.forEach((d, i) => {
      if (d && d.getBoundingClientRect().top + 7 <= y + 1) n = i;
    });
    setReached(n);
  });

  return (
    <ol ref={list} className="relative mt-16">
      {/* the rail and its fill */}
      <span aria-hidden className="absolute top-2 bottom-2 left-[7px] w-px bg-line lg:left-[183px]">
        <motion.span
          className="absolute inset-0 origin-top bg-gradient-to-b from-accent to-accent/70 shadow-[0_0_10px_rgb(var(--glow)/0.8)] motion-reduce:hidden"
          style={{ scaleY: scrollYProgress }}
        />
        <span className="absolute inset-0 hidden bg-gradient-to-b from-accent to-accent/40 motion-reduce:block" />
        <motion.span
          className="absolute left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#9cc3ff] shadow-[0_0_14px_4px_rgb(var(--glow)/0.7)] motion-reduce:hidden"
          style={{ top: tip }}
        />
      </span>

      {steps.map((t, i) => {
        const on = i <= reached;
        return (
          <li key={t.title} className="relative grid gap-5 pb-16 pl-10 last:pb-0 lg:grid-cols-[160px_minmax(0,1fr)] lg:gap-14 lg:pl-0">
            <span
              ref={(el) => {
                dots.current[i] = el;
              }}
              aria-hidden
              className={`absolute top-1.5 left-0 h-[15px] w-[15px] rounded-full border-2 transition-[background-color,border-color,box-shadow] duration-500 lg:left-[176px] ${
                on
                  ? "border-accent bg-accent shadow-[0_0_16px_rgb(var(--glow)/0.8)]"
                  : "border-[var(--line-strong)] bg-bg motion-reduce:border-accent motion-reduce:bg-accent"
              }`}
            />
            <div className={`transition-opacity duration-500 lg:pt-0.5 lg:text-right ${on ? "opacity-100" : "opacity-45 motion-reduce:opacity-100"}`}>
              <p className="font-label text-[10px] tracking-[0.14em] text-accent uppercase">{t.when}</p>
              <h3 className="mt-1.5 text-2xl tracking-tight">
                <span className="sr-only">Step {i + 1}: </span>
                {t.title}
              </h3>
            </div>
            <div className={`max-w-2xl transition-opacity duration-500 ${on ? "opacity-100" : "opacity-45 motion-reduce:opacity-100"}`}>
              <p className="text-lg leading-relaxed text-fg/90">{t.us}</p>
              <p className="mt-4 flex gap-3 text-sm leading-relaxed text-muted">
                <span className="shrink-0 pt-[3px] font-label text-[9px] tracking-[0.14em] text-fg/60 uppercase">You</span>
                <span>{t.you}</span>
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
