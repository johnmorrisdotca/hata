// Measures the geometry of every shipped flag that needs no judgement: whether it is nothing but bands across or
// down, and whether the same bands stand at both edges. Writes scripts/tags.data.json, which `pnpm data` reads
// (scripts/tag-data.ts turns it into tags, beside what Wikidata and Commons say); needs Playwright's Chromium, and
// fetches nothing.
//
//   pnpm data:tags            every flag's picture, and every variant's
//   pnpm data:tags ca jp      only these (the others keep what the file says)
//
// THE MEASURE. The flag's own drawing is drawn as `pnpm data:colours` draws it (WIDTH pixels wide, crisp edges),
// and each pixel is read as its exact colour, or as nothing where it is not drawn. A line of pixels is a band's
// when every pixel of it is one colour.
//
//   - across: when every row is one colour, the bands from the top, each [hex, the share of the height]; else null.
//   - down: when every column is one colour, the bands from the hoist, each [hex, the share of the width]; else null.
//   - edgesAcross: the bands down the column EDGE of the way in from the hoist, when the column as far in from the
//     fly has the same (the same colours in the same order, each band's ends within NEAR pixels); else null.
//   - edgesDown: the same for the rows near the top and the bottom.
//   - text: true when the drawing has a <text> element.
//
// A band thinner than THIN of the flag is not counted in the edges, so a hairline does not make a stripe.
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import process from "node:process";

import { chromium } from "@playwright/test";

const ROOT = join(import.meta.dirname, "..");
const FILE = join(ROOT, "scripts", "tags.data.json");
const { RECORDS, VARIANT_PICTURES } = await import(join(ROOT, "src", "data", "manifest.data.ts"));
const { ALPHA, WIDTH } = await import(join(ROOT, "scripts", "colour-measure.ts"));

const EDGE = 0.02;
const NEAR = 2;
const THIN = 0.01;

const shipped = (key) => JSON.parse(/const svg: string = (".*");/.exec(readFileSync(join(ROOT, "src", "flags", `${key.toLowerCase()}.ts`), "utf8"))[1]);

/** The bands of every row and column that is one colour, and of the lines near the four edges, as runs of [colour, length]. */
const lines = (page, svg, width, height) =>
  page.evaluate(
    async ({ svg, width, height, alpha, edge }) => {
      const image = new Image();
      image.src = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
      await image.decode();
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d", { colorSpace: "srgb" });
      context.imageSmoothingEnabled = false;
      context.drawImage(image, 0, 0, width, height);
      const data = context.getImageData(0, 0, width, height).data;
      const at = (x, y) => {
        const index = (y * width + x) * 4;
        return data[index + 3] < alpha ? -1 : (data[index] << 16) | (data[index + 1] << 8) | data[index + 2];
      };
      // The one colour of each row and of each column, or null where a line has two.
      const one = (count, length, pixel) => {
        const found = [];
        for (let line = 0; line < count; line += 1) {
          const first = pixel(line, 0);
          for (let along = 1; along < length; along += 1) if (pixel(line, along) !== first) return null;
          found.push(first);
        }
        return found;
      };
      const runs = (colours) => {
        const made = [];
        for (const colour of colours) {
          if (made.length > 0 && made.at(-1)[0] === colour) made.at(-1)[1] += 1;
          else made.push([colour, 1]);
        }
        return made;
      };
      const rows = one(height, width, (y, x) => at(x, y));
      const columns = one(width, height, (x, y) => at(x, y));
      const column = (x) => runs(Array.from({ length: height }, (_, y) => at(x, y)));
      const row = (y) => runs(Array.from({ length: width }, (_, x) => at(x, y)));
      const inX = Math.round(width * edge);
      const inY = Math.round(height * edge);
      return {
        across: rows === null ? null : runs(rows),
        down: columns === null ? null : runs(columns),
        hoist: column(inX),
        fly: column(width - 1 - inX),
        top: row(inY),
        bottom: row(height - 1 - inY),
      };
    },
    { svg, width, height, alpha: ALPHA, edge: EDGE },
  );

const hex = (colour) => `#${colour.toString(16).padStart(6, "0")}`;
const share = (length, whole) => Math.round((length / whole) * 10000) / 10000;
const bands = (runs, whole) => (runs === null || runs.some(([colour]) => colour < 0) ? null : runs.map(([colour, length]) => [hex(colour), share(length, whole)]));
// The bands two lines share: the same colours in the same order, each end within NEAR pixels, none thinner than THIN.
const same = (a, b, whole) => {
  const [one, two] = [a, b].map((runs) => runs.filter(([, length]) => length >= THIN * whole));
  if (one.length !== two.length || one.some(([colour]) => colour < 0)) return null;
  let [endA, endB] = [0, 0];
  for (let at = 0; at < one.length; at += 1) {
    if (one[at][0] !== two[at][0]) return null;
    endA += one[at][1];
    endB += two[at][1];
    if (Math.abs(endA - endB) > NEAR + THIN * whole) return null;
  }
  return one.map(([colour, length]) => [hex(colour), share(length, whole)]);
};

const kept = JSON.parse((() => {
  try {
    return readFileSync(FILE, "utf8");
  } catch {
    return "{}";
  }
})());
const asked = process.argv.slice(2).map((code) => code.toLowerCase());
const all = [...RECORDS.filter((record) => record.sameAs === null), ...VARIANT_PICTURES];
const pictures = all.filter((one) => asked.length === 0 || asked.includes(one.code.toLowerCase()));
if (asked.length > 0 && pictures.length !== asked.length) throw new Error(`not a flag's own picture: ${asked.filter((code) => !pictures.some((one) => one.code.toLowerCase() === code)).join(", ")}`);
const browser = await chromium.launch();
const page = await browser.newPage();
await page.setContent("<!doctype html><body></body>");
for (const one of pictures) {
  const source = shipped(one.code);
  const svg = source.replace(/^<svg\b[^>]*>/, (root) => `${root.slice(0, -1).replace(/\sshape-rendering\s*=\s*["'][^"']*["']/, "")} shape-rendering="crispEdges">`);
  const height = Math.round((WIDTH * one.height) / one.width);
  const found = await lines(page, svg, WIDTH, height);
  kept[one.code] = {
    across: bands(found.across, height),
    down: bands(found.down, WIDTH),
    edgesAcross: same(found.hoist, found.fly, height),
    edgesDown: same(found.top, found.bottom, WIDTH),
    text: /<text\b/.test(source),
  };
  process.stdout.write(`${one.code}:${kept[one.code].across?.length ?? "-"}/${kept[one.code].down?.length ?? "-"} `);
}
await browser.close();
// Pictures that are no longer shipped leave the file, so that it lists what the package has.
const now = new Set(all.map((one) => one.code));
const sorted = Object.entries(kept).filter(([code]) => now.has(code)).sort(([a], [b]) => (a < b ? -1 : 1));
writeFileSync(FILE, `{\n${sorted.map(([code, value]) => `  ${JSON.stringify(code)}: ${JSON.stringify(value)}`).join(",\n")}\n}\n`);
const count = (test) => sorted.filter(([, value]) => test(value)).length;
console.log(`\nwrote scripts/tags.data.json: ${sorted.length} pictures; bands across the whole flag ${count((one) => one.across !== null)}, down it ${count((one) => one.down !== null)}; the same bands at both edges, across ${count((one) => one.edgesAcross !== null && one.edgesAcross.length > 1)}, down ${count((one) => one.edgesDown !== null && one.edgesDown.length > 1)}; with a text element ${count((one) => one.text)}`);
