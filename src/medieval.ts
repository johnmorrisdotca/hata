// The entry @johnmorrisdotca/hata/medieval: a small curated set of medieval banners drawn for this package from the dated sources named in each
// record, and kept apart from the countries' flags. Ids are `med:<slug>` ("med:red-cross"), a namespace no ISO 3166 code can be in. Every drawing is
// one record in sets/medieval.data.ts, made by scripts/draw-medieval.ts, with its source, and every one is a reconstruction that says what is documented.
//
// Every function is pure and works on strings: no DOM, no network, the same answer on a server and in a browser.

import { drawnSet } from "./drawn";
import type { DrawnInfo } from "./drawn";
import { MEDIEVAL } from "./sets/medieval.data";

const set = drawnSet("med", MEDIEVAL);

/**
 * The id of a medieval banner, written exactly as this package writes it: `med:` and a lower-case slug ("med:red-cross"). No country or region
 * code contains a colon, so none of these can be taken for one.
 *
 * @example
 * ```ts
 * import { type MedievalId } from "@johnmorrisdotca/hata/medieval";
 *
 * const cross: MedievalId = "med:red-cross";
 * console.log(cross);
 * ```
 */
type MedievalId = (typeof MEDIEVAL)[number]["id"];

/**
 * What the package knows of one medieval banner: its id, group, both names, what it is, its status, the note on what the source documents and what
 * is this package's, its dates, its source and its aspect ratio.
 *
 * @example
 * ```ts
 * import { medievalInfo, type MedievalInfo } from "@johnmorrisdotca/hata/medieval";
 *
 * const info: MedievalInfo | null = medievalInfo("med:red-cross");
 * console.log(info?.status);
 * ```
 */
type MedievalInfo = DrawnInfo;

/**
 * Every medieval flag id of the set, in the order of the table.
 *
 * @example
 * ```ts
 * import { MEDIEVAL_IDS } from "@johnmorrisdotca/hata/medieval";
 *
 * console.log(MEDIEVAL_IDS.length); // 6
 * ```
 */
const MEDIEVAL_IDS: readonly MedievalId[] = set.ids;

/**
 * True for an id of this set, written exactly as this package writes it. A country's code ("JP") is not one.
 *
 * @param value - Anything.
 * @returns `true` when `value` is a string in `MEDIEVAL_IDS`, and `false` for anything else, never throwing.
 *
 * @example
 * ```ts
 * import { isMedievalId } from "@johnmorrisdotca/hata/medieval";
 *
 * console.log(isMedievalId("med:aragon-pallets")); // true
 * console.log(isMedievalId("US"));               // false
 * ```
 */
const isMedievalId = (value: unknown): value is MedievalId => set.isId(value);

/**
 * The id of a banner from an id written loosely: either case, with spaces around it, with or without `med:`.
 *
 * @param input - "red-cross", " MED:Red-Cross ".
 * @returns The id as this package writes it, or `null` when the set has no such banner.
 * @throws TypeError when `input` is not a string.
 *
 * @example
 * ```ts
 * import { medievalId } from "@johnmorrisdotca/hata/medieval";
 *
 * console.log(medievalId(" GB-White-Ensign ")); // "med:red-cross"
 * console.log(medievalId("nobody"));            // null
 * ```
 */
const medievalId = (input: string): MedievalId | null => set.idOf(input) as MedievalId | null;

/**
 * A medieval banner as an SVG string: it has a viewBox and no width or height. `frame()` and `toDataUri()` from the main entry take it like any other.
 *
 * @param id - A banner's id, in any case, with or without `med:`.
 * @returns The SVG string, or `null` when the set has no such banner.
 * @throws TypeError when `id` is not a string.
 *
 * @example
 * ```ts
 * import { toDataUri } from "@johnmorrisdotca/hata";
 * import { medievalFlag } from "@johnmorrisdotca/hata/medieval";
 *
 * const banner = medievalFlag("med:red-cross"); // "<svg …>"
 * console.log(banner === null ? null : toDataUri(banner)?.startsWith("data:image/svg+xml,"));
 * ```
 */
