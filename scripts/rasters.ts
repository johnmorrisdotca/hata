// The flags as pictures in set sizes, and one zip of the SVGs, made from the built package (dist/):
//
//   <out>/png/w<width>/<code>.png        each flag at its own proportions, <width> px wide (height follows), widths 20 to 1280
//   <out>/webp/w<width>/<code>.webp      the same, as lossless WebP
//   <out>/png/square-<size>/…, round-<size>/…, and the same in webp/   the flag in a square or a round frame, <size> px, sizes 40 to 320
//   <out>/hata-flags.zip                 every flag's SVG, manifest.json, LICENSES.md, NOTICE.md and LICENSE
//   <out>/LICENSES.md                    every flag's Commons file, author and licence, and where the credit is owed
//
// They are not in the npm package: `pnpm site` writes them into site/raster, which GitHub Pages serves. Run alone: `pnpm rasters [folder]`.

import { crc32, deflateRawSync } from "node:zlib";
import { createRequire } from "node:module";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { Resvg } from "@resvg/resvg-js";
import encodeWebp, { init } from "@jsquash/webp/encode.js";

import type { FlagRecord } from "../src/manifest.types.ts";
import { ROOT } from "./sources.ts";

const WIDTHS = [20, 40, 80, 160, 320, 640, 1280];
const FRAME_SIZES = [40, 80, 160, 320];
const DIST = join(ROOT, "dist");
const load = (name: string) => import(pathToFileURL(join(DIST, name)).href);

// A zip of stored paths and contents. Dates are fixed, so the same flags make the same file.
function zip(entries: [string, Buffer][]): Buffer {
  const parts: Buffer[] = [];
  const directory: Buffer[] = [];
  let at = 0;
  for (const [name, data] of entries) {
    const path = Buffer.from(name);
    const packed = deflateRawSync(data, { level: 9 });
    const head = Buffer.alloc(30);
    head.writeUInt32LE(0x04034b50, 0);
    head.writeUInt16LE(20, 4);
    head.writeUInt16LE(0x0800, 6);
    head.writeUInt16LE(8, 8);
    head.writeUInt16LE(0, 10);
    head.writeUInt16LE(0x21, 12);
    head.writeUInt32LE(crc32(data), 14);
    head.writeUInt32LE(packed.length, 18);
    head.writeUInt32LE(data.length, 22);
    head.writeUInt16LE(path.length, 26);
    const entry = Buffer.alloc(46);
    entry.writeUInt32LE(0x02014b50, 0);
    entry.writeUInt16LE(20, 4);
    head.copy(entry, 6, 4, 30);
    entry.writeUInt32LE(at, 42);
    directory.push(entry, path);
    parts.push(head, path, packed);
    at += 30 + path.length + packed.length;
  }
  const central = Buffer.concat(directory);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(entries.length, 8);
  end.writeUInt16LE(entries.length, 10);
  end.writeUInt32LE(central.length, 12);
  end.writeUInt32LE(at, 16);

  return Buffer.concat([...parts, central, end]);
}

const cell = (text: string): string => text.replace(/\s+/g, " ").replace(/\|/g, "/").trim();

