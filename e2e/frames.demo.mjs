// The gallery opens on the flags at their own proportions, still, with the shape bar and its Play button in the first screen on a phone and on a desk. The flags go from their own proportions to 4:3, square and round while the
// mouse is over them and stop when it leaves; Play keeps them going wherever the pointer is, searching or filtering leaves them going, and choosing a shape, or Pause, stops them. A reader who prefers reduced motion is never played to by the pointer.
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

  test("the first screen has the shape bar and flags, and nothing moves until the pointer is over the flags", async ({ page }) => {
    const errors = await open(page, "?lang=en&help=off&gap=400");
    expect(await inView(page, at("framebar"))).toBe(true);
    expect(await inView(page, at("tile-AD"))).toBe(true);
    await expect(page.locator(at("play"))).toHaveAttribute("aria-pressed", "false");
    await expect(page.locator(at("play"))).toHaveText("Play the frames");
    await page.waitForTimeout(1500);
    expect(await shapeNow(page)).toBe("flag");
    expect(page.url()).not.toMatch(/shape=|play=/);
    expect(errors).toEqual([]);
  });

  test("the shapes change while the mouse is over the flags and stop where it leaves", async ({ page, hasTouch }) => {
    test.skip(hasTouch, "a touch screen has no pointer to hover with: Play is its way in");
    await open(page, "?lang=en&help=off&gap=400");
    await page.locator(at("tile-AD")).hover();
    await expect(page.locator(at("play"))).toHaveAttribute("aria-pressed", "true");
    const seen = new Set();
    await expect.poll(async () => { seen.add(await shapeNow(page)); return seen.size; }, { timeout: 8000 }).toBeGreaterThanOrEqual(3);
    expect(page.url()).not.toMatch(/shape=/);
    await page.mouse.move(2, 2);
    await expect(page.locator(at("play"))).toHaveAttribute("aria-pressed", "false");
    const held = await shapeNow(page);
    await page.waitForTimeout(1200);
    expect(await shapeNow(page)).toBe(held);
    // The address says the shape it stopped on.
    if (held !== "flag") await expect(page).toHaveURL(new RegExp(`shape=${held.replace(":", "(:|%3A)")}`));
    await page.locator(at("tile-AD")).hover();
    await expect.poll(() => shapeNow(page), { timeout: 8000 }).not.toBe(held);
  });

  test("Play keeps the shapes going when the pointer is elsewhere; searching and filtering leave them going; choosing a shape stops them and writes it in the address", async ({ page }) => {
    await open(page, "?lang=en&help=off&gap=400");
    await page.locator(at("play")).dispatchEvent("click");
    await expect(page.locator(at("play"))).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator(at("play"))).toHaveText("Pause");
    await page.locator(at("search")).fill("Canada");
    await page.locator(at("set")).selectOption("ca");
    const seen = new Set();
    await expect.poll(async () => { seen.add(await shapeNow(page)); return seen.size; }, { timeout: 8000 }).toBeGreaterThanOrEqual(3);
    await expect(page).toHaveURL(/play=1/);
    await page.locator(`${at("shape")} button[data-value="round"]`).dispatchEvent("click");
    await expect(page.locator(at("play"))).toHaveAttribute("aria-pressed", "false");
    await expect(page).toHaveURL(/shape=round/);
    await page.waitForTimeout(1200);
    expect(await shapeNow(page)).toBe("round");
  });

  test("Pause holds the shape, Play carries on from it", async ({ page }) => {
    await open(page, "?lang=en&help=off&gap=400&play=1");
    const play = page.locator(at("play"));
    await expect(play).toHaveAttribute("aria-pressed", "true");
    await play.dispatchEvent("click");
    await expect(play).toHaveAttribute("aria-pressed", "false");
    await expect(play).toHaveText("Play the frames");
    const held = await shapeNow(page);
    await page.waitForTimeout(1200);
    expect(await shapeNow(page)).toBe(held);
    await expect(page).not.toHaveURL(/play=1/);
    await play.dispatchEvent("click");
    await expect.poll(() => shapeNow(page), { timeout: 8000 }).not.toBe(held);
  });
});

test("an address that names a shape opens still on it, and so does a reader who prefers reduced motion, whom the pointer does not play to", async ({ page, hasTouch }) => {
  await open(page, "?lang=en&help=off&shape=4:3&gap=300&play=1");
  await expect(page.locator(at("play"))).toHaveAttribute("aria-pressed", "false");
  await page.waitForTimeout(900);
  expect(await shapeNow(page)).toBe("4:3");
  // The test config prefers reduced motion: nothing moves, and the pointer over the flags does not start it.
  await open(page, "?lang=en&help=off&gap=300&play=1");
  await expect(page.locator(at("play"))).toHaveAttribute("aria-pressed", "false");
  if (!hasTouch) await page.locator(at("tile-AD")).hover();
  await page.waitForTimeout(900);
  expect(await shapeNow(page)).toBe("flag");
  // Play still works.
  await page.locator(at("play")).dispatchEvent("click");
  await expect.poll(() => shapeNow(page), { timeout: 8000 }).not.toBe("flag");
});
