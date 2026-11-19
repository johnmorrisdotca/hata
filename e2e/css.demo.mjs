// The stylesheet's classes and the sprite's symbols draw what the package's own frames draw: each flag, in each frame the manifest gives a different treatment
// (its own drawing, a drawing made for the frame, a kept crop, the whole flag on a disc), is drawn by its class and as the framed SVG that /load hands out, and the two pictures agree.
import { expect, test } from "@playwright/test";

import { serve } from "./demo.mjs";

const SIZE = 96;

test("a class draws each flag in each frame as the framed SVG does", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium-desk", "one browser is enough to measure pixels");
  test.setTimeout(120_000);
  await serve(page);
  await page.goto("https://hata.test/embed.html");
  await page.addStyleTag({ url: "https://hata.test/dist/css/hata.css" });
  const cases = await page.evaluate(async (size) => {
    const { MANIFEST } = await import("./dist/manifest.js");
    const { flag } = await import("./dist/load.js");
    const { toDataUri } = await import("./dist/index.js");
    const picked = [["jp", "flag"], ["np", "flag"], ["ch", "flag"]];
    for (const [shape, key] of [["4:3", "4:3"], ["1:1", "1:1"], ["round", "round"]]) {
      const seen = new Set();
      for (const record of MANIFEST) {
        const framing = record.framings[key];
        const kind = `${framing.method} ${framing.fit} ${framing.crop.at}`;
        if (seen.has(kind)) continue;
        seen.add(kind);
        picked.push([record.code.toLowerCase(), shape]);
      }
    }
    const holder = document.body.appendChild(document.createElement("div"));
    holder.style.cssText = "position:absolute;left:0;top:0;background:#fff";
    const names = [];
    for (const [code, shape] of picked) {
      const row = holder.appendChild(document.createElement("div"));
      row.dataset.case = `${code} ${shape}`;
      row.style.cssText = "display:flex;gap:8px;padding:4px";
      const modifier = shape === "flag" ? "" : ` hata-${shape === "4:3" ? "4x3" : shape === "1:1" ? "1x1" : "round"}`;
      const cells = [0, 1].map(() => Object.assign(row.appendChild(document.createElement("div")), { className: "cell" }));
      for (const cell of cells) cell.style.cssText = `width:${size * 2}px;height:${size}px;overflow:hidden;flex:none;display:flex;align-items:center;justify-content:center`;
      const span = cells[0].appendChild(document.createElement("span"));
      span.className = `hata hata-${code}${modifier}`;
      span.style.cssText = `font-size:${size}px;vertical-align:top;flex:none`;
      const image = cells[1].appendChild(document.createElement("img"));
      const svg = await flag(code, shape === "flag" ? {} : { shape });
      image.src = toDataUri(svg);
      image.style.cssText = `width:${span.getBoundingClientRect().width}px;height:${size}px;flex:none`;
      await image.decode();
      const url = /url\("?([^")]+)"?\)/.exec(getComputedStyle(span).backgroundImage)?.[1];
      if (url === undefined) throw new Error(`${code} has no background image`);
      const loaded = new Image();
      loaded.src = url;
      await loaded.decode();
      names.push(`${code} ${shape}`);
    }
    return names;
  }, SIZE);
  expect(cases.length).toBeGreaterThan(20);

  const differences = [];
  for (const name of cases) {
    const row = page.locator(`[data-case="${name}"]`);
    const pictured = await row.locator(".cell").nth(0).screenshot({ omitBackground: false });
    const framed = await row.locator(".cell").nth(1).screenshot({ omitBackground: false });
    const mean = await page.evaluate(async ([a, b]) => {
      const load = async (base64) => {
        const image = new Image();
        image.src = `data:image/png;base64,${base64}`;
        await image.decode();
        const canvas = Object.assign(document.createElement("canvas"), { width: image.width, height: image.height });
        const context = canvas.getContext("2d");
        context.drawImage(image, 0, 0);
        return context.getImageData(0, 0, image.width, image.height);
      };
      const [one, other] = [await load(a), await load(b)];
      if (one.width !== other.width || one.height !== other.height) return 255;
      let total = 0;
      for (let at = 0; at < one.data.length; at += 1) total += Math.abs(one.data[at] - other.data[at]);
      return total / one.data.length;
    }, [pictured.toString("base64"), framed.toString("base64")]);
    if (mean > 4) differences.push(`${name}: ${mean.toFixed(2)}`);
  }
  expect(differences, "a class drew a flag differently from its framed SVG").toEqual([]);
});

test("a symbol of the sprite draws the flag, and the same flag as its file does", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium-desk", "one browser is enough to measure pixels");
  await serve(page);
  await page.goto("https://hata.test/embed.html");
  await page.evaluate(() => {
    document.body.insertAdjacentHTML(
      "beforeend",
      '<div id="sprites" style="position:absolute;left:0;top:0;background:#fff"><svg id="used" viewBox="0 0 1500 1000" width="150" height="100"><use href="sprite/jp-regions.svg#hata-jp-13"/></svg><img id="file" src="dist/svg/jp-13.svg" width="150" height="100"></div>',
    );
  });
  await page.locator("#file").evaluate((image) => image.decode());
  await expect.poll(async () => (await page.locator("#used").screenshot()).length).toBeGreaterThan(300);
  const [used, file] = [await page.locator("#used").screenshot(), await page.locator("#file").screenshot()];
  const mean = await page.evaluate(async ([a, b]) => {
    const load = async (base64) => {
      const image = new Image();
      image.src = `data:image/png;base64,${base64}`;
      await image.decode();
      const canvas = Object.assign(document.createElement("canvas"), { width: image.width, height: image.height });
      const context = canvas.getContext("2d");
      context.drawImage(image, 0, 0);
      return context.getImageData(0, 0, image.width, image.height);
    };
    const [one, other] = [await load(a), await load(b)];
    let total = 0;
    for (let at = 0; at < one.data.length; at += 1) total += Math.abs(one.data[at] - other.data[at]);
    return total / one.data.length;
  }, [used.toString("base64"), file.toString("base64")]);
  expect(mean).toBeLessThan(3);
});
