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
//
// Twenty-four more are drawn from a picture of about the period: the handscroll 御馬印 (Go-umajirushi), scroll 1 of six, which the National
// Diet Library dates to around the Kan'ei years (1624 to 1644; its estimate, and the scroll calls Hidetada by his posthumous name 台徳院,
// given in 1632), call number WA8-7, public domain (https://dl.ndl.go.jp/pid/1286895). It paints the banners and standards of the shogun's
// house and the daimyo, each lord's name beside his. The cloth's proportions and the place and size of its parts are measured from the
// photograph of the frame named in each record; they are `documented`. The three that are written characters are lettered in Yuji Syuku, an
// SIL Open Font License brush font, from the outlines kept in data-sources/glyphs (pnpm data:glyphs).
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import type { DrawnDrawing } from "../src/drawn.ts";
import { box, setFiles, writeSetFiles, n, poly, svg } from "./draw-lib.ts";
import type { Shape } from "./draw-lib.ts";

const NAVY = "#1d2b53";
const RED = "#c8102e";
const GOLD = "#d4a017";
const GOLD_DARK = "#9a6f00";
const BLACK = "#16161a";
const WHITE = "#f4f1e8";
// The handscroll's shades, read from the photographs: vermilion, gold leaf, and two pale blues (asagi).
const VERMILION = "#d4643c";
const LEAF = "#cdb46a";
const ASAGI = "#9fb6c6";
const ASAGI_PALE = "#c3d0da";

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

