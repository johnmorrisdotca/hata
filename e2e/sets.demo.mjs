// The pages of the sets drawn for this package (demo/sets/*.json), each held to the records the package holds: every flag is on the page,
// the kinds are chips that narrow it, a chosen flag shows its meaning and its source, and the page is the same in Japanese and never scrolls sideways.
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

import { expect, test } from "@playwright/test";

import { at, noSidewaysScroll, serve } from "./demo.mjs";

const SETS = await Promise.all(
  readdirSync(join(import.meta.dirname, "..", "demo", "sets")).filter((file) => file.endsWith(".json")).sort().map(async (file) => {
    const config = JSON.parse(readFileSync(join(import.meta.dirname, "..", "demo", "sets", file), "utf8"));
    const records = Object.values(await import(pathToFileURL(join(import.meta.dirname, "..", "src", "sets", `${config.name}.data.ts`)).href))[0];
    const records = Object.values(await import(pathToFileURL(join(import.meta.dirname, "..", "src", "sets", `${config.name}.data.ts`)).href))[0].filter((one) => one.restricted === undefined);
    return { config, records };
  }),
);

for (const { config, records } of SETS) {
  const open = async (page, query = "") => {
    const errors = [];
    page.on("pageerror", (error) => errors.push(String(error)));
    page.on("console", (message) => message.type() === "error" && errors.push(message.text()));
    await serve(page);
    await page.goto(`https://hata.test/${config.name}.html${query}`);
    await page.waitForSelector('main[data-ready="true"]');
    return errors;
  };

  test(`${config.name}: lists every flag of the set, narrows by kind and by a word, and has no folds`, async ({ page }) => {
    const errors = await open(page, "?lang=en");
    await expect(page.locator(at("tile"))).toHaveCount(records.length);
    expect(await page.locator("details").count()).toBe(0);
    const kinds = Object.keys(config.groups);
    await expect(page.locator(at("chip"))).toHaveCount(kinds.length + 1);
    for (const kind of kinds) {
      await page.locator(`${at("chip")}[data-kind="${kind}"]`).click();
      await expect(page.locator(at("tile")), kind).toHaveCount(records.filter((one) => one.group === kind).length);
    }
    await page.locator(`${at("chip")}[data-kind=""]`).click();
    await page.locator(at("search")).fill(records[0].name.en);
    await expect(page.locator(at("tile")).first()).toHaveAttribute("data-id", records[0].id);
    await page.locator(at("search")).fill("zzzzqqqq");
    await expect(page.locator(at("empty"))).toBeVisible();
    expect(errors).toEqual([]);
    await noSidewaysScroll(page);
  });

  test(`${config.name}: shows a chosen flag's meaning, status and source, in English and in Japanese`, async ({ page }) => {
    await open(page, "?lang=en");
    const one = records[1];
    await page.locator(`${at("tile")}[data-id="${one.id}"]`).click();
    await expect(page.locator(at("detail"))).toBeVisible();
    await expect(page.locator(at("detail"))).toContainText(one.about.en);
    await expect(page.locator(at("detail")).locator(`a[href="${one.source.url}"]`)).toBeVisible();
    await expect(page).toHaveURL(new RegExp(`id=${encodeURIComponent(one.id)}`));
    await open(page, `?lang=ja&id=${encodeURIComponent(one.id)}`);
    await expect(page.locator(at("detail"))).toContainText(one.about.ja);
    await expect(page.locator(at("tile"))).toHaveCount(records.length);
    await noSidewaysScroll(page);
  });
}
