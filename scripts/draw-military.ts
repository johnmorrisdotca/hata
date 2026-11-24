// Draws military flags for this package: naval ensigns, a war ensign and naval jacks, as exact geometry (integers or hundredths, no traced
// picture) into src/sets/military.data.ts.
//
//   pnpm draw:military        rewrite the data file
//
// The Rising Sun Flag of Japan is drawn here and nowhere else in this package: as the ensign of the Japan Maritime Self-Defense Force and
// as the war ensign of the Imperial Japanese Navy, each with its dates and its source, among the military flags of other countries; it is
// in no country's record and has no entry of its own. Its construction is the one the Japanese Wikipedia's article on the ensign (自衛艦旗)
// gives from the Self-Defense Forces Act's enforcement order (Cabinet Order No. 179 of 1954): the ratio 2 to 3, the sun's diameter half the
// hoist, its centre a sixth of the length from the centre of the flag toward the hoist, the rays and the gaps between them of 11.25 degrees.
//
// What a record's `status` says: `documented` where a source gives the construction (the ratio, the sizes), `reconstruction` where it
// gives the design and the dates and the sizes are this package's. Each `note` says which.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import type { DrawnDrawing } from "../src/drawn.ts";
import { box, setFiles, writeSetFiles, clipTo, n, poly, svg } from "./draw-lib.ts";
import { classify } from "./licence.ts";
import { MILITARY_FILES } from "./military-files.ts";
import { optimiseFlag } from "./optimise.ts";
import { readManifest, readSource, ROOT } from "./sources.ts";
import type { Shape } from "./draw-lib.ts";
import type { MilitaryFile } from "./military-files.ts";

const fill = (colour: string, d: string): Shape => ({ fill: colour, d });

// The Rising Sun ensign: 3 long to 2 high, the disc's diameter half the hoist, its centre a sixth of the length toward the hoist from the middle,
// sixteen rays of 11.25 degrees with a gap of 11.25 degrees between them, a ray on each axis of the disc (the orientation is this package's reading).
const risingSun = (slug: string, red: string): string => {
  const [w, h] = [900, 600];
  const [cx, cy] = [w / 2 - w / 6, h / 2];
  const half = 5.625;
  const rays = Array.from({ length: 16 }, (_, k) => {
    const centre = k * 22.5;
    const point = (angle: number): [number, number] => [cx + 3000 * Math.cos((angle * Math.PI) / 180), cy + 3000 * Math.sin((angle * Math.PI) / 180)];
    return poly(clipTo([[cx, cy], point(centre - half), point(centre + half)], w, h));
  }).join("");
  const disc = `M${n(cx - h / 4)} ${n(cy)}a${n(h / 4)} ${n(h / 4)} 0 1 0 ${n(h / 2)} 0a${n(h / 4)} ${n(h / 4)} 0 1 0 ${n(-h / 2)} 0z`;

  return svg("mil", slug, w, h, [fill("#ffffff", box(0, 0, w, h)), fill(red, rays), fill(red, disc)]);
};

