// Draws the International Code of Signals' flags for this package: the 26 alphabet flags, the 10 numeral pennants, the 3 substitutes
// and the answering pennant, as exact geometry (integers or hundredths, no traced picture), into src/sets/signals.data.ts.
//
//   pnpm draw        rewrite the data file
//
// The specification is the Code itself: Pub. 102, International Code of Signals, United States Edition, 1969 (Revised 2003), a work of
// the United States Government (no copyright claimed under Title 17), as adopted by the Inter-Governmental Maritime Consultative
// Organization in 1965. Its plate "International Flags and Pennants" shows every flag and pennant, and its text names the colours (red,
// yellow, blue, black, white) and gives the meaning of each single-letter signal. It gives no construction sheet and no measurements,
// so the designs follow the plate and the proportions were measured from it, enlarged and rounded to simple fractions: that is said in
// every record's `note`. The five colours' values are this package's (the Code names the colours and gives no values).
//
//   - Letter flags (C to Z): 6 long to 5 high, as the plate draws them. A and B are swallow-tailed: the notch is cut a third of the
//     length into the flag from the fly.
//   - Numeral pennants: tapering, 7 long to 2 high at the hoist, the fly end 0.38 of the hoist.
//   - Substitutes: isosceles triangles, 3 long to 2 high; the answering pennant tapers, 3 long to 1 high, the fly end half the hoist.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import type { DrawnDrawing } from "../src/drawn.ts";
import { box, setFiles, writeSetFiles, clipTo, n, poly, svg } from "./draw-lib.ts";
import { classify } from "./licence.ts";
import { optimiseFlag } from "./optimise.ts";
import { readManifest, readSource, ROOT } from "./sources.ts";
import { TACTICAL_FILES } from "./tactical-files.ts";
import type { Shape } from "./draw-lib.ts";

const RED = "#d7141a";
const YELLOW = "#ffd500";
const BLUE = "#00209f";
const BLACK = "#111111";
const WHITE = "#ffffff";

const L = 720; // letter flags: length
const H = 600; // and hoist
const fill = (colour: string, d: string): Shape => ({ fill: colour, d });
const letter = (slug: string, shapes: readonly Shape[]): string => svg("ics", slug, L, H, shapes);
const full = (colour: string): Shape => fill(colour, box(0, 0, L, H));

// Yankee: nine stripes at 45 degrees, rising to the fly, yellow at both corners; stripe i lies where x + y is between i and i + 1 of
// nine equal parts of L + H (the strip between the lines x + y = a and x + y = b, long enough to cross the flag, cut to it).
const stripe = (i: number): string => {
  const a = ((L + H) * i) / 9;
  const b = ((L + H) * (i + 1)) / 9;
  const t = 2000;

  return poly(clipTo([[a + t, -t], [b + t, -t], [b - t, t], [a - t, t]], L, H));
};

const chequers = (): string => {
  const cells: string[] = [];
  for (let row = 0; row < 4; row++) for (let col = 0; col < 4; col++) if ((row + col) % 2 === 0) cells.push(box(col * 180, row * 150, 180, 150));

  return cells.join("");
};

// A diagonal band of perpendicular width `width` along one diagonal of the flag, cut to it.
const diagonal = (width: number, rising: boolean): string => {
  const length = Math.hypot(L, H);
  const half = width / 2;
  // The unit normal to the diagonal from (0,0) to (L,H), or from (0,H) to (L,0).
  const [dx, dy] = rising ? [L, -H] : [L, H];
  const nx = -dy / length;
  const ny = dx / length;
  const start: [number, number] = rising ? [0, H] : [0, 0];
  const end: [number, number] = rising ? [L, 0] : [L, H];
  const reach = 40;
  const ux = (dx / length) * reach;
  const uy = (dy / length) * reach;
  const corners: [number, number][] = [
    [start[0] - ux + nx * half, start[1] - uy + ny * half],
    [end[0] + ux + nx * half, end[1] + uy + ny * half],
    [end[0] + ux - nx * half, end[1] + uy - ny * half],
    [start[0] - ux - nx * half, start[1] - uy - ny * half],
  ];

  return poly(clipTo(corners, L, H));
};

