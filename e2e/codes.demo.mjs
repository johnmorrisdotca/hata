// The codes page: every code the package knows with its English and Japanese names and a link to its flag, searchable by code or
// name in either language. It is made from the package's names and manifest when the site is built, so the page must list exactly
// what the package holds, narrow by what is typed, and link to files that exist.
import { existsSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

import { expect, test } from "@playwright/test";

import { at, noSidewaysScroll, serve } from "./demo.mjs";

const dist = (file) => pathToFileURL(join(import.meta.dirname, "..", "dist", file)).href;
const { FLAG_CODES } = await import(dist("index.js"));
const { LEFT_OUT } = await import(dist("manifest.js"));
const { flagName } = await import(dist("names.js"));
const CODES = [...FLAG_CODES, ...LEFT_OUT.map((one) => one.code)];

async function open(page, query = "") {
  const errors = [];
  page.on("pageerror", (error) => errors.push(String(error)));
  page.on("console", (message) => message.type() === "error" && errors.push(message.text()));
  await serve(page);
  await page.goto(`https://hata.test/codes.html${query}`);
  await page.waitForSelector('main[data-ready="true"]');
  return errors;
}

const listed = (page) => page.locator(at("codes-row")).evaluateAll((rows) => rows.map((row) => row.dataset.code));

test("lists every code the package knows, once, with the names the package gives", async ({ page }) => {
  const errors = await open(page, "?lang=en");
  expect((await listed(page)).sort()).toEqual([...CODES].sort());
  await expect(page.locator(at("codes-count"))).toHaveText(`${CODES.length} of ${CODES.length} codes`);
  // The names are the package's own, English and Japanese, for every flag.
  const names = await page.locator(at("codes-row")).evaluateAll((rows) => rows.map((row) => [row.dataset.code, row.cells[2].firstChild.textContent, row.cells[3].textContent]));
  for (const [code, en, ja] of names.filter(([code]) => FLAG_CODES.includes(code))) {
    expect(en, code).toBe(flagName(code, "en"));
    expect(ja, code).toBe(flagName(code, "ja"));
  }
  expect(errors).toEqual([]);
});

test("links each flag to its SVG file and to the gallery, and gives a code with no flag its reason and no link", async ({ page }) => {
  await open(page, "?lang=en&q=JP-13");
  const tokyo = page.locator(`${at("codes-row")}[data-code="JP-13"]`);
  await expect(tokyo).toHaveCount(1);
  await expect(tokyo.locator(at("codes-svg"))).toHaveAttribute("href", "dist/svg/jp-13.svg");
  await expect(tokyo.locator(at("codes-gallery"))).toHaveAttribute("href", "./?q=JP-13&lang=en");
  await expect(tokyo.locator("img")).toHaveAttribute("src", "dist/svg/jp-13.svg");
  // Every linked file is one the package ships.
  for (const code of FLAG_CODES) expect(existsSync(join(import.meta.dirname, "..", "site", "dist", "svg", `${code.toLowerCase()}.svg`)), code).toBe(true);
  const none = LEFT_OUT[0];
  await page.locator(at("codes-search")).fill(none.code);
  const row = page.locator(`${at("codes-row")}[data-code="${none.code}"]`);
  await expect(row).toHaveCount(1);
  await expect(row.locator("a")).toHaveCount(0);
  await expect(row).toContainText(none.reason);
});

test("narrows by a code, an English name, a Japanese name and a kind, and says when nothing matches", async ({ page }) => {
  await open(page, "?lang=en");
  const search = page.locator(at("codes-search"));
  await search.fill("jp-13");
  await expect.poll(() => listed(page)).toEqual(["JP-13"]);
  await search.fill("Tokyo");
  await expect.poll(() => listed(page)).toContain("JP-13");
  await search.fill("東京");
  await expect.poll(() => listed(page)).toContain("JP-13");
  await search.fill("");
  await page.locator(at("codes-show")).selectOption("former");
  await expect.poll(() => listed(page)).toContain("SUHH");
  expect((await listed(page)).every((code) => !FLAG_CODES.includes(code) || code.length > 2)).toBe(true);
  await page.locator(at("codes-show")).selectOption("all");
  await search.fill("zzzz-no-such-place");
  await expect(page.locator(at("codes-empty"))).toBeVisible();
  await expect(page.locator(at("codes-row"))).toHaveCount(0);
  await expect(page.locator(at("codes-count"))).toHaveText(`0 of ${CODES.length} codes`);
});

test("speaks Japanese when asked, and fits the page without sideways scroll", async ({ page }) => {
  await open(page, "?lang=ja");
  await expect(page.locator(at("codes-count"))).toHaveText(`${CODES.length}件のうち${CODES.length}件`);
  await expect(page.locator(at("codes-show"))).toContainText("旗のないコード");
  await noSidewaysScroll(page);
});
