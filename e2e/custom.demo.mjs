// Flags a page registers itself, in a real browser: drawn by <hata-flag> and through innerHTML, with nothing from a hostile title getting out, and no custom code loaded for a page that uses none.
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { expect, test } from "@playwright/test";

const dist = join(dirname(fileURLToPath(import.meta.url)), "..", "dist");
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".json": "application/json", ".svg": "image/svg+xml" };

// A page served from the built package, with the script given.
async function open(page, script) {
  const requested = [];
  page.on("request", (request) => requested.push(new URL(request.url()).pathname));
  await page.route("https://hata.test/**", (route) => {
    const { pathname } = new URL(route.request().url());
    if (pathname === "/") return route.fulfill({ contentType: "text/html", body: `<!doctype html><meta charset="utf-8"><title>custom</title><div id="host"></div><script type="module">${script}</script>` });
    const file = join(dist, pathname.replace(/^\/dist\//, ""));
    if (!pathname.startsWith("/dist/") || !existsSync(file)) return route.fulfill({ status: 404, body: "" });
    return route.fulfill({ body: readFileSync(file), contentType: TYPES[file.slice(file.lastIndexOf("."))] ?? "application/octet-stream" });
  });
  await page.goto("https://hata.test/");
  return requested;
}

const SET = `{ kind: "records", info: { id: "mine", name: { en: "Mine", ja: "私の" }, credit: { en: "Mine", ja: "私の" }, licence: { name: "Mine to give", url: "https://example.org/t" }, url: "https://example.org", retrieved: "2026-11-13" }`;
const TITLE = "&lt;/svg&gt;&lt;img src=x onerror=window.pwned=1&gt;";

test("a registered flag is drawn by <hata-flag>, named for a screen reader, and a title with markup in it puts no element in the page", async ({ page }) => {
  await open(
    page,
    `import "/dist/element-define.js"; import { registerFlags, customFlag } from "/dist/custom.js";
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2"><title>${TITLE}</title><path fill="#036" d="M0 0h3v2H0z"/></svg>';
    window.done = await registerFlags(${SET}, records: () => [{ id: "custom:club", name: { en: "The Club", ja: "クラブ" }, svg }] });
    // The SVG as a page might put it in: through innerHTML.
    document.getElementById("host").innerHTML = customFlag("custom:club");
    document.body.insertAdjacentHTML("beforeend", '<hata-flag code="custom:club" size="48"></hata-flag>');
    window.ready = true;`,
  );
  await page.waitForFunction(() => window.ready === true);
  expect(await page.evaluate(() => window.done.added)).toEqual(["custom:club"]);
  // The hostile title came out as text: no image, no handler ran, and the one svg is the flag.
  expect(await page.locator("#host img").count()).toBe(0);
  expect(await page.evaluate(() => document.querySelectorAll("img").length)).toBe(await page.locator("hata-flag img").count());
  expect(await page.evaluate(() => window.pwned)).toBeUndefined();
  expect(await page.locator("#host svg").count()).toBe(1);
  expect(await page.locator("#host svg title").textContent()).toBe("</svg><img src=x onerror=window.pwned=1>");
  const element = page.locator("hata-flag");
  await expect(element.locator("img")).toHaveAttribute("src", /^data:image\/svg\+xml,/);
  await expect(element).toHaveAccessibleName("The Club");
  const box = await element.boundingBox();
  expect(box.width / box.height).toBeCloseTo(1.5, 1);
});

test("a flag with a script in it is refused and nothing of it reaches the page", async ({ page }) => {
  await open(
    page,
    `import { registerFlags, customFlag } from "/dist/custom.js";
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2" onload="window.pwned=1"><script>window.pwned=1<\\/script></svg>';
    window.done = await registerFlags(${SET}, records: () => [{ id: "custom:bad", name: { en: "Bad" }, svg }] });
    window.drawn = customFlag("custom:bad");
    window.ready = true;`,
  );
  await page.waitForFunction(() => window.ready === true);
  expect(await page.evaluate(() => [window.done.added, window.done.rejected.length, window.drawn, window.pwned])).toEqual([[], 1, null, undefined]);
});

test("a page that draws no custom flag never fetches the custom entry", async ({ page }) => {
  const requested = await open(page, `import "/dist/element-define.js"; document.body.insertAdjacentHTML("beforeend", '<hata-flag code="JP" size="48"></hata-flag>'); window.ready = true;`);
  await page.waitForFunction(() => window.ready === true);
  await expect(page.locator("hata-flag img")).toHaveAttribute("src", /^data:image\/svg\+xml,/);
  expect(requested.filter((path) => path.includes("custom"))).toEqual([]);
});
