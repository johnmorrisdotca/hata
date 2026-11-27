---
title: Hataとほかの旗のセット
section: explanation
order: 2
description: Hataと、よく使われる7つの旗のセット、そしてTwemojiが、それぞれ何を収録し、どの形式で、どのライセンスで提供しているかを並べ、Hataにまだないものを示します。
---

旗のパッケージの多くは、同じ数百の旗を描いています。違いは、形、形式、コード、ライセンスにあります。このページでは、Hataを、よく使われる7つの旗のセット、そしてTwemojiと並べます。ほかのセットについて書いたことは、そのセット自身のREADMEによるものです。リンクは下の一覧にあり、2026-11-17に読みました。TwemojiのREADMEは2026-11-27に読みました。「READMEには書かれていない」は、書かれていないという意味であって、そのセットにその機能がないという意味ではありません。Hataについて書いたことは、[README](../../../README.md)とガイドによるもので、数字は、ドキュメントを検証するテストで確かめています。

対象のセット：[flag-icons](https://github.com/lipis/flag-icons)、[country-flag-icons](https://github.com/catamphetamine/country-flag-icons/blob/master/README.md)、[circle-flags](https://github.com/HatScripts/circle-flags/blob/gh-pages/README.md)、[react-world-flags](https://github.com/smucode/react-world-flags/blob/master/README.md)、[svg-country-flags](https://github.com/hampusborgos/country-flags/blob/main/README.md)（`country-flags`リポジトリ）、[world-flags-sprite](https://github.com/lafeber/world-flags-sprite/blob/master/README.md)、[flagpack-core](https://github.com/Yummygum/flagpack-core/blob/main/README.md)、[Twemoji](https://github.com/jdecked/twemoji/blob/master/README.md)。

## 何を収録しているか

| セット | READMEが述べる収録内容 | 形 |
| --- | --- | --- |
| hata | 519の旗：250か国のうち246か国、10か国の第1級行政区画、かつての国52か国、今もある一部の国の、日付つきの以前の旗 | 旗ごとの本来の縦横比、そして旗を引き伸ばさない4:3・正方形・円形の枠 |
| flag-icons | 「すべての国の旗をSVGで厳選して集めたもの。CSSつき」 | 4:3と、正方形版（`fis`） |
| country-flag-icons | ISO 3166-1のすべての国に加えて、`EU`、`IC`、`AC`、`TA`、`XK`、`XA`、`XO`、`XC`、`BQ-BO`、`BQ-SA`、`BQ-SE`、`GB-ENG`、`GB-NIR`、`GB-SCT`、`GB-WLS`、`ES-CT` | 3:2 |
| circle-flags | 「円形のSVGの国旗集」。READMEには`es-ib`（バレアレス諸島）や`aq-true_south`といった地域のファイルも書かれている | 円形 |
| react-world-flags | 「React用の世界の旗のSVG」 | READMEには書かれていない |
| svg-country-flags | 「世界のすべての旗の正確な描画」。2文字のコードで名づけられ、`GB-ENG`などもあり、コソボは`XK` | 描画のままのSVG。READMEには縦横比が書かれていない |
| world-flags-sprite | 「世界のすべての国の旗を1つのスプライトに」 | 1つのスプライト、クラス`f32` |
| flagpack-core | 「250以上の旗アイコン」。ISO 3166のすべての国に加えて、`BQ-SA`、`BQ-BO`、`BQ-SE`、`GB-ENG`、`GB-SCT`、`GB-WLS`、`GB-NIR` | READMEには書かれていない |
| twemoji | 一般交換に推奨されるUnicodeの絵文字。Twemoji v17.0はUnicode 17.0と絵文字17.0に従う。READMEは、そのうち旗が何枚かは書いていない | READMEは旗の縦横比を書いていない。既定の画像は72×72のPNGで、SVGはassetsのフォルダーにある |

## 旗をどう手に入れるか

| セット | 形式と使い方 | フレームワークのコンポーネント |
| --- | --- | --- |
| hata | 旗ごとのSVGファイル、SVGの文字列を持つモジュール、データURI、`<hata-flag>`要素、iframeのページ。デモはブラウザーでSVG・PNG・JSONを保存できる | 型付きのReact・Vue・Svelte・React Nativeのコンポーネント。そのほかには要素 |
| flag-icons | CSSのクラス（`.fi .fi-xx`）、SVGファイル、含める国を選べるSASS | READMEには書かれていない |
| country-flag-icons | SVGファイル、JavaScriptの文字列、SVGをデータURLとして埋め込んだCSSのクラス、Unicodeの絵文字。`hasFlag`と`countries` | すべての旗のReactコンポーネント。Vue 3向けは実験的 |
| circle-flags | `…/flags/xx.svg`という形のアドレスにあるSVGファイル | React、React Native / Expo、SolidJS向けの別パッケージ。READMEからリンクされている |
| react-world-flags | SVGをデータURIとして埋め込んだ`img`を描くReactコンポーネント | React。READMEによると、バンドルはgzipで約1.3 MBで、v2のベータ版を案内している |
| svg-country-flags | SVGファイルと、幅100・250・1000 pxのPNG。コードから名前へのJSON。ほかの幅を作るスクリプト | READMEには書かれていない |
| world-flags-sprite | 1つのCSSスプライト。`<li class="flag ar">` | READMEには書かれていない |
| flagpack-core | SVGファイル（旗ごとに1つずつインポートする）と、`countryCodeList.json` | React・Vue・Svelte向けの別パッケージ。READMEからリンクされている |
| twemoji | `twemoji.parse`が絵文字を画像に置き換える。既定は72×72のPNG。SVGは`svg`フォルダー | READMEには書かれていない |

## コード、名前、ライセンス

| セット | 受け付けるコード | 名前とデータ | READMEが述べるライセンス |
| --- | --- | --- | --- |
| hata | ISO 3166-1 alpha-2とISO 3166-2のコード（大小文字とアンダースコアの形は正規化される）と、かつての国の別名 | 英語と日本語の名前、そして旗ごとの出典、作者、ライセンス、縦横比、色、タグ | コードはMIT。旗は旗ごとのライセンス（パブリックドメイン、CC0、ほかにいくつか）で、一覧は[形式、大きさ、ライセンス](formats-and-licences.md)にある |
| flag-icons | alpha-2 | READMEには書かれていない | READMEには書かれていない |
| country-flag-icons | alpha-2 | READMEには書かれていない | READMEには書かれていない |
| circle-flags | alpha-2 | コントリビューター向けの、11色に固定されたパレット | MIT |
| react-world-flags | alpha-2、alpha-3、または数字のコード | READMEには書かれていない | READMEには書かれていない |
| svg-country-flags | alpha-2 | コードから国名へのJSON | 旗はパブリックドメインであり、旗の使い方にはほかの制限があるかもしれない、と書かれている |
| world-flags-sprite | alpha-2またはalpha-3 | READMEには書かれていない | READMEには書かれていない |
| flagpack-core | alpha-2 | `countryCodeList.json` | MIT |
| twemoji | READMEは国コードを書いていない | READMEには書かれていない | CC-BY 4.0 |

## ほかのREADMEに書かれていない、Hataにあるもの

- **旗ごとのライセンス、作者、出典**を旗と一緒に保ち、コードから読めます（`manifest(code)`）。ライセンスのページには、パッケージが載せられる旗だけがあります。
- **本来の縦横比と、引き伸ばさない枠。** 日本は2:3、カナダは1:2、スイスは正方形です。円の枠では、切り取ると色が失われる旗は、円のために描き直します。
- **見解が分かれる旗や別の旗を並べて**、それぞれに状態、日付、理由をつけています。35か国は、ある日の旗も取り出せます。
- **すべての旗の色とタグ。** 正確な16進値と、決まったタグの一覧で、それぞれに出典があります（`/search`、[色](colours.md)、[タグ](tags.md)）。
- **小さな中核。** メインのエントリーはgzipで4.0 kBしかなく、旗は入っていません。ページが読み込むのは、インポートした旗の分だけです。
- **ギャラリー、ビルダー、クイズ、ドキュメントサイト**は、英語と日本語で用意されています。
- **ほかに9つの言語の名前。** ページが払うのは1言語分だけになるよう、言語ごとに入口を分けました。`@johnmorrisdotca/hata/names/fr`、`/es`、`/de`、`/zh-Hans`、`/zh-Hant`、`/ko`、`/pt`、`/ar`、`/ru` です。名前は、Kuniが収録しているUnicode CLDRのものです。英語と日本語は、これまでどおり `/names` にあります。Kuniがその言語の名前を持たない場所は、そこでは名前がなく、null です。

## Hataにまだないもの、その理由

各行は、上のセットに対する不足、または旗のセットに求められることです。チケットは、ファミリーのボードにあります。READMEのRoadmapは、同じことを短く書いています。

| ないもの | どこにあるか | ここにない理由 | チケット |
| --- | --- | --- | --- |
| CSSのクラスと、1枚のスプライトシート（`fi-xx`形式） | flag-icons、country-flag-icons、world-flags-sprite | まだ作っていません。Hataが提供するのはSVGの文字列とファイルです | MODULES-1426 |
| 決まった幅のPNGやWebP、すべてをまとめたzip | svg-country-flags（PNG 100・250・1000 px） | デモはブラウザーでPNGを作ります。PNGのファイルは配布していません | MODULES-1427 |
| alpha-3、数字コード、絵文字での指定と`flagEmoji` | react-world-flags、world-flags-sprite、country-flag-icons | 指定できるのはalpha-2と行政区画のコードだけです。絵文字を描かない理由はREADMEにあります | MODULES-1425 |
| EU以外の組織の旗（国連、アフリカ連合、NATOなど） | | 組織の旗は、その使用条件がMITのパッケージに載せることを許す場合だけ入れます | MODULES-1417 |
| 文化的な旗、先住民の旗、国を持たない民族の旗 | | どこまで扱うかの判断が必要です。ページは`/custom`で独自の旗を登録できます | MODULES-1418 |
| スペインとイタリアの地域、ロシア・インド・ポルトガル・オランダ・インドネシア・パキスタン・エチオピアの地域 | circle-flagsのREADMEには`es-ib`が挙げられている | スペインとイタリアの地域の図のいくつかはCC BY-SAで、Hataは載せません（[判断の記録](../../decisions.md)） | MODULES-1412、MODULES-1415 |
| 南極、西サハラ、カリブ・オランダの島々 | country-flag-iconsとflagpack-coreには`BQ-`の3島があり、circle-flagsのREADMEには`aq-true_south`がある | 国としての公式の旗がありません。既定のない別の旗として提供する予定です | MODULES-1414 |
| アセンション島、トリスタンダクーニャ、アブハジア、南オセチア、北キプロス | country-flag-icons | ISO 3166-1の国ではありません | MODULES-1416 |
| 民間・国・軍のエンサインを、1つの旗の種類として扱うこと | | まだ作っていません | MODULES-1413 |
| 旗についての情報：制定日、デザイナー、色の意味 | | MITで載せられる出典が必要です | MODULES-1420 |
| 旗の変更の履歴（日付つき） | | まだ作っていません | MODULES-1410 |
| クイズの問題の種類を増やすこと、マッチングゲーム | | まだ作っていません | MODULES-1424、MODULES-1419 |
| 旗を選ぶための地図 | | [Chizu](https://github.com/johnmorrisdotca/chizu)を使ったレシピを予定しています | MODULES-1430 |

計画していないもの：描き直した旗、シェアアライクやGPLのもの、AngularやSolid向けのコンポーネント（要素はそこでも動きます）。

## どれを選ぶか

- 旗をCSSのクラスとして要素につけたいだけなら、今のところflag-iconsかworld-flags-spriteが使えます。Hataにはまだありません。
- 円形のアイコンだけが必要なら、circle-flagsです。
- 正しい縦横比で、ライセンスと作者つきで、ここにあるどの国や地域の旗でも、どの形でも欲しいなら、Hataです。
- それらに加えて250 pxのPNGが必要なら、PNGはsvg-country-flagsにあり、HataはSVGを描きます。

これらのどれかから移る方法は、[ほかの旗のセットからHataに移る](moving-to-hata.md)にあります。
