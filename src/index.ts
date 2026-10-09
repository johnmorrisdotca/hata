// Hata 旗: flags as SVG, keyed by the ISO 3166 codes Kuni uses. The main entry carries the codes and the
// helpers, and no flag: each flag is its own module (@johnmorrisdotca/hata/flags/<code>), and
// @johnmorrisdotca/hata/load fetches one by its code when it is wanted.
//
// Every function is pure and works on strings: no DOM, no network, the same answer on a server and in a browser.

import { FLAG_CODES } from "./data/codes.data";
import type { FlagCode } from "./data/codes.data";
import { aspectOf, frame, mustBeString, toDataUri } from "./svg";
import type { Fit, FrameOptions, Shape } from "./svg";
import { VERSION } from "./version";

const CODE_SET: ReadonlySet<string> = new Set(FLAG_CODES);

/**
 * Where `flagUrl` finds the SVG files: a folder holding `<code>.svg`.
 *
 * @example
 * ```ts
 * import { flagUrl, type FlagUrlOptions } from "@johnmorrisdotca/hata";
 *
 * const own: FlagUrlOptions = { base: "/static/flags" };
 * flagUrl("JP", own); // "/static/flags/jp.svg"
 * ```
 */
interface FlagUrlOptions {
  /**
   * The folder's address, with or without a trailing slash. Left out, it is this major version on the jsDelivr
   * CDN, `https://cdn.jsdelivr.net/npm/@johnmorrisdotca/hata@1/dist/svg`. A page that copies
   * `node_modules/@johnmorrisdotca/hata/dist/svg` into its own files names that folder, such as `"/flags"`.
   */
  base?: string;
}

const CDN = `https://cdn.jsdelivr.net/npm/@johnmorrisdotca/hata@${VERSION.split(".")[0]}/dist/svg`;

/**
 * True for one of the codes with a flag, written exactly as Kuni writes it: "JP", "JP-13", "CA-ON", "US-TX".
 * Lower case is not a code here; `flagCode` is the forgiving one.
 *
 * @param value - Anything.
 * @returns `true` when `value` is a string in `FLAG_CODES`, and `false` for anything else, never throwing.
 *
 * @example
 * ```ts
 * import { isFlagCode } from "@johnmorrisdotca/hata";
 *
 * isFlagCode("JP-13"); // true
 * isFlagCode("jp-13"); // false: see flagCode
 * isFlagCode("EH");    // false: no flag in this version (see /manifest's leftOut)
 * ```
 */
const isFlagCode = (value: unknown): value is FlagCode => typeof value === "string" && CODE_SET.has(value);

/**
 * The code of a flag, from a code written loosely: either case, with spaces around it, and an underscore for the
 * hyphen ("jp", " Jp-13 ", "us_tx"). Codes match Kuni's exactly: ISO 3166-1 alpha-2 for a country, ISO 3166-2
 * for a subdivision.
 *
 * @param input - A country's alpha-2 code ("JP") or a subdivision's ISO 3166-2 code ("JP-13"), in any case.
 * @returns The code as Kuni writes it (`"JP-13"`), or `null` when it is not a code or the place has no flag here.
 * @throws TypeError when `input` is not a string.
 *
 * @example
 * ```ts
 * import { flagCode } from "@johnmorrisdotca/hata";
 *
 * flagCode("jp-13");  // "JP-13"
 * flagCode("ca_on");  // "CA-ON"
 * flagCode("JPN");    // null: alpha-3 codes are Kuni's to translate (country("JPN").alpha2)
 * flagCode("XX");     // null
 * ```
 */
const flagCode = (input: string): FlagCode | null => {
  const code = mustBeString(input, "code").trim().toUpperCase().replace(/_/g, "-");

  return CODE_SET.has(code) ? (code as FlagCode) : null;
};

/**
 * The address of a flag's SVG file, for an `<img src>` or a CSS `url()`: on the jsDelivr CDN by default, or in
 * a folder of your own. The file is the same SVG as the module's string.
 *
 * @param code - A flag's code, in any case (as `flagCode` reads it).
 * @param options - `base`, the folder holding the `<code>.svg` files; the CDN when left out.
 * @returns The address (`…/jp-13.svg`), or `null` when the code has no flag here.
 * @throws TypeError when `code` is not a string.
 *
 * @example
 * ```ts
 * import { flagUrl } from "@johnmorrisdotca/hata";
 *
 * flagUrl("JP-13");                      // "https://cdn.jsdelivr.net/npm/@johnmorrisdotca/hata@1/dist/svg/jp-13.svg"
 * flagUrl("us-tx", { base: "/flags/" }); // "/flags/us-tx.svg"
 * flagUrl("XX");                          // null
 * ```
 */
const flagUrl = (code: string, options: FlagUrlOptions = {}): string | null => {
  const known = flagCode(code);
  if (known === null) return null;
  const base = options.base === undefined ? CDN : mustBeString(options.base, "base");

  return `${base.replace(/\/+$/, "")}/${known.toLowerCase()}.svg`;
};

export { aspectOf, FLAG_CODES, flagCode, flagUrl, frame, isFlagCode, toDataUri, VERSION };
export type { Fit, FlagCode, FlagUrlOptions, FrameOptions, Shape };
