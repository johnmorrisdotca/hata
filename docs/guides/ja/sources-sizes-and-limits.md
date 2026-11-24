---
title: 出どころ・大きさ・限界・旗の記録
section: explanation
order: 5
description: 旗の絵の選び方と検査、各集まりの重さ、収録しないもの、旗の記録のすべての項目を説明します。
---

## 旗の出どころ

1. **Wikidataが、それぞれの国や地域の旗を示します**（P41、旗の画像）。CC0の記述で、優先されるものを使い、
   終わったものは除きます。選択肢が残るわずかな地域は `scripts/data-config.ts` が、理由つきで決めます。
   かつての国は記述がすべて終わっているので、そのCommonsのファイルを手で指定し、
   Wikidataの項目の旗の画像の1つであることを確かめています。
2. **Wikimedia Commonsに絵があります。** 旗の本来の縦横比で、たいていは政府の
   規格図から作られ、そのページに出典が示されています。`pnpm data:commons` が、ライセンス、作者、
   ライセンスのテンプレートとともに `data-sources/` へ取得し、SHA-256で検査します。
3. **旗のセットはそれと比べます**（`pnpm data:choose`、Chromiumで）：flag-icons、country-flag-icons、
   circle-flagsで、すべてMITです。ほかの集まりの絵が収録されるのは、旗の本来の縦横比で描かれ、
   同じ旗（同じ構成と色、ピクセルの0.5%以内）を描き、少なくとも10%小さいとき、
   またはCommonsの絵が自由に使えないときだけです。2026年10月9日には、Commonsの絵が462回、country-flag-iconsの絵が1回（イエメン、
   Commonsのファイルは CC BY-SA）選ばれました。集まりが違うデザイン（古い旗、地方旗、
   簡略化した紋章）を描いている場合は、その地域を調べて判断を書き残しています（[比較](../../compared.md)）。
4. **それぞれ最適化して検査します**（`pnpm data`）：SVGO 4、旗ごとに測った丸め、idの接頭辞、
   絵の外部を参照しうるものの拒否。そして `pnpm data:compare` が、すべての旗が幅960ピクセルで元の絵と0.1%以内のピクセルで描かれることを証明します。

収録するのは、パブリックドメイン、CC0、CC BY、MITの絵だけです。[来歴の一覧](../../provenance.md)には、
すべての旗のファイル、ライセンス、作者、理由があります。[旗のないコードの一覧](../../left-out.md)には、旗のない35のコードがあります。[判断の記録](../../decisions.md)には判断の分かれる点があり、
ライセンスのために除いた4つの旗、フランスのどの地域に旗があるか、ドイツとオーストリアの民間旗、
資料によってデザインが違う場合とそれぞれの推奨を含みます。[別の旗の一覧](../../variants.md)には、各地域の実際に使われているほかの旗があります。

## 大きさ

2026年10月9日に測定。SVGは収録されたままの大きさと、レベル9のgzip後の大きさです。

| 集まり | 旗 | SVG | gzip後 | 旗の中央値 |
| --- | --- | --- | --- | --- |
| Hata、国 | 238枚 | 1,997 KB | 669 KB | 562 B |
| Hata、日本の都道府県 | 45 | 24 KB | 14 KB | 456 B |
| Hata、カナダの州と準州 | 12 | 370 KB | 131 KB | 14 KB |
| Hata、アメリカの州と地域 | 50枚 | 4,854 KB | 1,767 KB | 85 KB |
| Hata、オーストラリアの州と準州 | 8 | 124 KB | 38 KB | 11 KB |
| Hata、イギリスの国 | 3 | 13 KB | 6 KB | 208 B |
| Hata、ドイツの州 | 16 | 228 KB | 79 KB | 312 B |
| Hata、フランスの地域（海外の地域は国のコードの旗） | 3枚 | 66 KB | 15 KB | 19 KB |
| Hata、スイスのカントン | 26 | 220 KB | 69 KB | 4 KB |
| Hata、オーストリアの州 | 6枚 | 1 KB | 1 KB | 171 B |
| Hata、ブラジルの州 | 27 | 510 KB | 145 KB | 935 B |
| Hata、枠のために作った絵（flag-iconsの4:3と正方形） | 425 | 2,792 KB | 935 KB | |
| flag-icons 7.5.0、4:3（切り抜きで、本来の縦横比ではない） | 271 | 1,955 KB | 651 KB | 804 B |
| country-flag-icons 1.6.20、3:2（簡略化） | 265 | 174 KB | 87 KB | 479 B |
| circle-flags 2.8.3（円） | 430 | 301 KB | 159 KB | 585 B |

