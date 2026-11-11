"use client";

// A stat that counts up from zero the first time it scrolls into view, coming
// out of a blur as it settles. The server HTML always holds the real number, so
// crawlers, no-JS visitors and people who turn motion off just see the final value.

import { useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";

type Parsed = { prefix: string; n: number; decimals: number; grouped: boolean; suffix: string };

function parse(value: string): Parsed | null {
  const m = value.match(/^([^\d]*)([\d,]+(?:\.\d+)?)(.*)$/);
  if (!m) return null;
  const [, prefix, num, suffix] = m;
  return {
    prefix,
    n: parseFloat(num.replace(/,/g, "")),
    decimals: num.split(".")[1]?.length ?? 0,
    grouped: num.includes(","),
    suffix,
  };
}

function format(p: Parsed, v: number) {
  const s = v.toLocaleString("en-US", {
    minimumFractionDigits: p.decimals,
    maximumFractionDigits: p.decimals,
    useGrouping: p.grouped,
  });
  return `${p.prefix}${s}${p.suffix}`;
}

const EASE = [0.16, 1, 0.3, 1] as const;

export function CountUp({ value, delay = 0 }: { value: string; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduced = useReducedMotion();
  const primed = useRef(false);

  // Before it is seen, park it at zero and blurred, ready to count.
  useEffect(() => {
    const el = ref.current;
    const p = parse(value);
    if (!el || !p || reduced || inView || primed.current) return;
    primed.current = true;
    el.textContent = format(p, 0);
    el.style.filter = "blur(10px)";
    el.style.opacity = "0.2";
  }, [value, reduced, inView]);

  useEffect(() => {
    const el = ref.current;
    const p = parse(value);
    if (!el || !p || reduced || !inView) return;
    const count = animate(0, p.n, {
      duration: 1.9,
      delay,
      ease: EASE,
      onUpdate: (v) => {
        el.textContent = format(p, v);
      },
    });
    const reveal = animate(
      el,
      { filter: ["blur(10px)", "blur(0px)"], opacity: [0.2, 1], y: [10, 0] },
      { duration: 1.3, delay, ease: EASE },
    );
    return () => {
      count.stop();
      reveal.stop();
    };
  }, [value, delay, reduced, inView]);

  return (
    <span ref={ref} className="inline-block tabular-nums">
      {value}
    </span>
  );
}
