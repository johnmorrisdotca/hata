// The gallery's chips: features and colours, each with how many flags a click would leave, combined as "and", the
// count live, the choices in the address, and where each feature comes from on a flag's panel.
import { expect, test } from "@playwright/test";

import { FLAG_CODES } from "../dist/index.js";
import { COLOUR_NAMES, countsWith, FLAG_TAGS, flagsWith, tagsOf } from "../dist/search.js";
import { at, noSidewaysScroll, open, tap } from "./demo.mjs";

const CHECKED = ["reviewed", "computed", "wikidata"];
const shown = (page) => page.locator(`${at("grid")} li:not([hidden])`);
const chip = (page, kind, name) => page.locator(at(`chip-${kind}-${name}`));
const unfold = async (page, testInfo) => {
  if ((await page.locator(at("chips-toggle")).getAttribute("aria-expanded")) === "false") await tap(page, at("chips-toggle"), testInfo);
};

test("every chip shows the number of flags it would leave, and a click leaves exactly those", async ({ page }, testInfo) => {
  const errors = await open(page, "?lang=en");
  await unfold(page, testInfo);
  const counts = countsWith({ sources: CHECKED });
  for (const [kind, names, key] of [["tag", FLAG_TAGS, "tags"], ["colour", COLOUR_NAMES, "colours"]]) {
    for (const name of names) {
      const one = chip(page, kind, name);
      await expect(one.locator("b"), name).toHaveText(String(counts[key][name]));
      if (counts[key][name] === 0) {
        await expect(one, name).toBeDisabled();
        continue;
      }
      await tap(page, one, testInfo);
      await expect(one, name).toHaveAttribute("aria-pressed", "true");
      await expect(shown(page), name).toHaveCount(counts[key][name]);
      await expect(page.locator(at("count"))).toHaveText(`${counts[key][name]} of ${FLAG_CODES.length} flags`);
      await tap(page, one, testInfo);
      await expect(shown(page), name).toHaveCount(FLAG_CODES.length);
    }
  }
  expect(errors).toEqual([]);
});

test("chips combine as and: the flags with every feature and every colour chosen, and the other chips follow", async ({ page }, testInfo) => {
  await open(page, "?lang=en&set=country");
  await unfold(page, testInfo);
  await tap(page, chip(page, "tag", "stars"), testInfo);
  await tap(page, chip(page, "tag", "stripes-horizontal"), testInfo);
  const both = flagsWith({ tags: ["stars", "stripes-horizontal"], sources: CHECKED, within: "countries" });
  await expect(shown(page)).toHaveCount(both.length);
  for (const code of ["CU", "IL", "SR"]) await expect(page.locator(at(`tile-${code}`)), code).toBeVisible();
  await expect(page.locator(at("tile-JP"))).toBeHidden();
  await tap(page, chip(page, "colour", "red"), testInfo);
  const red = flagsWith({ tags: ["stars", "stripes-horizontal"], colours: ["red"], sources: CHECKED, within: "countries" });
  await expect(shown(page)).toHaveCount(red.length);
  await expect(chip(page, "colour", "white").locator("b")).toHaveText(String(countsWith({ tags: ["stars", "stripes-horizontal"], colours: ["red"], sources: CHECKED, within: "countries" }).colours.white));
  await tap(page, at("chips-clear"), testInfo);
  await expect(shown(page)).toHaveCount(246);
});

test("red and white only finds Japan and Poland and leaves France out; text finds Brazil and Saudi Arabia", async ({ page }, testInfo) => {
  await open(page, "?lang=en&set=country");
  await unfold(page, testInfo);
  await tap(page, chip(page, "colour", "red"), testInfo);
  await tap(page, chip(page, "colour", "white"), testInfo);
  await expect(page.locator(at("tile-FR"))).toBeVisible();
  await tap(page, at("only"), testInfo);
  await expect(shown(page)).toHaveCount(flagsWith({ colours: ["red", "white"], only: true, sources: CHECKED, within: "countries" }).length);
  for (const code of ["JP", "PL", "CA", "CH"]) await expect(page.locator(at(`tile-${code}`)), code).toBeVisible();
  await expect(page.locator(at("tile-FR"))).toBeHidden();
  await expect(page).toHaveURL(/only=1/);
  await tap(page, at("chips-clear"), testInfo);
  await tap(page, chip(page, "tag", "text"), testInfo);
  await expect(shown(page)).toHaveCount(3);
  for (const code of ["BR", "SA", "IQ"]) await expect(page.locator(at(`tile-${code}`)), code).toBeVisible();
});

