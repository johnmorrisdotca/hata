// The military flags: naval ensigns and jacks, with the Rising Sun Flag of Japan only here, as the Self-Defense Force's and the Imperial Navy's ensign.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { militaryDataText, militaryRecords } from "../scripts/draw-military";
import { FLAG_CODES } from "./index";
import { isMilitaryId, MILITARY_IDS, militaryAbout, militaryAspect, militaryFlag, militaryId, militaryIn, militaryInfo, militaryName } from "./military";
import { manifest } from "./manifest";

describe("the flags", () => {
  it("are what scripts/draw-military.ts makes, so the data file cannot drift from the geometry", () => {
    expect(readFileSync(fileURLToPath(new URL("./sets/military.data.ts", import.meta.url)), "utf8")).toBe(militaryDataText());
    expect(militaryRecords().map((one) => one.id)).toEqual([...MILITARY_IDS]);
    expect(MILITARY_IDS).toHaveLength(5);
  });

  it("each have dates and a source, say whether the construction is the source's, and name their country", () => {
    for (const id of MILITARY_IDS) {
      const info = militaryInfo(id);
      expect(info?.dates?.from, id).toMatch(/^\d{4}/);
      expect(["documented", "reconstruction"], id).toContain(info?.status);
      expect(info?.note.en.length, id).toBeGreaterThan(60);
      expect(info?.source.url, id).toMatch(/^https:\/\//);
    }
    expect(militaryInfo("mil:jp-ijn-ensign")?.dates).toEqual({ from: "1889-10-07", until: "1945" });
    expect(militaryInfo("mil:jp-jmsdf-ensign")?.dates).toEqual({ from: "1954-06-30", until: null });
  });

  it("keep the Rising Sun Flag in this set only, as two ensigns, and in no country's record", () => {
    const sun = MILITARY_IDS.filter((id) => (militaryFlag(id) ?? "").includes("a150 150"));
    expect(sun).toEqual(["mil:jp-jmsdf-ensign", "mil:jp-ijn-ensign"]);
    expect(manifest("JP")?.variants.every((variant) => !/sun|旭日/i.test(variant.name))).toBe(true);
    expect(FLAG_CODES.some((code) => /^mil/i.test(code))).toBe(false);
    for (const id of sun) expect(militaryAbout(id)).toMatch(/Self-Defense|Imperial Japanese Navy/);
    expect(militaryInfo("mil:jp-jmsdf-ensign")?.note.en).toMatch(/#bd0029/);
  });

  it("are 3 to 2 for the Japanese ensigns, 2 to 1 for the British, and the American jack's union", () => {
    expect(militaryAspect("mil:jp-jmsdf-ensign")).toBe(1.5);
    expect(militaryAspect("mil:jp-ijn-ensign")).toBe(1.5);
    expect(militaryAspect("mil:gb-white-ensign")).toBe(2);
    expect(militaryAspect("mil:gb-naval-jack")).toBe(2);
    expect(militaryAspect("mil:us-navy-jack")).toBeCloseTo(0.76 / 0.5385, 3);
    expect((militaryFlag("mil:us-navy-jack")?.match(/M\d/g) ?? []).length).toBe(1 + 1 + 50 - 1 + 0);
  });

  it("are grouped, read loosely, named in both languages, and null for anything else", () => {
    expect(militaryIn("ensign")).toEqual(["mil:jp-jmsdf-ensign", "mil:jp-ijn-ensign", "mil:gb-white-ensign"]);
    expect(militaryIn("jack")).toEqual(["mil:gb-naval-jack", "mil:us-navy-jack"]);
    expect(militaryId(" GB-White-Ensign ")).toBe("mil:gb-white-ensign");
    expect(isMilitaryId("mil:us-navy-jack")).toBe(true);
    expect(isMilitaryId("US")).toBe(false);
    expect(militaryName("mil:gb-white-ensign", "ja")).toBe("イギリス：白色軍艦旗（ホワイト・エンサイン）");
    expect(militaryFlag("mil:nobody")).toBeNull();
    expect(() => militaryId(1 as unknown as string)).toThrow(TypeError);
  });
});
