// The entry @johnmorrisdotca/hata/manifest: where every flag's drawing comes from, under what licence and why it
// was chosen, and the codes with no flag and why. Data only, kept out of the main entry and the flags, for a credits
// page, a licence check in a build, or the demo's detail panel. The same data is in manifest.json.

import { LEFT_OUT as LEFT_OUT_ROWS, RECORDS } from "./data/manifest.data";
import type { FlagRecord, FlagSource, LeftOutRecord, LicenceKind } from "./manifest.types";
import { mustBeString } from "./svg";

const deepFreeze = <T>(value: T): T => {
  if (typeof value === "object" && value !== null && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const inner of Object.values(value)) deepFreeze(inner);
  }

  return value;
};

/**
 * Every flag's record, in the order of `FLAG_CODES`: its source, file, page, licence, author, restrictions, size,
 * aspect ratio, and why that drawing was chosen. Frozen.
 *
 * @example
 * ```ts
 * import { MANIFEST } from "@johnmorrisdotca/hata/manifest";
 *
 * MANIFEST.filter((one) => one.licence.kind === "cc-by").map((one) => one.code); // the flags whose authors must be credited
 * ```
 */
const MANIFEST: readonly FlagRecord[] = deepFreeze(RECORDS);

/**
 * Every code Kuni knows that has no flag in this version, with the reason: no source names one, or the only
 * drawing's licence is not one this package can ship. Frozen.
 *
 * @example
 * ```ts
 * import { LEFT_OUT } from "@johnmorrisdotca/hata/manifest";
 *
 * LEFT_OUT.map((one) => `${one.code}: ${one.kind}`); // ["AQ: no-flag", "BQ: no-flag", "CA-MB: licence", …]
 * ```
 */
const LEFT_OUT: readonly LeftOutRecord[] = deepFreeze(LEFT_OUT_ROWS);

const BY_CODE: ReadonlyMap<string, FlagRecord> = new Map(MANIFEST.map((one) => [one.code, one]));
const LEFT_BY_CODE: ReadonlyMap<string, LeftOutRecord> = new Map(LEFT_OUT.map((one) => [one.code, one]));
const normal = (code: string): string => mustBeString(code, "code").trim().toUpperCase().replace(/_/g, "-");

/**
 * Where one flag's drawing comes from, its licence and author, and why it was chosen.
 *
 * @param code - A flag's code in any case: "JP", "jp-13", "CA_ON".
 * @returns The flag's record, or `null` when the code has no flag here (see `leftOut` for why).
 * @throws TypeError when `code` is not a string.
 *
 * @example
 * ```ts
 * import { manifest } from "@johnmorrisdotca/hata/manifest";
 *
 * manifest("JP-13")?.licence.name; // "Public domain"
 * manifest("YE")?.source;           // "country-flag-icons"
 * manifest("XX");                   // null
 * ```
 */
const manifest = (code: string): FlagRecord | null => BY_CODE.get(normal(code)) ?? null;

/**
 * Why a code Kuni knows has no flag in this version.
 *
 * @param code - A code in any case.
 * @returns The record with its reason, or `null` when the code has a flag, or is not one Kuni knows here.
 * @throws TypeError when `code` is not a string.
 *
 * @example
 * ```ts
 * import { leftOut } from "@johnmorrisdotca/hata/manifest";
 *
 * leftOut("EH")?.kind; // "no-flag"
 * leftOut("JP");       // null: Japan has a flag
 * ```
 */
const leftOut = (code: string): LeftOutRecord | null => LEFT_BY_CODE.get(normal(code)) ?? null;

export { LEFT_OUT, leftOut, manifest, MANIFEST };
export type { FlagRecord, FlagSource, LeftOutRecord, LicenceKind };
