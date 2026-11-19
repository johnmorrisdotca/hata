---
title: ほかの旗のセットからHataに移る
section: how-to
order: 18
description: flag-icons、country-flag-icons、circle-flags、react-world-flags、flagpack-coreで旗を描いていた方法のそれぞれに、同じことをするHataの1行と、変わる点を示します。
---

各節は、そのセット自身のREADMEの1行（リンクつき、2026-11-17に確認）で始まり、同じことをするHataの1行を示します。先に、スコープつきの名前でHataをインストールしてください： `npm install @johnmorrisdotca/hata`。[比較](other-flag-sets.md)に、各セットが何を収録しているか、Hataにまだ同等のものがない点が書かれています。

どの場合も共通のことが3つあります。Hataのコードは、ISO 3166-1 alpha-2のコード（`gr`でも`GR`でも）、または地域のISO 3166-2のコード（`JP-13`、`DE-BY`）です。旗は、箱の中に本来の縦横比で描かれ、引き伸ばされません。そのため、flag-iconsの4:3の`fi`と、同じ大きさの枠に入れたHataの旗は、日本、カナダ、スイスなどで違って見えます。幅と高さの両方ではなく、幅だけを決めてください。そして、描かれた図ごとのライセンスはそれぞれ別なので、公開する前に[形式、大きさ、ライセンス](formats-and-licences.md)を読んでください。

## flag-iconsから

