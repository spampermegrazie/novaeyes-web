import Link from "next/link";
import { siInstagram, siTiktok, siX, siYoutubeshorts } from "simple-icons";

// Pricing page infographics. Server-rendered: every label is in the HTML. Motion lives in
// globals.css (pr-*, plus the homepage's ne-*, wi-* and wa-* classes) and stops with reduced motion.

const PLATFORMS = [siTiktok, siInstagram, siYoutubeshorts, siX];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="font-label text-[10px] tracking-[0.14em] text-muted uppercase">{children}</p>;
}

/* What the management fee covers: the campaign pipeline, left to right. */

const COVERS = [
  { title: "Strategy and brief", body: "One brief for the whole network", icon: "M7 3h7l4 4v14H7zM14 3v4h4M10 12h5M10 16h5" },
  { title: "Clipper network", body: "Briefed, managed and paid", icon: "M12 7.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM5 21.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM19 21.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM10.8 7.2 6.2 16.8M13.2 7.2l4.6 9.6M7.5 19h9" },
  { title: "Clip review", body: "Every clip, before it can earn", icon: "M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12ZM12 14.8a2.8 2.8 0 1 0 0-5.6 2.8 2.8 0 0 0 0 5.6Z" },
  { title: "View verification", body: "Real views, from your audience", icon: "M12 2.8 19.5 6v5.6c0 4.6-3.1 8-7.5 9.6-4.4-1.6-7.5-5-7.5-9.6V6ZM8.8 12l2.2 2.2 4.3-4.4" },
  { title: "Live dashboard", body: "Views, spend, CPM and audience", icon: "M4 20.5V11M10 20.5V4M16 20.5V13.5M21 20.5H3" },
  { title: "Weekly reports", body: "Budget moved to what works", icon: "M4 5.5h16v15H4zM4 10h16M8.5 3v4M15.5 3v4M8 14.5h3M8 17.5h6" },
];

export function FeeCovers() {
  return (
    <ol className="relative mt-12 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-6 lg:gap-x-2">
      <span aria-hidden className="absolute top-7 right-[8%] left-[8%] hidden h-px bg-gradient-to-r from-accent/0 via-accent/50 to-accent/0 lg:block" />
      {COVERS.map((c, i) => (
        <li key={c.title} className="relative flex flex-col items-center text-center">
          <span className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-accent/35 bg-bg shadow-[0_0_28px_rgb(var(--glow)/0.16)]">
            <span aria-hidden className="pr-pulse absolute inset-0 rounded-2xl border border-accent/30" style={{ animationDelay: `${i * 0.35}s` }} />
            <svg viewBox="0 0 24 24" className="h-6 w-6 text-accent" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d={c.icon} />
            </svg>
          </span>
          <span className="mt-4 font-display text-sm font-semibold tracking-tight">{c.title}</span>
          <span className="mt-1 max-w-[11rem] text-xs leading-relaxed text-muted">{c.body}</span>
        </li>
      ))}
    </ol>
  );
}

/* What decides the fee: three tiles, each with its own small picture. */

function ComplexityPic() {
  const rows = [
    { kind: "icons" as const },
    { kind: "chips" as const, items: ["US", "UK", "DE", "IT", "UAE"] },
    { kind: "chips" as const, items: ["English", "German", "Slideshows"] },
  ];
  let n = 0;
  return (
    <div className="flex w-full max-w-64 flex-col items-center gap-2.5">
      {rows.map((r, ri) =>
        r.kind === "icons" ? (
          <div key={ri} className="flex gap-2">
            {PLATFORMS.map((p) => {
              const d = (n++ * 0.42).toFixed(2);
              return (
                <span key={p.title} className="pr-lit flex h-9 w-9 items-center justify-center rounded-lg border border-line text-muted" style={{ animationDelay: `${d}s` }}>
                  <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
                    <path d={p.path} fill="currentColor" />
                  </svg>
                </span>
              );
            })}
          </div>
        ) : (
          <div key={ri} className="flex flex-wrap justify-center gap-2">
            {r.items.map((t) => {
              const d = (n++ * 0.42).toFixed(2);
              return (
                <span key={t} className="pr-lit rounded-full border border-line px-2.5 py-1 font-label text-[9px] tracking-[0.12em] text-muted uppercase" style={{ animationDelay: `${d}s` }}>
                  {t}
                </span>
              );
            })}
          </div>
        ),
      )}
    </div>
  );
}

