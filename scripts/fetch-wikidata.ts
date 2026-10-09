// Asks Wikidata (CC0) once which Wikimedia Commons file is each place's flag (P41, "flag image"), and keeps the
// answer in the repository as data-sources/wikidata-<day>.json, so that scripts/build-data.ts never touches the
// network:
//
//   - for every ISO 3166-1 alpha-2 code (P297): the item, its English label, whether it has ended (P576), and
//     every flag image statement that is not deprecated, with its rank, its start and end (P580, P582) and what
//     it applies to (P518) or is for (P3831);
//   - the same for the ISO 3166-2 codes (P300) of the first-level subdivisions Kuni lists for the countries in
//     SUBDIVISION_COUNTRIES (scripts/data-config.ts): only those codes, so the snapshot holds no county or
//     département nobody reads.
//
//   pnpm data:wikidata
//
// The answer is sorted and grouped by code, so a later run shows as a readable diff. A new file is a new day's
// snapshot; the old one is removed and sources.json names the new one. Then `pnpm data:commons` fetches the files.

import { readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { subdivisions as kuniSubdivisions } from "@johnmorrisdotca/kuni/subdivisions";

import { SUBDIVISION_COUNTRIES } from "./data-config.ts";
import { readManifest, recordFile, sha256, SOURCES_DIR, USER_AGENT, writeManifest } from "./sources.ts";

const ENDPOINT = "https://query.wikidata.org/sparql";

// The subdivisions asked for: the first level of each country in SUBDIVISION_COUNTRIES, as Kuni lists it.
const SUBDIVISION_CODES = SUBDIVISION_COUNTRIES.flatMap((country) => (kuniSubdivisions(country) ?? []).filter((one) => one.level === 1).map((one) => one.code)).sort();

const flagPart = `OPTIONAL {
    ?item p:P41 ?flagStatement .
    ?flagStatement ps:P41 ?flag ; wikibase:rank ?rank .
    FILTER(?rank != wikibase:DeprecatedRank)
    OPTIONAL { ?flagStatement pq:P580 ?start }
    OPTIONAL { ?flagStatement pq:P582 ?end }
    OPTIONAL { ?flagStatement pq:P518 ?part }
    OPTIONAL { ?flagStatement pq:P3831 ?role }
  }
  OPTIONAL { ?item wdt:P576 ?ended }
  OPTIONAL { ?item rdfs:label ?label . FILTER(LANG(?label) = "en") }`;

const COUNTRY_QUERY = `SELECT ?code ?item ?label ?ended ?flag ?rank ?start ?end ?part ?role WHERE {
  ?item p:P297 ?statement .
  ?statement ps:P297 ?code ; wikibase:rank ?codeRank .
  FILTER(?codeRank != wikibase:DeprecatedRank)
  ${flagPart}
}`;

const SUBDIVISION_QUERY = `SELECT ?code ?item ?label ?ended ?flag ?rank ?start ?end ?part ?role WHERE {
  ?item p:P300 ?statement .
  ?statement ps:P300 ?code ; wikibase:rank ?codeRank .
  FILTER(?codeRank != wikibase:DeprecatedRank)
  VALUES ?code { ${SUBDIVISION_CODES.map((code) => `"${code}"`).join(" ")} }
  ${flagPart}
}`;

interface Binding {
  [name: string]: { type: string; value: string } | undefined;
}

interface FlagStatement {
  file: string; // The Commons file name, without "File:"
  rank: "preferred" | "normal";
  start?: string;
  end?: string;
  part?: string[]; // Q-numbers of P518
  role?: string[]; // Q-numbers of P3831
}

interface WikidataItem {
  id: string; // Q-number
  label: string | null;
  ended: boolean;
  flags: FlagStatement[];
}

interface WikidataSnapshot {
  source: string;
  licence: string;
  read: string;
  queries: { countries: string; subdivisions: string };
  countries: Record<string, WikidataItem[]>;
  subdivisions: Record<string, WikidataItem[]>;
}

const ask = async (query: string): Promise<Binding[]> => {
  const response = await fetch(`${ENDPOINT}?format=json&query=${encodeURIComponent(query)}`, {
    headers: { accept: "application/sparql-results+json", "user-agent": USER_AGENT },
  });
  if (!response.ok) throw new Error(`Wikidata answered ${response.status}: ${(await response.text()).slice(0, 400)}`);
  const body = (await response.json()) as { results: { bindings: Binding[] } };

  return body.results.bindings;
};

const qid = (uri: string): string => uri.slice(uri.lastIndexOf("/") + 1);
const byText = (a: string, b: string): number => (a < b ? -1 : a > b ? 1 : 0);
// Special:FilePath/Flag%20of%20Japan.svg -> "Flag of Japan.svg", as Commons names the file.
const fileName = (uri: string): string => decodeURIComponent(uri.slice(uri.lastIndexOf("/") + 1)).replace(/_/g, " ");
const day = (value: string | undefined): string | undefined => (value === undefined ? undefined : value.slice(0, 10));

// Rows to { code: [item, ...] }, each item's statements de-duplicated and sorted, so the file is the same for
// the same answer however the endpoint ordered its rows.
const group = (rows: Binding[]): Record<string, WikidataItem[]> => {
  const codes = new Map<string, Map<string, WikidataItem>>();
  for (const row of rows) {
    const code = row.code?.value;
    const item = row.item?.value;
    if (code === undefined || item === undefined) continue;
    const items = codes.get(code) ?? new Map<string, WikidataItem>();
    codes.set(code, items);
    const id = qid(item);
    const found: WikidataItem = items.get(id) ?? { id, label: row.label?.value ?? null, ended: false, flags: [] };
    items.set(id, found);
    if (row.ended !== undefined) found.ended = true;
    const flag = row.flag?.value;
    if (flag === undefined) continue;
    const file = fileName(flag);
    const start = day(row.start?.value);
    const end = day(row.end?.value);
    let statement = found.flags.find((one) => one.file === file && one.start === start && one.end === end);
    if (statement === undefined) {
      statement = { file, rank: row.rank?.value.endsWith("PreferredRank") ? "preferred" : "normal", ...(start ? { start } : {}), ...(end ? { end } : {}) };
      found.flags.push(statement);
    }
    for (const [key, value] of [["part", row.part?.value], ["role", row.role?.value]] as const) {
      if (value === undefined) continue;
      const list = (statement[key] ??= []);
      if (!list.includes(qid(value))) list.push(qid(value));
    }
  }
  const out: Record<string, WikidataItem[]> = {};
  for (const code of [...codes.keys()].sort(byText)) {
    out[code] = [...codes.get(code)!.values()]
      .map((item) => ({
        ...item,
        flags: item.flags
          .map((flag) => ({ ...flag, ...(flag.part ? { part: [...flag.part].sort(byText) } : {}), ...(flag.role ? { role: [...flag.role].sort(byText) } : {}) }))
          .sort((a, b) => byText(`${a.file}|${a.start ?? ""}|${a.end ?? ""}`, `${b.file}|${b.start ?? ""}|${b.end ?? ""}`)),
      }))
      .sort((a, b) => Number(a.id.slice(1)) - Number(b.id.slice(1)));
  }

  return out;
};

// One line per code: small diffs, and still readable.
const stringify = (snapshot: WikidataSnapshot): string => {
  const block = (record: Record<string, WikidataItem[]>): string =>
    Object.entries(record)
      .map(([code, items]) => `    ${JSON.stringify(code)}: ${JSON.stringify(items)}`)
      .join(",\n");

  return `{
  "source": ${JSON.stringify(snapshot.source)},
  "licence": ${JSON.stringify(snapshot.licence)},
  "read": ${JSON.stringify(snapshot.read)},
  "queries": ${JSON.stringify(snapshot.queries)},
  "countries": {
${block(snapshot.countries)}
  },
  "subdivisions": {
${block(snapshot.subdivisions)}
  }
}
`;
};

const read = new Date().toISOString().slice(0, 10);
console.log("asking Wikidata for the countries' flags");
const countries = group(await ask(COUNTRY_QUERY));
console.log(`  ${Object.keys(countries).length} codes`);
console.log(`asking Wikidata for the flags of ${SUBDIVISION_CODES.length} subdivisions of ${SUBDIVISION_COUNTRIES.join(", ")}`);
const subdivisions = group(await ask(SUBDIVISION_QUERY));
console.log(`  ${Object.keys(subdivisions).length} codes`);

const snapshot: WikidataSnapshot = {
  source: ENDPOINT,
  licence: "CC0-1.0 (https://www.wikidata.org/wiki/Wikidata:Licensing)",
  read,
  queries: { countries: COUNTRY_QUERY, subdivisions: SUBDIVISION_QUERY },
  countries,
  subdivisions,
};
const name = `wikidata-${read}.json`;
const text = stringify(snapshot);
for (const old of readdirSync(SOURCES_DIR).filter((file) => /^wikidata-\d{4}-\d{2}-\d{2}\.json$/.test(file) && file !== name)) rmSync(join(SOURCES_DIR, old));
writeFileSync(join(SOURCES_DIR, name), text);
const manifest = readManifest();
manifest.files = manifest.files.filter((file) => !/^wikidata-\d{4}-\d{2}-\d{2}\.json$/.test(file.path));
writeManifest(
  recordFile(manifest, {
    path: name,
    url: ENDPOINT,
    read,
    sha256: sha256(text),
    note: `Wikidata, the flag image (P41) of every country (P297) and of the first-level subdivisions (P300) of ${SUBDIVISION_COUNTRIES.join(", ")} (CC0)`,
  }),
);
console.log(`wrote data-sources/${name}`);
