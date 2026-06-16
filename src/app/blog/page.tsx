import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import { getAllPosts } from "@/lib/blog";
import { formatDate } from "@/lib/formatDate";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Blog — SEO & AI-search visibility for medical spas",
  description:
    "Practical guides on med spa SEO, Generative Engine Optimization (GEO), and getting your clinic recommended by Google and AI search.",
  alternates: { canonical: "/blog" },
  openGraph: {
    type: "website",
    url: "/blog",
    title: "Frontpaged Blog — SEO & AI-search visibility for medical spas",
    description:
      "Practical guides on med spa SEO, GEO, and getting cited by Google and AI search.",
  },
};

export default function BlogIndex() {
  const posts = getAllPosts();

  return (
    <>
      <section className="bg-gradient-to-b from-cream to-white py-16 sm:py-20">
        <Container>
          <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-teal-dark">
            The Frontpaged blog
          </p>
          <h1 className="max-w-3xl font-serif text-[40px] font-semibold tracking-tight text-navy sm:text-5xl">
            Get your med spa found — on Google and in AI search.
          </h1>
          <p className="mt-5 max-w-2xl text-[18px] leading-[1.7] text-warm-grey">
            Plain-English guides on SEO, Generative Engine Optimization (GEO), and the content
            that gets your clinic recommended when patients ask Google, ChatGPT, and Perplexity
            for the best med spa near them.
          </p>
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
                  <Link href={`/blog/${post.slug}`} className="hover:text-teal-dark">
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
                  href={`/blog/${post.slug}`}
                  className="mt-5 text-[15px] font-semibold text-teal-dark hover:text-teal"
                >
                  Read more →
                </Link>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-line bg-navy py-16 text-center text-white">
        <Container>
          <h2 className="font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
            Want this done for your clinic?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-[#bbccdd]">
            Book a free visibility check and we&rsquo;ll show you exactly where you stand on Google
            and AI search.
          </p>
          <Link
            href="/#contact"
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