// A character of the brush font, its em `size` units high, centred on (cx, cy): the outline in the font's units (y up) scaled and
// turned the right way up. Only M, L, Q and z occur in a TrueType outline.
const FONT = JSON.parse(readFileSync(fileURLToPath(new URL("../data-sources/glyphs/yuji-syuku.json", import.meta.url)), "utf8")) as { glyphs: Record<string, { box: [number, number, number, number]; d: string }> };
const letter = (character: string, colour: string, cx: number, cy: number, size: number): Shape => {
  const glyph = FONT.glyphs[character];
  if (glyph === undefined) throw new Error(`no glyph for ${character} in data-sources/glyphs: add it to scripts/fetch-glyphs.ts and run pnpm data:glyphs`);
  const [x0, y0, x1, y1] = glyph.box;
  const k = size / 1000;
  const [mx, my] = [(x0 + x1) / 2, (y0 + y1) / 2];
  let at = 0;
  const d = glyph.d.replace(/-?\d+(\.\d+)?/g, (value) => n(at++ % 2 === 0 ? cx + (Number(value) - mx) * k : cy - (Number(value) - my) * k));

  return { fill: colour, d, glyph: character };
};
const discs = (points: readonly (readonly [number, number])[], r: number): string => points.map(([x, y]) => circle(x, y, r)).join("");
// A band between two circles about (cx, cy): the inner circle is drawn the other way round, so it is a hole.
const annulus = (cx: number, cy: number, r: number, inner: number): string => `${circle(cx, cy, r)}M${n(cx - inner)} ${n(cy)}a${n(inner)} ${n(inner)} 0 1 1 ${n(2 * inner)} 0a${n(inner)} ${n(inner)} 0 1 1 ${n(-2 * inner)} 0z`;
// A lozenge (菱) w wide and h high, centred on (cx, cy).
const lozenge = (cx: number, cy: number, w: number, h: number): string => poly([[cx, cy - h / 2], [cx + w / 2, cy], [cx, cy + h / 2], [cx - w / 2, cy]]);
// A zigzag band, 2 * half wide across, along the points given and moved dx to the right.
const zigzag = (points: readonly (readonly [number, number])[], dx: number, half: number): string => poly([...points.map(([x, y]) => [x + dx - half, y] as const), ...[...points].reverse().map(([x, y]) => [x + dx + half, y] as const)]);
// The gold zigzag of 酒井阿波守's nobori, as the scroll paints it: the left line's turns, the other 20 to its right.
const ZIGZAG: readonly (readonly [number, number])[] = [[36, 0], [43.1, 33.8], [28.5, 64.6], [43.1, 103], [28.5, 133.8], [43.1, 164.6], [28.5, 199.2], [43.1, 233.8], [28.5, 268.4], [43.1, 306.8], [28.5, 337.6], [43.1, 379.9], [28.5, 414.5], [43.1, 449.1], [42, 455.4]];
// The six coins of 真田河内守's banner, two rows of three, as the scroll paints them.
const COINS: readonly (readonly [number, number])[] = [31.8, 76.3].flatMap((y) => [19.8, 47, 76.6].map((x) => [x, y] as const));

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
  // From the handscroll 御馬印, scroll 1: the cloth 100 wide, its height and every part measured from the frame the record names.
  "taitokuin-go": svg("samurai", "taitokuin-go", 100, 116, [fill(BLACK, box(0, 0, 100, 116)), letter("五", WHITE, 53.9, 46.9, 47)]),
  "mito-kinmaru": svg("samurai", "mito-kinmaru", 100, 102, [fill(BLACK, box(0, 0, 100, 102)), fill(LEAF, circle(52.4, 48.2, 29.7))]),
  "echizen-hinomaru": svg("samurai", "echizen-hinomaru", 100, 100, [fill(WHITE, box(0, 0, 100, 100)), fill(VERMILION, circle(48.6, 47.8, 25.5))]),
  "hoshina-higo-kuroboshi": svg("samurai", "hoshina-higo-kuroboshi", 100, 293, [
    fill(ASAGI_PALE, box(0, 0, 100, 293)),
    fill(BLACK, discs([25.1, 48.5, 71.9, 117.5, 140.8, 163.5, 204.6, 230, 253.9].flatMap((y) => [18.5, 50.8, 81.3].map((x) => [x, y] as const)), 8)),
  ]),
  "sakai-kunai-mitsumaru": svg("samurai", "sakai-kunai-mitsumaru", 100, 262, [fill(WHITE, box(0, 0, 100, 262)), fill(VERMILION, discs([[49, 43.7], [49, 126.7], [49, 209.1]], 32))]),
  "sakai-kunai-hinomaru": svg("samurai", "sakai-kunai-hinomaru", 100, 101, [fill(WHITE, box(0, 0, 100, 101)), fill(VERMILION, circle(43.7, 50.1, 37.2))]),
  "sakai-kunai-kinmaru": svg("samurai", "sakai-kunai-kinmaru", 100, 102, [fill(ASAGI, box(0, 0, 100, 102)), fill(LEAF, circle(47.7, 53.3, 35.6))]),
  "uesugi-danjo-kinmaru": svg("samurai", "uesugi-danjo-kinmaru", 100, 117, [fill(BLACK, box(0, 0, 100, 117)), fill(LEAF, circle(48.5, 58.7, 35.1))]),
  "uesugi-danjo-bi": svg("samurai", "uesugi-danjo-bi", 100, 111, [fill(WHITE, box(0, 0, 100, 111)), letter("毘", BLACK, 51.8, 50, 45)]),
  "todo-izumi-mitsumaru": svg("samurai", "todo-izumi-mitsumaru", 100, 361, [fill(BLACK, box(0, 0, 100, 361)), fill(WHITE, discs([[47.4, 65.1], [47.4, 177.1], [47.4, 284.1]], 35.6))]),
  "honda-mino-hon": svg("samurai", "honda-mino-hon", 100, 278, [fill(WHITE, box(0, 0, 100, 278)), fill(BLACK, box(0, 90.6, 100, 76.3)), letter("本", BLACK, 49.8, 24.7, 49)]),
  "honda-mino-kin-obi": svg("samurai", "honda-mino-kin-obi", 100, 146, [fill(BLACK, box(0, 0, 100, 146)), fill(LEAF, box(0, 45.1, 100, 39.5))]),
  "ii-kamon-aka-nobori": svg("samurai", "ii-kamon-aka-nobori", 100, 373, [fill(VERMILION, box(0, 0, 100, 373))]),
  "ii-kamon-aka-hata": svg("samurai", "ii-kamon-aka-hata", 100, 100, [fill(VERMILION, box(0, 0, 100, 100))]),
  "koide-yamato-naname": svg("samurai", "koide-yamato-naname", 100, 410, [fill(WHITE, box(0, 0, 100, 410)), fill(BLACK, poly([[0, 165], [100, 354.5], [100, 410], [0, 410]]))]),
  "koide-yamato-hinomaru": svg("samurai", "koide-yamato-hinomaru", 100, 119, [fill(WHITE, box(0, 0, 100, 119)), fill(VERMILION, circle(45.8, 59.8, 29.7))]),
  "terazawa-shima-mitsumaru": svg("samurai", "terazawa-shima-mitsumaru", 100, 284.4, [fill(WHITE, box(0, 0, 100, 284.4)), fill(BLACK, discs([[49.5, 53.3], [49.5, 140.2], [49.5, 227.1]], 37.3))]),
  "sanada-kawachi-rokumonsen": svg("samurai", "sanada-kawachi-rokumonsen", 100, 113.4, [
    fill(BLACK, box(0, 0, 100, 113.4)),
    fill(WHITE, discs(COINS, 10.6)),
    fill(BLACK, COINS.map(([x, y]) => annulus(x, y, 6.7, 5.9)).join("")),
    fill(BLACK, COINS.map(([x, y]) => box(x - 2.75, y - 2.75, 5.5, 5.5)).join("")),
    fill(WHITE, COINS.map(([x, y]) => box(x - 1.95, y - 1.95, 3.9, 3.9)).join("")),
    fill(BLACK, COINS.map(([x, y]) => box(x - 1.1, y - 1.1, 2.2, 2.2)).join("")),
  ]),
  "sanada-kawachi-aka-obi": svg("samurai", "sanada-kawachi-aka-obi", 100, 351, [fill(WHITE, box(0, 0, 100, 351)), fill(VERMILION, box(0, 128, 100, 99))]),
  "koriki-settsu-shiromaru": svg("samurai", "koriki-settsu-shiromaru", 100, 319.3, [fill(BLACK, box(0, 0, 100, 319.3)), fill(WHITE, circle(46.3, 52.2, 31.7))]),
  "matsudaira-shimosa-kinbishi": svg("samurai", "matsudaira-shimosa-kinbishi", 100, 277, [fill(BLACK, box(0, 0, 100, 277)), fill(LEAF, lozenge(51, 63.3, 56.8, 45.6)), fill(BLACK, lozenge(51, 63.3, 24, 17.2))]),
  "matsudaira-shimosa-kinbishi-hata": svg("samurai", "matsudaira-shimosa-kinbishi-hata", 100, 119.4, [fill(BLACK, box(0, 0, 100, 119.4)), fill(LEAF, lozenge(51.2, 60.1, 63.6, 44.1)), fill(BLACK, lozenge(51.2, 60.1, 26.7, 18.2))]),
  "ogasawara-ukon-sangaibishi": svg("samurai", "ogasawara-ukon-sangaibishi", 100, 121.2, [fill(BLACK, box(0, 0, 100, 121.2)), fill(WHITE, lozenge(44.1, 39, 26, 17) + lozenge(44.4, 55.2, 43.8, 24) + lozenge(47.6, 72.5, 53.3, 30.4))]),
  "matsudaira-tanba-kuro-obi": svg("samurai", "matsudaira-tanba-kuro-obi", 100, 364.5, [fill(WHITE, box(0, 0, 100, 364.5)), fill(BLACK, [[47.3, 63.4], [104.3, 121.5], [163.4, 180.6], [218.8, 235], [270.9, 286], [318.5, 330.9]].map(([y0, y1]) => box(0, y0, 100, y1 - y0)).join(""))]),
  "sakai-uta-shiromaru": svg("samurai", "sakai-uta-shiromaru", 100, 120.1, [fill(BLACK, box(0, 0, 100, 120.1)), fill(WHITE, circle(45, 59.6, 31))]),
  "sakai-awa-inazuma": svg("samurai", "sakai-awa-inazuma", 100, 455.4, [fill(BLACK, box(0, 0, 100, 455.4)), fill(LEAF, zigzag(ZIGZAG, 0, 3.85) + zigzag(ZIGZAG, 20, 3.85))]),
  "matsudaira-kai-janome": svg("samurai", "matsudaira-kai-janome", 100, 107, [fill(WHITE, box(0, 0, 100, 107)), fill(VERMILION, annulus(51.9, 48.8, 37.6, 19) + circle(51.9, 48.8, 9.8))]),
  "matsudaira-kai-kin": svg("samurai", "matsudaira-kai-kin", 100, 120.4, [fill(LEAF, box(0, 0, 100, 120.4))]),
  "matsudaira-echigo-naname": svg("samurai", "matsudaira-echigo-naname", 100, 128.5, [fill(VERMILION, box(0, 0, 100, 128.5)), fill(LEAF, poly([[88.1, 0], [100, 0], [100, 20.7], [11.5, 128.5], [0, 128.5], [0, 107.9]]))]),
  "matsudaira-yamashiro-kuyo": svg("samurai", "matsudaira-yamashiro-kuyo", 100, 112, [fill(VERMILION, box(0, 0, 100, 112)), fill(WHITE, circle(48.9, 54.2, 11.6) + discs(Array.from({ length: 8 }, (_, i) => [48.9 + 21.2 * Math.sin((i * Math.PI) / 4), 54.2 - 21.2 * Math.cos((i * Math.PI) / 4)] as const), 6.8))]),
  "matsudaira-yamashiro-kinwa": svg("samurai", "matsudaira-yamashiro-kinwa", 100, 113.4, [fill(BLACK, box(0, 0, 100, 113.4)), fill(LEAF, annulus(51.3, 53.2, 40.1, 33.8))]),
  "matsudaira-dewa-shiromaru": svg("samurai", "matsudaira-dewa-shiromaru", 100, 110.3, [fill(BLACK, box(0, 0, 100, 110.3)), fill(WHITE, circle(48.2, 51.3, 36.9))]),
  "matsudaira-dewa-shiromaru-nobori": svg("samurai", "matsudaira-dewa-shiromaru-nobori", 100, 282.7, [fill(BLACK, box(0, 0, 100, 282.7)), fill(WHITE, circle(44.7, 61.2, 37.6))]),
  "okubo-kaga-shirowa": svg("samurai", "okubo-kaga-shirowa", 100, 266.4, [fill(BLACK, box(0, 0, 100, 266.4)), fill(WHITE, annulus(49.1, 52.7, 35.2, 29))]),
  "aoyama-okura-yama": svg("samurai", "aoyama-okura-yama", 100, 270.4, [fill(ASAGI, box(0, 0, 100, 270.4)), letter("山", WHITE, 43, 72.2, 44)]),
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
  ja: "描き起こす元になる現存の布はありません。図案と地の色は出典の記述に従い、縦横の比、色合い、各部の並びはこのパッケージのものなので、この絵は復元です。",
};

