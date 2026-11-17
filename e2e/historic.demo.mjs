// The Historic flags page: every country and former country with all of its flags in date order, made from the manifest
// when the site is built. The page must list every variant the package holds, each with its years, status and source,
// in English and in Japanese, and its filters narrow it without a long page of folds.
import { pathToFileURL } from "node:url";
import { join } from "node:path";

import { expect, test } from "@playwright/test";

import { at, noSidewaysScroll, serve } from "./demo.mjs";

const { MANIFEST } = await import(pathToFileURL(join(import.meta.dirname, "..", "dist", "manifest.js")).href);
// A country is two letters; a former country has its years. Each is a row, and a flag in it is a variant, or its one flag.
const ROWS = MANIFEST.filter((record) => record.code.length === 2 || record.historical !== undefined);
const FLAGS = ROWS.flatMap((record) => (record.variants.length === 0 ? [{ code: record.code, id: "", source: record.page }] : record.variants.map((variant) => ({ code: record.code, id: variant.id, source: variant.source, status: variant.status, from: variant.from, until: variant.until }))));

async function open(page, query = "") {
  const errors = [];
  page.on("pageerror", (error) => errors.push(String(error)));
  page.on("console", (message) => message.type() === "error" && errors.push(message.text()));
  await serve(page);
  await page.goto(`https://hata.test/historic.html${query}`);
  await page.waitForSelector('main[data-ready="true"]');
  return errors;
}

test("lists every country and every one of its flags, from the manifest", async ({ page }) => {
  const errors = await open(page, "?lang=en");
  await expect(page.locator(at("historic-country"))).toHaveCount(ROWS.length);
  await expect(page.locator(at("historic-flag"))).toHaveCount(FLAGS.length);
  // Exactly the manifest's flags: no variant missing, none made up.
  const listed = await page.locator(at("historic-flag")).evaluateAll((items) => items.map((item) => `${item.dataset.code}|${item.dataset.id}`));
  expect(listed.sort()).toEqual(FLAGS.map((flag) => `${flag.code}|${flag.id}`).sort());
  await expect(page.locator(at("count"))).toHaveText(`${ROWS.length} countries, ${FLAGS.length} flags`);
  // Each flag has its years or its status, and a source that is the page the manifest names.
  const sources = await page.locator(at("historic-flag")).evaluateAll((items) => items.map((item) => [item.dataset.code, item.dataset.id, item.querySelector("a").getAttribute("href"), item.querySelector(".status").textContent]));
  for (const [code, id, href, status] of sources) {
    const expected = FLAGS.find((flag) => flag.code === code && flag.id === id);
    expect(href, `${code} ${id}`).toBe(expected.source);
    expect(status.length, `${code} ${id}`).toBeGreaterThan(0);
  }
  expect(errors).toEqual([]);
});

test("shows a country's flags oldest first, each with its years, status and kind of source", async ({ page }) => {
  await open(page, "?lang=en&q=Canada");
  const canada = page.locator(`${at("historic-country")}[data-code="CA"]`);
  await expect(canada).toBeVisible();
  const flags = canada.locator(at("historic-flag"));
  await expect(flags).toHaveCount(4);
  await expect(flags.locator(".years")).toHaveText(["1868 to 1922-04-26", "1922-04-26 to 1957-10-08", "1957-10-08 to 1965-02-15", "since 1965-02-15"]);
  await expect(flags.locator(".status")).toHaveText(["historical", "historical", "historical", "official"]);
  await expect(flags.nth(3).locator("img")).toHaveAttribute("src", "dist/svg/ca.svg");
  await expect(flags.nth(2).locator("img")).toHaveAttribute("src", "dist/svg/ca--red-ensign-1957.svg");
  await expect(flags.nth(0).locator(at("historic-source"))).toHaveText("Wikipedia only");
  await expect(flags.nth(3).locator(at("historic-source"))).toHaveText("official source");
  // A country with one flag is one row with its picture, and the Commons file as its source.
  await page.locator(at("search")).fill("Angola");
  await expect(page.locator(at("historic-flag"))).toHaveCount(1);
  await expect(page.locator(at("historic-flag")).locator(".years")).toHaveText("Today's flag");
  await expect(page.locator(at("historic-source"))).toHaveText("Commons file");
});

