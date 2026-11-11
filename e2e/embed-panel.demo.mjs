// The builder's code section is kazoku-ui's <kazoku-embed-panel>, and it holds everything the code section held before:
// the eleven ways a page is made (<img> and the data: URI among them), Copy, "Copy a link to this flag"
// and "Start again", and adds the embed page, the guide and the credit of the chosen flag's drawing. The builder's
// preview and its choices stay the package's, so the panel shows neither.
import { expect, test } from "@playwright/test";
import { serve } from "./demo.mjs";

const TABS = [
  "Custom element",
  "<img>",
  "data: URI",
  "iframe",
  "ES module",
  "React 19",
  "Vue",
  "Svelte",
  "Angular",
  "Plain HTML",
  "iframe URL",
];
const panel = (page) => page.getByTestId("bld-embed");

test("the code section is the embed panel, with every item it had and the guide, the embed page and the flag's credit", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(String(error)));
  await serve(page);
  await page.goto("https://hata.test/builder.html?lang=en#make=flag&code=JP");
  await expect(page.locator("#bld-stage hata-flag img")).toBeVisible();
  // the eleven tabs, by their names, and the code of the one chosen
  await expect(panel(page).getByRole("tab")).toHaveText(TABS);
  await expect(panel(page).locator("[part=code]")).toContainText('code="JP"');
  // Copy, the two buttons of the builder in the panel's actions, and nothing of the old section left
  await expect(panel(page).locator("[part=copy]")).toBeVisible();
  await expect(panel(page).getByTestId("bld-link")).toHaveText("Copy a link to this flag");
  await expect(panel(page).getByTestId("bld-reset")).toHaveText("Start again");
  await expect(page.locator("#bld-code, #bld-formats, #bld-copy")).toHaveCount(0);
  // what the panel adds: the note, the embed page with the choices, the guide and the flag's credit
  await expect(panel(page).locator("[part=note]")).toHaveText(
    "Only choices that differ from the defaults are included in the code.",
  );
  await expect(panel(page).locator("[part=open]")).toHaveAttribute("href", /embed\/\?.*code=JP/);
  await expect(panel(page).locator("[part=docs]")).toHaveAttribute("href", "docs/guides/embed-in-an-iframe.html");
  await expect(panel(page).locator("[part=credits]")).toContainText("Flag drawing:");
  await expect(panel(page).locator("[part=credits]")).toContainText("Wikimedia Commons");
  // the preview and the size are the builder's own
  await expect(panel(page).locator("[part=preview]")).toBeHidden();
  await expect(panel(page).locator("[part=size]")).toBeHidden();
  // the <img> and data: URI tabs give their own code, and the tab chosen is kept in the address
  await panel(page).getByRole("tab", { name: "<img>", exact: true }).click();
  await expect(panel(page).locator("[part=code]")).toContainText("<img");
  await expect(page).toHaveURL(/show=img/);
  await panel(page).getByRole("tab", { name: "data: URI", exact: true }).click();
  await expect(panel(page).locator("[part=code]")).toContainText("data:image/svg+xml");
  // in Japanese: the tabs, the note, the builder's buttons, the guide and the credit
  await page.locator('kazoku-language-picker [data-v="ja"]').click();
  await expect(panel(page).getByRole("tab").first()).toHaveText("カスタム要素");
  await expect(panel(page).locator("[part=note]")).toHaveText("初期値と異なる選択だけがコードに含まれます。");
  await expect(panel(page).getByTestId("bld-link")).toHaveText("この旗へのリンクをコピー");
  await expect(panel(page).locator("[part=docs]")).toHaveAttribute("href", "docs/ja/guides/embed-in-an-iframe.html");
  await expect(panel(page).locator("[part=credits]")).toContainText("旗の図：");
  expect(errors).toEqual([]);
});

test("a page opened in Japanese gives the panel its Japanese tabs, note, buttons, guide and credit", async ({ page }) => {
  await serve(page);
  await page.goto("https://hata.test/builder.html?lang=ja");
  await expect(page.locator("#bld-stage hata-flag img")).toBeVisible();
  await expect(panel(page).getByRole("tab").first()).toHaveText("カスタム要素");
  await expect(panel(page).locator("[part=note]")).toHaveText("初期値と異なる選択だけがコードに含まれます。");
  await expect(panel(page).getByTestId("bld-link")).toHaveText("この旗へのリンクをコピー");
  await expect(panel(page).locator("[part=docs]")).toHaveAttribute("href", "docs/ja/guides/embed-in-an-iframe.html");
  await expect(panel(page).locator("[part=credits]")).toContainText("旗の図：");
});
