import Container from "./Container";
import Button from "./Button";

export default function Hero() {
  return (
    <section
      id="top"
      className="bg-gradient-to-b from-cream to-white pt-24 pb-24 sm:pt-28"
      aria-labelledby="hero-heading"
    >
      <Container>
        <span className="mb-6 inline-block rounded-full bg-white px-3.5 py-1.5 text-[12px] font-semibold uppercase tracking-[0.18em] text-teal-dark border border-warm-line">
          Content &amp; AI-search visibility for medical spas
        </span>

        <h1
          id="hero-heading"
          className="max-w-3xl font-serif text-[40px] font-semibold leading-[1.08] tracking-tight text-navy sm:text-[56px]"
        >
          When patients search for the best med spa, be the{" "}
          <span className="text-teal italic">first answer</span> — not the one left off.
        </h1>

        <p className="mt-6 max-w-2xl text-[19px] leading-[1.7] text-warm-grey">
          Your future patients are asking Google and ChatGPT, &ldquo;What&rsquo;s the best med spa
          near me?&rdquo; We get your clinic onto the front page of that answer. Done-for-you content
          engineered to rank on Google and get cited by AI search.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3.5">
          <Button href="#contact" size="lg">
            Get a free AI-visibility check
          </Button>
          <Button href="#pricing" size="lg" variant="ghost">
            See plans
          </Button>
          <span className="text-sm text-warm-grey">No commitment — just your report.</span>
        </div>

        <AiTestCard />
      </Container>
    </section>
  );
}

// "The AI test" demo card — shows a patient's AI prompt and how the clinic is missing.
function AiTestCard() {
  return (
    <figure className="mt-14 max-w-[680px] overflow-hidden rounded-2xl border border-warm-line bg-white shadow-[0_18px_50px_rgba(21,38,63,0.10)]">
      <figcaption className="flex items-center gap-2.5 bg-navy px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-[#cfe3e3]">
        <span aria-hidden="true" className="inline-block h-2 w-2 rounded-full bg-teal" />
        The AI test
        <span aria-hidden="true" className="font-normal normal-case tracking-normal text-[#9fb6cc]">
          · what your patients see
        </span>
      </figcaption>
      <div className="px-[22px] py-5">
        <p className="mb-2.5 text-sm text-warm-grey">
          Prompt: &ldquo;What are the best med spas near me for Botox?&rdquo;
        </p>
        <div className="text-base">
          &ldquo;A few well-reviewed options include [Competitor A], [Competitor B]…&rdquo;
          <p className="mt-3 border-l-2 border-coral bg-amber px-4 py-3 text-[#7a5a16]">
            <span className="mb-1 block text-[11px] font-bold uppercase tracking-[0.14em] text-coral">
              Not mentioned
            </span>
            Your clinic isn&rsquo;t in the answer. That whole high-intent audience never sees you. We fix
            exactly that.
          </p>
        </div>
      </div>
    </figure>
  );
}
