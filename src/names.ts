// The entry @johnmorrisdotca/hata/names: each flag's place by name, in English or Japanese, as Kuni names it, and
// the flag's aspect ratio. Data only, kept out of the main entry: <hata-flag> loads it for the name it reads aloud.

import { FLAG_ALIASES } from "./data/aliases.data";
import { ALPHA3, NUMERIC } from "./data/codes3.data";
import { NAMES } from "./data/names.data";
import { mustBeString } from "./svg";

/**
 * The languages a flag's place is named in.
 *
 * @example
 * ```ts no-run
 * import { flagName, type NameLanguage } from "@johnmorrisdotca/hata/names";
 *
 * const lang: NameLanguage = navigator.language.startsWith("ja") ? "ja" : "en";
 * console.log(flagName("JP-13", lang));
 * ```
 */
type NameLanguage = "en" | "ja";

const codeOf = (code: string): string => {
  const written = mustBeString(code, "code").trim().toUpperCase().replace(/_/g, "-");

  return FLAG_ALIASES[written] ?? written;
};

/**
 * The name of a flag's place, in English or Japanese, as Kuni gives it: what a screen reader should say for the
 * flag, or a caption. Any language tag that starts with `ja` is Japanese; anything else is English.
 *
 * @param code - A flag's code, in any case: "JP", "jp-13", "CA-ON".
 * @param lang - `"en"` (the default), `"ja"`, or a language tag such as `"ja-JP"` or `"en-GB"`.
 * @returns The name, or `null` when the code has no flag here.
 * @throws TypeError when `code` is not a string.
 *
 * @example
 * ```ts
 * import { flagName } from "@johnmorrisdotca/hata/names";
 *
 * console.log(flagName("JP-13"));        // "Tokyo"
 * console.log(flagName("jp-13", "ja"));  // "東京都"
 * console.log(flagName("DE-BY", "ja-JP")); // "バイエルン自由州"
 * console.log(flagName("URS"));          // "Soviet Union"
 * console.log(flagName("XX"));           // null
 * ```
 */
const flagName = (code: string, lang: string = "en"): string | null => {
  const found = NAMES[codeOf(code)];
  if (found === undefined) return null;

  return /^ja\b/i.test(String(lang)) ? found[1] : found[0];
};

/**
 * A flag's width over its height, from its picture's viewBox, without loading the picture: 1.5 for Japan's 2:3,
 * 2 for Canada's 1:2. For keeping a flag's box before its picture arrives.
 *
 * @param code - A flag's code, in any case.
 * @returns The aspect ratio, or `null` when the code has no flag here.
 * @throws TypeError when `code` is not a string.
 *
 * @example
 * ```ts
 * import { flagAspect } from "@johnmorrisdotca/hata/names";
 *
 * console.log(flagAspect("CA"));    // 2
 * console.log(flagAspect("CH"));    // 1
 * ```
 */
const flagAspect = (code: string): number | null => NAMES[codeOf(code)]?.[2] ?? null;

/**
 * The code of a flag, from any code a country goes by: its ISO 3166-1 alpha-2 ("JP"), alpha-3 ("JPN") or numeric ("392",
 * "004" or "4") code, a subdivision's ISO 3166-2 code ("JP-13"), or a former country's code or alias ("URS"), in any case
 * and with an underscore for the hyphen. The alpha-3 and numeric codes are Kuni's, for the countries that have a flag; a
 * code that two places held ("CS") finds nothing, as with `flagCode`. It lives here, not in the main entry, because the
 * two tables of codes are data.
 *
 * @param input - A code of a place, as above.
 * @returns The code as this package writes it (`"JP"`, `"JP-13"`, `"SUHH"`), or `null` when it is no code of a place that has a flag here.
 * @throws TypeError when `input` is not a string.
 *
 * @example
 * ```ts
 * import { findFlagCode } from "@johnmorrisdotca/hata/names";
 *
 * console.log(findFlagCode("jpn"));   // "JP"
 * console.log(findFlagCode("392"));   // "JP"
 * console.log(findFlagCode("004"));   // "AF"
 * console.log(findFlagCode("ca_on")); // "CA-ON"
 * console.log(findFlagCode("URS"));   // "SUHH"
 * console.log(findFlagCode("XXX"));   // null
 * ```
 */
const findFlagCode = (input: string): string | null => {
  const written = mustBeString(input, "code").trim().toUpperCase().replace(/_/g, "-");
  const own = codeOf(written);
  if (NAMES[own] !== undefined) return own;

  return ALPHA3[written] ?? (/^\d{1,3}$/.test(written) ? NUMERIC[written.padStart(3, "0")] : undefined) ?? null;
};

export { findFlagCode, flagAspect, flagName };
export type { NameLanguage };
