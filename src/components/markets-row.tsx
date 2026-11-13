import Link from "next/link";
import { locations } from "@/content/locations";

// A row of market links (homepage and service pages), so every location page is linked from the
// pages that carry the most weight, not only from the solutions hub and the footer.
export function MarketsRow({ className = "pb-24", label = "Campaigns for audiences in" }: { className?: string; label?: string }) {
  return (
    <nav aria-label="Campaign markets" className={`mx-auto max-w-6xl px-6 sm:px-10 lg:px-12 ${className}`}>
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-2 font-label text-[10px] tracking-[0.14em] text-muted uppercase">{label}</span>
        {locations.map((l) => (
          <Link
            key={l.slug}
            href={`/clipping-agency/${l.slug}`}
            className="rounded-xl border border-line bg-bg-raised/40 px-3 py-1.5 font-display text-[13px] font-semibold text-fg/85 transition-colors hover:border-accent/50 hover:text-fg"
          >
            {l.name === "United Arab Emirates" ? "UAE" : l.name}
          </Link>
        ))}
        <Link href="/solutions" className="ml-1 font-display text-[13px] font-semibold text-accent transition-colors hover:text-fg">
          All solutions →
        </Link>
      </div>
    </nav>
  );
}
