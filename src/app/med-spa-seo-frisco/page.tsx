import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Container from "@/components/Container";
import Button from "@/components/Button";
import { site } from "@/lib/site";

const PATH = "/med-spa-seo-frisco";
const canonical = `${site.url}${PATH}`;

export const metadata: Metadata = {
  title: "Med Spa SEO in Frisco, TX | Frontpaged",
  description:
    "Med spa SEO + AI-search visibility for Frisco, TX clinics. We help Frisco med spas rank on Google and get recommended by ChatGPT, Perplexity, and Google AI Overviews.",
  alternates: { canonical: PATH },
  openGraph: {
    type: "website",
    url: PATH,
    title: "Med Spa SEO in Frisco, TX | Frontpaged",
    description:
      "Get your Frisco med spa found first on Google and cited by AI search. Done-for-you SEO + GEO content built for one of DFW's fastest-growing markets.",
  },
};

const reasons = [
  {
    title: "Frisco's growth is creating a new med spa every few months",
    body: "Frisco has been one of the fastest-growing cities in the United States for over a decade, and the med spa market is keeping pace. With new clinics opening near Frisco Square, The Rail District, and the Preston Road corridor, standing out on search is no longer optional — it's how you survive the opening wave.",
  },
  {
    title: "Frisco patients are high-income, health-conscious, and searching right now",
    body: 'The median household income in Frisco sits well above the national average, and residents here know what they want: Morpheus8, Botox, laser resurfacing, and body contouring. They search "med spa Frisco" or "Botox near The Star" before they ever pick up the phone. If you\'re not on page one, that patient just booked with someone else.',
  },
  {
    title: "AI search is shaping bookings before patients even open Google Maps",
    body: "Frisco's younger, tech-savvy demographic asks ChatGPT or Google's AI Overviews for treatment and clinic recommendations more than almost any other DFW market. If an AI doesn't know your clinic exists — or can't find structured, trustworthy content about your services — you're invisible at the very first moment of intent.",
  },
];

const included = [
  "Answer-first treatment & service pages built to rank and to be quoted by AI",
  "Google Business Profile optimization for the Frisco and North DFW map pack",
  "Local, neighborhood-level content (your treatments × Frisco's zip codes and landmarks)",
  "FAQ + schema markup so Google and AI can extract your answers",
  "Monthly GEO/SEO articles that compound over time",
  "Reporting on where you now appear in search and AI answers",
];

const faqs = [
  {
    q: "How long until my Frisco med spa starts ranking?",
    a: "Most Frisco clinics see first movement within 60–90 days — often faster on Google Business Profile and long-tail treatment terms — with momentum compounding each month after that. Frisco's rapid population growth means fresh search demand is entering the market constantly, which works in your favor when your content is already in place.",
  },
  {
    q: "Is Frisco competitive enough to need dedicated SEO?",
    a: "Absolutely. Frisco has one of the highest concentrations of new med spa openings in the DFW metroplex. Clinics near The Star, Legacy West, and Frisco Square are all competing for the same high-intent patients. The window to establish authority before the market saturates is right now.",
  },
  {
    q: "Can you help my clinic get recommended by ChatGPT and AI search for Frisco searches?",
    a: "That's our core specialty. We structure your content with clear, answer-first formatting and comprehensive schema markup so AI engines — ChatGPT, Perplexity, Google AI Overviews — recognize and cite your clinic when someone asks for the best med spa in Frisco or nearby.",
  },
  {
    q: "Which areas near Frisco do you also target?",
    a: `We work with med spas across the DFW metroplex, including ${site.serviceCities.join(", ")}. If you treat patients anywhere in Frisco or the surrounding suburbs — Prosper, McKinney, The Colony, Little Elm — we build content that wins those searches too.`,
  },
  {
    q: "What does med spa SEO cost in Frisco?",
    a: "Plans run from $1,500 to $4,000 per month depending on how competitive your specific Frisco market segment is and how fast you want to grow. Most single-location clinics start with the Authority plan. You can see exactly what's included and book a free visibility check below.",
  },
];

