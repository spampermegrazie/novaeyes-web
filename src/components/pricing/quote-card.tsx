import { LogoMark } from "@/components/brand";
import { CountUp } from "@/components/ui/count-up";
import { facts } from "@/content/facts";

// Pricing header: an example campaign quote, drawn as a ticket. Deliberately not a node diagram,
// so it doesn't repeat the homepage and how-it-works pictures. Every value is real page copy:
// the minimum, the fee as a percentage (never a number), the $0.20 example CPM and the views it buys.

const ROWS = [
  { k: "View pool", sub: "Paid to clippers per 1,000 verified views", v: facts.minimumBudgetLabel },
  { k: "Management fee", sub: "On top of the budget, or inside it", v: "% of budget" },
  { k: "Target CPM", sub: "Agreed before launch", v: "$0.20" },
  { k: "Live", sub: "After the onboarding call", v: "Within 24h" },
];

function Check({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m3.5 8.5 3 3 6-7" />
    </svg>
  );
}

export function QuoteCard() {
  return (
    <figure className="relative mx-auto w-full max-w-md pt-6 lg:max-w-none lg:pr-4">
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 h-[26rem] w-[26rem] max-w-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(var(--glow)/0.2),transparent)]"
      />

      {/* a second ticket behind, for depth */}
      <div aria-hidden className="absolute inset-x-6 top-10 bottom-0 rotate-[4deg] rounded-3xl border border-line bg-bg-raised/50" />

      {/* floating live chip */}
      <div
        aria-hidden
        className="vp-float absolute top-0 right-2 z-20 flex items-center gap-2 rounded-full border border-accent/40 bg-bg/90 px-3 py-1.5 shadow-[0_10px_30px_rgb(0_0_0/0.4),0_0_20px_rgb(var(--glow)/0.25)] backdrop-blur sm:right-0"
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inset-0 animate-ping rounded-full bg-accent/70" />
          <span className="relative h-2 w-2 rounded-full bg-accent" />
        </span>
        <span className="font-[family-name:var(--font-geist-mono)] text-[11px] text-fg/90">+212K verified views</span>
      </div>

      <div className="relative overflow-hidden rounded-3xl border border-line bg-[#111118] shadow-[0_30px_80px_rgb(0_0_0/0.55),0_0_60px_rgb(var(--glow)/0.12)]">
        <span aria-hidden className="sb-sweep pointer-events-none absolute top-0 left-0 h-px w-1/3 bg-gradient-to-r from-transparent via-accent to-transparent" />

        {/* header */}
        <div className="flex items-center gap-3 px-6 pt-6 sm:px-7">
          <LogoMark className="h-3.5 w-auto shrink-0 text-fg" />
          <span className="font-label text-[10px] tracking-[0.14em] whitespace-nowrap text-fg/80 uppercase">Example quote</span>
        </div>

        {/* line items */}
        <dl className="mt-5 px-6 sm:px-7">
          {ROWS.map((r) => (
            <div key={r.k} className="flex items-start justify-between gap-4 border-t border-dashed border-line py-3.5">
              <dt className="min-w-0">
                <span className="block text-sm font-semibold">{r.k}</span>
                <span className="block text-[11px] text-muted">{r.sub}</span>
              </dt>
              <dd className="shrink-0 font-display text-base font-bold tabular-nums">{r.v}</dd>
            </div>
          ))}
        </dl>

        {/* perforation */}
        <div aria-hidden className="relative my-2 h-6">
          <span className="absolute top-0 -left-3 h-6 w-6 rounded-full border border-line bg-bg" />
          <span className="absolute top-0 -right-3 h-6 w-6 rounded-full border border-line bg-bg" />
          <span className="absolute top-1/2 right-5 left-5 border-t-2 border-dotted border-line" />
        </div>

        {/* what it buys */}
        <div className="px-6 sm:px-7">
          <p className="font-label text-[9px] tracking-[0.14em] text-muted uppercase">Verified views</p>
          <p className="mt-2 font-display text-4xl font-bold tracking-tight text-accent tabular-nums [text-shadow:0_0_30px_rgb(var(--glow)/0.45)] sm:text-5xl">
            <CountUp value="15,000,000" />
          </p>
          <div className="mt-4">
            <div className="flex justify-between text-[11px] text-muted">
              <span>View pool spent</span>
              <span>per verified view</span>
            </div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-line">
              <span className="pr-fill block h-full rounded-full bg-gradient-to-r from-[#1e3a8a] to-accent shadow-[0_0_12px_rgb(var(--glow)/0.6)]" />
            </div>
          </div>
        </div>

        {/* footer */}
        <div className="mt-6 flex items-center gap-3 border-t border-line bg-bg/40 px-6 py-4 sm:px-7">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-accent/50 bg-accent/10 text-accent">
            <Check className="h-3.5 w-3.5" />
          </span>
          <span className="text-xs leading-snug text-fg/85">Full cost agreed in writing before you sign. No retainer.</span>
        </div>
      </div>
      <figcaption className="sr-only">
        An example quote: a {facts.minimumBudgetLabel} view pool at a $0.20 CPM buys about 15 million verified views, plus a management fee
        that is a percentage of the budget.
      </figcaption>
    </figure>
  );
}
