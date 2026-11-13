---
title: 自分の旗を持ち込む
section: how-to
order: 8
description: チーム・クラブ・会社の旗をページから登録し、検査と接頭辞をへて、標準の旗と同じように描きます。
---

ページは自分の旗（チーム、クラブ、会社、掲げる権利のある印）を登録でき、標準の旗と同じ呼び出し・要素・検索で描けます。パッケージは何も同梱せず、何も送りません。`@johnmorrisdotca/hata/custom` は別の入口で、コードが `custom:` で始まるときだけ `flag()` や `<hata-flag>` が読み込むので、独自の旗を使わないページは何も読み込みません。

hoshi-starsと同じく、ファミリーのデータの入口に従います。出どころ（id、英語と日本語の名前と出典表示、ライセンスと そのリンク、ページ、日付）を述べる「セット」を渡し、旗は記録として返します。出典表示が空、ライセンスなし、不正なid、登録済みのidのセットはすぐに `TypeError` で断られます。

```mjs
import { customCreditLine, registerFlags } from "@johnmorrisdotca/hata/custom";
import { flag } from "@johnmorrisdotca/hata/load";

// A page's own flag: a set that says whose it is, and records of an id (custom:...), names and an SVG.
const club = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2"><path fill="#036" d="M0 0h3v2H0z"/><circle cx="1.5" cy="1" r=".5" fill="#fc0"/></svg>';
const done = await registerFlags({
  kind: "records",
  info: {
    id: "harbour",
    name: { en: "Harbour FC", ja: "ハーバーFC" },
    credit: { en: "Harbour FC crest, drawn by the club", ja: "ハーバーFCの紋章（クラブ作成）" },
    licence: { name: "Used with the club's permission", url: "https://example.org/permission" },
    url: "https://example.org/club",
    retrieved: "2026-11-13",
  },
  records: () => [{ id: "custom:harbour-fc", name: { en: "Harbour FC", ja: "ハーバーFC" }, svg: club, group: "Clubs" }],
});
// It is drawn through the same call as a country's.
console.log(done.added.join(), (await flag("custom:harbour-fc", { shape: "round" }))?.includes("clipPath"), customCreditLine("en"));
```

## id

独自の旗のidは `custom:` に小文字・数字・ハイフンの名前（48文字まで）を続けたものです。コロンはISO 3166のどのコードにも含まれないので、独自の旗が国・地域・旧国の旗に成り代わることはなく、`org:` は[国際機関](organisations.md)の旗の名前空間なので、それにも成り代わりません。それ以外のidの記録は理由つきで除かれます。ほかのセットが持つidは除かれ先着のセットが保ち、同じセットidの二重登録は断られます。`removeFlags(id)` はセットを外し（そのidは再び使えます）、`enableFlags(id, false)` は隠します。

## 検査の内容

SVGは厳密な読み取りで木に読み、許可リストで検査し、読み取った内容から書き直すので、描かれるのは検査を通ったものそのものです。手直しはせず、許可外のものを含む記録は `rejected` に理由とともに載せて除き、描きません。

- 要素：`svg g defs symbol path rect circle ellipse line polyline polygon use linearGradient radialGradient stop clipPath mask title desc`。スクリプト、スタイル、画像、リンク、アニメーション、フィルター、文字、`foreignObject`、接頭辞つきの名前は不可です。
- 属性：通常の描画用のものを、それぞれの規則で読みます。イベント、`style`、`class` は不可。`xmlns` はSVGの名前空間、`xmlns:xlink` はXLinkの名前空間そのものだけです。
- 参照：`href` と `url()` は同じファイル内の要素の `#id` だけ（大文字小文字や空白は問いません）。ほかを指すもの、存在しないidを指すものは断ります。`data:` と `javascript:` は不可です。
- 文字：文字参照（`&#106;`、`&#x6a;`）は復号せず断ります。title と desc には `&amp; &lt; &gt; &quot; &apos;` だけを許し、書き戻すときにエスケープします。
- 上限：64 KiB、32階層、要素4,000個（`<use>` は指す先の要素数で数え、`<use>` の輪は断ります）、1ページ1,000旗。ルートにviewBoxがあり、widthとheightはありません。
- 内部のidは `custom-<名前>-<id>`（英数字・下線・ハイフン）になり、同じページの2つの旗が衝突しません。

## 探す

`customFlag(id)`、`customName(id, lang)`、`customAspect(id)` は `flag`、`flagName`、`flagAspect` と同じように答えます。`listCustomFlags({ group })`、`customGroups()`、`searchCustomFlags(query)` はグループごとに一覧・検索します（記録が指定しなければ `"custom"`）。標準の旗と並べる選択画面向けです。`customCreditLine("en" | "ja")` は、ページにある旗の出どころをライセンスつきで一行にします。登録した内容はページを閉じると残りません。続けて [コードと名前](codes-and-names.md) を読んでください。
