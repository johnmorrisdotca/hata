// The demo page's own script: a gallery of every flag with a detail panel, and a flag quiz, each drawn from the
// package's own built files, as a page that installed it would. The gallery shows dist/svg/<code>.svg; the detail
// panel loads the flag's module with /load and its frames with flag(code, { shape }), and writes the code to embed
// it with the family's builder (embed-builder.js, given Hata's side in embed-hata.js); the facts are /manifest's. The names are
// Kuni's, written into names.js when the site is built. The page's words are set as text, never as HTML.
import "./dist/element-define.js";
import { aspectOf, FLAG_CODES, flagUrl, toDataUri } from "./dist/index.js";
import { toMarkdown, toSql } from "./downloads.js";
import { flag } from "./dist/load.js";
import { LEFT_OUT, manifest, MANIFEST } from "./dist/manifest.js";
import { mountEmbedBuilder } from "./embed-builder.js";
import { FLAG_OPTIONS, HATA_PRODUCT } from "./embed-hata.js";
import { CONTINENTS, NAMES } from "./names.js";
import { WORDS } from "./words.js";

const $ = (id) => document.getElementById(id);
const language = familyLanguage({ id: "hata", words: WORDS, onChange: () => sayAll() });
const say = (key, values) => {
  const word = WORDS[language.lang][key] ?? WORDS.en[key];
  return values === undefined ? word : word.replace(/\{(\w+)\}/g, (whole, name) => String(values[name] ?? ""));
};
const ja = () => language.lang === "ja";
const nameOf = (code) => (ja() ? NAMES[code].ja : NAMES[code].en);
const otherName = (code) => (ja() ? NAMES[code].en : NAMES[code].ja);
const groupOf = (code) => (code.length === 2 ? "country" : code.slice(0, 2).toLowerCase());
// The sets the gallery can show, in the order of the codes: the countries, then each country's first level.
const GROUPS = ["country", ...new Set(FLAG_CODES.filter((code) => code.length > 2).map(groupOf))];
// The quiz's modes: a set with at least four flags of its own to ask about, and Europe's regions together, since the
// United Kingdom, France and Austria each have fewer than four flags no other place flies.
const EUROPE = ["gb", "de", "fr", "ch", "at"];
const MODES = ["country", "jp", "ca", "us", "au", "br", "de", "ch", "europe"];
const fileOf = (code) => `dist/svg/${code.toLowerCase()}.svg`;
const KB = (bytes) => (bytes < 1024 ? `${bytes} B` : `${(bytes / 1024).toFixed(1)} KB`);
const RATIOS = [[1, "1:1"], [4 / 3, "4:3"], [3 / 2, "3:2"], [5 / 3, "5:3"], [8 / 5, "8:5"], [5 / 4, "5:4"], [7 / 4, "7:4"], [13 / 7, "13:7"], [19 / 10, "19:10"], [2, "2:1"], [11 / 8, "11:8"], [7 / 5, "7:5"], [10 / 7, "10:7"], [9 / 7, "9:7"], [11 / 6, "11:6"], [5 / 2, "5:2"]];
const ratioOf = (record) => {
  const value = record.width / record.height;
  const near = RATIOS.find(([target]) => Math.abs(target - value) / target < 0.004);
  return `${near ? `${near[1]} · ` : ""}${value.toFixed(3)} : 1`;
};

