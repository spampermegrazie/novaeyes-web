import Link from "next/link";
import { nav } from "@/content/facts";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-line/60 bg-bg/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="font-label text-[13px] tracking-[0.12em] uppercase">
          NovaEyes
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-7 font-display text-sm font-medium text-muted md:flex">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="transition-colors hover:text-fg">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          {/* Dashboard lives in another zone, so a plain anchor, not <Link>. */}
          <a href="/app" className="hidden font-display text-sm font-medium text-muted hover:text-fg sm:inline">
            Client login
          </a>
          <Link
            href="/book"
            className="font-display font-semibold rounded-full bg-accent px-4 py-2 text-sm text-accent-ink transition-opacity hover:opacity-90"
          >
            Book a call
          </Link>
        </div>
      </div>
    </header>
  );
}
