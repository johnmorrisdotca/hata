// The part every framework binding shares (@johnmorrisdotca/hata/react, /vue, /svelte, /react-native): the props a flag takes, the flag's
// inline SVG loaded from the per-flag modules, and a cache that lets a server render the flag at once. It names no framework.
// Each binding is a thin component over this: it asks `cachedFlag` for a flag already loaded (a server render, a static build) and
// `resolveFlag` for one still to be loaded, and draws the SVG string inside a span that has the element's box.

import { flag } from "./load.js";
import type { FlagRole } from "./manifest";
import { aspectOf } from "./svg";
import type { Fit } from "./svg";

/**
 * What a binding's flag takes: the same as `<hata-flag>`'s attributes. Every field but `code` may be left out.
 *
 * @example
 * ```ts
 * import { preloadFlags, type FlagProps } from "@johnmorrisdotca/hata/bind";
 *
 * const tokyo: FlagProps = { code: "JP-13", shape: "round", size: "medium", label: "Tokyo" };
 * await preloadFlags([tokyo]);
 * ```
 */
interface FlagProps {
  /** The flag's code, in any case: "JP", "jp-13", "CA-ON", "DE-BY". */
  code: string;
  /** `own` (the default: its own proportions), `4:3`, `1:1` or `round`, framed as `flag(code, { shape })` frames it. */
  shape?: "own" | "flag" | "4:3" | "1:1" | "round";
  /** How it fits a frame: `auto` (the default), `whole`, `crop`, `cover`, `hoist` or `contain`, as `frame()` takes them. */
  fit?: Fit;
  /** Its height: `small`, `medium` or `large` (24, 48 or 96 pixels), or a number of pixels. Left out, `1em`, the height of the text around it. */
  size?: "small" | "medium" | "large" | number | string;
  /** A width in pixels, with the height following the flag's proportions; overrides `size`. */
  width?: number | string;
  /** What a screen reader says. Left out, the place's name in `lang`. */
  label?: string;
  /** `en` or `ja`, the language of the name read out. Left out, English. */
  lang?: "en" | "ja";
  /** A hairline round the flag, so a white flag shows on a white page. */
  border?: boolean;
  /** A soft shadow under it. */
  shadow?: boolean;
  /** `auto` (the default), `light` or `dark`: the colour of the border on a light or a dark page. */
  theme?: "auto" | "light" | "dark";
  /** The day whose flag to draw: `"1962-09-29"`, `"1962-09"`, `"1962"` or a `Date`. The `variant` wins where both are given. */
  date?: string | Date;
  /** Which of the place's flags in real use to draw, by its `id` from `variantsOf(code)`: `de-facto`, `stripes`, `local`. Martinique's `local` is deprecated, an alias of `martinique` until 2.0. */
  variant?: string;
  /** With `date`: `legal` (the default) or `in-use`. (Not `role`, which is the ARIA role of the element.) */
  which?: FlagRole;
  /** Draw a flag whose display the law restricts (Germany's of 1935 to 1945), for history and education. Without it nothing is drawn. */
  allowRestricted?: boolean;
}

/**
 * A flag ready to draw: its SVG with a style that fills the box, its proportions and the name a screen reader says.
 *
 * @example
 * ```ts
 * import { resolveFlag, type BoundFlag } from "@johnmorrisdotca/hata/bind";
 *
 * const found: BoundFlag | null = await resolveFlag({ code: "JP" });
 * console.log(found?.name, found?.aspect); // "Japan" 1.5
 * ```
 */
interface BoundFlag {
  /** The flag's SVG, as the package ships it (framed as asked). `inlineSvg` makes it fill a span. */
  svg: string;
  /** What a screen reader says: `label`, or the place's name. */
  name: string;
  /** Width over height. */
  aspect: number;
}

