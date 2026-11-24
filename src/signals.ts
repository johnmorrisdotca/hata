// The entry @johnmorrisdotca/hata/signals: the flags of the International Code of Signals (the 26 alphabet flags, the 10 numeral
// pennants, the 3 substitutes and the answering pennant), drawn for this package from the Code's own plate and kept apart from the
// countries' flags. Ids are `ics:<slug>` ("ics:a", "ics:0", "ics:sub-1", "ics:answer"), a namespace no ISO 3166 code can be in.
// Every drawing is one record in sets/signals.data.ts, made by scripts/draw-signals.ts.
//
// Every function is pure and works on strings: no DOM, no network, the same answer on a server and in a browser.

import { drawnSet } from "./drawn";
import type { DrawnInfo } from "./drawn";
import { SIGNALS, SIGNALS_LOADERS } from "./sets/signals.data";
import { mustBeString } from "./svg";

const set = drawnSet("ics", SIGNALS, SIGNALS_LOADERS);

/**
 * What the package knows of one flag of the Code: its id, group, both names, meaning, status, note, source and aspect ratio.
 *
 * @example
 * ```ts
 * import { signalInfo, type SignalInfo } from "@johnmorrisdotca/hata/signals";
 *
 * const info: SignalInfo | null = signalInfo("ics:a");
 * console.log(info?.name.en);
 * ```
 */
type SignalInfo = DrawnInfo;

/**
 * The id of one of the Code's flags, written exactly as this package writes it: `ics:` and a lower-case slug. A letter is `ics:a`
 * to `ics:z`, a numeral pennant `ics:0` to `ics:9`, a substitute `ics:sub-1` to `ics:sub-3` and the answering pennant `ics:answer`.
 * No country or region code contains a colon, so none of these can be taken for one.
 *
 * @example
 * ```ts
 * import { type SignalId } from "@johnmorrisdotca/hata/signals";
 *
 * const diver: SignalId = "ics:a";
 * console.log(diver);
 * ```
 */
type SignalId = (typeof SIGNALS)[number]["id"];

/**
 * Every id of the set, in the order of the Code's plate: the letters, the numeral pennants, the substitutes, then the answering pennant.
 *
 * @example
 * ```ts
 * import { SIGNAL_IDS } from "@johnmorrisdotca/hata/signals";
 *
 * console.log(SIGNAL_IDS.length); // 40
 * ```
 */
const SIGNAL_IDS: readonly SignalId[] = set.ids;

/**
 * True for an id of this set, written exactly as this package writes it ("ics:a"). A country's code ("JP") is not one.
 *
 * @param value - Anything.
 * @returns `true` when `value` is a string in `SIGNAL_IDS`, and `false` for anything else, never throwing.
 *
 * @example
 * ```ts
 * import { isSignalId } from "@johnmorrisdotca/hata/signals";
 *
 * console.log(isSignalId("ics:a")); // true
 * console.log(isSignalId("A"));     // false: see signalId
 * ```
 */
const isSignalId = (value: unknown): value is SignalId => set.isId(value);

/**
 * The id of a flag from an id written loosely: either case, with spaces around it, with or without `ics:`.
 *
 * @param input - "A", " a ", "ics:A", "7", "answer".
 * @returns The id as this package writes it (`"ics:a"`), or `null` when the Code has no such flag.
 * @throws TypeError when `input` is not a string.
 *
 * @example
 * ```ts
 * import { signalId } from "@johnmorrisdotca/hata/signals";
 *
 * console.log(signalId(" A "));    // "ics:a"
 * console.log(signalId("ics:7"));  // "ics:7"
 * console.log(signalId("ics:xx")); // null
 * ```
 */
const signalId = (input: string): SignalId | null => set.idOf(input) as SignalId | null;

/**
 * A flag as an SVG string: it has a viewBox and no width or height, a square-ish letter flag, a tapering numeral pennant, a
 * triangular substitute. `frame()` and `toDataUri()` from the main entry take it like any other.
 *
 * @param id - A flag's id, in any case, with or without `ics:` ("ics:a", "A").
 * @returns The SVG string, loaded when it is asked for (the drawing is a module of its own, so a page carries only the drawings it asks for), or `null` when the Code has no such flag.
 * @throws TypeError, as a rejection, when `id` is not a string.
 *
 * @example
 * ```ts
 * import { toDataUri } from "@johnmorrisdotca/hata";
 * import { signalFlag } from "@johnmorrisdotca/hata/signals";
 *
 * const alfa = await signalFlag("ics:a"); // "<svg …>"
 * console.log(alfa === null ? null : toDataUri(alfa)?.startsWith("data:image/svg+xml,"));
 * ```
 */
