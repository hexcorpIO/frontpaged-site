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
import { cosmeticDentistry } from "./cosmetic-dentistry.ts";
import { familyLaw } from "./family-law.ts";
import { wealthManagement } from "./wealth-management.ts";
import { construction } from "./construction.ts";
import { architecture } from "./architecture.ts";
import { interiorDesign } from "./interior-design.ts";

// Display order. Drives the nav, the /industries/ index, and IndustryGrid.
// Medical-adjacent verticals lead because they carry the existing content depth;
// each later vertical sits beside its nearest relative (dentistry with the
// medical group, family law and wealth management beside estate law), and the
// building trades close the list.
export const verticals: Vertical[] = [
  medSpas,
  plasticSurgery,
  dermatology,
  wellness,
  conciergeMedicine,
  cosmeticDentistry,
  personalInjuryLaw,
  familyLaw,
  estateLaw,
  wealthManagement,
  realEstateTeams,
  construction,
  architecture,
  interiorDesign,
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
