// The entry @johnmorrisdotca/hata/names: each flag's place by name, in English or Japanese, as Kuni names it, and
// the flag's aspect ratio. Data only, kept out of the main entry: <hata-flag> loads it for the name it reads aloud.

import { FLAG_ALIASES } from "./data/aliases.data";
import { CODE_LOOKUP, FLAG_EMOJI, NAME_LOOKUP } from "./data/lookups.data";
import { NAMES } from "./data/names.data";
import { foldKey } from "./nameFold";
import { mustBeString } from "./svg";

const EMOJI_OF: ReadonlyMap<string, string> = new Map(Object.entries(FLAG_EMOJI).map(([code, emoji]) => [emoji, code]));

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
 * The code of a flag, from any of the names a table uses for the place. Besides what the main entry's
 * `flagCode` reads (an alpha-2 or a subdivision code, in any case, and a former country's alias), this one
 * also reads an alpha-3 (`JPN`), a numeric code (`392`), an IOC code (`GER`, `SUI`), the place's name in
 * English or Japanese (`Holland`, `UK`, `日本`, and katakana as hiragana), and a flag emoji. A code or a
 * name that two places hold (`CS`, `England`, `Georgia`) is null, because a near miss would draw the wrong flag.
 * FIFA codes are not here: Kuni does not list them.
 *
 * @param input - A code, a name, or a flag emoji.
 * @returns The code as this package writes it (`"JP"`, `"JP-13"`, `"SUHH"`), or `null` when nothing here has that flag.
 * @throws TypeError when `input` is not a string.
 *
 * @example
 * ```ts
 * import { flagCode, flagEmoji } from "@johnmorrisdotca/hata/names";
 *
 * console.log(flagCode("JPN"), flagCode("392"), flagCode("GER")); // "JP", "JP", "DE"
 * console.log(flagCode("Holland"), flagCode("UK"), flagCode("日本")); // "NL", "GB", "JP"
 * console.log(flagCode("🇯🇵")); // "JP"
 * console.log(flagCode("CS"), flagCode("England")); // null, null
 * console.log(flagEmoji("GB-ENG")); // the England tag sequence
 * ```
 */
const flagCode = (input: string): string | null => {
  const raw = mustBeString(input, "code").trim();
  if (raw === "") return null;
  const fromEmoji = EMOJI_OF.get(raw);
  if (fromEmoji !== undefined) return fromEmoji;
  const written = raw.toUpperCase().replace(/_/g, "-");
  const aliased = FLAG_ALIASES[written] ?? written;
  if (NAMES[aliased] !== undefined) return aliased;
  const coded = CODE_LOOKUP[written];
  if (coded !== undefined) return coded;

  return NAME_LOOKUP[foldKey(raw)] ?? null;
};

/**
 * A flag as an emoji: a country's two regional-indicator letters, or the tag sequence for England, Scotland
 * or Wales. A subdivision, a former country, and Northern Ireland have none.
 *
 * @param code - A flag's code, a name, or another code `flagCode` reads (`"JP"`, `"jpn"`, `"GB-ENG"`).
 * @returns The emoji, or `null` when the place has no flag emoji here.
 * @throws TypeError when `code` is not a string.
 *
 * @example
 * ```ts
 * import { flagEmoji } from "@johnmorrisdotca/hata/names";
 *
 * console.log(flagEmoji("JP"));      // "🇯🇵"
 * console.log(flagEmoji("GB-SCT"));  // the Scotland tag sequence
 * console.log(flagEmoji("JP-13"));   // null
 * ```
 */
const flagEmoji = (code: string): string | null => {
  const known = flagCode(code);

  return known === null ? null : (FLAG_EMOJI[known] ?? null);
};

export { flagAspect, flagCode, flagEmoji, flagName };
export type { NameLanguage };
