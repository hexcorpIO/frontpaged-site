#!/usr/bin/env node
// AI visibility audit runner.
//
//   PPLX_KEY=... node audit/run.mjs --practice "Belle Meade Aesthetics" \
//     --city Nashville --state TN --industry med-spas \
//     [--website bellemeadeaesthetics.com] [--doctor "Dr. Jane Chen"] \
//     [--variants "Belle Meade Aesthetics|Dr. Chen's office"] \
//     [--metro Nashville] [--county "Davidson County"] \
//     [--config lean|full] [--tiers 1,2,4] [--runs 2] [--models a,b] \
//     [--dry-run] [--mock] [--out audit/out] [--concurrency 3]
//
// Two passes: Tiers 1, 2 and 4 first; then Tier 3 with the competitors Tier 1
// surfaced. Every call is written to disk as it completes, and a re-run skips
// calls that already have an extraction — so a crash at call 90 of 135 costs
// nothing, and re-scoring never re-spends.

import fs from "node:fs";
import path from "node:path";
import { parseArgs } from "node:util";
import { getIndustry } from "./industries.mjs";
import { selectPrompts, buildCalls } from "./prompts.mjs";
import { makeClient, pool, sleep } from "./perplexity.mjs";
import { extract } from "./extract.mjs";
import { score, deriveCompetitors } from "./score.mjs";
import { renderReport } from "./report.mjs";
import { makeMockClient } from "./mock.mjs";

// Three cheap engines beat one expensive one: the audit measures consensus.
// IDs verified against docs.perplexity.ai on 2026-09-17.
export const CONFIGS = {
  lean: { tiers: [1, 2, 4], runs: 2, models: ["google/gemini-3.7-flash", "perplexity/sonar"] },
  full: { tiers: [1, 2, 3, 4], runs: 3, models: ["google/gemini-3.7-flash", "perplexity/sonar", "openai/gpt-5.6-luna"] },
};
const DEFAULT_EXTRACT_MODEL = "openai/gpt-5.4-mini";

const { values: a } = parseArgs({
  options: {
    practice: { type: "string" },
    city: { type: "string" },
    state: { type: "string" },
    industry: { type: "string" },
    website: { type: "string" },
    doctor: { type: "string" },
    variants: { type: "string" },
    metro: { type: "string" },
    county: { type: "string" },
    config: { type: "string", default: "lean" },
    tiers: { type: "string" },
    runs: { type: "string" },
    models: { type: "string" },
    "extract-model": { type: "string", default: process.env.EXTRACT_MODEL ?? DEFAULT_EXTRACT_MODEL },
    concurrency: { type: "string", default: "3" },
    out: { type: "string", default: "audit/out" },
    "dry-run": { type: "boolean", default: false },
    mock: { type: "boolean", default: false },
    force: { type: "boolean", default: false },
  },
});

for (const req of ["practice", "city", "state", "industry"]) {
  if (!a[req]) fail(`--${req} is required`);
}
const industry = getIndustry(a.industry);
const preset = CONFIGS[a.config] ?? fail(`--config must be one of ${Object.keys(CONFIGS).join(", ")}`);
const config = {
  tiers: a.tiers ? a.tiers.split(",").map(Number) : preset.tiers,
  runs: a.runs ? Number(a.runs) : preset.runs,
  models: a.models ? a.models.split(",").map((s) => s.trim()) : preset.models,
  extractModel: a["extract-model"],
};

