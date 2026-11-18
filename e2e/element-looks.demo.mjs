// The element's optional looks: `rounded`, `gloss` and `wave`, all off until an attribute asks. The wave must cost nothing out of sight, stop for a reader who asks for reduced motion,
// and never crop or recolour the flag.
import { expect, test } from "@playwright/test";

import { serve } from "./demo.mjs";

// The suite runs with reduced motion on; these tests turn it off where the wave is to be seen, and on where it is to be still.
test.use({ reducedMotion: "no-preference" });

// The embed page loads the built element; flags are added to its body.
async function open(page, html) {
  const said = [];
  page.on("pageerror", (error) => said.push(`error: ${error}`));
  await serve(page);
  await page.goto("https://hata.test/embed.html?code=JP&size=24");
  await page.evaluate((markup) => document.body.insertAdjacentHTML("beforeend", markup), html);
  return said;
}
const imageOf = (page, id) => page.locator(`#${id} > img`);
const animation = (page, id) => imageOf(page, id).evaluate((node) => ({ name: getComputedStyle(node).animationName, state: getComputedStyle(node).animationPlayState }));

test("nothing is added unless an attribute asks: no animation, no gloss, no rounding", async ({ page }) => {
  const said = await open(page, '<hata-flag id="plain" code="JP" size="48"></hata-flag>');
  await expect(imageOf(page, "plain")).toHaveAttribute("src", /^data:image\/svg\+xml,/);
  expect((await animation(page, "plain")).name).toBe("none");
  const look = await page.locator("#plain").evaluate((node) => ({ after: getComputedStyle(node, "::after").content, radius: getComputedStyle(node).borderRadius, overflow: getComputedStyle(node).overflow, offscreen: node.hasAttribute("data-hata-offscreen") }));
  expect(look).toEqual({ after: "none", radius: "0px", overflow: "visible", offscreen: false });
  expect(said).toEqual([]);
});

test("wave: the picture sways while the flag is on the screen, and stays inside its box, whole", async ({ page }) => {
  await open(page, '<hata-flag id="wave" code="CA" size="96" wave></hata-flag>');
  await expect(imageOf(page, "wave")).toHaveAttribute("src", /^data:image\/svg\+xml,/);
  await expect.poll(() => animation(page, "wave")).toMatchObject({ state: "running" });
  expect((await animation(page, "wave")).name).toMatch(/-wave$/);
  // the picture is never larger than its box and never crops: at several moments of the sway its box is inside the flag's
  const insides = [];
  for (let i = 0; i < 6; i += 1) {
    insides.push(await page.evaluate(() => {
      const flag = document.querySelector("#wave").getBoundingClientRect();
      const picture = document.querySelector("#wave > img").getBoundingClientRect();
      return picture.left >= flag.left - 0.5 && picture.right <= flag.right + 0.5 && picture.top >= flag.top - 0.5 && picture.bottom <= flag.bottom + 0.5;
    }));
    await page.waitForTimeout(280);
  }
  expect(insides).toEqual([true, true, true, true, true, true]);
  // the SVG is the same as without the look: nothing is recoloured
  await page.evaluate(() => document.body.insertAdjacentHTML("beforeend", '<hata-flag id="same" code="CA" size="96"></hata-flag>'));
  await expect(imageOf(page, "same")).toHaveAttribute("src", /^data:image\/svg\+xml,/);
  const sources = await page.evaluate(() => [document.querySelector("#wave > img").src, document.querySelector("#same > img").src]);
  expect(sources[0]).toBe(sources[1]);
});

test("wave: paused while the flag is out of sight, and again when it leaves", async ({ page }) => {
  await open(page, '<div style="height:4000px"></div><hata-flag id="far" code="DE" size="48" wave></hata-flag><div style="height:4000px"></div>');
  // far down the page the flag is not even loaded yet; it is paused from the start
  await expect(page.locator("#far")).toHaveAttribute("data-hata-offscreen", "");
  await page.locator("#far").scrollIntoViewIfNeeded();
  await expect(imageOf(page, "far")).toHaveAttribute("src", /^data:image\/svg\+xml,/);
  await expect(page.locator("#far")).not.toHaveAttribute("data-hata-offscreen", "");
  expect((await animation(page, "far")).state).toBe("running");
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(page.locator("#far")).toHaveAttribute("data-hata-offscreen", "");
  expect((await animation(page, "far")).state).toBe("paused");
});

test("wave: switched off by taking the attribute away, and still for a reader who asks for reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await open(page, '<hata-flag id="calm" code="CA" size="48" wave></hata-flag>');
  await expect(imageOf(page, "calm")).toHaveAttribute("src", /^data:image\/svg\+xml,/);
  expect((await animation(page, "calm")).name).toBe("none");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect.poll(async () => (await animation(page, "calm")).name).toMatch(/-wave$/);
  await page.locator("#calm").evaluate((node) => node.removeAttribute("wave"));
  await expect.poll(async () => (await animation(page, "calm")).name).toBe("none");
  await expect(page.locator("#calm")).not.toHaveAttribute("data-hata-offscreen", "");
});

test("rounded softens the corners of the box; a round frame stays round; gloss lies over the flag and takes no press", async ({ page }) => {
  await open(page, '<hata-flag id="tile" code="CA" size="96" rounded gloss></hata-flag><hata-flag id="disc" code="CA" size="96" shape="round" rounded></hata-flag>');
  await expect(imageOf(page, "tile")).toHaveAttribute("src", /^data:image\/svg\+xml,/);
  const tile = await page.locator("#tile").evaluate((node) => ({ radius: getComputedStyle(node).borderRadius, overflow: getComputedStyle(node).overflow, after: getComputedStyle(node, "::after").content, events: getComputedStyle(node, "::after").pointerEvents, image: getComputedStyle(node, "::after").backgroundImage.startsWith("linear-gradient") }));
  expect(tile.radius).not.toBe("0px");
  expect(tile.overflow).toBe("hidden");
  expect(tile).toMatchObject({ after: '""', events: "none", image: true });
  expect(await page.locator("#disc").evaluate((node) => getComputedStyle(node).borderRadius)).toBe("50%");
  // the property and the attribute are one thing, for a framework that sets properties
  await page.locator("#disc").evaluate((node) => { node.wave = true; node.gloss = true; });
  await expect(page.locator("#disc")).toHaveAttribute("wave", "");
  await expect(page.locator("#disc")).toHaveAttribute("gloss", "");
});
