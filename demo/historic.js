// The Historic flags page: every country and former country with all of its flags in date order, each with its years, status
// and source. Written from the manifest when the site is built (historic-data.js), so it cannot drift from the package:
// a row is a country, a flag in it is a variant (or the country's one flag), and the picture is the package's own SVG.
import { ROWS, CONTINENTS } from "./historic-data.js";

const $ = (id) => document.getElementById(id);
const words = {
  en: {
    pitch: "Every country and all of its flags, in date order.",
    name: "Hata is Japanese for flag.",
    nameLink: "About the name",
    foot: "Drawn from the package's own manifest, in your browser.",
    toGallery: "Flag gallery",
    pageDocs: "Docs",
    pageApi: "API",
    intro: "Each row is a country and every flag the package has for it, oldest first, with the years it was in use, its status and the page that documents the dates.",
    introDates: "In code: flag(code, { date }) loads the flag of a day, variantOn(code, date) finds it, and <hata-flag code date> draws it. It is the legal flag unless you ask for the flag in use. A date the package has no flag for gives nothing.",
    introRoles: "Where the law made one flag the country's and its people flew another, both are shown side by side with the reason.",
    search: "Search",
    show: "Show",
    continent: "Continent",
    showAll: "Every country",
    showChanged: "Changed since 1900",
    showSame: "Not changed since 1900",
    showFormer: "Former countries",
    allContinents: "Every continent",
    count: "{countries} countries, {flags} flags",
    empty: "No country matches. Try another name or a code.",
    today: "Today's flag",
    itsFlag: "Its flag",
    sinceYear: "since {from}",
    untilYear: "until {until}",
    between: "{from} to {until}",
    undated: "no dates",
    official: "official",
    "de-facto": "de facto",
    historical: "historical",
    local: "local",
    kindOfficial: "official source",
    kindReference: "reference source",
    kindEncyclopedia: "Wikipedia only",
    kindDrawing: "Commons file",
    former: "former country, {from} to {until}",
    roleBoth: "Legal and in use",
    roleLegal: "Legal flag",
    roleInUse: "Flag in use",
    splitTitle: "The legal flag and the flag in use differ",
    splitWhy: "Why",
    noLaw: "No flag was made the national flag by law.",
    restricted: "restricted",
    restrictedNote: "Flag of Nazi Germany, 1935–1945. Shown for history and education. Displaying it is restricted by law in Germany and Austria outside those purposes.",
    today2: "today",
  },
  ja: {
    pitch: "どの国のどの旗も、年代順に見られます。",
    name: "Hataは、国や地域のしるしとして掲げる「旗（はた）」のことです。",
    nameLink: "名前について",
    foot: "パッケージのマニフェストから、お使いのブラウザで描いています。",
    toGallery: "旗の一覧",
    pageDocs: "ドキュメント",
    pageApi: "API（英語）",
    intro: "1行が1つの国で、パッケージにあるその国の旗を古い順に並べています。使われた年、位置づけ、日付の出典のページを添えています。",
    introDates: "コードでは、flag(code, { date }) がその日の旗を読み込み、variantOn(code, date) がそれを探し、<hata-flag code date> が描きます。指定しなければ法律上の国旗で、実際に使われていた旗も選べます。旗が分からない日付では、何も返りません。",
    introRoles: "法律が定めた国旗と、人々が実際に掲げた旗が違うときは、その2つを理由とともに並べて表示します。",
    search: "検索",
    show: "表示",
    continent: "大陸",
    showAll: "すべての国",
    showChanged: "1900年以降に変わった国",
    showSame: "1900年以降変わっていない国",
    showFormer: "かつての国",
    allContinents: "すべての大陸",
    count: "{countries}か国、旗{flags}枚",
    empty: "該当する国がありません。別の名前かコードで探してみてください。",
    today: "現在の旗",
    itsFlag: "この国の旗",
    sinceYear: "{from}から",
    untilYear: "{until}まで",
    between: "{from}から{until}まで",
    undated: "日付なし",
    official: "公式",
    "de-facto": "事実上",
    historical: "かつての旗",
    local: "地域の旗",
    kindOfficial: "公的な出典",
    kindReference: "参考資料",
    kindEncyclopedia: "Wikipediaのみ",
    kindDrawing: "Commonsのファイル",
    former: "かつての国（{from}年から{until}年まで）",
    roleBoth: "法律上も実際にも使用",
    roleLegal: "法律上の国旗",
    roleInUse: "実際に使われた旗",
    splitTitle: "法律上の国旗と、実際に使われた旗が違う期間",
    splitWhy: "理由",
    noLaw: "法律で国旗とされた旗はありませんでした。",
    restricted: "使用制限あり",
    restrictedNote: "ナチス・ドイツの国旗（1935～1945年）。歴史と教育のために表示しています。ドイツとオーストリアでは、これらの目的以外での掲示は法律で制限されています。",
    today2: "現在",
  },
};
const page = globalThis.familyLanguage({ id: "hata", words, onChange: () => { docsLink(); draw(); } });
const say = (key, values) => {
  const word = words[page.lang][key] ?? words.en[key];
  return values === undefined ? word : word.replace(/\{(\w+)\}/g, (whole, name) => String(values[name] ?? ""));
};
const ja = () => page.lang === "ja";
const norm = (text) => String(text).normalize("NFKC").toLowerCase();
const KINDS = { official: "kindOfficial", reference: "kindReference", encyclopedia: "kindEncyclopedia", commons: "kindDrawing" };

