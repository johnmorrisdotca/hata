// The entry @johnmorrisdotca/hata/manifest: where every flag's drawing comes from, under what licence and why it
// was chosen, and the codes with no flag and why. Data only, kept out of the main entry and the flags, for a credits
// page, a licence check in a build, or the demo's detail panel. The same data is in manifest.json.

import { LEFT_OUT as LEFT_OUT_ROWS, RECORDS, RESTRICTED_ROWS } from "./data/manifest.data";
import type { FlagRecord, FlagRole, FlagSource, Framing, FramingCrop, HistoricalEra, LeftOutRecord, LicenceKind, Restricted, RestrictedVariant, RoleNote, Variant } from "./manifest.types";
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
 * Every flag in real use that the law restricts, each with the code of its place: Germany's national flag of 1935 to 1945. They are
 * kept out of `variantsOf`, out of every record's `variants` and out of the lists and downloads built from them, and out of the CDN
 * listing (`/svg/`), so that a picker, a quiz or a pack never offers one. A page that shows history asks for one by name. Frozen.
 *
 * @example
 * ```ts
 * import { RESTRICTED } from "@johnmorrisdotca/hata/manifest";
 *
 * console.log(RESTRICTED.map((one) => `${one.code} ${one.variant.id}`)); // ["DE swastika-1935"]
 * console.log(RESTRICTED[0]?.variant.restricted?.allowedFor);            // "education and history"
 * ```
 */
const RESTRICTED: readonly RestrictedVariant[] = deepFreeze(RESTRICTED_ROWS);

/**
 * What `variantsOf`, `variantOn` and `flagOn` take: `allowRestricted`, to include the flags the law restricts (`RESTRICTED`); `role`, which flag of the day to give.
 *
 * @example
 * ```ts
 * import { variantOn, type VariantOptions } from "@johnmorrisdotca/hata/manifest";
 *
 * const asked: VariantOptions = { role: "in-use" };
 * console.log(variantOn("CA", "1962-09-29", asked)?.id); // "red-ensign-1957"
 * ```
 */
interface VariantOptions {
  /** Which flag of the day: the `legal` one (the default) or the one `in-use` in practice. Where they are the same flag, the answer is the same. */
  role?: FlagRole;
  /** Include a flag whose display the law restricts. Left out, it is never given: `variantsOf` leaves it out of the list, and `variantOn` says the day has one and gives its restriction and reason in place of a drawing (`withheld`). */
  allowRestricted?: boolean;
}

const checkOptions = (options: VariantOptions | undefined): void => {
  if (options === undefined) return;
  if (options.role !== undefined && options.role !== "legal" && options.role !== "in-use") throw new TypeError('role must be "legal" or "in-use"');
  if (options.allowRestricted !== undefined && typeof options.allowRestricted !== "boolean") throw new TypeError("allowRestricted must be a boolean");
};

/**
 * Every flag of a place that has more than one in real use, with its status, roles, dates, reason and drawing: Afghanistan's
 * Republic tricolour (the default) and the Taliban's flag, Bavaria's lozenges and stripes, Northern Ireland's Union Flag
 * and former Ulster Banner (it has no flag of its own by default), the French tricolour and the local flag of each French
 * territory, and the earlier flags of countries that still exist, Canada's Union Flag and Red Ensigns among them. The package takes no side between them: each has a status, and the default's reason is in its `why`.
 * Load one with `flag(code, { variant: id })` from `/load`, or import its module.
 *
 * A flag whose display the law restricts is not in the list (`RESTRICTED` has it); `{ allowRestricted: true }` adds it, in date order.
 *
 * @param code - A code in any case: "AF", "de-by", "GB_NIR". A code that is the same place as another (Guadeloupe's "FR-971" and "GP") gives the same list.
 * @param options - `allowRestricted`, to include the restricted flags of the place.
 * @returns The place's variants, the default's first where there is one; an empty list where the place has one flag, or the code is not one Kuni knows here.
 * @throws TypeError when `code` is not a string, or `options` is not as above.
 *
 * @example
 * ```ts
 * import { variantsOf } from "@johnmorrisdotca/hata/manifest";
 *
 * console.log(variantsOf("AF").map((one) => `${one.id}: ${one.status}`)); // ["republic: official", "de-facto: de-facto"]
 * console.log(variantsOf("GB-NIR").map((one) => one.id));                  // ["union-flag", "ulster-banner"]
 * console.log(variantsOf("JP").map((one) => one.id));                      // ["hinomaru-1870", "hinomaru"]
 * console.log(variantsOf("DE").some((one) => one.restricted !== null));    // false: left out of every list
 * console.log(variantsOf("DE", { allowRestricted: true }).some((one) => one.restricted !== null)); // true
 * ```
 */