const LETTERS: Record<string, string> = {
  a: letter("a", [fill(WHITE, poly([[0, 0], [240, 0], [240, H], [0, H]])), fill(BLUE, poly([[240, 0], [L, 0], [480, 300], [L, H], [240, H]]))]),
  b: letter("b", [fill(RED, poly([[0, 0], [L, 0], [480, 300], [L, H], [0, H]]))]),
  c: letter("c", [full(BLUE), fill(WHITE, box(0, 120, L, 360)), fill(RED, box(0, 240, L, 120))]),
  d: letter("d", [full(YELLOW), fill(BLUE, box(0, 120, L, 360))]),
  e: letter("e", [fill(BLUE, box(0, 0, L, 300)), fill(RED, box(0, 300, L, 300))]),
  f: letter("f", [full(WHITE), fill(RED, poly([[360, 0], [L, 300], [360, H], [0, 300]]))]),
  g: letter("g", [full(YELLOW), fill(BLUE, [1, 3, 5].map((i) => box(i * 120, 0, 120, H)).join(""))]),
  h: letter("h", [fill(WHITE, box(0, 0, 360, H)), fill(RED, box(360, 0, 360, H))]),
  i: letter("i", [full(YELLOW), fill(BLACK, "M185 300a175 175 0 1 0 350 0a175 175 0 1 0 -350 0z")]),
  j: letter("j", [full(BLUE), fill(WHITE, box(0, 200, L, 200))]),
  k: letter("k", [fill(YELLOW, box(0, 0, 360, H)), fill(BLUE, box(360, 0, 360, H))]),
  l: letter("l", [fill(YELLOW, box(0, 0, 360, 300)), fill(BLACK, box(360, 0, 360, 300)), fill(BLACK, box(0, 300, 360, 300)), fill(YELLOW, box(360, 300, 360, 300))]),
  m: letter("m", [full(BLUE), fill(WHITE, diagonal(100, true) + diagonal(100, false))]),
  n: letter("n", [full(WHITE), fill(BLUE, chequers())]),
  o: letter("o", [fill(YELLOW, poly([[0, 0], [0, H], [L, H]])), fill(RED, poly([[0, 0], [L, 0], [L, H]]))]),
  p: letter("p", [full(BLUE), fill(WHITE, box(155, 190, 410, 220))]),
  q: letter("q", [full(YELLOW)]),
  r: letter("r", [full(RED), fill(YELLOW, box(270, 0, 180, H) + box(0, 200, L, 200))]),
  s: letter("s", [full(WHITE), fill(BLUE, box(160, 210, 400, 180))]),
  t: letter("t", [fill(RED, box(0, 0, 240, H)), fill(WHITE, box(240, 0, 240, H)), fill(BLUE, box(480, 0, 240, H))]),
  u: letter("u", [fill(RED, box(0, 0, 360, 300)), fill(WHITE, box(360, 0, 360, 300)), fill(WHITE, box(0, 300, 360, 300)), fill(RED, box(360, 300, 360, 300))]),
  v: letter("v", [full(WHITE), fill(RED, diagonal(60, true) + diagonal(60, false))]),
  w: letter("w", [full(BLUE), fill(WHITE, box(115, 105, 490, 390)), fill(RED, box(225, 210, 270, 180))]),
  x: letter("x", [full(WHITE), fill(BLUE, box(270, 0, 180, H) + box(0, 200, L, 200))]),
  y: letter("y", [full(RED), fill(YELLOW, [0, 2, 4, 6, 8].map(stripe).join(""))]),
  z: letter("z", [fill(YELLOW, poly([[0, 0], [L, 0], [360, 300]])), fill(BLACK, poly([[0, 0], [360, 300], [0, H]])), fill(RED, poly([[0, H], [360, 300], [L, H]])), fill(BLUE, poly([[L, 0], [L, H], [360, 300]]))]),
};

