// Thin client for the Perplexity Agent API (POST /v1/agent). One key covers
// every engine: GPT, Gemini, Sonar and the rest sit behind one request shape.
//
// Two things the build spec's payload got wrong, verified against the docs on
// 2026-09-17:
//   - web search is OFF unless `tools: [{type: "web_search"}]` is sent. Without
//     it the model answers from memory with no citations, and the
//     citation-concentration metric is empty.
//   - `user_location` on the tool is what makes "best med spa near me"-style
//     retrieval behave like a local user's, so it is always sent.
//
// The legacy Sonar chat-completions endpoint retires 2026-09-27. Nothing here
// touches it.

const ENDPOINT = "https://api.perplexity.ai/v1/agent";

export function makeClient({ apiKey = process.env.PPLX_KEY, fetchImpl = globalThis.fetch, maxRetries = 4 } = {}) {
  if (!apiKey) throw new Error("PPLX_KEY is not set");

  async function post(body) {
    let attempt = 0;
    for (;;) {
      const res = await fetchImpl(ENDPOINT, {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) return res.json();
      const retryable = res.status === 429 || res.status >= 500;
      const text = await res.text().catch(() => "");
      if (!retryable || attempt >= maxRetries) {
        throw new Error(`Perplexity ${res.status}: ${text.slice(0, 300)}`);
      }
      attempt++;
      await sleep(Math.min(30_000, 1000 * 2 ** attempt));
    }
  }

  /** A grounded answer: what the model says to a prospect's question. */
  async function ask({ model, input, location, maxOutputTokens = 900 }) {
    const raw = await post({
      model,
      input,
      max_output_tokens: maxOutputTokens,
      stream: false,
      tools: [
        {
          type: "web_search",
          search_context_size: "medium",
          ...(location ? { user_location: location } : {}),
        },
      ],
    });
    return { ...parseResponse(raw), raw };
  }

  /** A deterministic reading of text. No search, temperature 0. */
  async function complete({ model, instructions, input, maxOutputTokens = 600 }) {
    const raw = await post({ model, instructions, input, max_output_tokens: maxOutputTokens, temperature: 0, stream: false });
    return { ...parseResponse(raw), raw };
  }

  return { ask, complete };
}

/**
 * Flatten an Agent API response to {text, sources}. Tolerant of the shape
 * drifting: message items may carry `content[]` parts or a bare `text`, and
 * search results may sit in an output item or (older shape) at the top level.
 */
export function parseResponse(raw) {
  const output = Array.isArray(raw?.output) ? raw.output : [];
  const textParts = [];
  const sources = [];
  for (const item of output) {
    if (item?.type === "message") {
      if (typeof item.text === "string") textParts.push(item.text);
      for (const part of item.content ?? []) {
        if (typeof part?.text === "string") textParts.push(part.text);
      }
    } else if (item?.type === "search_results") {
      for (const r of item.results ?? []) sources.push(pickSource(r));
    }
  }
  for (const r of raw?.search_results ?? []) sources.push(pickSource(r));
  return {
    text: textParts.join("\n").trim(),
    sources: dedupe(sources),
    model: raw?.model ?? null,
    usage: raw?.usage ?? null,
    status: raw?.status ?? null,
  };
}

function pickSource(r) {
  return { url: r?.url ?? "", title: r?.title ?? "", snippet: r?.snippet ?? "", date: r?.date ?? null };
}

function dedupe(sources) {
  const seen = new Set();
  return sources.filter((s) => s.url && !seen.has(s.url) && seen.add(s.url));
}

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Run tasks with bounded parallelism. Order of results matches input. */
export async function pool(items, limit, fn) {
  const results = new Array(items.length);
  let next = 0;
  async function worker() {
    while (next < items.length) {
      const i = next++;
      results[i] = await fn(items[i], i);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}
