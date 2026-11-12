// The family's page frame (kazoku-ui's page-frame): every page of the demo says what it is, links home and shows the
// flags' credits, on a desk and on a phone, with a title of its own. The embed pages carry the small credit line only
// where it is owed: a drawing under a licence that asks for credit (CC BY), so a public-domain flag's frame keeps its
// own size and loads nothing more.
import { readdirSync, readFileSync } from "node:fs";
import { pageProblems } from "@johnmorrisdotca/kazoku-ui/page-frame";
import { expect, test } from "@playwright/test";
import { serve } from "./demo.mjs";

const NOTICE = "https://github.com/johnmorrisdotca/hata/blob/main/NOTICE.md";
const PAGES = [
  { path: "index.html", en: "flags of countries and regions", ja: "国と地域の旗" },
  { path: "builder.html", en: "embed builder", ja: "埋め込みを作る" },
];

test("every page the build wrote has a title, a description, the header and the credit line", () => {
  const pages = readdirSync("site").filter((file) => file.endsWith(".html") && file !== "api.html");
  expect(pages).toEqual(expect.arrayContaining([...PAGES.map((one) => one.path), "embed.html"]));
  for (const name of pages) {
    const problems = pageProblems(readFileSync(`site/${name}`, "utf8"), { embed: name === "embed.html" });
    // embed.html's credit line has its words only when the flag shown owes a credit, so the built file carries the
    // empty, hidden line; the browser tests below check it is filled where it is owed and absent where it is not.
    if (name === "embed.html") expect(problems.filter((one) => !/credit/i.test(one)), name).toEqual([]);
    else expect(problems, name).toEqual([]);
  }
});

for (const lang of ["en", "ja"]) {
  for (const { path, en, ja } of PAGES) {
    test(`${path} in ${lang} says what it is, links home, and shows its credits`, async ({ page }) => {
      await serve(page);
      await page.goto(`https://hata.test/${path}?lang=${lang}`);
      const header = page.locator("kazoku-page-header");
      const what = lang === "ja" ? ja : en;
      await expect(header).toContainText(lang === "ja" ? "旗 Hata" : "Hata 旗");
      await expect(header).toContainText(what);
      await expect(header.getByRole("link").first()).toBeVisible();
      await expect(page).toHaveTitle(lang === "ja" ? `旗 Hata：${what}` : `Hata 旗: ${what}`);
      const credits = page.locator("kazoku-page-credits");
      await expect(credits).toBeVisible();
      await expect(credits).toContainText("Wikimedia Commons");
      await expect(credits.getByRole("link")).toHaveAttribute("href", NOTICE);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    });
  }
}

/** Record each hata-load from the start, so a test can wait for the flag to be drawn. */
const recordLoads = (page) =>
  page.addInitScript(() => {
    globalThis.__loads = [];
    globalThis.addEventListener("hata-load", (event) => globalThis.__loads.push(event.detail.code), true);
  });
const drawn = (page, code) => expect.poll(() => page.evaluate(() => globalThis.__loads)).toContain(code);

