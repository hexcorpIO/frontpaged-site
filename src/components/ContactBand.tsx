import Container from "./Container";
import Button from "./Button";
import { site } from "@/lib/site";

const subject = encodeURIComponent("Free AI-visibility check");

export default function ContactBand() {
  return (
    <section
      id="contact"
      className="border-t border-line bg-navy py-[72px] text-center text-white"
      aria-labelledby="contact-heading"
    >
      <Container>
        <h2 id="contact-heading" className="text-3xl font-bold tracking-tight sm:text-[34px]">
          See where your clinic stands — free
        </h2>
        <p className="mx-auto mt-3.5 max-w-xl text-lg text-[#bbccdd]">
          We&rsquo;ll run the AI test on your clinic and send a short breakdown of your three
          fastest visibility wins. No pitch required.
        </p>
        <div className="mt-7 flex justify-center">
          <Button href={`mailto:${site.email}?subject=${subject}`} size="lg">
            Request my free visibility check
          </Button>
        </div>
        <p className="mt-6 text-[15px] text-[#9fb6cc]">
          Or email us directly:{" "}
          <a href={`mailto:${site.email}`} className="text-white underline">
            {site.email}
          </a>
        </p>
      </Container>
    </section>
  );
}
