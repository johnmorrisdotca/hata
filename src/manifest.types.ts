// The shapes of the manifest's records: where a flag comes from and under what licence, and why a code has none.

import type { Framing, FramingCrop } from "./manifest-framing.types";

/**
 * The kinds of licence a shipped drawing can be under: for a Wikimedia Commons file, as Commons states it,
 * `public-domain` (PD-… templates: a government work, or a design too simple to be copyrighted), `cc0`, or `cc-by`
 * (credit asked; NOTICE.md gives it), or `accepted` (another licence the maintainer decided to accept, written in the
 * licence's name: Mississippi's "Copyrighted free use"); for a flag set's drawing, `mit` (the set's notice is in NOTICE.md).
 *
 * @example
 * ```ts
 * import { MANIFEST, type LicenceKind } from "@johnmorrisdotca/hata/manifest";
 *
 * const credit: LicenceKind[] = ["cc-by", "mit"];
 * console.log(MANIFEST.filter((one) => credit.includes(one.licence.kind)));
 * ```
 */
type LicenceKind = "public-domain" | "cc0" | "cc-by" | "accepted" | "mit";

/**
 * Where a drawing comes from: Wikimedia Commons (the file Wikidata names as the place's flag), or one of the MIT
 * flag sets, chosen where it draws the same flag at its true proportions and is smaller, or is free where
 * Commons' file is not.
 *
 * @example
 * ```ts
 * import { MANIFEST, type FlagSource } from "@johnmorrisdotca/hata/manifest";
 *
 * const fromSets: FlagSource[] = ["flag-icons", "country-flag-icons"];
 * console.log(MANIFEST.filter((one) => fromSets.includes(one.source)).map((one) => one.code)); // ["YE"]
 * ```
 */
type FlagSource = "commons" | "flag-icons" | "country-flag-icons";

/**
 * Where one flag's drawing comes from, under what licence, and why that drawing was chosen.
 *
 * @example
 * ```ts
 * import { manifest, type FlagRecord } from "@johnmorrisdotca/hata/manifest";
 *
 * const tokyo: FlagRecord | null = manifest("JP-13");
 * if (tokyo !== null) console.log(tokyo.page, tokyo.licence.name, tokyo.width / tokyo.height);
 * ```
 */
interface FlagRecord {
  /** The code, as Kuni writes it: "JP", "JP-13", "CA-ON", "US-TX". */
  code: string;
  /** Where the drawing comes from: `commons`, `flag-icons` or `country-flag-icons`. */
  source: FlagSource;
  /** The file: its name on Commons without "File:", or its path in the flag set ("3x2/YE.svg"). */
  file: string;
  /** Where to see it: the file's page on Commons, with its licence and history, or the set's file on jsDelivr at its version. */
  page: string;
  /** The flag set's version the drawing is from; null for Commons. */
  version: string | null;
  /** The Wikidata item whose flag image (P41) names the file: "Q17"; null for a former state that has no item here, whose Commons file is named by hand (HISTORICAL in scripts/data-config.ts). */
  wikidata: string | null;
  /** The licence: its kind, its name ("Public domain", "CC BY 4.0", "MIT") and its address where it has one. */
  licence: { kind: LicenceKind; name: string; url: string | null };
  /** The author: as Commons' Artist field gives it, in plain text, or the set's copyright line; where Commons' field is empty, the author the file's description page names, or "Unknown author" where it names none (docs/decisions.md). Every shipped flag has one; null is kept for a record that has none. */
  author: string | null;
  /** The credit line Commons gives, in plain text; null where there is none. */
  credit: string | null;
  /** True where the licence asks for credit (Commons says so, or the set's MIT notice must travel with it). */
  attributionRequired: boolean;
  /** Restrictions Commons notes on the flag apart from copyright, as it spells them: "insignia", "trademarked". */
  restrictions: string[];
  /** The licence and restriction templates on the Commons file's page, without "Template:"; empty for a set's drawing. */
  templates: string[];
  /** The day the Commons file's current version was uploaded, YYYY-MM-DD; null for a set's drawing. */
  uploaded: string | null;
  /** The day Wikidata and Commons were read for this package, YYYY-MM-DD. */
  fetched: string;
  /** Where the drawing is a set's: the Commons file Wikidata names, which it was compared with, and that file's licence. Null for Commons. */
  reference: { file: string; page: string; licence: string } | null;
  /** Why this drawing was chosen over the others, in a sentence or two. */
  why: string;
  /** The code whose picture this is, where two places fly one flag (Bouvet Island flies Norway's); null otherwise. */
  sameAs: string | null;
  /** The viewBox's width: the flag's aspect ratio is width / height. */
  width: number;
  /** The viewBox's height. */
  height: number;
  /** The size of the optimised SVG, in bytes. */
  bytes: number;
  /** Its size gzipped at level 9, in bytes. */
  gzip: number;
  /** Things worth knowing about the picture: text drawn with a font, an embedded raster picture. */
  notes: string[];
  /** The flag's colours, the one that covers most of it first, each an exact hex with its share of the flag and its name; see `FlagColour`. */
  colours: FlagColour[];
  /** What is on the flag, as tags from a closed list, each with where it comes from and what it rests on; see `FlagTagRecord`. */
  tags: FlagTagRecord[];
  /** True where more than one authority or community claims the place's flag at the same time (Afghanistan, Northern Ireland); this package takes no side, and says why each default was chosen (README). */
  disputed: boolean;
  /** The `id` of the variant `flag(code)` gives; null where the place has one flag (`variants` is then empty) or none of its own by default. */
  defaultVariant: string | null;
  /** Every flag of the place in real use, the default's included, each with its status and reason; empty where the place has one flag. See `Variant`. */
  variants: Variant[];
  /** How the flag is framed at 4:3, square and round by `flag(code, { shape })`, and by `frame()`; see `Framing`. */
  framings: Record<"4:3" | "1:1" | "round", Framing>;
  /** Only for a former country (the Soviet Union, East Germany, Yugoslavia): the years it existed and the other codes that find it. Absent for every present-day place. See `HistoricalEra`. */
  historical?: HistoricalEra;
}

