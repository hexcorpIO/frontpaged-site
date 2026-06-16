import Container from "./Container";
import CalendlyInline from "./CalendlyInline";
import { site } from "@/lib/site";

export default function ContactBand() {
  return (
    <section
      id="contact"
      className="border-t border-warm-line bg-navy py-20 text-center text-white sm:py-28"
      aria-labelledby="contact-heading"
    >
      <Container>
        <h2 id="contact-heading" className="font-serif text-[34px] font-semibold tracking-tight sm:text-[40px]">
          Book your free visibility check
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-[18px] leading-[1.7] text-[#cdd6e2]">
          Grab a 30-minute slot and we&rsquo;ll run the AI test on your clinic, then walk you
          through your three fastest visibility wins. No pitch required.
        </p>

        <div className="mx-auto mt-8 max-w-3xl overflow-hidden rounded-2xl bg-white p-3 shadow-[0_24px_60px_rgba(0,0,0,0.30)]">
          <CalendlyInline url={site.calendly} />
        </div>

        <p className="mt-6 text-[15px] text-[#9fb6cc]">
          Prefer email? Reach us at{" "}
          <a href={`mailto:${site.email}`} className="text-white underline">
            {site.email}
          </a>
        </p>
      </Container>
    </section>
  );
}
