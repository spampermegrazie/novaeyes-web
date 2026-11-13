import Link from "next/link";
import { verticals } from "@/content/verticals";
import { RailArrows } from "./ui/rail-arrows";

// Homepage: every kind of content we clip, each as a small clip in the feed showing what that
// campaign looks like. One sideways row: arrows on desktop, swipe on phones, so the section stays
// one row tall however many services there are.
// Motion lives in globals.css (wc-*) and stops with reduced motion.

const BLURBS: Record<string, string> = {
  "/sports-clipping": "Any sport, from match footage to behind the scenes, cut into clips.",
  "/combat-sports-clipping": "Fight footage cut into thousands of highlight clips.",
  "/music-clipping": "Your song in thousands of clips, so people go and stream it.",
  "/podcast-clipping": "Episodes turned into clips that bring new listeners to the show.",
  "/logo-clipping": "Your logo and promo code on clips that already perform.",
  "/product-clipping": "Creators showing your product in new short clips.",
};

function Sport() {
  return (
    <>
      <svg viewBox="0 0 84 150" className="absolute inset-0 h-full w-full" aria-hidden>
        <rect x="12" y="22" width="60" height="96" rx="3" fill="rgb(255 255 255 / 0.02)" stroke="rgb(255 255 255 / 0.22)" strokeWidth="1" />
        <line x1="12" y1="70" x2="72" y2="70" stroke="rgb(255 255 255 / 0.18)" strokeWidth="1" />
        <circle cx="42" cy="70" r="9" fill="none" stroke="rgb(255 255 255 / 0.18)" strokeWidth="1" />
        <rect x="29" y="22" width="26" height="11" fill="none" stroke="rgb(255 255 255 / 0.22)" strokeWidth="1" />
        <line x1="35" y1="21" x2="49" y2="21" strokeWidth="2.4" strokeLinecap="round" className="wc-net" />
        <circle cx="42" cy="104" r="3.2" fill="#fff" className="wc-shot" style={{ filter: "drop-shadow(0 0 4px rgb(255 255 255 / 0.6))" }} />
      </svg>
      <div className="absolute inset-x-0 bottom-6 flex justify-center" aria-hidden>
        <span className="wc-pill rounded-full bg-accent px-2 py-0.5 text-[7px] font-semibold whitespace-nowrap text-white shadow-[0_0_12px_rgb(var(--glow)/0.7)]" style={{ animationDelay: "-3.28s" }}>
          Goal
        </span>
      </div>
    </>
  );
}

function Fight() {
  const pts = Array.from({ length: 8 }, (_, i) => {
    const a = (Math.PI / 4) * i + Math.PI / 8;
    return `${(42 + Math.cos(a) * 24).toFixed(1)},${(64 + Math.sin(a) * 24).toFixed(1)}`;
  }).join(" ");
  return (
    <svg viewBox="0 0 84 150" className="absolute inset-0 h-full w-full" aria-hidden>
      <polygon points={pts} fill="rgb(255 255 255 / 0.03)" stroke="rgb(255 255 255 / 0.28)" strokeWidth="1.2" />
      <circle cx="42" cy="64" r="9" fill="none" stroke="var(--accent)" strokeWidth="1.6" className="wc-impact" />
      <circle cx="42" cy="64" r="9" fill="none" stroke="var(--accent)" strokeWidth="1.2" className="wc-impact" style={{ animationDelay: "-1.2s" }} />
      <circle cx="42" cy="64" r="3" fill="var(--accent)" style={{ filter: "drop-shadow(0 0 5px rgb(59 130 246))" }} />
      {/* the fight timeline, with the highlight being cut out */}
      <rect x="10" y="112" width="64" height="5" rx="2.5" fill="rgb(255 255 255 / 0.12)" />
      {[18, 30, 47, 61].map((x) => (
        <rect key={x} x={x} y="110" width="1.4" height="9" rx="0.7" fill="rgb(255 255 255 / 0.35)" />
      ))}
      <rect x="10" y="111" width="16" height="7" rx="3.5" fill="none" stroke="var(--accent)" strokeWidth="1.4" className="wc-cut" />
    </svg>
  );
}