interface Entry { slug: string; group: "nobori" | "hata" | "uma"; en: string; ja: string; aboutEn: string; aboutJa: string; source: typeof UMA | typeof SANADA; noteEn?: string; noteJa?: string }
const ENTRIES: Entry[] = [
  { slug: "uesugi-tenshi", group: "hata", en: "Uesugi Kenshin: Tenshi no mihata", ja: "上杉謙信「天賜の御旗」", aboutEn: "A red disc on a dark blue ground (紺地朱の丸), the banner of Uesugi Kenshin that the source calls the Tenshi no mihata, the banner given by heaven.", aboutJa: "紺地に朱の丸。出典が「天賜の御旗」と呼ぶ、上杉謙信の旗です。", source: UMA, noteEn: "The source gives the disc and the ground only: the disc's size and place, the shade of the blue and the flag's proportions (3 to 2 here) are this package's." , noteJa: "出典が示すのは丸と地の色だけです。丸の大きさと位置、紺の色合い、旗の縦横の比（ここでは2対3）はこのパッケージのものです。" },
  { slug: "uesugi-ogi", group: "uma", en: "Uesugi Kenshin: the fan", ja: "上杉謙信の扇の馬印", aboutEn: "A fan with a red disc on a dark blue ground (紺地朱の丸扇), the uma-jirushi of Uesugi Kenshin.", aboutJa: "紺地に朱の丸のある扇。上杉謙信の馬印です。", source: UMA, noteEn: "The source names the fan, the red disc and the dark blue ground: the number of ribs, the fan's angle and the disc's place are this package's.", noteJa: "出典は扇、朱の丸、紺の地を挙げるだけです。親骨の数、扇の開き、丸の位置はこのパッケージのものです。" },
  { slug: "hojo-gosyoku", group: "nobori", en: "Hojo Ujiyasu: five-colour steps", ja: "北条氏康「五色段々」", aboutEn: "A banner of five bands in five colours (五色段々), the hata-jirushi of Hojo Ujiyasu.", aboutJa: "五色の段が重なる旗。北条氏康の旗印です。", source: UMA, noteEn: "The source gives the name and no colours or order: the five colours here are blue, yellow, red, white and black, the colours of the five phases, in that order, and the bands' equal widths and the banner's 1 to 4 proportions are this package's.", noteJa: "出典は名前だけで、色も順序も示しません。ここでは五行の色の青・黄・赤・白・黒をこの順に並べました。帯の幅を等しくしたことと、旗の縦横の比を4対1としたことも、このパッケージのものです。" },
  { slug: "date-daishihan", group: "hata", en: "Date Masamune: the large black banner", ja: "伊達政宗「黒の大四半」", aboutEn: "A large plain black banner (黒の大四半), the hata-jirushi of Date Masamune.", aboutJa: "黒一色の大きな旗（黒の大四半）。伊達政宗の旗印です。", source: UMA, noteEn: "The source gives the colour and that it is large: the proportions (5 to 7) are this package's, and the bird-feather ornament the source mentions with it is not drawn.", noteJa: "出典が示すのは色と大きさだけです。縦横の比（7対5）はこのパッケージのもので、出典が併せて挙げる鳥毛の飾りは描いていません。" },
  { slug: "toyotomi-gunbai", group: "uma", en: "Toyotomi Hideyoshi: the gold war fan", ja: "豊臣秀吉の金の軍配と朱の吹き流し", aboutEn: "A gold war fan (gunbai) with a red streamer (金の軍配に朱の吹き流し), the large uma-jirushi of Toyotomi Hideyoshi.", aboutJa: "金の軍配に朱の吹き流しを付けたもの。豊臣秀吉の大馬印です。", source: UMA, noteEn: "The source names a gold war fan and a red streamer: the shape of the fan, where the streamer hangs and its length are this package's.", noteJa: "出典は金の軍配と朱の吹き流しを挙げるだけです。軍配の形、吹き流しの付く位置と長さはこのパッケージのものです。" },
  { slug: "tokugawa-kinsen", group: "uma", en: "Tokugawa Ieyasu: the gold fan", ja: "徳川家康の金扇", aboutEn: "A gold fan (金扇), the large uma-jirushi of Tokugawa Ieyasu.", aboutJa: "金の扇。徳川家康の大馬印です。", source: UMA, noteEn: "The source names a gold fan only: the ribs, the fan's angle and its shades are this package's.", noteJa: "出典が挙げるのは金の扇だけです。親骨、扇の開き、色合いはこのパッケージのものです。" },
  { slug: "oda-karakasa", group: "uma", en: "Oda Nobunaga: the gold parasol", ja: "織田信長の金塗りの唐傘", aboutEn: "A gold-lacquered parasol (金塗りの唐傘), the uma-jirushi of Oda Nobunaga.", aboutJa: "金塗りの唐傘。織田信長の馬印です。", source: UMA, noteEn: "The source names a gold-lacquered parasol only: its shape, ribs and shades are this package's.", noteJa: "出典が挙げるのは金塗りの唐傘だけです。形、骨、色合いはこのパッケージのものです。" },
  { slug: "sanada-rokumonsen", group: "nobori", en: "Sanada: the six-coin nobori", ja: "真田の六連銭の幟", aboutEn: "An all-red nobori with the six-coin crest (六連銭), the Sanada clan's battle banner.", aboutJa: "総赤の幟に六連銭の紋を付けたもの。真田氏の戦場の旗印です。", source: SANADA, noteEn: "The source says the nobori is all red with the six-coin crest, of unclear use, and names no collection: the two rows of three coins, their gold colour, and the 1 to 4 proportions are this package's. The Sanada flag the Osaka screen shows has no crest and is not drawn.", noteJa: "出典は、総赤の幟に六連銭の紋があること、使われ方が不明であること、所蔵先が示されていないことを述べます。3枚ずつ2段の銭、金色、4対1の縦横の比はこのパッケージのものです。大坂の屏風に描かれた真田の旗は紋がなく、描いていません。" },
  { slug: "ii-igeta", group: "hata", en: "Ii Naomasa: the gold well-curb", ja: "井伊直政の赤地に金の井桁", aboutEn: "A gold well-curb (井桁) on a red ground (赤地に金の井桁), the matoi standard of Ii Naomasa, whose troops were known for their red.", aboutJa: "赤地に金の井桁。赤で知られた井伊直政の隊の纏です。", source: UMA, noteEn: "The source names the red ground and the gold well-curb on the standard: the curb's proportions, the shades and the square shape are this package's.", noteJa: "出典は、纏の赤い地と金の井桁を挙げるだけです。井桁の寸法、色合い、正方形の形はこのパッケージのものです。" },
];

