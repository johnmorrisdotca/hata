// The standalone flag builder reuses the flag-specific writers and the shared controls.
import { FLAG_CODES, VERSION } from "./dist/index.js";
import { flagAspect, flagName } from "./dist/names.js";
import { FLAG_ELEMENT_ATTRIBUTES } from "./dist/element.js";
import { manifest, variantsOf, LEFT_OUT } from "./dist/manifest.js";
import "./dist/element-define.js";
import { familyEmbedBuilder, FAMILY_EMBED_BUILDER_WORDS } from "./family-embed-builder.js";
import { FLAG_OPTIONS, HATA_PRODUCT } from "./embed-hata.js";

const codeChoices = [...FLAG_CODES, ...LEFT_OUT.filter(one => one.variants.length > 0).map(one => one.code)];
const needsVariant = settings => settings.variant ? !variantsOf(settings.code ?? "JP").some(one => one.id === settings.variant) : !FLAG_CODES.includes(settings.code ?? "JP");
const words = {
  en: {
    ...FAMILY_EMBED_BUILDER_WORDS.en,
    pitch: "Choose a flag, preview it, and copy the code for your page.",
    name: "Hata is Japanese for flag.",
    nameLink: "About the name",
    foot: "The choices are in the link. The flag is drawn in your browser.",
    toGallery: "Flag gallery",
    makerFlag: "A flag",
    makerFlagSays: "A flag at its own proportions or in a frame.",
    copyLink: "Copy a link to this flag",
    missingVariant: "Choose a valid variant id from the gallery panel; a place with no default flag needs an explicit choice.",
    loading: "Preparing the image code…"
  },
  ja: {
    ...FAMILY_EMBED_BUILDER_WORDS.ja,
    pitch: "旗を選んで表示を確認し、ページに埋め込むコードをコピーできます。",
    name: "「旗」は英語の flag に当たります。",
    nameLink: "名前について",
    foot: "選択はリンクに入ります。旗はブラウザで描画されます。",
    toGallery: "旗の一覧",
    makerFlag: "旗",
    makerFlagSays: "本来の縦横比、または枠に収めた旗です。",
    copyLink: "この旗へのリンクをコピー",
    missingVariant: "一覧のパネルにある別の旗の id を指定してください。既定の旗がない地域では、指定が必要です。",
    loading: "画像のコードを準備しています…"
  },
};
const row = (id, kind, en, ja, extra = {}) => ({ id, group: "flag", kind, names: { call: id, element: id },
  say: { en: { label: en[0], help: en[1] }, ja: { label: ja[0], help: ja[1] } }, ...extra });
