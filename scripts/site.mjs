// Builds the static demo for GitHub Pages into ./site: the page, written here from the family's shared header and
// footer, with the family's stylesheet, Hata's own, the page's script, its words, the names of the places (from
// Kuni, at build time, so the page needs no network and no Kuni of its own) and the built package beside it.
import { cpSync, mkdirSync, rmSync, writeFileSync } from "node:fs";

import { continentName, country } from "@johnmorrisdotca/kuni";
import { subdivision } from "@johnmorrisdotca/kuni/subdivisions";

import { API_CSS, apiBody, apiPage } from "./api.mjs";
import { FAMILY, FAMILY_PITCH, FAMILY_SCRIPT, familyFooter, familyHead, familyHeader, familyUnreviewed } from "./family-template.mjs";

const id = "hata";
const { FLAG_CODES } = await import(new URL("../dist/index.js", import.meta.url).href);
const { LEFT_OUT } = await import(new URL("../dist/manifest.js", import.meta.url).href);

// Hata is not in the family's list yet: that list is changed in every repository at once, with a new template
// version, and family-template.mjs is never edited in one. Until that sweep adds it, the demo joins the list here,
// at its end, so the shared header and footer can name it. Once the template lists Hata this does nothing.
for (const [one, pitch] of [
  [{ id: "kuni", name: "Kuni", kana: "国" }, "every country and its subdivisions, with ISO 3166 codes and names in English and Japanese"],
  [{ id, name: "Hata", kana: "旗" }, "flags as SVG for every country, and the regions of Japan, Canada, the United States, Australia, the United Kingdom, Germany, France, Switzerland, Austria and Brazil"],
]) {
  if (!FAMILY.some((member) => member.id === one.id)) {
    FAMILY.push(one);
    FAMILY_PITCH[one.id] = pitch;
  }
}

// A flag on a pole, in the family's green.
const ICON = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='20' fill='%232f5d4a'/%3E%3Cpath d='M28 84V16' stroke='%23f3efe4' stroke-width='6' stroke-linecap='round'/%3E%3Cpath d='M31 20h44l-9 14 9 14H31z' fill='%23f3efe4'/%3E%3Ccircle cx='50' cy='34' r='6' fill='%23b5452c'/%3E%3C/svg%3E";

// The names of every place, in English and Japanese, and each country's continent: what the gallery searches and
// the quiz asks. Written into the site as a module.
const names = {};
for (const code of [...FLAG_CODES, ...LEFT_OUT.map((one) => one.code)]) {
  if (code.length === 2) {
    const one = country(code);
    names[code] = { en: one.name.en, ja: one.name.ja, short: one.shortName?.en ?? null, shortJa: one.shortName?.ja ?? null, reading: one.reading ?? null, continent: one.continent };
  } else {
    const one = subdivision(code);
    names[code] = { en: one.name.en, ja: one.name.ja ?? one.name.en, reading: one.reading ?? null };
  }
}
const continents = Object.fromEntries(["AF", "AN", "AS", "EU", "NA", "OC", "SA"].map((code) => [code, { en: continentName(code, "en"), ja: continentName(code, "ja") }]));

const escape = (text) => String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const row = (help, content, extra = "") => `<div class="fam-row"${extra} data-help-en="${escape(help[0])}" data-help-ja="${escape(help[1])}">${content}</div>`;
const seg = (name, say, options, help) => `<div class="fam-seg" role="group" id="${name}" data-testid="${name}" data-say-label="${say}" data-help-en="${escape(help[0])}" data-help-ja="${escape(help[1])}">${options.map(([value, key]) => `<button type="button" data-value="${value}" data-say="${key}"></button>`).join("")}</div>`;

const uses = [
  `import japan from "@johnmorrisdotca/hata/flags/jp";  // one flag, one module`,
  `import { flag } from "@johnmorrisdotca/hata/load";`,
  `await flag("JP-13")  // Tokyo's flag, loaded when asked`,
  `await flag("ca", { shape: "round", label: "Canada" })`,
  `frame(svg, { shape: "4:3", fit: "contain" })  // never stretched`,
  `flagUrl("US-TX")  // ".../dist/svg/us-tx.svg" on jsDelivr`,
  `toDataUri(svg)  // for an <img src>`,
  `<hata-flag code="DE-BY" shape="round" size="48"></hata-flag>`,
  `manifest("YE")?.source  // "country-flag-icons"`,
];