// The Union Flag in a w by w/2 frame at (x, y): the blue field, the white and red saltires (the red counterchanged) and the cross, at the
// flag's construction (in 60 by 30: the white saltire 6 wide, the red saltire 4 wide over it, the white cross 10 wide, the red cross 6 wide).
const unionFlag = (slug: string, x: number, y: number, w: number): { defs: string; body: string } => {
  const k = w / 60;
  const lines = (segments: readonly (readonly [readonly [number, number], readonly [number, number]])[]): string => segments.map(([a, b]) => `M${n(x + a[0] * k)} ${n(y + a[1] * k)}L${n(x + b[0] * k)} ${n(y + b[1] * k)}`).join("");
  const saltires = lines([[[0, 0], [60, 30]], [[60, 0], [0, 30]]]);
  const cross = lines([[[30, 0], [30, 30]], [[0, 15], [60, 15]]]);
  const clipId = `mil-${slug}-u`;
  const body =
    `<path fill="#012169" d="M${n(x)} ${n(y)}h${n(w)}v${n(30 * k)}h${n(-w)}z"/>` +
    `<path fill="none" stroke="#ffffff" stroke-width="${n(6 * k)}" d="${saltires}"/>` +
    `<path fill="none" stroke="#c8102e" stroke-width="${n(4 * k)}" clip-path="url(#${clipId})" d="${saltires}"/>` +
    `<path fill="none" stroke="#ffffff" stroke-width="${n(10 * k)}" d="${cross}"/>` +
    `<path fill="none" stroke="#c8102e" stroke-width="${n(6 * k)}" d="${cross}"/>`;
  // The red saltire shows only in four triangles about the centre of the flag (the counterchange).
  const [cx, cy] = [x + 30 * k, y + 15 * k];
  const defs = `<clipPath id="${clipId}"><path d="M${n(cx)} ${n(cy)}h${n(30 * k)}v${n(15 * k)}zv${n(15 * k)}h${n(-30 * k)}zh${n(-30 * k)}v${n(-15 * k)}zv${n(-15 * k)}h${n(30 * k)}z"/></clipPath>`;

  return { defs, body };
};

const whiteEnsign = (): string => {
  const canton = unionFlag("gb-white-ensign", 0, 0, 360);

  return `<svg data-hata-mil="gb-white-ensign" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 360"><defs>${canton.defs}</defs><path fill="#ffffff" d="M0 0h720v360H0z"/>${canton.body}<path fill="none" stroke="#c8102e" stroke-width="48" d="M0 180H720M360 0V360"/></svg>`;
};
const unionJack = (): string => {
  const flag = unionFlag("gb-naval-jack", 0, 0, 720);

  return `<svg data-hata-mil="gb-naval-jack" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 360"><defs>${flag.defs}</defs>${flag.body}</svg>`;
};

// The United States Navy jack: the union of the 50-star flag alone, as Executive Order 10834 (1959) fixes the union: 0.76 long, 0.5385 high,
// fifty stars of diameter 0.0616 in nine rows (6 and 5 stars in turn), the first row 0.0538 from the top and the first column 0.0633 from the hoist,
// a row every 0.0538 and a column every 0.0633. In thousandths.
const navyJack = (): string => {
  const star = (cx: number, cy: number): string => {
    const outer = 30.8;
    const inner = outer * 0.381966;
    const points: [number, number][] = [];
    for (let i = 0; i < 10; i++) {
      const radius = i % 2 === 0 ? outer : inner;
      const angle = (-90 + i * 36) * (Math.PI / 180);
      points.push([cx + radius * Math.cos(angle), cy + radius * Math.sin(angle)]);
    }

    return poly(points);
  };
  const stars: string[] = [];
  for (let row = 0; row < 9; row++) for (let col = row % 2 === 0 ? 0 : 1; col < 11; col += 2) stars.push(star(63.3 * (col + 1), 53.8 * (row + 1)));

  return svg("mil", "us-navy-jack", 760, 538.5, [fill("#002868", box(0, 0, 760, 538.5)), fill("#ffffff", stars.join(""))]);
};

