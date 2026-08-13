// The AI-readiness scorecard.
//
// Deliberately NOT the "free visibility check" the site sells. That one queries
// ChatGPT, Perplexity and Google for real, which needs a backend and paid API
// calls, and a human reads the results. Nothing here touches an AI engine, so
// nothing here may claim to — the page says so plainly. Overstating what a free
// tool does, on a site whose pitch is that competitors overstate, would be the
// most expensive kind of clever.
//
// What it does instead: score a business against the five factors the homepage
// already explains in "How AI decides who to recommend". Same five, same order.
// The tool and the argument reinforce each other, and the output tells someone
// which factor they are failing — which is more actionable for most prospects
// than a screenshot of an assistant not mentioning them.
//
// Scoring lives here rather than in the component so it can be reasoned about
// and tested without rendering anything.

export type Answer = "yes" | "partly" | "no";

export type Question = {
  id: string;
  factor: FactorId;
  /** Asked in the second person, answerable without a developer. */
  text: string;
  /** Shown under the question when someone isn't sure what it means. */
  help: string;
};

export type FactorId =
  | "extractable"
  | "structured"
  | "corroboration"
  | "sources"
  | "specificity";

export type Factor = {
  id: FactorId;
  name: string;
  /** Why this factor decides whether a model names you. */
  why: string;
  /** What to do when the score here is weak. */
  fix: string;
};

export const factors: Factor[] = [
  {
    id: "extractable",
    name: "It needs a sentence it can lift",
    why: "A model composing an answer looks for a passage that answers the question on its own, without the page around it.",
    fix: "Rewrite your main service pages so the first two sentences answer the question the page is about. Move the background below it, and add a real FAQ block using the questions customers actually ask.",
  },
  {
    id: "structured",
    name: "It reads your markup, not your design",
    why: "Structured data states your facts in a form a machine cannot misread. Without it, a good-looking site is close to invisible to the systems deciding who gets named.",
    fix: "Add Organization or LocalBusiness schema describing the business, and FAQPage schema on the questions you already answer visibly. Markup describing content a visitor cannot see is a guidelines violation, so the two have to match.",
  },
  {
    id: "corroboration",
    name: "It checks whether other sources agree",
    why: "Models cross-reference. When your site, your Google profile and the directories agree, confidence rises and you get named specifically. When they disagree, you get a hedge — or a competitor whose details are coherent.",
    fix: "Pick one canonical version of your name, address and phone, then make every listing match it exactly. Claim and complete your Google Business Profile first; it carries more weight than any other single source.",
  },
  {
    id: "sources",
    name: "The sources differ by industry",
    why: "The third parties a model leans on for a plastic surgeon are not the ones it leans on for a law firm. Being absent from the ones that matter in your category is invisible until you look.",
    fix: "Identify the two or three directories and review platforms that actually carry weight in your industry, then make your presence there complete and current. Reviews that name specific services matter more than star ratings.",
  },
  {
    id: "specificity",
    name: "It rewards the page that is actually specific",
    why: "Generic explanations exist everywhere, so a model can synthesise them without citing anyone. The page that gets cited holds something it cannot assemble elsewhere.",
    fix: "Add the detail only you can write — your market, your procedure, your jurisdiction, your numbers. Then keep it current: a page that has not been touched in two years reads as abandoned to both readers and crawlers.",
  },
];

