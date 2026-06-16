import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Container from "@/components/Container";
import { getPostBySlug, getPostSlugs } from "@/lib/blog";
import { formatDate } from "@/lib/formatDate";
import { site } from "@/lib/site";

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
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      authors: [post.author],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

export default async function BlogPost({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const canonical = `${site.url}/blog/${post.slug}`;

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
        dateModified: post.date,
        author: { "@type": "Organization", name: post.author, url: site.url },
        publisher: {
          "@type": "Organization",
          name: site.name,
          url: site.url,
        },
        mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
        keywords: post.tags.join(", "),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonical}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${site.url}/` },
          { "@type": "ListItem", position: 2, name: "Blog", item: `${site.url}/blog/` },
          { "@type": "ListItem", position: 3, name: post.title, item: canonical },
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

      <article className="py-14 sm:py-16">
        <Container className="!max-w-3xl">
          <Link href="/blog" className="text-sm font-semibold text-teal-dark hover:text-teal">
            ← All articles
          </Link>

          <div className="mt-5 flex flex-wrap items-center gap-2 text-sm text-warm-grey">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span aria-hidden="true">·</span>
            <span>{post.readingTime} min read</span>
            <span aria-hidden="true">·</span>
            <span>{post.author}</span>
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

          <div
            className="prose prose-lg mt-8 max-w-none prose-headings:font-serif prose-headings:text-navy prose-headings:font-semibold prose-a:text-teal-dark prose-a:no-underline hover:prose-a:underline prose-strong:text-navy prose-li:marker:text-teal prose-p:text-warm-grey prose-p:leading-[1.8]"
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

          <div className="mt-12 rounded-2xl bg-navy p-8 text-center text-white">
            <h2 className="font-serif text-2xl font-semibold tracking-tight">
              See where your clinic stands — free
            </h2>
            <p className="mx-auto mt-2 max-w-md text-[#bbccdd]">
              Book a 30-minute visibility check and we&rsquo;ll run the AI test on your med spa.
            </p>
            <Link
              href="/#contact"
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
