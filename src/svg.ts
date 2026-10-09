// The helpers that work on a flag's SVG string: its aspect ratio, a frame at another shape, and a data: URI.
// Pure string work, no DOM, so they run the same on a server and in a browser.

import { FRAMINGS } from "./data/framings.data";

/**
 * The shapes a flag can be framed in. `flag` is its own aspect ratio; `4:3` and `1:1` are the icon sizes most
 * flag sets ship; `round` is a circle, as on a map pin or an avatar.
 *
 * @example
 * ```ts
 * import { frame, type Shape } from "@johnmorrisdotca/hata";
 * import japan from "@johnmorrisdotca/hata/flags/jp";
 *
 * const shapes: Shape[] = ["flag", "4:3", "1:1", "round"];
 * const icons = shapes.map((shape) => frame(japan, { shape }));
 * ```
 */
type Shape = "flag" | "4:3" | "1:1" | "round";

/**
 * How a flag sits in a frame of another shape:
 *
 * - `auto` (the default): the way measured for this flag, so that the frame keeps every colour of the flag. A
 *   flag's own SVG from this package names its flag (`data-hata`), and `pnpm data:framing` measured, for each
 *   frame, whether a crop from the centre keeps every colour that covers 5% of the flag at no less than half its
 *   share; if not, whether a crop from the hoist (the side by the pole) does; if not, the whole flag is shown.
 *   An SVG that names no flag of this package is shown whole.
 * - `cover`: fills the frame and crops what is outside it, centred, as CSS's `object-fit: cover` does.
 * - `hoist`: fills the frame and crops from the fly, keeping the side by the pole, where many flags put their
 *   emblem (Portugal's arms, a canton's stars).
 * - `contain`: shows the whole flag, with clear bands where the shapes differ, and a neutral disc behind it in a
 *   round frame.
 *
 * Where a flag set draws a hand-adapted square or 4:3 version of the flag (flag-icons redraws Canada's square
 * with narrower red bars), `flag(code, { shape })` from `/load` uses that drawing instead; `frame()` works on the
 * one SVG it is given, so it can only crop or fit it.
 *
 * @example
 * ```ts
 * import { frame, type Fit } from "@johnmorrisdotca/hata";
 * import canada from "@johnmorrisdotca/hata/flags/ca";
 *
 * const fit: Fit = "contain";
 * frame(canada, { shape: "1:1", fit }); // all of Canada's 1:2 flag, centred in a square
 * frame(canada, { shape: "1:1" });      // the same: a centred crop would lose the red bars
 * ```
 */
type Fit = "auto" | "cover" | "hoist" | "contain";

/**
 * How to frame a flag: its shape, how it fits, and a label for assistive technology. Every field may be left out.
 *
 * @example
 * ```ts
 * import { frame, type FrameOptions } from "@johnmorrisdotca/hata";
 * import france from "@johnmorrisdotca/hata/flags/fr";
 *
 * const avatar: FrameOptions = { shape: "round", label: "France" };
 * frame(france, avatar);
 * ```
 */
interface FrameOptions {
  /** The frame's shape: `flag` (the default, the flag's own aspect ratio), `4:3`, `1:1` or `round`. */
  shape?: Shape;
  /** `auto` (the default) frames each flag the way measured to keep its colours; `cover` and `hoist` crop to fill the frame; `contain` shows all of the flag inside it. */
  fit?: Fit;
  /** A name for assistive technology. With one, the SVG gets `role="img"`, `aria-label` and a `<title>`. */
  label?: string;
}

const SHAPES: readonly Shape[] = ["flag", "4:3", "1:1", "round"];
const FITS: readonly Fit[] = ["auto", "cover", "hoist", "contain"];
const FRAMED_SHAPES = ["4:3", "1:1", "round"] as const;
const LETTER_FIT: Readonly<Record<string, Exclude<Fit, "auto">>> = { c: "cover", h: "hoist", w: "contain" };

// The fit `auto` means for one picture and shape: the one measured for the flag it names, cover where nothing
// was recorded against it, and contain for a picture that names no flag of this package.
const autoFit = (svg: string, shape: Exclude<Shape, "flag">): Exclude<Fit, "auto"> => {
  const named = /\sdata-hata="([a-z0-9-]+)"/.exec(ROOT.exec(svg)?.[0] ?? "")?.[1];
  if (named === undefined) return "contain";
  const letters = (FRAMINGS[named] ?? "c,c,c").split(",");

  return LETTER_FIT[letters[FRAMED_SHAPES.indexOf(shape)] ?? "c"] ?? "cover";
};
const ROOT = /^<svg\b[^>]*>/;

