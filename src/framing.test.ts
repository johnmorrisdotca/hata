// How flags are framed at 4:3, square and round: every frame was measured (pnpm data:framing) so that none drops a
// colour the flag is made of, and the records, the table frame() reads and the drawings made for a frame agree.
import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { FRAMINGS } from "./data/framings.data";
import canada from "./flags/ca";
import japan from "./flags/jp";
import { frame } from "./index";
import { manifest, MANIFEST } from "./manifest";

const SHAPES = ["4:3", "1:1", "round"] as const;
const measured = JSON.parse(readFileSync("scripts/framings.data.json", "utf8")) as Record<string, Record<(typeof SHAPES)[number], { method: string; fit: string; coverLoses?: string[] }>>;

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

  it("crop only where a crop keeps the flag's colours, and never crop a circle where the square may not be cropped", () => {
    for (const one of MANIFEST) {
      for (const shape of SHAPES) {
        const framing = one.framings[shape];
        if (framing.fit !== "contain") expect(framing.coverLoses, `${one.code} ${shape}`).toEqual([]);
        if (framing.method === "contain") expect(framing.coverLoses.length, `${one.code} ${shape}`).toBeGreaterThan(0);
        if (framing.method === "adapted") expect([framing.source, framing.file?.startsWith(shape === "4:3" ? "flags/4x3/" : "flags/1x1/")], `${one.code} ${shape}`).toEqual(["flag-icons", true]);
      }
      if (one.framings["1:1"].fit === "contain") expect(one.framings.round.fit, one.code).toBe("contain");
    }
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
    const letter = { cover: "c", hoist: "h", contain: "w" } as const;
    const expected = Object.fromEntries(
      MANIFEST.filter((one) => one.sameAs === null)
        .map((one) => [one.code.toLowerCase(), SHAPES.map((shape) => letter[one.framings[shape].fit]).join(",")] as const)
        .filter(([, letters]) => letters !== "c,c,c"),
    );
    expect(FRAMINGS).toEqual(expected);
  });

  it("name their picture's flag in every shipped SVG, so that frame() can find its row", () => {
    for (const one of MANIFEST.filter((record) => record.sameAs === null)) {
      const svg = readFileSync(`src/flags/${one.code.toLowerCase()}.ts`, "utf8");
      expect(svg, one.code).toContain(`data-hata=\\"${one.code.toLowerCase()}\\"`);
    }
  });
});
