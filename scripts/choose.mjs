// Chooses, for every place, which drawing of its flag ships: Wikimedia Commons' or one of the MIT flag sets'
// (scripts/candidates.ts), and how finely to round it. Writes scripts/choices.data.json, which `pnpm data` reads;
// needs Playwright's Chromium, and fetches nothing.
//
//   pnpm data:choose            every place
//   pnpm data:choose jp us-ny   only these (the others keep what the file says)
//
// The rules, in order:
//
//   1. TRUE PROPORTIONS. Commons draws each flag at its own proportions, from its construction sheet; that
//      drawing is the reference. A set's drawing can be chosen only where it is drawn at the same shape (within
//      1%): flag-icons' 1:1 for Switzerland, country-flag-icons' 3:2 for a 2:3 flag. Never a crop or a circle.
//   2. ACCURACY. A set's drawing at the true shape counts as the same flag only when it draws the same as Commons'
//      to within 0.5% of pixels at 480 pixels wide, with no channel off by more than 32 of 255: the same
//      construction and the same colours. A simplified emblem, another shade or another layout is not the same.
//   3. SIZE. Of drawings that are the same flag and free to ship, the smallest after optimising wins, and a set's
//      drawing must be at least 10% smaller than Commons' to win: Commons' drawing is the one with its sources
//      written on its page.
//   4. LICENCE. Commons' drawing ships only if its licence is public domain, CC0 or CC BY (scripts/licence.ts);
//      the sets are MIT. When Commons' cannot ship, a set's same drawing may.
//
// Every drawing is rounded to the fewest decimals at which it still draws as it did (at most 0.1% of pixels
// different at 960 wide); one that differs at any precision keeps its paths as drawn. And every set's drawing,
// at whatever shape, is compared with Commons' framed to that shape: where they differ a lot, they may draw a
// different design (an old flag, another emblem), and the place is listed for a person to look at.
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import process from "node:process";

import { commonsFiles, LIMIT, WIDTH } from "./compare.mjs";
import { openComparer } from "./comparer.mjs";

const ROOT = join(import.meta.dirname, "..");
const FILE = join(ROOT, "scripts", "choices.data.json");
const { optimiseFlag } = await import(join(ROOT, "scripts", "optimise.ts"));
const { setCandidates } = await import(join(ROOT, "scripts", "candidates.ts"));
const { places } = await import(join(ROOT, "scripts", "places.ts"));
const { selectPlace } = await import(join(ROOT, "scripts", "select.ts"));
const { classify } = await import(join(ROOT, "scripts", "licence.ts"));
const { ACCEPTED, NO_FLAG } = await import(join(ROOT, "scripts", "data-config.ts"));

const SAME_WIDTH = 480;
const SAME_SHARE = 0.005;
const SAME_CHANNEL = 32;
const SMALLER = 0.9;
// The design check: at 96 pixels wide, by the names of the colours (scripts/comparer.mjs), so that fine detail, a
// shade and a line's width do not count, and a different emblem, colour or arrangement does. Commons' drawing is put in the
// set's shape both by cropping and by stretching (sets do either), and the closer of the two counts. A set whose
// closest drawing is still this different from it is listed for a person to look at.
const DESIGN_WIDTH = 96;
const LOOK_AT = 0.25;

const sources = JSON.parse(readFileSync(join(ROOT, "data-sources", "sources.json"), "utf8"));
const wikidata = JSON.parse(readFileSync(join(ROOT, "data-sources", sources.files.find((file) => file.path.startsWith("wikidata-")).path), "utf8"));
const { byFile, raw } = commonsFiles();
const comparer = await openComparer();

const viewBoxOf = (svg) => {
  const root = /<svg\b[^>]*>/.exec(svg)[0];
  const box = /\sviewBox\s*=\s*["']([^"']*)["']/.exec(root)?.[1];
  const [, , width, height] = box.trim().split(/[\s,]+/).map(Number);
  return { width, height };
};