function DeadlinePic() {
  const days = Array.from({ length: 14 }, (_, i) => i);
  const launch = 11;
  return (
    <div className="w-full max-w-64">
      <div className="mb-2 flex justify-between font-label text-[9px] tracking-[0.14em] text-muted uppercase">
        <span>Brief</span>
        <span className="text-accent">Launch</span>
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {days.map((d) => {
          const window = d >= launch - 3 && d < launch;
          const isLaunch = d === launch;
          return (
            <span
              key={d}
              className={`relative flex aspect-square items-center justify-center rounded-md border font-[family-name:var(--font-geist-mono)] text-[9px] ${
                isLaunch
                  ? "border-accent bg-accent text-accent-ink shadow-[0_0_18px_rgb(var(--glow)/0.7)]"
                  : window
                    ? "border-accent/50 bg-[repeating-linear-gradient(135deg,rgb(var(--glow)/0.22)_0_3px,transparent_3px_6px)] text-fg/80"
                    : "border-line text-muted/60"
              }`}
            >
              {isLaunch && <span aria-hidden className="pr-pulse absolute -inset-1 rounded-lg border border-accent/60" />}
              {d + 1}
            </span>
          );
        })}
      </div>
      <p className="mt-2.5 text-center font-label text-[9px] tracking-[0.14em] text-muted uppercase">A fixed date, a tighter window</p>
    </div>
  );
}

function ScalePic() {
  const bars = [0.22, 0.38, 0.55, 0.74, 1];
  return (
    <div className="w-full max-w-64">
      <div className="flex h-28 items-end justify-center gap-3">
        {bars.map((h, i) => (
          <span key={i} className="relative flex h-full w-8 items-end">
            <span
              className="pr-rise block w-full rounded-t-md bg-gradient-to-t from-[#1e3a8a] to-accent shadow-[0_0_16px_rgb(var(--glow)/0.3)]"
              style={{ height: `${h * 100}%`, animationDelay: `${i * 0.18}s` }}
            />
          </span>
        ))}
      </div>
      <div className="mt-2 h-px bg-line" />
      <p className="mt-2.5 text-center font-label text-[9px] tracking-[0.14em] text-muted uppercase">Budget, clippers, clips, markets</p>
    </div>
  );
}

const DRIVERS = [
  { n: "01", title: "Complexity", body: "Formats, platforms, countries, languages, audience targeting and brand rules. More moving parts, more briefing and review.", Pic: ComplexityPic },
  { n: "02", title: "Deadlines", body: "A release, a fight night, a drop. A fixed date means clippers briefed and clips reviewed in a tighter window.", Pic: DeadlinePic },
  { n: "03", title: "Scale", body: "The size of the budget and how many clippers, clips and markets the campaign runs on.", Pic: ScalePic },
];