test("counts follow the set, the continent and the search, and the guesses are counted only when asked", async ({ page }, testInfo) => {
  await open(page, "?lang=en&set=jp");
  await unfold(page, testInfo);
  const inJapan = countsWith({ within: "JP", sources: CHECKED });
  for (const name of ["red", "white", "blue"]) await expect(chip(page, "colour", name).locator("b"), name).toHaveText(String(inJapan.colours[name]));
  await page.locator(at("search")).fill("tokyo");
  await expect(chip(page, "colour", "red").locator("b")).toHaveText(String(countsWith({ within: ["JP-13"], sources: CHECKED }).colours.red));
  await page.locator(at("search")).fill("");
  await page.locator(at("set")).selectOption("country");
  const stripes = flagsWith({ tags: ["stripes-horizontal"], sources: CHECKED, within: "countries" }).length;
  const guessed = flagsWith({ tags: ["stripes-horizontal"], within: "countries" }).length;
  expect(guessed).toBeGreaterThan(stripes);
  await expect(chip(page, "tag", "stripes-horizontal").locator("b")).toHaveText(String(stripes));
  await tap(page, at("guesses"), testInfo);
  await expect(chip(page, "tag", "stripes-horizontal").locator("b")).toHaveText(String(guessed));
  await expect(page).toHaveURL(/guesses=1/);
});

test("the address keeps the chips, and shows them open; the button hides them", async ({ page }, testInfo) => {
  await open(page, "?lang=en&set=country&features=stars&colours=red,white&only=1");
  const wanted = flagsWith({ tags: ["stars"], colours: ["red", "white"], only: true, sources: CHECKED, within: "countries" });
  await expect(page.locator(at("chips"))).toBeVisible();
  await expect(shown(page)).toHaveCount(wanted.length);
  await expect(chip(page, "tag", "stars")).toHaveAttribute("aria-pressed", "true");
  await expect(chip(page, "colour", "red")).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(at("only"))).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(at("chips-toggle"))).toContainText("3 chosen");
  await tap(page, at("chips-toggle"), testInfo);
  await expect(page.locator(at("chips"))).toBeHidden();
  await expect(page.locator(at("chips-toggle"))).toHaveAttribute("aria-expanded", "false");
  // A name the page does not know, and "only" with no colour, are left out of the address's meaning.
  await page.goto("https://hata.test/?lang=en&features=stars,nothing&only=1");
  await page.waitForSelector('main[data-ready="true"]');
  await expect(page.locator(at("chips-toggle"))).toContainText("1 chosen");
  await expect(page.locator(at("only"))).toHaveAttribute("aria-pressed", "false");
});

test("a flag's panel says where each feature comes from, and its colours", async ({ page }, testInfo) => {
  await open(page, "?lang=en");
  await tap(page, at("tile-BR"), testInfo);
  const facts = page.locator(at("facts"));
  await expect(facts).toContainText("Stars (Wikidata)");
  await expect(facts).toContainText("Text (Wikidata)");
  await expect(facts).toContainText("Green #");
  await tap(page, at("close"), testInfo);
  await tap(page, at("tile-DE"), testInfo);
  await expect(facts).toContainText("Horizontal stripes (measured from the drawing)");
  await tap(page, at("close"), testInfo);
  // A guess reads as one.
  const guess = FLAG_CODES.find((code) => code.length === 2 && tagsOf(code).some((one) => one.source === "unreviewed"));
  await tap(page, at(`tile-${guess}`), testInfo);
  await expect(facts).toContainText("(unchecked guess)");
  await tap(page, at("close"), testInfo);
  await tap(page, at("tile-AE"), testInfo);
  await expect(facts).toContainText("None recorded yet");
});

test("speaks Japanese, and fits a phone's width with the fold open", async ({ page }, testInfo) => {
  await open(page, "?lang=ja&features=stripes-horizontal");
  await expect(page.locator(at("chips-toggle"))).toHaveText("図柄と色 · 1 件選択中");
  await expect(chip(page, "tag", "stripes-horizontal")).toContainText("横縞");
  await expect(chip(page, "colour", "light-blue")).toContainText("水色");
  await expect(page.locator(at("only"))).toHaveText("選んだ色だけ");
  await noSidewaysScroll(page);
  await tap(page, at("tile-DE"), testInfo);
  await expect(page.locator(at("facts"))).toContainText("横縞 (図から計測)");
});