const gallery = `<section class="fam-panels" id="gallery-panel" role="tabpanel" aria-labelledby="tab-gallery" data-testid="gallery-panel">
        <div class="fam-panel">
          <p class="blurb" data-say="gallery_blurb"></p>
          ${row(["Type a place's name in English or Japanese, or its code (JP-13, CA-ON, US-TX).", "地名（英語でも日本語でも）か、コード（JP-13、CA-ON、US-TX）を入力します。"], `<label class="fam-label" for="search" data-say="search"></label><input id="search" class="fam-field" data-testid="search" type="search" spellcheck="false" autocomplete="off" autocapitalize="off" data-say-placeholder="search_hint" />`)}
          ${row(["Show every flag, or only the countries, or one country's regions: Japan's prefectures, Canada's provinces, the American states, Australia's states, the United Kingdom's four countries, Germany's states, France's regions, Switzerland's cantons, Austria's states or Brazil's states.", "すべての旗を表示するか、国だけ、または一つの国の地域だけに絞り込みます。日本の都道府県、カナダの州と準州、アメリカの州、オーストラリアの州と準州、イギリスの4つの構成国、ドイツの州、フランスの地域圏、スイスの州、オーストリアの州、ブラジルの州から選べます。"], `<label class="fam-label" for="set" data-say="set"></label><select id="set" class="fam-field" data-testid="set"></select>`)}
          ${row(["Narrow the countries to one continent.", "国を大陸で絞り込みます。"], `<label class="fam-label" for="region" data-say="region"></label><select id="region" class="fam-field" data-testid="region"></select>`, ` id="region-row"`)}
          ${seg("shape", "shape", [["flag", "shape_flag"], ["4:3", "shape_43"], ["1:1", "shape_11"], ["round", "shape_round"]], ["See every flag at its own proportions, or framed at 4:3, square or round as the package frames it: never stretched, cropped only where a crop keeps every colour, and drawn again for the shape where flag-icons has done so.", "旗を本来の縦横比のまま、またはパッケージと同じ方法で 4:3・正方形・円形の枠に収めて表示します。引き伸ばさず、切り抜くのはどの色も残る場合だけで、flag-icons がその形用に描いた図があればそれを使います。"])}
          <div class="tools">
            <p class="count" id="count" data-testid="count" aria-live="polite"></p>
            <div class="fam-actions">
              <button type="button" class="fam-button" id="download-list" data-testid="download-list" data-say="download_list" data-tip-en="A text file listing the flags shown: code, English name, Japanese name, source and licence." data-tip-ja="表示中の旗の一覧（コード、英語名、日本語名、出典、ライセンス）をテキストファイルで保存します。"></button>
              <button type="button" class="fam-button" id="download-manifest" data-testid="download-manifest" data-say="download_manifest" data-tip-en="The whole manifest as JSON: every flag's source, licence, author and size, and the codes with no flag." data-tip-ja="マニフェスト全体を JSON で保存します。各旗の出典・ライセンス・作者・サイズと、旗のないコードが含まれます。"></button>
            </div>
          </div>
          <ul class="grid" id="grid" data-testid="grid" data-shape="flag"></ul>
          <p class="fam-empty" id="empty" data-testid="empty" hidden data-say="empty"></p>
          <details class="fam-fold left-out" data-testid="left-out">
            <summary data-say="left_out_title"></summary>
            <p class="fam-fine" data-say="left_out_blurb"></p>
            <ul id="left-out-list"></ul>
          </details>
        </div>
      </section>`;

