// The demo page's own script: a gallery of every flag with a detail panel, and a flag quiz, each drawn from the
// package's own built files, as a page that installed it would. The gallery shows dist/svg/<code>.svg; the detail
// panel loads the flag's module with /load and frames it with frame(); the facts are /manifest's. The names are
// Kuni's, written into names.js when the site is built. The page's words are set as text, never as HTML.
import { aspectOf, FLAG_CODES, flagUrl, frame, toDataUri } from "./dist/index.js";
import { flag } from "./dist/load.js";
import { LEFT_OUT, manifest, MANIFEST } from "./dist/manifest.js";
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
  set: ["all", "country", "jp", "ca", "us"].includes(asked.get("set")) ? asked.get("set") : "all",
  region: Object.keys(CONTINENTS).includes(asked.get("region")) ? asked.get("region") : "all",
  shape: ["flag", "4:3", "1:1", "round"].includes(asked.get("shape")) ? asked.get("shape") : "flag",
  mode: ["country", "jp", "ca", "us"].includes(asked.get("mode")) ? asked.get("mode") : "country",
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
  button.addEventListener("click", () => showDetail(code));
  item.append(button);
  tiles.set(code, { item, name });
  $("grid").append(item);
}
const searchText = new Map(FLAG_CODES.map((code) => [code, [code, NAMES[code].en, NAMES[code].ja, NAMES[code].short, NAMES[code].shortJa, NAMES[code].reading].map(fold).join("|")]));

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
    tile.item.querySelector("button").setAttribute("aria-label", say("tile", { name: nameOf(code), code }));
    const group = groupOf(code);
    const visible = (state.set === "all" || state.set === group) && (state.region === "all" || (group === "country" && NAMES[code].continent === state.region)) && (wanted === "" || searchText.get(code).includes(wanted));
    tile.item.hidden = !visible;
    if (visible) shown += 1;
  }
  $("count").textContent = say("count", { shown, total: FLAG_CODES.length });
  $("empty").hidden = shown > 0;
  $("grid").dataset.shape = state.shape;
  $("region-row").hidden = state.set !== "all" && state.set !== "country";
  for (const [name, value] of [["set", state.set], ["shape", state.shape]]) for (const button of $(name).querySelectorAll("button")) button.setAttribute("aria-pressed", String(button.dataset.value === value));
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
for (const name of ["set", "shape"]) {
  for (const button of $(name).querySelectorAll("button")) {
    button.addEventListener("click", () => {
      state[name] = button.dataset.value;
      if (name === "set" && state.set !== "all" && state.set !== "country") state.region = "all";
      $("region").value = state.region;
      drawGallery();
      remember();
    });
  }
}
$("region").addEventListener("change", () => {
  state.region = $("region").value;
  drawGallery();
  remember();
});
$("download-list").addEventListener("click", () => {
  const lines = ["code\tenglish\tjapanese\tsource\tlicence\tfile"];
  for (const code of FLAG_CODES) {
    if (tiles.get(code).item.hidden) continue;
    const record = records.get(code);
    lines.push([code, NAMES[code].en, NAMES[code].ja, record.source, record.licence.name, record.file].join("\t"));
  }
  save("hata-flags.txt", `${lines.join("\n")}\n`, "text/plain;charset=utf-8");
});
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

async function showDetail(code) {
  opened = code;
  const record = manifest(code);
  $("detail-title").textContent = nameOf(code);
  $("detail-title").lang = language.lang;
  $("detail-other").textContent = `${otherName(code)} · ${code}`;
  $("detail-flag").src = fileOf(code);
  $("detail-flag").alt = nameOf(code);
  const facts = $("facts");
  facts.replaceChildren();
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
  $("copied").textContent = "";
  const dialog = $("detail");
  if (!dialog.open) dialog.showModal();
  // The flag's own module, loaded the way a page would, then framed three ways.
  const svg = await flag(code);
  if (opened !== code) return;
  openedSvg = svg;
  drawFrames(code, svg);
  drawCopies(code, svg);
}

function drawFrames(code, svg) {
  const shapes = [["4:3", "frame_43", "cover"], ["1:1", "frame_11", "contain"], ["round", "frame_round", "cover"]];
  const heading = Object.assign(document.createElement("p"), { className: "fam-fine", textContent: say("frames_title") });
  $("frames").replaceChildren(
    heading,
    ...shapes.map(([shape, key, fit]) => {
      const figure = document.createElement("figure");
      const image = Object.assign(document.createElement("img"), { src: toDataUri(frame(svg, { shape, fit })), alt: "" });
      image.dataset.shape = shape;
      const caption = Object.assign(document.createElement("figcaption"), { textContent: say(key) });
      figure.append(image, caption);
      return figure;
    }),
  );
}

function drawCopies(code, svg) {
  const lower = code.toLowerCase();
  const rows = [
    ["copy_import", `import flag from "@johnmorrisdotca/hata/flags/${lower}";`],
    ["copy_load", `import { flag } from "@johnmorrisdotca/hata/load";\nconst svg = await flag("${code}");`],
    ["copy_img", `<img src="${flagUrl(code)}" alt="${NAMES[code].en.replace(/"/g, "&quot;")}" height="48">`],
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

$("download-svg").addEventListener("click", () => openedSvg && save(`${opened.toLowerCase()}.svg`, `${openedSvg}\n`, "image/svg+xml"));
$("download-json").addEventListener("click", () => opened && save(`${opened.toLowerCase()}.json`, `${JSON.stringify({ ...manifest(opened), names: { en: NAMES[opened].en, ja: NAMES[opened].ja } }, null, 1)}\n`, "application/json"));
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
  canvas.toBlob((blob) => save(`${opened.toLowerCase()}-${width}.png`, blob), "image/png");
});
$("detail").addEventListener("close", () => {
  opened = null;
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
const poolOf = (mode) => FLAG_CODES.filter((code) => groupOf(code) === mode && !shared.has(code));

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
  for (const button of $("mode").querySelectorAll("button")) button.setAttribute("aria-pressed", String(button.dataset.value === state.mode));
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
for (const button of $("mode").querySelectorAll("button")) {
  button.addEventListener("click", () => {
    state.mode = button.dataset.value;
    startGame(state.seed ?? newSeed());
  });
}
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
  fillRegion();
  drawGallery();
  drawLeftOut();
  if (quiz.questions.length > 0) drawQuestion();
  if (opened !== null) showDetail(opened);
}

fillRegion();
drawGallery();
drawLeftOut();
showTab(state.tab);
document.querySelector("main").dataset.ready = "true";
