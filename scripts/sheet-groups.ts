// The groups the stylesheets and sprites are split in, so a page takes only what it shows: the countries, the former countries, and each country's regions (jp-regions, us-regions).
export function sheetGroups(codes: readonly string[]): Record<string, string[]> {
  const groups: Record<string, string[]> = { countries: [], former: [] };
  for (const code of codes) {
    const [country] = code.split("-");
    if (code.includes("-")) (groups[`${country!.toLowerCase()}-regions`] ??= []).push(code);
    else groups[code.length === 2 ? "countries" : "former"]!.push(code);
  }

  return groups;
}
