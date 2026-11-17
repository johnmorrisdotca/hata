// Measures the colours of every shipped flag: each distinct colour as an exact hex, with the share of the flag it
// covers. Writes scripts/colours.data.json, which `pnpm data` reads (scripts/colour-data.ts names each colour and
// writes src/data/colours.data.ts and the manifest's `colours`); needs Playwright's Chromium, and fetches nothing.
//
//   pnpm data:colours            every flag's picture, and every variant's
//   pnpm data:colours ca jp      only these (the others keep what the file says)
//
// THE MEASURE, with no judgement in it. The flag's own drawing (src/flags/<code>.ts, never a frame or a crop) is
// drawn WIDTH pixels wide at its own proportions, with shape-rendering crispEdges so that an edge between two
// colours is not a row of blends. Every pixel that is drawn (alpha of at least ALPHA) is counted by its exact
// colour. Then:
//
//   1. KEPT: a colour that covers at least MIN of the drawn pixels is one of the flag's colours.
//   2. SHADED: the pixels left over (a gradient, the smoothed edge of lettering) are grouped into cells CELL wide on
//      each of red, green and blue. A cell that covers MIN is a colour too, named by the exact colour most often
//      found in it, unless that colour is within NEAR of a kept one, which then takes the cell's pixels.
//   3. MERGED: every pixel still left over goes to the nearest of the flag's colours (in red, green and blue).
//
// A share is the colour's pixels over the drawn pixels, to four decimals; the shares of a flag sum to 1 but for
// rounding. `merged` is the share that steps 2 and 3 moved, so a reader can see how much of a flag is not flat colour.
// WIDTH, ALPHA, MIN, CELL and NEAR, and the arithmetic of the three steps, are in scripts/colour-measure.ts.
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import process from "node:process";

import { chromium } from "@playwright/test";

const ROOT = join(import.meta.dirname, "..");
const FILE = join(ROOT, "scripts", "colours.data.json");
const { RECORDS, VARIANT_PICTURES } = await import(join(ROOT, "src", "data", "manifest.data.ts"));
const { ALPHA, coloursFrom, WIDTH } = await import(join(ROOT, "scripts", "colour-measure.ts"));

const shipped = (key) => JSON.parse(/const svg: string = (".*");/.exec(readFileSync(join(ROOT, "src", "flags", `${key.toLowerCase()}.ts`), "utf8"))[1]);

/** The exact colours of an SVG's drawn pixels, as [[rgb as one number, count], ...], and how many were drawn. */
const histogram = (page, svg, width, height) =>
  page.evaluate(
    async ({ svg, width, height, alpha }) => {
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
      const counts = new Map();
      let drawn = 0;
      for (let at = 0; at < data.length; at += 4) {
        if (data[at + 3] < alpha) continue;
        drawn += 1;
        const colour = (data[at] << 16) | (data[at + 1] << 8) | data[at + 2];
        counts.set(colour, (counts.get(colour) ?? 0) + 1);
      }
      return { drawn, counts: [...counts] };
    },
    { svg, width, height, alpha: ALPHA },
  );

{
  const kept = JSON.parse((() => {
    try {
      return readFileSync(FILE, "utf8");
    } catch {
      return "{}";
    }
  })());
  const asked = process.argv.slice(2).map((code) => code.toLowerCase());
  // A variant with a picture of its own is measured like a flag, under "<code>--<id>" ("AF--de-facto").
  const pictures = [...RECORDS.filter((record) => record.sameAs === null), ...VARIANT_PICTURES].filter((one) => asked.length === 0 || asked.includes(one.code.toLowerCase()));
  if (asked.length > 0 && pictures.length !== asked.length) throw new Error(`not a flag's own picture: ${asked.filter((code) => !pictures.some((one) => one.code.toLowerCase() === code)).join(", ")}`);
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setContent("<!doctype html><body></body>");
  for (const one of pictures) {
    const svg = shipped(one.code).replace(/^<svg\b[^>]*>/, (root) => `${root.slice(0, -1).replace(/\sshape-rendering\s*=\s*["'][^"']*["']/, "")} shape-rendering="crispEdges">`);
    const height = Math.round((WIDTH * one.height) / one.width);
    const { drawn, counts } = await histogram(page, svg, WIDTH, height);
    if (drawn === 0) throw new Error(`${one.code} draws nothing`);
    kept[one.code] = { width: WIDTH, height, drawn, ...coloursFrom(counts, drawn) };
    process.stdout.write(`${one.code}:${kept[one.code].colours.length} `);
  }
  await browser.close();
  // Pictures that are no longer shipped leave the file, so that it lists what the package has.
  const shippedNow = new Set([...RECORDS.filter((record) => record.sameAs === null), ...VARIANT_PICTURES].map((one) => one.code));
  const sorted = Object.entries(kept).filter(([code]) => shippedNow.has(code)).sort(([a], [b]) => (a < b ? -1 : 1));
  writeFileSync(FILE, `{\n${sorted.map(([code, value]) => `  ${JSON.stringify(code)}: ${JSON.stringify(value)}`).join(",\n")}\n}\n`);
  console.log(`\nwrote scripts/colours.data.json: ${sorted.length} pictures, ${sorted.reduce((sum, [, value]) => sum + value.colours.length, 0)} colours`);
}
