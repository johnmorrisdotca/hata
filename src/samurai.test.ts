// The samurai banners: nine reconstructions from words, each saying which part is the source's, and a hundred and twenty drawn from the painted
// handscroll 御馬印 (National Diet Library), each cited to its scroll and frame, seven of them lettered in an SIL OFL brush font.
import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { samuraiFiles, samuraiRecords } from "../scripts/draw-samurai";
import { isSamuraiId, SAMURAI_IDS, samuraiAbout, samuraiAspect, samuraiFlag, samuraiId, samuraiIn, samuraiInfo, samuraiName } from "./samurai";

describe("the banners", () => {
  it("are what scripts/draw-samurai.ts makes, so the data file cannot drift from the geometry", () => {
    for (const [path, text] of samuraiFiles()) expect(readFileSync(`src/sets/${path}`, "utf8"), path).toBe(text);
    expect(samuraiRecords().map((one) => one.id)).toEqual([...SAMURAI_IDS]);
    expect(SAMURAI_IDS).toHaveLength(129);
  });

  it("give each record the name, about, note and source the script writes, though the entry builds the handscroll's note and source itself", () => {
    for (const record of samuraiRecords()) {
      const info = samuraiInfo(record.id);
      expect({ name: info?.name, about: info?.about, status: info?.status, dates: info?.dates, note: info?.note, source: info?.source }, record.id).toEqual({ name: record.name, about: record.about, status: record.status, dates: record.dates, note: record.note, source: record.source });
    }
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

  it("take a hundred and twenty banners from the handscroll 御馬印 at the National Diet Library, each documented and cited to its scroll and frame", () => {
    const documented = SAMURAI_IDS.filter((id) => samuraiInfo(id)?.status === "documented");
    expect(documented).toHaveLength(120);
    for (const id of documented) {
      const info = samuraiInfo(id)!;
      expect(info.source.kind, id).toBe("official");
      expect(info.source.title, id).toMatch(/^御馬印 巻[1-6] /);
      expect(info.source.url, id).toMatch(/^https:\/\/dl\.ndl\.go\.jp\/pid\/(1286895|1288242|1288243|1288217|1288244|1287803)\/1\/\d+$/);
      expect(info.source.title.startsWith("御馬印 巻2"), id).toBe(info.source.url.includes("/1288242/"));
      expect(info.source.title.startsWith("御馬印 巻3"), id).toBe(info.source.url.includes("/1288243/"));
      expect(info.source.title.startsWith("御馬印 巻4"), id).toBe(info.source.url.includes("/1288217/"));
      expect(info.source.title.startsWith("御馬印 巻5"), id).toBe(info.source.url.includes("/1288244/"));
      expect(info.source.title.startsWith("御馬印 巻6"), id).toBe(info.source.url.includes("/1287803/"));
      expect(info.note.en, id).toMatch(new RegExp(`frame ${info.source.url.split("/").pop()}\\b`));
      expect(info.note.ja, id).toMatch(/コマ\d+/);
      expect(info.note.en, id).toMatch(/handscroll/);
      expect(info.note.ja, id).toMatch(/絵巻『御馬印』/);
      expect(`${info.about.ja}${info.note.ja}`, id).not.toMatch(/絵本/);
    }
  });

  it("letter 五, 毘, 本 and 山 in Yuji Syuku, an SIL OFL brush font named in NOTICE.md, from the glyphs data-sources/glyphs keeps", async () => {
    const font = JSON.parse(readFileSync("data-sources/glyphs/yuji-syuku.json", "utf8")) as { name: string; licence: string; glyphs: Record<string, { d: string }> };
    expect(font.licence).toMatch(/SIL Open Font License/);
    expect(readFileSync("NOTICE.md", "utf8")).toMatch(/Yuji Syuku[\s\S]*SIL Open Font License/);
    for (const [id, character] of [["samurai:taitokuin-go", "五"], ["samurai:uesugi-danjo-bi", "毘"], ["samurai:honda-mino-hon", "本"], ["samurai:aoyama-okura-yama", "山"], ["samurai:aoyama-okura-yama-shiro", "山"], ["samurai:aoyama-okura-yama-hata", "山"], ["samurai:yamazaki-kai-yama", "山"]] as const) {
      expect(font.glyphs[character]?.d, character).toMatch(/^M/);
      const drawing = (await samuraiFlag(id)) ?? "";
      expect(drawing, id).toContain(`data-glyph="${character}"`);
      expect(samuraiInfo(id)?.note.en, id).toMatch(/Yuji Syuku/);
    }
  });

  it("are grouped as nobori, hata and uma-jirushi, and tall where they are nobori", () => {
    expect(samuraiIn("nobori")).toEqual(["samurai:hojo-gosyoku", "samurai:sanada-rokumonsen", "samurai:hoshina-higo-kuroboshi", "samurai:sakai-kunai-mitsumaru", "samurai:todo-izumi-mitsumaru", "samurai:honda-mino-hon", "samurai:ii-kamon-aka-nobori", "samurai:koide-yamato-naname", "samurai:terazawa-shima-mitsumaru", "samurai:sanada-kawachi-aka-obi", "samurai:koriki-settsu-shiromaru", "samurai:matsudaira-shimosa-kinbishi", "samurai:matsudaira-tanba-kuro-obi", "samurai:sakai-awa-inazuma", "samurai:matsudaira-dewa-shiromaru-nobori", "samurai:okubo-kaga-shirowa", "samurai:aoyama-okura-yama", "samurai:matsudaira-kai-akamaru-nobori", "samurai:matsudaira-yamashiro-shiro-obi", "samurai:matsudaira-uemon-naname-nobori", "samurai:asano-uneme-itsutsumaru", "samurai:mizoguchi-izumo-kuro-obi", "samurai:matsudaira-oki-naname", "samurai:inaba-mino-shiromaru", "samurai:naito-sama-kuro-obi", "samurai:tozawa-ukyo-kuro-obi", "samurai:matsudaira-shogen-kuromaru", "samurai:tsuchiya-minbu-kuro-obi", "samurai:kuriyama-kaga-shiro-obi", "samurai:matsudaira-iwami-hinomaru", "samurai:mizoguchi-hoki-kuro-obi", "samurai:matsudaira-hizen-aka", "samurai:asano-aki-kuro-obi", "samurai:abe-bitchu-kuro-obi", "samurai:okabe-mino-kuro-obi", "samurai:mori-kai-mitsumaru", "samurai:oda-izumo-kuro-obi", "samurai:so-tsushima-shiro-obi", "samurai:katagiri-izumo-naname", "samurai:kurushima-dewa-kuro-obi", "samurai:nakagawa-naizen-mitsumaru", "samurai:shinjo-echizen-naname", "samurai:yamazaki-kai-yama", "samurai:matsudaira-nagato-shiro-obi", "samurai:endo-tajima-hinomaru", "samurai:sugihara-hoki-kuro", "samurai:honda-ise-kuro-obi", "samurai:matsudaira-yamato-shiro-obi", "samurai:kamei-noto-kokonotsumaru", "samurai:matsushita-iwami-kinbatsu", "samurai:hasegawa-shikibu-kuro", "samurai:mukai-shogen-itsutsumaru", "samurai:matsukura-bungo-aka", "samurai:sanada-izu-aka-obi", "samurai:matsura-hizen-mitsumaru", "samurai:kuriyama-saemon-kuromaru", "samurai:togawa-higo-mutsumaru", "samurai:hitotsuyanagi-kenmotsu-kuro-obi", "samurai:date-totomi-kuro-obi", "samurai:hori-mimasaka-janome-nobori", "samurai:inoue-kawachi-kuro", "samurai:hitotsuyanagi-kenmotsu-kuro-obi-hoso", "samurai:matsudaira-suo-kuro-obi", "samurai:matsudaira-suo-kuro-obi-hoso", "samurai:matsudaira-uemonsuke-shiro-obi", "samurai:sanada-izu-aka-obi-hoso"]);
    expect(samuraiIn("hata")).toHaveLength(51);
    expect(samuraiIn("uma")).toHaveLength(12);
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
