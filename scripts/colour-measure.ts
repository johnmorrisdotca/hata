// The numbers and the arithmetic of `pnpm data:colours` (scripts/colours.mjs, which says what the measure is): how
// a flag's exact pixel counts become its colours. No browser and no file is read here, so a test can call it.

/** The width every flag is drawn at, in pixels; its height follows its own proportions. */
const WIDTH = 1200;
/** A pixel counts as drawn at this alpha or more, of 255. */
const ALPHA = 128;
/** The least share of the drawn pixels that makes a colour one of the flag's. */
const MIN = 0.001;
/** The width of a cell on each channel, of 256, for the pixels that are no kept colour. */
const CELL = 16;
/** A cell's colour this near a kept one (the distance in red, green and blue) is that colour. */
const NEAR = 40;

const channels = (colour: number): [number, number, number] => [colour >> 16, (colour >> 8) & 255, colour & 255];
const distance = (a: number, b: number): number => Math.hypot(...channels(a).map((value, at) => value - channels(b)[at]!));
// The more common colour first, and the lower number where two are as common: one order on every machine.
const byCount = ([a, countA]: readonly [number, number], [b, countB]: readonly [number, number]): number => countB - countA || a - b;

/**
 * The flag's colours from its exact pixel counts ([a colour as one number, 0xrrggbb, how many pixels]) and how many
 * pixels were drawn: see THE MEASURE in scripts/colours.mjs. Pure, and tested in src/search.test.ts.
 */
function coloursFrom(counts: readonly (readonly [number, number])[], drawn: number, { min = MIN, cell = CELL, near = NEAR }: { min?: number; cell?: number; near?: number } = {}): { colours: [hex: string, share: number][]; merged: number } {
  const least = min * drawn;
  const sorted = [...counts].sort(byCount);
  const kept = new Map<number, number>(sorted.filter(([, count]) => count >= least));
  if (kept.size === 0 && sorted.length > 0) kept.set(sorted[0]![0], sorted[0]![1]);
  let moved = 0;
  const rest = sorted.filter(([colour]) => !kept.has(colour));
  const cells = new Map<string, { total: number; members: (readonly [number, number])[] }>();
  for (const [colour, count] of rest) {
    const key = channels(colour).map((value) => Math.floor(value / cell)).join(",");
    const found = cells.get(key) ?? { total: 0, members: [] };
    found.total += count;
    found.members.push([colour, count]);
    cells.set(key, found);
  }
  const nearest = (colour: number): number => [...kept.keys()].sort((a, b) => distance(colour, a) - distance(colour, b) || kept.get(b)! - kept.get(a)! || a - b)[0]!;
  const loose: (readonly [number, number])[] = [];
  for (const { total, members } of [...cells.values()].sort((a, b) => b.total - a.total || a.members[0]![0] - b.members[0]![0])) {
    if (total < least) {
      loose.push(...members);
      continue;
    }
    const named = members[0]![0];
    const close = nearest(named);
    const target = distance(named, close) <= near ? close : named;
    kept.set(target, (kept.get(target) ?? 0) + total);
    moved += target === named ? total - members[0]![1] : total;
  }
  for (const [colour, count] of loose) {
    const target = nearest(colour);
    kept.set(target, kept.get(target)! + count);
    moved += count;
  }
  const round = (count: number): number => Math.round((count / drawn) * 10000) / 10000;

  return {
    colours: [...kept].sort(byCount).map(([colour, count]) => [`#${colour.toString(16).padStart(6, "0")}`, round(count)] as [string, number]),
    merged: round(moved),
  };
}

export { ALPHA, CELL, coloursFrom, MIN, NEAR, WIDTH };
