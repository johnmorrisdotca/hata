// Takes the pictures the README shows, from the built demo in `site/`: `pnpm screenshots:readme` (builds the demo,
// then runs this). The shared part is readme-pictures-lib.mjs, the same file in every package of the family. The page
// is served to a browser without a port, never fetched from the live site, and is the same each run: the quiz plays
// a fixed seed, and motion is reduced. It waits on the page saying it is ready, and on the pictures it shows.
// Output: docs/images/<hero|detail|quiz>-<desk|phone>-<light|dark>.webp.
import { takePictures } from "./readme-pictures-lib.mjs";

const READY = 'main[data-ready="true"]';

// Every picture on screen drawn; a lazy one off screen never loads, so it is not waited for.
const pictures = (page) =>
  page.evaluate(() =>
    Promise.all(
      [...document.images]
        .filter((image) => {
          const box = image.getBoundingClientRect();
          return image.offsetParent !== null && box.bottom > 0 && box.top < innerHeight;
        })
        .map((image) => (image.complete ? null : new Promise((done) => image.addEventListener("load", done, { once: true })))),
    ),
  );

await takePictures({
  shots: [
    // The gallery from the top of the page: the header, the tabs, the filters and the first rows of flags. On a
    // phone, in Japanese.
    {
      subject: "hero",
      views: ["desk", "phone"],
      url: "/?lang=en&help=off",
      ready: READY,
      height: 1000,
      async prepare(page, { view }) {
        if (view === "phone") {
          await page.goto("http://hata.test/?lang=ja&help=off");
          await page.waitForSelector(READY);
        }
        await page.evaluate(() => window.scrollTo(0, 0));
        await pictures(page);
      },
    },
    // A flag's panel: Tokyo's, with its frames, facts and code.
    {
      subject: "detail",
      views: ["desk"],
      url: "/?lang=en&help=off&set=jp",
      ready: READY,
      height: 1000,
      async prepare(page) {
        await page.locator('[data-testid="tile-JP-13"]').click();
        await page.locator('#frames img[data-shape="round"]').waitFor();
        await pictures(page);
      },
    },
    // The quiz on a phone, in Japanese, after one answer.
    {
      subject: "quiz",
      views: ["phone"],
      url: "/?lang=ja&help=off&tab=quiz&mode=jp&seed=hata",
      ready: READY,
      async prepare(page) {
        await page.locator('[data-testid="choice-1"]').click();
        await page.locator('[data-testid="stage"]').evaluate((stage) => stage.scrollIntoView({ block: "center" }));
        await pictures(page);
      },
    },
  ],
});
