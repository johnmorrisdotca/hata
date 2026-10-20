// The places this package draws a flag for, from Kuni: every country, then the first level of the countries in
// SUBDIVISION_COUNTRIES, each with its English and Japanese name; and last, the former countries (HISTORICAL), which are Hata's own.

import { country, COUNTRY_CODES } from "@johnmorrisdotca/kuni";
import { subdivisions } from "@johnmorrisdotca/kuni/subdivisions";

import { HISTORICAL, SUBDIVISION_COUNTRIES } from "./data-config.ts";

// "country", or the subdivisions' country code in lower case: "jp", "ca", "us", "au", "gb", "de", "fr", "ch", "at", "br", or "historical" for a former country.
type Group = string;

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
    (subdivisions(code) ?? []).filter((one) => one.level === 1).map((one): Place => ({ code: one.code, group: code.toLowerCase(), en: one.name.en, ja: one.name.ja })),
  ),
  // The former countries are Hata's own list: Kuni knows the countries of today.
  ...Object.entries(HISTORICAL).map(([code, spec]): Place => ({ code, group: "historical", en: spec.en, ja: spec.ja })),
];

export { places };
export type { Group, Place };
