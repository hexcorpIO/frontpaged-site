// Add-on services offered alongside the content retainers.
//
// These are deliberately NOT priced here. Ad management is usually priced against
// spend, builds are scoped per project, and hosting depends on the stack — a fixed
// number on any of them would be wrong at one end of the range or the other. Each
// page says "scoped and quoted per engagement" and routes to /contact/.
//
// Same split as the verticals: this file owns the machine-readable data (metadata,
// FAQs, schema fields), and the page composes it. Unlike the industry hubs there is
// no separate Markdown body — these pages are shorter and the structured fields
// carry them.

import type { Faq } from "./verticals/types";

export type AddOnService = {
  slug: string;
  /** Nav and headings. */
  name: string;
  /** <=60 chars. */
  metaTitle: string;
  /** 70-155 chars. */
  metaDescription: string;
  /** One line under the H1. */
  tagline: string;
  /** Answer-first block — the extraction target. 45-90 words. */
  quickAnswer: string;
  /** What the service actually is, in two or three paragraphs. */
  whatItIs: string[];
  /** Why a high-ticket local business needs it. Each is a heading + explanation. */
  whyYouNeedIt: { heading: string; body: string }[];
  /** Concrete deliverables. */
  whatWeDo: string[];
  /** The honest limitation — what this service will not fix. */
  notFor: string;
  faqs: Faq[];
  published: boolean;
};