国の旗は、本来の縦横比で、flag-iconsと同じ重さです。アメリカの州の旗はパッケージの大半を占めます。
完全な紋章を持つためです（バージニアは372 KB）。55の旗が40 KBの上限を超え、枠のために作った絵にも12あります。
[大きさの一覧](../../sizes.md)にあります。ページに加わるのは、importまたは読み込んだ旗の分だけです。

## 限界

| 限界 | 値 | 場所 |
| --- | --- | --- |
| 国 | Kuniに含まれる250か国のうち246 | `FLAG_CODES` |
| 地域 | 日本（47のうち45）、カナダ（13のうち13）、アメリカ（57のうち57）、オーストラリア（8のうち8）、イギリス（4のうち3）、ドイツ（16のうち16）、フランス（26のうち17）、スイス（26のうち26）、オーストリア（9のうち9）、ブラジル（27のうち27）の第1レベルの行政区画 | `FLAG_CODES` |
| かつての国 | 旗12、理由つきのコードがさらに10（オリンピックのチームと、旗が1つに決まらない2つ） | `FLAG_CODES`、`LEFT_OUT`、[かつての国の一覧](../../historical.md) |
| 旗のないコード | 35のコード、それぞれに理由 | `LEFT_OUT`、[旗のないコードの一覧](../../left-out.md) |
| ライセンス | パブリックドメイン、CC0、CC BY、MITのみ | `manifest(code).licence` |
| 最大の旗 | 372 KB（バージニア）、40 KBの上限を超えるものが55 | [大きさの一覧](../../sizes.md) |

収録しないもの：ほかの国の地域（理由は[判断の記録](../../decisions.md)にあります）、イギリスのカウンティ、市、まだ調べていない国の以前の旗、船舶旗、標旗、ラスター画像。旗のライセンスは絵についてのもので、国の旗や紋章を使うことは、その国の法律で制限される場合があります（Commonsはたいていの旗に「記章」の印を付けています）。[注意書き](https://github.com/johnmorrisdotca/hata/blob/main/NOTICE.md)が説明しています。

## 旗の記録

```ts no-check
interface FlagRecord {
  code: string;                   // "JP-13"
  source: "commons" | "flag-icons" | "country-flag-icons";
  file: string;                   // "Flag of Tokyo Metropolis.svg", or the set's path: "3x2/YE.svg"
  page: string;                   // the Commons page, or the set's file on jsDelivr
  version: string | null;         // the set's version; null for Commons
  wikidata: string;               // "Q1490": the item whose flag image (P41) names the file
  licence: { kind: "public-domain" | "cc0" | "cc-by" | "mit"; name: string; url: string | null };
  author: string | null;          // as Commons gives it, or the set's copyright line
  credit: string | null;
  attributionRequired: boolean;
  restrictions: string[];         // ["insignia"]: limits apart from copyright, as Commons notes them
  templates: string[];            // the licence templates on the Commons page: ["PD-Japan-organization", …]
  uploaded: string | null;        // when Commons' current version was uploaded
  fetched: string;                // when the package read Wikidata and Commons
  reference: { file: string; page: string; licence: string } | null;  // Commons' file, where a set's drawing won
  why: string;                    // why this drawing, in a sentence or two
  sameAs: string | null;          // "FR" for Guadeloupe: the flag whose picture this is
  width: number;                  // the viewBox: width / height is the flag's proportions
  height: number;
  bytes: number;                  // the SVG's size
  gzip: number;
  notes: string[];                // text drawn with a font, an embedded raster picture
  colours: { hex: string; share: number; name: string }[];  // "#bc002d", 0.1884, "red": measured from the drawing
  tags: { tag: string; source: string; from: string }[];  // docs/tags.md
  framings: Record<"4:3" | "1:1" | "round", Framing>;  // how each frame is made, and which crop: the `Framing` type
}
```

すべての関数は純粋で、返す記録はすべて凍結されています。関連：[資料とライセンスの情報を保つ](provenance.md)。
