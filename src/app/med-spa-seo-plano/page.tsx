import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Container from "@/components/Container";
import Button from "@/components/Button";
import { site } from "@/lib/site";

const PATH = "/med-spa-seo-plano";
const canonical = `${site.url}${PATH}`;

export const metadata: Metadata = {
  title: "Med Spa SEO in Plano, TX | Frontpaged",
  description:
    "Med spa SEO + AI-search visibility for Plano, TX clinics. Get found first on Google and cited by ChatGPT, Perplexity & Google AI Overviews along Preston Rd and Legacy West.",
  alternates: { canonical: PATH },
  openGraph: {
    type: "website",
    url: PATH,
    title: "Med Spa SEO in Plano, TX | Frontpaged",
    description:
      "Get your Plano med spa found first on Google and cited by AI search. Done-for-you SEO + GEO content built for the Legacy West and Preston Rd corridor.",
  },
};

const reasons = [
  {
    title: "Plano's affluent patient base demands the top result — not the second one",
    body: "The households lining Preston Road and Legacy West rank among the highest-income zip codes in North Texas. Toyota, JPMorgan, and dozens of other corporate campuses feed a population of professionals who book quickly and spend confidently — but only with the clinic they trust first. If you're not on page one, that patient goes to the competitor who is.",
  },
  {
    title: "The Preston Rd / Legacy West corridor is one of DFW's most contested med spa markets",
    body: `Plano's density of high-end clinics is striking. Patients searching "Botox Plano," "med spa near Legacy West," or "lip filler Preston Road" see a packed map pack and sponsored listings before they reach organic results. A precise, suburb-level SEO strategy is the only way to carve out durable visibility that ad spend alone can't buy.`,
  },
  {
    title: "Plano patients increasingly ask AI before they open Google Maps",
    body: `The corporate professionals who fill Plano's neighborhoods use ChatGPT and Perplexity the same way they use a trusted referral. "What's the best med spa near Willow Bend?" is a question being asked in AI search right now. Clinics whose content is structured for AI citation get named; the rest don't exist in that conversation.`,
  },
];

const included = [
  "Answer-first treatment pages built to rank in Plano and be quoted by AI search",
  "Google Business Profile optimization targeting the Plano/Legacy West map pack",
  "Neighborhood-level content for Preston Rd, Legacy West, Willow Bend, and West Plano",
  "FAQ + schema markup so Google and AI can extract your answers instantly",
  "Monthly GEO/SEO articles that compound over time and compound your authority",
  "Reporting on where your clinic appears in Google search and AI recommendations",
];

const faqs = [
  {
    q: "How long does it take for a Plano med spa to start ranking?",
    a: `Most Plano clinics see initial movement within 60–90 days — often sooner on Google Business Profile and long-tail terms like "Botox near Legacy West." Organic momentum builds steadily from there, which is exactly why we emphasize consistent monthly work over one-time pushes.`,
  },
  {
    q: "Can you get my clinic into the Plano Google map pack?",
    a: "Yes. Your Google Business Profile is the single most important lever for local map pack visibility in Plano. We optimize your categories, services, photos, posts, and Q&A, and help you build a review strategy that moves the needle — especially for searches along the Preston Rd and Legacy West corridor.",
  },
  {
    q: "Will AI tools like ChatGPT start recommending my Plano clinic?",
    a: "That's the GEO side of what we do. We structure your content with clear, answer-first formatting, rich FAQ schema, and authoritative local signals so that when someone asks ChatGPT or Perplexity for the best med spa near Willow Bend or Legacy West, your clinic is one of the names that comes up.",
  },
  {
    q: "Which areas near Plano do you cover?",
    a: `We work with clinics across the full DFW metroplex, including ${site.serviceCities.join(", ")}. If you treat patients in Plano or anywhere in the surrounding suburbs — Frisco, McKinney, Allen, or beyond — we can build visibility for those specific areas.`,
  },
  {
    q: "What does med spa SEO cost for a Plano clinic?",
    a: "Plans start at $1,500 per month and go up to $4,000 depending on your market competitiveness and growth goals. Most Plano clinics start with our Authority plan. You can review exactly what's included on our pricing page, or book a free visibility check and we'll tell you which plan fits your situation.",
  },
];