const READ = "2026-11-24";
const JMSDF_SOURCE = { title: "自衛艦旗 (the ensign of the Japan Maritime Self-Defense Force and the war ensign of the Imperial Japanese Navy), Japanese Wikipedia", url: "https://ja.wikipedia.org/wiki/自衛艦旗", kind: "encyclopedia", read: READ, says: "The article's table of the ensign's pattern gives the ratio 2 to 3, the sun's diameter as half the hoist, its centre a sixth toward the hoist side from the middle of the flag, rays at 11.25 degrees, a white ground and a red sun and rays, set by the Self-Defense Forces Act's enforcement order (Cabinet Order No. 179, 1954); it says the Imperial Japanese Navy's ensign was fixed by the navy's flag regulations of 7 October 1889 and that the 1954 ensign was set to the navy's pattern. The date of the 1954 ensign (30 June) and its red (#bd0029) are from the Wikipedia article on the Rising Sun Flag, https://en.wikipedia.org/wiki/Rising_Sun_Flag." } as const;
const WHITE_SOURCE = { title: "White Ensign, Wikipedia", url: "https://en.wikipedia.org/wiki/White_Ensign", kind: "encyclopedia", read: READ, says: "Says the Admiralty decided in 1864 to end the ambiguity over the Red Ensign and reserved the White Ensign to the Royal Navy, that the ratio is 1 to 2 (fixed in 1837) and that the Union Flag was set in the canton in 1801; it gives no measure for the cross or the canton." } as const;
const JACK_SOURCE = { title: "Union Jack, Wikipedia", url: "https://en.wikipedia.org/wiki/Union_Jack", kind: "encyclopedia", read: READ, says: "Says the Union Flag flown at a ship's bow as the jack is the Union Jack, the Royal Navy's naval jack." } as const;
const US_SOURCE = { title: "Executive Order 10834 (1959), Providing for the arrangement of the stars in the flag of the United States, Wikisource", url: "https://en.wikisource.org/wiki/Executive_Order_10834", kind: "official", read: READ, says: "The order fixes the 50-star flag's construction, including the union's size (0.76 by 0.5385 of the hoist) and the place and size of the stars; the Navy jack is the union of that flag. The date of the current jack is 4 July 1960, as the Wikipedia article on the flag of the United States gives it." } as const;

