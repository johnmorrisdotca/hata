// An attacker's list against the custom flag checker: what must be refused, what must come out whole, and what two flags or two sets must never do to each other.
import { afterEach, describe, expect, it } from "vitest";

import { frame, toDataUri } from "./index";
import { customFlag, customName, listCustomFlags, registerFlags, removeFlags } from "./custom";
import type { CustomFlagRecord, CustomFlagSource } from "./custom";
import { checkSvg } from "./custom-svg";

const NS = 'xmlns="http://www.w3.org/2000/svg"';
const GOOD = `<svg ${NS} viewBox="0 0 3 2"><path fill="#036" d="M0 0h3v2H0z"/></svg>`;
const wrap = (inner: string, rootExtra = ""): string => `<svg ${NS} viewBox="0 0 3 2"${rootExtra}>${inner}</svg>`;
const info = (id: string): CustomFlagSource["info"] => ({
  id,
  name: { en: "Mine", ja: "私の" },
  credit: { en: "Mine, drawn by me", ja: "私の（自作）" },
  licence: { name: "Mine to give", url: "https://example.org/terms" },
  url: "https://example.org/mine",
  retrieved: "2026-11-13",
});
let counter = 0;
const sets: string[] = [];
const register = async (records: unknown[], id = `atk-${++counter}`) => {
  sets.push(id);
  return registerFlags({ kind: "records", info: info(id), records: () => records as CustomFlagRecord[] });
};
const record = (svg: string, slug = "one", extra: Partial<CustomFlagRecord> = {}): CustomFlagRecord => ({ id: `custom:${slug}`, name: { en: "One" }, svg, ...extra });
afterEach(() => {
  for (const id of sets.splice(0)) removeFlags(id);
});
const refused = (svg: string, slug = "one"): string => {
  try {
    checkSvg(svg, slug);
  } catch (error) {
    expect(error).toBeInstanceOf(TypeError);
    return (error as Error).message;
  }
  throw new Error(`was accepted: ${svg.slice(0, 120)}`);
};

