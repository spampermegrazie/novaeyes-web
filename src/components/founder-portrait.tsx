import Image from "next/image";
import { facts } from "@/content/facts";

// Andrea's portrait in the case-study style: cut out, blue-tinted black and white,
// with a blue rim light baked into the image and a soft glow behind it.
// Source: public/andrea-corindo-portrait.webp (made from the founder photo).
export function FounderPortrait({ className = "" }: { className?: string }) {
  return (
    <div className={`relative isolate ${className}`}>
      <div
        aria-hidden
        className="pointer-events-none absolute top-[42%] left-1/2 -z-10 aspect-square w-[115%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(59_130_246/0.22),rgb(59_130_246/0.07)_45%,transparent)]"
      />
      <Image
        src="/andrea-corindo-portrait.webp"
        alt={`${facts.founder}, founder of NovaEyes`}
        width={900}
        height={762}
        sizes="(min-width: 1024px) 460px, 90vw"
        className="h-auto w-full"
      />
    </div>
  );
}
