// The earlier flags of present-day countries (scripts/historic-flags.ts) and the flag of a day: every dated variant has a
// source and dates in order that do not overlap, and `variantOn(code, date)` and `flag(code, { date })` answer for the
// day a flag changed, before the first flag the package knows, after the last, and for a former country outside its years.
import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { HISTORIC } from "../scripts/historic-flags";
import { flag } from "./load";
import { leftOut, manifest, MANIFEST, variantOn, variantsOf } from "./manifest";
import type { Variant } from "./manifest";

const DAY = /^\d{4}(-\d{2}(-\d{2})?)?$/;
// The first day after a flag's years, as the lookup reads them: a bare year or month is the whole of it.
const startOf = (variant: Variant): string => (variant.from ?? "0000").padEnd(10, "-01").replace(/^(\d{4})$/, "$1-01-01").replace(/^(\d{4}-\d{2})$/, "$1-01");
const next = (written: string): string => {
  const [year, month, day] = written.split("-").map(Number) as [number, number | undefined, number | undefined];
  const made = day !== undefined ? new Date(Date.UTC(year, month! - 1, day + 1)) : month !== undefined ? new Date(Date.UTC(year, month, 1)) : new Date(Date.UTC(year + 1, 0, 1));

  return made.toISOString().slice(0, 10);
};
const endOf = (variant: Variant): string | null => (variant.until === null ? null : variant.until.length === 10 ? variant.until : next(variant.until));
const dated = MANIFEST.filter((record) => record.variants.some((one) => (one.status === "official" || one.status === "historical") && (one.from !== null || one.until !== null)));

