// The entry @johnmorrisdotca/hata/search: finding flags by what is on them. Each flag's colours as exact hex values
// with the share of the flag each covers, and the flags that have the colours asked for. Data only (about 30 KB),
// kept out of the main entry, /load and the flags, so that no page pays for it unless it searches.

import { FLAG_ALIASES } from "./data/aliases.data";
import { COLOUR_NAMES as NAMES, COLOURS } from "./data/colours.data";
import type { ColourName, FlagColour } from "./manifest.types";
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
 * The flags that have every colour asked for, by name: each of the names covers at least 1% of the flag. With `only`,
 * the flags that have those colours and no other: no other name covers more than 3% of the flag, so a small emblem
 * does not keep Mexico out of "green, white and red".
 *
 * @param query - `colours`: the names to look for, of `COLOUR_NAMES`; an empty list finds every flag (with `only`,
 *   none). `only`: true to leave out a flag with another colour.
 * @returns The codes, in the order of `FLAG_CODES`; a place's default flag is the one looked at.
 * @throws TypeError when `colours` is not a list of names of `COLOUR_NAMES`.
 *
 * @example
 * ```ts
 * import { flagsWith } from "@johnmorrisdotca/hata/search";
 *
 * console.log(flagsWith({ colours: ["red", "white"], only: true }).includes("JP")); // true
 * console.log(flagsWith({ colours: ["green", "white", "orange"], only: true }));    // Ireland, Côte d'Ivoire, India, Niger …
 * console.log(flagsWith({ colours: ["purple"] }).length);                           // not many
 * ```
 */
const flagsWith = (query: { colours: readonly ColourName[]; only?: boolean }): string[] => {
  const asked = query?.colours;
  if (!Array.isArray(asked) || !asked.every((name) => NAMES.includes(name))) throw new TypeError(`colours must be a list of names of COLOUR_NAMES: ${NAMES.join(", ")}`);
  const found: string[] = [];
  for (const key of Object.keys(COLOURS)) {
    if (key.includes("--")) continue;
    const shares = new Map<ColourName, number>();
    for (const one of coloursAt(key)) shares.set(one.name, (shares.get(one.name) ?? 0) + one.share);
    if (!asked.every((name) => (shares.get(name) ?? 0) >= HAS)) continue;
    if (query.only === true && [...shares].some(([name, share]) => !asked.includes(name) && share > OTHER)) continue;
    found.push(key);
  }

  return found;
};

export { COLOUR_NAMES, coloursOf, flagsWith };
export type { ColourName, FlagColour };
