// How the demo looks and holds still: no sideways scroll at a phone's width or a desk's, in light and dark, English
// and Japanese, with the detail panel open and with the quiz; finger-sized controls; fields that do not zoom.
import { expect, test } from "@playwright/test";

import { at, noSidewaysScroll, open, tap } from "./demo.mjs";

for (const scheme of ["light", "dark"]) {
  for (const lang of ["en", "ja"]) {
    test(`fits the page without a sideways scroll, in ${scheme} and ${lang}`, async ({ page }, testInfo) => {
      await page.emulateMedia({ colorScheme: scheme });
      const errors = await open(page, `?lang=${lang}`);
      await noSidewaysScroll(page);
      const paper = await page.locator(".fam-panels").first().evaluate((node) => getComputedStyle(node).backgroundColor);
      expect(paper).toBe(scheme === "dark" ? "rgb(29, 32, 30)" : "rgb(251, 248, 241)");
      // The longest names and the widest flag still fit, and so does the open panel and the quiz.
      await page.goto(`https://hata.test/?lang=${lang}&q=South Georgia`);
      await page.waitForSelector('main[data-ready="true"]');
      await tap(page, at("tile-GS"), testInfo);
      await expect(page.locator(`${at("frames")} img`)).toHaveCount(3);
      await noSidewaysScroll(page);
      const panel = await page.locator(at("detail")).evaluate((node) => [node.scrollWidth, node.clientWidth]);
      expect(panel[0]).toBeLessThanOrEqual(panel[1]);
      await tap(page, at("close"), testInfo);
      await page.goto(`https://hata.test/?lang=${lang}&tab=quiz&mode=country&seed=widest`);
      await page.waitForSelector('main[data-ready="true"]');
      await noSidewaysScroll(page);
      expect(errors).toEqual([]);
    });
  }
}

test("every button, field and link in the bar is a finger tall", async ({ page }) => {
  await open(page);
  const small = await page.evaluate(() =>
    [...document.querySelectorAll("main button, main input, main select, nav a, nav button")]
      .filter((one) => one.offsetParent !== null)
      .map((one) => ({ name: one.textContent.trim() || one.id || one.dataset.lang, ...one.getBoundingClientRect().toJSON() }))
      .filter((one) => one.height < 43.5 || (one.width < 43.5 && one.name !== "")),
  );
  expect(small).toEqual([]);
});

test("the fields are real fields: no zoom on a phone", async ({ page }) => {
  await open(page);
  const sizes = await page.evaluate(() => [...document.querySelectorAll("main input, main select, dialog select, dialog textarea")].map((one) => parseFloat(getComputedStyle(one).fontSize)));
  expect(sizes.length).toBeGreaterThanOrEqual(3);
  for (const size of sizes) expect(size).toBeGreaterThanOrEqual(16);
});

test("the quiz's stage keeps its size from one flag to the next, so the names do not jump", async ({ page }, testInfo) => {
  await open(page, "?lang=en&tab=quiz&mode=us&seed=steady");
  const question = page.locator(".question");
  const before = await question.boundingBox();
  await tap(page, `${at("choices")} button >> nth=0`, testInfo);
  await tap(page, at("next"), testInfo);
  const after = await question.boundingBox();
  expect(Math.abs(after.height - before.height)).toBeLessThan(0.5);
});
