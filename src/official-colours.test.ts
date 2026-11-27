// Official screen colours sit beside the colours the flag ships (MODULES-1603). A mismatch is named only when
// CIE76 ΔE is over the recorded threshold. The drawing is not changed to match the specification.
import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

interface Colour {
  name: string;
  official: string;
  shipped: string;
}

interface Flag {
  code: string;
  file: string;
  page: string;
  read: string;
  colours: Colour[];
}

const record = JSON.parse(readFileSync("scripts/official-colours.data.json", "utf8")) as { deltaE76: number; flags: Flag[] };

const expand = (hex: string): string => {
  const bare = hex.replace("#", "").toLowerCase();
  const full = bare.length === 3 ? bare.split("").map((digit) => digit + digit).join("") : bare;
  return `#${full}`;
};

const channel = (hex: string, index: number): number => Number.parseInt(expand(hex).slice(1 + index * 2, 3 + index * 2), 16);

const linear = (channel8: number): number => {
  const value = channel8 / 255;
  return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
};

/** CIE76 distance between two sRGB hex colours. */
const deltaE76 = (left: string, right: string): number => {
  const lab = (hex: string): [number, number, number] => {
    const r = linear(channel(hex, 0));
    const g = linear(channel(hex, 1));
    const b = linear(channel(hex, 2));
    const x = r * 0.4124564 + g * 0.3575761 + b * 0.1804375;
    const y = r * 0.2126729 + g * 0.7151522 + b * 0.072175;
    const z = r * 0.0193339 + g * 0.119192 + b * 0.9503041;
    const f = (t: number): number => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
    const fx = f(x / 0.95047);
    const fy = f(y / 1);
    const fz = f(z / 1.08883);
    return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)];
  };
  const [l1, a1, b1] = lab(left);
  const [l2, a2, b2] = lab(right);
  return Math.hypot(l1 - l2, a1 - a2, b1 - b2);
};

const fillsOf = (file: string): string[] => {
  const source = readFileSync(file, "utf8");
  return [...source.matchAll(/fill=\\?"#([0-9a-fA-F]{3,8})\\?"/g)].map((found) => expand(`#${found[1]}`));
};

describe("official screen colours", () => {
  it("flags a shipped colour only when it is past the recorded distance from the specification", () => {
    expect(record.deltaE76).toBe(5);
    const flagged: string[] = [];
    for (const flag of record.flags) {
      expect(flag.page.startsWith("https://"), flag.code).toBe(true);
      const fills = fillsOf(flag.file);
      for (const colour of flag.colours) {
        const shipped = expand(colour.shipped);
        expect(fills, `${flag.code} ${colour.name} is the colour in the drawing`).toContain(shipped);
        const distance = deltaE76(shipped, colour.official);
        if (distance > record.deltaE76) flagged.push(`${flag.code} ${colour.name}`);
      }
    }
    expect(flagged).toEqual(["DE red", "CA red"]);
    expect(deltaE76("#ffce00", "#FFCC00")).toBeLessThanOrEqual(record.deltaE76);
    expect(deltaE76("#dd0000", "#dd0000")).toBe(0);
  });
});
