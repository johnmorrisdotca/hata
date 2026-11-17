// The entry @johnmorrisdotca/hata/search: finding flags by what is on them. Each flag's colours as exact hex values
// with the share of the flag each covers, its tags (stripes, stars, a cross, an emblem) with the source of each, and
// the flags that have the colours and the tags asked for. Data only, kept out of the main entry, /load and the
// flags, so that no page pays for it unless it searches.

import { FLAG_ALIASES } from "./data/aliases.data";
import { COLOUR_NAMES as NAMES, COLOURS } from "./data/colours.data";
import { TAG_NAMES, TAG_SOURCES as SOURCES, TAGS } from "./data/tags.data";
import type { ColourName, FlagColour, FlagTag, TagName, TagSource } from "./manifest.types";
import { mustBeString } from "./svg";

/**
 * The names a flag's colour can have, in the order a colour picker shows them: a closed list, so a page can draw a
 * chip for each. Frozen.
 *
 * @example
 * ```ts
 * import { COLOUR_NAMES } from "@johnmorrisdotca/hata/search";
 *
 * console.log(COLOUR_NAMES); // ["red", "orange", "yellow", "green", "light-blue", "blue", "purple", "brown", "black", "grey", "white"]
 * ```
 */
const COLOUR_NAMES: readonly ColourName[] = Object.freeze([...NAMES]);

// A flag "has" a colour when the colours of that name cover at least this share of it, and has "only" the colours
// asked for when no other name covers more than OTHER.
const HAS = 0.01;
const OTHER = 0.03;

const EMPTY: readonly FlagColour[] = Object.freeze([]);
const read = new Map<string, readonly FlagColour[]>();
const coloursAt = (key: string): readonly FlagColour[] => {
  const found = COLOURS[key];
  if (found === undefined) return EMPTY;
  if (typeof found === "string") return coloursAt(found);
  let made = read.get(key);
  if (made === undefined) {
    made = Object.freeze(found.map(([hex, share, name]) => Object.freeze({ hex, share, name: NAMES[name]! })));
    read.set(key, made);
  }

  return made;
};
const NO_TAGS: readonly FlagTag[] = Object.freeze([]);
const readTags = new Map<string, readonly FlagTag[]>();
const tagsAt = (key: string): readonly FlagTag[] => {
  const found = TAGS[key];
  if (found === undefined) return NO_TAGS;
  if (typeof found === "string") return tagsAt(found);
  let made = readTags.get(key);
  if (made === undefined) {
    made = Object.freeze(found.map(([tag, source]) => Object.freeze({ tag: TAG_NAMES[tag]!, source: SOURCES[source]! })));
    readTags.set(key, made);
  }

  return made;
};
const normal = (code: string): string => {
  const written = mustBeString(code, "code").trim().toUpperCase().replace(/_/g, "-");

  return FLAG_ALIASES[written] ?? written;
};

/**
 * A flag's colours, the one that covers most of it first: each an exact hex as the drawing has it, the share of the
 * flag it covers and its name. Measured from the flag's own drawing, never from a frame or a crop
 * (`manifest(code).colours` is the same list).
 *
 * @param code - A flag's code in any case: "JP", "jp-13", "CA_ON"; a former country by its code or one of its aliases.
 * @param options - `variant`: the `id` of another of the place's flags (`variantsOf(code)`), such as Afghanistan's "de-facto".
 * @returns The colours, frozen; an empty list when the code has no flag here, or no such variant.
 * @throws TypeError when `code` or `options.variant` is not a string.
 *
 * @example
 * ```ts
 * import { coloursOf } from "@johnmorrisdotca/hata/search";
 *
 * console.log(coloursOf("JP"));                          // [{ hex: "#ffffff", share: 0.8116, name: "white" }, { hex: "#bc002d", share: 0.1884, name: "red" }]
 * console.log(coloursOf("FR").map((one) => one.name));   // ["blue", "red", "white"]
 * console.log(coloursOf("AF", { variant: "de-facto" })); // the Taliban's flag: white and black
 * console.log(coloursOf("XX"));                          // []
 * ```
 */
const coloursOf = (code: string, options?: { variant?: string }): readonly FlagColour[] => {
  const key = normal(code);
  if (options?.variant === undefined) return coloursAt(key);

  return coloursAt(`${key}--${mustBeString(options.variant, "variant")}`);
};

/**
 * The names a flag's tag can have, in the order `tagsOf` gives them: a closed list, so a page can draw a chip for
 * each. Frozen. docs/tags.md says when each applies.
 *
 * @example
 * ```ts
 * import { FLAG_TAGS } from "@johnmorrisdotca/hata/search";
 *
 * console.log(FLAG_TAGS.includes("stars"), FLAG_TAGS.length); // true 22
 * ```
 */
const FLAG_TAGS: readonly TagName[] = Object.freeze([...TAG_NAMES]);

/**
 * Where a tag can come from, the most trusted first: `reviewed` (a person looked), `computed` (measured from the
 * drawing with no judgement), `wikidata` (the flag's Wikidata item says so) and `unreviewed` (an automated guess
 * nobody has checked). Frozen.
 *
 * @example
 * ```ts
 * import { TAG_SOURCES } from "@johnmorrisdotca/hata/search";
 *
 * console.log(TAG_SOURCES); // ["reviewed", "computed", "wikidata", "unreviewed"]
 * ```
 */
