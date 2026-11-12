import { facts, verticalLinks } from "@/content/facts";
import BeamWordmarkFooter, { type FooterColumn, type FooterSocial } from "@/components/ui/beam-wordmark-footer";

// Site footer: link columns over a giant NOVAEYES wordmark (Manrope ExtraBold, the heading face)
// that a slow beam of light runs through, lined up with the site's content column.
const columns: FooterColumn[] = [
  { title: "Clipping for", links: verticalLinks.map((v) => ({ label: v.label, href: v.href })) },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "How we run campaigns", href: "/attention-monopoly-system" },
      { label: "Case studies", href: "/case-studies" },
      { label: "Pricing", href: "/pricing" },
      { label: "Book a call", href: "/book" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Estimate reach", href: "/reach-estimator" },
      { label: "Blog", href: "/blog" },
      { label: "FAQ", href: "/faq" },
      { label: "Best clipping agencies", href: "/best-clipping-agencies" },
    ],
  },
];

// The founder's public profiles (the same ones in the site schema). Swap for company accounts once they exist.
const profile = (host: string) => facts.founderProfiles.find((u) => u.includes(host));
const socials: FooterSocial[] = [
  { label: "Andrea on Instagram", href: profile("instagram.com"), icon: "instagram" },
  { label: "Andrea on X", href: profile("x.com"), icon: "x" },
  { label: "Andrea on LinkedIn", href: profile("linkedin.com"), icon: "linkedin" },
].filter((s) => s.href) as FooterSocial[];

export function SiteFooter() {
  return (
    <BeamWordmarkFooter
      brand={facts.name}
      wordmark="NOVAEYES"
      company={facts.name}
      blurb={facts.oneLiner}
      credits={[
        { lead: `Founded in ${facts.foundingYear} in `, label: facts.location },
        { lead: "Led by ", label: facts.founder, href: "/about" },
      ]}
      socials={socials}
      columns={columns}
      background="#0d0d12"
      ink="#f2f2f2"
      muted="#757c8a"
      accent="#3b82f6"
      wordTop="#1e40af"
      wordFoot="#070a18"
      fontSans="var(--font-inter), ui-sans-serif, system-ui, sans-serif"
      wordFont="var(--font-manrope), ui-sans-serif, system-ui, sans-serif"
      wordTracking="-0.03em"
      wordWeight={800}
      labelFont="var(--font-label-face), ui-sans-serif, system-ui, sans-serif"
      // negative: the bottom of the letters sinks below the end of the page
      cut={-0.1}
      // the same content width and side padding as every section (max-w-6xl, px-6 sm:px-10 lg:px-12)
      className="[--bwf-gut:1.5rem] [--bwf-max:72rem] [--bwf-wgap:clamp(56px,11cqw,160px)] sm:[--bwf-gut:2.5rem] lg:[--bwf-gut:3rem]"
    />
  );
}
