// Measures how each flag is framed at 4:3, square and round, so that no frame misrepresents it: a crop from the
// centre that keeps Japan's disc is fine, one that drops Canada's red bars is a different flag. Writes
// scripts/framings.data.json, which `pnpm data` reads; needs Playwright's Chromium, and fetches nothing.
//
//   pnpm data:framing            every flag's picture
//   pnpm data:framing ca jp      only these (the others keep what the file says)
//
// THE CHECK. A frame keeps a flag's colours when every colour that covers at least 5% of the flag still covers at
// least half that share of the frame, counting only the pixels the frame draws (colours named as the comparer names
// them, so that a shade does not count), and a hand-adapted drawing brings no colour of its own that covers 5%.
//
// THE CHOICE, for 4:3 and 1:1, in order:
//
//   1. OWN: the flag is that shape already (within 1%), so a frame is the flag itself.
//   2. ADAPTED: flag-icons (MIT) draws the flag again at that shape by hand, and its drawing keeps the colours and
//      is not one docs/compared.md lists as another design. Shipped as its own module, optimised and checked
//      pixel by pixel like every flag.
//   3. COVER: a crop from the centre keeps the colours.
//   4. CROP: where FOCUS in data-config.ts says where a crop of this flag should sit (the hoist, the fly), a crop kept
//      at that side, when it keeps the colours or FOCUS gives a reason for the colour it drops. Never chosen by measure
//      alone: a crop of Canada's hoist keeps its colours and half its leaf. A FOCUS of "whole" says no crop shows the
//      flag, and it is shown whole.
//   5. CONTAIN: the whole flag, with clear bands.
//
// This order is what `fit: "auto"` does, and the records say which crop it was (`crop.rule`: own, adapted, curated,
// centre or whole). `fit: "crop"` asked for by name always crops: at the FOCUS side where there is one, else from
// the centre, whether or not the crop keeps the colours.
//
// Round is the square's choice in a circle, checked again: an adapted square, else a crop where the square too may
// be cropped, else the whole flag on a neutral disc. Every shape also records `fit`, what `frame()` does with the flag's own SVG (it cannot use an
// adapted drawing, which is another file): crop where FOCUS names a side and the crop passes, cover where nothing is
// named and the centre keeps the colours, else contain.
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import process from "node:process";

import { LIMIT, WIDTH } from "./compare.mjs";
import { openComparer } from "./comparer.mjs";

const ROOT = join(import.meta.dirname, "..");
const FILE = join(ROOT, "scripts", "framings.data.json");
const { optimiseFlag } = await import(join(ROOT, "scripts", "optimise.ts"));
const { setCandidates } = await import(join(ROOT, "scripts", "candidates.ts"));
const { RECORDS: FLAG_RECORDS, VARIANT_PICTURES } = await import(join(ROOT, "src", "data", "manifest.data.ts"));
// A variant with a picture of its own is measured like a flag, under "<code>--<id>" ("AF--de-facto").
const RECORDS = [...FLAG_RECORDS, ...VARIANT_PICTURES.map((one) => ({ code: one.code, sameAs: null, width: one.width, height: one.height, source: "commons" }))];
const { FOCUS } = await import(join(ROOT, "scripts", "data-config.ts"));

/** A colour must cover this share of the flag to count, and keep at least KEEP of its share in a frame. */
export const COUNTS = 0.05;
export const KEEP = 0.5;
/** A colour a hand-adapted drawing brings that the flag has less than NEW_BELOW of may not cover COUNTS. */
const NEW_BELOW = 0.01;
const MEASURE = 160;
const SHAPES = { "4:3": { width: 640, height: 480, set: "flag-icons 4:3" }, "1:1": { width: 512, height: 512, set: "flag-icons 1:1" } };

const choices = JSON.parse(readFileSync(join(ROOT, "scripts", "choices.data.json"), "utf8"));
const comparer = await openComparer();
const shipped = (code) => JSON.parse(/const svg: string = (".*");/.exec(readFileSync(join(ROOT, "src", "flags", `${code.toLowerCase()}.ts`), "utf8"))[1]);
const viewBoxOf = (svg) => {
  const root = /<svg\b[^>]*>/.exec(svg)[0];
  const [, , width, height] = /\sviewBox\s*=\s*["']([^"']*)["']/.exec(root)[1].trim().split(/[\s,]+/).map(Number);
  return { width, height };
};

