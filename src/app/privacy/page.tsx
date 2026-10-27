import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import TopBanner from "@/components/TopBanner";
import SiteFooter from "@/components/SiteFooter";
import Container from "@/components/Container";
import { site, ogImage } from "@/lib/site";
import { getEditorialPage } from "@/lib/pages";
import { formatDate } from "@/lib/formatDate";

const PATH = "/privacy";
const canonical = `${site.url}${PATH}/`;

// The policy itself lives in content/pages/privacy.md so the WordPress import
// publishes the same text. This file is only the frame around it.
const page = getEditorialPage("privacy");

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: page?.description ?? "",
  alternates: { canonical: `${PATH}/` },
  openGraph: {
    type: "website",
    url: `${PATH}/`,
    title: "Privacy Policy · Frontpaged",
    description: page?.description ?? "",
    images: [ogImage],
  },
};

export default function PrivacyPage() {
  if (!page) return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${canonical}#webpage`,
        url: canonical,
        name: page.title,
        description: page.description,
        inLanguage: "en-US",
        dateModified: page.updated,
        isPartOf: { "@id": `${site.url}/#website` },
        about: { "@id": `${site.url}/#org` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonical}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${site.url}/` },
          { "@type": "ListItem", position: 2, name: page.title, item: canonical },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        // Built from trusted local content, not user input.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TopBanner />
      <SiteHeader />
      <main>
        <section className="bg-gradient-to-b from-cream to-white py-16 sm:py-20">
          <Container>
            <div className="max-w-3xl">
              <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-teal-dark">
                Legal
              </p>
              <h1 className="font-serif text-[38px] leading-[1.08] text-navy sm:text-[46px]">
                {page.title}
              </h1>
              {page.updated && (
                <p className="mt-4 text-[14px] text-warm-grey">
                  Last updated{" "}
                  <time dateTime={page.updated}>{formatDate(page.updated)}</time>
                </p>
              )}
            </div>
          </Container>
        </section>
        <section className="py-12">
          <Container>
            <div
              className="prose prose-lg max-w-3xl prose-headings:font-serif prose-headings:text-navy prose-a:text-teal prose-p:text-warm-grey prose-li:text-warm-grey"
              // Rendered from our own markdown in content/pages/, not user input.
              dangerouslySetInnerHTML={{ __html: page.html }}
            />
          </Container>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
