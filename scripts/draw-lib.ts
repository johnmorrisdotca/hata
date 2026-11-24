// Helpers for the scripts that draw a set for this package (draw-signals.ts and its kin): numbers written short, shapes as
// path text, polygons clipped to a rectangle, and the SVG wrapper every drawing shares. A drawing is a string with a viewBox and
// no width or height, ids that begin with `<prefix>-<slug>-`, and nothing active or external (the sets' test checks).

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

export { box, clipTo, n, poly, svg };
export type { Shape };
