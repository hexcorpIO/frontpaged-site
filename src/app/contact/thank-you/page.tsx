import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import TopBanner from "@/components/TopBanner";
import SiteFooter from "@/components/SiteFooter";
import Container from "@/components/Container";
import TrackEvent from "@/components/TrackEvent";
import { site, ogImage } from "@/lib/site";

const PATH = "/contact/thank-you/";

// Where the form provider redirects after a successful submission. Kept on our own
// domain so the visitor doesn't land on a stranger's confirmation screen, and so the
// submission is a trackable conversion rather than an event that happens off-site.
//
// noindex: this page has no value in search and would otherwise show up as a thin
// result for brand queries.
export const metadata: Metadata = {
  title: "Message received",
  description:
    "Thanks — your message reached us and we'll reply within one business day. Here's what happens next and what to expect from the first conversation.",
  alternates: { canonical: PATH },
  robots: { index: false, follow: true },
  openGraph: {
    type: "website",
    url: PATH,
    title: "Message received · Frontpaged",
    description: "Thanks — we'll reply within one business day.",
    images: [ogImage],
  },
};

export default function ThankYou() {
  return (
    <>
      <TopBanner />
      <SiteHeader />
      {/* Formspree only redirects here on success, so this is the submission
          count — not the click count, which would include validation failures
          and anything the honeypot swallowed. Mark this as the conversion in
          GA4, not the button. */}
      <TrackEvent event="generate_lead" params={{ lead_source: "contact_form" }} />
      <main>
        <section className="bg-gradient-to-b from-cream to-white py-20 sm:py-24">
          <Container>
            <div className="max-w-2xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-teal">
                Message received
              </p>
              <h1 className="mt-4 font-serif text-[38px] leading-[1.08] text-navy sm:text-[46px]">
                Thanks — we&rsquo;ve got it.
              </h1>
              <p className="mt-6 text-[17px] leading-[1.75] text-warm-grey">
                We reply within one business day, usually sooner. The first reply
                comes from a person, not a sequence, and it will tell you honestly
                whether we think we can help before it asks you for anything.
              </p>

              <h2 className="mt-12 font-serif text-[24px] leading-snug text-navy">
                What happens next
              </h2>
              <ol className="mt-5 space-y-4 text-[16px] leading-[1.7] text-warm-grey">
                <li>
                  <strong className="text-navy">We look at your market first.</strong>{" "}
                  Before replying we check what the search landscape in your area
                  actually looks like, so the conversation starts from evidence rather
                  than a discovery questionnaire.
                </li>
                <li>
                  <strong className="text-navy">You get a straight answer.</strong> If
                  your market is already served by a client of ours, or if we think
                  content is the wrong spend for you right now, we say so.
                </li>
                <li>
                  <strong className="text-navy">Only then, a call.</strong> If it looks
                  like a fit, we&rsquo;ll suggest a time — or you can{" "}
                  <Link
                    href="/contact/"
                    className="text-teal underline underline-offset-2"
                  >
                    book one directly
                  </Link>{" "}
                  if you&rsquo;d rather not wait.
                </li>
              </ol>

              <h2 className="mt-12 font-serif text-[24px] leading-snug text-navy">
                While you wait
              </h2>
              <p className="mt-4 text-[16px] leading-[1.7] text-warm-grey">
                Have a look at{" "}
                <Link
                  href="/industries/"
                  className="text-teal underline underline-offset-2"
                >
                  your industry page
                </Link>{" "}
                for how we approach your category specifically, or the{" "}
                <Link
                  href="/pricing/"
                  className="text-teal underline underline-offset-2"
                >
                  pricing page
                </Link>{" "}
                if you want the numbers before we speak.
              </p>
              <p className="mt-6 text-[15px] leading-[1.7] text-warm-grey">
                Something urgent? Call{" "}
                <a
                  href={site.phoneHref}
                  className="text-teal underline underline-offset-2"
                >
                  {site.phone}
                </a>
                .
              </p>
            </div>
          </Container>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
