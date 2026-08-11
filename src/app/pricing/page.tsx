import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Container from "@/components/Container";
import Button from "@/components/Button";
import { site, priceRange, founding, auditOffer, guarantee, usd } from "@/lib/site";
import { getPublishedVerticals } from "@/lib/verticals";
import { foundingPrice, bandRange } from "@/lib/verticals/pricing";
import { getIndustryBody } from "@/lib/industries";

const PATH = "/pricing";
const canonical = `${site.url}${PATH}`;

// One row per published vertical, regardless of whether its hub page has been
// written yet (only med-spas has a body today — see getIndustryBody below). A
// vertical without a body just renders without a link in the table; it never
// gets prerendered into a 404, so nothing here can crash the static export.
const industries = getPublishedVerticals();

// Cheapest founding rate to dearest list price across every industry — the same
// figure `sitePriceRange` computes for `site.priceRange`, kept here as numbers
// (rather than parsed back out of the formatted string) so the quick-answer copy
// can reference the low end directly.
const ranges = industries.map((v) => bandRange(v.pricing));
const overallMin = Math.min(...ranges.map((r) => r.min));

export const metadata: Metadata = {
  title: "SEO & GEO Pricing by Industry — What It Costs in 2026",
  description: founding.enabled
    ? `SEO & GEO pricing runs ${priceRange} depending on industry and market competition. Compare founding-client rates across all ${industries.length} industries we serve.`
    : `SEO & GEO pricing runs ${priceRange} depending on industry and market competition. Compare plans by industry and start with a $${auditOffer.price} audit credited toward month one.`,
  alternates: { canonical: PATH },
  openGraph: {
    type: "website",
    url: PATH,
    title: "SEO & GEO Pricing by Industry — What It Costs in 2026 · Frontpaged",
    description: founding.enabled
      ? `SEO & GEO plans range ${priceRange}, with founding-client rates from ${usd(overallMin)}/mo for our first ${founding.slotsPerVertical} clients per industry. No contract.`
      : `SEO & GEO plans range ${priceRange}, plus custom enterprise pricing for multi-location groups. No contract.`,
  },
};

const costFactors = [
  {
    n: "01",
    title: "Which industry you're in",
    body: "A personal injury firm contesting an entire state needs more content and stronger authority-building than a single-location med spa. Industry is the single biggest driver of price — see the by-industry table below for exact rates.",
  },
  {
    n: "02",
    title: "Market competition",
    body: "A business in a dense, affluent market needs more content and stronger authority-building than one in a less competitive area. Tougher competition means more monthly work to outrank it.",
  },
  {
    n: "03",
    title: "Number of services and locations",
    body: "Each core service deserves its own optimized page and FAQ. The more services and locations you have, the more pages you need, and the higher the content volume.",
  },
  {
    n: "04",
    title: "Content volume and cadence",
    body: "SEO and GEO compound. Higher-tier plans publish more articles per month, which builds ranking momentum faster. If speed matters, more content is the lever — and that's reflected in the monthly rate.",
  },
  {
    n: "05",
    title: "SEO alone vs. SEO + GEO",
    body: "Traditional SEO targets Google rankings. Adding Generative Engine Optimization means structuring content so ChatGPT, Perplexity, and Google AI Overviews cite you by name. All our plans include both — you're not paying extra for GEO.",
  },
];

const pricingFaqs = [
  {
    q: "Is there a contract or minimum commitment?",
    a: "Plans run month-to-month. We don't lock you into an annual contract — though SEO and GEO content compounds over time, so clients who stay 6+ months see the biggest returns. You can pause or cancel with 30 days' notice. If you'd rather prepay a year, that's ten months' fee for twelve months of work.",
  },
  {
    q: "What is the founding client rate?",
    a: "Our first five clients in each industry get 25% off any plan, locked for twelve months, in exchange for documented before-and-after results and permission to write the work up as a case study. We're being straightforward about why: we're newer to some of these markets and a real case study is worth more to us than the full rate.",
  },
  {
    q: `What do I get for the ${usd(auditOffer.price)} AI Visibility Audit?`,
    a: "A one-time deep audit: your business tested across ChatGPT, Perplexity, and Google, the competitors being cited instead of you, a page-by-page gap analysis of your site, and a prioritized 90-day plan. The full amount is credited toward your first month if you start a plan within 30 days.",
  },
  {
    q: "Do you guarantee results?",
    a: "We guarantee one specific thing: if you're not cited by at least one AI engine for a target question within 90 days, month four is free. We deliberately don't guarantee rankings, because Google controls the algorithm and no honest agency can promise a position.",
  },
  {
    q: "What's included in each monthly retainer?",
    a: "Every plan includes GEO/SEO articles, optimized service pages, FAQ schema markup, Google Business Profile posts, and a monthly visibility report. Higher tiers add neighborhood targeting, page refreshes, and strategy calls. See the by-industry table above for the exact rate for your industry.",
  },
  {
    q: "Do you charge for ad spend or paid media?",
    a: "No. We focus exclusively on organic search and AI-search visibility — no Google Ads, no paid social. Your monthly retainer covers content creation, on-page optimization, and GEO structuring. There's no ad budget baked in and no media markup.",
  },
  {
    q: "Can I change plans after I start?",
    a: "Yes. You can upgrade or downgrade at the start of any new billing month. Most clients start on Visibility or Authority and move up once they see early momentum. We'll recommend a plan change if the data supports it.",
  },
  {
    q: "Why does the price vary so much by industry?",
    a: "Competitive intensity and the value of a single new customer both scale with industry. A personal injury lead is worth vastly more than a single med spa booking, and the legal keywords are contested by firms with much bigger content budgets — so the content volume and authority-building required to compete (and the price) scale accordingly.",
  },
];

