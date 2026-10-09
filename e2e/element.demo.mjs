// <hata-flag>, the custom element, and embed.html, the page an iframe shows: drawn from the built package as a page
// that loads dist/element-define.js would draw it.
import { expect, test } from "@playwright/test";

import { at, serve } from "./demo.mjs";

// The embed page, with its query; returns what the page warned of and complained of.
async function embed(page, query) {
  const said = [];
  page.on("console", (message) => (message.type() === "warning" || message.type() === "error") && said.push(`${message.type()}: ${message.text()}`));
  page.on("pageerror", (error) => said.push(`error: ${error}`));
  await serve(page);
  await page.goto(`https://hata.test/embed.html${query}`);
  return said;
}

test("draws a flag at the size asked, named for a screen reader in the page's language or by its label", async ({ page }) => {
  const said = await embed(page, "?code=JP-13&size=48");
  const flag = page.locator("hata-flag");
  await expect(flag.locator("img")).toHaveAttribute("src", /^data:image\/svg\+xml,/);
  await expect(flag).toHaveAttribute("role", "img");
  await expect(flag).toHaveAccessibleName("Tokyo");
  const box = await flag.boundingBox();
  expect(box.height).toBeCloseTo(48, 0);
  expect(box.width / box.height).toBeCloseTo(1.5, 1);
  await page.goto("https://hata.test/embed.html?code=JP-13&size=48&lang=ja");
  await expect(page.locator("hata-flag")).toHaveAccessibleName("東京都");
  await page.goto("https://hata.test/embed.html?code=JP-13&label=Home");
  await expect(page.locator("hata-flag")).toHaveAccessibleName("Home");
  expect(said).toEqual([]);
});

test("frames it round, square or 4:3, with a border and a shadow when asked, and redraws when an attribute changes", async ({ page }) => {
  await embed(page, "?code=CA&shape=round&size=64&border=1&shadow=1");
  const flag = page.locator("hata-flag");
  await expect(flag.locator("img")).toHaveAttribute("src", /clip-path/);
  const style = await flag.evaluate((node) => ({ radius: getComputedStyle(node).borderRadius, shadow: getComputedStyle(node).boxShadow, ratio: node.getBoundingClientRect().width / node.getBoundingClientRect().height }));
  expect(style.radius).toBe("50%");
  expect(style.shadow.split("rgba").length - 1).toBe(2);
  expect(style.ratio).toBeCloseTo(1, 2);
  // A property writes its attribute, as React, Vue and Svelte set it.
  await flag.evaluate((node) => {
    node.shape = "4:3";
    node.border = false;
  });
  await expect(flag).toHaveAttribute("shape", "4:3");
  await expect(flag).not.toHaveAttribute("border");
  await expect.poll(() => flag.evaluate((node) => node.getBoundingClientRect().width / node.getBoundingClientRect().height)).toBeCloseTo(4 / 3, 2);
  expect(await flag.evaluate((node) => node.border)).toBe(false);
});

test("draws nothing for a code with no flag, and says why once on the console however many ask", async ({ page }) => {
  const said = await embed(page, "?code=XX");
  const flag = page.locator("hata-flag");
  await expect(flag).toHaveAttribute("data-missing", "");
  await expect(flag.locator("img")).toHaveCount(0);
  await expect(flag).not.toHaveAttribute("role");
  expect((await flag.boundingBox())?.width ?? 0).toBe(0);
  const events = await page.evaluate(async () => {
    const seen = [];
    document.addEventListener("hata-error", (event) => seen.push(event.detail.code));
    for (let at = 0; at < 2; at += 1) {
      const another = document.createElement("hata-flag");
      another.setAttribute("loading", "eager");
      another.setAttribute("code", "XX");
      document.body.append(another);
      await another.ready;
    }
    return seen;
  });
  expect(events).toEqual(["XX", "XX"]);
  expect(said).toHaveLength(1);
  expect(said[0]).toMatch(/^warning: <hata-flag>: no flag for the code "XX"/);
});

test("waits to load a flag far down the page until it comes near the screen", async ({ page }) => {
  await embed(page, "?code=FR");
  const loaded = await page.evaluate(async () => {
    const spacer = Object.assign(document.createElement("div"), { style: "height: 5000px" });
    const far = Object.assign(document.createElement("hata-flag"), {});
    far.setAttribute("code", "DE-BY");
    document.body.append(spacer, far);
    await new Promise((resolve) => setTimeout(resolve, 300));
    const before = far.querySelector("img") !== null;
    far.scrollIntoView();
    await far.ready;
    return { before, after: far.querySelector("img") !== null };
  });
  expect(loaded).toEqual({ before: false, after: true });
});

test("the demo's builder writes the code for the flag that is open, as each format, and copies it", async ({ page, context, browserName }) => {
  if (browserName === "chromium") await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await serve(page);
  await page.goto("https://hata.test/?lang=en&set=de");
  await page.waitForSelector('main[data-ready="true"]');
  await page.locator(at("tile-DE-BY")).click();
  const code = page.locator(at("embed-code"));
  await expect(code).toHaveValue(/<hata-flag code="DE-BY" size="48"><\/hata-flag>/);
  await page.locator(at("embed-option-shape")).selectOption("round");
  await page.locator(at("embed-option-border")).check();
  await expect(code).toHaveValue(/<hata-flag code="DE-BY" shape="round" size="48" border><\/hata-flag>/);
  await expect(page.locator(`${at("embed-preview")} hata-flag`)).toHaveAttribute("shape", "round");
  for (const [tab, pattern] of [["img", /<img src="https:\/\/cdn\.jsdelivr\.net\/npm\/@johnmorrisdotca\/hata@1\/dist\/svg\/de-by\.svg" alt="Bavaria"/], ["iframe", /<iframe src="https:\/\/johnmorrisdotca\.github\.io\/hata\/embed\.html\?code=DE-BY&amp;shape=round&amp;size=48&amp;border=1"/], ["react", /return <hata-flag code="DE-BY" shape="round" size=\{48\} border \/>/], ["vue", /isCustomElement/], ["svelte", /import "@johnmorrisdotca\/hata\/element\/define";/], ["angular", /CUSTOM_ELEMENTS_SCHEMA/], ["module", /flagDataUri\("DE-BY", \{ shape: "round" \}\)/], ["data", /<img src="data:image\/svg\+xml,/]]) {
    await page.locator(at(`embed-tab-${tab}`)).click();
    await expect(code, tab).toHaveValue(pattern);
  }
  await page.locator(at("embed-copy")).click();
  await expect(page.locator(at("embed-status"))).toHaveText(/Copied|Could not copy/);
});
