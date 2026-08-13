import type { Heading } from "@/lib/blog";

// In-post table of contents.
//
// Two jobs, and the second is the reason it exists on this site specifically.
//
// For readers: posts here run 1,000–1,800 words across roughly eight sections,
// which is past the point where scrolling to find one answer is reasonable.
//
// For extraction: a linked heading structure is what search engines surface as
// "jump to" links beneath a result, and it gives an AI assistant an explicit map
// of what the page answers rather than making it infer sections from prose. We
// sell answer-first structure — a page of ours with no navigable structure would
// be an odd advertisement for it.
//
// Rendered as plain anchors: no JavaScript, works before hydration, and the
// browser handles smooth scrolling via CSS.

export default function TableOfContents({ headings }: { headings: Heading[] }) {
  // Below four sections a contents list is noise — the reader can see the whole
  // page by scrolling once.
  if (headings.length < 4) return null;

  return (
    <nav
      aria-labelledby="toc-heading"
      className="my-9 rounded-2xl border border-line bg-cream p-6 sm:p-7"
    >
      <h2
        id="toc-heading"
        className="text-[11px] font-semibold uppercase tracking-[0.14em] text-teal"
      >
        On this page
      </h2>
      <ol className="mt-4 space-y-2.5">
        {headings.map((h, i) => (
          <li key={h.id} className="flex gap-3 text-[15.5px] leading-[1.5]">
            <span aria-hidden="true" className="tabular-nums text-warm-grey/60">
              {String(i + 1).padStart(2, "0")}
            </span>
            <a
              href={`#${h.id}`}
              data-track-id={`toc-${h.id}`}
              data-track-type="toc"
              className="text-ink hover:text-teal hover:underline underline-offset-2"
            >
              {h.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
