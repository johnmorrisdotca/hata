// The parts of dist/ that tsup does not write, after it has run (`pnpm build` runs both):
//
//   - dist/flags/<code>.d.ts: each flag's types, with its doc comment carried over from src/flags/<code>.ts, so an
//     editor shows which flag it is, its size and its source;
//   - dist/svg/<code>.svg: each flag (but not one the law restricts) as a file, the same SVG as the module's string, for an <img src>, a CSS url()
//     or a CDN address (flagUrl);
//   - dist/manifest.json: /manifest's records and the codes left out, as JSON, for a tool that does not run JavaScript.

import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

import { ROOT } from "./sources.ts";

const SRC = join(ROOT, "src", "flags");
const DIST = join(ROOT, "dist");
mkdirSync(join(DIST, "svg"), { recursive: true });

// The flags the law restricts (RESTRICTED in /manifest): their modules are built, for the call that asks for one by name, but no file of theirs is in
// dist/svg (the listing a CDN shows, and what `flagUrl` points into) and no record of them is in manifest.json's list of flags.
const manifest = (await import(pathToFileURL(join(DIST, "manifest.js")).href)) as { MANIFEST: unknown[]; LEFT_OUT: unknown[]; RESTRICTED: { code: string; variant: { module: string } }[] };
const restrictedModules = new Set(manifest.RESTRICTED.map((one) => one.variant.module));

let count = 0;
for (const file of readdirSync(SRC).filter((name) => name.endsWith(".ts")).sort()) {
  const code = file.slice(0, -3);
  const source = readFileSync(join(SRC, file), "utf8");
  const doc = /\/\*\*[\s\S]*?\*\//.exec(source)?.[0];
  if (doc === undefined) throw new Error(`src/flags/${file} has no doc comment`);
  writeFileSync(join(DIST, "flags", `${code}.d.ts`), `${doc}\ndeclare const svg: string;\n\nexport { svg };\nexport default svg;\n`);
  const built = (await import(pathToFileURL(join(DIST, "flags", `${code}.js`)).href)) as { svg: string; default: string };
  if (built.default !== built.svg || !built.svg.startsWith("<svg")) throw new Error(`dist/flags/${code}.js does not export its SVG`);
  if (!restrictedModules.has(code)) writeFileSync(join(DIST, "svg", `${code}.svg`), `${built.svg}\n`);
  count += 1;
}

const pkg = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8")) as { name: string; version: string };
writeFileSync(join(DIST, "manifest.json"), `${JSON.stringify({ package: pkg.name, version: pkg.version, flags: manifest.MANIFEST, leftOut: manifest.LEFT_OUT, restricted: manifest.RESTRICTED }, null, 1)}\n`);
console.log(`build-extras: ${count} flags' types and SVG files, and manifest.json`);