interface Entry { slug: string; group: "ensign" | "jack"; status: "documented" | "reconstruction"; en: string; ja: string; aboutEn: string; aboutJa: string; dates: { from: string | null; until: string | null }; source: DrawnDrawing["source"]; noteEn: string; noteJa: string; svg: string }
const ENTRIES: Entry[] = [
  { slug: "jp-jmsdf-ensign", group: "ensign", status: "documented", en: "Japan: Maritime Self-Defense Force ensign", ja: "日本：海上自衛隊の自衛艦旗", aboutEn: "The ensign of the ships of the Japan Maritime Self-Defense Force: a red sun of sixteen rays on white, the sun's centre set toward the hoist. It is flown as the naval ensign and is the Rising Sun Flag of the Self-Defense Forces' ships.", aboutJa: "海上自衛隊の艦艇が掲げる旗です。白地に、掲揚側に寄せた紅の日章と16条の光線を描きます。艦艇の旗として掲げる、自衛艦旗（旭日旗）です。", dates: { from: "1954-06-30", until: null }, source: JMSDF_SOURCE, noteEn: "The ratio, the disc's diameter and place and the rays' angle are the source's. The red is #bd0029, the value the Wikipedia article on the Rising Sun Flag gives. That there is a ray on each axis is this package's reading, because the sources give the angle and not the orientation.", noteJa: "縦横の比、日章の直径と位置、光線の角度は出典のものです。紅は、Wikipediaの旭日旗の項が示す #bd0029 です。各軸に光線があるとしたのは、出典が角度だけを示して向きを示さないための、このパッケージの読み方です。", svg: risingSun("jp-jmsdf-ensign", "#bd0029") },
  { slug: "jp-ijn-ensign", group: "ensign", status: "reconstruction", en: "Japan: Imperial Japanese Navy ensign", ja: "日本：旧日本海軍の軍艦旗", aboutEn: "The war ensign of the Imperial Japanese Navy (the sixteen-ray ensign, 十六条旭日旗), fixed by the navy's flag regulations of 1889 and flown until the navy was dissolved in 1945.", aboutJa: "旧日本海軍の軍艦旗（十六条旭日旗）です。1889年の海軍旗章条例で定められ、海軍の解体される1945年まで掲げられました。", dates: { from: "1889-10-07", until: "1945" }, source: JMSDF_SOURCE, noteEn: "The source says the 1954 ensign was set to the navy's pattern and gives the sizes for the 1954 ensign only, so the geometry is the 1954 one. The navy's red was darker, and no value is given: the shade here is this package's. The end year is the navy's dissolution in 1945.", noteJa: "出典は、1954年の旗が海軍の様式に合わせて定められたと述べ、寸法は1954年の旗についてだけ示します。そのため図形は1954年のものです。海軍の紅はより暗い色でしたが値は示されず、ここの色合いはこのパッケージのものです。終わりの年は、海軍が解体された1945年です。", svg: risingSun("jp-ijn-ensign", "#a40d26") },
  { slug: "gb-white-ensign", group: "ensign", status: "documented", en: "United Kingdom: White Ensign", ja: "イギリス：白色軍艦旗（ホワイト・エンサイン）", aboutEn: "The ensign of the Royal Navy: the red cross of St George on white, with the Union Flag in the canton. The Admiralty reserved it to the Royal Navy in 1864.", aboutJa: "英国海軍の軍艦旗です。白地に聖ジョージの赤十字、掲揚側の上にユニオン・フラッグを置きます。1864年に海軍省が英国海軍専用としました。", dates: { from: "1864", until: null }, source: WHITE_SOURCE, noteEn: "The design, the ratio of 1 to 2 and the date are the source's. The cross's width (two fifteenths of the hoist) and the canton (half the hoist and half the fly) are this package's, as the source gives no measure.", noteJa: "意匠、1対2の比、年はこの出典のものです。十字の幅（縦の15分の2）と掲揚側上隅（縦と横の半分）は、出典が寸法を示さないため、このパッケージのものです。", svg: whiteEnsign() },
  { slug: "gb-naval-jack", group: "jack", status: "documented", en: "United Kingdom: Union Jack (naval jack)", ja: "イギリス：ユニオン・ジャック（艦首旗）", aboutEn: "The Union Flag flown from the jack staff at a ship's bow, the Royal Navy's naval jack.", aboutJa: "艦首の旗竿に掲げるユニオン・フラッグです。英国海軍の艦首旗です。", dates: { from: "1801-01-01", until: null }, source: JACK_SOURCE, noteEn: "That the Union Flag is the naval jack is the source's, and the Union Flag dates from the union of 1801. The flag's construction (the saltires' widths, the counterchange) is the Union Flag's, and the ratio of 1 to 2 is this package's choice for the jack.", noteJa: "ユニオン・フラッグが艦首旗であることは出典のものです。旗は1801年の連合に始まります。旗の構成（斜め十字の幅、色の入れ替え）はユニオン・フラッグのもので、艦首旗の1対2の比はこのパッケージの選んだものです。", svg: unionJack() },
  { slug: "us-navy-jack", group: "jack", status: "documented", en: "United States: Navy jack", ja: "アメリカ：海軍の艦首旗", aboutEn: "The union of the United States flag alone: fifty white stars on blue, flown at the jack staff of United States Navy ships in port.", aboutJa: "アメリカの国旗の青い部分だけを旗にしたもので、白い50の星を並べます。停泊中の米海軍の艦艇が艦首の旗竿に掲げます。", dates: { from: "1960-07-04", until: null }, source: US_SOURCE, noteEn: "The union's size and the stars' places and size are the Executive Order's (the 50-star flag since 4 July 1960). That the jack is the union alone is as the Wikipedia article on the flag lists it; the flag called the First Navy Jack, which has been flown in its place from time to time, is not drawn.", noteJa: "青い部分の大きさと星の位置・大きさは大統領令のものです（50星の旗は1960年7月4日から）。艦首旗がその青い部分だけであることは、Wikipediaの国旗の項の記述によります。ときどき代わりに掲げられるファースト・ネイビー・ジャックは描いていません。", svg: navyJack() },
];

