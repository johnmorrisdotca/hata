// Draws a contact sheet: for each place asked for, the drawing that ships, Commons' drawing (the reference), and
// every flag set's drawing of the same flag, side by side and labelled, as one PNG. For a person deciding what
// `pnpm data:choose` listed in docs/compared.md: is a difference only a layout or a shade, or another design?
//
//   pnpm data:sheet <out.png> af pm bl          these places
//   pnpm data:sheet <out.png> --compared        every place docs/compared.md lists
//
// It reads src/flags/, data-sources/ and node_modules (run `pnpm data` first) and needs Playwright's Chromium.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import process from "node:process";

import { chromium } from "@playwright/test";

import { commonsFiles } from "./compare.mjs";

const ROOT = join(import.meta.dirname, "..");
const { setCandidates } = await import(join(ROOT, "scripts", "candidates.ts"));
const { RECORDS } = await import(join(ROOT, "src", "data", "manifest.data.ts"));
const choices = JSON.parse(readFileSync(join(ROOT, "scripts", "choices.data.json"), "utf8"));
const { byFile, raw } = commonsFiles();

const [out, ...rest] = process.argv.slice(2);
if (out === undefined || !out.endsWith(".png")) {
  console.error("pnpm data:sheet <out.png> <code> … | --compared");
  process.exit(1);
}
const codes = rest.includes("--compared") ? [...readFileSync(join(ROOT, "docs", "compared.md"), "utf8").matchAll(/^\| `([A-Z-]+)` /gm)].map((match) => match[1]) : rest.map((code) => code.toUpperCase());
const escape = (text) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;");
const picture = (svg, label) => `<figure><img src="data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}"><figcaption>${escape(label)}</figcaption></figure>`;

let rows = "";
for (const code of codes) {
  const record = RECORDS.find((one) => one.code === code);
  const shipped = record ? JSON.parse(/const svg: string = (".*");/.exec(readFileSync(join(ROOT, "src", "flags", `${(record.sameAs ?? code).toLowerCase()}.ts`), "utf8"))[1]) : null;
  const reference = record ? (record.reference?.file ?? record.file) : null;
  const pictures = [];
  if (shipped) pictures.push(picture(shipped, `shipped: ${record.source}`));
  if (reference && byFile.has(reference) && record.source !== "commons") pictures.push(picture(raw(reference), "Commons"));
  for (const candidate of setCandidates(code)) pictures.push(picture(candidate.text, candidate.label));
  rows += `<section><h2>${code} <small>${escape(choices[code]?.why?.slice(0, 160) ?? "left out")}</small></h2><div>${pictures.join("")}</div></section>`;
}
const page = `<!doctype html><style>
body { margin: 0; padding: 12px; font: 13px system-ui; background: #ddd; width: 1180px; }
section { background: #fff; margin: 0 0 10px; padding: 8px; border-radius: 6px; }
h2 { margin: 0 0 6px; font-size: 15px; } small { font-weight: 400; color: #555; }
div { display: flex; gap: 10px; flex-wrap: wrap; align-items: flex-end; }
figure { margin: 0; } img { height: 90px; display: block; outline: 1px solid #aaa; } figcaption { font-size: 11px; color: #333; }
</style>${rows}`;
const browser = await chromium.launch();
const page2 = await browser.newPage({ viewport: { width: 1204, height: 800 } });
await page2.setContent(page);
await page2.evaluate(() => Promise.all([...document.images].map((image) => image.decode().catch(() => {}))));
await page2.screenshot({ path: out, fullPage: true });
await browser.close();
console.log(`wrote ${out}: ${codes.length} places`);
