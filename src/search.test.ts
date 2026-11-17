// Each flag's colours as exact hex shares, measured from the shipped drawing, and the search by colour.
import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { colourName, COLOUR_NAMES as NAMED } from "../scripts/colour-data";
import { coloursFrom, WIDTH } from "../scripts/colour-measure";
import { VARIANT_PICTURES } from "./data/manifest.data";
import { FLAG_CODES } from "./index";
import { flag } from "./load";
import { manifest, MANIFEST, variantsOf } from "./manifest";
import { COLOUR_NAMES, coloursOf, flagsWith } from "./search";

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
    for (const bad of [["pink"], ["Red"], "red", undefined, [1]]) expect(() => flagsWith({ colours: bad as unknown as [] }), String(bad)).toThrow(TypeError);
    expect(() => flagsWith(undefined as unknown as { colours: [] })).toThrow(TypeError);
  });
});