test("lists the former countries, with their years", async ({ page }) => {
  await open(page, "?lang=en");
  await page.locator(at("show")).selectOption("former");
  await expect(page.locator(at("historic-country"))).toHaveCount(ROWS.filter((record) => record.historical !== undefined).length);
  const soviet = page.locator(`${at("historic-country")}[data-code="SUHH"]`);
  await expect(soviet).toContainText("former country, 1922 to 1991");
  await expect(soviet.locator(at("historic-flag"))).toHaveCount(2);
  await expect(soviet.locator(".years")).toHaveText(["1936-12-05 to 1955-08-19", "1955-08-19 to 1991-12-25"]);
});

test("narrows by what changed since 1900 and by continent, and searches names, codes and flags' names", async ({ page }) => {
  await open(page, "?lang=en");
  await page.locator(at("show")).selectOption("changed");
  const changed = ROWS.filter((record) => record.historical === undefined && record.variants.some((variant) => variant.until !== null || variant.status === "historical"));
  await expect(page.locator(at("historic-country"))).toHaveCount(changed.length + ROWS.filter((record) => record.historical !== undefined && record.variants.some((variant) => variant.until !== null || variant.status === "historical")).length);
  await expect(page.locator(`${at("historic-country")}[data-code="US"]`)).toHaveCount(1);
  await expect(page.locator(`${at("historic-country")}[data-code="AO"]`)).toHaveCount(0);
  await page.locator(at("continent")).selectOption("EU");
  await expect(page.locator(`${at("historic-country")}[data-code="US"]`)).toHaveCount(0);
  await expect(page.locator(`${at("historic-country")}[data-code="DE"]`)).toHaveCount(1);
  await page.locator(at("continent")).selectOption("");
  await page.locator(at("show")).selectOption("all");
  await page.locator(at("search")).fill("red ensign");
  await expect(page.locator(at("historic-country"))).toHaveCount(1);
  await expect(page.locator(`${at("historic-country")}[data-code="CA"]`)).toHaveCount(1);
  await page.locator(at("search")).fill("weimar");
  await expect(page.locator(at("historic-country"))).toHaveCount(1);
  await expect(page.locator(`${at("historic-country")}[data-code="DE"]`)).toHaveCount(1);
  await page.locator(at("search")).fill("jp");
  await expect(page.locator(`${at("historic-country")}[data-code="JP"]`)).toHaveCount(1);
  await page.locator(at("search")).fill("zzzz");
  await expect(page.locator(at("empty"))).toBeVisible();
  await expect(page.locator(at("historic-country"))).toHaveCount(0);
});

test("is the same page in Japanese, with the same flags, and has no folds", async ({ page }) => {
  const errors = await open(page, "?lang=ja");
  await expect(page.locator("html")).toHaveAttribute("lang", "ja");
  await expect(page.locator(at("historic-flag"))).toHaveCount(FLAGS.length);
  await expect(page.locator(at("count"))).toHaveText(`${ROWS.length}か国、旗${FLAGS.length}枚`);
  await page.locator(at("search")).fill("カナダ");
  const canada = page.locator(`${at("historic-country")}[data-code="CA"]`);
  await expect(canada.locator(".years").first()).toHaveText("1868から1922-04-26まで");
  await expect(canada.locator(".status").first()).toHaveText("かつての旗");
  await expect(page.locator("details")).toHaveCount(0);
  expect(errors).toEqual([]);
});

test("fits a phone without sideways scrolling, and the docs and gallery link to it", async ({ page }) => {
  await open(page, "?lang=en");
  await noSidewaysScroll(page);
  await serve(page);
  await page.goto("https://hata.test/?lang=en");
  await page.waitForSelector('main[data-ready="true"]');
  await expect(page.locator(at("historic-link"))).toHaveAttribute("href", "historic.html");
  await page.locator(at("historic-link")).click();
  await expect(page.locator(at("historic-country")).first()).toBeVisible();
});
