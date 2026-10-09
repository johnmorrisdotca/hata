// Every curated crop, drawn in a real browser: it renders, it is the shape it was asked for, and it is kept at the side
// FOCUS (scripts/data-config.ts) says. The last is checked against a reference the test makes itself, the flag's own
// SVG cut at that side with a viewBox, so the check does not lean on the preserveAspectRatio that frame() writes.
import { expect, test } from "@playwright/test";

import { serve } from "./demo.mjs";

test("every curated crop renders at its shape, kept at the side chosen for it", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium-desk", "one browser is enough to measure pixels");
  test.setTimeout(300_000);
  await serve(page);
  await page.goto("https://hata.test/embed.html");
  const failures = await page.evaluate(async () => {
    const { FLAG_CODES, frame, toDataUri } = await import("./dist/index.js");
    const { flag } = await import("./dist/load.js");
    const { manifest } = await import("./dist/manifest.js");
    const SIZE = 96;
    const render = async (svg, width, height) => {
      const image = new Image();
      image.src = toDataUri(svg);
      await image.decode();
      const canvas = Object.assign(document.createElement("canvas"), { width, height });
      const context = canvas.getContext("2d");
      context.fillStyle = "#808080";
      context.fillRect(0, 0, width, height);
      context.drawImage(image, 0, 0, width, height);
      return context.getImageData(0, 0, width, height).data;
    };
    const difference = (one, other) => {
      let total = 0;
      for (let at = 0; at < one.length; at += 4) total += Math.abs(one[at] - other[at]) + Math.abs(one[at + 1] - other[at + 1]) + Math.abs(one[at + 2] - other[at + 2]);
      return total / ((one.length / 4) * 3);
    };
    const colours = (data) => new Set(Array.from({ length: data.length / 4 }, (_, at) => `${data[at * 4] >> 5}${data[at * 4 + 1] >> 5}${data[at * 4 + 2] >> 5}`)).size;
    const out = [];
    let checked = 0;
    for (const code of FLAG_CODES) {
      const record = manifest(code);
      if (record.sameAs !== null) continue;
      const svg = await flag(code);
      const [x, y, width, height] = /viewBox="([^"]+)"/.exec(svg)[1].split(/\s+/).map(Number);
      for (const [shape, target] of [["4:3", 4 / 3], ["1:1", 1]]) {
        const { crop } = record.framings[shape];
        if (crop.rule !== "curated") continue;
        const where = `${code} ${shape} at ${crop.at}`;
        const cropped = frame(svg, { shape, fit: "crop" });
        const [w, h] = shape === "4:3" ? [SIZE * 4 / 3, SIZE] : [SIZE, SIZE];
        const drawn = await render(cropped, w, h);
        // It renders: more than one colour, and not the grey the canvas was cleared to.
        if (colours(drawn) < 2) out.push(`${where} draws a blank`);
        if (width / height < target) continue;
        // It is kept at the side: the reference is the flag cut there, as wide as the shape asks of the flag's height.
        const cut = height * target;
        const left = crop.at === "left" ? x : x + width - cut;
        const reference = svg.replace(/viewBox="[^"]+"/, `viewBox="${left} ${y} ${cut} ${height}"`).replace(/\spreserveAspectRatio="[^"]*"/, "");
        const expected = await render(reference, w, h);
        const gap = difference(drawn, expected);
        if (gap > 6) out.push(`${where} is not the flag cut at its ${crop.at} (difference ${gap.toFixed(1)})`);
        // And it is not the centre crop, which is what it would be if the side were ignored.
        const centre = await render(frame(svg, { shape, fit: "cover" }), w, h);
        if (difference(drawn, centre) <= gap) out.push(`${where} is no nearer its side than the centre crop`);
        checked += 1;
      }
    }
    if (checked < 100) out.push(`only ${checked} curated crops were checked`);
    return out;
  });
  expect(failures).toEqual([]);
});