function Music() {
  return (
    <>
      <svg viewBox="0 0 24 24" className="absolute top-[38%] left-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 text-white/20" aria-hidden>
        <path fill="currentColor" d="M9 18.5a3 3 0 1 1-2-2.83V5.5l11-2.5v12a3 3 0 1 1-2-2.83V7.6l-7 1.6v9.3Z" />
      </svg>
      <div className="absolute bottom-6 left-2.5 flex h-8 items-end gap-[3px]" aria-hidden>
        {[0, 1, 2, 3, 4].map((i) => (
          <span key={i} className="wc-eq h-full w-1 rounded-sm bg-accent" style={{ animationDelay: `${-i * 0.27}s`, animationDuration: `${0.8 + (i % 3) * 0.2}s` }} />
        ))}
      </div>
      <span
        aria-hidden
        className="wc-spin absolute right-2 bottom-5 h-5 w-5 rounded-full border-[3px] border-[#2b2f40] bg-[conic-gradient(from_0deg,#3b82f6,#1e2232,#3b82f6)]"
      />
    </>
  );
}

const CAPTION = [
  [14, 10, 18],
  [12, 20, 8],
];

function Podcast() {
  return (
    <>
      <div className="absolute top-[22%] left-1/2 flex -translate-x-1/2 gap-2" aria-hidden>
        {[0, 1].map((i) => (
          <span key={i} className="flex h-7 w-7 items-center justify-center rounded-full border border-white/15 bg-[#232738]">
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-white/55">
              <path fill="currentColor" d="M12 14a3 3 0 0 0 3-3V5a3 3 0 1 0-6 0v6a3 3 0 0 0 3 3Zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.92V21h2v-3.08A7 7 0 0 0 19 11h-2Z" />
            </svg>
          </span>
        ))}
      </div>
      {/* subtitles, word by word */}
      <div className="absolute inset-x-2.5 bottom-7 space-y-1.5" aria-hidden>
        {CAPTION.map((line, li) => (
          <div key={li} className="flex justify-center gap-1">
            {line.map((w, wi) => {
              const i = li * line.length + wi;
              return <span key={i} className="wc-word h-2 rounded-full" style={{ width: w, animationDelay: `${i * 0.5}s` }} />;
            })}
          </div>
        ))}
      </div>
    </>
  );
}

function LogoSpot() {
  return (
    <>
      <span aria-hidden className="wc-glow absolute top-2.5 right-2.5 flex h-6 w-6 items-center justify-center rounded-md bg-white/90">
        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5">
          <circle cx="6" cy="8" r="3.6" fill="var(--accent)" />
          <path d="M9 4.5 14 12H8.5Z" fill="#12131a" />
        </svg>
      </span>
      <svg viewBox="0 0 24 24" className="absolute top-1/2 left-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 text-white/20" aria-hidden>
        <path fill="currentColor" d="M8 5.5v13l10-6.5-10-6.5Z" />
      </svg>
      <div className="absolute inset-x-0 bottom-6 flex justify-center" aria-hidden>
        <span className="wc-pill rounded-full bg-accent px-2 py-0.5 font-[family-name:var(--font-geist-mono)] text-[7px] whitespace-nowrap text-white shadow-[0_0_12px_rgb(var(--glow)/0.7)]">
          code SAVE20
        </span>
      </div>
    </>
  );
}

function Product() {
  return (
    <>
      <svg viewBox="0 0 40 64" className="wc-bob absolute top-[20%] left-1/2 h-16 w-10 -translate-x-1/2" aria-hidden>
        <rect x="14" y="2" width="12" height="9" rx="2" fill="#3a3f55" />
        <rect x="6" y="10" width="28" height="50" rx="8" fill="url(#wc-bottle)" stroke="rgb(255 255 255 / 0.2)" />
        <rect x="11" y="28" width="18" height="12" rx="2" fill="rgb(255 255 255 / 0.85)" />
        <rect x="14" y="32" width="12" height="1.8" rx="0.9" fill="var(--accent)" />
        <rect x="14" y="35.5" width="8" height="1.6" rx="0.8" fill="#9aa0ad" />
        <defs>
          <linearGradient id="wc-bottle" x1="0" x2="1">
            <stop offset="0" stopColor="#2b3a66" />
            <stop offset="1" stopColor="#1a2033" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-x-0 bottom-6 flex justify-center" aria-hidden>
        <span className="wc-pill flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-[7px] font-semibold whitespace-nowrap text-[#12131a]">
          <svg viewBox="0 0 16 16" className="h-2 w-2">
            <path fill="currentColor" d="M3 5h10l-1 9H4L3 5Zm2.5 0a2.5 2.5 0 0 1 5 0h-1.4a1.1 1.1 0 0 0-2.2 0H5.5Z" />
          </svg>
          Shop now
        </span>
      </div>
    </>
  );
}