const quiz = `<section class="fam-panels" id="quiz-panel" role="tabpanel" aria-labelledby="tab-quiz" data-testid="quiz-panel" hidden>
        <div class="fam-panel">
          <p class="blurb" data-say="quiz_blurb"></p>
          ${row(["Pick what to be asked: the world's countries, or the regions of Japan, Canada, the United States, Australia, Brazil, Germany or Switzerland, or Europe's regions together (the United Kingdom's, Germany's, France's, Switzerland's and Austria's).", "出題範囲を選びます。世界の国、日本・カナダ・アメリカ・オーストラリア・ブラジル・ドイツ・スイスの地域、またはヨーロッパの地域（イギリス・ドイツ・フランス・スイス・オーストリア）をまとめて選べます。"], `<label class="fam-label" for="mode" data-say="mode"></label><select id="mode" class="fam-field" data-testid="mode"></select>`)}
          ${row(["The same game, word for word, comes from the same seed: share the link and a friend gets your ten flags in your order.", "同じシードからは同じ問題が出ます。リンクを共有すると、友だちにも同じ10問が同じ順で出ます。"], `<span class="fam-label" data-say="seed"></span><code class="fam-code" id="seed" data-testid="seed"></code><button type="button" class="fam-button" id="new-game" data-testid="new-game" data-say="new_game"></button><button type="button" class="fam-button" id="daily" data-testid="daily" data-say="daily"></button><button type="button" class="fam-button" id="share" data-testid="share" data-say="share"></button>`)}
          <div class="scores" data-testid="scores">
            <div class="fam-card"><b id="score" data-testid="score">0</b><span data-say="score"></span></div>
            <div class="fam-card"><b id="streak" data-testid="streak">0</b><span data-say="streak"></span></div>
            <div class="fam-card"><b id="best" data-testid="best">0</b><span data-say="best"></span></div>
          </div>
          <div class="fam-felt stage" data-testid="stage">
            <p class="fam-hint" id="progress" data-testid="progress"></p>
            <div class="question"><img id="question" data-testid="question" alt="" /></div>
            <div class="choices" id="choices" data-testid="choices" role="group" data-say-label="choices"></div>
            <p class="fam-hint" id="verdict" data-testid="verdict" aria-live="polite"></p>
            <div class="fam-actions next"><button type="button" class="fam-button" id="next" data-testid="next" data-primary="true" data-say="next" hidden></button></div>
          </div>
          <p class="fam-fine" id="shared" data-testid="shared" aria-live="polite"></p>
        </div>
      </section>`;

const dialog = `<dialog id="detail" class="detail" data-testid="detail" aria-labelledby="detail-title">
      <form method="dialog" class="detail-close"><button type="submit" class="fam-button" data-testid="close" data-say="close"></button></form>
      <h2 id="detail-title" data-testid="detail-title"></h2>
      <p class="detail-other" id="detail-other" data-testid="detail-other"></p>
      <div class="detail-flag"><img id="detail-flag" data-testid="detail-flag" alt="" /></div>
      <div class="frames" id="frames" data-testid="frames"></div>
      <dl class="facts" id="facts" data-testid="facts"></dl>
      <h3 data-say="copy_title"></h3>
      <div class="copies" id="copies" data-testid="copies"></div>
      <h3 data-say="embed_title"></h3>
      <p class="fam-fine" data-say="embed_blurb"></p>
      <div class="embed" id="embed" data-testid="embed"></div>
      <h3 data-say="download_title"></h3>
      <div class="fam-actions downloads">
        <button type="button" class="fam-button" id="download-svg" data-testid="download-svg" data-say="download_svg"></button>
        <span class="png"><label class="fam-sr" for="png-size" data-say="png_size"></label><select id="png-size" class="fam-field" data-testid="png-size">${[64, 128, 256, 512, 1024, 2048].map((size) => `<option value="${size}"${size === 512 ? " selected" : ""}>${size} px</option>`).join("")}</select><button type="button" class="fam-button" id="download-png" data-testid="download-png" data-say="download_png"></button></span>
        <button type="button" class="fam-button" id="download-json" data-testid="download-json" data-say="download_json"></button>
      </div>
      <p class="fam-fine" id="copied" data-testid="copied" aria-live="polite"></p>
    </dialog>`;

