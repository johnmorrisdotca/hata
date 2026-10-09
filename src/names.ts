// The entry @johnmorrisdotca/hata/names: each flag's place by name, in English or Japanese, as Kuni names it, and
// the flag's aspect ratio. Data only, kept out of the main entry: <hata-flag> loads it for the name it reads aloud.

import { NAMES } from "./data/names.data";
import { mustBeString } from "./svg";

/**
 * The languages a flag's place is named in.
 *
 * @example
 * ```ts
 * import { flagName, type NameLanguage } from "@johnmorrisdotca/hata/names";
 *
 * const lang: NameLanguage = navigator.language.startsWith("ja") ? "ja" : "en";
 * flagName("JP-13", lang);
 * ```
 */
type NameLanguage = "en" | "ja";

const codeOf = (code: string): string => mustBeString(code, "code").trim().toUpperCase().replace(/_/g, "-");

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
 * flagName("JP-13");        // "Tokyo"
 * flagName("jp-13", "ja");  // "東京都"
 * flagName("DE-BY", "ja-JP"); // "バイエルン自由州"
 * flagName("XX");           // null
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
 * flagAspect("CA");    // 2
 * flagAspect("CH");    // 1
 * ```
 */
const flagAspect = (code: string): number | null => NAMES[codeOf(code)]?.[2] ?? null;

export { flagAspect, flagName };
export type { NameLanguage };
