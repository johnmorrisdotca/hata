---
title: 旗の要素とイベントを使う
section: how-to
order: 7
description: 一度登録し、読み込みと説明を明確にします。
---

## 標準のAPIを使う

```ts
import "@johnmorrisdotca/hata/element/define";
import { FLAG_ELEMENT_ATTRIBUTES } from "@johnmorrisdotca/hata/element";
console.log(FLAG_ELEMENT_ATTRIBUTES);
```

副作用の入口はブラウザーで`<hata-flag>`を登録します。作成前に一度読み込み、表示側で登録を管理するときは未登録の入口を使います。属性とプロパティにはcode・shape・size・width・fit・variant・label・lang・theme・border・shadow・rounded・gloss・wave・loadingがあります。読み上げる名前の言語はlang、文脈に応じた説明はlabelです。

## 任意の見た目

旗の見た目を変える属性が3つあります。どれも初期状態ではオフで、指定したときだけ働きます。これらは `<hata-flag>` 要素の属性です。型付きコンポーネントは、旗をそのまま描きます。

```html
<hata-flag code="CA" size="96" rounded gloss></hata-flag>
<hata-flag code="JP" size="96" wave></hata-flag>
```

- `rounded` は、旗の外枠の角を丸めます（既定は8%で、`--hata-flag-corner` で変えられます）。角が切り取られるので、旗のすべてが見えなければならない場面には向きません。タイルのような使い方に向いています。円形の枠はもともと丸いので、何も変わりません。
- `gloss` は、旗の上にやわらかい光を重ねます。絵の上に重ねる層で、SVGは変わらず、色も変わりません。
- `wave` は、そよ風になびくように、絵をゆっくり揺らします（`--hata-flag-wave-time` で周期、`--hata-flag-depth` で遠近感を変えられます）。GPUで処理される変形なので、タイマーもスクリプトも使いません。OSで動きを減らす設定にしている人には止まったままで、旗が画面の外にあるあいだは止まり、見えるようになると再び動きます。スクリーンリーダー向けの名前はそのままです。絵を外枠の少し内側に収めるので、切り取られることはなく、色も変わりません。

どれもプロパティ（`flag.wave = true`）としても設定できます。フレームワークはこの形で設定します。

## イベントを聞いて片付ける

`hata-load`と`hata-error`は元のコード・形・理由を伝えます。旗がない場合とモジュールの失敗を区別し、要素を消すときに表示側のリスナーも外します。見えるプレビューには即時、画面外の埋め込みには遅延の読み込みを選べます。元のREADMEにフレームワークとiframe、CSP、作成画面の例を保ちます。
