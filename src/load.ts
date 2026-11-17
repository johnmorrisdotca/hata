// The entry @johnmorrisdotca/hata/load: a flag by its code, fetched when it is wanted. Each flag is its own dynamic
// import, so a bundler makes a small chunk of each and a page downloads only the flags it shows.

import { FLAG_ALIASES } from "./data/aliases.data";
import { LOADERS } from "./data/loaders.data";
import { dayOf } from "./dates";
import type { FlagOnDay, FlagRole } from "./manifest";
import { checkFrameOptions, frame, mustBeString, toDataUri } from "./svg";
import type { FrameOptions } from "./svg";

/**
 * What `flag()` takes: everything `frame()` takes, `variant`, which of the place's flags in real use to load, and `date`, the day whose flag to load.
 *
 * @example
 * ```ts
 * import { flag, type FlagOptions } from "@johnmorrisdotca/hata/load";
 *
 * const taliban: FlagOptions = { variant: "de-facto", shape: "round", label: "Afghanistan" };
 * console.log(await flag("AF", taliban));
 * ```
 */
interface FlagOptions extends FrameOptions {
  /** The `id` of one of the place's variants (`variantsOf(code)` from `/manifest` lists them): "de-facto", "stripes", "local". Left out, the default. Martinique's `local` is deprecated, an alias of `martinique` until 2.0. */
  variant?: string;
  /**
   * The day whose flag to load: a `Date`, or `"YYYY-MM-DD"`, `"YYYY-MM"` or `"YYYY"`. The flag that day (the legal one, or the one `role` asks for), as `variantOn(code, date)` from
   * `/manifest` finds it: the earlier flags of a country, and today's after its newest change. `null` where the package knows no flag for that day.
   * Left out, the default. With a `variant` as well, the variant wins.
   */
  date?: string | Date;
  /**
   * With `date`: which flag of the day, the `legal` one (the default: the flag the law made the national flag) or the flag `in-use` in practice. Canada in 1962: the Union Flag was
   * the legal flag and the Red Ensign was flown. The same flag for most places and days. `variantOn(code, date)` from `/manifest` says when another flag exists and why.
   */
  role?: FlagRole;
  /**
   * Draw a flag whose display the law restricts (Germany's of 1935 to 1945: `restricted` in its manifest entry, `RESTRICTED` in `/manifest`), for history and
   * education only. Left out, `flag()` gives `null` for it, by `variant` or by `date`, and `flagOn()` gives the restriction and its reason.
   */
  allowRestricted?: boolean;
}

