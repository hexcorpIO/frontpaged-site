// Markdown report. Rendered from the scored audit, nothing else — so the JSON
// on disk and the document a prospect reads can never disagree.
//
// The footnote about API-vs-app answers is not optional (spec §08): an API call
// with web search has no memory and no personalisation, and it retrieves
// differently from the ChatGPT app on a patient's phone. Saying so reads as
// expertise, and it is the natural upsell into a real-surface check.

export function renderReport({ input, config, scores, generatedAt = new Date() }) {
  const { presence, byModel, byTier, meanRank, meanListLength, shareOfVoice, competitors, citations, branded, calls } = scores;
  const pct = (r) => (r == null ? "—" : `${Math.round(r * 100)}%`);
  const date = generatedAt.toISOString().slice(0, 10);
  const lines = [];

  lines.push(`# AI visibility audit — ${input.practice}`);
  lines.push("");
  lines.push(`${input.city}, ${input.state} · ${input.industryLabel} · ${date}`);
  lines.push("");
  lines.push(`## Your practice appeared in ${presence.named} of ${presence.total} AI searches`);
  lines.push("");
  lines.push(
    `We asked ${config.models.length} AI engines ${config.discoveryPrompts} questions a prospective ${input.audienceNoun ?? "customer"} in ${input.city} might ask — ` +
      `each ${config.runs} time${config.runs === 1 ? "" : "s"}, because AI answers vary from one run to the next. ` +
      `${input.practice} was named in **${pct(presence.rate)}** of those answers.`,
  );
  lines.push("");

  lines.push("## The five numbers");
  lines.push("");
  lines.push("| Metric | Result | What it means |");
  lines.push("|---|---|---|");
  lines.push(`| Presence rate | **${presence.named}/${presence.total}** (${pct(presence.rate)}) | How often you were named when nobody typed your name. |`);
  lines.push(`| Mean rank | ${meanRank ?? "—"}${meanListLength ? ` of ${meanListLength} listed` : ""} | Your average position when you *were* named. Seventh of eight is nearly absent. |`);
  lines.push(`| Share of voice | ${pct(shareOfVoice.rate)} | Your mentions over every business mentioned (${shareOfVoice.practice} of ${shareOfVoice.all}). |`);
  lines.push(`| Citation concentration | ${citations.distinct} domains; yours cited in ${citations.owned} of ${calls.total} answers | Where the engines got their information. |`);
  lines.push(`| Branded accuracy | ${branded.verdict ? label(branded.verdict) : "—"} | What AI says when someone looks you up by name. |`);
  lines.push("");

  if (byModel.length > 1) {
    lines.push("### By engine");
    lines.push("");
    lines.push("| Engine | Named | Rate |");
    lines.push("|---|---|---|");
    for (const m of byModel) lines.push(`| ${m.key} | ${m.named}/${m.total} | ${pct(m.rate)} |`);
    lines.push("");
  }
  if (byTier.length > 1) {
    lines.push("### By question type");
    lines.push("");
    lines.push("| Questions | Named | Rate |");
    lines.push("|---|---|---|");
    for (const t of byTier) lines.push(`| ${t.key} — ${tierLabel(t.key)} | ${t.named}/${t.total} | ${pct(t.rate)} |`);
    lines.push("");
  }

  lines.push("## Who the engines named instead");
  lines.push("");
  if (competitors.length) {
    lines.push("| Business | Answers naming them | Total mentions |");
    lines.push("|---|---|---|");
    for (const c of competitors.slice(0, 10)) lines.push(`| ${c.name} | ${c.runs} | ${c.mentions} |`);
  } else {
    lines.push("_No competing businesses were named._");
  }
  lines.push("");

  lines.push("## Where the engines got their information");
  lines.push("");
  lines.push(`${citations.callsWithSources} of ${calls.total} answers cited sources. The domains cited most often:`);
  lines.push("");
  lines.push("| Domain | Answers citing it | |");
  lines.push("|---|---|---|");
  for (const d of citations.domains.slice(0, 12)) lines.push(`| ${d.domain} | ${d.runs} | ${d.owned ? "**yours**" : ""} |`);
  lines.push("");
  if (citations.ownDomain && citations.owned === 0) {
    lines.push(`> Not one answer cited **${citations.ownDomain}**. Everything the engines said about this market came from third-party sites.`);
    lines.push("");
  }

  lines.push("## What AI says when someone looks you up by name");
  lines.push("");
  if (branded.total) {
    const c = branded.counts;
    lines.push(`Across ${branded.total} branded checks: ${c.accurate} accurate · ${c.vague} vague · ${c.wrong} wrong · ${c.no_information} no information.`);
    lines.push("");
    for (const q of pickQuotes(branded.quotes)) {
      lines.push(`**Asked:** _${q.prompt}_ (${q.model})`);
      lines.push("");
      lines.push(`> ${(q.claim ?? q.excerpt).trim().replace(/\n+/g, "\n> ")}`);
      lines.push("");
      lines.push(`_Classified: ${label(q.answerType)}_`);
      lines.push("");
    }
  } else {
    lines.push("_Branded checks were not run in this configuration._");
    lines.push("");
  }

  lines.push("---");
  lines.push("");
  lines.push("### How this was measured");
  lines.push("");
  lines.push(
    `${calls.total} queries across ${config.models.join(", ")} via the Perplexity Agent API with live web search and a ${input.city}, ${input.state} user location, ` +
      `${config.runs} run${config.runs === 1 ? "" : "s"} per question per engine. Mentions were read from each answer by a separate model given the practice's name variants (${input.variants.join("; ")}), not by string matching.` +
      (calls.failed ? ` ${calls.failed} of ${calls.total} calls failed and are excluded from every rate.` : ""),
  );
  lines.push("");
  lines.push(
    "**A note on method.** These are API answers with web search, not the consumer ChatGPT or Gemini apps. The apps add memory and personalisation and retrieve somewhat differently, so an individual patient's answer will vary. " +
      "The pattern across many runs is what this report measures — and it is the same pattern the apps draw on.",
  );
  lines.push("");
  return lines.join("\n");
}

function label(t) {
  return { accurate: "Accurate", vague: "Vague", wrong: "Wrong", no_information: "No information" }[t] ?? t;
}

function tierLabel(key) {
  return { "Tier 1": "open recommendation", "Tier 2": "describing a problem", "Tier 3": "comparing against a competitor" }[key] ?? "";
}

/** One quote per prompt: prefer the worst classification, since that is the page they forward. */
function pickQuotes(quotes) {
  const severity = { wrong: 0, no_information: 1, vague: 2, accurate: 3 };
  const byPrompt = new Map();
  for (const q of quotes) {
    const cur = byPrompt.get(q.promptId);
    if (!cur || severity[q.answerType] < severity[cur.answerType]) byPrompt.set(q.promptId, q);
  }
  return [...byPrompt.values()];
}
