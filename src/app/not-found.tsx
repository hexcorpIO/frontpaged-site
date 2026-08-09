import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Container from "@/components/Container";
import Button from "@/components/Button";
import { getAllPosts } from "@/lib/blog";
import { site } from "@/lib/site";

// Without this file Next serves its bare default error page — no nav, no
// branding, and no route back into the site. The static export renders this
// to /404.html, which .htaccess wires up as the Apache ErrorDocument.
export const metadata: Metadata = {
  title: "Page not found",
  description:
    "That page doesn't exist. Find med spa SEO and Generative Engine Optimization services, pricing, and guides on Frontpaged.",
  // Required: without it the root layout's `index, follow` is inherited here and
  // contradicts the noindex Next emits for the not-found route.
  robots: { index: false, follow: true },
};

const destinations = [
  {
    href: "/services/med-spa-seo/",
    label: "Med Spa SEO",
    blurb: "Rank for the treatments patients actually search for.",
  },
  {
    href: "/services/generative-engine-optimization/",
    label: "Generative Engine Optimization",
    blurb: "Get cited by ChatGPT, Perplexity, and AI Overviews.",
  },
  {
    href: "/services/google-business-profile/",
    label: "Google Business Profile",
    blurb: "Win the map pack in your market.",
  },
  {
    href: "/pricing/",
    label: "Pricing",
    blurb: "Plans from $1,500/mo — no ad spend, no lock-in.",
  },
];

export default function NotFound() {
  const posts = getAllPosts().slice(0, 3);

  return (
    <>
      <SiteHeader />
      <main>
        <section className="bg-gradient-to-b from-cream to-white py-20 sm:py-24">
          <Container>
            <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-teal-dark">
              404 — page not found
            </p>
            <h1 className="max-w-3xl font-serif text-[40px] font-semibold leading-[1.08] tracking-tight text-navy sm:text-[54px]">
              That page moved, or never{" "}
              <span className="italic text-teal">existed</span>.
            </h1>
            <p className="mt-6 max-w-2xl text-[19px] leading-[1.7] text-warm-grey">
              Nothing lives at this URL. Here&rsquo;s where most people are headed — or start from
              the homepage and work your way in.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <Button href="/" size="lg">
                Back to the homepage
              </Button>
              <Button href="/#contact" size="lg" variant="ghost">
                Book a free visibility check
              </Button>
            </div>
          </Container>
        </section>

        <section className="border-t border-warm-line py-16">
          <Container>
            <h2 className="font-serif text-2xl font-semibold tracking-tight text-navy">
              What we do
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {destinations.map((d) => (
                <Link
                  key={d.href}
                  href={d.href}
                  className="rounded-2xl border border-warm-line bg-white p-6 transition duration-200 hover:-translate-y-0.5 hover:border-teal hover:shadow-[0_16px_44px_rgba(21,38,63,0.10)]"
                >
                  <p className="font-serif text-[19px] font-semibold text-navy">{d.label}</p>
                  <p className="mt-1.5 text-[15px] leading-[1.6] text-warm-grey">{d.blurb}</p>
                </Link>
              ))}
            </div>
          </Container>
        </section>

        <section className="border-t border-warm-line bg-cream py-16">
          <Container>
            <h2 className="font-serif text-2xl font-semibold tracking-tight text-navy">
              Latest from the blog
            </h2>
            <ul className="mt-6 space-y-4">
              {posts.map((post) => (
                <li key={post.slug}>
                  <Link
                    href={`/blog/${post.slug}/`}
                    className="font-serif text-[18px] font-semibold text-navy hover:text-teal-dark"
                  >
                    {post.title}
                  </Link>
                  <p className="mt-1 text-[15px] leading-[1.6] text-warm-grey">
                    {post.description}
                  </p>
                </li>
              ))}
            </ul>
            <p className="mt-7 text-[15px] text-warm-grey">
              Still stuck? Email us at{" "}
              <a href={`mailto:${site.email}`} className="font-semibold text-teal-dark underline">
                {site.email}
              </a>{" "}
              or call{" "}
              <a href={site.phoneHref} className="font-semibold text-teal-dark underline">
                {site.phone}
              </a>
              .
            </p>
          </Container>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
