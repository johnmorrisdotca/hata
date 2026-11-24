// Draws a small curated set of medieval banners for this package, as exact geometry (integers or hundredths, no traced picture) into
// src/sets/medieval.data.ts.
//
//   pnpm draw:medieval        rewrite the data file
//
// Each banner is one a page cites with a date and a source: a seal, an armorial, a papal grant, a treasurer's account, a chronicle. The
// source gives the design, never the proportions, so every drawing is a `reconstruction` and its `note` says what the source documents and
// what is this package's (the proportions, the shades, the shape of the cloth, which is a rectangle here). Nothing was copied from a picture.
// A banner whose source could not be found on a page that dates it (the Teutonic Order's white banner with a black cross) is left out.
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import type { DrawnRecord } from "../src/drawn.ts";
import { box, clipTo, poly, svg } from "./draw-lib.ts";
import type { Shape } from "./draw-lib.ts";

const RED = "#c8102e";
const WHITE = "#f7f4ea";
const BLACK = "#16161a";
const BLUE = "#0a4a9c";
const YELLOW = "#fcd116";

const fill = (colour: string, d: string): Shape => ({ fill: colour, d });
// A cross whose arms are `arm` wide, its vertical arm centred `at` from the hoist, in a w by h banner.
const cross = (colour: string, w: number, h: number, arm: number, at: number): Shape => fill(colour, box(at - arm / 2, 0, arm, h) + box(0, h / 2 - arm / 2, w, arm));
// A diagonal band of vertical width `vertical` along a diagonal of the w by h banner, cut to it.
const diagonal = (w: number, h: number, vertical: number, rising: boolean): string => {
  const half = vertical / 2;
  const [a, b]: [[number, number], [number, number]] = rising ? [[0, h], [w, 0]] : [[0, 0], [w, h]];
  const extend = 40;
  const slope = (b[1] - a[1]) / (b[0] - a[0]);
  const points: [number, number][] = [[a[0] - extend, a[1] - extend * slope - half], [b[0] + extend, b[1] + extend * slope - half], [b[0] + extend, b[1] + extend * slope + half], [a[0] - extend, a[1] - extend * slope + half]];

  return poly(clipTo(points, w, h));
};

const W = 400;
const H = 300;
const SHAPES: Record<string, string> = {
  // The Templars' banner: white with a black chief, a third of the height.
  "templar-baucent": svg("med", "templar-baucent", W, H, [fill(WHITE, box(0, 0, W, H)), fill(BLACK, box(0, 0, W, H / 3))]),
  // The red cross on white, reaching the edges, its arms a fifth of the height wide.
  "red-cross": svg("med", "red-cross", W, H, [fill(WHITE, box(0, 0, W, H)), cross(RED, W, H, 60, W / 2)]),
  // Denmark's banner in the Gelre Armorial: a white cross on red, the vertical arm nearer the hoist.
  "gelre-denmark": svg("med", "gelre-denmark", W, H, [fill(RED, box(0, 0, W, H)), cross(WHITE, W, H, 60, 150)]),
  // The arms of Aragon: gold with four red pales, nine stripes of equal width.
  "aragon-pallets": svg("med", "aragon-pallets", 360, 240, [fill(YELLOW, box(0, 0, 360, 240)), fill(RED, [1, 3, 5, 7].map((i) => box(i * 40, 0, 40, 240)).join(""))]),
  // The saltire of Scotland: a white saltire on blue, its bars a fifth of the height wide (the Lord Lyon gives a third to a fifth).
  "scotland-saltire": svg("med", "scotland-saltire", 300, 180, [fill(BLUE, box(0, 0, 300, 180)), fill(WHITE, diagonal(300, 180, 36, true) + diagonal(300, 180, 36, false))]),
  // The Hospitallers' red with a white cross, the cross's arms a fifth of the height wide.
  "hospitaller-cross": svg("med", "hospitaller-cross", W, H, [fill(RED, box(0, 0, W, H)), cross(WHITE, W, H, 60, W / 2)]),
};

const READ = "2026-11-24";
const src = (title: string, url: string, says: string): DrawnRecord["source"] => ({ title, url, kind: "encyclopedia", read: READ, says });
const NOTE_END = {
  en: " No banner of the time survives to draw from: the proportions, the shades, the width of the arms and the rectangular cloth are this package's, so the drawing is a reconstruction.",
  ja: "当時の旗は残っていないため、縦横の比、色合い、腕の太さ、長方形の布はこのパッケージのもので、この絵は復元です。",
};

