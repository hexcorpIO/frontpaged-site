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
      <p className="mb-3 text-[13px] font-bold uppercase tracking-[1px] text-teal-dark">
        {kicker}
      </p>
      <h2
        id={id}
        className="max-w-2xl text-3xl font-bold tracking-tight text-navy sm:text-[34px]"
      >
        {title}
      </h2>
      {sub && <p className="mt-3.5 max-w-2xl text-lg text-grey">{sub}</p>}
    </>
  );
}
