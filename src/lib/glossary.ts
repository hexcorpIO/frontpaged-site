// Definitional content is the single most-cited format in AI search: when someone
// asks "what is generative engine optimization", an engine needs a short, complete,
// standalone definition it can lift and attribute. Each entry below is written to
// be exactly that — a first sentence that fully answers the term, then context.
//
// Consumed by the glossary page AND its DefinedTermSet schema, so the rendered
// text and the structured data can never disagree.

export type Term = {
  slug: string;
  term: string;
  also?: string[];
  /** One or two sentences that completely define the term with no preceding context. */
  definition: string;
  /** Why it matters to a med spa specifically. */
  context: string;
  category: "AI search" | "SEO fundamentals" | "Local SEO" | "Technical" | "Content" | "Measurement";
};

export const glossary: Term[] = [
  {
    slug: "generative-engine-optimization",
    term: "Generative Engine Optimization (GEO)",
    also: ["GEO"],
    definition:
      "Generative Engine Optimization is the practice of structuring content so AI systems like ChatGPT, Perplexity, and Google AI Overviews can extract, quote, and attribute it when answering a user's question. It sits on top of traditional SEO rather than replacing it.",
    context:
      "For a med spa, GEO is what determines whether an AI assistant names your clinic when a patient asks for a Botox recommendation in your city.",
    category: "AI search",
  },
  {
    slug: "answer-engine-optimization",
    term: "Answer Engine Optimization (AEO)",
    also: ["AEO"],
    definition:
      "Answer Engine Optimization is the practice of formatting content so search and AI systems can return it as a direct answer rather than a link. In practice it means leading each section with a complete, self-contained response to a specific question.",
    context:
      "AEO and GEO overlap heavily. AEO is usually used for featured snippets and voice answers; GEO for generated AI responses. The underlying work — answer first, then detail — is the same.",
    category: "AI search",
  },
  {
    slug: "ai-overview",
    term: "AI Overview",
    definition:
      "An AI Overview is the generated summary Google displays above traditional search results, synthesized from several sources and shown with citations to each. Multiple sites can be cited in a single overview.",
    context:
      "Because overviews appear above the blue links, a practice ranking third but uncited can be less visible than one ranking lower that gets cited.",
    category: "AI search",
  },
  {
    slug: "ai-citation",
    term: "AI citation",
    definition:
      "An AI citation is a reference an AI assistant makes to a specific source when generating an answer, usually shown as a linked footnote or inline attribution. It is the AI-search equivalent of a ranking position.",
    context:
      "Citations are the practical measure of GEO success. Perplexity shows them on every answer, which makes it the easiest engine to measure your visibility on.",
    category: "AI search",
  },
  {
    slug: "answer-first-content",
    term: "Answer-first content",
    definition:
      "Answer-first content is writing that states the direct answer to a question in its opening sentence, before any context, background, or brand language. The supporting detail follows the answer rather than preceding it.",
    context:
      "It is the single highest-leverage structural change for AI citation, because engines extract passages rather than whole pages and need a self-contained one to lift.",
    category: "Content",
  },
  {
    slug: "retrieval-augmented-generation",
    term: "Retrieval-augmented generation (RAG)",
    also: ["RAG"],
    definition:
      "Retrieval-augmented generation is a technique where an AI system searches for relevant documents before generating its answer, then bases that answer on what it retrieved. It is why current web content can appear in AI responses at all.",
    context:
      "Perplexity runs retrieval on nearly every query. Understanding this is why conventional SEO still matters: if your page isn't retrieved, it can't be cited.",
    category: "AI search",
  },
  {
    slug: "llms-txt",
    term: "llms.txt",
    definition:
      "llms.txt is a plain-text file at the root of a website that gives AI systems a curated map of the site's most useful content, in the same spirit as robots.txt or sitemap.xml. It is an emerging convention rather than a formal standard.",
    context:
      "It costs nothing to publish and makes a site's structure explicit to any model that looks for it.",
    category: "Technical",
  },
  {
    slug: "schema-markup",
    term: "Schema markup",
    also: ["Structured data"],
    definition:
      "Schema markup is structured data added to a web page in a standard vocabulary that tells search engines and AI systems what the page's content means, rather than leaving them to infer it from the prose.",
    context:
      "For a med spa, it declares outright that you are a medical business, at a specific address, offering specific treatments, at specific prices.",
    category: "Technical",
  },
  {
    slug: "faq-schema",
    term: "FAQ schema",
    definition:
      "FAQ schema is structured data that marks a list of questions and their answers as machine-readable question-answer pairs. It makes the Q&A on a page explicitly extractable rather than something an engine has to detect from formatting.",
    context:
      "It is usually the first schema type a med spa should implement after the core business markup.",
    category: "Technical",
  },
  {
    slug: "e-e-a-t",
    term: "E-E-A-T",
    definition:
      "E-E-A-T stands for experience, expertise, authoritativeness, and trustworthiness — the framework Google's human quality raters use to evaluate content. It is not a single ranking factor but a set of qualities that inform how search quality is measured.",
    context:
      "Aesthetic content is held to a higher E-E-A-T standard than most categories because it affects health.",
    category: "SEO fundamentals",
  },
  {
    slug: "ymyl",
    term: "YMYL (Your Money or Your Life)",
    also: ["YMYL"],
    definition:
      "YMYL describes topics that could significantly affect a person's health, safety, financial stability, or wellbeing. Google applies stricter quality and accuracy standards to YMYL content than to other categories.",
    context:
      "Content about injectables, lasers, and medical-grade treatments is YMYL, which is why anonymous, unsourced med spa content struggles to rank.",
    category: "SEO fundamentals",
  },
  {
    slug: "entity",
    term: "Entity",
    definition:
      "An entity is a distinct, identifiable thing — a business, person, place, or concept — that a search engine understands as a single item with attributes and relationships, rather than as a string of text.",
    context:
      "Getting your practice recognized as an entity, with consistent details everywhere, is what allows an AI system to recommend you with confidence.",
    category: "SEO fundamentals",
  },
  {
    slug: "knowledge-graph",
    term: "Knowledge graph",
    definition:
      "A knowledge graph is a database of entities and the relationships between them that a search engine uses to understand the world rather than just match keywords. Google's is what powers the information panels beside search results.",
    context:
      "Consistent business information across your site, your listings, and your schema is how you get correctly represented in one.",
    category: "SEO fundamentals",
  },
  {
    slug: "map-pack",
    term: "Map pack",
    also: ["Local pack", "3-pack"],
    definition:
      "The map pack is the block of three local business listings with a map that Google shows for searches with local intent. It typically appears above the organic results.",
    context:
      "For queries like \"med spa near me\", the map pack captures the majority of clicks, which makes your Google Business Profile more valuable than your homepage for those searches.",
    category: "Local SEO",
  },
  {
    slug: "google-business-profile",
    term: "Google Business Profile",
    also: ["GBP", "Google My Business"],
    definition:
      "A Google Business Profile is the free listing that controls how a business appears in Google Maps and local search results, including its hours, services, photos, posts, and reviews.",
    context:
      "It is the single highest-leverage asset in local aesthetics, and one of the most-cited sources when AI assistants answer local questions.",
    category: "Local SEO",
  },
  {
    slug: "nap-consistency",
    term: "NAP consistency",
    definition:
      "NAP consistency means a business's name, address, and phone number appear in exactly the same form everywhere they are published online. Inconsistencies make it harder for search engines to confirm the business is a single entity.",
    context:
      "A suite number written three different ways across your site, your profile, and a directory quietly undermines everything built on top of it.",
    category: "Local SEO",
  },
  {
    slug: "local-citation",
    term: "Local citation",
    definition:
      "A local citation is any online mention of a business's name, address, and phone number, whether or not it links to the website. Directories, industry listings, and press mentions all count.",
    context:
      "Manufacturer provider-locator listings are among the most valuable and least-claimed citations available to a med spa.",
    category: "Local SEO",
  },
  {
    slug: "featured-snippet",
    term: "Featured snippet",
    also: ["Position zero"],
    definition:
      "A featured snippet is a short extract from a single web page that Google displays at the top of its results as a direct answer to a query. Unlike an AI Overview, it quotes one source rather than synthesizing several.",
    context:
      "The content structure that earns snippets is the same structure that earns AI citations, so the work serves both.",
    category: "SEO fundamentals",
  },
  {
    slug: "search-intent",
    term: "Search intent",
    definition:
      "Search intent is the underlying goal behind a query — whether the person wants to learn something, compare options, find a specific site, or make a purchase. It determines what kind of content can satisfy the search.",
    context:
      "Sorting med spa keywords by intent rather than volume is what separates terms that produce bookings from terms that produce traffic.",
    category: "SEO fundamentals",
  },
  {
    slug: "long-tail-keyword",
    term: "Long-tail keyword",
    definition:
      "A long-tail keyword is a longer, more specific search phrase with lower individual volume but usually clearer intent and less competition than a broad head term.",
    context:
      "\"Morpheus8 for jawline cost\" is long-tail; \"med spa\" is not. In aesthetics the long tail is where a new practice can realistically win.",
    category: "SEO fundamentals",
  },
  {
    slug: "topical-authority",
    term: "Topical authority",
    definition:
      "Topical authority is the degree to which a site is recognized as a comprehensive, reliable source on a particular subject, built by covering that subject thoroughly rather than superficially.",
    context:
      "A practice with fifteen interlinked pages on injectables has more topical authority than one with a single page mentioning everything.",
    category: "Content",
  },
  {
    slug: "content-cluster",
    term: "Content cluster",
    also: ["Hub and spoke", "Pillar page"],
    definition:
      "A content cluster is a group of related pages organized around one comprehensive pillar page, with the pillar and its supporting pages linking to each other. The structure signals that the pages form a coherent topic.",
    context:
      "One treatment page plus its comparison, cost, and aftercare posts is a cluster, and it outperforms the same content published in isolation.",
    category: "Content",
  },
  {
    slug: "canonical-url",
    term: "Canonical URL",
    definition:
      "A canonical URL is the version of a page that a site declares to be the authoritative one when the same content is reachable at more than one address. It tells search engines which version to index and which to ignore.",
    context:
      "Without one, a site reachable at both www and non-www addresses can split its own ranking signals between two copies.",
    category: "Technical",
  },
  {
    slug: "core-web-vitals",
    term: "Core Web Vitals",
    definition:
      "Core Web Vitals are Google's three measures of user experience: loading speed, interaction responsiveness, and visual stability. They are assessed on real visits at the 75th percentile.",
    context:
      "Med spa sites commonly fail them because of full-resolution before-and-after galleries and booking widgets loaded on every page.",
    category: "Technical",
  },
  {
    slug: "crawl-budget",
    term: "Crawl budget",
    definition:
      "Crawl budget is the number of pages a search engine will fetch from a site within a given period. It becomes a practical constraint only on large sites, where wasted crawling on low-value URLs delays discovery of important ones.",
    context:
      "Rarely a concern for a single-location med spa, but relevant for multi-location groups with hundreds of location-by-treatment pages.",
    category: "Technical",
  },
  {
    slug: "serp",
    term: "SERP",
    definition:
      "A SERP is a search engine results page — everything returned for a query, including organic links, ads, the map pack, featured snippets, and AI Overviews.",
    context:
      "Understanding which SERP features appear for your target queries matters more than raw ranking position, because features push organic results down the page.",
    category: "SEO fundamentals",
  },
  {
    slug: "impression-share",
    term: "Impressions",
    definition:
      "An impression is recorded each time a page appears in search results for a query, whether or not anyone clicks it. Impressions measure visibility; clicks measure interest.",
    context:
      "High impressions with low clicks usually indicates a title and description problem rather than a content problem, and is often a quick fix.",
    category: "Measurement",
  },
  {
    slug: "click-through-rate",
    term: "Click-through rate (CTR)",
    also: ["CTR"],
    definition:
      "Click-through rate is the percentage of people who click a result after seeing it, calculated as clicks divided by impressions.",
    context:
      "A page ranking fifth with a compelling title can out-earn a page ranking third with a generic one.",
    category: "Measurement",
  },
  {
    slug: "branded-search",
    term: "Branded search",
    definition:
      "A branded search is a query that includes a specific business's name. It usually signals that the searcher already knows the business and is looking for it directly.",
    context:
      "Rising branded search alongside flat non-branded traffic is one of the clearest available signals that AI assistants are recommending you without a click.",
    category: "Measurement",
  },
  {
    slug: "content-refresh",
    term: "Content refresh",
    definition:
      "A content refresh is a substantive update to an existing page — adding missing sections, correcting outdated facts, and restructuring for clarity — rather than publishing something new on the same topic.",
    context:
      "Refreshing a page that already ranks in positions five to twenty usually produces results faster than a new post, because the page already has ranking history.",
    category: "Content",
  },
  {
    slug: "cannibalization",
    term: "Keyword cannibalization",
    definition:
      "Keyword cannibalization occurs when two or more pages on the same site compete for the same search term, splitting their signals so neither performs as well as a single consolidated page would.",
    context:
      "Common on med spa sites that have published several overlapping posts about the same treatment over the years.",
    category: "Content",
  },
  {
    slug: "structured-answer",
    term: "Structured answer",
    definition:
      "A structured answer is a passage written so it stands alone when removed from its page — no dependency on preceding sentences, a specific claim, and appropriate hedging where certainty isn't warranted.",
    context:
      "It is the unit AI engines actually extract. Pages are retrieved; passages are cited.",
    category: "AI search",
  },
];

export const glossaryCategories = [
  "AI search",
  "Content",
  "SEO fundamentals",
  "Local SEO",
  "Technical",
  "Measurement",
] as const;
