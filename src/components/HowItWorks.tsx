import Container from "./Container";
import SectionHeading from "./SectionHeading";
import { SearchIcon, FileIcon, SparkleIcon, TrendingUpIcon } from "./Icons";

const steps = [
  {
    Icon: SearchIcon,
    title: "Visibility audit",
    body: "We map where you stand today across Google and AI search, and find your fastest wins.",
  },
  {
    Icon: FileIcon,
    title: "Monthly content plan",
    body: "You get a clear list of pieces targeting the treatments and questions your patients actually search.",
  },
  {
    Icon: SparkleIcon,
    title: "We produce & optimize",
    body: "Answer-first articles, service pages, FAQs, and schema — structured so Google ranks them and AI cites them.",
  },
  {
    Icon: TrendingUpIcon,
    title: "Track & report",
    body: "Every month you see where you now appear in AI answers and search — proof it's working.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how" className="border-t border-warm-line bg-white py-20 sm:py-28" aria-labelledby="how-heading">
      <Container>
        <SectionHeading
          id="how-heading"
          kicker="How it works"
          title="A simple monthly rhythm. We do the work."
          sub="You approve a short plan once a month. We produce, optimize, and track everything else."
        />
        <ol className="mt-10 grid gap-5 md:grid-cols-4">
          {steps.map((s, i) => (
            <li key={s.title}>
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-soft text-teal-dark">
                  <s.Icon className="h-[22px] w-[22px]" />
                </span>
                <span className="font-serif text-2xl font-semibold text-gold">{i + 1}</span>
                <span className="h-px flex-1 bg-warm-line" />
              </div>
              <h3 className="font-serif text-[18px] font-semibold text-navy">{s.title}</h3>
              <p className="mt-2 text-[15px] leading-[1.6] text-warm-grey">{s.body}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
