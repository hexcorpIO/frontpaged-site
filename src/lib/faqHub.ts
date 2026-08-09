// The consolidated answer hub. These questions are deliberately distinct from the
// ones on /pricing/ and /contact/ — duplicating FAQ markup across pages splits
// signals and is exactly the cannibalization we advise clients against.
//
// Every answer is written to survive extraction: it opens with the answer, states
// something specific, and hedges only where hedging is honest.

export type HubFaq = { q: string; a: string };
export type HubSection = { id: string; heading: string; blurb: string; faqs: HubFaq[] };

export const faqHub: HubSection[] = [
  {
    id: "ai-search",
    heading: "AI search & GEO",
    blurb: "How AI assistants decide which clinics to recommend, and what changes that.",
    faqs: [
      {
        q: "How do AI assistants decide which med spa to recommend?",
        a: "AI assistants favour practices whose expertise is described clearly and consistently across their own website, their Google Business Profile, review platforms, and third-party directories. The model needs a passage it can quote and corroboration from more than one source before it will name a business confidently.",
      },
      {
        q: "Why does ChatGPT recommend my competitors instead of me?",
        a: "Almost always because their content answers patient questions directly and yours describes services in brochure language. A page that says results \"vary by individual\" gives a model nothing to extract, while a competitor stating \"Botox typically lasts three to four months\" gives it a citable sentence.",
      },
      {
        q: "Is GEO different from SEO, or just a rebrand?",
        a: "It's an additional layer, not a replacement. GEO depends on traditional SEO because AI engines mostly retrieve from pages that already rank well. What GEO adds is structure — answer-first formatting, self-contained passages, and unambiguous schema — that determines whether a ranking page actually gets quoted.",
      },
      {
        q: "Can I pay to appear in AI search results?",
        a: "No. There is no advertising placement inside ChatGPT or Perplexity answers, and AI Overviews are generated from organic sources. Visibility in generated answers is earned through content and corroboration, which is genuinely good news for practices willing to do the work.",
      },
      {
        q: "Do AI assistants give everyone the same answer?",
        a: "No. Responses vary with phrasing, location, conversation history, and model version, and the same question asked twice can return different sources. This is why AI visibility is tracked as a pattern across a fixed question list over time rather than judged from a single answer.",
      },
      {
        q: "Should I block AI crawlers from my website?",
        a: "For a med spa, almost certainly not. Blocking GPTBot, PerplexityBot, or Google-Extended removes you from the systems patients increasingly use to choose a provider. Blocking makes sense for publishers whose product is the content itself; it is self-defeating for a business whose content exists to attract patients.",
      },
    ],
  },
  {
    id: "results",
    heading: "Results & timelines",
    blurb: "What actually happens, and when — including the parts that take longer than anyone wants.",
    faqs: [
      {
        q: "How long before I see results from med spa SEO?",
        a: "Local improvements from Google Business Profile work often appear within four to eight weeks. Content-driven ranking generally takes three to six months, and AI citation typically lags content publication by two to four months. Meaningful compounding usually starts around month six.",
      },
      {
        q: "What does month one actually produce?",
        a: "A Foundation Sprint: your highest-value service page rebuilt, FAQ schema deployed, your Google Business Profile overhauled, a baseline AI visibility report, and a 90-day content calendar. Month one is deliberately the most concrete month, because early SEO otherwise looks like nothing happening.",
      },
      {
        q: "Do you guarantee first-page rankings?",
        a: "No, and you should be wary of anyone who does — Google controls the algorithm and no agency can promise a position. We guarantee something we do control: if you're not cited by at least one AI engine for a target question within 90 days, month four is free.",
      },
      {
        q: "What happens if I stop after three months?",
        a: "The pages we built stay live and keep working, but the compounding stops. SEO and GEO reward consistency, so three months of content followed by nothing typically plateaus rather than continuing to climb. Practices that stay six months or longer see disproportionately better returns.",
      },
      {
        q: "How will I know whether this is working?",
        a: "Three things, reported monthly: your position for target keywords, a tracked list of questions run across ChatGPT, Perplexity, and Google showing where you're cited, and the traffic and consultation requests attributable to the pages we've built. If those aren't moving by month four, we'll tell you.",
      },
    ],
  },
  {
    id: "working-together",
    heading: "Working with us",
    blurb: "What we need from you, and what you can hand over entirely.",
    faqs: [
      {
        q: "How much of my time does this take?",
        a: "Two to three hours a month from someone who can answer clinical questions and approve content. That's the realistic figure, and it's the constraint most likely to slow a project down — programs stall at approval far more often than they stall at strategy.",
      },
      {
        q: "Do I have to write anything?",
        a: "No. It's fully done-for-you. We draft everything, you review it for clinical accuracy, and we publish. What we do need from you is access to someone who can confirm that what we've written about your treatments is correct.",
      },
      {
        q: "Who writes the content, and is it AI-generated?",
        a: "We use AI to research and draft, and every piece is edited and fact-checked by a human before it reaches you. Publishing unreviewed AI content in a health-adjacent category risks both clinical inaccuracy and search penalties, so nothing goes live without a human pass and your approval.",
      },
      {
        q: "Do you need access to my website?",
        a: "Ideally yes — editor-level access lets us implement changes directly, which is faster and avoids errors in translation. If your site is managed by another party we can deliver everything as ready-to-implement files and instructions instead.",
      },
      {
        q: "Will you work with my existing marketing agency?",
        a: "Yes. We frequently work alongside agencies handling paid ads, social media, or web design, since our work doesn't overlap with theirs. What we ask for is a clear division of who owns the website content, so two parties aren't editing the same pages.",
      },
      {
        q: "Do you work with med spas outside your area?",
        a: "We work with medical spas across the United States. Everything we do is remote — content, schema, Google Business Profile management, and AI visibility work require no physical presence — so your location changes nothing about how we work together.",
      },
      {
        q: "Will you work with a competitor in my market?",
        a: "No. We take one practice per market so we're never optimizing two clinics against each other for the same searches. If your market is already taken we'll say so on the first call rather than after you've signed.",
      },
    ],
  },
  {
    id: "scope",
    heading: "What's included",
    blurb: "The specific deliverables, and the things we deliberately don't do.",
    faqs: [
      {
        q: "What's actually included in a monthly retainer?",
        a: "GEO/SEO articles, optimized service pages, FAQ and business schema markup, Google Business Profile posts and management, and a monthly visibility report covering both traditional rankings and AI citations. Higher tiers add neighborhood-level targeting, refreshes of existing pages, and strategy calls.",
      },
      {
        q: "Do you manage Google Ads or paid social?",
        a: "No. We work exclusively on organic search and AI-search visibility. There's no ad budget inside your retainer and no media markup, which also means nothing we build disappears the moment you stop paying.",
      },
      {
        q: "Do you build websites?",
        a: "We don't do full site builds, but we rebuild the pages that matter for search — service pages, FAQ sections, and location pages — inside your existing site. If your platform genuinely can't support the technical work, we'll tell you plainly rather than working around it.",
      },
      {
        q: "Do you handle reviews?",
        a: "We build the process and the templates for requesting reviews, and we advise on responding to them, but we never write or solicit fake reviews. Review text mentioning specific treatments is one of the strongest local and AI signals available, and it only works if it's genuine.",
      },
      {
        q: "Can you fix a Google Business Profile suspension?",
        a: "Often, yes, depending on the cause. Suspensions usually trace to an address issue, a category problem, or a policy violation in the profile's content. We'll diagnose it during the audit and tell you honestly whether reinstatement is likely.",
      },
    ],
  },
  {
    id: "content-compliance",
    heading: "Content & compliance",
    blurb: "How we keep medical-adjacent marketing accurate and defensible.",
    faqs: [
      {
        q: "Is the content medically responsible?",
        a: "Yes. Everything is written to reflect your providers' expertise and reviewed for accuracy before publication. We never make medical guarantees, promise specific outcomes, or publish claims that create regulatory exposure — beyond the ethics, that kind of copy also performs badly in a YMYL category.",
      },
      {
        q: "Can you publish before-and-after photos for us?",
        a: "We'll optimize and caption them, but you must hold a signed, treatment-specific photographic release for every image, obtained separately from your treatment consent. We'll also strip EXIF metadata before publishing, since it can carry dates and location.",
      },
      {
        q: "Will you name our providers in the content?",
        a: "We'd strongly encourage it. Attributing clinical content to a named provider with a visible credential is one of the highest-value, lowest-effort trust signals available, and AI assistants weight source attribution heavily on health topics. A simple \"clinically reviewed by\" line is enough.",
      },
      {
        q: "Do you publish pricing on our behalf?",
        a: "We recommend publishing a range or a starting figure, because cost is among the most-searched aspects of every treatment and pages that dodge it lose both visitors and citations. You decide the numbers; we'll advise on how to frame them without committing you to a fixed price.",
      },
    ],
  },
];

/** Flattened, for the FAQPage schema on the hub. */
export const allHubFaqs: HubFaq[] = faqHub.flatMap((s) => s.faqs);
