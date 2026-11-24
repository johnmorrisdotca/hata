// The medieval banners: six, each a reconstruction that names its dated source and says what is documented.
import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { medievalFiles, medievalNoticeText, medievalRecords } from "../scripts/draw-medieval";
import { isMedievalId, MEDIEVAL_IDS, medievalAbout, medievalAspect, medievalFlag, medievalId, medievalIn, medievalInfo, medievalName } from "./medieval";

describe("the banners", () => {
  it("are what scripts/draw-medieval.ts makes, so the data file cannot drift from the geometry", () => {
    for (const [path, text] of medievalFiles()) expect(readFileSync(`src/sets/${path}`, "utf8"), path).toBe(text);
    expect(medievalRecords().map((one) => one.id)).toEqual([...MEDIEVAL_IDS]);
    expect(MEDIEVAL_IDS).toHaveLength(42);
    const notice = readFileSync("NOTICE.md", "utf8");
    expect(notice).toBe(medievalNoticeText(notice));
  }, 60000);

  it("are all reconstructions that say what the source documents and cite a page", () => {
    for (const id of MEDIEVAL_IDS) {
      const info = medievalInfo(id);
      expect(info?.status, id).toBe("reconstruction");
      expect(info?.note.en, id).toMatch(/this package's|the drawer's/);
      expect(info?.note.en, id).toMatch(/No banner of the time survives|reconstruction/);
      expect(info?.source.url, id).toMatch(/^https:\/\/(en\.wikipedia\.org|commons\.wikimedia\.org)\/wiki\//);
      expect(info?.source.says.length, id).toBeGreaterThan(80);
    }
  });

  it("carry the dates their sources give, and none where a source gives none", () => {
    expect(medievalInfo("med:aragon-pallets")?.dates).toEqual({ from: "1159", until: null });
    expect(medievalInfo("med:red-cross")?.dates).toEqual({ from: "1218", until: null });
    expect(medievalInfo("med:templar-baucent")?.dates).toEqual({ from: "1220", until: "1312" });
    expect(medievalInfo("med:gelre-denmark")?.dates).toBeNull();
  });

  it("are grouped, drawn at their ratios, and read loosely, in both languages", async () => {
    expect(medievalIn("order")).toEqual(expect.arrayContaining(["med:templar-baucent", "med:hospitaller-cross", "med:teutonic-banner"]));
    expect(medievalIn("cross")).toEqual(expect.arrayContaining(["med:red-cross", "med:scotland-saltire", "med:swiss-cross"]));
    expect(medievalIn("kingdom")).toEqual(expect.arrayContaining(["med:gelre-denmark", "med:aragon-pallets", "med:gb-royal-banner"]));
    expect(medievalIn("empire")).toContain("med:hre-war-flag");
    expect(medievalIn("city")).toContain("med:genoa-cross");
    expect(medievalIn("none")).toEqual([]);
    expect(medievalAspect("med:aragon-pallets")).toBe(1.5);
    expect(medievalAspect("med:red-cross")).toBeCloseTo(4 / 3, 5);
    expect(medievalId(" Red-Cross ")).toBe("med:red-cross");
    expect(isMedievalId("med:red-cross")).toBe(true);
    expect(isMedievalId("red-cross")).toBe(false);
    expect(medievalName("med:red-cross", "ja-JP")).toBe("白地に赤十字（聖ジョージ十字）");
    expect(medievalAbout("med:aragon-pallets", "ja")).toMatch(/アルフォンソ2世/);
    expect(await medievalFlag("med:nobody")).toBeNull();
    expect(() => medievalId(1 as unknown as string)).toThrow(TypeError);
  });

  it("draw Aragon as nine stripes with four red, and Denmark's banner with the cross nearer the hoist", async () => {
    const aragon = (await medievalFlag("med:aragon-pallets")) ?? "";
    expect((aragon.match(/h40v240/g) ?? []).length).toBe(4);
    expect(await medievalFlag("med:gelre-denmark")).toContain("M120 0h60v300h-60z");
  });

  it("take Commons files through the licence check: public domain or CC0 only, with the author and the page kept", () => {
    const files = medievalRecords().filter((one) => one.source.file !== undefined);
    expect(files.length).toBeGreaterThanOrEqual(30);
    for (const one of files) {
      expect(one.source.licence, one.id).toMatch(/^(Public domain|CC0)/);
      expect(one.source.url, one.id).toMatch(/^https:\/\/commons\.wikimedia\.org\/wiki\/File:/);
      expect(one.status, one.id).toBe("reconstruction");
    }
    expect(medievalRecords().length).toBeGreaterThanOrEqual(25);
  });
});