const codeOf = (code: string): string => {
  const written = mustBeString(code, "code").trim().toUpperCase().replace(/_/g, "-");

  return FLAG_ALIASES[written] ?? written;
};

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
 * @param code - A country's alpha-2 code or a subdivision's ISO 3166-2 code, in any case: "JP", "jp-13", "CA-ON"; or a former country's code or alias: "SUHH", "urs", "GDR"; or a flag the page registered, `custom:<slug>` (see `@johnmorrisdotca/hata/custom`).
 * @param options - How to frame it: `shape`, `fit` and `label`, as for `frame()`; the flag as it is when left out. And `variant`: the
 *   `id` of another of the place's flags in real use (`variantsOf(code)`), such as Afghanistan's "de-facto"; the default when left out. And `date`: the
 *   flag on that day (`variantOn(code, date)`), by default the legal one (the Union Flag for Canada in 1962), or with `role: "in-use"` the one flown (the Red Ensign); `null` where no flag is known for that day.
 *   And `allowRestricted`, to draw a flag the law restricts (Germany's of 1935 to 1945), for history and education.
 * @returns A promise of the SVG string, or of `null` when the code has no flag here (unknown, malformed, or left out), has no such variant, has no flag known for the `date`, or the flag is restricted and `allowRestricted` was not given.
 *   A place with no flag of its own by default (Northern Ireland) gives `null` until a variant is asked for.
 * @throws TypeError, synchronously, when `code` is not a string, `options` names a shape or fit that is not one, or `date` is not a `Date` or a date string.
 *
 * @example
 * ```ts
 * import { flag } from "@johnmorrisdotca/hata/load";
 *
 * const tokyo = await flag("JP-13");                       // "<svg …>"
 * const round = await flag("ca", { shape: "round", label: "Canada" }); // flag-icons' square of Canada, in a circle
 * const whole = await flag("us", { shape: "1:1", fit: "whole" });      // all of the stars and stripes, in a square
 * const canton = await flag("us", { shape: "1:1", fit: "crop" });      // the canton and a slice of the stripes
 * console.log(await flag("AF", { variant: "de-facto" }));             // the Taliban's flag; the Republic's tricolour is the default
 * console.log(await flag("GB-NIR", { variant: "union-flag" }));        // Northern Ireland has no flag of its own: ask for one
 * console.log(await flag("CA", { date: "1962-09-29" }));               // the Union Flag, Canada's legal flag three years before the Maple Leaf flag
 * console.log(await flag("CA", { date: "1962-09-29", role: "in-use" })); // the Red Ensign, the flag Canadians flew
 * console.log(await flag("CA", { date: "2026-01-01" }));               // after the newest change: today's flag
 * console.log(await flag("JP", { date: "1950" }));                     // the 1870 Hinomaru, at 7:10, before the law of 1999
 * console.log(await flag("GDR"));                                       // East Germany, by the IOC's code
 * console.log(await flag("YU", { variant: "kingdom" }));                // Yugoslavia's flag before 1941
 * console.log(await flag("DE", { date: "1940" }));                     // null: restricted, so no drawing without allowRestricted (flagOn says why)
 * console.log(await flag("XX"));                                        // null
 * ```
 */
const flag = (code: string, options?: FlagOptions): Promise<string | null> => {
  const known = codeOf(code);
  if (options !== undefined) checkFrameOptions(options);
  if (options?.variant !== undefined && typeof options.variant !== "string") throw new TypeError("variant must be a string");
  if (options?.role !== undefined && options.role !== "legal" && options.role !== "in-use") throw new TypeError('role must be "legal" or "in-use"');
  if (options?.allowRestricted !== undefined && typeof options.allowRestricted !== "boolean") throw new TypeError("allowRestricted must be a boolean");
  const day = options?.date === undefined || options.variant !== undefined ? undefined : dayOf(options.date);
  // A flag a page registered itself (`custom:<slug>`, /custom): its entry is loaded only now, and a custom flag has no variants.
  if (known.startsWith("CUSTOM:")) {
    if (options?.variant !== undefined) return Promise.resolve(null);
    const framedOnly = options === undefined || (options.shape === undefined && options.fit === undefined && options.label === undefined);

    return import("./custom.js").then(({ customFlag }) => {
      const svg = customFlag(code);

      return svg === null || framedOnly ? svg : frame(svg, options);
    });
  }
  // A variant is its own drawing, loaded by "<code>--<id>" from its own table (loaded when one is asked for); the default's is
  // the place's own, so it is the same as asking for no variant.
  if (day !== undefined) {
    // A date asks the manifest which variant that day had, loaded only now: the flag's history is data, and /load carries none.
    return import("./manifest.js").then(({ variantOn }) => {
      const found = variantOn(known, day, { role: options?.role ?? "legal", allowRestricted: options?.allowRestricted === true });

      // A restricted flag is found, and its drawing withheld: `null` here, and `flagOn()` says why.
      return found === null || found.withheld ? null : flag(known, { ...options, variant: found.id, date: undefined });
    });
  }
  if (options?.variant === undefined) return place(known, options, LOADERS[known]);

  return import("./data/variants.data.js").then(({ RESTRICTED_LOADERS, VARIANT_LOADERS }) => {
    const variant = VARIANT_LOADERS[`${known}--${options.variant}`] ?? (options.allowRestricted === true ? RESTRICTED_LOADERS[`${known}--${options.variant}`] : undefined);
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
 * What `flagOn()` gives: `FlagOnDay` from `/manifest` (the flag of the day with `other`, `withheld` and `none`), and its drawing.
 *
 * @example
 * ```ts
 * import { flagOn, type LoadedFlagOn } from "@johnmorrisdotca/hata/load";
 *
 * const day: LoadedFlagOn = await flagOn("CA", "1962-09-29", { shape: "4:3" });
 * console.log(day.variant?.id, day.variant?.other?.id); // "union-flag" "red-ensign-1957"
 * console.log(day.svg?.startsWith("<svg"));    // true
 * ```
 */
interface LoadedFlagOn extends FlagOnDay {
  /** The drawing, framed as asked; null where there is none to give: no flag known, or a restricted one withheld (`none` says why). */
  svg: string | null;
}

/**
 * The flag of a day with its drawing and the reason for a blank: `flag(code, { date })` and `flagOn(code, date)` from `/manifest` in one call. Where another
 * flag exists for the day (Canada in 1962: the Union Flag is legal and the Red Ensign was flown) `variant.other` says which and why; where there is no
 * drawing (no flag known that day, or a restricted flag without `allowRestricted`) `svg` is null and `none` says why, in a sentence.
 *
 * @param code - A flag's code, in any case.
 * @param date - The day: a `Date`, or `"YYYY-MM-DD"`, `"YYYY-MM"` or `"YYYY"`.
 * @param options - `role`, `allowRestricted` and how to frame it (`shape`, `fit`, `label`).
 * @returns A promise of the day's answer, never `null`.
 * @throws TypeError, synchronously, when `code` is not a string, `date` is not a valid date or `options` is not as for `flag()`.
 *
 * @example
 * ```ts
 * import { flagOn } from "@johnmorrisdotca/hata/load";
 *
 * const day = await flagOn("DE", "1940");
 * console.log(day.svg);           // null: restricted
 * console.log(day.none?.reason);  // "Flag of Nazi Germany, 1935–1945. Shown for history and education. …"
 * const shown = await flagOn("DE", "1940", { allowRestricted: true });
 * console.log(shown.svg?.startsWith("<svg")); // true
 * ```
 */
const flagOn = (code: string, date: string | Date, options?: Omit<FlagOptions, "variant" | "date">): Promise<LoadedFlagOn> => {
  const known = codeOf(code);
  if (options !== undefined) checkFrameOptions(options);
  const day = dayOf(date);

  return import("./manifest.js").then(({ flagOn: answer }) => {
    const found = answer(known, day, { role: options?.role ?? "legal", allowRestricted: options?.allowRestricted === true });
    if (found.variant === null || found.variant.withheld) return { ...found, svg: null };

    return flag(known, { ...options, variant: found.variant.id }).then((svg) => ({ ...found, svg }));
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
 * ```ts no-run
 * import { flagDataUri } from "@johnmorrisdotca/hata/load";
 *
 * const previewImage=document.createElement("img");
 * previewImage.src = (await flagDataUri("US-TX", { shape: "4:3" })) ?? "";
 * ```
 */
const flagDataUri = (code: string, options?: FlagOptions): Promise<string | null> =>
  flag(code, options).then((svg) => (svg === null ? null : toDataUri(svg)));

export { flag, flagDataUri, flagOn };
export type { FlagOptions, FrameOptions, LoadedFlagOn };
