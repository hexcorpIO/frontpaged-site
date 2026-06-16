import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Container from "@/components/Container";
import Button from "@/components/Button";
import { site } from "@/lib/site";

const PATH = "/med-spa-seo-dallas";
const canonical = `${site.url}${PATH}`;

export const metadata: Metadata = {
  title: "Med Spa SEO in Dallas–Fort Worth | Frontpaged",
  description:
    "Med spa SEO + AI-search visibility for Dallas–Fort Worth clinics. We get your med spa found first on Google and recommended by ChatGPT, Perplexity, and Google AI Overviews.",
  alternates: { canonical: PATH },
  openGraph: {
    type: "website",
    url: PATH,
    title: "Med Spa SEO in Dallas–Fort Worth | Frontpaged",
    description:
      "Get your Dallas–Fort Worth med spa found first on Google and cited by AI search. Done-for-you SEO + GEO content.",
  },
};

const reasons = [
  {
    title: "DFW is one of the most competitive med spa markets in the country",
    body: "From Uptown Dallas to Southlake and Frisco, new clinics open every month. When a patient searches “best med spa near me,” only a handful get seen — and the rest are invisible. Ranking is how you stop competing on price alone.",
  },
  {
    title: "Your patients search by treatment and neighborhood",
    body: "“Botox in Plano,” “lip filler Fort Worth,” “morpheus8 near me.” These are high-intent, ready-to-book searches. We build the pages and signals that win them — for the treatments and suburbs that actually matter to your clinic.",
  },
  {
    title: "AI is now the first stop for many DFW patients",
    body: "More people ask ChatGPT or Google’s AI Overviews “what’s the best med spa in Dallas?” before they ever open a map. If the AI doesn’t know you exist, you’re left off the shortlist. We make sure your clinic is one it names.",
  },
];

const included = [
  "Answer-first treatment & service pages built to rank and to be quoted by AI",
  "Google Business Profile optimization for the Dallas map pack",
  "Local, neighborhood-level content (your treatments × your suburbs)",
  "FAQ + schema markup so Google and AI can extract your answers",
  "Monthly GEO/SEO articles that compound over time",
  "Reporting on where you now appear in search and AI answers",
];

const faqs = [
  {
    q: "How long until my Dallas med spa starts ranking?",
    a: "Local SEO and GEO compound. Most Dallas–Fort Worth clinics see first movement in 60–90 days — often faster on Google Business Profile and long-tail neighborhood terms — with momentum building from there. That’s why we focus on consistent monthly work, not one-off projects.",
  },
  {
    q: "Do you optimize my Google Business Profile for the Dallas map pack?",
    a: "Yes. Your Google Business Profile is the single biggest driver of local visibility in DFW. We optimize categories, services, photos, posts, and your review strategy so you show up in the local map results when patients search nearby.",
  },
  {
    q: "Can you help my clinic get recommended by ChatGPT and AI search?",
    a: "That’s our specialty. We structure your content with clear, answer-first formatting and schema so AI engines (ChatGPT, Perplexity, Google AI Overviews) recognize and cite your clinic when patients ask for the best med spa in your area.",
  },
  {
    q: "Which Dallas–Fort Worth areas do you serve?",
    a: `We work with med spas across the DFW metroplex, including ${site.serviceCities.join(", ")}. If you treat patients anywhere in Dallas–Fort Worth, we can help you get found there.`,
  },
  {
    q: "What does med spa SEO cost in Dallas?",
    a: "Plans run from $1,500 to $4,000 per month depending on how competitive your market is and how fast you want to grow. Most clinics start with the Authority plan. You can see what’s included and book a free visibility check below.",
  },
];

export default function DallasPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${canonical}#service`,
        name: "Med Spa SEO & Generative Engine Optimization — Dallas–Fort Worth",
        serviceType: "Medical spa SEO, local SEO, and Generative Engine Optimization",
        description:
          "Done-for-you SEO and AI-search visibility for medical spas across the Dallas–Fort Worth metroplex.",
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
          { "@type": "ListItem", position: 2, name: "Med Spa SEO in Dallas–Fort Worth", item: canonical },
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
              Dallas–Fort Worth
            </p>
            <h1 className="max-w-3xl font-serif text-[40px] font-semibold leading-[1.08] tracking-tight text-navy sm:text-[54px]">
              Med spa SEO &amp; AI-search visibility in{" "}
              <span className="italic text-teal">Dallas–Fort Worth</span>
            </h1>
            <p className="mt-6 max-w-2xl text-[19px] leading-[1.7] text-warm-grey">
              When DFW patients search Google — or ask ChatGPT — for the best med spa near them, we
              get your clinic onto the front page of that answer. Done-for-you content engineered to
              rank locally and get cited by AI search.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <Button href="/#contact" size="lg">
                Get a free visibility check
              </Button>
              <Button href="/#pricing" size="lg" variant="ghost">
                See plans
              </Button>
            </div>

            <div className="mt-10 max-w-2xl rounded-2xl border-l-4 border-teal bg-soft p-6">
              <p className="mb-1 text-[12px] font-bold uppercase tracking-[0.16em] text-teal-dark">
                Quick answer
              </p>
              <p className="text-[17px] leading-[1.7] text-ink">
                Frontpaged is a Dallas–Fort Worth med spa marketing agency specializing in SEO and
                Generative Engine Optimization (GEO). We help DFW clinics rank on Google, win the
                local map pack, and get recommended by AI search — so more high-intent patients book.
              </p>
            </div>
          </Container>
        </section>

        {/* Why */}
        <section className="border-t border-warm-line bg-cream py-20 sm:py-28">
          <Container>
            <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-teal-dark">
              Why it matters in DFW
            </p>
            <h2 className="max-w-2xl font-serif text-[32px] font-semibold leading-[1.1] tracking-tight text-navy sm:text-[40px]">
              Dallas patients decide fast. Be the clinic they find first.
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
              A complete local visibility engine for your clinic
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
          </Container>
        </section>

        {/* Service area */}
        <section className="border-t border-warm-line bg-sand py-20 sm:py-28">
          <Container>
            <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-teal-dark">
              Service area
            </p>
            <h2 className="max-w-2xl font-serif text-[32px] font-semibold leading-[1.1] tracking-tight text-navy sm:text-[40px]">
              Serving med spas across Dallas–Fort Worth
            </h2>
            <p className="mt-4 max-w-2xl text-[17px] leading-[1.7] text-warm-grey">
              We work with clinics throughout the metroplex. A few of the areas we help med spas get
              found in:
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
          </Container>
        </section>

        {/* FAQ */}
        <section className="border-t border-warm-line bg-white py-20 sm:py-28" aria-labelledby="dallas-faq">
          <Container>
            <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-teal-dark">
              Questions
            </p>
            <h2
              id="dallas-faq"
              className="font-serif text-[32px] font-semibold leading-[1.1] tracking-tight text-navy sm:text-[40px]"
            >
              Med spa SEO in Dallas — FAQ
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
                      –
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
              See where your Dallas clinic stands — free
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[18px] leading-[1.7] text-[#cdd6e2]">
              Book a 30-minute visibility check and we&rsquo;ll run the AI test on your med spa, then
              show you your three fastest local wins.
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