const years = (flag) => (flag.from !== null && flag.until !== null ? say("between", flag) : flag.from !== null ? say("sinceYear", flag) : flag.until !== null ? say("untilYear", flag) : "");
const changed = (row) => row.flags.some((flag) => flag.until !== null || flag.status === "historical");

// Both only where the two roles run on the same days; a flag that was one of them for part of its years says which, in the side-by-side block.
const roleWords = (flag) => (flag.roles.length === 2 && JSON.stringify(flag.roleDates.legal) === JSON.stringify(flag.roleDates["in-use"]) ? "roleBoth" : flag.roles.length === 2 ? "roleBoth" : flag.roles[0] === "legal" ? "roleLegal" : "roleInUse");
const spanOf = (dates) => (dates === undefined ? "" : `${dates.from ?? ""} → ${dates.until ?? say("today2")}`);

// The restricted flag's drawing: asked for by name, for this page of history, from the package's own call (never from dist/svg, which does not list it).
const drawRestricted = (image, row, flag) => {
  import("./dist/load.js")
    .then(({ flag: load }) => load(row.code, { variant: flag.id, allowRestricted: true }))
    .then((svg) => { if (svg !== null) image.src = `data:image/svg+xml,${encodeURIComponent(svg)}`; });
};

const figure = (row, flag, again = false) => {
  const item = document.createElement("li");
  item.className = "historic-flag";
  item.setAttribute("data-testid", again ? "historic-flag-again" : "historic-flag");
  item.dataset.code = row.code;
  item.dataset.id = flag.id ?? "";
  const picture = Object.assign(document.createElement("span"), { className: "picture" });
  const image = Object.assign(document.createElement("img"), { alt: "", loading: "lazy", decoding: "async" });
  if (flag.restricted === undefined) image.src = `dist/svg/${flag.module}.svg`;
  else drawRestricted(image, row, flag);
  picture.append(image);
  const label = Object.assign(document.createElement("span"), { className: "years", textContent: years(flag) || (flag.id === null ? say(row.former ? "itsFlag" : "today") : say("undated")) });
  const name = Object.assign(document.createElement("span"), { className: "name", textContent: flag.id === null ? "" : ja() ? flag.ja : flag.en, lang: ja() ? "ja" : "en" });
  const status = Object.assign(document.createElement("span"), { className: "status", textContent: flag.restricted === undefined ? say(flag.status) : `${say(flag.status)}${ja() ? "、" : ", "}${say("restricted")}` });
  status.dataset.status = flag.status;
  const source = Object.assign(document.createElement("a"), { href: flag.source, textContent: say(KINDS[flag.kind]), rel: "noopener", target: "_blank" });
  source.setAttribute("data-testid", "historic-source");
  item.append(picture, label, ...(flag.id === null ? [] : [name]), status);
  if (flag.id !== null && flag.roles.length > 0) {
    const role = Object.assign(document.createElement("span"), { className: "role", textContent: say(roleWords(flag)) });
    role.dataset.role = flag.roles.join(" ");
    role.setAttribute("data-testid", "historic-role");
    item.append(role);
  }
  item.append(source);
  if (flag.restricted !== undefined) {
    // The context note, factual and plain: why the flag is here and that the law restricts it elsewhere.
    const note = Object.assign(document.createElement("p"), { className: "restricted-note", textContent: ja() ? flag.restricted.ja : flag.restricted.en, lang: ja() ? "ja" : "en" });
    note.setAttribute("data-testid", "historic-restricted");
    item.dataset.restricted = "true";
    item.append(note);
  }
  return item;
};

