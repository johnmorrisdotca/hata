// The entry @johnmorrisdotca/hata/samurai: the battle banners of Sengoku daimyo (nobori, hata and uma-jirushi), drawn for this package
// from the words of the sources named in each record, and kept apart from the countries' flags. Ids are `samurai:<slug>`
// ("samurai:sanada-rokumonsen"), a namespace no ISO 3166 code can be in. Every drawing is one record in sets/samurai.data.ts, made by
// scripts/draw-samurai.ts, and says what is documented and what is a reconstruction.
//
// Every function is pure and works on strings: no DOM, no network, the same answer on a server and in a browser.

import { drawnSet } from "./drawn";
import type { DrawnInfo } from "./drawn";
import { SAMURAI, SAMURAI_LOADERS } from "./sets/samurai.data";

const set = drawnSet("samurai", SAMURAI, SAMURAI_LOADERS);

/**
 * The id of a banner, written exactly as this package writes it: `samurai:` and a lower-case slug. No country or region code contains a
 * colon, so none of these can be taken for one.
 *
 * @example
 * ```ts
 * import { type SamuraiId } from "@johnmorrisdotca/hata/samurai";
 *
 * const nobori: SamuraiId = "samurai:sanada-rokumonsen";
 * console.log(nobori);
 * ```
 */
type SamuraiId = (typeof SAMURAI)[number]["id"];

/**
 * What the package knows of one banner: its id, group, both names, what it is, its status, the note on what is documented and what is
 * reconstruction, its source and its aspect ratio.
 *
 * @example
 * ```ts
 * import { samuraiInfo, type SamuraiInfo } from "@johnmorrisdotca/hata/samurai";
 *
 * const info: SamuraiInfo | null = samuraiInfo("samurai:sanada-rokumonsen");
 * console.log(info?.status);
 * ```
 */
type SamuraiInfo = DrawnInfo;

/**
 * Every banner id of the set, in the order of the table.
 *
 * @example
 * ```ts
 * import { SAMURAI_IDS } from "@johnmorrisdotca/hata/samurai";
 *
 * console.log(SAMURAI_IDS.length); // 9
 * ```
 */
const SAMURAI_IDS: readonly SamuraiId[] = set.ids;

/**
 * True for an id of this set, written exactly as this package writes it. A country's code ("JP") is not one.
 *
 * @param value - Anything.
 * @returns `true` when `value` is a string in `SAMURAI_IDS`, and `false` for anything else, never throwing.
 *
 * @example
 * ```ts
 * import { isSamuraiId } from "@johnmorrisdotca/hata/samurai";
 *
 * console.log(isSamuraiId("samurai:ii-igeta")); // true
 * console.log(isSamuraiId("JP"));               // false
 * ```
 */
const isSamuraiId = (value: unknown): value is SamuraiId => set.isId(value);

/**
 * The id of a banner from an id written loosely: either case, with spaces around it, with or without `samurai:`.
 *
 * @param input - "ii-igeta", " Samurai:Ii-Igeta ".
 * @returns The id as this package writes it, or `null` when the set has no such banner.
 * @throws TypeError when `input` is not a string.
 *
 * @example
 * ```ts
 * import { samuraiId } from "@johnmorrisdotca/hata/samurai";
 *
 * console.log(samuraiId(" Ii-Igeta ")); // "samurai:ii-igeta"
 * console.log(samuraiId("nobody"));     // null
 * ```
 */
const samuraiId = (input: string): SamuraiId | null => set.idOf(input) as SamuraiId | null;

/**
 * A banner as an SVG string: it has a viewBox and no width or height, a tall nobori, a flag or the sign of a commander. `frame()` and
 * `toDataUri()` from the main entry take it like any other.
 *
 * @param id - A banner's id, in any case, with or without `samurai:`.
 * @returns The SVG string, loaded when it is asked for (the drawing is a module of its own, so a page carries only the drawings it asks for), or `null` when the set has no such banner.
 * @throws TypeError, as a rejection, when `id` is not a string.
 *
 * @example
 * ```ts
 * import { toDataUri } from "@johnmorrisdotca/hata";
 * import { samuraiFlag } from "@johnmorrisdotca/hata/samurai";
 *
 * const nobori = await samuraiFlag("samurai:sanada-rokumonsen"); // "<svg …>"
 * console.log(nobori === null ? null : toDataUri(nobori)?.startsWith("data:image/svg+xml,"));
 * ```
 */
