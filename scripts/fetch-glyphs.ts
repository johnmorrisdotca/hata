// Fetches the outlines of the characters the lettered banners need from Yuji Syuku, an SIL Open Font License brush font, and keeps them
// in data-sources/glyphs/yuji-syuku.json with the font's licence beside them (OFL.txt). Only the outlines of those characters are
// kept, not the font. The font is read by a small TrueType reader here (cmap, loca, glyf), so no font library is needed.
//
//   pnpm data:glyphs        fetch the font at the pinned commit and rewrite the outlines (network)
//
// An outline is the path of the glyph in the font's own units, y up from the baseline, as TrueType draws it: a move, then lines and
// quadratic curves. scripts/draw-samurai.ts scales it into the banner and turns it the right way up.
import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

/** The characters the banners letter. */
const CHARACTERS = ["五", "毘", "本", "山"];
const COMMIT = "f6a4e8a8247cd8382551b8c2926fae6b650df6f0";
const FONT = {
  name: "Yuji Syuku",
  file: "YujiSyuku-Regular.ttf",
  designer: "Kinuta Font Factory",
  copyright: "Copyright 2021 The Yuji Project Authors (https://github.com/Kinutafontfactory/Yuji)",
  licence: "SIL Open Font License, Version 1.1",
  url: `https://raw.githubusercontent.com/google/fonts/${COMMIT}/ofl/yujisyuku/YujiSyuku-Regular.ttf`,
  licenceUrl: `https://raw.githubusercontent.com/google/fonts/${COMMIT}/ofl/yujisyuku/OFL.txt`,
};

interface Glyph {
  advance: number;
  box: [number, number, number, number];
  d: string;
}

const tables = (font: DataView): Map<string, { offset: number; length: number }> => {
  const found = new Map<string, { offset: number; length: number }>();
  const count = font.getUint16(4);
  for (let i = 0; i < count; i++) {
    const at = 12 + i * 16;
    const tag = String.fromCharCode(font.getUint8(at), font.getUint8(at + 1), font.getUint8(at + 2), font.getUint8(at + 3));
    found.set(tag, { offset: font.getUint32(at + 8), length: font.getUint32(at + 12) });
  }

  return found;
};

/** The glyph index of a code point, from a Unicode cmap subtable of format 12 or 4. */
const glyphIndex = (font: DataView, cmap: number, codePoint: number): number => {
  const count = font.getUint16(cmap + 2);
  const subtables = Array.from({ length: count }, (_, i) => ({ platform: font.getUint16(cmap + 4 + i * 8), encoding: font.getUint16(cmap + 6 + i * 8), offset: cmap + font.getUint32(cmap + 8 + i * 8) }));
  const twelve = subtables.find((one) => font.getUint16(one.offset) === 12);
  if (twelve !== undefined) {
    const groups = font.getUint32(twelve.offset + 12);
    for (let i = 0; i < groups; i++) {
      const at = twelve.offset + 16 + i * 12;
      const [start, end, first] = [font.getUint32(at), font.getUint32(at + 4), font.getUint32(at + 8)];
      if (codePoint >= start && codePoint <= end) return first + codePoint - start;
    }

    return 0;
  }
  const four = subtables.find((one) => font.getUint16(one.offset) === 4 && (one.platform === 3 || one.platform === 0));
  if (four === undefined || codePoint > 0xffff) return 0;
  const segments = font.getUint16(four.offset + 6) / 2;
  const ends = four.offset + 14;
  const starts = ends + segments * 2 + 2;
  const deltas = starts + segments * 2;
  const ranges = deltas + segments * 2;
  for (let i = 0; i < segments; i++) {
    if (codePoint > font.getUint16(ends + i * 2)) continue;
    const start = font.getUint16(starts + i * 2);
    if (codePoint < start) return 0;
    const delta = font.getInt16(deltas + i * 2);
    const range = font.getUint16(ranges + i * 2);
    if (range === 0) return (codePoint + delta) & 0xffff;
    const index = font.getUint16(ranges + i * 2 + range + (codePoint - start) * 2);

    return index === 0 ? 0 : (index + delta) & 0xffff;
  }

  return 0;
};

/** The contours of a simple glyph as points with their on-curve flags, and those of a composite glyph's parts moved by their offsets. */
const contours = (font: DataView, glyf: number, loca: (index: number) => [number, number], index: number): { x: number; y: number; on: boolean }[][] => {
  const [start, end] = loca(index);
  if (end === start) return [];
  const at = glyf + start;
  const count = font.getInt16(at);
  if (count < 0) {
    const out: { x: number; y: number; on: boolean }[][] = [];
    let p = at + 10;
    for (;;) {
      const flags = font.getUint16(p);
      const part = font.getUint16(p + 2);
      p += 4;
      const words = (flags & 1) !== 0;
      const dx = words ? font.getInt16(p) : font.getInt8(p);
      const dy = words ? font.getInt16(p + 2) : font.getInt8(p + 1);
      p += words ? 4 : 2;
      if ((flags & 2) === 0) throw new Error(`glyph ${index}: a part placed by its points, which this reader does not do`);
      if ((flags & 0xc8) !== 0) throw new Error(`glyph ${index}: a scaled part, which this reader does not do`);
      for (const contour of contours(font, glyf, loca, part)) out.push(contour.map((point) => ({ ...point, x: point.x + dx, y: point.y + dy })));
      if ((flags & 0x20) === 0) break;
    }

    return out;
  }
  const lastPoints = Array.from({ length: count }, (_, i) => font.getUint16(at + 10 + i * 2));
  const total = (lastPoints[count - 1] ?? -1) + 1;
  let p = at + 10 + count * 2;
  p += 2 + font.getUint16(p);
  const flags: number[] = [];
  while (flags.length < total) {
    const flag = font.getUint8(p++);
    flags.push(flag);
    if ((flag & 8) !== 0) for (let repeat = font.getUint8(p++); repeat > 0; repeat--) flags.push(flag);
  }
  const read = (short: number, same: number): number[] => {
    let value = 0;

    return flags.map((flag) => {
      if ((flag & short) !== 0) {
        const step = font.getUint8(p++);
        value += (flag & same) !== 0 ? step : -step;
      } else if ((flag & same) === 0) {
        value += font.getInt16(p);
        p += 2;
      }

      return value;
    });
  };
  const xs = read(2, 16);
  const ys = read(4, 32);
  const out: { x: number; y: number; on: boolean }[][] = [];
  let first = 0;
  for (const last of lastPoints) {
    out.push(flags.slice(first, last + 1).map((flag, i) => ({ x: xs[first + i]!, y: ys[first + i]!, on: (flag & 1) !== 0 })));
    first = last + 1;
  }

  return out;
};