const medievalFlag = (id: string): string | null => set.flag(id);

/**
 * A banner's name, in English or Japanese: whose it was and what it is. Any language tag that starts with `ja` is Japanese.
 *
 * @param id - A banner's id, in any case, with or without `med:`.
 * @param lang - `"en"` (the default), `"ja"`, or a tag such as `"ja-JP"`.
 * @returns The name, or `null` when the set has no such banner.
 * @throws TypeError when `id` is not a string.
 *
 * @example
 * ```ts
 * import { medievalName } from "@johnmorrisdotca/hata/medieval";
 *
 * console.log(medievalName("med:red-cross"));       // "The red cross on white (St George's Cross)"
 * console.log(medievalName("med:red-cross", "ja")); // "白地に赤十字（聖ジョージ十字）"
 * ```
 */
const medievalName = (id: string, lang: string = "en"): string | null => set.name(id, lang);

/**
 * What the banner is, in a sentence, in English or Japanese: whose it was, what it shows and what its source dates.
 *
 * @param id - A banner's id, in any case, with or without `med:`.
 * @param lang - `"en"` (the default), `"ja"`, or a tag such as `"ja-JP"`.
 * @returns The sentence, or `null` when the set has no such banner.
 * @throws TypeError when `id` is not a string.
 *
 * @example
 * ```ts
 * import { medievalAbout } from "@johnmorrisdotca/hata/medieval";
 *
 * console.log(medievalAbout("med:aragon-pallets", "ja")); // "金地に4本の赤い帯。…"
 * ```
 */
const medievalAbout = (id: string, lang: string = "en"): string | null => set.about(id, lang);

/**
 * A banner's width over its height, from its viewBox: 1.5 for the arms of Aragon's 3 to 2. For keeping a box before the picture is drawn.
 *
 * @param id - A banner's id, in any case, with or without `med:`.
 * @returns The aspect ratio, or `null` when the set has no such banner.
 * @throws TypeError when `id` is not a string.
 *
 * @example
 * ```ts
 * import { medievalAspect } from "@johnmorrisdotca/hata/medieval";
 *
 * console.log(medievalAspect("med:aragon-pallets")); // 1.5
 * console.log(medievalAspect("med:scotland-saltire")); // 1.6666666666666667
 * ```
 */
const medievalAspect = (id: string): number | null => set.aspect(id);

/**
 * Everything the package knows of a banner, a copy: its group (`order`, `cross` or `kingdom`), both names, what it is, its dates (where its
 * source gives them), its status (`reconstruction` for every banner here), the note that says what the source documents and what is this
 * package's, and the page it was read from.
 *
 * @param id - A banner's id, in any case, with or without `med:`.
 * @returns The record, or `null` when the set has no such banner.
 * @throws TypeError when `id` is not a string.
 *
 * @example
 * ```ts
 * import { medievalInfo } from "@johnmorrisdotca/hata/medieval";
 *
 * console.log(medievalInfo("med:aragon-pallets")?.dates); // { from: "1159", until: null }
 * ```
 */
const medievalInfo = (id: string): MedievalInfo | null => set.info(id);

/**
 * The ids of one kind of banner: `order` (a military order's), `cross` (a cross on a field) or `kingdom` (a kingdom's).
 *
 * @param group - `"order"`, `"cross"` or `"kingdom"`.
 * @returns The ids in the order of the table; an empty list for any other word.
 *
 * @example
 * ```ts
 * import { medievalIn } from "@johnmorrisdotca/hata/medieval";
 *
 * console.log(medievalIn("order")); // ["med:templar-baucent", "med:hospitaller-cross"]
 * ```
 */
const medievalIn = (group: string): MedievalId[] => [...set.inGroup(group)];

export { isMedievalId, MEDIEVAL_IDS, medievalAbout, medievalAspect, medievalFlag, medievalId, medievalInfo, medievalIn, medievalName };
export type { MedievalId, MedievalInfo };
