import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Container from "@/components/Container";
import ServiceHero from "@/components/ServiceHero";
import CtaPanel from "@/components/CtaPanel";
import PricingBand from "@/components/PricingBand";
import ComplianceNote from "@/components/ComplianceNote";
import { SparkleIcon, CheckIcon } from "@/components/Icons";
import { notFound } from "next/navigation";
import { getVertical, getPublishedSlugs } from "@/lib/verticals";
import { foundingPrice } from "@/lib/verticals/pricing";
import { getIndustryBody } from "@/lib/industries";
import { site, ogImage } from "@/lib/site";

type Params = { slug: string };

// Published AND has a body. A published vertical whose content/industries/<slug>.md
// has not been written yet is skipped rather than prerendered into a notFound(),
// which would fail the static export outright.
export function generateStaticParams(): Params[] {
  return getPublishedSlugs()
    .filter((slug) => getIndustryBody(slug) !== null)
    .map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const v = getVertical(slug);
  if (!v) return {};

  const url = `/industries/${v.slug}/`;
  return {
    title: v.metaTitle,
    description: v.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title: v.metaTitle,
      description: v.metaDescription,
      images: [ogImage],
    },
    twitter: { card: "summary_large_image", title: v.metaTitle, description: v.metaDescription },
  };
}

export default async function IndustryHub({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const v = getVertical(slug);
  if (!v) notFound();

  const body = getIndustryBody(slug);
  if (!body) notFound();

  const canonical = `${site.url}/industries/${v.slug}/`;

  // Service + FAQPage + BreadcrumbList. `provider` is always Frontpaged and the
  // vertical goes in `audience` — the schema must never imply we are a law firm
  // or a medical practice.
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${canonical}#service`,
        name: v.metaTitle,
        description: v.metaDescription,
        serviceType: v.serviceType,
        provider: { "@id": `${site.url}/#org` },
        audience: { "@type": "BusinessAudience", name: v.name },
        areaServed: { "@type": "Country", name: "United States" },
        offers: v.pricing.tiers.map((t) => ({
          "@type": "Offer",
          name: `${t.name} plan`,
          description: t.for,
          url: canonical,
          price: foundingPrice(t.price),
          priceCurrency: "USD",
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: foundingPrice(t.price),
            priceCurrency: "USD",
            unitText: "MONTH",
          },
          availability: "https://schema.org/InStock",
        })),
      },
      {
        "@type": "FAQPage",
        "@id": `${canonical}#faq`,
        mainEntity: v.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonical}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${site.url}/` },
          { "@type": "ListItem", position: 2, name: "Industries", item: `${site.url}/industries/` },
          { "@type": "ListItem", position: 3, name: v.name, item: canonical },
        ],
      },
    ],
  };

  // Generic "cited first" visual for the hero, built from vertical data rather
  // than a med-spa-specific mock (src/components/ServiceVisuals.tsx's mocks
  // hardcode med-spa copy like "Botox near me" and would misrepresent a law
  // firm or real-estate team).
  const heroVisual = (
    <div className="rounded-2xl border border-warm-line bg-white p-5 shadow-[0_24px_60px_rgba(21,38,63,0.12)] sm:p-6">
      <div className="flex items-center gap-2.5 border-b border-warm-line pb-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-navy text-teal">
          <SparkleIcon className="h-4 w-4" />
        </span>
        <p className="text-[13px] font-semibold text-navy">AI answer</p>
        <span className="ml-auto text-[12px] text-warm-grey">
          &ldquo;best {v.nameSingular} near me&rdquo;
        </span>
      </div>
      <p className="mt-4 text-[15px] leading-relaxed text-ink">
        A few {v.name.toLowerCase()} stand out for {v.audienceNoun} looking for a trusted{" "}
        {v.clientNoun}:
      </p>
      <ul className="mt-3 space-y-2.5">
        <li className="flex items-start gap-2.5 rounded-xl border-2 border-teal bg-soft p-3">
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal text-white">
            <CheckIcon className="h-3.5 w-3.5" />
          </span>
          <span className="text-[14.5px] text-navy">
            <span className="font-semibold">Your {v.clientNoun}</span> — cited first, with the
            reviews and content to back it up.
          </span>
        </li>
        <li className="flex items-start gap-2.5 px-3 text-[14px] text-warm-grey">
          <span>•</span> [Competitor A]
        </li>
        <li className="flex items-start gap-2.5 px-3 text-[14px] text-warm-grey">
          <span>•</span> [Competitor B]
        </li>
      </ul>
      <div className="mt-4 flex flex-wrap gap-1.5 border-t border-warm-line pt-3">
        {["ChatGPT", "Perplexity", "Google AI Overviews"].map((e) => (
          <span
            key={e}
            className="rounded-full border border-warm-line bg-cream px-2.5 py-1 text-[11px] font-medium text-teal-dark"
          >
            {e}
          </span>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader />
      <main>
        <ServiceHero
          eyebrow={v.name}
          title={v.heroTagline}
          lead={v.metaDescription}
          quickAnswer={v.quickAnswer}
          visual={heroVisual}
        />

        <Container>
          {/* Bespoke prose. Rendered HTML from content/industries/<slug>.md. */}
          <article
            className="prose prose-lg mx-auto max-w-none py-14 prose-headings:font-serif prose-headings:text-navy prose-headings:font-semibold prose-a:text-teal-dark prose-a:no-underline hover:prose-a:underline prose-strong:text-navy prose-li:marker:text-teal prose-p:text-warm-grey prose-p:leading-[1.8] sm:py-16"
            dangerouslySetInnerHTML={{ __html: body.html }}
          />

          <PricingBand vertical={v} />

          <section aria-labelledby="faq-heading" className="border-t border-warm-line py-14 sm:py-16">
            <h2
              id="faq-heading"
              className="font-serif text-[28px] font-semibold leading-[1.15] tracking-tight text-navy sm:text-[34px]"
            >
              Questions {v.clientNoun} owners ask
            </h2>
            <div className="mt-8 max-w-[760px]">
              {v.faqs.map((f, i) => (
                <details
                  key={f.q}
                  open={i === 0}
                  className="group mb-3 overflow-hidden rounded-xl border border-warm-line bg-cream"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between px-[22px] py-[18px] font-serif text-[18px] font-semibold text-navy [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <span aria-hidden="true" className="text-2xl font-normal text-teal group-open:hidden">
                      +
                    </span>
                    <span
                      aria-hidden="true"
                      className="hidden text-2xl font-normal text-teal group-open:inline"
                    >
                      &ndash;
                    </span>
                  </summary>
                  <p className="px-5 pb-5 text-[15.5px] leading-[1.7] text-warm-grey">{f.a}</p>
                </details>
              ))}
            </div>
          </section>

          <ComplianceNote profile={v.compliance} />
        </Container>

        <CtaPanel />
      </main>
      <SiteFooter />
    </>
  );
}
