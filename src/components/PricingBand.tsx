import Button from "./Button";
import { founding } from "@/lib/site";
import { foundingPrice, annualPrice } from "@/lib/verticals/pricing";
import type { Vertical } from "@/lib/verticals/types";

const usd = (n: number) => `$${n.toLocaleString("en-US")}`;

// Three pricing cards for a single vertical. Visual treatment mirrors
// src/components/Pricing.tsx (struck-through list price, founding rate,
// "most popular" ribbon on the featured tier) but reads from `vertical.pricing`
// instead of the sitewide `tiers` in site.ts, so the cards and the Offer schema
// on the same page always agree — both derive from foundingPrice(t.price).
export default function PricingBand({ vertical }: { vertical: Vertical }) {
  return (
    <section
      id="pricing"
      aria-labelledby="pricing-heading"
      // scroll-mt clears the sticky header when jumped to from the hero
      className="scroll-mt-24 border-t border-warm-line py-14 sm:py-16"
    >
      <h2
        id="pricing-heading"
        className="font-serif text-[28px] font-semibold leading-[1.15] tracking-tight text-navy sm:text-[34px]"
      >
        Plans for {vertical.name.toLowerCase()}
      </h2>
      <p className="mt-2 max-w-2xl text-[16px] leading-[1.7] text-warm-grey">
        Month-to-month — no contract, no lock-in, cancel any time.
      </p>

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
        {vertical.pricing.tiers.map((t) => (
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
            {/* Annual prepay is quoted ONLY when the founding rate is retired.
                annualPrice() is ten months of the LIST price, so pairing it with a
                founding monthly rate advertised a "saving" that costs more than
                paying monthly: 12 x $2,060 = $24,720 against a $27,500 "2 months
                free". The two discounts are separate offers and the site has never
                priced their combination, so the honest fix is to show one at a time
                rather than invent a stacked rate. */}
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
            <Button href="/contact/" variant={t.featured ? "solid" : "ghost"} className="w-full">
              {t.cta}
            </Button>
          </article>
        ))}
      </div>
    </section>
  );
}
