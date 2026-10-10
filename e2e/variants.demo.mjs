// A place's other flags in real use: a "disputed" badge on the card, a switch in the flag's panel with each flag's status
// and reason, the way back to the default, a place with no flag of its own (Northern Ireland), and the element and the
// builder drawing a variant.
import { expect, test } from "@playwright/test";

import { at, noSidewaysScroll, open, serve, tap } from "./demo.mjs";

test("marks a disputed flag on its card, and no other", async ({ page }) => {
  const errors = await open(page, "?lang=en&set=country");
  await expect(page.locator(at("tile-AF"))).toBeVisible();
  await expect(page.locator(at("disputed-AF"))).toHaveText("disputed");
  await expect(page.locator(at("disputed-JP"))).toHaveCount(0);
  await expect(page.locator(".badge")).toHaveCount(1);
  expect(errors).toEqual([]);
});

test("switches between Afghanistan's flags, each with its status and reason, and back to the default", async ({ page }, testInfo) => {
  await open(page, "?lang=en&set=country");
  await tap(page, at("tile-AF"), testInfo);
  const picture = page.locator(at("detail-flag"));
  await expect(page.locator(at("variants"))).toBeVisible();
  await expect(page.locator(at("disputed-note"))).toBeVisible();
  await expect(page.locator(`${at("variant-switch")} button`)).toHaveCount(2);
  // The default is the Islamic Republic's tricolour, the place's own flag.
  await expect(picture).toHaveAttribute("src", "dist/svg/af.svg");
  await expect(page.locator(at("variant-republic"))).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(at("variant-why"))).toContainText("the default");
  await expect(page.locator(at("variant-why"))).toContainText("official");
  // The Taliban's flag: its own drawing, its own words.
  await tap(page, at("variant-de-facto"), testInfo);
  await expect(picture).toHaveAttribute("src", "dist/svg/af--de-facto.svg");
  await expect(page.locator(at("variant-de-facto"))).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(at("variant-republic"))).toHaveAttribute("aria-pressed", "false");
  await expect(page.locator(at("variant-why"))).toContainText("de facto");
  await expect(page.locator(at("variant-why"))).toContainText("since 2021-08-15");
  await expect(page.locator(at("variant-why"))).not.toContainText("the default");
  await expect(page.locator(at("facts"))).toContainText("Flag of the Taliban.svg");
  await expect(page.locator(`${at("frames")} img`)).toHaveCount(6);
  await expect(page.locator(`${at("copies")} textarea`).nth(1)).toHaveValue(/flag\("AF", \{ variant: "de-facto" \}\)/);
  await expect(page.locator(`${at("copies")} textarea`).nth(0)).toHaveValue(/flags\/af--de-facto/);
  // The builder writes the variant into the code for the element.
  await expect(page.locator(at("embed-code"))).toHaveValue(/<hata-flag code="AF" variant="de-facto" size="48"><\/hata-flag>/);
  await noSidewaysScroll(page);
  // And the way back.
  await tap(page, at("variant-republic"), testInfo);
  await expect(picture).toHaveAttribute("src", "dist/svg/af.svg");
  await expect(page.locator(at("variant-why"))).toContainText("the default");
  await expect(page.locator(at("embed-code"))).toHaveValue(/<hata-flag code="AF" size="48"><\/hata-flag>/);
});

test("shows no switch for a place with one flag", async ({ page }, testInfo) => {
  await open(page, "?lang=en&set=jp");
  await tap(page, at("tile-JP-13"), testInfo);
  await expect(page.locator(at("detail-title"))).toHaveText("Tokyo");
  await expect(page.locator(at("variants"))).toBeHidden();
  await expect(page.locator(at("disputed-note"))).toBeHidden();
});