const mustBeString = (value: unknown, name: string): string => {
  if (typeof value !== "string") throw new TypeError(`${name} must be a string, not ${value === null ? "null" : typeof value}`);
  return value;
};

// A frame's options with their defaults, or a TypeError for a value that is not one of them: misuse is told at once.
const checkFrameOptions = (options: FrameOptions): { shape: Shape; fit: Fit } => {
  if (typeof options !== "object" || options === null) throw new TypeError("options must be an object");
  const shape = options.shape ?? "flag";
  const fit = options.fit ?? "auto";
  if (!SHAPES.includes(shape)) throw new TypeError(`shape must be one of ${SHAPES.join(", ")}`);
  if (!FITS.includes(fit)) throw new TypeError(`fit must be one of ${FITS.join(", ")}`);
  if (options.label !== undefined) mustBeString(options.label, "label");

  return { shape, fit };
};

const escapeText = (text: string): string => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// The root element's viewBox as four numbers, or null when the string is not an SVG with a usable viewBox.
const viewBoxOf = (svg: string): [number, number, number, number] | null => {
  const root = ROOT.exec(svg.trimStart())?.[0];
  if (root === undefined) return null;
  const box = /\sviewBox\s*=\s*["']([^"']*)["']/.exec(root)?.[1];
  if (box === undefined) return null;
  const numbers = box.trim().split(/[\s,]+/).map(Number);
  if (numbers.length !== 4 || !numbers.every(Number.isFinite) || numbers[2]! <= 0 || numbers[3]! <= 0) return null;

  return numbers as [number, number, number, number];
};

// A short, stable name made from the text, for an id the frame adds (its clip path): the same flag framed twice
// gives the same id, two different flags different ones.
const hashOf = (text: string): string => {
  let hash = 5381;
  for (let at = 0; at < text.length; at += 1) hash = ((hash * 33) ^ text.charCodeAt(at)) >>> 0;

  return hash.toString(36);
};

/**
 * The aspect ratio of a flag, width over height, read from its SVG's viewBox: 1.5 for Japan's 2:3, 2 for
 * Canada's 1:2, 1.9 for the United States' 10:19.
 *
 * @param svg - A flag's SVG string, from `/flags/<code>` or `flag()`.
 * @returns The width divided by the height, or `null` when the string is not an SVG with a viewBox.
 * @throws TypeError when `svg` is not a string.
 *
 * @example
 * ```ts
 * import { aspectOf } from "@johnmorrisdotca/hata";
 * import japan from "@johnmorrisdotca/hata/flags/jp";
 *
 * aspectOf(japan);         // 1.5
 * aspectOf("not an svg");  // null
 * ```
 */
const aspectOf = (svg: string): number | null => {
  const box = viewBoxOf(mustBeString(svg, "svg"));

  return box === null ? null : box[2] / box[3];
};

/**
 * A flag framed in another shape without stretching it: at its own aspect ratio, at 4:3, square, or in a
 * circle. The flag is nested, whole, inside a new SVG of the frame's shape, and its own viewBox and
 * `preserveAspectRatio` place it: by default (`fit: "auto"`) the way measured for that flag to keep its colours,
 * so Canada's square shows the whole flag rather than a crop that drops its red bars, and Japan's is cropped
 * to the disc; `cover` crops from the centre, `hoist` from the fly, and `contain` shows all of it.
 * The result is an SVG string like any flag's, with no width or height, so it fills the box it is put in.
 *
 * With `shape: "flag"` and no `label`, the flag is handed back as it was.
 *
 * @param svg - A flag's SVG string, from `/flags/<code>` or `flag()`.
 * @param options - `shape` (`"flag"`, `"4:3"`, `"1:1"` or `"round"`; `"flag"` when left out), `fit` (`"auto"`,
 *   `"cover"`, `"hoist"` or `"contain"`; `"auto"` when left out) and `label`, a name for assistive technology.
 * @returns The framed SVG string, or `null` when `svg` is not an SVG with a viewBox.
 * @throws TypeError when `svg` is not a string, or `options` names a shape or a fit that is not one.
 *
 * @example
 * ```ts
 * import { frame } from "@johnmorrisdotca/hata";
 * import canada from "@johnmorrisdotca/hata/flags/ca";
 *
 * frame(canada, { shape: "round" });                    // the whole flag on a neutral disc: a crop would lose its bars
 * frame(canada, { shape: "round", fit: "cover" });      // a circle, the maple leaf in the middle
 * frame(canada, { shape: "4:3", fit: "contain" });      // all of the 1:2 flag, with bands above and below
 * frame(canada, { label: "Canada" });                   // the flag, with role="img" and a title
 * ```
 */
