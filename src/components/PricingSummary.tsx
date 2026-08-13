import Link from "next/link";
import Container from "./Container";
import SectionHeading from "./SectionHeading";
import Button from "./Button";
import { founding, guaranteeShort, auditOffer, usd } from "@/lib/site";
import { getPublishedVerticals } from "@/lib/verticals";
import { foundingPrice } from "@/lib/verticals/pricing";

// Replaces the old single-vertical pricing cards on the homepage. Real tier
// cards need a vertical (three tiers, one price each) — the homepage no
// longer has one, so this renders the sitewide range plus the two universal
// conversion paths (guarantee, audit) and sends anyone who wants real numbers
// to /industries/ or /pricing/, where a vertical (or the full by-industry
// table) is actually in view.
// The cheapest entry price across published industries, at whatever rate is
// currently being advertised. Derived rather than written down so it can't drift
// from the bands, and so it follows `founding.enabled` like every other price.
function startingPrice(): string {
  const lows = getPublishedVerticals().map((v) => {
    const list = Math.min(...v.pricing.tiers.map((t) => t.price));
    return founding.enabled ? foundingPrice(list) : list;
  });
  return usd(Math.min(...lows));
}

export default function PricingSummary() {
  const startingAt = startingPrice();

  return (
    <section
      id="pricing"
      className="border-t border-warm-line bg-sand py-20 sm:py-28"
      aria-labelledby="pricing-heading"
    >
      <Container>
        {/* Leads with the floor, not the span. The full range is honest but it is
            read as a threat: a real estate team seeing "$1,125-$14,000" assumes it
            is the $14,000 one. The ladder is one click away on /industries/, where
            the visitor has already self-identified and the number is theirs. */}
        <SectionHeading
          id="pricing-heading"
          kicker="Plans"
          title={`Plans start at ${startingAt} for your industry`}
          sub="A personal injury case is worth a different number than a single med spa visit, so a law firm's plan and a med spa's plan aren't priced the same. Pick your industry to see its actual ladder. Every plan is month-to-month — no contract, no lock-in."
        />

        {founding.enabled && (
          <div className="mt-6 flex flex-col gap-2 rounded-2xl border-2 border-teal bg-soft p-6 sm:flex-row sm:items-center sm:gap-6">
            <span className="shrink-0 rounded-full bg-teal px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white">
              Founding rate
            </span>
            <div>
              <p className="font-serif text-[19px] font-semibold text-navy">{founding.headline}</p>
              <p className="mt-1 text-[15px] leading-[1.6] text-warm-grey">{founding.terms}</p>
            </div>
          </div>
        )}

        <div className="mt-[22px] grid gap-[22px] lg:grid-cols-[1.4fr_1fr]">
          <div className="flex flex-col justify-center rounded-2xl border border-warm-line bg-white p-8">
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-teal-dark">
              Our guarantee
            </p>
            <p className="mt-2 font-serif text-[19px] font-semibold leading-[1.45] text-navy">
              {guaranteeShort}
            </p>
            {/* One button, not two. The second was a near-synonym of the first and
                split the click for no gain. Comparing all plans is still reachable
                as a text link. */}
            <div className="mt-6">
              <Button href="/industries/" trackId="pricing-summary-see-industry-pricing">
                See pricing for your industry
              </Button>
              <p className="mt-4 text-[14.5px] text-warm-grey">
                Or{" "}
                <Link
                  href="/pricing/"
                  data-track-id="pricing-summary-compare-all"
                  className="text-teal underline underline-offset-2"
                >
                  compare every industry side by side
                </Link>
                .
              </p>
            </div>
          </div>

          {/* Paid entry product — the same low-risk way in regardless of industry. */}
          <div className="flex flex-col rounded-2xl border border-warm-line bg-white p-7">
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-teal-dark">
              Not ready for a plan?
            </p>
            <p className="mt-2 font-serif text-[19px] font-semibold text-navy">
              {auditOffer.name} — {usd(auditOffer.price)}
            </p>
            <p className="mt-2 flex-1 text-[14.5px] leading-[1.6] text-warm-grey">
              {auditOffer.for}
            </p>
            <p className="mt-3 rounded-lg bg-soft px-3.5 py-2.5 text-[13.5px] font-medium text-teal-dark">
              {auditOffer.credit}
            </p>
            <Button
              href="/contact/"
              variant="ghost"
              className="mt-4 w-full"
              trackId="pricing-summary-paid-audit"
            >
              {auditOffer.cta}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
