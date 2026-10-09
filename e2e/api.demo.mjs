// The API reference page: every entry point and export, and the family's header and footer around them.
import { expect, test } from "@playwright/test";

import { noSidewaysScroll, serve } from "./demo.mjs";

test("api.html lists every entry point with its exports, and fits a phone", async ({ page }) => {
  await serve(page);
  await page.goto("https://hata.test/api.html?lang=en");
  for (const entry of ["@johnmorrisdotca/hata", "@johnmorrisdotca/hata/load", "@johnmorrisdotca/hata/manifest", "@johnmorrisdotca/hata/flags/<code>"]) {
    await expect(page.locator(".api-entry h2", { hasText: new RegExp(`^${entry.replace(/[/<>]/g, "\\$&")}$`) })).toHaveCount(1);
  }
  await expect(page.locator("#main-frame")).toContainText("round");
  await expect(page.locator("#load-flag")).toContainText("JP-13");
  await expect(page.locator("#manifest-manifest")).toContainText("country-flag-icons");
  await expect(page.locator("footer")).toContainText("npm install @johnmorrisdotca/hata");
  await noSidewaysScroll(page);
});
