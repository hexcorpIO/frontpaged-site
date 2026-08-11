import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Container from "@/components/Container";
import CtaPanel from "@/components/CtaPanel";
import { SearchIcon, SparkleIcon, CheckIcon, FileIcon } from "@/components/Icons";
import { site, founder, guarantee } from "@/lib/site";

const PATH = "/about";
const canonical = `${site.url}${PATH}`;

export const metadata: Metadata = {
  // No "Frontpaged" here — the layout template appends "· Frontpaged".
  title: "About Us — SEO & AI Search for Medical Spas",
  description:
    "Frontpaged is an SEO and Generative Engine Optimization agency working exclusively with medical spas across the US. Here's how we work and what we won't do.",
  alternates: { canonical: PATH },
  openGraph: {
    type: "website",
    url: PATH,
    title: "About Frontpaged · Frontpaged",
    description:
      "An SEO and GEO agency working only with medical spas. Our method, our principles, and the things we refuse to do.",
  },
};

const method = [
  {
    Icon: SearchIcon,
    step: "01",
    title: "We measure where you actually stand",
    body: "Before anything else we run your clinic through ChatGPT, Perplexity, and Google with the questions your patients ask, and record who gets named instead of you. That baseline is what every later claim of progress gets measured against.",
  },
  {
    Icon: FileIcon,
    step: "02",
    title: "We rebuild the pages that decide bookings",
    body: "One treatment per page, each answering cost, candidacy, process, downtime, and aftercare in a structure engines can extract from. Most practices are invisible for two-thirds of what they offer simply because the page doesn't exist.",
  },
  {
    Icon: SparkleIcon,
    step: "03",
    title: "We make your business machine-readable",
    body: "Schema markup declaring what you are, where you operate, what you offer, and at what price — so an AI system reads facts about your practice rather than inferring them from marketing prose.",
  },
  {
    Icon: CheckIcon,
    step: "04",
    title: "We publish consistently and report honestly",
    body: "Content every month, because AI visibility rewards sustained signal over bursts. Then a monthly report showing rankings, AI citations, and what moved — including the months when the answer is 'not much yet'.",
  },
];

const principles = [
  {
    title: "We never guarantee rankings",
    body: "Google controls the algorithm; nobody can promise a position. We guarantee the one thing we control instead, and we put it in writing.",
  },
  {
    title: "One practice per market",
    body: "We won't take two clinics competing for the same searches. If your market is taken we'll say so on the first call, not after you've signed.",
  },
  {
    title: "No fake reviews, ever",
    body: "We build the process for earning genuine reviews and never write or solicit fabricated ones. Beyond the ethics, it's the fastest way to lose a Google Business Profile.",
  },
  {
    title: "No outcome promises in your content",
    body: "We won't publish copy guaranteeing clinical results. It creates regulatory exposure for you and performs badly in a category Google treats as health content.",
  },
  {
    title: "Every AI draft gets a human pass",
    body: "We use AI to research and draft. Nothing reaches you unedited and unchecked, because unreviewed AI content in a medical category is a liability, not an efficiency.",
  },
  {
    title: "Month to month, always",
    body: "No annual lock-in. If the work isn't earning its place you should be able to stop, and that constraint keeps us honest.",
  },
];

