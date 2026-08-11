import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import TopBanner from "@/components/TopBanner";
import SiteFooter from "@/components/SiteFooter";
import Container from "@/components/Container";
import CtaPanel from "@/components/CtaPanel";
import ServiceHero from "@/components/ServiceHero";
import { CheckIcon } from "@/components/Icons";
import { getAddOnService, getPublishedAddOnSlugs } from "@/lib/services";
import { site, ogImage } from "@/lib/site";

// Add-on service pages. The two original service pages (GEO and Google Business
// Profile) remain their own static routes — a static segment wins over this dynamic
// one, so they are unaffected and are deliberately excluded from the params below.

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return getPublishedAddOnSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const s = getAddOnService(slug);
  if (!s) return {};

  const url = `/services/${s.slug}/`;
  return {
    title: s.metaTitle,
    description: s.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title: `${s.metaTitle} · Frontpaged`,
      description: s.metaDescription,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: s.metaTitle,
      description: s.metaDescription,
    },
  };
}

export default async function AddOnServicePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const s = getAddOnService(slug);
  if (!s) notFound();

  const canonical = `${site.url}/services/${s.slug}/`;

  // Service + FAQPage + BreadcrumbList. No `offers` node: these are scoped and
  // quoted per engagement, and inventing a price for the schema would contradict
  // what the page tells a reader.
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${canonical}#service`,
        name: s.name,
        description: s.metaDescription,
        serviceType: s.name,
        provider: { "@id": `${site.url}/#org` },
        areaServed: { "@type": "Country", name: "United States" },
      },
      {
        "@type": "FAQPage",
        "@id": `${canonical}#faq`,
        mainEntity: s.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${site.url}/` },
          {
            "@type": "ListItem",
            position: 2,
            name: "Services",
            item: `${site.url}/services/`,
          },
          { "@type": "ListItem", position: 3, name: s.name, item: canonical },
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

        <ServiceHero
          eyebrow="Additional services"
          title={s.tagline}
          lead={s.metaDescription}
          quickAnswer={s.quickAnswer}
          visual={
            <div className="rounded-2xl border border-line bg-white p-7 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-teal">
                What we do
              </p>
              <ul className="mt-4 space-y-3">
                {s.whatWeDo.slice(0, 4).map((item) => (
                  <li key={item} className="flex gap-3 text-[14.5px] text-ink">
                    <CheckIcon className="mt-1 h-4 w-4 shrink-0 text-teal" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          }
        />

        <section className="py-16 sm:py-20" aria-labelledby="what-it-is">
          <Container>
            <h2
              id="what-it-is"
              className="font-serif text-[30px] leading-[1.15] text-navy sm:text-[36px]"
            >
              What {s.name.toLowerCase()} actually is
            </h2>
            <div className="mt-6 max-w-3xl space-y-5">
              {s.whatItIs.map((p) => (
                <p key={p} className="text-[17px] leading-[1.75] text-warm-grey">
                  {p}
                </p>
              ))}
            </div>
          </Container>
        </section>

        <section className="bg-soft py-16 sm:py-20" aria-labelledby="why-you-need-it">
          <Container>
            <h2
              id="why-you-need-it"
              className="font-serif text-[30px] leading-[1.15] text-navy sm:text-[36px]"
            >
              Why it matters for a high-ticket local business
            </h2>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {s.whyYouNeedIt.map((r) => (
                <div
                  key={r.heading}
                  className="rounded-2xl border border-line bg-white p-7"
                >
                  <h3 className="font-serif text-[19px] leading-snug text-navy">
                    {r.heading}
                  </h3>
                  <p className="mt-3 text-[15.5px] leading-[1.7] text-warm-grey">
                    {r.body}
                  </p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        <section className="py-16 sm:py-20" aria-labelledby="what-we-do">
          <Container>
            <div className="grid gap-12 lg:grid-cols-[1fr_1fr]">
              <div>
                <h2
                  id="what-we-do"
                  className="font-serif text-[30px] leading-[1.15] text-navy sm:text-[36px]"
                >
                  What&rsquo;s included
                </h2>
                <ul className="mt-6 space-y-3">
                  {s.whatWeDo.map((item) => (
                    <li key={item} className="flex gap-3 text-[16px] text-ink">
                      <CheckIcon className="mt-1 h-4 w-4 shrink-0 text-teal" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Stating the limitation plainly. A services page that claims no
                  boundaries is the one a prospect stops believing. */}
              <div className="rounded-2xl border border-line bg-cream p-8">
                <h3 className="font-serif text-[21px] leading-snug text-navy">
                  What this won&rsquo;t fix
                </h3>
                <p className="mt-4 text-[16px] leading-[1.75] text-warm-grey">
                  {s.notFor}
                </p>
                <p className="mt-6 text-[15px] leading-[1.7] text-warm-grey">
                  Available alongside any{" "}
                  <Link href="/pricing/" className="text-teal underline underline-offset-2">
                    content retainer
                  </Link>
                  . Scoped and quoted per engagement rather than sold at a fixed rate,
                  because the work scales with your market and your stack.
                </p>
              </div>
            </div>
          </Container>
        </section>

        <section className="bg-soft py-16 sm:py-20" aria-labelledby="faq-heading">
          <Container>
            <h2
              id="faq-heading"
              className="font-serif text-[30px] leading-[1.15] text-navy sm:text-[36px]"
            >
              Questions we get asked
            </h2>
            <div className="mt-8 max-w-3xl divide-y divide-line border-y border-line">
              {s.faqs.map((f) => (
                <details key={f.q} className="group py-5">
                  <summary className="cursor-pointer list-none font-serif text-[18px] text-navy marker:content-none">
                    {f.q}
                  </summary>
                  <p className="mt-3 text-[16px] leading-[1.75] text-warm-grey">{f.a}</p>
                </details>
              ))}
            </div>
          </Container>
        </section>

        <section className="py-16" aria-labelledby="other-services">
          <Container>
            <h2 id="other-services" className="sr-only">
              Other services
            </h2>
            <p className="text-[16px] text-warm-grey">
              See{" "}
              <Link
                href="/services/"
                className="text-teal underline underline-offset-2"
              >
                everything we do
              </Link>
              , or the{" "}
              <Link
                href="/industries/"
                className="text-teal underline underline-offset-2"
              >
                industries we work in
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
