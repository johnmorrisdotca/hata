// A page's own flags: the set checked as the data door checks it, each SVG held to the allowlist, ids that no code can be, and a hostile list that must never be drawn.
import { COUNTRY_CODES } from "@johnmorrisdotca/kuni";
import { afterEach, describe, expect, it } from "vitest";

import { FLAG_ALIASES } from "./data/aliases.data";
import { FLAG_CODES, flagCode, frame, toDataUri } from "./index";
import { flag } from "./load";
import { ORGANISATION_IDS } from "./organisations";
import { customAspect, customCreditLine, customFlag, customGroups, customId, customName, enableFlags, isCustomId, listCustomFlags, registerFlags, removeFlags, searchCustomFlags } from "./custom";
import type { CustomFlagRecord, CustomFlagSource } from "./custom";

const NS = 'xmlns="http://www.w3.org/2000/svg"';
const GOOD = `<svg ${NS} viewBox="0 0 3 2"><path fill="#036" d="M0 0h3v2H0z"/></svg>`;
const wrap = (inner: string, rootExtra = ""): string => `<svg ${NS} viewBox="0 0 3 2"${rootExtra}>${inner}</svg>`;

let counter = 0;
const info = (id: string): CustomFlagSource["info"] => ({
  id,
  name: { en: "Mine", ja: "私の" },
  credit: { en: "Mine, drawn by me", ja: "私の（自作）" },
  licence: { name: "Mine to give", url: "https://example.org/terms" },
  url: "https://example.org/mine",
  retrieved: "2026-11-13",
});
const source = (records: unknown[], id = `set-${++counter}`): CustomFlagSource => ({ kind: "records", info: info(id), records: () => records as CustomFlagRecord[] });
const record = (svg: string, slug = "one", extra: Partial<CustomFlagRecord> = {}): CustomFlagRecord => ({ id: `custom:${slug}`, name: { en: "One", ja: "一" }, svg, ...extra });
const sets: string[] = [];
const register = async (records: unknown[], id?: string) => {
  const set = source(records, id);
  sets.push(set.info.id);
  return registerFlags(set);
};
afterEach(() => {
  for (const id of sets.splice(0)) removeFlags(id);
});
const reasonOf = async (svg: string): Promise<string> => {
  const done = await register([record(svg)]);
  expect(done.added, "must not be drawn").toEqual([]);
  expect(customFlag("custom:one")).toBeNull();
  return done.rejected[0]?.reason ?? "";
};

