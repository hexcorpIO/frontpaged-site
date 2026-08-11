import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Container from "@/components/Container";
import CalendlyInline from "@/components/CalendlyInline";
import { CheckIcon, ChatIcon, SearchIcon, TrendingUpIcon } from "@/components/Icons";
import { site, priceRange } from "@/lib/site";

const PATH = "/contact";
const canonical = `${site.url}${PATH}`;

export const metadata: Metadata = {
  // No "Frontpaged" here — the root layout appends "· Frontpaged" via the title
  // template, and repeating it both doubles the brand and pushes past ~60 chars.
  title: "Contact Us — Book a Free Visibility Check",
  description:
    "Talk to Frontpaged about SEO and AI-search visibility for your med spa. Book a free 30-minute visibility check, or reach us by email or phone.",
  alternates: { canonical: PATH },
  openGraph: {
    type: "website",
    url: PATH,
    title: "Contact Frontpaged · Frontpaged",
    description:
      "Book a free 30-minute med spa visibility check, or reach us by email or phone. We work with medical spas nationwide.",
  },
};

const agenda = [
  {
    Icon: SearchIcon,
    title: "We run the AI test on your clinic, live",
    body: "We ask ChatGPT, Perplexity, and Google the questions your patients ask, and show you exactly what comes back — whether you're named, and who is named instead.",
  },
  {
    Icon: TrendingUpIcon,
    title: "We show you your three fastest wins",
    body: "Not a 40-page audit. The three specific things that would move your visibility soonest, in the order we'd do them.",
  },
  {
    Icon: ChatIcon,
    title: "You ask whatever you want",
    body: "Pricing, timelines, what we'd actually do in month one, why your current agency isn't getting this. No pitch required, and no obligation to sign anything.",
  },
];

const contactFaqs = [
  {
    q: "How long is the visibility check?",
    a: "Thirty minutes, and we keep to it. That is enough time to run the AI test live, walk through what we find, and answer your questions without turning into a sales presentation.",
  },
  {
    q: "Is the visibility check really free?",
    a: "Yes. There is no cost and no obligation. We do it because the fastest way to show what we do is to show you where your clinic currently stands, and most practices have never seen that data before.",
  },
  {
    q: "Do you work with med spas outside your area?",
    a: "We work with medical spas nationwide across the United States. Everything we do — content, schema, Google Business Profile management, AI visibility work — is done remotely, so your location makes no difference to how we work with you.",
  },
  {
    q: "How quickly will you get back to me?",
    a: "We reply to email within one business day. If you book a slot through the scheduler you will get an immediate confirmation with the meeting link, so there is nothing to wait for.",
  },
  {
    q: "What should I have ready before the call?",
    a: "Nothing. We do our own research beforehand. If you already know which treatments you most want to be booking, that is useful context, but it is not required and we can work it out together on the call.",
  },
];

