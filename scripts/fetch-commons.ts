// Fetches from Wikimedia Commons the file chosen as each place's flag (scripts/select.ts, from the Wikidata
// snapshot), with what Commons says about it, and keeps both in the repository so that scripts/build-data.ts never
// touches the network:
//
//   - data-sources/commons-<day>.json: for each file, its page, its address, its size and Commons' SHA-1, the
//     time its current version was uploaded, the licence and author fields of its extended metadata, and the
//     licence templates on its page (PD-…, Cc-…, Insignia and the rest), with the SHA-256 of the file kept;
//   - data-sources/commons/<file name>: the file itself, as Commons serves it.
//
//   pnpm data:commons
//
// Polite by design: the metadata is asked for fifty files a request, the files are downloaded one at a time with
// a pause between them, every request names this project in its User-Agent, and a file already here with the
// right SHA-1 is not downloaded again. The codes are Kuni's: every country, and the first level of the countries
// in SUBDIVISION_COUNTRIES.

import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { COUNTRY_CODES } from "@johnmorrisdotca/kuni";
import { subdivisions } from "@johnmorrisdotca/kuni/subdivisions";

import { SUBDIVISION_COUNTRIES } from "./data-config.ts";
import { select } from "./select.ts";
import type { WikidataSnapshot } from "./select.ts";
import { readManifest, readSource, recordFile, sha256, SOURCES_DIR, USER_AGENT, writeManifest } from "./sources.ts";

const API = "https://commons.wikimedia.org/w/api.php";
const FILES_DIR = join(SOURCES_DIR, "commons");
const PAUSE_MS = 1000;

// A request, tried again after a pause when Commons says it is busy (429 or 5xx), honouring its Retry-After.
const politeFetch = async (url: string): Promise<Response> => {
  for (let attempt = 1; ; attempt += 1) {
    const response = await fetch(url, { headers: { "user-agent": USER_AGENT } });
    if (response.ok || (response.status !== 429 && response.status < 500) || attempt === 6) return response;
    const wait = Math.max(Number(response.headers.get("retry-after") ?? 0) * 1000, 5000 * attempt);
    console.log(`  Commons answered ${response.status}; waiting ${Math.round(wait / 1000)} s`);
    await response.arrayBuffer();
    await pause(wait);
  }
};

// The extended metadata fields kept: what Commons says about the licence, the author and the restrictions.
const FIELDS = ["LicenseShortName", "License", "LicenseUrl", "UsageTerms", "Copyrighted", "AttributionRequired", "Attribution", "Artist", "Credit", "Restrictions", "DateTime"];

// Templates whose name says something about the licence or the restrictions on the picture.
const LICENCE_TEMPLATE = /^Template:(PD-|Cc-|CC-|Cc0|CC0|GFDL|Self|Insignia|Copyright|Trademark|Attribution|FAL|OGL|Fair|Non-free|Coat of arms|Flag|Licen[cs]e|Pd|PD|Public domain|Free|Copyrighted|Ineligible)/i;

interface CommonsFile {
  file: string; // The name, without "File:"
  page: string; // Its description page on Commons
  url: string; // The address the file was downloaded from
  bytes: number;
  width: number;
  height: number;
  mime: string;
  uploaded: string; // When the current version was uploaded
  sha1: string; // Commons' own
  sha256: string; // Of the file downloaded
  stored: string; // Its path under data-sources/
  metadata: Record<string, string>;
  templates: string[];
}

