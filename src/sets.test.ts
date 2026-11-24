// The sets drawn for this package (src/sets/*.data.ts, each with its own entry): the rules every one keeps, whatever it draws.
// A new set is one data file and one entry; this file takes it with no change, because it reads whatever is in src/sets.
import { readdirSync, readFileSync } from "node:fs";

import { COUNTRY_CODES } from "@johnmorrisdotca/kuni";
import { describe, expect, it } from "vitest";

import { FLAG_ALIASES } from "./data/aliases.data";
import { FLAG_CODES, flagCode, isFlagCode } from "./index";
import { aspectOf, frame, toDataUri } from "./svg";

interface Row {
  id: string;
  group: string;
  name: { en: string; ja: string };
  about: { en: string; ja: string };
  status: string;
  dates: { from: string | null; until: string | null } | null;
  note: { en: string; ja: string };
  source: { title: string; url: string; kind: string; read: string; says: string };
  svg: string;
}

const SETS: { name: string; records: readonly Row[] }[] = await Promise.all(
  readdirSync("src/sets").filter((file) => file.endsWith(".data.ts")).sort().map(async (file) => {
    const module = (await import(/* @vite-ignore */ `./sets/${file}`)) as Record<string, readonly Row[]>;

    return { name: file.replace(/\.data\.ts$/, ""), records: Object.values(module)[0]! };
  }),
);
const notice = readFileSync("NOTICE.md", "utf8");

describe("every drawn set", () => {
  it("has sets here, each with a data file and an entry", () => {
    expect(SETS.length).toBe(readdirSync("src/sets").filter((file) => file.endsWith(".data.ts")).length);
    expect(SETS.length).toBeGreaterThan(0);
    for (const { name } of SETS) expect(() => readFileSync(`src/${name}.ts`, "utf8"), name).not.toThrow();
  });

  it("gives every drawing an id in the set's own namespace, which no country, region or former country can be", () => {
    const taken = new Set<string>([...FLAG_CODES, ...Object.keys(FLAG_ALIASES), ...(COUNTRY_CODES as readonly string[])].map((code) => code.toLowerCase()));
    for (const { name, records } of SETS) {
      expect(records.length, name).toBeGreaterThan(0);
      expect(new Set(records.map((one) => one.id)).size, name).toBe(records.length);
      const prefixes = new Set(records.map((one) => one.id.split(":")[0]));
      expect(prefixes.size, name).toBe(1);
      for (const one of records) {
        expect(one.id, one.id).toMatch(/^[a-z]+:[a-z0-9]+(-[a-z0-9]+)*$/);
        expect(taken.has(one.id), one.id).toBe(false);
        expect(isFlagCode(one.id), one.id).toBe(false);
        expect(flagCode(one.id), one.id).toBeNull();
      }
    }
  });

  it("has both names, both descriptions, a group, a status and a source with the day it was read, for every drawing", () => {
    for (const { records } of SETS) {
      for (const one of records) {
        expect(one.name.en.length, one.id).toBeGreaterThan(1);
        expect(one.name.ja, one.id).toMatch(/[぀-ヿ一-鿿]/);
        expect(one.about.en.length, one.id).toBeGreaterThan(10);
        expect(one.about.ja, one.id).toMatch(/[぀-ヿ一-鿿]/);
        expect(one.group, one.id).toMatch(/^[a-z-]+$/);
        expect(["official", "documented", "reconstruction"], one.id).toContain(one.status);
        if (one.status !== "official") {
          expect(one.note.en.length, `${one.id}: what is documented and what is not`).toBeGreaterThan(30);
          expect(one.note.ja, one.id).toMatch(/[぀-ヿ一-鿿]/);
        }
        expect(one.source.url, one.id).toMatch(/^https:\/\//);
        expect(one.source.read, one.id).toMatch(/^2026-\d\d-\d\d$/);
        expect(one.source.says.length, one.id).toBeGreaterThan(40);
        if (one.dates !== null) expect(one.dates.from ?? one.dates.until, one.id).not.toBeNull();
      }
    }
  });

  it("is a vector with a viewBox, ids of its own, nothing active or external and no picture inside it", () => {
    for (const { records } of SETS) {
      for (const one of records) {
        const slug = one.id.split(":")[1]!;
        const prefix = one.id.split(":")[0]!;
        const root = /^<svg\b[^>]*>/.exec(one.svg)?.[0] ?? "";
        expect(root, one.id).toContain('xmlns="http://www.w3.org/2000/svg"');
        expect(root, one.id).toMatch(/viewBox="0 0 [\d.]+ [\d.]+"/);
        expect(root, one.id).not.toMatch(/\s(width|height)=/);
        expect(one.svg, one.id).not.toMatch(/<script|<foreignObject|<image|<style|javascript:|\son\w+=|xlink:href|href="(?!#)|url\((?!#)|data:|base64/i);
        for (const [, id] of one.svg.matchAll(/\sid="([^"]+)"/g)) expect(id, one.id).toMatch(new RegExp(`^${prefix}-${slug}-`));
        expect(aspectOf(one.svg), one.id).toBeGreaterThan(0.2);
        expect(frame(one.svg, { shape: "round" }) ?? "", one.id).toContain("<svg");
        expect(toDataUri(one.svg)?.startsWith("data:image/svg+xml,"), one.id).toBe(true);
      }
    }
  });

  it("is named in NOTICE.md with the page each source was read from", () => {
    for (const { name, records } of SETS) {
      expect(notice, name).toContain(`\`${records[0]!.id.split(":")[0]}:`);
      for (const url of new Set(records.map((one) => one.source.url))) expect(notice, `${name}: ${url}`).toContain(url);
    }
  });

  it("stays out of the main entry and /load, which do not import it", () => {
    for (const { name } of SETS) {
      expect(readFileSync("src/index.ts", "utf8"), name).not.toMatch(new RegExp(`/${name}"|sets/`));
      expect(readFileSync("src/load.ts", "utf8"), name).not.toMatch(new RegExp(`/${name}"|sets/`));
    }
  });
});
