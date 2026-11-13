// The entry @johnmorrisdotca/hata/custom: flags a page registers itself (a team, a club, a company, a mark it has the right to show), drawn and looked up like the built-in ones. The package ships none,
// bundles none and sends nothing: a set is handed in by the page as a source of the family's data door (./data-door.ts: its id, its names, its credit and licence), each flag's SVG is checked
// by ./custom-svg.ts, and the id of every flag is `custom:<slug>`, a namespace no ISO 3166 code and no `org:` id can be in. Not imported by the main entry or by /organisations; /load and the element
// import it only when a code begins `custom:`, so a page with no custom flags downloads none of it.

import { checkSvg, hasControl } from "./custom-svg";
import { creditLine, loadRecords, validateSource } from "./data-door";
import type { Credit, RecordSource, SourceInfo } from "./data-door";
import { mustBeString } from "./svg";

/**
 * One custom flag a page gives: its id (`custom:` and a slug), its name, its SVG and, if it likes, a group to be listed under.
 *
 * @example
 * ```ts
 * import type { CustomFlagRecord } from "@johnmorrisdotca/hata/custom";
 *
 * const club: CustomFlagRecord = {
 *   id: "custom:harbour-fc",
 *   name: { en: "Harbour FC", ja: "ハーバーFC" },
 *   group: "Clubs",
 *   svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2"><path fill="#036" d="M0 0h3v2H0z"/></svg>',
 * };
 * console.log(club.id);
 * ```
 */
interface CustomFlagRecord {
  /** `custom:` and a slug: lower-case letters, digits and hyphens, up to 48 characters. */
  id: string;
  /** The name for a caption or a screen reader; the Japanese one may be left out (the English is used). */
  name: { en: string; ja?: string };
  /** The SVG text: allowed elements and attributes only (see `registerFlags`), with a viewBox and no width or height. */
  svg: string;
  /** What it is listed under; `"custom"` when left out. */
  group?: string;
}

/**
 * A set of flags handed in by a page: a records source of the family's data door, whose `info` says whose they are (id, names, credit, licence, page, day) and whose `records()` gives the flags.
 *
 * @example
 * ```ts
 * import type { CustomFlagSource } from "@johnmorrisdotca/hata/custom";
 *
 * const names = (sources: CustomFlagSource[]): string[] => sources.map((source) => source.info.name.en);
 * console.log(names([]));
 * ```
 */
type CustomFlagSource = RecordSource<CustomFlagRecord>;

/**
 * A registered flag as a list shows it: the id, the names, the group, the width over the height and the source it came from. The drawing is `customFlag(id)`.
 *
 * @example
 * ```ts
 * import type { CustomFlagInfo } from "@johnmorrisdotca/hata/custom";
 *
 * const label = (flag: CustomFlagInfo): string => `${flag.id}: ${flag.name.en}`;
 * console.log(label({ id: "custom:a", name: { en: "A", ja: "A" }, group: "custom", aspect: 1.5, source: "mine" }));
 * ```
 */
interface CustomFlagInfo {
  id: string;
  name: { en: string; ja: string };
  group: string;
  aspect: number;
  source: string;
}

/**
 * What registering a set did: the flags added, the records left out with the reason each was (never drawn), and a way to take the set out again.
 *
 * @example
 * ```ts
 * import type { FlagsRegistered } from "@johnmorrisdotca/hata/custom";
 *
 * const say = (done: FlagsRegistered): string => `${done.status}: ${done.added.length} added, ${done.rejected.length} left out`;
 * console.log(typeof say);
 * ```
 */
interface FlagsRegistered {
  /** `"ok"`, `"failed"` (the source threw, or gave a list over the limit: nothing added) or `"aborted"`. */
  status: "ok" | "failed" | "aborted";
  /** The source's id. */
  source: string;
  /** The ids added, in order. */
  added: string[];
  /** How many records were left out. */
  skipped: number;
  /** Each record left out, with its id as given (or `null`) and why. */
  rejected: { id: string | null; reason: string }[];
  /** Why a read failed. */
  reason?: string;
  /** Takes the whole set out again; the same as `removeFlags(source)`. */
  remove(): void;
}

