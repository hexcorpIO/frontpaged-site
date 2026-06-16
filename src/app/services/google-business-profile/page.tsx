import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Container from "@/components/Container";
import Button from "@/components/Button";
import { site } from "@/lib/site";

const PATH = "/services/google-business-profile";
const canonical = `${site.url}${PATH}`;

export const metadata: Metadata = {
  title: "Google Business Profile Optimization for Med Spas | Frontpaged",
  description:
    "Google Business Profile optimization for med spas in Dallas–Fort Worth. Win the local map pack, get found before competitors, and turn nearby searches into booked consultations.",
  alternates: { canonical: PATH },
  openGraph: {
    type: "website",
    url: PATH,
    title: "Google Business Profile Optimization for Med Spas | Frontpaged",
    description:
      "Win the Dallas map pack with expert Google Business Profile optimization for med spas. More visibility, more bookings.",
  },
};

const optimizationItems = [
  {
    title: "Primary category & service attributes",
    body: "Your primary category is the most important signal Google uses to decide which map pack you appear in. Most med spas pick the wrong one — or leave it at the default. We set the category that matches how patients actually search, then layer in every relevant secondary category and service attribute your clinic offers.",
  },
  {
    title: "Photos that convert and satisfy Google",
    body: "Profiles with 100+ photos get dramatically more calls and direction requests than those with a handful of stock shots. We put together a photo strategy — treatment rooms, equipment, before-and-afters where appropriate, team — and keep it refreshed so your profile looks active and established.",
  },
  {
    title: "Google Posts on a consistent schedule",
    body: "Posts tell Google your profile is actively managed, and they give patients a reason to choose you over the clinic next door. We write and publish posts weekly — promotions, new treatments, educational content — so your profile is always current.",
  },
  {
    title: "Q&A seeded and managed",
    body: "The Q&A section is one of the least-used features in GBP — and one of the most powerful. We seed it with the questions your patients actually ask, write clear answers, and monitor it so no misleading user-submitted questions go unanswered.",
  },
  {
    title: "Review strategy and response",
    body: "Reviews are a confirmed ranking factor in the local map pack. We build a system that makes it easy for satisfied patients to leave reviews, and we help you respond consistently — because Google rewards engagement, and prospective patients read every reply.",
  },
  {
    title: "NAP consistency across the web",
    body: "Your name, address, and phone number need to match exactly everywhere they appear online — your website, Yelp, Healthgrades, RealSelf, directories. Inconsistencies confuse Google and dilute your authority. We audit and correct them so your signals are clean.",
  },
];

const faqs = [
  {
    q: "What primary category should a med spa use on Google Business Profile?",
    a: "For most med spas, the right primary category is 'Medical Spa' — not 'Day Spa,' 'Skin Care Clinic,' or 'Beauty Salon.' The primary category is the single biggest factor in which searches trigger your map listing, so getting it right matters. We audit your current setup and correct it as part of onboarding.",
  },
  {
    q: "How many photos should my med spa's GBP have?",
    a: "Aim for at least 100 photos, and keep adding. Google's own data shows that profiles with more than 100 photos get significantly more calls, website clicks, and direction requests than profiles with fewer images. We build a photo plan and refresh it monthly so your profile never looks stale.",
  },
  {
    q: "How often should we post to Google Business Profile?",
    a: "Weekly is the standard we hold ourselves to for clients. Posting frequency signals to Google that your profile is actively managed, which contributes to ranking. It also gives patients something fresh to see when they compare you to competitors. We handle all of this — you don't have to think about it.",
  },
  {
    q: "How do we get more Google reviews without violating the rules?",
    a: "The most effective approach is a simple, friction-free ask at the right moment — right after a treatment, via a follow-up text or email with a direct link to your review page. We build that system for you and make sure the language stays within Google's terms. We never buy reviews or use incentivized schemes.",
  },
  {
    q: "Do you manage Google Business Profile on an ongoing basis?",
    a: "Yes — ongoing management is included in all Frontpaged plans. GBP is not a set-it-and-forget-it channel. Posts need to go out weekly, reviews need responses, Q&A needs monitoring, and Google periodically suggests edits (sometimes wrong ones) that need to be caught. We handle all of it.",
  },
];

