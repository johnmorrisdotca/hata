// Asks Wikidata (CC0) and Wikimedia Commons once what is on each shipped flag, and keeps the answer in the
// repository as data-sources/flag-tags-<day>.json, so that scripts/build-data.ts never touches the network:
//
//   - Wikidata: for the item of every place with a flag here, its flag's own item (P163) and what that item depicts
//     (P180), with each thing's English label; and, for every thing depicted, which of the items WIKIDATA_TAGS names
//     (scripts/tag-config.ts) it is, is an instance of, is a subclass of or is a taxon under (P31, P279, P171);
//   - Wikidata: the English label of each item WIKIDATA_TAGS names, so a test can hold the table to it;
//   - Commons: the categories (not the hidden ones) of every file a shipped flag or variant is drawn from.
//
//   pnpm data:tags:fetch
//
// Few requests, and slowly: two SPARQL queries a minute apart (the query service asks for no more), the labels in
// calls of 50 items, the categories in calls of 50 files, six seconds apart. A failed request stops the run; nothing
// is tried again, and a second run asks only for what the first did not get (the day's answers are kept under
// node_modules/.cache). HATA_USER_AGENT replaces the User-Agent header sent. A new file is a new day's snapshot; the old
// one is removed and sources.json names the new one. Then `pnpm data` reads it.

import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { setDefaultAutoSelectFamilyAttemptTimeout } from "node:net";
import { join } from "node:path";
import process from "node:process";

import { RECORDS } from "../src/data/manifest.data.ts";
import { readManifest, recordFile, ROOT, sha256, SOURCES_DIR, USER_AGENT, writeManifest } from "./sources.ts";
import { WIKIDATA_TAGS } from "./tag-config.ts";

const SPARQL = "https://query.wikidata.org/sparql";
const WIKIDATA_API = "https://www.wikidata.org/w/api.php";
const COMMONS_API = "https://commons.wikimedia.org/w/api.php";
const AGENT = process.env.HATA_USER_AGENT ?? USER_AGENT;
// Where one of a host's addresses cannot be reached (IPv6 on some networks), give the other time to connect.
setDefaultAutoSelectFamilyAttemptTimeout(20000);
// Seconds between two calls of the Wikidata or the Commons API: they answer 429 to a caller that asks faster.
const API_PAUSE = 6;
const pause = (seconds: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, seconds * 1000));
const chunks = <T>(list: readonly T[], size: number): T[][] => Array.from({ length: Math.ceil(list.length / size) }, (_, at) => list.slice(at * size, at * size + size));
const id = (uri: string): string => uri.slice(uri.lastIndexOf("/") + 1);

// Every answer is kept on disk for the day (node_modules/.cache, not in the repository), so that a run that stops
// half way does not ask again for what it has. `wait` is how long to pause before a request that is really sent.
const CACHE = join(ROOT, "node_modules", ".cache", "hata-flag-tags", new Date().toISOString().slice(0, 10));
mkdirSync(CACHE, { recursive: true });
let sparqlAt = 0;
const ask = async (url: string, body: URLSearchParams, wait: number): Promise<unknown> => {
  const kept = join(CACHE, `${sha256(`${url}\n${body.toString()}`)}.json`);
  if (existsSync(kept)) return JSON.parse(readFileSync(kept, "utf8"));
  if (url === SPARQL) {
    // The query service asks for no more than a request a minute.
    const left = sparqlAt + 65_000 - Date.now();
    if (left > 0) {
      console.log(`waiting ${Math.ceil(left / 1000)} seconds before the next query, as the query service asks`);
      await pause(left / 1000);
    }
    sparqlAt = Date.now();
  } else await pause(wait);
  const response = await fetch(url, { method: "POST", headers: { accept: "application/json", "user-agent": AGENT, "content-type": "application/x-www-form-urlencoded" }, body });
  if (!response.ok) throw new Error(`${url} answered ${response.status}: ${(await response.text()).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").slice(0, 300)}`);
  const answer: unknown = await response.json();
  writeFileSync(kept, JSON.stringify(answer));

  return answer;
};
interface Bindings {
  results: { bindings: Record<string, { value: string } | undefined>[] };
}
const sparql = async (query: string): Promise<Bindings["results"]["bindings"]> => ((await ask(SPARQL, new URLSearchParams({ query, format: "json" }), 0)) as Bindings).results.bindings;

// 1. What each flag's item depicts.
const places = [...new Set(RECORDS.map((record) => record.wikidata))].sort((a, b) => Number(a.slice(1)) - Number(b.slice(1)));
const depictsQuery = `SELECT ?place ?flag ?thing ?thingLabel WHERE {
  VALUES ?place { ${places.map((place) => `wd:${place}`).join(" ")} }
  ?place wdt:P163 ?flag .
  OPTIONAL { ?flag wdt:P180 ?thing . OPTIONAL { ?thing rdfs:label ?thingLabel . FILTER(LANG(?thingLabel) = "en") } }
}`;
const flags: Record<string, { flag: string; depicts: [id: string, label: string][] }[]> = {};
for (const row of await sparql(depictsQuery)) {
  const place = id(row.place!.value);
  const flag = id(row.flag!.value);
  const list = (flags[place] ??= []);
  const found = list.find((one) => one.flag === flag) ?? list[list.push({ flag, depicts: [] }) - 1]!;
  if (row.thing !== undefined && !found.depicts.some(([thing]) => thing === id(row.thing!.value))) found.depicts.push([id(row.thing.value), row.thingLabel?.value ?? ""]);
}
for (const list of Object.values(flags)) {
  list.sort((a, b) => Number(a.flag.slice(1)) - Number(b.flag.slice(1)));
  for (const one of list) one.depicts.sort(([a], [b]) => Number(a.slice(1)) - Number(b.slice(1)));
}
console.log(`Wikidata: ${Object.keys(flags).length} of ${places.length} places have a flag item, ${Object.values(flags).filter((list) => list.some((one) => one.depicts.length > 0)).length} with something depicted`);

