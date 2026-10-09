// Draws every shipped flag beside the drawing it was made from (Commons' file, or a flag set's), in Chromium, and compares them pixel by
// pixel: the proof that optimising changed how the flags are written and not what they look like. The drawings made
// for a frame (flag-icons' 4:3 and square ones, /flags/<code>.4x3 and .1x1) are compared with their files the same way.
//
//   pnpm data:compare            every flag, at 960 pixels wide
//   pnpm data:compare jp us-ny   only these
//
// A flag fails when more than 0.1% of its pixels differ (scripts/comparer.mjs says what differing is), and the
// script exits 1 listing them. It reads data-sources/ and src/flags/ (run `pnpm data` first) and needs
// Playwright's Chromium; nothing is fetched.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import process from "node:process";

import { openComparer } from "./comparer.mjs";

export const WIDTH = 960;
export const LIMIT = 0.001;
const ROOT = join(import.meta.dirname, "..");

/** The Commons snapshot's files by name, and each one's text as Commons serves it. */
export function commonsFiles() {
  const sources = JSON.parse(readFileSync(join(ROOT, "data-sources", "sources.json"), "utf8"));
  const commons = JSON.parse(readFileSync(join(ROOT, "data-sources", sources.files.find((file) => file.path.startsWith("commons-")).path), "utf8"));
  const byFile = new Map(commons.files.map((file) => [file.file, file]));
  return { byFile, raw: (file) => readFileSync(join(ROOT, "data-sources", byFile.get(file).stored), "utf8") };
}

if (process.argv[1] === import.meta.filename) {
  const { raw } = commonsFiles();
  const { RECORDS } = await import(join(ROOT, "src", "data", "manifest.data.ts"));
  const asked = process.argv.slice(2).map((code) => code.toUpperCase());
  const records = RECORDS.filter((record) => record.sameAs === null && (asked.length === 0 || asked.includes(record.code)));
  const comparer = await openComparer();
  const failures = [];
  let worst = { code: "", share: 0 };
  for (const record of records) {
    const shipped = JSON.parse(/const svg: string = (".*");/.exec(readFileSync(join(ROOT, "src", "flags", `${record.code.toLowerCase()}.ts`), "utf8"))[1]);
    const source = record.source === "commons" ? raw(record.file) : readFileSync(join(ROOT, "node_modules", record.source, record.file), "utf8");
    const share = await comparer.difference(source, shipped, WIDTH, Math.round((WIDTH * record.height) / record.width));
    if (share > worst.share) worst = { code: record.code, share };
    if (share > LIMIT) failures.push(`${record.code} ${record.file}: ${(share * 100).toFixed(3)}% of pixels differ`);
  }
  // The drawings made for a frame, against the flag set's file they were optimised from.
  let framedCount = 0;
  for (const record of records) {
    for (const shape of ["4:3", "1:1"]) {
      const framing = record.framings[shape];
      if (framing.method !== "adapted") continue;
      const module = `${record.code.toLowerCase()}.${shape.replace(":", "x")}`;
      const shipped = JSON.parse(/const svg: string = (".*");/.exec(readFileSync(join(ROOT, "src", "flags", `${module}.ts`), "utf8"))[1]);
      const source = readFileSync(join(ROOT, "node_modules", framing.source, framing.file), "utf8");
      const share = await comparer.difference(source, shipped, WIDTH, shape === "4:3" ? 720 : WIDTH);
      framedCount += 1;
      if (share > worst.share) worst = { code: module, share };
      if (share > LIMIT) failures.push(`${module} ${framing.file}: ${(share * 100).toFixed(3)}% of pixels differ`);
    }
  }
  await comparer.close();
  console.log(`${framedCount} drawings made for a frame compared too`);
  console.log(`${records.length} flags compared at ${WIDTH} pixels wide; the most different is ${worst.code || "none"} at ${(worst.share * 100).toFixed(3)}% of pixels`);
  if (failures.length > 0) {
    console.error(failures.join("\n"));
    process.exit(1);
  }
}
