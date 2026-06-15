import Container from "./Container";
import SectionHeading from "./SectionHeading";

const cards = [
  {
    icon: "🤖",
    title: "AI answers replace the scroll",
    body: "ChatGPT, Perplexity, and Google's AI Overviews hand patients one curated recommendation instead of ten links. There's no page two.",
  },
  {
    icon: "📍",
    title: '"Near me" is decided for them',
    body: 'When AI names "the best Botox in your city," that\'s the shortlist patients trust — before they ever visit a website.',
  },
  {
    icon: "💸",
    title: "One missed patient is expensive",
    body: "A single new injectable patient is worth thousands over a year. Being left off the answer costs far more than the content that fixes it.",
  },
];

export default function Problem() {
  return (
    <section id="problem" className="border-t border-line py-[72px]" aria-labelledby="problem-heading">
      <Container>
        <SectionHeading
          id="problem-heading"
          kicker="Why this matters now"
          title="Search is changing faster than your marketing"
          sub="80% of patients still find clinics on Google — but a fast-growing share now ask an AI assistant first. Both increasingly answer with a single short list. If you're not on it, you're invisible."
        />
        <div className="mt-10 grid gap-[22px] md:grid-cols-3">
          {cards.map((c) => (
            <article key={c.title} className="rounded-xl border border-line bg-white p-[26px]">
              <div
                aria-hidden="true"
                className="mb-3.5 flex h-[42px] w-[42px] items-center justify-center rounded-[10px] bg-soft text-[22px]"
              >
                {c.icon}
              </div>
              <h3 className="mb-2 text-[19px] font-semibold text-navy">{c.title}</h3>
              <p className="text-[15px] text-grey">{c.body}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
