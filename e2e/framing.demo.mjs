// Every frame of every flag, as /load hands it to a page, keeps the colours the flag is made of: a colour that
// covers at least 5% of the flag still covers at least half that share of the frame. A centre crop of Canada's
// square, which keeps only the white pale and the leaf, fails this; so would any frame that misrepresents a flag.
import { expect, test } from "@playwright/test";

import { serve } from "./demo.mjs";

test("no frame of any flag loses a colour the flag is made of", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium-desk", "one browser is enough to measure colours");
  test.setTimeout(300_000);
  await serve(page);
  await page.goto("https://hata.test/embed.html");
  const failures = await page.evaluate(async () => {
    const { FLAG_CODES, toDataUri } = await import("./dist/index.js");
    const { flag } = await import("./dist/load.js");
    const { manifest } = await import("./dist/manifest.js");
    const HUES = [[15, "red"], [45, "orange"], [70, "yellow"], [170, "green"], [260, "blue"], [300, "purple"], [345, "pink"], [360, "red"]];
    const name = (r, g, b) => {
      const high = Math.max(r, g, b) / 255;
      const low = Math.min(r, g, b) / 255;
      if (high < 0.27) return "black";
      const light = (high + low) / 2;
      const saturation = high === low ? 0 : (high - low) / (1 - Math.abs(2 * light - 1));
      if (light > 0.85 && saturation < 0.35) return "white";
      if (saturation < 0.18) return "grey";
      const delta = high - low;
      let hue;
      if (high === r / 255) hue = (((g - b) / 255 / delta) % 6) * 60;
      else if (high === g / 255) hue = ((b - r) / 255 / delta + 2) * 60;
      else hue = ((r - g) / 255 / delta + 4) * 60;
      return HUES.find(([end]) => (hue + 360) % 360 < end)[1];
    };
    const shares = async (svg, width, height) => {
      const image = new Image();
      image.src = toDataUri(svg);
      await image.decode();
      const canvas = Object.assign(document.createElement("canvas"), { width, height });
      const context = canvas.getContext("2d");
      context.drawImage(image, 0, 0, width, height);
      const data = context.getImageData(0, 0, width, height).data;
      const counts = {};
      let drawn = 0;
      for (let at = 0; at < data.length; at += 4) {
        if (data[at + 3] < 200) continue;
        drawn += 1;
        const colour = name(data[at], data[at + 1], data[at + 2]);
        counts[colour] = (counts[colour] ?? 0) + 1;
      }
      return Object.fromEntries(Object.entries(counts).map(([colour, count]) => [colour, count / drawn]));
    };
    const out = [];
    for (const code of FLAG_CODES) {
      const record = manifest(code);
      if (record.sameAs !== null) continue;
      const full = await shares(await flag(code), 160, Math.round((160 * record.height) / record.width));
      for (const shape of ["4:3", "1:1", "round"]) {
        const framed = await shares(await flag(code, { shape }), 160, shape === "4:3" ? 120 : 160);
        // A whole flag on a neutral disc is the flag itself: the disc's grey is not one of its colours, and is left out.
        if (record.framings[shape].method === "contain") continue;
        // A crop kept at a side a person chose may drop a colour where FOCUS writes the reason beside it (docs/framing.md).
        if (record.framings[shape].method === "crop" && record.framings[shape].crop.loses.length > 0) continue;
        const lost = Object.entries(full).filter(([colour, share]) => share >= 0.05 && (framed[colour] ?? 0) < share * 0.5);
        if (lost.length > 0) out.push(`${code} ${shape} (${record.framings[shape].method}) loses ${lost.map(([colour, share]) => `${colour} ${Math.round(share * 100)}% to ${Math.round((framed[colour] ?? 0) * 100)}%`).join(", ")}`);
      }
    }
    return out;
  });
  expect(failures).toEqual([]);
});
