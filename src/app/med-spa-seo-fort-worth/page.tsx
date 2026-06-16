import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Container from "@/components/Container";
import Button from "@/components/Button";
import { site } from "@/lib/site";

const PATH = "/med-spa-seo-fort-worth";
const canonical = `${site.url}${PATH}`;

export const metadata: Metadata = {
  title: "Med Spa SEO in Fort Worth, TX | Frontpaged",
  description:
    "Med spa SEO + AI-search visibility for Fort Worth clinics. Get found first on Google and recommended by ChatGPT, Perplexity, and Google AI Overviews in Tarrant County.",
  alternates: { canonical: PATH },
  openGraph: {
    type: "website",
    url: PATH,
    title: "Med Spa SEO in Fort Worth, TX | Frontpaged",
    description:
      "Get your Fort Worth med spa found first on Google and cited by AI search. Done-for-you SEO + GEO content for Tarrant County clinics.",
  },
};

const reasons = [
  {
    title: "Fort Worth is its own market — not a Dallas suburb",
    body: "Tarrant County has more than 2.1 million residents and a fast-growing base of affluent patients in Clearfork, Southlake, and the TCU corridor. When someone in Fort Worth searches for a med spa, they're not looking in Uptown Dallas — they want something local. Winning those searches means speaking to Fort Worth, not the metroplex in general.",
  },
  {
    title: "High-intent Fort Worth searches go to whoever built the page",
    body: '"Botox West 7th," "lip filler Cultural District," "morpheus8 Clearfork" — these are patients who already know what they want and where they want to go. Right now, most clinics haven\'t built the neighborhood-specific content to win them. We do.',
  },
  {
    title: "AI recommendations are reshaping how Fort Worth patients choose a clinic",
    body: "More patients open ChatGPT or check Google's AI Overviews before they ever scroll a map. If your clinic isn't structured to be cited by those engines, you don't make the shortlist — no matter how good your injectors are. We get you on it.",
  },
];

const included = [
  "Answer-first treatment & service pages built to rank and to be quoted by AI",
  "Google Business Profile optimization for the Fort Worth map pack",
  "Neighborhood-level content targeting West 7th, Clearfork, Cultural District, TCU area, and Sundance Square",
  "FAQ + schema markup so Google and AI can extract your answers",
  "Monthly GEO/SEO articles that compound over time",
  "Reporting on where you now appear in search and AI answers",
];

const faqs = [
  {
    q: "How long until my Fort Worth med spa starts ranking?",
    a: "Local SEO and GEO compound. Most Fort Worth clinics see first movement in 60–90 days — often faster on Google Business Profile and long-tail neighborhood terms like 'Botox West 7th' or 'filler Clearfork' — with momentum building from there. That's why we focus on consistent monthly work, not one-off projects.",
  },
  {
    q: "Do you optimize my Google Business Profile for the Fort Worth map pack?",
    a: "Yes. Your Google Business Profile is the single biggest driver of local visibility in Fort Worth. We optimize categories, services, photos, posts, and your review strategy so you show up in the local map results when Tarrant County patients search nearby.",
  },
  {
    q: "Is Fort Worth competitive enough to need dedicated SEO?",
    a: "It's growing fast and so is the competition. Clearfork alone has attracted multiple new med spa concepts in the last two years, and West 7th is filling in quickly. Clinics that build local authority now will be far harder to displace in 18 months than those who wait.",
  },
  {
    q: "Which Fort Worth neighborhoods and nearby cities do you target?",
    a: `We build content around the areas your patients actually come from — West 7th, Clearfork, Montgomery Plaza, the Cultural District, Sundance Square, the TCU corridor, and nearby suburbs. We also cover the wider DFW service area, including ${site.serviceCities.join(", ")}.`,
  },
  {
    q: "What does med spa SEO cost in Fort Worth?",
    a: "Plans run from $1,500 to $4,000 per month depending on how competitive your specific market and treatment mix are. Most Fort Worth clinics start with the Authority plan. You can see exactly what's included and book a free visibility check below.",
  },
];

