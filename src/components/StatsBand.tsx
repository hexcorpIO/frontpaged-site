import Container from "./Container";

const stats = [
// The first figure is the only one here that is a claim about us rather than about
// the service, and it is deliberately phrased as career experience — it is prior
// paid-media work, NOT a Frontpaged client roster. Implying 67 clients for an
// agency this new would manufacture precisely the proof we don't yet have.
  { value: "67", unit: "practices", label: "Healthcare practices where our founder directed SEO, AEO, and marketing technology — before Frontpaged" },
  { value: "60–90", unit: "days", label: "Typical time to first movement in search and AI answers" },
  { value: "4+", unit: "engines", label: "AI answer engines we optimize your business to be cited by" },
  { value: "$0", unit: "", label: "Ad spend required — pure organic search and AI visibility" },
];

export default function StatsBand() {
  return (
    <section className="border-t border-warm-line bg-navy py-16 text-white sm:py-20">
      <Container>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="font-serif text-[44px] font-semibold leading-none text-teal">
                {s.value}
                {s.unit && <span className="ml-1.5 text-xl font-medium text-[#9fb6cc]">{s.unit}</span>}
              </p>
              <p className="mt-3 text-[15px] leading-[1.5] text-[#cdd6e2]">{s.label}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
