// The Japanese text of the history notes: every dated flag of a present-day country has `whyJa`, every one with a role note has
// `roleNoteJa`, and every former country has its `why` and `whyJa` (scripts/history-ja.data.json). Written to be read by someone who
// reads everyday Japanese, and marked for review with the rest of the Japanese (docs/strings-ja.md).
import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { HISTORIC } from "../scripts/historic-flags";
import { manifest, MANIFEST, variantsOf } from "./manifest";

const JA = JSON.parse(readFileSync("scripts/history-ja.data.json", "utf8")) as { variants: Record<string, string>; roleNotes: Record<string, string>; former: Record<string, string> };
const JAPANESE = /[぀-ヿ一-鿿]/;

describe("the Japanese history notes", () => {
  it("are in every dated flag of a present-day country, and in no key that is not one", () => {
    const keys: string[] = [];
    for (const code of Object.keys(HISTORIC)) {
      for (const one of variantsOf(code)) {
        keys.push(`${code}/${one.id}`);
        expect(one.whyJa, `${code} ${one.id}`).toMatch(JAPANESE);
        expect(one.roleNoteJa === null, `${code} ${one.id}`).toBe(one.roleNote === null);
        if (one.roleNote !== null) expect(one.roleNoteJa, `${code} ${one.id}`).toMatch(JAPANESE);
      }
    }
    for (const key of Object.keys(JA.variants)) expect(keys.includes(key) || key.startsWith("DE/swastika"), key).toBe(true);
    expect(Object.keys(JA.roleNotes).sort()).toEqual(["AU", "CA", "NZ", "UA"]);
  });

  it("are in every former country's era, beside its English", () => {
    const former = MANIFEST.filter((record) => record.historical !== undefined);
    expect(former.length).toBeGreaterThanOrEqual(12);
    for (const record of former) {
      expect(record.historical!.why.length, record.code).toBeGreaterThan(40);
      expect(record.historical!.whyJa, record.code).toMatch(JAPANESE);
    }
    expect(manifest("SUHH")?.historical?.whyJa).toMatch(/ソビエト連邦/);
  });
});