interface Entry { slug: string; en: string; ja: string; aboutEn: string; aboutJa: string; dates: { from: string | null; until: string | null } | null; source: DrawnRecord["source"]; noteEn: string; noteJa: string }
const ENTRIES: Entry[] = [
  {
    slug: "templar-baucent", en: "The Templars' banner (the baucent)", ja: "テンプル騎士団の旗（ボーセアン）", dates: { from: "1220", until: "1312" },
    aboutEn: "The banner of the Knights Templar: white with a black chief, the colours Jacques de Vitry described in the 1220s.", aboutJa: "テンプル騎士団の旗。白地に黒い上部を持ち、1220年代にジャック・ド・ヴィトリが述べた色です。",
    source: src("Beauseant, Wikipedia", "https://en.wikipedia.org/wiki/Beauseant", "Says 13th-century sources describe a white gonfanon with a black chief (argent a chief sable), names Jacques de Vitry (1220s) and Matthew Paris (c. 1250 to 1259), and says a fresco at San Bevignate (c. 1290) shows the banner with the upper half white and the lower half black and a red cross."),
    noteEn: "The black and white are the source's. The sources differ on which half is black (a black chief in the text, a black lower half in the fresco) and on the red cross of the fresco, which the article says appears to be later: this drawing follows the text, and leaves out the cross.", noteJa: "白と黒は出典のものです。出典どうしで、どちらの半分が黒かが食い違います（文章では黒い上部、壁画では黒い下半分）。壁画の赤い十字は、記事によれば後の付加とみられます。この絵は文章に従い、十字は描きません。",
  },
  {
    slug: "red-cross", en: "The red cross on white (St George's Cross)", ja: "白地に赤十字（聖ジョージ十字）", dates: { from: "1218", until: null },
    aboutEn: "A red cross on white: the crusaders' sign from about 1190, the flag of Genoa from at least 1218, and England's flag, later tied to Saint George.", aboutJa: "白地に赤い十字。1190年ごろから十字軍のしるしとなり、ジェノヴァの旗として遅くとも1218年から使われ、のちに聖ジョージと結び付いたイングランドの旗です。",
    source: src("Saint George's Cross, Wikipedia", "https://en.wikipedia.org/wiki/Saint_George%27s_Cross", "Says the Genoese annals show a plain red-cross flag from at least 1218 (and a flag of Saint George and the dragon in 1198), that the plain red on white became a recognisable crusaders' symbol from about 1190, and that the story of Richard I buying the right to the flag in 1190 is a tradition the page cannot confirm."),
    noteEn: "The design and the date of 1218 are the source's; the 1190 grant is a tradition and is not drawn as a fact.", noteJa: "意匠と1218年という年は出典のものです。1190年の許可は伝承で、事実としては描きません。",
  },
  {
    slug: "gelre-denmark", en: "Denmark's banner in the Gelre Armorial", ja: "ゲルレ紋章集のデンマークの旗", dates: null,
    aboutEn: "A white cross on red, the banner of \"die coninc van denmarke\" on folio 55v of the Gelre Armorial, compiled before 1396: the earliest known coloured picture of the Dannebrog.", aboutJa: "赤地に白い十字。1396年より前に編まれたゲルレ紋章集の55葉裏にある「デンマーク王」の旗で、ダンネブロの現存する最古の彩色画とされます。",
    source: src("Gelre Armorial, Wikipedia", "https://en.wikipedia.org/wiki/Gelre_Armorial", "Says the armorial was compiled before 1396 by Claes Heinenzoon (fl. 1345 to 1414), that folio 55v shows a lance tip with a banner displaying a white cross on red, labelled \"die coninc van denmarke\", and that it is the earliest known coloured image of the Dannebrog."),
    noteEn: "The white cross on red and the date are the source's; the page does not describe the cross's proportions or the cloth's shape, so the arms' width and the cross's place (nearer the hoist, as in the Dannebrog today) are this package's.", noteJa: "赤地に白い十字と年代は出典のものです。出典は十字の寸法も布の形も述べないため、腕の太さと十字の位置（今のダンネブロと同じく掲揚側寄り）はこのパッケージのものです。",
  },
  {
    slug: "aragon-pallets", en: "The arms of Aragon", ja: "アラゴンの紋章", dates: { from: "1159", until: null },
    aboutEn: "Gold with four red bars, here as a banner of nine vertical stripes: the arms of Aragon, whose earliest undisputed material evidence is the seal of Alfonso II of 1159.", aboutJa: "金地に4本の赤い帯。ここでは縦の9本の縞の旗として描きます。アラゴンの紋章で、争いのない最古の物証は1159年のアルフォンソ2世の印章です。",
    source: src("Flag of Aragon, Wikipedia", "https://en.wikipedia.org/wiki/Flag_of_Aragon", "Says the earliest undisputed material evidence of the arms is a royal seal of Alfonso II of Aragon (1159), that an equestrian seal of Ramon Berenguer IV (c. 1150) shows a paled shield with no tinctures, and gives the blazon as Or, four bars Gules."),
    noteEn: "The gold and red and the four bars (vertical on the flag) are the source's, dated by the seal of 1159, whose tinctures a seal does not show: they are the blazon's. The ratio of 3 to 2 and the shades are this package's. The legend of the bars drawn by Charles the Bald is not drawn as a fact.", noteJa: "金と赤、4本の帯（旗では縦）は出典のもので、1159年の印章で年代が示されます。印章に色は出ないため、色は紋章記述のものです。3対2の比と色合いはこのパッケージのものです。カール禿頭王が帯を描いたという伝説は、事実としては描きません。",
  },
  {
    slug: "scotland-saltire", en: "The saltire of Scotland", ja: "スコットランドのサルタイア", dates: { from: "1507", until: null },
    aboutEn: "A white saltire (St Andrew's Cross) on blue, first recorded as a naval flag in 1507, for the carrack Great Michael.", aboutJa: "青地に白い斜め十字（聖アンドリュー十字）。1507年に大型帆船グレート・マイケル号の旗として記録されたのが最初です。",
    source: src("Flag of Scotland, Wikipedia", "https://en.wikipedia.org/wiki/Flag_of_Scotland", "Says the saltire as a naval flag on blue is recorded for 1507 (the Treasurer's accounts, for the carrack Great Michael), that the white saltire on blue is first shown in 1542 in Lindsay's armorial, that a seal of the Guardians of Scotland of 1286 shows Saint Andrew on a saltire cross, and that the Parliament of Scotland in 1385 ordered a white St Andrew's Cross for soldiers; it gives the saltire's width as a third to a fifth of the field."),
    noteEn: "The white saltire on blue and the date of 1507 are the source's, and the bars are drawn a fifth of the height wide, within the range the source gives. It is the latest banner here, at the edge of the Middle Ages: the 1286 seal and the 1385 order show the saltire as a sign, not as a banner.", noteJa: "青地に白い斜め十字と1507年は出典のものです。帯は、出典の示す範囲内で、縦の5分の1の太さに描きます。ここにあるなかで最も新しく、中世の終わりに当たります。1286年の印章と1385年の命令が示すのは、旗ではなく、しるしとしての斜め十字です。",
  },
  {
    slug: "hospitaller-cross", en: "The Hospitallers' white cross on red", ja: "聖ヨハネ騎士団の赤地に白十字", dates: { from: "1130", until: null },
    aboutEn: "A white cross on red, the arms the Order of St John is said to have had from Pope Innocent II in 1130, and the cross of the red surcoat the Hospitallers wore in war from 1248.", aboutJa: "赤地に白い十字。聖ヨハネ騎士団が1130年に教皇インノケンティウス2世から授かったとされる紋章で、1248年から戦場で着た赤い上着の十字です。",
    source: src("Knights Hospitaller, Wikipedia", "https://en.wikipedia.org/wiki/Knights_Hospitaller", "Says Pope Innocent II gave the order its coat of arms, a plain silver cross in a field of red, to tell them from the Templars (1130; no document is named), and that in 1248 Pope Innocent IV approved a military dress of a red surcoat with a white cross."),
    noteEn: "The white cross on red and the two dates are the source's, which names the arms and the dress and no banner; that the banner bore the same cross is this package's reading. The page names no document for the grant of 1130.", noteJa: "赤地に白い十字と2つの年は出典のものです。出典が挙げるのは紋章と軍装で、旗には触れていません。旗が同じ十字を掲げたというのは、このパッケージの読み方です。1130年の授与について、出典は文書を挙げていません。",
  },
];