// Numeral pennants: 350 long, 100 high at the hoist, 38 at the fly. The shape is the clip; the stripes and shapes are cut to it.
const PW = 350;
const PH = 100;
const pennantShape = poly([[0, 0], [PW, 31], [PW, 69], [0, PH]]);
const pennant = (slug: string, shapes: readonly Shape[]): string => svg("ics", slug, PW, PH, shapes, pennantShape);
const cross = (colour: string, x: number): Shape => fill(colour, box(x, 0, 20, PH) + box(0, 42.5, PW, 15));
const disc = (cx: number, cy: number, r: number): string => `M${n(cx - r)} ${n(cy)}a${n(r)} ${n(r)} 0 1 0 ${n(2 * r)} 0a${n(r)} ${n(r)} 0 1 0 ${n(-2 * r)} 0z`;
const PENNANTS: Record<string, string> = {
  "0": pennant("0", [fill(YELLOW, box(0, 0, PW, PH)), fill(RED, box(100, 0, 110, PH))]),
  "1": pennant("1", [fill(WHITE, box(0, 0, PW, PH)), fill(RED, disc(100, 50, 40))]),
  "2": pennant("2", [fill(BLUE, box(0, 0, PW, PH)), fill(WHITE, disc(100, 50, 30))]),
  "3": pennant("3", [fill(RED, box(0, 0, 100, PH)), fill(WHITE, box(100, 0, 110, PH)), fill(BLUE, box(210, 0, 140, PH))]),
  "4": pennant("4", [fill(RED, box(0, 0, PW, PH)), cross(WHITE, 115)]),
  "5": pennant("5", [fill(YELLOW, box(0, 0, 175, PH)), fill(BLUE, box(175, 0, 175, PH))]),
  "6": pennant("6", [fill(BLACK, box(0, 0, PW, 50)), fill(WHITE, box(0, 50, PW, 50))]),
  "7": pennant("7", [fill(YELLOW, box(0, 0, PW, 50)), fill(RED, box(0, 50, PW, 50))]),
  "8": pennant("8", [fill(WHITE, box(0, 0, PW, PH)), cross(RED, 115)]),
  "9": pennant("9", [fill(WHITE, box(0, 0, 178, 50)), fill(RED, box(0, 50, 178, 50)), fill(BLACK, box(178, 0, 172, 50)), fill(YELLOW, box(178, 50, 172, 50))]),
};

// Substitutes: isosceles triangles pointing to the fly, 300 long and 200 high at the hoist.
const SW = 300;
const SH = 200;
const triangle = poly([[0, 0], [SW, 100], [0, SH]]);
const substitute = (slug: string, shapes: readonly Shape[]): string => svg("ics", slug, SW, SH, shapes, triangle);
const SUBSTITUTES: Record<string, string> = {
  "sub-1": substitute("sub-1", [fill(BLUE, box(0, 0, SW, SH)), fill(YELLOW, poly([[0, 50], [165, 100], [0, 150]]))]),
  "sub-2": substitute("sub-2", [fill(WHITE, box(0, 0, SW, SH)), fill(BLUE, box(0, 0, 105, SH))]),
  "sub-3": substitute("sub-3", [fill(WHITE, box(0, 0, SW, SH)), fill(BLACK, box(0, 71, SW, 58))]),
};
const ANSWER = svg("ics", "answer", 300, 100, [fill(RED, box(0, 0, 300, 100)), fill(WHITE, box(60, 0, 60, 100) + box(180, 0, 60, 100))], poly([[0, 0], [300, 25], [300, 75], [0, 100]]));

