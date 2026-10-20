// Every shipped drawing names its author: Commons' own Artist field, or, where that is empty, the author the file's
// description page names (scripts/authors.data.json, with where on the page it says so), or "Unknown author" where the
// page names none. The October 2026 audit found 38 flags with no author; this keeps one from shipping without again.
import { readdirSync, readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { MANIFEST } from "./manifest";

const ENTRIES = JSON.parse(readFileSync("scripts/authors.data.json", "utf8")) as Record<string, { author: string; from: string }>;
const snapshot = readdirSync("data-sources").find((name) => /^commons-\d{4}-\d{2}-\d{2}\.json$/.test(name));
const FILES = (JSON.parse(readFileSync(`data-sources/${snapshot}`, "utf8")) as { files: { file: string; metadata: { Artist?: string } }[] }).files;

const drawings = MANIFEST.flatMap((record) => [record, ...record.variants.map((variant) => ({ code: `${record.code}--${variant.id}`, ...variant.drawing }))]);

describe("each drawing's author", () => {
  it("is named for every flag and variant: none ships with a null or empty author", () => {
    expect(drawings.length).toBeGreaterThan(450);
    expect(drawings.filter((one) => one.author === null || one.author.trim() === "").map((one) => one.code)).toEqual([]);
  });

  it("is Commons' Artist field where it has one, and the recorded author only where it has none", () => {
    for (const file of FILES) {
      const shipped = drawings.filter((one) => one.file === file.file);
      for (const one of shipped) {
        if (file.metadata.Artist !== undefined) expect(one.author, one.code).toBe(file.metadata.Artist);
        else if (ENTRIES[file.file] !== undefined) expect(one.author, one.code).toBe(ENTRIES[file.file]!.author);
      }
    }
  });

  it("is recorded in scripts/authors.data.json only for a shipped Commons file whose Artist field is empty, with where the page says it", () => {
    for (const [file, entry] of Object.entries(ENTRIES)) {
      const known = FILES.find((one) => one.file === file);
      expect(known, `${file} is not a file in the Commons snapshot`).toBeDefined();
      expect(drawings.some((one) => one.file === file), `${file} ships under no code`).toBe(true);
      // A stale entry must go: Commons now gives the file an author of its own.
      expect(known!.metadata.Artist, `${file} now has an Artist field on Commons: remove its entry`).toBeUndefined();
      expect(entry.author.length, file).toBeGreaterThan(2);
      expect(entry.from, file).toMatch(/^The file page/);
    }
  });
});
