// The places this package draws a flag for, from Kuni: every country, then the first level of the countries in
// SUBDIVISION_COUNTRIES, each with its English and Japanese name.

import { country, COUNTRY_CODES } from "@johnmorrisdotca/kuni";
import { subdivisions } from "@johnmorrisdotca/kuni/subdivisions";

import { SUBDIVISION_COUNTRIES } from "./data-config.ts";

type Group = "country" | "jp" | "ca" | "us";

interface Place {
  code: string; // "JP", "JP-13"
  group: Group;
  en: string;
  ja: string | null;
}

const places = (): Place[] => [
  ...COUNTRY_CODES.map((code): Place => {
    const one = country(code)!;
    return { code, group: "country", en: one.name.en, ja: one.name.ja };
  }),
  ...SUBDIVISION_COUNTRIES.flatMap((code) =>
    (subdivisions(code) ?? []).filter((one) => one.level === 1).map((one): Place => ({ code: one.code, group: code.toLowerCase() as Group, en: one.name.en, ja: one.name.ja })),
  ),
];

export { places };
export type { Group, Place };
