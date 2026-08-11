import type { Vertical } from "./types";
import { medSpas } from "./med-spas.ts";
import { personalInjuryLaw } from "./personal-injury-law.ts";

// Display order. Drives the nav, the /industries/ index, and IndustryGrid.
// Medical-adjacent verticals lead because they carry the existing content depth.
export const verticals: Vertical[] = [medSpas, personalInjuryLaw];

export function getVertical(slug: string): Vertical | undefined {
  return verticals.find((v) => v.slug === slug);
}

export function getPublishedVerticals(): Vertical[] {
  return verticals.filter((v) => v.published);
}

export function getPublishedSlugs(): string[] {
  return getPublishedVerticals().map((v) => v.slug);
}

export type { Vertical } from "./types";