// The list that goes with the files: each flag's Commons file, author and licence, and the credit a licence asks for.
async function licences(codes: string[]): Promise<string> {
  const { MANIFEST } = await load("manifest.js");
  const { flagName } = await load("names.js");
  const { VERSION } = await load("index.js");
  const records = new Map<string, FlagRecord>((MANIFEST as FlagRecord[]).map((one) => [one.code, one]));
  const rows = codes.map((code) => {
    const one = records.get(code) as FlagRecord;
    const licence = cell(one.licence.name.replace(/ \(accepted:.*$/s, ""));
    const frames = (["4:3", "1:1", "round"] as const).some((shape) => one.framings[shape].method === "adapted") ? "flag-icons (MIT)" : "the same drawing";

    return `| \`${code}\` | ${cell(flagName(code) ?? code)} | [${cell(one.file)}](${one.page}) | ${cell(one.author ?? "")} | ${one.licence.url === null ? licence : `[${licence}](${one.licence.url})`} | ${one.attributionRequired ? "required" : "none"} | ${frames} |`;
  });

  return `# Licences of the flag files

Every picture and SVG here is a flag from @johnmorrisdotca/hata ${VERSION}. The code of the package is MIT; each flag is a drawing on Wikimedia Commons under the licence in its row, and the file's name is its code (\`jp\`, \`jp-13\`), in lower case.

- **Credit** is "required" where the licence asks that the author be credited (CC BY, and the credit NOTICE.md gives for Oman and Mississippi): name the author, link the licence and say if you changed the drawing. Elsewhere nothing is owed, and the author is kept here anyway.
- **Square and round** files are the flag cropped or fitted to the frame as the package frames it. Where a row says flag-icons (MIT), the frame is flag-icons' drawing made for that shape; its copyright and permission notice are in NOTICE.md, which goes with these files.
- A flag's licence is not the whole answer: a country's law may limit how its flag may be used (NOTICE.md, "Not copyright: the insignia note").

| Code | Place | Commons file | Author | Licence | Credit | Square, round and 4:3 |
| --- | --- | --- | --- | --- | --- | --- |
${rows.join("\n")}
`;
}

/**
 * Writes the raster files, the SVG zip and the licence list into `out`, from the built package. Every flag if `codes` is left out.
 * @returns How many files were written, and their bytes.
 */
export async function buildRasters(out: string, codes?: string[]): Promise<{ files: number; bytes: number }> {
  const { FLAG_CODES } = await load("index.js");
  const { flag } = await load("load.js");
  const wanted: string[] = codes ?? FLAG_CODES;
  const require = createRequire(import.meta.url);
  await init(await WebAssembly.compile(readFileSync(require.resolve("@jsquash/webp/codec/enc/webp_enc.wasm"))));
  let files = 0;
  let bytes = 0;
  const write = (path: string, data: Buffer | Uint8Array | string): void => {
    mkdirSync(join(path, ".."), { recursive: true });
    writeFileSync(path, data);
    files += 1;
    bytes += typeof data === "string" ? Buffer.byteLength(data) : data.length;
  };
  const draw = async (svg: string, width: number, folder: string, code: string): Promise<void> => {
    const image = new Resvg(svg, { fitTo: { mode: "width", value: width }, font: { loadSystemFonts: false } }).render();
    write(join(out, "png", folder, `${code}.png`), image.asPng());
    const webp = await encodeWebp({ data: new Uint8ClampedArray(image.pixels), width: image.width, height: image.height, colorSpace: "srgb" }, { lossless: 1 });
    write(join(out, "webp", folder, `${code}.webp`), new Uint8Array(webp));
  };
  const entries: [string, Buffer][] = [];
  for (const code of wanted) {
    const name = code.toLowerCase();
    const svg = readFileSync(join(DIST, "svg", `${name}.svg`), "utf8");
    entries.push([`hata-flags/svg/${name}.svg`, Buffer.from(svg)]);
    for (const width of WIDTHS) await draw(svg, width, `w${width}`, name);
    for (const shape of ["square", "round"] as const) {
      const framed = (await flag(code, { shape: shape === "square" ? "1:1" : "round" })) as string;
      for (const size of FRAME_SIZES) await draw(framed, size, `${shape}-${size}`, name);
    }
  }
  const list = await licences(wanted);
  write(join(out, "LICENSES.md"), list);
  entries.push(["hata-flags/manifest.json", readFileSync(join(DIST, "manifest.json"))], ["hata-flags/LICENSES.md", Buffer.from(list)], ["hata-flags/NOTICE.md", readFileSync(join(ROOT, "NOTICE.md"))], ["hata-flags/LICENSE", readFileSync(join(ROOT, "LICENSE"))]);
  write(join(out, "hata-flags.zip"), zip(entries));

  return { files, bytes };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const out = process.argv[2] ?? "raster";
  const done = await buildRasters(out);
  console.log(`rasters: ${done.files} files, ${(done.bytes / 1024 / 1024).toFixed(1)} MB, in ${out}/`);
}