describe("attempts that must be refused whole", () => {
  const attempts: [string, string][] = [
    ["a script in the wrong case", wrap("<SCRIPT>alert(1)</SCRIPT>")],
    ["a script in an svg: prefix", wrap('<svg:script xmlns:svg="http://www.w3.org/2000/svg">alert(1)</svg:script>')],
    ["an on* attribute in capitals", wrap('<path ONCLICK="alert(1)" d="M0 0h1v1H0z"/>')],
    ["an on* attribute after a newline", wrap('<path\nonclick="alert(1)" d="M0 0h1v1H0z"/>')],
    ["an on* attribute with a tab before =", wrap('<path onclick\t=\t"alert(1)" d="M0 0h1v1H0z"/>')],
    ["an on* attribute with no space between attributes", wrap('<path d="M0 0h1v1H0z"onload="alert(1)"/>')],
    ["an on* attribute in single quotes", wrap("<path onload='alert(1)' d='M0 0h1v1H0z'/>")],
    ["a tab inside javascript:", wrap('<use href="java&#9;script:alert(1)"/>')],
    ["a raw tab inside javascript:", wrap('<use href="java\tscript:alert(1)"/>')],
    ["a raw newline inside javascript:", wrap('<use href="java\nscript:alert(1)"/>')],
    ["a leading control character before javascript:", wrap('<use href="\u0001javascript:alert(1)"/>')],
    ["vbscript:", wrap('<use xlink:href="vbscript:msgbox(1)"/>')],
    ["a data: href", wrap('<use href="data:image/svg+xml;base64,PHN2Zy8+"/>')],
    ["a href on a path", wrap('<path href="#a" d="M0 0h1v1H0z"/><g id="a"/>')],
    ["a href on an a element", wrap('<a xlink:href="javascript:alert(1)"/>')],
    ["animate on href", wrap('<use href="#a"><animate attributeName="href" values="javascript:alert(1)"/></use><g id="a"/>')],
    ["animateTransform", wrap("<animateTransform/>")],
    ["an iframe", wrap("<iframe/>")],
    ["an embed", wrap("<embed/>")],
    ["an object", wrap("<object/>")],
    ["a switch", wrap("<switch/>")],
    ["a text element", wrap("<text>hi</text>")],
    ["a pattern", wrap('<pattern id="p"/>')],
    ["a filter", wrap('<filter id="f"><feImage href="https://evil.example/a"/></filter>')],
    ["feTurbulence", wrap('<filter id="f"><feTurbulence baseFrequency="0.001" numOctaves="10"/></filter>')],
    ["a filter attribute", wrap('<path filter="url(#f)" d="M0 0h1v1H0z"/>')],
    ["a style in a title", wrap("<title><style>x{}</style></title>")],
    ["a css import in a fill", wrap('<path fill="url(#a);@import url(//evil.example)" d="M0 0h1v1H0z"/><g id="a"/>')],
    ["expression() in a fill", wrap('<path fill="expression(alert(1))" d="M0 0h1v1H0z"/>')],
    ["-moz-binding in a fill", wrap('<path fill="-moz-binding:url(//evil.example)" d="M0 0h1v1H0z"/>')],
    ["a semicolon in a fill", wrap('<path fill="red;stroke:url(//evil.example)" d="M0 0h1v1H0z"/>')],
    ["a class", wrap('<path class="x" d="M0 0h1v1H0z"/>')],
    ["a nested svg with width and an unquoted attribute", wrap("<svg x=1/>")],
    ["an unterminated comment", `${GOOD}<!-- `],
    ["a comment holding a close", wrap("<!-- --><!-- --!><script/>")],
    ["a CDATA section on the root level", `<![CDATA[x]]>${GOOD}`],
    ["a DOCTYPE with an external entity", `<!DOCTYPE svg SYSTEM "http://evil.example/x.dtd">${GOOD}`],
    ["a billion-laughs DOCTYPE", `<!DOCTYPE s [<!ENTITY a "x"><!ENTITY b "&a;&a;&a;&a;">]>${wrap("<title>&b;</title>")}`],
    ["an entity reference in a title", wrap("<title>&b;</title>")],
    ["an entity with no semicolon", wrap("<title>&lt</title>")],
    ["a NUL byte in a value", wrap('<path d="M0 0\u0000h1" />')],
    ["a NUL byte in a title", wrap("<title>a\u0000b</title>")],
    ["a bidi override in a title", wrap("<title>a‮b</title>")],
    ["a line separator in a title", wrap("<title>a b</title>")],
    ["a no-break space as the separator before a fallback", wrap('<path fill="url(#a) red ;x" d="M0 0h1v1H0z"/><g id="a"/>')],
    ["a no-break space in a path", wrap('<path d="M0 0h1v1H0z"/>')],
    ["a line separator in a value", wrap('<path d="M0 0 h1v1H0z"/>')],
    ["a quote in a path", wrap('<path d="M0 0&quot;h1v1H0z"/>')],
    ["a quote in a transform", wrap(`<path transform='scale(1)"onload="x' d="M0 0h1v1H0z"/>`)],
    ["a duplicate attribute", wrap('<path d="M0 0h1v1H0z" d="M0 0"/>')],
    ["a duplicate id", wrap('<g id="a"/><g id="a"/>')],
    ["an id with a quote", wrap(`<g id='a"b'/>`)],
    ["an id starting with a hyphen", wrap('<g id="-a"/>')],
    ["a url() that is not closed", wrap('<path fill="url(#a" d="M0 0h1v1H0z"/><g id="a"/>')],
    ["two urls in one fill", wrap('<path fill="url(#a) url(#b)" d="M0 0h1v1H0z"/><g id="a"/><g id="b"/>')],
    ["a url to a fragment of another file", wrap('<path fill="url(x.svg#a)" d="M0 0h1v1H0z"/>')],
    ["a use pointing at a use pointing out", wrap('<use href="#a"/><use id="a" href="http://evil.example/x.svg#b"/>')],
    ["a use with an xlink and a bad href", wrap('<g id="a"/><use xlink:href="#a" href="//evil.example/a#b"/>')],
    ["a mixed-case xmlns", wrap("<g XMLNS=\"http://evil.example\"/>")],
    ["a non-xml-declaration xml pi", `<?xml-stylesheet href="x"?>${GOOD}`],
    ["an xml declaration with a doctype after it", `<?xml version="1.0"?><!DOCTYPE svg>${GOOD}`],
    ["an xml declaration twice", `<?xml version="1.0"?><?xml version="1.0"?>${GOOD}`],
    ["an unclosed tag", wrap("<g><path d='M0 0h1v1H0z'/>")],
    ["a close tag with attributes", wrap('<g></g x="1">')],
    ["a stray >", wrap("<g/>>")],
    ["a stray < in text", wrap("<title>a < b</title>")],
    ["a > in text outside a title", wrap("<g/> > <g/>")],
    ["text after the root", `${GOOD}junk`],
    ["a root that is not first", `junk${GOOD}`],
    ["svg with a width in a nested element too big (huge number)", wrap("<g/>", ' viewBox="0 0 1e999 1e999"').replace(' viewBox="0 0 3 2" viewBox', " viewBox")],
    ["a viewBox with a negative size", `<svg ${NS} viewBox="0 0 -3 2"><g/></svg>`],
    ["a viewBox with a word", `<svg ${NS} viewBox="0 0 a 2"><g/></svg>`],
  ];
  for (const [name, svg] of attempts) it(name, () => expect(() => checkSvg(svg, "one"), svg.slice(0, 100)).toThrow(TypeError));

  it("a reference of any kind to the page, an address or a fragment of another file, in any attribute that may hold one", () => {
    for (const attribute of ["fill", "stroke", "stop-color", "clip-path", "mask"]) for (const target of ["url(#nope)", "url('#a')", 'url("#a")', "url(&#35;a)", "URL(//x/a#b)", "url(http://x/a#b)", "url( #a b)", "url(#a/*)"]) {
      expect(() => checkSvg(wrap(`<path ${attribute}="${target}" d="M0 0h1v1H0z"/><g id="a"/>`), "one"), `${attribute} ${target}`).toThrow(TypeError);
    }
  });
});