const TAG_SOURCES: readonly TagSource[] = Object.freeze([...SOURCES]);

/**
 * What is on a flag, as tags from the closed list, each with where it comes from. A tag that is `unreviewed` is a
 * guess: show it as one, or leave it out. A flag with no tag yet has an empty list, which does not say it is plain.
 * `manifest(code).tags` has the same tags with what each rests on.
 *
 * @param code - A flag's code in any case: "JP", "jp-13", "CA_ON"; a former country by its code or one of its aliases.
 * @param options - `variant`: the `id` of another of the place's flags (`variantsOf(code)`), such as Afghanistan's "de-facto".
 * @returns The tags, frozen, in the order of `FLAG_TAGS`; an empty list when the code has no flag here, no such variant, or no tag yet.
 * @throws TypeError when `code` or `options.variant` is not a string.
 *
 * @example
 * ```ts
 * import { tagsOf } from "@johnmorrisdotca/hata/search";
 *
 * console.log(tagsOf("DE")); // [{ tag: "plain", source: "computed" }, { tag: "stripes-horizontal", source: "computed" }]
 * console.log(tagsOf("DK")); // [{ tag: "cross", source: "wikidata" }, { tag: "nordic-cross", source: "wikidata" }]
 * console.log(tagsOf("XX")); // []
 * ```
 */
const tagsOf = (code: string, options?: { variant?: string }): readonly FlagTag[] => {
  const key = normal(code);
  if (options?.variant === undefined) return tagsAt(key);

  return tagsAt(`${key}--${mustBeString(options.variant, "variant")}`);
};

/**
 * The flags that have every colour and every tag asked for. A flag has a colour when the colours of that name cover
 * at least 1% of it. With `only`, the flags with those colours and no other: no other name covers more than 3% of
 * the flag, so a small emblem does not keep Mexico out of "green, white and red". A flag has a tag when one of the
 * `sources` gives it: every source when left out, or only the ones named, to leave the guesses out.
 *
 * @param query - `colours`: the names to look for, of `COLOUR_NAMES`. `only`: true to leave out a flag with another
 *   colour. `tags`: the tags to look for, of `FLAG_TAGS`. `sources`: the tag sources that count, of `TAG_SOURCES`.
 *   With no colours and no tags, every flag is found (with `only`, none).
 * @returns The codes, in the order of `FLAG_CODES`; a place's default flag is the one looked at.
 * @throws TypeError when `colours`, `tags` or `sources` is not a list of names of its closed list.
 *
 * @example
 * ```ts
 * import { flagsWith } from "@johnmorrisdotca/hata/search";
 *
 * console.log(flagsWith({ colours: ["red", "white"], only: true }).includes("JP")); // true
 * console.log(flagsWith({ colours: ["green", "white", "orange"], only: true }));    // Ireland, Côte d'Ivoire, India, Niger …
 * console.log(flagsWith({ tags: ["nordic-cross"] }));                               // Denmark, Finland, Iceland, Norway, Sweden …
 * console.log(flagsWith({ tags: ["stripes-horizontal"], sources: ["reviewed", "computed"], colours: ["yellow"] })); // Germany, Ukraine …
 * ```
 */
const flagsWith = (query: { colours?: readonly ColourName[]; only?: boolean; tags?: readonly TagName[]; sources?: readonly TagSource[] }): string[] => {
  const listOf = <T extends string>(given: readonly T[] | undefined, all: readonly T[], what: string, list: string, whenLeftOut: readonly T[]): readonly T[] => {
    if (given === undefined) return whenLeftOut;
    if (!Array.isArray(given) || !given.every((name) => all.includes(name))) throw new TypeError(`${what} must be a list of names of ${list}: ${all.join(", ")}`);

    return given;
  };
  if (typeof query !== "object" || query === null) throw new TypeError("flagsWith takes { colours, only, tags, sources }");
  const asked = listOf(query.colours, NAMES, "colours", "COLOUR_NAMES", []);
  const tags = listOf(query.tags, TAG_NAMES, "tags", "FLAG_TAGS", []);
  const sources = listOf(query.sources, SOURCES, "sources", "TAG_SOURCES", SOURCES);
  const found: string[] = [];
  for (const key of Object.keys(COLOURS)) {
    if (key.includes("--")) continue;
    const shares = new Map<ColourName, number>();
    for (const one of coloursAt(key)) shares.set(one.name, (shares.get(one.name) ?? 0) + one.share);
    if (!asked.every((name) => (shares.get(name) ?? 0) >= HAS)) continue;
    if (query.only === true && [...shares].some(([name, share]) => !asked.includes(name) && share > OTHER)) continue;
    if (tags.length > 0) {
      const has = tagsAt(key);
      if (!tags.every((tag) => has.some((one) => one.tag === tag && sources.includes(one.source)))) continue;
    }
    found.push(key);
  }

  return found;
};

export { COLOUR_NAMES, coloursOf, FLAG_TAGS, flagsWith, TAG_SOURCES, tagsOf };
export type { ColourName, FlagColour, FlagTag, TagName, TagSource };
