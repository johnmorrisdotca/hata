---
title: コードと名前を読む
section: how-to
order: 2
description: 正確なコードの確認と、表記をそろえる検索を区別します。
---

## 標準の API を使う

```ts
import { flagCode,isFlagCode,FLAG_CODES } from "@johnmorrisdotca/hata";
import { flagName,flagAspect } from "@johnmorrisdotca/hata/names";
console.log(flagCode("jp_13"),isFlagCode("JP-13"),isFlagCode("jp-13"),FLAG_CODES.length);
console.log(flagName("JP-13","ja"),flagAspect("JP-13"));
```

`isFlagCode` は保存した大文字の既定のコードを正確に確認します。`flagCode` は大小文字とアンダースコアをそろえ、既定の旗がないコードに null を返します。行政区画は完全なコードで区別します。既定のコードの一覧と、枠に合わせた絵や別の旗を含む一覧は別です。

## 説明を保つ

`flagName` は英語・日本語を選び、名前がない場合に null です。翻訳を作らず、コードを代わりに表示できます。`flagAspect` は幅を高さで割った値で、既定の旗がなければ null です。言語で絵や資料は変わりません。既定の旗がない地域は[別の旗](variants.md)を読めます。
