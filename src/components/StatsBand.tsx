import Container from "./Container";

const stats = [
  { value: "60–90", unit: "days", label: "Typical time to first movement in search and AI answers" },
  { value: "4+", unit: "engines", label: "AI answer engines we optimize your clinic to be cited by" },
  { value: "100%", unit: "", label: "Done-for-you — you approve a short plan, we produce it all" },
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
