import Link from "next/link";
import type { ReactNode } from "react";

// Pill CTA with a light that runs around its border, a dot texture and an inner shimmer.
// Styles live in globals.css under .shiny-cta (plain CSS: styled-jsx needs a registry in
// the app directory, and the original font @import would load Inter a second time).
// Pass href for a link, onClick for a button. Size with Tailwind padding and text utilities.
type ShinyButtonProps = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
};

export function ShinyButton({ children, href, onClick, className = "" }: ShinyButtonProps) {
  const cls = `shiny-cta ${className}`;
  if (href) {
    return (
      <Link href={href} className={cls}>
        <span>{children}</span>
      </Link>
    );
  }
  return (
    <button type="button" className={cls} onClick={onClick}>
      <span>{children}</span>
    </button>
  );
}
