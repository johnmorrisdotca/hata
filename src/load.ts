// The entry @johnmorrisdotca/hata/load: a flag by its code, fetched when it is wanted. Each flag is its own dynamic
// import, so a bundler makes a small chunk of each and a page downloads only the flags it shows.

import { LOADERS } from "./data/loaders.data";
import { checkFrameOptions, frame, mustBeString, toDataUri } from "./svg";
import type { FrameOptions } from "./svg";

/**
 * What `flag()` takes: everything `frame()` takes, and `variant`, which of the place's flags in real use to load.
 *
 * @example
 * ```ts
 * import { flag, type FlagOptions } from "@johnmorrisdotca/hata/load";
 *
 * const taliban: FlagOptions = { variant: "de-facto", shape: "round", label: "Afghanistan" };
 * await flag("AF", taliban);
 * ```
 */
interface FlagOptions extends FrameOptions {
  /** The `id` of one of the place's variants (`variantsOf(code)` from `/manifest` lists them): "de-facto", "stripes", "local". Left out, the default. */
  variant?: string;
}

const codeOf = (code: string): string => mustBeString(code, "code").trim().toUpperCase().replace(/_/g, "-");

/**
 * A flag's SVG string by its code, loaded when asked for: one dynamic import of `/flags/<code>`. With options, it
 * is framed: at 4:3, square or round, the frame measured for that flag so that none misrepresents it. Where
 * flag-icons draws the flag again by hand for that shape (Canada's square, with narrower bars), that drawing is
 * loaded instead (`/flags/<code>.1x1`, `.4x3`; round is the square in a circle); otherwise it is framed as
 * `frame()` frames it: cropped at the side chosen for the flag where one was, cropped from the centre where that keeps
 * every colour, and whole where neither does. `fit: "crop"` asks for the crop: the hand-drawn frame where there is one,
 * else the flag's own drawing cropped at its chosen side, even where `auto` would show the whole flag. `fit: "whole"`
 * asks for all of the flag, and any other `fit` asks for that fit of the flag's own drawing.
 *
 * @param code - A country's alpha-2 code or a subdivision's ISO 3166-2 code, in any case: "JP", "jp-13", "CA-ON".
 * @param options - How to frame it: `shape`, `fit` and `label`, as for `frame()`; the flag as it is when left out. And `variant`: the
 *   `id` of another of the place's flags in real use (`variantsOf(code)`), such as Afghanistan's "de-facto"; the default when left out.
 * @returns A promise of the SVG string, or of `null` when the code has no flag here (unknown, malformed, or left out), or has no such variant.
 *   A place with no flag of its own by default (Northern Ireland) gives `null` until a variant is asked for.
 * @throws TypeError, synchronously, when `code` is not a string or `options` names a shape or fit that is not one.
 *
 * @example
 * ```ts
 * import { flag } from "@johnmorrisdotca/hata/load";
 *
 * const tokyo = await flag("JP-13");                       // "<svg …>"
 * const round = await flag("ca", { shape: "round", label: "Canada" }); // flag-icons' square of Canada, in a circle
 * const whole = await flag("us", { shape: "1:1", fit: "whole" });      // all of the stars and stripes, in a square
 * const canton = await flag("us", { shape: "1:1", fit: "crop" });      // the canton and a slice of the stripes
 * await flag("AF", { variant: "de-facto" });             // the Taliban's flag; the Republic's tricolour is the default
 * await flag("GB-NIR", { variant: "union-flag" });        // Northern Ireland has no flag of its own: ask for one
 * await flag("XX");                                        // null
 * ```
 */
const flag = (code: string, options?: FlagOptions): Promise<string | null> => {
  const known = codeOf(code);
  if (options !== undefined) checkFrameOptions(options);
  if (options?.variant !== undefined && typeof options.variant !== "string") throw new TypeError("variant must be a string");
  // A variant is its own drawing, loaded by "<code>--<id>" from its own table (loaded when one is asked for); the default's is
  // the place's own, so it is the same as asking for no variant.
  if (options?.variant === undefined) return place(known, options, LOADERS[known]);

  return import("./data/variants.data.js").then(({ VARIANT_LOADERS }) => {
    const variant = VARIANT_LOADERS[`${known}--${options.variant}`];
    if (variant === undefined) return null;

    return place(known, options, variant, variant !== LOADERS[known]);
  });
};

// One drawing loaded and framed as asked: a place's own, or a variant's (named, so no drawing made for a frame applies).
const place = (known: string, options: FlagOptions | undefined, loader: (() => Promise<{ svg: string }>) | undefined, named = false): Promise<string | null> => {
  if (loader === undefined) return Promise.resolve(null);
  const shape = options?.shape ?? "flag";
  const framedOnly = options === undefined || (options.shape === undefined && options.fit === undefined && options.label === undefined);
  const own = (): Promise<string | null> => loader().then((module) => (framedOnly ? module.svg : frame(module.svg, options)));
  const asked = options?.fit ?? "auto";
  if (shape === "flag" || named || (asked !== "auto" && asked !== "crop")) return own();

  // A frame: the drawing made for it by hand where there is one (its table is its own small file), else the flag's own.
  return import("./data/adapted.data.js").then(({ ADAPTED }) => {
    const drawn = ADAPTED[`${known} ${shape}`];
    if (drawn === undefined) return own();
    return drawn().then((module) => frame(module.svg, { ...options, shape: shape === "round" ? "round" : "flag", fit: "cover" }));
  });
};

/**
 * A flag as a `data:` URI by its code, loaded when asked for: ready for an `<img src>` or a CSS `url()`.
 *
 * @param code - A flag's code, in any case.
 * @param options - How to frame it first, as for `frame()`, and which `variant`; the flag as it is when left out.
 * @returns A promise of `data:image/svg+xml,…`, or of `null` when the code has no flag here.
 * @throws TypeError, synchronously, when `code` is not a string or `options` names a shape or fit that is not one.
 *
 * @example
 * ```ts
 * import { flagDataUri } from "@johnmorrisdotca/hata/load";
 *
 * image.src = (await flagDataUri("US-TX", { shape: "4:3" })) ?? "";
 * ```
 */
const flagDataUri = (code: string, options?: FlagOptions): Promise<string | null> =>
  flag(code, options).then((svg) => (svg === null ? null : toDataUri(svg)));

export { flag, flagDataUri };
export type { FlagOptions, FrameOptions };
