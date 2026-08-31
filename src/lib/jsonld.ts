import { t } from "@/lib/i18n";
import { SITE_URL, SITE_NAME, OG_IMAGE } from "@/lib/seo";

/** Verified lotmetrik social profiles (also linked in the site footer). */
export const SOCIAL_URLS = [
  "https://t.me/lotmetrik",
  "https://instagram.com/lotmetrik",
  "https://tiktok.com/@lotmetrik",
  "https://x.com/lotmetrik",
];

/** Sitewide Organization + Person + WebSite graph. */
export function siteGraphJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "lotmetrik",
        alternateName: SITE_NAME,
        url: SITE_URL,
        logo: `${SITE_URL}/icon-512.png`,
        sameAs: SOCIAL_URLS,
        founder: { "@id": `${SITE_URL}/#person` },
      },
      {
        "@type": "Person",
        "@id": `${SITE_URL}/#person`,
        name: "lotmetrik",
        alternateName: "@lotmetrik",
        url: SITE_URL,
        sameAs: SOCIAL_URLS,
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: SITE_NAME,
        url: SITE_URL,
        inLanguage: "en",
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
    ],
  };
}

/** FAQPage schema — content is rendered visibly in the About page. */
export function faqJsonLd() {
  const pairs: [Parameters<typeof t>[0], Parameters<typeof t>[0]][] = [
    ["faq.q1", "faq.a1"],
    ["faq.q2", "faq.a2"],
    ["faq.q3", "faq.a3"],
  ];
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: "en",
    mainEntity: pairs.map(([q, a]) => ({
      "@type": "Question",
      name: t(q),
      acceptedAnswer: { "@type": "Answer", text: t(a) },
    })),
  };
}

export function softwareJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE_NAME,
    description:
      "Trading drawdown and recovery calculator. Find out how much profit you need to recover from an investment loss.",
    url: SITE_URL,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    inLanguage: "en",
    image: OG_IMAGE,
    screenshot: OG_IMAGE,
    featureList: [
      "Drawdown to recovery calculator",
      "Percentage and equity input modes",
      "Recovery time estimator",
      "Scenario comparison",
      "Shareable result image",
    ],
    author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    creator: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
  };
}
