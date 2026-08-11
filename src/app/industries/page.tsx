import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Container from "@/components/Container";
import CtaPanel from "@/components/CtaPanel";
import IndustryGrid from "@/components/IndustryGrid";
import { getPublishedVerticals } from "@/lib/verticals";
import { getIndustryBody } from "@/lib/industries";
import { site, ogImage } from "@/lib/site";

const PATH = "/industries";
const canonical = `${site.url}${PATH}`;

export const metadata: Metadata = {
  title: "Industries We Serve",
  description:
    "Frontpaged builds SEO and Generative Engine Optimization content for eight service industries — see pricing, FAQs, and compliance for each.",
  alternates: { canonical: `${PATH}/` },
  openGraph: {
    type: "website",
    url: `${PATH}/`,
    title: "Industries We Serve · Frontpaged",
    description:
      "SEO and Generative Engine Optimization content built for the way each industry is actually searched — see pricing and FAQs by industry.",
    images: [ogImage],
  },
};

export default function IndustriesIndex() {
  // Only industries with a written hub page are linkable in the static export —
  // the same filter src/app/industries/[slug]/page.tsx uses for
  // generateStaticParams. A published vertical without a body (Task 10) has no
  // page to link to yet.
  const industries = getPublishedVerticals().filter((v) => getIndustryBody(v.slug) !== null);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ItemList",
        "@id": `${canonical}/#list`,
        itemListElement: industries.map((v, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: v.name,
          url: `${canonical}/${v.slug}/`,
        })),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonical}/#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${site.url}/` },
          { "@type": "ListItem", position: 2, name: "Industries", item: `${canonical}/` },
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
        <section className="bg-gradient-to-b from-cream to-white py-16 sm:py-20">
          <Container>
            <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-teal-dark">
              Industries
            </p>
            <h1 className="max-w-3xl font-serif text-[40px] font-semibold leading-[1.08] tracking-tight text-navy sm:text-[52px]">
              SEO &amp; GEO built for{" "}
              <span className="italic text-teal">how each industry searches</span>
            </h1>
            <p className="mt-6 max-w-2xl text-[18px] leading-[1.7] text-warm-grey">
              A patient searching for a med spa, a family searching for an estate attorney, and a
              buyer searching for a real estate team are all asking AI engines and Google
              different kinds of questions. We build content, pricing, and compliance guardrails
              specific to each industry we serve — pick yours below.
            </p>
          </Container>
        </section>

        <IndustryGrid />

        <CtaPanel />
      </main>
      <SiteFooter />
    </>
  );
}
