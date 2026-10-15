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

副作用の入口はブラウザーで`<hata-flag>`を登録します。作成前に一度読み込み、表示側で登録を管理するときは未登録の入口を使います。属性とプロパティにはcode・shape・size・width・fit・variant・label・lang・theme・border・shadow・loadingがあります。読み上げる名前の言語はlang、文脈に応じた説明はlabelです。

## イベントを聞いて片付ける

`hata-load`と`hata-error`は元のコード・形・理由を伝えます。旗がない場合とモジュールの失敗を区別し、要素を消すときに表示側のリスナーも外します。見えるプレビューには即時、画面外の埋め込みには遅延の読み込みを選べます。元のREADMEにフレームワークとiframe、CSP、作成画面の例を保ちます。