/**
 * The group a flag is listed under when its record names none.
 *
 * @example
 * ```ts
 * import { CUSTOM_GROUP } from "@johnmorrisdotca/hata/custom";
 *
 * console.log(CUSTOM_GROUP); // "custom"
 * ```
 */
const CUSTOM_GROUP = "custom";
/**
 * The most custom flags a page may hold at once, over all its sets.
 *
 * @example
 * ```ts
 * import { MAX_CUSTOM_FLAGS } from "@johnmorrisdotca/hata/custom";
 *
 * console.log(MAX_CUSTOM_FLAGS); // 1000
 * ```
 */
const MAX_CUSTOM_FLAGS = 1000;

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

interface Held {
  info: CustomFlagInfo;
  svg: string;
}
interface FlagSet {
  info: SourceInfo;
  enabled: boolean;
  flags: Map<string, Held>;
}

// Page-wide: the sets by source id, and which set holds each flag id.
const SETS = new Map<string, FlagSet>();
const OWNER = new Map<string, string>();

const slugOf = (id: string): string => id.slice("custom:".length);
const lower = (text: string): string => text.toLowerCase();

const readRecord = (record: unknown): { id: string; name: { en: string; ja: string }; svg: string; aspect: number; group: string } => {
  if (typeof record !== "object" || record === null) throw new TypeError("a record must be an object");
  const { id, name, svg, group } = record as Partial<CustomFlagRecord> & Record<string, unknown>;
  if (typeof id !== "string" || !id.startsWith("custom:") || !SLUG.test(slugOf(id)) || slugOf(id).length > 48) {
    throw new TypeError(`the id must be "custom:" and a slug of lower-case letters, digits and hyphens (up to 48): ${JSON.stringify(id)} (a country code, a region code and an "org:" id are never a custom flag's)`);
  }
  const en = (name as { en?: unknown } | undefined)?.en;
  const ja = (name as { ja?: unknown } | undefined)?.ja;
  if (typeof en !== "string" || en.trim() === "" || en.length > 120) throw new TypeError("name.en must be a text of 1 to 120 characters");
  if (ja !== undefined && (typeof ja !== "string" || ja.trim() === "" || ja.length > 120)) throw new TypeError("name.ja must be a text of 1 to 120 characters, or left out");
  if (group !== undefined && (typeof group !== "string" || group.trim() === "" || group.length > 48 || hasControl(group))) throw new TypeError("group must be a text of 1 to 48 characters, or left out");
  const checked = checkSvg(svg, slugOf(id));

  return { id, name: { en: en.trim(), ja: (ja ?? en).trim() }, svg: checked.svg, aspect: checked.aspect, group: (group ?? CUSTOM_GROUP).trim() };
};

const count = (): number => [...SETS.values()].reduce((sum, one) => sum + one.flags.size, 0);

/**
 * Registers a set of flags a page brings: the source is checked at once (a `TypeError` for an empty credit, no licence, a bad id, a set id already registered, or a source that is not a records source), its
 * records are read once, and each record is checked on its own. A record that is not allowed is left out and listed in `rejected` with the reason, never drawn part-cleaned; a source that throws, or holds more than
 * 200,000 records, adds nothing and says so. A flag's id is `custom:<slug>`; one already held by another set is left out (the first keeps it), and so is any id that is not in that form, which is how a country's
 * code or an `org:` id can never be shadowed. At most 1,000 flags in all.
 *
 * What an SVG may hold: `svg g defs symbol path rect circle ellipse line polyline polygon use linearGradient radialGradient stop clipPath mask title desc`; the usual drawing attributes (`fill`, `stroke`, `d`,
 * `transform`, `viewBox` and so on) read by a rule each; `href` and `url()` only as a `#id` in the same file, the id there. No scripts, styles, images, links, animation, filters, text, `foreignObject`, event
 * attributes or prefixed names; no `data:` or `javascript:`; no character references (`&#…;`) and no entity but `&amp; &lt; &gt; &quot; &apos;` in a title or description; a viewBox and no width or height on the
 * root; 64 KiB, 32 levels and 4,000 elements (each `<use>` counted as what it points to) at most; xmlns exactly the SVG namespace. The SVG drawn is written again from what was read, with its ids made `custom-<slug>-<id>`.
 *
 * @param source - The set: a records source of the data door (`kind: "records"`, `info`, `records()`).
 * @param options - `signal`, to stop reading a slow source.
 * @returns A promise of what was done.
 * @throws TypeError (rejects) when the source itself is not allowed.
 *
 * @example
 * ```ts
 * import { customCreditLine, customFlag, registerFlags } from "@johnmorrisdotca/hata/custom";
 *
 * const done = await registerFlags({
 *   kind: "records",
 *   info: {
 *     id: "my-club",
 *     name: { en: "My club", ja: "私のクラブ" },
 *     credit: { en: "Harbour FC crest, drawn by the club", ja: "ハーバーFCの紋章（クラブ作成）" },
 *     licence: { name: "Used with the club's permission", url: "https://example.org/permission" },
 *     url: "https://example.org/club",
 *     retrieved: "2026-11-13",
 *   },
 *   records: () => [{ id: "custom:harbour-fc", name: { en: "Harbour FC" }, svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2"><path fill="#036" d="M0 0h3v2H0z"/></svg>' }],
 * });
 * console.log(done.added, customFlag("custom:harbour-fc")?.startsWith("<svg"), customCreditLine("en"));
 * done.remove();
 * ```
 */