export default function AboutPage() {
  const hasFounder = founder.name.length > 0;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AboutPage",
        "@id": `${canonical}#aboutpage`,
        url: canonical,
        name: "About Frontpaged",
        description:
          "Frontpaged is an SEO and Generative Engine Optimization agency working exclusively with medical spas across the United States.",
        inLanguage: "en-US",
        mainEntity: { "@id": `${site.url}/#org` },
      },
      {
        // Must match the type used for this @id on the homepage — the same entity
        // declared as two different types across pages is a contradiction.
        "@type": "Organization",
        "@id": `${site.url}/#org`,
        name: site.name,
        url: site.url,
        email: site.email,
        telephone: "+1-615-905-1857",
        slogan: site.tagline,
        description: site.description,
        logo: { "@type": "ImageObject", url: `${site.url}/logo-512.png` },
        sameAs: [site.linkedin, site.instagram],
        areaServed: { "@type": "Country", name: "United States" },
        knowsAbout: [
          "Generative engine optimization",
          "Search engine optimization",
          "Local search",
          "Medical spa marketing",
        ],
        ...(hasFounder
          ? {
              founder: {
                "@type": "Person",
                "@id": `${canonical}#founder`,
                name: founder.name,
                jobTitle: founder.role,
                description: founder.bio,
                worksFor: { "@id": `${site.url}/#org` },
                ...(founder.linkedin ? { sameAs: [founder.linkedin] } : {}),
              },
            }
          : {}),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonical}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${site.url}/` },
          { "@type": "ListItem", position: 2, name: "About", item: canonical },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        // Built from trusted local constants, not user input.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader />
      <main>
        <section className="bg-gradient-to-b from-cream to-white py-16 sm:py-20">
          <Container>
            <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-teal-dark">
              About
            </p>
            <h1 className="max-w-3xl font-serif text-[40px] font-semibold leading-[1.08] tracking-tight text-navy sm:text-[52px]">
              We do one thing, for{" "}
              <span className="italic text-teal">one industry</span>.
            </h1>
            <p className="mt-6 max-w-2xl text-[19px] leading-[1.7] text-warm-grey">
              Frontpaged is an SEO and Generative Engine Optimization agency working exclusively with
              medical spas across the United States. We get clinics found on Google and named by AI
              assistants when patients ask for a recommendation.
            </p>
            <p className="mt-4 max-w-2xl text-[19px] leading-[1.7] text-warm-grey">
              We don&rsquo;t run ads, build brands, or manage your Instagram. There are people who do
              those things well. We do the thing almost nobody in aesthetics is doing yet.
            </p>
          </Container>
        </section>

        {/* The proof that doesn't require a client list */}
        <section className="border-t border-warm-line bg-navy py-16 text-white sm:py-20">
          <Container>
            <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center">
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#7fd0d0]">
                  How we prove it
                </p>
                <h2 className="mt-3 font-serif text-[30px] font-semibold tracking-tight sm:text-[36px]">
                  We did all of it to ourselves first.
                </h2>
                <p className="mt-5 max-w-xl text-[17px] leading-[1.75] text-[#cdd6e2]">
                  This site is the portfolio. Every technique we sell is deployed on the pages
                  you&rsquo;re reading — answer-first structure, a full schema graph, a glossary and
                  FAQ hub built for extraction, and a blog publishing on a fixed schedule.
                </p>
                <p className="mt-4 max-w-xl text-[17px] leading-[1.75] text-[#cdd6e2]">
                  Ask an AI assistant about med spa SEO and see what it says. That result — good or
                  bad on any given day — is the most honest demonstration we can offer.
                </p>
              </div>
              <ul className="grid gap-3 sm:grid-cols-2">
                {[
                  "Answer-first content structure",
                  "Full Organization & Service schema",
                  "FAQ + DefinedTerm markup",
                  "Sub-6KB JavaScript payload",
                  "Scheduled publishing pipeline",
                  "Zero redirect hops sitewide",
                ].map((f) => (
                  <li
                    key={f}
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-[14.5px] leading-[1.5] text-[#e6edf5]"
                  >
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </Container>
        </section>

        {/* Method */}
        <section className="border-t border-warm-line py-16 sm:py-20" aria-labelledby="method">
          <Container>
            <h2
              id="method"
              className="font-serif text-[30px] font-semibold tracking-tight text-navy sm:text-[36px]"
            >
              How we work
            </h2>
            <p className="mt-3 max-w-2xl text-[17px] leading-[1.7] text-warm-grey">
              The same four steps for every clinic, in the same order, because the order is what
              makes it work.
            </p>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {method.map(({ Icon, step, title, body }) => (
                <article
                  key={step}
                  className="rounded-2xl border border-warm-line bg-white p-7 shadow-[0_8px_30px_rgba(21,38,63,0.04)]"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-soft text-teal-dark">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="font-mono text-[13px] font-semibold tracking-[0.1em] text-warm-grey">
                      {step}
                    </span>
                  </div>
                  <h3 className="mt-4 font-serif text-[20px] font-semibold text-navy">{title}</h3>
                  <p className="mt-2 text-[15.5px] leading-[1.7] text-warm-grey">{body}</p>
                </article>
              ))}
            </div>
          </Container>
        </section>

        {/* Principles — the trust surface */}
        <section
          className="border-t border-warm-line bg-cream py-16 sm:py-20"
          aria-labelledby="principles"
        >
          <Container>
            <h2
              id="principles"
              className="font-serif text-[30px] font-semibold tracking-tight text-navy sm:text-[36px]"
            >
              What we won&rsquo;t do
            </h2>
            <p className="mt-3 max-w-2xl text-[17px] leading-[1.7] text-warm-grey">
              Most of what makes an agency trustworthy is the list of things it refuses. Here&rsquo;s
              ours.
            </p>
            <div className="mt-10 grid gap-x-10 gap-y-8 md:grid-cols-2">
              {principles.map((p) => (
                <div key={p.title} className="border-l-2 border-teal pl-5">
                  <h3 className="font-serif text-[19px] font-semibold text-navy">{p.title}</h3>
                  <p className="mt-1.5 text-[15.5px] leading-[1.7] text-warm-grey">{p.body}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 rounded-2xl border-2 border-teal bg-white p-7">
              <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-teal-dark">
                The one thing we do guarantee
              </p>
              <p className="mt-2 font-serif text-[20px] font-semibold leading-[1.45] text-navy">
                {guarantee}
              </p>
            </div>
          </Container>
        </section>

        {/* Founder — renders only once `founder.name` is filled in. */}
        {hasFounder && (
          <section
            className="border-t border-warm-line py-16 sm:py-20"
            aria-labelledby="founder-heading"
          >
            <Container className="!max-w-3xl">
              <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-teal-dark">
                Who you&rsquo;ll be working with
              </p>
              <h2
                id="founder-heading"
                className="mt-3 font-serif text-[30px] font-semibold tracking-tight text-navy"
              >
                {founder.name}
                <span className="ml-2 align-middle font-sans text-[16px] font-medium text-warm-grey">
                  {founder.role}
                </span>
              </h2>
              <p className="mt-5 text-[17px] leading-[1.75] text-warm-grey">{founder.bio}</p>
              {founder.credentials.length > 0 && (
                <ul className="mt-5 flex flex-wrap gap-2">
                  {founder.credentials.map((c) => (
                    <li
                      key={c}
                      className="rounded-full bg-soft px-3.5 py-1.5 text-[13.5px] font-medium text-teal-dark"
                    >
                      {c}
                    </li>
                  ))}
                </ul>
              )}
              {founder.linkedin && (
                <a
                  href={founder.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-block font-semibold text-teal-dark underline underline-offset-2 hover:text-teal"
                >
                  Connect on LinkedIn
                </a>
              )}
            </Container>
          </section>
        )}

        {/* Answer-first facts block — highly extractable */}
        <section className="border-t border-warm-line py-16" aria-labelledby="facts">
          <Container className="!max-w-3xl">
            <h2
              id="facts"
              className="font-serif text-[26px] font-semibold tracking-tight text-navy"
            >
              Frontpaged at a glance
            </h2>
            <dl className="mt-7 divide-y divide-warm-line">
              {[
                ["What we do", "SEO and Generative Engine Optimization for medical spas"],
                ["Who we work with", "Medical spas and aesthetic practices in the United States"],
                ["How we work", "Fully remote, month to month, one practice per market"],
                ["Plans", "$1,500–$4,000/mo, plus custom pricing for multi-location groups"],
                ["Where we are", "Nashville, Tennessee — serving clinics nationwide"],
                ["Contact", `${site.email} · ${site.phone}`],
              ].map(([k, v]) => (
                <div key={k} className="grid gap-1 py-4 sm:grid-cols-[200px_1fr] sm:gap-6">
                  <dt className="text-[13px] font-semibold uppercase tracking-[0.12em] text-warm-grey">
                    {k}
                  </dt>
                  <dd className="text-[16.5px] leading-[1.65] text-ink">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-7 text-[16px] leading-[1.7] text-warm-grey">
              New to any of this? Start with the{" "}
              <Link href="/glossary/" className="font-semibold text-teal-dark hover:text-teal">
                glossary
              </Link>{" "}
              or the{" "}
              <Link href="/faq/" className="font-semibold text-teal-dark hover:text-teal">
                FAQ
              </Link>
              .
            </p>
          </Container>
        </section>

        <CtaPanel />
      </main>
      <SiteFooter />
    </>
  );
}