describe("registering a set", () => {
  it("adds a good flag, and gives it by id, name, ratio and group, framed like a built-in one", async () => {
    const done = await register([record(GOOD, "one", { group: "Clubs" })]);
    expect(done).toMatchObject({ status: "ok", added: ["custom:one"], skipped: 0 });
    expect(customFlag("CUSTOM:One ")).toContain("<svg");
    expect(customFlag("custom:one")).toContain('data-hata-custom="one"');
    expect(customName("custom:one", "ja-JP")).toBe("一");
    expect(customName("custom:one")).toBe("One");
    expect(customAspect("custom:one")).toBe(1.5);
    expect(customId(" Custom:ONE")).toBe("custom:one");
    expect(customId("one")).toBeNull();
    expect(frame(customFlag("custom:one") ?? "", { shape: "round" }) ?? "").toContain("clipPath");
    expect(toDataUri(customFlag("custom:one") ?? "")).toContain("data:image/svg+xml");
    expect(await flag("custom:one")).toBe(customFlag("custom:one"));
    expect(await flag("CUSTOM:one", { shape: "1:1" })).toContain("clipPath".length > 0 ? "<svg" : "");
    expect(await flag("custom:one", { variant: "x" })).toBeNull();
    expect(await flag("custom:nothing")).toBeNull();
  });

  it("is found, listed by group and searched, and credited with its licence; off and removed it is gone", async () => {
    await register([record(GOOD, "harbour-fc", { name: { en: "Harbour FC", ja: "ハーバー" }, group: "Clubs" }), record(GOOD, "plain")], "club-set");
    expect(listCustomFlags().map((one) => one.id)).toEqual(["custom:harbour-fc", "custom:plain"]);
    expect(listCustomFlags({ group: "Clubs" }).map((one) => one.id)).toEqual(["custom:harbour-fc"]);
    expect(customGroups()).toEqual([{ group: "Clubs", ids: ["custom:harbour-fc"] }, { group: "custom", ids: ["custom:plain"] }]);
    expect(searchCustomFlags("harb").map((one) => one.id)).toEqual(["custom:harbour-fc"]);
    expect(searchCustomFlags("ハーバー").map((one) => one.id)).toEqual(["custom:harbour-fc"]);
    expect(searchCustomFlags("clubs")).toHaveLength(1);
    expect(searchCustomFlags("  ")).toEqual([]);
    expect(customCreditLine("en")).toBe("Mine, drawn by me (Mine to give).");
    expect(customCreditLine("ja")).toContain("私の（自作）");
    expect(enableFlags("club-set", false)).toBe(true);
    expect([customFlag("custom:plain"), listCustomFlags().length, customCreditLine()]).toEqual([null, 0, ""]);
    expect(enableFlags("club-set")).toBe(true);
    expect(customFlag("custom:plain")).not.toBeNull();
    expect(removeFlags("club-set")).toBe(true);
    expect(removeFlags("club-set")).toBe(false);
    expect(customFlag("custom:plain")).toBeNull();
  });

  it("refuses a set that is not allowed, at once: an empty credit, no licence, a bad id, tiles", async () => {
    await expect(registerFlags({ ...source([]), info: { ...info("a"), credit: { en: "", ja: "x" } } })).rejects.toThrow(/credit is empty/);
    await expect(registerFlags({ ...source([]), info: { ...info("a"), licence: undefined as never } })).rejects.toThrow(/no licence/);
    await expect(registerFlags({ ...source([]), info: { ...info("Bad Id") } })).rejects.toThrow(/lower-case/);
    await expect(registerFlags({ kind: "tiles", info: info("tiles"), need: () => [], load: async () => 0, bytes: () => 0 } as never)).rejects.toThrow(/records source/);
    expect(await registerFlags({ ...source([]), records: () => { throw new Error("boom"); } }).then((done) => [done.status, done.reason, done.added.length])).toEqual(["failed", "boom", 0]);
  });

  it("refuses a set id registered twice (hoshi's rule), also while the first is still being read, and takes it again once removed", async () => {
    const first = register([record(GOOD, "a")], "twice");
    await expect(registerFlags(source([record(GOOD, "b")], "twice"))).rejects.toThrow(/already used in this view/);
    await first;
    await expect(registerFlags(source([record(GOOD, "b")], "twice"))).rejects.toThrow(/already used in this view/);
    removeFlags("twice");
    expect((await register([record(GOOD, "b")], "twice")).added).toEqual(["custom:b"]);
  });

  it("leaves a flag id already held by another set with the first, and says so", async () => {
    await register([record(GOOD, "same")], "first");
    const second = await register([record(wrap('<path d="M0 0h1v1H0z"/>'), "same"), record(GOOD, "other")], "second");
    expect(second.added).toEqual(["custom:other"]);
    expect(second.rejected[0]).toMatchObject({ id: "custom:same" });
    expect(second.rejected[0]?.reason).toMatch(/already held by the set "first"/);
    expect(customFlag("custom:same")).toBe((await flag("custom:same")) ?? "");
    removeFlags("first");
    expect(customFlag("custom:same")).toBeNull();
  });
});

