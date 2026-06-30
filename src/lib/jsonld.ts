import { t } from "@/lib/i18n";
import { SITE_URL, SITE_NAME, OG_IMAGE } from "@/lib/seo";

const AUTHOR_URL = "https://alfindigital.com";

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
    author: { "@type": "Person", name: "alfindigital", url: AUTHOR_URL },
    creator: { "@type": "Organization", name: "alfindigital", url: AUTHOR_URL },
  };
}
