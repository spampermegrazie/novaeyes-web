"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { nav, verticalLinks } from "@/content/facts";
import { ShinyButton } from "./ui/shiny-button";

// Phones only (hidden from md up): a menu button that opens a panel under the header with the
// main links, the services and the two actions. The panel hangs off the header (absolute, not
// fixed), because the header's backdrop blur would trap a fixed panel inside its 64px box.
// Closes on Escape, on any link and when the route changes; the page behind does not scroll.

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const [lastPath, setLastPath] = useState<string | null>(null);
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const panelId = useId();
  const button = useRef<HTMLButtonElement>(null);

  // A new page closes the menu (state adjusted during render, no effect needed).
  if (pathname !== lastPath) {
    setLastPath(pathname);
    if (open) setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        button.current?.focus();
      }
    };
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <div className="md:hidden">
      <button
        ref={button}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
        className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-bg-raised/60 text-fg transition-colors hover:border-muted/50"
      >
        <span className="relative block h-3 w-4" aria-hidden>
          <span className={`absolute left-0 h-[1.5px] w-4 rounded-full bg-current transition-[top,rotate] duration-300 ${open ? "top-[5px] rotate-45" : "top-0"}`} />
          <span className={`absolute top-[5px] left-0 h-[1.5px] w-4 rounded-full bg-current transition-opacity duration-200 ${open ? "opacity-0" : "opacity-100"}`} />
          <span className={`absolute left-0 h-[1.5px] w-4 rounded-full bg-current transition-[top,rotate] duration-300 ${open ? "top-[5px] -rotate-45" : "top-[10px]"}`} />
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id={panelId}
            initial={reduced ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-x-0 top-full flex h-[calc(100dvh-4rem)] flex-col overflow-y-auto border-t border-line/60 bg-bg px-6 pt-6 pb-8 sm:px-10"
          >
            <nav aria-label="Mobile">
              <ul className="divide-y divide-line/70 border-b border-line/70">
                {nav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={close}
                      aria-current={pathname === item.href ? "page" : undefined}
                      className="flex items-center justify-between py-4 font-display text-2xl font-semibold tracking-tight aria-[current=page]:text-accent"
                    >
                      {item.label}
                      <span className="text-base text-muted" aria-hidden>
                        →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>

              <p className="mt-8 font-label text-[10px] tracking-[0.14em] text-muted uppercase">Clipping for</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {verticalLinks.map((v) => (
                  <li key={v.href}>
                    <Link
                      href={v.href}
                      onClick={close}
                      aria-current={pathname === v.href ? "page" : undefined}
                      className="inline-flex rounded-xl border border-line bg-bg-raised/50 px-3.5 py-2 font-display text-sm font-semibold aria-[current=page]:border-accent/60 aria-[current=page]:text-accent"
                    >
                      {v.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="mt-auto flex flex-col gap-3 pt-10">
              <ShinyButton href="/book" className="w-full py-3.5 text-center text-sm">
                Book a 15-minute reach audit
              </ShinyButton>
              {/* Dashboard lives in another zone, so a plain anchor, not <Link>. */}
              <a href="/app" className="rounded-xl border border-line px-6 py-3.5 text-center font-display text-sm font-semibold text-muted hover:text-fg">
                Client login
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
