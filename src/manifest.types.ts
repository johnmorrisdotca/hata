// The shapes of the manifest's records: where a flag comes from and under what licence, and why a code has none.

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
 * MANIFEST.filter((one) => credit.includes(one.licence.kind));
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
 * MANIFEST.filter((one) => fromSets.includes(one.source)).map((one) => one.code); // ["YE"]
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
  /** The Wikidata item whose flag image (P41) names the file: "Q17". */
  wikidata: string;
  /** The licence: its kind, its name ("Public domain", "CC BY 4.0", "MIT") and its address where it has one. */
  licence: { kind: LicenceKind; name: string; url: string | null };
  /** The author: as Commons' Artist field gives it, in plain text, or the set's copyright line; null where none is named. */
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
  /** True where more than one authority or community claims the place's flag at the same time (Afghanistan, Northern Ireland); this package takes no side, and says why each default was chosen (README). */
  disputed: boolean;
  /** The `id` of the variant `flag(code)` gives; null where the place has one flag (`variants` is then empty) or none of its own by default. */
  defaultVariant: string | null;
  /** Every flag of the place in real use, the default's included, each with its status and reason; empty where the place has one flag. See `Variant`. */
  variants: Variant[];
  /** How the flag is framed at 4:3, square and round by `flag(code, { shape })`, and by `frame()`; see `Framing`. */
  framings: Record<"4:3" | "1:1" | "round", Framing>;
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
 * taliban?.id;     // "de-facto"
 * taliban?.from;   // "2021-08-15"
 * taliban?.module; // "af--de-facto": import it from "@johnmorrisdotca/hata/flags/af--de-facto"
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
  /** Why it is offered, and (for the default) why it is the default, in a sentence or two. */
  why: string;
  /** Where the claim above is documented: a web page. */
  source: string;
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
 * How one frame shows a flag, measured so that no frame misrepresents it (`pnpm data:framing`): a frame keeps a
 * flag's colours when every colour covering at least 5% of the flag still covers at least half that share.
 *
 * - `own`: the flag is that shape already.
 * - `adapted`: a drawing made for that shape by hand, by flag-icons (MIT): Canada's square, with narrower bars.
 *   It is its own module, `/flags/<code>.1x1` or `/flags/<code>.4x3`; round uses the square one in a circle.
 * - `cover`: the flag cropped from the centre, which keeps its colours.
 * - `crop`: the flag cropped at the side a person chose for it (`crop.at`), keeping its colours: the United States'
 *   canton and a slice of its stripes, kept at the left. See `crop` for why.
 * - `contain`: the whole flag, with clear bands (on a neutral disc when round), because a crop would lose a colour
 *   or misrepresent the flag.
 *
 * @example
 * ```ts
 * import { manifest, type Framing } from "@johnmorrisdotca/hata/manifest";
 *
 * const square: Framing | undefined = manifest("CA")?.framings["1:1"];
 * square?.method; // "adapted"
 * square?.fit;    // "contain": what frame() does with the flag's own SVG, which cannot use the adapted drawing
 *
 * const us = manifest("US")?.framings["1:1"];
 * us?.fit;         // "crop"
 * us?.crop;        // { rule: "curated", at: "left", why: "An emblem sits in a canton at the hoist …", loses: [] }
 * ```
 */
interface Framing {
  /** How `flag(code, { shape })` frames it: `own`, `adapted`, `cover`, `hoist` or `contain`. */
  method: "own" | "adapted" | "cover" | "crop" | "contain";
  /** What `frame()` does with the flag's own SVG at this shape when its `fit` is `auto`: `cover` (a centre crop), `crop` (a crop kept at `crop.at`) or `contain` (the whole flag). */
  fit: "cover" | "crop" | "contain";
  /** The crop of this flag at this shape, and how it was chosen; see `FramingCrop`. */
  crop: FramingCrop;
  /** Where an adapted drawing comes from (`flag-icons`); null otherwise. */
  source: "flag-icons" | null;
  /** The adapted drawing's path in the set ("flags/1x1/ca.svg"); null otherwise. */
  file: string | null;
  /** The adapted drawing on jsDelivr at the set's version; null otherwise. */
  page: string | null;
  /** The adapted drawing's size optimised, in bytes; null otherwise. */
  bytes: number | null;
  /** The colours a crop from the centre would lose, as measured ("red 55% to 15%"); empty where it loses none. */
  coverLoses: string[];
}

/**
 * The crop of a flag at one shape: which crop `fit: "auto"` chooses, and the side `fit: "crop"` asked for by name keeps.
 * Both the whole flag and a crop are offered for every flag: `fit: "whole"` shows all of it, `fit: "crop"` crops it.
 *
 * @example
 * ```ts
 * import { manifest, type FramingCrop } from "@johnmorrisdotca/hata/manifest";
 *
 * const crop: FramingCrop | undefined = manifest("US-HI")?.framings["1:1"].crop;
 * crop?.rule; // "curated": a person chose the side
 * crop?.at;   // "left": the canton and the stripes beside it
 * ```
 */
interface FramingCrop {
  /**
   * What `auto` does: `own` (the flag is this shape, so there is nothing to crop), `curated` (a crop kept at `at`, chosen by hand and
   * checked), `centre` (a crop from the centre that keeps every colour) or `whole` (no crop shows the flag fairly, so `auto` shows all of it).
   */
  rule: "own" | "curated" | "centre" | "whole";
  /** The side `fit: "crop"` keeps: `left` (the hoist), `right`, `top`, `bottom`, or `centre` where nobody chose another. */
  at: "left" | "right" | "top" | "bottom" | "centre";
  /** Why a person chose this side, or chose to show the flag whole; null where nobody chose (a centre crop, or a flag that is already this shape). */
  why: string | null;
  /** The colours (each covering 5% or more of the flag) that a crop at `at` drops: empty where it keeps them all, and explained in `why` where `rule` is `curated`. */
  loses: string[];
}

/**
 * A code Kuni knows that has no flag in this version, and why.
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
  /** The code, as Kuni writes it. */
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
}

export type { FlagRecord, FlagSource, Framing, FramingCrop, LeftOutRecord, LicenceKind, Variant };