// The flags taken from Wikimedia Commons (scripts/military-files.ts, fetched by scripts/fetch-military.ts): each file's licence is read from the
// snapshot and only public domain and CC0 ship; the file is optimised as a country's flag is. A file over the size ceiling is left out and listed.
const CEILING_BYTES = 140 * 1024;
// The Confederate battle flags are shipped for history and education and never given by default (docs/decisions.md, "Restricted flags"); no law restricts them.
const RESTRICTED = {
  reason: "Confederate battle flag, 1861 to 1865. Shown for history and education. It is widely seen today as a symbol of racism and white supremacy.",
  reasonJa: "アメリカ連合国の軍旗（1861～1865年）。歴史と教育のために表示しています。今日では、人種差別と白人至上主義の象徴と広く見なされています。",
  allowedFor: "education and history",
  allowedForJa: "教育と歴史",
} as const;
const TODAY = "2026-11-24";
const KIND_EN = { ensign: "naval ensign", jack: "naval jack", war: "war flag" } as const;
const KIND_JA = { ensign: "軍艦旗", jack: "艦首旗", war: "軍旗" } as const;
interface Taken { file: string; page: string; licence: string; author: string; description: string }
let memo: ReturnType<typeof commonsOnce> | undefined;
const commons = (): ReturnType<typeof commonsOnce> => (memo ??= commonsOnce());
const commonsOnce = (): { records: DrawnDrawing[]; left: { slug: string; file: string; why: string }[]; taken: (Taken & { id: string })[] } => {
  const manifest = readManifest();
  const entry = manifest.files.find((one) => /^military-commons-\d{4}-\d{2}-\d{2}\.json$/.test(one.path));
  if (entry === undefined) throw new Error("no military Commons snapshot in data-sources/sources.json: run pnpm data:military");
  const snapshot = JSON.parse(readSource(manifest, entry.path).text) as { files: { file: string; page: string; stored: string; sha256: string; metadata: Record<string, string>; templates: string[] }[] };
  const records: DrawnDrawing[] = [];
  const left: { slug: string; file: string; why: string }[] = [];
  const taken: (Taken & { id: string })[] = [];
  for (const one of MILITARY_FILES as readonly MilitaryFile[]) {
    const found = snapshot.files.find((file) => file.file === one.file);
    if (found === undefined) throw new Error(`${one.file} is not in the military snapshot: run pnpm data:military`);
    const licence = classify(found.metadata, found.templates);
    if (!licence.shipped || (licence.kind !== "public-domain" && licence.kind !== "cc0")) {
      left.push({ slug: one.slug, file: one.file, why: `licence ${licence.name}` });
      continue;
    }
    const raw = readFileSync(`${ROOT}/data-sources/${found.stored}`, "utf8");
    const optimised = optimiseFlag(raw, `mil-${one.slug}`);
    const drawing = optimised.svg.replace(/hata-mil-/g, "mil-").replace(/^<svg /, `<svg data-hata-mil="${one.slug}" `);
    if (/<image\b|<style\b|base64/i.test(drawing)) {
      left.push({ slug: one.slug, file: one.file, why: "not a plain vector (an embedded raster picture or a style element)" });
      continue;
    }
    if (drawing.length > CEILING_BYTES) {
      left.push({ slug: one.slug, file: one.file, why: `${Math.round(drawing.length / 1024)} KB optimised, over the ${CEILING_BYTES / 1024} KB ceiling` });
      continue;
    }
    const author = (found.metadata.Artist ?? "").trim() === "" || /^See File history/i.test(found.metadata.Artist ?? "") ? "an author the file's page does not name" : found.metadata.Artist!.trim();
    const label = one.label;
    const from = one.dates.from;
    const until = one.dates.until;
    const span = from !== null && until !== null ? `from ${from} to ${until}` : from !== null ? `since ${from}` : "";
    const spanJa = from !== null && until !== null ? `${from}年から${until}年まで` : from !== null ? `${from}から` : "";
    const aboutEn = `The ${KIND_EN[one.kind]} of ${one.country.en}${label === undefined ? "" : `, ${label.en}`}${one.kind === "ensign" ? ": the flag its warships fly at the stern" : one.kind === "jack" ? ": the flag flown at the bow of its warships" : ""}${span === "" ? "" : `, in use ${span}`}.`;
    const aboutJa = `${one.country.ja}の${KIND_JA[one.kind]}${label === undefined ? "" : `（${label.ja}）`}${one.kind === "ensign" ? "。軍艦が艦尾に掲げる旗です" : one.kind === "jack" ? "。軍艦が艦首に掲げる旗です" : ""}${spanJa === "" ? "" : `。使われた期間：${spanJa}`}。`;
    records.push({
      id: `mil:${one.slug}`,
      ...(one.restricted === true ? { restricted: RESTRICTED } : {}),
      group: one.kind,
      name: { en: `${one.country.en}: ${KIND_EN[one.kind]}${label === undefined ? "" : `, ${label.en}`}`, ja: `${one.country.ja}：${KIND_JA[one.kind]}${label === undefined ? "" : `、${label.ja}`}` },
      about: { en: aboutEn, ja: aboutJa },
      status: "documented",
      dates: from === null && until === null ? null : { from, until },
      note: {
        en: `Taken from Wikimedia Commons (${licence.name}, by ${author}) and optimised as a country's flag is; the drawing is the file's, and the proportions are its own. ${from === null && until === null ? `The file's page gives no dates: the flag is the current one, as read on ${TODAY}.` : "The dates are the ones the file's title or description gives."}`,
        ja: `Wikimedia Commons（${licence.name}、作者：${author}）から取り、国の旗と同じく最適化したものです。絵はそのファイルのもので、縦横の比もそのままです。${from === null && until === null ? `ファイルのページに期間は書かれておらず、${TODAY}に読んだ時点の現行の旗です。` : "期間は、ファイルの名前か説明が示すものです。"}`,
      },
      source: { title: `${one.file} (Wikimedia Commons)`, url: found.page, kind: "reference", read: TODAY, says: `A file on Wikimedia Commons under ${licence.name}, by ${author}, which its page describes as the ${KIND_EN[one.kind]} of ${one.country.en}${label === undefined ? "" : ` (${label.en})`}.`, file: one.file, licence: licence.name, author },
      svg: drawing,
    });
    taken.push({ id: `mil:${one.slug}`, file: one.file, page: found.page, licence: licence.name, author, description: "" });
  }

  return { records, left, taken };
};

