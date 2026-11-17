// The entry @johnmorrisdotca/hata/manifest: where every flag's drawing comes from, under what licence and why it
// was chosen, and the codes with no flag and why. Data only, kept out of the main entry and the flags, for a credits
// page, a licence check in a build, or the demo's detail panel. The same data is in manifest.json.

import { LEFT_OUT as LEFT_OUT_ROWS, RECORDS } from "./data/manifest.data";
import type { FlagRecord, FlagSource, Framing, FramingCrop, HistoricalEra, LeftOutRecord, LicenceKind, Variant } from "./manifest.types";
import { FLAG_ALIASES } from "./data/aliases.data";
import { dayAfter, dayOf } from "./dates";
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
 * console.log(MANIFEST.filter((one) => one.licence.kind === "cc-by").map((one) => one.code)); // the flags whose authors must be credited
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
 * console.log(LEFT_OUT.map((one) => `${one.code}: ${one.kind}`)); // ["AQ: no-flag", "BQ: no-flag", "CC: licence", …]
 * ```
 */
const LEFT_OUT: readonly LeftOutRecord[] = deepFreeze(LEFT_OUT_ROWS);

const BY_CODE: ReadonlyMap<string, FlagRecord> = new Map(MANIFEST.map((one) => [one.code, one]));
const LEFT_BY_CODE: ReadonlyMap<string, LeftOutRecord> = new Map(LEFT_OUT.map((one) => [one.code, one]));
const normal = (code: string): string => {
  const written = mustBeString(code, "code").trim().toUpperCase().replace(/_/g, "-");

  return FLAG_ALIASES[written] ?? written;
};

/**
 * Where one flag's drawing comes from, its licence and author, and why it was chosen.
 *
 * @param code - A flag's code in any case: "JP", "jp-13", "CA_ON"; a former country by its code or by one of its aliases ("SU", "URS", "GDR").
 * @returns The flag's record, or `null` when the code has no flag here (see `leftOut` for why).
 * @throws TypeError when `code` is not a string.
 *
 * @example
 * ```ts
 * import { manifest } from "@johnmorrisdotca/hata/manifest";
 *
 * console.log(manifest("JP-13")?.licence.name); // "Public domain"
 * console.log(manifest("YE")?.source);           // "country-flag-icons"
 * console.log(manifest("URS")?.code);           // "SUHH": the Soviet Union, by the IOC's code
 * console.log(manifest("XX"));                   // null
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
 * console.log(leftOut("EH")?.kind); // "no-flag"
 * console.log(leftOut("JP"));       // null: Japan has a flag
 * ```
 */
const leftOut = (code: string): LeftOutRecord | null => LEFT_BY_CODE.get(normal(code)) ?? null;

/**
 * Every flag of a place that has more than one in real use, with its status, dates, reason and drawing: Afghanistan's
 * Republic tricolour (the default) and the Taliban's flag, Bavaria's lozenges and stripes, Northern Ireland's Union Flag
 * and former Ulster Banner (it has no flag of its own by default), the French tricolour and the local flag of each French
 * territory. The package takes no side between them: each has a status, and the default's reason is in its `why`.
 * Load one with `flag(code, { variant: id })` from `/load`, or import its module.
 *
 * @param code - A code in any case: "AF", "de-by", "GB_NIR". A code that is the same place as another (Guadeloupe's "FR-971" and "GP") gives the same list.
 * @returns The place's variants, the default's first where there is one; an empty list where the place has one flag, or the code is not one Kuni knows here.
 * @throws TypeError when `code` is not a string.
 *
 * @example
 * ```ts
 * import { variantsOf } from "@johnmorrisdotca/hata/manifest";
 *
 * console.log(variantsOf("AF").map((one) => `${one.id}: ${one.status}`)); // ["republic: official", "de-facto: de-facto"]
 * console.log(variantsOf("GB-NIR").map((one) => one.id));                  // ["union-flag", "ulster-banner"]
 * console.log(variantsOf("JP"));                                           // []: Japan has one flag
 * ```
 */
const variantsOf = (code: string): readonly Variant[] => (manifest(code) ?? leftOut(code))?.variants ?? [];

// The first day a variant was in use, and the first day after it was (`until` is the day the next flag took over, so it
// is the end, except that a bare year or month means the whole of it: "1972" ends on 1973-01-01).
const startOf = (variant: Variant): string | null => (variant.from === null ? null : dayOf(variant.from));
const endOf = (variant: Variant): string | null => {
  if (variant.until === null) return null;

  return /^\d{4}(-\d{2}){2}$/.test(variant.until) ? variant.until : dayAfter(variant.until);
};

/**
 * The flag a place had in use on a date: the variant whose years cover it, the default (the flag of today) when the date
 * is after the newest change, and `null` where the package knows no flag for that day. Only the `official` and `historical`
 * variants have a turn; a `de-facto` or `local` flag is never the answer, and a variant with no dates is left out. A date
 * is a `Date` (read in UTC) or a string, `"1962-09-29"`, `"1962-09"` or `"1962"` (the first day of that month or year). The day a flag
 * changed belongs to the new flag, and where two variants cover a date (a year-only change) the later one wins. A former
 * country has an answer only within the years it existed, and only where one of its dated flags covers the day: the Soviet Union's
 * `1936` flag from 1936-12-05, its `1955` flag to 1991-12-25, and `null` before and after. `null` also means the place has no
 * dated flags here yet: ask `flag(code)` for the flag of today.
 *
 * @param code - A code in any case: "CA", "us", "SUHH", "URS".
 * @param date - The day: a `Date`, or `"YYYY-MM-DD"`, `"YYYY-MM"` or `"YYYY"`.
 * @returns The variant in use that day, or `null` when the package has no flag for the place on that day (before its first known flag, after a former country's end, in a gap, or for a place with no dated flags).
 * @throws TypeError when `code` is not a string, or `date` is not a valid `Date` or date string.
 *
 * @example
 * ```ts
 * import { variantOn } from "@johnmorrisdotca/hata/manifest";
 *
 * console.log(variantOn("CA", "1962-09-29")?.id); // "red-ensign-1957": the Red Ensign, three years before the Maple Leaf
 * console.log(variantOn("CA", "1965-02-15")?.id); // "maple-leaf": the day the new flag came in belongs to it
 * console.log(variantOn("CA", "2026-01-01")?.id); // "maple-leaf": after the newest change, today's flag
 * console.log(variantOn("US", "1950")?.id);       // "stars-48"
 * console.log(variantOn("SUHH", "1991-12-26"));   // null: the Soviet Union had ended the day before
 * console.log(variantOn("DE", "1936-05-05"));     // null: the flag of that day is not shipped (docs/decisions.md)
 * ```
 */
const variantOn = (code: string, date: string | Date): Variant | null => {
  const day = dayOf(date);
  const era = manifest(code)?.historical ?? leftOut(code)?.historical;
  if (era !== undefined && (day < `${era.from}-01-01` || day >= `${Number(era.until) + 1}-01-01`)) return null;
  let found: Variant | null = null;
  let foundStart = "";
  for (const variant of variantsOf(code)) {
    if (variant.status !== "official" && variant.status !== "historical") continue;
    const start = startOf(variant);
    const end = endOf(variant);
    if (start === null && end === null) continue;
    if ((start !== null && day < start) || (end !== null && day >= end)) continue;
    if (found === null || (start ?? "") > foundStart) {
      found = variant;
      foundStart = start ?? "";
    }
  }

  return found;
};

export { LEFT_OUT, leftOut, manifest, MANIFEST, variantOn, variantsOf };
export type { FlagRecord, FlagSource, Framing, FramingCrop, HistoricalEra, LeftOutRecord, LicenceKind, Variant };
