import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Container from "@/components/Container";
import Button from "@/components/Button";
import { site } from "@/lib/site";

const PATH = "/services/generative-engine-optimization";
const canonical = `${site.url}${PATH}`;

export const metadata: Metadata = {
  title: "Generative Engine Optimization (GEO) for Med Spas | Frontpaged",
  description:
    "Get your med spa cited by ChatGPT, Perplexity, and Google AI Overviews. Generative engine optimization built for DFW medical spas.",
  alternates: { canonical: PATH },
  openGraph: {
    type: "website",
    url: PATH,
    title: "Generative Engine Optimization (GEO) for Med Spas | Frontpaged",
    description:
      "Get your DFW med spa recommended by AI search — ChatGPT, Perplexity, and Google AI Overviews. Done-for-you GEO content.",
  },
};

const signals = [
  {
    title: "Answer-first content AI can actually quote",
    body: "AI engines don't browse — they retrieve. When a patient asks ChatGPT for the best Botox provider in Plano, it pulls the clearest, most direct answer it can find. We write your pages so that answer is yours: specific, credible, structured to be extracted verbatim.",
  },
  {
    title: "Schema markup that identifies you as an entity",
    body: "FAQPage, Service, and LocalBusiness schema tell AI what your clinic does, who you serve, and where you operate — in a language the model can read without guessing. Without it, you're just text. With it, you're a named, citable source.",
  },
  {
    title: "Citations and E-E-A-T signals that earn trust",
    body: "AI engines weight sources that other authoritative sites reference. We build the content strategy — topical depth, consistent NAP, review volume, and external mentions — that positions your clinic as the credible answer rather than a random result.",
  },
  {
    title: "Consistent, accurate information everywhere it's looked up",
    body: "ChatGPT and Perplexity cross-reference Google Business Profile, your website, directories, and review platforms. Inconsistent names, addresses, or service lists create confusion that knocks you off the shortlist. We audit and align every signal.",
  },
];

const deliverables = [
  "Answer-first treatment pages written to be quoted by AI search",
  "FAQPage, Service, and LocalBusiness schema on every page",
  "Monthly GEO content articles compounding your entity authority",
  "Google Business Profile optimization to anchor your local entity",
  "Citation and mention tracking across ChatGPT, Perplexity, and AI Overviews",
  "Review strategy to build the trust signals AI engines prioritize",
];

const faqs = [
  {
    q: "What is generative engine optimization (GEO)?",
    a: "Generative engine optimization is the practice of structuring your website content, schema markup, and off-site signals so that AI-powered search engines — ChatGPT, Perplexity, Google's AI Overviews — recommend and cite your business when a user asks a relevant question. Where traditional SEO targets ranked links, GEO targets direct AI citations.",
  },
  {
    q: "Does GEO replace traditional SEO for my med spa?",
    a: "No — they reinforce each other. Strong local SEO (ranking on Google, winning the map pack) gives AI engines a credible source to cite. We run both together: the same answer-first content that earns Google rankings also gives AI something concrete to quote. You don't have to choose.",
  },
  {
    q: "Which AI tools does GEO affect?",
    a: "Our GEO work targets the tools your DFW patients are most likely to use: ChatGPT, Perplexity, and Google's AI Overviews. As AI search evolves, the underlying signals — authoritative content, structured data, consistent entity information — transfer across platforms.",
  },
  {
    q: "How do you measure GEO results?",
    a: "We run regular AI citation tests — prompting ChatGPT, Perplexity, and others with the queries your patients actually ask — and track whether your clinic is named. We also monitor AI Overview appearances in Google Search Console and report on citation share over time, alongside traditional ranking and traffic data.",
  },
  {
    q: "How long does it take to start appearing in AI answers?",
    a: "Most clinics begin seeing AI citations within 90 to 120 days of consistent GEO work. Google AI Overviews tend to respond faster than ChatGPT because they pull from indexed content in near real time. The compounding nature of content and schema means results accelerate the longer we work together.",
  },
];

