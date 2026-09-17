// The industry lookup from the audit spec (§03). Keyed by the same slugs as
// src/lib/verticals so an intake form can reuse the site's industry list — a
// test enforces the match.
//
// Deliberately separate from the verticals' `nameSingular`. The site says
// "dermatology practice" because that is what we sell to; a patient asks an AI
// for "the best dermatologist". The audit has to speak like the patient.

export const industries = {
  "med-spas": {
    noun: "med spa",
    service: "Botox and filler",
    problem:
      "I'm in my early 40s and starting to see sagging along my jawline. What treatment should I get, and who in {{city}} does it well?",
  },
  "plastic-surgery": {
    noun: "plastic surgeon",
    service: "a mommy makeover",
    problem:
      "I'm considering a mommy makeover in {{city}}. How do I choose a surgeon, and who should I consult with?",
  },
  dermatology: {
    noun: "dermatologist",
    service: "a skin cancer screening",
    problem:
      "I have a mole that's changed shape over the past few months. Who should I see in {{city}}, and how fast?",
  },
  wellness: {
    noun: "longevity clinic",
    service: "hormone optimization",
    problem:
      "I'm exhausted all the time and want to work with a clinic that does real testing, not a supplement store. Where do I go in {{city}}?",
  },
  "concierge-medicine": {
    noun: "concierge doctor",
    service: "a concierge membership",
    problem:
      "I'm tired of 10-minute appointments and want a doctor who actually knows me. What are my options in {{city}} and what do they cost?",
  },
  "personal-injury-law": {
    noun: "personal injury lawyer",
    service: "a car accident claim",
    problem:
      "I was rear-ended in {{city}} and the other driver's insurance is lowballing me. Do I need a lawyer, and who should I call?",
  },
  "estate-law": {
    noun: "estate planning attorney",
    service: "a living trust",
    problem:
      "My father passed away in {{county}} without a will. What happens now and which attorney do I contact?",
  },
  "real-estate-teams": {
    noun: "real estate agent",
    service: "selling a luxury home",
    problem:
      "I'm selling a $1.2M home in {{city}}. Which agents or teams should I interview, and what should I ask them?",
  },
};

export function getIndustry(slug) {
  const row = industries[slug];
  if (!row) {
    throw new Error(`Unknown industry "${slug}". Known: ${Object.keys(industries).join(", ")}`);
  }
  return row;
}