// Where the law's flag and the flag flown were two flags (a flag with a role note), they sit side by side, each under its role, with the reason and its source.
const split = (row, flags) => {
  const block = document.createElement("li");
  block.className = "historic-split";
  block.setAttribute("data-testid", "historic-split");
  block.dataset.code = row.code;
  const title = Object.assign(document.createElement("p"), { className: "split-title", textContent: say("splitTitle") });
  const columns = Object.assign(document.createElement("div"), { className: "split-columns" });
  const seen = new Set();
  for (const [role, heading] of [["legal", "roleLegal"], ["in-use", "roleInUse"]]) {
    const column = Object.assign(document.createElement("div"), { className: "split-column" });
    column.dataset.role = role;
    column.setAttribute("data-testid", `historic-split-${role}`);
    column.append(Object.assign(document.createElement("h3"), { textContent: say(heading) }));
    const list = Object.assign(document.createElement("ul"), { className: "historic-flags" });
    for (const flag of flags.filter((one) => one.roles.includes(role))) {
      const item = figure(row, flag, seen.has(flag.id));
      seen.add(flag.id);
      // In this column the flag has the days of this role.
      const span = item.querySelector(".years");
      span.textContent = spanOf(flag.roleDates[role]);
      item.querySelector(".role")?.remove();
      list.append(item);
    }
    if (list.children.length === 0) list.append(Object.assign(document.createElement("li"), { className: "split-none", textContent: say("noLaw") }));
    column.append(list);
    columns.append(column);
  }
  const reasons = new Map(flags.map((flag) => [flag.note.why, flag.note]));
  const why = Object.assign(document.createElement("div"), { className: "split-why" });
  for (const note of reasons.values()) {
    const line = Object.assign(document.createElement("p"), { textContent: `${say("splitWhy")}: ${note.why} ` });
    line.append(Object.assign(document.createElement("a"), { href: note.source, textContent: say(KINDS[note.kind]), rel: "noopener", target: "_blank" }));
    line.setAttribute("data-testid", "historic-reason");
    why.append(line);
  }
  block.append(title, columns, why);
  return block;
};

// A country's flags in date order, with the flags whose roles differ gathered into one side-by-side block where the first of them stands.
const flagItems = (row) => {
  const noted = row.flags.filter((flag) => flag.note !== null);
  const items = [];
  let placed = false;
  for (const flag of row.flags) {
    if (flag.note === null) items.push(figure(row, flag));
    else if (!placed) {
      placed = true;
      items.push(split(row, noted));
    }
  }
  return items;
};

const card = (row) => {
  const item = document.createElement("li");
  item.className = "historic-country";
  item.setAttribute("data-testid", "historic-country");
  item.dataset.code = row.code;
  const head = document.createElement("div");
  const title = Object.assign(document.createElement("h2"), { textContent: ja() ? row.ja : row.en, lang: ja() ? "ja" : "en" });
  title.append(Object.assign(document.createElement("span"), { className: "historic-code", textContent: `${row.code} · ${ja() ? row.en : row.ja}${row.former ? ` · ${say("former", { from: row.years[0], until: row.years[1] })}` : ""}` }));
  head.append(title);
  const list = Object.assign(document.createElement("ul"), { className: "historic-flags" });
  list.append(...flagItems(row));
  item.append(head, list);
  return item;
};

const fill = (select, options, keep) => {
  select.replaceChildren(...options.map(([value, text]) => Object.assign(document.createElement("option"), { value, textContent: text })));
  select.value = options.some(([value]) => value === keep) ? keep : options[0][0];
};

let filled = null;
function draw() {
  if (filled !== page.lang) {
    filled = page.lang;
    fillChoices();
  }
  shown();
}

function fillChoices() {
  fill($("show"), [["all", say("showAll")], ["changed", say("showChanged")], ["same", say("showSame")], ["former", say("showFormer")]], $("show").value);
  fill($("continent"), [["", say("allContinents")], ...Object.entries(CONTINENTS).map(([code, name]) => [code, ja() ? name.ja : name.en])], $("continent").value);
}

function shown() {
  const query = norm($("search").value.trim());
  const show = $("show").value;
  const continent = $("continent").value;
  const rows = ROWS.filter((row) => {
    if (show === "changed" && !changed(row)) return false;
    if (show === "same" && (changed(row) || row.former)) return false;
    if (show === "former" && !row.former) return false;
    if (continent !== "" && row.continent !== continent) return false;
    if (query === "") return true;
    return [row.code, row.en, row.ja, ...row.flags.flatMap((flag) => [flag.en, flag.ja, flag.id ?? ""])].some((text) => norm(text).includes(query));
  });
  $("list").replaceChildren(...rows.map(card));
  $("empty").hidden = rows.length > 0;
  $("count").textContent = say("count", { countries: rows.length, flags: rows.reduce((sum, row) => sum + row.flags.length, 0) });
  document.querySelector("main").dataset.ready = "true";
}

function docsLink() {
  document.querySelector('[data-say="pageDocs"]')?.setAttribute("href", ja() ? "docs/ja/index.html" : "docs/index.html");
}

for (const id of ["search", "show", "continent"]) $(id).addEventListener(id === "search" ? "input" : "change", shown);
const asked = new URLSearchParams(location.search).get("q");
if (asked !== null) $("search").value = asked;
docsLink();
draw();
