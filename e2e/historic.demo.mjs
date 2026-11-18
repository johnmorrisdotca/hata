// The Historic flags page: every country and former country with all of its flags in date order, made from the manifest
// when the site is built. The page must list every variant the package holds, each with its years, status and source,
// in English and in Japanese, and its filters narrow it without a long page of folds.
import { pathToFileURL } from "node:url";
import { join } from "node:path";

import { expect, test } from "@playwright/test";

import { at, noSidewaysScroll, open as openDemo, serve, tap } from "./demo.mjs";

const { MANIFEST, RESTRICTED } = await import(pathToFileURL(join(import.meta.dirname, "..", "dist", "manifest.js")).href);
// A country is two letters; a former country has its years. Each is a row, and a flag in it is a variant, or its one flag. The restricted flag is on this page, in its place's row, and nowhere else.
const ROWS = MANIFEST.filter((record) => record.code.length === 2 || record.historical !== undefined);
const FLAGS = ROWS.flatMap((record) => (record.variants.length === 0 ? [{ code: record.code, id: "", source: record.page }] : [...record.variants, ...RESTRICTED.filter((one) => one.code === record.code).map((one) => one.variant)].map((variant) => ({ code: record.code, id: variant.id, source: variant.source, status: variant.status, from: variant.from, until: variant.until }))));

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
  // Canada's Union Flag (legal) and three Red Ensigns (flown) sit side by side in one block, then the Maple Leaf flag.
  await expect(flags).toHaveCount(5);
  const split = canada.locator(at("historic-split"));
  await expect(split).toHaveCount(1);
  await expect(split.locator(`${at("historic-split-legal")} ${at("historic-flag")}`)).toHaveCount(1);
  await expect(split.locator(`${at("historic-split-in-use")} ${at("historic-flag")}`)).toHaveCount(3);
  await expect(split.locator(`${at("historic-split-legal")} .years`)).toHaveText(["1867-07-01 → 1965-02-15"]);
  await expect(split.locator(`${at("historic-split-in-use")} .years`)).toHaveText(["1868 → 1922-04-26", "1922-04-26 → 1957-10-08", "1957-10-08 → 1965-02-15"]);
  await expect(split.locator(at("historic-reason"))).toContainText("kept the Union Flag as the national flag");
  await expect(split.locator(at("historic-reason")).locator("a")).toHaveAttribute("href", "https://www.canada.ca/en/canadian-heritage/services/flag-canada-history.html");
  await expect(split).toContainText("The legal flag and the flag in use differ");
  await expect(flags.last().locator("img")).toHaveAttribute("src", "dist/svg/ca.svg");
  await expect(flags.last().locator(".years")).toHaveText("since 1965-02-15");
  await expect(flags.last().locator(at("historic-role"))).toHaveText("Legal and in use");
  await expect(flags.nth(3).locator("img")).toHaveAttribute("src", "dist/svg/ca--red-ensign-1957.svg");
  await expect(flags.nth(0).locator(at("historic-source"))).toHaveText("official source");
  await expect(flags.nth(1).locator(at("historic-source"))).toHaveText("Wikipedia only");
  await expect(flags.last().locator(at("historic-source"))).toHaveText("official source");
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
  await expect(canada.locator(".years").first()).toHaveText("1867-07-01 → 1965-02-15");
  await expect(canada.locator(".status").first()).toHaveText("かつての旗");
  await expect(canada.locator(at("historic-split"))).toContainText("法律上の国旗と、実際に使われた旗が違う期間");
  await expect(canada.locator("h3").first()).toHaveText("法律上の国旗");
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

test("shows the legal flag and the flag in use side by side wherever they differ, each with its reason and source", async ({ page }) => {
  await open(page, "?lang=en");
  const noted = MANIFEST.filter((record) => record.variants.some((variant) => variant.roleNote !== null)).map((record) => record.code);
  expect(noted.sort()).toEqual(["AU", "CA", "NZ", "UA"]);
  await expect(page.locator(at("historic-split"))).toHaveCount(4);
  for (const code of noted) {
    const block = page.locator(`${at("historic-split")}[data-code="${code}"]`);
    await expect(block, code).toHaveCount(1);
    await expect(block.locator(at("historic-split-legal")), code).toBeVisible();
    await expect(block.locator(at("historic-split-in-use")), code).toBeVisible();
    // Each reason names a source, and the page's reasons are the manifest's.
    const reasons = MANIFEST.find((record) => record.code === code).variants.filter((variant) => variant.roleNote !== null).map((variant) => variant.roleNote.why);
    const shown = await block.locator(at("historic-reason")).allTextContents();
    expect(shown.length, code).toBe(new Set(reasons).size);
    for (const why of new Set(reasons)) expect(shown.some((text) => text.includes(why.slice(0, 60))), code).toBe(true);
  }
  // The flag with the same days in both roles has no block: it is one flag marked "Legal and in use".
  await page.locator(at("search")).fill("Angola");
  await expect(page.locator(at("historic-split"))).toHaveCount(0);
  await page.locator(at("search")).fill("Australia");
  const australia = page.locator(`${at("historic-split")}[data-code="AU"]`);
  await expect(australia.locator(`${at("historic-split-legal")} .years`)).toHaveText(["1901-01-01 → 1954-04-14", "1954-04-14 → today"]);
  await expect(australia.locator(`${at("historic-split-in-use")} .years`)).toHaveText(["1901-01-01 → 1901-09-03", "1901-09-03 → 1903-02-20", "1903-02-20 → 1908-12-19", "1908-12-19 → today"]);
  await noSidewaysScroll(page);
});

