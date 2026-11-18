import Link from "next/link";
import type { ReactNode } from "react";
import { ShinyButton } from "@/components/ui/shiny-button";

// The building blocks every inner page shares, so they all read like the homepage: one container,
// one header, one section rhythm (pb-24, like the homepage), hairlines instead of boxes, and FAQs as
// a collapsible list. Change the look here, not page by page.

export const CONTAINER = "mx-auto max-w-6xl px-6 sm:px-10 lg:px-12";
/** A page section: the homepage rhythm plus the gentle scroll reveal (.rv in globals.css). */
export const SECTION = `rv ${CONTAINER} pb-24`;

export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`font-label text-[10px] tracking-[0.14em] text-muted uppercase ${className}`}>{children}</p>;
}

export type Crumb = { name: string; href?: string };

export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-y-1 font-label text-[10px] tracking-[0.14em] text-muted uppercase">
      {items.map((c, i) => (
        <span key={c.name} className="flex items-center">
          {i > 0 && <span className="mx-2 text-muted/50">/</span>}
          {c.href ? (
            <Link href={c.href} className="transition-colors hover:text-fg">
              {c.name}
            </Link>
          ) : (
            <span className="text-fg/80">{c.name}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

export const H1_CLASS = "text-[2.6rem] leading-[1.02] font-bold tracking-tight text-balance break-words min-[400px]:text-5xl sm:text-6xl";

/** The two calls to action every page ends its header with. */
export function HeaderActions({ primary = "Book a 15-minute reach audit" }: { primary?: string }) {
  return (
    <div className="mt-10 flex flex-col gap-3 sm:flex-row">
      <ShinyButton href="/book">{primary}</ShinyButton>
      <Link
        href="/reach-estimator"
        className="rounded-xl border border-line bg-bg/60 px-6 py-3 text-center font-display text-sm font-semibold backdrop-blur transition-colors hover:border-muted/50"
      >
        Estimate your reach
      </Link>
    </div>
  );
}

/**
 * Inner page header: breadcrumb, H1 (a plain part and a muted part), a lead, optional actions,
 * optional picture on the right. The lead's first paragraph is the answer; keep it short.
 */
export function PageHeader({
  crumbs,
  title,
  muted,
  lead,
  actions,
  aside,
  after,
}: {
  crumbs: Crumb[];
  title: ReactNode;
  muted?: ReactNode;
  lead?: ReactNode;
  actions?: ReactNode;
  aside?: ReactNode;
  after?: ReactNode;
}) {
  const text = (
    <div className="min-w-0">
      <Breadcrumb items={crumbs} />
      <h1 className={`mt-8 max-w-4xl ${H1_CLASS}`}>
        {title}
        {muted && (
          <>
            {" "}
            <span className="text-muted">{muted}</span>
          </>
        )}
      </h1>
      {lead && <div className="mt-8 max-w-2xl space-y-4 text-lg leading-relaxed text-muted [&>p:first-child]:text-fg/85">{lead}</div>}
      {actions}
      {after}
    </div>
  );
  return (
    <header className={`${CONTAINER} pt-16 pb-20 lg:pt-20 lg:pb-24`}>
      {aside ? (
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
          {text}
          <div className="min-w-0">{aside}</div>
        </div>
      ) : (
        text
      )}
    </header>
  );
}

/** Section heading: eyebrow, H2 with a plain and a muted part, optional one-paragraph intro. */
export function SectionHead({
  eyebrow,
  title,
  muted,
  intro,
  center = false,
  as: Tag = "h2",
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  muted?: ReactNode;
  intro?: ReactNode;
  center?: boolean;
  as?: "h2" | "h3";
}) {
  return (
    <div className={center ? "text-center" : ""}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <Tag className={`mt-4 max-w-3xl text-3xl tracking-tight text-balance sm:text-4xl ${center ? "mx-auto" : ""}`}>
        {title}
        {muted && (
          <>
            {" "}
            <span className="text-muted">{muted}</span>
          </>
        )}
      </Tag>
      {intro && <p className={`mt-5 max-w-2xl leading-relaxed text-muted ${center ? "mx-auto" : ""}`}>{intro}</p>}
    </div>
  );
}

export type QA = { q: string; a: ReactNode };

/** FAQs as a collapsible list with hairlines. Answers stay in the HTML when closed. */
export function FaqList({ items, firstOpen = true }: { items: QA[]; firstOpen?: boolean }) {
  return (
    <div className="min-w-0 divide-y divide-line border-y border-line">
      {items.map((f, i) => (
        <details key={f.q} open={firstOpen && i === 0} className="group">
          <summary className="flex cursor-pointer list-none items-start gap-4 py-6 font-display font-semibold transition-colors hover:text-fg/90 [&::-webkit-details-marker]:hidden">
            <span className="flex-1">{f.q}</span>
            <span
              aria-hidden
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-line text-base leading-none text-muted transition-[rotate,color,border-color] duration-300 group-open:rotate-45 group-open:border-accent/50 group-open:text-accent"
            >
              +
            </span>
          </summary>
          <div className="-mt-2 pr-10 pb-6 leading-relaxed text-muted">{f.a}</div>
        </details>
      ))}
    </div>
  );
}

/** The FAQ block used at the bottom of most pages: heading on the left (sticky on desktop), list on the right. */
export function FaqSection({
  items,
  title = "Questions.",
  muted = "Short answers.",
  side,
  id = "faq",
  allLink = true,
}: {
  items: QA[];
  title?: ReactNode;
  muted?: ReactNode;
  side?: ReactNode;
  id?: string;
  allLink?: boolean;
}) {
  return (
    <section id={id} className={`${CONTAINER} scroll-mt-24 pb-16`}>
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-20">
        <div className="min-w-0 lg:sticky lg:top-28 lg:self-start">
          <Eyebrow>FAQ</Eyebrow>
          <h2 className="mt-4 text-3xl tracking-tight text-balance sm:text-4xl">
            {title} <span className="text-muted">{muted}</span>
          </h2>
          {allLink && (
            <Link href="/faq" className="mt-6 inline-block font-display text-sm font-semibold text-accent transition-colors hover:text-fg">
              All questions →
            </Link>
          )}
          {side}
        </div>
        <FaqList items={items} />
      </div>
    </section>
  );
}

export function Check({ muted = false }: { muted?: boolean }) {
  return muted ? (
    <svg viewBox="0 0 16 16" className="mt-1 h-3.5 w-3.5 shrink-0 text-muted/70" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
      <path d="m4.5 4.5 7 7m0-7-7 7" />
    </svg>
  ) : (
    <svg viewBox="0 0 16 16" className="mt-1 h-4 w-4 shrink-0 text-accent" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m3.5 8.5 3 3 6-7" />
    </svg>
  );
}

/** A thin top rule above an open column; the first (or highlighted) one glows. */
export function Rule({ on = false }: { on?: boolean }) {
  return (
    <span
      aria-hidden
      className={`block h-px ${on ? "bg-gradient-to-r from-accent via-accent/40 to-transparent shadow-[0_0_12px_rgb(var(--glow)/0.6)]" : "bg-line"}`}
    />
  );
}
