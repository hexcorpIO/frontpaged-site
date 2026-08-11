import type { SourceRef } from "@/lib/verticals/types";

// The third-party sources AI engines actually pull from in this category.
//
// These lived in the vertical record with no consumer, which made them
// invisible to the reader and to the engines. Rendered, they do two jobs at
// once: they tell a prospect exactly which profiles decide whether an engine
// names them, and they give the page outbound links to the recognised entities
// of its own category — the same entity-linking argument src/components/JsonLd.tsx
// makes for `knowsAbout`, applied to the sources rather than the topics.
export default function CitationSources({
  sources,
  audienceNoun,
  clientNoun,
}: {
  sources: SourceRef[];
  audienceNoun: string;
  clientNoun: string;
}) {
  if (sources.length === 0) return null;

  return (
    <section
      aria-labelledby="citations-heading"
      className="border-t border-warm-line py-14 sm:py-16"
    >
      <h2
        id="citations-heading"
        className="font-serif text-[28px] font-semibold leading-[1.15] tracking-tight text-navy sm:text-[34px]"
      >
        Where AI engines look in this category
      </h2>
      <p className="mt-3 max-w-[760px] text-[16px] leading-[1.7] text-warm-grey">
        When an engine answers a question from {audienceNoun} in this category, these are the
        third-party sources it leans on most. We align what they say about your {clientNoun} with
        what your own site says, so the engine sees one consistent entity instead of several
        competing ones.
      </p>
      <ul className="mt-6 flex flex-wrap gap-2.5">
        {sources.map((s) => (
          <li key={s.url}>
            <a
              href={s.url}
              rel="nofollow noopener"
              className="inline-block rounded-full border border-warm-line bg-cream px-4 py-2 text-[14px] font-medium text-teal-dark transition duration-200 hover:border-teal"
            >
              {s.label}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
