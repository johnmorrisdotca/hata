// A page for one of the sets drawn for this package (ship signal flags, samurai banners ...): the set's data is written when the site
// is built (<name>-data.js: its config and its records), so the page lists exactly what the package holds. The kinds are chips, the
// flags a grid, and the flag chosen has its name, meaning, status, dates, source and note beside it: nothing folds open.
const $ = (id) => document.getElementById(id);
const name = document.querySelector('meta[name="hata-set"]').getAttribute("content");
const { CONFIG, ITEMS } = await import(`./${name}-data.js`);

const words = {
  en: {
    pitch: "Flags drawn for this package, each with its source.",
    name: "Hata is Japanese for flag.",
    nameLink: "About the name",
    foot: "Drawn from the package's own records, in your browser.",
    toGallery: "Flag gallery",
    pageDocs: "Docs",
    pageApi: "API",
    search: "Search",
    kind: "Kind",
    all: "All",
    count: "{n} flags",
    empty: "Nothing matches. Try another word.",
    official: "The body's own design",
    documented: "Documented",
    reconstruction: "Reconstruction",
    source: "Source",
    read: "read on {day}",
    dates: "In use",
    note: "What is documented and what is not",
    between: "{from} to {until}",
    sinceYear: "since {from}",
    untilYear: "until {until}",
    id: "id",
  },
  ja: {
    pitch: "このパッケージのために描いた旗です。出どころを添えています。",
    name: "Hataは、国や地域のしるしとして掲げる「旗（はた）」のことです。",
    nameLink: "名前について",
    foot: "パッケージの記録から、お使いのブラウザで描いています。",
    toGallery: "旗の一覧",
    pageDocs: "ドキュメント",
    pageApi: "API",
    search: "検索",
    kind: "種類",
    all: "すべて",
    count: "旗{n}枚",
    empty: "一致するものがありません。別のことばで探してください。",
    official: "団体自身の図案",
    documented: "資料で確かめられるもの",
    reconstruction: "復元",
    source: "出典",
    read: "{day}に確認",
    dates: "使われた期間",
    note: "確かめられていることと、そうでないこと",
    between: "{from}から{until}",
    sinceYear: "{from}から",
    untilYear: "{until}まで",
    id: "id",
  },
};
const page = globalThis.familyLanguage({ id: "hata", words, onChange: () => { intro(); docsLink(); draw(); } });
const say = (key, values) => {
  const word = words[page.lang][key] ?? words.en[key];
  return values === undefined ? word : word.replace(/\{(\w+)\}/g, (whole, key2) => String(values[key2] ?? ""));
};
const ja = () => page.lang === "ja";
const pick = (pair) => (ja() ? pair.ja : pair.en);
const norm = (text) => String(text).normalize("NFKC").toLowerCase();
const dataUri = (svg) => `data:image/svg+xml,${encodeURIComponent(svg)}`;
const dates = (one) => (one.dates === null ? "" : one.dates.from !== null && one.dates.until !== null ? say("between", one.dates) : one.dates.from !== null ? say("sinceYear", one.dates) : say("untilYear", one.dates));

let group = new URLSearchParams(location.search).get("kind") ?? "";
let chosen = new URLSearchParams(location.search).get("id") ?? "";
const groups = Object.keys(CONFIG.groups);

function intro() {
  document.querySelector('[data-say="intro"]').textContent = pick(CONFIG.intro);
}

function docsLink() {
  document.querySelector('[data-say="pageDocs"]')?.setAttribute("href", ja() ? "docs/ja/index.html" : "docs/index.html");
}

function chips() {
  const row = $("chips");
  row.replaceChildren(...[["", say("all")], ...groups.map((one) => [one, pick(CONFIG.groups[one])])].map(([value, label]) => {
    const button = Object.assign(document.createElement("button"), { type: "button", textContent: label });
    button.setAttribute("aria-pressed", String(group === value));
    button.dataset.kind = value;
    button.setAttribute("data-testid", "chip");
    button.addEventListener("click", () => { group = value; shown(); });
    return button;
  }));
}