export default function GeoPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${canonical}#service`,
        name: "Generative Engine Optimization for Medical Spas",
        serviceType:
          "Generative Engine Optimization (GEO) and AI-search visibility for medical spas",
        description:
          "Done-for-you GEO content and schema strategy that gets Dallas–Fort Worth med spas cited by ChatGPT, Perplexity, and Google AI Overviews.",
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
          {
            "@type": "ListItem",
            position: 2,
            name: "Generative Engine Optimization (GEO)",
            item: canonical,
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
              GEO for med spas
            </p>
            <h1 className="max-w-3xl font-serif text-[40px] font-semibold leading-[1.08] tracking-tight text-navy sm:text-[54px]">
              Get your med spa{" "}
              <span className="italic text-teal">recommended by AI search</span>
            </h1>
            <p className="mt-6 max-w-2xl text-[19px] leading-[1.7] text-warm-grey">
              When a patient asks ChatGPT or Perplexity for the best med spa in Dallas, a short list
              of clinics gets named — and everyone else is invisible. Generative Engine Optimization
              is how you get on that list.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <Button href="/#contact" size="lg">
                Get a free AI visibility audit
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
                Generative Engine Optimization (GEO) is the discipline of structuring your content
                and markup so AI-powered search engines — ChatGPT, Perplexity, Google AI Overviews —
                cite your clinic by name. For a DFW med spa, that means more high-intent patients
                discovering you before they ever open a browser tab. GEO doesn&rsquo;t replace{" "}
                <Link href="/services/med-spa-seo" className="text-teal underline">
                  traditional SEO
                </Link>{" "}
                — it layers on top of it to capture the next wave of how patients search.
              </p>
            </div>
          </Container>
        </section>

        {/* What GEO is and how it differs */}
        <section className="border-t border-warm-line bg-cream py-20 sm:py-28">
          <Container>
            <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-teal-dark">
              GEO vs. SEO
            </p>
            <h2 className="max-w-2xl font-serif text-[32px] font-semibold leading-[1.1] tracking-tight text-navy sm:text-[40px]">
              AI search doesn&rsquo;t rank pages. It names sources.
            </h2>
            <div className="mt-6 max-w-[760px] space-y-5 text-[17px] leading-[1.75] text-warm-grey">
              <p>
                Traditional SEO is about ranking: you get your med spa to position one on a Google
                results page and let patients click through. It&rsquo;s still essential — and it&rsquo;s one of
                the{" "}
                <Link href="/services/med-spa-seo" className="text-teal underline">
                  core things we do
                </Link>
                .
              </p>
              <p>
                But AI search works differently. When a patient types &ldquo;what&rsquo;s the best med spa for
                microneedling in Frisco?&rdquo; into ChatGPT or Google&rsquo;s AI Overview, they don&rsquo;t get ten
                blue links. They get a paragraph that names one or two clinics and explains why.
                The AI synthesizes its answer from indexed content, structured data, and trust
                signals — then cites the source it found most credible.
              </p>
              <p>
                GEO is the practice of engineering those signals. Answer-first formatting, FAQ
                schema, entity consistency, citation building — all of it works together so the AI
                picks your clinic when a DFW patient asks. We cover both disciplines because
                you need both to win{" "}
                <Link
                  href="/blog/what-is-generative-engine-optimization"
                  className="text-teal underline"
                >
                  in today&rsquo;s search landscape
                </Link>
                .
              </p>
            </div>
          </Container>
        </section>

        {/* How AI picks med spas — numbered cards */}
        <section className="border-t border-warm-line bg-white py-20 sm:py-28">
          <Container>
            <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-teal-dark">
              How it works
            </p>
            <h2 className="max-w-2xl font-serif text-[32px] font-semibold leading-[1.1] tracking-tight text-navy sm:text-[40px]">
              What makes an AI recommend your med spa over the one down the street
            </h2>
            <p className="mt-4 max-w-2xl text-[17px] leading-[1.7] text-warm-grey">
              AI engines don&rsquo;t flip a coin. They weight specific signals when deciding which clinic
              to name. These are the four that move the needle most for DFW med spas — and the ones
              we build into everything we do. Read more in our guide to{" "}
              <Link
                href="/blog/how-ai-search-recommends-med-spas"
                className="text-teal underline"
              >
                how AI search recommends med spas
              </Link>
              .
            </p>
            <div className="mt-10 grid gap-[22px] md:grid-cols-2">
              {signals.map((s, i) => (
                <article
                  key={s.title}
                  className="rounded-2xl border border-warm-line bg-cream p-8 shadow-[0_8px_30px_rgba(21,38,63,0.05)]"
                >
                  <div className="mb-5 flex items-baseline gap-3">
                    <span className="font-serif text-4xl font-semibold text-teal">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="h-px flex-1 bg-warm-line" />
                  </div>
                  <h3 className="font-serif text-[20px] font-semibold text-navy">{s.title}</h3>
                  <p className="mt-2.5 text-[15.5px] leading-[1.65] text-warm-grey">{s.body}</p>
                </article>
              ))}
            </div>
          </Container>
        </section>

        {/* What we do */}
        <section className="border-t border-warm-line bg-sand py-20 sm:py-28">
          <Container>
            <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-teal-dark">
              What we do
            </p>
            <h2 className="max-w-2xl font-serif text-[32px] font-semibold leading-[1.1] tracking-tight text-navy sm:text-[40px]">
              A complete GEO system for your med spa — done for you
            </h2>
            <p className="mt-4 max-w-2xl text-[17px] leading-[1.7] text-warm-grey">
              Every engagement includes the content, schema, and citation work that gets AI engines
              to notice and name your clinic. Here&rsquo;s what that looks like in practice:
            </p>
            <ul className="mt-10 grid gap-x-10 gap-y-4 sm:grid-cols-2">
              {deliverables.map((item) => (
                <li
                  key={item}
                  className="relative pl-7 text-[16px] leading-[1.6] text-ink before:absolute before:left-0 before:top-1 before:font-bold before:text-teal before:content-['✓']"
                >
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-10 max-w-2xl text-[17px] leading-[1.7] text-warm-grey">
              Not sure which plan fits where you are now?{" "}
              <Link href="/pricing" className="text-teal underline">
                Compare plans and pricing
              </Link>{" "}
              — or book a free audit below and we&rsquo;ll recommend one after looking at your current
              visibility.
            </p>
          </Container>
        </section>

        {/* FAQ */}
        <section
          className="border-t border-warm-line bg-white py-20 sm:py-28"
          aria-labelledby="geo-faq"
        >
          <Container>
            <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-teal-dark">
              Questions
            </p>
            <h2
              id="geo-faq"
              className="font-serif text-[32px] font-semibold leading-[1.1] tracking-tight text-navy sm:text-[40px]"
            >
              GEO for med spas — FAQ
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
              Find out if AI search is naming your med spa
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[18px] leading-[1.7] text-[#cdd6e2]">
              We&rsquo;ll run the AI citation test on your clinic live, show you where you&rsquo;re missing
              from the shortlist, and walk you through the fastest path to getting cited. No
              obligation.
            </p>
            <div className="mt-7 flex justify-center">
              <Link
                href="/#contact"
                className="inline-flex items-center justify-center rounded-full bg-teal px-9 py-4 text-[17px] font-semibold text-white transition hover:bg-white hover:text-navy"
              >
                Book your free AI visibility audit
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
