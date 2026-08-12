import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import TopBanner from "@/components/TopBanner";
import SiteFooter from "@/components/SiteFooter";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import CtaPanel from "@/components/CtaPanel";
import { getAllPosts } from "@/lib/blog";
import { formatDate } from "@/lib/formatDate";
import { getVertical, getPublishedVerticals } from "@/lib/verticals";
import { getIndustryBody } from "@/lib/industries";
import { site, ogImage } from "@/lib/site";

// Per-industry blog archives.
//
// With 49 posts across eight verticals, an estate attorney arriving at /blog/
// had to scroll past 33 med-spa articles to find anything for them. The obvious
// fix is a client-side filter, but real routes are better here: they are
// crawlable, linkable, indexable, and give each vertical's cluster a page that
// can rank for "<industry> SEO articles" — none of which a JavaScript filter on
// a static export provides.
//
// Only verticals that actually have posts get a route. An empty archive is a
// thin page and there is no reason to publish eight of them.

type Params = { slug: string };

function verticalsWithPosts() {
  const counts = new Map<string, number>();
  for (const p of getAllPosts()) {
    counts.set(p.vertical, (counts.get(p.vertical) ?? 0) + 1);
  }
  return getPublishedVerticals().filter((v) => (counts.get(v.slug) ?? 0) > 0);
}

export function generateStaticParams(): Params[] {
  return verticalsWithPosts().map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const v = getVertical(slug);
  if (!v) return {};

  const url = `/blog/industry/${v.slug}/`;
  const title = `${v.name} — SEO & AI Search Articles`;
  const description = `Articles on SEO, generative engine optimization, and AI-search visibility written specifically for ${v.nameSingular} owners and marketers.`;

  return {
    title: { absolute: title.length <= 60 ? title : `${v.name} Articles` },
    description,
    alternates: { canonical: url },
    openGraph: { type: "website", url, title, description, images: [ogImage] },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function IndustryArchive({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const v = getVertical(slug);
  if (!v) notFound();

  const posts = getAllPosts().filter((p) => p.vertical === v.slug);
  if (posts.length === 0) notFound();

  const canonical = `${site.url}/blog/industry/${v.slug}/`;
  const hasHub = getIndustryBody(v.slug) !== null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${canonical}#page`,
        url: canonical,
        name: `${v.name} articles`,
        about: { "@id": `${site.url}/#org` },
        isPartOf: { "@id": `${site.url}/#website` },
      },
      {
        "@type": "ItemList",
        "@id": `${canonical}#list`,
        itemListElement: posts.map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: p.title,
          url: `${site.url}/blog/${p.slug}/`,
        })),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonical}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${site.url}/` },
          { "@type": "ListItem", position: 2, name: "Blog", item: `${site.url}/blog/` },
          { "@type": "ListItem", position: 3, name: v.name, item: canonical },
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
          crumbs={[
            { label: "Home", href: "/" },
            { label: "Blog", href: "/blog/" },
            { label: v.name },
          ]}
        />

        <section className="bg-gradient-to-b from-cream to-white py-14 sm:py-16">
          <Container>
            <div className="max-w-3xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-teal">
                {v.name}
              </p>
              <h1 className="mt-3 font-serif text-[38px] leading-[1.1] text-navy sm:text-[46px]">
                SEO and AI-search articles for {v.nameSingular} owners
              </h1>
              <p className="mt-6 text-[17px] leading-[1.7] text-warm-grey">
                {posts.length} {posts.length === 1 ? "article" : "articles"} written
                for this industry specifically — not general marketing advice with the
                nouns swapped.
                {hasHub && (
                  <>
                    {" "}
                    For what we actually do here, see{" "}
                    <Link
                      href={`/industries/${v.slug}/`}
                      className="text-teal underline underline-offset-2"
                    >
                      {v.name.toLowerCase()} services
                    </Link>
                    .
                  </>
                )}
              </p>
            </div>
          </Container>
        </section>

        <section className="py-12 sm:py-14">
          <Container>
            <ul className="divide-y divide-line border-y border-line">
              {posts.map((p) => (
                <li key={p.slug} className="py-6">
                  <Link href={`/blog/${p.slug}/`} className="group block">
                    <p className="font-serif text-[21px] leading-snug text-navy group-hover:text-teal">
                      {p.title}
                    </p>
                    <p className="mt-2 text-[15.5px] leading-[1.65] text-warm-grey">
                      {p.description}
                    </p>
                    <p className="mt-2.5 text-[13.5px] text-warm-grey/80">
                      <time dateTime={p.date}>{formatDate(p.date)}</time>
                      <span aria-hidden="true"> · </span>
                      {p.readingTime} min read
                    </p>
                  </Link>
                </li>
              ))}
            </ul>

            <p className="mt-10 text-[15.5px] text-warm-grey">
              Browsing a different industry?{" "}
              <Link href="/blog/" className="text-teal underline underline-offset-2">
                See every article
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