[flag-icons](https://github.com/lipis/flag-icons)は、空の`span`にクラスをつけます。

```html
<span class="fi fi-gr"></span> <span class="fi fi-gr fis"></span>
```

Hataでは、要素がいちばん近いものです。正方形の旗は`shape="square"`です。

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@johnmorrisdotca/hata@1/dist/element-define.js"></script>
<hata-flag code="GR" size="32"></hata-flag> <hata-flag code="GR" shape="square" size="32"></hata-flag>
```

クラスのまま移ることもできます。Hataには旗ごとのクラスがあるスタイルシートがあり、`fi fi-gr`は`hata hata-gr`に、`fi fi-gr fis`は`hata hata-gr hata-1x1`になります（[CSSのクラスとSVGスプライト](css-and-sprite.md)と、下のクラス名の表）。

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@johnmorrisdotca/hata@1/dist/css/hata.css" />
<span class="hata hata-gr"></span> <span class="hata hata-gr hata-1x1"></span>
```

変わる点：`fi`は幅が`1.33em`ですが、`hata`は高さが`1em`です。大きさは`font-size`か`height`で決めてください。幅は旗本来の縦横比で決まり、4:3にはなりません（4:3にするには`hata-4x3`をつけます）。Hataのクラスは`hata`で始まるので、移行のあいだ、両方のセットのクラスを同じページに置けます。

## country-flag-iconsから

[country-flag-icons](https://github.com/catamphetamine/country-flag-icons/blob/master/README.md)には、旗ごとのReactコンポーネント、文字列、ふつうの画像があります。

```js no-check
import { US } from 'country-flag-icons/react/3x2'
import US from 'country-flag-icons/string/3x2/US'
```

```tsx no-check
import { Flag } from "@johnmorrisdotca/hata/react";
import us from "@johnmorrisdotca/hata/flags/us";   // SVGの文字列。旗ごとに1つのモジュール

<Flag code="US" label="United States" size="large" />
```

`<img src="…/3x2/US.svg">`には、jsDelivrのアドレスを返す`flagUrl("US")`を使います。自分のサイトに`dist/svg/`のコピーを置くなら`flagUrl("US", { base: "/flags" })`です。country-flag-iconsの`hasFlag(code)`は`isFlagCode(code)`、`countries`の一覧は`FLAG_CODES`にあたります。

変わる点：旗は3:2ではなく、本来の縦横比で描かれます。country-flag-iconsのUnicode絵文字の出力には、Hataに同等のものがありません。Hataが絵文字を描かない理由は、[README](../../../README.md#where-it-comes-from-and-where-it-is-used)にあります（MODULES-1425）。

## circle-flagsから

[circle-flags](https://github.com/HatScripts/circle-flags/blob/gh-pages/README.md)は、画像のアドレスを使い、Reactには別のパッケージがあります。

```html
<img src="https://hatscripts.github.io/circle-flags/flags/br.svg" width="48" />
```

```html
<hata-flag code="BR" shape="round" size="48"></hata-flag>
```

```ts no-check
import { flag } from "@johnmorrisdotca/hata/load";

const brazil = await flag("BR", { shape: "round", label: "Brazil" });   // 円のために描かれたSVGの文字列
```

変わる点：円形のHataの旗は、切り取ると色が失われる場合（カナダの赤い帯）、円のために描き直されます。circle-flagsの図は、円のための1つのデザインです。Hataに旗がない地域のcircle-flagsのファイル（READMEにある`es-ib`、バレアレス諸島）には、まだ同等のものがありません（MODULES-1412）。

## react-world-flagsから

[react-world-flags](https://github.com/smucode/react-world-flags/blob/master/README.md)は、2文字、3文字、3桁の数字のコードを受け付けます。

```jsx no-check
import Flag from 'react-world-flags'

<Flag code="nor" height="16" />
```

```tsx no-check
import { Flag } from "@johnmorrisdotca/hata/react";

<Flag code="NO" size={16} />
```

変わる点：Hataは2文字のコードだけを受け付ける（MODULES-1425）ので、3文字や数字のコードは先に変換してください。READMEによると、react-world-flagsのバンドルにはすべての旗が入り、gzipで約1.3 MBです。Hataの中核は旗を含まず、gzipで3.7 kBです。旗は旗ごとに別のモジュールで、ページが求めたときに読み込まれます。

## flagpack-coreから

[flagpack-core](https://github.com/Yummygum/flagpack-core/blob/main/README.md)は、旗を`flags`フォルダーから1つずつインポートし、React・Vue・Svelteのパッケージがそれをしてくれる、と書いています。

```tsx no-check
import { Flag } from "@johnmorrisdotca/hata/react";

<Flag code="GB-SCT" label="Scotland" />
```

VueとSvelteは[フレームワークのガイド](frameworks.md)にあります。

変わる点：イングランド、スコットランド、ウェールズは、どちらでも`GB-ENG`、`GB-SCT`、`GB-WLS`です。北アイルランドには固有の旗がないので、Hataはユニオン・フラッグとかつてのアルスター旗を名前つきの別の旗として提供し、`GB-NIR`だけでは`null`を返します。flagpack-coreには`GB-NIR`があります。イギリス自体の旗は、Hataでは`GB`です。

## クラス名の対応

同じ旗を、各セットのクラスとHataのクラスで書いた表です。flag-iconsとcountry-flag-iconsは旗ごとにクラスがあります。circle-flagsは画像ファイルだけで、Hataでは円形の旗がその代わりになります。Hataの枠は、同じ要素につける2つ目のクラスです。

| やりたいこと | flag-icons | country-flag-icons | circle-flags | Hata |
| --- | --- | --- | --- | --- |
| ギリシャ | `fi fi-gr` | `flag:GR` | `<img src=".../flags/gr.svg">` | `hata hata-gr` |
| ギリシャ、正方形 | `fi fi-gr fis` | クラスなし（`1x1`フォルダーのファイル） | なし | `hata hata-gr hata-1x1` |
| ギリシャ、円形 | なし | なし | `<img src=".../flags/gr.svg">`（どのファイルも円形） | `hata hata-gr hata-round` |
| スコットランド | `fi fi-gb-sct` | `flag:GB-SCT` | `<img src=".../flags/gb-sct.svg">` | `hata hata-gb-sct` |
| バイエルン | なし | なし | なし | `hata hata-de-by` |
| 大きさ | `font-size`（幅`1.33em`） | `font-size`、または`--CountryFlagIcon-height` | `<img>`自身の大きさ | `font-size`か`height`（高さ`1em`） |

あるセットのスタイルシートは、別のセットのものとは違います。クラスはそのセットのものを、スタイルシートも同じセットのものを使ってください。ページを移すには、上のクラス名を置き換え、Hataのスタイルシートの`<link>`を1つ足します。

## どのセットにもないもの

描いた旗の出典、作者、ライセンスが、`manifest(code)`にあります。これも移してください。出典を示さないセットから移る理由は、これです。

```ts
import { manifest } from "@johnmorrisdotca/hata/manifest";

console.log(manifest("NO")?.licence.name, manifest("NO")?.author);
```
