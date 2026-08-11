import { site, priceRange, auditOffer } from "@/lib/site";
import { getPublishedVerticals } from "@/lib/verticals";
import { getIndustryBody } from "@/lib/industries";
import type { Faq } from "@/lib/verticals/types";

// Structured data for the home page: an Organization (remote, nationwide — not a
// ProfessionalService/LocalBusiness subtype, which requires a postal address this
// business does not have) describing the agency, its service area, plans, and
// expertise — plus a WebSite node and an FAQPage. Rendered server-side so Google
// and AI engines can parse the business, where it operates, what it offers, and
// the Q&A directly.
//
// The homepage is category-neutral (it links out to /industries/ and /pricing/ for
// per-industry specifics), so this schema must be neutral too: `hasOfferCatalog`
// points at each hub rather than restating one vertical's three tiers, `serviceType`
// names no single industry, and `faqs` is the same neutral top-5 rendered by <Faq />
// on this page — not any vertical's FAQ set. Per-vertical Service/Offer/FAQPage
// schema lives on each hub page instead (src/app/industries/[slug]/page.tsx), built
// from that vertical's own `pricing`/`faqs`, so the two can never disagree with
// each other — tier-level prices are stated once, on the page that owns them.
const publishedVerticals = getPublishedVerticals();
// Only verticals with a written hub page are linkable in the static export (Task 10
// hasn't written the rest yet) — same filter src/app/industries/page.tsx uses.
const linkableVerticals = publishedVerticals.filter((v) => getIndustryBody(v.slug) !== null);

export default function JsonLd({ faqs }: { faqs: Faq[] }) {
  const graph = [
    {
      "@type": "Organization",
      "@id": `${site.url}/#org`,
      name: site.name,
      url: site.url,
      email: site.email,
      telephone: "+1-615-905-1857",
      slogan: site.tagline,
      description: site.description,
      logo: `${site.url}/logo-512.png`,
      image: `${site.url}/opengraph-image`,
      priceRange,
      sameAs: [site.linkedin, site.instagram],
      serviceType: "SEO & Generative Engine Optimization content for high-ticket local service businesses",
      // Entity-linked rather than plain strings. A bare "Search engine optimization"
      // is a text label an engine has to resolve; a Thing with a Wikipedia sameAs
      // is an unambiguous reference to a known entity in the knowledge graph, which
      // is what lets a model connect this business to the topic with confidence.
      // Deliberately no single-vertical entity here (e.g. "Medical spa") — the
      // business now serves eight industries, and knowsAbout on this node must not
      // imply it specializes in only one of them.
      knowsAbout: [
        {
          "@type": "Thing",
          name: "Search engine optimization",
          sameAs: "https://en.wikipedia.org/wiki/Search_engine_optimization",
        },
        {
          "@type": "Thing",
          name: "Generative engine optimization",
          sameAs: "https://en.wikipedia.org/wiki/Generative_engine_optimization",
        },
        {
          "@type": "Thing",
          name: "Local search",
          sameAs: "https://en.wikipedia.org/wiki/Local_search_(Internet)",
        },
        {
          "@type": "Thing",
          name: "Content marketing",
          sameAs: "https://en.wikipedia.org/wiki/Content_marketing",
        },
        {
          "@type": "Thing",
          name: "Large language model",
          sameAs: "https://en.wikipedia.org/wiki/Large_language_model",
        },
      ],
      // Remote, nationwide service-area business.
      areaServed: { "@type": "Country", name: "United States" },
      // One entry per linkable hub rather than a homepage-level AggregateOffer —
      // tier-level prices are stated once, on the hub page that owns them
      // (Service.offers in src/app/industries/[slug]/page.tsx), and this catalog
      // just points there instead of restating numbers that could drift.
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "SEO & GEO plans by industry",
        itemListElement: linkableVerticals.map((v) => ({
          "@type": "Offer",
          name: `${v.name} SEO & GEO plans`,
          url: `${site.url}/industries/${v.slug}/`,
          itemOffered: { "@type": "Service", "@id": `${site.url}/industries/${v.slug}/#service` },
          availability: "https://schema.org/InStock",
        })),
      },
      makesOffer: [
        {
          "@type": "Offer",
          name: auditOffer.name,
          description: `${auditOffer.for} ${auditOffer.credit}`,
          price: auditOffer.price,
          priceCurrency: "USD",
          category: auditOffer.features.join("; "),
          availability: "https://schema.org/InStock",
        },
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${site.url}/#website`,
      url: site.url,
      name: site.name,
      publisher: { "@id": `${site.url}/#org` },
      inLanguage: "en-US",
    },
    {
      "@type": "FAQPage",
      "@id": `${site.url}/#faq`,
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];

  const json = {
    "@context": "https://schema.org",
    "@graph": graph,
  };

  return (
    <script
      type="application/ld+json"
      // Schema is built from trusted local constants, not user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
