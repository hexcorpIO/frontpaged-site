import Link from "next/link";
import Container from "./Container";
import SectionHeading from "./SectionHeading";
import { getPublishedVerticals } from "@/lib/verticals";
import { getIndustryBody } from "@/lib/industries";
import { bandRange } from "@/lib/verticals/pricing";

// One card per published vertical — registry-driven, so unpublishing a vertical
// removes its card with no edit here (and an eventual ninth vertical needs none
// either). Self-contained section, like every other homepage component; also
// reused as-is on /industries/ (src/app/industries/page.tsx), which replaced its
// original inline card grid with this component.
//
// Only verticals with a written hub body (content/industries/<slug>.md) get a
// real /industries/<slug>/ link — that route only prerenders those slugs
// (see src/app/industries/[slug]/page.tsx's generateStaticParams), so linking
// an unbodied vertical there would point at a 404 in the static export. The
// rest route to /contact/ instead, mirroring the same fallback the by-industry
// pricing table uses (src/app/pricing/page.tsx) — no card is a dead end.
export default function IndustryGrid() {
  const industries = getPublishedVerticals();

  return (
    <section
      id="industries"
      className="border-t border-warm-line bg-white py-20 sm:py-28"
      aria-labelledby="industries-grid-heading"
    >
      <Container>
        <SectionHeading
          id="industries-grid-heading"
          kicker="Industries"
          title="Eight industries. Different searches, different answers."
          sub="A patient, a client, and a buyer all trust different sources when AI answers their question — so pricing, FAQs, and citation sources are built specific to the industry you're in."
        />
        <div className="mt-10 grid gap-[18px] sm:grid-cols-2 lg:grid-cols-4">
          {industries.map((v) => {
            const hasHub = getIndustryBody(v.slug) !== null;
            const range = bandRange(v.pricing);

            return (
              <Link
                key={v.slug}
                href={hasHub ? `/industries/${v.slug}/` : "/contact/"}
                className="group flex flex-col rounded-2xl border border-warm-line bg-white p-6 shadow-[0_8px_30px_rgba(21,38,63,0.05)] transition duration-200 hover:-translate-y-0.5 hover:border-teal"
              >
                <h3 className="font-serif text-[18px] font-semibold leading-snug text-navy group-hover:text-teal-dark">
                  {v.name}
                </h3>
                <p className="mt-2 flex-1 text-[14px] leading-[1.6] text-warm-grey">
                  {v.heroTagline}
                </p>
                <p className="mt-4 text-[13px] font-semibold text-teal-dark">
                  From ${range.min.toLocaleString("en-US")}/mo, founding rate
                </p>
                {!hasHub && (
                  <p className="mt-1 text-[12px] text-warm-grey">Talk to us — page coming soon</p>
                )}
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