/** A contour as path text: TrueType's quadratic curves, with the on-curve points between two off-curve ones put back. */
const pathOf = (contour: { x: number; y: number; on: boolean }[]): string => {
  if (contour.length === 0) return "";
  const at = contour.findIndex((point) => point.on);
  const ring = at < 0 ? contour : [...contour.slice(at), ...contour.slice(0, at)];
  const start = at < 0 ? { x: (ring[0]!.x + ring[1]!.x) / 2, y: (ring[0]!.y + ring[1]!.y) / 2, on: true } : ring[0]!;
  let d = `M${start.x} ${start.y}`;
  let control: { x: number; y: number } | null = null;
  for (const point of [...ring.slice(at < 0 ? 0 : 1), start]) {
    if (point.on) {
      d += control === null ? `L${point.x} ${point.y}` : `Q${control.x} ${control.y} ${point.x} ${point.y}`;
      control = null;
    } else if (control === null) control = point;
    else {
      const middle = { x: (control.x + point.x) / 2, y: (control.y + point.y) / 2 };
      d += `Q${control.x} ${control.y} ${middle.x} ${middle.y}`;
      control = point;
    }
  }

  return `${d}z`;
};

const readGlyphs = (bytes: ArrayBuffer): { unitsPerEm: number; ascender: number; descender: number; glyphs: Record<string, Glyph> } => {
  const font = new DataView(bytes);
  const found = tables(font);
  const table = (tag: string): number => {
    const one = found.get(tag);
    if (one === undefined) throw new Error(`the font has no ${tag} table`);

    return one.offset;
  };
  const head = table("head");
  const unitsPerEm = font.getUint16(head + 18);
  const longLoca = font.getInt16(head + 50) === 1;
  const hhea = table("hhea");
  const [ascender, descender, metrics] = [font.getInt16(hhea + 4), font.getInt16(hhea + 6), font.getUint16(hhea + 34)];
  const hmtx = table("hmtx");
  const locaAt = table("loca");
  const loca = (index: number): [number, number] =>
    longLoca ? [font.getUint32(locaAt + index * 4), font.getUint32(locaAt + index * 4 + 4)] : [font.getUint16(locaAt + index * 2) * 2, font.getUint16(locaAt + index * 2 + 2) * 2];
  const glyphs: Record<string, Glyph> = {};
  for (const character of CHARACTERS) {
    const index = glyphIndex(font, table("cmap"), character.codePointAt(0)!);
    if (index === 0) throw new Error(`the font has no glyph for ${character}`);
    const shapes = contours(font, table("glyf"), loca, index);
    const points = shapes.flat();
    glyphs[character] = {
      advance: font.getUint16(hmtx + Math.min(index, metrics - 1) * 4),
      box: [Math.min(...points.map((one) => one.x)), Math.min(...points.map((one) => one.y)), Math.max(...points.map((one) => one.x)), Math.max(...points.map((one) => one.y))],
      d: shapes.map(pathOf).join(""),
    };
  }

  return { unitsPerEm, ascender, descender, glyphs };
};

const fetchGlyphs = async (): Promise<void> => {
  const [fontResponse, licenceResponse] = await Promise.all([fetch(FONT.url), fetch(FONT.licenceUrl)]);
  if (!fontResponse.ok || !licenceResponse.ok) throw new Error(`could not fetch the font (${fontResponse.status}) or its licence (${licenceResponse.status})`);
  const read = readGlyphs(await fontResponse.arrayBuffer());
  const out = fileURLToPath(new URL("../data-sources/glyphs/", import.meta.url));
  mkdirSync(out, { recursive: true });
  const record = { ...FONT, read: new Date().toISOString().slice(0, 10), characters: CHARACTERS.join(""), ...read };
  writeFileSync(`${out}yuji-syuku.json`, `${JSON.stringify(record, null, 2)}\n`);
  writeFileSync(`${out}OFL.txt`, await licenceResponse.text());
  console.log(`wrote data-sources/glyphs/yuji-syuku.json: ${CHARACTERS.length} glyphs of ${FONT.name}, ${read.unitsPerEm} units to the em`);
};

if (process.argv[1] === fileURLToPath(import.meta.url)) await fetchGlyphs();

export { readGlyphs };
