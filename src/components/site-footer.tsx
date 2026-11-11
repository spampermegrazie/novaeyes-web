import Link from "next/link";
import { facts, nav, verticalLinks } from "@/content/facts";
import { Logo } from "./brand";

export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">{facts.oneLiner}</p>
          <p className="mt-4 text-sm text-muted">
            Founded {facts.foundingYear} in {facts.location}.
          </p>
        </div>
        <div>
          <p className="font-label text-[10px] tracking-[0.14em] text-muted uppercase">Clipping for</p>
          <ul className="mt-4 space-y-2 text-sm">
            {verticalLinks.map((v) => (
              <li key={v.href}>
                <Link href={v.href} className="text-muted hover:text-fg">
                  {v.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-label text-[10px] tracking-[0.14em] text-muted uppercase">Company</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link href="/about" className="text-muted hover:text-fg">
                About
              </Link>
            </li>
            <li>
              <Link href="/attention-monopoly-system" className="text-muted hover:text-fg">
                How we run campaigns
              </Link>
            </li>
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-muted hover:text-fg">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/best-clipping-agencies" className="text-muted hover:text-fg">
                Best clipping agencies
              </Link>
            </li>
            <li>
              <Link href="/book" className="text-muted hover:text-fg">
                Book a call
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
