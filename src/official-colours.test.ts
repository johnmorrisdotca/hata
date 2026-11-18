// scripts/official-colours.data.json puts a government's own screen value for a colour beside the hex the drawing
// ships, with the page it comes from. Nothing is redrawn: a pair further apart than MISMATCH (ΔE 2000, where 2 is
// seen on close inspection and 5 at a glance) is marked `mismatch`, and a mark on a pair that is not that far apart
// is stale. The shipped hex has to be one the flag really has.
import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { FLAG_CODES } from "./index";
import { coloursOf } from "./search";

interface Official {
  role: string;
  official: string;
  shipped: string;
  value: string;
  kind: "law" | "government" | "reported";
  source: string;
  url: string;
  note?: string;
  mismatch?: true;
  read: boolean;
}

const OFFICIAL = JSON.parse(readFileSync("scripts/official-colours.data.json", "utf8")) as Record<string, { name: string; colours: Official[] }>;
const MISMATCH = 5;

const lab = (hex: string): [number, number, number] => {
  const [r, g, b] = [1, 3, 5].map((at) => {
    const c = Number.parseInt(hex.slice(at, at + 2), 16) / 255;

    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];
  const xyz = [0.4124564 * r + 0.3575761 * g + 0.1804375 * b, 0.2126729 * r + 0.7151522 * g + 0.072175 * b, 0.0193339 * r + 0.119192 * g + 0.9503041 * b];
  const [fx, fy, fz] = [xyz[0]! / 0.95047, xyz[1]!, xyz[2]! / 1.08883].map((t) => (t > 216 / 24389 ? Math.cbrt(t) : (24389 / 27 * t + 16) / 116)) as [number, number, number];

  return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)];
};

// CIEDE2000, as in Sharma, Wu and Dalal's paper.
const deltaELab = ([l1, a1, b1]: readonly [number, number, number], [l2, a2, b2]: readonly [number, number, number]): number => {
  const rad = Math.PI / 180;
  const cBar = (Math.hypot(a1, b1) + Math.hypot(a2, b2)) / 2;
  const g = 0.5 * (1 - Math.sqrt(cBar ** 7 / (cBar ** 7 + 25 ** 7)));
  const [p1, p2] = [(1 + g) * a1, (1 + g) * a2];
  const [c1, c2] = [Math.hypot(p1, b1), Math.hypot(p2, b2)];
  const hue = (b: number, a: number): number => (b === 0 && a === 0 ? 0 : ((Math.atan2(b, a) / rad) + 360) % 360);
  const [h1, h2] = [hue(b1, p1), hue(b2, p2)];
  const dh = c1 * c2 === 0 ? 0 : Math.abs(h2 - h1) <= 180 ? h2 - h1 : h2 - h1 > 180 ? h2 - h1 - 360 : h2 - h1 + 360;
  const dL = l2 - l1;
  const dC = c2 - c1;
  const dH = 2 * Math.sqrt(c1 * c2) * Math.sin((dh / 2) * rad);
  const lBar = (l1 + l2) / 2;
  const cMean = (c1 + c2) / 2;
  const hMean = c1 * c2 === 0 ? h1 + h2 : Math.abs(h1 - h2) <= 180 ? (h1 + h2) / 2 : h1 + h2 < 360 ? (h1 + h2 + 360) / 2 : (h1 + h2 - 360) / 2;
  const t = 1 - 0.17 * Math.cos((hMean - 30) * rad) + 0.24 * Math.cos(2 * hMean * rad) + 0.32 * Math.cos((3 * hMean + 6) * rad) - 0.2 * Math.cos((4 * hMean - 63) * rad);
  const sl = 1 + (0.015 * (lBar - 50) ** 2) / Math.sqrt(20 + (lBar - 50) ** 2);
  const sc = 1 + 0.045 * cMean;
  const sh = 1 + 0.015 * cMean * t;
  const rt = -2 * Math.sqrt(cMean ** 7 / (cMean ** 7 + 25 ** 7)) * Math.sin(60 * Math.exp(-(((hMean - 275) / 25) ** 2)) * rad);

  return Math.sqrt((dL / sl) ** 2 + (dC / sc) ** 2 + (dH / sh) ** 2 + rt * (dC / sc) * (dH / sh));
};

const deltaE = (one: string, other: string): number => deltaELab(lab(one), lab(other));

describe("the official colours on file", () => {
  it("measures ΔE 2000 as the paper's test pairs do, and a colour against itself as 0", () => {
    expect(deltaELab([50, 2.6772, -79.7751], [50, 0, -82.7485])).toBeCloseTo(2.0425, 3);
    expect(deltaELab([50, 2.5, 0], [50, 0, -2.5])).toBeCloseTo(4.3065, 3);
    expect(deltaE("#ff0000", "#ff0000")).toBe(0);
  });

  it("is of codes the package has, each pair with its source and the hex the flag ships", () => {
    expect(Object.keys(OFFICIAL)).toEqual(expect.arrayContaining(["DE", "CA"]));
    for (const [code, entry] of Object.entries(OFFICIAL)) {
      expect(FLAG_CODES as readonly string[], code).toContain(code);
      const shipped = coloursOf(code).map((one) => one.hex);
      for (const colour of entry.colours) {
        expect(colour.official, `${code} ${colour.role}`).toMatch(/^#[0-9A-F]{6}$/i);
        expect(colour.url, `${code} ${colour.role}`).toMatch(/^https?:\/\//);
        expect(colour.source.length, `${code} ${colour.role}`).toBeGreaterThan(40);
        expect(shipped, `${code} ${colour.role}: the flag does not ship ${colour.shipped}`).toContain(colour.shipped);
      }
    }
  });

  it("marks exactly the pairs further apart than ΔE 5", () => {
    const wrong: string[] = [];
    for (const [code, entry] of Object.entries(OFFICIAL)) {
      for (const colour of entry.colours) {
        const distance = deltaE(colour.official.toLowerCase(), colour.shipped);
        if ((distance > MISMATCH) !== (colour.mismatch === true)) wrong.push(`${code} ${colour.role}: ΔE ${distance.toFixed(1)}, ${colour.mismatch === true ? "marked" : "not marked"}`);
      }
    }
    expect(wrong).toEqual([]);
  });
});
