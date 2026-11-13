import type { Metadata } from "next";
import Link from "next/link";
import { facts } from "@/content/facts";
import { Cta } from "@/components/cta";
import { StudioTour } from "@/components/studio-tour";
import { ShinyButton } from "@/components/ui/shiny-button";
import { JsonLd, faqJsonLd, breadcrumbJsonLd } from "@/components/json-ld";

// How it works (was /attention-monopoly-system, which now redirects here). The deep dive behind the
// homepage engine: the 3D studio, a timeline of who does what and when, where the budget goes, how
// views are verified, what you get, who it is for, and short answers. Facts match /faq word for word
// where they overlap (pricing, verification, reporting, timing).

export const metadata: Metadata = {
  title: "How a Clipping Campaign Works, Step by Step",
  description:
    "How a NovaEyes campaign runs: launch within 24 hours, thousands of clippers post your clips, every clip is reviewed, and you pay only for verified views.",
  alternates: { canonical: "/how-it-works" },
};

const AT_A_GLANCE = [
  { k: "Live within", v: "24 hours" },
  { k: "Campaigns from", v: facts.minimumBudgetLabel },
  { k: "You pay for", v: "Verified views" },
  { k: "You get", v: "Weekly reports" },
];

const TIMELINE = [
  {
    when: "Day 0",
    title: "Onboarding call",
    you: "Walk us through your content, your goal, your target audience, your brand rules and your budget.",
    us: "Turn it into one brief for the whole network: what to clip, what to avoid, who it is for, where to send people, and the payout per 1,000 views.",
  },
  {
    when: "Within 24 hours",
    title: "Launch",
    you: "Approve the brief.",
    us: "Launch the campaign to the network, within 24 hours of the onboarding call. The first clips usually go up within 48 hours of launch.",
  },
  {
    when: "Weeks 1 and 2",
    title: "Views build",
    you: "Watch it in your live dashboard, if you want to.",
    us: "Review every clip before it can earn, verify the views, and see which clips and formats spread as more clippers join.",
  },
  {
    when: "Every week",
    title: "Report and adjust",
    you: "Read the report and make the calls: what to scale, what to change, what to drop.",
    us: "Move the budget toward the clips and formats that perform, and update the brief.",
  },
  {
    when: "The end",
    title: "Final report",
    you: "Decide what comes next.",
    us: "Send the final numbers: verified views, CPM, clips posted, platform split and top clips. Budget left over rolls into the next campaign or is refunded, depending on your agreement.",
  },
];

const MONEY = [
  { n: "01", title: "You fund a view pool", body: "The pool is what pays the clippers. Your full cost, including our fee for running the campaign, is set out in writing before anything is signed." },
  { n: "02", title: "Clippers earn per verified view", body: "Each clipper is paid per 1,000 verified views on clips we approved. The best clips earn the most, so the network chases what works." },
  { n: "03", title: "Everything else costs nothing", body: "A clip that is not approved, or does not get views, earns nothing. Views that cannot be verified, or that come from outside your target audience, are not paid." },
];

const VERIFY = [
  "View counts come from TikTok, Instagram, YouTube and X themselves.",
  "Duplicates are removed.",
  "Each clip is checked against the account that posted it.",
  "Views must come from your target countries and audience. Clips that miss it are not paid, even if they go viral.",
  "Views that cannot be verified are not paid.",
];

const PRINCIPLES = [
  { title: "Steady beats viral", body: "You do not need one post to blow up. You need reach that shows up every week, so you can plan around it." },
  { title: "Volume beats perfect", body: "One good moment becomes dozens of clips with different hooks and cuts. More versions, more chances for one to take off." },
  { title: "Many pages beat one account", body: "When hundreds of pages post your clips, you do not depend on one account, one algorithm change or one lucky day." },
];

const YOU_GET = [
  { title: "A live dashboard", body: "Views, spend, CPM, clip count, platform split, audience by country, age and gender, and top clips, updated as new data comes in." },
  { title: "Weekly reports", body: "What to scale, what to change and what to drop, every week." },
  { title: "Every clip reviewed", body: "Checked against your brief and brand rules before it can earn a single view." },
  { title: "A final report", body: "The full picture when the campaign ends, so you know what the budget bought." },
];