const signalFlag = (id: string): Promise<string | null> => set.flag(id);

/**
 * A flag's name, in English or Japanese: the letter and its word ("A: Alfa", "A旗（アルファ）"), the figure and its word, a substitute or
 * the answering pennant. Any language tag that starts with `ja` is Japanese.
 *
 * @param id - A flag's id, in any case, with or without `ics:`.
 * @param lang - `"en"` (the default), `"ja"`, or a tag such as `"ja-JP"`.
 * @returns The name, or `null` when the Code has no such flag.
 * @throws TypeError when `id` is not a string.
 *
 * @example
 * ```ts
 * import { signalName } from "@johnmorrisdotca/hata/signals";
 *
 * console.log(signalName("ics:a"));       // "A: Alfa"
 * console.log(signalName("ics:a", "ja")); // "A旗（アルファ）"
 * ```
 */
const signalName = (id: string, lang: string = "en"): string | null => set.name(id, lang);

/**
 * What the flag means, as the Code gives it for a letter, or what it does for a figure, a substitute or the answering pennant, in English or
 * Japanese. The English of a letter is the Code's own words (Pub. 102, "Single letter signals").
 *
 * @param id - A flag's id, in any case, with or without `ics:`.
 * @param lang - `"en"` (the default), `"ja"`, or a tag such as `"ja-JP"`.
 * @returns The meaning, or `null` when the Code has no such flag.
 * @throws TypeError when `id` is not a string.
 *
 * @example
 * ```ts
 * import { signalMeaning } from "@johnmorrisdotca/hata/signals";
 *
 * console.log(signalMeaning("ics:a"));       // "I have a diver down; keep well clear at slow speed."
 * console.log(signalMeaning("ics:a", "ja")); // "ダイバーが潜水中です。十分に離れ、低速で航行してください。"
 * ```
 */
const signalMeaning = (id: string, lang: string = "en"): string | null => set.about(id, lang);

/**
 * A flag's width over its height, from its viewBox: 1.2 for a letter flag, 3.5 for a numeral pennant. For keeping a box before the
 * picture is drawn.
 *
 * @param id - A flag's id, in any case, with or without `ics:`.
 * @returns The aspect ratio, or `null` when the Code has no such flag.
 * @throws TypeError when `id` is not a string.
 *
 * @example
 * ```ts
 * import { signalAspect } from "@johnmorrisdotca/hata/signals";
 *
 * console.log(signalAspect("ics:a")); // 1.2
 * console.log(signalAspect("ics:0")); // 3.5
 * ```
 */
const signalAspect = (id: string): number | null => set.aspect(id);

/**
 * Everything the package knows of a flag: its group (`letter`, `numeral`, `substitute` or `answer`), both names, its meaning, its status
 * (`official`: the design is the Code's own), a note on how it was drawn, the page it was read from and its aspect ratio. A copy.
 *
 * @param id - A flag's id, in any case, with or without `ics:`.
 * @returns The record, or `null` when the Code has no such flag.
 * @throws TypeError when `id` is not a string.
 *
 * @example
 * ```ts
 * import { signalInfo } from "@johnmorrisdotca/hata/signals";
 *
 * console.log(signalInfo("ics:a")?.group);       // "letter"
 * console.log(signalInfo("ics:a")?.source.kind); // "official"
 * ```
 */
const signalInfo = (id: string): DrawnInfo | null => set.info(id);

/**
 * The flags that spell a text, one for each letter or figure and none for anything else (spaces, punctuation, letters outside A to Z): a
 * hoist for a name or a number. It repeats a letter and uses no substitute; the Code's rule for substitutes is a matter for the signaller.
 *
 * @param text - Any text; case is ignored.
 * @returns The ids, in order.
 * @throws TypeError when `text` is not a string.
 *
 * @example
 * ```ts
 * import { signalsFor } from "@johnmorrisdotca/hata/signals";
 *
 * console.log(signalsFor("Hata 7")); // ["ics:h", "ics:a", "ics:t", "ics:a", "ics:7"]
 * ```
 */
const signalsFor = (text: string): SignalId[] =>
  [...mustBeString(text, "text").toLowerCase()].flatMap((character) => {
    const id = /^[a-z0-9]$/.test(character) ? (set.idOf(character) as SignalId | null) : null;

    return id === null ? [] : [id];
  });

export { isSignalId, SIGNAL_IDS, signalAspect, signalFlag, signalId, signalInfo, signalMeaning, signalName, signalsFor };
export type { SignalId, SignalInfo };