const variantsOf = (code: string, options?: Pick<VariantOptions, "allowRestricted">): readonly Variant[] => {
  checkOptions(options);
  const listed = (manifest(code) ?? leftOut(code))?.variants ?? [];
  if (options?.allowRestricted !== true) return listed;
  const key = normal(code);
  const more = RESTRICTED.filter((one) => one.code === key).map((one) => one.variant);

  // Each restricted flag goes where its dates put it among the others, which are in the order the data gives them.
  const merged = [...listed];
  for (const one of more) {
    const at = merged.findIndex((other) => (other.from ?? "") > (one.from ?? ""));
    merged.splice(at === -1 ? merged.length : at, 0, one);
  }

  return merged;
};

// The first day a variant was in use, and the first day after it was (`until` is the day the next flag took over, so it
// is the end, except that a bare year or month means the whole of it: "1972" ends on 1973-01-01).
const startOf = (from: string | null): string | null => (from === null ? null : dayOf(from));
const endOf = (until: string | null): string | null => {
  if (until === null) return null;

  return /^\d{4}(-\d{2}){2}$/.test(until) ? until : dayAfter(until);
};

// The variant that was the flag of a role on a day: its turn is the days of that role, the later of two that cover a day wins.
const turnOf = (list: readonly Variant[], day: string, role: FlagRole): Variant | null => {
  let found: Variant | null = null;
  let foundStart = "";
  for (const variant of list) {
    if (variant.status !== "official" && variant.status !== "historical") continue;
    const dates = variant.roleDates[role];
    if (dates === undefined) continue;
    const start = startOf(dates.from);
    const end = endOf(dates.until);
    if (start === null && end === null) continue;
    if ((start !== null && day < start) || (end !== null && day >= end)) continue;
    if (found === null || (start ?? "") > foundStart) {
      found = variant;
      foundStart = start ?? "";
    }
  }

  return found;
};

/**
 * Where a flag of a day is, and the other one: what `variantOn` gives. It is a `Variant` with the `role` that was asked, `other`, which
 * says that another flag was in the other role that day and why, and `withheld`.
 *
 * @example
 * ```ts
 * import { variantOn, type DatedVariant } from "@johnmorrisdotca/hata/manifest";
 *
 * const found: DatedVariant | null = variantOn("CA", "1962-09-29");
 * console.log(found?.id);          // "union-flag": the legal flag
 * console.log(found?.other?.id);   // "red-ensign-1957": the flag flown in practice
 * console.log(found?.other?.note?.why); // "Canadians flew the Red Ensign from the 1870s …"
 * ```
 */
interface DatedVariant extends Variant {
  /** The role that was asked, `legal` unless the caller said `in-use`. */
  role: FlagRole;
  /** The flag of the other role on the same day where it is a different flag, with the reason and the page that says so; null where the same flag is both. */
  other: OtherFlag | null;
  /** True where the flag is restricted and the call did not say `allowRestricted`: `restricted` says why, and no drawing is given for it (`flag()` is `null`, `<hata-flag>` draws a notice). */
  withheld: boolean;
}

/**
 * The other flag of a day, in the role that was not asked for.
 *
 * @example
 * ```ts
 * import { variantOn, type OtherFlag } from "@johnmorrisdotca/hata/manifest";
 *
 * const other: OtherFlag | null = variantOn("AU", "1930")?.other ?? null;
 * console.log(other?.id, other?.role); // "australian-national-flag" "in-use": the flag flown while the Union Flag was the legal one
 * ```
 */
interface OtherFlag {
  /** The role it has: `in-use` where the legal flag was asked for, and `legal` where the flag in use was. */
  role: FlagRole;
  /** Its `id`: ask for it with `variantOn(code, date, { role })` or `flag(code, { variant: id })`. */
  id: string;
  /** Its name in English. */
  name: string;
  /** The same in Japanese. */
  nameJa: string;
  /** The reason one was the law's and the other the practice, as its `roleNote` says; null where the package gives none. */
  note: RoleNote | null;
}

