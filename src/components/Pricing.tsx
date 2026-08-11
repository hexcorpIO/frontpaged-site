import Container from "./Container";
import SectionHeading from "./SectionHeading";
import Button from "./Button";
import { founding, guarantee, auditOffer, usd } from "@/lib/site";
import { foundingPrice, annualPrice } from "@/lib/verticals/pricing";
import type { Vertical } from "@/lib/verticals/types";

// Sitewide pricing block (cards + guarantee + audit offer + enterprise band) for a
// single vertical. Reads tiers from `vertical.pricing` rather than a global `tiers`
// constant so the cards and any Offer schema built from the same vertical can never
// disagree. Used on the homepage today; the /pricing/ page instead renders a
// by-industry table (src/app/pricing/page.tsx) since it needs to show all verticals
// at once.
export default function Pricing({ vertical }: { vertical: Vertical }) {
  const tiers = vertical.pricing.tiers;
  const lastTier = tiers[tiers.length - 1];
  const enterpriseFeatures = [
    `Everything in ${lastTier.name} — across every location`,
    "Per-location service pages & neighborhood targeting",
    "A dedicated strategist + quarterly growth roadmap",
    "Consolidated, per-location reporting",
    "Priority content turnaround",
  ];

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
          title="Straightforward monthly retainers"
          sub="Month-to-month — no contract, no lock-in, cancel any time. Most clients start with the Authority plan."
        />

        {/* Founding-client banner. Retires everywhere by flipping `founding.enabled`. */}
        {founding.enabled && (
          <div className="mt-6 flex flex-col gap-2 rounded-2xl border-2 border-teal bg-soft p-6 sm:flex-row sm:items-center sm:gap-6">
            <span className="shrink-0 rounded-full bg-teal px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white">
              {vertical.foundingSlotsRemaining} spots
            </span>
            <div>
              <p className="font-serif text-[19px] font-semibold text-navy">{founding.headline}</p>
              <p className="mt-1 text-[15px] leading-[1.6] text-warm-grey">{founding.terms}</p>
            </div>
          </div>
        )}

        <div className="mt-[22px] grid items-stretch gap-[22px] md:grid-cols-3">
          {tiers.map((t) => (
            <article
              key={t.name}
              className={`relative flex flex-col rounded-2xl bg-white p-8 transition duration-200 ${
                t.featured
                  ? "border-2 border-teal shadow-[0_18px_50px_rgba(46,139,139,0.16)]"
                  : "border border-warm-line shadow-[0_8px_30px_rgba(21,38,63,0.05)]"
              }`}
            >
              {t.featured && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-teal px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white">
                  Most popular
                </span>
              )}
              <h3 className="font-serif text-[22px] font-semibold text-navy">{t.name}</h3>
              <p className="mb-0.5 mt-2 font-serif text-[40px] font-semibold text-navy">
                {usd(founding.enabled ? foundingPrice(t.price) : t.price)}
                <span className="font-sans text-base font-medium text-warm-grey">/mo</span>
              </p>
              {founding.enabled ? (
                <p className="text-[13.5px] font-medium text-teal-dark">
                  <s className="text-warm-grey">{usd(t.price)}</s> · founding rate, locked 12 months
                </p>
              ) : (
                <p className="text-[13.5px] font-medium text-warm-grey">
                  {usd(annualPrice(t.price))}/yr if prepaid — 2 months free
                </p>
              )}
              <p className="mb-4 mt-2 min-h-10 text-[14px] text-warm-grey">{t.for}</p>
              <ul className="mb-6 flex-1">
                {t.features.map((f) => (
                  <li
                    key={f}
                    className="relative border-b border-warm-line py-[7px] pl-[26px] text-[15px] text-ink before:absolute before:left-0 before:font-extrabold before:text-teal before:content-['✓']"
                  >
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                href="/contact/"
                variant={t.featured ? "solid" : "ghost"}
                className="w-full"
              >
                {t.cta}
              </Button>
              {founding.enabled && (
                <p className="mt-3 text-center text-[13px] text-warm-grey">
                  or {usd(annualPrice(t.price))}/yr prepaid — 2 months free
                </p>
              )}
            </article>
          ))}
        </div>

        {/* Guarantee + terms — the two things that answer "what if this doesn't work". */}
        <div className="mt-[22px] grid gap-[22px] lg:grid-cols-[1.4fr_1fr]">
          <div className="rounded-2xl border border-warm-line bg-white p-7">
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-teal-dark">
              Our guarantee
            </p>
            <p className="mt-2 font-serif text-[19px] font-semibold leading-[1.45] text-navy">
              {guarantee}
            </p>
            <p className="mt-3 text-[14.5px] leading-[1.6] text-warm-grey">
              We don&rsquo;t guarantee rankings — nobody honestly can, because Google controls the
              algorithm. We guarantee the thing we actually control.
            </p>
          </div>

          {/* Paid entry product — the low-risk way in. */}
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

        {/* Enterprise / multi-location — custom, sales-led band */}
        <div className="mt-[22px] flex flex-col gap-6 rounded-2xl bg-navy p-8 text-white sm:p-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="lg:max-w-md">
            <span className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#7fd0d0]">
              Enterprise
            </span>
            <p className="mt-2 font-serif text-[34px] font-semibold leading-none">
              Custom
              <span className="ml-2 align-middle font-sans text-base font-medium text-[#9fb6cc]">
                from {usd(vertical.pricing.enterpriseFrom)}/mo
              </span>
            </p>
            <p className="mt-3 text-[15px] leading-[1.6] text-[#cdd6e2]">
              Multi-location {vertical.name.toLowerCase()}, groups, and organizations scaling
              across markets.
            </p>
            <a
              href="/contact/"
              className="mt-6 inline-flex items-center justify-center rounded-full bg-teal px-7 py-3.5 font-semibold text-white transition hover:bg-white hover:text-navy"
            >
              Book a strategy call
            </a>
          </div>
          <ul className="grid gap-2.5 sm:grid-cols-2 lg:max-w-md">
            {enterpriseFeatures.map((f) => (
              <li
                key={f}
                className="relative pl-6 text-[14.5px] leading-[1.5] text-[#e6edf5] before:absolute before:left-0 before:font-bold before:text-teal before:content-['✓']"
              >
                {f}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
