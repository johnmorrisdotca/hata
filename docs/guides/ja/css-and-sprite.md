---
title: CSSのクラスとSVGスプライト
section: how-to
order: 24
description: 要素につけるクラスか、SVGスプライトで旗をページに載せ、ページで使う旗だけを取り込みます。
---

旗は、アイコン集のように中身のない要素につけるクラスにも、1つのSVGファイルの中のシンボルにもできます。どちらも旗を本来の縦横比のまま、引き伸ばさずに描き、パッケージ自身の図から作ります。`<hata-flag>`要素や`<img>`には要りません。すでに旗のクラスをスタイルに書いているページや、たくさんの旗を1つのファイルにしたいページのためのものです。

## 旗のクラス

スタイルシートには、旗ごとに`hata-`と小文字のコードのクラスがあり、みんなで使う`hata`というクラスが1つあります。中身のない要素に、両方をつけます。

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Hata classes from jsDelivr</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@johnmorrisdotca/hata@1/dist/css/hata.css" />
  </head>
  <body>
    <p style="font-size: 48px">
      <span class="hata hata-jp" role="img" aria-label="Japan"></span>
      <span class="hata hata-ca-bc hata-round" role="img" aria-label="British Columbia"></span>
    </p>
  </body>
</html>
```

| クラス | はたらき |
| --- | --- |
| `hata` | 高さ`1em`のインラインの箱で、旗を背景に描きます。幅は縦横比で決まります。大きさは`font-size`か`height`で変えます。 |
| `hata-<code>` | その旗。`hata-jp`、`hata-jp-13`、`hata-ca-bc`、`hata-us-tx`、かつての国なら`hata-suhh`。 |
| `hata-4x3`、`hata-1x1`、`hata-round` | その枠に入れた旗。`flag(code, { shape })`と同じ入れ方です。その枠のために作った図があればそれを、なければ旗ごとに測った側を残した切り抜きを、それも合わなければ旗の全体を使います（円形なら薄い灰色の円の上に置きます）。 |

クラスは絵を描くので、要素に`role="img"`をつけて`aria-label`に名前を書くか、そばの文章に名前を書いてください。クラスは`hata`で始まるので、移行のあいだflag-iconsのクラスと同じページに置けます（[flag-iconsからの移行](moving-to-hata.md#flag-iconsから)）。

## どのスタイルシートを使うか

スタイルシートは`url()`でSVGファイルを指すので、要素が表示したときに初めて、その旗を読み込みます。クラスは小さいのですが、旗は小さくありません（紋章のある旗は数百キロバイトです）。Viteやwebpackなどのバンドラーはスタイルシートがさす全ファイルをビルドにコピーします。そのため、グループごとのスタイルシートがあり、ページは表示するグループだけを使えます。

| 読み込み | クラス | 大きさ | gzip |
| --- | --- | --- | --- |
| `@johnmorrisdotca/hata/css` | 479すべて | 88.4 KB | 8.4 KB |
| `@johnmorrisdotca/hata/css/countries` | 246の国 | 60.2 KB | 5.4 KB |
| `@johnmorrisdotca/hata/css/former` | 12のかつての国 | 2.0 KB | 0.5 KB |
| `@johnmorrisdotca/hata/css/<country>-regions` | 1つの国の地域。`jp-regions`（45）、`ca-regions`（13）、`us-regions`（57）、`au`、`gb`、`de`、`fr`、`ch`、`at`、`br` | 1.1〜7.6 KB | 0.4〜1.2 KB |

```ts no-check
import "@johnmorrisdotca/hata/css/countries";
import "@johnmorrisdotca/hata/css/jp-regions";
```

CDNでは、同じファイルが`https://cdn.jsdelivr.net/npm/@johnmorrisdotca/hata@1/dist/css/<name>.css`にあり、その`url()`は、隣にあるSVGファイルを指します。旗をデータURLにして埋め込む方式だと、全体でgzip後に3 MBほどになります。ここでは8.4 KBと、ページが表示する旗だけです。

ページで使う旗だけにするには、その旗のスタイルシートを、自分のビルドか、コマンドラインで作ります（このリポジトリのチェックアウトで`pnpm install`のあと）。

```js
import { flagCss, flagSprite } from "@johnmorrisdotca/hata/sheets";

// The classes and the symbols of the flags a page uses, written to the files the page serves.
const css = await flagCss(["jp", "ca-bc"], { base: "/flags" });
const sprite = await flagSprite(["jp", "ca-bc"]);
console.log(css.includes(".hata-jp{"), sprite.includes('<symbol id="hata-ca-bc"'));
```

`base`は、自分のサイトでSVGファイルを置くフォルダー（`node_modules/@johnmorrisdotca/hata/dist/svg`のコピー）です。省略すると`../svg`です。コマンドラインでも同じことができます。`pnpm css --only jp,ca-bc --base /flags --out flags.css`と`pnpm sprite --only jp,ca-bc --out flags.svg`です。`--only`を省くと、すべての旗です。

## スプライト

スプライトは、旗ごとのシンボル（idは`hata-<code>`）を集めた1つのSVGファイルです。ページは`<use>`で描きます。

```html
<svg viewBox="0 0 3 2" width="48" role="img" aria-label="Japan"><use href="flags.svg#hata-jp"/></svg>
```

外側の`<svg>`には、旗の縦横比の`viewBox`（`/names`の`flagAspect(code)`で比がわかります。日本は3:2です）と幅を書きます。旗は引き伸ばされず、その中に収まります。ブラウザーは、スプライトのファイルを、ページと同じオリジンからしか読みません。そのためCDNのものは描けません。自分のサイトに置くか、シンボルの`<svg>`をページに書き込んでください。ほかの旗と同じ図を使う旗（フランス領ギアナの旗はフランスと同じ）は、スプライトに1回だけ書き、もう一方のシンボルがそれを使います。

上のグループごとのスプライトは、デモのサイトを公開するたびに作られ、`https://johnmorrisdotca.github.io/hata/sprite/<name>.svg`にあります（`countries`、`former`、`jp-regions`、`us-regions`などで、全部入りは`hata`です）。旗ごとに図をそのまま入れるので、大きくなります。

| ファイル | 大きさ | gzip |
| --- | --- | --- |
| `hata.svg`（479すべて） | 8.7 MB | 3.0 MB |
| `countries.svg` | 2.1 MB | 0.68 MB |
| `us-regions.svg` | 4.9 MB | 1.8 MB |
| `jp-regions.svg` | 22 KB | 8 KB |

ページで使う少しの旗のスプライトは、`flagSprite`で作れば、数キロバイトです。

## ライセンス

クラスもシンボルも、Commonsの図を、その旗のマニフェストが示すライセンス（`manifest(code).licence`と[形式、大きさ、ライセンス](formats-and-licences.md)）のもとで描きます。クレジットを求めるライセンスの旗を載せるページは、どの方法で描いても、そのクレジットが必要です。スタイルシートの1行目に、図ごとの出典、作者、ライセンスの置き場所を書いてあります。
