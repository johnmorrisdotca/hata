// The former countries (HISTORICAL in scripts/data-config.ts): found by their own code and by the codes a table of sport
// holds for them, drawn at their true shapes, kept apart where they share a picture with a present-day place, and listed
// with the reason where an Olympic team has no flag of its own.
import { describe, expect, it } from "vitest";

import { ALIASES, HISTORICAL } from "../scripts/data-config";
import { aspectOf, FLAG_ALIASES, FLAG_CODES, flagCode, flagUrl, isFlagCode } from "./index";
import { flag } from "./load";
import { leftOut, manifest, MANIFEST, LEFT_OUT, variantsOf } from "./manifest";
import { flagAspect, flagName } from "./names";

const WITH_FLAG = Object.entries(HISTORICAL).filter(([, spec]) => spec.file !== null);
const WITHOUT = Object.entries(HISTORICAL).filter(([, spec]) => spec.file === null);

describe("the former countries' codes", () => {
  it("are flags for twelve places and reasons for the rest, each under a code no present-day place has", () => {
    expect(WITH_FLAG.map(([code]) => code).sort()).toEqual(["ANHH", "BOH", "BUMM", "CSHH", "CSXX", "DDDE", "FRG", "RHZW", "SUHH", "WIF", "YUCS", "ZRCD"]);
    for (const [code] of WITH_FLAG) expect(FLAG_CODES as readonly string[], code).toContain(code);
    for (const [code] of WITHOUT) expect(LEFT_OUT.some((one) => one.code === code), code).toBe(true);
    expect(manifest("SUHH")?.historical).toEqual({ from: "1922", until: "1991", aliases: ["SU", "SUN", "URS"] });
    expect(manifest("JP")?.historical).toBeUndefined();
  });

  it("are found by their aliases, in any case, by every lookup", async () => {
    for (const [alias, code] of [["su", "SUHH"], ["SUN", "SUHH"], ["URS", "SUHH"], ["dd", "DDDE"], ["GDR", "DDDE"], ["DDR", "DDDE"], ["tch", "CSHH"], ["CSK", "CSHH"], ["YU", "YUCS"], ["yug", "YUCS"], ["SCG", "CSXX"], ["AHO", "ANHH"], ["ZAI", "ZRCD"], ["BIR", "BUMM"], ["RHO", "RHZW"], ["BWI", "WIF"]] as const) {
      expect(flagCode(alias), alias).toBe(code);
      expect(manifest(alias)?.code, alias).toBe(code);
      expect(flagName(alias), alias).toBe(manifest(code) === null ? null : flagName(code));
      expect(flagAspect(alias), alias).toBe(flagAspect(code));
      expect(flagUrl(alias, { base: "/f" }), alias).toBe(`/f/${code.toLowerCase()}.svg`);
      expect(await flag(alias), alias).toBe(await flag(code));
      expect(await flag(alias), alias).toContain("<svg");
    }
  });

  it("have aliases that are no code of a flag, belong to one place, and say which place they find", () => {
    for (const [alias, code] of Object.entries(FLAG_ALIASES)) {
      expect(isFlagCode(alias), alias).toBe(false);
      expect(FLAG_CODES as readonly string[], alias).not.toContain(alias);
      expect(HISTORICAL[code]?.aliases, alias).toContain(alias);
    }
    expect({ ...FLAG_ALIASES }).toEqual({ ...ALIASES });
    expect(Object.values(HISTORICAL).flatMap((spec) => spec.aliases).length).toBe(Object.keys(FLAG_ALIASES).length);
  });

  it("leave CS to nobody: Czechoslovakia and Serbia and Montenegro both held it, so a near miss would draw the wrong country", async () => {
    expect(flagCode("CS")).toBeNull();
    expect(await flag("cs")).toBeNull();
    expect(manifest("CS")).toBeNull();
    expect(leftOut("CS")?.reason).toMatch(/CSHH.*TCH.*CSXX.*SCG/s);
    expect(flagCode("CSHH")).toBe("CSHH");
    expect(flagCode("CSXX")).toBe("CSXX");
  });
});

