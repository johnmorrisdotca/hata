// What a page pays for each entry, measured on the built files (pnpm check builds before it tests): the main entry
// and /load carry no flag; each flag is its own small file; the flags over the budget are the ones docs/sizes.md
// lists, and none is over the ceiling.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { BUDGET_BYTES, CEILING_BYTES } from "../scripts/data-config";
import { MANIFEST } from "./manifest";

const KB = 1024;
const size = (path: string): number => {
  if (!existsSync(path)) throw new Error(`${path} is not built: run pnpm build first (pnpm check does)`);

  return statSync(path).size;
};

describe("the built entries", () => {
  it("keep the main entry under 12 KB, /load under 28 KB and its table of frames' drawings under 36 KB, with no flag in any", () => {
    // /load is one line a flag, about 55 bytes each; dist/adapted.js one a frame's drawing, loaded when a frame is asked for.
    expect(size("dist/index.js")).toBeLessThan(12 * KB);
    expect(size("dist/load.js")).toBeLessThan(28 * KB);
    expect(size("dist/adapted.js")).toBeLessThan(36 * KB);
    for (const file of ["dist/index.js", "dist/load.js", "dist/adapted.js"]) expect(readFileSync(file, "utf8"), file).not.toContain("<path");
  });

  it("make each flag's module its SVG and a line, no larger than the ceiling, and a shared flag's a line alone", () => {
    const files = readdirSync("dist/flags").filter((file) => file.endsWith(".js") && !/\.(4x3|1x1)\.js$/.test(file) && !file.includes("--"));
    expect(files).toHaveLength(MANIFEST.length);
    for (const record of MANIFEST) {
      const bytes = size(`dist/flags/${record.code.toLowerCase()}.js`);
      if (record.sameAs === null) {
        expect(bytes, record.code).toBeLessThan(record.bytes + 200);
        expect(bytes, record.code).toBeLessThan(CEILING_BYTES + 200);
      } else expect(bytes, record.code).toBeLessThan(200);
    }
  });

  it("list in docs/sizes.md exactly the flags over the budget", () => {
    const doc = readFileSync("docs/sizes.md", "utf8");
    const section = doc.slice(doc.indexOf("## Over the budget"), doc.indexOf("## Drawings made for a frame over the budget"));
    const listed = [...section.matchAll(/^\| `([A-Z-]+)` /gm)].map((match) => match[1]).sort();
    const over = MANIFEST.filter((record) => record.sameAs === null && record.bytes > BUDGET_BYTES).map((record) => record.code).sort();
    expect(listed).toEqual(over);
  });

  it("list in docs/sizes.md exactly the drawings made for a frame that are over the budget, none over the ceiling", () => {
    const doc = readFileSync("docs/sizes.md", "utf8");
    const section = doc.slice(doc.indexOf("## Drawings made for a frame over the budget"), doc.indexOf("## Worth knowing"));
    const listed = [...section.matchAll(/^\| `([a-z0-9.-]+)` /gm)].map((match) => match[1]).sort();
    const over = MANIFEST.filter((record) => record.sameAs === null)
      .flatMap((record) => (["4:3", "1:1"] as const).filter((shape) => record.framings[shape].method === "adapted").map((shape) => ({ module: `${record.code.toLowerCase()}.${shape.replace(":", "x")}`, bytes: record.framings[shape].bytes! })))
      .filter((one) => one.bytes > BUDGET_BYTES)
      .map((one) => one.module)
      .sort();
    expect(listed).toEqual(over);
    for (const record of MANIFEST) for (const shape of ["4:3", "1:1"] as const) expect(record.framings[shape].bytes ?? 0, `${record.code} ${shape}`).toBeLessThan(CEILING_BYTES);
  });
});
