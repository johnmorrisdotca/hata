// Makes src/organisations.commons.data.ts: the organisations' flags that are Wikimedia Commons files (scripts/organisations-files.ts, fetched by
// scripts/fetch-organisations.ts), each read from the snapshot, its licence checked (public domain and CC0 only), optimised as a country's flag is, and kept
// with its file, page, licence and author and with what the body's own page said about terms. Never a body whose own terms or law restrict its flag or emblem.
//
//   pnpm draw:organisations
import { readFileSync, writeFileSync } from "node:fs";
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

const text = (): string =>
  `// Made by scripts/draw-organisations.ts (pnpm draw:organisations): do not edit by hand. The organisations' flags taken from Wikimedia Commons (public domain and CC0 only), each optimised and kept with its file, page, licence and author and with what the body's own page said about terms on the day it was read.\nimport type { OrganisationRecord } from "./organisations.data";\n\nconst ORGANISATIONS_FROM_COMMONS: readonly OrganisationRecord[] = [\n${make().map((one) => `  ${JSON.stringify(one)},`).join("\n")}\n];\n\nexport { ORGANISATIONS_FROM_COMMONS };\n`;

const noticeBlock = (): string =>
  `<!-- organisations-files:start -->\n| Id | Body | What its page said on ${READ} | Page read | Commons file | Licence | Author as Commons gives it | File page |\n| --- | --- | --- | --- | --- | --- | --- | --- |\n${make().map((one) => `| \`${one.id}\` | ${one.name.en} | ${one.terms.says.replace(/\|/g, "/")} | ${one.terms.url} | ${one.source.file} | ${one.source.licence} | ${one.source.author.replace(/\|/g, "/")} | ${one.source.page} |`).join("\n")}\n<!-- organisations-files:end -->`;
const noticeText = (current: string): string => current.replace(/<!-- organisations-files:start -->[\s\S]*?<!-- organisations-files:end -->/, noticeBlock());

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  writeFileSync(fileURLToPath(new URL("../src/organisations.commons.data.ts", import.meta.url)), text());
  const notice = fileURLToPath(new URL("../NOTICE.md", import.meta.url));
  writeFileSync(notice, noticeText(readFileSync(notice, "utf8")));
  console.log(`wrote src/organisations.commons.data.ts: ${make().length} flags`);
}

export { noticeText as organisationsNoticeText, text as organisationsCommonsText };
