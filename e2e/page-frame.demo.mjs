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

for (const path of ["embed.html", "embed/"]) {
  test(`${path} credits a CC BY drawing in its frame, and adds nothing for a public-domain flag`, async ({ page }) => {
    await serve(page);
    const fetched = [];
    page.on("request", (request) => fetched.push(new URL(request.url()).pathname));
    // Japan's flag is public domain: no credit line, and the page-frame part is not fetched
    await page.goto(`https://hata.test/${path}?code=JP`);
    await expect(page.locator("hata-flag")).toHaveAttribute("code", "JP");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("kazoku-page-credits")).toBeHidden();
    expect(fetched.some((one) => one.endsWith("kazoku-page-frame.js"))).toBe(false);
    // Saint Barthélemy's local flag is CC BY 2.5: its author, its licence and a link to its page, in the small form
    await page.goto("about:blank");
    await page.goto(`https://hata.test/${path}?code=BL&variant=local`);
    const credits = page.locator("kazoku-page-credits");
    await expect(credits).toBeVisible();
    await expect(credits).toHaveAttribute("embed", "");
    await expect(credits).toContainText("CC BY 2.5, Wikimedia Commons");
    await expect(credits.getByRole("link")).toHaveAttribute("href", /commons\.wikimedia\.org/);
    await expect(credits.getByRole("link")).toHaveAttribute("target", "_blank");
  });
}

test("the builder makes a CC BY flag's frame taller by its credit line, and a public-domain flag's its own size", async ({ page }) => {
  await serve(page);
  const height = async (hash) => {
    await page.goto("about:blank");
    await page.goto(`https://hata.test/builder.html?lang=en#make=flag&${hash}&show=iframe`);
    const code = await page.locator('[data-testid="bld-embed"] [part="code"]').textContent();
    return Number(/height="(\d+)"/.exec(code ?? "")?.[1]);
  };
  // a wide frame takes the line once; a narrow one as many times as the line wraps
  expect((await height("code=BL&variant=local&width=480&shape=4:3")) - (await height("code=BL&width=480&shape=4:3"))).toBe(2 * 18);
  expect((await height("code=BL&variant=local&width=120&shape=4:3")) - (await height("code=BL&width=120&shape=4:3"))).toBe(5 * 18);
});
