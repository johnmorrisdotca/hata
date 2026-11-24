// Draws the battle banners of Sengoku daimyo for this package: nobori (tall, narrow banners), hata (flags) and uma-jirushi (the
// sign carried beside a commander), as exact geometry (integers or hundredths, no traced picture) into src/sets/samurai.data.ts.
//
//   pnpm draw:samurai        rewrite the data file
//
// What is documented, and what is not. Almost no banner of the period survives, and none is drawn here from a surviving cloth. Each
// design is the one a reference gives in words (the Japanese Wikipedia's article on uma-jirushi, 馬印, which lists the banners and signs of
// named commanders, and its article on the Sanada clan, 真田氏, which describes the Sanada nobori and the screen of the siege of Osaka
// that shows the Sanada flag); the drawing is made from those words. The words give the design and the ground, not the proportions, the
// shades or the order of the parts, so each drawing says in its `note` which part is the source's and which is this package's, and every
// one is a `reconstruction`. Nothing was copied from a picture.
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import type { DrawnRecord } from "../src/drawn.ts";
import { box, n, poly, svg } from "./draw-lib.ts";
import type { Shape } from "./draw-lib.ts";

const NAVY = "#1d2b53";
const RED = "#c8102e";
const GOLD = "#d4a017";
const GOLD_DARK = "#9a6f00";
const BLACK = "#16161a";
const WHITE = "#f4f1e8";

const fill = (colour: string, d: string): Shape => ({ fill: colour, d });
const circle = (cx: number, cy: number, r: number): string => `M${n(cx - r)} ${n(cy)}a${n(r)} ${n(r)} 0 1 0 ${n(2 * r)} 0a${n(r)} ${n(r)} 0 1 0 ${n(-2 * r)} 0z`;
const ring = (cx: number, cy: number, r: number, hole: number): string => `${circle(cx, cy, r)}${box(cx - hole, cy - hole, 2 * hole, 2 * hole)}`;

// A folding fan, open: the sector of a circle of radius R about the pivot (cx, cy), without the part nearer the pivot than r.
const fan = (cx: number, cy: number, big: number, small: number, half: number): string => {
  const a = (half * Math.PI) / 180;
  const point = (radius: number, sign: number): [number, number] => [cx + sign * radius * Math.sin(a), cy - radius * Math.cos(a)];
  const [ox1, oy1] = point(big, -1);
  const [ox2, oy2] = point(big, 1);
  const [ix1, iy1] = point(small, 1);
  const [ix2, iy2] = point(small, -1);

  return `M${n(ox1)} ${n(oy1)}A${n(big)} ${n(big)} 0 0 1 ${n(ox2)} ${n(oy2)}L${n(ix1)} ${n(iy1)}A${n(small)} ${n(small)} 0 0 0 ${n(ix2)} ${n(iy2)}z`;
};
// The fan's ribs: one line from the inner to the outer edge each, as thin quadrilaterals.
const ribs = (cx: number, cy: number, big: number, small: number, half: number, count: number): string => {
  const parts: string[] = [];
  for (let i = 1; i < count; i++) {
    const a = ((-half + (2 * half * i) / count) * Math.PI) / 180;
    const [dx, dy] = [Math.sin(a), -Math.cos(a)];
    const [nx, ny] = [Math.cos(a) * 0.9, Math.sin(a) * 0.9];
    parts.push(poly([[cx + dx * small - nx, cy + dy * small - ny], [cx + dx * big - nx, cy + dy * big - ny], [cx + dx * big + nx, cy + dy * big + ny], [cx + dx * small + nx, cy + dy * small + ny]]));
  }

  return parts.join("");
};

