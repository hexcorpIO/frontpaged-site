import Link from "next/link";
import Container from "./Container";
import { CheckIcon } from "./Icons";

// Reusable closing CTA: a navy panel with copy + a compact "cited #1" AI-answer
// visual (mirrors the homepage hero) so inner pages match the home page's polish.
export default function CtaPanel({
  heading = "See where your clinic stands — free",
  sub = "Book a 30-minute visibility check and we’ll run the AI test on your med spa, then show you your three fastest wins. No pitch required.",
  cta = "Book your free visibility check",
}: {
  heading?: string;
  sub?: string;
  cta?: string;
}) {
  return (
    <section className="border-t border-warm-line bg-cream py-20 sm:py-28">
      <Container>
        <div className="grid items-center gap-10 overflow-hidden rounded-2xl bg-navy p-8 text-white sm:p-12 lg:grid-cols-2">
          <div>
            <h2 className="font-serif text-[30px] font-semibold tracking-tight sm:text-[36px]">
              {heading}
            </h2>
            <p className="mt-4 max-w-md text-[17px] leading-[1.7] text-[#cdd6e2]">{sub}</p>
            <Link
              href="/#contact"
              className="mt-7 inline-flex items-center justify-center rounded-full bg-teal px-8 py-4 text-[17px] font-semibold text-white transition hover:bg-white hover:text-navy"
            >
              {cta}
            </Link>
          </div>

          {/* Compact "your clinic, cited first" visual */}
          <div className="rounded-2xl border border-white/10 bg-white p-5 shadow-[0_24px_60px_rgba(0,0,0,0.30)]">
            <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-teal-dark">
              The AI answer, after Frontpaged
            </p>
            <ol className="space-y-2 text-[15px] text-navy">
              <li className="flex items-center gap-2 font-semibold">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal text-white">
                  <CheckIcon className="h-3.5 w-3.5" />
                </span>
                1. Your Clinic
              </li>
              <li className="pl-7 text-warm-grey">2. [Competitor A]</li>
              <li className="pl-7 text-warm-grey">3. [Competitor B]</li>
            </ol>
            <p className="mt-3 text-[12px] font-medium text-teal-dark">
              Cited by ChatGPT · Perplexity · Google AI Overviews
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
