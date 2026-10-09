// A place's other flags in real use: Afghanistan's two, Bavaria's two, Northern Ireland's two and no default, the French
// territories' local flags. Each has a status, dates and a reason, and its own module and Commons drawing.
import { describe, expect, it } from "vitest";

import { VARIANTS } from "../scripts/data-config";
import afghanistanTaliban from "./flags/af--de-facto";
import afghanistan from "./flags/af";
import britain from "./flags/gb";
import { aspectOf } from "./index";
import { flag } from "./load";
import { leftOut, manifest, MANIFEST, LEFT_OUT, variantsOf } from "./manifest";

describe("variantsOf", () => {
  it("lists Afghanistan's two flags, the Republic's tricolour the default and the Taliban's the de-facto one", () => {
    const list = variantsOf("AF");
    expect(list.map((one) => [one.id, one.status, one.default])).toEqual([["republic", "official", true], ["de-facto", "de-facto", false]]);
    expect(list[1]).toMatchObject({ from: "2021-08-15", until: null, module: "af--de-facto", name: "The Taliban's flag" });
    expect(manifest("AF")).toMatchObject({ disputed: true, defaultVariant: "republic" });
    expect(list[1]!.nameJa).not.toBe("");
    expect(list[1]!.why.length).toBeGreaterThan(40);
    expect(list[1]!.source).toMatch(/^https:\/\//);
  });

  it("gives a code that is the same place as another that place's variants, and none to a place with one flag", () => {
    expect(variantsOf("fr-971")).toEqual(variantsOf("GP"));
    expect(variantsOf("GP").map((one) => one.id)).toEqual(["france", "local"]);
    expect(variantsOf("JP")).toEqual([]);
    expect(variantsOf("XX")).toEqual([]);
    expect(manifest("JP")).toMatchObject({ disputed: false, defaultVariant: null, variants: [] });
    expect(() => variantsOf(1 as unknown as string)).toThrow(TypeError);
  });

  it("gives Northern Ireland no default flag and two to ask for, the Ulster Banner as history", () => {
    const list = variantsOf("GB-NIR");
    expect(list.map((one) => [one.id, one.status, one.default])).toEqual([["union-flag", "official", false], ["ulster-banner", "historical", false]]);
    expect(list[1]).toMatchObject({ from: "1953", until: "1972" });
    expect(leftOut("GB-NIR")).toMatchObject({ disputed: true, defaultVariant: null });
  });

  it("offers Bavaria's two flags of equal standing and Syria's before and after 2024-12-08", () => {
    expect(variantsOf("DE-BY").map((one) => [one.id, one.status])).toEqual([["lozenges", "official"], ["stripes", "official"]]);
    expect(variantsOf("SY").map((one) => [one.id, one.status, one.until])).toEqual([["2025", "official", null], ["assad-era", "historical", "2024-12-08"]]);
  });

  it("follows the data: every variant has a status, a reason, a source, a Japanese name and a shipped drawing, and at most one is the default", () => {
    for (const [code, set] of Object.entries(VARIANTS)) {
      const list = variantsOf(code);
      expect(list.map((one) => one.id), code).toEqual(set.variants.filter((one) => list.some((shown) => shown.id === one.id)).map((one) => one.id));
      expect(list.length, code).toBe(set.variants.length);
      expect(list.filter((one) => one.default).length, code).toBe(set.default === null ? 0 : 1);
      for (const one of list) {
        expect(["official", "de-facto", "historical", "local"], `${code} ${one.id}`).toContain(one.status);
        expect(one.why.length, `${code} ${one.id}`).toBeGreaterThan(40);
        expect(one.source, `${code} ${one.id}`).toMatch(/^https:\/\//);
        expect(one.nameJa, `${code} ${one.id}`).not.toBe("");
        expect(one.drawing.licence.kind, `${code} ${one.id}`).toMatch(/^(public-domain|cc0|cc-by|accepted|mit)$/);
        expect(one.drawing.page, `${code} ${one.id}`).toMatch(/^https:\/\//);
      }
    }
    for (const record of [...MANIFEST, ...LEFT_OUT]) expect(record.defaultVariant === null ? record.variants.every((one) => !one.default) : record.variants.find((one) => one.default)?.id).toBe(record.defaultVariant ?? true);
  });
});

describe("flag(code, { variant })", () => {
  it("gives the default when no variant is asked for, or the default's own id, and the other variant's drawing when it is", async () => {
    expect(await flag("AF")).toBe(afghanistan);
    expect(await flag("AF", { variant: "republic" })).toBe(afghanistan);
    expect(await flag("AF", { variant: "de-facto" })).toBe(afghanistanTaliban);
    expect(afghanistanTaliban).not.toBe(afghanistan);
    expect(afghanistanTaliban).toContain('data-hata="af--de-facto"');
  });

  it("gives null for a variant the place does not have, and for a place with no default flag until one is asked for", async () => {
    expect(await flag("AF", { variant: "nothing" })).toBeNull();
    expect(await flag("JP", { variant: "de-facto" })).toBeNull();
    expect(await flag("GB-NIR")).toBeNull();
    expect(await flag("GB-NIR", { variant: "union-flag" })).toBe(britain);
    expect(await flag("GB-NIR", { variant: "ulster-banner" })).toContain("<svg");
    expect(() => flag("AF", { variant: 1 as unknown as string })).toThrow(TypeError);
  });

  it("frames a variant like any flag, at its own proportions and never as another flag's", async () => {
    const square = (await flag("AF", { variant: "de-facto", shape: "1:1" }))!;
    expect(aspectOf(square)).toBe(1);
    expect(square).toContain("<svg");
    expect(aspectOf((await flag("AF", { variant: "de-facto" }))!)).toBeCloseTo(2);
    // Guadeloupe's French tricolour is France's picture, whatever its code.
    expect(await flag("GP", { variant: "france" })).toBe(await flag("FR"));
    expect(await flag("fr-971", { variant: "local" })).toBe(await flag("GP", { variant: "local" }));
    expect(await flag("GP")).toBe(await flag("FR"));
  });
});