/**
 * The names a flag's colour can have: a closed list of the words a person uses of a flag ("red, white and blue"). Two
 * blues are both `blue`, and the hex says which; `light-blue` is the sky blue of Argentina's flag or the United Nations'.
 *
 * @example
 * ```ts
 * import { manifest, type ColourName } from "@johnmorrisdotca/hata/manifest";
 *
 * const names: ColourName[] = (manifest("FR")?.colours ?? []).map((one) => one.name);
 * console.log(names); // ["blue", "red", "white"]
 * ```
 */
type ColourName = "red" | "orange" | "yellow" | "green" | "light-blue" | "blue" | "purple" | "brown" | "black" | "grey" | "white";

/**
 * One colour of a flag, measured from the shipped drawing (the flag's own, never a frame or a crop) drawn 1200 pixels
 * wide: every pixel counted by its exact colour, the smoothed edges and the steps of a gradient given to the nearest
 * colour that covers at least 0.1% of the flag (`pnpm data:colours`, scripts/colours.mjs).
 *
 * @example
 * ```ts
 * import { manifest, type FlagColour } from "@johnmorrisdotca/hata/manifest";
 *
 * const japan: FlagColour[] = manifest("JP")?.colours ?? [];
 * console.log(japan); // [{ hex: "#ffffff", share: 0.8116, name: "white" }, { hex: "#bc002d", share: 0.1884, name: "red" }]
 * ```
 */
interface FlagColour {
  /** The colour as the drawing has it, `#rrggbb` in lower case. */
  hex: string;
  /** The share of the flag's drawn area it covers, from 0 to 1, to four decimals. */
  share: number;
  /** The nearest name of the closed list: see `ColourName`. */
  name: ColourName;
}

/**
 * The names a flag's tag can have: a closed list of the things a person sees on a flag. `plain` is flat fields of
 * colour with nothing drawn on them; `emblem` is any seal, badge, shield or device, a coat of arms included; a
 * Nordic cross is a `cross` too. docs/tags.md says when each applies.
 *
 * @example
 * ```ts
 * import { manifest, type TagName } from "@johnmorrisdotca/hata/manifest";
 *
 * const names: TagName[] = (manifest("DE")?.tags ?? []).map((one) => one.tag);
 * console.log(names); // ["plain", "stripes-horizontal"]
 * ```
 */
