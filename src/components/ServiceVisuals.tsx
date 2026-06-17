import { SearchIcon, SparkleIcon, CheckIcon, PinIcon } from "./Icons";

const cardShell =
  "rounded-2xl border border-warm-line bg-white p-5 shadow-[0_24px_60px_rgba(21,38,63,0.12)] sm:p-6";

// SEO — a search-results mock with a map pack and an organic listing.
export function SerpMock() {
  return (
    <div className={cardShell}>
      <div className="flex items-center gap-2 rounded-full border border-warm-line bg-cream/60 px-4 py-2.5 text-[14px] text-warm-grey">
        <SearchIcon className="h-4 w-4 text-teal-dark" />
        best med spa near me
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-warm-line">
        <div className="relative h-20 bg-gradient-to-br from-[#dfeeee] to-[#cfe3e3]">
          <span className="absolute left-6 top-7 h-3 w-3 rounded-full bg-teal ring-4 ring-teal/20" />
          <span className="absolute left-1/2 top-5 h-2.5 w-2.5 rounded-full bg-navy/40" />
          <span className="absolute right-10 top-10 h-2.5 w-2.5 rounded-full bg-navy/40" />
        </div>
        <ul className="divide-y divide-warm-line">
          <li className="flex items-center justify-between gap-3 bg-soft px-4 py-3">
            <div>
              <p className="text-[14.5px] font-semibold text-navy">Your Med Spa</p>
              <p className="text-[12px] text-warm-grey">
                <span className="text-gold">★★★★★</span> 4.9 (214) · Medical spa
              </p>
            </div>
            <span className="rounded-full bg-teal px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
              #1
            </span>
          </li>
          <li className="px-4 py-3">
            <p className="text-[14px] text-navy/70">[Competitor A]</p>
            <p className="text-[12px] text-warm-grey">
              <span className="text-gold">★★★★☆</span> 4.4 (88)
            </p>
          </li>
        </ul>
      </div>

      <div className="mt-4">
        <p className="text-[12px] text-warm-grey">yourmedspa.com › botox</p>
        <p className="text-[15px] font-semibold text-teal-dark">Botox &amp; Fillers — Your Med Spa</p>
        <p className="mt-0.5 text-[12.5px] leading-snug text-warm-grey">
          Natural-looking results from expert injectors. Book your consultation today…
        </p>
      </div>
    </div>
  );
}

// GEO — an AI assistant answer that names the clinic first.
export function GeoAnswerMock() {
  return (
    <div className={cardShell}>
      <div className="flex items-center gap-2.5 border-b border-warm-line pb-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-navy text-teal">
          <SparkleIcon className="h-4 w-4" />
        </span>
        <p className="text-[13px] font-semibold text-navy">AI answer</p>
        <span className="ml-auto truncate text-[12px] text-warm-grey">
          &ldquo;best med spa for Botox near me&rdquo;
        </span>
      </div>
      <p className="mt-4 text-[15px] leading-relaxed text-ink">
        A few clinics stand out for natural-looking results and strong reviews:
      </p>
      <ul className="mt-3 space-y-2.5">
        <li className="flex items-start gap-2.5 rounded-xl border-2 border-teal bg-soft p-3">
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal text-white">
            <CheckIcon className="h-3.5 w-3.5" />
          </span>
          <span className="text-[14.5px] text-navy">
            <span className="font-semibold">Your Clinic</span> — known for subtle, natural injectables
            and 5-star patient reviews.
          </span>
        </li>
        <li className="flex items-start gap-2.5 px-3 text-[14px] text-warm-grey">
          <span>•</span> [Competitor A]
        </li>
        <li className="flex items-start gap-2.5 px-3 text-[14px] text-warm-grey">
          <span>•</span> [Competitor B]
        </li>
      </ul>
      <div className="mt-4 flex flex-wrap gap-1.5 border-t border-warm-line pt-3">
        {["ChatGPT", "Perplexity", "Google AI Overviews"].map((e) => (
          <span
            key={e}
            className="rounded-full border border-warm-line bg-cream px-2.5 py-1 text-[11px] font-medium text-teal-dark"
          >
            {e}
          </span>
        ))}
      </div>
    </div>
  );
}

// GBP — a Google Business Profile card sitting at the top of the map pack.
export function GbpMock() {
  return (
    <div className={cardShell}>
      <div className="grid grid-cols-3 gap-1.5 overflow-hidden rounded-xl">
        <div className="h-20 bg-gradient-to-br from-[#dfeeee] to-[#cfe3e3]" />
        <div className="h-20 bg-gradient-to-br from-[#f1ebe1] to-[#e7ded1]" />
        <div className="h-20 bg-gradient-to-br from-[#e7eef0] to-[#d7e3e6]" />
      </div>
      <div className="mt-4">
        <p className="font-serif text-[20px] font-semibold text-navy">Your Med Spa</p>
        <p className="mt-1 flex flex-wrap items-center gap-1.5 text-[13px] text-warm-grey">
          <span className="font-semibold text-navy">4.9</span>
          <span className="text-gold">★★★★★</span>
          <span>(214)</span>
          <span aria-hidden="true">·</span>
          <span>Medical spa</span>
        </p>
        <p className="mt-1 text-[13px]">
          <span className="font-semibold text-[#1a7f5a]">Open</span>{" "}
          <span className="text-warm-grey">· Closes 6 PM · Botox, fillers, laser</span>
        </p>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {["Directions", "Call", "Website", "Book"].map((a, i) => (
          <span
            key={a}
            className={`rounded-full px-3.5 py-1.5 text-[12px] font-semibold ${
              i === 3 ? "bg-teal text-white" : "border border-warm-line text-navy"
            }`}
          >
            {a}
          </span>
        ))}
      </div>
      <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-soft px-3 py-1.5 text-[12px] font-semibold text-teal-dark">
        <PinIcon className="h-4 w-4" /> Top of the local map pack
      </div>
    </div>
  );
}
