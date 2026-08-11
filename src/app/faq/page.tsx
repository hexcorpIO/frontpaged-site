import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Container from "@/components/Container";
import CtaPanel from "@/components/CtaPanel";
import { faqHub, allHubFaqs } from "@/lib/faqHub";
import { site } from "@/lib/site";

const PATH = "/faq";
const canonical = `${site.url}${PATH}`;

export const metadata: Metadata = {
  title: "Med Spa SEO & AI Search — Frequently Asked Questions",
  description:
    "Straight answers on med spa SEO and AI-search visibility: how AI assistants pick clinics, realistic timelines, what's included, and how the work actually runs.",
  alternates: { canonical: PATH },
  openGraph: {
    type: "website",
    url: PATH,
    title: "Med Spa SEO & AI Search FAQ · Frontpaged",
    description:
      "How AI assistants choose which med spas to recommend, what results look like, and how the work runs — answered plainly.",
  },
};

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FAQPage",
        "@id": `${canonical}#faq`,
        url: canonical,
        name: "Med Spa SEO & AI Search — Frequently Asked Questions",
        inLanguage: "en-US",
        publisher: { "@id": `${site.url}/#org` },
        mainEntity: allHubFaqs.map((f) => ({
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
          { "@type": "ListItem", position: 2, name: "FAQ", item: canonical },
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
              Questions
            </p>
            <h1 className="max-w-3xl font-serif text-[40px] font-semibold leading-[1.08] tracking-tight text-navy sm:text-[52px]">
              Straight answers, no{" "}
              <span className="italic text-teal">agency fog</span>.
            </h1>
            <p className="mt-6 max-w-2xl text-[19px] leading-[1.7] text-warm-grey">
              {allHubFaqs.length} questions med spa owners actually ask about SEO and AI-search
              visibility — including the ones with uncomfortable answers.
            </p>

            <nav aria-label="Question categories" className="mt-8 flex flex-wrap gap-2">
              {faqHub.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="rounded-full border border-warm-line bg-white px-4 py-2 text-[14px] font-medium text-navy transition hover:border-teal hover:bg-soft hover:text-teal-dark"
                >
                  {s.heading}
                </a>
              ))}
            </nav>
          </Container>
        </section>

        {faqHub.map((section) => (
          <section
            key={section.id}
            id={section.id}
            className="scroll-mt-20 border-t border-warm-line py-14 sm:py-16"
            aria-labelledby={`${section.id}-heading`}
          >
            <Container className="!max-w-3xl">
              <h2
                id={`${section.id}-heading`}
                className="font-serif text-[28px] font-semibold tracking-tight text-navy"
              >
                {section.heading}
              </h2>
              <p className="mt-2 text-[16px] leading-[1.7] text-warm-grey">{section.blurb}</p>

              <div className="mt-7 space-y-3">
                {section.faqs.map((f) => (
                  <details
                    key={f.q}
                    className="group overflow-hidden rounded-xl border border-warm-line bg-cream"
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-serif text-[17px] font-semibold text-navy [&::-webkit-details-marker]:hidden">
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
                    <p className="px-5 pb-4 text-[15.5px] leading-[1.7] text-warm-grey">{f.a}</p>
                  </details>
                ))}
              </div>
            </Container>
          </section>
        ))}

        <section className="border-t border-warm-line bg-cream py-14">
          <Container className="!max-w-3xl">
            <h2 className="font-serif text-[24px] font-semibold tracking-tight text-navy">
              Looking for something more specific?
            </h2>
            <ul className="mt-5 space-y-2.5 text-[16px]">
              <li>
                <Link href="/pricing/" className="font-semibold text-teal-dark hover:text-teal">
                  Pricing questions
                </Link>{" "}
                <span className="text-warm-grey">— plans, contracts, the founding rate, the audit</span>
              </li>
              <li>
                <Link href="/glossary/" className="font-semibold text-teal-dark hover:text-teal">
                  Glossary
                </Link>{" "}
                <span className="text-warm-grey">— every term defined in one sentence</span>
              </li>
              <li>
                <Link href="/blog/" className="font-semibold text-teal-dark hover:text-teal">
                  The blog
                </Link>{" "}
                <span className="text-warm-grey">— longer guides on each topic above</span>
              </li>
            </ul>
          </Container>
        </section>

        <CtaPanel
          heading="Still have a question we haven't answered?"
          sub="Book a free 30-minute visibility check. We'll run the AI test on your clinic and you can ask whatever you want — no pitch required."
        />
      </main>
      <SiteFooter />
    </>
  );
}