test("shows Brittany's flag as the default, with its status local and the reason, and no \"disputed\" mark", async ({ page }, testInfo) => {
  await open(page, "?lang=en&set=fr");
  await tap(page, at("tile-FR-BRE"), testInfo);
  await expect(page.locator(at("detail-title"))).toHaveText("Brittany");
  await expect(page.locator(at("detail-flag"))).toHaveAttribute("src", "dist/svg/fr-bre.svg");
  await expect(page.locator(at("variants"))).toBeVisible();
  await expect(page.locator(at("disputed-note"))).toBeHidden();
  await expect(page.locator(`${at("variant-switch")} button`)).toHaveCount(1);
  await expect(page.locator(at("variant-gwenn-ha-du"))).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(at("variant-why"))).toContainText("local");
  await expect(page.locator(at("variant-why"))).toContainText("since 1923");
  await expect(page.locator(at("variant-why"))).toContainText("official symbol is a logo");
  await expect(page.locator(at("facts"))).toContainText("Flag of Brittany (Gwenn ha du).svg");
  await expect(page.locator(at("facts"))).toContainText("Public domain");
  await noSidewaysScroll(page);
});

test("offers Northern Ireland's flags from the list of places with no flag of its own", async ({ page }, testInfo) => {
  await open(page, "?lang=en");
  await tap(page, `${at("left-out")} summary`, testInfo);
  await tap(page, at("variants-GB-NIR"), testInfo);
  await expect(page.locator(at("detail-title"))).toHaveText("Northern Ireland");
  await expect(page.locator(at("disputed-note"))).toBeVisible();
  await expect(page.locator(`${at("variant-switch")} button`)).toHaveCount(2);
  await expect(page.locator(at("detail-flag"))).toHaveAttribute("src", "dist/svg/gb-nir--union-flag.svg");
  await tap(page, at("variant-ulster-banner"), testInfo);
  await expect(page.locator(at("detail-flag"))).toHaveAttribute("src", "dist/svg/gb-nir--ulster-banner.svg");
  await expect(page.locator(at("variant-why"))).toContainText("historical");
  await expect(page.locator(at("variant-why"))).toContainText("1953 to 1972");
  await expect(page.locator(at("embed-code"))).toHaveValue(/<hata-flag code="GB-NIR" variant="ulster-banner" size="48"><\/hata-flag>/);
  await expect(page.locator(`${at("frames")} img`)).toHaveCount(6);
});

test("draws a variant in the element and in the embed page, at its own proportions", async ({ page }) => {
  const said = [];
  page.on("console", (message) => message.type() === "warning" && said.push(message.text()));
  await serve(page);
  await page.goto("https://hata.test/embed.html?code=AF&size=60&variant=de-facto");
  const flag = page.locator("hata-flag");
  await expect(flag.locator("img")).toHaveAttribute("src", /^data:image\/svg\+xml,/);
  // The Taliban's flag is 2:1, and the Republic's 3:2.
  await expect.poll(() => flag.evaluate((node) => node.getBoundingClientRect().width / node.getBoundingClientRect().height)).toBeCloseTo(2, 1);
  await flag.evaluate((node) => {
    node.variant = "";
  });
  // An empty variant is no variant: the default is drawn.
  await expect(flag).toHaveAttribute("variant", "");
  await expect.poll(() => flag.evaluate((node) => node.getBoundingClientRect().width / node.getBoundingClientRect().height)).toBeCloseTo(1.5, 1);
  // A place with no flag of its own by default draws nothing until a variant is named, and a variant it has not draws nothing.
  await page.goto("https://hata.test/embed.html?code=GB-NIR&size=48");
  await expect(page.locator("hata-flag")).toHaveAttribute("data-missing", "");
  await page.goto("https://hata.test/embed.html?code=GB-NIR&size=48&variant=union-flag");
  await expect(page.locator("hata-flag img")).toHaveAttribute("src", /^data:image\/svg\+xml,/);
  await page.goto("https://hata.test/embed.html?code=AF&size=48&variant=nothing");
  await expect(page.locator("hata-flag")).toHaveAttribute("data-missing", "");
  expect(said.length).toBeGreaterThan(0);
});
