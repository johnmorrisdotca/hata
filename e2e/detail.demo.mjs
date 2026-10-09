// The detail panel: a flag's names, facts, source and licence, the frames, the code to copy, and the downloads.
import { readFileSync } from "node:fs";

import { expect, test } from "@playwright/test";

import { at, noSidewaysScroll, open, tap } from "./demo.mjs";

test("opens on a tap with the flag's names, code, proportions, source, licence and frames, and closes", async ({ page }, testInfo) => {
  const errors = await open(page, "?lang=en&set=jp");
  await tap(page, at("tile-JP-13"), testInfo);
  const panel = page.locator(at("detail"));
  await expect(panel).toBeVisible();
  await expect(page.locator(at("detail-title"))).toHaveText("Tokyo");
  await expect(page.locator(at("detail-other"))).toHaveText("東京都 · JP-13");
  const facts = page.locator(at("facts"));
  await expect(facts).toContainText("3:2");
  await expect(facts).toContainText("Wikimedia Commons");
  await expect(facts).toContainText("Public domain");
  await expect(facts).toContainText("insignia");
  await expect(facts.locator("a").first()).toHaveAttribute("href", /^https:\/\/commons\.wikimedia\.org\/wiki\/File:/);
  await expect(page.locator(`${at("frames")} img`)).toHaveCount(3);
  const round = page.locator(`${at("frames")} img[data-shape="round"]`);
  await expect(round).toHaveAttribute("src", /^data:image\/svg\+xml,/);
  await noSidewaysScroll(page);
  await tap(page, at("close"), testInfo);
  await expect(panel).toBeHidden();
  expect(errors).toEqual([]);
});

test("says which drawing won and why, where a flag set's did", async ({ page }, testInfo) => {
  await open(page, "?lang=en&q=yemen");
  await tap(page, at("tile-YE"), testInfo);
  const facts = page.locator(at("facts"));
  await expect(facts).toContainText("country-flag-icons, an MIT flag set");
  await expect(facts).toContainText("the same flag as Commons'");
  await expect(facts).toContainText("Flag of Yemen.svg");
  await expect(facts).toContainText("MIT");
});

test("speaks the page's language, and the other language's name under the title", async ({ page }, testInfo) => {
  await open(page, "?lang=ja&set=ca");
  await tap(page, at("tile-CA-ON"), testInfo);
  await expect(page.locator(at("detail-title"))).toHaveText("オンタリオ州");
  await expect(page.locator(at("detail-other"))).toHaveText("Ontario · CA-ON");
  await expect(page.locator(at("facts"))).toContainText("縦横比");
});

test("copies the import, the lookup, an <img> tag and the SVG", async ({ page, browserName }, testInfo) => {
  if (browserName === "chromium") await page.context().grantPermissions(["clipboard-read", "clipboard-write"]);
  await open(page, "?lang=en&set=us");
  await tap(page, at("tile-US-TX"), testInfo);
  const fields = page.locator(`${at("copies")} textarea`);
  await expect(fields).toHaveCount(4);
  await expect(fields.nth(0)).toHaveValue('import flag from "@johnmorrisdotca/hata/flags/us-tx";');
  await expect(fields.nth(2)).toHaveValue(/^<img src="https:\/\/cdn\.jsdelivr\.net\/npm\/@johnmorrisdotca\/hata@1\/dist\/svg\/us-tx\.svg" alt="Texas"/);
  await expect(fields.nth(3)).toHaveValue(/^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" viewBox=/);
  await tap(page, at("copy-copy_import"), testInfo);
  await expect(page.locator(at("copied"))).not.toHaveText("");
  if (browserName === "chromium") expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('import flag from "@johnmorrisdotca/hata/flags/us-tx";');
});

test("downloads the SVG, a PNG at the chosen width and the flag's record", async ({ page }, testInfo) => {
  await open(page, "?lang=en&set=jp");
  await tap(page, at("tile-JP-13"), testInfo);
  await expect(page.locator(`${at("frames")} img`)).toHaveCount(3);
  const [svg] = await Promise.all([page.waitForEvent("download"), tap(page, at("download-svg"), testInfo)]);
  expect(svg.suggestedFilename()).toBe("jp-13.svg");
  expect(readFileSync(await svg.path(), "utf8")).toBe(readFileSync("site/dist/svg/jp-13.svg", "utf8"));
  await page.locator(at("png-size")).selectOption("256");
  const [png] = await Promise.all([page.waitForEvent("download"), tap(page, at("download-png"), testInfo)]);
  expect(png.suggestedFilename()).toBe("jp-13-256.png");
  const bytes = readFileSync(await png.path());
  expect(bytes.subarray(1, 4).toString()).toBe("PNG");
  expect([bytes.readUInt32BE(16), bytes.readUInt32BE(20)]).toEqual([256, 171]);
  const [json] = await Promise.all([page.waitForEvent("download"), tap(page, at("download-json"), testInfo)]);
  const record = JSON.parse(readFileSync(await json.path(), "utf8"));
  expect(record.code).toBe("JP-13");
  expect(record.names).toEqual({ en: "Tokyo", ja: "東京都" });
  expect(record.licence.kind).toBe("public-domain");
});
