import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import TopBanner from "@/components/TopBanner";
import SiteFooter from "@/components/SiteFooter";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import CtaPanel from "@/components/CtaPanel";
import { getAllPosts } from "@/lib/blog";
import { formatDate } from "@/lib/formatDate";
import { site, ogImage, founder, founderId } from "@/lib/site";

const PATH = "/author/benton-purvis/";
const canonical = `${site.url}${PATH}`;

// A real home for the Person entity.
//
// Until now the author existed only as `/about#founder` — a fragment, not a URL.
// Forty-nine posts reference that @id, so the entity anchoring authorship across
// the whole site had no page of its own, no index of what it had written, and
// nothing for a reader following a byline to land on.
//
// The @id stays `/about#founder` rather than moving here: it is already deployed
// and referenced everywhere, and changing an established @id breaks the
// correlation it exists to create. This page declares the same node and claims
// `mainEntityOfPage`, which is the correct way to give an existing entity a home
// without renaming it.

export const metadata: Metadata = {
  title: `${founder.name} — Author`,
  description:
    "Articles on SEO, generative engine optimization, and AI-search visibility by the founder of Frontpaged, written for high-ticket local businesses.",
  alternates: { canonical: PATH },
  openGraph: {
    type: "profile",
    url: PATH,
    title: `${founder.name} · Frontpaged`,
    description:
      "Articles on SEO, generative engine optimization, and AI-search visibility for high-ticket local businesses.",
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: `${founder.name} · Frontpaged`,
    description:
      "Articles on SEO, GEO, and AI-search visibility for high-ticket local businesses.",
  },
};

export default function AuthorPage() {
  const posts = getAllPosts();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfilePage",
        "@id": `${canonical}#page`,
        url: canonical,
        name: `${founder.name} — Author`,
        mainEntity: { "@id": founderId },
        isPartOf: { "@id": `${site.url}/#website` },
      },
      {
        "@type": "Person",
        "@id": founderId,
        name: founder.name,
        jobTitle: founder.role,
        url: canonical,
        mainEntityOfPage: { "@id": `${canonical}#page` },
        worksFor: { "@id": `${site.url}/#org` },
        ...(founder.bio ? { description: founder.bio } : {}),
        ...(founder.linkedin ? { sameAs: [founder.linkedin] } : {}),
        ...(founder.credentials.length > 0
          ? {
              hasCredential: founder.credentials.map((c) => ({
                "@type": "EducationalOccupationalCredential",
                name: c,
                credentialCategory: "certificate",
                recognizedBy: { "@type": "Organization", name: founder.credentialIssuer },
              })),
            }
          : {}),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonical}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${site.url}/` },
          { "@type": "ListItem", position: 2, name: founder.name, item: canonical },
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
          crumbs={[{ label: "Home", href: "/" }, { label: founder.name }]}
        />

        <section className="bg-gradient-to-b from-cream to-white py-14 sm:py-16">
          <Container>
            <div className="max-w-3xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-teal">
                {founder.role}
              </p>
              <h1 className="mt-3 font-serif text-[40px] leading-[1.1] text-navy sm:text-[48px]">
                {founder.name}
              </h1>

              {founder.bio && (
                <p className="mt-6 text-[17.5px] leading-[1.75] text-warm-grey">
                  {founder.bio}
                </p>
              )}

              {founder.credentials.length > 0 && (
                <ul className="mt-7 flex flex-wrap gap-2.5">
                  {founder.credentials.map((c) => (
                    <li
                      key={c}
                      className="rounded-full border border-line bg-white px-4 py-1.5 text-[13.5px] font-medium text-navy"
                    >
                      {c}
                    </li>
                  ))}
                </ul>
              )}

              {founder.linkedin && (
                <p className="mt-7 text-[15.5px]">
                  <a
                    href={founder.linkedin}
                    rel="noopener noreferrer"
                    target="_blank"
                    className="text-teal underline underline-offset-2"
                  >
                    LinkedIn
                  </a>
                  <span className="mx-2 text-line">·</span>
                  <Link
                    href="/about/"
                    className="text-teal underline underline-offset-2"
                  >
                    About Frontpaged
                  </Link>
                </p>
              )}
            </div>
          </Container>
        </section>

        <section className="py-14 sm:py-16" aria-labelledby="articles-heading">
          <Container>
            <h2
              id="articles-heading"
              className="font-serif text-[26px] leading-tight text-navy sm:text-[30px]"
            >
              {posts.length} published articles
            </h2>
            <ul className="mt-8 divide-y divide-line border-y border-line">
              {posts.map((p) => (
                <li key={p.slug} className="py-5">
                  <Link href={`/blog/${p.slug}/`} className="group block">
                    <p className="font-serif text-[19px] leading-snug text-navy group-hover:text-teal">
                      {p.title}
                    </p>
                    <p className="mt-1.5 text-[15px] leading-[1.6] text-warm-grey">
                      {p.description}
                    </p>
                    <p className="mt-2 text-[13.5px] text-warm-grey/80">
                      <time dateTime={p.date}>{formatDate(p.date)}</time>
                      <span aria-hidden="true"> · </span>
                      {p.readingTime} min read
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </section>

        <CtaPanel />
      </main>
      <SiteFooter />
    </>
  );
}