describe("the former countries' flags", () => {
  it("are drawn at their true proportions", () => {
    const official: Record<string, number> = { SUHH: 2, DDDE: 5 / 3, FRG: 5 / 3, CSHH: 3 / 2, YUCS: 2, CSXX: 2, ANHH: 3 / 2, BUMM: 9 / 5, ZRCD: 3 / 2, RHZW: 2, BOH: 3 / 2, WIF: 2 };
    for (const [code, ratio] of Object.entries(official)) {
      const record = manifest(code)!;
      expect(record.width / record.height, code).toBeCloseTo(ratio, 1);
      expect(flagAspect(code), code).toBeCloseTo(ratio, 1);
    }
  });

  it("are public domain on Commons, with an author named, and the restrictions Commons notes recorded as it gives them", () => {
    for (const [code] of WITH_FLAG) {
      const record = manifest(code)!;
      expect(record.source, code).toBe("commons");
      expect(["public-domain", "cc0"], code).toContain(record.licence.kind);
      expect(record.author?.trim().length, code).toBeGreaterThan(2);
    }
    expect(manifest("SUHH")?.restrictions).toEqual(expect.arrayContaining(["communist", "insignia"]));
  });

  it("keep West Germany and Czechoslovakia apart from today's places while drawing the one picture", async () => {
    expect(manifest("FRG")?.sameAs).toBe("DE");
    expect(manifest("CSHH")?.sameAs).toBe("CZ");
    expect(await flag("FRG")).toBe(await flag("DE"));
    expect(await flag("TCH")).toBe(await flag("CZ"));
    expect(flagCode("FRG")).not.toBe(flagCode("DE"));
  });

  it("give Yugoslavia its star flag, and the Federal Republic's and the Kingdom's on request, dated", async () => {
    const list = variantsOf("YU");
    expect(list.map((one) => [one.id, one.default, one.status, one.from, one.until])).toEqual([
      ["sfry", true, "official", "1946", "1992-04-27"],
      ["fry", false, "official", "1992-04-27", "2003-02-04"],
      ["kingdom", false, "historical", "1918", "1941"],
    ]);
    const star = (await flag("YUG"))!;
    expect(star).toContain("<path");
    expect(await flag("YUG", { variant: "sfry" })).toBe(star);
    expect(await flag("YUG", { variant: "kingdom" })).not.toBe(star);
    // The Federal Republic's tricolour is the one picture Commons keeps for 1992 to 2006: Serbia and Montenegro's too.
    expect(await flag("YU", { variant: "fry" })).toBe(await flag("SCG"));
    expect(await flag("YU", { variant: "nothing" })).toBeNull();
  });

  it("give the Soviet Union its flag of 1955 to 1991 and Burma its flag of 1974 to 2010, each with the earlier one as a variant, framed at the side that keeps the emblem", async () => {
    expect(variantsOf("URS").map((one) => one.id)).toEqual(["1955", "1936"]);
    expect(variantsOf("BUMM").map((one) => one.id)).toEqual(["socialist", "union"]);
    expect(manifest("SUHH")?.framings["1:1"].crop).toMatchObject({ rule: "curated", at: "left" });
    expect(aspectOf((await flag("URS", { shape: "1:1" }))!)).toBe(1);
    expect(aspectOf((await flag("SU", { variant: "1936", shape: "1:1" }))!)).toBe(1);
    expect(await flag("SU", { variant: "1936" })).not.toBe(await flag("SU"));
  });

  it("are named in English and Japanese", () => {
    expect(flagName("SUHH")).toBe("Soviet Union");
    expect(flagName("DDR", "ja")).toBe("東ドイツ");
    expect(flagName("FRG", "ja-JP")).toBe("西ドイツ");
    for (const [code, spec] of WITH_FLAG) {
      expect(flagName(code, "en"), code).toBe(spec.en);
      expect(flagName(code, "ja"), code).toBe(spec.ja);
    }
  });
});

describe("the Olympic teams and other codes with no flag", () => {
  it("give no flag and say why: the Olympic flag is the IOC's mark, not a country's", async () => {
    for (const code of ["EUN", "EUA", "ROC", "OAR", "AIN", "IOP", "EOR"]) {
      expect(flagCode(code), code).toBeNull();
      expect(await flag(code), code).toBeNull();
      expect(manifest(code), code).toBeNull();
      const record = leftOut(code)!;
      expect(record.kind, code).toBe("no-flag");
      expect(record.reason, code).toMatch(/Olympic flag|rings|emblem/);
      expect(record.historical, code).toBeDefined();
    }
    expect(leftOut("ROT")?.code).toBe("EOR");
    expect(leftOut("EUN")?.reason).toContain("does not ship the Olympic rings");
  });

  it("are not in the manifest of flags, and every one of them has its years", () => {
    for (const [code] of WITHOUT) expect(MANIFEST.some((one) => one.code === code), code).toBe(false);
    for (const one of LEFT_OUT.filter((record) => HISTORICAL[record.code] !== undefined)) expect(one.historical?.from, one.code).toMatch(/^\d{4}$/);
  });
});