const options = [
  row("code", "choice", ["Flag", "Choose a country or region."], ["旗", "国や地域を選びます。"], { default: "JP", choices: codeChoices, control: "select", choiceLabels: Object.fromEntries(["en", "ja"].map((lang) => [lang, Object.fromEntries(codeChoices.map((code) => [code, `${flagName(code, lang) ?? code} (${code})`]))])) }),
  row("shape", "choice", ["Shape", "Keep its proportions or choose a frame."], ["形", "本来の縦横比、または枠の形を選びます。"], { default: "own", choices: ["own", "4:3", "1:1", "round"] }),
  row("variant", "text", ["Variant (optional)", "Choose a variant id from the flag's gallery panel; empty uses the default."], ["別の旗（任意）", "旗の一覧のパネルにある id で指定します。空のままなら既定の旗を描きます。"]),
  row("fit", "choice", ["Whole or cropped", "Use the curated frame, the whole flag or a crop."], ["全体か切り抜きか", "旗に合わせた表示・旗の全体・切り抜きから選びます。"], { default: "auto", choices: ["auto", "whole", "crop", "cover", "hoist", "contain"] }),
  row("size", "choice", ["Display size", "Small, medium or large; width overrides it."], ["表示の大きさ", "小・中・大を選びます。幅の指定が優先されます。"], { choices: ["small", "medium", "large"] }),
  row("width", "number", ["Width", "Width in pixels, preserving the flag's proportions."], ["幅", "旗の縦横比を保った幅を、ピクセルで指定します。"], { range: { min: 12, max: 600, step: 4 } }),
  row("lang", "choice", ["Spoken name language", "The language of the name a screen reader reads."], ["読み上げる言語", "スクリーンリーダーが読む地名の言語です。"], { choices: ["en", "ja"] }),
  row("label", "text", ["Spoken name", "An optional name for a screen reader."], ["読み上げる名前", "スクリーンリーダー用の名前です。指定は任意です。"]),
  row("border", "boolean", ["Border", "Show a thin border around the flag."], ["枠線", "旗のまわりに細い線を表示します。"], { default: false }),
  row("shadow", "boolean", ["Shadow", "Show a soft shadow below the flag."], ["影", "旗の下にやわらかい影を表示します。"], { default: false }),
  row("theme", "choice", ["Theme", "Use a light or dark border, or follow the device."], ["配色", "明るい枠線・暗い枠線、または端末の設定に合わせます。"], { default: "auto", choices: ["auto", "light", "dark"] }),
];
for (const option of options.filter((one) => one.kind === "choice")) {
  const original = FLAG_OPTIONS.find((one) => one.id === option.id);
  if (original?.choices) option.choiceLabels = Object.fromEntries(["en", "ja"].map((lang) => [lang, Object.fromEntries(original.choices.map((choice) => [choice.value, choice.label[lang]]))]));
}
options.find((option) => option.id === "size").choiceLabels = { en: { small: "Small", medium: "Medium", large: "Large" }, ja: { small: "小", medium: "中", large: "大" } };
const sizes = { small: 24, medium: 48, large: 96 };
const aspect = (settings) => settings.shape === "4:3" ? 4 / 3 : settings.shape === "round" || settings.shape === "1:1" ? 1 : (() => { const drawing = variantsOf(settings.code ?? "JP").find(one => one.id === settings.variant)?.drawing; return drawing ? drawing.width / drawing.height : flagAspect(settings.code ?? "JP") ?? 1.5; })();
const width = (settings) => Number(settings.width) > 0 ? Number(settings.width) : (sizes[settings.size] ?? 48) * aspect(settings);
const legacy = (settings) => ({ code: "JP", shape: "own", lang: document.documentElement.lang, label: "", theme: "auto", ...settings, size: width(settings) / aspect(settings) });
let context = {};
let epoch = 0;
let mounted;
const page = globalThis.familyLanguage({ id: "hata", words, onChange: () => mounted?.draw() });
const builder = familyEmbedBuilder({ id: "hata", packageName: "@johnmorrisdotca/hata", major: VERSION.split(".")[0], site: "https://johnmorrisdotca.github.io/hata/", title: "Hata · a flag", titleJa: "旗の埋め込み", options,
  groups: { flag: { en: "The flag", ja: "旗の設定" } }, unit: (option) => option.id === "width" ? "px" : "",
  leftOut: { "element.loading": "The preview is eager; iframe snippets use lazy loading." },
  makers: { flag: { names: "call", element: "element", tag: "hata-flag", embed: "embed/", description: "makerFlagSays", required: ["code"], width: (settings) => Math.ceil(width(settings)) + 8, height: (settings) => Math.ceil(width(settings) / aspect(settings)) + 8,
    formats: ["element", "img", "data", "iframe", "module", "react", "vue", "svelte", "angular", "html", "url"] } },
  formats: { ...familyEmbedBuilder({ packageName: "@example/embed", major: 1, site: "https://example.test/", makers: {} }).formats,
    img: HATA_PRODUCT.writers.img, data: HATA_PRODUCT.writers.data },
  code: ({ maker, format, attrs, settings }) => {
    if (needsVariant(settings)) return null;
    if ((format === "iframe" || format === "url") && settings.lang === undefined) return builder.codeFor(maker, format, options, { ...settings, lang: page.lang });
    if (format === "data" && !context.uri) return null;
    return HATA_PRODUCT.writers[format]?.write(legacy(settings), attrs, context);
  },
});
builder.validateCoverage({ element: FLAG_ELEMENT_ATTRIBUTES });
mounted = builder.mount({ words, language: () => page, initial: { flag: { size: "medium", lang: page.lang } }, renderPreview: ({ stage, settings, attrs, note, say }) => {
  const current = ++epoch;
  if (needsVariant(settings)) { note.textContent = say("missingVariant"); return { destroy() { epoch += 1; } }; }
  const values = legacy(settings);
  context = { framing: manifest(values.code)?.framings[values.shape] ?? null };
  const element = document.createElement("hata-flag");
  element.setAttribute("loading", "eager");
  for (const [name, value] of attrs) element.setAttribute(name, value);
  stage.append(element);
  note.textContent = say("loading");
  HATA_PRODUCT.context(values).then((made) => {
    if (current !== epoch) return;
    context = made;
    note.textContent = "";
    mounted.refreshCode();
  }).catch(() => { if (current === epoch) note.textContent = ""; });
  return { destroy() { epoch += 1; element.remove(); } };
} });