const SIZES: Readonly<Record<string, number>> = { small: 24, medium: 48, large: 96 };
// What a flag is loaded by: everything that changes the picture or the name, and nothing that only changes the box.
const keyOf = (props: FlagProps): string =>
  JSON.stringify([props.code, props.shape ?? "own", props.fit ?? "auto", props.variant ?? "", props.variant === undefined && props.date !== undefined ? (props.date instanceof Date ? props.date.toISOString().slice(0, 10) : props.date) : "", props.which ?? "legal", props.allowRestricted === true, props.label ?? "", props.lang ?? "en"]);

const values = new Map<string, BoundFlag | null>();
const loading = new Map<string, Promise<BoundFlag | null>>();

const load = async (props: FlagProps): Promise<BoundFlag | null> => {
  const shape = props.shape === undefined || props.shape === "flag" ? "own" : props.shape;
  const options = {
    ...(shape === "own" ? {} : { shape, fit: props.fit ?? "auto" }),
    ...(props.variant === undefined ? {} : { variant: props.variant }),
    ...(props.variant === undefined && props.date !== undefined ? { date: props.date } : {}),
    ...(props.which === undefined ? {} : { role: props.which }),
    ...(props.allowRestricted === true ? { allowRestricted: true } : {}),
  };
  const svg = await flag(props.code, Object.keys(options).length === 0 ? undefined : (options as Parameters<typeof flag>[1]));
  if (svg === null) return null;
  const names = await import("./names.js");
  const name = props.label ?? names.flagName(props.code, props.lang ?? "en");
  const aspect = shape === "4:3" ? 4 / 3 : shape === "own" ? (aspectOf(svg) ?? names.flagAspect(props.code) ?? 1.5) : 1;

  return { svg, name: name ?? props.code, aspect };
};

/**
 * A flag's inline SVG, loaded from its own module (`flag(code, options)` from `/load`) and kept, so that it is loaded once. The promise
 * is the same for the same flag, which is what a framework's suspending hook wants.
 *
 * @param props - The flag, as the element's attributes give it.
 * @returns A promise of the flag, or of `null` when the package has no flag for it (an unknown code, a restricted flag asked for without `allowRestricted`, a date with no flag).
 * @throws TypeError, synchronously, when `code` is not a string or an option is not as `flag()` takes it.
 *
 * @example
 * ```ts
 * import { resolveFlag } from "@johnmorrisdotca/hata/bind";
 *
 * const japan = await resolveFlag({ code: "JP", label: "Japan" });
 * console.log(japan?.svg.startsWith("<svg")); // true
 * console.log(await resolveFlag({ code: "XX" })); // null
 * ```
 */
const resolveFlag = (props: FlagProps): Promise<BoundFlag | null> => {
  if (typeof props.code !== "string") throw new TypeError("code must be a string");
  const key = keyOf(props);
  const kept = loading.get(key);
  if (kept !== undefined) return kept;
  const promise = load(props).then((found) => {
    values.set(key, found);

    return found;
  });
  loading.set(key, promise);
  promise.catch(() => loading.delete(key));

  return promise;
};

/**
 * Load flags before a render that cannot wait: a server render to a string, a static build, the first render on the client that must match it.
 * After it, `cachedFlag` and the bindings' components give the flag at once.
 *
 * @param list - The flags to load.
 * @returns A promise that settles when every flag is loaded (a flag that has none is loaded as `null`).
 * @throws TypeError, synchronously, when a code is not a string.
 *
 * @example
 * ```ts
 * import { cachedFlag, preloadFlags } from "@johnmorrisdotca/hata/bind";
 *
 * await preloadFlags([{ code: "JP" }, { code: "CA", shape: "round" }]);
 * console.log(cachedFlag({ code: "JP" })?.name); // "Japan"
 * ```
 */
const preloadFlags = (list: readonly FlagProps[]): Promise<void> => Promise.all(list.map((props) => resolveFlag(props))).then(() => undefined);

/**
 * The flag, if it is already loaded: what a component draws at once, on a server or in a static build, with no waiting.
 *
 * @param props - The flag, as the element's attributes give it.
 * @returns The flag; `null` where it was loaded and there is none; `undefined` where it is not loaded yet (call `resolveFlag` or `preloadFlags`).
 *
 * @example
 * ```ts
 * import { cachedFlag, preloadFlags } from "@johnmorrisdotca/hata/bind";
 *
 * console.log(cachedFlag({ code: "FR" }));  // undefined: not loaded yet
 * await preloadFlags([{ code: "FR" }]);
 * console.log(cachedFlag({ code: "FR" })?.aspect); // 1.5
 * ```
 */
