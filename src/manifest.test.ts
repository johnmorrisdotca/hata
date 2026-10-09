// /manifest, and the flags themselves: every code Kuni knows has a flag or a reason, every flag's source and licence
// is one this package may ship, and every picture is safe to put in a page as it is.
import { readdirSync, readFileSync } from "node:fs";

import { COUNTRY_CODES } from "@johnmorrisdotca/kuni";
import { subdivisions } from "@johnmorrisdotca/kuni/subdivisions";
import { describe, expect, it } from "vitest";

import { FLAG_CODES } from "./index";
import { flag } from "./load";
import { LEFT_OUT, leftOut, manifest, MANIFEST } from "./manifest";

const kuniCodes = [...COUNTRY_CODES, ...["JP", "CA", "US"].flatMap((country) => (subdivisions(country) ?? []).map((one) => one.code))];

describe("coverage against Kuni", () => {
  it("gives every country, and every first-level subdivision of Japan, Canada and the United States, a flag or a reason", () => {
    const flagged = new Set<string>(FLAG_CODES);
    const reasons = new Map(LEFT_OUT.map((one) => [one.code, one.reason]));
    for (const code of kuniCodes) {
      expect(flagged.has(code) !== reasons.has(code), `${code} has ${flagged.has(code) ? "a flag and a reason" : "neither a flag nor a reason"}`).toBe(true);
      if (reasons.has(code)) expect(reasons.get(code)!.length, code).toBeGreaterThan(20);
    }
    expect(FLAG_CODES.length + LEFT_OUT.length).toBe(kuniCodes.length);
  });

  it("has Japan's 47 prefectures, Canada's 13 and the United States' 57 all accounted for, and names no code Kuni does not know", () => {
    expect(kuniCodes.filter((code) => code.startsWith("JP-"))).toHaveLength(47);
    expect(kuniCodes.filter((code) => code.startsWith("CA-"))).toHaveLength(13);
    expect(kuniCodes.filter((code) => code.startsWith("US-"))).toHaveLength(57);
    for (const code of [...FLAG_CODES, ...LEFT_OUT.map((one) => one.code)]) expect(kuniCodes, code).toContain(code);
  });
});

describe("the manifest", () => {
  it("has one record for each flag, in the same order", () => {
    expect(MANIFEST.map((one) => one.code)).toEqual([...FLAG_CODES]);
  });

  it("ships only public domain, CC0 and CC BY from Commons, and MIT from the flag sets", () => {
    for (const one of MANIFEST) {
      if (one.source === "commons") {
        expect(["public-domain", "cc0", "cc-by"], one.code).toContain(one.licence.kind);
        expect(one.page, one.code).toMatch(/^https:\/\/commons\.wikimedia\.org\/wiki\/File:/);
        expect(one.reference, one.code).toBeNull();
        expect(one.uploaded, one.code).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      } else {
        expect(one.licence.kind, one.code).toBe("mit");
        expect(one.version, one.code).toMatch(/^\d+\.\d+\.\d+$/);
        expect(one.reference?.page, one.code).toMatch(/^https:\/\/commons\.wikimedia\.org\/wiki\/File:/);
        expect(one.author, one.code).toMatch(/^Copyright/);
      }
      expect(one.wikidata, one.code).toMatch(/^Q\d+$/);
      expect(one.why.length, one.code).toBeGreaterThan(20);
      expect(one.fetched, one.code).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it("credits in NOTICE.md every Commons drawing under CC BY, and every flag set a drawing came from, with its licence", () => {
    const notice = readFileSync("NOTICE.md", "utf8");
    for (const one of MANIFEST.filter((record) => record.licence.kind === "cc-by" && record.sameAs === null)) expect(notice, one.code).toContain(one.file);
    for (const source of new Set(MANIFEST.filter((record) => record.source !== "commons").map((record) => record.source))) {
      expect(notice).toContain(`### ${source}`);
      expect(notice).toContain("Permission is hereby granted, free of charge");
    }
  });

  it("points a shared picture at a flag that carries its own, drawn from the same file", () => {
    for (const one of MANIFEST.filter((record) => record.sameAs !== null)) {
      const owner = manifest(one.sameAs!);
      expect(owner?.sameAs, one.code).toBeNull();
      expect(owner?.file, one.code).toBe(one.file);
    }
  });

  it("looks a record up in any case, and answers null for a code with none", () => {
    expect(manifest("jp-13")?.code).toBe("JP-13");
    expect(manifest("XX")).toBeNull();
    expect(leftOut("eh")?.kind).toBe("no-flag");
    expect(leftOut("JP")).toBeNull();
    expect(() => manifest(1 as unknown as string)).toThrow(TypeError);
    expect(Object.isFrozen(MANIFEST[0]!.licence)).toBe(true);
  });
});

describe("every flag's picture", () => {
  it("is an SVG with a viewBox and the SVG namespace, no width, height or stretching, and the viewBox the record says", async () => {
    for (const one of MANIFEST) {
      const svg = (await flag(one.code))!;
      const root = /^<svg\b[^>]*>/.exec(svg)?.[0] ?? "";
      expect(root, one.code).toContain('xmlns="http://www.w3.org/2000/svg"');
      expect(root, one.code).toMatch(new RegExp(`viewBox="[-\\d.]+ [-\\d.]+ ${one.width} ${one.height}"`));
      expect(root, one.code).not.toMatch(/\s(width|height|preserveAspectRatio)=/);
      expect(Buffer.byteLength(svg), one.code).toBe(one.bytes);
    }
  });

  it("holds nothing that runs, loads or reaches outside the picture", async () => {
    for (const code of FLAG_CODES) {
      const svg = (await flag(code))!;
      expect(svg, code).not.toMatch(/<script\b|\son[a-z]+\s*=|<foreignObject\b|<(iframe|object|embed|audio|video|animate|set)\b|javascript:|<!ENTITY|<!DOCTYPE|@import/i);
      expect(svg, code).not.toMatch(/(href|src)\s*=\s*["'](?!#|data:image\/(png|jpeg|gif|webp);base64,)/i);
      expect(svg, code).not.toMatch(/url\(\s*["']?(?!#)/i);
    }
  });

  it("names every id and class with its own flag's prefix, so flags in one page cannot collide", async () => {
    for (const one of MANIFEST.filter((record) => record.sameAs === null)) {
      const svg = (await flag(one.code))!;
      const prefix = `hata-${one.code.toLowerCase()}-`;
      for (const [, id] of svg.matchAll(/\sid="([^"]+)"/g)) expect(id, one.code).toMatch(new RegExp(`^${prefix}`));
      for (const [, names] of svg.matchAll(/\sclass="([^"]+)"/g)) for (const name of names.split(/\s+/)) expect(name, one.code).toMatch(new RegExp(`^${prefix}`));
    }
  });

  it("is the generated module's own: one file in src/flags for each code, none other", () => {
    const files = readdirSync("src/flags").map((file) => file.replace(/\.ts$/, "").toUpperCase()).sort();
    expect(files).toEqual([...FLAG_CODES].sort());
  });
});