const FIT = [
  "You want reach every week, not one spike",
  "You have content worth clipping, or a product worth showing",
  `You can put ${facts.minimumBudgetLabel} or more into a campaign`,
  "You want to pay for results, not for posts",
];

const NOT_FIT = [
  "You are hoping one viral post fixes everything",
  "You want to test it for a few days and stop",
  "You need guaranteed sales from the views",
  "You do not have the rights to the content",
];

const FAQS = [
  {
    q: "How does a NovaEyes campaign work?",
    a: "You send content, a goal, brand rules and a budget. We turn that into one brief, our network of clippers cuts the best moments and posts them on their own TikTok, Instagram, YouTube and X pages, every clip is reviewed, and you pay only for verified views. Every week the budget moves toward what performs.",
  },
  {
    q: "Is this paid ads?",
    a: "No. We do not buy ad placements. Every view comes from posts on real creator pages, and clippers are paid per verified view.",
  },
  {
    q: "Do I need a big audience?",
    a: "No. The clips go out on the clippers' pages, so your own follower count does not hold you back. The Sparkle campaign reached 4.7 million views in 3 days.",
  },
  {
    q: "How quickly do views come in?",
    a: `${facts.launchTime} The first clips usually go up within 48 hours of launch, and views build over the first one to two weeks as more clippers join and the best clips keep spreading.`,
  },
  {
    q: "Can you target a specific country or audience?",
    a: facts.targeting,
  },
  {
    q: "Can you guarantee a number of views?",
    a: "No. We aim for a CPM, not a fixed view count. Because clippers are paid per verified view, your budget turns into views at the agreed rate, but the final number depends on your content and the campaign settings.",
  },
];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="font-label text-[10px] tracking-[0.14em] text-muted uppercase">{children}</p>;
}