/**
 * The flag a place had on a date: by default the `legal` one, the flag the law made the national flag, or with `{ role: "in-use" }` the flag
 * flown in practice. Where the two are different flags the answer says so: `other` names the second flag and why (Canada before 1965: the Union
 * Flag was the legal flag and the Red Ensigns were flown). The variant whose years cover the day, the default (the flag of today) when the
 * date is after the newest change, and `null` where the package knows no flag for that day (`flagOn` says why). Only the `official` and
 * `historical` variants have a turn; a `de-facto` or `local` flag is never the answer, and a variant with no dates is left out. A date
 * is a `Date` (read in UTC) or a string, `"1962-09-29"`, `"1962-09"` or `"1962"` (the first day of that month or year). The day a flag
 * changed belongs to the new flag, and where two variants cover a date (a year-only change) the later one wins. A former
 * country has an answer only within the years it existed, and only where one of its dated flags covers the day: the Soviet Union's
 * `1936` flag from 1936-12-05, its `1955` flag to 1991-12-25, and `null` before and after. `null` also means the place has no
 * dated flags here yet: ask `flag(code)` for the flag of today.
 *
 * A restricted flag (Germany's of 1935 to 1945) is found, with its `restricted` reason, and `withheld` is true: it is never given as a
 * drawing unless `allowRestricted: true`.
 *
 * @param code - A code in any case: "CA", "us", "SUHH", "URS".
 * @param date - The day: a `Date`, or `"YYYY-MM-DD"`, `"YYYY-MM"` or `"YYYY"`.
 * @param options - `role` (`legal`, the default, or `in-use`) and `allowRestricted`.
 * @returns The variant in use that day with its `role`, `other` and `withheld`, or `null` when the package has no flag for the place on that day in that role (before its first known flag, after a former country's end, in a gap, or for a place with no dated flags).
 * @throws TypeError when `code` is not a string, `date` is not a valid `Date` or date string, or `options` is not as above.
 *
 * @example
 * ```ts
 * import { variantOn } from "@johnmorrisdotca/hata/manifest";
 *
 * console.log(variantOn("CA", "1962-09-29")?.id);                       // "union-flag": the legal flag
 * console.log(variantOn("CA", "1962-09-29", { role: "in-use" })?.id);   // "red-ensign-1957": flown in practice
 * console.log(variantOn("CA", "1965-02-15")?.id);                       // "maple-leaf": the day the new flag came in belongs to it
 * console.log(variantOn("CA", "2026-01-01")?.other);                    // null: after the newest change, one flag is both
 * console.log(variantOn("US", "1950")?.id);                             // "stars-48"
 * console.log(variantOn("SUHH", "1991-12-26"));                         // null: the Soviet Union had ended the day before
 * console.log(variantOn("DE", "1940")?.withheld);                       // true: restricted, with its reason and no drawing
 * ```
 */
const variantOn = (code: string, date: string | Date, options?: VariantOptions): DatedVariant | null => {
  checkOptions(options);
  const day = dayOf(date);
  const role = options?.role ?? "legal";
  const era = manifest(code)?.historical ?? leftOut(code)?.historical;
  if (era !== undefined && (day < `${era.from}-01-01` || day >= `${Number(era.until) + 1}-01-01`)) return null;
  const list = variantsOf(code, { allowRestricted: true });
  const found = turnOf(list, day, role);
  if (found === null) return null;
  const otherRole: FlagRole = role === "legal" ? "in-use" : "legal";
  const second = turnOf(list, day, otherRole);
  const other: OtherFlag | null =
    second === null || second.id === found.id ? null : { role: otherRole, id: second.id, name: second.name, nameJa: second.nameJa, note: found.roleNote ?? second.roleNote };

  return Object.freeze({ ...found, role, other, withheld: found.restricted !== null && options?.allowRestricted !== true });
};

/**
 * Why a day has no drawing to give, or none at all: the `kind` and a sentence. `restricted`: the law restricts the flag of that day and it is
 * withheld (the reason is the flag's own, in `variant.restricted`); `not-yet`: before the first flag the package dates for the place;
 * `ended`: after a former country's last year; `gap`: between two dated flags, a flag the package does not ship; `other-role`: the day has a flag
 * in the other role only; `undated`: the place has no dated flags (ask without a date); `unknown`: not a code with a flag here.
 *
 * @example
 * ```ts
 * import { flagOn, type NoFlag } from "@johnmorrisdotca/hata/manifest";
 *
 * const none: NoFlag | null = flagOn("SUHH", "1992-01-01").none;
 * console.log(none?.kind);   // "ended"
 * console.log(none?.reason); // "It had ended by 1992-01-01 (its years are 1922 to 1991)."
 * ```
 */
interface NoFlag {
  kind: "restricted" | "not-yet" | "ended" | "gap" | "other-role" | "undated" | "unknown";
  reason: string;
}