const cachedFlag = (props: FlagProps): BoundFlag | null | undefined => values.get(keyOf(props));

/**
 * The flag's SVG made to fill the span that holds it, and hidden from a screen reader (the span carries the name): what the web bindings put inside the span as HTML.
 *
 * @param svg - A flag's SVG string (`BoundFlag.svg`).
 * @returns The SVG with a style that fills its box, `aria-hidden` and `focusable="false"`.
 *
 * @example
 * ```ts
 * import { inlineSvg } from "@johnmorrisdotca/hata/bind";
 *
 * console.log(inlineSvg("<svg viewBox=\"0 0 3 2\"></svg>")); // <svg style="display:block;width:100%;height:100%" aria-hidden="true" focusable="false" viewBox="0 0 3 2"></svg>
 * ```
 */
const inlineSvg = (svg: string): string => svg.replace(/^<svg\b/, '<svg style="display:block;width:100%;height:100%" aria-hidden="true" focusable="false"');

/**
 * The inline style of the span that holds the flag, the element's box: its height, proportions, round corners, border and shadow.
 * A map from CSS property in camelCase to value: React and Vue take it as it is, and `styleText` writes it as a `style` attribute.
 *
 * @param props - The flag's props.
 * @param aspect - The flag's width over height (`BoundFlag.aspect`).
 * @returns The style.
 *
 * @example
 * ```ts
 * import { boxStyle } from "@johnmorrisdotca/hata/bind";
 *
 * console.log(boxStyle({ code: "JP", size: "medium", border: true }, 1.5).height); // "48px"
 * console.log(boxStyle({ code: "JP" }, 1.5).height);                              // "1em"
 * ```
 */
const boxStyle = (props: FlagProps, aspect: number): Record<string, string> => {
  const size = typeof props.size === "string" && Object.hasOwn(SIZES, props.size) ? SIZES[props.size] : Number(props.size);
  const width = Number(props.width);
  const dark = props.theme === "dark";
  const shadows = [props.border === true ? `0 0 0 1px ${dark ? "var(--hata-flag-border-dark, rgba(255,255,255,.32))" : "var(--hata-flag-border-light, rgba(0,0,0,.22))"}` : "", props.shadow === true ? "var(--hata-flag-shadow, 0 1px 3px rgba(0,0,0,.28))" : ""].filter(Boolean);

  return {
    display: "inline-block",
    height: Number.isFinite(width) && width > 0 ? "auto" : Number.isFinite(size) && size > 0 ? `${size}px` : "1em",
    width: Number.isFinite(width) && width > 0 ? `${width}px` : "",
    aspectRatio: String(aspect),
    verticalAlign: "-0.125em",
    lineHeight: "0",
    boxSizing: "border-box",
    ...(props.shape === "round" ? { borderRadius: "50%", overflow: "hidden" } : {}),
    ...(shadows.length > 0 ? { boxShadow: shadows.join(", ") } : {}),
  };
};

/**
 * `boxStyle` as the text of a `style` attribute, for a framework that takes a string (Svelte) or a template.
 *
 * @param style - A style from `boxStyle`.
 * @returns `display:inline-block;height:48px;…`, empty values left out.
 *
 * @example
 * ```ts
 * import { boxStyle, styleText } from "@johnmorrisdotca/hata/bind";
 *
 * console.log(styleText(boxStyle({ code: "JP", size: 24 }, 1.5)).includes("height:24px")); // true
 * ```
 */
const styleText = (style: Record<string, string>): string =>
  Object.entries(style)
    .filter(([, value]) => value !== "")
    .map(([name, value]) => `${name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}:${value}`)
    .join(";");

export { boxStyle, cachedFlag, inlineSvg, preloadFlags, resolveFlag, styleText };
export type { BoundFlag, FlagProps };