export default function PricingPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FAQPage",
        "@id": `${canonical}#faq`,
        mainEntity: pricingFaqs.map((f) => ({
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
          { "@type": "ListItem", position: 2, name: "Pricing", item: canonical },
        ],
      },
      // The page that actually states the prices should own the offer catalog —
      // built from the same per-vertical `pricing.tiers` the table and the
      // industry hub pages render from, so nothing here can disagree with them.
      {
        "@type": "Service",
        "@id": `${canonical}#service`,
        name: "SEO & Generative Engine Optimization (GEO) across industries",
        description:
          `Done-for-you SEO and GEO content retainers across ${industries.length} industries — ` +
          "articles, optimized service pages, schema markup, and Google Business Profile management.",
        serviceType: "SEO & Generative Engine Optimization (GEO) content for high-ticket local businesses",
        provider: {
          "@type": "Organization",
          "@id": `${site.url}/#org`,
          name: site.name,
          url: site.url,
        },
        areaServed: { "@type": "Country", name: "United States" },
        offers: [
          // Mirrors each industry hub's graph: while the founding programme runs,
          // the advertised price is the founding rate, so schema states that.
          ...industries.flatMap((v) =>
            v.pricing.tiers.map((t) => {
              const price = founding.enabled ? foundingPrice(t.price) : t.price;
              return {
                "@type": "Offer",
                name: `${v.name} — ${t.name} plan`,
                description: founding.enabled ? `${t.for} Founding client rate.` : t.for,
                url: `${site.url}/industries/${v.slug}/`,
                price,
                priceCurrency: "USD",
                priceSpecification: {
                  "@type": "UnitPriceSpecification",
                  price,
                  priceCurrency: "USD",
                  unitText: "MONTH",
                },
                category: t.features.join("; "),
                availability: "https://schema.org/InStock",
              };
            })
          ),
          {
            "@type": "Offer",
            name: auditOffer.name,
            description: `${auditOffer.for} ${auditOffer.credit}`,
            url: canonical,
            price: auditOffer.price,
            priceCurrency: "USD",
            category: auditOffer.features.join("; "),
            availability: "https://schema.org/InStock",
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader />
      <main>
        {/* Hero */}
        <section className="bg-gradient-to-b from-cream to-white py-20 sm:py-24">
          <Container>
            <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-teal-dark">
              Plans &amp; pricing
            </p>
            <h1 className="max-w-3xl font-serif text-[40px] font-semibold leading-[1.08] tracking-tight text-navy sm:text-[54px]">
              SEO &amp; GEO pricing{" "}
              <span className="italic text-teal">by industry</span>
            </h1>
            <p className="mt-6 max-w-2xl text-[19px] leading-[1.7] text-warm-grey">
              Transparent monthly retainers — no ad spend, no long-term lock-in, no surprises.
              Here&rsquo;s exactly what SEO and GEO cost across the {industries.length} industries we
              serve, and what drives the number.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <Button href="#pricing-table" size="lg">
                See rates by industry
              </Button>
              <Button href="/contact/" size="lg" variant="ghost">
                Book a free visibility check
              </Button>
            </div>

            {/* Quick-answer box — AEO featured-snippet target */}
            <div className="mt-10 max-w-2xl rounded-2xl border-l-4 border-teal bg-soft p-6">
              <p className="mb-1 text-[12px] font-bold uppercase tracking-[0.16em] text-teal-dark">
                Quick answer
              </p>
              {/* The first paragraph stays a general market answer — it's the block AI
                  engines lift for "how much does SEO and GEO cost". Our own pricing
                  follows it rather than replacing it. */}
              <p className="text-[17px] leading-[1.7] text-ink">
                <strong>SEO &amp; GEO pricing typically runs {priceRange}</strong>, and the number
                depends most on which industry you&rsquo;re in — a personal injury firm contesting a
                whole state needs far more content than a single-location med spa. Within an
                industry, the range also reflects market competition, the number of services and
                locations you have, and how much content volume you need to outrank
                competitors — including appearing in AI-search results from ChatGPT and Google AI
                Overviews. Multi-location or enterprise groups get custom, sales-led pricing.
              </p>
              <p className="mt-3.5 border-t border-warm-line pt-3.5 text-[17px] leading-[1.7] text-ink">
                {founding.enabled ? (
                  <>
                    <strong>Frontpaged plans start at {usd(overallMin)}/mo</strong> for our first{" "}
                    {founding.slotsPerVertical} clients in each industry — see the exact founding
                    and list rate for yours in the table below. Everything is month-to-month with
                    no contract, and you can start with a one-time {usd(auditOffer.price)} AI
                    Visibility Audit that&rsquo;s credited in full toward your first month.
                  </>
                ) : (
                  <>
                    <strong>Frontpaged plans run {priceRange}</strong>, month-to-month with no
                    contract. Prepay a year and you pay ten months&rsquo; fee for twelve months of
                    work. You can also start with a one-time {usd(auditOffer.price)} AI Visibility
                    Audit that&rsquo;s credited in full toward your first month.
                  </>
                )}
              </p>
            </div>
          </Container>
        </section>

        {/* What affects the cost */}
        <section className="border-t border-warm-line bg-cream py-20 sm:py-28">
          <Container>
            <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-teal-dark">
              What drives the price
            </p>
            <h2 className="max-w-2xl font-serif text-[32px] font-semibold leading-[1.1] tracking-tight text-navy sm:text-[40px]">
              Five things that determine your SEO &amp; GEO cost
            </h2>
            <p className="mt-4 max-w-2xl text-[17px] leading-[1.7] text-warm-grey">
              Whether you&rsquo;re a single-location business or a multi-location group anywhere in
              the U.S., the same levers determine what a serious SEO and GEO program costs.
            </p>
            <div className="mt-10 grid gap-[22px] sm:grid-cols-2 lg:grid-cols-3">
              {costFactors.map((f) => (
                <article
                  key={f.n}
                  className="rounded-2xl border border-warm-line bg-white p-8 shadow-[0_8px_30px_rgba(21,38,63,0.05)]"
                >
                  <div className="mb-5 flex items-baseline gap-3">
                    <span className="font-serif text-4xl font-semibold text-teal">{f.n}</span>
                    <span className="h-px flex-1 bg-warm-line" />
                  </div>
                  <h3 className="font-serif text-[20px] font-semibold text-navy">{f.title}</h3>
                  <p className="mt-2.5 text-[15.5px] leading-[1.65] text-warm-grey">{f.body}</p>
                </article>
              ))}
            </div>
            <p className="mt-8 max-w-2xl text-[16px] leading-[1.7] text-warm-grey">
              All plans include both{" "}
              <Link href="/services/med-spa-seo/" className="text-teal underline underline-offset-2 hover:text-teal-dark">
                SEO
              </Link>{" "}
              and{" "}
              <Link href="/services/generative-engine-optimization/" className="text-teal underline underline-offset-2 hover:text-teal-dark">
                Generative Engine Optimization (GEO)
              </Link>
              . You don&rsquo;t pay separately for AI-search visibility — it&rsquo;s baked into every tier.
            </p>
          </Container>
        </section>

        {/* Plans by industry — the by-industry table */}
        <section
          id="pricing-table"
          className="border-t border-warm-line bg-sand py-20 sm:py-28"
          aria-labelledby="pricing-table-heading"
        >
          <Container>
            <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-teal-dark">
              Plans
            </p>
            <h2
              id="pricing-table-heading"
              className="max-w-2xl font-serif text-[32px] font-semibold leading-[1.1] tracking-tight text-navy sm:text-[40px]"
            >
              Rates by industry
            </h2>
            <p className="mt-4 max-w-2xl text-[16px] leading-[1.7] text-warm-grey">
              Month-to-month — no contract, no lock-in, cancel any time.{" "}
              {founding.enabled &&
                `Bold prices are the founding-client rate for our first ${founding.slotsPerVertical} clients per industry, locked for 12 months; the struck-through price is the standard list rate.`}
            </p>

            {founding.enabled && (
              <div className="mt-6 flex flex-col gap-2 rounded-2xl border-2 border-teal bg-soft p-6 sm:flex-row sm:items-center sm:gap-6">
                <span className="shrink-0 rounded-full bg-teal px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white">
                  {founding.slotsPerVertical} spots / industry
                </span>
                <div>
                  <p className="font-serif text-[19px] font-semibold text-navy">{founding.headline}</p>
                  <p className="mt-1 text-[15px] leading-[1.6] text-warm-grey">{founding.terms}</p>
                </div>
              </div>
            )}

            <p className="mt-4 max-w-2xl text-[14px] leading-[1.6] text-warm-grey sm:hidden">
              Scroll right to compare all plans and industries →
            </p>

            <div className="mt-4 overflow-x-auto rounded-2xl border border-warm-line bg-white shadow-[0_8px_30px_rgba(21,38,63,0.05)] sm:mt-8">
              <table className="w-full min-w-[900px] border-collapse text-left">
                <caption className="sr-only">Monthly SEO &amp; GEO pricing and included features by industry and plan tier</caption>
                <thead>
                  <tr className="border-b border-warm-line bg-cream">
                    <th scope="col" className="px-5 py-4 text-[12px] font-semibold uppercase tracking-[0.1em] text-navy">
                      Industry
                    </th>
                    {industries[0]?.pricing.tiers.map((t) => (
                      <th
                        key={t.name}
                        scope="col"
                        className="px-5 py-4 text-[12px] font-semibold uppercase tracking-[0.1em] text-navy"
                      >
                        {t.name}
                        {t.featured && (
                          <span className="ml-1.5 rounded-full bg-teal px-2 py-0.5 text-[10px] font-semibold normal-case tracking-normal text-white">
                            Popular
                          </span>
                        )}
                      </th>
                    ))}
                    <th scope="col" className="px-5 py-4 text-[12px] font-semibold uppercase tracking-[0.1em] text-navy">
                      Enterprise
                    </th>
                    <th scope="col" className="px-5 py-4 text-[12px] font-semibold uppercase tracking-[0.1em] text-navy">
                      <span className="sr-only">Action</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {industries.map((v) => {
                    const hasHub = getIndustryBody(v.slug) !== null;
                    return (
                      <tr key={v.slug} className="border-b border-warm-line last:border-0">
                        <th scope="row" className="px-5 py-4 align-top font-serif text-[16px] font-semibold text-navy">
                          {hasHub ? (
                            <Link
                              href={`/industries/${v.slug}/`}
                              className="text-teal-dark underline underline-offset-2 hover:text-navy"
                            >
                              {v.name}
                            </Link>
                          ) : (
                            <>
                              {v.name}
                              <span className="mt-0.5 block text-[12px] font-normal normal-case text-warm-grey">
                                Detailed page coming soon
                              </span>
                            </>
                          )}
                        </th>
                        {v.pricing.tiers.map((t) => (
                          <td key={t.name} className="px-5 py-4 align-top text-[15px] text-ink">
                            {founding.enabled ? (
                              <>
                                <span className="font-semibold text-navy">{usd(foundingPrice(t.price))}</span>
                                <span className="text-warm-grey">/mo</span>
                                <span className="block text-[12.5px] text-warm-grey">
                                  <s>{usd(t.price)}</s> list
                                </span>
                              </>
                            ) : (
                              <span className="font-semibold text-navy">
                                {usd(t.price)}
                                <span className="font-normal text-warm-grey">/mo</span>
                              </span>
                            )}
                            {/* Per-tier feature detail — each vertical's Tier.features differ
                                meaningfully (Task 3), so the table states the price but the
                                disclosure is what a prospect actually buys. Native <details>,
                                same pattern as the FAQ sections — no client component needed. */}
                            <details className="mt-2">
                              <summary className="cursor-pointer text-[12px] font-medium text-teal-dark underline-offset-2 hover:underline">
                                What&rsquo;s included
                              </summary>
                              <ul className="mt-1.5 space-y-1">
                                {t.features.map((f) => (
                                  <li
                                    key={f}
                                    className="relative pl-3 text-[12.5px] leading-[1.5] text-warm-grey before:absolute before:left-0 before:content-['•']"
                                  >
                                    {f}
                                  </li>
                                ))}
                              </ul>
                            </details>
                          </td>
                        ))}
                        <td className="px-5 py-4 align-top text-[15px] text-warm-grey">
                          from {usd(v.pricing.enterpriseFrom)}/mo
                        </td>
                        <td className="px-5 py-4 align-top">
                          {/* Every row is actionable: link to the hub if it exists, otherwise
                              straight to contact — a row a visitor can't act on is a lost lead. */}
                          {hasHub ? (
                            <Link
                              href={`/industries/${v.slug}/`}
                              className="inline-flex items-center justify-center whitespace-nowrap rounded-full bg-teal px-4 py-2 text-[12.5px] font-semibold text-white transition hover:bg-teal-dark"
                            >
                              See {v.name} plans
                            </Link>
                          ) : (
                            <Link
                              href="/contact/"
                              className="inline-flex items-center justify-center whitespace-nowrap rounded-full border border-warm-line px-4 py-2 text-[12.5px] font-semibold text-navy transition hover:border-teal hover:bg-soft"
                            >
                              Talk to us about {v.nameSingular}
                            </Link>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Guarantee + entry offer — the two things that answer "what if this doesn't work". */}
            <div className="mt-[22px] grid gap-[22px] lg:grid-cols-[1.4fr_1fr]">
              <div className="rounded-2xl border border-warm-line bg-white p-7">
                <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-teal-dark">
                  Our guarantee
                </p>
                <p className="mt-2 font-serif text-[19px] font-semibold leading-[1.45] text-navy">
                  {guarantee}
                </p>
                <p className="mt-3 text-[14.5px] leading-[1.6] text-warm-grey">
                  We don&rsquo;t guarantee rankings — nobody honestly can, because Google controls the
                  algorithm. We guarantee the thing we actually control.
                </p>
              </div>

              <div className="flex flex-col rounded-2xl border border-warm-line bg-white p-7">
                <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-teal-dark">
                  Not ready for a plan?
                </p>
                <p className="mt-2 font-serif text-[19px] font-semibold text-navy">
                  {auditOffer.name} — {usd(auditOffer.price)}
                </p>
                <p className="mt-2 flex-1 text-[14.5px] leading-[1.6] text-warm-grey">
                  {auditOffer.for}
                </p>
                <p className="mt-3 rounded-lg bg-soft px-3.5 py-2.5 text-[13.5px] font-medium text-teal-dark">
                  {auditOffer.credit}
                </p>
                <Button href="/contact/" variant="ghost" className="mt-4 w-full">
                  {auditOffer.cta}
                </Button>
              </div>
            </div>

            <p className="mt-[22px] max-w-2xl text-[15px] leading-[1.7] text-warm-grey">
              Multi-location group or scaling across markets? Enterprise pricing is custom and
              sales-led — the table above shows the floor for each industry.{" "}
              <Link href="/contact/" className="text-teal underline underline-offset-2 hover:text-teal-dark">
                Book a strategy call
              </Link>
              .
            </p>
          </Container>
        </section>

        {/* Pricing FAQ */}
        <section
          className="border-t border-warm-line bg-white py-20 sm:py-28"
          aria-labelledby="pricing-faq-heading"
        >
          <Container>
            <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-teal-dark">
              Common questions
            </p>
            <h2
              id="pricing-faq-heading"
              className="font-serif text-[32px] font-semibold leading-[1.1] tracking-tight text-navy sm:text-[40px]"
            >
              SEO &amp; GEO pricing — FAQ
            </h2>
            <div className="mt-10 max-w-[760px]">
              {pricingFaqs.map((f, i) => (
                <details
                  key={f.q}
                  open={i === 0}
                  className="group mb-3 overflow-hidden rounded-xl border border-warm-line bg-cream"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between px-[22px] py-[18px] font-serif text-[18px] font-semibold text-navy [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <span
                      aria-hidden="true"
                      className="text-2xl font-normal text-teal group-open:hidden"
                    >
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
          </Container>
        </section>

        {/* Navy CTA */}
        <section className="border-t border-warm-line bg-navy py-20 text-center text-white sm:py-28">
          <Container>
            <h2 className="font-serif text-[34px] font-semibold tracking-tight sm:text-[40px]">
              See where your business stands — free
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[18px] leading-[1.7] text-[#cdd6e2]">
              Book a 30-minute visibility check and we&rsquo;ll show you exactly where you rank on
              Google and whether AI search knows you exist — before you spend a dollar.
            </p>
            <div className="mt-7 flex justify-center">
              <Link
                href="/contact/"
                className="inline-flex items-center justify-center rounded-full bg-teal px-9 py-4 text-[17px] font-semibold text-white transition hover:bg-white hover:text-navy"
              >
                Book a free visibility check
              </Link>
            </div>
            <p className="mt-6 text-[15px] text-[#9fb6cc]">
              Or email{" "}
              <a href={`mailto:${site.email}`} className="text-white underline">
                {site.email}
              </a>
            </p>
          </Container>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