function tile(one) {
  const item = document.createElement("li");
  const button = Object.assign(document.createElement("button"), { type: "button", className: "set-tile" });
  button.setAttribute("aria-pressed", String(chosen === one.id));
  button.setAttribute("data-testid", "tile");
  button.dataset.id = one.id;
  const picture = Object.assign(document.createElement("span"), { className: "picture" });
  picture.append(Object.assign(document.createElement("img"), { alt: "", loading: "lazy", decoding: "async", src: dataUri(one.svg) }));
  button.append(picture, Object.assign(document.createElement("span"), { className: "name", textContent: pick(one.name), lang: ja() ? "ja" : "en" }));
  button.addEventListener("click", () => { chosen = one.id; shown(); });
  item.append(button);
  return item;
}

function detail() {
  const one = ITEMS.find((candidate) => candidate.id === chosen);
  $("detail").hidden = one === undefined;
  if (one === undefined) return;
  const picture = Object.assign(document.createElement("img"), { alt: pick(one.name), src: dataUri(one.svg) });
  const text = document.createElement("div");
  const title = Object.assign(document.createElement("h2"), { textContent: pick(one.name), lang: ja() ? "ja" : "en" });
  const other = Object.assign(document.createElement("p"), { className: "set-id", textContent: `${say("id")}: ${one.id} · ${ja() ? one.name.en : one.name.ja}` });
  const status = Object.assign(document.createElement("p"), { className: "set-status", textContent: say(one.status) });
  status.dataset.status = one.status;
  const about = Object.assign(document.createElement("p"), { textContent: pick(one.about), lang: ja() ? "ja" : "en" });
  text.append(title, other, status, about);
  if (one.dates !== null) text.append(Object.assign(document.createElement("p"), { textContent: `${say("dates")}: ${dates(one)}` }));
  const note = pick(one.note);
  if (note !== "") text.append(Object.assign(document.createElement("p"), { textContent: `${say("note")}: ${note}`, lang: ja() ? "ja" : "en" }));
  const source = document.createElement("p");
  source.append(`${say("source")}: `, Object.assign(document.createElement("a"), { href: one.source.url, textContent: one.source.title, rel: "noopener", target: "_blank" }), ` (${say("read", { day: one.source.read })})`);
  text.append(source);
  $("detail").replaceChildren(picture, text);
}

function hoist() {
  if (CONFIG.spell === undefined) return;
  const letters = [...norm($("spell").value)].filter((character) => /^[a-z0-9]$/.test(character));
  $("hoist").replaceChildren(...letters.flatMap((character) => {
    const one = ITEMS.find((candidate) => candidate.id.endsWith(`:${character}`));
    if (one === undefined) return [];
    const item = document.createElement("li");
    item.append(Object.assign(document.createElement("img"), { alt: pick(one.name), src: dataUri(one.svg) }));
    return [item];
  }));
}

function shown() {
  const query = norm($("search").value.trim());
  const rows = ITEMS.filter((one) => (group === "" || one.group === group) && (query === "" || [one.id, one.name.en, one.name.ja, one.about.en, one.about.ja].some((text) => norm(text).includes(query))));
  chips();
  $("grid").replaceChildren(...rows.map(tile));
  $("empty").hidden = rows.length > 0;
  $("count").textContent = say("count", { n: rows.length });
  detail();
  hoist();
  const url = new URL(location.href);
  for (const [key, value] of [["kind", group], ["id", chosen]]) {
    if (value === "") url.searchParams.delete(key);
    else url.searchParams.set(key, value);
  }
  history.replaceState(null, "", url);
  document.querySelector("main").dataset.ready = "true";
}

function draw() {
  $("spell-label").textContent = CONFIG.spell === undefined ? "" : pick(CONFIG.spell);
  shown();
}

$("spell-row").hidden = CONFIG.spell === undefined;
$("search").addEventListener("input", shown);
$("spell").addEventListener("input", hoist);
const asked = new URLSearchParams(location.search).get("q");
if (asked !== null) $("search").value = asked;
intro();
docsLink();
draw();
