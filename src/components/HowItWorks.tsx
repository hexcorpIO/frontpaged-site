import Container from "./Container";
import SectionHeading from "./SectionHeading";

const steps = [
  {
    title: "Visibility audit",
    body: "We map where you stand today across Google and AI search, and find your fastest wins.",
  },
  {
    title: "Monthly content plan",
    body: "You get a clear list of pieces targeting the treatments and questions your patients actually search.",
  },
  {
    title: "We produce & optimize",
    body: "Answer-first articles, service pages, FAQs, and schema — structured so Google ranks them and AI cites them.",
  },
  {
    title: "Track & report",
    body: "Every month you see where you now appear in AI answers and search — proof it's working.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how" className="border-t border-line py-[72px]" aria-labelledby="how-heading">
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
              <div
                aria-hidden="true"
                className="mb-3.5 flex h-[38px] w-[38px] items-center justify-center rounded-full bg-navy font-bold text-white"
              >
                {i + 1}
              </div>
              <h3 className="mb-1.5 text-[17px] font-semibold text-navy">{s.title}</h3>
              <p className="text-[14.5px] text-grey">{s.body}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