const registerFlags = async (source: CustomFlagSource, options: { signal?: AbortSignal } = {}): Promise<FlagsRegistered> => {
  validateSource(source, SETS.keys());
  if (source.kind !== "records") throw new TypeError(`source "${source.info.id}": a set of flags is a records source`);
  const id = source.info.id;
  // The id is held from now, so a second registration while this one reads is refused too.
  const held: FlagSet = { info: source.info, enabled: true, flags: new Map() };
  SETS.set(id, held);
  const done: FlagsRegistered = { status: "ok", source: id, added: [], skipped: 0, rejected: [], remove: () => removeFlags(id) };
  const controller = new AbortController();
  options.signal?.addEventListener("abort", () => controller.abort(), { once: true });
  const read = await loadRecords(source, controller.signal);
  if (read.status !== "ok" || SETS.get(id) !== held) {
    if (SETS.get(id) === held) SETS.delete(id);
    done.status = read.status === "ok" ? "aborted" : read.status;
    if (read.reason !== undefined) done.reason = read.reason;
    done.skipped = 0;
    return done;
  }
  for (const record of read.records) {
    const given = typeof (record as { id?: unknown } | null)?.id === "string" ? (record as { id: string }).id : null;
    try {
      const one = readRecord(record);
      const owner = OWNER.get(one.id);
      if (owner !== undefined) throw new TypeError(`${one.id} is already held by the set "${owner}"`);
      if (count() >= MAX_CUSTOM_FLAGS) throw new TypeError(`a page holds at most ${MAX_CUSTOM_FLAGS} custom flags`);
      held.flags.set(one.id, { info: { id: one.id, name: one.name, group: one.group, aspect: one.aspect, source: id }, svg: one.svg });
      OWNER.set(one.id, id);
      done.added.push(one.id);
    } catch (error) {
      done.rejected.push({ id: given, reason: error instanceof Error ? error.message : String(error) });
    }
  }
  done.skipped = done.rejected.length;

  return done;
};

/**
 * Takes a registered set out: its flags are no longer found, listed or drawn, and its id can be registered again.
 *
 * @param sourceId - The set's id, as in its `info.id`.
 * @returns `true` when there was such a set.
 * @throws TypeError when `sourceId` is not a string.
 *
 * @example
 * ```ts
 * import { removeFlags } from "@johnmorrisdotca/hata/custom";
 *
 * console.log(removeFlags("no-such-set")); // false
 * ```
 */
const removeFlags = (sourceId: string): boolean => {
  const found = SETS.get(mustBeString(sourceId, "sourceId"));
  if (found === undefined) return false;
  for (const flagId of found.flags.keys()) OWNER.delete(flagId);
  SETS.delete(sourceId);

  return true;
};

