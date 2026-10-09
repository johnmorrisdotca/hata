import { expect, test } from "@playwright/test";
import { serve } from "./demo.mjs";

test("the standalone builder restores a flag, writes every host format and fits a phone", async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: async (text) => void (window.__copied = text) } }));
  await serve(page);
  await page.goto("https://hata.test/builder.html?lang=en#make=flag&code=CA&width=120&shape=round&border=1");
  await expect(page.locator("html")).toHaveAttribute("data-ready", "true");
  await expect(page.locator("#bld-stage hata-flag")).toHaveAttribute("code", "CA");
  await expect(page.locator("#bld-stage hata-flag")).toHaveAttribute("width", "120");
  await expect(page.locator("#bld-stage hata-flag img")).toBeVisible();
  await page.locator("#opt-code").selectOption("JP");
  await expect(page.locator("#bld-code")).toContainText('code="JP"');
  for (const format of ["html", "url", "react", "vue", "svelte", "angular", "img", "data", "module", "iframe"]) {
    await page.locator(`[data-format="${format}"]`).click();
    await expect(page.locator("#bld-code")).not.toHaveText("");
  }
  await expect(page.locator("#bld-code")).toContainText("/hata/embed/?");
  await page.locator("#bld-link").click();
  expect(await page.evaluate(() => window.__copied)).toContain("code=JP");
  await page.locator('[data-lang="ja"]').click();
  await expect(page.locator("#opt-code")).toContainText("日本");
  await expect(page.locator("#bld-maker-says")).toContainText("旗");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
});

test("canonical iframe parameters are validated, and labels remain text", async ({ page }) => {
  await serve(page);
  const label = '<img src=x onerror="bad">';
  await page.goto(`https://hata.test/embed/?code=JP&width=120&size=small&border=off&shadow=no&lang=ja&label=${encodeURIComponent(label)}`);
  const flag = page.locator("hata-flag");
  await expect(flag.locator("img")).toBeVisible();
  await expect(flag).toHaveAttribute("aria-label", label);
  await expect(flag).toHaveAttribute("width", "120");
  await expect(flag).not.toHaveAttribute("border");
  await expect(flag).not.toHaveAttribute("shadow");
  await expect(page.locator("html")).toHaveAttribute("lang", "ja");
  expect(await page.locator("img").count()).toBe(1);
  expect(await page.evaluate(() => [document.documentElement.scrollWidth <= window.innerWidth, document.documentElement.scrollHeight <= window.innerHeight])).toEqual([true, true]);
  await page.goto("https://hata.test/embed/?code=not-a-code&width=Infinity&shape=wrong&lang=wrong");
  await expect(flag.locator("img")).toBeVisible();
  await expect(flag).toHaveAttribute("code", "JP");
  await expect(flag).not.toHaveAttribute("width");
});

test("element events cross shadow roots and agree with reflected false flags", async ({ page }) => {
  await serve(page);
  await page.goto("https://hata.test/embed/?code=JP");
  await expect(page.locator("hata-flag img")).toBeVisible();
  const result = await page.evaluate(async () => {
    const host = document.createElement("div");
    const shadow = host.attachShadow({ mode: "open" });
    const flag = document.createElement("hata-flag");
    flag.setAttribute("code", "JP");
    flag.setAttribute("loading", "eager");
    flag.setAttribute("width", "120");
    flag.setAttribute("border", "OFF");
    flag.setAttribute("shadow", "no");
    let event;
    host.addEventListener("hata-load", (made) => { event = { composed: made.composed, detail: made.detail }; });
    shadow.append(flag);
    document.body.append(host);
    await flag.ready;
    return { event, width: flag.width, border: flag.border, shadow: flag.shadow, pixels: flag.getBoundingClientRect().width };
  });
  expect(result).toMatchObject({ event: { composed: true, detail: { code: "JP", shape: "own" } }, width: "120", border: false, shadow: false, pixels: 120 });
});

test("the iframe posts the native JSON-safe event payload", async ({ page }) => {
  await serve(page);
  await page.route("https://host.test/", (route) => route.fulfill({ contentType: "text/html", body: '<script>window.messages=[];addEventListener("message",event=>{if(event.origin==="https://hata.test")messages.push(event.data);});</script><iframe src="https://hata.test/embed/?code=JP&width=120"></iframe>' }));
  await page.goto("https://host.test/");
  await expect.poll(() => page.evaluate(() => window.messages.some((message) => message.type === "hata-load"))).toBe(true);
  const message = await page.evaluate(() => window.messages.find((made) => made.type === "hata-load"));
  expect(message).toEqual({ type: "hata-load", detail: { code: "JP", shape: "own" } });
  expect(JSON.parse(JSON.stringify(message))).toEqual(message);
});
