// The legal flag and the flag in use (MODULES-1447): every earlier flag has a role, where the two differ both are kept with the reason and its
// source, `variantOn(code, date)` gives the legal flag and `{ role: "in-use" }` the other, and a day with nothing to draw says why.
import { describe, expect, it } from "vitest";

import { HISTORIC } from "../scripts/historic-flags";
import { flag, flagOn as loadFlagOn } from "./load";
import { flagOn, MANIFEST, variantOn, variantsOf } from "./manifest";
import type { Variant } from "./manifest";

const every = Object.keys(HISTORIC).flatMap((code) => variantsOf(code, { allowRestricted: true }).map((variant) => ({ code, variant })));
const sameDays = (variant: Variant): boolean => ["legal", "in-use"].every((role) => variant.roleDates[role as "legal" | "in-use"]?.from === variant.from && variant.roleDates[role as "legal" | "in-use"]?.until === variant.until);

describe("every earlier flag has a role", () => {
  it("is each of the 82 dated flags either legal, in use or both, with the days of each role", () => {
    expect(every).toHaveLength(82);
    for (const { code, variant } of every) {
      expect(variant.roles.length, `${code} ${variant.id}`).toBeGreaterThan(0);
      expect(new Set(variant.roles).size, `${code} ${variant.id}`).toBe(variant.roles.length);
      expect(Object.keys(variant.roleDates).sort(), `${code} ${variant.id}`).toEqual([...variant.roles].sort());
    }
  });

  it("says why, with a source, wherever the flag is not both on the same days; and nowhere else", () => {
    let noted = 0;
    for (const { code, variant } of every) {
      const same = variant.roles.length === 2 && sameDays(variant);
      if (same) expect(variant.roleNote, `${code} ${variant.id}`).toBeNull();
      else {
        noted += 1;
        expect(variant.roleNote, `${code} ${variant.id} differs, so it needs a reason`).not.toBeNull();
        expect(variant.roleNote!.why.length, `${code} ${variant.id}`).toBeGreaterThan(80);
        expect(variant.roleNote!.source, `${code} ${variant.id}`).toMatch(/^https:\/\//);
        expect(["official", "reference", "encyclopedia"]).toContain(variant.roleNote!.sourceKind);
      }
    }
    // Canada 4, Australia 4, New Zealand 2, Ukraine 2.
    expect(noted).toBe(12);
  });

  it("keeps a flag a role has no days for out of that role's answers", () => {
    for (const { variant } of every) for (const role of Object.keys(variant.roleDates)) expect(variant.roles, role).toContain(role);
  });

  it("gives a flag that is neither official nor historical no role (it never has a turn)", () => {
    for (const record of MANIFEST) for (const variant of record.variants) if (variant.status === "de-facto" || variant.status === "local") expect(variant.roles, `${record.code} ${variant.id}`).toEqual([]);
  });
});

describe("variantOn with a role", () => {
  it("gives the legal flag by default and the flag in use when asked: Canada before 1965", () => {
    for (const day of ["1868-06-01", "1900-01-01", "1930-05-05", "1962-09-29", "1965-02-14"]) {
      expect(variantOn("CA", day)?.id, day).toBe("union-flag");
      expect(variantOn("CA", day, { role: "legal" })?.id, day).toBe("union-flag");
    }
    expect(variantOn("CA", "1868-06-01", { role: "in-use" })?.id).toBe("red-ensign-1868");
    expect(variantOn("CA", "1930-05-05", { role: "in-use" })?.id).toBe("red-ensign-1922");
    expect(variantOn("CA", "1962-09-29", { role: "in-use" })?.id).toBe("red-ensign-1957");
    expect(variantOn("CA", "1965-02-15")?.id).toBe("maple-leaf");
    expect(variantOn("CA", "1965-02-15", { role: "in-use" })?.id).toBe("maple-leaf");
    // No flag is recorded as in use in the six months of 1867 before the first Red Ensign's date.
    expect(variantOn("CA", "1867-12-01")?.id).toBe("union-flag");
    expect(variantOn("CA", "1867-12-01", { role: "in-use" })).toBeNull();
  });

  it("says that another flag exists that day and why, from either side", () => {
    const legal = variantOn("CA", "1962-09-29")!;
    expect(legal.role).toBe("legal");
    expect(legal.other).toMatchObject({ role: "in-use", id: "red-ensign-1957", name: expect.stringContaining("Red Ensign") });
    expect(legal.other!.nameJa).toMatch(/[぀-ヿ一-鿿]/);
    expect(legal.other!.note!.why).toContain("kept the Union Flag as the national flag");
    expect(legal.other!.note!.source).toBe("https://www.canada.ca/en/canadian-heritage/services/flag-canada-history.html");
    const used = variantOn("CA", "1962-09-29", { role: "in-use" })!;
    expect(used.role).toBe("in-use");
    expect(used.other).toMatchObject({ role: "legal", id: "union-flag" });
    expect(used.roleNote).not.toBeNull();
    // Where one flag is both, nothing else is said.
    for (const found of [variantOn("CA", "2026-01-01"), variantOn("US", "1950"), variantOn("JP", "1999-08-13", { role: "in-use" })]) expect(found!.other).toBeNull();
  });

  it("holds each country's own dates: Australia's Blue Ensign was flown from 1901 and the law caught up in 1954", () => {
    expect(variantOn("AU", "1901-05-01")?.id).toBe("union-flag");
    expect(variantOn("AU", "1901-05-01", { role: "in-use" })?.id).toBe("union-flag");
    expect(variantOn("AU", "1901-09-03", { role: "in-use" })?.id).toBe("federation-1901");
    expect(variantOn("AU", "1925-01-01")?.id).toBe("union-flag");
    expect(variantOn("AU", "1925-01-01", { role: "in-use" })?.id).toBe("australian-national-flag");
    expect(variantOn("AU", "1954-04-13")?.id).toBe("union-flag");
    expect(variantOn("AU", "1954-04-14")?.id).toBe("australian-national-flag");
    expect(variantOn("AU", "1954-04-14")?.other).toBeNull();
    expect(variantOn("NZ", "1860-01-01")?.id).toBe("union-flag");
    expect(variantOn("NZ", "1860-01-01", { role: "in-use" })?.id).toBe("union-flag");
    expect(variantOn("NZ", "1890-01-01")?.id).toBe("union-flag");
    expect(variantOn("NZ", "1890-01-01", { role: "in-use" })?.id).toBe("southern-cross-ensign");
    expect(variantOn("NZ", "1902-03-24")?.id).toBe("southern-cross-ensign");
    expect(variantOn("UA", "1991-12-01")?.id).toBe("ursr-1949");
    expect(variantOn("UA", "1991-12-01", { role: "in-use" })?.id).toBe("blue-yellow-1991");
    expect(variantOn("UA", "1992-01-28")?.id).toBe("blue-yellow");
    expect(variantOn("UA", "1991-09-03", { role: "in-use" })?.id).toBe("ursr-1949");
  });

  it("answers the same for both roles where the flag is both, and refuses a role that is not one", () => {
    for (const { code, variant } of every.filter(({ variant }) => variant.roleNote === null && variant.restricted === null)) {
      const day = (variant.from ?? "").length === 4 ? `${variant.from}-12-31` : variant.from!;
      expect(variantOn(code, day)?.id, `${code} ${variant.id}`).toBe(variantOn(code, day, { role: "in-use" })?.id);
    }
    expect(() => variantOn("CA", "1962", { role: "both" as never })).toThrow(TypeError);
    expect(() => variantOn("CA", "1962", { allowRestricted: "yes" as never })).toThrow(TypeError);
  });
});

describe("flagOn: never a bare null", () => {
  it("gives the reason a day has no flag", () => {
    expect(flagOn("CA", "1850-01-01").none?.kind).toBe("not-yet");
    expect(flagOn("CA", "1867-12-01", { role: "in-use" }).none?.kind).toBe("other-role");
    expect(flagOn("CA", "1867-12-01", { role: "in-use" }).none?.reason).toContain("Union Flag");
    expect(flagOn("SUHH", "1992-01-01").none?.kind).toBe("ended");
    expect(flagOn("SUHH", "1900-01-01").none?.kind).toBe("not-yet");
    expect(flagOn("ZA", "1920-01-01").none?.kind).toBe("not-yet");
    expect(flagOn("JP-13", "1962").none?.kind).toBe("undated");
    expect(flagOn("xx", "1962").none?.kind).toBe("unknown");
    expect(flagOn("DE", "1947-01-01").none).toMatchObject({ kind: "gap" });
    expect(flagOn("CA", "1962-09-29").none).toBeNull();
    expect(flagOn("CA", "1962-09-29").variant!.other!.id).toBe("red-ensign-1957");
  });
});

describe("flag(code, { date, role }) and flagOn from /load", () => {
  it("loads the legal flag by default and the flag in use when asked, and the same flag where they are one", async () => {
    expect(await flag("CA", { date: "1962-09-29" })).toBe(await flag("GB"));
    expect(await flag("CA", { date: "1962-09-29", role: "in-use" })).toBe(await flag("CA", { variant: "red-ensign-1957" }));
    expect(await flag("CA", { date: "1962-09-29", role: "legal" })).toBe(await flag("CA", { date: "1962-09-29" }));
    expect(await flag("US", { date: "1950", role: "in-use" })).toBe(await flag("US", { date: "1950" }));
    expect(await flag("CA", { date: "1867-12-01", role: "in-use" })).toBeNull();
    expect(() => flag("CA", { date: "1962", role: "x" as never })).toThrow(TypeError);
  });

  it("gives the drawing with the flag of the day, the other flag and the reason for a blank", async () => {
    const day = await loadFlagOn("CA", "1962-09-29", { shape: "4:3" });
    expect(day.variant?.id).toBe("union-flag");
    expect(day.variant?.other?.id).toBe("red-ensign-1957");
    expect(day.svg).toBe(await flag("CA", { variant: "union-flag", shape: "4:3" }));
    expect(day.none).toBeNull();
    const blank = await loadFlagOn("SUHH", "1992-01-01");
    expect(blank.svg).toBeNull();
    expect(blank.none?.kind).toBe("ended");
  });
});
