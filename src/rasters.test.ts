// The raster files and the zip (scripts/rasters.ts), made here for two flags from the built package: pnpm check builds before it tests.
import { mkdtempSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { inflateRawSync } from "node:zlib";

import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { buildRasters } from "../scripts/rasters.ts";

const out = mkdtempSync(join(tmpdir(), "hata-rasters-"));
let made: { files: number; bytes: number };

beforeAll(async () => {
  made = await buildRasters(out, ["JP", "CA"]);
}, 60000);
afterAll(() => rmSync(out, { recursive: true, force: true }));

const dimensions = (file: string): [number, number] => {
  const png = readFileSync(file);

  return [png.readUInt32BE(16), png.readUInt32BE(20)];
};

describe("the raster files", () => {
  it("write each flag as a PNG and a WebP at every width, its height following its proportions", () => {
    expect(readdirSync(join(out, "png")).sort()).toEqual(["round-160", "round-320", "round-40", "round-80", "square-160", "square-320", "square-40", "square-80", "w1280", "w160", "w20", "w320", "w40", "w640", "w80"]);
    expect(readdirSync(join(out, "webp"))).toEqual(readdirSync(join(out, "png")));
    expect(dimensions(join(out, "png", "w320", "jp.png"))).toEqual([320, 213]);
    expect(dimensions(join(out, "png", "w1280", "ca.png"))).toEqual([1280, 640]);
    expect(dimensions(join(out, "png", "w20", "ca.png"))).toEqual([20, 10]);
  });

  it("make the square and round frames square, with the round one's corners clear", () => {
    expect(dimensions(join(out, "png", "square-80", "ca.png"))).toEqual([80, 80]);
    expect(dimensions(join(out, "png", "round-160", "jp.png"))).toEqual([160, 160]);
    // Colour type 6 is RGBA: the corners of a round frame have somewhere to be clear.
    expect(readFileSync(join(out, "png", "round-160", "jp.png"))[25]).toBe(6);
  });

  it("write real WebP files", () => {
    const webp = readFileSync(join(out, "webp", "w160", "jp.webp"));
    expect(webp.subarray(0, 4).toString()).toBe("RIFF");
    expect(webp.subarray(8, 12).toString()).toBe("WEBP");
  });

  it("count what they wrote", () => {
    // 2 flags, 15 sizes, 2 formats, then LICENSES.md and the zip.
    expect(made.files).toBe(2 * 15 * 2 + 2);
  });
});

describe("the licence list and the zip", () => {
  it("name each flag's Commons file, author and licence, and say where credit is owed", () => {
    const list = readFileSync(join(out, "LICENSES.md"), "utf8");
    expect(list).toContain("| `JP` | Japan | [Flag of Japan.svg](https://commons.wikimedia.org/wiki/File:Flag_of_Japan.svg) |");
    expect(list).toContain("| `CA` | Canada |");
    expect(list).toContain("| Credit |");
    expect(list).not.toContain("`US`");
  });

  it("hold every SVG, the manifest and the licences, and read back byte for byte", () => {
    const zip = readFileSync(join(out, "hata-flags.zip"));
    const end = zip.lastIndexOf(Buffer.from([0x50, 0x4b, 0x05, 0x06]));
    const count = zip.readUInt16LE(end + 10);
    let at = zip.readUInt32LE(end + 16);
    const found = new Map<string, Buffer>();
    for (let one = 0; one < count; one += 1) {
      const [method, crc, size, packed, length, offset] = [zip.readUInt16LE(at + 10), zip.readUInt32LE(at + 16), zip.readUInt32LE(at + 24), zip.readUInt32LE(at + 20), zip.readUInt16LE(at + 28), zip.readUInt32LE(at + 42)];
      const name = zip.subarray(at + 46, at + 46 + length).toString();
      const start = offset + 30 + zip.readUInt16LE(offset + 26);
      const data = method === 8 ? inflateRawSync(zip.subarray(start, start + packed)) : zip.subarray(start, start + packed);
      expect(data.length, name).toBe(size);
      expect(crc, name).toBe(zip.readUInt32LE(offset + 14));
      found.set(name, data);
      at += 46 + length;
    }
    expect([...found.keys()].sort()).toEqual(["hata-flags/LICENSE", "hata-flags/LICENSES.md", "hata-flags/NOTICE.md", "hata-flags/manifest.json", "hata-flags/svg/ca.svg", "hata-flags/svg/jp.svg"]);
    expect(found.get("hata-flags/svg/jp.svg")?.toString()).toBe(readFileSync("dist/svg/jp.svg", "utf8"));
    expect(found.get("hata-flags/LICENSES.md")?.toString()).toBe(readFileSync(join(out, "LICENSES.md"), "utf8"));
  });
});
