import Container from "./Container";
import Button from "./Button";
import { CheckIcon } from "./Icons";

export default function Hero() {
  return (
    <section
      id="top"
      className="bg-gradient-to-b from-cream to-white pt-16 pb-20 sm:pt-20"
      aria-labelledby="hero-heading"
    >
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          {/* Copy */}
          <div>
            <span className="mb-6 inline-block rounded-full border border-warm-line bg-white px-3.5 py-1.5 text-[12px] font-semibold uppercase tracking-[0.18em] text-teal-dark">
              Content &amp; AI-search visibility for medical spas
            </span>

            <h1
              id="hero-heading"
              className="max-w-2xl font-serif text-[40px] font-semibold leading-[1.08] tracking-tight text-navy sm:text-[52px]"
            >
              When patients search for the best med spa, be the{" "}
              <span className="italic text-teal">first answer</span> — not the one left off.
            </h1>

            <p className="mt-6 max-w-xl text-[19px] leading-[1.7] text-warm-grey">
              Your future patients are asking Google and ChatGPT, &ldquo;What&rsquo;s the best med
              spa near me?&rdquo; We get your clinic onto the front page of that answer — done-for-you
              content engineered to rank on Google and get cited by AI search.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <Button href="#contact" size="lg">
                Get a free AI-visibility check
              </Button>
              <Button href="#pricing" size="lg" variant="ghost">
                See plans
              </Button>
            </div>
            <p className="mt-3.5 text-sm text-warm-grey">No commitment — just your report.</p>
          </div>

          {/* AI answer before/after mock */}
          <AiTestCard />
        </div>
      </Container>
    </section>
  );
}

// "The AI test" — shows the typical answer (clinic missing) vs. the Frontpaged result (cited #1).
function AiTestCard() {
  return (
    <figure className="overflow-hidden rounded-2xl border border-warm-line bg-white shadow-[0_24px_60px_rgba(21,38,63,0.12)]">
      <figcaption className="flex items-center gap-2.5 bg-navy px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-[#cfe3e3]">
        <span aria-hidden="true" className="inline-block h-2 w-2 rounded-full bg-teal" />
        The AI test
        <span aria-hidden="true" className="font-normal normal-case tracking-normal text-[#9fb6cc]">
          · what your patients see
        </span>
      </figcaption>

      <div className="space-y-4 px-5 py-5 sm:px-6">
        <p className="text-sm text-warm-grey">
          Prompt: &ldquo;What are the best med spas near me for Botox?&rdquo;
        </p>

        {/* Before */}
        <div className="rounded-xl border border-warm-line bg-cream/60 p-4">
          <p className="text-[15px] leading-relaxed text-ink">
            &ldquo;A few well-reviewed options include [Competitor A], [Competitor B]…&rdquo;
          </p>
          <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-amber px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-coral">
            Your clinic — not mentioned
          </p>
        </div>

        {/* Connector */}
        <div className="flex items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-teal-dark">
          <span className="h-px flex-1 bg-warm-line" />
          With Frontpaged
          <span className="h-px flex-1 bg-warm-line" />
        </div>

        {/* After */}
        <div className="rounded-xl border-2 border-teal bg-soft p-4">
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
    </figure>
  );
}