describe("amplification the first checker did not count", () => {
  it("refuses masks that each hold ten shapes masked by the next: ten levels would be drawn 10^10 times", () => {
    const levels = Array.from({ length: 10 }, (_, level) => `<mask id="m${level + 1}">${`<rect width="1" height="1" mask="url(#m${level})"/>`.repeat(10)}</mask>`).join("");
    const svg = wrap(`<defs><mask id="m0"><rect width="1" height="1"/></mask>${levels}</defs><path mask="url(#m10)" d="M0 0h1v1H0z"/>`);
    expect(refused(svg)).toMatch(/expands to more than 4000 elements/);
  });
  it("refuses clip paths that each hold ten shapes clipped by the next", () => {
    const levels = Array.from({ length: 10 }, (_, level) => `<clipPath id="c${level + 1}">${`<rect width="1" height="1" clip-path="url(#c${level})"/>`.repeat(10)}</clipPath>`).join("");
    expect(refused(wrap(`<defs><clipPath id="c0"><rect width="1" height="1"/></clipPath>${levels}</defs><path clip-path="url(#c10)" d="M0 0h1v1H0z"/>`))).toMatch(/expands to more than 4000 elements/);
  });
  it("refuses a mask or a clip path that refers to itself, directly or through another", () => {
    expect(refused(wrap('<mask id="a"><rect mask="url(#a)"/></mask>'))).toMatch(/points back to itself/);
    expect(refused(wrap('<clipPath id="a"><rect clip-path="url(#b)"/></clipPath><clipPath id="b"><rect clip-path="url(#a)"/></clipPath>'))).toMatch(/points back to itself/);
    expect(refused(wrap('<mask id="a" mask="url(#a)"/>'))).toMatch(/points back to itself/);
  });
  it("refuses gradients that point at each other", () => {
    expect(refused(wrap('<linearGradient id="a" href="#b"/><linearGradient id="b" xlink:href="#a"/>'))).toMatch(/points back to itself/);
    expect(refused(wrap('<linearGradient id="a" href="#a"/>'))).toMatch(/points back to itself/);
  });
  it("still allows a plain flag with a gradient reused, a mask and a clip path", () => {
    const ok = wrap('<defs><linearGradient id="g"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#000"/></linearGradient><mask id="m"><rect width="3" height="2" fill="#fff"/></mask><clipPath id="c"><rect width="3" height="2"/></clipPath></defs>' + '<path fill="url(#g)" d="M0 0h1v1H0z" mask="url(#m)" clip-path="url(#c)"/>'.repeat(200));
    expect(() => checkSvg(ok, "one")).not.toThrow();
  });
  it("does not overflow the stack on a very long chain of uses", () => {
    const chain = Array.from({ length: 1900 }, (_, at) => `<g id="g${at}"><use href="#g${at + 1}"/></g>`).join("") + '<g id="g1900"/>';
    try {
      checkSvg(wrap(chain), "one");
    } catch (error) {
      expect(error).toBeInstanceOf(TypeError);
    }
  });
});

