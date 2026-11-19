---
title: 形式、大きさ、ライセンス
section: explanation
order: 3
description: Hataの旗が提供される形式のすべてと、その大きさ、描画のライセンスと、ライセンスごとの旗の数、そして旗を製品に使えるかどうかを示します。
---

## 形式と大きさ

1つの図を、次の形式で提供します。大きさは、`pnpm data`が作り、テストで確かめている[docs/sizes.md](../../sizes.md)のものです。パッケージに入っている最適化したSVGと、サーバーが送るときと同じgzipのレベル9の大きさです。

| 種類 | 得られるもの | 使い方 | 大きさ |
| --- | --- | --- | --- |
| SVGファイル | 旗ごとの`.svg`、`dist/svg/<code>.svg` | jsDelivrのアドレスには`flagUrl(code)`、自分のコピーには`flagUrl(code, { base })` | 旗の中央値は806 B。すべての旗で8890.7 KB（gzipで3081.6 KB）、国だけで2119.6 KB（gzipで725.0 KB） |
| モジュール | SVGの文字列。旗ごとに1つのモジュール | `import jp from "@johnmorrisdotca/hata/flags/jp"` | 同じバイト数。ページは、インポートした旗の分だけがページに加わります |
| 枠のためのモジュール | 4:3または正方形の枠のために作った図 | `@johnmorrisdotca/hata/flags/<code>.4x3`と`.1x1` | 429の図、2869.6 KB（gzipで957.8 KB） |
| 実行時にコードで | ページの動作中に選ぶ旗 | `/load`の`flag(code)`。その旗自身のファイルを1つ読み込みます | コードから旗を引く部分は25 KB、そのあとに旗 |
| データURI | `data:image/svg+xml`のアドレスにしたSVG。base64より小さい | `toDataUri(svg)`、`flagDataUri(code)` | SVGより少し大きい |
| 要素 | `<hata-flag code="JP-13" shape="round" size="48">` | `@johnmorrisdotca/hata/element/define` | 中核は12 KB（gzipで3.7 kB）で、旗は入っていません |
| フレームワークのコンポーネント | React・Vue・Svelte・React Native向けの型付きの`Flag` | `@johnmorrisdotca/hata/react`、`/vue`、`/svelte`、`/react-native` | 旗自身のモジュール |
| iframe | 1つの旗を描くページ | [埋め込みページ](embed-in-an-iframe.md) | 1ページと1つの旗 |
| 保存したファイル | SVG、選んだ大きさのPNG、旗の情報のJSON | デモの詳細パネル。求めたときにブラウザーで作られます（[ガイド](gallery-and-downloads.md)） | 求めに応じて作ります。PNGのファイルは同梱していません |
| CSSのクラス | `<span class="hata hata-jp">`。旗ごとのクラスと、枠のための`hata-4x3`・`hata-1x1`・`hata-round` | `@johnmorrisdotca/hata/css`、またはそのうちの1グループ（[ガイド](css-and-sprite.md)） | 479すべてで88.4 KB（gzipで8.4 KB）。旗は、ページが表示するときに読み込まれます |
| SVGスプライト | 旗ごとに`<symbol id="hata-jp">`を並べた1つのSVGファイル | `@johnmorrisdotca/hata/sheets`の`flagSprite(codes)`、またはデモのサイトにあるファイル | 国だけで2.1 MB、すべてで8.7 MB |
| 決まった幅のPNGやWebP | 旗ごとに、幅40〜1280 pxのファイルと、40〜320 pxの正方形・円形の枠に入れたファイル | `https://johnmorrisdotca.github.io/hata/raster/png/w160/jp.png`、[下](#決まった大きさの画像とzip) | npmパッケージには入っていません。すべての旗で、1つの幅につき0.2〜19.7 MB |
| zip | すべての旗のSVG、`manifest.json`、`LICENSES.md`、`NOTICE.md`、`LICENSE` | `https://johnmorrisdotca.github.io/hata/raster/hata-flags.zip` | 3.5 MB |

いちばん大きい旗は、出典が描いているとおりの紋章や印章を載せています。バージニア州は372.3 KBで、40 KBの予算を超える旗の一覧は[docs/sizes.md](../../sizes.md)にあります。小さくするために描き直すことはしません。

## 決まった大きさの画像とzip

SVGではなく画像がほしいページ、文書、ツールのために、すべての旗をPNGとWebPでも、決まった大きさで用意しています。デモのサイトを公開するたびに、パッケージ自身のSVGファイルから作ります。npmパッケージには入っていません（パッケージを小さく保つため、画像は1つも入れていません）。デモのサイトに、並べて置いてあります。

```text
https://johnmorrisdotca.github.io/hata/raster/<format>/<folder>/<code>.<format>
https://johnmorrisdotca.github.io/hata/raster/png/w160/jp.png          日本、幅160 px、高さ107 px
https://johnmorrisdotca.github.io/hata/raster/webp/round-80/ca-bc.webp   ブリティッシュコロンビア州、円形の枠、直径80 px
```

`w<width>`のフォルダーには、旗を本来の縦横比のまま、幅`<width>`ピクセルで入れてあります。高さは縦横比で決まります。`square-<size>`と`round-<size>`のフォルダーには、パッケージの1:1と円形の枠に入れたものがあります（`flag(code, { shape })`と同じ絵で、どの色も残る場合だけ切り抜いています）。縦横とも`<size>`ピクセルで、円形の四隅は透明です。ファイル名は小文字のコードです。どちらの形式も透明を保ち、WebPは劣化のない（ロスレス）形式なので、PNGと同じ絵がより少ないバイト数で済みます。

| 幅 | PNG、すべての旗 | PNG、中央値の旗 | WebP、すべての旗 | WebP、中央値の旗 | 使い道 |
| --- | --- | --- | --- | --- | --- |
| `w40` | 0.3 MB | 0.5 KB | 0.2 MB | 0.2 KB | 文章の行のそば、入力欄、ドロップダウンの選択肢 |
| `w80` | 0.6 MB | 1.0 KB | 0.3 MB | 0.4 KB | 高精細な画面のドロップダウン、一覧 |
| `w160` | 1.4 MB | 2.0 KB | 0.7 MB | 0.7 KB | カード、プロフィール |
| `w320` | 3.4 MB | 4.3 KB | 1.5 MB | 1.4 KB | スマートフォンの画面の幅いっぱい、バナー、スライド |
| `w1280` | 19.7 MB | 23.0 KB | 6.6 MB | 5.5 KB | ポスター、全画面、印刷 |
| `square-40`〜`square-320` | 0.4〜5.4 MB | 0.8〜6.2 KB | 0.2〜2.3 MB | 0.3〜2.0 KB | タイル、地図のマーカー、アイコン |
| `round-40`〜`round-320` | 0.6〜7.0 MB | 1.3〜9.9 KB | 0.3〜3.0 MB | 0.6〜3.6 KB | 丸いバッジ、プロフィール写真 |

大きさは、1.14.0のために作ったファイルのものです。ページで使えるならSVGを使ってください（大きい画像よりも小さく、どんな大きさでも鮮明です）。画像がほしいページにはWebP、WebPを読めないツール（Officeの文書、メール、古いアプリ）にはPNGを使ってください。数百ピクセルより大きくすると、出典が描いているとおりの紋章を載せた旗がいちばん重くなります。いちばん大きいPNGは308 KBです。

**`hata-flags.zip`**は、開発者ではない人が、すべての旗を1つのファイルでほしいときのものです。479のSVGすべて（`svg/`の中。ファイル名は小文字のコード）、`manifest.json`、`LICENSES.md`、`NOTICE.md`、`LICENSE`が入っています。

**ライセンスはファイルといっしょに届きます。** `https://johnmorrisdotca.github.io/hata/raster/LICENSES.md`（zipにも同じファイルが入っています）に、旗ごとに、Commonsのファイルとそのリンク、作者、ライセンス、クレジットが必要かどうか、正方形と円形の画像にflag-iconsがその枠のために描いた図（MIT。表記は`NOTICE.md`にあります）を使っているかどうかを載せています。画像は図のコピーなので、SVGと同じように、図のライセンスとクレジットが当てはまります。

`pnpm site`は`site/raster/`にそれらを作り、`pnpm rasters <folder>`は別の場所に作ります（1分ほど）。作るのに使う`@resvg/resvg-js`と`@jsquash/webp`は開発用の依存で、パッケージには入りません。

## ライセンス

パッケージのコードはMITです。旗はパッケージ自身の作品ではなく、それぞれがWikimedia Commonsにある描画で、Commonsがそのファイルについて示すライセンスのもとにあり、そのライセンスは旗に付随します。コードでは`manifest(code).licence`で読め、すべては[docs/provenance.md](../../provenance.md)にあります。そのうち、479の既定の図は次のとおりです：

| ライセンス | 旗の数 | しなければならないこと |
| --- | --- | --- |
| パブリックドメイン | 469 | 必要なことはありません。それでも、作者はマニフェストに残してあります |
| CC0 | 8 | 必要なことはありません |
| OGL-om 1.0 | 1（オマーン） | [NOTICE.md](../../../NOTICE.md)にあるクレジットを残してください |
| Copyrighted free use（著作権はあるが自由に使える） | 1（ミシシッピ州） | 権利者は、条件なしでどんな使い方も許しています。CC BYよりも自由です。[NOTICE.md](../../../NOTICE.md)にクレジットがあるので、残すと礼儀にかないます |
| CC BY 2.5 | 別の旗が1つ（サン・バルテルミーの地方旗、`BL--local`） | 作者を表示し、ライセンスへのリンクをつけ、図を変えたなら、その旨を明記してください。クレジットは[NOTICE.md](../../../NOTICE.md)にあります |

載せるのは、パブリックドメイン、CC0、CC BYの図だけです。上の2件は、例外として受け入れています（[判断の記録](../../decisions.md)）。CC BY-SA、GFDL、またはビルドが読める形でCommonsが示していないライセンスの旗は、除外して、理由とともに[docs/left-out.md](../../left-out.md)に載せています。Hataは、シェアアライクやGPLのものを載せません。

4:3と正方形の枠のための図は、flag-icons（MIT）のものです。ドキュメント、デモ、`/names`、要素にある国や地域の名前は、Kuni（MIT、Unicode-3.0、CC0）のものです。パッケージに入っている[NOTICE.md](../../../NOTICE.md)に、それらのライセンス表記があり、すべての入力データの出どころも記しています。

## 旗を製品に使えますか

上のライセンスは、描画を、有償でも無償でも、製品に使うことを認めています。パブリックドメイン、CC0、自由な使用は何も求めません。オマーンとCC BYの図はクレジットを求めます。そのクレジットの文面は、[NOTICE.md](../../../NOTICE.md)にあります。

これは描画のライセンスであって、答えのすべてではありません。国の法律が、その国の旗、紋章、印章の使い方を制限していることがあります。商品に使うこと、広告に使うこと、公式の承認を思わせる使い方、敬意を欠く使い方などです。Commonsは、このためにほとんどの旗に「Insignia」（記章）のタグをつけており、`manifest(code).restrictions`が、旗ごとにその注記を持っています。一部の国や地域では、法律で使い方が制限されている旗もあります。ドイツの1935年から1945年の旗は、歴史と教育のために載せてあり、通常の呼び出しではその図を返さず、歴史のページは名前を指定して求めます（[歴代の旗](historic-flags.md)）。Hataは、国の法律が認めない権利を与えることはできません。商品や広告に旗を載せる前に、確かめてください。
