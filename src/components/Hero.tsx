import Container from "./Container";
import Button from "./Button";
import { CheckIcon } from "./Icons";
import { site } from "@/lib/site";

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
              SEO &amp; AI-search visibility for 8 high-ticket industries
            </span>

            <h1
              id="hero-heading"
              className="max-w-2xl font-serif text-[40px] font-semibold leading-[1.08] tracking-tight text-navy sm:text-[52px]"
            >
              {/* Master tagline (site.tagline) — the same line the schema slogan and
                  footer carry, so the H1 and the metadata never disagree. */}
              Be the first name{" "}
              <span className="italic text-teal">AI recommends</span>.
            </h1>

            <p className="mt-6 max-w-xl text-[19px] leading-[1.7] text-warm-grey">
              Whether you run a med spa, a dermatology practice, a personal injury firm, or a
              real estate team, your next client is asking Google or ChatGPT before they ever
              find your website. We build the content and structured data that gets your
              business named in that answer — done-for-you, engineered to rank on Google and get
              cited by AI search.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <Button href="#contact" size="lg" trackId="hero-primary-visibility-check">
                Get your free visibility check
              </Button>
              {/* Goes to /industries/, not /pricing/. The homepage previously
                  offered two competing pricing paths — "See plans" straight to the
                  all-industries table, and "See pricing for your industry" to the
                  industry list. Both end at a price, but only one asks who you are
                  first, and prices here mean nothing until that's answered. One
                  path now: pick your industry, see your ladder. /pricing/ stays as
                  the comparison view for anyone who wants it. */}
              <Button href="/industries/" size="lg" variant="ghost" trackId="hero-secondary-see-plans">
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

// "The AI test" — shows the typical answer (business missing) vs. the Frontpaged result
// (cited #1). Deliberately industry-agnostic: the prompt and labels below work whether
// the reader runs a med spa, a law firm, or a real estate team, unlike site.tagline
// which is neutral but this mock still needed its own word-level pass (see Task 7 report).
function AiTestCard() {
  return (
    <figure className="overflow-hidden rounded-2xl border border-warm-line bg-white shadow-[0_24px_60px_rgba(21,38,63,0.12)]">
      <figcaption className="flex items-center gap-2.5 bg-navy px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-[#cfe3e3]">
        <span aria-hidden="true" className="inline-block h-2 w-2 rounded-full bg-teal" />
        The AI test
        <span aria-hidden="true" className="font-normal normal-case tracking-normal text-[#9fb6cc]">
          · what your future clients see
        </span>
      </figcaption>

      <div className="space-y-4 px-5 py-5 sm:px-6">
        <p className="text-sm text-warm-grey">
          Prompt: &ldquo;Who&rsquo;s the top-rated option near me?&rdquo;
        </p>

        {/* Before */}
        <div className="rounded-xl border border-warm-line bg-cream/60 p-4">
          <p className="text-[15px] leading-relaxed text-ink">
            &ldquo;A few well-reviewed options include [Competitor A], [Competitor B]…&rdquo;
          </p>
          <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-amber px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-coral">
            Your business — not mentioned
          </p>
        </div>

        {/* Connector */}
        <div className="flex items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-teal-dark">
          <span className="h-px flex-1 bg-warm-line" />
          With {site.name}
          <span className="h-px flex-1 bg-warm-line" />
        </div>

        {/* After */}
        <div className="rounded-xl border-2 border-teal bg-soft p-4">
          <ol className="space-y-2 text-[15px] text-navy">
            <li className="flex items-center gap-2 font-semibold">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal text-white">
                <CheckIcon className="h-3.5 w-3.5" />
              </span>
              1. Your Business
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
