import Container from "./Container";
import SectionHeading from "./SectionHeading";
import Button from "./Button";
import { tiers, usd } from "@/lib/site";

export default function Pricing() {
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
          sub="Most clinics start with the Authority plan. Not sure? Begin with a one-time visibility audit and decide from there."
        />
        <div className="mt-6 grid items-stretch gap-[22px] md:grid-cols-3">
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
                {usd(t.price)}
                <span className="font-sans text-base font-medium text-warm-grey">/mo</span>
              </p>
              <p className="mb-4 min-h-10 text-[14px] text-warm-grey">{t.for}</p>
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
                href="#contact"
                variant={t.featured ? "solid" : "ghost"}
                className="w-full"
              >
                {t.cta}
              </Button>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