const page = `<!doctype html>
<html lang="en">
  <head>
    ${familyHead({
      id,
      title: "Hata · flags as SVG for every country and the regions of ten countries",
      description: "Every country's flag, and the regions of Japan, Canada, the United States, Australia, the United Kingdom, Germany, France, Switzerland, Austria and Brazil, as optimised SVG keyed by ISO 3166 code, with each flag's source and licence. Search, embed anywhere, download as SVG or PNG, and play the flag quiz. Free and open source.",
      ogTitle: "Hata: flags as SVG, keyed by ISO 3166 code",
      ogDescription: `${FLAG_CODES.length} flags at their true proportions, from Wikimedia Commons and MIT flag sets, with provenance for each, an element to embed one anywhere, and a flag quiz in English and Japanese.`,
    })}
    <link rel="icon" href="${ICON}" />
    <link rel="stylesheet" href="family.css" />
    <link rel="stylesheet" href="hata.css" />
  </head>
  <body>
    <main>
      ${familyHeader({ id, links: [{ href: "api.html", say: "pageApi" }] })}
      <div class="fam-tabs" role="tablist" data-testid="tabs">
        <button type="button" role="tab" id="tab-gallery" aria-controls="gallery-panel" data-tab="gallery" data-say="tab_gallery"></button>
        <button type="button" role="tab" id="tab-quiz" aria-controls="quiz-panel" data-tab="quiz" data-say="tab_quiz"></button>
      </div>
      ${gallery}
      ${quiz}
      ${familyUnreviewed({ id })}
      <section class="more" aria-labelledby="more-title">
        <h2 id="more-title" data-say="moreTitle"></h2>
        <p data-say="moreText"></p>
        <ul class="uses">
          ${uses.map((line) => `<li><code>${escape(line)}</code></li>`).join("\n          ")}
        </ul>
      </section>
      ${familyFooter({ id })}
    </main>
    ${dialog}
    <script>${FAMILY_SCRIPT}</script>
    <script type="module" src="demo.js"></script>
  </body>
</html>
`;

rmSync("site", { recursive: true, force: true });
mkdirSync("site", { recursive: true });
cpSync("demo", "site", { recursive: true });
// The page imports the ESM build and shows the SVG files; the type declarations are left out.
cpSync("dist", "site/dist", { recursive: true, filter: (source) => !/\.d\.ts$/.test(source) });
writeFileSync("site/names.js", `// Made by scripts/site.mjs from Kuni ${JSON.parse((await import("node:fs")).readFileSync("node_modules/@johnmorrisdotca/kuni/package.json", "utf8")).version}: every place's names, and the continents.\nexport const NAMES = ${JSON.stringify(names)};\nexport const CONTINENTS = ${JSON.stringify(continents)};\n`);
writeFileSync("site/index.html", page);
// The API reference, made from the source: every export of every entry point, and a word on the flags' own entries.
const api = apiBody();
api.html = `<section class="api-entry" id="flags-"><h2><code>@johnmorrisdotca/hata/flags/&lt;code&gt;</code></h2>
        <p>One module for each of the ${FLAG_CODES.length} flags, named by its code in lower case: <code>/flags/jp</code>, <code>/flags/jp-13</code>, <code>/flags/ca-on</code>, <code>/flags/us-tx</code>. Each exports the flag's SVG string as its default export and as <code>svg</code>, and its types carry a doc comment naming the place, its size, its proportions and its source. The same SVG is a file at <code>@johnmorrisdotca/hata/svg/&lt;code&gt;.svg</code>, and every flag's record is in <code>@johnmorrisdotca/hata/manifest.json</code>.</p>
        <pre>import japan from "@johnmorrisdotca/hata/flags/jp";
import { svg as tokyo } from "@johnmorrisdotca/hata/flags/jp-13";</pre>
      </section>\n${api.html}`;
writeFileSync("site/api.css", API_CSS);
writeFileSync("site/api.html", apiPage({ id, name: "Hata", icon: ICON, api }));
console.log("site/ is ready: serve it, or let the Pages workflow publish it.");