export default function PlanoPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${canonical}#service`,
        name: "Med Spa SEO — Plano, TX",
        serviceType: "Medical spa SEO, local SEO, and Generative Engine Optimization",
        description:
          "Done-for-you SEO and AI-search visibility for medical spas in Plano, TX and the surrounding North Dallas suburbs.",
        provider: {
          "@type": "ProfessionalService",
          "@id": `${site.url}/#business`,
          name: site.name,
          url: site.url,
        },
        areaServed: [
          { "@type": "AdministrativeArea", name: "Dallas–Fort Worth metroplex" },
          { "@type": "City", name: "Plano, TX" },
          { "@type": "City", name: "Frisco, TX" },
          { "@type": "City", name: "McKinney, TX" },
          { "@type": "City", name: "Allen, TX" },
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
          { "@type": "ListItem", position: 2, name: "Med Spa SEO in Plano", item: canonical },
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
              Plano, TX
            </p>
            <h1 className="max-w-3xl font-serif text-[40px] font-semibold leading-[1.08] tracking-tight text-navy sm:text-[54px]">
              Med spa SEO &amp; AI-search visibility in{" "}
              <span className="italic text-teal">Plano</span>
            </h1>
            <p className="mt-6 max-w-2xl text-[19px] leading-[1.7] text-warm-grey">
              Plano patients are high-intent and ready to book — but they&apos;re finding the clinics that
              rank, not necessarily the best ones. We get your med spa to the top of Google and into
              the AI answers patients see before they even open a map.
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
                Frontpaged is a Plano-focused med spa SEO agency specializing in local search and
                Generative Engine Optimization (GEO). We help clinics along the Preston Road and
                Legacy West corridor rank on Google, win the Plano map pack, and get cited by AI
                tools — so the right patients find you first and book.
              </p>
            </div>
          </Container>
        </section>

        {/* Why */}
        <section className="border-t border-warm-line bg-cream py-20 sm:py-28">
          <Container>
            <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-teal-dark">
              Why it matters in Plano
            </p>
            <h2 className="max-w-2xl font-serif text-[32px] font-semibold leading-[1.1] tracking-tight text-navy sm:text-[40px]">
              Plano patients decide fast. Be the clinic they find first.
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
              A complete local visibility engine built for Plano clinics
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
            <p className="mt-10 text-[16px] leading-[1.7] text-warm-grey">
              Want to understand exactly how we structure this work?{" "}
              <Link href="/services/med-spa-seo" className="font-semibold text-teal underline underline-offset-2 hover:text-teal-dark">
                See our full med spa SEO service overview
              </Link>
              , or read our guide on{" "}
              <Link href="/blog/how-to-rank-for-botox-near-me" className="font-semibold text-teal underline underline-offset-2 hover:text-teal-dark">
                how to rank for &ldquo;Botox near me&rdquo;
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
              Serving med spas across Plano and the wider DFW metroplex
            </h2>
            <p className="mt-4 max-w-2xl text-[17px] leading-[1.7] text-warm-grey">
              We specialize in Plano-specific visibility — Preston Rd, Legacy West, Willow Bend, and
              West Plano neighborhoods — and extend that work across the full metroplex. A few of the
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
            <p className="mt-8 text-[16px] leading-[1.7] text-warm-grey">
              We also cover the full Dallas–Fort Worth market.{" "}
              <Link href="/med-spa-seo-dallas" className="font-semibold text-teal underline underline-offset-2 hover:text-teal-dark">
                See our DFW-wide med spa SEO service
              </Link>
              .
            </p>
          </Container>
        </section>

        {/* FAQ */}
        <section className="border-t border-warm-line bg-white py-20 sm:py-28" aria-labelledby="plano-faq">
          <Container>
            <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-teal-dark">
              Questions
            </p>
            <h2
              id="plano-faq"
              className="font-serif text-[32px] font-semibold leading-[1.1] tracking-tight text-navy sm:text-[40px]"
            >
              Med spa SEO in Plano — FAQ
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
            <p className="mt-8 text-[16px] leading-[1.7] text-warm-grey">
              Ready to see what your investment looks like?{" "}
              <Link href="/pricing" className="font-semibold text-teal underline underline-offset-2 hover:text-teal-dark">
                Compare plans and pricing
              </Link>
              .
            </p>
          </Container>
        </section>

        {/* CTA */}
        <section className="border-t border-warm-line bg-navy py-20 text-center text-white sm:py-28">
          <Container>
            <h2 className="font-serif text-[34px] font-semibold tracking-tight sm:text-[40px]">
              See where your Plano clinic stands — free
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[18px] leading-[1.7] text-[#cdd6e2]">
              Book a 30-minute visibility check and we&rsquo;ll run the AI test on your med spa,
              then show you your three fastest wins in the Plano market.
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