// The handscroll: one page of the National Diet Library for each frame of scroll 1 that a banner is drawn from.
// The National Diet Library's page of each scroll of the six.
const SCROLL_PID: Record<number, string> = { 1: "1286895", 2: "1288242" };
const BOOK = (frame: number, says: string, scroll: number) =>
  ({
    title: `御馬印 巻${scroll} (Go-umajirushi, scroll ${scroll} of six), around the Kan'ei years (NDL's estimate), National Diet Library, call number WA8-7`,
    url: `https://dl.ndl.go.jp/pid/${SCROLL_PID[scroll]}/1/${frame}`,
    kind: "official",
    read: "2026-11-26",
    says,
  }) as const;
const bookNote = (frame: number, lettered: boolean, scroll: number) => ({
  en: `Drawn from frame ${frame} of the handscroll 御馬印, scroll ${scroll} of six, from around the Kan'ei years (NDL's estimate), at the National Diet Library (public domain). The cloth's proportions and the place and size of its parts are measured from the painting; the shades are this package's reading of it, and the loops that hold the cloth to the pole, the pole and any finial are not drawn.${lettered ? " The character is lettered in Yuji Syuku (Kinuta Font Factory, SIL Open Font License 1.1), not traced from the page, so its brush is the font's and not the painter's." : ""}`,
  ja: `国立国会図書館の絵巻『御馬印』巻${scroll}（6巻のうちの1巻。寛永年間ごろ、国立国会図書館の推定。保護期間満了）のコマ${frame}から描きました。布の縦横の比と、図柄の位置と大きさは絵から測り、色合いはこのパッケージが絵から読み取ったものです。布を竿に留める輪、竿、竿の先の飾りは描いていません。${lettered ? "文字は絵から写したものではなく、Yuji Syuku（Kinuta Font Factory、SIL Open Font License 1.1）の字形で書いたので、筆づかいは絵とは違います。" : ""}`,
});