const SCENES: Record<string, () => React.ReactNode> = {
  "/sports-clipping": Sport,
  "/combat-sports-clipping": Fight,
  "/music-clipping": Music,
  "/podcast-clipping": Podcast,
  "/logo-clipping": LogoSpot,
  "/product-clipping": Product,
};

// The small clip for one vertical (84x150). Scale it with a wrapper for bigger uses.
export function ClipPhone({ path, delay = 0, hoverGlow = false }: { path: string; delay?: number; hoverGlow?: boolean }) {
  const Scene = SCENES[path];
  return (
    <div
      className={`relative h-[150px] w-[84px] overflow-hidden rounded-xl border border-white/10 bg-[linear-gradient(160deg,#1e2232_0%,#0f1018_60%,#13213f_100%)] shadow-[0_14px_30px_rgb(0_0_0/0.45)] transition-shadow duration-300 ${
        hoverGlow ? "group-hover:shadow-[0_14px_30px_rgb(0_0_0/0.45),0_0_28px_rgb(var(--glow)/0.35)]" : ""
      }`}
    >
      {Scene && <Scene />}
      <div className="absolute inset-x-2 bottom-2 h-0.5 overflow-hidden rounded-full bg-white/15" aria-hidden>
        <div className="wc-progress h-full bg-white/70" style={{ animationDelay: `${delay}s` }} />
      </div>
    </div>
  );
}

type WhoProps = {
  // Leave one vertical out (its own service page).
  exclude?: string;
  eyebrow?: string;
  title?: React.ReactNode;
  className?: string;
};

export function WhoWeClipFor({
  exclude,
  eyebrow = "Who we clip for",
  title = (
    <>
      Every kind of content. <span className="text-muted">One network.</span>
    </>
  ),
  className = "pb-24",
}: WhoProps) {
  const list = verticals.filter((v) => v.path !== exclude);
  const railId = exclude ? "other-services-rail" : "services-rail";
  return (
    <section id={exclude ? "other-services" : "who-we-clip-for"} className={`mx-auto max-w-6xl px-6 sm:px-10 lg:px-12 ${className}`}>
      <div className="flex items-end justify-between gap-6">
        <div>
          <p className="font-label text-[10px] tracking-[0.14em] text-muted uppercase">{eyebrow}</p>
          <h2 className="mt-4 max-w-3xl text-3xl tracking-tight text-balance sm:text-4xl">{title}</h2>
        </div>
        <RailArrows targetId={railId} label="services" />
      </div>

      <ul
        id={railId}
        className="-mx-6 mt-8 flex snap-x snap-mandatory scroll-px-6 gap-3 overflow-x-auto px-6 pt-2 pb-2 [scrollbar-width:none] sm:-mx-10 sm:scroll-px-10 sm:px-10 lg:mx-0 lg:scroll-px-0 lg:px-0 lg:[mask-image:linear-gradient(90deg,#000_93%,transparent)] [&::-webkit-scrollbar]:hidden"
      >
        {list.map((v, i) => (
          <li key={v.path} className="w-[68%] shrink-0 snap-start sm:w-[38%] lg:w-[calc((100%-2.25rem)/4.25)]">
            <Link
              href={v.path}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-bg-raised/40 transition-[border-color,translate,background-color] duration-300 hover:-translate-y-1 hover:border-accent/50 hover:bg-bg-raised/70"
            >
              <div className="relative flex h-48 items-center justify-center">
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(45%_55%_at_50%_55%,rgb(var(--glow)/0.16),transparent)] opacity-60 transition-opacity duration-300 group-hover:opacity-100"
                />
                <ClipPhone path={v.path} delay={-i * 1.7} hoverGlow />
              </div>
              <div className="flex flex-1 flex-col p-5 pt-4">
                <h3 className="flex items-center justify-between gap-2 text-base">
                  {v.h1}
                  <span className="text-muted transition-[color,translate] duration-300 group-hover:translate-x-0.5 group-hover:text-accent" aria-hidden>
                    →
                  </span>
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{BLURBS[v.path]}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