const website = a.website?.replace(/^https?:\/\//, "").replace(/\/.*$/, "").toLowerCase() || null;
const variants = [a.practice, ...(a.variants ? a.variants.split("|") : [])].map((s) => s.trim()).filter(Boolean);
const vars = {
  practice: a.practice,
  city: a.city,
  state: a.state,
  metro: a.metro || a.city,
  county: a.county || `${a.city} County`,
  doctor: a.doctor || "",
  industry_noun: industry.noun,
  service: industry.service,
  problem_prompt: industry.problem,
};
const location = { country: "US", region: a.state, city: a.city };
const slug = `${a.practice}-${a.city}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const outDir = path.resolve(a.out, slug);
const callsDir = path.join(outDir, "calls");

// ---- pass 1: everything that doesn't need competitors -----------------------
const firstTiers = config.tiers.filter((t) => t !== 3);
const pass1 = buildCalls({ prompts: selectPrompts({ tiers: firstTiers, vars }), models: config.models, runs: config.runs, vars });
const tier3Prompts = config.tiers.includes(3) ? selectPrompts({ tiers: [3], vars }) : [];
const plannedTotal = pass1.length + tier3Prompts.length * config.models.length * config.runs;

console.error(`${a.practice} · ${a.city}, ${a.state} · ${a.industry}`);
console.error(`config=${a.config} tiers=${config.tiers.join(",")} runs=${config.runs} models=${config.models.join(",")}`);
console.error(`${plannedTotal} answer calls + ${plannedTotal} extraction calls → ${outDir}`);

if (a["dry-run"]) {
  const seen = new Set();
  for (const c of pass1) if (!seen.has(c.promptId) && seen.add(c.promptId)) console.log(`[T${c.tier}] ${c.text}`);
  for (const p of tier3Prompts) console.log(`[T3] ${p.template}   (after pass 1)`);
  process.exit(0);
}

const client = a.mock ? makeMockClient({ practice: a.practice, website }) : makeClient();
fs.mkdirSync(callsDir, { recursive: true });

const results1 = await runCalls(pass1);

// ---- pass 2: comparison tier, competitors interpolated ----------------------
let results2 = [];
let competitors = deriveCompetitors(results1, variants);
if (tier3Prompts.length) {
  if (!competitors.length) {
    console.error("Tier 3 skipped: pass 1 named no competitors to compare against.");
  } else {
    const vars3 = { ...vars, competitor_1: competitors[0], competitor_2: competitors[1] ?? competitors[0], competitor_3: competitors[2] ?? competitors[0] };
    results2 = await runCalls(buildCalls({ prompts: tier3Prompts, models: config.models, runs: config.runs, vars: vars3 }));
  }
}

// ---- score and write --------------------------------------------------------
const results = [...results1, ...results2];
const scores = score(results, { variants, website });
const input = { practice: a.practice, city: a.city, state: a.state, industry: a.industry, industryLabel: industry.noun, website, doctor: a.doctor || null, variants, competitors };
const reportConfig = { ...config, discoveryPrompts: new Set(results.filter((r) => [1, 2].includes(r.call.tier)).map((r) => r.call.promptId)).size };
const audit = { generatedAt: new Date().toISOString(), input, config: reportConfig, scores, calls: results.map(({ call, extraction, error }) => ({ ...call, extraction, error })) };

fs.writeFileSync(path.join(outDir, "audit.json"), JSON.stringify(audit, null, 2));
fs.writeFileSync(path.join(outDir, "report.md"), renderReport({ input, config: reportConfig, scores }));

console.error("");
console.error(`Presence ${scores.presence.named}/${scores.presence.total} · mean rank ${scores.meanRank ?? "—"} · share of voice ${fmtPct(scores.shareOfVoice.rate)} · ${scores.citations.distinct} citation domains (yours in ${scores.citations.owned}) · branded: ${scores.branded.verdict ?? "—"}`);
if (competitors.length) console.error(`Competitors: ${competitors.join(" · ")}`);
if (scores.calls.failed) console.error(`${scores.calls.failed} calls failed — see calls/*.json "error"`);
console.error(`Report: ${path.join(outDir, "report.md")}`);

// -----------------------------------------------------------------------------

async function runCalls(calls) {
  let done = 0;
  const results = await pool(calls, Number(a.concurrency), async (call) => {
    const file = path.join(callsDir, `${call.key}.json`);
    if (!a.force && fs.existsSync(file)) {
      const cached = JSON.parse(fs.readFileSync(file, "utf8"));
      if (cached.extraction) {
        progress(++done, calls.length, call, "cached");
        return cached;
      }
    }
    const record = { call, answer: null, extraction: null, error: null, at: new Date().toISOString() };
    try {
      const answer = await client.ask({ model: call.model, input: call.text, location });
      record.answer = { text: answer.text, sources: answer.sources, model: answer.model, usage: answer.usage };
      if (!answer.text) throw new Error(`empty answer (status ${answer.status})`);
      record.extraction = await extract(client, { model: config.extractModel, text: answer.text, variants });
    } catch (err) {
      record.error = String(err.message ?? err);
    }
    fs.writeFileSync(file, JSON.stringify(record, null, 2));
    progress(++done, calls.length, call, record.error ? `FAILED ${record.error.slice(0, 80)}` : record.extraction.practice_named ? "named" : "not named");
    if (!a.mock) await sleep(250);
    return record;
  });
  return results;
}

function progress(n, total, call, note) {
  console.error(`  [${String(n).padStart(3)}/${total}] T${call.tier} ${call.promptId} ${call.model} r${call.run} — ${note}`);
}

function fmtPct(r) {
  return r == null ? "—" : `${Math.round(r * 100)}%`;
}

function fail(msg) {
  console.error(`error: ${msg}`);
  process.exit(1);
}
