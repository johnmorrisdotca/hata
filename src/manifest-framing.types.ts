// The shapes of a flag's framing: how `flag(code, { shape })` fits it to a shape, and the crop it keeps.

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
 * console.log(square?.method); // "adapted"
 * console.log(square?.fit);    // "contain": what frame() does with the flag's own SVG, which cannot use the adapted drawing
 *
 * const us = manifest("US")?.framings["1:1"];
 * console.log(us?.fit);         // "crop"
 * console.log(us?.crop);        // { rule: "curated", at: "left", why: "An emblem sits in a canton at the hoist …", loses: [] }
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
 * console.log(crop?.rule); // "curated": a person chose the side
 * console.log(crop?.at);   // "left": the canton and the stripes beside it
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

export type { Framing, FramingCrop };