export default function GoogleBusinessProfilePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${canonical}#service`,
        name: "Google Business Profile Optimization",
        serviceType:
          "Google Business Profile optimization for medical spas",
        description:
          "Done-for-you Google Business Profile optimization helping med spas in Dallas–Fort Worth win the local map pack, attract high-intent patients, and stay ahead of competitors in local search.",
        provider: {
          "@type": "ProfessionalService",
          "@id": `${site.url}/#business`,
          name: site.name,
          url: site.url,
        },
        areaServed: [
          {
            "@type": "AdministrativeArea",
            name: "Dallas–Fort Worth metroplex",
          },
          ...site.serviceCities.map((city) => ({
            "@type": "City",
            name: `${city}, TX`,
          })),
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${canonical}#faq`,
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonical}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: `${site.url}/`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Google Business Profile Optimization",
            item: canonical,
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader />
      <main>
        {/* Hero */}
        <section className="bg-gradient-to-b from-cream to-white py-20 sm:py-24">
          <Container>
            <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-teal-dark">
              Local visibility
            </p>
            <h1 className="max-w-3xl font-serif text-[40px] font-semibold leading-[1.08] tracking-tight text-navy sm:text-[54px]">
              Own the map pack in{" "}
              <span className="italic text-teal">your neighborhood</span>
            </h1>
            <p className="mt-6 max-w-2xl text-[19px] leading-[1.7] text-warm-grey">
              When a patient searches &ldquo;med spa near me&rdquo; or &ldquo;Botox in Frisco,&rdquo; the
              map pack is what they see first — three listings, a star rating, and
              a click to call. We make sure one of those listings is yours.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <Button href="/#contact" size="lg">
                Get a free profile audit
              </Button>
              <Button href="/pricing" size="lg" variant="ghost">
                See plans
              </Button>
            </div>

            <div className="mt-10 max-w-2xl rounded-2xl border-l-4 border-teal bg-soft p-6">
              <p className="mb-1 text-[12px] font-bold uppercase tracking-[0.16em] text-teal-dark">
                Quick answer
              </p>
              <p className="text-[17px] leading-[1.7] text-ink">
                Google Business Profile (GBP) optimization is the process of
                making your clinic&rsquo;s Google listing as complete, accurate,
                and active as possible so Google ranks it in the local map pack.
                For med spas, it&rsquo;s the single highest-leverage local
                visibility action you can take — before paid ads, before social,
                before almost anything else. It&rsquo;s the first thing patients
                see, and the first thing we fix.
              </p>
            </div>
          </Container>
        </section>

        {/* Why GBP is the #1 local lever */}
        <section className="border-t border-warm-line bg-cream py-20 sm:py-28">
          <Container>
            <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-teal-dark">
              Why it matters
            </p>
            <h2 className="max-w-2xl font-serif text-[32px] font-semibold leading-[1.1] tracking-tight text-navy sm:text-[40px]">
              Google Business Profile is the #1 local visibility lever for med spas
            </h2>
            <div className="mt-6 max-w-3xl space-y-5 text-[17px] leading-[1.75] text-warm-grey">
              <p>
                When someone searches &ldquo;lip filler near me&rdquo; or &ldquo;med spa in
                Southlake,&rdquo; Google serves a map pack at the very top of the
                results — above the organic listings, often above ads. Those three
                spots capture the majority of clicks from patients who are ready to
                book. Everything below them fights for the scraps.
              </p>
              <p>
                Your website, your social channels, your paid ads — they all matter.
                But none of them put you in front of a patient who is searching right
                now, in your neighborhood, at the moment they&rsquo;re ready to spend.
                That&rsquo;s what a well-optimized Google Business Profile does.
              </p>
              <p>
                DFW is one of the most competitive med spa markets in the country.
                Clinics in Dallas, Plano, Frisco, and Southlake have strong profiles,
                hundreds of reviews, and weekly posting cadences. If your profile is
                incomplete or stale, you&rsquo;re already behind — and patients are
                choosing your competitors instead. We fix that.
              </p>
              <p>
                See how GBP optimization connects with your broader{" "}
                <Link
                  href="/services/med-spa-seo"
                  className="font-semibold text-teal underline underline-offset-2 hover:text-teal-dark"
                >
                  med spa SEO strategy
                </Link>{" "}
                — the two reinforce each other, and we handle both.
              </p>
            </div>
          </Container>
        </section>

        {/* What we optimize */}
        <section className="border-t border-warm-line bg-white py-20 sm:py-28">
          <Container>
            <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-teal-dark">
              What we optimize
            </p>
            <h2 className="max-w-2xl font-serif text-[32px] font-semibold leading-[1.1] tracking-tight text-navy sm:text-[40px]">
              Every lever Google uses to rank a med spa locally
            </h2>
            <p className="mt-4 max-w-2xl text-[17px] leading-[1.7] text-warm-grey">
              GBP ranking is driven by relevance, distance, and prominence. We
              control everything in the relevance and prominence columns — and we
              use them all.
            </p>
            <div className="mt-10 grid gap-[22px] md:grid-cols-2 lg:grid-cols-3">
              {optimizationItems.map((item, i) => (
                <article
                  key={item.title}
                  className="rounded-2xl border border-warm-line bg-cream p-8 shadow-[0_8px_30px_rgba(21,38,63,0.05)]"
                >
                  <div className="mb-5 flex items-baseline gap-3">
                    <span className="font-serif text-4xl font-semibold text-teal">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="h-px flex-1 bg-warm-line" />
                  </div>
                  <h3 className="font-serif text-[20px] font-semibold text-navy">
                    {item.title}
                  </h3>
                  <p className="mt-2.5 text-[15.5px] leading-[1.65] text-warm-grey">
                    {item.body}
                  </p>
                </article>
              ))}
            </div>
          </Container>
        </section>

        {/* Map pack + AI */}
        <section className="border-t border-warm-line bg-sand py-20 sm:py-28">
          <Container>
            <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-teal-dark">
              Beyond the map pack
            </p>
            <h2 className="max-w-2xl font-serif text-[32px] font-semibold leading-[1.1] tracking-tight text-navy sm:text-[40px]">
              How GBP connects to the map pack and AI answers
            </h2>
            <div className="mt-6 max-w-3xl space-y-5 text-[17px] leading-[1.75] text-warm-grey">
              <p>
                The local map pack is Google&rsquo;s three-listing display for
                location-based searches. It&rsquo;s powered almost entirely by your
                Google Business Profile — not your website. The clinics in those
                three spots didn&rsquo;t get there by accident. They&rsquo;re there
                because their profiles are complete, active, and trusted.
              </p>
              <p>
                But GBP optimization now reaches beyond traditional search. Google&rsquo;s
                AI Overviews regularly pull from Business Profile data — your category,
                your services, your reviews, your Q&A — when constructing local
                recommendations in response to questions like &ldquo;where&rsquo;s the best
                place to get Botox in Dallas?&rdquo; A well-maintained profile gives you a
                seat at that table.
              </p>
              <p>
                Combine strong GBP signals with the{" "}
                <Link
                  href="/med-spa-seo-dallas"
                  className="font-semibold text-teal underline underline-offset-2 hover:text-teal-dark"
                >
                  local SEO and GEO content
                </Link>{" "}
                we build for your website, and you show up in the map pack, in
                organic results, and in AI answers — three surfaces, one strategy.
              </p>
              <p>
                We also publish{" "}
                <Link
                  href="/blog/google-business-profile-for-med-spas"
                  className="font-semibold text-teal underline underline-offset-2 hover:text-teal-dark"
                >
                  a detailed guide to GBP for med spas
                </Link>{" "}
                if you want to go deeper on how the algorithm works before we talk.
              </p>
            </div>
          </Container>
        </section>

        {/* FAQ */}
        <section
          className="border-t border-warm-line bg-white py-20 sm:py-28"
          aria-labelledby="gbp-faq"
        >
          <Container>
            <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-teal-dark">
              Questions
            </p>
            <h2
              id="gbp-faq"
              className="font-serif text-[32px] font-semibold leading-[1.1] tracking-tight text-navy sm:text-[40px]"
            >
              Google Business Profile for med spas — FAQ
            </h2>
            <div className="mt-10 max-w-[760px]">
              {faqs.map((f, i) => (
                <details
                  key={f.q}
                  open={i === 0}
                  className="group mb-3 overflow-hidden rounded-xl border border-warm-line bg-cream"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between px-[22px] py-[18px] font-serif text-[18px] font-semibold text-navy [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <span
                      aria-hidden="true"
                      className="text-2xl font-normal text-teal group-open:hidden"
                    >
                      +
                    </span>
                    <span
                      aria-hidden="true"
                      className="hidden text-2xl font-normal text-teal group-open:inline"
                    >
                      &ndash;
                    </span>
                  </summary>
                  <p className="px-5 pb-5 text-[15.5px] leading-[1.7] text-warm-grey">
                    {f.a}
                  </p>
                </details>
              ))}
            </div>
            <p className="mt-8 text-[16px] leading-[1.7] text-warm-grey">
              Ready to see exactly where your profile stands? Check our{" "}
              <Link
                href="/pricing"
                className="font-semibold text-teal underline underline-offset-2 hover:text-teal-dark"
              >
                pricing plans
              </Link>{" "}
              or{" "}
              <Link
                href="/#contact"
                className="font-semibold text-teal underline underline-offset-2 hover:text-teal-dark"
              >
                request a free audit
              </Link>
              .
            </p>
          </Container>
        </section>

        {/* CTA */}
        <section className="border-t border-warm-line bg-navy py-20 text-center text-white sm:py-28">
          <Container>
            <h2 className="font-serif text-[34px] font-semibold tracking-tight sm:text-[40px]">
              Find out why your map pack competitors outrank you
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[18px] leading-[1.7] text-[#cdd6e2]">
              We&rsquo;ll audit your Google Business Profile, show you the gaps, and
              tell you exactly what it would take to move you into the top three in
              your neighborhood — no obligation.
            </p>
            <div className="mt-7 flex justify-center">
              <Link
                href="/#contact"
                className="inline-flex items-center justify-center rounded-full bg-teal px-9 py-4 text-[17px] font-semibold text-white transition hover:bg-white hover:text-navy"
              >
                Book your free GBP audit
              </Link>
            </div>
            <p className="mt-6 text-[15px] text-[#9fb6cc]">
              Or email{" "}
              <a href={`mailto:${site.email}`} className="text-white underline">
                {site.email}
              </a>
            </p>
          </Container>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