const NAMES = ["Alfa", "Bravo", "Charlie", "Delta", "Echo", "Foxtrot", "Golf", "Hotel", "India", "Juliett", "Kilo", "Lima", "Mike", "November", "Oscar", "Papa", "Quebec", "Romeo", "Sierra", "Tango", "Uniform", "Victor", "Whiskey", "X-ray", "Yankee", "Zulu"];
const NAMES_JA = ["アルファ", "ブラボー", "チャーリー", "デルタ", "エコー", "フォックストロット", "ゴルフ", "ホテル", "インディア", "ジュリエット", "キロ", "リマ", "マイク", "ノベンバー", "オスカー", "パパ", "ケベック", "ロメオ", "シエラ", "タンゴ", "ユニフォーム", "ビクター", "ウイスキー", "エックスレイ", "ヤンキー", "ズールー"];
const MEANINGS_EN = [
  "I have a diver down; keep well clear at slow speed.",
  "I am taking in, or discharging, or carrying dangerous goods.",
  "Yes (affirmative, or \"The significance of the previous group should be read in the affirmative\").",
  "Keep clear of me; I am maneuvering with difficulty.",
  "I am altering my course to starboard.",
  "I am disabled; communicate with me.",
  "I require a pilot. When made by fishing vessels operating in close proximity on the fishing grounds it means: \"I am hauling nets\".",
  "I have a pilot on board.",
  "I am altering my course to port.",
  "I am on fire and have dangerous cargo on board: keep well clear of me, or I am leaking dangerous cargo.",
  "I wish to communicate with you.",
  "You should stop your vessel instantly.",
  "My vessel is stopped and making no way through the water.",
  "No (negative, or \"The significance of the previous group should be read in the negative\"). Given only visually or by sound.",
  "Man overboard.",
  "In harbor: all persons should report on board as the vessel is about to proceed to sea. At sea: it may be used by fishing vessels to mean \"My nets have come fast upon an obstruction\".",
  "My vessel is \"healthy\" and I request free pratique.",
  "The Code gives R no single-letter signal of its own; it is a complement with one or more numerals.",
  "I am operating astern propulsion.",
  "Keep clear of me; I am engaged in pair trawling.",
  "You are running into danger.",
  "I require assistance.",
  "I require medical assistance.",
  "Stop carrying out your intentions and watch for my signals.",
  "I am dragging my anchor.",
  "I require a tug. When made by fishing vessels operating in close proximity on the fishing grounds it means: \"I am shooting nets\".",
];
const MEANINGS_JA = [
  "ダイバーが潜水中です。十分に離れ、低速で航行してください。",
  "危険物を積み込み中、荷揚げ中、または運搬中です。",
  "はい（肯定。または「直前の群の意味を肯定として読むこと」）。",
  "私から離れてください。操船が困難です。",
  "針路を右舷へ変えています。",
  "航行不能です。私と通信してください。",
  "水先人が必要です。漁場で近接して操業する漁船が掲げるときは「網を揚げています」。",
  "水先人が乗っています。",
  "針路を左舷へ変えています。",
  "火災があり、危険物を積んでいます。私から十分に離れてください。または、危険物が漏れています。",
  "あなたと通信したいです。",
  "直ちに停船してください。",
  "本船は停止しており、対水速力がありません。",
  "いいえ（否定。または「直前の群の意味を否定として読むこと」）。視覚信号か音響信号でのみ使います。",
  "人が海に落ちました。",
  "港内では、本船がまもなく出港するので全員乗船してください。海上では、漁船が「網が障害物に掛かった」の意味で使うことがあります。",
  "本船は「健康」です。入港と上陸の許可（フリー・プラティーク）を求めます。",
  "国際信号書はRに単独の信号を割り当てていません。数字を伴う補足として使います。",
  "後進をかけています。",
  "私から離れてください。私はペア・トロールをしています。",
  "あなたは危険に向かっています。",
  "援助が必要です。",
  "医療援助が必要です。",
  "意図している行動をやめ、私の信号に注意してください。",
  "走錨しています。",
  "引き船が必要です。漁場で近接して操業する漁船が掲げるときは「網を入れています」。",
];
const NUMBERS = [["Nadazero", "ナダゼロ"], ["Unaone", "ウナワン"], ["Bissotwo", "ビソツー"], ["Terrathree", "テラスリー"], ["Kartefour", "カルテフォー"], ["Pantafive", "パンタファイブ"], ["Soxisix", "ソキシシックス"], ["Setteseven", "セッテセブン"], ["Oktoeight", "オクトエイト"], ["Novenine", "ノベナイン"]] as const;

const SOURCE = {
  title: "International Code of Signals, United States Edition, 1969 (Revised 2003), Pub. 102, National Imagery and Mapping Agency",
  url: "https://archive.org/details/pub-102",
  kind: "official",
  read: "2026-11-24",
  says: "The plate \"International Flags and Pennants\" shows each flag and pennant, and the Code names the five colours and gives each single-letter signal its meaning; it is a United States Government work with no copyright claimed. The copy read is the one the Internet Archive holds.",
} as const;
const NOTE = {
  en: "The Code shows this flag in a plate with no construction sheet. The design and the colours' names are the Code's; the proportions were measured from the plate and rounded, and the colours' values are this package's.",
  ja: "国際信号書は、この旗を寸法図のない図版で示しています。図案と色の名前は国際信号書のもの、縦横の比は図版から測って丸めたもの、色の値はこのパッケージのものです。",
};

