// The prompt battery (spec §02): four tiers, fifteen prompts.
//
// Tiers 1 and 2 ask whether the practice exists. Tier 3 asks whether it
// survives a head-to-head, and can only run once Tier 1 has named the
// competitors. Tier 4 asks what an AI says when someone looks the practice up
// by name — captured verbatim, because that page sells the retainer.

export const TIERS = {
  1: { name: "Discovery", headline: true },
  2: { name: "Problem-first", headline: true },
  3: { name: "Comparison", needsCompetitors: true },
  4: { name: "Branded vetting", branded: true },
};

export const prompts = [
  // Tier 1 — no brand named
  { id: "t1-best", tier: 1, template: "What's the best {{industry_noun}} in {{city}}, {{state}}?" },
  { id: "t1-top5", tier: 1, template: "Who are the top 5 {{industry_noun}}s near {{city}}?" },
  { id: "t1-providers", tier: 1, template: "I'm looking for {{service}} in {{city}}. Which providers should I consider?" },
  { id: "t1-metro", tier: 1, template: "Recommend a highly rated {{industry_noun}} in the {{metro}} area and explain why." },
  { id: "t1-reputable", tier: 1, template: "Who is the most reputable {{industry_noun}} in {{city}} for someone paying out of pocket?" },

  // Tier 2 — problem-first
  { id: "t2-problem", tier: 2, template: "{{problem_prompt}}" },
  { id: "t2-bar", tier: 2, template: "What should I look for when choosing a {{industry_noun}} in {{city}}, and who meets that bar locally?" },
  { id: "t2-cost", tier: 2, template: "How much does {{service}} cost in {{city}} and where do people go for it?" },
  { id: "t2-firsttime", tier: 2, template: "I've never done this before. Walk me through getting {{service}} in {{city}}, including who to call." },

  // Tier 3 — comparison
  { id: "t3-versus", tier: 3, template: "{{practice}} vs {{competitor_1}} — which is better for {{service}}?" },
  { id: "t3-alternatives", tier: 3, template: "What are the best alternatives to {{competitor_1}} in {{city}}?" },
  { id: "t3-worth", tier: 3, template: "Is {{practice}} worth what they charge compared to other options in {{city}}?" },

  // Tier 4 — branded vetting
  { id: "t4-about", tier: 4, template: "Tell me about {{practice}} in {{city}}. What are they known for?" },
  { id: "t4-credentials", tier: 4, template: "Is {{doctor}} at {{practice}} credentialed? What's their background and training?" },
  { id: "t4-reviews", tier: 4, template: "What do patients say about {{practice}}? Any complaints or red flags?" },
];

/**
 * Fill a template. Throws on any variable still unrendered, because a
 * misrendered variable across 135 calls "costs you nothing in money and an
 * hour in confusion" (spec §08) — better to fail before the first call.
 */
export function render(template, vars) {
  // Two passes: problem_prompt itself contains {{city}} / {{county}}.
  let out = template;
  for (let pass = 0; pass < 2; pass++) {
    out = out.replace(/\{\{(\w+)\}\}/g, (m, key) => (vars[key] != null && vars[key] !== "" ? String(vars[key]) : m));
  }
  const missing = [...out.matchAll(/\{\{(\w+)\}\}/g)].map((m) => m[1]);
  if (missing.length) throw new Error(`Unrendered variables: ${[...new Set(missing)].join(", ")} in "${template}"`);
  return out;
}

/**
 * Build the list of prompts to run for a set of tiers. Tier 4's credentials
 * prompt is skipped when no doctor name is known rather than rendered with a
 * blank — asking "Is  at X credentialed?" would produce a garbage answer that
 * still counts against the practice.
 */
export function selectPrompts({ tiers, vars }) {
  return prompts.filter((p) => {
    if (!tiers.includes(p.tier)) return false;
    if (p.id === "t4-credentials" && !vars.doctor) return false;
    return true;
  });
}

/** Every (prompt × model × run) call in a pass. */
export function buildCalls({ prompts: selected, models, runs, vars }) {
  const calls = [];
  for (const p of selected) {
    const text = render(p.template, vars);
    for (const model of models) {
      for (let run = 1; run <= runs; run++) {
        calls.push({ key: `${p.id}__${model.replace("/", "-")}__r${run}`, promptId: p.id, tier: p.tier, model, run, text });
      }
    }
  }
  return calls;
}