const NOBORI = { w: 100, h: 400 };
const SHAPES: Record<string, string> = {
  // Uesugi Kenshin, the "Tenshi no mihata": a red disc on a dark blue ground (紺地朱の丸).
  "uesugi-tenshi": svg("samurai", "uesugi-tenshi", 300, 200, [fill(NAVY, box(0, 0, 300, 200)), fill(RED, circle(150, 100, 56))]),
  // Uesugi Kenshin's uma-jirushi: a fan with a red disc on a dark blue ground (紺地朱の丸扇).
  "uesugi-ogi": svg("samurai", "uesugi-ogi", 260, 160, [fill(NAVY, fan(130, 150, 140, 36, 62)), fill(RED, circle(130, 70, 26))]),
  // Hojo Ujiyasu, the "five-colour steps" (五色段々): five bands, in the five colours of the five phases, blue, yellow, red, white, black.
  "hojo-gosyoku": svg("samurai", "hojo-gosyoku", NOBORI.w, NOBORI.h, [fill("#1f5fa6", box(0, 0, 100, 80)), fill("#e6c200", box(0, 80, 100, 80)), fill(RED, box(0, 160, 100, 80)), fill(WHITE, box(0, 240, 100, 80)), fill(BLACK, box(0, 320, 100, 80))]),
  // Date Masamune, the large black "four-part" banner (黒の大四半).
  "date-daishihan": svg("samurai", "date-daishihan", 150, 210, [fill(BLACK, box(0, 0, 150, 210))]),
  // Toyotomi Hideyoshi's large uma-jirushi: a gold war fan with a red streamer (金の軍配に朱の吹き流し).
  "toyotomi-gunbai": svg("samurai", "toyotomi-gunbai", 300, 300, [
    fill(GOLD, "M110 10c46 0 78 42 78 88s-32 88-78 88s-78-42-78-88s32-88 78-88z"),
    fill(GOLD_DARK, box(100, 186, 20, 100)),
    fill(RED, poly([[190, 40], [296, 54], [296, 66], [196, 80]])),
  ]),
  // Tokugawa Ieyasu's large uma-jirushi: a gold fan (金扇).
  "tokugawa-kinsen": svg("samurai", "tokugawa-kinsen", 260, 160, [fill(GOLD, fan(130, 150, 140, 36, 62)), fill(GOLD_DARK, ribs(130, 150, 140, 36, 62, 9))]),
  // Oda Nobunaga's uma-jirushi: a gold-lacquered parasol (金塗りの唐傘).
  "oda-karakasa": svg("samurai", "oda-karakasa", 200, 200, [
    fill(GOLD, "M10 120C20 60 60 20 100 14c40 6 80 46 90 106z"),
    fill(GOLD_DARK, poly([[98, 14], [102, 14], [104, 120], [96, 120]]) + poly([[96, 120], [104, 120], [104, 190], [96, 190]]) + poly([[99, 16], [101, 16], [52, 120], [44, 120]]) + poly([[99, 16], [101, 16], [156, 120], [148, 120]])),
  ]),
  // The Sanada nobori: red, with the six coins of the crest (六連銭) in two rows of three; the coins' colour is this package's.
  "sanada-rokumonsen": svg("samurai", "sanada-rokumonsen", NOBORI.w, NOBORI.h, [
    fill(RED, box(0, 0, 100, 400)),
    fill(GOLD, [0, 1, 2].flatMap((col) => [0, 1].map((row) => ring(20 + col * 30, 160 + row * 30, 14, 4.5))).join("")),
  ]),
  // Ii Naomasa's standard: a gold well-curb (井桁) on red (赤地に金の井桁).
  "ii-igeta": svg("samurai", "ii-igeta", 160, 160, [fill(RED, box(0, 0, 160, 160)), fill(GOLD, box(50, 30, 12, 100) + box(98, 30, 12, 100) + box(30, 50, 100, 12) + box(30, 98, 100, 12))]),
};

const READ = "2026-11-24";
const UMA = {
  title: "馬印 (Uma-jirushi), Japanese Wikipedia",
  url: "https://ja.wikipedia.org/wiki/馬印",
  kind: "encyclopedia",
  read: READ,
  says: "The article lists the banners and signs of named Sengoku commanders with their designs and grounds in words (for example Uesugi Kenshin's red disc on dark blue, Hojo Ujiyasu's five-colour steps, Toyotomi Hideyoshi's gold war fan with a red streamer). It names no surviving cloth or museum for them.",
} as const;
const SANADA = {
  title: "真田氏 (Sanada clan), Japanese Wikipedia",
  url: "https://ja.wikipedia.org/wiki/真田氏",
  kind: "encyclopedia",
  read: READ,
  says: "The article says the six-coin crest (六連銭) was mainly used as a battle banner, describes an all-red nobori with the six-coin crest of unclear use (no collection named), and gives the screen of the Summer Campaign of Osaka in the Osaka Castle collection as the source for the Sanada unit's all-red flag with a gold line.",
} as const;
const NOTE_BASE = {
  en: "No cloth survives to draw from. The design and the ground follow the words of the source; the proportions, the shades and the order of any parts are this package's, so the drawing is a reconstruction.",
  ja: "絵を起こせる現存の布はありません。意匠と地の色は出典のことばに従い、縦横の比、色合い、各部の並びはこのパッケージのものなので、この絵は復元です。",
};

