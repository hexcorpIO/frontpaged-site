import type { Vertical } from "./types";

// These two imports keep the .ts extension on purpose. node --test's native TS
// stripping erases type-only imports before resolution runs, but these are
// value imports, so Node's ESM resolver has to find a real file for the bare
// specifier — and a bare "./med-spas" fails with ERR_MODULE_NOT_FOUND. The
// extension is what makes `pnpm test` work; `allowImportingTsExtensions` in
// tsconfig.json is what makes `tsc` accept it. Removing either breaks the
// suite. New record imports in this file need the same extension.
import { medSpas } from "./med-spas.ts";
import { plasticSurgery } from "./plastic-surgery.ts";
import { dermatology } from "./dermatology.ts";
import { wellness } from "./wellness.ts";
import { conciergeMedicine } from "./concierge-medicine.ts";
import { personalInjuryLaw } from "./personal-injury-law.ts";
import { estateLaw } from "./estate-law.ts";
import { realEstateTeams } from "./real-estate-teams.ts";

// Display order. Drives the nav, the /industries/ index, and IndustryGrid.
// Medical-adjacent verticals lead because they carry the existing content depth.
export const verticals: Vertical[] = [
  medSpas,
  plasticSurgery,
  dermatology,
  wellness,
  conciergeMedicine,
  personalInjuryLaw,
  estateLaw,
  realEstateTeams,
];

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