const pause = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));
const storedName = (file: string): string => file.replace(/ /g, "_").replace(/[\\/:*?"<>|]/g, "-");
const plain = (html: string): string =>
  html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();

interface Page {
  title: string;
  missing?: boolean;
  imageinfo?: { url: string; descriptionurl: string; size: number; width: number; height: number; mime: string; sha1: string; timestamp: string; extmetadata?: Record<string, { value: string }> }[];
  templates?: { title: string }[];
}

// One metadata request for up to fifty titles, following "continue" until every page's templates are in.
const ask = async (titles: string[]): Promise<Map<string, Page>> => {
  const pages = new Map<string, Page>();
  let next: Record<string, string> = {};
  for (;;) {
    const query = new URLSearchParams({
      action: "query",
      format: "json",
      formatversion: "2",
      prop: "imageinfo|templates",
      iiprop: "url|size|sha1|mime|timestamp|extmetadata",
      iiextmetadatalanguage: "en",
      iiextmetadatafilter: FIELDS.join("|"),
      tlnamespace: "10",
      tllimit: "max",
      titles: titles.map((title) => `File:${title}`).join("|"),
      ...next,
    });
    const response = await politeFetch(`${API}?${query}`);
    if (!response.ok) throw new Error(`Commons answered ${response.status}`);
    const body = (await response.json()) as { query: { pages: Page[]; normalized?: { from: string; to: string }[] }; continue?: Record<string, string> };
    for (const page of body.query.pages) {
      const name = page.title.replace(/^File:/, "");
      const had = pages.get(name);
      pages.set(name, { ...page, ...(had?.imageinfo ? { imageinfo: had.imageinfo } : {}), templates: [...(had?.templates ?? []), ...(page.templates ?? [])] });
    }
    if (body.continue === undefined) break;
    next = body.continue;
    await pause(PAUSE_MS);
  }

  return pages;
};

const manifest = readManifest();
const wikidataEntry = manifest.files.find((file) => /^wikidata-\d{4}-\d{2}-\d{2}\.json$/.test(file.path));
if (wikidataEntry === undefined) throw new Error("no Wikidata snapshot in sources.json: run pnpm data:wikidata first");
const snapshot = JSON.parse(readSource(manifest, wikidataEntry.path).text) as WikidataSnapshot;

const codes = [...COUNTRY_CODES.map((code) => ({ code: code as string, set: "countries" as const })), ...SUBDIVISION_COUNTRIES.flatMap((country) => (subdivisions(country) ?? []).map((one) => ({ code: one.code, set: "subdivisions" as const })))];
const wanted = [...new Set(codes.map(({ code, set }) => select(code, snapshot[set][code]).file).filter((file): file is string => file !== null))].sort();
console.log(`${codes.length} codes, ${wanted.length} distinct files to fetch`);

const read = new Date().toISOString().slice(0, 10);
const files: CommonsFile[] = [];
mkdirSync(FILES_DIR, { recursive: true });
for (let at = 0; at < wanted.length; at += 50) {
  const batch = wanted.slice(at, at + 50);
  const pages = await ask(batch);
  for (const file of batch) {
    const page = pages.get(file);
    const info = page?.imageinfo?.[0];
    if (page === undefined || page.missing || info === undefined) throw new Error(`Commons has no file "${file}"`);
    const metadata: Record<string, string> = {};
    for (const field of FIELDS) {
      const value = info.extmetadata?.[field]?.value;
      if (value !== undefined) metadata[field] = plain(String(value));
    }
    const stored = `commons/${storedName(file)}`;
    const path = join(SOURCES_DIR, stored);
    let bytes: Buffer | null = existsSync(path) ? readFileSync(path) : null;
    if (bytes === null || createHash("sha1").update(bytes).digest("hex") !== info.sha1) {
      await pause(PAUSE_MS);
      const response = await politeFetch(info.url);
      if (!response.ok) throw new Error(`${info.url} answered ${response.status}`);
      bytes = Buffer.from(await response.arrayBuffer());
      const sha1 = createHash("sha1").update(bytes).digest("hex");
      if (sha1 !== info.sha1) throw new Error(`${file}: downloaded SHA-1 ${sha1}, Commons says ${info.sha1}`);
      writeFileSync(path, bytes);
      console.log(`  ${file} ${Math.round(bytes.length / 1024)} KB`);
    }
    files.push({
      file,
      page: info.descriptionurl,
      url: info.url.replace(/\?.*$/, ""),
      bytes: info.size,
      width: info.width,
      height: info.height,
      mime: info.mime,
      uploaded: info.timestamp,
      sha1: info.sha1,
      sha256: sha256(bytes),
      stored,
      metadata,
      templates: [...new Set((page.templates ?? []).map((one) => one.title))].filter((title) => LICENCE_TEMPLATE.test(title)).sort(),
    });
  }
  console.log(`metadata ${Math.min(at + 50, wanted.length)} of ${wanted.length}`);
  await pause(PAUSE_MS);
}

// Files no longer chosen are removed, so data-sources/commons holds exactly what the build reads.
const keep = new Set(files.map((one) => one.stored.slice("commons/".length)));
for (const old of readdirSync(FILES_DIR)) if (!keep.has(old)) rmSync(join(FILES_DIR, old));

const name = `commons-${read}.json`;
const text = `{
  "source": ${JSON.stringify(API)},
  "read": ${JSON.stringify(read)},
  "note": "What Wikimedia Commons says about each file chosen as a flag, and the SHA-256 of the copy in data-sources/commons/. Each file's licence is its own: see its metadata and templates.",
  "files": [
${files.map((one) => `    ${JSON.stringify(one)}`).join(",\n")}
  ]
}
`;
for (const old of readdirSync(SOURCES_DIR).filter((file) => /^commons-\d{4}-\d{2}-\d{2}\.json$/.test(file) && file !== name)) rmSync(join(SOURCES_DIR, old));
writeFileSync(join(SOURCES_DIR, name), text);
const updated = readManifest();
updated.files = updated.files.filter((file) => !/^commons-\d{4}-\d{2}-\d{2}\.json$/.test(file.path));
writeManifest(
  recordFile(updated, {
    path: name,
    url: API,
    read,
    sha256: sha256(text),
    note: "Wikimedia Commons, the description, licence and author of every chosen flag file, and the SHA-256 of each file kept in commons/ (each file under its own licence)",
  }),
);
console.log(`wrote data-sources/${name} and ${files.length} files in data-sources/commons/`);
