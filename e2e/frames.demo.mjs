// The gallery opens on the frames: the flags go from their own proportions to 4:3, square and round by themselves, with the shape bar and its Play button in the first screen on a phone and on a desk, and
// searching or filtering leaves the shapes going. Choosing a shape, or Pause, stops it; a reader who prefers reduced motion, or an address that names a shape, gets it still.
import { expect, test } from "@playwright/test";

import { at, open } from "./demo.mjs";

const shapeNow = (page) => page.locator(at("grid")).getAttribute("data-shape");
// Measured in the page in one go, since the grid is drawn again at every shape.
const inView = (page, selector) =>
  page.evaluate((query) => {
    const box = document.querySelector(query)?.getBoundingClientRect();
    return box !== undefined && box.y >= 0 && box.y + Math.min(box.height, 60) <= window.innerHeight;
  }, selector);

test.describe("a reader who has not asked for less motion", () => {
  test.use({ reducedMotion: "no-preference" });

  test("the first screen has the shape bar and flags, and the shapes change by themselves", async ({ page }) => {
    const errors = await open(page, "?lang=en&help=off&gap=400");
    expect(await inView(page, at("framebar"))).toBe(true);
    expect(await inView(page, at("tile-AD"))).toBe(true);
    await expect(page.locator(at("play"))).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator(at("play"))).toHaveText("Pause");
    const seen = new Set();
    await expect.poll(async () => { seen.add(await shapeNow(page)); return seen.size; }, { timeout: 8000 }).toBeGreaterThanOrEqual(3);
    // While it plays the address does not hold the shape.
    expect(page.url()).not.toMatch(/shape=/);
    expect(errors).toEqual([]);
  });

  test("searching and filtering leave the shapes going; choosing a shape stops them and writes it in the address", async ({ page }) => {
    await open(page, "?lang=en&help=off&gap=400");
    await page.locator(at("search")).fill("Canada");
    await page.locator(at("set")).selectOption("ca");
    const seen = new Set();
    await expect.poll(async () => { seen.add(await shapeNow(page)); return seen.size; }, { timeout: 8000 }).toBeGreaterThanOrEqual(3);
    await expect(page.locator(at("play"))).toHaveAttribute("aria-pressed", "true");
    await page.locator(`${at("shape")} button[data-value="round"]`).dispatchEvent("click");
    await expect(page.locator(at("play"))).toHaveAttribute("aria-pressed", "false");
    await expect(page).toHaveURL(/shape=round/);
    await page.waitForTimeout(1200);
    expect(await shapeNow(page)).toBe("round");
  });

  test("Pause holds the shape, Play carries on from it", async ({ page }) => {
    await open(page, "?lang=en&help=off&gap=400");
    const play = page.locator(at("play"));
    await play.dispatchEvent("click");
    await expect(play).toHaveAttribute("aria-pressed", "false");
    await expect(play).toHaveText("Play the frames");
    const held = await shapeNow(page);
    await page.waitForTimeout(1200);
    expect(await shapeNow(page)).toBe(held);
    await expect(page).toHaveURL(/play=0/);
    await play.dispatchEvent("click");
    await expect.poll(() => shapeNow(page), { timeout: 8000 }).not.toBe(held);
  });
});

test("an address that names a shape opens still on it, and so does a reader who prefers reduced motion", async ({ page }) => {
  await open(page, "?lang=en&help=off&shape=4:3&gap=300");
  await expect(page.locator(at("play"))).toHaveAttribute("aria-pressed", "false");
  await page.waitForTimeout(900);
  expect(await shapeNow(page)).toBe("4:3");
  // The test config prefers reduced motion: with no shape in the address nothing moves either.
  await open(page, "?lang=en&help=off&gap=300");
  await expect(page.locator(at("play"))).toHaveAttribute("aria-pressed", "false");
  await page.waitForTimeout(900);
  expect(await shapeNow(page)).toBe("flag");
  expect(page.url()).not.toMatch(/play=0/);
});