// Letters as a search compares them: NFKC, lower case, accents off, katakana as hiragana.
const fold = (text) =>
  String(text ?? "")
    .normalize("NFKC")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[ァ-ヶ]/g, (letter) => String.fromCharCode(letter.charCodeAt(0) - 0x60))
    .replace(/[\s'’.\-_,()（）・]/g, "");

// What the address says, and keeping it there: the tab, the gallery's choices and the quiz's game.
const asked = new URLSearchParams(location.search);
const state = {
  tab: asked.get("tab") === "quiz" ? "quiz" : "gallery",
  query: asked.get("q") ?? "",
  set: ["all", ...GROUPS].includes(asked.get("set")) ? asked.get("set") : "all",
  region: Object.keys(CONTINENTS).includes(asked.get("region")) ? asked.get("region") : "all",
  shape: ["flag", "4:3", "1:1", "round"].includes(asked.get("shape")) ? asked.get("shape") : "flag",
  fit: ["auto", "whole", "crop"].includes(asked.get("fit")) ? asked.get("fit") : "auto",
  mode: MODES.includes(asked.get("mode")) ? asked.get("mode") : "country",
  seed: /^[\w-]{1,32}$/.test(asked.get("seed") ?? "") ? asked.get("seed") : null,
};
const remember = () => {
  const query = new URLSearchParams(location.search);
  const put = (key, value, plain) => (value === plain || value === "" || value === null ? query.delete(key) : query.set(key, value));
  put("tab", state.tab, "gallery");
  put("q", state.query, "");
  put("set", state.set, "all");
  put("region", state.region, "all");
  put("shape", state.shape, "flag");
  put("fit", state.fit, "auto");
  put("mode", state.tab === "quiz" ? state.mode : null, null);
  put("seed", state.tab === "quiz" ? state.seed : null, null);
  const search = query.toString();
  history.replaceState(history.state, "", `${location.pathname}${search ? `?${search}` : ""}${location.hash}`);
};

// Saving a file the page made.
const save = (name, content, type) => {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(content instanceof Blob ? content : new Blob([content], { type }));
  link.download = name;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(link.href), 4000);
};

const copy = async (text, field, status) => {
  try {
    await navigator.clipboard.writeText(text);
    status.textContent = say("copied");
  } catch (_error) {
    if (field) field.focus();
    if (field && "select" in field) field.select();
    status.textContent = say("copy_failed");
  }
};

// ----- Tabs ----------------------------------------------------------------------------------------------------

function showTab(tab) {
  state.tab = tab;
  for (const button of document.querySelectorAll("[data-tab]")) button.setAttribute("aria-selected", String(button.dataset.tab === tab));
  $("gallery-panel").hidden = tab !== "gallery";
  $("quiz-panel").hidden = tab !== "quiz";
  if (tab === "quiz" && quiz.questions.length === 0) startGame(state.seed ?? newSeed());
  remember();
}
for (const button of document.querySelectorAll("[data-tab]")) button.addEventListener("click", () => showTab(button.dataset.tab));

// ----- The gallery ---------------------------------------------------------------------------------------------

const records = new Map(MANIFEST.map((record) => [record.code, record]));
const tiles = new Map();
for (const code of FLAG_CODES) {
  const item = document.createElement("li");
  const button = document.createElement("button");
  button.type = "button";
  button.className = "tile";
  button.dataset.code = code;
  button.dataset.testid = `tile-${code}`;
  button.setAttribute("data-testid", `tile-${code}`);
  const picture = document.createElement("span");
  picture.className = "pic";
  const image = document.createElement("img");
  image.src = fileOf(code);
  image.alt = "";
  image.loading = "lazy";
  image.decoding = "async";
  picture.append(image);
  const label = document.createElement("span");
  label.className = "label";
  const name = document.createElement("span");
  name.className = "name";
  const small = document.createElement("code");
  small.textContent = code;
  label.append(name, small);
  button.append(picture, label);
  // A place whose flag is claimed by more than one authority or community says so, on the card.
  let badge = null;
  if (MANIFEST.find((record) => record.code === code)?.disputed) {
    badge = Object.assign(document.createElement("span"), { className: "badge" });
    badge.setAttribute("data-testid", `disputed-${code}`);
    button.append(badge);
  }
  button.addEventListener("click", () => showDetail(code));
  item.append(button);
  tiles.set(code, { item, name, badge });
  $("grid").append(item);
}
const searchText = new Map(FLAG_CODES.map((code) => [code, [code, NAMES[code].en, NAMES[code].ja, NAMES[code].short, NAMES[code].shortJa, NAMES[code].reading].map(fold).join("|")]));

// The picture a tile shows at the gallery's shape and frame (best for the flag, whole, or cropped): the drawing made by
// hand for it where there is one and the frame is not "whole", else the flag's own file, fitted by CSS the way the package
// fits it (data-fit: cover, crop or contain; data-at: the side a crop keeps).
function drawTilePicture(code) {
  const image = tiles.get(code).item.querySelector("img");
  const framing = state.shape === "flag" ? null : records.get(code).framings[state.shape];
  const owner = (records.get(code).sameAs ?? code).toLowerCase();
  const drawn = framing?.method === "adapted" && state.fit !== "whole";
  const src = drawn ? `dist/svg/${owner}.${state.shape === "4:3" ? "4x3" : "1x1"}.svg` : fileOf(code);
  if (image.getAttribute("src") !== src) image.src = src;
  // Asked for by name, "whole" is the whole flag and "crop" is a crop (kept at the side chosen for the flag); "best" is the package's own choice.
  const fit = framing === null || drawn ? "cover" : state.fit === "whole" ? "contain" : state.fit === "crop" ? "crop" : framing.fit;
  image.dataset.fit = fit;
  if (fit === "crop") image.dataset.at = framing.crop.at;
  else delete image.dataset.at;
}

function fillSets() {
  const set = $("set");
  set.replaceChildren(...["all", ...GROUPS].map((value) => Object.assign(document.createElement("option"), { value, textContent: say(`set_${value}`) })));
  set.value = state.set;
  const mode = $("mode");
  mode.replaceChildren(...MODES.map((value) => Object.assign(document.createElement("option"), { value, textContent: say(`mode_${value}`) })));
  mode.value = state.mode;
}

function fillRegion() {
  const select = $("region");
  const options = [["all", say("region_all")], ...Object.entries(CONTINENTS).filter(([code]) => FLAG_CODES.some((one) => NAMES[one].continent === code)).map(([code, names]) => [code, names[language.lang]])];
  select.replaceChildren(...options.map(([value, text]) => Object.assign(document.createElement("option"), { value, textContent: text })));
  select.value = state.region;
}

function drawGallery() {
  const wanted = fold(state.query);
  let shown = 0;
  for (const code of FLAG_CODES) {
    const tile = tiles.get(code);
    tile.name.textContent = nameOf(code);
    tile.name.lang = language.lang;
    if (tile.badge !== null) tile.badge.textContent = say("disputed");
    tile.item.querySelector("button").setAttribute("aria-label", say("tile", { name: nameOf(code), code }));
    const group = groupOf(code);
    const visible = (state.set === "all" || state.set === group) && (state.region === "all" || (group === "country" && NAMES[code].continent === state.region)) && (wanted === "" || searchText.get(code).includes(wanted));
    tile.item.hidden = !visible;
    if (visible) {
      shown += 1;
      drawTilePicture(code);
    }
  }
  $("count").textContent = say("count", { shown, total: FLAG_CODES.length });
  $("empty").hidden = shown > 0;
  $("grid").dataset.shape = state.shape;
  $("region-row").hidden = state.set !== "all" && state.set !== "country";
  $("set").value = state.set;
  for (const button of $("shape").querySelectorAll("button")) button.setAttribute("aria-pressed", String(button.dataset.value === state.shape));
  $("fit").hidden = state.shape === "flag";
  $("grid").dataset.fit = state.fit;
  for (const button of $("fit").querySelectorAll("button")) button.setAttribute("aria-pressed", String(button.dataset.value === state.fit));
}

function drawLeftOut() {
  $("left-out-list").replaceChildren(
    ...LEFT_OUT.map((one) => {
      const item = document.createElement("li");
      const head = document.createElement("b");
      head.textContent = `${one.code} ${nameOf(one.code)}`;
      const reason = document.createElement("span");
      reason.lang = "en";
      reason.textContent = ` ${one.reason}`;
      item.append(head, reason);
      // A place with no flag of its own can still have flags in real use: its panel shows them (Northern Ireland).
      if (one.variants.length > 0) {
        const button = Object.assign(document.createElement("button"), { type: "button", className: "fam-button", textContent: say("show_variants", { n: one.variants.length }) });
        button.setAttribute("data-testid", `variants-${one.code}`);
        button.addEventListener("click", () => showDetail(one.code));
        item.append(" ", button);
      }
      return item;
    }),
  );
  document.querySelector('[data-testid="left-out"] summary').textContent = say("left_out_title", { n: LEFT_OUT.length });
}

$("search").value = state.query;
$("search").addEventListener("input", () => {
  state.query = $("search").value;
  drawGallery();
  remember();
});
for (const button of $("shape").querySelectorAll("button")) {
  button.addEventListener("click", () => {
    state.shape = button.dataset.value;
    drawGallery();
    remember();
  });
}
for (const button of $("fit").querySelectorAll("button")) {
  button.addEventListener("click", () => {
    state.fit = button.dataset.value;
    drawGallery();
    remember();
  });
}
$("set").addEventListener("change", () => {
  state.set = $("set").value;
  if (state.set !== "all" && state.set !== "country") state.region = "all";
  $("region").value = state.region;
  drawGallery();
  remember();
});
$("region").addEventListener("change", () => {
  state.region = $("region").value;
  drawGallery();
  remember();
});
/** The flags shown, a row each: what the list downloads (TXT, Markdown and SQL) hold. */
const LIST_COLUMNS = ["code", "english", "japanese", "source", "licence", "file"];
const listRows = () =>
  FLAG_CODES.filter((code) => !tiles.get(code).item.hidden).map((code) => {
    const record = records.get(code);
    return { code, english: NAMES[code].en, japanese: NAMES[code].ja, source: record.source, licence: record.licence.name, file: record.file };
  });
$("download-list").addEventListener("click", () => {
  const lines = [LIST_COLUMNS.join("\t"), ...listRows().map((row) => LIST_COLUMNS.map((column) => row[column]).join("\t"))];
  save("hata-flags.txt", `${lines.join("\n")}\n`, "text/plain;charset=utf-8");
});
$("download-list-md").addEventListener("click", () => save("hata-flags.md", toMarkdown(LIST_COLUMNS, listRows()), "text/markdown;charset=utf-8"));
$("download-list-sql").addEventListener("click", () => save("hata-flags.sql", toSql("flags", LIST_COLUMNS, listRows()), "application/sql;charset=utf-8"));
$("download-manifest").addEventListener("click", () => save("hata-manifest.json", `${JSON.stringify({ flags: MANIFEST, leftOut: LEFT_OUT }, null, 1)}\n`, "application/json"));

// ----- The detail panel ----------------------------------------------------------------------------------------

let opened = null;
let openedSvg = null;

const fact = (list, label, value, options = {}) => {
  if (value === null || value === undefined || value === "") return;
  const term = document.createElement("dt");
  term.textContent = label;
  const detail = document.createElement("dd");
  if (options.href) {
    const link = Object.assign(document.createElement("a"), { href: options.href, textContent: value, rel: "noopener" });
    detail.append(link);
  } else detail.textContent = value;
  if (options.lang) detail.lang = options.lang;
  list.append(term, detail);
};

// The flags of a place in real use besides, or instead of, the one its code gives (variantsOf): the panel's switch.
const variantsOfPlace = (code) => (manifest(code) ?? LEFT_OUT.find((one) => one.code === code))?.variants ?? [];
const MODULE_FILE = (module) => `dist/svg/${module}.svg`;
let openedVariant = null;

async function showDetail(code, variantId) {
  opened = code;
  const record = manifest(code);
  const variants = variantsOfPlace(code);
  const chosen = variants.length === 0 ? null : (variants.find((one) => one.id === variantId) ?? variants.find((one) => one.default) ?? variants[0]);
  // A variant that is not the place's own flag has a drawing of its own; the default is the place's flag as the code gives it.
  const own = chosen !== null && !chosen.default ? chosen : null;
  openedVariant = own === null ? null : own.id;
  $("detail-title").textContent = nameOf(code);
  $("detail-title").lang = language.lang;
  $("detail-other").textContent = `${otherName(code)} · ${code}`;
  $("detail-flag").src = own === null ? fileOf(code) : MODULE_FILE(own.module);
  $("detail-flag").alt = nameOf(code);
  drawVariants(code, variants, chosen);
  const facts = $("facts");
  facts.replaceChildren();
  if (own !== null) {
    const drawing = own.drawing;
    fact(facts, say("fact_code"), `${code} · ${own.id}`);
    fact(facts, say("fact_ratio"), ratioOf(drawing));
    fact(facts, say("fact_size"), say("fact_size_plain", { bytes: KB(drawing.bytes) }));
    fact(facts, say("fact_source"), say("source_commons"));
    fact(facts, say("fact_file"), drawing.file, { href: drawing.page, lang: "en" });
    fact(facts, say("fact_author"), drawing.author ?? say("none"), { lang: "en" });
    fact(facts, say("fact_licence"), drawing.licence.name, drawing.licence.url ? { href: drawing.licence.url, lang: "en" } : { lang: "en" });
    fact(facts, say("fact_restrictions"), drawing.restrictions.length > 0 ? drawing.restrictions.join(", ") : say("none"), { lang: "en" });
    fact(facts, say("fact_dates"), say("fact_dates_uploaded", { uploaded: drawing.uploaded ?? "" }));
  } else {
    fact(facts, say("fact_code"), code);
    fact(facts, say("fact_ratio"), ratioOf(record));
    fact(facts, say("fact_size"), say("fact_size_value", { bytes: KB(record.bytes), gzip: KB(record.gzip) }));
    fact(facts, say("fact_source"), record.source === "commons" ? say("source_commons") : say("source_set", { source: record.source }));
    fact(facts, say("fact_why"), record.why, { lang: "en" });
    fact(facts, say("fact_file"), record.file, { href: record.page, lang: "en" });
    fact(facts, say("fact_author"), record.author ?? say("none"), { lang: "en" });
    fact(facts, say("fact_licence"), record.licence.name, record.licence.url ? { href: record.licence.url, lang: "en" } : { lang: "en" });
    if (record.reference) fact(facts, say("fact_reference"), `${record.reference.file} (${record.reference.licence})`, { href: record.reference.page, lang: "en" });
    fact(facts, say("fact_restrictions"), record.restrictions.length > 0 ? record.restrictions.join(", ") : say("none"), { lang: "en" });
    if (record.sameAs) fact(facts, say("fact_shared"), `${record.sameAs} ${nameOf(record.sameAs)}`);
    for (const note of record.notes) fact(facts, say("fact_notes"), note, { lang: "en" });
    fact(facts, say("fact_dates"), record.uploaded ? say("fact_dates_value", { uploaded: record.uploaded, fetched: record.fetched }) : say("fact_dates_set", { source: record.source, version: record.version, fetched: record.fetched }));
  }
  $("copied").textContent = "";
  const dialog = $("detail");
  if (!dialog.open) dialog.showModal();
  // The flag's own module, loaded the way a page would, then framed three ways.
  const svg = await flag(code, own === null ? undefined : { variant: own.id });
  if (opened !== code || openedVariant !== (own?.id ?? null)) return;
  openedSvg = svg;
  await drawFrames(code, own);
  if (opened !== code || openedVariant !== (own?.id ?? null)) return;
  drawCopies(code, svg, own);
  drawEmbed(code, own);
}

// Which of a place's flags is shown: a switch with a button for each, and below it the chosen one's status, dates, reason
// and source. Nothing shows for a place with one flag.
function drawVariants(code, variants, chosen) {
  const box = $("variants");
  box.hidden = variants.length === 0;
  const place = manifest(code) ?? LEFT_OUT.find((one) => one.code === code);
  $("disputed-note").hidden = !place?.disputed;
  if (variants.length === 0) return;
  $("variant-switch").replaceChildren(
    ...variants.map((one) => {
      const button = Object.assign(document.createElement("button"), { type: "button", textContent: ja() ? one.nameJa : one.name });
      button.dataset.value = one.id;
      button.setAttribute("data-testid", `variant-${one.id}`);
      button.setAttribute("aria-pressed", String(one.id === chosen.id));
      button.lang = language.lang;
      button.addEventListener("click", () => showDetail(code, one.id));
      return button;
    }),
  );
  const why = $("variant-why");
  const dates = chosen.from !== null && chosen.until !== null ? say("variant_dates_between", { from: chosen.from, until: chosen.until }) : chosen.from !== null ? say("variant_dates_since", { from: chosen.from }) : chosen.until !== null ? say("variant_dates_until", { until: chosen.until }) : "";
  const status = Object.assign(document.createElement("b"), { textContent: say(`status_${chosen.status.replace("-", "_")}`) });
  status.dataset.status = chosen.status;
  const reason = Object.assign(document.createElement("span"), { textContent: ` ${chosen.why}`, lang: "en" });
  const source = Object.assign(document.createElement("a"), { href: chosen.source, textContent: say("variant_source"), rel: "noopener" });
  why.replaceChildren(status, ...(dates === "" ? [] : [` · ${dates}`]), ...(chosen.default ? [` · ${say("variant_default")}`] : []), document.createElement("br"), reason, " ", source);
  why.dataset.variant = chosen.id;
}

// What a crop of the flag is, in words: the drawing made for the shape by hand, the side a person chose, or the centre,
// and, where the package shows the whole flag by default, why.
function cropHow(framing) {
  const { rule, at, loses } = framing.crop;
  if (rule === "own") return say("how_crop_own");
  if (framing.method === "adapted") return say("how_crop_adapted");
  const side = say(`side_${at}`);
  if (rule === "curated") return loses.length > 0 ? say("how_crop_allowed", { side }) : side;
  if (rule === "centre") return say("how_crop_centre");
  if (at !== "centre") return say("how_crop_side_loses", { side });
  return loses.length > 0 ? say("how_crop_whole_loses") : say("how_crop_whole_judged");
}

// Each shape's two frames side by side, the whole flag and the crop, each loaded the way a page would
// (flag(code, { shape, fit })), and labelled with how it was made and which of the two is the default.
async function drawFrames(code, own) {
  const record = own === null ? manifest(code) : null;
  const shapes = [["4:3", "frame_43"], ["1:1", "frame_11"], ["round", "frame_round"]];
  const framed = await Promise.all(shapes.flatMap(([shape]) => [flag(code, { shape, fit: "whole", ...(own === null ? {} : { variant: own.id }) }), flag(code, { shape, fit: "crop", ...(own === null ? {} : { variant: own.id }) })]));
  if (opened !== code) return;
  const heading = Object.assign(document.createElement("p"), { className: "fam-fine", textContent: say("frames_title") });
  $("frames").replaceChildren(
    heading,
    ...shapes.map(([shape, key], at) => {
      // A variant's picture has no side chosen by hand: its frames are measured, a centre crop or the whole flag.
      const framing = own === null ? record.framings[shape] : { method: "cover", fit: own.frames[shape], crop: { rule: own.frames[shape] === "contain" ? "whole" : "centre", at: "centre", why: null, loses: [] } };
      const pair = document.createElement("div");
      pair.className = "frame-pair";
      pair.setAttribute("data-testid", `frame-${shape}`);
      pair.dataset.method = framing.method;
      // What `auto` does: the whole flag where the crop loses a colour or misrepresents it, else the crop.
      const preferred = framing.method === "own" ? "whole" : framing.fit === "contain" && framing.method !== "adapted" ? "whole" : "crop";
      pair.dataset.default = framing.method === "own" ? "both" : preferred;
      for (const [which, offset] of [["whole", 0], ["crop", 1]]) {
        const figure = document.createElement("figure");
        figure.dataset.frame = which;
        figure.setAttribute("data-testid", `frame-${shape}-${which}`);
        const image = Object.assign(document.createElement("img"), { src: toDataUri(framed[at * 2 + offset]), alt: "" });
        image.dataset.shape = shape;
        const caption = Object.assign(document.createElement("figcaption"), { textContent: `${say(key)} · ${say(`frame_${which}`)}` });
        const how = Object.assign(document.createElement("small"), { textContent: which === "whole" ? say("how_whole") : cropHow(framing) });
        if (which === "crop" && framing.crop.why !== null) {
          how.title = framing.crop.why;
          how.dataset.why = "true";
        }
        if (which === "crop" && framing.crop.loses.length > 0) how.title = `${how.title ? `${how.title} ` : ""}(${framing.crop.loses.join(", ")})`;
        caption.append(document.createElement("br"), how);
        if (framing.method !== "own" && preferred === which) {
          const tag = Object.assign(document.createElement("small"), { textContent: say("frame_default") });
          tag.dataset.default = "true";
          caption.append(document.createElement("br"), tag);
        }
        figure.append(image, caption);
        pair.append(figure);
      }
      return pair;
    }),
  );
}

// "Embed this flag": the family's builder, given Hata's options and code writers, on the flag that is open.
let builder = null;
function drawEmbed(code, own) {
  const variant = own === null ? "" : own.id;
  if (builder === null) builder = mountEmbedBuilder($("embed"), { product: HATA_PRODUCT, schema: FLAG_OPTIONS, values: { code, variant }, lang: language.lang });
  else builder.update({ code, variant });
}

function drawCopies(code, svg, own) {
  const lower = own === null ? code.toLowerCase() : own.module;
  const rows = [
    ["copy_import", `import flag from "@johnmorrisdotca/hata/flags/${lower}";`],
    ["copy_load", `import { flag } from "@johnmorrisdotca/hata/load";\nconst svg = await flag("${code}"${own === null ? "" : `, { variant: "${own.id}" }`});`],
    ["copy_img", `<img src="${own === null ? flagUrl(code) : flagUrl("JP").replace("jp.svg", `${own.module}.svg`)}" alt="${NAMES[code].en.replace(/"/g, "&quot;")}" height="48">`],
    ["copy_svg", svg],
  ];
  $("copies").replaceChildren(
    ...rows.map(([key, text]) => {
      const box = document.createElement("div");
      box.className = "copy";
      const head = document.createElement("div");
      head.className = "copy-head";
      const label = Object.assign(document.createElement("span"), { textContent: say(key) });
      const button = Object.assign(document.createElement("button"), { type: "button", className: "fam-button", textContent: say("copy") });
      button.dataset.copy = key;
      button.setAttribute("data-testid", `copy-${key}`);
      const field = Object.assign(document.createElement("textarea"), { className: "fam-field", value: text, readOnly: true, rows: key === "copy_svg" ? 3 : text.split("\n").length, spellcheck: false });
      field.setAttribute("aria-label", say(key));
      button.addEventListener("click", () => copy(text, field, $("copied")));
      head.append(label, button);
      box.append(head, field);
      return box;
    }),
  );
}

const openedName = () => (openedVariant === null ? opened.toLowerCase() : `${opened.toLowerCase()}--${openedVariant}`);
$("download-svg").addEventListener("click", () => openedSvg && save(`${openedName()}.svg`, `${openedSvg}\n`, "image/svg+xml"));
$("download-json").addEventListener("click", () => opened && save(`${openedName()}.json`, `${JSON.stringify({ ...(manifest(opened) ?? LEFT_OUT.find((one) => one.code === opened)), names: { en: NAMES[opened].en, ja: NAMES[opened].ja } }, null, 1)}\n`, "application/json"));
$("download-png").addEventListener("click", async () => {
  if (!openedSvg) return;
  const width = Number($("png-size").value);
  const height = Math.round(width / aspectOf(openedSvg));
  const image = new Image();
  image.src = toDataUri(openedSvg);
  await image.decode();
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  canvas.getContext("2d").drawImage(image, 0, 0, width, height);
  canvas.toBlob((blob) => save(`${openedName()}-${width}.png`, blob), "image/png");
});
$("detail").addEventListener("close", () => {
  opened = null;
  openedVariant = null;
  openedSvg = null;
});
// A tap on the backdrop, outside the panel, closes it.
$("detail").addEventListener("click", (event) => {
  if (event.target === $("detail")) $("detail").close();
});

// ----- The quiz ------------------------------------------------------------------------------------------------

const QUESTIONS = 10;
const quiz = { questions: [], at: 0, score: 0, streak: 0, answered: false };

// Each mode asks only flags no other place shares, so every question has one right answer.
const shared = new Set(MANIFEST.filter((record) => record.sameAs !== null).flatMap((record) => [record.code, record.sameAs]));
const poolOf = (mode) => FLAG_CODES.filter((code) => (mode === "europe" ? EUROPE.includes(groupOf(code)) : groupOf(code) === mode) && !shared.has(code));

// A seeded generator: the same seed and mode give the same game in every browser.
const hash = (text) => {
  let value = 2166136261;
  for (let at = 0; at < text.length; at += 1) value = Math.imul(value ^ text.charCodeAt(at), 16777619);
  return value >>> 0;
};
const generator = (seed) => {
  let value = seed;
  return () => {
    value = (value + 0x6d2b79f5) | 0;
    let mixed = Math.imul(value ^ (value >>> 15), 1 | value);
    mixed = (mixed + Math.imul(mixed ^ (mixed >>> 7), 61 | mixed)) ^ mixed;
    return ((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296;
  };
};
const shuffle = (list, random) => {
  const out = [...list];
  for (let at = out.length - 1; at > 0; at -= 1) {
    const other = Math.floor(random() * (at + 1));
    [out[at], out[other]] = [out[other], out[at]];
  }
  return out;
};
const newSeed = () => {
  const bytes = new Uint8Array(4);
  window.crypto.getRandomValues(bytes);
  return [...bytes].map((byte) => byte.toString(36).padStart(2, "0")).join("").slice(0, 6);
};
const today = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
};
const bestKey = () => `hata.quiz.best.${state.mode}`;
const readBest = () => {
  try {
    return Number(localStorage.getItem(bestKey()) ?? 0) || 0;
  } catch (_error) {
    return 0;
  }
};

function startGame(seed) {
  state.seed = seed;
  const random = generator(hash(`${state.mode}|${seed}`));
  const pool = poolOf(state.mode);
  quiz.questions = shuffle(pool, random)
    .slice(0, QUESTIONS)
    .map((answer) => ({ answer, options: shuffle([answer, ...shuffle(pool.filter((code) => code !== answer), random).slice(0, 3)], random), picked: null }));
  quiz.at = 0;
  quiz.score = 0;
  quiz.streak = 0;
  quiz.answered = false;
  $("shared").textContent = "";
  drawQuestion();
  remember();
}

function drawQuestion() {
  const question = quiz.questions[quiz.at];
  $("seed").textContent = state.seed;
  $("mode").value = state.mode;
  $("score").textContent = String(quiz.score);
  $("streak").textContent = String(quiz.streak);
  $("best").textContent = String(readBest());
  $("progress").textContent = say("progress", { n: quiz.at + 1, total: quiz.questions.length });
  $("question").src = fileOf(question.answer);
  $("question").alt = say("question");
  $("question").dataset.code = question.answer;
  $("choices").replaceChildren(
    ...question.options.map((code, at) => {
      const button = Object.assign(document.createElement("button"), { type: "button", className: "fam-button choice", textContent: nameOf(code) });
      button.lang = language.lang;
      button.dataset.code = code;
      button.setAttribute("data-testid", `choice-${at}`);
      if (question.picked !== null) {
        button.disabled = true;
        if (code === question.answer) button.dataset.state = "right";
        else if (code === question.picked) button.dataset.state = "wrong";
      }
      button.addEventListener("click", () => answer(code));
      return button;
    }),
  );
  const last = quiz.at === quiz.questions.length - 1;
  if (question.picked === null) $("verdict").textContent = "";
  else if (last) $("verdict").textContent = say("done", { score: quiz.score, total: quiz.questions.length });
  else $("verdict").textContent = question.picked === question.answer ? say("right", { name: nameOf(question.answer) }) : say("wrong", { name: nameOf(question.answer) });
  $("next").hidden = question.picked === null;
  $("next").textContent = last ? say("again") : say("next");
}

function answer(code) {
  const question = quiz.questions[quiz.at];
  if (question.picked !== null) return;
  question.picked = code;
  if (code === question.answer) {
    quiz.score += 1;
    quiz.streak += 1;
    if (quiz.streak > readBest()) {
      try {
        localStorage.setItem(bestKey(), String(quiz.streak));
      } catch (_error) {
        // Not remembered on this device; the run still counts here.
      }
    }
  } else quiz.streak = 0;
  drawQuestion();
  $("next").focus();
}

$("next").addEventListener("click", () => {
  if (quiz.at === quiz.questions.length - 1) startGame(state.seed);
  else {
    quiz.at += 1;
    drawQuestion();
  }
});
$("mode").addEventListener("change", () => {
  state.mode = $("mode").value;
  startGame(state.seed ?? newSeed());
});
$("new-game").addEventListener("click", () => startGame(newSeed()));
$("daily").addEventListener("click", () => startGame(today()));
$("share").addEventListener("click", async () => {
  const query = new URLSearchParams({ tab: "quiz", mode: state.mode, seed: state.seed, lang: language.lang });
  const url = `${location.origin}${location.pathname}?${query}`;
  try {
    await navigator.clipboard.writeText(url);
    $("shared").textContent = say("shared", { url });
  } catch (_error) {
    $("shared").textContent = say("share_failed", { url });
  }
});

// ----- Words, and the first drawing ---------------------------------------------------------------------------

function sayAll() {
  fillSets();
  fillRegion();
  builder?.setLanguage(language.lang);
  drawGallery();
  drawLeftOut();
  if (quiz.questions.length > 0) drawQuestion();
  if (opened !== null) showDetail(opened, openedVariant ?? undefined);
}

fillSets();
fillRegion();
drawGallery();
drawLeftOut();
showTab(state.tab);
document.querySelector("main").dataset.ready = "true";