const samuraiFlag = (id: string): Promise<string | null> => set.flag(id);

/**
 * A banner's name, in English or Japanese: whose it was and what it is. Any language tag that starts with `ja` is Japanese.
 *
 * @param id - A banner's id, in any case, with or without `samurai:`.
 * @param lang - `"en"` (the default), `"ja"`, or a tag such as `"ja-JP"`.
 * @returns The name, or `null` when the set has no such banner.
 * @throws TypeError when `id` is not a string.
 *
 * @example
 * ```ts
 * import { samuraiName } from "@johnmorrisdotca/hata/samurai";
 *
 * console.log(samuraiName("samurai:sanada-rokumonsen"));       // "Sanada: the six-coin nobori"
 * console.log(samuraiName("samurai:sanada-rokumonsen", "ja")); // "真田の六連銭の幟"
 * ```
 */
const samuraiName = (id: string, lang: string = "en"): string | null => set.name(id, lang);

/**
 * What the banner is, in a sentence, in English or Japanese: the design and whose it was.
 *
 * @param id - A banner's id, in any case, with or without `samurai:`.
 * @param lang - `"en"` (the default), `"ja"`, or a tag such as `"ja-JP"`.
 * @returns The sentence, or `null` when the set has no such banner.
 * @throws TypeError when `id` is not a string.
 *
 * @example
 * ```ts
 * import { samuraiAbout } from "@johnmorrisdotca/hata/samurai";
 *
 * console.log(samuraiAbout("samurai:ii-igeta", "ja")); // "赤地に金の井桁。赤で知られた井伊直政の隊の纏です。"
 * ```
 */
const samuraiAbout = (id: string, lang: string = "en"): string | null => set.about(id, lang);

/**
 * A banner's width over its height, from its viewBox: 0.25 for a nobori. For keeping a box before the picture is drawn.
 *
 * @param id - A banner's id, in any case, with or without `samurai:`.
 * @returns The aspect ratio, or `null` when the set has no such banner.
 * @throws TypeError when `id` is not a string.
 *
 * @example
 * ```ts
 * import { samuraiAspect } from "@johnmorrisdotca/hata/samurai";
 *
 * console.log(samuraiAspect("samurai:sanada-rokumonsen")); // 0.25
 * ```
 */
const samuraiAspect = (id: string): number | null => set.aspect(id);

/**
 * Everything the package knows of a banner, a copy: its group (`nobori`, `hata` or `uma`), both names, what it is, its status
 * (`reconstruction` for every banner here), the note that says which part follows the source and which is this package's, and the page the
 * design was read from.
 *
 * @param id - A banner's id, in any case, with or without `samurai:`.
 * @returns The record, or `null` when the set has no such banner.
 * @throws TypeError when `id` is not a string.
 *
 * @example
 * ```ts
 * import { samuraiInfo } from "@johnmorrisdotca/hata/samurai";
 *
 * console.log(samuraiInfo("samurai:ii-igeta")?.status);    // "reconstruction"
 * console.log(samuraiInfo("samurai:ii-igeta")?.note.en);   // what follows the source and what is this package's
 * ```
 */
const samuraiInfo = (id: string): SamuraiInfo | null => set.info(id);

/**
 * The ids of one kind of banner: `nobori` (the tall narrow banners), `hata` (flags) or `uma` (the signs carried beside a commander).
 *
 * @param group - `"nobori"`, `"hata"` or `"uma"`.
 * @returns The ids in the order of the table; an empty list for any other word.
 *
 * @example
 * ```ts
 * import { samuraiIn } from "@johnmorrisdotca/hata/samurai";
 *
 * console.log(samuraiIn("nobori")); // ["samurai:hojo-gosyoku", "samurai:sanada-rokumonsen"]
 * ```
 */
const samuraiIn = (group: string): SamuraiId[] => [...set.inGroup(group)];

export { isSamuraiId, SAMURAI_IDS, samuraiAbout, samuraiAspect, samuraiFlag, samuraiId, samuraiInfo, samuraiIn, samuraiName };
export type { SamuraiId, SamuraiInfo };
