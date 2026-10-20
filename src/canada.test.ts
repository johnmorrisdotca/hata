// Canada: all thirteen provinces and territories have a flag that loads as a whole, safe SVG; Manitoba's is a public-domain drawing.
import { subdivisions } from "@johnmorrisdotca/kuni/subdivisions";
import { describe, expect, it } from "vitest";

import { FLAG_CODES, aspectOf } from "./index";
import { flag } from "./load";
import { leftOut, manifest } from "./manifest";

const PROVINCES = ["CA-AB", "CA-BC", "CA-MB", "CA-NB", "CA-NL", "CA-NS", "CA-ON", "CA-PE", "CA-QC", "CA-SK"];
const TERRITORIES = ["CA-NT", "CA-NU", "CA-YT"];

describe("Canada's provinces and territories", () => {
  it("are the 13 Kuni lists, 10 provinces and 3 territories, and every one has a flag", () => {
    const listed = (subdivisions("CA") ?? []).filter((one) => one.level === 1).map((one) => one.code).sort();
    expect(listed).toEqual([...PROVINCES, ...TERRITORIES].sort());
    for (const code of listed) {
      expect(FLAG_CODES as readonly string[], code).toContain(code);
      expect(leftOut(code), code).toBeNull();
    }
  });

  it("each loads as a whole SVG with no script, no external reference and no embedded picture", async () => {
    for (const code of [...PROVINCES, ...TERRITORIES]) {
      const svg = await flag(code);
      expect(svg?.startsWith("<svg"), code).toBe(true);
      expect(svg?.trimEnd().endsWith("</svg>"), code).toBe(true);
      expect(svg, code).not.toMatch(/<script|<image|data:image|href="https?:|xlink:href="https?:/i);
    }
  }, 30_000);

  it("Manitoba's is the public-domain Red Ensign drawing at 2:1, with its source and licence", async () => {
    const record = manifest("CA-MB");
    expect(record?.licence?.kind).toBe("public-domain");
    expect(record?.page).toBe("https://commons.wikimedia.org/wiki/File:Flag_of_Manitoba.svg");
    expect(aspectOf((await flag("CA-MB")) ?? "")).toBeCloseTo(2, 3);
    expect(record?.source).toBe("commons");
    expect(await flag("CA-MB", { shape: "1:1" })).toContain("<svg");
  });
});
