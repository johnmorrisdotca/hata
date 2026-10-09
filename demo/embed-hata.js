// Hata's side of the embed builder (demo/embed-builder.js, which names no product): the options of <hata-flag>, and
// the code only Hata writes, a plain <img> of the CDN's SVG file framed by CSS, the same as a data: URI, and an ES
// module. The preview is a live <hata-flag> drawn by the package's own element.
import { flagDataUri } from "./dist/load.js";
import { manifest } from "./dist/manifest.js";
import { flagAspect, flagName } from "./dist/names.js";

const PACKAGE = "@johnmorrisdotca/hata";
const SVG_BASE = `https://cdn.jsdelivr.net/npm/${PACKAGE}@1/dist/svg`;

/** The options of <hata-flag>, as the builder reads them. The flag's code is the page's to choose, so it is fixed. */
export const FLAG_OPTIONS = [
  { id: "code", kind: "fixed", attribute: "code", default: "JP", required: true, label: { en: "Code", ja: "コード" } },
  {
    id: "shape",
    kind: "choice",
    attribute: "shape",
    default: "own",
    label: { en: "Shape", ja: "形" },
    help: { en: "Its own proportions, or framed at 4:3, square or round without stretching.", ja: "本来の縦横比のまま、または 4:3・正方形・円形の枠に、引き伸ばさずに収めます。" },
    choices: [
      { value: "own", label: { en: "Its own proportions", ja: "本来の縦横比" } },
      { value: "4:3", label: { en: "4:3", ja: "4:3" } },
      { value: "1:1", label: { en: "Square", ja: "正方形" } },
      { value: "round", label: { en: "Round", ja: "円形" } },
    ],
  },
  { id: "size", kind: "number", attribute: "size", default: 48, required: true, min: 12, max: 512, step: 4, label: { en: "Height (px)", ja: "高さ（px）" }, help: { en: "Its height in CSS pixels; the width follows from the shape.", ja: "CSS ピクセルでの高さです。幅は形に合わせて決まります。" } },
  {
    id: "lang",
    kind: "choice",
    attribute: "lang",
    default: "",
    label: { en: "Name read aloud in", ja: "地名を読み上げる言語" },
    help: { en: "The language of the place's name a screen reader says. Left as the page's, it follows the page.", ja: "スクリーンリーダーが読み上げる地名の言語です。「ページの言語」ではページに合わせます。" },
    choices: [
      { value: "", label: { en: "The page's language", ja: "ページの言語" } },
      { value: "en", label: { en: "English", ja: "英語" } },
      { value: "ja", label: { en: "Japanese", ja: "日本語" } },
    ],
  },
  { id: "label", kind: "text", attribute: "label", default: "", label: { en: "Spoken name (optional)", ja: "読み上げる名前（任意）" }, help: { en: "What a screen reader says instead of the place's name.", ja: "地名の代わりにスクリーンリーダーが読み上げる文です。" } },
  { id: "border", kind: "boolean", attribute: "border", default: false, label: { en: "Border", ja: "枠線" }, help: { en: "A hairline round the flag, so a white flag shows on a white page.", ja: "旗のまわりに細い線を引き、白い旗が白いページでも見えるようにします。" } },
  { id: "shadow", kind: "boolean", attribute: "shadow", default: false, label: { en: "Shadow", ja: "影" }, help: { en: "A soft shadow under the flag.", ja: "旗の下にやわらかい影をつけます。" } },
  {
    id: "theme",
    kind: "choice",
    attribute: "theme",
    default: "auto",
    label: { en: "Border for", ja: "枠線の配色" },
    help: { en: "Whether the border is drawn for a light page, a dark one, or whichever the reader's device prefers.", ja: "枠線を明るいページ用・暗いページ用のどちらで描くか、または端末の設定に合わせるかを選びます。" },
    choices: [
      { value: "auto", label: { en: "The device's choice", ja: "端末の設定" } },
      { value: "light", label: { en: "A light page", ja: "明るいページ" } },
      { value: "dark", label: { en: "A dark page", ja: "暗いページ" } },
    ],
  },
];

const aspectFor = (settings) => (settings.shape === "4:3" ? 4 / 3 : settings.shape === "own" ? (flagAspect(settings.code) ?? 1.5) : 1);
const nameFor = (settings) => settings.label || flagName(settings.code, settings.lang || "en") || settings.code;
const escapeAttribute = (text) => String(text).replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;");

