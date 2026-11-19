// Each flag's colours as exact hex shares, measured from the shipped drawing, its tags with the source of each, and
// the search by colour and by tag.
import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { colourName, COLOUR_NAMES as NAMED } from "../scripts/colour-data";
import { coloursFrom, WIDTH } from "../scripts/colour-measure";
import { CATEGORY_DESCRIBES, CATEGORY_TAGS, FLAG_TAGS as TAG_LIST, TAG_REVIEWS, TAG_SOURCES as SOURCE_LIST, WIKIDATA_TAGS } from "../scripts/tag-config";
import { VARIANT_PICTURES } from "./data/manifest.data";
import { FLAG_CODES } from "./index";
import { flag } from "./load";
import { manifest, MANIFEST, variantsOf } from "./manifest";
import { COLOUR_NAMES, coloursOf, countsWith, FLAG_TAGS, flagsWith, TAG_SOURCES, tagsOf } from "./search";

const measured = JSON.parse(readFileSync("scripts/colours.data.json", "utf8")) as Record<string, { width: number; height: number; drawn: number; colours: [string, number][]; merged: number }>;

describe("the measure (scripts/colours.mjs)", () => {
  it("has a line for every picture that ships, a flag's own or a variant's, and for nothing else", () => {
    expect(Object.keys(measured).sort()).toEqual([...MANIFEST.filter((one) => one.sameAs === null).map((one) => one.code), ...VARIANT_PICTURES.map((one) => one.code)].sort());
  });

  it("gives every picture at least one colour, each a hex with a share, the largest first, summing to the whole flag", () => {
    for (const [key, one] of Object.entries(measured)) {
      expect(one.colours.length, key).toBeGreaterThan(0);
      expect(one.width, key).toBe(WIDTH);
      for (const [hex, share] of one.colours) {
        expect(hex, key).toMatch(/^#[0-9a-f]{6}$/);
        expect(share, `${key} ${hex}`).toBeGreaterThanOrEqual(0.001);
        expect(share, `${key} ${hex}`).toBeLessThanOrEqual(1);
      }
      expect(one.colours.map(([, share]) => share), key).toEqual(one.colours.map(([, share]) => share).sort((a, b) => b - a));
      expect(new Set(one.colours.map(([hex]) => hex)).size, key).toBe(one.colours.length);
      // Four decimals each: the sum is off by rounding alone.
      expect(Math.abs(one.colours.reduce((sum, [, share]) => sum + share, 0) - 1), key).toBeLessThan(0.0001 * one.colours.length);
      expect(one.merged, key).toBeLessThan(0.1);
    }
  });

  it("finds in a flat flag the colours its SVG names, and their shares", async () => {
    for (const code of ["FR", "DE", "MQ", "IE"]) {
      const svg = (await flag(code))!.toLowerCase();
      for (const [hex] of measured[code]!.colours) expect(svg.includes(hex) || svg.includes(`#${hex[1]}${hex[3]}${hex[5]}`) || (hex === "#000000" && !svg.includes('fill="#fff"')), `${code} ${hex}`).toBe(true);
    }
    expect(measured.FR!.colours).toEqual([["#002654", 0.3333], ["#ce1126", 0.3333], ["#ffffff", 0.3333]]);
    expect(measured.JP!.colours).toEqual([["#ffffff", 0.8116], ["#bc002d", 0.1884]]);
    expect(measured.MQ!.colours).toEqual([["#00a650", 0.375], ["#231f1e", 0.375], ["#ef1923", 0.25]]);
  });

  it("keeps a colour that covers 0.1%, makes one of a gradient's steps, and gives what is left to the nearest", () => {
    const red = 0xff0000;
    const white = 0xffffff;
    // 10,000 pixels: red and white flat, one pixel of a blend between them (nearer white), and a run of twelve near-blues of one pixel each.
    const blues = Array.from({ length: 12 }, (_, at) => [0x000080 + at, 1] as [number, number]);
    const made = coloursFrom([[red, 6000], [white, 3987], [0xff8080, 1], ...blues], 10000);
    expect(made.colours).toEqual([["#ff0000", 0.6], ["#ffffff", 0.3988], ["#000080", 0.0012]]);
    expect(made.merged).toBe(0.0012);
    // A cell that is a shade of a kept colour is that colour.
    expect(coloursFrom([[red, 99880], [0xfa0505, 60], [0xfb0404, 60]], 100000).colours).toEqual([["#ff0000", 1]]);
    // Nothing reaches the least share: the commonest colour is kept, so no flag is without a colour.
    expect(coloursFrom(Array.from({ length: 2000 }, (_, at) => [at * 4096, 1] as [number, number]), 2000, { cell: 1 }).colours.length).toBe(1);
  });
});

describe("colourName (scripts/colour-data.ts)", () => {
  it("names a colour from the closed list, by rule", () => {
    const names: Record<string, string> = {
      "#ffffff": "white", "#fffffd": "white", "#f4f5f8": "white", "#000000": "black", "#231f1e": "black", "#2d2926": "black", "#b1b4b3": "grey",
      "#ce1126": "red", "#bc002d": "red", "#8a1538": "red", "#ff8200": "orange", "#ff883e": "orange", "#ff6820": "orange",
      "#ffce00": "yellow", "#fcd116": "yellow", "#ffb81c": "yellow", "#169b62": "green", "#01411c": "green", "#00534e": "green", "#007168": "green",
      "#002654": "blue", "#0038b8": "blue", "#3366ff": "blue", "#74acdf": "light-blue", "#00abc2": "light-blue", "#4189dd": "light-blue", "#5b92e5": "light-blue",
      "#4b0082": "purple", "#5c462b": "brown", "#8b4513": "brown",
    };
    for (const [hex, name] of Object.entries(names)) expect(colourName(hex), hex).toBe(name);
    for (const bad of ["red", "#fff", "#FFFFFF", "ffffff", ""]) expect(() => colourName(bad), bad).toThrow(TypeError);
  });

  it("is the list /search and the types give", () => {
    expect([...COLOUR_NAMES]).toEqual([...NAMED]);
    expect([...COLOUR_NAMES]).toEqual(["red", "orange", "yellow", "green", "light-blue", "blue", "purple", "brown", "black", "grey", "white"]);
    expect(Object.isFrozen(COLOUR_NAMES)).toBe(true);
  });
});

describe("coloursOf", () => {
  it("gives every flag its colours, named from the closed list, the same as the manifest's", () => {
    for (const code of FLAG_CODES) {
      const colours = coloursOf(code);
      expect(colours.length, code).toBeGreaterThan(0);
      for (const one of colours) expect(COLOUR_NAMES, `${code} ${one.hex}`).toContain(one.name);
      expect(colours, code).toEqual(manifest(code)!.colours);
      expect(colours.map((one) => [one.hex, one.share]), code).toEqual(measured[manifest(code)!.sameAs ?? code]!.colours);
    }
  });

  it("reads a code as the package does, and a variant by its id", () => {
    expect(coloursOf("jp")).toEqual([{ hex: "#ffffff", share: 0.8116, name: "white" }, { hex: "#bc002d", share: 0.1884, name: "red" }]);
    expect(coloursOf(" fr_972 ")).toBe(coloursOf("MQ"));
    expect(coloursOf("FR-972").map((one) => one.name)).toEqual(["green", "black", "red"]);
    expect(coloursOf("SU")).toBe(coloursOf("SUHH"));
    expect(coloursOf("MQ", { variant: "france" })).toBe(coloursOf("FR"));
    expect(coloursOf("MQ", { variant: "martinique" })).toBe(coloursOf("MQ"));
    expect(coloursOf("AF", { variant: "de-facto" }).map((one) => one.name)).toEqual(["white", "black"]);
    expect(coloursOf("GB-NIR")).toEqual([]);
    expect(coloursOf("GB-NIR", { variant: "union-flag" })).toBe(coloursOf("GB"));
    expect(coloursOf("XX")).toEqual([]);
    expect(coloursOf("JP", { variant: "nothing" })).toEqual([]);
    expect(Object.isFrozen(coloursOf("JP"))).toBe(true);
    expect(Object.isFrozen(coloursOf("JP")[0])).toBe(true);
    expect(() => coloursOf(1 as unknown as string)).toThrow(TypeError);
    expect(() => coloursOf("JP", { variant: 1 as unknown as string })).toThrow(TypeError);
  });

  it("has colours for every variant of every place", () => {
    for (const record of MANIFEST) for (const variant of variantsOf(record.code)) expect(coloursOf(record.code, { variant: variant.id }).length, `${record.code} ${variant.id}`).toBeGreaterThan(0);
  });
});

describe("flagsWith", () => {
  it("finds the flags that have every colour asked for", () => {
    const redWhite = flagsWith({ colours: ["red", "white"] });
    for (const code of ["JP", "CA", "FR", "US", "PL", "CH"]) expect(redWhite, code).toContain(code);
    for (const code of ["DE", "IE", "UA", "MQ"]) expect(redWhite, code).not.toContain(code);
    expect(flagsWith({ colours: [] })).toEqual([...FLAG_CODES]);
    expect(flagsWith({ colours: ["green", "black", "red"] })).toContain("FR-972");
  });

  it("with only, leaves out a flag with another colour over 3%, and keeps one with a small emblem", () => {
    const only = flagsWith({ colours: ["red", "white"], only: true });
    for (const code of ["JP", "CA", "PL", "CH", "DK", "AT"]) expect(only, code).toContain(code);
    for (const code of ["FR", "US", "GB"]) expect(only, code).not.toContain(code);
    expect(flagsWith({ colours: ["green", "white", "red"], only: true })).toEqual(expect.arrayContaining(["IT", "MX"]));
    expect(flagsWith({ colours: ["green", "white", "orange"], only: true })).toEqual(expect.arrayContaining(["IE", "CI", "IN"]));
    expect(flagsWith({ colours: ["black", "red", "yellow"], only: true })).toEqual(expect.arrayContaining(["DE", "BE"]));
    expect(flagsWith({ colours: ["light-blue", "white"], only: true })).toEqual(expect.arrayContaining(["AR", "SO", "FM"]));
    expect(flagsWith({ colours: [], only: true })).toEqual([]);
  });

  it("refuses a name that is not on the list", () => {
    for (const bad of [["pink"], ["Red"], "red", [1]]) expect(() => flagsWith({ colours: bad as unknown as [] }), String(bad)).toThrow(TypeError);
    expect(() => flagsWith(undefined as unknown as { colours: [] })).toThrow(TypeError);
  });
});

describe("flagsWith within, and countsWith", () => {
  it("looks among the countries, a country's regions or a list of codes only", () => {
    const countries = flagsWith({ within: "countries" });
    expect(countries.every((code) => code.length === 2)).toBe(true);
    expect(countries).toContain("JP");
    expect(flagsWith({ within: "jp" })).toEqual(FLAG_CODES.filter((code) => code.startsWith("JP-")));
    expect(flagsWith({ within: ["ca", "JP", "XX"] })).toEqual(["CA", "JP"]);
    expect(flagsWith({ colours: ["red", "white"], only: true, within: "countries" })).toEqual(expect.arrayContaining(["JP", "PL"]));
    expect(flagsWith({ colours: ["red", "white"], only: true, within: "countries" })).not.toContain("JP-13");
    expect(flagsWith({ within: "XX" })).toEqual([]);
    for (const bad of [1, [1], null]) expect(() => flagsWith({ within: bad as unknown as string }), String(bad)).toThrow(TypeError);
  });

  it("finds the tagged flags among the flags that were looked at", () => {
    const sources = ["reviewed", "computed", "wikidata"] as const;
    expect(flagsWith({ tags: ["stars", "stripes-horizontal"], sources, within: "countries" })).toEqual(expect.arrayContaining(["CU", "IL", "SR"]));
    expect(flagsWith({ tags: ["text"], sources, within: "countries" })).toEqual(["BR", "IQ", "SA"]);
  });

  it("counts the flags a query would find with one more name, each the same as flagsWith gives", () => {
    const query = { colours: ["red"], tags: ["stars"], within: "countries" } as const;
    const counts = countsWith(query);
    expect(Object.keys(counts.colours)).toEqual([...COLOUR_NAMES]);
    expect(Object.keys(counts.tags)).toEqual([...FLAG_TAGS]);
    expect(counts.colours.white).toBe(flagsWith({ ...query, colours: ["red", "white"] }).length);
    expect(counts.tags.crescent).toBe(flagsWith({ ...query, tags: ["stars", "crescent"] }).length);
    // A name the query has already gives the query's own count.
    expect(counts.colours.red).toBe(flagsWith(query).length);
    expect(counts.tags.stars).toBe(flagsWith(query).length);
    expect(countsWith({ within: "countries" }).colours.red).toBe(flagsWith({ colours: ["red"], within: "countries" }).length);
    expect(() => countsWith({ tags: ["pink" as "stars"] })).toThrow(TypeError);
  });
});

describe("the tags (scripts/tag-config.ts, scripts/tag-data.ts)", () => {
  const geometry = JSON.parse(readFileSync("scripts/tags.data.json", "utf8")) as Record<string, { across: [string, number][] | null; down: [string, number][] | null; edgesAcross: [string, number][] | null; edgesDown: [string, number][] | null; text: boolean }>;
  const snapshotName = (JSON.parse(readFileSync("data-sources/sources.json", "utf8")) as { files: { path: string }[] }).files.map((file) => file.path).find((path) => path.startsWith("flag-tags-"))!;
  const snapshot = JSON.parse(readFileSync(`data-sources/${snapshotName}`, "utf8")) as { wikidata: { flags: Record<string, { flag: string; depicts: [string, string][] }[]>; kinds: Record<string, string[]>; labels: Record<string, string> }; commons: { categories: Record<string, string[]> } };

  it("has a measure for every picture that ships, and for nothing else", () => {
    expect(Object.keys(geometry).sort()).toEqual(Object.keys(measured).sort());
    expect(geometry.DE!.across).toEqual([["#000000", 0.3333], ["#dd0000", 0.3333], ["#ffce00", 0.3333]]);
    expect(geometry.FR!.down?.map(([hex]) => hex)).toEqual(["#002654", "#ffffff", "#ce1126"]);
    expect(geometry.JP).toMatchObject({ across: null, down: null });
    expect(geometry.DK!.edgesAcross?.length).toBe(3);
    expect(geometry.DK!.edgesDown?.length).toBe(3);
  });

  it("names in its closed list the tags the types and /search name, each with when it applies", () => {
    expect(TAG_LIST.map((one) => one.id)).toEqual([...FLAG_TAGS]);
    expect(new Set(FLAG_TAGS).size).toBe(FLAG_TAGS.length);
    for (const one of TAG_LIST) {
      expect(one.id).toMatch(/^[a-z]+(-[a-z]+)*$/);
      expect(one.what.length, one.id).toBeGreaterThan(5);
    }
    expect([...TAG_SOURCES]).toEqual([...SOURCE_LIST]);
    expect([...TAG_SOURCES]).toEqual(["reviewed", "computed", "wikidata", "unreviewed"]);
    expect(Object.isFrozen(FLAG_TAGS) && Object.isFrozen(TAG_SOURCES)).toBe(true);
  });

  it("holds every Wikidata item of its table to the label Wikidata gave, and every tag in its tables to the list", () => {
    for (const [item, one] of Object.entries(WIKIDATA_TAGS)) {
      expect(snapshot.wikidata.labels[item], item).toBe(one.label);
      for (const tag of one.tags) expect(FLAG_TAGS, `${item} ${tag}`).toContain(tag);
    }
    for (const rule of CATEGORY_TAGS) for (const tag of rule.tags) expect(FLAG_TAGS, String(rule.pattern)).toContain(tag);
    for (const [key, reviews] of Object.entries(TAG_REVIEWS)) {
      expect(Object.keys(measured), key).toContain(key);
      for (const [tag, answer] of Object.entries(reviews)) {
        expect(FLAG_TAGS, `${key} ${tag}`).toContain(tag);
        expect(["yes", "no"], `${key} ${tag}`).toContain(answer);
      }
    }
  });

  it("reads only the Commons categories that say what is on a flag", () => {
    const tagsFor = (category: string): string[] => (CATEGORY_DESCRIBES.test(category) ? CATEGORY_TAGS.filter((rule) => rule.pattern.test(category)).flatMap((rule) => [...rule.tags]) : []);
    expect(tagsFor("Flags with five-pointed stars")).toEqual(["stars"]);
    expect(tagsFor("Union Jack cantons")).toEqual(["cross", "saltire", "canton"]);
    expect(tagsFor("Eagles on flags of the United States")).toEqual(["animal"]);
    expect(tagsFor("Horizontal bicolor white and red flags")).toEqual(["stripes-horizontal"]);
    expect(tagsFor("Hiragana flags (1 letter)")).toEqual(["text"]);
    for (const category of ["Flags of territories in the Austrian Circle", "Flags based on the flag of Germany", "Plain blue SVG star icons", "SVG flags of Japan - aspect ratio of 3:2", "Flags with blue fields", "Red star as a symbol of communism"]) expect(tagsFor(category), category).toEqual([]);
  });

  it("gives every flag tags of the list with a source and what it rests on, each tag once, in the list's order", () => {
    for (const record of MANIFEST) {
      const tags = record.tags;
      expect(tags.map((one) => one.tag), record.code).toEqual(FLAG_TAGS.filter((tag) => tags.some((one) => one.tag === tag)));
      for (const one of tags) {
        expect(FLAG_TAGS, `${record.code} ${one.tag}`).toContain(one.tag);
        expect(TAG_SOURCES, `${record.code} ${one.tag}`).toContain(one.source);
        expect(one.from.length, `${record.code} ${one.tag}`).toBeGreaterThan(8);
        // Nothing automated passes as checked: a reviewed tag is one a person put in TAG_REVIEWS.
        if (one.source === "reviewed") expect(TAG_REVIEWS[record.sameAs ?? record.code]?.[one.tag], `${record.code} ${one.tag}`).toBe("yes");
        if (one.source === "wikidata") expect(one.from, `${record.code} ${one.tag}`).toMatch(/^Q\d+ depicts .*\(Q\d+\)/);
        if (one.source === "unreviewed") expect(one.from, `${record.code} ${one.tag}`).toMatch(/^(Commons category "|the same |a band across|\d+ colours)/);
      }
      expect(tagsOf(record.code), record.code).toEqual(tags.map(({ tag, source }) => ({ tag, source })));
    }
  });

  it("computes what needs no judgement: bands across or down the whole flag, and nothing on them", () => {
    expect(manifest("DE")!.tags).toEqual([
      { tag: "plain", source: "computed", from: "the whole flag is three bands across, with nothing on them" },
      { tag: "stripes-horizontal", source: "computed", from: "the whole flag is three bands across" },
    ]);
    expect(tagsOf("FR")).toEqual([{ tag: "plain", source: "computed" }, { tag: "stripes-vertical", source: "computed" }]);
    for (const [key, one] of Object.entries(geometry)) {
      const record = manifest(key);
      if (record === null) continue;
      const computed = record.tags.filter((tag) => tag.source === "computed").map((tag) => tag.tag);
      expect(computed.includes("plain"), key).toBe(one.across !== null || one.down !== null);
      expect(computed.includes("stripes-horizontal"), key).toBe((one.across?.length ?? 0) > 1);
      expect(computed.includes("stripes-vertical"), key).toBe((one.down?.length ?? 0) > 1);
    }
  });

  it("takes Wikidata's word where the flag's item depicts a thing of a named kind", () => {
    expect(tagsOf("DK")).toEqual([{ tag: "cross", source: "wikidata" }, { tag: "nordic-cross", source: "wikidata" }]);
    expect(tagsOf("JP")).toEqual([{ tag: "sun", source: "wikidata" }, { tag: "circle", source: "wikidata" }]);
    expect(manifest("BR")!.tags.find((one) => one.tag === "stars")?.from).toMatch(/a kind of (star|constellation) \(Q\d+\)$/);
    // The Sun is a star to an astronomer and a sun on a flag: a named thing gives its own tags only.
    expect(tagsOf("JP").some((one) => one.tag === "stars")).toBe(false);
  });

  it("reads a code and a variant as coloursOf does", () => {
    expect(tagsOf(" fr_972 ")).toBe(tagsOf("MQ"));
    expect(tagsOf("MQ", { variant: "france" })).toBe(tagsOf("FR"));
    expect(tagsOf("GB-NIR")).toEqual([]);
    expect(tagsOf("GB-NIR", { variant: "union-flag" })).toBe(tagsOf("GB"));
    expect(tagsOf("XX")).toEqual([]);
    expect(Object.isFrozen(tagsOf("DE")) && Object.isFrozen(tagsOf("DE")[0])).toBe(true);
    expect(() => tagsOf(1 as unknown as string)).toThrow(TypeError);
    expect(() => tagsOf("JP", { variant: 1 as unknown as string })).toThrow(TypeError);
    for (const record of MANIFEST) for (const variant of variantsOf(record.code)) expect(Array.isArray(tagsOf(record.code, { variant: variant.id })), `${record.code} ${variant.id}`).toBe(true);
  });

  it("finds flags by tag, by the sources that count, and with colours", () => {
    expect(flagsWith({ tags: ["nordic-cross"] })).toEqual(expect.arrayContaining(["DK", "FI", "IS", "NO", "SE"]));
    expect(flagsWith({ tags: ["stripes-horizontal"], sources: ["computed"] })).toEqual(expect.arrayContaining(["DE", "UA", "NL"]));
    expect(flagsWith({ tags: ["stripes-horizontal"], sources: ["computed"] })).not.toContain("IN");
    expect(flagsWith({ tags: ["stripes-horizontal"] })).toContain("IN");
    expect(flagsWith({ tags: ["plain", "stripes-vertical"], colours: ["blue", "white", "red"], only: true })).toContain("FR");
    expect(flagsWith({ tags: ["stars"], sources: ["reviewed"] })).toEqual(Object.keys(TAG_REVIEWS).length === 0 ? [] : expect.any(Array));
    expect(flagsWith({})).toEqual([...FLAG_CODES]);
    expect(flagsWith({ tags: [] })).toEqual([...FLAG_CODES]);
    for (const bad of [["star"], "stars", [1]]) expect(() => flagsWith({ tags: bad as unknown as [] }), String(bad)).toThrow(TypeError);
    expect(() => flagsWith({ tags: ["stars"], sources: ["guess"] as unknown as [] })).toThrow(TypeError);
  });
});
