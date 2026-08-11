import Container from "./Container";
import SectionHeading from "./SectionHeading";
import { SparkleIcon, PinIcon, TrendingUpIcon } from "./Icons";

const cards = [
  {
    Icon: SparkleIcon,
    title: "AI answers replace the scroll",
    body: "ChatGPT, Perplexity, and Google's AI Overviews hand people one curated recommendation instead of ten links to compare. There's no page two.",
  },
  {
    Icon: PinIcon,
    title: '"Near me" is decided for them',
    body: 'When AI names "the best option near you," that\'s the shortlist people trust — before they ever visit a website.',
  },
  {
    Icon: TrendingUpIcon,
    title: "One missed lead is expensive",
    body: "A single new client is worth thousands over the relationship. Being left off the answer costs far more than the content that fixes it.",
  },
];

export default function Problem() {
  return (
    <section id="problem" className="border-t border-warm-line bg-cream py-20 sm:py-28" aria-labelledby="problem-heading">
      <Container>
        <SectionHeading
          id="problem-heading"
          kicker="Why this matters now"
          title="Search is changing faster than your marketing"
          sub="People still start on Google — but a fast-growing share now ask an AI assistant first, and both increasingly answer with a single short list instead of a page of results. If you're not on that list, you're invisible before the comparison even starts."
        />
        <div className="mt-10 grid gap-[22px] md:grid-cols-3">
          {cards.map((c, i) => (
            <article
              key={c.title}
              className="rounded-2xl border border-warm-line bg-white p-8 shadow-[0_8px_30px_rgba(21,38,63,0.05)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_44px_rgba(21,38,63,0.10)]"
            >
              <div className="mb-5 flex items-center justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-soft text-teal-dark">
                  <c.Icon className="h-6 w-6" />
                </span>
                <span className="font-serif text-4xl font-semibold text-warm-line">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="font-serif text-[21px] font-semibold text-navy">{c.title}</h3>
              <p className="mt-2.5 text-[15.5px] leading-[1.65] text-warm-grey">{c.body}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