interface BookEntry { slug: string; group: "nobori" | "hata" | "uma"; scroll?: 2; frame: number; en: string; ja: string; aboutEn: string; aboutJa: string; says: string; lettered?: true; noteEn?: string; noteJa?: string }
const BOOK_ENTRIES: BookEntry[] = [
  { slug: "taitokuin-go", group: "hata", frame: 8, en: "Taitoku-in (Tokugawa Hidetada): the banner with 五", ja: "台徳院（徳川秀忠）の五の字の旗", aboutEn: "A black banner with the character 五 (five) in white, in the handscroll's section for 台徳院様, the second Tokugawa shogun.", aboutJa: "黒地に白で「五」の字を書いた旗。絵巻の「台徳院様」（二代将軍、徳川秀忠）の段にあります。", says: "In the section for 台徳院様 (Taitoku-in, Tokugawa Hidetada), a black banner with the character 五 in white.", lettered: true, noteEn: "The painting shows a square of a slightly deeper black round the character; it is not drawn.", noteJa: "絵では字のまわりに少し濃い黒の四角がありますが、描いていません。" },
  { slug: "mito-kinmaru", group: "hata", frame: 11, en: "The Lord of Mito: black with a gold disc", ja: "水戸中納言の黒地に金の丸の旗", aboutEn: "A black banner with a gold disc, in the handscroll's section for 水戸中納言様, the head of the Mito branch of the Tokugawa.", aboutJa: "黒地に金の丸の旗。絵巻の「水戸中納言様」（徳川家の水戸家の当主）の段にあります。", says: "In the section for 水戸中納言様 (the Lord of Mito), two black banners with a gold disc." },
  { slug: "echizen-hinomaru", group: "uma", frame: 14, en: "The Lord of Echizen: the large uma-jirushi, a red disc on white", ja: "越前宰相の白地に朱の丸の大馬印", aboutEn: "A white banner with a vermilion disc, labelled 大馬しるし (the large uma-jirushi) in the handscroll's section for 越前宰相殿, the lord of Echizen.", aboutJa: "白地に朱の丸の旗。絵巻の「越前宰相殿」（越前の殿様）の段で「大馬しるし」と書かれています。", says: "In the section for 越前宰相殿 (the Lord of Echizen), a white banner with a vermilion disc, labelled 大馬しるし." },
  { slug: "hoshina-higo-kuroboshi", group: "nobori", frame: 14, en: "Hoshina Higo: pale blue with twenty-seven black dots", ja: "保科肥後の浅葱地に黒の丸の幟", aboutEn: "A pale blue nobori with three blocks of nine black dots, in the handscroll's section for 保科肥後殿, Hoshina, titled Higo-no-kami.", aboutJa: "浅葱色の地に、黒い丸を九つずつの組にして三組並べた幟。絵巻の「保科肥後殿」の段にあります。", says: "In the section for 保科肥後殿 (Hoshina, titled Higo-no-kami), a pale blue nobori with three blocks of nine black dots." },
  { slug: "sakai-kunai-mitsumaru", group: "nobori", frame: 19, en: "Sakai Kunai: three red discs on white", ja: "酒井宮内の白地に朱の丸三つの幟", aboutEn: "A white nobori with three vermilion discs, in the handscroll's section for 酒井宮内.", aboutJa: "白地に朱の丸を三つ縦に並べた幟。絵巻の「酒井宮内」の段にあります。", says: "In the section for 酒井宮内 (Sakai Kunai), a white nobori with three vermilion discs under a white streamer.", noteEn: "The white streamer above it, with its own small disc, is not drawn.", noteJa: "上に付く、小さな丸のある白い吹き流しは描いていません。" },
  { slug: "sakai-kunai-hinomaru", group: "hata", frame: 19, en: "Sakai Kunai: a red disc on white", ja: "酒井宮内の白地に朱の丸の旗", aboutEn: "A square white banner with a large vermilion disc, in the handscroll's section for 酒井宮内.", aboutJa: "白地に大きな朱の丸の、正方形に近い旗。絵巻の「酒井宮内」の段にあります。", says: "In the section for 酒井宮内 (Sakai Kunai), a square white banner with a large vermilion disc." },
  { slug: "sakai-kunai-kinmaru", group: "hata", frame: 20, en: "Sakai Kunai: a gold disc on pale blue", ja: "酒井宮内の浅葱地に金の丸の旗", aboutEn: "A pale blue banner with a gold disc, in the handscroll's section for 酒井宮内.", aboutJa: "浅葱色の地に金の丸の旗。絵巻の「酒井宮内」の段にあります。", says: "In the section for 酒井宮内 (Sakai Kunai), continued on this frame, a pale blue banner with a gold disc." },
  { slug: "uesugi-danjo-kinmaru", group: "uma", frame: 20, en: "Uesugi Danjō: the large uma-jirushi, a gold disc on black", ja: "上杉弾正の黒地に金の丸の大馬印", aboutEn: "A black banner with a gold disc, labelled 大馬しるし (the large uma-jirushi) in the handscroll's section for 上杉弾正, the Uesugi lord of Yonezawa.", aboutJa: "黒地に金の丸の旗。絵巻の「上杉弾正」（米沢の上杉家）の段で「大馬しるし」と書かれています。", says: "In the section for 上杉弾正 (Uesugi Danjō), a black banner with a gold disc, labelled 大馬しるし." },
  { slug: "uesugi-danjo-bi", group: "uma", frame: 20, en: "Uesugi Danjō: the small uma-jirushi with 毘", ja: "上杉弾正の毘の字の小馬印", aboutEn: "A white banner with the character 毘 (for Bishamonten, the god of war the Uesugi revered) in black, labelled 小馬しるし (the small uma-jirushi) in the handscroll's section for 上杉弾正.", aboutJa: "白地に黒で「毘」（上杉家があつく信じた毘沙門天の頭の字）を書いた旗。絵巻の「上杉弾正」の段で「小馬しるし」と書かれています。", says: "In the section for 上杉弾正 (Uesugi Danjō), a white banner with the character 毘 in black, labelled 小馬しるし.", lettered: true, noteEn: "The painted character is the variant 毗 (異体字, U+6BD7), its two parts side by side; the font has no 毗, so it is lettered as 毘, its parts one above the other.", noteJa: "絵の字は異体字の「毗」で、二つの部分を横に並べた字ですが、フォントに「毗」がないので「毘」で書きました。" },
  { slug: "todo-izumi-mitsumaru", group: "nobori", frame: 22, en: "Tōdō Izumi: three white discs on black", ja: "藤堂和泉守の黒地に白の丸三つの幟", aboutEn: "A black nobori with three white discs, in the handscroll's section for 藤堂和泉守, Tōdō of Tsu, titled Izumi-no-kami.", aboutJa: "黒地に白の丸を三つ縦に並べた幟。絵巻の「藤堂和泉守」（津の藤堂家）の段にあります。", says: "In the section for 藤堂和泉守 (Tōdō of Tsu, titled Izumi-no-kami), a black nobori with three white discs." },
  { slug: "honda-mino-hon", group: "nobori", frame: 24, en: "Honda Mino: the nobori with 本", ja: "本多美濃守の本の字の幟", aboutEn: "A white nobori with a black band across it and the character 本 (the first of the name Honda) in black above, in the handscroll's section for 本多美濃守, Honda, titled Mino-no-kami.", aboutJa: "白地に黒い帯を横に一本入れ、上に黒で「本」（本多の頭の字）を書いた幟。絵巻の「本多美濃守」の段にあります。", says: "In the section for 本多美濃守 (Honda, titled Mino-no-kami), a white nobori with a black band across it and the character 本 in black above.", lettered: true },
  { slug: "honda-mino-kin-obi", group: "hata", frame: 24, en: "Honda Mino: a gold band on black", ja: "本多美濃守の黒地に金の帯の旗", aboutEn: "A black banner with a gold band across it, in the handscroll's section for 本多美濃守, Honda, titled Mino-no-kami.", aboutJa: "黒地に金の帯を横に一本入れた旗。絵巻の「本多美濃守」の段にあります。", says: "In the section for 本多美濃守 (Honda, titled Mino-no-kami), a black banner with a gold band across it." },
  { slug: "ii-kamon-aka-nobori", group: "nobori", frame: 25, en: "Ii Kamon: the plain red nobori", ja: "井伊掃部頭の朱一色の幟", aboutEn: "A plain vermilion nobori, in the handscroll's section for 井伊掃部頭, Ii, titled Kamon-no-kami.", aboutJa: "朱一色の幟。絵巻の「井伊掃部頭」の段にあります。", says: "In the section for 井伊掃部頭 (Ii, titled Kamon-no-kami), a plain vermilion nobori under a vermilion streamer.", noteEn: "The streamer above it is not drawn.", noteJa: "上に付く朱の吹き流しは描いていません。" },
  { slug: "ii-kamon-aka-hata", group: "hata", frame: 25, en: "Ii Kamon: the plain red banner", ja: "井伊掃部頭の朱一色の旗", aboutEn: "A plain vermilion banner, nearly square, in the handscroll's section for 井伊掃部頭, Ii, titled Kamon-no-kami.", aboutJa: "朱一色の、正方形に近い旗。絵巻の「井伊掃部頭」の段にあります。", says: "In the section for 井伊掃部頭 (Ii, titled Kamon-no-kami), a plain vermilion banner, nearly square.", noteEn: "The painting shows a seam down the middle as a dashed line; it is not drawn.", noteJa: "絵では真ん中の縫い目を点線で描いていますが、描いていません。" },
  { slug: "koide-yamato-naname", group: "nobori", frame: 27, en: "Koide Yamato: white and black, parted on a slant", ja: "小出大和守の白と黒の斜め分けの幟", aboutEn: "A white nobori whose lower part is black, parted from the white on a slant, in the handscroll's section for 小出大和守, Koide, titled Yamato-no-kami.", aboutJa: "白地で、下の部分を斜めに分けて黒くした幟。絵巻の「小出大和守」の段にあります。", says: "In the section for 小出大和守 (Koide, titled Yamato-no-kami), a white nobori whose lower part is black, parted on a slant, under a white streamer.", noteEn: "The streamer above it is not drawn.", noteJa: "上に付く白い吹き流しは描いていません。" },
  { slug: "koide-yamato-hinomaru", group: "hata", frame: 27, en: "Koide Yamato: a red disc on white", ja: "小出大和守の白地に朱の丸の旗", aboutEn: "A white banner with a vermilion disc, in the handscroll's section for 小出大和守, Koide, titled Yamato-no-kami.", aboutJa: "白地に朱の丸の旗。絵巻の「小出大和守」の段にあります。", says: "In the section for 小出大和守 (Koide, titled Yamato-no-kami), a white banner with a vermilion disc." },
  { slug: "terazawa-shima-mitsumaru", group: "nobori", frame: 28, en: "Terazawa Shima: three black discs on white", ja: "寺沢志摩守の白地に黒の丸三つの幟", aboutEn: "A white nobori with three black discs, in the handscroll's section for 寺澤志摩守, Terazawa, titled Shima-no-kami.", aboutJa: "白地に黒の丸を三つ縦に並べた幟。絵巻の「寺沢志摩守」の段にあります。", says: "In the section for 寺澤志摩守 (Terazawa, titled Shima-no-kami), a white nobori with three black discs." },
  { slug: "sanada-kawachi-rokumonsen", group: "uma", frame: 29, en: "Sanada Kawachi: the large uma-jirushi, six coins on black", ja: "真田河内守の黒地に六連銭の大馬印", aboutEn: "A black banner with six white coins in two rows of three (the Sanada six-coin crest, 六連銭), labelled 大馬しるし (the large uma-jirushi) in the handscroll's section for 真田河内守, Sanada, titled Kawachi-no-kami.", aboutJa: "黒地に白い銭を三つずつ二段に並べた旗（真田家の六連銭）。絵巻の「真田河内守」の段で「大馬しるし」と書かれています。", says: "In the section for 真田河内守 (Sanada, titled Kawachi-no-kami), a black banner with six white coins in two rows of three, labelled 大馬しるし.", noteEn: "Each coin is drawn as painted: a white disc with a thin black circle inside it and its square hole outlined, black at the centre. The thin white lines the painting shows down the black cloth, its seams, are not drawn.", noteJa: "銭は絵のとおり、白い円の中に細い黒い円と、線で囲んだ四角い穴（真ん中は黒）を描きました。黒い布に縦に入る細い白い線（縫い目）は描いていません。" },
  { slug: "sanada-kawachi-aka-obi", group: "nobori", frame: 29, en: "Sanada Kawachi: a red band on white", ja: "真田河内守の白地に朱の帯の幟", aboutEn: "A white nobori with a vermilion band across its middle, in the handscroll's section for 真田河内守, Sanada, titled Kawachi-no-kami.", aboutJa: "白地の真ん中に朱の帯を横に一本入れた幟。絵巻の「真田河内守」の段にあります。", says: "In the section for 真田河内守 (Sanada, titled Kawachi-no-kami), a white nobori with a vermilion band across its middle." },
  { slug: "koriki-settsu-shiromaru", group: "nobori", frame: 30, en: "Kōriki Settsu: a white disc on black", ja: "高力摂津守の黒地に白の丸の幟", aboutEn: "A black nobori with a white disc near its top, in the handscroll's section for 高力摂津守, Kōriki, titled Settsu-no-kami.", aboutJa: "黒地の上のほうに白の丸を一つ入れた幟。絵巻の「高力摂津守」の段にあります。", says: "In the section for 高力摂津守 (Kōriki, titled Settsu-no-kami), a black nobori with a white disc near its top, under a vermilion streamer.", noteEn: "The streamer above it is not drawn.", noteJa: "上に付く朱の吹き流しは描いていません。" },
  { slug: "matsudaira-shimosa-kinbishi", group: "nobori", frame: 34, en: "Matsudaira Shimōsa: a gold lozenge on black", ja: "松平下総守の黒地に金の菱の幟", aboutEn: "A black nobori with a gold lozenge, black in its middle, in the handscroll's section for 松平下総守, Matsudaira, titled Shimōsa-no-kami.", aboutJa: "黒地に、金の縁の菱（中は黒）を一つ入れた幟。絵巻の「松平下総守」の段にあります。", says: "In the section for 松平下総守 (Matsudaira, titled Shimōsa-no-kami), a black nobori with a gold lozenge, black in its middle." },
  { slug: "matsudaira-shimosa-kinbishi-hata", group: "hata", frame: 35, en: "Matsudaira Shimōsa: a gold lozenge on black, the banner", ja: "松平下総守の黒地に金の菱の旗", aboutEn: "A black banner with a gold lozenge, black in its middle, in the handscroll's section for 松平下総守, Matsudaira, titled Shimōsa-no-kami.", aboutJa: "黒地に、金の縁の菱（中は黒）を一つ入れた旗。絵巻の「松平下総守」の段にあります。", says: "In the section for 松平下総守 (Matsudaira, titled Shimōsa-no-kami), continued on this frame, a black banner with a gold lozenge, black in its middle." },
  { slug: "ogasawara-ukon-sangaibishi", group: "uma", frame: 36, en: "Ogasawara Ukon: the large uma-jirushi, three stacked lozenges", ja: "小笠原右近大夫の黒地に三階菱の大馬印", aboutEn: "A black banner with three white lozenges stacked one on another (三階菱, the Ogasawara crest), labelled 大馬しるし (the large uma-jirushi) in the handscroll's section for 小笠原右近大夫, Ogasawara, titled Ukon-no-taifu.", aboutJa: "黒地に白い菱を三つ重ねた旗（小笠原家の三階菱）。絵巻の「小笠原右近大夫」の段で「大馬しるし」と書かれています。", says: "In the section for 小笠原右近大夫 (Ogasawara, titled Ukon-no-taifu), a black banner with three white lozenges stacked one on another, labelled 大馬しるし.", noteEn: "Each of the three lozenges is measured from the painting, where they stand a little askew, and they are drawn so; how far each one hides the one above it is this package's.", noteJa: "三つの菱は、それぞれ絵から測りました。絵では少しずれて重なっているので、ここでもそのとおりに描きました。どこまで重なるかは、このパッケージのものです。" },
  { slug: "matsudaira-tanba-kuro-obi", group: "nobori", frame: 37, en: "Matsudaira Tanba: six black bands on white", ja: "松平丹波守の白地に黒の帯六つの幟", aboutEn: "A white nobori with six black bands across it, in the handscroll's section for 松平丹波守, Matsudaira, titled Tanba-no-kami.", aboutJa: "白地に黒の帯を横に六本入れた幟。絵巻の「松平丹波守」の段にあります。", says: "In the section for 松平丹波守 (Matsudaira, titled Tanba-no-kami), a white nobori with six black bands across it, with a gold ball on its pole.", noteEn: "The gold ball on its pole is not drawn.", noteJa: "竿の先の金の玉は描いていません。" },
  { slug: "sakai-uta-shiromaru", group: "hata", frame: 31, en: "Sakai Uta: a white disc on black", ja: "酒井雅楽頭の黒地に白の丸の旗", aboutEn: "A black banner with a white disc, in the handscroll's section for 酒井雅楽頭, Sakai, titled Uta-no-kami.", aboutJa: "黒地に白の丸の旗。絵巻の「酒井雅楽頭」の段にあります。", says: "In the section for 酒井雅楽頭 (Sakai, titled Uta-no-kami), a black banner with a white disc." },
  { slug: "sakai-awa-inazuma", group: "nobori", frame: 32, en: "Sakai Awa: two gold zigzags on black", ja: "酒井阿波守の黒地に金の稲妻の幟", aboutEn: "A black nobori with two gold zigzag lines (lightning, 稲妻) down it, in the handscroll's section for 酒井阿波守, Sakai, titled Awa-no-kami.", aboutJa: "黒地に、金のぎざぎざの線（稲妻）を二本、縦に入れた幟。絵巻の「酒井阿波守」の段にあります。", says: "In the section for 酒井阿波守 (Sakai, titled Awa-no-kami), a black nobori with two gold zigzag lines down it.", noteEn: "The zigzags' turns are measured from the painting; there the cloth leans a little to the right towards its foot, which is not drawn.", noteJa: "ぎざぎざの曲がり目は絵から測りました。絵では布が下へ行くほど少し右へ寄っていますが、それは描いていません。" },
  { slug: "matsudaira-kai-janome", group: "hata", scroll: 2, frame: 7, en: "Matsudaira Kai: a red ring and disc on white", ja: "松平甲斐守の白地に朱の蛇の目の旗", aboutEn: "A white banner with a vermilion ring and a vermilion disc inside it, in the handscroll's section for 松平甲斐守, Matsudaira, titled Kai-no-kami.", aboutJa: "白地に、朱の輪とその中の朱の丸を入れた旗（蛇の目）。絵巻の「松平甲斐守」の段にあります。", says: "In the section for 松平甲斐守 (Matsudaira, titled Kai-no-kami), a white banner with a vermilion ring and a vermilion disc inside it.", noteEn: "The thin lines the painting draws round the white ring and the inner disc are not drawn.", noteJa: "絵で白い輪と中の丸を囲む細い線は描いていません。" },
  { slug: "matsudaira-kai-kin", group: "hata", scroll: 2, frame: 7, en: "Matsudaira Kai: the plain gold banner", ja: "松平甲斐守の金一色の旗", aboutEn: "A plain gold banner, in the handscroll's section for 松平甲斐守, Matsudaira, titled Kai-no-kami.", aboutJa: "金一色の旗。絵巻の「松平甲斐守」の段にあります。", says: "In the section for 松平甲斐守 (Matsudaira, titled Kai-no-kami), a plain gold banner." },
  { slug: "matsudaira-echigo-naname", group: "hata", scroll: 2, frame: 9, en: "Matsudaira Echigo: a gold band on red, on a slant", ja: "松平越後守の朱地に金の斜めの帯の旗", aboutEn: "A vermilion banner with a gold band across it on a slant, from the top of the pole side to the foot of the free side, in the handscroll's section for 松平越後守, Matsudaira, titled Echigo-no-kami.", aboutJa: "朱地に、金の帯を右上から左下へ斜めに入れた旗。絵巻の「松平越後守」の段にあります。", says: "In the section for 松平越後守 (Matsudaira, titled Echigo-no-kami), continued on this frame, a vermilion banner with a gold band across it on a slant." },
  { slug: "matsudaira-yamashiro-kuyo", group: "hata", scroll: 2, frame: 11, en: "Matsudaira Yamashiro: nine white discs on red", ja: "松平山城守の朱地に白の九曜の旗", aboutEn: "A vermilion banner with nine white discs, one in the middle and eight round it (九曜), in the handscroll's section for 松平山城守, Matsudaira, titled Yamashiro-no-kami.", aboutJa: "朱地に、白の丸を真ん中に一つ、まわりに八つ並べた旗（九曜）。絵巻の「松平山城守」の段にあります。", says: "In the section for 松平山城守 (Matsudaira, titled Yamashiro-no-kami), continued on this frame, a vermilion banner with nine white discs, one in the middle and eight round it." },
  { slug: "matsudaira-yamashiro-kinwa", group: "hata", scroll: 2, frame: 11, en: "Matsudaira Yamashiro: a gold ring on black", ja: "松平山城守の黒地に金の輪の旗", aboutEn: "A black banner with a gold ring, in the handscroll's section for 松平山城守, Matsudaira, titled Yamashiro-no-kami.", aboutJa: "黒地に金の輪の旗。絵巻の「松平山城守」の段にあります。", says: "In the section for 松平山城守 (Matsudaira, titled Yamashiro-no-kami), continued on this frame, a black banner with a gold ring." },
  { slug: "matsudaira-dewa-shiromaru", group: "hata", scroll: 2, frame: 12, en: "Matsudaira Dewa: a large white disc on black", ja: "松平出羽守の黒地に白の丸の旗", aboutEn: "A black banner with a large white disc, in the handscroll's section for 松平出羽守, Matsudaira, titled Dewa-no-kami.", aboutJa: "黒地に大きな白の丸の旗。絵巻の「松平出羽守」の段にあります。", says: "In the section for 松平出羽守 (Matsudaira, titled Dewa-no-kami), a black banner with a large white disc." },
  { slug: "matsudaira-dewa-shiromaru-nobori", group: "nobori", scroll: 2, frame: 12, en: "Matsudaira Dewa: a white disc on black, the nobori", ja: "松平出羽守の黒地に白の丸の幟", aboutEn: "A black nobori with a white disc near its top, in the handscroll's section for 松平出羽守, Matsudaira, titled Dewa-no-kami.", aboutJa: "黒地の上のほうに白の丸を一つ入れた幟。絵巻の「松平出羽守」の段にあります。", says: "In the section for 松平出羽守 (Matsudaira, titled Dewa-no-kami), a black nobori with a white disc near its top." },
  { slug: "okubo-kaga-shirowa", group: "nobori", scroll: 2, frame: 14, en: "Ōkubo Kaga: a white ring on black", ja: "大久保加賀守の黒地に白の輪の幟", aboutEn: "A black nobori with a white ring near its top, in the handscroll's section for 大久保加賀守, Ōkubo, titled Kaga-no-kami.", aboutJa: "黒地の上のほうに白の輪を一つ入れた幟。絵巻の「大久保加賀守」の段にあります。", says: "In the section for 大久保加賀守 (Ōkubo, titled Kaga-no-kami), a black nobori with a white ring near its top." },
  { slug: "aoyama-okura-yama", group: "nobori", scroll: 2, frame: 15, en: "Aoyama Ōkura: the nobori with 山", ja: "青山大蔵少輔の浅葱地に白の山の字の幟", aboutEn: "A pale blue nobori with the character 山 (the second of the name Aoyama) in white, in the handscroll's section for 青山大蔵少輔, Aoyama, titled Ōkura-no-shō.", aboutJa: "浅葱色の地に、白で「山」（青山の「山」）を書いた幟。絵巻の「青山大蔵少輔」の段にあります。", says: "In the section for 青山大蔵少輔 (Aoyama, titled Ōkura-no-shō), a pale blue nobori with the character 山 in white.", lettered: true, noteEn: "The painting draws the character's edge with a thin dark line; it is not drawn.", noteJa: "絵では字のふちを細い黒い線で囲んでいますが、それは描いていません。" },
];

