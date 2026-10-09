// One flag from Commons' SVG to the SVG this package ships: given a viewBox it can scale by, optimised with SVGO,
// its ids and class names made its own, and checked for anything that could reach outside the picture.
//
//   - The viewBox is kept, or made from width and height when the file has none; width, height and any
//     preserveAspectRatio on the root are taken off, so the flag fills whatever box it is put in at its own
//     aspect ratio, never stretched (a browser's default, xMidYMid meet).
//   - SVGO 4's default preset without convertTransform (which moved Niue's stars off the flag), with numbers
//     rounded to the flag's own precision: the fewest decimals at which the optimised flag still draws the same
//     as Commons' file, measured in Chromium by `pnpm data:tune` and kept in scripts/precision.data.json.
//     A flag not measured yet gets three decimals, SVGO's own default. For the rare flag that convertPathData
//     redraws visibly at any precision (the Northwest Territories'), `keepPaths` leaves its paths as written.
//   - Every id and class gets a prefix of the flag's own (hata-jp-13-…), and styles are moved onto the elements
//     where SVGO can, so two flags inlined in one page cannot restyle or reference each other.
//   - Scripts, event handlers and foreignObject are refused, and so is a reference to anything outside the file;
//     the build stops rather than ship one.

import { optimize } from "svgo";
import type { Config } from "svgo";

interface Optimised {
  svg: string;
  width: number; // The viewBox's
  height: number;
  precision: number;
  notes: string[]; // Things worth knowing about the picture: text drawn with a font, an embedded raster picture
}

const NUMBER = /^\s*([0-9.]+(?:e[+-]?[0-9]+)?)\s*(px)?\s*$/i;

// The root's viewBox, or one made from its width and height when both are plain numbers (or px).
const viewBoxOf = (svg: string): { x: number; y: number; width: number; height: number; made: boolean } => {
  const root = /<svg\b[^>]*>/.exec(svg)?.[0];
  if (root === undefined) throw new Error("no <svg> element");
  const attribute = (name: string): string | undefined => new RegExp(`\\s${name}\\s*=\\s*("([^"]*)"|'([^']*)')`).exec(root)?.slice(2).find((value) => value !== undefined);
  const box = attribute("viewBox");
  if (box !== undefined) {
    const [x, y, width, height] = box.trim().split(/[\s,]+/).map(Number);
    if ([x, y, width, height].every((value) => Number.isFinite(value)) && width! > 0 && height! > 0) return { x: x!, y: y!, width: width!, height: height!, made: false };
  }
  const width = NUMBER.exec(attribute("width") ?? "")?.[1];
  const height = NUMBER.exec(attribute("height") ?? "")?.[1];
  if (width === undefined || height === undefined) throw new Error("no viewBox, and no width and height in plain numbers to make one from");

  return { x: 0, y: 0, width: Number(width), height: Number(height), made: true };
};

// The decimals a flag is rounded to when nothing has been measured for it: SVGO's own default.
const DEFAULT_PRECISION = 3;

interface OptimiseOptions {
  precision?: number; // Decimals numbers are rounded to; DEFAULT_PRECISION when left out
  keepPaths?: boolean; // Leave path data as drawn (convertPathData off)
}

const config = (prefix: string, precision: number, keepPaths: boolean): Config => ({
  multipass: true,
  floatPrecision: precision,
  plugins: [
    {
      name: "preset-default",
      params: {
        overrides: {
          // Ids are made the flag's own below, by prefixIds, rather than shortened to letters every flag shares.
          cleanupIds: { minify: true, preserve: [] },
          inlineStyles: { onlyMatchedOnce: false },
          // Rewriting transforms moved whole parts of some flags (Niue's stars); a transform is left as drawn.
          convertTransform: false,
          ...(keepPaths ? { convertPathData: false } : {}),
        },
      },
    },
    "removeDimensions",
    "removeScripts",
    "removeXlink",
    { name: "removeAttrs", params: { attrs: ["svg:preserveAspectRatio", "svg:version", "svg:id", "svg:x", "svg:y", "svg:enable-background", "svg:baseProfile"], elemSeparator: ":" } },
    { name: "prefixIds", params: { prefix, delim: "-", prefixIds: true, prefixClassNames: true } },
  ],
});

// What a shipped flag may not hold. Each is a way out of the picture: code that runs, or a reference to a file
// or a page elsewhere.
const FORBIDDEN: readonly [RegExp, string][] = [
  [/<script\b/i, "a script"],
  [/\son[a-z]+\s*=/i, "an event handler"],
  [/<foreignObject\b/i, "foreignObject"],
  [/<(iframe|object|embed|audio|video|animate|set|handler|listener)\b/i, "an element that can load or run something"],
  [/(href|src)\s*=\s*["'](?!#|data:image\/(png|jpeg|gif|webp);base64,)/i, "a reference outside the file"],
  [/url\(\s*["']?(?!#)/i, "a url() outside the file"],
  [/@import\b/i, "an @import"],
  [/javascript:/i, "a javascript: address"],
  [/<!ENTITY|<!DOCTYPE/i, "a DTD or entity"],
];

const optimiseFlag = (raw: string, code: string, options: OptimiseOptions = {}): Optimised => {
  const precision = options.precision ?? DEFAULT_PRECISION;
  const box = viewBoxOf(raw);
  let source = raw;
  if (box.made) source = source.replace(/<svg\b/, `<svg viewBox="0 0 ${box.width} ${box.height}"`);
  const prefix = `hata-${code.toLowerCase()}`;
  const svg = optimize(source, config(prefix, precision, options.keepPaths === true)).data.replace(/\s+$/, "");
  for (const [pattern, what] of FORBIDDEN) if (pattern.test(svg)) throw new Error(`${code}: the optimised SVG still holds ${what}`);
  if (!/^<svg\b[^>]*\sviewBox="/.test(svg)) throw new Error(`${code}: the optimised SVG has lost its viewBox`);
  if (!/^<svg\b[^>]*\sxmlns="http:\/\/www\.w3\.org\/2000\/svg"/.test(svg)) throw new Error(`${code}: the optimised SVG has no SVG namespace`);
  const notes: string[] = [];
  if (/<text\b/.test(svg)) notes.push("text drawn with a font, which looks a little different on each device");
  if (/data:image\/(png|jpeg|gif|webp)/.test(svg)) notes.push("an embedded raster picture, which blurs when enlarged");
  if (/<style\b/.test(svg)) notes.push("a style element, its class names prefixed with the flag's own");
  const final = viewBoxOf(svg);

  return { svg, width: final.width, height: final.height, precision, notes };
};

export { DEFAULT_PRECISION, optimiseFlag };
export type { Optimised, OptimiseOptions };
