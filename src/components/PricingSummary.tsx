import Container from "./Container";
import SectionHeading from "./SectionHeading";
import Button from "./Button";
import { priceRange, founding, guarantee, auditOffer, usd } from "@/lib/site";

// Replaces the old single-vertical pricing cards on the homepage. Real tier
// cards need a vertical (three tiers, one price each) — the homepage no
// longer has one, so this renders the sitewide range plus the two universal
// conversion paths (guarantee, audit) and sends anyone who wants real numbers
// to /industries/ or /pricing/, where a vertical (or the full by-industry
// table) is actually in view.
export default function PricingSummary() {
  return (
    <section
      id="pricing"
      className="border-t border-warm-line bg-sand py-20 sm:py-28"
      aria-labelledby="pricing-heading"
    >
      <Container>
        <SectionHeading
          id="pricing-heading"
          kicker="Plans"
          title={`${priceRange}, depending on your industry`}
          sub="A personal injury case is worth a different number than a single med spa visit, so a law firm's plan and a med spa's plan aren't priced the same. Every plan is month-to-month — no contract, no lock-in."
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
              {guarantee}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button href="/industries/">See pricing for your industry</Button>
              <Button href="/pricing/" variant="ghost">
                Compare all plans
              </Button>
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
            <Button href="/contact/" variant="ghost" className="mt-4 w-full">
              {auditOffer.cta}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