describe("what comes out", () => {
  it("never has two flags' ids meet: slug a with id b-c and slug a-b with id c are different ids", async () => {
    const withId = (id: string): string => wrap(`<defs><linearGradient id="${id}"><stop offset="0" stop-color="#fff"/></linearGradient></defs><path fill="url(#${id})" d="M0 0h1v1H0z"/>`);
    await register([record(withId("b-c"), "a"), record(withId("c"), "a-b")]);
    const ids = (svg: string): string[] => [...svg.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1] as string);
    const first = ids(customFlag("custom:a") ?? "");
    const second = ids(customFlag("custom:a-b") ?? "");
    expect(first).toHaveLength(1);
    expect(second).toHaveLength(1);
    expect(first[0]).not.toBe(second[0]);
  });
  it("holds ids of every flag apart for all slugs and ids: the map from (slug, id) to the written id is one-to-one", () => {
    const written = new Map<string, string>();
    for (const slug of ["a", "a-b", "a-b-c", "ab", "a1", "1-a"]) for (const id of ["b", "b-c", "c", "-", "_c", "b--c", "b_c", "x1"]) {
      if (!/^[A-Za-z_]/.test(id)) continue;
      const out = checkSvg(wrap(`<g id="${id}"/>`), slug).svg;
      const got = /\sid="([^"]+)"/.exec(out)?.[1] as string;
      expect(written.has(got), `${slug} ${id} -> ${got} (already ${written.get(got)})`).toBe(false);
      written.set(got, `${slug} ${id}`);
    }
  });
  it("is made of allowed tags and attributes only, with every value in a plain alphabet", async () => {
    const rich = wrap('<title>T &lt;x&gt; &apos;q&apos;</title><desc>D</desc><defs><linearGradient id="g" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fff"/></linearGradient></defs><g fill="url(#g) red" opacity=".5"><path d="M0 0h1v1H0z"/></g>');
    await register([record(rich, "rich")]);
    const out = customFlag("custom:rich") ?? "";
    for (const [, close, name] of out.matchAll(/<(\/?)([A-Za-z][A-Za-z0-9:]*)/g)) expect(["svg", "g", "defs", "path", "linearGradient", "stop", "title", "desc"], `${close}${name}`).toContain(name);
    for (const [, , value] of out.matchAll(/\s([A-Za-z:-]+)="([^"]*)"/g)) expect(value, "an attribute value").toMatch(/^[A-Za-z0-9 ,.+\-%()#_:/]*$/);
  });
  it("writes no apostrophe, so a data URI put in a css url('…') cannot be left by a title", async () => {
    await register([record(wrap("<title>x&apos;);background:url(//evil.example/a)</title><path d=\"M0 0h1v1H0z\"/>"), "q")]);
    const out = customFlag("custom:q") ?? "";
    expect(out).not.toContain("'");
    expect(toDataUri(out)).not.toContain("'");
    expect(frame(out, { shape: "round" }) ?? "").not.toContain("'");
  });
  it("keeps a title and a description to text: a tag inside one is an integration point for html parsers", () => {
    expect(refused(wrap("<title><g/></title>"))).toMatch(/only text/);
    expect(refused(wrap("<desc><path d='M0 0h1v1H0z'/></desc>"))).toMatch(/only text/);
  });
  it("frames with a hostile label without letting it out of its attribute or its title", async () => {
    await register([record(GOOD, "f")]);
    const framed = frame(customFlag("custom:f") ?? "", { shape: "round", label: '"><script>alert(1)</script><x a="' }) ?? "";
    expect(framed).not.toMatch(/<script/);
    expect(framed).not.toMatch(/aria-label="[^"]*"[^>]*<script/);
    expect(toDataUri(framed)).not.toMatch(/[<>"]/);
  });
});