type TagName =
  | "plain"
  | "stripes-horizontal"
  | "stripes-vertical"
  | "stripes-diagonal"
  | "cross"
  | "nordic-cross"
  | "saltire"
  | "canton"
  | "stars"
  | "crescent"
  | "sun"
  | "circle"
  | "triangle"
  | "emblem"
  | "coat-of-arms"
  | "animal"
  | "plant"
  | "building"
  | "weapon"
  | "crown"
  | "map"
  | "text";

/**
 * Where a tag comes from, the most trusted first. `reviewed`: a person looked at the flag and said so. `computed`:
 * measured from the drawing by a rule with no judgement in it. `wikidata`: the flag's Wikidata item says it depicts
 * a thing of that kind. `unreviewed`: an automated guess (a Wikimedia Commons category of the drawing's file, or a
 * rule of thumb on the drawing) that nobody has checked.
 *
 * @example
 * ```ts
 * import { manifest, type TagSource } from "@johnmorrisdotca/hata/manifest";
 *
 * const sure: TagSource[] = ["reviewed", "computed"];
 * console.log((manifest("FR")?.tags ?? []).filter((one) => sure.includes(one.source)).map((one) => one.tag)); // ["plain", "stripes-vertical"]
 * ```
 */
type TagSource = "reviewed" | "computed" | "wikidata" | "unreviewed";

/**
 * One thing that is on a flag, and where the claim comes from.
 *
 * @example
 * ```ts
 * import { tagsOf, type FlagTag } from "@johnmorrisdotca/hata/search";
 *
 * const germany: readonly FlagTag[] = tagsOf("DE");
 * console.log(germany); // [{ tag: "plain", source: "computed" }, { tag: "stripes-horizontal", source: "computed" }]
 * ```
 */
interface FlagTag {
  /** The tag, of the closed list: see `TagName`. */
  tag: TagName;
  /** Where it comes from: see `TagSource`. */
  source: TagSource;
}

/**
 * A flag's tag as the manifest has it: the tag, its source, and what the source rests on.
 *
 * @example
 * ```ts
 * import { manifest, type FlagTagRecord } from "@johnmorrisdotca/hata/manifest";
 *
 * const germany: FlagTagRecord[] = manifest("DE")?.tags ?? [];
 * console.log(germany[1]); // { tag: "stripes-horizontal", source: "computed", from: "the whole flag is three bands across" }
 * ```
 */
interface FlagTagRecord extends FlagTag {
  /** What the source rests on, in words: the measure, the Wikidata statement, or the Commons category. */
  from: string;
}

/**
 * The years a former country existed and the other codes that find its flag: the ISO 3166-1 alpha-2 and alpha-3 it had
 * and the IOC's three letters. Only a former country's record has one; a present-day place's has none.
 *
 * @example
 * ```ts
 * import { manifest, type HistoricalEra } from "@johnmorrisdotca/hata/manifest";
 *
 * const era: HistoricalEra | undefined = manifest("SUHH")?.historical;
 * console.log(era?.from);    // "1922"
 * console.log(era?.until);   // "1991"
 * console.log(era?.aliases); // ["SU", "SUN", "URS"]
 * ```
 */
interface HistoricalEra {
  /** The first year of the state (not of the flag in the record: a variant has its own dates), as a year. */
  from: string;
  /** The last year of the state, as a year. */
  until: string;
  /** The other codes that find it: "SU", "SUN" and "URS" for the Soviet Union. None is a code of a flag itself, and none is shared with another place. */
  aliases: string[];
}

/**
 * What a flag is the answer to on its days: `legal` is the flag the law made the country's national flag, and `in-use` the flag it flew
 * as its own in practice. They are the same flag for most places and most days. Where they differ, both are kept, each with its role
 * and the reason (`Variant.roleNote`): `variantOn(code, date)` gives the legal flag, and `{ role: "in-use" }` the other.
 *
 * @example
 * ```ts
 * import { variantOn, type FlagRole } from "@johnmorrisdotca/hata/manifest";
 *
 * const roles: FlagRole[] = ["legal", "in-use"];
 * console.log(roles.map((role) => variantOn("CA", "1962-09-29", { role })?.id)); // ["union-flag", "red-ensign-1957"]
 * ```
 */
type FlagRole = "legal" | "in-use";

