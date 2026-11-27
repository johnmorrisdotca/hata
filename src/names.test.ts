// /names looks a flag up by more than its alpha-2, and gives the flag emoji back.
import { describe, expect, it } from "vitest";

import { flagCode as coreFlagCode } from "./index";
import { flagCode, flagEmoji } from "./names";

const tag = (region: string): string => `\u{1F3F4}${[...region].map((letter) => String.fromCodePoint(0xe0000 + letter.charCodeAt(0))).join("")}\u{E007F}`;

describe("flagCode in /names", () => {
  it("reads an alpha-3, a numeric code and an IOC code", () => {
    expect(flagCode("JPN")).toBe("JP");
    expect(flagCode("jpn")).toBe("JP");
    expect(flagCode("392")).toBe("JP");
    expect(flagCode("GER")).toBe("DE");
    expect(flagCode("SUI")).toBe("CH");
  });

  it("reads a name in English or Japanese, with Kuni's folding", () => {
    expect(flagCode("Holland")).toBe("NL");
    expect(flagCode("UK")).toBe("GB");
    expect(flagCode("日本")).toBe("JP");
    expect(flagCode("にほん")).toBe("JP");
    expect(flagCode("ドイツ")).toBe("DE");
    expect(flagCode("どいつ")).toBe("DE");
    expect(flagCode("Cote d'Ivoire")).toBe("CI");
  });

  it("reads a flag emoji, and still reads a subdivision and a former country", () => {
    expect(flagCode("🇯🇵")).toBe("JP");
    expect(flagCode(tag("gbeng"))).toBe("GB-ENG");
    expect(flagCode("jp-13")).toBe("JP-13");
    expect(flagCode("urs")).toBe("SUHH");
  });

  it("is null for a near miss, and the main entry still leaves alpha-3 to /names", () => {
    expect(flagCode("CS")).toBeNull();
    expect(flagCode("England")).toBeNull();
    expect(flagCode("Georgia")).toBeNull();
    expect(flagCode("")).toBeNull();
    expect(flagCode("XX")).toBeNull();
    expect(coreFlagCode("JPN")).toBeNull();
  });

  it("throws only for an argument that is not a string", () => {
    expect(() => flagCode(undefined as unknown as string)).toThrow(TypeError);
  });
});

describe("flagEmoji", () => {
  it("is the regional pair for a country and the tag sequence for England, Scotland and Wales", () => {
    expect(flagEmoji("JP")).toBe("\u{1F1EF}\u{1F1F5}");
    expect(flagEmoji("jpn")).toBe("\u{1F1EF}\u{1F1F5}");
    expect(flagEmoji("GB-ENG")).toBe(tag("gbeng"));
    expect(flagEmoji("GB-SCT")).toBe(tag("gbsct"));
    expect(flagEmoji("GB-WLS")).toBe(tag("gbwls"));
    expect(flagCode(flagEmoji("CH")!)).toBe("CH");
  });

  it("is null for a subdivision, a former country, and Northern Ireland", () => {
    expect(flagEmoji("JP-13")).toBeNull();
    expect(flagEmoji("SUHH")).toBeNull();
    expect(flagEmoji("GB-NIR")).toBeNull();
    expect(flagEmoji("England")).toBeNull();
  });
});
