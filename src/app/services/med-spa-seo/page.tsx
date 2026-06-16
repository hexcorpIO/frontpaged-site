import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Container from "@/components/Container";
import Button from "@/components/Button";
import { site } from "@/lib/site";

const PATH = "/services/med-spa-seo";
const canonical = `${site.url}${PATH}`;

export const metadata: Metadata = {
  title: "Med Spa SEO Services | Frontpaged",
  description:
    "Med spa SEO that gets your clinic found on Google in Dallas–Fort Worth. Treatment-intent keywords, service pages, GBP, and content — done for you.",
  alternates: { canonical: PATH },
  openGraph: {
    type: "website",
    url: PATH,
    title: "Med Spa SEO Services | Frontpaged",
    description:
      "Med spa SEO for Dallas–Fort Worth clinics. We handle keyword targeting, service pages, Google Business Profile, and monthly content so patients find you first.",
  },
};

const included = [
  {
    n: "01",
    title: "Keyword & treatment-intent targeting",
    body: "We map your treatments — Botox, fillers, laser resurfacing, Morpheus8, body contouring — to the exact phrases your local patients are typing. Then we build a content structure around those terms so every treatment has a page that can rank.",
  },
  {
    n: "02",
    title: "Optimized service pages",
    body: "Thin or missing service pages are the most common reason med spas are invisible in search. We write and optimize individual pages for each treatment, formatted with clear headings, FAQs, and schema markup so Google understands what you offer.",
  },
  {
    n: "03",
    title: "Google Business Profile",
    body: "Your GBP drives the map pack — the three results that appear above organic listings. We optimize your categories, services, photos, and post cadence, and build a review strategy that keeps your star rating and recency working in your favor.",
  },
  {
    n: "04",
    title: "Local citations & NAP consistency",
    body: "Name, address, and phone number mismatches across directories quietly erode your local rankings. We audit and correct your citations so Google's local algorithm trusts your business data.",
  },
  {
    n: "05",
    title: "Review generation",
    body: "Patients read reviews before they book. We build a simple, compliant process to collect more of them from satisfied clients — and show you how to respond in a way that reinforces your expertise.",
  },
  {
    n: "06",
    title: "Technical SEO",
    body: "Fast load times, clean site structure, proper canonical tags, and schema markup are the foundation. We handle the technical layer so search engines can crawl and understand your site without friction.",
  },
  {
    n: "07",
    title: "Content & monthly articles",
    body: "Consistent publishing signals authority. Each month we produce SEO-optimized articles targeting the treatment and neighborhood combinations that drive bookings — content that compounds and keeps earning traffic long after it goes live.",
  },
];

const faqs = [
  {
    q: "How long does it take to rank with med spa SEO?",
    a: 'Most clinics see first movement in 60–90 days, often sooner on Google Business Profile and long-tail neighborhood terms like “lip filler Frisco.” Organic rankings build from there with each month of consistent content. SEO compounds — the sooner you start, the further ahead you\'ll be at month six.',
  },
  {
    q: "Is SEO better than paid ads for a med spa?",
    a: 'They work differently. Ads are instant but stop the moment you stop paying. SEO builds an asset — a page that ranks for "Botox Plano" keeps earning clicks for years without ongoing ad spend. Most established clinics run both, but we focus on the organic and AI-search layer that ads can\'t buy.',
  },
  {
    q: "Do you write the content, or do I?",
    a: "We write everything. You approve a monthly plan, and we produce, optimize, and (if you'd like) publish the articles, service pages, and GBP posts. You bring the clinical expertise; we handle the strategy and the words.",
  },
  {
    q: "What about AI search — ChatGPT, Perplexity, Google AI Overviews?",
    a: "That's a core part of what we do. More patients are asking AI tools \"what's the best med spa in Dallas?\" before they ever open a map. We structure your content with answer-first formatting and schema markup so those engines recognize and cite your clinic. We also offer a dedicated GEO package — see our Generative Engine Optimization service for details.",
  },
  {
    q: "What does med spa SEO cost?",
    a: "Plans run from $1,500 to $4,000 per month depending on your market, treatment mix, and growth goals. Most clinics start with the Authority plan. You can see exactly what's included at our pricing page, or book a free visibility check and we'll tell you what we'd prioritize for your clinic.",
  },
];