// A drawing framed to another shape, at any aspect: cropped from the centre as frame() does ("xMidYMid slice"),
// or stretched ("none"), to compare a set's drawing at its shape with Commons' put in the same shape either way.
const framed = (svg, aspect, round, placement = "xMidYMid slice") => {
  const width = 1000;
  const height = Math.round(width / aspect);
  const inner = svg.replace(/^<svg\b[^>]*>/, (root) => `${root.slice(0, -1).replace(/\s(width|height|x|y|preserveAspectRatio)\s*=\s*["'][^"']*["']/g, "")} x="0" y="0" width="${width}" height="${height}" preserveAspectRatio="${placement}">`);
  const clip = round ? `<defs><clipPath id="hata-compare-round"><circle cx="${width / 2}" cy="${height / 2}" r="${width / 2}"/></clipPath></defs><g clip-path="url(#hata-compare-round)">${inner}</g>` : inner;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">${clip}</svg>`;
};

// The fewest decimals at which a drawing still draws as it did; then the same with its paths kept as drawn.
const tuned = new Map();
const tune = async (key, text, code) => {
  if (tuned.has(key)) return tuned.get(key);
  const box = viewBoxOf(optimiseFlag(text, code, { precision: 5 }).svg);
  const height = Math.round((WIDTH * box.height) / box.width);
  let found = null;
  for (const keepPaths of [false, true]) {
    for (let precision = 0; precision <= 5 && found === null; precision += 1) {
      const optimised = optimiseFlag(text, code, { precision, keepPaths });
      if ((await comparer.difference(text, optimised.svg, WIDTH, height)) <= LIMIT) found = { precision, keepPaths, optimised };
    }
    if (found !== null) break;
  }
  found ??= { precision: 5, keepPaths: true, optimised: optimiseFlag(text, code, { precision: 5, keepPaths: true }), stubborn: true };
  tuned.set(key, found);
  return found;
};

const kept = JSON.parse(readFileSync(FILE, "utf8"));
const asked = process.argv.slice(2).map((code) => code.toUpperCase());
const percent = (share) => `${(share * 100).toFixed(share < 0.01 ? 2 : 1)}%`;
const ratioWords = (aspect) => {
  const names = [[1, "1:1"], [4 / 3, "4:3"], [3 / 2, "3:2"], [5 / 3, "5:3"], [2, "2:1"], [19 / 10, "19:10"], [8 / 5, "8:5"], [7 / 4, "7:4"], [5 / 4, "5:4"]];
  return names.find(([value]) => Math.abs(value - aspect) / value < 0.01)?.[1] ?? `${aspect.toFixed(2)}:1`;
};