/**
 * The full answer for a day: the flag, `variant` (as `variantOn` gives it, with `other` and `withheld`), and where there is no drawing to
 * give `none` says why, in a sentence, never a bare `null`. For `<hata-flag>`, a page that must explain a blank, or a table of a country's history.
 *
 * @example
 * ```ts
 * import { flagOn, type FlagOnDay } from "@johnmorrisdotca/hata/manifest";
 *
 * const day: FlagOnDay = flagOn("DE", "1940");
 * console.log(day.variant?.id);   // "swastika-1935"
 * console.log(day.none?.kind);    // "restricted"
 * console.log(flagOn("CA", "1850").none?.kind); // "not-yet"
 * console.log(flagOn("CA", "1962-09-29").none); // null: there is a flag to draw
 * ```
 */
interface FlagOnDay {
  /** The day asked, `YYYY-MM-DD`. */
  date: string;
  /** The role asked. */
  role: FlagRole;
  /** The flag, or null. */
  variant: DatedVariant | null;
  /** Why there is no drawing to give; null where there is one. */
  none: NoFlag | null;
}

/**
 * The flag of a day with the reason for a blank: `variantOn`, and where it has nothing to draw (no flag known that day, or a restricted
 * one withheld), `none` says why in words and in a `kind`.
 *
 * @param code - A code in any case.
 * @param date - The day: a `Date`, or `"YYYY-MM-DD"`, `"YYYY-MM"` or `"YYYY"`.
 * @param options - `role` and `allowRestricted`, as for `variantOn`.
 * @returns A `FlagOnDay`, always: `variant` is null and `none` is set where the package has no flag for it.
 * @throws TypeError when `code` is not a string, `date` is not a valid date, or `options` is not as above.
 *
 * @example
 * ```ts
 * import { flagOn } from "@johnmorrisdotca/hata/manifest";
 *
 * console.log(flagOn("DE", "1940").none?.reason);  // "Flag of Nazi Germany, 1935–1945. Shown for history and education. …"
 * console.log(flagOn("SUHH", "1992-01-01").none?.kind); // "ended"
 * console.log(flagOn("CA", "1962-09-29", { role: "in-use" }).variant?.id); // "red-ensign-1957"
 * ```
 */
const flagOn = (code: string, date: string | Date, options?: VariantOptions): FlagOnDay => {
  const variant = variantOn(code, date, options);
  const day = dayOf(date);
  const role = options?.role ?? "legal";
  if (variant !== null) return { date: day, role, variant, none: variant.withheld ? { kind: "restricted", reason: variant.restricted!.reason } : null };
  const record = manifest(code) ?? leftOut(code);
  if (record === null) return { date: day, role, variant: null, none: { kind: "unknown", reason: "This code has no flag in this package." } };
  const era = record.historical;
  if (era !== undefined && day >= `${Number(era.until) + 1}-01-01`) return { date: day, role, variant: null, none: { kind: "ended", reason: `It had ended by ${day} (its years are ${era.from} to ${era.until}).` } };
  if (era !== undefined && day < `${era.from}-01-01`) return { date: day, role, variant: null, none: { kind: "not-yet", reason: `It did not exist yet on ${day} (its years are ${era.from} to ${era.until}).` } };
  const list = variantsOf(code, { allowRestricted: true }).filter((one) => (one.status === "official" || one.status === "historical") && one.roles.length > 0);
  if (list.length === 0) return { date: day, role, variant: null, none: { kind: "undated", reason: "This place has no dated flags here: ask for its flag without a date." } };
  const otherRole: FlagRole = role === "legal" ? "in-use" : "legal";
  const second = turnOf(list, day, otherRole);
  if (second !== null) return { date: day, role, variant: null, none: { kind: "other-role", reason: `No flag is recorded as ${role === "legal" ? "the legal flag" : "the flag in use"} on ${day}; the ${otherRole === "legal" ? "legal flag" : "flag in use"} was ${second.name}.` } };
  const first = list.map((one) => startOf(one.roleDates[role]?.from ?? one.from)).filter((one): one is string => one !== null).sort()[0];
  if (first !== undefined && day < first) return { date: day, role, variant: null, none: { kind: "not-yet", reason: `This is before the first flag the package dates for the place (${first}).` } };

  return { date: day, role, variant: null, none: { kind: "gap", reason: "The package has no flag for this day: the flag of that time is not shipped (docs/decisions.md says which)." } };
};

export { flagOn, LEFT_OUT, leftOut, manifest, MANIFEST, RESTRICTED, variantOn, variantsOf };
export type { DatedVariant, FlagOnDay, FlagRecord, FlagRole, FlagSource, Framing, FramingCrop, HistoricalEra, LeftOutRecord, LicenceKind, NoFlag, OtherFlag, Restricted, RestrictedVariant, RoleNote, Variant, VariantOptions };