export default function FriscoPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${site.url}/med-spa-seo-frisco#service`,
        name: "Med Spa SEO — Frisco, TX",
        serviceType: "Medical spa SEO, local SEO, and Generative Engine Optimization",
        description:
          "Done-for-you SEO and AI-search visibility for medical spas in Frisco, TX and the surrounding North DFW suburbs.",
        provider: {
          "@type": "ProfessionalService",
          "@id": `${site.url}/#business`,
          name: site.name,
          url: site.url,
        },
        areaServed: [
          { "@type": "AdministrativeArea", name: "Dallas–Fort Worth metroplex" },
          { "@type": "City", name: "Frisco, TX" },
          { "@type": "City", name: "Plano, TX" },
          { "@type": "City", name: "McKinney, TX" },
          { "@type": "City", name: "Prosper, TX" },
          { "@type": "City", name: "The Colony, TX" },
          { "@type": "City", name: "Dallas, TX" },
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
          { "@type": "ListItem", position: 2, name: "Med Spa SEO in Frisco", item: canonical },
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
              Frisco, TX
            </p>
            <h1 className="max-w-3xl font-serif text-[40px] font-semibold leading-[1.08] tracking-tight text-navy sm:text-[54px]">
              Med spa SEO &amp; AI-search visibility in{" "}
              <span className="italic text-teal">Frisco</span>
            </h1>
            <p className="mt-6 max-w-2xl text-[19px] leading-[1.7] text-warm-grey">
              When Frisco patients search Google — or ask ChatGPT — for the best med spa near them,
              we get your clinic onto the front page of that answer. Done-for-you content engineered
              to rank in one of DFW&rsquo;s fastest-growing, most competitive markets.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <Button href="/#contact" size="lg">
                Get a free visibility check
              </Button>
              <Button href="/pricing" size="lg" variant="ghost">
                See plans
              </Button>
            </div>

            <div className="mt-10 max-w-2xl rounded-2xl border-l-4 border-teal bg-soft p-6">
              <p className="mb-1 text-[12px] font-bold uppercase tracking-[0.16em] text-teal-dark">
                Quick answer
              </p>
              <p className="text-[17px] leading-[1.7] text-ink">
                Frontpaged is a Frisco med spa marketing agency specializing in SEO and Generative
                Engine Optimization (GEO). We help Frisco clinics rank on Google, win the local map
                pack near The Star and Frisco Square, and get recommended by AI search — so more
                high-intent patients book with you instead of your competitors.
              </p>
            </div>
          </Container>
        </section>

        {/* Why */}
        <section className="border-t border-warm-line bg-cream py-20 sm:py-28">
          <Container>
            <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-teal-dark">
              Why it matters in Frisco
            </p>
            <h2 className="max-w-2xl font-serif text-[32px] font-semibold leading-[1.1] tracking-tight text-navy sm:text-[40px]">
              Frisco&rsquo;s growth is a double-edged sword. More patients — and more competition.
            </h2>
            <div className="mt-10 grid gap-[22px] md:grid-cols-3">
              {reasons.map((r, i) => (
                <article
                  key={r.title}
                  className="rounded-2xl border border-warm-line bg-white p-8 shadow-[0_8px_30px_rgba(21,38,63,0.05)]"
                >
                  <div className="mb-5 flex items-baseline gap-3">
                    <span className="font-serif text-4xl font-semibold text-teal">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="h-px flex-1 bg-warm-line" />
                  </div>
                  <h3 className="font-serif text-[20px] font-semibold text-navy">{r.title}</h3>
                  <p className="mt-2.5 text-[15.5px] leading-[1.65] text-warm-grey">{r.body}</p>
                </article>
              ))}
            </div>
          </Container>
        </section>

        {/* What's included */}
        <section className="border-t border-warm-line bg-white py-20 sm:py-28">
          <Container>
            <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-teal-dark">
              What we do
            </p>
            <h2 className="max-w-2xl font-serif text-[32px] font-semibold leading-[1.1] tracking-tight text-navy sm:text-[40px]">
              A complete local visibility engine built for Frisco&rsquo;s market
            </h2>
            <ul className="mt-10 grid gap-x-10 gap-y-4 sm:grid-cols-2">
              {included.map((item) => (
                <li
                  key={item}
                  className="relative pl-7 text-[16px] leading-[1.6] text-ink before:absolute before:left-0 before:top-1 before:font-bold before:text-teal before:content-['✓']"
                >
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-8 text-[15px] leading-[1.7] text-warm-grey">
              Want to see the full scope of what&rsquo;s covered?{" "}
              <Link href="/services/med-spa-seo" className="font-medium text-teal underline-offset-2 hover:underline">
                Read about our med spa SEO service
              </Link>{" "}
              or{" "}
              <Link href="/pricing" className="font-medium text-teal underline-offset-2 hover:underline">
                compare plans
              </Link>
              .
            </p>
          </Container>
        </section>

        {/* Service area */}
        <section className="border-t border-warm-line bg-sand py-20 sm:py-28">
          <Container>
            <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-teal-dark">
              Service area
            </p>
            <h2 className="max-w-2xl font-serif text-[32px] font-semibold leading-[1.1] tracking-tight text-navy sm:text-[40px]">
              Frisco and the wider DFW metroplex
            </h2>
            <p className="mt-4 max-w-2xl text-[17px] leading-[1.7] text-warm-grey">
              We&rsquo;re focused on Frisco, but we help clinics capture patients from every suburb
              they draw from — Prosper, McKinney, The Colony, Little Elm, and beyond. A few of the
              areas we help med spas get found in:
            </p>
            <div className="mt-7 flex flex-wrap gap-2.5">
              {site.serviceCities.map((city) => (
                <span
                  key={city}
                  className="rounded-full border border-warm-line bg-white px-4 py-2 text-[15px] font-medium text-navy"
                >
                  {city}
                </span>
              ))}
            </div>
            <p className="mt-8 text-[15px] leading-[1.7] text-warm-grey">
              We also serve med spas across the broader DFW market. See our{" "}
              <Link href="/med-spa-seo-dallas" className="font-medium text-teal underline-offset-2 hover:underline">
                Dallas–Fort Worth SEO page
              </Link>{" "}
              or our{" "}
              <Link href="/med-spa-seo-plano" className="font-medium text-teal underline-offset-2 hover:underline">
                Plano med spa SEO page
              </Link>{" "}
              for more.
            </p>
          </Container>
        </section>

        {/* FAQ */}
        <section className="border-t border-warm-line bg-white py-20 sm:py-28" aria-labelledby="frisco-faq">
          <Container>
            <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-teal-dark">
              Questions
            </p>
            <h2
              id="frisco-faq"
              className="font-serif text-[32px] font-semibold leading-[1.1] tracking-tight text-navy sm:text-[40px]"
            >
              Med spa SEO in Frisco — FAQ
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
                    <span aria-hidden="true" className="text-2xl font-normal text-teal group-open:hidden">
                      +
                    </span>
                    <span aria-hidden="true" className="hidden text-2xl font-normal text-teal group-open:inline">
                      &ndash;
                    </span>
                  </summary>
                  <p className="px-5 pb-5 text-[15.5px] leading-[1.7] text-warm-grey">{f.a}</p>
                </details>
              ))}
            </div>
          </Container>
        </section>

        {/* CTA */}
        <section className="border-t border-warm-line bg-navy py-20 text-center text-white sm:py-28">
          <Container>
            <h2 className="font-serif text-[34px] font-semibold tracking-tight sm:text-[40px]">
              See where your Frisco clinic stands — free
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[18px] leading-[1.7] text-[#cdd6e2]">
              Book a 30-minute visibility check and we&rsquo;ll run the AI test on your med spa,
              then show you your three fastest local wins in Frisco&rsquo;s market.
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
