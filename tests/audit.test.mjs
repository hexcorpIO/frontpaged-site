import test from "node:test";
import assert from "node:assert/strict";
import { verticals } from "../src/lib/verticals/index.ts";
import { industries } from "../audit/industries.mjs";
import { prompts, render, selectPrompts, buildCalls } from "../audit/prompts.mjs";
import { parseResponse } from "../audit/perplexity.mjs";
import { parseExtraction, normalize } from "../audit/extract.mjs";
import { score, deriveCompetitors, matchesPractice } from "../audit/score.mjs";
import { renderReport } from "../audit/report.mjs";

const vars = {
  practice: "Belle Meade Aesthetics",
  city: "Nashville",
  state: "TN",
  metro: "Nashville",
  county: "Davidson County",
  doctor: "Dr. Jane Chen",
  industry_noun: "med spa",
  service: "Botox and filler",
  problem_prompt: industries["med-spas"].problem,
};

test("audit industries cover exactly the site's verticals", () => {
  assert.deepEqual(Object.keys(industries).sort(), verticals.map((v) => v.slug).sort());
});

test("the battery is fifteen prompts across four tiers", () => {
  assert.equal(prompts.length, 15);
  assert.deepEqual(
    [1, 2, 3, 4].map((t) => prompts.filter((p) => p.tier === t).length),
    [5, 4, 3, 3],
  );
});

test("render fills nested variables and refuses to leave one blank", () => {
  const out = render("{{problem_prompt}}", vars);
  assert.match(out, /in Nashville does it well/);
  assert.doesNotMatch(out, /\{\{/);
  assert.throws(() => render("{{practice}} vs {{competitor_1}}", vars), /competitor_1/);
});

test("every tier 1, 2 and 4 prompt renders from form fields alone", () => {
  for (const p of selectPrompts({ tiers: [1, 2, 4], vars })) assert.doesNotThrow(() => render(p.template, vars), p.id);
});

test("the credentials prompt is dropped when no doctor is known", () => {
  const ids = selectPrompts({ tiers: [4], vars: { ...vars, doctor: "" } }).map((p) => p.id);
  assert.deepEqual(ids, ["t4-about", "t4-reviews"]);
});

test("full config is 135 calls", () => {
  const models = ["a/x", "b/y", "c/z"];
  const first = buildCalls({ prompts: selectPrompts({ tiers: [1, 2, 4], vars }), models, runs: 3, vars });
  const third = buildCalls({ prompts: selectPrompts({ tiers: [3], vars }), models, runs: 3, vars: { ...vars, competitor_1: "Rival" } });
  assert.equal(first.length + third.length, 135);
  assert.equal(new Set([...first, ...third].map((c) => c.key)).size, 135, "call keys are unique");
});

test("parseResponse flattens the Agent API output array", () => {
  const raw = {
    model: "perplexity/sonar",
    status: "completed",
    output: [
      { type: "search_results", queries: ["q"], results: [{ url: "https://www.yelp.com/a", title: "A", snippet: "s" }, { url: "https://www.yelp.com/a", title: "dup" }] },
      { type: "message", content: [{ type: "output_text", text: "Hello " }, { type: "output_text", text: "world" }] },
    ],
  };
  const r = parseResponse(raw);
  assert.equal(r.text, "Hello \nworld");
  assert.equal(r.sources.length, 1);
  assert.equal(r.model, "perplexity/sonar");
});

test("parseExtraction tolerates fences and normalises fields", () => {
  const e = parseExtraction('```json\n{"practice_named": true, "rank_position": "2", "businesses_named": ["A", " B "], "answer_type": "nonsense"}\n```');
  assert.equal(e.rank_position, 2);
  assert.deepEqual(e.businesses_named, ["A", "B"]);
  assert.equal(e.answer_type, "vague");
  assert.equal(normalize({ practice_named: false }).answer_type, "no_information");
  assert.equal(normalize({ practice_named: false, rank_position: 3 }).rank_position, null);
});

test("matchesPractice handles variants and noise", () => {
  const variants = ["Belle Meade Aesthetics", "Dr. Chen's office"];
  assert.ok(matchesPractice("Belle Meade Aesthetics, LLC", variants));
  assert.ok(matchesPractice("Dr. Chen's Office", variants));
  assert.ok(!matchesPractice("Green Hills Dermatology", variants));
  assert.ok(!matchesPractice("", variants));
});

function fakeResult(tier, { named, rank = null, list = [], sources = [], answerType, claim = null, run = 1, model = "m/a", promptId = `t${tier}-p` }) {
  return {
    call: { key: `${promptId}-${model}-${run}`, promptId, tier, model, run, text: "q" },
    answer: { text: "answer text", sources: sources.map((url) => ({ url })) },
    extraction: named == null ? null : normalize({ practice_named: named, rank_position: rank, businesses_named: list, total_businesses_listed: list.length, answer_type: answerType, claim_about_practice: claim }),
  };
}

const variants = ["Belle Meade Aesthetics"];
const sample = [
  fakeResult(1, { named: true, rank: 2, list: ["Rival A", "Belle Meade Aesthetics", "Rival B"], sources: ["https://www.yelp.com/x", "https://bellemeadeaesthetics.com/about"] }),
  fakeResult(1, { named: false, list: ["Rival A", "Rival B"], sources: ["https://yelp.com/y"], run: 2 }),
  fakeResult(2, { named: false, list: ["Rival A"], sources: ["https://realself.com/z"] }),
  fakeResult(2, { named: null, run: 2 }), // failed extraction
  fakeResult(3, { named: true, rank: 1, list: ["Belle Meade Aesthetics", "Rival A"] }),
  fakeResult(4, { named: false, answerType: "no_information", claim: "I don't have specific information about this practice." }),
];

test("score computes the five metrics", () => {
  const s = score(sample, { variants, website: "https://www.bellemeadeaesthetics.com/" });
  assert.deepEqual(s.presence, { named: 1, total: 3, rate: 0.333 }, "failed call excluded from denominator");
  assert.equal(s.meanRank, 1.5);
  assert.equal(s.shareOfVoice.practice, 2);
  assert.equal(s.shareOfVoice.all, 8);
  assert.deepEqual(s.competitors.map((c) => c.name), ["Rival A", "Rival B"]);
  assert.equal(s.citations.ownDomain, "bellemeadeaesthetics.com");
  assert.equal(s.citations.owned, 1);
  assert.equal(s.citations.domains[0].domain, "yelp.com");
  assert.equal(s.citations.domains[0].runs, 2);
  assert.equal(s.branded.verdict, "no_information");
  assert.equal(s.calls.failed, 1);
});

test("deriveCompetitors never returns the practice itself", () => {
  const c = deriveCompetitors(sample, variants);
  assert.ok(!c.some((n) => matchesPractice(n, variants)));
  assert.equal(c[0], "Rival A");
});

test("report carries the headline, the quote and the method note", () => {
  const scores = score(sample, { variants, website: "bellemeadeaesthetics.com" });
  const md = renderReport({
    input: { practice: "Belle Meade Aesthetics", city: "Nashville", state: "TN", industryLabel: "med spa", variants, audienceNoun: "patient" },
    config: { models: ["m/a"], runs: 1, discoveryPrompts: 2 },
    scores,
  });
  assert.match(md, /appeared in 1 of 3 AI searches/);
  assert.match(md, /> I don't have specific information about this practice\./);
  assert.match(md, /A note on method/);
  assert.match(md, /yelp\.com \| 2/);
});