test("shows Germany's restricted flag in Germany's row, with the context note in English and in Japanese, and nowhere else on the page", async ({ page }) => {
  const errors = await open(page, "?lang=en&q=Germany");
  const germany = page.locator(`${at("historic-country")}[data-code="DE"]`);
  const shown = germany.locator(`${at("historic-flag")}[data-id="swastika-1935"]`);
  await expect(shown).toHaveCount(1);
  await expect(shown.locator(at("historic-restricted"))).toHaveText("Flag of Nazi Germany, 1935–1945. Shown for history and education. Displaying it is restricted by law in Germany and Austria outside those purposes.");
  await expect(shown.locator(".status")).toHaveText("historical, restricted");
  await expect(shown.locator(".years")).toHaveText("1935-09-17 to 1945-05-23");
  // It is drawn by the package's own call that opts in, not from the CDN listing, which has no file of it.
  await expect(shown.locator("img")).toHaveAttribute("src", /^data:image\/svg\+xml,/);
  await shown.scrollIntoViewIfNeeded();
  await expect(shown.locator("img")).toHaveJSProperty("complete", true);
  await expect(page.locator(at("historic-restricted"))).toHaveCount(1);
  expect(await page.locator("img").evaluateAll((images) => images.map((image) => image.getAttribute("src")).filter((src) => /swastika/.test(src ?? "") && !(src ?? "").startsWith("data:")))).toEqual([]);
  // The other German flags have no note.
  await expect(germany.locator(at("historic-restricted"))).toHaveCount(1);
  await page.goto("https://hata.test/historic.html?lang=ja&q=Germany");
  await page.waitForSelector('main[data-ready="true"]');
  await expect(page.locator(`${at("historic-flag")}[data-id="swastika-1935"] ${at("historic-restricted")}`)).toHaveText("ナチス・ドイツの国旗（1935～1945年）。歴史と教育のために表示しています。ドイツとオーストリアでは、これらの目的以外での掲示は法律で制限されています。");
  expect(errors).toEqual([]);
});

test("keeps the restricted flag out of the gallery, the panel's variant switch, the quiz and the CDN listing", async ({ page }, testInfo) => {
  await openDemo(page, "?lang=en&set=country");
  await expect(page.locator("body")).not.toContainText("Nazi");
  await tap(page, at("tile-DE"), testInfo);
  await expect(page.locator(at("variant-federal-bkrg"))).toHaveCount(1);
  await expect(page.locator(at("variant-swastika-1935"))).toHaveCount(0);
  // The panel's date field names the restriction instead of drawing the flag.
  await page.locator(at("variant-date")).fill("1940-06-01");
  await expect(page.locator(at("variant-date-note"))).toContainText("restricted by law in Germany and Austria");
  await expect(page.locator(at("detail-flag"))).not.toHaveAttribute("src", /swastika/);
  await page.locator(at("detail")).evaluate((dialog) => dialog.close());
  // The quiz draws its questions from the codes, which never include a variant.
  await page.goto("https://hata.test/?lang=en&tab=quiz&seed=1");
  await page.waitForSelector('main[data-ready="true"]');
  await expect(page.locator("body")).not.toContainText("Nazi");
  const status = await page.evaluate(async () => (await fetch("dist/svg/de--swastika-1935.svg")).status);
  expect(status).toBe(404);
});

test("says why each dated flag is there, and why a former country has the flag it has, in English and in Japanese", async ({ page }) => {
  await open(page, "?lang=en&q=Japan");
  const japan = page.locator(`${at("historic-country")}[data-code="JP"]`);
  await expect(japan.locator(at("historic-why"))).toHaveCount(2);
  await expect(japan.locator(at("historic-why")).first()).toContainText("Dajokan Proclamation 57");
  await open(page, "?lang=ja&q=JP");
  const ja = page.locator(`${at("historic-country")}[data-code="JP"]`);
  await expect(ja.locator(at("historic-why")).first()).toContainText("太政官布告57号");
  await expect(ja.locator(at("historic-why")).first()).toHaveAttribute("lang", "ja");
  await open(page, "?lang=ja&q=SUHH");
  await expect(page.locator(`${at("historic-country")}[data-code="SUHH"] .why`).first()).toContainText("1955年から1991年");
  await open(page, "?lang=ja&q=Canada");
  await expect(page.locator(at("historic-reason")).first()).toContainText("1870年代からレッド・エンサイン");
});
