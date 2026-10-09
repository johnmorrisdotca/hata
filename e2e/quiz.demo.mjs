// The quiz: ten flags from a seed, the same in every browser; scores and streaks; a link that gives the same game.
import { expect, test } from "@playwright/test";

import { at, open, tap } from "./demo.mjs";

const questionCode = (page) => page.locator(at("question")).getAttribute("data-code");
const rightChoice = async (page) => {
  const code = await questionCode(page);
  return page.locator(`${at("choices")} button[data-code="${code}"]`);
};
const wrongChoice = async (page) => {
  const code = await questionCode(page);
  return page.locator(`${at("choices")} button:not([data-code="${code}"])`).first();
};

test("asks the same ten flags, in the same order with the same names, for the same seed and mode", async ({ page }) => {
  const errors = await open(page, "?lang=en&tab=quiz&mode=jp&seed=abc123");
  await expect(page.locator(at("quiz-panel"))).toBeVisible();
  await expect(page.locator(at("seed"))).toHaveText("abc123");
  const first = await questionCode(page);
  const names = await page.locator(`${at("choices")} button`).allTextContents();
  expect(first).toMatch(/^JP-\d\d$/);
  expect(names).toHaveLength(4);
  await page.reload();
  await page.waitForSelector('main[data-ready="true"]');
  expect(await questionCode(page)).toBe(first);
  expect(await page.locator(`${at("choices")} button`).allTextContents()).toEqual(names);
  expect(errors).toEqual([]);
});

test("asks each mode about its own places, four names each, one of them right", async ({ page }) => {
  await open(page, "?lang=en&tab=quiz&seed=modes");
  const modes = [["country", /^[A-Z]{2}$/], ["jp", /^JP-/], ["ca", /^CA-/], ["us", /^US-/], ["au", /^AU-/], ["br", /^BR-/], ["de", /^DE-/], ["ch", /^CH-/], ["europe", /^(GB|DE|FR|CH|AT)-/]];
  expect(await page.locator(`${at("mode")} option`).evaluateAll((options) => options.map((option) => option.value))).toEqual(modes.map(([mode]) => mode));
  for (const [mode, pattern] of modes) {
    await page.locator(at("mode")).selectOption(mode);
    const code = await questionCode(page);
    expect(code, mode).toMatch(pattern);
    const options = await page.locator(`${at("choices")} button`).evaluateAll((buttons) => buttons.map((button) => button.dataset.code));
    expect(new Set(options).size, mode).toBe(4);
    expect(options, mode).toContain(code);
    for (const option of options) expect(option, mode).toMatch(pattern);
    await expect(page).toHaveURL(new RegExp(`mode=${mode}`));
  }
});

test("counts right answers and the run of them, keeps the best run, and ends after ten", async ({ page }, testInfo) => {
  await open(page, "?lang=en&tab=quiz&mode=ca&seed=streaks");
  await tap(page, await rightChoice(page), testInfo);
  await expect(page.locator(at("verdict"))).toContainText("Right:");
  await expect(page.locator(at("score"))).toHaveText("1");
  await expect(page.locator(at("streak"))).toHaveText("1");
  await tap(page, at("next"), testInfo);
  await tap(page, await rightChoice(page), testInfo);
  await expect(page.locator(at("streak"))).toHaveText("2");
  await expect(page.locator(at("best"))).toHaveText("2");
  await tap(page, at("next"), testInfo);
  await tap(page, await wrongChoice(page), testInfo);
  await expect(page.locator(at("verdict"))).toContainText("Not quite:");
  await expect(page.locator(`${at("choices")} [data-state="right"]`)).toHaveCount(1);
  await expect(page.locator(`${at("choices")} [data-state="wrong"]`)).toHaveCount(1);
  await expect(page.locator(at("streak"))).toHaveText("0");
  await expect(page.locator(at("best"))).toHaveText("2");
  for (let question = 4; question <= 10; question += 1) {
    await tap(page, at("next"), testInfo);
    await expect(page.locator(at("progress"))).toHaveText(`Flag ${question} of 10`);
    await tap(page, await rightChoice(page), testInfo);
  }
  await expect(page.locator(at("score"))).toHaveText("9");
  await expect(page.locator(at("best"))).toHaveText("7");
  await expect(page.locator(at("verdict"))).toContainText("You named 9 of 10");
  await expect(page.locator(at("next"))).toHaveText("Play again");
  // The best run is kept on this device.
  await page.reload();
  await page.waitForSelector('main[data-ready="true"]');
  await expect(page.locator(at("best"))).toHaveText("7");
});

test("shares a link to the same game, and a new game or today's changes the seed", async ({ page, browserName }, testInfo) => {
  if (browserName === "chromium") await page.context().grantPermissions(["clipboard-read", "clipboard-write"]);
  await open(page, "?lang=en&tab=quiz&mode=us&seed=share1");
  const first = await questionCode(page);
  await tap(page, at("share"), testInfo);
  await expect(page.locator(at("shared"))).toContainText("tab=quiz&mode=us&seed=share1");
  const link = (/(http\S+)/.exec(await page.locator(at("shared")).textContent()) ?? [])[1];
  const friend = await page.context().newPage();
  await open(friend, link.slice(link.indexOf("?")));
  expect(await questionCode(friend)).toBe(first);
  await tap(page, at("new-game"), testInfo);
  await expect(page.locator(at("seed"))).not.toHaveText("share1");
  await tap(page, at("daily"), testInfo);
  await expect(page.locator(at("seed"))).toHaveText(/^\d{4}-\d{2}-\d{2}$/);
  await expect(page).toHaveURL(/seed=\d{4}-\d{2}-\d{2}/);
});

test("names the choices in Japanese, and the progress too", async ({ page }) => {
  await open(page, "?lang=ja&tab=quiz&mode=jp&seed=nihongo");
  await expect(page.locator(at("progress"))).toHaveText("10 問中 1 問目");
  for (const name of await page.locator(`${at("choices")} button`).allTextContents()) expect(name).toMatch(/[都道府県]$/);
});
