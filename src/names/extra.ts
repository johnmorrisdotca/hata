// The lookup the per-language entries share. It holds no names of its own, so it is not an entry:
// each language's file carries only that language's table.

/**
 * The name a language's table holds for a flag's code. The code is read in any case, and `_` is `-`.
 *
 * @param names - That language's names, keyed by the code this package writes.
 * @param code - A flag's code.
 * @returns The name, or null when the table has none.
 * @throws TypeError when `code` is not a string.
 */
export const flagNameIn = (names: Readonly<Record<string, string>>, code: string): string | null => {
  if (typeof code !== "string") throw new TypeError("code must be a string");
  return names[code.trim().toUpperCase().replaceAll("_", "-")] ?? null;
};
