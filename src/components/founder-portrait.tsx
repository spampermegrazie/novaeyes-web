import Image from "next/image";
import { facts } from "@/content/facts";

// Andrea's portrait in the case-study style: cut out, blue-tinted black and white,
// clean edges. The blue comes from the page: a soft shadow that follows his outline
// and a faint glow behind him.
// Source: public/andrea-corindo-cutout.webp (made from the founder photo).
export function FounderPortrait({ className = "" }: { className?: string }) {
  return (
    <div className={`relative isolate ${className}`}>
      <div
        aria-hidden
        className="pointer-events-none absolute top-[42%] left-1/2 -z-10 aspect-square w-[110%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(59_130_246/0.14),rgb(59_130_246/0.05)_45%,transparent)]"
      />
      <Image
        src="/andrea-corindo-cutout.webp"
        alt={`${facts.founder}, founder of NovaEyes`}
        width={900}
        height={762}
        sizes="(min-width: 1024px) 460px, 90vw"
        className="h-auto w-full drop-shadow-[0_28px_56px_rgb(59_130_246/0.22)]"
      />
    </div>
  );
}
