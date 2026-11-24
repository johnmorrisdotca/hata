// The entry @johnmorrisdotca/hata/military: military flags (naval ensigns, a war ensign and naval jacks) drawn for this package from the sources
// named in each record, and kept apart from the countries' flags. Ids are `mil:<slug>` ("mil:gb-white-ensign"), a namespace no ISO 3166 code can be
// in. Every drawing is one record in sets/military.data.ts, made by scripts/draw-military.ts, with its dates and its source. The Rising Sun Flag of
// Japan is in this set and nowhere else in the package.
//
// Every function is pure and works on strings: no DOM, no network, the same answer on a server and in a browser.

import { drawnSet } from "./drawn";
import type { DrawnInfo } from "./drawn";
import { MILITARY } from "./sets/military.data";
import type { MilitaryRecordId } from "./sets/military.data";
import type { DrawnRestriction } from "./drawn";

const set = drawnSet("mil", MILITARY);

/**
 * The id of a military flag, written exactly as this package writes it: `mil:`, the country's two letters and a lower-case slug
 * ("mil:gb-white-ensign"). No country or region code contains a colon, so none of these can be taken for one.
 *
 * @example
 * ```ts
 * import { type MilitaryId } from "@johnmorrisdotca/hata/military";
 *
 * const ensign: MilitaryId = "mil:gb-white-ensign";
 * console.log(ensign);
 * ```
 */
type MilitaryId = MilitaryRecordId;

/**
 * What the package knows of one military flag: its id, group, both names, what it is, its status, the note on what is the source's and what is
 * this package's, its dates, its source and its aspect ratio.
 *
 * @example
 * ```ts
 * import { militaryInfo, type MilitaryInfo } from "@johnmorrisdotca/hata/military";
 *
 * const info: MilitaryInfo | null = militaryInfo("mil:gb-white-ensign");
 * console.log(info?.dates?.from);
 * ```
 */
type MilitaryInfo = DrawnInfo;

/**
 * Every military flag id of the set, in the order of the table, without the restricted ones (`MILITARY_RESTRICTED_IDS`).
 *
 * @example
 * ```ts
 * import { MILITARY_IDS } from "@johnmorrisdotca/hata/military";
 *
 * console.log(MILITARY_IDS.length); // 58
 * ```
 */
const MILITARY_IDS: readonly MilitaryId[] = set.ids;

/**
 * The ids of the flags shipped for history and education and never given by default: the Confederate battle flag of the Army of Northern Virginia
 * and the Confederate States Navy's jack. They are in no list, group or picker; `militaryFlag(id, { allowRestricted: true })` draws one, and
 * `militaryInfo(id)?.restricted` says why it is withheld.
 *
 * @example
 * ```ts
 * import { MILITARY_RESTRICTED_IDS } from "@johnmorrisdotca/hata/military";
 *
 * console.log(MILITARY_RESTRICTED_IDS); // ["mil:cs-battle-flag", "mil:cs-naval-jack"]
 * ```
 */
const MILITARY_RESTRICTED_IDS: readonly MilitaryId[] = set.restrictedIds as readonly MilitaryId[];

/**
 * Why a flag is withheld by default, and who it is for, in both languages: `reason`, `reasonJa`, `allowedFor` and `allowedForJa`. No law restricts it.
 *
 * @example
 * ```ts
 * import { type MilitaryRestriction } from "@johnmorrisdotca/hata/military";
 *
 * const why: MilitaryRestriction["allowedFor"] = "education and history";
 * console.log(why);
 * ```
 */
type MilitaryRestriction = DrawnRestriction;

/**
 * True for an id of this set, written exactly as this package writes it. A country's code ("JP") is not one.
 *
 * @param value - Anything.
 * @returns `true` when `value` is a string in `MILITARY_IDS`, and `false` for anything else, never throwing.
 *
 * @example
 * ```ts
 * import { isMilitaryId } from "@johnmorrisdotca/hata/military";
 *
 * console.log(isMilitaryId("mil:us-navy-jack")); // true
 * console.log(isMilitaryId("US"));               // false
 * ```
 */
const isMilitaryId = (value: unknown): value is MilitaryId => set.isId(value);

/**
 * The id of a flag from an id written loosely: either case, with spaces around it, with or without `mil:`.
 *
 * @param input - "gb-white-ensign", " MIL:GB-White-Ensign ".
 * @returns The id as this package writes it, or `null` when the set has no such flag.
 * @throws TypeError when `input` is not a string.
 *
 * @example
 * ```ts
 * import { militaryId } from "@johnmorrisdotca/hata/military";
 *
 * console.log(militaryId(" GB-White-Ensign ")); // "mil:gb-white-ensign"
 * console.log(militaryId("nobody"));            // null
 * ```
 */
const militaryId = (input: string): MilitaryId | null => set.idOf(input) as MilitaryId | null;

