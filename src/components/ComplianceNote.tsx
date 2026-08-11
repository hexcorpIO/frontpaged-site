import type { ComplianceProfile } from "@/lib/verticals/types";

// Friendly label per regime, for the section heading only — never rendered as
// a legal claim, just a category name.
const regimeLabel: Record<ComplianceProfile["regime"], string> = {
  medical: "medical marketing",
  legal: "attorney advertising",
  "real-estate": "real estate advertising",
};

// Trust section: what governs the content we write, what we refuse to write,
// and the disclaimers required for this vertical. All three render as visible
// page text — a disclaimer that only exists in markup (a `title` or
// `aria-label`) does not satisfy a bar rule.
export default function ComplianceNote({ profile }: { profile: ComplianceProfile }) {
  return (
    <section
      aria-labelledby="compliance-heading"
      className="mt-14 rounded-2xl border border-warm-line bg-cream p-8"
    >
      <h2
        id="compliance-heading"
        className="font-serif text-[22px] font-semibold text-navy"
      >
        How we handle {regimeLabel[profile.regime]}
      </h2>
      <p className="mt-3 text-[15.5px] leading-[1.7] text-warm-grey">{profile.summary}</p>

      <h3 className="mt-6 text-[13px] font-semibold uppercase tracking-[0.14em] text-teal-dark">
        We will not
      </h3>
      <ul className="mt-3 space-y-2">
        {profile.weWillNot.map((item) => (
          <li
            key={item}
            className="relative pl-5 text-[14.5px] leading-[1.6] text-warm-grey before:absolute before:left-0 before:content-['—']"
          >
            {item}
          </li>
        ))}
      </ul>

      <div className="mt-6 space-y-1.5 border-t border-warm-line pt-5">
        {profile.requiredDisclaimers.map((d) => (
          <p key={d} className="text-[13px] leading-[1.6] text-warm-grey">
            {d}
          </p>
        ))}
      </div>
    </section>
  );
}