const medievalRecords = (): DrawnRecord[] =>
  ENTRIES.map((entry) => ({
    id: `med:${entry.slug}`,
    group: entry.slug === "templar-baucent" || entry.slug === "hospitaller-cross" ? "order" : entry.slug === "red-cross" || entry.slug === "scotland-saltire" ? "cross" : "kingdom",
    name: { en: entry.en, ja: entry.ja },
    about: { en: entry.aboutEn, ja: entry.aboutJa },
    status: "reconstruction",
    dates: entry.dates,
    note: { en: `${entry.noteEn}${NOTE_END.en}`, ja: `${entry.noteJa}${NOTE_END.ja}` },
    source: entry.source,
    svg: SHAPES[entry.slug]!,
  }));

const text = (): string => {
  const body = medievalRecords().map((record) => `  ${JSON.stringify(record)},`).join("\n");

  return `// Made by scripts/draw-medieval.ts (pnpm draw:medieval): do not edit by hand. A small curated set of medieval banners, drawn for this package under the MIT licence from the dated sources named in each record, every one a reconstruction.\nimport type { DrawnRecord } from "../drawn";\n\nconst MEDIEVAL = [\n${body}\n] as const satisfies readonly DrawnRecord[];\n\nexport { MEDIEVAL };\n`;
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  writeFileSync(fileURLToPath(new URL("../src/sets/medieval.data.ts", import.meta.url)), text());
  console.log(`wrote src/sets/medieval.data.ts: ${medievalRecords().length} drawings`);
}

export { medievalRecords, text as medievalDataText };
