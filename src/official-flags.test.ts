// Each country in scripts/official-flags.data.json has its official proportion with the law or government page it
// comes from, or says that no official ratio was found. A ratio that is recorded has to be the shape the flag ships at:
// the file records what a government says, it does not change a drawing (scripts/official-ratios.data.json does that).
import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { FLAG_CODES } from "./index";
import { MANIFEST } from "./manifest";

interface Official {
  name: string;
  ratio: [number, number] | null;
  kind: "law" | "government" | "none" | "open";
  source: string;
  url: string | null;
  note?: string;
  read: boolean;
}

const OFFICIAL = JSON.parse(readFileSync("scripts/official-flags.data.json", "utf8")) as Record<string, Official>;
const TOLERANCE = 0.002;

describe("the official proportions on file", () => {
  it("cover at least fifty flags, each of a code the package has, with its source written", () => {
    expect(Object.keys(OFFICIAL).length).toBeGreaterThanOrEqual(50);
    for (const [code, entry] of Object.entries(OFFICIAL)) {
      expect(FLAG_CODES as readonly string[], code).toContain(code);
      expect(entry.source.length, code).toBeGreaterThan(40);
      expect(["law", "government", "none", "open"], code).toContain(entry.kind);
    }
  });

  it("gives a ratio and a page for a law or a government page, and no ratio for none or open", () => {
    for (const [code, entry] of Object.entries(OFFICIAL)) {
      if (entry.kind === "law" || entry.kind === "government") {
        expect(entry.ratio, code).not.toBeNull();
        expect(entry.url, code).toMatch(/^https?:\/\//);
      } else {
        expect(entry.ratio, code).toBeNull();
      }
    }
  });

  it("is the shape each flag ships at", () => {
    const wrong: string[] = [];
    for (const [code, entry] of Object.entries(OFFICIAL)) {
      if (entry.ratio === null) continue;
      const record = MANIFEST.find((one) => one.code === code)!;
      const expected = entry.ratio[0] / entry.ratio[1];
      const shipped = record.width / record.height;
      if (Math.abs(shipped - expected) / expected > TOLERANCE) wrong.push(`${code}: ships ${shipped.toFixed(4)}:1, the source says ${entry.ratio.join(":")}`);
    }
    expect(wrong).toEqual([]);
  });
});
