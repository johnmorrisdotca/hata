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

// `only` names every subject this file makes, so the pictures `pnpm animations` makes (hero-desk, provinces, former, element) are not removed as pictures no shot makes.
await takePictures({
  only: ["frames", "provenance", "gallery", "hero", "detail", "quiz"],
  shots: [
    { subject: "frames", views: ["desk"], url: "/?lang=en&help=off&set=jp", ready: READY, target: "#frames",
      async prepare(page) { await page.locator('[data-testid="tile-JP-13"]').click(); await page.locator('#frames img[data-shape="round"]').first().waitFor(); await pictures(page); } },
    { subject: "provenance", views: ["desk"], url: "/?lang=en&help=off&set=jp", ready: READY, target: "#facts",
      async prepare(page) { await page.locator('[data-testid="tile-JP-13"]').click(); await page.locator('#frames img[data-shape="round"]').first().waitFor(); await pictures(page); } },
    // The gallery from the top of the page: the header, the shape bar, the filters and the first rows of flags, held at the
    // flags' own proportions (the page plays the frames by itself otherwise; this picture is of the gallery, and the hero is
    // the moving one). On a phone, in Japanese: the phone's hero, since the desk's is `pnpm animations`'s, not a screenshot.
    {
      subject: "gallery",
      views: ["desk"],
      url: "/?lang=en&help=off&shape=flag",
      ready: READY,
      height: 1000,
      async prepare(page) {
        await page.evaluate(() => window.scrollTo(0, 0));
        await pictures(page);
      },
    },
    {
      subject: "hero",
      views: ["phone"],
      url: "/?lang=ja&help=off&shape=flag",
      ready: READY,
      async prepare(page) {
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
        await page.locator('#frames img[data-shape="round"]').first().waitFor();
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
