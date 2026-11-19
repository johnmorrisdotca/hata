// The entry @johnmorrisdotca/hata/sheets: a stylesheet with one class for each flag, and an SVG sprite of symbols, for
// the flags a page names. Both read the flags and the manifest when called, so a page that never calls them pays nothing.

import { FLAG_CODES } from "./data/codes.data";
import type { FlagRecord } from "./manifest";
import { flag } from "./load.js";

const CODES: ReadonlySet<string> = new Set(FLAG_CODES);

/**
 * Where `flagCss` finds the SVG files: the folder `url()` reads them from, relative to the stylesheet or absolute.
 *
 * @example
 * ```ts
 * import { type SheetOptions } from "@johnmorrisdotca/hata/sheets";
 *
 * const own: SheetOptions = { base: "/static/flags" };
 * console.log(own.base);
 * ```
 */
interface SheetOptions {
  /** The folder's address, without a trailing slash. Left out, `../svg`: where `dist/svg` is from `dist/css`, so the package's own stylesheets work on a CDN and in `node_modules`. */
  base?: string;
}

// Each code as the package writes it, or a RangeError naming the ones that have no flag. No list means every flag.
const codesOf = (codes: readonly string[] | undefined): string[] => {
  if (codes === undefined) return [...FLAG_CODES];
  if (!Array.isArray(codes) || codes.some((code) => typeof code !== "string")) throw new TypeError("codes must be an array of strings");
  const written = codes.map((code) => code.trim().toUpperCase().replace(/_/g, "-"));
  const unknown = written.filter((code) => !CODES.has(code));
  if (unknown.length > 0) throw new RangeError(`no flag for ${unknown.join(", ")}`);

  return [...new Set(written)];
};

const BASE = "display:inline-block;box-sizing:border-box;height:1em;background-position:center;background-repeat:no-repeat;background-size:contain;vertical-align:-.125em";
const SHAPES = [["4:3", "4x3", "4/3"], ["1:1", "1x1", "1"], ["round", "round", "1"]] as const;
const NEUTRAL = "#e6e6e6";

// The file a flag's drawing made for a frame is: "flags/1x1/fr.svg" in flag-icons' tree is dist/svg/fr.1x1.svg, and a flag that shares another's picture uses the other's.
const adaptedFile = (file: string): string => {
  const found = /^flags\/(\dx\d)\/([a-z0-9-]+)\.svg$/.exec(file);
  if (found === null) throw new Error(`unexpected drawing path ${file}`);

  return `${found[2]}.${found[1]}.svg`;
};

// What a frame changes about the flag's own rule: the drawing made for it, the side a crop keeps, or the whole flag (on a neutral disc when round).
const framed = (record: FlagRecord, shape: (typeof SHAPES)[number], base: string): string => {
  const framing = record.framings[shape[0]];
  if (framing.method === "adapted") return `background-image:url(${base}/${adaptedFile(framing.file ?? "")})`;
  if (framing.method === "crop") return `background-position:${framing.crop.at === "centre" ? "center" : framing.crop.at}`;
  if (framing.method !== "contain") return "";
  if (shape[0] !== "round") return "background-size:contain";
  // In a circle the whole flag is the rectangle of its own shape whose corners touch the circle.
  const aspect = record.width / record.height;

  return `background-color:${NEUTRAL};background-size:${Number(((100 * aspect) / Math.hypot(aspect, 1)).toFixed(2))}%`;
};

/**
 * A stylesheet with a class for each flag asked for, to put on an element beside `hata`: `<span class="hata hata-jp"></span>`.
 * The class draws the flag as a background of the element's height (`1em` left alone), at its true proportions and never stretched;
 * `hata-4x3`, `hata-1x1` and `hata-round` frame it as the package's frames do (`flag(code, { shape })`): the drawing made for the shape
 * where there is one, a crop kept at the side measured for it, or the whole flag. The classes are `hata`-led, so they sit beside flag-icons' while a site moves.
 * The drawings are the package's SVG files, read by `url()`, so the stylesheet is small and a page loads only the flags it shows.
 *
 * @param codes - The flags to include, in any case; left out, every flag. Writing the few a page uses keeps a bundler from copying the rest.
 * @param options - `base`, the folder the SVG files are in (`../svg` when left out).
 * @returns The CSS text.
 * @throws TypeError when `codes` is not an array of strings, or `options.base` is not a string.
 * @throws RangeError when a code has no flag here.
 *
 * @example
 * ```ts
 * import { flagCss } from "@johnmorrisdotca/hata/sheets";
 *
 * const css = await flagCss(["jp", "ca"], { base: "/flags" });
 * console.log(css.includes(".hata-jp{")); // true
 * console.log(css.includes(".hata-us{")); // false
 * ```
 */