describe("the page's registration", () => {
  it("cannot be shadowed or aliased by the keys of an object: the prototype names are ordinary slugs", async () => {
    const done = await register([record(GOOD, "constructor"), record(GOOD, "tostring"), record(GOOD, "proto"), { id: "custom:__proto__", name: { en: "x" }, svg: GOOD }, { id: "__proto__", name: { en: "x" }, svg: GOOD }, { id: "constructor", name: { en: "x" }, svg: GOOD }]);
    expect(done.added).toEqual(["custom:constructor", "custom:tostring", "custom:proto"]);
    expect(done.rejected.map((one) => one.id)).toEqual(["custom:__proto__", "__proto__", "constructor"]);
    expect(customFlag("custom:__proto__")).toBeNull();
    expect(customFlag("__proto__")).toBeNull();
    expect(customFlag("custom:hasOwnProperty")).toBeNull();
  });
  it("is not changed by a source whose id changes between the check and the use", async () => {
    await register([record(GOOD, "keep")], "victim");
    let reads = 0;
    const sneaky = { kind: "records", get info() { reads += 1; return { ...info("sneaky"), id: reads === 1 ? "sneaky" : "victim" }; }, records: () => [record(GOOD, "stolen")] } as unknown as CustomFlagSource;
    sets.push("sneaky");
    await registerFlags(sneaky).catch(() => undefined);
    expect(customFlag("custom:keep")).not.toBeNull();
    expect(listCustomFlags().filter((one) => one.source === "victim").map((one) => one.id)).toEqual(["custom:keep"]);
  });
  it("is not changed by editing the source's info after it was accepted", async () => {
    const shared = info("edited");
    sets.push("edited");
    await registerFlags({ kind: "records", info: shared, records: () => [record(GOOD, "e")] });
    shared.credit.en = "";
    shared.licence.name = "";
    const { customCreditLine } = await import("./custom");
    expect(customCreditLine("en")).toBe("Mine, drawn by me (Mine to give).");
  });
  it("refuses control characters in the names and keeps the reason short", async () => {
    const done = await register([record(GOOD, "n1", { name: { en: "a\nb" } }), record(GOOD, "n2", { name: { en: "ok", ja: "a‮b" } }), { id: `custom:${"x".repeat(5000)}`, name: { en: "x" }, svg: GOOD }]);
    expect(done.added).toEqual([]);
    expect(done.rejected[2]?.reason.length ?? 0).toBeLessThan(400);
  });
  it("hands out names and lists as copies: changing one changes no flag", async () => {
    await register([record(GOOD, "copy")]);
    const listed = listCustomFlags()[0];
    if (listed !== undefined) listed.name.en = "changed";
    expect(customName("custom:copy")).toBe("One");
  });
});

describe("a seeded mutation run", () => {
  it("whatever is accepted comes out made of allowed tags and plain attribute values only", () => {
    const base = wrap('<title>T</title><defs><linearGradient id="g"><stop offset="0" stop-color="#fff"/></linearGradient><mask id="m"><rect width="3" height="2"/></mask></defs><g fill="url(#g) red" mask="url(#m)"><path d="M0 0h1v1H0z" transform="scale(1)"/><use href="#m"/></g>');
    const pieces = ["<script>", "</script>", " onload=", '"', "'", "&#x6a;", "&amp;", "javascript:", "data:", "url(", "#", "<!--", "-->", "<![CDATA[", "<?", "<style>", "\u0000", " ", " ", "<a ", "<image ", "<use ", "xlink:href=", "href=", "style=", "<foreignObject>", "<![", "<!DOCTYPE", ">", "<", "/", "=", " "];
    let seed = 12345;
    const next = (limit: number): number => {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      return seed % limit;
    };
    let accepted = 0;
    for (let round = 0; round < 6000; round += 1) {
      let text = base;
      for (let edit = 0, edits = 1 + next(3); edit < edits; edit += 1) {
        const at = next(text.length);
        const piece = pieces[next(pieces.length)] as string;
        text = next(3) === 0 ? text.slice(0, at) + text.slice(at + 1 + next(6)) : text.slice(0, at) + piece + text.slice(at);
      }
      let out: string;
      try {
        out = checkSvg(text, "fuzz").svg;
      } catch (error) {
        expect(error).toBeInstanceOf(TypeError);
        continue;
      }
      accepted += 1;
      for (const [, , name] of out.matchAll(/<(\/?)([A-Za-z][A-Za-z0-9:]*)/g)) expect(["svg", "g", "defs", "path", "linearGradient", "stop", "title", "desc", "mask", "rect", "use"], text).toContain(name);
      expect(out, text).not.toMatch(/javascript|<script|<style|@import|expression|data:|\son[a-z]+=|<!|<\?|&#|'/i);
      for (const [, name, value] of out.matchAll(/\s([A-Za-z:-]+)="([^"]*)"/g)) {
        if (name === "xmlns") continue;
        expect(value, `${name} of ${text}`).toMatch(/^[A-Za-z0-9 ,.+\-%()#_:/]*$/);
      }
    }
    expect(accepted).toBeGreaterThan(50);
  });
});
