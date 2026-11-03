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

// `only` names every subject this file makes, so the pictures `pnpm animations` makes (frames-live, provinces, former, element) are not removed as pictures no shot makes.
await takePictures({
  only: ["frames", "provenance", "hero", "detail", "quiz", "thumbnail"],
  shots: [
    { subject: "frames", views: ["desk"], url: "/?lang=en&help=off&set=jp", ready: READY, target: "#frames",
      async prepare(page) { await page.locator('[data-testid="tile-JP-13"]').click(); await page.locator('#frames img[data-shape="round"]').first().waitFor(); await pictures(page); } },
    { subject: "provenance", views: ["desk"], url: "/?lang=en&help=off&set=jp", ready: READY, target: "#facts",
      async prepare(page) { await page.locator('[data-testid="tile-JP-13"]').click(); await page.locator('#frames img[data-shape="round"]').first().waitFor(); await pictures(page); } },
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
  // The family's thumbnail, dark thumbnail and icon (scripts/family-thumbnail.mjs): flags of every shape at their true
  // proportions, Nepal's and Switzerland's among them, from the package's own SVG files; the icon is four bold ones.
  thumbnail: {
    url: "/?lang=en&help=off",
    ready: READY,
    target: "#thumbnail-stage",
    icon: { target: "#thumbnail-icon" },
    label: "Hata 旗",
    async prepare(page) {
      await page.evaluate(() => {
        const rows = [["jp", "ca", "ch", "br", "gb"], ["np", "za", "us-tx", "kr", "se", "ca-qc"], ["in", "jp-13", "bt", "mx", "au"]];
        const flag = (code, height) => `<img src="dist/svg/${code}.svg" alt="" style="height:${height}px;width:auto;display:block;box-shadow:0 1px 3px rgba(0,0,0,.28)${code === "np" ? ";box-shadow:none;filter:drop-shadow(0 1px 2px rgba(0,0,0,.3))" : ""}">`;
        const stage = `<div id="thumbnail-stage" style="display:flex;flex-direction:column;gap:22px;align-items:center;padding:12px;width:1160px">${rows.map((row) => `<div style="display:flex;gap:22px;align-items:center">${row.map((code) => flag(code, 116)).join("")}</div>`).join("")}</div>`;
        const icon = `<div id="thumbnail-icon" style="display:grid;grid-template-columns:auto auto;gap:14px;padding:8px;width:max-content">${["jp", "ca", "br", "gb"].map((code) => flag(code, 120)).join("")}</div>`;
        document.body.replaceChildren();
        document.body.insertAdjacentHTML("beforeend", stage + icon);
      });
      await pictures(page);
    },
  },
});