// The CSS an <img> needs to look as <hata-flag> does: framed by object-fit where no drawing was made for the shape.
function imageStyle(settings, framing, adapted) {
  const rules = [];
  if (settings.shape !== "own" && !adapted) {
    rules.push(`object-fit:${framing?.fit === "contain" ? "contain" : "cover"}`);
    if (framing?.fit === "hoist") rules.push("object-position:left");
    if (settings.shape === "round" && framing?.fit === "contain") rules.push("background:#e6e6e6");
  }
  if (settings.shape === "round") rules.push("border-radius:50%");
  const shadows = [settings.border ? `0 0 0 1px ${settings.theme === "dark" ? "rgba(255,255,255,.32)" : "rgba(0,0,0,.22)"}` : "", settings.shadow ? "0 1px 3px rgba(0,0,0,.28)" : ""].filter(Boolean);
  if (shadows.length > 0) rules.push(`box-shadow:${shadows.join(",")}`);
  return rules.length === 0 ? "" : ` style="${rules.join(";")}"`;
}

/** Hata as a product the builder can write code for. */
export const HATA_PRODUCT = {
  name: "Hata",
  package: PACKAGE,
  tag: "hata-flag",
  define: `${PACKAGE}/element/define`,
  cdn: `https://cdn.jsdelivr.net/npm/${PACKAGE}@1/dist/element-define.js`,
  embed: "https://johnmorrisdotca.github.io/hata/embed.html",
  formats: ["element", "img", "data", "iframe", "module", "react", "vue", "svelte", "angular"],
  async context(settings) {
    const options = settings.shape === "own" ? undefined : { shape: settings.shape };
    return { uri: await flagDataUri(settings.code, options), framing: manifest(settings.code)?.framings[settings.shape] ?? null };
  },
  frameSize(settings) {
    const height = Number(settings.size);
    // The embed page leaves 4 pixels round the flag, for its shadow.
    return { width: Math.ceil(height * aspectFor(settings)) + 8, height: height + 8 };
  },
  title(settings) {
    return settings.lang === "ja" ? `${nameFor(settings)}の旗` : `Flag of ${nameFor(settings)}`;
  },
  preview(box, settings) {
    const element = box.querySelector("hata-flag") ?? Object.assign(document.createElement("hata-flag"), { loading: "eager" });
    element.setAttribute("loading", "eager");
    for (const option of FLAG_OPTIONS) {
      const value = settings[option.id];
      if (option.kind === "boolean") element.toggleAttribute(option.attribute, Boolean(value));
      else if (value === "" || value === undefined) element.removeAttribute(option.attribute);
      else element.setAttribute(option.attribute, String(value));
    }
    // Put on the page once its attributes are set, so it draws once.
    if (element.parentNode !== box) box.replaceChildren(element);
  },
  writers: {
    img: {
      label: { en: "<img>", ja: "<img>" },
      language: "html",
      write(settings, _attributes, context) {
        const size = Number(settings.size);
        const adapted = settings.shape !== "own" && context.framing?.method === "adapted";
        const file = adapted ? `${settings.code.toLowerCase()}.${settings.shape === "4:3" ? "4x3" : "1x1"}.svg` : `${settings.code.toLowerCase()}.svg`;
        const width = Math.round(size * aspectFor(settings));
        return `<img src="${SVG_BASE}/${file}" alt="${escapeAttribute(nameFor(settings))}" width="${width}" height="${size}"${imageStyle(settings, context.framing, adapted)}>`;
      },
    },
    data: {
      label: { en: "data: URI", ja: "data: URI" },
      language: "html",
      write(settings, _attributes, context) {
        const size = Number(settings.size);
        const width = Math.round(size * aspectFor(settings));
        // The data: URI is the flag already framed, a circle cut and all, as /load frames it.
        return `<img src="${context.uri ?? ""}" alt="${escapeAttribute(nameFor(settings))}" width="${width}" height="${size}">`;
      },
    },
    module: {
      label: { en: "ES module", ja: "ES モジュール" },
      language: "js",
      write(settings) {
        const options = settings.shape === "own" ? "" : `, { shape: ${JSON.stringify(settings.shape)} }`;
        return `import { flagDataUri } from "${PACKAGE}/load";\n\nconst image = new Image();\nimage.src = (await flagDataUri(${JSON.stringify(settings.code)}${options})) ?? "";\nimage.alt = ${JSON.stringify(nameFor(settings))};\nimage.height = ${Number(settings.size)};\ndocument.body.append(image);`;
      },
    },
  },
};