const frame = (svg: string, options: FrameOptions = {}): string | null => {
  mustBeString(svg, "svg");
  const { shape, fit: asked } = checkFrameOptions(options);
  const text = svg.trim();
  const box = viewBoxOf(text);
  if (box === null) return null;
  const label = options.label === undefined ? "" : ` role="img" aria-label="${escapeText(options.label)}"`;
  const title = options.label === undefined ? "" : `<title>${escapeText(options.label)}</title>`;
  if (shape === "flag") {
    if (options.label === undefined) return text;
    return text.replace(ROOT, (root) => `${root.slice(0, -1)}${label}>${title}`);
  }
  const fit = asked === "auto" ? autoFit(text, shape) : asked;
  const [width, height] = shape === "4:3" ? [640, 480] : [512, 512];
  const placement = fit === "cover" ? "xMidYMid slice" : fit === "hoist" ? "xMinYMid slice" : "xMidYMid meet";
  // In a circle, the whole flag is the rectangle of its own shape whose corners touch the circle.
  const aspect = box[2] / box[3];
  const [x, y, w, h] =
    shape === "round" && fit === "contain"
      ? [256 - 256 * (aspect / Math.hypot(aspect, 1)), 256 - 256 / Math.hypot(aspect, 1), 512 * (aspect / Math.hypot(aspect, 1)), 512 / Math.hypot(aspect, 1)].map((value) => Number(value.toFixed(2)))
      : [0, 0, width, height];
  // The flag's own root becomes a nested <svg> the size of the frame; its viewBox and placement keep it unstretched.
  const inner = text.replace(ROOT, (root) => `${root.slice(0, -1).replace(/\s(width|height|x|y|preserveAspectRatio)\s*=\s*["'][^"']*["']/g, "")} x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="${placement}">`);
  const open = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}"${label}>${title}`;
  if (shape !== "round") return `${open}${inner}</svg>`;
  const id = `hata-round-${hashOf(`${fit}|${text}`)}`;
  const disc = fit === "contain" ? `<circle cx="256" cy="256" r="256" fill="#e6e6e6"/>` : "";

  return `${open}<defs><clipPath id="${id}"><circle cx="256" cy="256" r="256"/></clipPath></defs><g clip-path="url(#${id})">${disc}${inner}</g></svg>`;
};

/**
 * A flag's SVG as a `data:` URI, ready for an `<img src>`, a CSS `background-image: url(…)` or a canvas. Only
 * the characters that must be escaped are, so it stays readable and close to the SVG's own size (smaller than
 * base64).
 *
 * @param svg - A flag's SVG string, framed or not.
 * @returns `data:image/svg+xml,…`, or `null` when the string is not an SVG.
 * @throws TypeError when `svg` is not a string.
 *
 * @example
 * ```ts
 * import { toDataUri } from "@johnmorrisdotca/hata";
 * import japan from "@johnmorrisdotca/hata/flags/jp";
 *
 * const img = document.createElement("img");
 * img.src = toDataUri(japan) ?? "";
 * img.alt = "Japan";
 * ```
 */
const toDataUri = (svg: string): string | null => {
  const text = mustBeString(svg, "svg").trim();
  if (!ROOT.test(text)) return null;
  const encoded = text
    .replace(/%/g, "%25")
    .replace(/"/g, "%22")
    .replace(/#/g, "%23")
    .replace(/</g, "%3C")
    .replace(/>/g, "%3E")
    // Control characters (newlines among them) and everything past ASCII, percent-encoded as UTF-8.
    // eslint-disable-next-line no-control-regex
    .replace(/[\u{0}-\u{1f}\u{7f}-\u{10ffff}]/gu, (character) => encodeURIComponent(character));

  return `data:image/svg+xml,${encoded}`;
};

export { aspectOf, checkFrameOptions, frame, mustBeString, toDataUri };
export type { Fit, FrameOptions, Shape };
