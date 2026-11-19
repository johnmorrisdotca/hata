// `pnpm css [--only jp,ca,us] [--base <folder>] [--out <file>]` and `pnpm sprite [--only jp,ca,us] [--out <file>]`: the stylesheet or the sprite of the flags a page uses
// (every flag when --only is left out), from the built package, to the file named by --out or to the screen.
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

import { ROOT } from "./sources.ts";

const [kind, ...args] = process.argv.slice(2);
const option = (name: string): string | undefined => {
  const at = args.indexOf(`--${name}`);

  return at < 0 ? undefined : args[at + 1];
};
const only = option("only")?.split(",").filter(Boolean);
const { flagCss, flagSprite } = (await import(pathToFileURL(join(ROOT, "dist", "sheets.js")).href)) as typeof import("../src/sheets.ts");
if (kind !== "css" && kind !== "sprite") throw new Error("usage: node scripts/sheets.ts css|sprite [--only jp,ca] [--base <folder>] [--out <file>]");
const text = kind === "css" ? await flagCss(only, { base: option("base") }) : await flagSprite(only);
const out = option("out");
if (out === undefined) process.stdout.write(text);
else writeFileSync(out, text);
