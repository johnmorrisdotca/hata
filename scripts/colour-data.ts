// The colours of each flag as the package ships them: what scripts/colours.mjs measured (scripts/colours.data.json),
// each colour given the nearest name of a closed list. scripts/build-data.ts reads this for the manifest's `colours`
// and for src/data/colours.data.ts; nothing here is typed by hand but the list of names and the rule that picks one.

import { readFileSync } from "node:fs";
import { join } from "node:path";

import { ROOT } from "./sources.ts";

// The closed list a colour is named from, in the order a colour picker shows them. A name is a word a person would
// use of a flag ("red, white and blue"), not a shade: two blues are both `blue`, and the hex says which.
const COLOUR_NAMES = ["red", "orange", "yellow", "green", "light-blue", "blue", "purple", "brown", "black", "grey", "white"] as const;
type ColourName = (typeof COLOUR_NAMES)[number];

/** A colour's hue in degrees, its saturation and its lightness (HSL), each of the last two from 0 to 1. */
const hsl = (hex: string): { hue: number; saturation: number; light: number; high: number } => {
  const [r, g, b] = [1, 3, 5].map((at) => Number.parseInt(hex.slice(at, at + 2), 16) / 255) as [number, number, number];
  const high = Math.max(r, g, b);
  const low = Math.min(r, g, b);
  const delta = high - low;
  const light = (high + low) / 2;
  const saturation = delta === 0 ? 0 : delta / (1 - Math.abs(2 * light - 1));
  let hue = 0;
  if (delta !== 0) {
    if (high === r) hue = ((g - b) / delta) % 6;
    else if (high === g) hue = (b - r) / delta + 2;
    else hue = (r - g) / delta + 4;
  }

  return { hue: (hue * 60 + 360) % 360, saturation, light, high };
};

/**
 * The name of a colour, of COLOUR_NAMES: a rule on its hue, saturation and lightness, with no flag named in it.
 *
 *   - nearly no light in any channel: black. Nearly all light: white. Little saturation: white where light, black
 *     where dark, else grey.
 *   - by hue: red (330 to 15 degrees), orange (to 38), yellow (to 70), green (to 180), blue (to 260), purple (to 330).
 *   - brown is a dark or dull orange, or a very dark yellow.
 *   - light-blue is a blue of hue under 200 (cyan, turquoise) that is not dark, a blue of hue under 220 (sky blue)
 *     of middling lightness or more, or any blue that is light.
 */
const colourName = (hex: string): ColourName => {
  if (!/^#[0-9a-f]{6}$/.test(hex)) throw new TypeError(`${hex} is not a colour written as #rrggbb in lower case`);
  const { hue, saturation, light, high } = hsl(hex);
  if (high < 0.2) return "black";
  if (light > 0.92 || (light > 0.85 && saturation < 0.35)) return "white";
  if (saturation < 0.18) return light > 0.8 ? "white" : light < 0.25 ? "black" : "grey";
  if (hue < 15 || hue >= 330) return "red";
  if (hue < 38) return light < 0.4 || (saturation < 0.5 && light < 0.7) ? "brown" : "orange";
  if (hue < 70) return light < 0.25 ? "brown" : "yellow";
  if (hue < 180) return "green";
  if (hue < 200) return light >= 0.35 ? "light-blue" : "blue";
  if (hue < 220) return light >= 0.55 ? "light-blue" : "blue";
  if (hue < 260) return light >= 0.7 ? "light-blue" : "blue";

  return "purple";
};

interface Measured {
  width: number;
  height: number;
  drawn: number;
  colours: [hex: string, share: number][];
  merged: number;
}
interface ColourRecord {
  hex: string;
  share: number;
  name: ColourName;
}

const MEASURED = JSON.parse(readFileSync(join(ROOT, "scripts", "colours.data.json"), "utf8")) as Record<string, Measured>;

/** The colours measured for a picture ("CA", "AF--de-facto"), the largest first; undefined where it is not measured yet. */
const coloursOfPicture = (key: string): ColourRecord[] | undefined => MEASURED[key]?.colours.map(([hex, share]) => ({ hex, share, name: colourName(hex) }));

/**
 * src/data/colours.data.ts: every code and every "<code>--<variant>" with its colours, or with the key whose picture
 * (and so whose colours) it has. `rows` is [key, the measured picture's key], in the order to write them.
 */
const coloursDataFile = (header: string, rows: readonly (readonly [key: string, picture: string])[]): string => {
  const line = ([key, picture]: readonly [string, string]): string => {
    if (key !== picture) return `  ${JSON.stringify(key)}: ${JSON.stringify(picture)},`;
    const colours = coloursOfPicture(picture)!;

    return `  ${JSON.stringify(key)}: [${colours.map((one) => `[${JSON.stringify(one.hex)},${one.share},${COLOUR_NAMES.indexOf(one.name)}]`).join(",")}],`;
  };

  return `${header}
// Every flag's colours, measured by scripts/colours.mjs (pnpm data:colours) from the shipped drawing and named by
// scripts/colour-data.ts: by code, and by "<code>--<id>" for a variant. A colour is [hex, the share of the flag it
// covers, its name's place in COLOUR_NAMES]; a key whose picture is another's has that key instead of a list.

import type { ColourName } from "../manifest.types";

const COLOUR_NAMES = ${JSON.stringify(COLOUR_NAMES)} as const satisfies readonly ColourName[];

const COLOURS: Readonly<Record<string, string | readonly (readonly [hex: string, share: number, name: number])[]>> = {
${rows.map(line).join("\n")}
};

export { COLOUR_NAMES, COLOURS };
`;
};

export { colourName, COLOUR_NAMES, coloursDataFile, coloursOfPicture };
export type { ColourName, ColourRecord };
