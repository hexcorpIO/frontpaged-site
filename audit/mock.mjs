// A stand-in for the Perplexity client, so the whole pipeline can be exercised
// with no key and no spend. Deterministic per call key.

import { normalizeName } from "./score.mjs";

const RIVALS = ["Green Hills Dermatology", "Music City Med Spa", "Franklin Skin & Laser", "12South Aesthetics"];

function hash(s) {
  let h = 2166136261;
  for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return h >>> 0;
}

export function makeMockClient({ practice, website }) {
  return {
    async ask({ model, input }) {
      const h = hash(model + input);
      const named = h % 3 === 0;
      const list = RIVALS.slice(0, 3 + (h % 3));
      if (named) list.splice(1 + (h % 3), 0, practice);
      const branded = input.includes(practice) && !input.includes(" vs ") && !input.includes("alternatives");
      const text = branded
        ? h % 2
          ? `I don't have specific information about ${practice}. You may want to check their website or reviews on Google and Yelp before booking.`
          : `${practice} is a provider in the area. Patients describe the staff as friendly, though I couldn't find detail on the clinicians' credentials.`
        : `Here are some well-regarded options:\n\n${list.map((n, i) => `${i + 1}. **${n}** — highly rated on Google and RealSelf.`).join("\n")}\n\nConsider consultations with two or three before deciding.`;
      const sources = [
        { url: "https://www.yelp.com/search?find_desc=med+spa", title: "Top 10 Best Med Spas", snippet: "" },
        { url: "https://www.realself.com/find/tn/nashville", title: "Nashville providers", snippet: "" },
        { url: `https://www.${RIVALS[h % RIVALS.length].toLowerCase().replace(/[^a-z]+/g, "")}.com/`, title: "Home", snippet: "" },
      ];
      if (named && website && h % 4 === 0) sources.push({ url: `https://${website}/about`, title: "About us", snippet: "" });
      return { text, sources, model, usage: null, status: "completed", raw: { mock: true } };
    },
    async complete({ input }) {
      // Reads the mock answer the same way the real extractor would.
      const body = (input.split('"""')[1] ?? "").trim();
      const names = [...body.matchAll(/\d+\. \*\*(.+?)\*\*/g)].map((m) => m[1]);
      const namedIdx = names.findIndex((n) => normalizeName(n) === normalizeName(practice));
      const brandedNoInfo = body.includes("don't have specific information");
      const brandedVague = body.includes("friendly");
      const out = {
        practice_named: namedIdx >= 0 || brandedVague,
        name_form_used: namedIdx >= 0 || brandedVague ? practice : null,
        rank_position: namedIdx >= 0 ? namedIdx + 1 : null,
        total_businesses_listed: names.length || (brandedVague ? 1 : 0),
        businesses_named: names.length ? names : brandedVague ? [practice] : [],
        sentiment: namedIdx >= 0 ? "positive" : brandedVague ? "neutral" : "none",
        claim_about_practice: brandedNoInfo ? body.split(".")[0] + "." : brandedVague ? body.split(".")[1]?.trim() + "." : null,
        answer_type: brandedNoInfo ? "no_information" : brandedVague ? "vague" : namedIdx >= 0 ? "accurate" : "no_information",
      };
      return { text: JSON.stringify(out), sources: [], model: "mock", usage: null, status: "completed", raw: {} };
    },
  };
}
