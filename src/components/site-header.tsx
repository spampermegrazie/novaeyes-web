import Link from "next/link";
import { nav } from "@/content/facts";
import { Logo } from "./brand";
import { ShinyButton } from "./ui/shiny-button";
import { MobileMenu } from "./mobile-menu";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-line/60 bg-bg/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 sm:px-10 lg:px-12">
        <Link href="/" aria-label="NovaEyes home" className="text-fg">
          <Logo />
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-6 font-display text-sm font-medium whitespace-nowrap text-muted lg:flex xl:gap-7">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="transition-colors hover:text-fg">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Dashboard lives in another zone, so a plain anchor, not <Link>. */}
          <a href="/app" className="hidden font-display text-sm font-medium text-muted hover:text-fg sm:inline">
            Client login
          </a>
          <ShinyButton href="/book" className="px-3.5 py-2 text-[13px] whitespace-nowrap sm:px-4 sm:text-sm">
            Book a call
          </ShinyButton>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