const flagCss = async (codes?: readonly string[], options: SheetOptions = {}): Promise<string> => {
  const base = options.base === undefined ? "../svg" : options.base;
  if (typeof base !== "string") throw new TypeError("base must be a string");
  const wanted = codesOf(codes);
  const { MANIFEST } = await import("./manifest.js");
  const records = new Map(MANIFEST.map((one) => [one.code, one]));
  const own: string[] = [];
  const frames: string[] = [];
  for (const code of wanted) {
    const record = records.get(code) as FlagRecord;
    const name = `hata-${code.toLowerCase()}`;
    own.push(`.${name}{aspect-ratio:${record.width}/${record.height};background-image:url(${base}/${code.toLowerCase()}.svg)}`);
    for (const shape of SHAPES) {
      const change = framed(record, shape, base);
      if (change !== "") frames.push(`.hata.hata-${shape[1]}.${name}{${change}}`);
    }
  }
  const shapes = SHAPES.map((shape) => `.hata.hata-${shape[1]}{aspect-ratio:${shape[2]};background-size:cover${shape[0] === "round" ? ";border-radius:50%" : ""}}`);

  return `/* Hata flags: each drawing has its own source, author and licence, in NOTICE.md and manifest.json. */\n.hata{${BASE}}\n${own.join("\n")}\n${shapes.join("\n")}\n${frames.join("\n")}\n`;
};

// A flag's root tag, and the parts of it a symbol keeps: its viewBox and presentation attributes, not the namespace or the name tag.
const ROOT = /^<svg\b([^>]*)>/;

/**
 * An SVG sprite: one `<symbol id="hata-jp">` for each flag asked for, each with its flag's viewBox, drawn by an `<svg>` that `use`s it:
 * `<svg viewBox="0 0 3 2" width="48"><use href="sprite.svg#hata-jp"/></svg>`. A flag that shares another's picture (French Guiana's is France's)
 * is written once, and the other codes' symbols use it. A browser reads a sprite file only from the same origin, so put it on your own site or in the page.
 *
 * @param codes - The flags to include, in any case; left out, every flag. Every flag is some 9 MB, so write the ones a page uses.
 * @returns The sprite as an SVG document.
 * @throws TypeError when `codes` is not an array of strings.
 * @throws RangeError when a code has no flag here.
 *
 * @example
 * ```ts
 * import { flagSprite } from "@johnmorrisdotca/hata/sheets";
 *
 * const sprite = await flagSprite(["jp", "gf", "fr"]);
 * console.log(sprite.includes('<symbol id="hata-jp"')); // true
 * console.log(sprite.includes('<use href="#hata-gf"/>')); // true: fr is written once, in the symbol of the code asked for first
 * ```
 */
const flagSprite = async (codes?: readonly string[]): Promise<string> => {
  const symbols: string[] = [];
  const drawn = new Map<string, string>();
  for (const code of codesOf(codes)) {
    const svg = (await flag(code)) as string;
    const [root, attributes] = ROOT.exec(svg) as RegExpExecArray;
    const picture = /\bdata-hata="([^"]*)"/.exec(attributes)?.[1] ?? code.toLowerCase();
    const id = `hata-${code.toLowerCase()}`;
    const kept = attributes.replace(/\s(xmlns|data-hata)="[^"]*"/g, "");
    const earlier = drawn.get(picture);
    if (earlier === undefined) {
      drawn.set(picture, id);
      symbols.push(`<symbol id="${id}"${kept}>${svg.slice(root.length, svg.lastIndexOf("</svg>"))}</symbol>`);
    } else {
      const viewBox = /\sviewBox="[^"]*"/.exec(kept)?.[0] ?? "";
      symbols.push(`<symbol id="${id}"${viewBox}><use href="#${earlier}"/></symbol>`);
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg">\n${symbols.join("\n")}\n</svg>\n`;
};

export { flagCss, flagSprite };
export type { SheetOptions };
