// The gallery: every flag, found by name in either language or by code, narrowed by set and continent, framed
// four ways, and the list and the manifest saved as files. The address keeps the choices.
import { readFileSync } from "node:fs";

import { expect, test } from "@playwright/test";

import { at, open, tap, type } from "./demo.mjs";

const shown = (page) => page.locator(`${at("grid")} li:not([hidden])`);

test("shows every flag, each with its name and code, and says how many", async ({ page }) => {
  const errors = await open(page, "?lang=en");
  await expect(shown(page)).toHaveCount(358);
  await expect(page.locator(at("count"))).toHaveText("358 of 358 flags");
  await expect(page.locator(at("tile-JP"))).toContainText("Japan");
  await expect(page.locator(at("tile-JP"))).toContainText("JP");
  await expect(page.locator(`${at("tile-JP")} img`)).toHaveAttribute("src", "dist/svg/jp.svg");
  expect(errors).toEqual([]);
});

test("finds a flag by its English name, its Japanese name in kanji or kana, or its code", async ({ page }) => {
  await open(page, "?lang=en");
  for (const [text, code] of [["Tokyo", "JP-13"], ["東京", "JP-13"], ["おんたりお", "CA-ON"], ["texas", "US-TX"], ["us-tx", "US-TX"], ["ドイツ", "DE"]]) {
    await type(page, "search", text);
    await expect(page.locator(at(`tile-${code}`)), text).toBeVisible();
    expect(await shown(page).count(), text).toBeLessThan(10);
  }
  await type(page, "search", "Atlantis");
  await expect(shown(page)).toHaveCount(0);
  await expect(page.locator(at("empty"))).toBeVisible();
  await expect(page).toHaveURL(/q=Atlantis/);
});

test("narrows to a country's regions, or the countries of one continent", async ({ page }, testInfo) => {
  await open(page, "?lang=en");
  await tap(page, `${at("set")} [data-value="jp"]`, testInfo);
  await expect(shown(page)).toHaveCount(45);
  await expect(page.locator(at("count"))).toHaveText("45 of 358 flags");
  await expect(page.locator(at("region"))).toBeHidden();
  await tap(page, `${at("set")} [data-value="ca"]`, testInfo);
  await expect(shown(page)).toHaveCount(12);
  await tap(page, `${at("set")} [data-value="us"]`, testInfo);
  await expect(shown(page)).toHaveCount(56);
  await tap(page, `${at("set")} [data-value="country"]`, testInfo);
  await expect(shown(page)).toHaveCount(245);
  await page.locator(at("region")).selectOption("EU");
  await expect(page.locator(at("tile-FR"))).toBeVisible();
  await expect(page.locator(at("tile-JP"))).toBeHidden();
  await expect(page).toHaveURL(/set=country/);
  await expect(page).toHaveURL(/region=EU/);
  // The address brings the same view back.
  await page.reload();
  await page.waitForSelector('main[data-ready="true"]');
  await expect(page.locator(at("tile-JP"))).toBeHidden();
  await expect(page.locator(at("tile-FR"))).toBeVisible();
});

test("frames every flag at 4:3, square or round without stretching it, and back", async ({ page }, testInfo) => {
  await open(page, "?lang=en&set=ca");
  const image = page.locator(`${at("tile-CA-ON")} img`);
  for (const [shape, ratio] of [["4:3", 4 / 3], ["1:1", 1], ["round", 1]]) {
    await tap(page, `${at("shape")} [data-value="${shape}"]`, testInfo);
    await expect(page.locator(at("grid"))).toHaveAttribute("data-shape", shape);
    const box = await image.boundingBox();
    expect(box.width / box.height, shape).toBeCloseTo(ratio, 1);
    expect(await image.evaluate((node) => getComputedStyle(node).objectFit), shape).toBe("cover");
  }
  expect(await image.evaluate((node) => getComputedStyle(node).borderRadius)).toBe("50%");
  await tap(page, `${at("shape")} [data-value="flag"]`, testInfo);
  const own = await image.boundingBox();
  expect(own.width / own.height).toBeCloseTo(2, 1);
});

test("saves the list of the flags shown, and the whole manifest", async ({ page }, testInfo) => {
  await open(page, "?lang=en&set=jp");
  const [list] = await Promise.all([page.waitForEvent("download"), tap(page, at("download-list"), testInfo)]);
  expect(list.suggestedFilename()).toBe("hata-flags.txt");
  const lines = readFileSync(await list.path(), "utf8").trim().split("\n");
  expect(lines).toHaveLength(46);
  expect(lines.find((line) => line.startsWith("JP-13\t"))).toContain("Tokyo\t東京都\tcommons\tPublic domain");
  const [json] = await Promise.all([page.waitForEvent("download"), tap(page, at("download-manifest"), testInfo)]);
  const manifest = JSON.parse(readFileSync(await json.path(), "utf8"));
  expect(manifest.flags).toHaveLength(358);
  expect(manifest.leftOut.map((one) => one.code)).toContain("EH");
});

test("lists the places with no flag, each with its reason", async ({ page }, testInfo) => {
  await open(page, "?lang=en");
  await tap(page, `${at("left-out")} summary`, testInfo);
  await expect(page.locator(`${at("left-out")} li`)).toHaveCount(9);
  await expect(page.locator(at("left-out"))).toContainText("EH Western Sahara");
});

test("draws every flag in the gallery at its own proportions, the widest and the tallest too", async ({ page }) => {
  await open(page, "?lang=en");
  const drawn = await page.evaluate(async () => {
    const out = [];
    for (const image of document.querySelectorAll('[data-testid="grid"] img')) {
      const box = image.getBoundingClientRect();
      if (box.height === 0) continue;
      const own = await fetch(image.src).then((answer) => answer.text()).then((svg) => /viewBox="[-\d.]+ [-\d.]+ ([\d.]+) ([\d.]+)"/.exec(svg)).then((match) => Number(match[1]) / Number(match[2]));
      out.push({ code: image.closest("button").dataset.code, drawn: box.width / box.height, own });
    }
    return out;
  });
  expect(drawn.length).toBeGreaterThan(0);
  for (const one of drawn) expect(Math.abs(one.drawn - one.own) / one.own, one.code).toBeLessThan(0.04);
});
