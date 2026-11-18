// The codes page: every code the package knows, with its English and Japanese names, its flag and links to it, searchable by
// code or name in either language. Written from the manifest and the names when the site is built (codes-data.js), so it
// cannot drift from the package: a row is [code, English, Japanese, kind, reading, reason], and the picture is the package's own SVG.
import { ROWS } from "./codes-data.js";

const $ = (id) => document.getElementById(id);
const words = {
  en: {
    pitch: "Every code the package knows, with its names and its flag.",
    name: "Hata is Japanese for flag.",
    nameLink: "About the name",
    foot: "Drawn from the package's own manifest, in your browser.",
    toGallery: "Flag gallery",
    pageDocs: "Docs",
    pageApi: "API",
    intro: "Every code with a flag, and every code that has none and why, with its English and Japanese names. Type a code or part of a name, in either language, to narrow the list.",
    search: "Search by code or name",
    show: "Show",
    showAll: "Every code",
    showCountry: "Countries",
    showRegion: "Regions",
    showFormer: "Former countries",
    showNone: "Codes with no flag",
    colFlag: "Flag",
    colCode: "Code",
    colEnglish: "English",
    colJapanese: "Japanese",
    colLinks: "Links",
    count: "{n} of {all} codes",
    empty: "No code matches. Try another name or a code.",
    svg: "SVG file",
    gallery: "In the gallery",
    noFlag: "no flag",
  },
  ja: {
    pitch: "パッケージが扱うすべてのコードを、名前と旗とともに一覧にします。",
    name: "Hataは、国や地域のしるしとして掲げる「旗（はた）」のことです。",
    nameLink: "名前について",
    foot: "パッケージのマニフェストから、お使いのブラウザで描いています。",
    toGallery: "旗の一覧",
    pageDocs: "ドキュメント",
    pageApi: "API（英語）",
    intro: "旗のあるすべてのコードと、旗のないコードとその理由を、英語と日本語の名前とともに並べています。コードか名前の一部を、どちらの言語でも入力すると、一覧を絞り込めます。",
    search: "コードか名前で探す",
    show: "表示",
    showAll: "すべてのコード",
    showCountry: "国",
    showRegion: "地域",
    showFormer: "かつての国",
    showNone: "旗のないコード",
    colFlag: "旗",
    colCode: "コード",
    colEnglish: "英語",
    colJapanese: "日本語",
    colLinks: "リンク",
    count: "{all}件のうち{n}件",
    empty: "該当するコードがありません。別の名前かコードで探してみてください。",
    svg: "SVGファイル",
    gallery: "旗の一覧で見る",
    noFlag: "旗なし",
  },
};
const page = globalThis.familyLanguage({ id: "hata", words, onChange: () => { docsLink(); draw(); } });
const say = (key, values) => {
  const word = words[page.lang][key] ?? words.en[key];
  return values === undefined ? word : word.replace(/\{(\w+)\}/g, (whole, name) => String(values[name] ?? ""));
};
const ja = () => page.lang === "ja";
const norm = (text) => String(text).normalize("NFKC").toLowerCase();
/** The searchable text of each row, made once. */
const HAYSTACK = ROWS.map(([code, en, jp, , reading]) => [code, en, jp, reading ?? ""].map(norm));
const SHOWS = [["all", "showAll"], ["country", "showCountry"], ["region", "showRegion"], ["former", "showFormer"], ["none", "showNone"]];

const make = (tag, props = {}, ...children) => {
  const element = Object.assign(document.createElement(tag), props);
  element.append(...children);
  return element;
};

const row = ([code, en, jp, kind, , reason]) => {
  const tr = make("tr");
  tr.setAttribute("data-testid", "codes-row");
  tr.dataset.code = code;
  tr.dataset.kind = kind;
  const file = `dist/svg/${code.toLowerCase()}.svg`;
  const flag = make("td", { className: "flag" }, kind === "none" ? make("span", { className: "none", textContent: say("noFlag") }) : make("img", { src: file, alt: "", loading: "lazy", decoding: "async" }));
  const links = make("td", { className: "links" });
  if (kind !== "none") {
    const svg = make("a", { href: file, textContent: say("svg") });
    svg.setAttribute("data-testid", "codes-svg");
    const gallery = make("a", { href: `./?q=${encodeURIComponent(code)}&lang=${page.lang}`, textContent: say("gallery") });
    gallery.setAttribute("data-testid", "codes-gallery");
    links.append(svg, document.createTextNode(" · "), gallery);
  }
  const english = make("td", { lang: "en", textContent: en });
  const japanese = make("td", { lang: "ja", textContent: jp });
  if (reason) english.append(make("span", { className: "why", textContent: reason }));
  tr.append(flag, make("td", {}, make("code", { textContent: code })), english, japanese, links);
  return tr;
};

let filled = null;
function draw() {
  if (filled !== page.lang) {
    filled = page.lang;
    const keep = $("show").value;
    $("show").replaceChildren(...SHOWS.map(([value, key]) => make("option", { value, textContent: say(key) })));
    $("show").value = SHOWS.some(([value]) => value === keep) ? keep : "all";
  }
  shown();
}

function shown() {
  const query = norm($("search").value.trim());
  const show = $("show").value;
  const rows = ROWS.filter((one, index) => (show === "all" || one[3] === show) && (query === "" || HAYSTACK[index].some((text) => text.includes(query))));
  $("rows").replaceChildren(...rows.map(row));
  $("empty").hidden = rows.length > 0;
  $("table").hidden = rows.length === 0;
  $("count").textContent = say("count", { n: rows.length, all: ROWS.length });
  document.querySelector("main").dataset.ready = "true";
}

function docsLink() {
  document.querySelector('[data-say="pageDocs"]')?.setAttribute("href", ja() ? "docs/ja/index.html" : "docs/index.html");
}

$("search").addEventListener("input", shown);
$("show").addEventListener("change", shown);
const asked = new URLSearchParams(location.search).get("q");
if (asked !== null) $("search").value = asked;
docsLink();
draw();