describe("ids", () => {
  it("can never be a country, region or former country's code, an alias of one, or an org: id: only custom:<slug> is taken", async () => {
    const taken = [...FLAG_CODES, ...Object.keys(FLAG_ALIASES), ...(COUNTRY_CODES as readonly string[]), ...ORGANISATION_IDS, "JP", "jp", "JP-13", "SUHH", "org:eu", "org:x", "custom", "custom:", "customclub", "abcdefgclub", "custom:Upper", "custom:a_b", "custom:-a", "custom:a--b", `custom:${"a".repeat(49)}`];
    const done = await register(taken.map((id) => ({ id, name: { en: "x" }, svg: GOOD })));
    expect(done.added).toEqual([]);
    expect(done.rejected).toHaveLength(taken.length);
    for (const one of done.rejected) expect(one.reason).toMatch(/"custom:" and a slug/);
    expect(isCustomId("custom:harbour-fc")).toBe(true);
    for (const id of ["JP", "org:eu", "custom:", "custom:A", 5]) expect(isCustomId(id)).toBe(false);
  });

  it("are no flag code: no registered id is a code, an alias or read by flagCode", async () => {
    const done = await register([record(GOOD, "jp"), record(GOOD, "eu"), record(GOOD, "urs")]);
    const codes = new Set<string>([...FLAG_CODES, ...Object.keys(FLAG_ALIASES), ...(COUNTRY_CODES as readonly string[]), ...ORGANISATION_IDS].map((code) => code.toLowerCase()));
    for (const id of done.added) {
      expect(codes.has(id), id).toBe(false);
      expect(flagCode(id), id).toBeNull();
    }
    expect(await flag("JP")).not.toBe(customFlag("custom:jp"));
  });

  it("are prefixed inside the drawing, so two flags on one page cannot collide", async () => {
    const withId = (): string => wrap('<defs><linearGradient id="g"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#036"/></linearGradient></defs><path fill="url(#g)" d="M0 0h3v2H0z"/>');
    await register([record(withId(), "a"), record(withId(), "b")]);
    expect(customFlag("custom:a")).toContain('id="custom-a--g"');
    expect(customFlag("custom:a")).toContain("url(#custom-a--g)");
    expect(customFlag("custom:b")).toContain('id="custom-b--g"');
    expect(customFlag("custom:a")).not.toContain("custom-b--");
  });

  it("refuse an id with a dot, since a rewritten id may hold only letters, digits, underscores and hyphens", async () => {
    expect(await reasonOf(wrap('<path id="a.b" d="M0 0h1v1H0z"/>'))).toMatch(/an id is a letter/);
  });
});