export default function MedSpaSeoPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${canonical}#service`,
        name: "Med Spa SEO",
        serviceType: "Medical spa SEO, local SEO, and content marketing",
        description:
          "Done-for-you SEO for medical spas: treatment-intent keyword targeting, optimized service pages, Google Business Profile, local citations, review strategy, technical SEO, and monthly content — all built to get Dallas–Fort Worth clinics found and booked.",
        provider: {
          "@type": "ProfessionalService",
          "@id": `${site.url}/#business`,
          name: site.name,
          url: site.url,
        },
        areaServed: [
          { "@type": "AdministrativeArea", name: "Dallas–Fort Worth metroplex" },
          ...site.serviceCities.map((city) => ({ "@type": "City", name: `${city}, TX` })),
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${canonical}#faq`,
        mainEntity: faqs.map((f) => ({
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
          { "@type": "ListItem", position: 2, name: "Med Spa SEO", item: canonical },
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
              Med Spa SEO
            </p>
            <h1 className="max-w-3xl font-serif text-[40px] font-semibold leading-[1.08] tracking-tight text-navy sm:text-[54px]">
              Med spa SEO that gets you{" "}
              <span className="italic text-teal">found — and booked</span>
            </h1>
            <p className="mt-6 max-w-2xl text-[19px] leading-[1.7] text-warm-grey">
              When a patient in Dallas or Fort Worth searches &ldquo;Botox near me&rdquo; or
              &ldquo;best laser facial Plano,&rdquo; they book from the first page of results. We
              build the pages, signals, and content that put you there — done for you, every month.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <Button href="/#contact" size="lg">
                Get a free visibility check
              </Button>
              <Button href="/pricing" size="lg" variant="ghost">
                See plans &amp; pricing
              </Button>
            </div>

            {/* Quick-answer box */}
            <div className="mt-10 max-w-2xl rounded-2xl border-l-4 border-teal bg-soft p-6">
              <p className="mb-1 text-[12px] font-bold uppercase tracking-[0.16em] text-teal-dark">
                Quick answer
              </p>
              <p className="text-[17px] leading-[1.7] text-ink">
                Med spa SEO is the practice of optimizing your clinic&rsquo;s website and online
                presence so patients find you when they search for treatments like Botox, fillers, or
                laser on Google. It includes treatment-specific service pages, Google Business Profile
                optimization, local citations, review strategy, technical SEO, and monthly content —
                all working together to bring in high-intent local patients.
              </p>
            </div>
          </Container>
        </section>

        {/* What's included */}
        <section className="border-t border-warm-line bg-cream py-20 sm:py-28">
          <Container>
            <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-teal-dark">
              What&rsquo;s included
            </p>
            <h2 className="max-w-2xl font-serif text-[32px] font-semibold leading-[1.1] tracking-tight text-navy sm:text-[40px]">
              Every channel that drives patients to your door
            </h2>
            <div className="mt-10 grid gap-[22px] md:grid-cols-2 lg:grid-cols-3">
              {included.slice(0, 6).map((item) => (
                <article
                  key={item.n}
                  className="rounded-2xl border border-warm-line bg-white p-8 shadow-[0_8px_30px_rgba(21,38,63,0.05)]"
                >
                  <div className="mb-5 flex items-baseline gap-3">
                    <span className="font-serif text-4xl font-semibold text-teal">{item.n}</span>
                    <span className="h-px flex-1 bg-warm-line" />
                  </div>
                  <h3 className="font-serif text-[20px] font-semibold text-navy">{item.title}</h3>
                  <p className="mt-2.5 text-[15.5px] leading-[1.65] text-warm-grey">{item.body}</p>
                </article>
              ))}
            </div>
            {/* 7th item — content — spans full row on its own */}
            {included.slice(6).map((item) => (
              <article
                key={item.n}
                className="mt-[22px] rounded-2xl border border-warm-line bg-white p-8 shadow-[0_8px_30px_rgba(21,38,63,0.05)]"
              >
                <div className="mb-5 flex items-baseline gap-3">
                  <span className="font-serif text-4xl font-semibold text-teal">{item.n}</span>
                  <span className="h-px flex-1 bg-warm-line" />
                </div>
                <h3 className="font-serif text-[20px] font-semibold text-navy">{item.title}</h3>
                <p className="mt-2.5 max-w-2xl text-[15.5px] leading-[1.65] text-warm-grey">
                  {item.body}
                </p>
              </article>
            ))}
          </Container>
        </section>

        {/* Why it matters */}
        <section className="border-t border-warm-line bg-white py-20 sm:py-28">
          <Container>
            <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-teal-dark">
              Why it matters
            </p>
            <h2 className="max-w-2xl font-serif text-[32px] font-semibold leading-[1.1] tracking-tight text-navy sm:text-[40px]">
              DFW patients search before they book. Be the one they find.
            </h2>
            <div className="mt-8 max-w-3xl space-y-5 text-[17px] leading-[1.75] text-warm-grey">
              <p>
                The Dallas–Fort Worth market has more med spas per square mile than almost anywhere
                in the country. From Uptown to Southlake to Frisco, new clinics open every quarter.
                When a patient types &ldquo;Morpheus8 Dallas&rdquo; or &ldquo;filler near me
                Grapevine,&rdquo; they see the first page — and almost never go further. If
                you&rsquo;re not there, you&rsquo;re invisible, regardless of how skilled your
                injectors are.
              </p>
              <p>
                Med spa searches are high-intent: the person typing &ldquo;Botox Plano&rdquo; is ready to book,
                not just browsing. Ranking for those terms means your phone rings and your calendar
                fills — without spending more on ads. Want to go deeper on the DFW opportunity? Read
                our{" "}
                <Link
                  href="/blog/med-spa-seo-2026-guide"
                  className="font-medium text-teal underline underline-offset-2 hover:text-teal-dark"
                >
                  med spa SEO 2026 guide
                </Link>
                .
              </p>
              <p>
                Patients are also starting their search on AI tools. ChatGPT and Google&rsquo;s AI
                Overviews now answer &ldquo;what&rsquo;s the best med spa in Dallas?&rdquo; before a patient
                ever opens a map. Our{" "}
                <Link
                  href="/services/generative-engine-optimization"
                  className="font-medium text-teal underline underline-offset-2 hover:text-teal-dark"
                >
                  Generative Engine Optimization
                </Link>{" "}
                service ensures your clinic is one those AI answers cite by name.
              </p>
            </div>
          </Container>
        </section>

        {/* How we work */}
        <section className="border-t border-warm-line bg-sand py-20 sm:py-28">
          <Container>
            <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-teal-dark">
              How it works
            </p>
            <h2 className="max-w-2xl font-serif text-[32px] font-semibold leading-[1.1] tracking-tight text-navy sm:text-[40px]">
              A monthly rhythm, not a one-off project
            </h2>
            <div className="mt-8 max-w-3xl space-y-5 text-[17px] leading-[1.75] text-warm-grey">
              <p>
                We start with a visibility audit — your current rankings, GBP health, and the
                specific treatment-intent terms you&rsquo;re missing in DFW. From that, we build a
                priority plan: which service pages to write first, which citations to fix, what
                content will move the needle fastest for your clinic.
              </p>
              <p>
                Each month you get a content plan for approval (usually a quick async review), then
                we produce and publish everything — articles, service page updates, GBP posts. You
                keep an eye on your calendar. We keep an eye on your rankings and flag what&rsquo;s
                improving and what&rsquo;s next.
              </p>
              <p>
                Because SEO compounds, the longer we work together the stronger your position. Our
                clients who&rsquo;ve been with us for six months consistently outrank competitors
                who are spending far more on ads.
              </p>
              <p>
                Want to see how it&rsquo;s structured across tiers?{" "}
                <Link
                  href="/pricing"
                  className="font-medium text-teal underline underline-offset-2 hover:text-teal-dark"
                >
                  View our pricing and plans
                </Link>
                . Or see the full picture of what we do for Dallas-area clinics on our{" "}
                <Link
                  href="/med-spa-seo-dallas"
                  className="font-medium text-teal underline underline-offset-2 hover:text-teal-dark"
                >
                  Dallas med spa SEO page
                </Link>
                .
              </p>
            </div>
          </Container>
        </section>

        {/* FAQ */}
        <section
          className="border-t border-warm-line bg-white py-20 sm:py-28"
          aria-labelledby="seo-faq-heading"
        >
          <Container>
            <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-teal-dark">
              Questions
            </p>
            <h2
              id="seo-faq-heading"
              className="font-serif text-[32px] font-semibold leading-[1.1] tracking-tight text-navy sm:text-[40px]"
            >
              Med spa SEO — FAQ
            </h2>
            <div className="mt-10 max-w-[760px]">
              {faqs.map((f, i) => (
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
                      –
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
              See where patients aren&rsquo;t finding you — free
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[18px] leading-[1.7] text-[#cdd6e2]">
              Book a 30-minute visibility check and we&rsquo;ll show you the treatment searches
              you&rsquo;re missing, how you stack up against the top-ranking DFW clinics, and your
              three fastest wins.
            </p>
            <div className="mt-7 flex justify-center">
              <Link
                href="/#contact"
                className="inline-flex items-center justify-center rounded-full bg-teal px-9 py-4 text-[17px] font-semibold text-white transition hover:bg-white hover:text-navy"
              >
                Book your free visibility check
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