describe("the earlier flags of present-day countries", () => {
  it("are 35 countries' histories, each with the flag of today as its default and every one with a source, dates and two names", () => {
    expect(Object.keys(HISTORIC)).toHaveLength(35);
    const total = Object.values(HISTORIC).reduce((sum, set) => sum + set.variants.length, 0);
    expect(total).toBeGreaterThan(70);
    for (const [code, set] of Object.entries(HISTORIC)) {
      // A restricted flag is in no list unless asked for.
      const list = variantsOf(code, { allowRestricted: true });
      expect(list.length, code).toBe(set.variants.length);
      expect(variantsOf(code).length, code).toBe(set.variants.filter((one) => one.restricted === undefined).length);
      const today = list.find((one) => one.default)!;
      expect(today, code).toMatchObject({ status: "official", until: null });
      expect(today.module, code).toBe(manifest(code)!.code.toLowerCase());
      for (const one of list) {
        expect(one.source, `${code} ${one.id}`).toMatch(/^https:\/\//);
        expect(one.from, `${code} ${one.id}`).toMatch(DAY);
        if (one.until !== null) expect(one.until, `${code} ${one.id}`).toMatch(DAY);
        expect(one.name.length, `${code} ${one.id}`).toBeGreaterThan(5);
        expect(one.nameJa, `${code} ${one.id}`).toMatch(/[぀-ヿ一-鿿]/);
        if (!one.default) expect(one.status, `${code} ${one.id}`).toBe("historical");
      }
    }
  });

  it("are dated in order, each flag ending no earlier than it began and none overlapping the next in its role (a change within a bare year may share that year)", () => {
    for (const record of dated) {
      // A place has one legal flag and one flag in use on any day: the order is held for each role, by the days of the role.
      for (const role of ["legal", "in-use"] as const) {
        const list = record.variants.filter((one) => (one.status === "official" || one.status === "historical") && one.roleDates[role]?.from !== undefined && one.roleDates[role]?.from !== null);
        const span = (one: Variant): Variant => ({ ...one, from: one.roleDates[role]!.from, until: one.roleDates[role]!.until });
        const sorted = list.map(span).sort((a, b) => startOf(a).localeCompare(startOf(b)));
        sorted.forEach((one, at) => {
          const end = endOf(one);
          if (end !== null) expect(end > startOf(one), `${record.code} ${one.id} (${role}) ends before it begins`).toBe(true);
          const after = sorted[at + 1];
          if (after === undefined) {
            // The newest flag of a present-day country is open-ended; a former country's ended with it.
            if (record.historical === undefined) expect(end, `${record.code} ${one.id} (${role}) is the newest, so it is open-ended`).toBeNull();
            return;
          }
          expect(end, `${record.code} ${one.id} (${role}) has a successor, so it has an end`).not.toBeNull();
          // Where either date is a bare year or month the change fell somewhere in it: the two may share that period, and no more.
          const loose = one.until!.length < 10 || (after.from ?? "").length < 10;
          if (!loose) expect(end! <= startOf(after), `${record.code}: ${one.id} runs into ${after.id} (${role})`).toBe(true);
          else expect(one.until!.slice(0, 4) <= (after.from ?? "").slice(0, 4), `${record.code}: ${one.id} runs into ${after.id} (${role})`).toBe(true);
        });
      }
    }
  });

  it("name a drawing that is public domain, CC0 or CC BY, and a kind of source that says whether a better one is wanted", () => {
    const kinds = new Set<string>();
    for (const code of Object.keys(HISTORIC)) {
      for (const one of variantsOf(code)) {
        expect(["public-domain", "cc0", "cc-by"], `${code} ${one.id}`).toContain(one.drawing.licence.kind);
        kinds.add(one.sourceKind);
        // A page of an encyclopedia is the one kind that is not enough: it is flagged, never dressed as official.
        if (one.sourceKind === "encyclopedia") expect(one.source, `${code} ${one.id}`).toMatch(/wikipedia\.org/);
        else expect(one.source, `${code} ${one.id}`).not.toMatch(/wikipedia\.org/);
      }
    }
    expect([...kinds].sort()).toEqual(["encyclopedia", "official", "reference"]);
  });
});

describe("variantOn", () => {
  it("gives the flag a country had on a day, and the day it changed belongs to the new flag", () => {
    // The Union Flag was the legal flag until 1965 and the Red Ensigns were flown (docs/historical.md, "Legal flag and flag in use").
    expect(variantOn("CA", "1962-09-29")?.id).toBe("union-flag");
    expect(variantOn("CA", "1962-09-29", { role: "in-use" })?.id).toBe("red-ensign-1957");
    expect(variantOn("CA", "1965-02-14")?.id).toBe("union-flag");
    expect(variantOn("CA", "1965-02-14", { role: "in-use" })?.id).toBe("red-ensign-1957");
    expect(variantOn("CA", "1965-02-15", { role: "in-use" })?.id).toBe("maple-leaf");
    expect(variantOn("CA", "1965-02-15")?.id).toBe("maple-leaf");
    expect(variantOn("US", "1959-07-03")?.id).toBe("stars-48");
    expect(variantOn("US", "1959-07-04")?.id).toBe("stars-49");
    expect(variantOn("US", "1960-07-03")?.id).toBe("stars-49");
    expect(variantOn("US", "1960-07-04")?.id).toBe("stars-50");
    expect(variantOn("JP", "1999-08-12")?.id).toBe("hinomaru-1870");
    expect(variantOn("JP", "1999-08-13")?.id).toBe("hinomaru");
    expect(variantOn("DE", "1925-01-01")?.id).toBe("weimar-bkrg");
  });

  it("gives today's flag after the newest change, and the default is the same variant flag(code) draws", () => {
    for (const code of Object.keys(HISTORIC)) {
      const today = variantsOf(code).find((one) => one.default)!;
      expect(variantOn(code, "2100-01-01")?.id, code).toBe(today.id);
      expect(variantOn(code, new Date())?.id, code).toBe(today.id);
    }
    expect(variantOn("CA", "2026-11-17")?.default).toBe(true);
  });

  it("gives null before the first flag the package knows, and in a gap where a flag is not shipped", () => {
    expect(variantOn("CA", "1850-01-01")).toBeNull();
    expect(variantOn("US", "1895-12-31")).toBeNull();
    expect(variantOn("US", "1896-07-04")?.id).toBe("stars-45");
    expect(variantOn("CN", "1948-12-31")).toBeNull();
    expect(variantOn("CN", "1949-10-01")?.id).toBe("five-star-red");
    // The Red Ensigns of South Africa are not shipped (docs/decisions.md): no flag, not a wrong one.
    expect(variantOn("ZA", "1920-01-01")).toBeNull();
    // Germany's flag of 1935 to 1945 is restricted: found, with its reason, and never as a drawing (src/restricted.test.ts).
    expect(variantOn("DE", "1940-01-01")?.withheld).toBe(true);
  });

  it("reads a year, a month and a Date, and refuses what is not a date", () => {
    expect(variantOn("US", "1950")?.id).toBe("stars-48");
    expect(variantOn("US", "1959-06")?.id).toBe("stars-48");
    expect(variantOn("US", "1959-07")?.id).toBe("stars-48");
    expect(variantOn("US", "1959-08")?.id).toBe("stars-49");
    expect(variantOn("US", new Date(Date.UTC(1959, 6, 4)))?.id).toBe("stars-49");
    for (const bad of ["", "yesterday", "1959-13-01", "1959-02-30", "59", "1959/07/04", "1959-07-04T00:00", Number.NaN, 1959, null, undefined, new Date(Number.NaN)]) expect(() => variantOn("US", bad as unknown as string), String(bad)).toThrow(TypeError);
    expect(() => variantOn(1 as unknown as string, "1959")).toThrow(TypeError);
  });

  it("finds a place by any of its codes, and gives null for a place with no dated flags", () => {
    expect(variantOn("ca", "1962", { role: "in-use" })?.id).toBe("red-ensign-1957");
    expect(variantOn("xx", "1962")).toBeNull();
    expect(variantOn("AO", "1962")).toBeNull();
    expect(variantOn("JP-13", "1962")).toBeNull();
  });

  it("never gives a de-facto or a local flag, and keeps to the default where two flags claim a day", () => {
    expect(variantOn("AF", "2022-01-01")?.id).toBe("republic");
    expect(variantOn("GP", "2020-01-01")).toBeNull();
    expect(variantOn("SY", "2024-12-07")?.id).toBe("assad-era");
    expect(variantOn("SY", "2024-12-08")?.id).toBe("2025");
    expect(variantOn("GB-NIR", "1960-01-01")?.id).toBe("ulster-banner");
    expect(variantOn("GB-NIR", "1972-12-31")?.id).toBe("ulster-banner");
    expect(variantOn("GB-NIR", "1973-01-01")?.id).toBe("union-flag");
    expect(variantOn("GB-NIR", "1940-01-01")).toBeNull();
    expect(leftOut("GB-NIR")).not.toBeNull();
  });

  it("answers for a former country only within the years it existed, and only where one of its flags covers the day", () => {
    expect(variantOn("SUHH", "1960-05-01")?.id).toBe("1955");
    expect(variantOn("URS", "1950-01-01")?.id).toBe("1936");
    expect(variantOn("SU", "1955-08-18")?.id).toBe("1936");
    expect(variantOn("SU", "1955-08-19")?.id).toBe("1955");
    expect(variantOn("SUHH", "1991-12-24")?.id).toBe("1955");
    expect(variantOn("SUHH", "1991-12-25")).toBeNull();
    expect(variantOn("SUHH", "2020-01-01")).toBeNull();
    expect(variantOn("SUHH", "1930-01-01")).toBeNull();
    expect(variantOn("SUHH", "1921-12-31")).toBeNull();
    expect(variantOn("YUG", "1930")?.id).toBe("kingdom");
    expect(variantOn("YUG", "1941")?.id).toBe("kingdom");
    expect(variantOn("YUG", "1943")).toBeNull();
    expect(variantOn("YUG", "1960")?.id).toBe("sfry");
    expect(variantOn("YUG", "1992-04-27")?.id).toBe("fry");
    expect(variantOn("YUG", "2003-02-03")?.id).toBe("fry");
    expect(variantOn("YUG", "2003-02-04")).toBeNull();
    expect(variantOn("YUCS", "2004-01-01")).toBeNull();
    // A former country with one flag and no dated variant has no answer by date: ask for its flag.
    expect(variantOn("DDDE", "1970-01-01")).toBeNull();
    expect(variantOn("ZRCD", "1980-01-01")).toBeNull();
  });
});

describe("flag(code, { date })", () => {
  it("loads the flag of the day: the variant's own drawing, and today's after the newest change", async () => {
    expect(await flag("CA", { date: "1962-09-29", role: "in-use" })).toBe(await flag("CA", { variant: "red-ensign-1957" }));
    expect(await flag("CA", { date: "1962-09-29" })).toBe(await flag("CA", { variant: "union-flag" }));
    expect(await flag("CA", { date: "1962-09-29" })).toBe(await flag("GB"));
    expect(await flag("CA", { date: "1962-09-29" })).not.toBe(await flag("CA"));
    expect(await flag("CA", { date: "1965-02-15" })).toBe(await flag("CA"));
    expect(await flag("CA", { date: "2030-01-01" })).toBe(await flag("CA"));
    expect(await flag("US", { date: "1930" })).toBe(await flag("US", { variant: "stars-48" }));
    expect(await flag("urs", { date: "1960-01-01" })).toBe(await flag("SUHH"));
    expect(await flag("US", { date: new Date(Date.UTC(1910, 0, 1)) })).toBe(await flag("US", { variant: "stars-46" }));
  });

  it("frames the flag of the day like any flag, at its own proportions", async () => {
    const square = (await flag("JP", { date: "1950", shape: "1:1", label: "Japan, 1950" }))!;
    expect(square).toContain("<svg");
    expect(square).toContain("Japan, 1950");
    expect(await flag("JP", { date: "1950" })).toContain('viewBox="0 0 1000 700"');
    expect(await flag("JP", { date: "2000" })).not.toContain('viewBox="0 0 1000 700"');
  });

  it("gives null where no flag is known for the day, for a place with no dated flags, and for a code with no flag", async () => {
    expect(await flag("CA", { date: "1850" })).toBeNull();
    expect(await flag("SUHH", { date: "2000" })).toBeNull();
    expect(await flag("AO", { date: "2000" })).toBeNull();
    expect(await flag("XX", { date: "2000" })).toBeNull();
  });

  it("lets a variant win where both are asked for, and refuses a date that is not one, at once", async () => {
    expect(await flag("CA", { variant: "maple-leaf", date: "1950" })).toBe(await flag("CA"));
    expect(() => flag("CA", { date: "1950-02-30" })).toThrow(TypeError);
    expect(() => flag("CA", { date: 1950 as unknown as string })).toThrow(TypeError);
    expect(() => flag("CA", { date: "" })).toThrow(TypeError);
  });
});

// The history page is written from these flags, leaving out a restricted one. decisions.md used to keep an older count (MODULES-1610).
describe("the dated flags' source counts", () => {
  it("are the same numbers in the history page and in decisions.md", () => {
    const kinds = { official: 0, reference: 0, encyclopedia: 0 };
    let noted = 0;
    for (const set of Object.values(HISTORIC)) {
      for (const variant of set.variants) {
        if (variant.restricted !== undefined) continue;
        kinds[variant.sourceKind ?? "encyclopedia"] += 1;
        if (variant.roleNote !== undefined) noted += 1;
      }
    }
    const count = kinds.official + kinds.reference + kinds.encyclopedia;
    const both = count - noted;
    const historical = readFileSync("docs/historical.md", "utf8");
    const decisions = readFileSync("docs/decisions.md", "utf8");
    expect(historical).toContain(`Of the ${count} flags, ${kinds.official} have an official source, ${kinds.reference} a reference and ${kinds.encyclopedia} an encyclopedia page.`);
    expect(historical).toContain(`${both} of the ${count} flags are both on the same days as their own, and need no more. The ${noted} below are not`);
    expect(decisions).toContain(`The ${count} flags fall into: ${both} legal and in use on the same days; ${noted} with a note`);
    expect(decisions).toContain(`${kinds.official} have an official source (a government, parliament, archive or law text), ${kinds.reference} a reference and ${kinds.encyclopedia} only Wikipedia`);
  });
});
