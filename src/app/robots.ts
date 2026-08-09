import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

// Required for output: export — emit as a static file at build time.
export const dynamic = "force-static";

// AI crawlers we explicitly welcome. A wildcard Allow already permits them, but
// naming them removes any ambiguity and documents the decision: this site exists
// to be found by patients, and those patients increasingly ask an assistant
// rather than a search box. Blocking these would be self-defeating.
//
// Google-Extended is the one that matters most and is most often blocked by
// accident — it governs whether content can be used to ground Gemini and AI
// Overviews, separately from normal Googlebot indexing.
const AI_CRAWLERS = [
  "GPTBot", // OpenAI — training + ChatGPT browsing
  "OAI-SearchBot", // OpenAI — ChatGPT search index
  "ChatGPT-User", // OpenAI — live fetch when a user asks
  "PerplexityBot", // Perplexity — index
  "Perplexity-User", // Perplexity — live fetch
  "ClaudeBot", // Anthropic — index
  "Claude-User", // Anthropic — live fetch
  "Claude-SearchBot", // Anthropic — search
  "Google-Extended", // Gemini / AI Overviews grounding
  "Applebot", // Apple — Siri & Spotlight
  "Applebot-Extended", // Apple — generative models
  "Bingbot", // Microsoft — Bing & Copilot
  "CCBot", // Common Crawl — feeds many downstream models
  "meta-externalagent", // Meta AI
  "Amazonbot", // Amazon — Alexa
  "DuckAssistBot", // DuckDuckGo
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      ...AI_CRAWLERS.map((userAgent) => ({ userAgent, allow: "/" })),
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