export const addOnServices: AddOnService[] = [
  {
    slug: "google-ads",
    name: "Google Ads",
    metaTitle: "Google Ads Management",
    metaDescription:
      "Google Ads management for high-ticket local businesses — search and Local Services campaigns built to buy qualified inquiries, not clicks.",
    tagline: "Buy the searches you can't rank for yet.",
    quickAnswer:
      "Google Ads puts you at the top of results you have not earned organically, immediately, for as long as you pay. It is the fastest way to test whether a market and a message convert, and the only reliable way to appear for a contested term while the content work that will eventually rank you is still compounding.",
    whatItIs: [
      "Paid placement on Google search results, charged per click. You bid on the searches your future customers run, write the ad they see, and pay only when someone acts on it.",
      "For local service businesses the relevant surfaces are search campaigns, which appear above organic results, and in some categories Local Services Ads, which appear above those and are charged per lead rather than per click.",
      "The mechanics are simple. Almost all of the difficulty is in what you bid on, what you exclude, and where the click lands — which is where most self-managed accounts quietly lose money.",
    ],
    whyYouNeedIt: [
      {
        heading: "SEO compounds slowly. Ads do not.",
        body: "Content and authority take months to move. Ads produce inquiries the day they turn on. Running both means you are buying visibility now while building the version you will not have to rent later.",
      },
      {
        heading: "Some terms will not be won organically",
        body: "In contested categories the top organic results are held by directories, aggregators, and national operators with a decade of authority. Paid placement is the only route onto those pages in any reasonable timeframe.",
      },
      {
        heading: "It tells you what converts before you commit content to it",
        body: "An ad campaign produces real conversion data on messaging and service demand within weeks. That is a far cheaper way to test a positioning than writing six months of content around an assumption.",
      },
      {
        heading: "Your competitors are bidding on your name",
        body: "Brand-term bidding is legal and common. If someone searches your business by name and a competitor's ad sits above your listing, you are losing the one search you unambiguously earned.",
      },
    ],
    whatWeDo: [
      "Campaign structure built around intent, not just keywords",
      "Negative keyword lists maintained continuously — the single biggest source of wasted spend",
      "Landing pages that match the ad, rather than dumping traffic on a homepage",
      "Conversion tracking wired properly before spend starts",
      "Local Services Ads setup and management where the category supports it",
      "Monthly reporting on cost per qualified inquiry, not cost per click",
    ],
    notFor:
      "Ads will not fix a weak offer or a slow website. If the page the click lands on takes six seconds to load or does not answer the question the ad promised, paid traffic simply makes the leak more expensive.",
    faqs: [
      {
        q: "How much should we spend on Google Ads?",
        a: "It depends on what a customer is worth and how contested your terms are. The useful starting question is not the budget but the maximum you can profitably pay for one qualified inquiry — work backward from that, and the budget follows. We scope this before any spend commitment.",
      },
      {
        q: "Do ads help or hurt our organic rankings?",
        a: "Neither directly. Paid and organic are separate systems and running ads does not affect rankings. The indirect benefit is real though: ad data tells you which terms actually convert, which is the best possible input into deciding what content to build.",
      },
      {
        q: "Should we bid on our own business name?",
        a: "Usually yes, and it is cheap because your quality score on your own name is high. The reason is defensive — competitors can and do bid on it, and an ad above your organic listing intercepts someone who was specifically looking for you.",
      },
      {
        q: "What are Local Services Ads?",
        a: "A separate Google product that appears above regular search ads, shows a Google-screened badge in eligible categories, and charges per lead rather than per click. Availability is category-dependent, and where it exists it is often the highest-intent placement on the page.",
      },
      {
        q: "How is ad management priced?",
        a: "Scoped per engagement rather than fixed, because the work scales with spend and account complexity. A single-location practice running one campaign is a different engagement from a multi-location firm running search, Local Services, and remarketing.",
      },
    ],
    published: true,
  },

  {
    slug: "social-media-ads",
    name: "Social Media Ads",
    metaTitle: "Social Media Advertising",
    metaDescription:
      "Paid social for high-ticket local businesses — reaching people before they search, and staying visible through a long consideration cycle.",
    tagline: "Reach the people who aren't searching yet.",
    quickAnswer:
      "Paid social reaches people based on who they are rather than what they just typed. That makes it the counterpart to search: search captures existing demand, paid social creates awareness before the search happens and keeps you visible through the weeks or months a considered purchase takes.",
    whatItIs: [
      "Advertising on platforms where people are browsing rather than searching — primarily Meta's properties for most local businesses, with others relevant depending on the audience.",
      "Targeting is built on demographics, interests, behaviors, and your own customer data, rather than on a query. Nobody on these platforms is looking for you; you are interrupting them, which changes what the creative has to do.",
      "The most valuable use for most high-ticket local businesses is not cold acquisition at all. It is retargeting — staying in front of people who already visited your site and did not convert.",
    ],
    whyYouNeedIt: [
      {
        heading: "Demand exists before the search does",
        body: "Someone considering an elective procedure or a major decision thinks about it for months before they type anything into Google. Search cannot reach that person. Paid social can.",
      },
      {
        heading: "Considered purchases need repeated exposure",
        body: "A single visit rarely converts a decision worth thousands. Retargeting keeps you present across a long deliberation, which is exactly when most businesses disappear from view entirely.",
      },
      {
        heading: "It is the cheapest way to test a message",
        body: "Creative and copy can be tested at small budgets and fast cycles. What wins there tells you what to say everywhere else, including on pages and in ads that cost far more per impression.",
      },
      {
        heading: "Your existing customers are your best targeting input",
        body: "Uploading a customer list to build lookalike audiences reaches people who resemble the clients you already have, which is a far better filter than guessing at interests.",
      },
    ],
    whatWeDo: [
      "Retargeting built on properly configured tracking, set up before spend",
      "Audience building from your own customer data where privacy rules permit",
      "Creative testing at small budgets before scaling what wins",
      "Copy written for interruption rather than for search intent",
      "Sequenced campaigns that move someone from awareness to inquiry",
      "Reporting tied to inquiries, with honest attribution caveats stated",
    ],
    notFor:
      "Paid social is a poor fit for urgent, high-intent demand — someone who needs help today is searching, not scrolling. It also cannot rescue an account with no tracking in place, because retargeting depends entirely on knowing who visited.",
    faqs: [
      {
        q: "Is paid social worth it for a local business?",
        a: "For considered, high-value purchases, usually yes — particularly for retargeting. For low-value or urgent services it often is not, because the audience needing you today is searching rather than browsing. The honest answer depends on your deal size and decision cycle.",
      },
      {
        q: "Which platform should we advertise on?",
        a: "Whichever your customers actually use, which is usually fewer platforms than you expect. Spreading a modest budget across four platforms produces four underfunded campaigns. Concentrating it on one, done properly, produces something you can read and improve.",
      },
      {
        q: "What is retargeting and why does it matter so much?",
        a: "It shows ads to people who already visited your website. They are the warmest audience available — they found you and considered you — and for a purchase that takes months, staying visible through that gap is often the highest-return advertising a business can run.",
      },
      {
        q: "Do privacy rules limit what we can target?",
        a: "Yes, meaningfully, and more so in regulated categories. Platforms restrict targeting on sensitive attributes including health, and rules differ by industry and jurisdiction. We build campaigns inside those limits and flag where a targeting idea is not available.",
      },
      {
        q: "How is paid social priced?",
        a: "Scoped per engagement. Management effort scales with the number of campaigns, the creative volume, and how much testing is running, so a single retargeting campaign and a full-funnel programme are not the same engagement.",
      },
    ],
    published: true,
  },

  {
    slug: "analytics-and-tracking",
    name: "Analytics & Tracking",
    metaTitle: "Analytics & Conversion Tracking",
    metaDescription:
      "Measurement setup for high-ticket local businesses — knowing which marketing produces inquiries, not just which pages get visits.",
    tagline: "Know which marketing actually produced the inquiry.",
    quickAnswer:
      "Analytics and tracking is the work of connecting what people do on your site to the inquiries and revenue that follow. Most businesses have analytics installed and still cannot answer the only question that matters: which marketing produced last month's new clients. Fixing that is usually the highest-return work available.",
    whatItIs: [
      "Instrumenting your site so that meaningful actions — form submissions, calls, booking requests, chat starts — are recorded as conversions rather than left as anonymous page views.",
      "Connecting those conversions back to their source, so a booked consultation can be traced to the search, ad, or article that started it.",
      "Reporting built on the numbers that reflect the business, rather than on the metrics analytics tools happen to display by default.",
    ],
    whyYouNeedIt: [
      {
        heading: "Traffic is not the goal and never was",
        body: "A page can triple its visitors and produce nothing. Without conversion tracking, you cannot tell the difference between a page that attracts the right people and one that attracts anybody, and you will keep investing in the wrong one.",
      },
      {
        heading: "Phone calls are invisible by default",
        body: "For most local businesses a large share of inquiries arrive by phone, and standard analytics has no idea they happened. That means the channels driving calls look like they produce nothing, and get cut.",
      },
      {
        heading: "You cannot optimize ads without it",
        body: "Ad platforms improve by learning which clicks became customers. Without conversion data flowing back, the platform is optimizing for clicks, which is the thing you were never trying to buy.",
      },
      {
        heading: "It is the only defence against plausible reporting",
        body: "Any agency can produce a report showing rankings and sessions going up. Conversion data is what lets you check whether that translated into business, including when the agency is us.",
      },
    ],
    whatWeDo: [
      "Conversion tracking for forms, calls, bookings and chat",
      "Call tracking configured so phone inquiries attribute to their source",
      "Analytics configured to record the events that matter, not defaults",
      "Ad platform conversion feedback wired so campaigns optimize on inquiries",
      "Consent and privacy configuration appropriate to your industry",
      "A monthly report built around inquiries and their sources",
    ],
    notFor:
      "Tracking does not create demand. It tells you the truth about what you already have, and that truth is sometimes that a channel you have been funding does not work. That is the value, but it is worth being ready for it.",
    faqs: [
      {
        q: "We already have analytics installed. Isn't that enough?",
        a: "Installed and configured are different things. A default installation records page views and sessions but usually records no conversions, misses phone calls entirely, and cannot attribute an inquiry to its source. That is the gap between having data and being able to make decisions with it.",
      },
      {
        q: "How do we track phone calls?",
        a: "With call tracking numbers that route to your real line while recording which source the caller came from. It is a small monthly cost and it typically changes the picture substantially, because phone-heavy channels usually look like they produce nothing until you measure them.",
      },
      {
        q: "Does tracking create privacy or compliance obligations?",
        a: "Yes, and more so in regulated industries where the pages someone visits can themselves be sensitive. Consent handling, what data is captured, and which third parties receive it all need deliberate configuration rather than default settings.",
      },
      {
        q: "How long before tracking tells us anything useful?",
        a: "Configuration takes a short engagement; useful patterns need enough conversions to be meaningful, which for a low-volume high-value business can be a few months. That is an argument for setting it up early rather than waiting until you have a question.",
      },
      {
        q: "How is this priced?",
        a: "Typically a one-time setup engagement, scoped to the complexity of your site and the number of channels being connected, with ongoing reporting included in a retainer. We quote it once we have seen what currently exists.",
      },
    ],
    published: true,
  },

  {
    slug: "website-hosting",
    name: "Website Hosting",
    metaTitle: "Website Hosting",
    metaDescription:
      "Fast, reliable hosting for high-ticket local businesses — because page speed is a ranking factor and downtime costs inquiries.",
    tagline: "Speed and uptime are marketing infrastructure.",
    quickAnswer:
      "Hosting determines how fast your site loads and whether it is available at all. Both are marketing concerns rather than IT ones: page speed affects rankings and conversion directly, and a site that is down during business hours is losing inquiries that will not come back later.",
    whatItIs: [
      "The infrastructure your website runs on — the servers, the network that delivers pages to visitors, and the operational work of keeping both current and secure.",
      "For a marketing site, the technical decisions that matter are narrow: how quickly a page reaches someone on a phone with an average connection, whether the site stays up, and whether it is protected against the routine attacks every public site receives.",
      "Cheap shared hosting fails on the first of these consistently, which is why so many businesses have a well-designed site that scores badly on speed and cannot work out why.",
    ],
    whyYouNeedIt: [
      {
        heading: "Page speed affects both rankings and conversions",
        body: "Google measures real-world loading performance as a ranking input, and slow pages lose visitors regardless of ranking. Someone on a phone waiting for a page to render will go back to the results and pick a competitor.",
      },
      {
        heading: "Downtime is invisible and expensive",
        body: "Most businesses do not know their site was down unless a customer tells them. An outage during business hours is lost inquiries that go to whoever ranked below you, and you never see the loss.",
      },
      {
        heading: "Security problems are marketing problems",
        body: "A compromised site can be flagged in search results, blocked by browsers, or quietly filled with spam pages. Recovering ranking after that costs far more than preventing it.",
      },
      {
        heading: "The rest of the work depends on it",
        body: "Content and ads both send people to pages. If those pages are slow, every other investment underperforms in a way that is hard to attribute and easy to blame on the wrong thing.",
      },
    ],
    whatWeDo: [
      "Hosting selected and configured for real-world page speed",
      "Content delivery so pages load quickly regardless of visitor location",
      "SSL, security headers, and routine hardening",
      "Automated backups with a tested restore path",
      "Uptime monitoring with alerts that reach a human",
      "Core Web Vitals monitored as a standing metric, not a one-off audit",
    ],
    notFor:
      "Hosting cannot fix a slow site on its own. If pages carry unoptimized images or heavy third-party scripts, faster infrastructure improves the number without solving the cause — the build has to be right too.",
    faqs: [
      {
        q: "Isn't hosting just a commodity?",
        a: "The product is close to a commodity; the configuration is not. The same site on the same plan can perform very differently depending on caching, image handling, and content delivery setup. That configuration work is what separates an adequate score from a good one.",
      },
      {
        q: "How fast does a site actually need to be?",
        a: "Fast enough that a visitor on a phone on an average connection sees meaningful content quickly. Google's Core Web Vitals give concrete thresholds, and they are a reasonable target — but the practical test is whether the page feels immediate on a phone, not a lab score.",
      },
      {
        q: "What happens if the site goes down?",
        a: "With monitoring in place, an alert reaches someone and restoration begins immediately. Without it, the first notification is usually a customer, hours later. Backups matter equally — a backup nobody has ever restored from is not a backup.",
      },
      {
        q: "Can you host a site you did not build?",
        a: "Usually yes, depending on the platform it runs on. We review what exists first, because migrating a site is the right moment to fix performance problems rather than move them to a new server unchanged.",
      },
      {
        q: "How is hosting priced?",
        a: "Scoped per engagement, based on the platform, traffic, and how much ongoing operational support is included. It is typically a modest monthly cost relative to the content and advertising it supports.",
      },
    ],
    published: true,
  },

  {
    slug: "website-design-and-maintenance",
    name: "Website Design & Maintenance",
    metaTitle: "Website Design & Maintenance",
    metaDescription:
      "Websites built for high-ticket local businesses — structured so search engines can read them and visitors can act, then kept current.",
    tagline: "A site built to be found, and kept that way.",
    quickAnswer:
      "Most business websites are designed as brochures and then expected to perform as marketing assets. A site built for search is structured differently: fast, semantically clean, organized around how customers actually search, and maintained continuously rather than rebuilt every four years.",
    whatItIs: [
      "Designing and building a website whose structure serves both the visitor deciding whether to contact you and the search engines and AI assistants deciding whether to surface you.",
      "In practice that means clean semantic markup, a page structure that matches search intent, fast rendering, accessible interaction, and structured data that describes the business accurately.",
      "Maintenance is the part almost everyone skips — keeping the platform current, fixing what breaks, and adding pages as the business changes, rather than letting the site decay until a rebuild feels necessary.",
    ],
    whyYouNeedIt: [
      {
        heading: "Design and findability are the same problem",
        body: "A beautiful site that buries its content in images, loads slowly, and has no clear page structure will not rank. The constraints that make a site legible to a search engine largely overlap with the ones that make it usable.",
      },
      {
        heading: "Content needs somewhere to live",
        body: "A content programme produces pages, and those pages need a structure to slot into. Sites built as five-page brochures have nowhere to put a growing library, which is why content on them so often ends up in an unstructured blog nobody can navigate.",
      },
      {
        heading: "Rebuilds are expensive; decay is avoidable",
        body: "The four-year rebuild cycle exists because nobody maintained the site in between. Continuous maintenance costs less in total and avoids the ranking disruption a full rebuild frequently causes.",
      },
      {
        heading: "AI assistants read structure, not design",
        body: "An assistant deciding whether to cite you is parsing markup, headings, and structured data. A site that looks impressive and is structurally incoherent is invisible to that process.",
      },
    ],
    whatWeDo: [
      "Site architecture organized around how customers search",
      "Semantic HTML with correct heading structure and landmarks",
      "Structured data describing the business accurately",
      "Performance budgeted during the build rather than fixed afterward",
      "Accessible interaction patterns, keyboard included",
      "Ongoing maintenance — updates, fixes, and new pages as the business changes",
    ],
    notFor:
      "A new site will not by itself produce rankings. It removes the technical obstacles and gives content somewhere to live, but the visibility comes from what gets published on it afterward. A rebuild with no content plan behind it is a redecoration.",
    faqs: [
      {
        q: "Do we need a new website or just better content?",
        a: "Usually content, unless the site is genuinely blocking you — very slow, unstructured, or impossible to add pages to. The honest answer requires looking at what exists. Rebuilding a site that works is an expensive way to avoid the harder work of publishing.",
      },
      {
        q: "Will a rebuild hurt our existing rankings?",
        a: "It can, and this is where most rebuilds go wrong. URLs change without redirects, content gets cut, and the site loses ground it took years to gain. Done carefully — with a URL map and redirects in place before launch — the risk is manageable.",
      },
      {
        q: "What platform do you build on?",
        a: "Whatever suits the business and the people who will maintain it. The important properties are speed, clean markup, and the ability to add pages without a developer. The platform matters far less than whether those three hold.",
      },
      {
        q: "What does maintenance actually involve?",
        a: "Platform and plugin updates, fixing things that break, adding and updating pages, monitoring performance, and periodically reviewing content that has aged. It is unglamorous and it is what prevents the decay that makes a rebuild feel necessary.",
      },
      {
        q: "How is this priced?",
        a: "Builds are scoped per project against the page count and complexity; maintenance is an ongoing monthly engagement. We quote both after reviewing what exists and what the content plan requires of it.",
      },
    ],
    published: true,
  },

  {
    slug: "marketing-automation",
    name: "Marketing Automation",
    metaTitle: "Marketing Automation",
    metaDescription:
      "Follow-up that runs itself — for high-ticket local businesses where the decision takes months and most inquiries go cold from silence.",
    tagline: "Most inquiries are lost to silence, not to competitors.",
    quickAnswer:
      "Marketing automation is the systematic follow-up that happens after someone inquires and before they decide. In categories where a decision takes weeks or months, most lost opportunities are not lost to a competitor — they go quiet because nobody followed up, and automation is what makes follow-up happen reliably.",
    whatItIs: [
      "Software and sequences that handle the repetitive parts of staying in contact: responding immediately to an inquiry, following up when someone does not book, reminding people about appointments, and staying present through a long decision.",
      "For a local business the highest-value automations are unglamorous. Immediate acknowledgement of an inquiry. A follow-up when a consultation is not booked. A reminder before an appointment. A check-in afterward. A review request at the right moment.",
      "It is not mass email. The sequences that work in high-ticket local services are short, specific, and read as though a person sent them — because in the best implementations, a person wrote them once and the system delivers them.",
    ],
    whyYouNeedIt: [
      {
        heading: "Speed of response decides more than message quality",
        body: "An inquiry answered within minutes is dramatically more likely to convert than one answered the next day, because the person is still in the moment that prompted them to reach out. Automation guarantees the first response regardless of who is at the desk.",
      },
      {
        heading: "Long decisions need presence, and people forget",
        body: "Someone considering a significant purchase for three months will not be top of mind for your team the whole time. A sequence keeps you present without anyone having to remember.",
      },
      {
        heading: "Manual follow-up fails predictably",
        body: "It works when things are quiet and stops when things are busy — which is exactly when the inquiry volume is highest. Automation is the difference between a process and an intention.",
      },
      {
        heading: "Reviews and repeat business depend on timing",
        body: "The moment someone is most likely to leave a review is narrow and easy to miss. Asking automatically at the right point produces a steady flow rather than sporadic bursts after someone remembers.",
      },
    ],
    whatWeDo: [
      "Immediate inquiry acknowledgement, so nobody waits for a human",
      "Nurture sequences matched to your actual decision cycle",
      "Appointment reminders that reduce no-shows",
      "Review requests timed to the point of highest goodwill",
      "Re-engagement for inquiries that went quiet",
      "Sequences written to sound like your practice, then measured and revised",
    ],
    notFor:
      "Automation amplifies whatever process you already have. If the underlying follow-up is generic or the offer is unclear, automating it produces more of that, faster. It also cannot replace the human conversation that closes a high-value engagement.",
    faqs: [
      {
        q: "Won't automated messages feel impersonal?",
        a: "They do when they are written that way. Short, specific messages that reference what the person actually inquired about read as attentive rather than automated. The failure mode is generic templated marketing, which is a writing problem rather than a technology one.",
      },
      {
        q: "What is the single highest-value automation?",
        a: "Immediate response to a new inquiry. The window in which someone is still engaged with the decision they just made is short, and a reply that arrives within minutes rather than the next business day changes conversion more than almost anything else on this list.",
      },
      {
        q: "Does this apply in regulated industries?",
        a: "Yes, with care. Message content is subject to the same advertising rules as any other communication, and in healthcare, patient information in automated messages raises privacy obligations. Sequences need to be written and configured with those constraints in place.",
      },
      {
        q: "What software do you use?",
        a: "Whatever fits the business and integrates with the systems already in use — practice management, CRM, booking. The tool matters much less than whether the sequences are written well and whether anyone reviews what they are producing.",
      },
      {
        q: "How is this priced?",
        a: "A setup engagement to build the sequences and integrations, then ongoing management if you want them measured and revised. Scoped per engagement, since the work depends heavily on what systems already exist.",
      },
    ],
    published: true,
  },
];

export function getAddOnService(slug: string): AddOnService | undefined {
  return addOnServices.find((s) => s.slug === slug);
}

export function getPublishedAddOnServices(): AddOnService[] {
  return addOnServices.filter((s) => s.published);
}

export function getPublishedAddOnSlugs(): string[] {
  return getPublishedAddOnServices().map((s) => s.slug);
}
