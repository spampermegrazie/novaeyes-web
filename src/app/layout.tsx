import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { facts } from "@/content/facts";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { AttributionCapture } from "@/components/attribution-capture";
import { JsonLd, organizationJsonLd } from "@/components/json-ld";

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
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} h-full antialiased`}>
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
