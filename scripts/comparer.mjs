// Draws two SVGs in Chromium at one size and says what share of their pixels differ: the measure behind
// `pnpm data:compare` (is every shipped flag the picture Commons has?) and `pnpm data:tune` (how few decimals
// can each flag be rounded to and still be that picture?).
//
// Both are drawn as <img> into a canvas on white. A pixel counts as different when any channel differs by more
// than 48 of 255: anti-aliasing along an edge moves a few channels by less.
import { chromium } from "@playwright/test";

const CHANNEL = 48;

/**
 * A comparer with its own browser: `difference(a, b, width, height, options)` is a share from 0 to 1; `shares(svg,
 * width, height)` is the share of each named colour among the drawn pixels; `close()` ends it. `options.channel` is how far a pixel's channels may differ (48 when left out). `options.colours` compares
 * the names of the colours instead, so that two shades of one colour are the same: white, black, grey, red,
 * orange, yellow, green, blue, purple or pink. Two flag sets' palettes differ in shade; a design differs in colour.
 */
export async function openComparer() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setContent("<!doctype html><body></body>");
  const difference = (a, b, width, height, { channel = CHANNEL, colours = false } = {}) =>
    page.evaluate(
      async ({ a, b, width, height, channel, colours }) => {
        // The name of a colour, as a person would name it on a flag: white, black, grey, red, orange, yellow, green,
        // blue, purple or pink. Ranges of hue rather than equal slices, so that two blues (navy and royal) are one.
        const HUES = [[15, 3], [45, 4], [70, 5], [170, 6], [260, 7], [300, 8], [345, 9], [360, 3]];
        const name = (r, g, b) => {
          const high = Math.max(r, g, b) / 255;
          const low = Math.min(r, g, b) / 255;
          if (high < 0.27) return 1;
          const light = (high + low) / 2;
          const saturation = high === low ? 0 : (high - low) / (1 - Math.abs(2 * light - 1));
          if (light > 0.85 && saturation < 0.35) return 0;
          if (saturation < 0.18) return 2;
          const delta = high - low;
          let hue;
          if (high === r / 255) hue = (((g - b) / 255 / delta) % 6) * 60;
          else if (high === g / 255) hue = ((b - r) / 255 / delta + 2) * 60;
          else hue = ((r - g) / 255 / delta + 4) * 60;
          hue = (hue + 360) % 360;
          return HUES.find(([end]) => hue < end)[1];
        };
        const draw = async (svg) => {
          const image = new Image();
          image.src = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
          await image.decode();
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const context = canvas.getContext("2d");
          context.fillStyle = "#fff";
          context.fillRect(0, 0, width, height);
          context.drawImage(image, 0, 0, width, height);
          return context.getImageData(0, 0, width, height).data;
        };
        const [one, two] = await Promise.all([draw(a), draw(b)]);
        let different = 0;
        for (let at = 0; at < one.length; at += 4) {
          if (colours) {
            if (name(one[at], one[at + 1], one[at + 2]) !== name(two[at], two[at + 1], two[at + 2])) different += 1;
          } else if (Math.abs(one[at] - two[at]) > channel || Math.abs(one[at + 1] - two[at + 1]) > channel || Math.abs(one[at + 2] - two[at + 2]) > channel) different += 1;
        }
        return different / (width * height);
      },
      { a, b, width, height, channel, colours },
    );
  // The share of each named colour among a picture's drawn pixels (those not transparent), for the framing check:
  // does a frame keep the colours of the flag? Keys are the colour names, as `difference` names them.
  const shares = (svg, width, height) =>
    page.evaluate(
      async ({ svg, width, height }) => {
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
          hue = (hue + 360) % 360;
          return HUES.find(([end]) => hue < end)[1];
        };
        const image = new Image();
        image.src = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
        await image.decode();
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
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
        return Object.fromEntries(Object.entries(counts).map(([colour, count]) => [colour, count / Math.max(drawn, 1)]));
      },
      { svg, width, height },
    );
  return { difference, shares, close: () => browser.close() };
}