/**
 * Switches a registered set off or on without forgetting it: while off, its flags are not found, listed or credited.
 *
 * @param sourceId - The set's id.
 * @param on - `true` to show it (the default), `false` to hide it.
 * @returns `true` when there was such a set.
 * @throws TypeError when `sourceId` is not a string.
 *
 * @example
 * ```ts
 * import { enableFlags } from "@johnmorrisdotca/hata/custom";
 *
 * console.log(enableFlags("no-such-set", false)); // false
 * ```
 */
const enableFlags = (sourceId: string, on: boolean = true): boolean => {
  const found = SETS.get(mustBeString(sourceId, "sourceId"));
  if (found === undefined) return false;
  found.enabled = on;

  return true;
};

const find = (id: string): Held | undefined => {
  const owner = OWNER.get(lower(mustBeString(id, "id").trim()));
  const set = owner === undefined ? undefined : SETS.get(owner);

  return set?.enabled === true ? set.flags.get(lower(id.trim())) : undefined;
};

/**
 * True for a string written as a custom flag's id, `custom:` and a slug; it says nothing of whether such a flag is registered (`customFlag` does).
 *
 * @param value - Anything.
 * @returns `true` for `"custom:harbour-fc"`, `false` for anything else, never throwing.
 *
 * @example
 * ```ts
 * import { isCustomId } from "@johnmorrisdotca/hata/custom";
 *
 * console.log(isCustomId("custom:harbour-fc")); // true
 * console.log(isCustomId("JP"));                // false
 * console.log(isCustomId("org:eu"));            // false
 * ```
 */
const isCustomId = (value: unknown): boolean => typeof value === "string" && value.startsWith("custom:") && SLUG.test(slugOf(value)) && slugOf(value).length <= 48;

/**
 * A custom flag's id, from one written loosely (either case, spaces around it) and registered: `"custom:harbour-fc"`. The `custom:` may not be left off, so a bare code is never read as one.
 *
 * @param input - An id, in any case.
 * @returns The id as registered, or `null` when it is none or is not registered (or its set is off).
 * @throws TypeError when `input` is not a string.
 *
 * @example
 * ```ts
 * import { customId } from "@johnmorrisdotca/hata/custom";
 *
 * console.log(customId(" CUSTOM:Nothing-here ")); // null: nothing registered
 * ```
 */
const customId = (input: string): string | null => find(input)?.info.id ?? null;

/**
 * A registered custom flag's SVG, the checked and rewritten one, with a viewBox and no width or height, like a country's: `frame()` and `toDataUri()` from the main entry take it.
 *
 * @param id - The flag's id, in any case.
 * @returns The SVG string, or `null` when no such flag is registered.
 * @throws TypeError when `id` is not a string.
 *
 * @example
 * ```ts
 * import { customFlag } from "@johnmorrisdotca/hata/custom";
 *
 * console.log(customFlag("custom:nothing-here")); // null
 * ```
 */
const customFlag = (id: string): string | null => find(id)?.svg ?? null;

/**
 * A custom flag's name, in English or Japanese (any tag that starts `ja`); the English where no Japanese was given.
 *
 * @param id - The flag's id, in any case.
 * @param lang - `"en"` (the default), `"ja"` or a tag such as `"ja-JP"`.
 * @returns The name, or `null` when no such flag is registered.
 * @throws TypeError when `id` is not a string.
 *
 * @example
 * ```ts
 * import { customName } from "@johnmorrisdotca/hata/custom";
 *
 * console.log(customName("custom:nothing-here", "ja")); // null
 * ```
 */
const customName = (id: string, lang: string = "en"): string | null => {
  const found = find(id);
  if (found === undefined) return null;

  return /^ja\b/i.test(String(lang)) ? found.info.name.ja : found.info.name.en;
};

/**
 * A custom flag's width over its height, from its viewBox, for keeping a box before it is drawn.
 *
 * @param id - The flag's id, in any case.
 * @returns The aspect ratio, or `null` when no such flag is registered.
 * @throws TypeError when `id` is not a string.
 *
 * @example
 * ```ts
 * import { customAspect } from "@johnmorrisdotca/hata/custom";
 *
 * console.log(customAspect("custom:nothing-here")); // null
 * ```
 */
const customAspect = (id: string): number | null => find(id)?.info.aspect ?? null;

