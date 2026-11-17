// Germany's national flag of 1935 to 1945 is shipped for history and education and restricted by law outside them (MODULES-1447): the default
// lookups give its restriction and reason and never the drawing, and it is in no list, picker, quiz, pack or CDN listing.
import { existsSync, readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { FLAG_CODES } from "./index";
import { flag, flagOn as loadFlagOn } from "./load";
import { flagOn, LEFT_OUT, MANIFEST, RESTRICTED, variantOn, variantsOf } from "./manifest";

const built = (): void => {
  if (!existsSync("dist/manifest.json")) throw new Error("dist/manifest.json is not built: run pnpm build first (pnpm check does)");
};
const REASON = "Flag of Nazi Germany, 1935–1945. Shown for history and education. Displaying it is restricted by law in Germany and Austria outside those purposes.";

describe("the restricted flag", () => {
  it("is Germany's flag of 1935 to 1945, a restricted variant with its reason in both languages, its laws, who may use it and its source", () => {
    expect(RESTRICTED.map((one) => `${one.code} ${one.variant.id}`)).toEqual(["DE swastika-1935"]);
    const one = RESTRICTED[0]!.variant;
    expect(one.restricted).toEqual({ reason: REASON, reasonJa: expect.stringMatching(/[぀-ヿ一-鿿]/), law: ["DE StGB §86a", "AT Verbotsgesetz"], allowedFor: "education and history", allowedForJa: expect.stringMatching(/[぀-ヿ一-鿿]/) });
    expect(one).toMatchObject({ status: "historical", from: "1935-09-17", until: "1945-05-23", sourceKind: "official" });
    expect(one.source).toMatch(/^https:\/\//);
    expect(Object.isFrozen(RESTRICTED)).toBe(true);
  });

  it("passes the usual licence check: public domain on Commons, with the restriction Commons notes", () => {
    const one = RESTRICTED[0]!.variant;
    expect(one.drawing.licence.kind).toBe("public-domain");
    expect(one.drawing.page).toMatch(/^https:\/\/commons\.wikimedia\.org\/wiki\/File:/);
    expect(one.drawing.restrictions).toContain("nazi");
  });
});

describe("a default lookup never gives the drawing", () => {
  it("variantOn finds the day with its restriction and withheld, and gives it plainly only when asked", () => {
    for (const day of ["1935-09-17", "1940-01-01", "1945-05-22"]) {
      const found = variantOn("DE", day)!;
      expect(found.id).toBe("swastika-1935");
      expect(found.withheld).toBe(true);
      expect(found.restricted?.reason).toBe(REASON);
      expect(variantOn("DE", day, { role: "in-use" })!.withheld).toBe(true);
      expect(variantOn("DE", day, { allowRestricted: true })!.withheld).toBe(false);
    }
    expect(variantOn("DE", "1935-09-16")?.id).toBe("bwr-1933");
    expect(variantOn("DE", "1945-05-23")).toBeNull();
    expect(variantOn("DE", "2000-01-01")?.restricted).toBeNull();
    expect(variantOn("DE", "2000-01-01")?.withheld).toBe(false);
  });

  it("flag() gives null by date and by variant unless allowRestricted is given", async () => {
    expect(await flag("DE", { date: "1940" })).toBeNull();
    expect(await flag("DE", { date: "1940", role: "in-use" })).toBeNull();
    expect(await flag("DE", { variant: "swastika-1935" })).toBeNull();
    expect(await flag("DE", { variant: "swastika-1935", shape: "4:3" })).toBeNull();
    const drawn = await flag("DE", { date: "1940", allowRestricted: true });
    expect(drawn).toContain("<svg");
    expect(drawn).toBe(await flag("DE", { variant: "swastika-1935", allowRestricted: true }));
    expect(await flag("DE", { date: "1940", allowRestricted: false })).toBeNull();
    expect(() => flag("DE", { date: "1940", allowRestricted: "yes" as never })).toThrow(TypeError);
    // Asking for it does not change any other flag.
    expect(await flag("DE", { date: "2000", allowRestricted: true })).toBe(await flag("DE"));
  });

  it("flagOn says it is restricted, with the reason, and carries the drawing only when asked", async () => {
    expect(flagOn("DE", "1940").none).toEqual({ kind: "restricted", reason: REASON });
    expect(flagOn("DE", "1940", { allowRestricted: true }).none).toBeNull();
    const withheld = await loadFlagOn("DE", "1940");
    expect(withheld.svg).toBeNull();
    expect(withheld.none?.reason).toBe(REASON);
    expect(withheld.variant?.restricted?.law).toEqual(["DE StGB §86a", "AT Verbotsgesetz"]);
    expect((await loadFlagOn("DE", "1940", { allowRestricted: true })).svg).toContain("<svg");
  });
});

describe("it is left out of every list, picker, quiz, pack and listing", () => {
  it("is not in variantsOf, any record's variants, a place's variants of LEFT_OUT, or the codes a picker or a quiz draws from", () => {
    expect(variantsOf("DE").map((one) => one.id)).not.toContain("swastika-1935");
    expect(variantsOf("DE", { allowRestricted: true }).map((one) => one.id)).toEqual(["imperial-bwr", "weimar-bkrg", "bwr-1933", "swastika-1935", "federal-bkrg"]);
    for (const record of [...MANIFEST, ...LEFT_OUT]) for (const variant of record.variants) expect(variant.restricted, `${record.code} ${variant.id}`).toBeNull();
    expect(FLAG_CODES.filter((code) => /swastika|--/.test(code.toLowerCase()))).toEqual([]);
    expect(MANIFEST.map((record) => record.code)).toEqual([...FLAG_CODES]);
  });

  it("has no file in the CDN listing (dist/svg) and no record in manifest.json's list of flags, and a record of its own in manifest.json", () => {
    built();
    expect(existsSync("dist/svg/de--swastika-1935.svg")).toBe(false);
    expect(existsSync("dist/svg/de.svg")).toBe(true);
    // Built for the call that asks for it by name, and for nothing else.
    expect(existsSync("dist/flags/de--swastika-1935.js")).toBe(true);
    const json = JSON.parse(readFileSync("dist/manifest.json", "utf8")) as { flags: { variants: { id: string }[] }[]; leftOut: { variants: { id: string }[] }[]; restricted: { code: string; variant: { id: string } }[] };
    expect(JSON.stringify([json.flags, json.leftOut])).not.toContain("swastika-1935");
    expect(json.restricted.map((one) => `${one.code} ${one.variant.id}`)).toEqual(["DE swastika-1935"]);
  });

  it("is in none of the demo's lists: the gallery and quiz draw from the codes, the detail panel's switch from variantsOf, a download from the manifest", () => {
    // The gallery, the quiz's pools and the list downloads are built from the manifest's records (demo/demo.js reads MANIFEST and variants of those).
    const text = JSON.stringify(MANIFEST);
    expect(text).not.toContain("swastika-1935");
    expect(text).not.toContain("Flag of Germany (1935");
    expect(text).not.toContain("de--swastika");
    const demo = readFileSync("demo/demo.js", "utf8");
    expect(demo).not.toContain("allowRestricted");
    expect(demo).not.toContain("RESTRICTED");
  });
});
