// How flags are framed at 4:3, square and round: every frame was measured (pnpm data:framing) so that none drops a
// colour the flag is made of, and the records, the table frame() reads and the drawings made for a frame agree.
import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { CROPS, FRAMINGS } from "./data/framings.data";
import canada from "./flags/ca";
import japan from "./flags/jp";
import rwanda from "./flags/rw";
import usa from "./flags/us";
import uruguay from "./flags/uy";
import { frame } from "./index";
import { manifest, MANIFEST } from "./manifest";
import { FOCUS } from "../scripts/data-config";

const SHAPES = ["4:3", "1:1", "round"] as const;
const measured = JSON.parse(readFileSync("scripts/framings.data.json", "utf8")) as Record<string, Record<(typeof SHAPES)[number], { method: string; fit: string; coverLoses?: string[]; crop: { rule: string; at: string; loses?: string[] } }>>;

describe("the framings", () => {
  it("are measured for every picture, and each record carries its picture's", () => {
    for (const one of MANIFEST) {
      const owner = one.sameAs ?? one.code;
      expect(measured[owner], owner).toBeDefined();
      for (const shape of SHAPES) {
        expect(one.framings[shape].method, `${one.code} ${shape}`).toBe(measured[owner]![shape].method);
        expect(one.framings[shape].fit, `${one.code} ${shape}`).toBe(measured[owner]![shape].fit);
      }
    }
  });

  it("crop from the centre only where that keeps the flag's colours, and never crop a circle where the square may not be cropped", () => {
    for (const one of MANIFEST) {
      for (const shape of SHAPES) {
        const framing = one.framings[shape];
        if (framing.fit === "cover") expect(framing.coverLoses, `${one.code} ${shape}`).toEqual([]);
        if (framing.method === "contain") expect(framing.crop.rule, `${one.code} ${shape}`).toBe("whole");
        // A flag is shown whole because a crop loses a colour, or because a person judged that no crop shows it.
        if (framing.crop.rule === "whole" && FOCUS[one.sameAs ?? one.code] === undefined) expect(framing.coverLoses.length, `${one.code} ${shape}`).toBeGreaterThan(0);
        if (framing.method === "adapted") expect([framing.source, framing.file?.startsWith(shape === "4:3" ? "flags/4x3/" : "flags/1x1/")], `${one.code} ${shape}`).toEqual(["flag-icons", true]);
      }
      if (one.framings["1:1"].fit === "contain") expect(one.framings.round.fit, one.code).toBe("contain");
    }
  });

  it("record how each crop was chosen: a curated crop is a side a person chose, with a reason, and drops no colour without one", () => {
    for (const one of MANIFEST) {
      const focus = FOCUS[one.sameAs ?? one.code];
      for (const shape of SHAPES) {
        const { crop, fit } = one.framings[shape];
        const where = `${one.code} ${shape}`;
        if (crop.rule === "own") {
          expect(one.framings[shape].method, where).toBe("own");
          expect(crop.why, where).toBeNull();
          continue;
        }
        if (focus === undefined) {
          expect([crop.rule, crop.at, crop.why], where).toEqual([crop.rule, "centre", null]);
          expect(["centre", "whole"], where).toContain(crop.rule);
          continue;
        }
        expect(crop.why, where).toContain(focus.why);
        if (focus.at === "whole") expect([crop.rule, crop.at], where).toEqual(["whole", "centre"]);
        else expect(crop.at, where).toBe(focus.at);
        if (crop.rule === "curated") {
          expect(fit, where).toBe("crop");
          // A crop that drops a colour covering 5% of the flag is used only where the reason is written beside it.
          if (crop.loses.length > 0) expect(focus.loses, where).toBeDefined();
          if (crop.loses.length > 0) expect(crop.why, where).toContain(focus.loses);
        }
      }
    }
  });

  it("offer a curated crop for the flags John named: the United States and Uruguay kept at the hoist, Rwanda at the fly", () => {
    for (const code of ["US", "UY", "RW"]) {
      for (const shape of SHAPES) expect(manifest(code)!.framings[shape].crop.rule, `${code} ${shape}`).toBe("curated");
    }
    expect(manifest("US")!.framings["1:1"].crop.at).toBe("left");
    expect(manifest("UY")!.framings["1:1"].crop.at).toBe("left");
    expect(manifest("RW")!.framings["1:1"].crop.at).toBe("right");
    expect(frame(usa, { shape: "1:1" })).toContain('preserveAspectRatio="xMinYMid slice"');
    expect(frame(usa, { shape: "1:1", fit: "crop" })).toBe(frame(usa, { shape: "1:1" }));
    expect(frame(uruguay, { shape: "4:3" })).toContain('preserveAspectRatio="xMinYMid slice"');
    expect(frame(rwanda, { shape: "1:1" })).toContain('preserveAspectRatio="xMaxYMid slice"');
    // The whole flag is always asked for by name: all of it, centred, never cropped.
    expect(frame(usa, { shape: "1:1", fit: "whole" })).toContain('preserveAspectRatio="xMidYMid meet"');
    expect(frame(usa, { shape: "1:1", fit: "whole" })).toBe(frame(usa, { shape: "1:1", fit: "contain" }));
  });

  it("crop a flag nobody chose a side for from the centre when a crop is asked for by name, and keep the whole flag by default where no crop keeps it true", () => {
    // Canada: no crop keeps its red bars, so auto is whole, and a crop asked for is the centre one.
    expect(frame(canada, { shape: "1:1" })).toContain('preserveAspectRatio="xMidYMid meet"');
    expect(frame(canada, { shape: "1:1", fit: "crop" })).toContain('preserveAspectRatio="xMidYMid slice"');
    expect(manifest("CA")!.framings["1:1"].crop).toMatchObject({ rule: "whole", at: "centre", why: null });
    expect(manifest("CA")!.framings["1:1"].crop.loses.join(" ")).toMatch(/^red /);
    // A flag whose crops all misrepresent it is shown whole by choice, with the reason, and a crop asked for is the centre one.
    expect(manifest("AU")!.framings["1:1"].crop).toMatchObject({ rule: "whole", at: "centre" });
    expect(manifest("AU")!.framings["1:1"].crop.why).toMatch(/Ensign/);
    expect(frame(japan, { shape: "1:1", fit: "crop" })).toContain('preserveAspectRatio="xMidYMid slice"');
  });

  it("show Canada's square whole, or as flag-icons draws it, never as the centre crop that drops its red bars", () => {
    const square = manifest("CA")!.framings["1:1"];
    expect(square.method).toBe("adapted");
    expect(square.fit).toBe("contain");
    expect(square.coverLoses.join(" ")).toMatch(/^red /);
    expect(frame(canada, { shape: "1:1" })).toContain('preserveAspectRatio="xMidYMid meet"');
    expect(frame(canada, { shape: "round" })).toContain('fill="#e6e6e6"');
    // Japan's disc survives a crop, so its frames are cropped.
    expect(frame(japan, { shape: "round" })).toContain('preserveAspectRatio="xMidYMid slice"');
  });

  it("are the table frame() reads, one row for each picture that is not cropped from the centre at every shape", () => {
    const letter = { cover: "c", crop: "a", contain: "w" } as const;
    const expected = Object.fromEntries(
      MANIFEST.filter((one) => one.sameAs === null)
        .map((one) => [one.code.toLowerCase(), SHAPES.map((shape) => letter[one.framings[shape].fit]).join(",")] as const)
        .filter(([, letters]) => letters !== "c,c,c"),
    );
    expect(FRAMINGS).toEqual(expected);
  });

  it("are listed in docs/framing.md, every flag a person chose a side for with its reason", () => {
    const doc = readFileSync("docs/framing.md", "utf8");
    for (const [code, focus] of Object.entries(FOCUS)) {
      expect(doc, code).toContain(`| \`${code}\` |`);
      expect(doc, code).toContain(focus.why.replace(/\|/g, "\\|"));
    }
    expect(doc).toContain(`## Flags with a side chosen by hand (${Object.keys(FOCUS).length})`);
  });

  it("are the sides a crop is kept at: one row for each flag a person chose a side for, and for no other", () => {
    const expected = Object.fromEntries(
      MANIFEST.filter((one) => one.sameAs === null && FOCUS[one.code] !== undefined && FOCUS[one.code]!.at !== "whole").map((one) => [one.code.toLowerCase(), FOCUS[one.code]!.at]),
    );
    expect(CROPS).toEqual(expected);
  });

  it("name their picture's flag in every shipped SVG, so that frame() can find its row", () => {
    for (const one of MANIFEST.filter((record) => record.sameAs === null)) {
      const svg = readFileSync(`src/flags/${one.code.toLowerCase()}.ts`, "utf8");
      expect(svg, one.code).toContain(`data-hata=\\"${one.code.toLowerCase()}\\"`);
    }
  });
});
