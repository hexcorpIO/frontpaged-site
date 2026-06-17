import Container from "./Container";

const engines = ["ChatGPT", "Perplexity", "Google AI Overviews", "Gemini", "Copilot"];

// Honest trust strip: the AI answer engines we optimize clients to be cited by.
export default function AiEnginesStrip() {
  return (
    <div className="border-y border-warm-line bg-cream/70 py-8">
      <Container className="flex flex-col items-center gap-5 text-center">
        <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-warm-grey">
          Built to get your clinic cited by
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-9 gap-y-3">
          {engines.map((e) => (
            <span key={e} className="font-serif text-lg font-semibold text-navy/70">
              {e}
            </span>
          ))}
        </div>
      </Container>
    </div>
  );
}
