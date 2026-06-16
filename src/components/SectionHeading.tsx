// Shared kicker + heading + subtitle block used atop most sections.
export default function SectionHeading({
  kicker,
  title,
  sub,
  id,
}: {
  kicker: string;
  title: string;
  sub?: string;
  id?: string;
}) {
  return (
    <>
      <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-teal-dark">
        {kicker}
      </p>
      <h2
        id={id}
        className="max-w-2xl font-serif text-[32px] font-semibold leading-[1.1] tracking-tight text-navy sm:text-[40px]"
      >
        {title}
      </h2>
      {sub && <p className="mt-4 max-w-2xl text-[17px] leading-[1.7] text-warm-grey">{sub}</p>}
    </>
  );
}
