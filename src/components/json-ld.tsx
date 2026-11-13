import { facts } from "@/content/facts";

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

const ORG_ID = `${facts.url}/#organization`;
const PERSON_ID = `${facts.url}/about#andrea-corindo`;

const founderPerson = {
  "@type": "Person",
  "@id": PERSON_ID,
  name: facts.founder,
  jobTitle: "Founder",
  image: `${facts.url}/andrea-corindo.jpg`,
  worksFor: { "@id": ORG_ID },
  sameAs: facts.founderProfiles,
};

// Site-wide graph: the organization and the website, linked by @id so every page's schema points at one entity.
export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": ORG_ID,
      name: facts.name,
      url: facts.url,
      description: facts.oneLiner,
      slogan: facts.tagline,
      logo: { "@type": "ImageObject", url: `${facts.url}/brand/novaeyes-mark-512.png`, width: 512, height: 512 },
      foundingDate: String(facts.foundingYear),
      founder: { "@id": PERSON_ID },
      email: "andrea@nova-eyes.com",
      address: { "@type": "PostalAddress", addressLocality: "Ferrara", addressCountry: "IT" },
      areaServed: "Worldwide",
      knowsAbout: [
        "Clipping campaigns",
        "Short-form video distribution",
        "Music promotion",
        "Podcast growth",
        "Sports marketing",
        "Combat sports marketing",
        "Game marketing",
        "App marketing",
        "TikTok slideshows",
        "Logo clipping",
      ],
      ...(facts.sameAs.length ? { sameAs: facts.sameAs } : {}),
    },
    {
      "@type": "WebSite",
      "@id": `${facts.url}/#website`,
      name: facts.name,
      url: facts.url,
      inLanguage: "en",
      publisher: { "@id": ORG_ID },
    },
    founderPerson,
  ],
};

export const aboutPageJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "AboutPage",
      "@id": `${facts.url}/about`,
      url: `${facts.url}/about`,
      name: "About NovaEyes",
      isPartOf: { "@id": `${facts.url}/#website` },
      about: { "@id": ORG_ID },
      mainEntity: { "@id": ORG_ID },
    },
  ],
};

export function faqJsonLd(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${facts.url}${item.path}`,
    })),
  };
}

export function serviceJsonLd(name: string, description: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url: `${facts.url}${path}`,
    provider: { "@id": ORG_ID },
    areaServed: "Worldwide",
  };
}
