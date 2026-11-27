// A shipped flag has the shape its source drew it at: width:height of the Commons file's root, or, where the drawing
// is not at the flag's official shape, the official ratio recorded with its source in scripts/official-ratios.data.json.
// Qatar's file once shipped at 4.17:1, its 75 by 18 viewBox, instead of the 28:11 its width and height (and
// preserveAspectRatio="none") ask for; this keeps a flag from being stretched or squeezed again.
import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { aspectOf, FLAG_CODES } from "./index";
import { flag } from "./load";
import { MANIFEST } from "./manifest";

const OFFICIAL = JSON.parse(readFileSync("scripts/official-ratios.data.json", "utf8")) as Record<string, { ratio: [number, number]; source: string; why: string }>;
const TOLERANCE = 0.002; // 0.2%: the viewBox is written to a few decimals

const rootOf = (svg: string): string => /<svg\b[^>]*>/.exec(svg)?.[0] ?? "";
const attribute = (root: string, name: string): string | undefined => new RegExp(`\\s${name}\\s*=\\s*("([^"]*)"|'([^']*)')`).exec(root)?.slice(2).find((value) => value !== undefined);
const length = (value: string | undefined): { number: number; unit: string } | null => {
  const found = /^\s*([0-9.]+(?:e[+-]?[0-9]+)?)\s*(px|mm|cm|in|pt|pc)?\s*$/i.exec(value ?? "");

  return found === null ? null : { number: Number(found[1]), unit: (found[2] ?? "px").toLowerCase() };
};

// The shape a source file asks for: its width and height where both are plain lengths in one unit, else its viewBox.
const sourceRatio = (svg: string): number => {
  const root = rootOf(svg);
  const width = length(attribute(root, "width"));
  const height = length(attribute(root, "height"));
  if (width !== null && height !== null && width.unit === height.unit && height.number > 0) return width.number / height.number;
  const box = (attribute(root, "viewBox") ?? "").trim().split(/[\s,]+/).map(Number);
  if (box.length !== 4 || !box.every(Number.isFinite) || !(box[3]! > 0)) throw new Error("the source has neither a plain width and height nor a viewBox");

  return box[2]! / box[3]!;
};

const commons = MANIFEST.filter((record) => record.source === "commons");
const read = (file: string): string => readFileSync(`data-sources/commons/${file.replace(/ /g, "_").replace(/[\\/:*?"<>|]/g, "-")}`, "utf8");

describe("each flag's shipped shape", () => {
  it("is its source file's width:height, or the official ratio recorded for it", () => {
    expect(commons.length).toBeGreaterThan(400);
    const wrong: string[] = [];
    for (const record of commons) {
      const shipped = record.width / record.height;
      const official = OFFICIAL[record.code]?.ratio;
      const expected = official === undefined ? sourceRatio(read(record.file)) : official[0] / official[1];
      if (Math.abs(shipped - expected) / expected > TOLERANCE) wrong.push(`${record.code}: ships ${shipped.toFixed(4)}:1, ${official === undefined ? `its source file asks for ${expected.toFixed(4)}:1` : `the official ratio is ${official.join(":")}`}`);
    }
    expect(wrong).toEqual([]);
  });

  it("is the loaded picture's own shape too, so what a page draws is what the manifest says", async () => {
    for (const code of ["QA", "CA-PE", "NP", "CH", "JP"]) {
      const record = MANIFEST.find((one) => one.code === code)!;
      expect(aspectOf((await flag(code)) ?? ""), code).toBeCloseTo(record.width / record.height, 3);
    }
  });

  it("records an official ratio only for a flag whose own drawing is another shape, with its source and reason", () => {
    for (const [code, entry] of Object.entries(OFFICIAL)) {
      const record = commons.find((one) => one.code === code);
      expect(FLAG_CODES as readonly string[], code).toContain(code);
      expect(record, `${code} must ship a Commons drawing`).toBeDefined();
      expect(entry.source, code).toMatch(/^\S.*https?:\/\//);
      expect(entry.why.length, code).toBeGreaterThan(40);
      // A stale entry (the drawing was fixed upstream) must go: its own file has to differ from the official shape.
      const drawn = sourceRatio(read(record!.file));
      expect(Math.abs(drawn - entry.ratio[0] / entry.ratio[1]) / drawn, `${code}'s file now draws the official ratio: remove its entry`).toBeGreaterThan(TOLERANCE);
    }
  });

  it("puts Qatar at 28:11 and Prince Edward Island at 3:2", () => {
    const shape = (code: string): number => {
      const record = MANIFEST.find((one) => one.code === code)!;

      return record.width / record.height;
    };
    expect(shape("QA")).toBeCloseTo(28 / 11, 2);
    expect(shape("CA-PE")).toBeCloseTo(3 / 2, 3);
  });
});

// A proportion stated on a page that was read, or the finding that the page does not state one (MODULES-1602, MODULES-1604).
// This is not the correction list: a flag whose drawing already has the ratio stays out of official-ratios.data.json.
interface ProportionSource {
  code: string;
  ratio: [number, number] | null;
  page: string;
  read: string;
  finding: string;
}

const PROPORTIONS = JSON.parse(readFileSync("scripts/proportion-sources.data.json", "utf8")) as { flags: ProportionSource[] };

describe("proportions read from a page", () => {
  it("keeps each finding with the page, and a stated ratio only when the drawing already has it", () => {
    const codes = PROPORTIONS.flags.map((flag) => flag.code);
    expect(codes).toEqual(["JP", "GB", "US", "FR", "ZA", "AR", "OM"]);
    for (const flag of PROPORTIONS.flags) {
      const record = commons.find((one) => one.code === flag.code);
      expect(record, flag.code).toBeDefined();
      expect(flag.page.startsWith("https://"), flag.code).toBe(true);
      expect(flag.read, flag.code).toBe("2026-11-27");
      expect(flag.finding.length, flag.code).toBeGreaterThan(40);
      expect(OFFICIAL[flag.code], `${flag.code} is a source, not a stretched drawing`).toBeUndefined();
      if (flag.ratio === null) continue;
      const shipped = record!.width / record!.height;
      expect(Math.abs(shipped - flag.ratio[0] / flag.ratio[1]) / shipped, flag.code).toBeLessThanOrEqual(TOLERANCE);
    }
    expect(PROPORTIONS.flags.find((flag) => flag.code === "JP")?.ratio).toEqual([3, 2]);
    expect(PROPORTIONS.flags.find((flag) => flag.code === "OM")?.ratio).toEqual([7, 4]);
    expect(PROPORTIONS.flags.filter((flag) => flag.ratio === null).map((flag) => flag.code)).toEqual(["GB", "US", "FR", "ZA", "AR"]);
    const decisions = readFileSync("docs/decisions.md", "utf8");
    expect(decisions).toContain("Its measurement sheet gives one official size, 350 cm by 200 cm, which is");
    expect(decisions).toContain("no dated variant was added.");
  });
});
