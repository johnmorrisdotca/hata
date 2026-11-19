// The stylesheet and the sprite (src/sheets.ts), held to the manifest and to the files the build writes.
import { existsSync, readFileSync, readdirSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { FLAG_CODES } from "./data/codes.data";
import { MANIFEST } from "./manifest";
import { flagCss, flagSprite } from "./sheets";

describe("flagCss", () => {
  it("gives each flag asked for a class at its own proportions, reading its SVG file", async () => {
    const css = await flagCss(["jp", "CA-on"]);
    expect(css).toContain(".hata-jp{aspect-ratio:900/600;background-image:url(../svg/jp.svg)}");
    expect(css).toContain(".hata-ca-on{aspect-ratio:");
    expect(css).not.toContain(".hata-us{");
    expect(css).toContain(".hata{display:inline-block;");
  });

  it("reads the files from the folder it is given", async () => {
    expect(await flagCss(["jp"], { base: "/flags" })).toContain("background-image:url(/flags/jp.svg)");
  });

  it("frames a flag as the manifest says: a drawing made for the shape, a kept side, or the whole flag", async () => {
    const css = await flagCss(["ca", "us", "ch"]);
    // Canada's square and 4:3 are flag-icons' drawings, and round is the square in a circle.
    expect(css).toContain(".hata.hata-1x1.hata-ca{background-image:url(../svg/ca.1x1.svg)}");
    expect(css).toContain(".hata.hata-4x3.hata-ca{background-image:url(../svg/ca.4x3.svg)}");
    expect(css).toContain(".hata.hata-round.hata-ca{background-image:url(../svg/ca.1x1.svg)}");
    expect(css).toContain(".hata.hata-round{aspect-ratio:1;background-size:cover;border-radius:50%}");
  });

  it("keeps a crop at its side, and the whole flag on a neutral disc where a crop loses a colour", async () => {
    const crop = MANIFEST.find((one) => one.framings["1:1"].method === "crop");
    const whole = MANIFEST.find((one) => one.framings.round.method === "contain");
    expect(crop && whole).toBeTruthy();
    const css = await flagCss([crop!.code, whole!.code]);
    expect(css).toContain(`.hata.hata-1x1.hata-${crop!.code.toLowerCase()}{background-position:${crop!.framings["1:1"].crop.at}}`);
    expect(css).toMatch(new RegExp(`\\.hata\\.hata-round\\.hata-${whole!.code.toLowerCase()}\\{background-color:#e6e6e6;background-size:[\\d.]+%\\}`));
  });

  it("names a file that exists for every flag, every frame and every class, with every flag by default", async () => {
    const css = await flagCss();
    for (const code of FLAG_CODES) expect(css, code).toContain(`.hata-${code.toLowerCase()}{`);
    for (const [, file] of css.matchAll(/url\(\.\.\/svg\/([^)]+)\)/g)) expect(existsSync(`dist/svg/${file}`), file).toBe(true);
    expect(css.length).toBeLessThan(150_000);
  });

  it("refuses a code with no flag and a list that is not one", async () => {
    await expect(flagCss(["XX"])).rejects.toThrow(RangeError);
    await expect(flagCss("jp" as unknown as string[])).rejects.toThrow(TypeError);
    await expect(flagCss(["jp"], { base: 1 as unknown as string })).rejects.toThrow(TypeError);
  });
});

describe("flagSprite", () => {
  it("makes a symbol of each flag asked for, with the flag's viewBox and its drawing", async () => {
    const sprite = await flagSprite(["jp"]);
    expect(sprite.startsWith('<svg xmlns="http://www.w3.org/2000/svg">')).toBe(true);
    expect(sprite).toContain('<symbol id="hata-jp" viewBox="0 0 900 600">');
    expect(sprite).toContain("</symbol>");
    expect(sprite).not.toContain("data-hata");
  });

  it("writes a picture shared by two flags once, the second symbol using the first", async () => {
    const sprite = await flagSprite(["jp", "gf", "fr"]);
    expect(sprite.match(/<symbol /g)).toHaveLength(3);
    expect(sprite).toContain('<symbol id="hata-fr" viewBox="0 0 900 600"><use href="#hata-gf"/></symbol>');
    expect(sprite.match(/<path|<rect/g)!.length).toBeLessThan(10);
  });

  it("keeps the ids inside a drawing unique, so the sprite has no id twice", async () => {
    const sprite = await flagSprite(["np", "us", "gf", "fr"]);
    const ids = [...sprite.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("refuses a code with no flag", async () => {
    await expect(flagSprite(["XX"])).rejects.toThrow(RangeError);
  });
});

describe("the stylesheets the build writes", () => {
  it("hold a class for every flag in hata.css, and each flag in its group's", () => {
    const files = readdirSync("dist/css").sort();
    expect(files).toContain("hata.css");
    expect(files).toContain("countries.css");
    expect(files).toContain("former.css");
    expect(files).toContain("us-regions.css");
    const all = readFileSync("dist/css/hata.css", "utf8");
    for (const code of FLAG_CODES) expect(all, code).toContain(`.hata-${code.toLowerCase()}{`);
    expect(readFileSync("dist/css/us-regions.css", "utf8")).toContain(".hata-us-tx{");
    expect(readFileSync("dist/css/us-regions.css", "utf8")).not.toContain(".hata-jp-13{");
    expect(readFileSync("dist/css/countries.css", "utf8")).not.toContain(".hata-us-tx{");
  });
});