export const questions: Question[] = [
  {
    id: "q1",
    factor: "extractable",
    text: "Do your main service pages answer the core question in the first two sentences?",
    help: "Before any history, philosophy, or welcome message. If a page opens with three paragraphs about your practice, there is nothing at the top for a model to lift.",
  },
  {
    id: "q2",
    factor: "extractable",
    text: "Do those pages have an FAQ section using questions customers actually ask?",
    help: "Real questions in the customer's words, not headings you wrote for search engines.",
  },
  {
    id: "q3",
    factor: "structured",
    text: "Does your site have structured data describing the business?",
    help: "JSON-LD in the page source describing who you are, what you do and where. If nobody has ever mentioned schema to you, the answer is probably no.",
  },
  {
    id: "q4",
    factor: "structured",
    text: "Do your FAQs have FAQPage schema attached to them?",
    help: "Separate from having FAQs on the page. This is the markup that makes those answers machine-readable.",
  },
  {
    id: "q5",
    factor: "corroboration",
    text: "Is your name, address and phone identical everywhere it appears online?",
    help: "Exactly identical — including whether you write Suite or Ste, and which phone number you use. Small inconsistencies are the common failure.",
  },
  {
    id: "q6",
    factor: "corroboration",
    text: "Is your Google Business Profile claimed, complete and actively maintained?",
    help: "Claimed is the low bar. Complete means categories, services, hours, photos and posts — and updated within the last few months.",
  },
  {
    id: "q7",
    factor: "sources",
    text: "Are you listed and current on the main directories for your industry?",
    help: "The ones specific to your field, not general business listings. If you cannot name them, that itself is the answer.",
  },
  {
    id: "q8",
    factor: "sources",
    text: "Do you have recent reviews that mention specific services by name?",
    help: "A review saying \"great experience\" corroborates nothing. One naming the actual service tells a model what you do.",
  },
  {
    id: "q9",
    factor: "specificity",
    text: "Does your content include detail only someone in your market could write?",
    help: "Local specifics, your own process, real numbers. The test: could a competitor two states away publish the same page unchanged?",
  },
  {
    id: "q10",
    factor: "specificity",
    text: "Have your most important pages been reviewed in the last 12 months?",
    help: "Reviewed and updated where needed — not merely still online.",
  },
];

const POINTS: Record<Answer, number> = { yes: 2, partly: 1, no: 0 };

export const MAX_SCORE = questions.length * 2;

export type FactorResult = {
  factor: Factor;
  score: number;
  max: number;
  /** Weak factors are the ones worth acting on first. */
  weak: boolean;
};

export type Result = {
  score: number;
  max: number;
  percent: number;
  band: { label: string; summary: string };
  factors: FactorResult[];
  /** Weakest first — the order someone should actually work in. */
  priorities: FactorResult[];
};

function band(percent: number): { label: string; summary: string } {
  if (percent >= 80)
    return {
      label: "Well positioned",
      summary:
        "The foundations are in place. At this level the gap between you and a citation is usually depth and consistency over time rather than anything structural — which is a much better problem to have than the alternative.",
    };
  if (percent >= 55)
    return {
      label: "Partly ready",
      summary:
        "Some of the machinery is there and some of it is missing, which typically shows up as being findable for your own name and invisible for everything else. The weakest factors below are where the return is.",
    };
  if (percent >= 30)
    return {
      label: "Significant gaps",
      summary:
        "Enough is missing that AI assistants likely have no confident basis for naming you, even where you deserve to be named. None of it is exotic to fix — it is mostly work nobody has been assigned.",
    };
  return {
    label: "Not yet legible",
    summary:
      "As things stand there is little for an assistant to read, corroborate or quote. That sounds worse than it is: almost everything on this list is fixable, and starting from here means the early gains are the largest.",
  };
}

/**
 * Score a completed set of answers.
 *
 * Unanswered questions count as zero rather than being excluded, so a partially
 * completed scorecard cannot report an inflated result.
 */
export function score(answers: Record<string, Answer | undefined>): Result {
  const byFactor = factors.map((factor) => {
    const qs = questions.filter((q) => q.factor === factor.id);
    const s = qs.reduce((sum, q) => sum + (answers[q.id] ? POINTS[answers[q.id]!] : 0), 0);
    const max = qs.length * 2;
    return { factor, score: s, max, weak: s <= max / 2 };
  });

  const total = byFactor.reduce((sum, f) => sum + f.score, 0);
  const percent = Math.round((total / MAX_SCORE) * 100);

  return {
    score: total,
    max: MAX_SCORE,
    percent,
    band: band(percent),
    factors: byFactor,
    priorities: [...byFactor].filter((f) => f.weak).sort((a, b) => a.score - b.score),
  };
}
