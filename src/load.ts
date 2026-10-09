// The entry @johnmorrisdotca/hata/load: a flag by its code, fetched when it is wanted. Each flag is its own dynamic
// import, so a bundler makes a small chunk of each and a page downloads only the flags it shows.

import { LOADERS } from "./data/loaders.data";
import { checkFrameOptions, frame, mustBeString, toDataUri } from "./svg";
import type { FrameOptions } from "./svg";

const codeOf = (code: string): string => mustBeString(code, "code").trim().toUpperCase().replace(/_/g, "-");

/**
 * A flag's SVG string by its code, loaded when asked for: one dynamic import of `/flags/<code>`. With options, it
 * is framed as `frame()` frames it (4:3, square or round, cropped or whole, with a label).
 *
 * @param code - A country's alpha-2 code or a subdivision's ISO 3166-2 code, in any case: "JP", "jp-13", "CA-ON".
 * @param options - How to frame it: `shape`, `fit` and `label`, as for `frame()`; the flag as it is when left out.
 * @returns A promise of the SVG string, or of `null` when the code has no flag here (unknown, malformed, or left out).
 * @throws TypeError, synchronously, when `code` is not a string or `options` names a shape or fit that is not one.
 *
 * @example
 * ```ts
 * import { flag } from "@johnmorrisdotca/hata/load";
 *
 * const tokyo = await flag("JP-13");                       // "<svg …>"
 * const round = await flag("ca", { shape: "round", label: "Canada" });
 * await flag("XX");                                        // null
 * ```
 */
const flag = (code: string, options?: FrameOptions): Promise<string | null> => {
  const loader = LOADERS[codeOf(code)];
  if (options !== undefined) checkFrameOptions(options);
  if (loader === undefined) return Promise.resolve(null);

  return loader().then((module) => (options === undefined ? module.svg : frame(module.svg, options)));
};

/**
 * A flag as a `data:` URI by its code, loaded when asked for: ready for an `<img src>` or a CSS `url()`.
 *
 * @param code - A flag's code, in any case.
 * @param options - How to frame it first, as for `frame()`; the flag as it is when left out.
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
const flagDataUri = (code: string, options?: FrameOptions): Promise<string | null> =>
  flag(code, options).then((svg) => (svg === null ? null : toDataUri(svg)));

export { flag, flagDataUri };
export type { FrameOptions };
