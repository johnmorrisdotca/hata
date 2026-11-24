// The military flags: naval ensigns, jacks and war flags of many navies; the Rising Sun Flag of Japan only here, as the Self-Defense Force's and the
// Imperial Navy's ensign; and the Confederate battle flags, withheld by default.
import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { militaryFiles, militaryNoticeText, militaryRecords } from "../scripts/draw-military";
import { MILITARY_FILES } from "../scripts/military-files";
import { FLAG_CODES } from "./index";
import { manifest } from "./manifest";
import { isMilitaryId, MILITARY_IDS, MILITARY_RESTRICTED_IDS, militaryAbout, militaryAspect, militaryFlag, militaryId, militaryIn, militaryInfo, militaryName } from "./military";

describe("the flags", () => {
  it("are what scripts/draw-military.ts makes from the Commons snapshot, so the data file and the notice cannot drift", () => {
    for (const [path, text] of militaryFiles()) expect(readFileSync(`src/sets/${path}`, "utf8"), path).toBe(text);
    const notice = readFileSync("NOTICE.md", "utf8");
    expect(notice).toBe(militaryNoticeText(notice));
    expect(militaryRecords().filter((one) => one.restricted === undefined).map((one) => one.id)).toEqual([...MILITARY_IDS]);
  });

  it("come from at least thirty navies, and every Commons one is public domain or CC0, with its author and page kept", () => {
    const countries = new Set(militaryRecords().map((one) => one.id.slice(4, 6)));
    expect(countries.size).toBeGreaterThanOrEqual(30);
    const files = militaryRecords().filter((one) => one.source.file !== undefined);
    expect(files.length).toBeGreaterThan(40);
    for (const one of files) {
      expect(one.source.licence, one.id).toMatch(/^(Public domain|CC0)/);
      expect(one.source.url, one.id).toMatch(/^https:\/\/commons\.wikimedia\.org\/wiki\/File:/);
      expect(one.source.author?.length, one.id).toBeGreaterThan(2);
    }
    expect(MILITARY_FILES.length).toBeGreaterThan(files.length - 1);
  });

  it("each have a source, say whether the construction is the source's, and dates where the source gives them", () => {
    for (const id of MILITARY_IDS) {
      const info = militaryInfo(id);
      expect(["documented", "reconstruction"], id).toContain(info?.status);
      expect(info?.note.en.length, id).toBeGreaterThan(60);
      expect(info?.source.url, id).toMatch(/^https:\/\//);
    }
    expect(militaryInfo("mil:jp-ijn-ensign")?.dates).toEqual({ from: "1889-10-07", until: "1945" });
    expect(militaryInfo("mil:jp-jmsdf-ensign")?.dates).toEqual({ from: "1954-06-30", until: null });
    expect(militaryInfo("mil:de-war-ensign-1921")?.dates).toEqual({ from: "1921", until: "1933" });
    expect(militaryInfo("mil:no-naval-jack")?.dates).toEqual({ from: "1905", until: null });
  });

  it("keep the Rising Sun Flag in this set only, as two ensigns, and in no country's record", async () => {
    const sun = MILITARY_IDS.filter((id) => (militaryRecords().find((one) => one.id === id)?.svg ?? "").includes("a150 150"));
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
  });

  it("are grouped, read loosely, named in both languages, and null for anything else", async () => {
    expect(militaryIn("ensign")).toContain("mil:gb-white-ensign");
    expect(militaryIn("jack")).toContain("mil:us-navy-jack");
    expect(militaryIn("war")).toContain("mil:de-war-ensign-1921");
    expect(militaryIn("jack")).not.toContain("mil:cs-naval-jack");
    expect(militaryId(" GB-White-Ensign ")).toBe("mil:gb-white-ensign");
    expect(isMilitaryId("mil:us-navy-jack")).toBe(true);
    expect(isMilitaryId("US")).toBe(false);
    expect(militaryName("mil:gb-white-ensign", "ja")).toBe("イギリス：白色軍艦旗（ホワイト・エンサイン）");
    expect(await militaryFlag("mil:nobody")).toBeNull();
    expect(() => militaryId(1 as unknown as string)).toThrow(TypeError);
  });
});

describe("the restricted flags", () => {
  it("are the two Confederate battle flags, in no list or group, and never drawn by default", async () => {
    expect(MILITARY_RESTRICTED_IDS).toEqual(["mil:cs-battle-flag", "mil:cs-naval-jack"]);
    for (const id of MILITARY_RESTRICTED_IDS) {
      expect(MILITARY_IDS, id).not.toContain(id);
      expect(isMilitaryId(id), id).toBe(false);
      expect(await militaryFlag(id), id).toBeNull();
      expect(await militaryFlag(id, { allowRestricted: false }), id).toBeNull();
      for (const group of ["ensign", "jack", "war"]) expect(militaryIn(group), id).not.toContain(id);
    }
  });

  it("are given when asked for by name, with the reason in both languages, no law, and the dates and the source", async () => {
    expect(await militaryFlag("mil:cs-battle-flag", { allowRestricted: true })).toMatch(/^<svg/);
    expect(await militaryFlag("mil:cs-naval-jack", { allowRestricted: true })).toMatch(/^<svg/);
    const info = militaryInfo("mil:cs-battle-flag");
    expect(info?.restricted?.reason).toBe("Confederate battle flag, 1861 to 1865. Shown for history and education. It is widely seen today as a symbol of racism and white supremacy.");
    expect(info?.restricted?.reasonJa).toMatch(/人種差別/);
    expect(info?.restricted?.allowedFor).toBe("education and history");
    expect(info?.restricted && "law" in info.restricted).toBe(false);
    expect(info?.dates).toEqual({ from: "1861", until: "1865" });
    expect(militaryInfo("mil:us-flag-1861")?.restricted).toBeNull();
    expect(militaryAspect("mil:cs-battle-flag")).toBe(1);
  });

  it("sit beside the United States' flags of the same years, and are in no demo list", () => {
    expect(MILITARY_IDS).toContain("mil:us-flag-1861");
    expect(MILITARY_IDS).toContain("mil:us-flag-1863");
    const page = readFileSync("scripts/site.mjs", "utf8");
    expect(page).toMatch(/restricted === undefined/);
  });
});
