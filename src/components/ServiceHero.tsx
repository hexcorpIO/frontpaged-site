import Link from "next/link";
import Container from "./Container";

// Split hero for service pages: copy + CTAs on the left, a relevant visual on the right.
export default function ServiceHero({
  eyebrow,
  title,
  lead,
  quickAnswer,
  visual,
}: {
  eyebrow: string;
  title: React.ReactNode;
  lead: string;
  quickAnswer: React.ReactNode;
  visual: React.ReactNode;
}) {
  return (
    <section
      className="bg-gradient-to-b from-cream to-white pt-14 pb-16 sm:pt-16"
      aria-labelledby="service-hero-heading"
    >
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[1.02fr_0.98fr]">
          <div>
            <span className="mb-5 inline-block rounded-full border border-warm-line bg-white px-3.5 py-1.5 text-[12px] font-semibold uppercase tracking-[0.18em] text-teal-dark">
              {eyebrow}
            </span>
            <h1
              id="service-hero-heading"
              className="max-w-2xl font-serif text-[38px] font-semibold leading-[1.08] tracking-tight text-navy sm:text-[50px]"
            >
              {title}
            </h1>
            <p className="mt-6 max-w-xl text-[18px] leading-[1.7] text-warm-grey">{lead}</p>
            <div className="mt-7 flex flex-wrap items-center gap-3.5">
              <Link
                href="/#contact"
                className="inline-flex items-center justify-center rounded-full bg-teal px-8 py-4 text-[17px] font-semibold text-white transition hover:-translate-y-0.5 hover:bg-teal-dark"
              >
                Get a free visibility check
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center rounded-full border border-warm-line px-8 py-4 text-[17px] font-semibold text-navy transition hover:border-teal hover:bg-soft"
              >
                See pricing
              </Link>
            </div>
          </div>

          {visual}
        </div>

        {/* Answer-first quick answer (AEO) */}
        <div className="mt-12 rounded-2xl border-l-4 border-teal bg-soft p-6 sm:mt-14">
          <p className="mb-1.5 text-[12px] font-bold uppercase tracking-[0.16em] text-teal-dark">
            Quick answer
          </p>
          <p className="max-w-3xl text-[17px] leading-[1.7] text-ink">{quickAnswer}</p>
        </div>
      </Container>
    </section>
  );
}
