// Structured extraction (spec §05 module 9, §06 schema).
//
// String matching does not work here: models write "Dr. Chen's practice" and
// "the Belle Meade location", and a search for the practice name finds
// neither. A cheap model reads the answer with the name variants in hand and
// returns the schema below. Temperature 0, no search.

export const SCHEMA_EXAMPLE = {
  practice_named: true,
  name_form_used: "Dr. Chen's practice",
  rank_position: 4,
  total_businesses_listed: 6,
  businesses_named: ["Belle Meade Aesthetics", "..."],
  sentiment: "neutral",
  claim_about_practice: "verbatim sentence, or null",
  answer_type: "accurate | vague | wrong | no_information",
};

export const ANSWER_TYPES = ["accurate", "vague", "wrong", "no_information"];
export const SENTIMENTS = ["positive", "neutral", "negative", "none"];

export function buildInstructions(variants) {
  return [
    "You are extracting structured data from an AI assistant's answer.",
    `The practice being audited may be referred to by any of these names: ${variants.map((v) => JSON.stringify(v)).join(", ")}.`,
    "Return only JSON matching this shape, with no prose and no code fence:",
    JSON.stringify(SCHEMA_EXAMPLE, null, 2),
    "",
    "Rules:",
    "- practice_named: true only if the answer refers to the audited practice (under any of its names). Do not infer anything not present in the text.",
    "- name_form_used: the exact wording the answer used for the practice, or null.",
    "- rank_position: 1-based position of the practice among the businesses the answer names, in the order named. null if not named.",
    "- total_businesses_listed: how many distinct businesses/providers/professionals the answer names.",
    "- businesses_named: every distinct business, practice, firm, clinic or named professional in the answer, in order, as written. Include the audited practice if named. Exclude review sites, directories and generic advice.",
    "- sentiment: the answer's tone toward the audited practice — positive, neutral, negative, or none if not named.",
    "- claim_about_practice: the single most specific sentence the answer makes about the audited practice, verbatim, or null.",
    "- answer_type: judge only the answer's treatment of the audited practice. accurate = specific, checkable facts about it; vague = mentions it but says nothing specific; wrong = states something that contradicts the known facts given, or confuses it with another business; no_information = the answer says it lacks information about the practice, or does not mention it.",
  ].join("\n");
}

/** Parse the model's JSON, tolerating a stray code fence or leading prose. */
export function parseExtraction(text) {
  const cleaned = String(text ?? "").replace(/```(?:json)?/gi, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error(`No JSON object in extraction output: ${cleaned.slice(0, 120)}`);
  const obj = JSON.parse(cleaned.slice(start, end + 1));
  return normalize(obj);
}

export function normalize(obj) {
  const named = obj.practice_named === true;
  const list = Array.isArray(obj.businesses_named) ? obj.businesses_named.filter((s) => typeof s === "string" && s.trim()).map((s) => s.trim()) : [];
  const rank = named && Number.isFinite(Number(obj.rank_position)) ? Number(obj.rank_position) : null;
  return {
    practice_named: named,
    name_form_used: named && obj.name_form_used ? String(obj.name_form_used) : null,
    rank_position: rank,
    total_businesses_listed: Number.isFinite(Number(obj.total_businesses_listed)) ? Number(obj.total_businesses_listed) : list.length,
    businesses_named: list,
    sentiment: SENTIMENTS.includes(obj.sentiment) ? obj.sentiment : named ? "neutral" : "none",
    claim_about_practice: obj.claim_about_practice ? String(obj.claim_about_practice) : null,
    answer_type: ANSWER_TYPES.includes(obj.answer_type) ? obj.answer_type : named ? "vague" : "no_information",
  };
}

export async function extract(client, { model, text, variants }) {
  const res = await client.complete({
    model,
    instructions: buildInstructions(variants),
    input: `Assistant answer to extract from:\n\n"""\n${text}\n"""`,
  });
  return parseExtraction(res.text);
}
