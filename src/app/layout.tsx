import type { Metadata } from "next";
import { Inter, Manrope, Michroma } from "next/font/google";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { facts } from "@/content/facts";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { AttributionCapture } from "@/components/attribution-capture";
import { JsonLd, organizationJsonLd } from "@/components/json-ld";

// Typography: Manrope for headings, nav, buttons and stats. Inter for body text.
// Labels, eyebrows, section numbers and the logo are meant to be Azonix. Azonix is
// free for personal use only, so until a commercial license is bought, Michroma
// (same wide, technical feel, open license) stands in. To switch: put the licensed
// file in src/fonts and load it with next/font/local as --font-label-face.
const manrope = Manrope({ subsets: ["latin"], weight: ["500", "600", "700", "800"], variable: "--font-manrope", display: "swap" });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-inter", display: "swap" });
const label = Michroma({ subsets: ["latin"], weight: "400", variable: "--font-label-face", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(facts.url),
  title: {
    default: "NovaEyes: Performance-Based Clipping Agency",
    template: "%s | NovaEyes",
  },
  description: facts.oneLiner,
  openGraph: {
    type: "website",
    siteName: facts.name,
    url: facts.url,
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${manrope.variable} ${inter.variable} ${label.variable} ${GeistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <JsonLd data={organizationJsonLd} />
        <AttributionCapture />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
