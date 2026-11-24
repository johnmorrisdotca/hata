// Helpers for the scripts that draw a set for this package (draw-signals.ts and its kin): numbers written short, shapes as
// path text, polygons clipped to a rectangle, and the SVG wrapper every drawing shares. A drawing is a string with a viewBox and
// no width or height, ids that begin with `<prefix>-<slug>-`, and nothing active or external (the sets' test checks).

import { mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import type { DrawnDrawing } from "../src/drawn.ts";

// The width over the height of the drawing's viewBox (src/svg.ts's aspectOf, which Node cannot import without a bundler).
const aspectOf = (drawing: string): number | null => {
  const box = /viewBox="(-?[\d.]+) (-?[\d.]+) ([\d.]+) ([\d.]+)"/.exec(drawing);

  return box === null ? null : Number(box[3]) / Number(box[4]);
};

const n = (value: number): string => String(Math.round(value * 100) / 100);

/** A closed polygon as path text: points are [x, y]. */
const poly = (points: readonly (readonly [number, number])[]): string => `M${points.map(([x, y]) => `${n(x)} ${n(y)}`).join("L")}z`;

/** A rectangle as path text. */
const box = (x: number, y: number, w: number, h: number): string => `M${n(x)} ${n(y)}h${n(w)}v${n(h)}h${n(-w)}z`;

/** Sutherland-Hodgman: a polygon cut to the rectangle 0,0 to w,h. */
const clipTo = (points: readonly (readonly [number, number])[], w: number, h: number): [number, number][] => {
  type Point = readonly [number, number];
  const edges: { inside: (p: Point) => boolean; cut: (a: Point, b: Point) => Point }[] = [
    { inside: (p) => p[0] >= 0, cut: (a, b) => [0, a[1] + ((b[1] - a[1]) * (0 - a[0])) / (b[0] - a[0])] },
    { inside: (p) => p[0] <= w, cut: (a, b) => [w, a[1] + ((b[1] - a[1]) * (w - a[0])) / (b[0] - a[0])] },
    { inside: (p) => p[1] >= 0, cut: (a, b) => [a[0] + ((b[0] - a[0]) * (0 - a[1])) / (b[1] - a[1]), 0] },
    { inside: (p) => p[1] <= h, cut: (a, b) => [a[0] + ((b[0] - a[0]) * (h - a[1])) / (b[1] - a[1]), h] },
  ];
  let out: Point[] = [...points];
  for (const edge of edges) {
    const input = out;
    out = [];
    input.forEach((current, at) => {
      const previous = input[(at + input.length - 1) % input.length]!;
      if (edge.inside(current)) {
        if (!edge.inside(previous)) out.push(edge.cut(previous, current));
        out.push(current);
      } else if (edge.inside(previous)) out.push(edge.cut(previous, current));
    });
  }

  return out.map(([x, y]) => [x, y] as [number, number]);
};

interface Shape {
  fill: string;
  d: string;
}
/** The drawing: `<svg>` with the viewBox, the data attribute `data-hata-<prefix>="<slug>"`, an optional clip, and the shapes in order. */
const svg = (prefix: string, slug: string, w: number, h: number, shapes: readonly Shape[], clip?: string): string => {
  const id = `${prefix}-${slug}-c`;
  const body = shapes.map((shape) => `<path fill="${shape.fill}" d="${shape.d}"/>`).join("");

  return `<svg data-hata-${prefix}="${slug}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${n(w)} ${n(h)}">${clip === undefined ? body : `<defs><clipPath id="${id}"><path d="${clip}"/></clipPath></defs><g clip-path="url(#${id})">${body}</g>`}</svg>`;
};

/**
 * The files of a drawn set: `<name>.data.ts` (the records without their drawings, and a loader for each) and one module for each drawing,
 * `<name>/<slug>.ts`, which holds its SVG string and nothing else. A page that imports the set's entry carries the records only; a drawing is a
 * dynamic import, loaded when it is asked for, as a country's flag is. Paths are relative to src/sets.
 */
const setFiles = (name: string, constant: string, idType: string, header: string, drawings: readonly DrawnDrawing[]): Map<string, string> => {
  const files = new Map<string, string>();
  const slugOf = (id: string): string => id.slice(id.indexOf(":") + 1);
  const records = drawings.map(({ svg: drawing, ...record }) => ({ ...record, aspect: aspectOf(drawing) ?? 1 }));
  const ids = drawings.map((one) => JSON.stringify(one.id)).join(" | ");
  files.set(
    `${name}.data.ts`,
    `// Made by ${header} (pnpm draw): do not edit by hand. The records of the set, without their drawings, and a loader for each drawing (src/sets/${name}/<slug>.ts).\nimport type { DrawnLoader, DrawnRecord } from "../drawn";\n\ntype ${idType} = ${ids};\n\nconst ${constant}: readonly (DrawnRecord & { id: ${idType} })[] = [\n${records.map((record) => `  ${JSON.stringify(record)},`).join("\n")}\n];\n\nconst ${constant}_LOADERS: Readonly<Record<string, DrawnLoader>> = {\n${drawings.map((one) => `  ${JSON.stringify(one.id)}: () => import("./${name}/${slugOf(one.id)}"),`).join("\n")}\n};\n\nexport { ${constant}, ${constant}_LOADERS };\nexport type { ${idType} };\n`,
  );
  for (const one of drawings) files.set(`${name}/${slugOf(one.id)}.ts`, `// Made by ${header}: do not edit by hand. The drawing of ${one.id}.\n\n/** ${one.name.en}, as an SVG string: viewBox ${/viewBox="([^"]+)"/.exec(one.svg)?.[1] ?? ""}, ${one.svg.length} B. Loaded by the set's entry when it is asked for. */\nconst svg = ${JSON.stringify(one.svg)};\n\nexport { svg };\nexport default svg;\n`);

  return files;
};

/** Writes a set's files under src/sets and removes the drawing modules that are no longer in it. */
const writeSetFiles = (root: string, name: string, files: ReadonlyMap<string, string>): void => {
  mkdirSync(join(root, name), { recursive: true });
  for (const old of readdirSync(join(root, name))) if (!files.has(`${name}/${old}`)) rmSync(join(root, name, old));
  for (const [path, text] of files) writeFileSync(join(root, path), text);
};

/** A date as Japanese writes it: "1861-07-04" is 1861年7月4日, "1861-07" is 1861年7月 and "1848" is 1848年. */
const jaDate = (value: string): string => {
  const [year, month, day] = value.split("-");

  return day !== undefined ? `${year}年${Number(month)}月${Number(day)}日` : month !== undefined ? `${year}年${Number(month)}月` : `${year}年`;
};

export { box, clipTo, jaDate, n, poly, setFiles, svg, writeSetFiles };
export type { Shape };