/** A picture framed at a size, as frame() frames it: nested whole, placed by preserveAspectRatio, maybe in a circle; `at` is the side a crop keeps. */
export const PLACEMENT = { centre: "xMidYMid", left: "xMinYMid", right: "xMaxYMid", top: "xMidYMin", bottom: "xMidYMax" };
export function framed(svg, width, height, fit, round = false, at = "centre") {
  const placement = fit === "contain" ? "xMidYMid meet" : `${PLACEMENT[at]} slice`;
  const box = viewBoxOf(svg);
  const aspect = box.width / box.height;
  const [x, y, w, h] = round && fit === "contain" ? [width / 2 - (width / 2) * (aspect / Math.hypot(aspect, 1)), height / 2 - height / 2 / Math.hypot(aspect, 1), width * (aspect / Math.hypot(aspect, 1)), height / Math.hypot(aspect, 1)] : [0, 0, width, height];
  const inner = svg.replace(/^<svg\b[^>]*>/, (root) => `${root.slice(0, -1).replace(/\s(width|height|x|y|preserveAspectRatio)\s*=\s*["'][^"']*["']/g, "")} x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="${placement}">`);
  const clip = round ? `<defs><clipPath id="framing-round"><circle cx="${width / 2}" cy="${height / 2}" r="${width / 2}"/></clipPath></defs><g clip-path="url(#framing-round)">${inner}</g>` : inner;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">${clip}</svg>`;
}

/** The colours the flag has that a frame loses, and the ones a frame brings: empty lists when the frame keeps it. */
function judge(full, frame) {
  const lost = Object.entries(full)
    .filter(([colour, share]) => share >= COUNTS && (frame[colour] ?? 0) < share * KEEP)
    .map(([colour, share]) => `${colour} ${Math.round(share * 100)}% to ${Math.round((frame[colour] ?? 0) * 100)}%`);
  const brought = Object.entries(frame)
    .filter(([colour, share]) => share >= COUNTS && (full[colour] ?? 0) < NEW_BELOW)
    .map(([colour, share]) => `${colour} ${Math.round(share * 100)}%`);
  return { lost, brought, keeps: lost.length === 0 && brought.length === 0 };
}

// The fewest decimals at which an adapted drawing still draws as its set has it.
const tune = async (text, code) => {
  const box = viewBoxOf(optimiseFlag(text, code, { precision: 5 }).svg);
  const height = Math.round((WIDTH * box.height) / box.width);
  for (const keepPaths of [false, true]) {
    for (let precision = 0; precision <= 5; precision += 1) {
      const optimised = optimiseFlag(text, code, { precision, keepPaths });
      if ((await comparer.difference(text, optimised.svg, WIDTH, height)) <= LIMIT) return { precision, ...(keepPaths ? { keepPaths: true } : {}) };
    }
  }
  return { precision: 5, keepPaths: true };
};

