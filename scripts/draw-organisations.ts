// Makes src/organisations.commons.data.ts: the organisations' flags that are Wikimedia Commons files (scripts/organisations-files.ts, fetched by
// scripts/fetch-organisations.ts), each read from the snapshot, its licence checked (public domain and CC0 only), optimised as a country's flag is, and kept
// with its file, page, licence and author and with what the body's own page said about terms. Never a body whose own terms or law restrict its flag or emblem.
//
//   pnpm draw:organisations
import { readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { classify } from "./licence.ts";
import { ORGANISATION_FILES, READ } from "./organisations-files.ts";
import { optimiseFlag } from "./optimise.ts";
import { readManifest, readSource, ROOT } from "./sources.ts";

interface Made {
  id: string;
  name: { en: string; ja: string };
  svg: string;
  terms: { url: string; read: string; says: string };
  source: { file: string; page: string; licence: string; author: string };
}

const make = (): Made[] => {
  const manifest = readManifest();
  const entry = manifest.files.find((one) => /^organisations-commons-\d{4}-\d{2}-\d{2}\.json$/.test(one.path));
  if (entry === undefined) throw new Error("no organisations Commons snapshot: run pnpm data:organisations");
  const snapshot = JSON.parse(readSource(manifest, entry.path).text) as { files: { file: string; page: string; stored: string; metadata: Record<string, string>; templates: string[] }[] };
  const made: Made[] = [];
  for (const one of ORGANISATION_FILES) {
    const found = snapshot.files.find((file) => file.file === one.file);
    if (found === undefined) throw new Error(`${one.file} is not in the snapshot: run pnpm data:organisations`);
    const licence = classify(found.metadata, found.templates);
    if (!licence.shipped || (licence.kind !== "public-domain" && licence.kind !== "cc0")) throw new Error(`${one.file}: licence ${licence.name} does not ship`);
    const svg = optimiseFlag(readFileSync(`${ROOT}/data-sources/${found.stored}`, "utf8"), `org-${one.slug}`).svg.replace(/hata-org-/g, "org-").replace(/^<svg /, `<svg data-hata-org="${one.slug}" `);
    if (/<image\b|<style\b|base64/i.test(svg)) throw new Error(`${one.file} is not a plain vector`);
    const artist = (found.metadata.Artist ?? "").trim();
    made.push({ id: `org:${one.slug}`, name: one.name, svg, terms: { url: one.terms.url, read: READ, says: one.terms.says }, source: { file: one.file, page: found.page, licence: licence.name, author: artist === "" ? "an author the file's page does not name" : artist } });
  }

  return made;
};

const aspectOf = (drawing: string): number => {
  const box = /viewBox="(-?[\d.]+) (-?[\d.]+) ([\d.]+) ([\d.]+)"/.exec(drawing);

  return box === null ? 1 : Number(box[3]) / Number(box[4]);
};
const slugOf = (id: string): string => id.slice(4);

// The files: the records without their drawings and a loader for each (src/organisations.commons.data.ts), and one module for each drawing (src/sets/organisations/<slug>.ts).
const files = (): Map<string, string> => {
  const made = make();
  const out = new Map<string, string>();
  out.set(
    "../organisations.commons.data.ts",
    `// Made by scripts/draw-organisations.ts (pnpm draw:organisations): do not edit by hand. The organisations' flags taken from Wikimedia Commons (public domain and CC0 only), each with its file, page, licence and author and with what the body's own page said about terms on the day it was read. The drawings are modules of their own (sets/organisations/<slug>.ts).\nimport type { DrawnLoader } from "./drawn";\nimport type { OrganisationRecord } from "./organisations.data";\n\nconst ORGANISATIONS_FROM_COMMONS: readonly OrganisationRecord[] = [\n${made.map(({ svg, ...record }) => `  ${JSON.stringify({ ...record, aspect: aspectOf(svg) })},`).join("\n")}\n];\n\nconst ORGANISATIONS_FROM_COMMONS_LOADERS: Readonly<Record<string, DrawnLoader>> = {\n${made.map((one) => `  ${JSON.stringify(one.id)}: () => import("./sets/organisations/${slugOf(one.id)}"),`).join("\n")}\n};\n\nexport { ORGANISATIONS_FROM_COMMONS, ORGANISATIONS_FROM_COMMONS_LOADERS };\n`,
  );
  for (const one of made) out.set(`organisations/${slugOf(one.id)}.ts`, `// Made by scripts/draw-organisations.ts: do not edit by hand. The drawing of ${one.id}.\n\n/** ${one.name.en}, as an SVG string: ${one.svg.length} B. Loaded by the entry when it is asked for. */\nconst svg = ${JSON.stringify(one.svg)};\n\nexport { svg };\nexport default svg;\n`);

  return out;
};

const noticeBlock = (): string =>
  `<!-- organisations-files:start -->\n| Id | Body | What its page said on ${READ} | Page read | Commons file | Licence | Author as Commons gives it | File page |\n| --- | --- | --- | --- | --- | --- | --- | --- |\n${make().map((one) => `| \`${one.id}\` | ${one.name.en} | ${one.terms.says.replace(/\|/g, "/")} | ${one.terms.url} | ${one.source.file} | ${one.source.licence} | ${one.source.author.replace(/\|/g, "/")} | ${one.source.page} |`).join("\n")}\n<!-- organisations-files:end -->`;
const noticeText = (current: string): string => current.replace(/<!-- organisations-files:start -->[\s\S]*?<!-- organisations-files:end -->/, noticeBlock());

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const root = fileURLToPath(new URL("../src/sets", import.meta.url));
  const all = files();
  for (const old of readdirSync(join(root, "organisations"))) if (old !== "eu.ts" && !all.has(`organisations/${old}`)) rmSync(join(root, "organisations", old));
  for (const [path, text] of all) writeFileSync(join(root, path), text);
  const notice = fileURLToPath(new URL("../NOTICE.md", import.meta.url));
  writeFileSync(notice, noticeText(readFileSync(notice, "utf8")));
  console.log(`wrote src/organisations.commons.data.ts: ${make().length} flags`);
}

export { noticeText as organisationsNoticeText, files as organisationsFiles };
