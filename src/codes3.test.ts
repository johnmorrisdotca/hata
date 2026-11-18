// findFlagCode in /names: a country by its alpha-3 or numeric code, from Kuni's table; no code of one place is another's.
import { country, COUNTRY_CODES } from "@johnmorrisdotca/kuni";
import { describe, expect, it } from "vitest";

import { ALPHA3, NUMERIC } from "./data/codes3.data";
import { FLAG_ALIASES, FLAG_CODES, flagCode } from "./index";
import { findFlagCode } from "./names";

describe("findFlagCode", () => {
  it("finds a country by its alpha-3 or numeric code, in any case and with leading zeros left out", () => {
    expect(findFlagCode("JPN")).toBe("JP");
    expect(findFlagCode("jpn")).toBe("JP");
    expect(findFlagCode("392")).toBe("JP");
    expect(findFlagCode("004")).toBe("AF");
    expect(findFlagCode("4")).toBe("AF");
    expect(findFlagCode(" gbr ")).toBe("GB");
  });

  it("still reads everything flagCode reads", () => {
    for (const input of ["jp", "JP-13", "ca_on", "urs", "SUHH", "GDR"]) expect(findFlagCode(input), input).toBe(flagCode(input));
  });

  it("finds nothing for a code no flag has, or two places held", () => {
    for (const input of ["XXX", "000", "999", "CS", "", "12345"]) expect(findFlagCode(input), input).toBeNull();
    expect(() => findFlagCode(392 as unknown as string)).toThrow(TypeError);
  });

  it("has Kuni's alpha-3 and numeric code for every country with a flag, and only those", () => {
    const countries = COUNTRY_CODES.filter((code) => (FLAG_CODES as readonly string[]).includes(code));
    expect(Object.keys(ALPHA3)).toHaveLength(countries.length);
    expect(Object.keys(NUMERIC)).toHaveLength(countries.length);
    for (const code of countries) {
      const one = country(code)!;
      expect(ALPHA3[one.alpha3], code).toBe(code);
      expect(NUMERIC[one.numeric], code).toBe(code);
      expect(findFlagCode(one.alpha3), code).toBe(code);
      expect(findFlagCode(one.numeric), code).toBe(code);
    }
  });

  it("has no code that is another place's: alpha-3 and numeric codes are one to one, and none is an alias or a flag's own code", () => {
    expect(new Set(Object.values(ALPHA3)).size).toBe(Object.keys(ALPHA3).length);
    expect(new Set(Object.values(NUMERIC)).size).toBe(Object.keys(NUMERIC).length);
    for (const alpha3 of Object.keys(ALPHA3)) {
      expect(FLAG_ALIASES[alpha3], `${alpha3} is also an alias`).toBeUndefined();
      expect((FLAG_CODES as readonly string[]).includes(alpha3), `${alpha3} is also a flag's code`).toBe(false);
    }
    for (const numeric of Object.keys(NUMERIC)) {
      expect(FLAG_ALIASES[numeric], numeric).toBeUndefined();
      expect((FLAG_CODES as readonly string[]).includes(numeric), numeric).toBe(false);
    }
  });
});