export default function ContactPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ContactPage",
        "@id": `${canonical}#contactpage`,
        url: canonical,
        name: "Contact Frontpaged",
        description:
          "Book a free med spa visibility check, or reach Frontpaged by email or phone.",
        inLanguage: "en-US",
        about: { "@id": `${site.url}/#org` },
      },
      {
        "@type": "Organization",
        "@id": `${site.url}/#org`,
        name: site.name,
        url: site.url,
        email: site.email,
        telephone: "+1-615-905-1857",
        description: site.description,
        priceRange,
        sameAs: [site.linkedin, site.instagram],
        areaServed: { "@type": "Country", name: "United States" },
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "sales",
          email: site.email,
          telephone: "+1-615-905-1857",
          areaServed: "US",
          availableLanguage: "English",
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonical}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${site.url}/` },
          { "@type": "ListItem", position: 2, name: "Contact", item: canonical },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${canonical}#faq`,
        mainEntity: contactFaqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        // Schema is built from trusted local constants, not user input.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader />
      <main>
        {/* Hero — answer-first: what this page is for and how to act on it */}
        <section className="bg-gradient-to-b from-cream to-white py-16 sm:py-20">
          <Container>
            <div className="grid items-start gap-12 lg:grid-cols-[1.05fr_1fr]">
              <div>
                <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-teal-dark">
                  Contact
                </p>
                <h1 className="max-w-2xl font-serif text-[40px] font-semibold leading-[1.08] tracking-tight text-navy sm:text-[52px]">
                  Let&rsquo;s see where your clinic{" "}
                  <span className="italic text-teal">actually stands</span>.
                </h1>
                <p className="mt-6 max-w-xl text-[19px] leading-[1.7] text-warm-grey">
                  Book a free 30-minute visibility check and we&rsquo;ll run the AI test on your med
                  spa live — then show you the three fastest things you could fix. Prefer to email
                  or call? Both work, and a person answers.
                </p>

                {/* Direct contact — the answer-first block AI engines can lift */}
                <dl className="mt-9 space-y-5 border-t border-warm-line pt-8">
                  <div>
                    <dt className="text-[13px] font-semibold uppercase tracking-[0.14em] text-warm-grey">
                      Email
                    </dt>
                    <dd className="mt-1">
                      <a
                        href={`mailto:${site.email}`}
                        className="font-serif text-[22px] font-semibold text-navy hover:text-teal-dark"
                      >
                        {site.email}
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[13px] font-semibold uppercase tracking-[0.14em] text-warm-grey">
                      Phone
                    </dt>
                    <dd className="mt-1">
                      <a
                        href={site.phoneHref}
                        className="font-serif text-[22px] font-semibold text-navy hover:text-teal-dark"
                      >
                        {site.phone}
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[13px] font-semibold uppercase tracking-[0.14em] text-warm-grey">
                      Response time
                    </dt>
                    <dd className="mt-1 text-[17px] text-ink">
                      Within one business day, Monday to Friday.
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[13px] font-semibold uppercase tracking-[0.14em] text-warm-grey">
                      Who we work with
                    </dt>
                    <dd className="mt-1 text-[17px] text-ink">
                      Medical spas across the United States. Everything is done remotely, so your
                      location doesn&rsquo;t change how we work together.
                    </dd>
                  </div>
                </dl>
              </div>

              {/* What the call covers */}
              <div className="rounded-2xl border border-warm-line bg-white p-7 shadow-[0_16px_44px_rgba(21,38,63,0.06)] sm:p-9">
                <h2 className="font-serif text-[24px] font-semibold tracking-tight text-navy">
                  What happens on the call
                </h2>
                <ul className="mt-6 space-y-6">
                  {agenda.map(({ Icon, title, body }) => (
                    <li key={title} className="flex gap-4">
                      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-soft text-teal-dark">
                        <Icon className="h-4.5 w-4.5" />
                      </span>
                      <div>
                        <p className="font-semibold text-navy">{title}</p>
                        <p className="mt-1 text-[15px] leading-[1.65] text-warm-grey">{body}</p>
                      </div>
                    </li>
                  ))}
                </ul>
                <p className="mt-7 flex items-center gap-2 border-t border-warm-line pt-6 text-[15px] font-medium text-teal-dark">
                  <CheckIcon className="h-4 w-4" />
                  Free, 30 minutes, no obligation.
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* Scheduler */}
        <section
          id="book"
          className="border-t border-warm-line bg-navy py-16 text-white sm:py-20"
          aria-labelledby="book-heading"
        >
          <Container>
            <div className="text-center">
              <h2
                id="book-heading"
                className="font-serif text-[32px] font-semibold tracking-tight sm:text-[38px]"
              >
                Pick a time that suits you
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-[17px] leading-[1.7] text-[#cdd6e2]">
                Grab any open 30-minute slot below. You&rsquo;ll get an instant confirmation with
                the meeting link.
              </p>
            </div>
            <div className="mx-auto mt-9 max-w-3xl overflow-hidden rounded-2xl bg-white p-3 shadow-[0_24px_60px_rgba(0,0,0,0.30)]">
              <CalendlyInline url={site.calendly} />
            </div>
          </Container>
        </section>

        {/* FAQ */}
        <section className="border-t border-warm-line py-16 sm:py-20" aria-labelledby="contact-faq">
          <Container className="!max-w-3xl">
            <h2
              id="contact-faq"
              className="font-serif text-[30px] font-semibold tracking-tight text-navy sm:text-[36px]"
            >
              Before you book
            </h2>
            <div className="mt-8 space-y-3">
              {contactFaqs.map((f) => (
                <details
                  key={f.q}
                  className="group overflow-hidden rounded-xl border border-warm-line bg-cream"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-serif text-[17px] font-semibold text-navy [&::-webkit-details-marker]:hidden">
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
                      –
                    </span>
                  </summary>
                  <p className="px-5 pb-4 text-[15.5px] leading-[1.7] text-warm-grey">{f.a}</p>
                </details>
              ))}
            </div>
          </Container>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
