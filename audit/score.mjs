// The scoring model (spec §04). Five numbers: presence rate is the headline,
// citation concentration is what the scope of work is written from.
//
// Input is the list of completed calls:
//   { call: {promptId, tier, model, run, text}, answer: {text, sources}, extraction | null }
// A call whose extraction failed is excluded from the denominators rather than
// counted as "not named" — an outage is not evidence of invisibility.

export function normalizeName(s) {
  return String(s ?? "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9 ]+/g, " ")
    .replace(/\b(the|llc|pllc|inc|pc|pa|md|do|dds|office|of)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Does a business name the model wrote refer to the audited practice? */
export function matchesPractice(name, variants) {
  const n = normalizeName(name);
  if (!n) return false;
  return variants.some((v) => {
    const nv = normalizeName(v);
    return nv && (n === nv || n.includes(nv) || nv.includes(n));
  });
}

export function domainOf(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return null;
  }
}

export function score(results, { variants, website }) {
  const ok = results.filter((r) => r.extraction);
  const inTiers = (...tiers) => ok.filter((r) => tiers.includes(r.call.tier));

  // 1. Presence rate — Tier 1 + 2 only. The cold-start number.
  const discovery = inTiers(1, 2);
  const namedIn = discovery.filter((r) => r.extraction.practice_named);
  const presence = { named: namedIn.length, total: discovery.length, rate: ratio(namedIn.length, discovery.length) };

  // Per-model and per-tier presence, for the breakdown table.
  const byModel = groupRate(discovery, (r) => r.call.model);
  const byTier = groupRate(inTiers(1, 2, 3), (r) => `Tier ${r.call.tier}`);

  // 2. Mean rank when named, Tiers 1–3.
  const ranked = inTiers(1, 2, 3).filter((r) => r.extraction.practice_named && r.extraction.rank_position);
  const meanRank = ranked.length ? round(ranked.reduce((s, r) => s + r.extraction.rank_position, 0) / ranked.length, 1) : null;
  const meanListLength = ranked.length ? round(ranked.reduce((s, r) => s + (r.extraction.total_businesses_listed || 0), 0) / ranked.length, 1) : null;

  // 3. Share of voice — practice mentions over all business mentions, Tiers 1–3.
  const mentionCounts = new Map();
  let practiceMentions = 0;
  let allMentions = 0;
  for (const r of inTiers(1, 2, 3)) {
    let practiceInList = false;
    for (const name of r.extraction.businesses_named) {
      allMentions++;
      if (matchesPractice(name, variants)) {
        practiceInList = true;
        practiceMentions++;
      } else {
        const key = normalizeName(name);
        const entry = mentionCounts.get(key) ?? { name, count: 0, runs: new Set() };
        entry.count++;
        entry.runs.add(r.call.key);
        mentionCounts.set(key, entry);
      }
    }
    if (r.extraction.practice_named && !practiceInList) {
      allMentions++;
      practiceMentions++;
    }
  }
  const competitors = [...mentionCounts.values()]
    .map((e) => ({ name: e.name, mentions: e.count, runs: e.runs.size }))
    .sort((a, b) => b.runs - a.runs || b.mentions - a.mentions);
  const shareOfVoice = { practice: practiceMentions, all: allMentions, rate: ratio(practiceMentions, allMentions) };

  // 4. Citation concentration — which domains the models actually read.
  const ownDomain = website ? domainOf(website.startsWith("http") ? website : `https://${website}`) : null;
  const domainRuns = new Map();
  let callsWithSources = 0;
  for (const r of results) {
    const domains = new Set((r.answer?.sources ?? []).map((s) => domainOf(s.url)).filter(Boolean));
    if (domains.size) callsWithSources++;
    for (const d of domains) domainRuns.set(d, (domainRuns.get(d) ?? 0) + 1);
  }
  const citations = [...domainRuns.entries()]
    .map(([domain, runs]) => ({ domain, runs, owned: ownDomain ? domain === ownDomain || domain.endsWith(`.${ownDomain}`) : false }))
    .sort((a, b) => b.runs - a.runs);
  const ownedCitations = citations.filter((c) => c.owned).reduce((s, c) => s + c.runs, 0);
  const totalCitations = citations.reduce((s, c) => s + c.runs, 0);

  // 5. Branded accuracy — Tier 4 classified, quotes attached.
  const branded = inTiers(4);
  const answerTypes = Object.fromEntries(["accurate", "vague", "wrong", "no_information"].map((t) => [t, 0]));
  for (const r of branded) answerTypes[r.extraction.answer_type]++;
  const brandedVerdict = branded.length ? dominant(answerTypes) : null;
  const quotes = branded.map((r) => ({
    promptId: r.call.promptId,
    prompt: r.call.text,
    model: r.call.model,
    run: r.call.run,
    answerType: r.extraction.answer_type,
    claim: r.extraction.claim_about_practice,
    excerpt: firstLines(r.answer?.text ?? "", 400),
  }));

  return {
    presence,
    byModel,
    byTier,
    meanRank,
    meanListLength,
    shareOfVoice,
    competitors,
    citations: { domains: citations, distinct: citations.length, owned: ownedCitations, total: totalCitations, callsWithSources, ownDomain },
    branded: { verdict: brandedVerdict, counts: answerTypes, total: branded.length, quotes },
    calls: { total: results.length, extracted: ok.length, failed: results.length - ok.length },
  };
}

/** Three most-named businesses that are not the practice — Tier 3's competitors. */
export function deriveCompetitors(results, variants, n = 3) {
  return score(results, { variants }).competitors.slice(0, n).map((c) => c.name);
}

function groupRate(rows, keyFn) {
  const groups = new Map();
  for (const r of rows) {
    const k = keyFn(r);
    const g = groups.get(k) ?? { key: k, named: 0, total: 0 };
    g.total++;
    if (r.extraction.practice_named) g.named++;
    groups.set(k, g);
  }
  return [...groups.values()].map((g) => ({ ...g, rate: ratio(g.named, g.total) }));
}

function dominant(counts) {
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
}

function ratio(a, b) {
  return b ? round(a / b, 3) : null;
}

function round(n, places) {
  const f = 10 ** places;
  return Math.round(n * f) / f;
}

function firstLines(text, max) {
  const t = text.replace(/\s+\n/g, "\n").trim();
  return t.length > max ? `${t.slice(0, max).trimEnd()}…` : t;
}