export default function FortWorthPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${site.url}/med-spa-seo-fort-worth#service`,
        name: "Med Spa SEO — Fort Worth, TX",
        serviceType: "Medical spa SEO, local SEO, and Generative Engine Optimization",
        description:
          "Done-for-you SEO and AI-search visibility for medical spas in Fort Worth and across Tarrant County.",
        provider: {
          "@type": "ProfessionalService",
          "@id": `${site.url}/#business`,
          name: site.name,
          url: site.url,
        },
        areaServed: [
          { "@type": "City", name: "Fort Worth, TX" },
          { "@type": "City", name: "Arlington, TX" },
          { "@type": "City", name: "Grapevine, TX" },
          { "@type": "City", name: "Southlake, TX" },
          { "@type": "City", name: "Dallas, TX" },
          { "@type": "AdministrativeArea", name: "Dallas–Fort Worth metroplex" },
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
          { "@type": "ListItem", position: 2, name: "Med Spa SEO in Fort Worth", item: canonical },
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
              Fort Worth, TX
            </p>
            <h1 className="max-w-3xl font-serif text-[40px] font-semibold leading-[1.08] tracking-tight text-navy sm:text-[54px]">
              Med spa SEO &amp; AI-search visibility in{" "}
              <span className="italic text-teal">Fort Worth</span>
            </h1>
            <p className="mt-6 max-w-2xl text-[19px] leading-[1.7] text-warm-grey">
              When Fort Worth patients search Google — or ask ChatGPT — for the best med spa near
              them, we get your clinic onto the front page of that answer. Done-for-you content
              engineered to rank in Tarrant County and get cited by AI search.
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
                Frontpaged is a Fort Worth med spa marketing agency specializing in SEO and
                Generative Engine Optimization (GEO). We help Tarrant County clinics rank on Google,
                win the local map pack, and get recommended by AI search — so more high-intent
                patients book consultations.
              </p>
            </div>
          </Container>
        </section>

        {/* Why */}
        <section className="border-t border-warm-line bg-cream py-20 sm:py-28">
          <Container>
            <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-teal-dark">
              Why it matters in Fort Worth
            </p>
            <h2 className="max-w-2xl font-serif text-[32px] font-semibold leading-[1.1] tracking-tight text-navy sm:text-[40px]">
              Fort Worth patients decide fast. Be the clinic they find first.
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
              A complete local visibility engine for your Fort Worth clinic
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
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/services/med-spa-seo"
                className="text-[15px] font-semibold text-teal underline-offset-2 hover:underline"
              >
                See our full med spa SEO service
              </Link>
              <Link
                href="/med-spa-seo-dallas"
                className="text-[15px] font-semibold text-teal underline-offset-2 hover:underline"
              >
                Dallas med spa SEO
              </Link>
            </div>
          </Container>
        </section>

        {/* Service area */}
        <section className="border-t border-warm-line bg-sand py-20 sm:py-28">
          <Container>
            <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-teal-dark">
              Service area
            </p>
            <h2 className="max-w-2xl font-serif text-[32px] font-semibold leading-[1.1] tracking-tight text-navy sm:text-[40px]">
              Fort Worth — and the full DFW metroplex
            </h2>
            <p className="mt-4 max-w-2xl text-[17px] leading-[1.7] text-warm-grey">
              We&rsquo;re rooted in Fort Worth and Tarrant County, and we cover the wider DFW
              service area too. A few of the cities we help med spas get found in:
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
            <p className="mt-6 text-[15px] text-warm-grey">
              Want to see how we approach the broader DFW market?{" "}
              <Link
                href="/med-spa-seo-dallas"
                className="font-semibold text-teal underline-offset-2 hover:underline"
              >
                View our Dallas–Fort Worth page
              </Link>
              .
            </p>
          </Container>
        </section>

        {/* FAQ */}
        <section className="border-t border-warm-line bg-white py-20 sm:py-28" aria-labelledby="fort-worth-faq">
          <Container>
            <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-teal-dark">
              Questions
            </p>
            <h2
              id="fort-worth-faq"
              className="font-serif text-[32px] font-semibold leading-[1.1] tracking-tight text-navy sm:text-[40px]"
            >
              Med spa SEO in Fort Worth — FAQ
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
            <p className="mt-8 text-[15px] text-warm-grey">
              More questions about med spa marketing?{" "}
              <Link
                href="/blog/google-business-profile-for-med-spas"
                className="font-semibold text-teal underline-offset-2 hover:underline"
              >
                Read our guide to Google Business Profile for med spas
              </Link>
              .
            </p>
          </Container>
        </section>

        {/* CTA */}
        <section className="border-t border-warm-line bg-navy py-20 text-center text-white sm:py-28">
          <Container>
            <h2 className="font-serif text-[34px] font-semibold tracking-tight sm:text-[40px]">
              See where your Fort Worth clinic stands — free
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[18px] leading-[1.7] text-[#cdd6e2]">
              Book a 30-minute visibility check and we&rsquo;ll run the AI test on your med spa, then
              show you your three fastest local wins in Tarrant County.
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
            <p className="mt-4 text-[14px] text-[#9fb6cc]">
              Also serving Dallas?{" "}
              <Link href="/med-spa-seo-dallas" className="text-white underline">
                See our Dallas–Fort Worth page
              </Link>
              . Ready to talk pricing?{" "}
              <Link href="/pricing" className="text-white underline">
                View plans
              </Link>
              .
            </p>
          </Container>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
