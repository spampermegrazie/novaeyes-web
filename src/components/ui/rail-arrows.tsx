"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

// Prev/next buttons for a sideways-scrolling row (desktop only; phones swipe).
// Hidden when everything already fits.
export function RailArrows({ targetId, label }: { targetId: string; label: string }) {
  const [edge, setEdge] = useState({ start: true, end: false, fits: false });
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = document.getElementById(targetId);
    if (!el) return;
    const update = () =>
      setEdge({
        start: el.scrollLeft <= 4,
        end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4,
        fits: el.scrollWidth <= el.clientWidth + 4,
      });
    const raf = requestAnimationFrame(update);
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [targetId]);

  const go = (dir: 1 | -1) => {
    const el = document.getElementById(targetId);
    el?.scrollBy({ left: dir * el.clientWidth * 0.75, behavior: reduced ? "auto" : "smooth" });
  };

  if (edge.fits) return null;
  const btn =
    "flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-bg-raised/60 text-fg transition-colors hover:border-accent/50 disabled:cursor-default disabled:opacity-35 disabled:hover:border-line";
  return (
    <div className="hidden shrink-0 gap-2 lg:flex">
      <button type="button" className={btn} onClick={() => go(-1)} disabled={edge.start} aria-label={`Previous ${label}`} aria-controls={targetId}>
        <span aria-hidden>←</span>
      </button>
      <button type="button" className={btn} onClick={() => go(1)} disabled={edge.end} aria-label={`Next ${label}`} aria-controls={targetId}>
        <span aria-hidden>→</span>
      </button>
    </div>
  );
}