describe("hostile SVG: each is refused (never drawn, never part-cleaned)", () => {
  const cases: [string, string, RegExp][] = [
    ["a script", wrap('<script>alert(1)</script><path d="M0 0h1v1H0z"/>'), /text outside a title|<script> is not an element/],
    ["a script with no text in it", wrap('<script href="https://evil.example/a.js"/>'), /<script> is not an element/],
    ["a style with no text in it", wrap("<style/>"), /<style> is not an element/],
    ["an onload attribute on the root", wrap('<path d="M0 0h1v1H0z"/>', ' onload="alert(1)"'), /onload: this attribute is not allowed/],
    ["an onclick on a shape", wrap('<path onclick="alert(1)" d="M0 0h1v1H0z"/>'), /onclick: this attribute is not allowed/],
    ["a javascript: href", wrap('<use href="javascript:alert(1)"/>'), /a reference must be exactly a #id/],
    ["a javascript: xlink:href", wrap('<use xlink:href="javascript:alert(1)"/>'), /a reference must be exactly a #id/],
    ["an external href", wrap('<use href="https://evil.example/x.svg#a"/>'), /a reference must be exactly a #id/],
    ["a protocol-relative href", wrap('<use href="//evil.example/x.svg#a"/>'), /a reference must be exactly a #id/],
    ["a foreignObject", wrap('<foreignObject width="1" height="1"><g/></foreignObject>'), /<foreignObject> is not an element/],
    ["a foreignObject holding html", wrap('<foreignObject width="1" height="1"><div>x</div></foreignObject>'), /text outside a title|<foreignObject> is not an element/],
    ["a style element with @import", wrap('<style>@import url(https://evil.example/a.css);</style><path d="M0 0h1v1H0z"/>'), /text outside a title|<style> is not an element/],
    ["a style attribute", wrap('<path style="fill:url(https://evil.example/a)" d="M0 0h1v1H0z"/>'), /style: this attribute is not allowed/],
    ["an image", wrap('<image href="data:image/png;base64,AAAA" width="1" height="1"/>'), /<image> is not an element/],
    ["a link", wrap('<a href="https://evil.example"><path d="M0 0h1v1H0z"/></a>'), /<a> is not an element/],
    ["animation that sets an href", wrap('<set attributeName="href" to="javascript:alert(1)"/>'), /<set> is not an element/],
    ["a url() to an address in a fill", wrap('<path fill="url(https://evil.example/a.svg#b)" d="M0 0h1v1H0z"/>'), /a url\(\) may point only to a #id/],
    ["a url() with odd case and spaces to an address", wrap('<path fill="URL( https://evil.example/a )" d="M0 0h1v1H0z"/>'), /a url\(\) may point only to a #id/],
    ["a url() in a clip-path to an address", wrap('<path clip-path="url(//evil.example/a#b)" d="M0 0h1v1H0z"/>'), /a url\(\) may point only to a #id/],
    ["a url() in a plain attribute", wrap('<path stroke-width="url(#a)" d="M0 0h1v1H0z"/><g id="a"/>'), /holds a character|a url\( in a value/],
    ["a data: URL in a fill", wrap('<path fill="url(data:image/svg+xml;base64,AAAA)" d="M0 0h1v1H0z"/>'), /a url\(\) may point only to a #id/],
    ["a hex character reference spelling javascript in an href", wrap('<use href="jav&#x61;script:alert(1)"/>'), /a character reference or entity in an attribute value/],
    ["a decimal character reference in an href", wrap('<use href="&#106;avascript:alert(1)"/>'), /a character reference or entity in an attribute value/],
    ["a character reference inside url()", wrap('<path fill="url(jav&#x61;script:alert(1))" d="M0 0h1v1H0z"/>'), /a character reference or entity in an attribute value/],
    ["a named entity in a value", wrap('<path fill="&lt;" d="M0 0h1v1H0z"/>'), /a character reference or entity in an attribute value/],
    ["a character reference in a title", wrap("<title>&#60;img&#62;</title>"), /a character reference/],
    ["a DOCTYPE with an entity", `<!DOCTYPE svg [<!ENTITY x "y">]>${GOOD}`, /DOCTYPE, CDATA section or processing instruction/],
    ["a CDATA section", wrap("<title><![CDATA[x]]></title>"), /DOCTYPE, CDATA section or processing instruction/],
    ["a processing instruction", wrap('<?xml-stylesheet href="https://evil.example/a.css"?>'), /DOCTYPE, CDATA section or processing instruction/],
    ["another namespace for xmlns", `<svg xmlns="http://evil.example/ns" viewBox="0 0 3 2"><path d="M0 0h1v1H0z"/></svg>`, /xmlns must be exactly/],
    ["another namespace for xmlns:xlink", `<svg ${NS} xmlns:xlink="http://evil.example/x" viewBox="0 0 3 2"><path d="M0 0h1v1H0z"/></svg>`, /xmlns:xlink must be exactly/],
    ["a prefixed attribute (x:onload)", `<svg ${NS} xmlns:x="http://evil.example/x" viewBox="0 0 3 2"><path x:onload="alert(1)" d="M0 0h1v1H0z"/></svg>`, /not allowed/],
    ["a prefixed element (ev:listener)", `<svg ${NS} viewBox="0 0 3 2"><ev:listener event="click" handler="#h"/></svg>`, /ev:listener> is not an element/],
    ["an xmlns on a child", wrap('<g xmlns="http://www.w3.org/1999/xhtml"/>'), /xmlns must be exactly .* on <svg> only/],
    ["a reference that points into the page", wrap('<use href="#page-element"/>'), /not in the file/],
    ["a url() that points into the page", wrap('<path fill="url(#page-element)" d="M0 0h1v1H0z"/>'), /not in the file/],
    ["a use that holds itself", wrap('<g id="a"><use href="#a"/></g>'), /points back to itself/],
    ["a cycle of two uses", wrap('<g id="a"><use href="#b"/></g><g id="b"><use href="#a"/></g>'), /points back to itself/],
    ["a width and a height on the root", wrap('<path d="M0 0h1v1H0z"/>', ' width="100" height="100"'), /no width or height/],
    ["no viewBox", `<svg ${NS}><path d="M0 0h1v1H0z"/></svg>`, /needs a viewBox/],
    ["text outside a title", wrap("<g>hello</g>"), /text outside a title/],
    ["an unquoted attribute", wrap("<path d=M0 />"), /not quoted/],
    ["two roots", `${GOOD}${GOOD}`, /exactly one <svg>/],
    ["no svg root", "<g/>", /root must be <svg>/],
    ["not a string at all", 42 as unknown as string, /must be a string/],
    ["an oversize file", `<svg ${NS} viewBox="0 0 3 2"><path d="${"M0 0h1v1H0z".repeat(7000)}"/></svg>`, /over 65536 bytes/],
    ["elements nested too deep", wrap("<g>".repeat(40) + "</g>".repeat(40)), /nested deeper than 32/],
    ["too many elements", wrap("<g/>".repeat(4001)), /more than 4000 elements/],
    ["a use bomb: ten levels of ten uses each", wrap(`<defs><g id="l0"><path d="M0 0h1v1H0z"/></g>${Array.from({ length: 10 }, (_, level) => `<g id="l${level + 1}">${`<use href="#l${level}"/>`.repeat(10)}</g>`).join("")}</defs><use href="#l10"/>`), /expands to more than 4000 elements/],
  ];
  for (const [name, svg, why] of cases) {
    it(`${name}`, async () => {
      expect(await reasonOf(svg)).toMatch(why);
    });
  }

  it("also keeps a good flag next to a hostile one in the same set, and counts the one left out", async () => {
    const done = await register([record(GOOD, "fine"), record(wrap("<script>1</script>"), "bad"), "not an object", record(GOOD, "Bad Slug")]);
    expect(done.added).toEqual(["custom:fine"]);
    expect(done.skipped).toBe(3);
    expect(done.rejected.map((one) => one.id)).toEqual(["custom:bad", null, "custom:Bad Slug"]);
  });
});

describe("what is drawn is what passed", () => {
  it("allows the usual drawing: gradients, clip paths, masks, symbols and a use of a local id, any case of url()", async () => {
    const rich = wrap('<defs><clipPath id="c"><rect width="3" height="2"/></clipPath><linearGradient id="g" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="rgb(0,51,102)"/></linearGradient><g id="s"><circle cx="1" cy="1" r=".5"/></g></defs><g clip-path=" URL( #c ) "><path fill="url(#g)" stroke="none" stroke-width="0.1" d="M0 0h3v2H0z" transform="translate(0 0)"/><use href="#s" fill="#fc0"/></g><title>Rich</title>');
    const done = await register([record(rich, "rich")]);
    expect(done.rejected).toEqual([]);
    const out = customFlag("custom:rich") ?? "";
    expect(out).toContain('clip-path="url(#custom-rich--c)"');
    expect(out).toContain('href="#custom-rich--s"');
    expect(out).toContain("<title>Rich</title>");
  });

  it("writes a title with markup in it back escaped, so no tag can come out of a registered flag", async () => {
    const hostile = "&lt;/svg&gt;&lt;img src=x onerror=1&gt;";
    await register([record(wrap(`<title>${hostile}</title><path d="M0 0h1v1H0z"/>`), "t")]);
    const out = customFlag("custom:t") ?? "";
    expect(out).toContain("<title>&lt;/svg&gt;&lt;img src=x onerror=1&gt;</title>");
    expect(out).not.toMatch(/<img/);
    expect(out.match(/<svg/g)).toHaveLength(1);
    expect(out.match(/<\/svg>/g)).toHaveLength(1);
  });

  it("escapes <, & and \" in anything it writes", async () => {
    await register([record(wrap("<title>a &amp; b &quot;c&quot; &lt;d&gt;</title>"), "e")]);
    expect(customFlag("custom:e")).toContain("<title>a &amp; b &quot;c&quot; &lt;d&gt;</title>");
  });

  it("drops a comment and an XML declaration, and keeps nothing else it did not read", async () => {
    await register([record(`<?xml version="1.0" encoding="UTF-8"?><!-- <script>alert(1)</script> -->${GOOD}`, "c")]);
    const out = customFlag("custom:c") ?? "";
    expect(out).not.toMatch(/script|xml |<!--/);
  });

  it("keeps the registry out of the main entry, /load's static imports and /organisations", async () => {
    const { readFileSync } = await import("node:fs");
    for (const file of ["src/index.ts", "src/organisations.ts", "src/names.ts"]) expect(readFileSync(file, "utf8"), file).not.toMatch(/custom/);
    expect(readFileSync("src/load.ts", "utf8")).not.toMatch(/^import .*custom/m);
    expect(readFileSync("src/element.ts", "utf8")).not.toMatch(/^import .*custom/m);
  });
});