/**
 * Why a flag is only one of the two roles, with the page that says so: `why`, a sentence or two, and the `source` page of `sourceKind` (see `Variant`).
 *
 * @example
 * ```ts
 * import { variantsOf, type RoleNote } from "@johnmorrisdotca/hata/manifest";
 *
 * const note: RoleNote | null = variantsOf("CA").find((one) => one.id === "red-ensign-1957")?.roleNote ?? null;
 * console.log(note?.sourceKind); // "official"
 * console.log(note?.source);     // "https://www.canada.ca/en/canadian-heritage/services/flag-canada-history.html"
 * ```
 */
interface RoleNote {
  /** What was the law and what was the practice, and the days that matter. */
  why: string;
  /** Where it is documented: a web page. */
  source: string;
  /** What kind of page `source` is: `official`, `reference` or `encyclopedia`. */
  sourceKind: "official" | "reference" | "encyclopedia";
}

/**
 * A flag whose display the law restricts. Germany's national flag of 1935 to 1945 is the one: it is shipped for history and education,
 * and is never returned by a default lookup, a list, a picker, a quiz, a download pack or the CDN listing. Ask for it by name with
 * `allowRestricted: true` (`flag`, `variantOn`, `variantsOf`) or the `allow-restricted` attribute of `<hata-flag>`, for a purpose in `allowedFor`.
 *
 * @example
 * ```ts
 * import { variantOn, type Restricted } from "@johnmorrisdotca/hata/manifest";
 *
 * const found = variantOn("DE", "1940");
 * const why: Restricted | null = found?.restricted ?? null;
 * console.log(found?.withheld); // true: the drawing is not given without allowRestricted
 * console.log(why?.law);        // ["DE StGB §86a", "AT Verbotsgesetz"]
 * ```
 */
interface Restricted {
  /** Why it is restricted, in a sentence a page can show beside it, in English. */
  reason: string;
  /** The same in Japanese. */
  reasonJa: string;
  /** The laws that restrict it: "DE StGB §86a" and "AT Verbotsgesetz". */
  law: string[];
  /** What it may be used for under those laws' exceptions (StGB §86(4) in Germany): "education and history". Not commerce. */
  allowedFor: string;
  /** The same in Japanese. */
  allowedForJa: string;
}

/**
 * One restricted flag with the code of its place, as `RESTRICTED` in /manifest lists it.
 *
 * @example
 * ```ts
 * import { RESTRICTED, type RestrictedVariant } from "@johnmorrisdotca/hata/manifest";
 *
 * const one: RestrictedVariant | undefined = RESTRICTED[0];
 * console.log(one?.code, one?.variant.id); // "DE" "swastika-1935"
 * ```
 */
interface RestrictedVariant {
  /** The place's code. */
  code: string;
  /** The flag: a `Variant` with `restricted` set. */
  variant: Variant;
}

/**
 * One of a place's flags in real use, for `flag(code, { variant })` and `variantsOf(code)`: Afghanistan's Republic tricolour and
 * the Taliban's flag, Bavaria's lozenges and stripes, Guadeloupe's French tricolour and its local flag.
 *
 * - `official`: adopted by the authority that has the right to.
 * - `de-facto`: flown by whoever holds the territory, without that recognition.
 * - `historical`: no longer official, and still flown.
 * - `local`: in use there, and not made the place's own flag by its authority.
 *
 * @example
 * ```ts
 * import { variantsOf, type Variant } from "@johnmorrisdotca/hata/manifest";
 *
 * const taliban: Variant | undefined = variantsOf("AF").find((one) => one.status === "de-facto");
 * console.log(taliban?.id);     // "de-facto"
 * console.log(taliban?.from);   // "2021-08-15"
 * console.log(taliban?.module); // "af--de-facto": import it from "@johnmorrisdotca/hata/flags/af--de-facto"
 * ```
 */