for (const place of places()) {
  if (asked.length > 0 && !asked.includes(place.code)) continue;
  if (NO_FLAG[place.code] !== undefined) {
    delete kept[place.code];
    continue;
  }
  const selection = selectPlace(place.code, wikidata);
  const commons = selection.file === null ? null : byFile.get(selection.file);
  const sets = setCandidates(place.code);
  if (commons === undefined) throw new Error(`${place.code}: ${selection.file} is not in the Commons snapshot: run pnpm data:commons`);
  if (commons === null) {
    delete kept[place.code];
    continue;
  }
  const licence = classify(commons.metadata, commons.templates);
  const commonsShips = licence.shipped || ACCEPTED[commons.file] !== undefined;
  const reference = await tune(`commons:${commons.file}`, raw(commons.file), place.code);
  const box = viewBoxOf(reference.optimised.svg);
  const aspect = box.width / box.height;
  const compared = {};
  const verdicts = [];
  const same = [];
  for (const candidate of sets) {
    const theirs = framed(candidate.text, candidate.aspect, candidate.round);
    const height = Math.round(DESIGN_WIDTH / candidate.aspect);
    const design = Math.min(
      await comparer.difference(framed(reference.optimised.svg, candidate.aspect, candidate.round), theirs, DESIGN_WIDTH, height, { colours: true }),
      await comparer.difference(framed(reference.optimised.svg, candidate.aspect, candidate.round, "none"), theirs, DESIGN_WIDTH, height, { colours: true }),
    );
    const entry = { design: Number(design.toFixed(4)) };
    const trueShape = !candidate.round && Math.abs(candidate.aspect - aspect) / aspect < 0.01;
    if (candidate.round) verdicts.push(`${candidate.source} draws it round, a framing`);
    else if (!trueShape) verdicts.push(`${candidate.label} is not the true ${ratioWords(aspect)}`);
    else {
      const option = await tune(`${candidate.source}:${candidate.file}`, candidate.text, place.code);
      const share = await comparer.difference(reference.optimised.svg, option.optimised.svg, SAME_WIDTH, Math.round(SAME_WIDTH / aspect), { channel: SAME_CHANNEL });
      entry.same = Number(share.toFixed(4));
      entry.bytes = Buffer.byteLength(option.optimised.svg);
      if (share <= SAME_SHARE) {
        same.push({ candidate, option });
        verdicts.push(`${candidate.label} draws the same flag in ${entry.bytes} bytes`);
      } else verdicts.push(`${candidate.label} differs from it in ${percent(share)} of pixels`);
    }
    compared[candidate.label] = entry;
  }
  const commonsBytes = Buffer.byteLength(reference.optimised.svg);
  const smallest = same.sort((a, b) => Buffer.byteLength(a.option.optimised.svg) - Buffer.byteLength(b.option.optimised.svg))[0];
  let choice;
  if (commonsShips && (smallest === undefined || Buffer.byteLength(smallest.option.optimised.svg) > commonsBytes * SMALLER)) {
    const head = sets.length === 0 ? "the only drawing of it" : smallest === undefined ? "the only drawing at its true proportions and in its full design" : `kept over ${smallest.candidate.label}, the same flag but not 10% smaller`;
    choice = { source: "commons", file: commons.file, ...pick(reference), why: `Commons, ${head} (${ratioWords(aspect)}, ${commonsBytes} bytes)${sets.length > 0 ? `: ${verdicts.join("; ")}` : ""}.` };
  } else if (smallest !== undefined) {
    const bytes = Buffer.byteLength(smallest.option.optimised.svg);
    const reason = commonsShips ? `the same flag as Commons' ${ratioWords(aspect)}, ${Math.round((1 - bytes / commonsBytes) * 100)}% smaller (${bytes} bytes, Commons ${commonsBytes})` : `the same flag as Commons' ${ratioWords(aspect)}, whose file is ${licence.name} and cannot ship`;
    choice = { source: smallest.candidate.source, file: smallest.candidate.file, ...pick(smallest.option), why: `${smallest.candidate.label}: ${reason}; ${verdicts.join("; ")}.` };
  } else {
    choice = { source: null, why: `No drawing can ship: Commons' is ${licence.name}, and ${verdicts.length === 0 ? "no flag set draws it" : verdicts.join("; ")}.` };
  }
  // A set is judged by its closest drawing: one set's 4:3 may move a 2:1 flag's parts where its 1:1 does not.
  const closest = {};
  for (const candidate of sets) closest[candidate.source] = Math.min(closest[candidate.source] ?? 1, compared[candidate.label].design);
  const differ = Object.entries(closest).filter(([, design]) => design > LOOK_AT).map(([source]) => source);
  kept[place.code] = { ...choice, compared, ...(differ.length > 0 ? { designDiffers: differ } : {}) };
  process.stdout.write(`${place.code}:${choice.source ?? "none"} `);
}
await comparer.close();

function pick(found) {
  return { precision: found.precision, ...(found.keepPaths ? { keepPaths: true } : {}), ...(found.stubborn ? { stubborn: true } : {}) };
}

const sorted = Object.fromEntries(Object.entries(kept).sort(([a], [b]) => (a < b ? -1 : 1)));
writeFileSync(FILE, `{\n${Object.entries(sorted).map(([code, value]) => `  ${JSON.stringify(code)}: ${JSON.stringify(value)}`).join(",\n")}\n}\n`);
const counts = {};
for (const value of Object.values(sorted)) counts[value.source ?? "none"] = (counts[value.source ?? "none"] ?? 0) + 1;
console.log(`\nwrote scripts/choices.data.json: ${JSON.stringify(counts)}`);
const look = Object.entries(sorted).filter(([, value]) => value.designDiffers !== undefined);
console.log(`${look.length} places where a set draws something quite different from Commons: ${look.map(([code]) => code).join(" ")}`);
