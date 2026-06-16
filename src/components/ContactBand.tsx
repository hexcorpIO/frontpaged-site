import Container from "./Container";
import CalendlyInline from "./CalendlyInline";
import { site } from "@/lib/site";

export default function ContactBand() {
  return (
    <section
      id="contact"
      className="border-t border-line bg-navy py-[72px] text-center text-white"
      aria-labelledby="contact-heading"
    >
      <Container>
        <h2 id="contact-heading" className="text-3xl font-bold tracking-tight sm:text-[34px]">
          Book your free visibility check
        </h2>
        <p className="mx-auto mt-3.5 max-w-xl text-lg text-[#bbccdd]">
          Grab a 30-minute slot and we&rsquo;ll run the AI test on your clinic, then walk you
          through your three fastest visibility wins. No pitch required.
        </p>

        <div className="mx-auto mt-8 max-w-3xl overflow-hidden rounded-2xl bg-white p-2 shadow-[0_14px_38px_rgba(0,0,0,0.25)] sm:p-3">
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