interface Variant {
  /** Kebab case, unique within the place: "de-facto", "stripes", "local". */
  id: string;
  /** A name for a menu, in English. */
  name: string;
  /** The same in Japanese. */
  nameJa: string;
  /** Its standing: see above. */
  status: "official" | "de-facto" | "historical" | "local";
  /** When it came into use, as precisely as is known (`"2021-08-15"`, `"1953"`); null where it is not known or not dated. */
  from: string | null;
  /** When it went out of official use; null where it has not. */
  until: string | null;
  /**
   * Which questions this flag answers on its days: `legal` (the flag the law made the country's national flag) and `in-use` (the flag it
   * flew as its own in practice). Most flags are both. Canada's Red Ensigns before 1965 are `in-use` only and its Union Flag is `legal` only.
   * Empty for a `de-facto` or `local` flag, which `variantOn` never gives. See `FlagRole`.
   */
  roles: FlagRole[];
  /** The days of each role it has, where they are not the flag's own `from` and `until` (Australia's Blue Ensign was flown from 1901 and became the national flag in law in 1954). Each role in `roles` has an entry. */
  roleDates: Partial<Record<FlagRole, { from: string | null; until: string | null }>>;
  /** Why this flag is only one of the two, or is legal and in use on different days, and who says so; null where it is both on the same days. */
  roleNote: RoleNote | null;
  /** Set where the law restricts displaying the flag outside history and education: it is then not in `variantsOf` or any record's `variants`, and `flag()` and `<hata-flag>` draw it only when asked with `allowRestricted`. Null for every other flag. See `Restricted`. */
  restricted: Restricted | null;
  /** Why it is offered, and (for the default) why it is the default, in a sentence or two. */
  why: string;
  /** Where the claim above is documented: a web page. */
  source: string;
  /** What kind of page `source` is: `official` (a government, parliament, archive or law text), `reference` (a vexillological reference or a scholarly article) or `encyclopedia` (Wikipedia: a better source is wanted). */
  sourceKind: "official" | "reference" | "encyclopedia";
  /** True for the one `flag(code)` gives. At most one per place; none where the place has no flag of its own by default. */
  default: boolean;
  /** The module that has its SVG: `/flags/<module>`, the place's own for the default and `<code>--<id>` for the others. */
  module: string;
  /** What `frame()` does with this variant's SVG at each shape by default: `cover` (a centre crop), `crop` (a crop at a chosen side) or `contain` (the whole flag). */
  frames: Record<"4:3" | "1:1" | "round", "cover" | "crop" | "contain">;
  /** Where this drawing comes from: its Commons file, page, licence, author and size, as for a flag's record. */
  drawing: {
    source: FlagSource;
    file: string;
    page: string;
    licence: { kind: LicenceKind; name: string; url: string | null };
    author: string | null;
    credit: string | null;
    attributionRequired: boolean;
    restrictions: string[];
    uploaded: string | null;
    width: number;
    height: number;
    bytes: number;
  };
}

/**
 * A code Kuni knows, or a former team of sport Hata lists, that has no flag in this version, and why.
 *
 * @example
 * ```ts
 * import { leftOut, type LeftOutRecord } from "@johnmorrisdotca/hata/manifest";
 *
 * const sahara: LeftOutRecord | null = leftOut("EH");
 * console.log(sahara?.reason);
 * ```
 */
interface LeftOutRecord {
  /** The code, as Kuni writes it (a former team's is the IOC's: "EUN"). */
  code: string;
  /** Why: `no-flag` (no source names one), `not-svg` (the source's file is not an SVG) or `licence` (not public domain, CC0 or CC BY). */
  kind: "no-flag" | "not-svg" | "licence";
  /** The reason in a sentence. */
  reason: string;
  /** The Commons file that was not shipped, where there is one; null otherwise. */
  file: string | null;
  /** That file's page on Commons; null where there is no file. */
  page: string | null;
  /** The licence Commons gives the file, where it was the reason; null otherwise. */
  licence: string | null;
  /** True where the place's flag is claimed by more than one authority or community (Northern Ireland). */
  disputed: boolean;
  /** The `id` of the variant a place with no flag of its own gives by default: always null here, since a code in this list has no default flag. */
  defaultVariant: string | null;
  /** The flags in real use at a place with none of its own (Northern Ireland: the Union Flag, the former Ulster Banner), each asked for by name; empty for the rest. */
  variants: Variant[];
  /** Only for a former country or a team of sport listed here (the Unified Team, the Russian Olympic Committee): the years and the other codes, as for `FlagRecord`. Absent for a present-day place. */
  historical?: HistoricalEra;
}

export type { ColourName, FlagColour, FlagRecord, FlagRole, FlagSource, FlagTag, FlagTagRecord, Framing, FramingCrop, HistoricalEra, LeftOutRecord, LicenceKind, Restricted, RestrictedVariant, RoleNote, TagName, TagSource, Variant };