/**
 * A military flag as an SVG string: it has a viewBox and no width or height. `frame()` and `toDataUri()` from the main entry take it like any other.
 * A restricted flag (`MILITARY_RESTRICTED_IDS`) is `null` unless `allowRestricted` is true, for a page of history or teaching.
 *
 * @param id - A flag's id, in any case, with or without `mil:`.
 * @param options - `{ allowRestricted: true }` to draw a flag shipped for history and education only.
 * @returns The SVG string, or `null` when the set has no such flag or the flag is restricted and not asked for.
 * @throws TypeError when `id` is not a string.
 *
 * @example
 * ```ts
 * import { toDataUri } from "@johnmorrisdotca/hata";
 * import { militaryFlag } from "@johnmorrisdotca/hata/military";
 *
 * const ensign = militaryFlag("mil:gb-white-ensign"); // "<svg …>"
 * console.log(ensign === null ? null : toDataUri(ensign)?.startsWith("data:image/svg+xml,"));
 * ```
 */
const militaryFlag = (id: string, options: { allowRestricted?: boolean } = {}): string | null => set.flag(id, options.allowRestricted === true);

/**
 * A flag's name, in English or Japanese: the country and what the flag is. Any language tag that starts with `ja` is Japanese.
 *
 * @param id - A flag's id, in any case, with or without `mil:`.
 * @param lang - `"en"` (the default), `"ja"`, or a tag such as `"ja-JP"`.
 * @returns The name, or `null` when the set has no such flag.
 * @throws TypeError when `id` is not a string.
 *
 * @example
 * ```ts
 * import { militaryName } from "@johnmorrisdotca/hata/military";
 *
 * console.log(militaryName("mil:gb-white-ensign"));       // "United Kingdom: White Ensign"
 * console.log(militaryName("mil:gb-white-ensign", "ja")); // "イギリス：白色軍艦旗（ホワイト・エンサイン）"
 * ```
 */
const militaryName = (id: string, lang: string = "en"): string | null => set.name(id, lang);

/**
 * What the flag is, in a sentence, in English or Japanese: whose it is, what it shows and when it was fixed.
 *
 * @param id - A flag's id, in any case, with or without `mil:`.
 * @param lang - `"en"` (the default), `"ja"`, or a tag such as `"ja-JP"`.
 * @returns The sentence, or `null` when the set has no such flag.
 * @throws TypeError when `id` is not a string.
 *
 * @example
 * ```ts
 * import { militaryAbout } from "@johnmorrisdotca/hata/military";
 *
 * console.log(militaryAbout("mil:us-navy-jack", "ja")); // "アメリカの国旗の青い部分だけを旗にしたもの…"
 * ```
 */
const militaryAbout = (id: string, lang: string = "en"): string | null => set.about(id, lang);

/**
 * A flag's width over its height, from its viewBox: 1.5 for the Self-Defense Force ensign's 3 to 2. For keeping a box before the picture is drawn.
 *
 * @param id - A flag's id, in any case, with or without `mil:`.
 * @returns The aspect ratio, or `null` when the set has no such flag.
 * @throws TypeError when `id` is not a string.
 *
 * @example
 * ```ts
 * import { militaryAspect } from "@johnmorrisdotca/hata/military";
 *
 * console.log(militaryAspect("mil:jp-jmsdf-ensign")); // 1.5
 * console.log(militaryAspect("mil:gb-white-ensign")); // 2
 * ```
 */
const militaryAspect = (id: string): number | null => set.aspect(id);

/**
 * Everything the package knows of a military flag, a copy: its group (`ensign` or `jack`), both names, what it is, its dates (`from`, and
 * `until` where it ended), its status (`documented` where a source gives the construction, `reconstruction` where the sizes are this package's),
 * the note that says which, and the page it was read from.
 *
 * @param id - A flag's id, in any case, with or without `mil:`.
 * @returns The record, or `null` when the set has no such flag.
 * @throws TypeError when `id` is not a string.
 *
 * @example
 * ```ts
 * import { militaryInfo } from "@johnmorrisdotca/hata/military";
 *
 * console.log(militaryInfo("mil:jp-ijn-ensign")?.dates); // { from: "1889-10-07", until: "1945" }
 * ```
 */
const militaryInfo = (id: string): MilitaryInfo | null => set.info(id);

/**
 * The ids of one kind of flag: `ensign` (the flag a warship flies at the stern) or `jack` (the flag at the bow).
 *
 * @param group - `"ensign"` or `"jack"`.
 * @returns The ids in the order of the table; an empty list for any other word.
 *
 * @example
 * ```ts
 * import { militaryIn } from "@johnmorrisdotca/hata/military";
 *
 * console.log(militaryIn("jack")); // ["mil:gb-naval-jack", "mil:us-navy-jack"]
 * ```
 */
const militaryIn = (group: string): MilitaryId[] => [...set.inGroup(group)];

export { isMilitaryId, MILITARY_IDS, MILITARY_RESTRICTED_IDS, militaryAbout, militaryAspect, militaryFlag, militaryId, militaryInfo, militaryIn, militaryName };
export type { MilitaryId, MilitaryInfo, MilitaryRestriction };
