// The family's embed builder (demo/embed-builder.js): the code it writes for each format from a product's options,
// held here without a page. Plain JavaScript, as the builder is. Hata's own side (demo/embed-hata.js) needs the
// built package and a browser, and is driven in e2e/element.demo.mjs.
import { describe, expect, it } from "vitest";

import { allCode, attributesFor, codeFor, embedAddress, FORMATS, formatLabel, settingsFrom } from "../demo/embed-builder.js";

// A product that is not Hata, so nothing here can lean on Hata's names.
const product = {
  name: "Thing",
  package: "@example/thing",
  tag: "ex-thing",
  define: "@example/thing/element/define",
  cdn: "https://cdn.example/thing/element-define.js",
  embed: "https://example.org/embed.html",
  formats: ["element", "iframe", "react", "vue", "svelte", "angular", "note"],
  frameSize: (settings) => ({ width: settings.size + 8, height: settings.size + 8 }),
  title: (settings) => `Thing ${settings.id}`,
  writers: { note: { label: { en: "Note", ja: "メモ" }, language: "text", write: (settings, attributes) => `${settings.id}: ${attributes.length}` } },
};
const schema = [
  { id: "id", kind: "fixed", attribute: "id-code", default: "A", required: true, label: { en: "Id", ja: "ID" } },
  { id: "shape", kind: "choice", attribute: "shape", default: "own", label: { en: "Shape", ja: "形" }, choices: [{ value: "own", label: { en: "Own", ja: "本来" } }, { value: "round", label: { en: "Round", ja: "円形" } }] },
  { id: "size", kind: "number", attribute: "size", default: 48, required: true, min: 12, max: 512, label: { en: "Size", ja: "大きさ" } },
  { id: "label", kind: "text", attribute: "label", default: "", label: { en: "Label", ja: "ラベル" } },
  { id: "border", kind: "boolean", attribute: "border", default: false, label: { en: "Border", ja: "枠線" } },
];

describe("the builder's settings and attributes", () => {
  it("fills defaults, keeps a choice only when it is one, and holds a number to its range", () => {
    expect(settingsFrom(schema, {})).toEqual({ id: "A", shape: "own", size: 48, label: "", border: false });
    expect(settingsFrom(schema, { shape: "star", size: 9000, border: "1" })).toMatchObject({ shape: "own", size: 512, border: true });
  });

  it("writes an attribute only for a choice that is not the default, a required one always, and a flag bare", () => {
    expect(attributesFor(schema, settingsFrom(schema, { id: "B" }))).toEqual([["id-code", "B"], ["size", "48"]]);
    expect(attributesFor(schema, settingsFrom(schema, { id: "B", shape: "round", border: true, label: 'Say "hi"' }))).toEqual([["id-code", "B"], ["shape", "round"], ["size", "48"], ["label", 'Say "hi"'], ["border", ""]]);
  });

  it("puts the attributes in the embed page's query, a flag as 1", () => {
    expect(embedAddress(product, schema, settingsFrom(schema, { id: "B", shape: "round", border: true }))).toBe("https://example.org/embed.html?id-code=B&shape=round&size=48&border=1");
  });
});

describe("the code it writes", () => {
  const settings = settingsFrom(schema, { id: "B", shape: "round", border: true, label: "<b>" });

  it("writes the element after its script, escaping what an attribute must", () => {
    expect(codeFor("element", product, schema, settings)).toBe('<script type="module" src="https://cdn.example/thing/element-define.js"></script>\n<ex-thing id-code="B" shape="round" size="48" label="&lt;b>" border></ex-thing>');
  });

  it("writes an iframe at the product's size with its title, the address's & escaped", () => {
    expect(codeFor("iframe", product, schema, settings)).toBe('<iframe src="https://example.org/embed.html?id-code=B&amp;shape=round&amp;size=48&amp;label=%3Cb%3E&amp;border=1" title="Thing B" width="56" height="56" style="border:0;vertical-align:middle" loading="lazy"></iframe>');
  });

  it("writes React with numbers in braces, and Vue, Svelte and Angular importing the element's definition", () => {
    const react = codeFor("react", product, schema, settings);
    for (const prop of ['id-code="B"', 'shape="round"', "size={48}", 'label="<b>"', "      border\n"]) expect(react).toContain(prop);
    expect(codeFor("react", product, schema, settingsFrom(schema, { id: "B" }))).toContain('return <ex-thing id-code="B" size={48} />;');
    expect(codeFor("vue", product, schema, settings)).toContain('isCustomElement: (tag) => tag.startsWith("ex-")');
    for (const format of ["react", "vue", "svelte", "angular"]) expect(codeFor(format, product, schema, settings), format).toContain('import "@example/thing/element/define";');
    expect(codeFor("angular", product, schema, settings)).toContain("schemas: [CUSTOM_ELEMENTS_SCHEMA]");
  });

  it("hands a format of the product's own to its writer, and answers null for one the product does not offer", () => {
    expect(codeFor("note", product, schema, settings)).toBe("B: 5");
    expect(codeFor("module", product, schema, settings)).toBeNull();
    expect(Object.keys(allCode(product, schema, settings))).toEqual(product.formats);
    expect(formatLabel(product, "note", "ja")).toBe("メモ");
    expect(formatLabel(product, "element", "ja")).toBe(FORMATS.element.label.ja);
  });
});
