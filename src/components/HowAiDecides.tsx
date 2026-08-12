import Link from "next/link";
import Container from "./Container";

// The mechanism section.
//
// The site was explaining the problem well and the mechanism not at all — "we
// engineer you to get cited" without ever saying how a model picks names. That
// loses the sophisticated buyer, and attorneys especially do not buy what they
// cannot follow.
//
// Second reason this earns its place: it is the exact content shape we sell.
// Question-headed, answer-first, specific. If it works, this section is itself
// evidence the method works.

const factors = [
  {
    n: "01",
    heading: "It needs a sentence it can lift",
    body: "A model composing an answer is looking for a passage that answers the question on its own, without the surrounding page. A treatment page that opens with three paragraphs about your philosophy has nothing liftable at the top. One that answers in the first two sentences does.",
  },
  {
    n: "02",
    heading: "It reads your markup, not your design",
    body: "Structured data states your facts in a form a machine cannot misread — what you do, where, what it costs, who is behind it. A beautiful site with no structured data is legible to visitors and close to invisible to the systems deciding who gets named.",
  },
  {
    n: "03",
    heading: "It checks whether other sources agree",
    body: "Models corroborate. Your site, your Google profile, the directories in your field, your reviews — when those agree, confidence goes up and you get named specifically. When they disagree, confidence drops and you get a hedge, or a competitor whose details are coherent.",
  },
  {
    n: "04",
    heading: "The sources differ by industry",
    body: "The third parties a model leans on for a plastic surgeon are not the ones it leans on for a personal injury firm. Knowing which ones matter in your category — and being present and consistent across them — is most of the work.",
  },
  {
    n: "05",
    heading: "It rewards the page that is actually specific",
    body: "Generic explanations already exist everywhere, so a model can synthesize them without citing anyone. The page that gets cited is the one holding something the model cannot assemble from elsewhere: your market, your procedure, your jurisdiction, your numbers.",
  },
];

export default function HowAiDecides() {
  return (
    <section
      id="how-ai-decides"
      className="border-t border-warm-line bg-white py-16 sm:py-24"
      aria-labelledby="how-ai-decides-heading"
    >
      <Container>
        <div className="max-w-3xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-teal">
            The mechanism
          </p>
          <h2
            id="how-ai-decides-heading"
            className="mt-4 font-serif text-[32px] leading-[1.12] text-navy sm:text-[40px]"
          >
            How AI decides who to recommend
          </h2>

          {/* Answer-first: this paragraph is the extraction target for the exact
              question the heading asks. */}
          <p className="mt-6 text-[18px] leading-[1.7] text-warm-grey">
            When someone asks an AI assistant for a recommendation, it is not
            ranking links — it is assembling an answer from sources it can read and
            corroborate, then naming a handful of businesses. Which names appear
            comes down to five things, and all five are buildable.
          </p>
        </div>

        <ol className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {factors.map((f) => (
            <li
              key={f.n}
              className="rounded-2xl border border-line bg-cream p-7"
            >
              <span className="font-serif text-[22px] text-teal">{f.n}</span>
              <h3 className="mt-3 font-serif text-[19px] leading-snug text-navy">
                {f.heading}
              </h3>
              <p className="mt-3 text-[15.5px] leading-[1.7] text-warm-grey">
                {f.body}
              </p>
            </li>
          ))}
        </ol>

        <p className="mt-10 max-w-3xl text-[16px] leading-[1.75] text-warm-grey">
          None of this is a trick, and none of it is fast. It is the unglamorous
          work of making a business legible to a machine that is deciding, right
          now, whether to say your name. We wrote up{" "}
          <Link
            href="/blog/what-is-generative-engine-optimization/"
            className="text-teal underline underline-offset-2"
          >
            what generative engine optimization actually is
          </Link>{" "}
          if you want the longer version, and each{" "}
          <Link
            href="/industries/"
            className="text-teal underline underline-offset-2"
          >
            industry page
          </Link>{" "}
          names the specific sources that matter in that category.
        </p>
      </Container>
    </section>
  );
}
