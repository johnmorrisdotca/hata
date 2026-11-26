// The samurai banners: nine reconstructions from words, each saying which part is the source's, and twelve drawn from the painted
// roll book 御馬印 (National Diet Library), each cited to its roll and frame, three of them lettered in an SIL OFL brush font.
import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { samuraiFiles, samuraiRecords } from "../scripts/draw-samurai";
import { isSamuraiId, SAMURAI_IDS, samuraiAbout, samuraiAspect, samuraiFlag, samuraiId, samuraiIn, samuraiInfo, samuraiName } from "./samurai";

describe("the banners", () => {
  it("are what scripts/draw-samurai.ts makes, so the data file cannot drift from the geometry", () => {
    for (const [path, text] of samuraiFiles()) expect(readFileSync(`src/sets/${path}`, "utf8"), path).toBe(text);
    expect(samuraiRecords().map((one) => one.id)).toEqual([...SAMURAI_IDS]);
    expect(SAMURAI_IDS).toHaveLength(21);
  });

  it("are reconstructions where they come from words, each saying what the source gives and what is this package's, and citing a page", () => {
    const fromWords = SAMURAI_IDS.filter((id) => samuraiInfo(id)?.status !== "documented");
    expect(fromWords).toHaveLength(9);
    for (const id of fromWords) {
      const info = samuraiInfo(id);
      expect(info?.status, id).toBe("reconstruction");
      expect(info?.note.en, id).toMatch(/this package's/);
      expect(info?.note.en, id).toMatch(/No cloth survives/);
      expect(info?.source.url, id).toMatch(/^https:\/\/ja\.wikipedia\.org\/wiki\//);
    }
  });

  it("take twelve banners from the painted roll book 御馬印 at the National Diet Library, each documented and cited to its roll and frame", () => {
    const documented = SAMURAI_IDS.filter((id) => samuraiInfo(id)?.status === "documented");
    expect(documented).toHaveLength(12);
    for (const id of documented) {
      const info = samuraiInfo(id)!;
      expect(info.source.kind, id).toBe("official");
      expect(info.source.title, id).toMatch(/^御馬印 巻1/);
      expect(info.source.url, id).toMatch(/^https:\/\/dl\.ndl\.go\.jp\/pid\/1286895\/1\/\d+$/);
      expect(info.note.en, id).toMatch(new RegExp(`frame ${info.source.url.split("/").pop()}\\b`));
      expect(info.note.ja, id).toMatch(/コマ\d+/);
    }
  });

  it("letter 五, 毘 and 本 in Yuji Syuku, an SIL OFL brush font named in NOTICE.md, from the glyphs data-sources/glyphs keeps", async () => {
    const font = JSON.parse(readFileSync("data-sources/glyphs/yuji-syuku.json", "utf8")) as { name: string; licence: string; glyphs: Record<string, { d: string }> };
    expect(font.licence).toMatch(/SIL Open Font License/);
    expect(readFileSync("NOTICE.md", "utf8")).toMatch(/Yuji Syuku[\s\S]*SIL Open Font License/);
    for (const [id, character] of [["samurai:taitokuin-go", "五"], ["samurai:uesugi-danjo-bi", "毘"], ["samurai:honda-mino-hon", "本"]] as const) {
      expect(font.glyphs[character]?.d, character).toMatch(/^M/);
      const drawing = (await samuraiFlag(id)) ?? "";
      expect(drawing, id).toContain(`data-glyph="${character}"`);
      expect(samuraiInfo(id)?.note.en, id).toMatch(/Yuji Syuku/);
    }
  });

  it("are grouped as nobori, hata and uma-jirushi, and tall where they are nobori", () => {
    expect(samuraiIn("nobori")).toEqual(["samurai:hojo-gosyoku", "samurai:sanada-rokumonsen", "samurai:hoshina-higo-kuroboshi", "samurai:sakai-kunai-mitsumaru", "samurai:todo-izumi-mitsumaru", "samurai:honda-mino-hon"]);
    expect(samuraiIn("hata")).toHaveLength(8);
    expect(samuraiIn("uma")).toHaveLength(7);
    expect(samuraiIn("none")).toEqual([]);
    expect(samuraiAspect("samurai:sanada-rokumonsen")).toBe(0.25);
    expect(samuraiAspect("samurai:uesugi-tenshi")).toBe(1.5);
  });

  it("are read loosely or exactly, named in both languages, and null for anything else", async () => {
    expect(samuraiId(" Sanada-Rokumonsen ")).toBe("samurai:sanada-rokumonsen");
    expect(isSamuraiId("samurai:ii-igeta")).toBe(true);
    expect(isSamuraiId("ii-igeta")).toBe(false);
    expect(samuraiName("samurai:sanada-rokumonsen", "ja-JP")).toBe("真田の六連銭の幟");
    expect(samuraiAbout("samurai:ii-igeta", "ja")).toMatch(/井桁/);
    expect(await samuraiFlag("samurai:nobody")).toBeNull();
    expect(samuraiInfo("nobody")).toBeNull();
    expect(() => samuraiId(1 as unknown as string)).toThrow(TypeError);
  });

  it("draw the Uesugi banner as a red disc on dark blue, and the Sanada nobori with six coins on red", async () => {
    expect(await samuraiFlag("samurai:uesugi-tenshi")).toContain('fill="#1d2b53" d="M0 0h300v200h-300z"');
    expect(await samuraiFlag("samurai:uesugi-tenshi")).toContain('fill="#c8102e"');
    const nobori = (await samuraiFlag("samurai:sanada-rokumonsen")) ?? "";
    expect(nobori).toContain('fill="#c8102e" d="M0 0h100v400h-100z"');
    expect((nobori.match(/a14 14/g) ?? []).length).toBe(12);
  });
});
