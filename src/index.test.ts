// The main entry: the codes, reading a code loosely, and a flag's address.
import { COUNTRY_CODES } from "@johnmorrisdotca/kuni";
import { describe, expect, it } from "vitest";

import * as main from "./index";
import { FLAG_CODES, flagCode, flagUrl, isFlagCode, VERSION } from "./index";

describe("FLAG_CODES", () => {
  it("is every code once, countries first then subdivisions, each as Kuni writes it", () => {
    expect(new Set(FLAG_CODES).size).toBe(FLAG_CODES.length);
    const countries = FLAG_CODES.filter((code) => code.length === 2);
    expect(FLAG_CODES.slice(0, countries.length)).toEqual(countries);
    for (const code of countries) expect(COUNTRY_CODES as readonly string[]).toContain(code);
    for (const code of FLAG_CODES.slice(countries.length)) expect(code).toMatch(/^(JP|CA|US)-[A-Z0-9]{1,3}$/);
    expect(FLAG_CODES).toContain("JP-13");
    expect(FLAG_CODES).toContain("CA-ON");
    expect(FLAG_CODES).toContain("US-TX");
  });

  it("carries no flag in the main entry", () => {
    expect(Object.keys(main).sort()).toEqual(["FLAG_CODES", "VERSION", "aspectOf", "flagCode", "flagUrl", "frame", "isFlagCode", "toDataUri"]);
  });
});

describe("isFlagCode", () => {
  it("is true only for a code exactly as Kuni writes it, and never throws", () => {
    expect(isFlagCode("JP")).toBe(true);
    expect(isFlagCode("JP-13")).toBe(true);
    expect(isFlagCode("jp")).toBe(false);
    expect(isFlagCode("EH")).toBe(false);
    expect(isFlagCode(undefined)).toBe(false);
    expect(isFlagCode(13)).toBe(false);
  });
});

describe("flagCode", () => {
  it("reads a code in either case, with spaces round it and an underscore for the hyphen", () => {
    expect(flagCode("jp")).toBe("JP");
    expect(flagCode(" Jp-13 ")).toBe("JP-13");
    expect(flagCode("ca_on")).toBe("CA-ON");
    expect(flagCode("us-tx")).toBe("US-TX");
  });

  it("answers null for a code with no flag, a malformed one, or one that is not a code", () => {
    for (const input of ["", "J", "JPN", "392", "XX", "JP-99", "JP 13", "EH", "日本"]) expect(flagCode(input), input).toBeNull();
  });

  it("throws only for an argument that is not a string", () => {
    expect(() => flagCode(undefined as unknown as string)).toThrow(TypeError);
  });
});

describe("flagUrl", () => {
  it("is the file on the CDN at this major version, or in a folder of one's own", () => {
    const major = VERSION.split(".")[0];
    expect(flagUrl("jp-13")).toBe(`https://cdn.jsdelivr.net/npm/@johnmorrisdotca/hata@${major}/dist/svg/jp-13.svg`);
    expect(flagUrl("US-TX", { base: "/flags/" })).toBe("/flags/us-tx.svg");
    expect(flagUrl("CA", { base: "https://example.com/f" })).toBe("https://example.com/f/ca.svg");
  });

  it("answers null for a code with no flag, and throws for misuse", () => {
    expect(flagUrl("XX")).toBeNull();
    expect(() => flagUrl("JP", { base: 1 as unknown as string })).toThrow(TypeError);
  });
});
