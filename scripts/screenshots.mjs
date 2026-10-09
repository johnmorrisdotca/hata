// Takes demo pictures for a person to look at, from the built demo in site/, served to Chromium without a port:
//
//   node scripts/screenshots.mjs <folder> [prefix]
//
// The gallery on a desk and a phone, in light and dark, English and Japanese; a detail panel; the quiz after an
// answer. Not the README's pictures (those are `pnpm screenshots:readme`); these are for review.
import { existsSync, readFileSync } from "node:fs";
import { extname, join } from "node:path";
import process from "node:process";

import { chromium } from "@playwright/test";

const [folder, prefix = "hata"] = process.argv.slice(2);
const site = join(import.meta.dirname, "..", "site");
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml" };
const browser = await chromium.launch();
const shots = [
  { name: "desk-light-en", width: 1280, height: 1000, scheme: "light", query: "?lang=en" },
  { name: "phone-dark-ja", width: 390, height: 844, scheme: "dark", query: "?lang=ja", phone: true },
  { name: "detail-desk", width: 1280, height: 1000, scheme: "light", query: "?lang=en&set=jp", open: "JP-13" },
  { name: "detail-phone-ja", width: 390, height: 844, scheme: "dark", query: "?lang=ja&set=us", open: "US-TX", phone: true },
  { name: "quiz-desk", width: 1280, height: 1000, scheme: "light", query: "?lang=en&tab=quiz&mode=jp&seed=hata", answer: true },
  { name: "quiz-phone-ja", width: 390, height: 844, scheme: "dark", query: "?lang=ja&tab=quiz&mode=country&seed=hata", answer: true, phone: true },
  { name: "round-desk-dark", width: 1280, height: 1000, scheme: "dark", query: "?lang=en&set=ca&shape=round" },
];
for (const shot of shots) {
  const context = await browser.newContext({ viewport: { width: shot.width, height: shot.height }, deviceScaleFactor: shot.phone ? 2 : 1, isMobile: Boolean(shot.phone), hasTouch: Boolean(shot.phone), colorScheme: shot.scheme, reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.route("https://hata.test/**", (route) => {
    const { pathname } = new URL(route.request().url());
    const file = join(site, pathname === "/" ? "index.html" : decodeURIComponent(pathname).slice(1));
    if (!existsSync(file)) return route.fulfill({ status: 404, body: "" });
    return route.fulfill({ body: readFileSync(file), contentType: TYPES[extname(file)] ?? "application/octet-stream" });
  });
  await page.goto(`https://hata.test/${shot.query}`);
  await page.waitForSelector('main[data-ready="true"]');
  if (shot.open) {
    await page.locator(`[data-testid="tile-${shot.open}"]`).click();
    await page.locator('#frames img[data-shape="round"]').waitFor();
  }
  if (shot.answer) {
    await page.locator('[data-testid="choice-1"]').click();
    await page.locator('[data-testid="stage"]').evaluate((stage) => stage.scrollIntoView({ block: "center" }));
  }
  // Every picture on screen drawn: a lazy one off screen, or in a hidden tile, never loads, so it is not waited for.
  await page.evaluate(() =>
    Promise.all(
      [...document.images]
        .filter((image) => {
          const box = image.getBoundingClientRect();
          return image.offsetParent !== null && box.bottom > 0 && box.top < innerHeight;
        })
        .map((image) => (image.complete ? null : new Promise((done) => image.addEventListener("load", done, { once: true })))),
    ),
  );
  await page.screenshot({ path: join(folder, `${prefix}-${shot.name}.png`) });
  await context.close();
}
await browser.close();
console.log(`wrote ${shots.length} pictures to ${folder}`);
