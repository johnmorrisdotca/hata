// Fetches from Wikimedia Commons the files of scripts/medieval-files.ts, with what Commons says about each (licence, author, the licence
// templates on its page), and keeps both in the repository so that scripts/draw-medieval.ts never touches the network:
//
//   pnpm data:medieval
//
//   - data-sources/medieval-commons-<day>.json: for each file its page, address, size, Commons' SHA-1, the SHA-256 of the copy kept, the licence
//     and author fields and the licence templates;
//   - data-sources/medieval/<file name>: the file itself, as Commons serves it.
//
// Polite as scripts/fetch-commons.ts is: fifty files to a metadata request, the files one at a time with a pause, this project named in every
// request's User-Agent. It uses the Commons API only; it asks Wikidata for nothing.
import { createHash } from "node:crypto";
import { mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { MEDIEVAL_FILES } from "./medieval-files.ts";
import { readManifest, recordFile, sha256, SOURCES_DIR, USER_AGENT, writeManifest } from "./sources.ts";

const API = "https://commons.wikimedia.org/w/api.php";
const FILES_DIR = join(SOURCES_DIR, "medieval");
const FIELDS = ["LicenseShortName", "License", "LicenseUrl", "UsageTerms", "Copyrighted", "Attribution", "Artist", "Credit", "Restrictions", "DateTime"];
const pause = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));
const storedName = (file: string): string => file.replace(/ /g, "_").replace(/[\\/:*?"<>|]/g, "-");
const plain = (html: string): string => html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#0?39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/\s+/g, " ").trim();

interface Page {
  title: string;
  missing?: boolean;
  imageinfo?: { url: string; descriptionurl: string; size: number; width: number; height: number; mime: string; sha1: string; timestamp: string; extmetadata?: Record<string, { value: string }> }[];
  templates?: { title: string }[];
}
const get = async (url: string): Promise<Response> => {
  for (let attempt = 1; ; attempt += 1) {
    const response = await fetch(url, { headers: { "user-agent": USER_AGENT } });
    if (response.ok || (response.status !== 429 && response.status < 500) || attempt === 6) return response;
    await response.arrayBuffer();
    await pause(Math.max(Number(response.headers.get("retry-after") ?? 0) * 1000, 5000 * attempt));
  }
};

const pages = new Map<string, Page>();
const wanted = MEDIEVAL_FILES.map((one) => one.file);
for (let at = 0; at < wanted.length; at += 40) {
  let next: Record<string, string> = {};
  for (;;) {
    const query = new URLSearchParams({ action: "query", format: "json", formatversion: "2", prop: "imageinfo|templates", iiprop: "url|size|sha1|mime|timestamp|extmetadata", iiextmetadatalanguage: "en", iiextmetadatafilter: FIELDS.join("|"), tlnamespace: "10", tllimit: "max", titles: wanted.slice(at, at + 40).map((title) => `File:${title}`).join("|"), ...next });
    const response = await get(`${API}?${query}`);
    if (!response.ok) throw new Error(`Commons answered ${response.status}`);
    const body = (await response.json()) as { query: { pages: Page[] }; continue?: Record<string, string> };
    for (const page of body.query.pages) {
      const name = page.title.replace(/^File:/, "");
      const had = pages.get(name);
      pages.set(name, { ...page, ...(had?.imageinfo ? { imageinfo: had.imageinfo } : {}), templates: [...(had?.templates ?? []), ...(page.templates ?? [])] });
    }
    if (body.continue === undefined) break;
    next = body.continue;
    await pause(1000);
  }
  await pause(1000);
}

mkdirSync(FILES_DIR, { recursive: true });
const read = new Date().toISOString().slice(0, 10);
const files: unknown[] = [];
for (const file of wanted) {
  const page = pages.get(file.normalize("NFC")) ?? pages.get(file);
  const info = page?.imageinfo?.[0];
  if (page === undefined || page.missing === true || info === undefined) throw new Error(`${file} is not on Commons`);
  const response = await get(info.url);
  if (!response.ok) throw new Error(`${file}: ${response.status}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  if (createHash("sha1").update(bytes).digest("hex") !== info.sha1) throw new Error(`${file}: the SHA-1 is not Commons'`);
  const stored = storedName(file);
  writeFileSync(join(FILES_DIR, stored), bytes);
  const metadata: Record<string, string> = {};
  for (const [key, value] of Object.entries(info.extmetadata ?? {})) metadata[key] = key === "Artist" || key === "Credit" || key === "Attribution" ? plain(value.value) : value.value;
  files.push({ file, page: info.descriptionurl, url: info.url, bytes: info.size, width: info.width, height: info.height, mime: info.mime, uploaded: info.timestamp, sha1: info.sha1, sha256: sha256(bytes), stored: `medieval/${stored}`, metadata, templates: (page.templates ?? []).map((template) => template.title) });
  console.log(`  ${file}`);
  await pause(1000);
}
const keep = new Set(files.map((one) => (one as { stored: string }).stored.slice("medieval/".length)));
for (const old of readdirSync(FILES_DIR)) if (!keep.has(old)) rmSync(join(FILES_DIR, old));

const name = `medieval-commons-${read}.json`;
const text = `{\n  "source": ${JSON.stringify(API)},\n  "read": ${JSON.stringify(read)},\n  "note": "What Wikimedia Commons says about each medieval flag taken from it, and the SHA-256 of the copy in data-sources/medieval/. Each file's licence is its own: see its metadata and templates.",\n  "files": [\n${files.map((one) => `    ${JSON.stringify(one)}`).join(",\n")}\n  ]\n}\n`;
for (const old of readdirSync(SOURCES_DIR).filter((file) => /^medieval-commons-\d{4}-\d{2}-\d{2}\.json$/.test(file) && file !== name)) rmSync(join(SOURCES_DIR, old));
writeFileSync(join(SOURCES_DIR, name), text);
const updated = readManifest();
updated.files = updated.files.filter((file) => !/^medieval-commons-\d{4}-\d{2}-\d{2}\.json$/.test(file.path));
writeManifest(recordFile(updated, { path: name, url: API, read, sha256: sha256(text), note: "Wikimedia Commons, the description, licence and author of every medieval flag file, and the SHA-256 of each file kept in medieval/ (each file under its own licence)" }));
console.log(`wrote data-sources/${name} and ${files.length} files in data-sources/medieval/`);