export function FeeDrivers() {
  return (
    <ul className="mt-12 grid gap-4 lg:grid-cols-3">
      {DRIVERS.map(({ n, title, body, Pic }) => (
        <li key={n} className="relative flex flex-col overflow-hidden rounded-2xl border border-line bg-bg-raised/40">
          <div className="relative flex h-52 items-center justify-center px-6 pt-6">
            <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-[radial-gradient(60%_100%_at_50%_100%,rgb(var(--glow)/0.1),transparent)]" />
            <div className="relative flex w-full justify-center" aria-hidden>
              <Pic />
            </div>
          </div>
          <div className="p-6 pt-5">
            <p className="font-label text-[10px] tracking-[0.14em] text-accent">{n}</p>
            <h3 className="mt-2 text-lg">{title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">{body}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

/* What the view pool pays for: four clips, one paid. */

const CLIPS = [
  { title: "Approved, in your audience", body: "Paid per 1,000 verified views", paid: true, platform: siTiktok, views: "212K" },
  { title: "Not approved", body: "Broke the brief or the brand rules", paid: false, platform: siInstagram, views: "96K" },
  { title: "Outside your audience", body: "Viewers not in your countries or demos", paid: false, platform: siYoutubeshorts, views: "1.4M" },
  { title: "Views not verified", body: "Can't be confirmed on the platform", paid: false, platform: siX, views: "48K" },
];

export function PayoutClips() {
  return (
    <ul className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">
      {CLIPS.map((c, i) => (
        <li key={c.title} className="flex flex-col items-center text-center">
          <div
            aria-hidden
            className={`relative aspect-[9/15] w-full max-w-[150px] overflow-hidden rounded-2xl border ${
              c.paid
                ? "border-accent/70 bg-gradient-to-b from-[#2563eb]/60 via-[#1e3a8a] to-[#0b1230] shadow-[0_0_40px_rgb(var(--glow)/0.35)]"
                : "border-line bg-gradient-to-b from-[#20222c] to-[#111218]"
            }`}
          >
            <span className="absolute top-2.5 left-2.5 flex h-6 w-6 items-center justify-center rounded-md bg-black/30">
              <svg viewBox="0 0 24 24" className="h-3 w-3">
                <path d={c.platform.path} fill="var(--fg)" />
              </svg>
            </span>
            <span className="absolute top-3 right-2.5 font-[family-name:var(--font-geist-mono)] text-[9px] text-fg/70">{c.views}</span>
            <span className={`absolute top-1/2 left-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full ${c.paid ? "bg-white/15" : "bg-white/5"}`}>
              <svg viewBox="0 0 16 16" className={`ml-0.5 h-4 w-4 ${c.paid ? "text-fg" : "text-fg/40"}`} fill="currentColor">
                <path d="M4 2.5v11l9-5.5z" />
              </svg>
            </span>
            <span className="absolute inset-x-2.5 bottom-12 h-1 overflow-hidden rounded-full bg-white/10">
              <span className={`wc-progress block h-full rounded-full ${c.paid ? "bg-accent" : "bg-white/25"}`} style={{ animationDelay: `${-i * 1.7}s` }} />
            </span>
            <span
              className={`absolute inset-x-2.5 bottom-2.5 flex items-center justify-center gap-1.5 rounded-lg py-1.5 font-display text-xs font-bold ${
                c.paid ? "bg-accent text-accent-ink shadow-[0_0_16px_rgb(var(--glow)/0.6)]" : "border border-dashed border-white/15 text-muted"
              }`}
            >
              {c.paid ? (
                <>
                  <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m3.5 8.5 3 3 6-7" />
                  </svg>
                  Paid
                </>
              ) : (
                "$0"
              )}
            </span>
          </div>
          <span className={`mt-4 font-display text-sm font-semibold tracking-tight ${c.paid ? "text-fg" : "text-fg/80"}`}>{c.title}</span>
          <span className={`mt-1 max-w-[12rem] text-xs leading-relaxed ${c.paid ? "text-accent" : "text-muted"}`}>{c.body}</span>
        </li>
      ))}
    </ul>
  );
}

/* Past CPMs as a bar chart. */

type Row = { slug: string; client: string; category: string; viewsLabel: string; cpm: number; spend?: string };
const AXIS_MAX = 0.5;

export function CpmChart({ rows }: { rows: Row[] }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-line bg-bg-raised/30 p-6 sm:p-8">
      <div aria-hidden className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-[radial-gradient(closest-side,rgb(var(--glow)/0.14),transparent)]" />
      <div className="relative">
        <div className="flex items-baseline justify-between gap-4">
          <p className="font-label text-[9px] tracking-[0.14em] text-muted uppercase">Cost per 1,000 views</p>
          <p className="font-label text-[9px] tracking-[0.14em] text-muted uppercase">Verified views</p>
        </div>
        <ul className="mt-4">
          {rows.map((r) => (
            <li key={r.slug} className="grid grid-cols-[minmax(0,6.5rem)_minmax(0,1fr)_3.5rem] items-center gap-3 border-t border-line py-3.5 sm:grid-cols-[minmax(0,9rem)_minmax(0,1fr)_4.5rem] sm:gap-4">
              <span className="min-w-0">
                <Link href={`/case-studies/${r.slug}`} className="block truncate font-display text-sm font-semibold transition-colors hover:text-accent">
                  {r.client}
                </Link>
                <span className="block truncate text-[11px] text-muted">{r.spend ? `${r.spend} budget` : r.category}</span>
              </span>
              <span className="flex min-w-0 items-center gap-2.5">
                <span className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-line">
                  <span
                    className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#1e3a8a] to-accent shadow-[0_0_12px_rgb(var(--glow)/0.5)]"
                    style={{ width: `${(r.cpm / AXIS_MAX) * 100}%` }}
                  />
                </span>
                <span className="w-10 shrink-0 font-display text-sm font-bold text-accent tabular-nums">${r.cpm.toFixed(2)}</span>
              </span>
              <span className="text-right font-display text-sm font-semibold tabular-nums">{r.viewsLabel}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 border-t border-line pt-4 text-xs text-muted">Shorter bar, cheaper views. CPMs as published in each case study.</p>
      </div>
    </div>
  );
}

/* Compared: one table, three columns, with a line showing how the cost moves against the views. */

const OPTIONS = [
  {
    name: "Clipping with NovaEyes",
    short: "NovaEyes",
    us: true,
    note: "Cost follows the views",
    views: "M0,60 C40,56 70,40 100,28 S140,10 160,6",
    cost: "M0,60 C40,57 70,45 100,34 S140,17 160,13",
  },
  {
    name: "Influencer deals",
    short: "Influencer",
    us: false,
    note: "Paid up front, whatever it gets",
    views: "M0,60 C30,54 60,50 100,49 S140,48 160,48",
    cost: "M0,60 L10,60 L10,12 L160,12",
  },
  {
    name: "Paid social ads",
    short: "Ads",
    us: false,
    note: "Price moves with the auction",
    views: "M0,60 C40,55 80,46 120,40 S150,36 160,35",
    cost: "M0,60 L16,50 L28,54 L44,40 L58,46 L74,32 L90,38 L106,24 L122,30 L138,18 L160,22",
  },
];

const ROWS = [
  { k: "You pay for", v: ["Verified views from your audience, plus a management fee", "Posts, usually at a flat rate per post or package", "Impressions, clicks or actions, bought in an auction"] },
  { k: "Price set by", v: ["A CPM agreed before launch", "The creator's rate", "The auction, which moves with demand"] },
  { k: "If a post flops", v: ["The clipper earns nothing from your pool", "The post is already paid for", "On impression bidding, you pay for what was served"] },
  { k: "Who posts", v: ["Thousands of clipper pages", "One creator, or a handful", "Your own account, as an ad"] },
  { k: "Commitment", v: ["Per campaign, no retainer", "Per deal", "Ongoing, while the ads run"] },
];

const GRID = "grid md:grid-cols-[9.5rem_repeat(3,minmax(0,1fr))]";
const usCell = "border-l-2 border-accent bg-accent/[0.07] md:border-l-0";

function CostLine({ o, i }: { o: (typeof OPTIONS)[number]; i: number }) {
  return (
    <svg viewBox="0 0 160 64" className="h-16 w-full max-w-72 overflow-visible" aria-hidden>
      <line x1="0" x2="160" y1="62" y2="62" stroke="var(--line)" />
      <path d={o.views} fill="none" stroke="var(--muted)" strokeOpacity="0.55" strokeWidth="1.4" strokeDasharray="3 3" />
      <path
        d={o.cost}
        fill="none"
        stroke={o.us ? "var(--accent)" : "var(--fg)"}
        strokeOpacity={o.us ? 1 : 0.65}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        className="pr-draw"
        style={{ animationDelay: `${i * 0.25}s`, filter: o.us ? "drop-shadow(0 0 5px rgb(59 130 246 / 0.8))" : undefined }}
      />
    </svg>
  );
}

export function CompareTable() {
  return (
    <div role="table" aria-label="Clipping pricing compared with influencer deals and paid social ads" className="mt-12 overflow-hidden rounded-3xl border border-line bg-bg-raised/20">
      {/* column headers (desktop) */}
      <div role="row" className={`${GRID} hidden md:grid`}>
        <div role="columnheader" className="p-5">
          <span className="sr-only">Compared on</span>
        </div>
        {OPTIONS.map((o) => (
          <div key={o.name} role="columnheader" className={`relative p-5 ${o.us ? "bg-accent/[0.07]" : ""}`}>
            {o.us && <span aria-hidden className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-accent/20 via-accent to-accent/20 shadow-[0_0_12px_rgb(var(--glow)/0.8)]" />}
            <span className={`font-display text-base font-semibold tracking-tight ${o.us ? "text-fg" : "text-fg/70"}`}>{o.name}</span>
          </div>
        ))}
      </div>

      {/* how the cost moves */}
      <div role="row" className={`${GRID} md:border-t md:border-line`}>
        <div role="rowheader" className="px-5 pt-5 pb-2 md:py-5">
          <span className="font-label text-[9px] tracking-[0.14em] text-muted uppercase">How cost moves</span>
          <span className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-[11px] text-muted md:flex-col">
            <span className="flex items-center gap-2">
              <span aria-hidden className="h-0.5 w-4 rounded-full bg-fg/70" />
              Cost
            </span>
            <span className="flex items-center gap-2">
              <span aria-hidden className="w-4 border-t-[1.5px] border-dashed border-muted/70" />
              Views
            </span>
          </span>
        </div>
        {OPTIONS.map((o, i) => (
          <div key={o.name} role="cell" className={`px-5 py-4 md:py-5 ${o.us ? usCell : ""}`}>
            <span className={`mb-2 block font-display text-sm font-semibold md:hidden ${o.us ? "text-fg" : "text-fg/70"}`}>{o.name}</span>
            <CostLine o={o} i={i} />
            <span className={`mt-2 block text-xs ${o.us ? "text-accent" : "text-muted"}`}>{o.note}</span>
          </div>
        ))}
      </div>

      {ROWS.map((r) => (
        <div key={r.k} role="row" className={`${GRID} border-t border-line`}>
          <div role="rowheader" className="px-5 pt-5 pb-2 md:py-5">
            <span className="font-label text-[9px] tracking-[0.14em] text-muted uppercase">{r.k}</span>
          </div>
          {r.v.map((v, i) => {
            const o = OPTIONS[i];
            return (
              <div key={o.name} role="cell" className={`px-5 py-2.5 text-sm leading-relaxed last:pb-5 md:py-5 md:last:pb-5 ${o.us ? `${usCell} text-fg/90` : "text-muted"}`}>
                <span className={`mr-2 font-label text-[8px] tracking-[0.14em] uppercase md:hidden ${o.us ? "text-accent" : "text-muted/70"}`}>{o.short}</span>
                {v}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export { Eyebrow };