const samuraiRecords = (): DrawnDrawing[] => [
  ...ENTRIES.map((entry): DrawnDrawing => ({
    id: `samurai:${entry.slug}`,
    group: entry.group,
    name: { en: entry.en, ja: entry.ja },
    about: { en: entry.aboutEn, ja: entry.aboutJa },
    status: "reconstruction",
    dates: null,
    note: { en: `${entry.noteEn ?? ""} ${NOTE_BASE.en}`.trim(), ja: `${entry.noteJa ?? ""}${NOTE_BASE.ja}` },
    source: entry.source,
    svg: SHAPES[entry.slug]!,
  })),
  ...BOOK_ENTRIES.map((entry): DrawnDrawing => {
    const base = bookNote(entry.frame, entry.lettered === true, entry.scroll ?? 1);

    return {
      id: `samurai:${entry.slug}`,
      group: entry.group,
      name: { en: entry.en, ja: entry.ja },
      about: { en: entry.aboutEn, ja: entry.aboutJa },
      status: "documented",
      dates: null,
      note: { en: `${base.en}${entry.noteEn === undefined ? "" : ` ${entry.noteEn}`}`, ja: `${base.ja}${entry.noteJa ?? ""}` },
      source: BOOK(entry.frame, entry.says, entry.scroll ?? 1),
      svg: SHAPES[entry.slug]!,
    };
  }),
];

const files = (): Map<string, string> => setFiles("samurai", "SAMURAI", "SamuraiRecordId", "scripts/draw-samurai.ts", samuraiRecords());

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  writeSetFiles(fileURLToPath(new URL("../src/sets", import.meta.url)), "samurai", files());
  console.log(`wrote src/sets/samurai.data.ts and samurai/: ${samuraiRecords().length} drawings`);
}

export { samuraiRecords, files as samuraiFiles };