// 2. Which of the named items each depicted thing is, or is a kind of.
const things = [...new Set(Object.values(flags).flatMap((list) => list.flatMap((one) => one.depicts.map(([thing]) => thing))))].sort((a, b) => Number(a.slice(1)) - Number(b.slice(1)));
const named = Object.keys(WIKIDATA_TAGS).sort((a, b) => Number(a.slice(1)) - Number(b.slice(1)));
// Walked upwards from each thing (the hint), never downwards from a kind: every animal is a long list.
const kindsQuery = `SELECT ?thing ?kind WHERE {
  VALUES ?thing { ${things.map((thing) => `wd:${thing}`).join(" ")} }
  ?thing (wdt:P31|wdt:P279|wdt:P171)* ?kind .
  hint:Prior hint:gearing "forward" .
  FILTER(?kind IN (${named.map((kind) => `wd:${kind}`).join(", ")}))
}`;
const kinds: Record<string, string[]> = {};
for (const row of await sparql(kindsQuery)) (kinds[id(row.thing!.value)] ??= []).push(id(row.kind!.value));
for (const list of Object.values(kinds)) list.sort((a, b) => Number(a.slice(1)) - Number(b.slice(1)));
console.log(`Wikidata: ${Object.keys(kinds).length} of ${things.length} things depicted are of a named kind`);

// 3. The labels of the named items.
const labels: Record<string, string> = {};
for (const part of chunks(named, 50)) {
  const answer = (await ask(WIKIDATA_API, new URLSearchParams({ action: "wbgetentities", ids: part.join("|"), props: "labels", languages: "en", format: "json" }), API_PAUSE)) as { entities: Record<string, { labels?: { en?: { value: string } } }> };
  for (const [item, entity] of Object.entries(answer.entities)) labels[item] = entity.labels?.en?.value ?? "";
}

// 4. The categories of each file a flag or a variant is drawn from.
const files = [...new Set(RECORDS.flatMap((record) => [record.source === "commons" ? record.file : record.reference!.file, ...record.variants.map((variant) => variant.drawing.file)]))].sort();
const categories: Record<string, string[]> = {};
for (const part of chunks(files, 50)) {
  let more: Record<string, string> | undefined = {};
  while (more !== undefined) {
    const answer = (await ask(COMMONS_API, new URLSearchParams({ action: "query", prop: "categories", clshow: "!hidden", cllimit: "max", titles: part.map((file) => `File:${file}`).join("|"), format: "json", formatversion: "2", ...more }), API_PAUSE)) as {
      continue?: Record<string, string>;
      query: { normalized?: { from: string; to: string }[]; pages: { title: string; missing?: boolean; categories?: { title: string }[] }[] };
    };
    const asked = new Map((answer.query.normalized ?? []).map((one) => [one.to, one.from]));
    for (const page of answer.query.pages) {
      const file = (asked.get(page.title) ?? page.title).replace(/^File:/, "");
      if (page.missing) throw new Error(`Commons has no ${page.title}`);
      (categories[file] ??= []).push(...(page.categories ?? []).map((category) => category.title.replace(/^Category:/, "")));
    }
    more = answer.continue;
  }
}
for (const file of files) categories[file] = [...new Set(categories[file] ?? [])].sort();
console.log(`Commons: the categories of ${files.length} files`);

const read = new Date().toISOString().slice(0, 10);
const snapshot = {
  read,
  wikidata: { endpoint: SPARQL, depictsQuery, kindsQuery, flags: Object.fromEntries(places.filter((place) => flags[place] !== undefined).map((place) => [place, flags[place]])), kinds: Object.fromEntries(things.filter((thing) => kinds[thing] !== undefined).map((thing) => [thing, kinds[thing]])), labels: Object.fromEntries(named.map((item) => [item, labels[item] ?? ""])) },
  commons: { endpoint: COMMONS_API, categories: Object.fromEntries(files.map((file) => [file, categories[file]])) },
};
const text = `${JSON.stringify(snapshot, null, 1)}\n`;
const name = `flag-tags-${read}.json`;
writeFileSync(join(SOURCES_DIR, name), text);
for (const old of readdirSync(SOURCES_DIR).filter((file) => /^flag-tags-\d{4}-\d{2}-\d{2}\.json$/.test(file) && file !== name)) rmSync(join(SOURCES_DIR, old));
const manifest = readManifest();
writeManifest(recordFile({ files: manifest.files.filter((file) => !/^flag-tags-\d{4}-\d{2}-\d{2}\.json$/.test(file.path)) }, { path: name, url: `${SPARQL} and ${COMMONS_API}`, read, sha256: sha256(text), note: "Wikidata (CC0), what each flag's item depicts (P180) and of which named kinds those things are; Wikimedia Commons, the categories of each flag's file (facts about the files)" }));
console.log(`wrote data-sources/${name}`);