const militaryRecords = (): DrawnDrawing[] => [...drawnRecords(), ...commons().records];
const drawnRecords = (): DrawnDrawing[] =>
  ENTRIES.map((entry) => ({
    id: `mil:${entry.slug}`,
    group: entry.group,
    name: { en: entry.en, ja: entry.ja },
    about: { en: entry.aboutEn, ja: entry.aboutJa },
    status: entry.status,
    dates: entry.dates,
    note: { en: entry.noteEn, ja: entry.noteJa },
    source: entry.source,
    svg: entry.svg,
  }));

const files = (): Map<string, string> => setFiles("military", "MILITARY", "MilitaryRecordId", "scripts/draw-military.ts", militaryRecords());

// The table of Commons files in NOTICE.md, between its markers: the file, its licence and author as Commons gives them, its page, and the files left out.
const noticeBlock = (): string => {
  const { taken, left } = commons();
  const rows = taken.map((one) => `| \`${one.id}\` | ${one.file} | ${one.licence} | ${one.author.replace(/\|/g, "/")} | ${one.page} |`).join("\n");
  const out = left.map((one) => `| \`mil:${one.slug}\` | ${one.file} | ${one.why} |`).join("\n");

  return `<!-- military-files:start -->\n| Id | Commons file | Licence | Author as Commons gives it | Page |\n| --- | --- | --- | --- | --- |\n${rows}\n\nCommons files left out of the military flags for their size or because they are not a plain vector (the size ceiling is ${CEILING_BYTES / 1024} KB optimised):\n\n| Id | Commons file | Why |\n| --- | --- | --- |\n${out}\n<!-- military-files:end -->`;
};
const noticeText = (current: string): string => current.replace(/<!-- military-files:start -->[\s\S]*?<!-- military-files:end -->/, noticeBlock());

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const notice = fileURLToPath(new URL("../NOTICE.md", import.meta.url));
  writeFileSync(notice, noticeText(readFileSync(notice, "utf8")));
  writeSetFiles(fileURLToPath(new URL("../src/sets", import.meta.url)), "military", files());
  console.log(`wrote src/sets/military.data.ts and military/: ${militaryRecords().length} drawings`);
}

export { commons as militaryCommons, militaryRecords, noticeText as militaryNoticeText, files as militaryFiles };