interface Entry { slug: string; group: "nobori" | "hata" | "uma"; en: string; ja: string; aboutEn: string; aboutJa: string; source: typeof UMA | typeof SANADA; noteEn?: string; noteJa?: string }
const ENTRIES: Entry[] = [
  { slug: "uesugi-tenshi", group: "hata", en: "Uesugi Kenshin: Tenshi no mihata", ja: "上杉謙信「天賜の御旗」", aboutEn: "A red disc on a dark blue ground (紺地朱の丸), the banner of Uesugi Kenshin that the source calls the Tenshi no mihata, the banner given by heaven.", aboutJa: "紺地に朱の丸。出典が「天賜の御旗」と呼ぶ、上杉謙信の旗です。", source: UMA, noteEn: "The source gives the disc and the ground only: the disc's size and place, the shade of the blue and the flag's proportions (3 to 2 here) are this package's." , noteJa: "出典が示すのは丸と地の色だけです。丸の大きさと位置、紺の色合い、旗の縦横の比（ここでは3対2）はこのパッケージのものです。" },
  { slug: "uesugi-ogi", group: "uma", en: "Uesugi Kenshin: the fan", ja: "上杉謙信の扇の馬印", aboutEn: "A fan with a red disc on a dark blue ground (紺地朱の丸扇), the uma-jirushi of Uesugi Kenshin.", aboutJa: "紺地に朱の丸のある扇。上杉謙信の馬印です。", source: UMA, noteEn: "The source names the fan, the red disc and the dark blue ground: the number of ribs, the fan's angle and the disc's place are this package's.", noteJa: "出典は扇、朱の丸、紺の地を挙げるだけです。親骨の数、扇の開き、丸の位置はこのパッケージのものです。" },
  { slug: "hojo-gosyoku", group: "nobori", en: "Hojo Ujiyasu: five-colour steps", ja: "北条氏康「五色段々」", aboutEn: "A banner of five bands in five colours (五色段々), the hata-jirushi of Hojo Ujiyasu.", aboutJa: "五色の段が重なる旗。北条氏康の旗印です。", source: UMA, noteEn: "The source gives the name and no colours or order: the five colours here are blue, yellow, red, white and black, the colours of the five phases, in that order, and the bands' equal widths and the banner's 1 to 4 proportions are this package's.", noteJa: "出典は名前だけで、色も順序も示しません。ここでは五行の色の青・黄・赤・白・黒をこの順に並べ、帯の幅を等しく、旗の比を1対4としましたが、これはこのパッケージのものです。" },
  { slug: "date-daishihan", group: "hata", en: "Date Masamune: the large black banner", ja: "伊達政宗「黒の大四半」", aboutEn: "A large plain black banner (黒の大四半), the hata-jirushi of Date Masamune.", aboutJa: "黒一色の大きな旗（黒の大四半）。伊達政宗の旗印です。", source: UMA, noteEn: "The source gives the colour and that it is large: the proportions (5 to 7) are this package's, and the bird-feather ornament the source mentions with it is not drawn.", noteJa: "出典が示すのは色と大きさだけです。縦横の比（5対7）はこのパッケージのもので、出典が併せて挙げる鳥毛の飾りは描いていません。" },
  { slug: "toyotomi-gunbai", group: "uma", en: "Toyotomi Hideyoshi: the gold war fan", ja: "豊臣秀吉の金の軍配と朱の吹き流し", aboutEn: "A gold war fan (gunbai) with a red streamer (金の軍配に朱の吹き流し), the large uma-jirushi of Toyotomi Hideyoshi.", aboutJa: "金の軍配に朱の吹き流しを付けたもの。豊臣秀吉の大馬印です。", source: UMA, noteEn: "The source names a gold war fan and a red streamer: the shape of the fan, where the streamer hangs and its length are this package's.", noteJa: "出典は金の軍配と朱の吹き流しを挙げるだけです。軍配の形、吹き流しの付く位置と長さはこのパッケージのものです。" },
  { slug: "tokugawa-kinsen", group: "uma", en: "Tokugawa Ieyasu: the gold fan", ja: "徳川家康の金扇", aboutEn: "A gold fan (金扇), the large uma-jirushi of Tokugawa Ieyasu.", aboutJa: "金の扇。徳川家康の大馬印です。", source: UMA, noteEn: "The source names a gold fan only: the ribs, the fan's angle and its shades are this package's.", noteJa: "出典が挙げるのは金の扇だけです。親骨、扇の開き、色合いはこのパッケージのものです。" },
  { slug: "oda-karakasa", group: "uma", en: "Oda Nobunaga: the gold parasol", ja: "織田信長の金塗りの唐傘", aboutEn: "A gold-lacquered parasol (金塗りの唐傘), the uma-jirushi of Oda Nobunaga.", aboutJa: "金漆塗りの唐傘。織田信長の馬印です。", source: UMA, noteEn: "The source names a gold-lacquered parasol only: its shape, ribs and shades are this package's.", noteJa: "出典が挙げるのは金漆塗りの唐傘だけです。形、骨、色合いはこのパッケージのものです。" },
  { slug: "sanada-rokumonsen", group: "nobori", en: "Sanada: the six-coin nobori", ja: "真田の六連銭の幟", aboutEn: "An all-red nobori with the six-coin crest (六連銭), the Sanada clan's battle banner.", aboutJa: "総赤の幟に六連銭の紋を付けたもの。真田氏の戦場の旗印です。", source: SANADA, noteEn: "The source says the nobori is all red with the six-coin crest, of unclear use, and names no collection: the two rows of three coins, their gold colour, and the 1 to 4 proportions are this package's. The Sanada flag the Osaka screen shows has no crest and is not drawn.", noteJa: "出典は、総赤の幟に六連銭の紋があること、使われ方が不明であること、所蔵先が示されていないことを述べます。3枚ずつ2段の銭、金色、1対4の比はこのパッケージのものです。大坂の屏風に描かれた真田の旗は紋がなく、描いていません。" },
  { slug: "ii-igeta", group: "hata", en: "Ii Naomasa: the gold well-curb", ja: "井伊直政の赤地に金の井桁", aboutEn: "A gold well-curb (井桁) on a red ground (赤地に金の井桁), the matoi standard of Ii Naomasa, whose troops were known for their red.", aboutJa: "赤地に金の井桁。赤で知られた井伊直政の隊の纏です。", source: UMA, noteEn: "The source names the red ground and the gold well-curb on the standard: the curb's proportions, the shades and the square shape are this package's.", noteJa: "出典は、纏の赤い地と金の井桁を挙げるだけです。井桁の寸法、色合い、正方形の形はこのパッケージのものです。" },
];

