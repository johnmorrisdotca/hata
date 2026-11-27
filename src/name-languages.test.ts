// Country names in the languages Kuni ships besides English and Japanese (MODULES-1432). Each language is its own entry.
import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { flagName } from "./names";
import { flagName as nameAr } from "./names/ar";
import { flagName as nameDe } from "./names/de";
import { flagName as nameEs } from "./names/es";
import { flagName as nameFr } from "./names/fr";
import { flagName as nameKo } from "./names/ko";
import { flagName as namePt } from "./names/pt";
import { flagName as nameRu } from "./names/ru";
import { flagName as nameHans } from "./names/zh-Hans";
import { flagName as nameHant } from "./names/zh-Hant";
import { extraLanguage, NAME_LANGUAGES } from "./names/languages";

describe("a country's name in another language", () => {
  it("reads Unicode CLDR's name from that language's entry, and null where Kuni has none", () => {
    expect(nameFr("JP")).toBe("Japon");
    expect(nameFr("jp")).toBe("Japon");
    expect(nameFr("DE")).toBe("Allemagne");
    expect(nameEs("JP")).toBe("Japón");
    expect(nameDe("FR")).toBe("Frankreich");
    expect(nameHans("DE")).toBe("德国");
    expect(nameHant("DE")).toBe("德國");
    expect(nameKo("JP")).toBe("일본");
    expect(namePt("DE")).toBe("Alemanha");
    expect(nameAr("JP")).toBe("اليابان");
    expect(nameRu("JP")).toBe("Япония");
    expect(nameFr("JP-13")).toBeNull();
    expect(nameFr("SUHH")).toBeNull();
    expect(() => nameFr(1 as unknown as string)).toThrow(TypeError);
  });

  it("leaves English and Japanese on /names", () => {
    expect(flagName("JP", "ja")).toBe("日本");
    expect(flagName("JP", "fr")).toBe("Japan");
    expect(flagName("JP")).toBe("Japan");
  });

  it("maps a page's language tag onto one entry", () => {
    expect(NAME_LANGUAGES).toEqual(["fr", "es", "de", "zh-Hans", "zh-Hant", "ko", "pt", "ar", "ru"]);
    expect(extraLanguage("fr-CA")).toBe("fr");
    expect(extraLanguage("pt-BR")).toBe("pt");
    expect(extraLanguage("zh-CN")).toBe("zh-Hans");
    expect(extraLanguage("zh-Hant")).toBe("zh-Hant");
    expect(extraLanguage("zh-TW")).toBe("zh-Hant");
    expect(extraLanguage("en")).toBeNull();
    expect(extraLanguage("ja-JP")).toBeNull();
    expect(extraLanguage("fi")).toBeNull();
  });

  it("offers each language in the builder, by that language's own name", () => {
    const demo = readFileSync("demo/embed-hata.js", "utf8");
    for (const language of NAME_LANGUAGES) expect(demo, language).toContain(`value: "${language}"`);
    expect(demo).toContain('{ value: "fr", label: { en: "français", ja: "français" } }');
    expect(readFileSync("demo/builder.js", "utf8")).toContain('"zh-Hans", "zh-Hant", "ko", "pt", "ar", "ru"');
  });
});