for (const path of ["embed.html", "embed/"]) {
  test(`${path} credits a CC BY drawing in its frame, and adds nothing for a public-domain flag`, async ({ page }) => {
    await serve(page);
    await recordLoads(page);
    const fetched = [];
    page.on("request", (request) => fetched.push(new URL(request.url()).pathname));
    // Japan's flag is public domain: once it is drawn, no credit line, and the page-frame part was not fetched
    await page.goto(`https://hata.test/${path}?code=JP`);
    await drawn(page, "JP");
    await expect(page.locator("kazoku-page-credits")).toBeHidden();
    expect(fetched.some((one) => one.endsWith("kazoku-page-frame.js"))).toBe(false);
    // Saint Barthélemy's local flag is CC BY 2.5: the licence links to its address, and the source to the drawing's page
    await page.goto("about:blank");
    await page.goto(`https://hata.test/${path}?code=BL&variant=local`);
    const credits = page.locator("kazoku-page-credits");
    await expect(credits).toBeVisible();
    await expect(credits).toHaveAttribute("embed", "");
    await expect(credits).toContainText("Flag: CC BY 2.5, Wikimedia Commons");
    const links = credits.getByRole("link");
    await expect(links).toHaveCount(2);
    await expect(credits.getByRole("link", { name: "CC BY 2.5" })).toHaveAttribute("href", /^https:\/\/creativecommons\.org\/licenses\/by\/2\.5/);
    await expect(credits.getByRole("link", { name: "Wikimedia Commons" })).toHaveAttribute("href", /^https:\/\/commons\.wikimedia\.org\//);
    // in someone else's frame each link opens a tab of its own, and never takes the frame away
    for (const link of await links.all()) {
      await expect(link).toHaveAttribute("target", "_blank");
      await expect(link).toHaveAttribute("rel", "noopener noreferrer");
    }
    // in Japanese, the same two links
    await page.goto("about:blank");
    await page.goto(`https://hata.test/${path}?code=BL&variant=local&lang=ja`);
    await expect(page.locator("kazoku-page-credits")).toContainText("旗：CC BY 2.5、Wikimedia Commons");
    await expect(page.locator("kazoku-page-credits").getByRole("link")).toHaveCount(2);
  });
}

test("embed.html takes its credit away when the address moves to a flag that owes none", async ({ page }) => {
  await serve(page);
  await recordLoads(page);
  await page.goto("https://hata.test/embed.html#code=BL&variant=local");
  await expect(page.locator("kazoku-page-credits")).toBeVisible();
  await page.evaluate(() => {
    location.hash = "code=JP";
  });
  await drawn(page, "JP");
  await expect(page.locator("kazoku-page-credits")).toBeHidden();
});

/** The builder's iframe for these choices, from a builder page in `lang`: its width, its height and the address it loads (on the test host). */
async function frameSize(page, hash, lang = "en") {
  await page.goto("about:blank");
  await page.goto(`https://hata.test/builder.html?lang=${lang}#make=flag&${hash}&show=iframe`);
  await expect(page.locator("#bld-stage hata-flag img")).toBeVisible();
  const code = (await page.locator('[data-testid="bld-embed"] [part="code"]').textContent()) ?? "";
  // the code is HTML, so its address has &amp; between the parameters
  const src = new URL((/src="([^"]+)"/.exec(code)?.[1] ?? "").replaceAll("&amp;", "&"), "https://hata.test/");
  return { width: Number(/width="(\d+)"/.exec(code)?.[1]), height: Number(/height="(\d+)"/.exec(code)?.[1]), src: `https://hata.test${src.pathname.replace(/^\/hata\//, "/")}${src.search}` };
}

// The licence asks for the credit to show, so the frame the builder writes must hold all of it: at each width the guides give, from an English and a Japanese builder page (the frame shows
// the builder page's language unless one is chosen, and is measured in the language it will show), and with Japanese chosen from the English page.
for (const width of [480, 240, 120])
  for (const [lang, chosen] of [["en", ""], ["ja", ""], ["en", "&lang=ja"]])
    test(`at ${width} px, from the ${lang} builder${chosen ? " with Japanese chosen" : ""}, the frame holds a CC BY flag at its full size with the whole credit line under it`, async ({ page, browser }) => {
      await serve(page);
      const plain = await frameSize(page, `code=BL&width=${width}&shape=4:3${chosen}`, lang);
      const owed = await frameSize(page, `code=BL&variant=local&width=${width}&shape=4:3${chosen}`, lang);
      expect(owed.width).toBe(plain.width);
      expect(owed.height).toBeGreaterThan(plain.height);
      const shown = chosen ? "ja" : lang;
      expect(new URL(owed.src).searchParams.get("lang"), "the frame's language: the one chosen, else the builder page's").toBe(shown);
      // the frame the code loads, at the size the builder gives it
      const measure = async (size, src, words) => {
        const frame = await browser.newPage({ viewport: size });
        await serve(frame);
        await frame.goto(src);
        await expect(frame.locator("hata-flag img, hata-flag svg").first()).toBeVisible();
        const flag = (await frame.locator("hata-flag").boundingBox()).height;
        const credits = frame.locator("kazoku-page-credits");
        const box = (await credits.isVisible()) ? await credits.boundingBox() : null;
        // the frame shows the credit in its own language
        if (words) await expect(credits).toContainText(words);
        await frame.close();
        return { flag, bottom: box ? box.y + box.height : 0 };
      };
      const without = await measure(plain, plain.src);
      const withCredit = await measure(owed, owed.src, shown === "ja" ? "旗：" : "Flag: ");
      expect(Math.abs(withCredit.flag - without.flag)).toBeLessThanOrEqual(1);
      expect(withCredit.bottom).toBeGreaterThan(0);
      expect(withCredit.bottom, "the whole credit line is inside the frame").toBeLessThanOrEqual(owed.height);
    });