const signalRecords = (): DrawnDrawing[] => {
  const records: DrawnDrawing[] = [];
  NAMES.forEach((name, at) => {
    const slug = String.fromCharCode(97 + at);
    const letterName = slug.toUpperCase();
    records.push({ id: `ics:${slug}`, group: "letter", name: { en: `${letterName}: ${name}`, ja: `${letterName}旗（${NAMES_JA[at]}）` }, about: { en: MEANINGS_EN[at]!, ja: MEANINGS_JA[at]! }, status: "official", dates: null, note: NOTE, source: SOURCE, svg: LETTERS[slug]! });
  });
  NUMBERS.forEach(([name, ja], at) => {
    records.push({ id: `ics:${at}`, group: "numeral", name: { en: `${at}: ${name}`, ja: `数字旗${at}（${ja}）` }, about: { en: `The figure ${at}, as a numeral pennant (${name}). A figure group is read from the top down.`, ja: `数字の${at}（${ja}）を表す数字旗です。数字の群は上から下へ読みます。` }, status: "official", dates: null, note: NOTE, source: SOURCE, svg: PENNANTS[String(at)]! });
  });
  const ordinal = ["first", "second", "third"] as const;
  const ordinalJa = ["第1", "第2", "第3"] as const;
  ordinal.forEach((word, at) => {
    records.push({ id: `ics:sub-${at + 1}`, group: "substitute", name: { en: ["1st substitute", "2nd substitute", "3rd substitute"][at]!, ja: `${ordinalJa[at]}代表旗` }, about: { en: `Repeats the ${at === 0 ? "uppermost" : word} signal flag of the class of flags (letters or numerals) that immediately precedes it, so one set of flags can make a group that repeats a flag. No substitute is used more than once in a group.`, ja: `直前に掲げた種類（文字旗か数字旗）の、${at === 0 ? "一番上" : `上から${at + 1}番目`}の旗を繰り返します。1組の旗で、同じ旗を繰り返す群を作れるようにするための旗です。同じ代表旗は、1つの群で2度使いません。` }, status: "official", dates: null, note: NOTE, source: SOURCE, svg: SUBSTITUTES[`sub-${at + 1}`]! });
  });
  records.push({ id: "ics:answer", group: "answer", name: { en: "Answering pennant (Code pennant)", ja: "応答旗（コード旗）" }, about: { en: "Hoisted at the dip to answer each hoist of a signal, and closed up when it is understood; hoisted singly after the last hoist to show that a signal is complete; and in a group of numerals it is the decimal point. A ship of war uses it as the Code pennant to call a merchant vessel.", ja: "信号の各掲揚に応えて半ばまで掲げ、意味がわかったら一杯に掲げます。信号の最後の掲揚のあとに単独で掲げて信号の完了を示し、数字の群では小数点になります。軍艦は、商船に呼びかけるときのコード旗として使います。" }, status: "official", dates: null, note: NOTE, source: SOURCE, svg: ANSWER });

  return [...records, ...tactical().records];
};

