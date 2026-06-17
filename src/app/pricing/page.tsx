import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Container from "@/components/Container";
import Button from "@/components/Button";
import Pricing from "@/components/Pricing";
import { site } from "@/lib/site";

const PATH = "/pricing";
const canonical = `${site.url}${PATH}`;

export const metadata: Metadata = {
  title: "Med Spa SEO Pricing — What It Costs in 2026 | Frontpaged",
  description:
    "Med spa SEO pricing ranges from $1,500–$4,000/mo. See what drives the cost, compare plans, and get a free visibility check for your clinic.",
  alternates: { canonical: PATH },
  openGraph: {
    type: "website",
    url: PATH,
    title: "Med Spa SEO Pricing — What It Costs in 2026 | Frontpaged",
    description:
      "Med spa SEO cost explained: plans from $1,500–$4,000/mo, plus custom enterprise pricing from $8,000/mo for multi-location groups.",
  },
};

const costFactors = [
  {
    n: "01",
    title: "Market competition",
    body: "A clinic in a dense, affluent market needs more content and stronger authority-building than a clinic in a less competitive area. Tougher competition means more monthly work to outrank it.",
  },
  {
    n: "02",
    title: "Number of treatments and locations",
    body: "Each core treatment — Botox, filler, Morpheus8, body contouring — deserves its own optimized page and FAQ. The more services and locations you have, the more pages you need, and the higher the content volume.",
  },
  {
    n: "03",
    title: "Content volume and cadence",
    body: "SEO and GEO compound. Higher-tier plans publish more articles per month, which builds ranking momentum faster. If speed matters, more content is the lever — and that's reflected in the monthly rate.",
  },
  {
    n: "04",
    title: "SEO alone vs. SEO + GEO",
    body: "Traditional SEO targets Google rankings. Adding Generative Engine Optimization means structuring content so ChatGPT, Perplexity, and Google AI Overviews cite your clinic by name. All our plans include both — you're not paying extra for GEO.",
  },
];

const pricingFaqs = [
  {
    q: "Is there a contract or minimum commitment?",
    a: "Plans run month-to-month. We don't lock you into an annual contract — though SEO and GEO content compounds over time, so clients who stay 6+ months see the biggest returns. You can pause or cancel with 30 days' notice.",
  },
  {
    q: "What's included in each monthly retainer?",
    a: "Every plan includes GEO/SEO articles, optimized service pages, FAQ schema markup, Google Business Profile posts, and a monthly visibility report. Higher tiers add neighborhood targeting, page refreshes, and strategy calls. See the plan cards above for the full breakdown.",
  },
  {
    q: "Do you charge for ad spend or paid media?",
    a: "No. We focus exclusively on organic search and AI-search visibility — no Google Ads, no paid social. Your monthly retainer covers content creation, on-page optimization, and GEO structuring. There's no ad budget baked in and no media markup.",
  },
  {
    q: "Can I change plans after I start?",
    a: "Yes. You can upgrade or downgrade at the start of any new billing month. Most clinics start on Visibility or Authority and move up once they see early momentum. We'll recommend a plan change if the data supports it.",
  },
  {
    q: "Do you guarantee rankings or a return on investment?",
    a: "We don't guarantee specific rankings — no ethical SEO agency can, because Google controls the algorithm. What we do guarantee is high-quality, consistent work and transparent monthly reporting so you can see exactly what's happening. Most clinics see first movement within 60–90 days.",
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
              Med spa SEO &amp; GEO{" "}
              <span className="italic text-teal">pricing</span>
            </h1>
            <p className="mt-6 max-w-2xl text-[19px] leading-[1.7] text-warm-grey">
              Transparent monthly retainers — no ad spend, no long-term lock-in, no surprises. Here&rsquo;s
              exactly what med spa SEO costs and what drives the number.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <Button href="#pricing" size="lg">
                See the plans
              </Button>
              <Button href="/#contact" size="lg" variant="ghost">
                Book a free visibility check
              </Button>
            </div>

            {/* Quick-answer box — AEO featured-snippet target */}
            <div className="mt-10 max-w-2xl rounded-2xl border-l-4 border-teal bg-soft p-6">
              <p className="mb-1 text-[12px] font-bold uppercase tracking-[0.16em] text-teal-dark">
                Quick answer
              </p>
              <p className="text-[17px] leading-[1.7] text-ink">
                <strong>Med spa SEO typically costs $1,500–$4,000 per month</strong> for a single-location
                clinic. Multi-location or enterprise groups start from $8,000/mo. The range reflects
                market competition, the number of treatments and locations you have, and how much
                content volume you need to outrank competitors — including appearing in AI-search results
                from ChatGPT and Google AI Overviews.
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
              Four things that determine your med spa SEO cost
            </h2>
            <p className="mt-4 max-w-2xl text-[17px] leading-[1.7] text-warm-grey">
              Whether you&rsquo;re a single-location clinic or a multi-location group anywhere in the U.S., the same levers determine what a serious{" "}
              <Link href="/services/med-spa-seo" className="text-teal underline underline-offset-2 hover:text-teal-dark">
                med spa SEO
              </Link>{" "}
              program costs.
            </p>
            <div className="mt-10 grid gap-[22px] md:grid-cols-2">
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
              <Link href="/services/med-spa-seo" className="text-teal underline underline-offset-2 hover:text-teal-dark">
                med spa SEO
              </Link>{" "}
              and{" "}
              <Link href="/services/generative-engine-optimization" className="text-teal underline underline-offset-2 hover:text-teal-dark">
                Generative Engine Optimization (GEO)
              </Link>
              . You don&rsquo;t pay separately for AI-search visibility — it&rsquo;s baked into every tier.
            </p>
          </Container>
        </section>

        {/* Plans — reusing the shared <Pricing /> component */}
        <Pricing />

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
              Med spa SEO pricing — FAQ
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
              See where your clinic stands — free
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[18px] leading-[1.7] text-[#cdd6e2]">
              Book a 30-minute visibility check and we&rsquo;ll show you exactly where your med spa
              ranks on Google and whether AI search knows you exist — before you spend a dollar.
            </p>
            <div className="mt-7 flex justify-center">
              <Link
                href="/#contact"
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
