// The gallery: every flag, found by name in either language or by code, narrowed by set and continent, framed
// four ways, and the list and the manifest saved as files. The address keeps the choices.
import { readFileSync } from "node:fs";

import { expect, test } from "@playwright/test";

import { FLAG_CODES } from "../dist/index.js";
import { LEFT_OUT, manifest as recordOf } from "../dist/manifest.js";
import { at, open, tap, type } from "./demo.mjs";

const shown = (page) => page.locator(`${at("grid")} li:not([hidden])`);

test("shows every flag, each with its name and code, and says how many", async ({ page }) => {
  const errors = await open(page, "?lang=en");
  await expect(shown(page)).toHaveCount(FLAG_CODES.length);
  await expect(page.locator(at("count"))).toHaveText(`${FLAG_CODES.length} of ${FLAG_CODES.length} flags`);
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

test("narrows to a country's regions, or the countries of one continent", async ({ page }) => {
  await open(page, "?lang=en");
  const total = FLAG_CODES.length;
  await page.locator(at("set")).selectOption("jp");
  await expect(shown(page)).toHaveCount(45);
  await expect(page.locator(at("count"))).toHaveText(`45 of ${total} flags`);
  await expect(page.locator(at("region"))).toBeHidden();
  for (const [set, count, one] of [["ca", 12, "CA-ON"], ["us", 56, "US-TX"], ["au", 8, "AU-NSW"], ["gb", 3, "GB-SCT"], ["de", 16, "DE-BY"], ["fr", 16, "FR-20R"], ["ch", 26, "CH-ZH"], ["at", 9, "AT-9"], ["br", 27, "BR-SP"]]) {
    await page.locator(at("set")).selectOption(set);
    await expect(shown(page), set).toHaveCount(count);
    await expect(page.locator(at(`tile-${one}`))).toBeVisible();
    await expect(page).toHaveURL(new RegExp(`set=${set}`));
  }
  await page.locator(at("set")).selectOption("country");
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

test("frames every flag at 4:3, square or round without stretching it, as the package measured, and back", async ({ page }, testInfo) => {
  await open(page, "?lang=en&set=ca");
  const image = page.locator(`${at("tile-CA-ON")} img`);
  for (const [shape, ratio] of [["4:3", 4 / 3], ["1:1", 1], ["round", 1]]) {
    await tap(page, `${at("shape")} [data-value="${shape}"]`, testInfo);
    await expect(page.locator(at("grid"))).toHaveAttribute("data-shape", shape);
    const box = await image.boundingBox();
    expect(box.width / box.height, shape).toBeCloseTo(ratio, 1);
    const framing = recordOf("CA-ON").framings[shape];
    expect(await image.evaluate((node) => getComputedStyle(node).objectFit), shape).toBe(framing.fit === "contain" && framing.method !== "adapted" ? "contain" : "cover");
  }
  expect(await image.evaluate((node) => getComputedStyle(node).borderRadius)).toBe("50%");
  await tap(page, `${at("shape")} [data-value="flag"]`, testInfo);
  const own = await image.boundingBox();
  expect(own.width / own.height).toBeCloseTo(2, 1);
  // Canada's square is flag-icons' drawing made for it, never a crop that drops its red bars.
  await page.locator(at("set")).selectOption("country");
  await tap(page, `${at("shape")} [data-value="1:1"]`, testInfo);
  await expect(page.locator(`${at("tile-CA")} img`)).toHaveAttribute("src", "dist/svg/ca.1x1.svg");
});

test("offers the whole flag and a crop of it for every frame, with the crop kept where it was chosen, and back to the best", async ({ page }, testInfo) => {
  await open(page, "?lang=en&set=us");
  await expect(page.locator(at("fit"))).toBeHidden();
  await tap(page, `${at("shape")} [data-value="1:1"]`, testInfo);
  await expect(page.locator(at("fit"))).toBeVisible();
  const texas = page.locator(`${at("tile-US-TX")} img`);
  const style = (name) => texas.evaluate((node, property) => getComputedStyle(node)[property], name);
  // Best: Texas's crop, kept at the hoist so that the star and the blue bar show.
  await expect(texas).toHaveAttribute("data-fit", "crop");
  await expect(texas).toHaveAttribute("data-at", "left");
  expect(await style("objectFit")).toBe("cover");
  expect(await style("objectPosition")).toBe("0% 50%");
  // Whole: all of the flag, never cropped.
  await tap(page, `${at("fit")} [data-value="whole"]`, testInfo);
  await expect(texas).toHaveAttribute("data-fit", "contain");
  expect(await style("objectFit")).toBe("contain");
  await expect(page).toHaveURL(/fit=whole/);
  // Cropped: a flag with no crop that keeps it true (Alaska, shown whole by default) is cropped from the centre when asked.
  const alaska = page.locator(`${at("tile-US-AK")} img`);
  await expect(alaska).toHaveAttribute("data-fit", "contain");
  await tap(page, `${at("fit")} [data-value="crop"]`, testInfo);
  await expect(alaska).toHaveAttribute("data-fit", "crop");
  await expect(alaska).toHaveAttribute("data-at", "centre");
  await expect(texas).toHaveAttribute("data-at", "left");
  // And back to the best for each flag.
  await tap(page, `${at("fit")} [data-value="auto"]`, testInfo);
  await expect(alaska).toHaveAttribute("data-fit", "contain");
  await expect(texas).toHaveAttribute("data-fit", "crop");
  await expect(page).not.toHaveURL(/fit=/);
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
  expect(manifest.flags).toHaveLength(FLAG_CODES.length);
  expect(manifest.leftOut.map((one) => one.code)).toContain("EH");
});

test("lists the places with no flag, each with its reason", async ({ page }, testInfo) => {
  await open(page, "?lang=en");
  await tap(page, `${at("left-out")} summary`, testInfo);
  await expect(page.locator(`${at("left-out")} li`)).toHaveCount(LEFT_OUT.length);
  await expect(page.locator(at("left-out"))).toContainText("GB-NIR Northern Ireland");
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
