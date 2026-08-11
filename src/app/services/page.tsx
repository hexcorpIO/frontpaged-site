import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import TopBanner from "@/components/TopBanner";
import SiteFooter from "@/components/SiteFooter";
import Container from "@/components/Container";
import CtaPanel from "@/components/CtaPanel";
import { getPublishedAddOnServices } from "@/lib/services";
import { site, ogImage } from "@/lib/site";

const PATH = "/services/";
const canonical = `${site.url}/services/`;

export const metadata: Metadata = {
  title: "Services",
  description:
    "Everything Frontpaged does for high-ticket local businesses — search and AI visibility, plus the advertising, measurement, and web work that supports it.",
  alternates: { canonical: PATH },
  openGraph: {
    type: "website",
    url: PATH,
    title: "Services · Frontpaged",
    description:
      "Search and AI visibility for high-ticket local businesses, plus the advertising, measurement, and web work around it.",
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "Services · Frontpaged",
    description:
      "Search and AI visibility for high-ticket local businesses, plus the advertising, measurement, and web work around it.",
  },
};

// The two core services keep their own hand-written pages; the add-ons are
// registry-driven. Listing them together is the point of this page — a prospect
// should see the whole capability without having to guess what else exists.
const coreServices = [
  {
    href: "/services/generative-engine-optimization/",
    name: "Generative Engine Optimization",
    blurb:
      "Getting your business named and cited when someone asks ChatGPT, Perplexity, or Google's AI Overviews for a recommendation.",
  },
  {
    href: "/services/google-business-profile/",
    name: "Google Business Profile",
    blurb:
      "Winning the local map pack — the three results that capture people ready to call or drive to you today.",
  },
];

export default function ServicesIndex() {
  const addOns = getPublishedAddOnServices();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${canonical}#page`,
        name: "Services",
        description:
          "Search and AI visibility for high-ticket local businesses, plus the advertising, measurement, and web work that supports it.",
        url: canonical,
        isPartOf: { "@id": `${site.url}/#website` },
        about: { "@id": `${site.url}/#org` },
      },
      {
        "@type": "ItemList",
        "@id": `${canonical}#list`,
        itemListElement: [
          ...coreServices.map((s, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: s.name,
            url: `${site.url}${s.href}`,
          })),
          ...addOns.map((s, i) => ({
            "@type": "ListItem",
            position: coreServices.length + i + 1,
            name: s.name,
            url: `${site.url}/services/${s.slug}/`,
          })),
        ],
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${site.url}/` },
          { "@type": "ListItem", position: 2, name: "Services", item: canonical },
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

        <section className="bg-gradient-to-b from-cream to-white pt-14 pb-14 sm:pt-16">
          <Container>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-teal">
              What we do
            </p>
            <h1 className="mt-4 max-w-3xl font-serif text-[38px] leading-[1.08] text-navy sm:text-[52px]">
              Everything that makes you the answer
            </h1>
            <p className="mt-6 max-w-2xl text-[17px] leading-[1.7] text-warm-grey">
              Content and AI-search visibility is the core of what we do. The services
              around it exist because visibility on its own does not book anything —
              the click has to land somewhere fast, the inquiry has to be answered, and
              somebody has to know which of it worked.
            </p>
          </Container>
        </section>

        <section className="pb-4" aria-labelledby="core-heading">
          <Container>
            <h2
              id="core-heading"
              className="font-serif text-[26px] leading-tight text-navy sm:text-[30px]"
            >
              Core
            </h2>
            <p className="mt-3 max-w-2xl text-[16px] leading-[1.7] text-warm-grey">
              Included in every retainer, priced by industry on the{" "}
              <Link href="/pricing/" className="text-teal underline underline-offset-2">
                pricing page
              </Link>
              .
            </p>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {coreServices.map((s) => (
                <Link
                  key={s.href}
                  href={s.href}
                  className="group rounded-2xl border border-line bg-white p-7 transition hover:border-teal"
                >
                  <h3 className="font-serif text-[21px] leading-snug text-navy group-hover:text-teal">
                    {s.name}
                  </h3>
                  <p className="mt-3 text-[15.5px] leading-[1.7] text-warm-grey">
                    {s.blurb}
                  </p>
                </Link>
              ))}
            </div>
          </Container>
        </section>

        <section className="py-16 sm:py-20" aria-labelledby="addons-heading">
          <Container>
            <h2
              id="addons-heading"
              className="font-serif text-[26px] leading-tight text-navy sm:text-[30px]"
            >
              Additional services
            </h2>
            <p className="mt-3 max-w-2xl text-[16px] leading-[1.7] text-warm-grey">
              Available alongside any retainer. Scoped and quoted per engagement rather
              than sold at a fixed rate — ad management is priced against spend, builds
              against scope, and a single-location practice is not a multi-location
              group.
            </p>
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {addOns.map((s) => (
                <Link
                  key={s.slug}
                  href={`/services/${s.slug}/`}
                  className="group flex flex-col rounded-2xl border border-line bg-white p-7 transition hover:border-teal"
                >
                  <h3 className="font-serif text-[20px] leading-snug text-navy group-hover:text-teal">
                    {s.name}
                  </h3>
                  <p className="mt-2 text-[14px] font-medium text-teal">{s.tagline}</p>
                  <p className="mt-3 text-[15px] leading-[1.7] text-warm-grey">
                    {s.metaDescription}
                  </p>
                </Link>
              ))}
            </div>
          </Container>
        </section>

        <section className="bg-soft py-14" aria-labelledby="industries-heading">
          <Container>
            <h2
              id="industries-heading"
              className="font-serif text-[26px] leading-tight text-navy sm:text-[30px]"
            >
              Looking for your industry instead?
            </h2>
            <p className="mt-3 max-w-2xl text-[16px] leading-[1.7] text-warm-grey">
              These pages describe what we do. The{" "}
              <Link
                href="/industries/"
                className="text-teal underline underline-offset-2"
              >
                industry pages
              </Link>{" "}
              describe who we do it for, with pricing, FAQs, and the compliance posture
              for each.
            </p>
          </Container>
        </section>

        <CtaPanel />
      </main>
      <SiteFooter />
    </>
  );
}
