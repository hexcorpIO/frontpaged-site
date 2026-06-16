import Container from "./Container";
import SectionHeading from "./SectionHeading";
import { faqs } from "@/lib/site";

export default function Faq() {
  return (
    <section id="faq" className="border-t border-warm-line bg-white py-20 sm:py-28" aria-labelledby="faq-heading">
      <Container>
        <SectionHeading id="faq-heading" kicker="Questions" title="Frequently asked" />
        <div className="mt-10 max-w-[760px]">
          {faqs.map((f, i) => (
            <details
              key={f.q}
              open={i === 0}
              className="group mb-3 overflow-hidden rounded-xl border border-warm-line bg-cream"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between px-[22px] py-[18px] font-serif text-[18px] font-semibold text-navy [&::-webkit-details-marker]:hidden">
                {f.q}
                <span
                  aria-hidden="true"
                  className="text-2xl font-normal text-teal group-open:hidden"
                >
                  +
                </span>
                <span
                  aria-hidden="true"
                  className="hidden text-2xl font-normal text-teal group-open:inline"
                >
                  –
                </span>
              </summary>
              <p className="px-5 pb-5 text-[15.5px] leading-[1.7] text-warm-grey">{f.a}</p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
