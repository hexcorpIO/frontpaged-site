# AI visibility audit

Runs the prompt battery from the build spec against real AI engines and writes
a scored, sourced report. Nothing here touches the site — it is a CLI that a
form → Make.com → email wrapper can call later, once a report has been shown
to convert.

```bash
export PPLX_KEY=pplx-...

# Cheapest possible first run: one prompt tier, one model, one run. Prove the
# variables render and the API answers before spending on a full battery.
pnpm visibility --practice "Belle Meade Aesthetics" --city Nashville --state TN \
  --industry med-spas --tiers 1 --runs 1 --models perplexity/sonar

# Lean config (spec §07): tiers 1, 2 and 4 · 2 runs · 2 engines · ~48 calls
pnpm visibility --practice "Belle Meade Aesthetics" --city Nashville --state TN \
  --industry med-spas --website bellemeadeaesthetics.com \
  --doctor "Dr. Jane Chen" --variants "Dr. Chen's office|Belle Meade Med Spa"

# Full config: all four tiers · 3 runs · 3 engines · 135 calls · ~8 min
pnpm visibility ... --config full
```

Output lands in `audit/out/<practice>-<city>/`:

| File | What |
|---|---|
| `report.md` | The prospect-facing report. Convert to PDF with whatever you like. |
| `audit.json` | Every score, every call, every extraction. The Make/Sheets log row comes from here. |
| `calls/*.json` | One file per API call: raw answer, sources, extraction. Re-running skips any call that already has one, so a crash mid-audit costs nothing and re-scoring is free. Pass `--force` to re-query. |

`--dry-run` prints the rendered prompts and the call count and exits without
touching the network. `--mock` runs the whole pipeline against a fake client —
use it to work on scoring or the report without a key.

## Options

| Flag | Default | |
|---|---|---|
| `--practice --city --state --industry` | required | Industry is a slug from [industries.mjs](industries.mjs) — the same eight as `src/lib/verticals`. |
| `--website` | — | Needed for the owned-vs-third-party citation split. |
| `--doctor` | — | Without it the credentials prompt is skipped rather than rendered with a blank. |
| `--variants` | — | `\|`-separated. Legal name, DBA, "Dr. Smith's office". Under-collecting these is the one error a prospect can catch. |
| `--metro`, `--county` | city / "City County" | People ask about "Nashville", not "Brentwood". |
| `--config` | `lean` | `lean` or `full`. `--tiers`, `--runs`, `--models` override individually. |
| `--extract-model` | `openai/gpt-5.4-mini` | The temperature-0 reader. Also `EXTRACT_MODEL` env. |
| `--concurrency` | 3 | Parallel calls. Raise once you know your rate limit. |

## How it works

1. **Pass 1** renders Tiers 1, 2 and 4 from the form fields and runs every
   prompt × model × run through the Perplexity Agent API with `web_search`
   on and the practice's city as `user_location`.
2. Each answer goes to a second, cheap model at temperature 0 with the name
   variants and the extraction schema (spec §06). No string matching: models
   write "Dr. Chen's practice" and "the Belle Meade location".
3. The three businesses named most often in pass 1 become `competitor_1..3`,
   and **pass 2** runs Tier 3 with them interpolated.
4. [score.mjs](score.mjs) computes the five numbers (spec §04);
   [report.mjs](report.mjs) renders them. Failed calls are excluded from
   every denominator — an outage is not evidence of invisibility.

## Things the spec got wrong, fixed here

- The §06 payload had no `tools` array. Web search is **off** by default on
  the Agent API, so as written every answer would have been ungrounded with
  no citations — and the citation-concentration metric empty.
- Model IDs, endpoint, response shape and the 27 Sep 2026 Sonar sunset were
  verified against docs.perplexity.ai on 2026-09-17.

## Cost

API cost per audit is under a dollar on either config — the answer calls
dominate, and the three engines chosen are the cheap end of each provider's
range. There is no Make.com op budget to manage because the loop is here.
