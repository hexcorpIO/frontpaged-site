import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import { getPublishedVerticals } from "@/lib/verticals";
import { getAllPosts } from "@/lib/blog";
import { formatDate } from "@/lib/formatDate";
import { site, ogImage, founder, founderId } from "@/lib/site";

export const metadata: Metadata = {
  title: "Blog — SEO & AI-Search Visibility",
  description:
    "Practical guides on SEO, Generative Engine Optimization (GEO), and getting a business recommended by Google and AI search across eight industries.",
  alternates: { canonical: "/blog" },
  openGraph: {
    type: "website",
    url: "/blog",
    title: "Frontpaged Blog — SEO & AI-search visibility",
    description:
      "Practical guides on SEO, GEO, and getting cited by Google and AI search.",
    images: [ogImage],
  },
};

// Verticals that actually have published posts, with their counts. Empty
// archives get no chip and no route — a filter that leads to an empty page is
// worse than no filter.
function industryArchives() {
  const posts = getAllPosts();
  return getPublishedVerticals()
    .map((vertical) => ({
      vertical,
      count: posts.filter((p) => p.vertical === vertical.slug).length,
    }))
    .filter((a) => a.count > 0)
    .sort((a, b) => b.count - a.count);
}

export default function BlogIndex() {
  const archives = industryArchives();
  const posts = getAllPosts();
  const canonical = `${site.url}/blog/`;

  // Blog + BreadcrumbList so crawlers and AI engines can read the index as a
  // publication with a known post list, not just a page of links.
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Blog",
        "@id": `${canonical}#blog`,
        url: canonical,
        name: `${site.name} Blog`,
        description:
          "Practical guides on SEO, Generative Engine Optimization (GEO), and getting a business recommended by Google and AI search across eight industries.",
        inLanguage: "en-US",
        publisher: {
          "@type": "Organization",
          "@id": `${site.url}/#org`,
          name: site.name,
          url: site.url,
          logo: { "@type": "ImageObject", url: `${site.url}/logo-512.png` },
        },
        blogPost: posts.map((post) => ({
          "@type": "BlogPosting",
          "@id": `${site.url}/blog/${post.slug}/#article`,
          url: `${site.url}/blog/${post.slug}/`,
          headline: post.title,
          description: post.description,
          datePublished: post.date,
          dateModified: post.date,
          // Same Person node the posts and the About page declare, so the
          // index does not describe a different author than the articles do.
          author: founder.name
            ? { "@type": "Person", "@id": founderId, name: founder.name }
            : { "@type": "Organization", name: post.author, url: site.url },
          keywords: post.tags.join(", "),
        })),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonical}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${site.url}/` },
          { "@type": "ListItem", position: 2, name: "Blog", item: canonical },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        // Schema is built from trusted local content, not user input.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="bg-gradient-to-b from-cream to-white py-16 sm:py-20">
        <Container>
          <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-teal-dark">
            The Frontpaged blog
          </p>
          <h1 className="max-w-3xl font-serif text-[40px] font-semibold tracking-tight text-navy sm:text-5xl">
            Get found — on Google and in AI search.
          </h1>
          <p className="mt-5 max-w-2xl text-[18px] leading-[1.7] text-warm-grey">
            Plain-English guides on SEO, Generative Engine Optimization (GEO), and the content
            that gets a business recommended when its future customers ask Google, ChatGPT, and
            Perplexity who to use.
          </p>

          {/* Industry archives as real routes, not a client-side filter. With 49
              posts across eight verticals, an estate attorney should not have to
              scroll past 33 med-spa articles — and each archive is crawlable and
              can rank on its own, which a JS filter never could. */}
          {archives.length > 0 && (
            <nav aria-label="Filter articles by industry" className="mt-8">
              <ul className="flex flex-wrap gap-2.5">
                <li>
                  <span className="rounded-full bg-navy px-4 py-1.5 text-[13.5px] font-medium text-white">
                    All industries
                  </span>
                </li>
                {archives.map(({ vertical, count }) => (
                  <li key={vertical.slug}>
                    <Link
                      href={`/blog/industry/${vertical.slug}/`}
                      className="rounded-full border border-line bg-white px-4 py-1.5 text-[13.5px] font-medium text-navy transition hover:border-teal hover:text-teal"
                    >
                      {vertical.name}{" "}
                      <span className="text-warm-grey/70">{count}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </Container>
      </section>

      <section className="border-t border-warm-line py-16">
        <Container>
          <div className="grid gap-6 md:grid-cols-2">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="flex flex-col rounded-2xl border border-warm-line bg-white p-7 shadow-[0_8px_30px_rgba(21,38,63,0.05)] transition duration-200 hover:-translate-y-0.5 hover:border-teal hover:shadow-[0_16px_44px_rgba(21,38,63,0.10)]"
              >
                <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-medium text-warm-grey">
                  <time dateTime={post.date}>{formatDate(post.date)}</time>
                  <span aria-hidden="true">·</span>
                  <span>{post.readingTime} min read</span>
                </div>
                <h2 className="font-serif text-[21px] font-semibold text-navy">
                  <Link href={`/blog/${post.slug}/`} className="hover:text-teal-dark">
                    {post.title}
                  </Link>
                </h2>
                <p className="mt-2 flex-1 text-[15px] leading-[1.6] text-warm-grey">{post.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {post.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-soft px-2.5 py-1 text-xs font-medium text-teal-dark"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <Link
                  href={`/blog/${post.slug}/`}
                  className="mt-5 text-[15px] font-semibold text-teal-dark hover:text-teal"
                >
                  Read more →
                </Link>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-warm-line bg-navy py-16 text-center text-white">
        <Container>
          <h2 className="font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
            Want this done for your business?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-[#bbccdd]">
            Book a free visibility check and we&rsquo;ll show you exactly where you stand on Google
            and AI search.
          </p>
          <Link
            href="/contact/"
            className="mt-6 inline-flex items-center justify-center rounded-full bg-teal px-8 py-4 text-[17px] font-semibold text-white transition hover:bg-white hover:text-navy"
          >
            Book your free visibility check
          </Link>
          <p className="mt-4 text-sm text-[#9fb6cc]">
            Or email us at{" "}
            <a href={`mailto:${site.email}`} className="text-white underline">
              {site.email}
            </a>
          </p>
        </Container>
      </section>
    </>
  );
}