function Check({ muted = false }: { muted?: boolean }) {
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

export default function HowItWorks() {
  return (
    <>
      <JsonLd data={faqJsonLd(FAQS)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "How it works", path: "/how-it-works" },
        ])}
      />

      <article>
        {/* hero */}
        <header className="mx-auto max-w-6xl px-6 pt-16 pb-12 sm:px-10 lg:px-12 lg:pt-20">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-y-1 font-label text-[10px] tracking-[0.14em] text-muted uppercase">
            <Link href="/" className="transition-colors hover:text-fg">
              Home
            </Link>
            <span className="mx-2 text-muted/50">/</span>
            <span className="text-fg/80">How it works</span>
          </nav>
          <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-end">
            <div>
              <h1 className="text-5xl leading-[1.02] font-bold tracking-tight text-balance sm:text-6xl">
                How NovaEyes works. <span className="text-muted">One brief in, verified views out.</span>
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-relaxed text-fg/85">
                A NovaEyes campaign runs as a weekly loop. You send your content and a budget, and we launch within 24 hours of the onboarding call. Our network of{" "}
                {facts.clippersLabel} clippers cuts the best moments into short clips and posts them on their own TikTok,
                Instagram, YouTube and X pages. Every clip is reviewed, every view is verified against the audience you choose, and you pay only for
                the views that are.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <ShinyButton href="/book">Book a 15-minute reach audit</ShinyButton>
                <Link
                  href="/reach-estimator"
                  className="rounded-xl border border-line bg-bg/60 px-6 py-3 text-center font-display text-sm font-semibold backdrop-blur transition-colors hover:border-muted/50"
                >
                  Estimate your reach
                </Link>
              </div>
            </div>
            <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line">
              {AT_A_GLANCE.map((f) => (
                <div key={f.k} className="flex flex-col justify-between bg-bg px-5 py-5">
                  <dt className="text-xs text-muted">{f.k}</dt>
                  <dd className="mt-1.5 font-display text-xl font-bold tracking-tight sm:text-2xl">{f.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </header>

        {/* the studio, in 3D */}
        <section id="studio" className="mx-auto max-w-6xl scroll-mt-24 px-6 pb-24 sm:px-10 lg:px-12">
          <Eyebrow>The studio</Eyebrow>
          <h2 className="mt-4 mb-8 max-w-3xl text-3xl tracking-tight text-balance sm:text-4xl">
            Walk through it. <span className="text-muted">Eight stations, one loop.</span>
          </h2>
          <StudioTour />
        </section>

        {/* timeline: who does what, and when */}
        <section id="timeline" className="mx-auto max-w-6xl px-6 pb-24 sm:px-10 lg:px-12">
          <Eyebrow>Timeline</Eyebrow>
          <h2 className="mt-4 max-w-3xl text-3xl tracking-tight text-balance sm:text-4xl">
            What happens, and when. <span className="text-muted">You make the calls. We run the rest.</span>
          </h2>
          <ol className="relative mt-12">
            <span aria-hidden className="absolute top-2 bottom-2 left-[7px] w-px bg-gradient-to-b from-accent/70 via-accent/30 to-accent/0 lg:left-[183px]" />
            {TIMELINE.map((t, i) => (
              <li key={t.title} className="relative grid gap-4 pb-6 pl-10 last:pb-0 lg:grid-cols-[160px_minmax(0,1fr)] lg:gap-14 lg:pl-0">
                <span
                  aria-hidden
                  className="absolute top-1.5 left-0 h-[15px] w-[15px] rounded-full border-2 border-accent bg-bg shadow-[0_0_14px_rgb(var(--glow)/0.6)] lg:left-[176px]"
                />
                <div className="lg:pt-0.5 lg:text-right">
                  <p className="font-label text-[10px] tracking-[0.14em] text-accent uppercase">{t.when}</p>
                  <h3 className="mt-1.5 text-xl tracking-tight">
                    <span className="sr-only">Step {i + 1}: </span>
                    {t.title}
                  </h3>
                </div>
                <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
                  <div className="bg-bg-raised/60 p-5">
                    <p className="font-label text-[9px] tracking-[0.14em] text-muted uppercase">You</p>
                    <p className="mt-2 leading-relaxed text-fg/85">{t.you}</p>
                  </div>
                  <div className="bg-bg p-5">
                    <p className="font-label text-[9px] tracking-[0.14em] text-accent uppercase">NovaEyes</p>
                    <p className="mt-2 leading-relaxed text-fg/85">{t.us}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* where the budget goes */}
        <section id="budget" className="mx-auto max-w-6xl px-6 pb-24 sm:px-10 lg:px-12">
          <Eyebrow>Your budget</Eyebrow>
          <h2 className="mt-4 max-w-3xl text-3xl tracking-tight text-balance sm:text-4xl">
            Where does the budget go? <span className="text-muted">Only verified views get paid.</span>
          </h2>
          <ol className="mt-10 grid gap-4 md:grid-cols-3">
            {MONEY.map((m, i) => (
              <li key={m.n} className="relative rounded-2xl border border-line bg-bg-raised/40 p-6 sm:p-7">
                <p className="font-label text-[10px] tracking-[0.14em] text-accent">{m.n}</p>
                <h3 className="mt-3 text-xl tracking-tight">{m.title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{m.body}</p>
                {i < MONEY.length - 1 && (
                  <span
                    aria-hidden
                    className="absolute top-1/2 -right-[13px] z-10 hidden h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-bg text-xs text-accent md:flex"
                  >
                    →
                  </span>
                )}
              </li>
            ))}
          </ol>
          <div className="mt-4 grid gap-4 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
            <div className="rounded-2xl border border-accent/40 bg-accent/[0.05] p-6 shadow-[0_0_40px_rgb(var(--glow)/0.08)] sm:p-7">
              <h3 className="text-xl tracking-tight">How are views verified?</h3>
              <ul className="mt-4 space-y-2.5">
                {VERIFY.map((v) => (
                  <li key={v} className="flex gap-3 leading-relaxed text-fg/85">
                    <Check />
                    {v}
                  </li>
                ))}
              </ul>
            </div>
            <ul className="space-y-2.5 rounded-2xl border border-line bg-bg-raised/40 p-6 font-[family-name:var(--font-geist-mono)] text-xs sm:p-7" aria-label="Example payouts">
              <li className="pb-1 font-label text-[9px] tracking-[0.14em] text-muted uppercase">Example payouts</li>
              {[
                { id: "clip 0841", state: "approved, 212K verified views", paid: true },
                { id: "clip 0842", state: "not approved", paid: false },
                { id: "clip 0843", state: "approved, 48K verified views", paid: true },
                { id: "clip 0844", state: "approved, views not verified", paid: false },
              ].map((r) => (
                <li key={r.id} className="flex items-center justify-between gap-4 rounded-lg border border-line bg-bg px-3.5 py-2.5">
                  <span className="text-muted">{r.id}</span>
                  <span className="hidden flex-1 text-muted/80 sm:block">{r.state}</span>
                  <span className={r.paid ? "text-accent" : "text-muted/60"}>{r.paid ? "paid" : "$0"}</span>
                </li>
              ))}
              <li className="pt-1 font-sans text-[11px] text-muted">Illustration only. Real payouts follow the rate in your brief.</li>
            </ul>
          </div>
          <Link href="/pricing" className="mt-6 inline-block font-display text-sm font-semibold text-accent transition-colors hover:text-fg">
            See pricing →
          </Link>
        </section>

        {/* why it works */}
        <section id="why" className="mx-auto max-w-6xl px-6 pb-24 sm:px-10 lg:px-12">
          <Eyebrow>Why it works</Eyebrow>
          <h2 className="mt-4 max-w-3xl text-3xl tracking-tight text-balance sm:text-4xl">
            Why does this beat posting on your own? <span className="text-muted">Three reasons.</span>
          </h2>
          <ul className="mt-10 grid gap-4 md:grid-cols-3">
            {PRINCIPLES.map((p, i) => (
              <li key={p.title} className="rounded-2xl border border-line bg-bg-raised/40 p-6 sm:p-7">
                <p className="font-label text-[10px] tracking-[0.14em] text-accent">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-3 text-xl tracking-tight">{p.title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{p.body}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* what you get */}
        <section id="you-get" className="mx-auto max-w-6xl px-6 pb-24 sm:px-10 lg:px-12">
          <Eyebrow>What you get</Eyebrow>
          <h2 className="mt-4 max-w-3xl text-3xl tracking-tight text-balance sm:text-4xl">
            What do you get? <span className="text-muted">Numbers you can check, every week.</span>
          </h2>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {YOU_GET.map((g) => (
              <li key={g.title} className="rounded-2xl border border-line bg-bg-raised/40 p-6">
                <h3 className="text-lg tracking-tight">{g.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{g.body}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* fit */}
        <section id="fit" className="mx-auto grid max-w-6xl gap-4 px-6 pb-24 sm:px-10 md:grid-cols-2 lg:px-12">
          <div className="rounded-2xl border border-accent/40 bg-accent/[0.05] p-6 sm:p-8">
            <Eyebrow>Good fit</Eyebrow>
            <h2 className="mt-3 text-2xl tracking-tight">This is for you if</h2>
            <ul className="mt-6 space-y-3">
              {FIT.map((f) => (
                <li key={f} className="flex gap-3 leading-relaxed text-fg/85">
                  <Check />
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-line bg-bg-raised/40 p-6 sm:p-8">
            <Eyebrow>Not a fit</Eyebrow>
            <h2 className="mt-3 text-2xl tracking-tight">This is not for you if</h2>
            <ul className="mt-6 space-y-3">
              {NOT_FIT.map((f) => (
                <li key={f} className="flex gap-3 leading-relaxed text-muted">
                  <Check muted />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* short answers */}
        <section id="faq" className="mx-auto max-w-6xl px-6 pb-24 sm:px-10 lg:px-12">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-16">
            <div>
              <Eyebrow>FAQ</Eyebrow>
              <h2 className="mt-4 text-3xl tracking-tight text-balance sm:text-4xl">
                Questions. <span className="text-muted">Short answers.</span>
              </h2>
              <Link href="/faq" className="mt-6 inline-block font-display text-sm font-semibold text-accent transition-colors hover:text-fg">
                All questions →
              </Link>
            </div>
            <dl className="space-y-3">
              {FAQS.map((f, i) => (
                <div key={f.q} className="rounded-2xl border border-line bg-bg-raised/40 p-5 sm:p-6">
                  <dt className="flex gap-4 font-display font-semibold">
                    <span className="font-label text-[10px] leading-6 tracking-[0.14em] text-accent">{String(i + 1).padStart(2, "0")}</span>
                    {f.q}
                  </dt>
                  <dd className="mt-2 leading-relaxed text-muted sm:pl-9">{f.a}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      </article>
      <Cta />
    </>
  );
}