const kept = JSON.parse((() => {
  try {
    return readFileSync(FILE, "utf8");
  } catch {
    return "{}";
  }
})());
const asked = process.argv.slice(2).map((code) => code.toLowerCase());
for (const code of Object.keys(FOCUS)) if (!RECORDS.some((record) => record.code === code && record.sameAs === null)) throw new Error(`FOCUS names ${code}, which is not a flag's own picture (see scripts/data-config.ts)`);
const owners = RECORDS.filter((record) => record.sameAs === null && (asked.length === 0 || asked.includes(record.code.toLowerCase())));
for (const record of owners) {
  const svg = shipped(record.code);
  const aspect = record.width / record.height;
  const fullHeight = Math.round(MEASURE / aspect);
  const full = await comparer.shares(svg, MEASURE, fullHeight);
  const entry = {};
  const focus = FOCUS[record.code];
  const sharesOf = async (fit, width, height, round, at) => comparer.shares(framed(svg, width, height, fit, round, at), MEASURE, Math.round((MEASURE * height) / width));
  // What `fit: "auto"` does with the flag's own SVG at a size, and which crop that is.
  const fitFor = async (width, height, round) => {
    const cover = judge(full, await sharesOf("cover", width, height, round));
    if (focus !== undefined && focus.at !== "whole") {
      const result = judge(full, await sharesOf("crop", width, height, round, focus.at));
      if (result.keeps) return { fit: "crop", crop: { rule: "curated", at: focus.at }, lost: cover.lost };
      if (focus.loses !== undefined) return { fit: "crop", crop: { rule: "curated", at: focus.at, loses: [...result.lost, ...result.brought.map((one) => `brings ${one}`)] }, lost: cover.lost };
      process.stdout.write(`\n${record.code}: the crop kept at the ${focus.at} drops ${result.lost.join(", ")} and FOCUS gives no reason, so it is shown whole\n`);
      return { fit: "contain", crop: { rule: "whole", at: focus.at, loses: result.lost }, lost: cover.lost };
    }
    if (focus === undefined && cover.keeps) return { fit: "cover", crop: { rule: "centre", at: "centre" }, lost: [] };
    return { fit: "contain", crop: { rule: "whole", at: "centre" }, lost: cover.lost };
  };
  for (const [shape, { width, height, set }] of Object.entries(SHAPES)) {
    const target = width / height;
    if (Math.abs(aspect - target) / target < 0.01) {
      entry[shape] = { method: "own", fit: "cover", crop: { rule: "own", at: "centre" } };
      continue;
    }
    const fallback = await fitFor(width, height, false);
    const candidate = setCandidates(record.code).find((one) => one.label === set);
    const differs = (choices[record.code]?.designDiffers ?? []).includes("flag-icons") || record.source !== "commons";
    if (candidate !== undefined && !differs) {
      const result = judge(full, await comparer.shares(candidate.text, MEASURE, Math.round(MEASURE / target)));
      if (result.keeps) {
        entry[shape] = { method: "adapted", source: "flag-icons", file: candidate.file, ...(await tune(candidate.text, `${record.code}-${shape.replace(":", "x")}`)), fit: fallback.fit, crop: fallback.crop, ...(fallback.lost.length > 0 ? { coverLoses: fallback.lost } : {}) };
        continue;
      }
      entry[shape] = { method: fallback.fit, fit: fallback.fit, crop: fallback.crop, ...(fallback.lost.length > 0 ? { coverLoses: fallback.lost } : {}), refused: `flag-icons' ${shape} drawing ${[...result.lost.map((one) => `loses ${one}`), ...result.brought.map((one) => `brings ${one}`)].join(", ")}` };
      continue;
    }
    entry[shape] = { method: fallback.fit, fit: fallback.fit, crop: fallback.crop, ...(fallback.lost.length > 0 ? { coverLoses: fallback.lost } : {}) };
  }
  // Round: the square's choice, in a circle.
  const square = entry["1:1"];
  let round;
  if (square.method === "adapted") {
    const candidate = setCandidates(record.code).find((one) => one.label === SHAPES["1:1"].set);
    const result = judge(full, await comparer.shares(framed(candidate.text, 512, 512, "cover", true), MEASURE, MEASURE));
    if (result.keeps) round = { method: "adapted", source: "flag-icons", file: candidate.file };
  }
  // A circle is the square crop clipped again, so it may crop only where the square may.
  const roundFallback = entry["1:1"].fit === "contain" ? { fit: "contain", crop: entry["1:1"].crop, lost: entry["1:1"].coverLoses ?? [] } : await fitFor(512, 512, true);
  round ??= { method: square.method === "own" && roundFallback.fit === "cover" ? "own" : roundFallback.fit };
  entry.round = { ...round, ...(roundFallback.lost.length > 0 ? { coverLoses: roundFallback.lost } : {}), fit: roundFallback.fit, crop: square.method === "own" && roundFallback.fit === "cover" ? { rule: "own", at: "centre" } : roundFallback.crop };
  kept[record.code] = entry;
  process.stdout.write(`${record.code}:${entry["4:3"].method}/${entry["1:1"].method}/${entry.round.method} `);
}
await comparer.close();

const sorted = Object.fromEntries(Object.entries(kept).sort(([a], [b]) => (a < b ? -1 : 1)));
writeFileSync(FILE, `{\n${Object.entries(sorted).map(([code, value]) => `  ${JSON.stringify(code)}: ${JSON.stringify(value)}`).join(",\n")}\n}\n`);
const counts = {};
for (const value of Object.values(sorted)) for (const shape of ["4:3", "1:1", "round"]) counts[`${shape} ${value[shape].method}`] = (counts[`${shape} ${value[shape].method}`] ?? 0) + 1;
console.log(`\nwrote scripts/framings.data.json: ${JSON.stringify(counts)}`);
