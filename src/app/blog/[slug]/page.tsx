import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Container from "@/components/Container";
import { getPostBySlug, getPostSlugs, getRelatedPosts } from "@/lib/blog";
import { formatDate } from "@/lib/formatDate";
import Breadcrumbs from "@/components/Breadcrumbs";
import TableOfContents from "@/components/TableOfContents";
import { getVertical } from "@/lib/verticals";
import { site, ogImage, founder, founderId } from "@/lib/site";

type Params = { slug: string };

// Prerender every post into the static export.
export function generateStaticParams(): Params[] {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  const url = `/blog/${post.slug}`;
  // `metaTitle` falls back to the H1 title (see PostMeta in src/lib/blog.ts) —
  // the two are allowed to differ, since a title tag and an H1 don't have to
  // match. `title.absolute` opts out of the root layout's "%s · Frontpaged"
  // template: the suffix costs 12 chars every article can't spare, and a post
  // page doesn't need the brand repeated in the tab title the way a top-level
  // site page does.
  const metaTitle = post.metaTitle ?? post.title;
  return {
    title: { absolute: metaTitle },
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: metaTitle,
      description: post.description,
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
      authors: [post.author],
      // This post's own generated card, not the site-wide one. See
      // opengraph-image.tsx in this segment — the explicit `images` here is
      // required because setting `openGraph` at all replaces the parent's
      // resolved object, file-convention image included.
      images: [
        {
          url: `${site.url}/blog/${post.slug}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: post.description,
    },
  };
}

export default async function BlogPost({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const related = getRelatedPosts(post.slug, 3);
  const vertical = getVertical(post.vertical);

  // Trailing slash so the schema @ids match the canonical URLs exactly.
  const canonical = `${site.url}/blog/${post.slug}/`;

  // BlogPosting + FAQPage structured data so Google and AI engines can parse the
  // article, its author/date, and the Q&A directly.
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${canonical}#article`,
        headline: post.title,
        description: post.description,
        datePublished: post.date,
        dateModified: post.updated ?? post.date,
        // Article rich results want an image and a publisher logo.
        image: `${site.url}/opengraph-image`,
        // Named authorship, not organizational — the same Person node the About
        // page declares at founderId, so an engine correlating @ids across pages
        // resolves every byline to one entity. Falls back to an Organization if
        // the founder name is ever cleared, matching the About page's own gate.
        author: founder.name
          ? {
              "@type": "Person",
              "@id": founderId,
              name: founder.name,
              jobTitle: founder.role,
              url: `${site.url}/about/`,
              worksFor: { "@id": `${site.url}/#org` },
              ...(founder.bio ? { description: founder.bio } : {}),
              ...(founder.linkedin ? { sameAs: [founder.linkedin] } : {}),
            }
          : { "@type": "Organization", name: post.author, url: site.url },
        publisher: {
          "@type": "Organization",
          "@id": `${site.url}/#org`,
          name: site.name,
          url: site.url,
          logo: { "@type": "ImageObject", url: `${site.url}/logo-512.png` },
        },
        mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
        keywords: post.tags.join(", "),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonical}#breadcrumb`,
        // Mirrors the visible <Breadcrumbs> exactly, including the industry crumb.
        // Google's guidance is that breadcrumb markup should describe breadcrumbs
        // a visitor can actually see; these two are built from the same shape so
        // they cannot drift apart.
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${site.url}/` },
          { "@type": "ListItem", position: 2, name: "Blog", item: `${site.url}/blog/` },
          ...(vertical
            ? [
                {
                  "@type": "ListItem",
                  position: 3,
                  name: vertical.name,
                  item: `${site.url}/blog/industry/${vertical.slug}/`,
                },
              ]
            : []),
          {
            "@type": "ListItem",
            position: vertical ? 4 : 3,
            name: post.title,
            item: canonical,
          },
        ],
      },
      ...(post.faqs.length
        ? [
            {
              "@type": "FAQPage",
              "@id": `${canonical}#faq`,
              mainEntity: post.faqs.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            },
          ]
        : []),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Breadcrumbs
        className="border-b border-warm-line"
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Blog", href: "/blog/" },
          ...(vertical
            ? [{ label: vertical.name, href: `/blog/industry/${vertical.slug}/` }]
            : []),
          { label: post.title },
        ]}
      />

      <article className="py-14 sm:py-16">
        <Container className="!max-w-3xl">
          <Link href="/blog/" className="text-sm font-semibold text-teal-dark hover:text-teal">
            ← All articles
          </Link>

          <div className="mt-5 flex flex-wrap items-center gap-2 text-sm text-warm-grey">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span aria-hidden="true">·</span>
            <span>{post.readingTime} min read</span>
            <span aria-hidden="true">·</span>
            {/* Author links to their own page rather than sitting as plain text —
                the Person entity that 49 posts reference should be reachable. */}
            <Link href="/author/benton-purvis/" className="hover:text-teal hover:underline underline-offset-2">
              {post.author}
            </Link>
            {post.updated && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-teal-dark">
                  Reviewed <time dateTime={post.updated}>{formatDate(post.updated)}</time>
                </span>
              </>
            )}
          </div>

          <h1 className="mt-3 font-serif text-[40px] font-semibold leading-[1.12] tracking-tight text-navy">
            {post.title}
          </h1>

          {post.quickAnswer && (
            <div className="mt-7 rounded-2xl border-l-4 border-teal bg-soft p-6">
              <p className="mb-1 text-[13px] font-bold uppercase tracking-wide text-teal-dark">
                Quick answer
              </p>
              <p className="text-[17px] text-ink">{post.quickAnswer}</p>
            </div>
          )}

          <TableOfContents headings={post.headings} />

          <div
            className="prose prose-lg mt-8 max-w-none prose-headings:font-serif prose-headings:text-navy prose-headings:font-semibold prose-a:text-teal-dark prose-a:no-underline hover:prose-a:underline prose-strong:text-navy prose-li:marker:text-teal prose-p:text-warm-grey prose-p:leading-[1.8] prose-h2:scroll-mt-24"
            dangerouslySetInnerHTML={{ __html: post.html }}
          />

          {post.faqs.length > 0 && (
            <section className="mt-12" aria-labelledby="post-faq">
              <h2 id="post-faq" className="font-serif text-2xl font-semibold text-navy">
                Frequently asked questions
              </h2>
              <div className="mt-5 space-y-3">
                {post.faqs.map((f) => (
                  <details
                    key={f.q}
                    className="group overflow-hidden rounded-xl border border-warm-line bg-cream"
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 font-serif text-[17px] font-semibold text-navy [&::-webkit-details-marker]:hidden">
                      {f.q}
                      <span aria-hidden="true" className="text-2xl font-normal text-teal group-open:hidden">
                        +
                      </span>
                      <span aria-hidden="true" className="hidden text-2xl font-normal text-teal group-open:inline">
                        –
                      </span>
                    </summary>
                    <p className="px-5 pb-4 text-[15.5px] leading-[1.7] text-warm-grey">{f.a}</p>
                  </details>
                ))}
              </div>
            </section>
          )}

          {/* Related posts. Before this, every one of 49 posts was a dead end:
              a reader who finished had nowhere to go and crawlers got no lateral
              path through the library. Selection is vertical-first — see
              getRelatedPosts — so a probate article never recommends Botox. */}
          {related.length > 0 && (
            <section className="mt-14 border-t border-warm-line pt-10" aria-labelledby="read-next">
              <h2
                id="read-next"
                className="text-[11px] font-semibold uppercase tracking-[0.14em] text-teal"
              >
                Read next
              </h2>
              <ul className="mt-5 space-y-4">
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link href={`/blog/${r.slug}/`} className="group block">
                      <p className="font-serif text-[19px] leading-snug text-navy group-hover:text-teal">
                        {r.title}
                      </p>
                      <p className="mt-1.5 text-[15px] leading-[1.6] text-warm-grey">
                        {r.description}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <div className="mt-12 rounded-2xl bg-navy p-8 text-center text-white">
            <h2 className="font-serif text-2xl font-semibold tracking-tight">
              See where your business stands — free
            </h2>
            <p className="mx-auto mt-2 max-w-md text-[#bbccdd]">
              Book a 30-minute visibility check and we&rsquo;ll run the AI test on your business.
            </p>
            <Link
              href="/contact/"
              className="mt-5 inline-flex items-center justify-center rounded-full bg-teal px-7 py-3.5 font-semibold text-white transition hover:bg-white hover:text-navy"
            >
              Book your free visibility check
            </Link>
          </div>
        </Container>
      </article>
    </>
  );
}
