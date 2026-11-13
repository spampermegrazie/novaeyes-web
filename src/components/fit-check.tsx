import Link from "next/link";
import { facts } from "@/content/facts";

// Homepage: who NovaEyes is and isn't for, said plainly, so the wrong leads rule themselves out
// before booking a call.

const FIT = [
  "You have video worth clipping: podcasts, fights, music, streams or interviews.",
  "Or you want your logo, promo code or product on clips that already get views.",
  "You want reach at scale: millions of views across TikTok, Reels, Shorts and X.",
  "You would rather pay for verified views than flat fees for posts.",
  `You can put at least ${facts.minimumBudgetLabel} into a campaign.`,
];

const NOT_FIT = [
  `Your budget is under ${facts.minimumBudgetLabel}.`,
  "You need guaranteed sales or a fixed cost per conversion. We deliver views, and estimates are ranges, not promises.",
  "You want every view on your own account. Clips go out on our clippers' pages.",
  "You don't own the content, or don't have the rights to let others repost it.",
  "You want one polished ad made. We run volume: thousands of clips, not one hero video.",
];

const Check = () => (
  <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="m3.5 8.5 3 3 6-7" />
  </svg>
);
const Cross = () => (
  <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
    <path d="m4.5 4.5 7 7m0-7-7 7" />
  </svg>
);

export function FitCheck() {
  return (
    <section id="is-novaeyes-a-fit" className="mx-auto max-w-6xl px-6 pb-24 sm:px-10 lg:px-12">
      <p className="font-label text-[10px] tracking-[0.14em] text-muted uppercase">Fit check</p>
      <h2 className="mt-4 max-w-3xl text-3xl tracking-tight text-balance sm:text-4xl">
        Is NovaEyes a fit? <span className="text-muted">Better to know before you book.</span>
      </h2>

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        <div className="relative overflow-hidden rounded-2xl border border-accent/40 bg-bg-raised/50 p-7 shadow-[0_0_60px_rgb(var(--glow)/0.08)] sm:p-8">
          <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/70 to-transparent" />
          <h3 className="flex items-center gap-3 text-lg">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent text-accent-ink shadow-[0_0_16px_rgb(var(--glow)/0.5)]">
              <Check />
            </span>
            A fit if
          </h3>
          <ul className="mt-6 space-y-4">
            {FIT.map((t) => (
              <li key={t} className="flex gap-3 leading-relaxed">
                <span className="mt-1 shrink-0 text-accent">
                  <Check />
                </span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-line bg-bg-raised/25 p-7 sm:p-8">
          <h3 className="flex items-center gap-3 text-lg text-muted">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-line text-muted">
              <Cross />
            </span>
            Not a fit if
          </h3>
          <ul className="mt-6 space-y-4">
            {NOT_FIT.map((t) => (
              <li key={t} className="flex gap-3 leading-relaxed text-muted">
                <span className="mt-1 shrink-0 text-muted/70">
                  <Cross />
                </span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="mt-6 text-sm text-muted">
        Not sure yet?{" "}
        <Link href="/reach-estimator" className="font-display font-semibold text-accent transition-colors hover:text-fg">
          Estimate your reach →
        </Link>
      </p>
    </section>
  );
}