/**
 * The flags registered and on, in the order they were added, each as `{ id, name, group, aspect, source }`; only one group's with `group`.
 *
 * @param options - `group`, to list one group's flags (`"custom"` is the default group).
 * @returns The list: empty when nothing is registered.
 *
 * @example
 * ```ts
 * import { listCustomFlags } from "@johnmorrisdotca/hata/custom";
 *
 * console.log(listCustomFlags({ group: "Clubs" }).map((flag) => flag.id));
 * ```
 */
const listCustomFlags = (options: { group?: string } = {}): CustomFlagInfo[] =>
  [...SETS.values()].filter((set) => set.enabled).flatMap((set) => [...set.flags.values()].map((one) => ({ ...one.info, name: { ...one.info.name } }))).filter((one) => options.group === undefined || one.group === options.group);

/**
 * The groups of the flags registered and on, in the order each first appears, with the ids in each: for a picker that shows custom flags beside the built-in ones.
 *
 * @returns `[{ group, ids }]`: empty when nothing is registered.
 *
 * @example
 * ```ts
 * import { customGroups } from "@johnmorrisdotca/hata/custom";
 *
 * for (const { group, ids } of customGroups()) console.log(group, ids.length);
 * ```
 */
const customGroups = (): { group: string; ids: string[] }[] => {
  const groups = new Map<string, string[]>();
  for (const one of listCustomFlags()) groups.set(one.group, [...(groups.get(one.group) ?? []), one.id]);

  return [...groups].map(([group, ids]) => ({ group, ids }));
};

/**
 * Finds registered flags by a word: in the id's slug, the names (English and Japanese) and the group, ignoring case; the best first (exact, then a start, then anywhere), then in the order added.
 *
 * @param query - The words typed; an empty text finds none.
 * @returns The matching flags, as `listCustomFlags` gives them.
 * @throws TypeError when `query` is not a string.
 *
 * @example
 * ```ts
 * import { searchCustomFlags } from "@johnmorrisdotca/hata/custom";
 *
 * console.log(searchCustomFlags("harbour").map((flag) => flag.id));
 * ```
 */
const searchCustomFlags = (query: string): CustomFlagInfo[] => {
  const wanted = lower(mustBeString(query, "query").trim());
  if (wanted === "") return [];
  const score = (one: CustomFlagInfo): number => {
    const fields = [slugOf(one.id), lower(one.name.en), lower(one.name.ja), lower(one.group)];
    if (fields.some((field) => field === wanted)) return 3;
    if (fields.some((field) => field.startsWith(wanted))) return 2;

    return fields.some((field) => field.includes(wanted)) ? 1 : 0;
  };
  const all = listCustomFlags();

  return all.map((one, order) => ({ one, order, hit: score(one) })).filter((entry) => entry.hit > 0).sort((a, b) => b.hit - a.hit || a.order - b.order).map((entry) => entry.one);
};

// One credit for each set that is on and holds a flag.
const customCredits = (): Credit[] => [...SETS.values()].filter((set) => set.enabled && set.flags.size > 0).map((set) => ({ source: set.info, own: false, used: set.flags.size }));

/**
 * Whose flags are on a page, as one line: each set that is on and holds a flag, with its credit and its licence beside it (and "non-commercial" or "share-alike" where the set says so), in English or Japanese.
 *
 * @param language - `"en"` (the default) or `"ja"`.
 * @returns The line, or an empty text when no custom flag is on.
 *
 * @example
 * ```ts
 * import { customCreditLine } from "@johnmorrisdotca/hata/custom";
 *
 * console.log(customCreditLine("ja") === ""); // true when nothing is registered
 * ```
 */
const customCreditLine = (language: "en" | "ja" = "en"): string => creditLine(customCredits(), language === "ja" ? "ja" : "en");

export {
  customAspect,
  customCreditLine,
  customFlag,
  customGroups,
  customId,
  customName,
  CUSTOM_GROUP,
  enableFlags,
  isCustomId,
  listCustomFlags,
  MAX_CUSTOM_FLAGS,
  registerFlags,
  removeFlags,
  searchCustomFlags,
};
export type { CustomFlagInfo, CustomFlagRecord, CustomFlagSource, FlagsRegistered };
