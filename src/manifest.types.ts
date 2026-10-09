// The shapes of the manifest's records: where a flag comes from and under what licence, and why a code has none.

/**
 * The kinds of licence a shipped drawing can be under: for a Wikimedia Commons file, as Commons states it,
 * `public-domain` (PD-… templates: a government work, or a design too simple to be copyrighted), `cc0`, or `cc-by`
 * (credit asked; NOTICE.md gives it); for a flag set's drawing, `mit` (the set's notice is in NOTICE.md).
 *
 * @example
 * ```ts
 * import { MANIFEST, type LicenceKind } from "@johnmorrisdotca/hata/manifest";
 *
 * const credit: LicenceKind[] = ["cc-by", "mit"];
 * MANIFEST.filter((one) => credit.includes(one.licence.kind));
 * ```
 */
type LicenceKind = "public-domain" | "cc0" | "cc-by" | "mit";

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
}

export type { FlagRecord, FlagSource, LeftOutRecord, LicenceKind };
