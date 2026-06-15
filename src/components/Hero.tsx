import Container from "./Container";
import Button from "./Button";

export default function Hero() {
  return (
    <section
      id="top"
      className="bg-gradient-to-b from-[#f7fbfb] to-white pt-20 pb-[70px] sm:pt-24"
      aria-labelledby="hero-heading"
    >
      <Container>
        <span className="mb-6 inline-block rounded-full bg-soft px-3.5 py-1.5 text-[13px] font-bold uppercase tracking-wide text-teal-dark">
          Content &amp; AI-search visibility for medical spas
        </span>

        <h1
          id="hero-heading"
          className="max-w-3xl text-4xl font-extrabold leading-[1.08] tracking-tight text-navy sm:text-5xl md:text-[52px]"
        >
          When patients search for the best med spa, be the{" "}
          <span className="text-teal">first answer</span> — not the one left off.
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-grey sm:text-xl">
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
          <span className="text-sm text-grey">No commitment — just your report.</span>
        </div>

        <AiTestCard />
      </Container>
    </section>
  );
}

// "The AI test" demo card — shows a patient's AI prompt and how the clinic is missing.
function AiTestCard() {
  return (
    <figure className="mt-12 max-w-[680px] overflow-hidden rounded-2xl border border-line bg-white shadow-[0_12px_34px_rgba(21,38,63,0.10)]">
      <figcaption className="flex items-center gap-2 bg-navy px-4 py-2.5 text-[13px] text-[#cceeee]">
        🔎 <b className="text-white">The AI test</b>
        <span aria-hidden="true">·</span> what your patients see
      </figcaption>
      <div className="px-[22px] py-5">
        <p className="mb-2.5 text-sm text-grey">
          Prompt: &ldquo;What are the best med spas near me for Botox?&rdquo;
        </p>
        <div className="text-base">
          &ldquo;A few well-reviewed options include [Competitor A], [Competitor B]…&rdquo;
          <p className="mt-1 rounded-md border-l-[3px] border-[#e0a949] bg-amber px-3 py-2.5 text-[#7a5a16]">
            ⚠️ Your clinic isn&rsquo;t mentioned. That whole high-intent audience never sees you. We
            fix exactly that.
          </p>
        </div>
      </div>
    </figure>
  );
}
