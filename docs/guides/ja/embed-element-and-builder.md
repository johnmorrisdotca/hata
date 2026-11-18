---
title: 要素・iframe・ビルダー
section: how-to
order: 22
description: hata-flag要素のすべての属性、スクリプトを使えないページ向けのiframe、フレームワークでの使い方、デモのビルダーを説明します。
---

## スクリプトタグ1つと要素

どのページでも、スクリプトタグ1つと要素で使えます。

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@johnmorrisdotca/hata@1/dist/element-define.js"></script>
<p>Where I live: <hata-flag code="CA-BC"></hata-flag> British Columbia</p>
<hata-flag code="JP-13" shape="round" size="48" border shadow></hata-flag>
```

## 属性

| 属性 | はたらき |
| --- | --- |
| `code` | 旗のコード。大文字小文字は問いません：`JP`、`jp-13`、`CA-ON`、`DE-BY` |
| `shape` | `own`（既定：本来の縦横比）、`4:3`、`1:1`、`round`。`flag(code, { shape })` と同じ枠になります |
| `size` | 高さをCSSのピクセルで指定します。省略すると `1em`（周りの文字の高さ）で、CSSの高さでも指定できます |
| `variant` | その地域で実際に使われている旗のうち、どれを描くか。`variantsOf(code)` の `id` で指定します：`de-facto`、`stripes`、`local`。省略すると既定の旗です |
| `date` | 旗を描く日、`"1962-09-29"`。その日の旗（`variantOn`）で、既定は法律上の旗です。`variant` を併せて指定すると、そちらが優先されます |
| `which` | `date` と併せて使います。`legal`（既定）または `in-use`（実際に掲げられた旗）。要素が設定するARIAのroleである `role` とは別のものです |
| `allow-restricted` | 法律で制限される旗（ドイツの1935年から1945年の旗）を、歴史と教育のために描きます。指定しないと何も描かず、`data-restricted` と、`data-reason` に理由が付きます |
| `fit` | `auto`（既定）、`whole`（旗全体）、`crop`（旗のために選ばれた側での切り抜き）、`cover`、`hoist`、`contain`。`frame()` と同じです |
| `label` | スクリーンリーダーが読み上げる言葉。省略すると地域の名前です |
| `lang` | `en` または `ja`。その名前の言語です。省略すると、要素のあるページの言語です |
| `theme` | `auto`（既定）、`light`、`dark`：明るいページか暗いページか、枠線の色を決めます |
| `border`, `shadow` | 旗の周りの細い線（白い背景の白い旗には必要です）と、柔らかい影 |
| `loading` | `lazy`（既定：画面に近づくと読み込む）または `eager` |

要素はページ自身のdocumentに、shadow rootなしで描かれます。`role="img"` と `aria-label` を持ち、中に旗の `<img>` があるので、
どんな大きさでも鮮明で、ページのCSSが普通のインライン要素と同じように大きさを決めます
（枠線と影は `--hata-flag-border-light`、`--hata-flag-border-dark`、`--hata-flag-shadow` で変えられます）。
すべての属性はプロパティでもあり、React 19、Vue、Svelteが設定できます。`await element.ready` で絵ができるのを待てます。
描けたときは `hata-load`、そのコードに旗がないときは `hata-error` を発火し、その場合は何も描かず、
場所も取らず、理由をコンソールに1度だけ出します。これらは、
[Kyuubu](https://github.com/johnmorrisdotca/kyuubu)の `<kyuubu-cube>` から続く、ファミリーの決まりです。

## スクリプトを使えないページ

スクリプトを使えないサイトには、デモの埋め込みページのiframeがあります。同じ属性をクエリとして受け取ります。

```html
<iframe src="https://johnmorrisdotca.github.io/hata/embed.html?code=JP-13&amp;shape=round&amp;size=48" title="Flag of Tokyo" width="56" height="56" style="border:0" loading="lazy"></iframe>
```

## フレームワークで

フレームワークでは、定義を1度importしてタグを使います。

```ts
import "@johnmorrisdotca/hata/element/define";
// React 19: <hata-flag code="FR-20R" size={32} />
// Vue: <hata-flag code="FR-20R" size="32" /> (with isCustomElement for "hata-")
// Svelte: <hata-flag code="FR-20R" size="32" />; Angular: CUSTOM_ELEMENTS_SCHEMA
```

## ビルダー

[デモ](https://johnmorrisdotca.github.io/hata/)の詳細パネルには**この旗を埋め込む**ビルダーがあります。
形、高さ、言語、枠線、影、テーマを選ぶとその場で表示され、正確なコードを
カスタム要素、CDNのファイルの `<img>`（パッケージと同じ枠をCSSで作ります）、dataのURI、iframe、
ESモジュール、React、Vue、Svelte、Angularとしてコピーできます。ビルダーは単独で動く1つのモジュールで、
[`demo/embed-builder.js`](https://github.com/johnmorrisdotca/hata/blob/main/demo/embed-builder.js)といい、製品名を一切含みません。Hataの選択肢と、Hataだけが書くコードは
[`demo/embed-hata.js`](https://github.com/johnmorrisdotca/hata/blob/main/demo/embed-hata.js)にあります。

関連：[旗の要素とイベント](element-and-events.md)、[旗の埋め込み](../../embeds.md)。
