import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import TopBanner from "@/components/TopBanner";
import SiteFooter from "@/components/SiteFooter";
import Container from "@/components/Container";
import ServiceHero from "@/components/ServiceHero";
import CtaPanel from "@/components/CtaPanel";
import PricingBand from "@/components/PricingBand";
import ComplianceNote from "@/components/ComplianceNote";
import CitationSources from "@/components/CitationSources";
import RelatedPosts from "@/components/RelatedPosts";
import { SparkleIcon, CheckIcon } from "@/components/Icons";
import { notFound } from "next/navigation";
import { getVertical, getPublishedSlugs } from "@/lib/verticals";
import { foundingPrice } from "@/lib/verticals/pricing";
import { getIndustryBody } from "@/lib/industries";
import { getPostsForVertical } from "@/lib/blog";
import { glossary } from "@/lib/glossary";
import { site, ogImage, founding } from "@/lib/site";

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

  // The price a buyer actually pays today. Every other price surface on the site
  // gates on `founding.enabled` (src/components/PricingBand.tsx, src/lib/site.ts);
  // this one did not, so retiring the founding programme would have left the cards
  // showing list prices while Service.offers still declared founding ones — exactly
  // the cards-vs-schema drift src/lib/verticals/types.ts:3-5 names as the reason
  // this architecture is data-driven at all.
  const payable = (price: number) => (founding.enabled ? foundingPrice(price) : price);

  // This vertical's own blog cluster, ranked by `postTags` (see getPostsForVertical).
  const relatedPosts = getPostsForVertical(v.slug, v.postTags, 4);

  // The subset of the shared glossary (src/lib/glossary.ts) most relevant to
  // this vertical, selected by `v.glossaryTerms`. Filtering with a type guard
  // rather than `.find()!` means a slug typo silently drops a term instead of
  // crashing the static export.
  const terms = v.glossaryTerms
    .map((slug) => glossary.find((t) => t.slug === slug))
    .filter((t): t is (typeof glossary)[number] => t !== undefined);

  // Service + FAQPage + DefinedTermSet + BreadcrumbList. `provider` is always
  // Frontpaged and the vertical goes in `audience` — the schema must never
  // imply we are a law firm or a medical practice.
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
        // Entity linking, per-vertical. The homepage Organization node carries only
        // category-neutral entities on purpose (src/components/JsonLd.tsx), which
        // left the eight hubs — the pages that actually claim a topic — with none.
        // A Thing with a Wikipedia sameAs is an unambiguous knowledge-graph
        // reference; a bare string is a label an engine still has to resolve.
        knowsAbout: v.knowsAbout.map((e) => ({
          "@type": "Thing",
          name: e.name,
          sameAs: e.sameAs,
        })),
        offers: v.pricing.tiers.map((t) => ({
          "@type": "Offer",
          name: `${t.name} plan`,
          description: t.for,
          url: canonical,
          price: payable(t.price),
          priceCurrency: "USD",
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: payable(t.price),
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
      ...(terms.length > 0
        ? [
            {
              "@type": "DefinedTermSet",
              "@id": `${canonical}#glossary`,
              name: `${v.name} SEO & AI Search Terms`,
              description: `Definitions of the SEO, GEO, and AI-search terms most relevant to ${v.name.toLowerCase()}.`,
              url: `${canonical}#glossary`,
              inLanguage: "en-US",
              publisher: { "@id": `${site.url}/#org` },
              // Same @id the glossary page (src/app/glossary/page.tsx) declares for
              // each term, so a crawler correlating @ids across pages resolves
              // this to the same entity rather than a second, competing one.
              hasDefinedTerm: terms.map((t) => ({
                "@type": "DefinedTerm",
                "@id": `${site.url}/glossary#${t.slug}`,
                name: t.term,
                description: t.definition,
                inDefinedTermSet: { "@id": `${site.url}/glossary#glossary` },
              })),
            },
          ]
        : []),
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
      {/* Gated by exclusion, not by an explicit allowlist: the TagEasy cross-promo
          reads badly next to an attorney-advertising or Fair Housing hub, so it's
          suppressed only on the two non-medical regimes rather than turned on
          per-vertical — a new medical-adjacent vertical gets the banner by
          default, the way every other page on the site already does. */}
      {v.compliance.regime !== "legal" && v.compliance.regime !== "real-estate" && <TopBanner />}
      <SiteHeader />
      <main>
        <ServiceHero
          eyebrow={v.name}
          title={v.heroTagline}
          lead={v.metaDescription}
          quickAnswer={v.quickAnswer}
          // This page already carries this industry's three tiers. Sending the
          // visitor to /pricing/ would discard the selection they just made.
          secondaryHref="#pricing"
          secondaryLabel={`See ${v.name} pricing`}
          visual={heroVisual}
        />

        <Container>
          {/* Bespoke prose. Rendered HTML from content/industries/<slug>.md. */}
          <article
            className="prose prose-lg mx-auto max-w-none py-14 prose-headings:font-serif prose-headings:text-navy prose-headings:font-semibold prose-a:text-teal-dark prose-a:no-underline hover:prose-a:underline prose-strong:text-navy prose-li:marker:text-teal prose-p:text-warm-grey prose-p:leading-[1.8] sm:py-16"
            dangerouslySetInnerHTML={{ __html: body.html }}
          />

          <PricingBand vertical={v} />

          <section
            id="faq"
            aria-labelledby="faq-heading"
            className="scroll-mt-20 border-t border-warm-line py-14 sm:py-16"
          >
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

          {terms.length > 0 && (
            <section
              id="glossary"
              aria-labelledby="glossary-heading"
              className="scroll-mt-20 border-t border-warm-line py-14 sm:py-16"
            >
              <h2
                id="glossary-heading"
                className="font-serif text-[28px] font-semibold leading-[1.15] tracking-tight text-navy sm:text-[34px]"
              >
                Key terms
              </h2>
              <dl className="mt-8 grid gap-5 sm:grid-cols-2">
                {terms.map((t) => (
                  <div
                    key={t.slug}
                    className="rounded-xl border border-warm-line bg-cream p-5"
                  >
                    <dt className="font-serif text-[17px] font-semibold text-navy">{t.term}</dt>
                    <dd className="mt-1.5 text-[14.5px] leading-[1.65] text-warm-grey">
                      {t.definition}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="mt-6 text-[15px] text-warm-grey">
                See the{" "}
                <Link href="/glossary/" className="font-semibold text-teal-dark hover:text-teal">
                  full glossary
                </Link>{" "}
                for every SEO and AI-search term we use.
              </p>
            </section>
          )}

          <CitationSources
            sources={v.citationSources}
            audienceNoun={v.audienceNoun}
            clientNoun={v.clientNoun}
          />

          <RelatedPosts
            posts={relatedPosts}
            heading={`More on ${v.name.toLowerCase()} search`}
            name={v.name.toLowerCase()}
          />

          <ComplianceNote profile={v.compliance} />
        </Container>

        <CtaPanel
          heading={`See where your ${v.clientNoun} stands — free`}
          sub={`Book a 30-minute visibility check and we'll run the AI test on your ${v.clientNoun}, then show you your three fastest wins. No pitch required.`}
        />
      </main>
      <SiteFooter />
    </>
  );
}
