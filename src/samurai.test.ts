// The samurai banners: the nine drawn here, each a reconstruction that says which part is the source's.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { samuraiDataText, samuraiRecords } from "../scripts/draw-samurai";
import { isSamuraiId, SAMURAI_IDS, samuraiAbout, samuraiAspect, samuraiFlag, samuraiId, samuraiIn, samuraiInfo, samuraiName } from "./samurai";

describe("the banners", () => {
  it("are what scripts/draw-samurai.ts makes, so the data file cannot drift from the geometry", () => {
    const file = readFileSync(fileURLToPath(new URL("./sets/samurai.data.ts", import.meta.url)), "utf8");
    expect(file).toBe(samuraiDataText());
    expect(samuraiRecords().map((one) => one.id)).toEqual([...SAMURAI_IDS]);
    expect(SAMURAI_IDS).toHaveLength(9);
  });

  it("are all reconstructions, each saying what the source gives and what is this package's, and citing a page", () => {
    for (const id of SAMURAI_IDS) {
      const info = samuraiInfo(id);
      expect(info?.status, id).toBe("reconstruction");
      expect(info?.note.en, id).toMatch(/this package's/);
      expect(info?.note.en, id).toMatch(/No cloth survives/);
      expect(info?.source.url, id).toMatch(/^https:\/\/ja\.wikipedia\.org\/wiki\//);
    }
  });

  it("are grouped as nobori, hata and uma-jirushi, and tall where they are nobori", () => {
    expect(samuraiIn("nobori")).toEqual(["samurai:hojo-gosyoku", "samurai:sanada-rokumonsen"]);
    expect(samuraiIn("hata")).toHaveLength(3);
    expect(samuraiIn("uma")).toHaveLength(4);
    expect(samuraiIn("none")).toEqual([]);
    expect(samuraiAspect("samurai:sanada-rokumonsen")).toBe(0.25);
    expect(samuraiAspect("samurai:uesugi-tenshi")).toBe(1.5);
  });

  it("are read loosely or exactly, named in both languages, and null for anything else", () => {
    expect(samuraiId(" Sanada-Rokumonsen ")).toBe("samurai:sanada-rokumonsen");
    expect(isSamuraiId("samurai:ii-igeta")).toBe(true);
    expect(isSamuraiId("ii-igeta")).toBe(false);
    expect(samuraiName("samurai:sanada-rokumonsen", "ja-JP")).toBe("真田の六連銭の幟");
    expect(samuraiAbout("samurai:ii-igeta", "ja")).toMatch(/井桁/);
    expect(samuraiFlag("samurai:nobody")).toBeNull();
    expect(samuraiInfo("nobody")).toBeNull();
    expect(() => samuraiId(1 as unknown as string)).toThrow(TypeError);
  });

  it("draw the Uesugi banner as a red disc on dark blue, and the Sanada nobori with six coins on red", () => {
    expect(samuraiFlag("samurai:uesugi-tenshi")).toContain('fill="#1d2b53" d="M0 0h300v200h-300z"');
    expect(samuraiFlag("samurai:uesugi-tenshi")).toContain('fill="#c8102e"');
    const nobori = samuraiFlag("samurai:sanada-rokumonsen") ?? "";
    expect(nobori).toContain('fill="#c8102e" d="M0 0h100v400h-100z"');
    expect((nobori.match(/a14 14/g) ?? []).length).toBe(12);
  });
});