// The Navy's special pennants, taken from Wikimedia Commons (scripts/tactical-files.ts, fetched by scripts/fetch-tactical.ts): each file's licence is
// read from the snapshot and only public domain and CC0 ship; the file is optimised as a country's flag is.
const READ = "2026-11-26";
interface Taken { id: string; file: string; page: string; licence: string; author: string }
let memo: { records: DrawnDrawing[]; taken: Taken[] } | undefined;
const tactical = (): { records: DrawnDrawing[]; taken: Taken[] } => (memo ??= tacticalOnce());
const tacticalOnce = (): { records: DrawnDrawing[]; taken: Taken[] } => {
  const manifest = readManifest();
  const entry = manifest.files.find((one) => /^tactical-commons-\d{4}-\d{2}-\d{2}\.json$/.test(one.path));
  if (entry === undefined) throw new Error("no tactical Commons snapshot in data-sources/sources.json: run pnpm data:tactical");
  const snapshot = JSON.parse(readSource(manifest, entry.path).text) as { files: { file: string; page: string; stored: string; metadata: Record<string, string>; templates: string[] }[] };
  const taken: Taken[] = [];
  const records = TACTICAL_FILES.map((one): DrawnDrawing => {
    const found = snapshot.files.find((file) => file.file === one.file);
    if (found === undefined) throw new Error(`${one.file} is not in the tactical snapshot: run pnpm data:tactical`);
    const licence = classify(found.metadata, found.templates);
    if (!licence.shipped || (licence.kind !== "public-domain" && licence.kind !== "cc0")) throw new Error(`${one.file}: licence ${licence.name} does not ship`);
    const optimised = optimiseFlag(readFileSync(`${ROOT}/data-sources/${found.stored}`, "utf8"), `usn-${one.slug}`);
    const drawing = optimised.svg.replace(/hata-usn-/g, "usn-").replace(/^<svg /, `<svg data-hata-usn="${one.slug}" `);
    if (/<image\b|<style\b|base64/i.test(drawing)) throw new Error(`${one.file} is not a plain vector`);
    const author = (found.metadata.Artist ?? "").trim();
    taken.push({ id: `usn:${one.slug}`, file: one.file, page: found.page, licence: licence.name, author });

    return {
      id: `usn:${one.slug}`,
      group: "tactical",
      name: one.name,
      about: one.meaning,
      status: "documented",
      dates: null,
      note: {
        en: `Taken from Wikimedia Commons (${licence.name}, by ${author}): a drawing per the U.S. Navy's specification, at the file's own proportions. The meaning follows, in general terms, the Navy's Signalman manual (NAVEDTRA 14244) and the RCN's visual signalling page; the Navy's signal books are the authority at sea.`,
        ja: `Wikimedia Commons（${licence.name}、作者：${author}）から取りました。米海軍の仕様どおりの絵で、縦横の比はファイルのままです。意味は、米海軍の信号員の教本（NAVEDTRA 14244）とカナダ海軍の視覚信号のページに、おおまかに従っています。海上では米海軍の信号書が基準です。`,
      },
      source: { title: `${one.file} (Wikimedia Commons)`, url: found.page, kind: "reference", read: READ, says: `A Commons file under ${licence.name}, by ${author}: a pennant of the United States Navy's special signals, drawn per its specification. The meaning follows NAVEDTRA 14244 (navyaviation.tpub.com/14244: "Basic Maneuvering Flags", "Substitutes", "Correcting a Signal") and the RCN page jproc.ca/rrp/rrp2/visual_flags.html; see docs/guides/ship-signal-flags.md.`, file: one.file, licence: licence.name, author },
      svg: drawing,
    };
  });

  return { records, taken };
};

const files = (): Map<string, string> => setFiles("signals", "SIGNALS", "SignalRecordId", "scripts/draw-signals.ts", signalRecords());

// The table of the Navy's Commons files in NOTICE.md, between its markers.
const noticeBlock = (): string =>
  `<!-- tactical-files:start -->\n| Id | Commons file | Licence | Author as Commons gives it | Page |\n| --- | --- | --- | --- | --- |\n${tactical()
    .taken.map((one) => `| \`${one.id}\` | ${one.file} | ${one.licence} | ${one.author.replace(/\|/g, "/")} | ${one.page} |`)
    .join("\n")}\n<!-- tactical-files:end -->`;
const noticeText = (current: string): string => current.replace(/<!-- tactical-files:start -->[\s\S]*?<!-- tactical-files:end -->/, noticeBlock());

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const notice = fileURLToPath(new URL("../NOTICE.md", import.meta.url));
  writeFileSync(notice, noticeText(readFileSync(notice, "utf8")));
  writeSetFiles(fileURLToPath(new URL("../src/sets", import.meta.url)), "signals", files());
  console.log(`wrote src/sets/signals.data.ts and signals/: ${signalRecords().length} drawings`);
}

export { signalRecords, files as signalFiles, noticeText as signalsNoticeText };