const samuraiRecords = (): DrawnRecord[] =>
  ENTRIES.map((entry) => ({
    id: `samurai:${entry.slug}`,
    group: entry.group,
    name: { en: entry.en, ja: entry.ja },
    about: { en: entry.aboutEn, ja: entry.aboutJa },
    status: "reconstruction",
    dates: null,
    note: { en: `${entry.noteEn ?? ""} ${NOTE_BASE.en}`.trim(), ja: `${entry.noteJa ?? ""}${NOTE_BASE.ja}` },
    source: entry.source,
    svg: SHAPES[entry.slug]!,
  }));

const text = (): string => {
  const body = samuraiRecords().map((record) => `  ${JSON.stringify(record)},`).join("\n");

  return `// Made by scripts/draw-samurai.ts (pnpm draw:samurai): do not edit by hand. Battle banners of Sengoku daimyo, drawn for this package under the MIT licence from the words of the sources named in each record, every one a reconstruction.\nimport type { DrawnRecord } from "../drawn";\n\nconst SAMURAI = [\n${body}\n] as const satisfies readonly DrawnRecord[];\n\nexport { SAMURAI };\n`;
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  writeFileSync(fileURLToPath(new URL("../src/sets/samurai.data.ts", import.meta.url)), text());
  console.log(`wrote src/sets/samurai.data.ts: ${samuraiRecords().length} drawings`);
}

export { samuraiRecords, text as samuraiDataText };
