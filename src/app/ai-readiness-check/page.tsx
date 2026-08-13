import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import TopBanner from "@/components/TopBanner";
import SiteFooter from "@/components/SiteFooter";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import Scorecard from "@/components/Scorecard";
import { questions, factors } from "@/lib/scorecard";
import { site, ogImage } from "@/lib/site";

const PATH = "/ai-readiness-check/";
const canonical = `${site.url}${PATH}`;

export const metadata: Metadata = {
  title: "AI Readiness Check",
  description:
    "Score your business against the five factors that decide whether AI assistants name you. Ten questions, instant results, no email required.",
  alternates: { canonical: PATH },
  openGraph: {
    type: "website",
    url: PATH,
    title: "AI Readiness Check · Frontpaged",
    description:
      "Ten questions, scored instantly against the five factors that decide whether AI assistants recommend a business.",
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Readiness Check · Frontpaged",
    description:
      "Score your business against the five factors that decide whether AI assistants name you.",
  },
};

// Deliberately NOT marked up as the free visibility check we sell. This scores
// self-reported answers in the browser; it queries no AI engine. The page says
// that in three places, because a tool that implies otherwise would undercut the
// one argument this whole site rests on.

const faqs = [
  {
    q: "Does this actually check ChatGPT for my business?",
    a: "No, and it says so throughout. This scores what you tell it about your own setup against the five factors that determine citability. Querying ChatGPT, Perplexity and Google for real is the free visibility check, which a person runs and walks you through.",
  },
  {
    q: "Where do the answers go?",
    a: "Nowhere, unless you ask us to send you the plan at the end. The scoring runs entirely in your browser and your answers are not transmitted while you work through the questions. There is no email gate on the result — you see the full breakdown whether or not you give us anything. Like most sites, this page loads analytics that records the visit itself; it cannot see what you selected.",
  },
  {
    q: "What are the five factors based on?",
    a: "How AI assistants actually assemble a recommendation: whether your page holds a liftable answer, whether your markup states your facts, whether independent sources corroborate them, whether you are present in the sources that matter in your category, and whether your content is specific enough to be worth citing.",
  },
  {
    q: "What if I don't know the answer to a question?",
    a: "Choose \"No / not sure\". For most of these, not knowing is functionally the same as no — if nobody has ever mentioned schema markup to you, it is almost certainly absent. Each question has a note explaining what it means in practice.",
  },
  {
    q: "How long does it take?",
    a: "Two or three minutes. Ten questions, three options each, and the result appears immediately with a per-factor breakdown and what to do about the weakest one.",
  },
];

export default function AiReadinessCheck() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${canonical}#page`,
        url: canonical,
        name: "AI Readiness Check",
        description:
          "A ten-question self-assessment scoring a business against the five factors that determine whether AI assistants name it.",
        isPartOf: { "@id": `${site.url}/#website` },
        about: { "@id": `${site.url}/#org` },
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
          { "@type": "ListItem", position: 2, name: "AI Readiness Check", item: canonical },
        ],
      },
    ],
  };

  return (
    <>
      <TopBanner />
      <SiteHeader />
      <main>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <Breadcrumbs
          className="border-b border-warm-line"
          crumbs={[{ label: "Home", href: "/" }, { label: "AI Readiness Check" }]}
        />

        <section className="bg-gradient-to-b from-cream to-white py-14 sm:py-16">
          <Container className="!max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-teal">
              Free · {questions.length} questions · {factors.length} factors
            </p>
            <h1 className="mt-4 font-serif text-[38px] leading-[1.1] text-navy sm:text-[46px]">
              Is your business legible to AI search?
            </h1>
            <p className="mt-6 text-[17.5px] leading-[1.75] text-warm-grey">
              Answer ten questions about your own setup and get an instant score
              against the five factors that decide whether an AI assistant names you
              — plus what to fix first.
            </p>

            {/* Said up front, not in the small print. */}
            <p className="mt-6 rounded-2xl border-l-4 border-teal bg-soft p-5 text-[15.5px] leading-[1.7] text-ink">
              <strong className="text-navy">What this is and isn&rsquo;t.</strong> This
              scores what you tell it, in your browser. Your answers stay there unless you
              choose to email yourself the plan at the end. It
              does <em>not</em> query ChatGPT or Perplexity about you — that&rsquo;s the{" "}
              <Link href="/contact/" className="text-teal underline underline-offset-2">
                free visibility check
              </Link>
              , which a person runs. Both are free; they answer different questions.
            </p>
          </Container>
        </section>

        <section className="pb-16 sm:pb-20">
          <Container className="!max-w-3xl">
            <Scorecard />
          </Container>
        </section>

        <section className="border-t border-warm-line bg-soft py-14" aria-labelledby="faq-heading">
          <Container className="!max-w-3xl">
            <h2 id="faq-heading" className="font-serif text-[26px] leading-tight text-navy">
              Questions about this tool
            </h2>
            <div className="mt-6 divide-y divide-line border-y border-line">
              {faqs.map((f) => (
                <details key={f.q} className="group py-5">
                  <summary className="cursor-pointer list-none font-serif text-[17.5px] text-navy marker:content-none">
                    {f.q}
                  </summary>
                  <p className="mt-3 text-[16px] leading-[1.7] text-warm-grey">{f.a}</p>
                </details>
              ))}
            </div>
            <p className="mt-8 text-[15.5px] text-warm-grey">
              The five factors are explained in full on the{" "}
              <Link href="/#how-ai-decides" className="text-teal underline underline-offset-2">
                homepage
              </Link>
              , and applied per industry on the{" "}
              <Link href="/industries/" className="text-teal underline underline-offset-2">
                industry pages
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
