// scripts/flag-facts.data.json: for each of the 33 countries with dated flags, when today's flag was adopted (the dated flag's own `from`
// and source, so the two cannot drift) and what its colours or symbols mean where an official page says so, in English and Japanese;
// null where none was read: a meaning is never a plausible filler.
import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { HISTORIC } from "../scripts/historic-flags";
import { variantsOf } from "./manifest";

interface Facts {
  adopted: string;
  adoptedSource: string;
  adoptedSourceKind: "official" | "reference" | "encyclopedia";
  meaning: string | null;
  meaningJa: string | null;
  meaningSource: string | null;
  meaningSourceKind: "official" | null;
}

const FACTS = JSON.parse(readFileSync("scripts/flag-facts.data.json", "utf8")) as Record<string, Facts>;

describe("the facts of the 33 countries with dated flags", () => {
  it("has one entry for each, and its adoption is today's dated flag's own `from` and source", () => {
    expect(Object.keys(FACTS).sort()).toEqual(Object.keys(HISTORIC).sort());
    for (const [code, facts] of Object.entries(FACTS)) {
      const current = variantsOf(code).find((one) => one.until === null && one.default)!;
      expect(facts.adopted, code).toBe(current.from);
      expect(facts.adoptedSource, code).toBe(current.source);
      expect(facts.adoptedSourceKind, code).toBe(current.sourceKind);
    }
  });

  it("gives a meaning in both languages, from an official page, in one short sentence, or none at all", () => {
    let given = 0;
    for (const [code, facts] of Object.entries(FACTS)) {
      if (facts.meaning === null) {
        expect([facts.meaningJa, facts.meaningSource, facts.meaningSourceKind], code).toEqual([null, null, null]);
        continue;
      }
      given += 1;
      expect(facts.meaningJa, code).toMatch(/[぀-ヿ一-鿿]/);
      expect(facts.meaningSource, code).toMatch(/^https?:\/\//);
      expect(facts.meaningSourceKind, code).toBe("official");
      expect(facts.meaning.length, code).toBeLessThan(240);
      expect(facts.meaning.split(/(?<=\.)\s/).length, code).toBe(1);
    }
    expect(given).toBeGreaterThanOrEqual(5);
  });
});
