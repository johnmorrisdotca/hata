// The organisations' entry: ids that no country code can be, one record each, and a new body as data only.
import { readFileSync } from "node:fs";

import { COUNTRY_CODES } from "@johnmorrisdotca/kuni";
import { describe, expect, it, vi } from "vitest";

import { FLAG_ALIASES } from "./data/aliases.data";
import { FLAG_CODES, flagCode, frame, isFlagCode, toDataUri } from "./index";
import { ORGANISATIONS } from "./organisations.data";
import { isOrganisationId, ORGANISATION_IDS, organisationAspect, organisationFlag, organisationId, organisationName, organisationTerms } from "./organisations";

const slugOf = (id: string): string => id.slice(4);

describe("the ids", () => {
  it("are `org:` and a slug, and none is a country, region or former country's code, or an alias of one", () => {
    expect(ORGANISATION_IDS.length).toBeGreaterThan(0);
    expect(new Set(ORGANISATION_IDS).size).toBe(ORGANISATION_IDS.length);
    const taken = new Set<string>([...FLAG_CODES, ...Object.keys(FLAG_ALIASES), ...(COUNTRY_CODES as readonly string[])].map((code) => code.toLowerCase()));
    for (const id of ORGANISATION_IDS) {
      expect(id, id).toMatch(/^org:[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(taken.has(id), id).toBe(false);
      expect(isFlagCode(id), id).toBe(false);
      expect(isFlagCode(id.toUpperCase()), id).toBe(false);
      expect(flagCode(id), id).toBeNull();
    }
  });

  it("leave a code's own flag alone: a country's code is no organisation id, with or without `org:`", () => {
    expect(isOrganisationId("JP")).toBe(false);
    expect(isOrganisationId("org:jp")).toBe(false);
    expect(organisationFlag("JP")).toBeNull();
    expect(organisationFlag("org:jp")).toBeNull();
    expect(organisationId("org:xx")).toBeNull();
  });

  it("are read loosely by organisationId, and exactly by isOrganisationId", () => {
    expect(organisationId(" ORG:EU ")).toBe("org:eu");
    expect(organisationId("eu")).toBe("org:eu");
    expect(isOrganisationId("org:eu")).toBe(true);
    expect(isOrganisationId("ORG:EU")).toBe(false);
    expect(isOrganisationId(3)).toBe(false);
    expect(() => organisationId(3 as unknown as string)).toThrow(TypeError);
    expect(() => organisationFlag(null as unknown as string)).toThrow(TypeError);
  });
});

describe("each organisation's record", () => {
  it("has English and Japanese names, a drawing with a viewBox, ids of its own, nothing active or external, and terms read on a day", () => {
    for (const one of ORGANISATIONS) {
      const slug = slugOf(one.id);
      expect(one.name.en.length, one.id).toBeGreaterThan(2);
      expect(one.name.ja, one.id).toMatch(/[぀-ヿ一-鿿]/);
      const svg: string = one.svg;
      const root = /^<svg\b[^>]*>/.exec(svg)?.[0] ?? "";
      expect(root, one.id).toContain('xmlns="http://www.w3.org/2000/svg"');
      expect(root, one.id).toMatch(/viewBox="0 0 \d+ \d+"/);
      expect(root, one.id).not.toMatch(/\s(width|height)=/);
      expect(svg, one.id).not.toMatch(/<script|<foreignObject|<image|javascript:|\son\w+=|xlink:href|href="(?!#)|url\((?!#)/i);
      for (const [, id] of svg.matchAll(/\sid="([^"]+)"/g)) expect(id, one.id).toMatch(new RegExp(`^org-${slug}-`));
      expect(one.terms.url, one.id).toMatch(/^https:\/\//);
      expect(one.terms.read, one.id).toMatch(/^2026-\d\d-\d\d$/);
      expect(one.terms.says.length, one.id).toBeGreaterThan(40);
    }
  });

  it("is in NOTICE.md with its id and the page its terms were read on", () => {
    const notice = readFileSync("NOTICE.md", "utf8");
    for (const one of ORGANISATIONS) {
      expect(notice, one.id).toContain(`\`${one.id}\``);
      expect(notice, one.id).toContain(one.terms.url);
      expect(notice, one.id).toContain(one.terms.read);
    }
  });
});

describe("the functions", () => {
  it("give the drawing, the names, the ratio and the terms", () => {
    expect(organisationFlag("org:eu")).toBe(ORGANISATIONS[0].svg);
    expect(organisationName("org:eu")).toBe("European Union");
    expect(organisationName("EU", "ja-JP")).toBe("欧州連合");
    expect(organisationAspect("org:eu")).toBe(1.5);
    expect(organisationTerms("org:eu")?.url).toBe("https://european-union.europa.eu/legal-notice_en");
    const terms = organisationTerms("org:eu");
    expect(terms).toEqual(ORGANISATIONS[0].terms);
    expect(terms).not.toBe(organisationTerms("org:eu"));
    for (const answer of [organisationFlag("org:xx"), organisationName("org:xx"), organisationAspect("org:xx"), organisationTerms("org:xx")]) expect(answer).toBeNull();
  });

  it("draw twelve gold stars on blue, once each", () => {
    const svg = organisationFlag("org:eu") ?? "";
    expect(svg.match(/<use /g)?.length).toBe(12);
    expect(svg).toContain('fill="#039"');
    expect(svg).toContain('fill="#fc0"');
  });

  it("work with the main entry's frame and data: URI", () => {
    const svg = organisationFlag("org:eu") ?? "";
    expect(frame(svg, { shape: "round" }) ?? "").toContain("clipPath");
    expect(frame(svg, { shape: "1:1", fit: "whole" }) ?? "").toContain("<svg");
    expect(toDataUri(svg)?.startsWith("data:image/svg+xml,")).toBe(true);
  });

  it("are kept out of the main entry, which does not import them", () => {
    expect(readFileSync("src/index.ts", "utf8")).not.toMatch(/organisations/);
    expect(readFileSync("src/load.ts", "utf8")).not.toMatch(/organisations/);
  });
});

describe("a new organisation", () => {
  it("is one record in the data file: every function, and the collision rules, take it with no other change", async () => {
    vi.resetModules();
    vi.doMock("./organisations.data", () => ({
      ORGANISATIONS: [
        ...ORGANISATIONS,
        {
          id: "org:test-body",
          name: { en: "Test Body", ja: "試験機関" },
          svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400"><path id="org-test-body-a" fill="#123" d="M0 0h600v400H0z"/></svg>',
          terms: { url: "https://example.test/terms", read: "2026-11-13", says: "A made-up body whose terms let anyone carry its flag, for this test only." },
        },
      ],
    }));
    const added = await import("./organisations");
    expect(added.ORGANISATION_IDS).toEqual([...ORGANISATION_IDS, "org:test-body"]);
    expect(added.isOrganisationId("org:test-body")).toBe(true);
    expect(added.organisationId("TEST-BODY")).toBe("org:test-body");
    expect(added.organisationFlag("org:test-body")).toContain("viewBox");
    expect(added.organisationName("org:test-body", "ja")).toBe("試験機関");
    expect(added.organisationAspect("org:test-body")).toBe(1.5);
    expect(added.organisationTerms("org:test-body")?.url).toBe("https://example.test/terms");
    expect(isFlagCode("org:test-body")).toBe(false);
    for (const id of added.ORGANISATION_IDS) expect(flagCode(id)).toBeNull();
    vi.doUnmock("./organisations.data");
    vi.resetModules();
  });
});
