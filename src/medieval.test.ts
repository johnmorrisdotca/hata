// The medieval banners: six, each a reconstruction that names its dated source and says what is documented.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { medievalDataText, medievalRecords } from "../scripts/draw-medieval";
import { isMedievalId, MEDIEVAL_IDS, medievalAbout, medievalAspect, medievalFlag, medievalId, medievalIn, medievalInfo, medievalName } from "./medieval";

describe("the banners", () => {
  it("are what scripts/draw-medieval.ts makes, so the data file cannot drift from the geometry", () => {
    expect(readFileSync(fileURLToPath(new URL("./sets/medieval.data.ts", import.meta.url)), "utf8")).toBe(medievalDataText());
    expect(medievalRecords().map((one) => one.id)).toEqual([...MEDIEVAL_IDS]);
    expect(MEDIEVAL_IDS).toHaveLength(6);
  });

  it("are all reconstructions that say what the source documents, cite a page, and name no ticket or tool", () => {
    for (const id of MEDIEVAL_IDS) {
      const info = medievalInfo(id);
      expect(info?.status, id).toBe("reconstruction");
      expect(info?.note.en, id).toMatch(/this package's/);
      expect(info?.note.en, id).toMatch(/No banner of the time survives/);
      expect(info?.source.url, id).toMatch(/^https:\/\/en\.wikipedia\.org\/wiki\//);
      expect(info?.source.says.length, id).toBeGreaterThan(80);
    }
  });

  it("carry the dates their sources give, and none where a source gives none", () => {
    expect(medievalInfo("med:aragon-pallets")?.dates).toEqual({ from: "1159", until: null });
    expect(medievalInfo("med:red-cross")?.dates).toEqual({ from: "1218", until: null });
    expect(medievalInfo("med:templar-baucent")?.dates).toEqual({ from: "1220", until: "1312" });
    expect(medievalInfo("med:gelre-denmark")?.dates).toBeNull();
  });

  it("are grouped, drawn at their ratios, and read loosely, in both languages", () => {
    expect(medievalIn("order")).toEqual(["med:templar-baucent", "med:hospitaller-cross"]);
    expect(medievalIn("cross")).toEqual(["med:red-cross", "med:scotland-saltire"]);
    expect(medievalIn("kingdom")).toEqual(["med:gelre-denmark", "med:aragon-pallets"]);
    expect(medievalIn("none")).toEqual([]);
    expect(medievalAspect("med:aragon-pallets")).toBe(1.5);
    expect(medievalAspect("med:red-cross")).toBeCloseTo(4 / 3, 5);
    expect(medievalId(" Red-Cross ")).toBe("med:red-cross");
    expect(isMedievalId("med:red-cross")).toBe(true);
    expect(isMedievalId("red-cross")).toBe(false);
    expect(medievalName("med:red-cross", "ja-JP")).toBe("白地に赤十字（聖ジョージ十字）");
    expect(medievalAbout("med:aragon-pallets", "ja")).toMatch(/アルフォンソ2世/);
    expect(medievalFlag("med:nobody")).toBeNull();
    expect(() => medievalId(1 as unknown as string)).toThrow(TypeError);
  });

  it("draw Aragon as nine stripes with four red, and Denmark's banner with the cross nearer the hoist", () => {
    const aragon = medievalFlag("med:aragon-pallets") ?? "";
    expect((aragon.match(/h40v240/g) ?? []).length).toBe(4);
    expect(medievalFlag("med:gelre-denmark")).toContain("M120 0h60v300h-60z");
  });
});
