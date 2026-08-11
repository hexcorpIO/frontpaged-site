import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Container from "@/components/Container";
import CtaPanel from "@/components/CtaPanel";
import { glossary, glossaryCategories } from "@/lib/glossary";
import { site, ogImage } from "@/lib/site";

const PATH = "/glossary";
const canonical = `${site.url}${PATH}`;

export const metadata: Metadata = {
  title: "SEO & AI Search Glossary for Med Spas",
  description:
    "Plain-English definitions of the SEO, GEO, and AI-search terms med spa owners actually run into — from answer-first content to E-E-A-T to the map pack.",
  alternates: { canonical: PATH },
  openGraph: {
    type: "website",
    url: PATH,
    title: "SEO & AI Search Glossary for Med Spas · Frontpaged",
    description:
      "Every SEO, GEO, and AI-search term a med spa owner needs, defined in one or two sentences.",
    images: [ogImage],
  },
};

export default function GlossaryPage() {
  // DefinedTermSet is the schema type built for exactly this: a controlled
  // vocabulary where each entry is a self-contained definition an engine can
  // lift and attribute. The rendered text and the markup come from one source.
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "DefinedTermSet",
        "@id": `${canonical}#glossary`,
        name: "Med Spa SEO & AI Search Glossary",
        description:
          "Definitions of the SEO, Generative Engine Optimization, and AI-search terms relevant to medical spa marketing.",
        url: canonical,
        inLanguage: "en-US",
        publisher: { "@id": `${site.url}/#org` },
        hasDefinedTerm: glossary.map((t) => ({
          "@type": "DefinedTerm",
          "@id": `${canonical}#${t.slug}`,
          name: t.term,
          description: t.definition,
          ...(t.also?.length ? { alternateName: t.also } : {}),
          inDefinedTermSet: { "@id": `${canonical}#glossary` },
          url: `${canonical}/#${t.slug}`,
        })),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonical}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${site.url}/` },
          { "@type": "ListItem", position: 2, name: "Glossary", item: canonical },
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
              Glossary
            </p>
            <h1 className="max-w-3xl font-serif text-[40px] font-semibold leading-[1.08] tracking-tight text-navy sm:text-[52px]">
              Every term, in{" "}
              <span className="italic text-teal">one sentence</span>.
            </h1>
            <p className="mt-6 max-w-2xl text-[19px] leading-[1.7] text-warm-grey">
              The SEO, GEO, and AI-search vocabulary med spa owners actually encounter — defined
              plainly, without the agency jargon that usually surrounds it. {glossary.length} terms.
            </p>

            <nav aria-label="Glossary categories" className="mt-8 flex flex-wrap gap-2">
              {glossaryCategories.map((c) => (
                <a
                  key={c}
                  href={`#${c.toLowerCase().replace(/\s+/g, "-")}`}
                  className="rounded-full border border-warm-line bg-white px-4 py-2 text-[14px] font-medium text-navy transition hover:border-teal hover:bg-soft hover:text-teal-dark"
                >
                  {c}
                </a>
              ))}
            </nav>
          </Container>
        </section>

        {glossaryCategories.map((category) => {
          const terms = glossary.filter((t) => t.category === category);
          const id = category.toLowerCase().replace(/\s+/g, "-");
          return (
            <section
              key={category}
              id={id}
              className="border-t border-warm-line py-14 sm:py-16"
              aria-labelledby={`${id}-heading`}
            >
              <Container>
                <h2
                  id={`${id}-heading`}
                  className="font-serif text-[28px] font-semibold tracking-tight text-navy"
                >
                  {category}
                </h2>
                <dl className="mt-8 grid gap-6 md:grid-cols-2">
                  {terms.map((t) => (
                    <div
                      key={t.slug}
                      id={t.slug}
                      className="scroll-mt-24 rounded-2xl border border-warm-line bg-white p-6 shadow-[0_8px_30px_rgba(21,38,63,0.04)]"
                    >
                      <dt className="font-serif text-[19px] font-semibold text-navy">{t.term}</dt>
                      {t.also?.length ? (
                        <p className="mt-1 text-[13px] font-medium uppercase tracking-[0.1em] text-warm-grey">
                          Also: {t.also.join(", ")}
                        </p>
                      ) : null}
                      <dd className="mt-3 text-[15.5px] leading-[1.7] text-ink">{t.definition}</dd>
                      <dd className="mt-3 border-t border-warm-line pt-3 text-[14.5px] leading-[1.65] text-warm-grey">
                        {t.context}
                      </dd>
                    </div>
                  ))}
                </dl>
              </Container>
            </section>
          );
        })}

        <CtaPanel
          heading="Want to know how you score on all of this?"
          sub="Book a free 30-minute visibility check and we'll run the AI test on your clinic — then show you the three terms above that are actually costing you patients."
        />
      </main>
      <SiteFooter />
    </>
  );
}
