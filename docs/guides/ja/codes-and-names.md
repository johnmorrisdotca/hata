---
title: コードと名前を読む
section: how-to
order: 2
description: 正確なコードの確認と、表記をそろえる検索を区別します。
---

## 標準のAPIを使う

```ts
import { flagCode,isFlagCode,FLAG_CODES } from "@johnmorrisdotca/hata";
import { flagName,flagAspect } from "@johnmorrisdotca/hata/names";
console.log(flagCode("jp_13"),isFlagCode("JP-13"),isFlagCode("jp-13"),FLAG_CODES.length);
console.log(flagName("JP-13","ja"),flagAspect("JP-13"));
```

`isFlagCode`は保存した大文字の既定のコードを正確に確認します。`flagCode`は大小文字とアンダースコアをそろえ、既定の旗がないコードにnullを返します。行政区画は完全なコードで区別します。既定のコードの一覧と、枠に合わせた絵や別の旗を含む一覧は別です。

## 旧国の旗を求める

メダル表や記録集には、いまもソビエト連邦、東ドイツ、ユーゴスラビアが出てきます。Hataはこれらの旗を、現在の国が使わないコードで収録しています。ISO 3166-3のコードがあればそれ（`SUHH`、`DDDE`、`YUCS`）を、なければIOCのコード（`FRG`、`BOH`、`WIF`）を使います。表でよく使われるコードは`FLAG_ALIASES`にあり、`flagCode`・`flag`・`flagName`・`manifest`が読みます。`isFlagCode`と`FLAG_CODES`はコードそのものだけを持ちます。

```ts
import { flagCode, isFlagCode, FLAG_ALIASES } from "@johnmorrisdotca/hata";
import { flagName } from "@johnmorrisdotca/hata/names";
console.log(flagCode("urs"), flagCode("GDR"), isFlagCode("URS"), FLAG_ALIASES.TCH);
console.log(flagName("YUG"), flagCode("CS"));
```

二つの国が使ったコード（`CS`はチェコスロバキア、のちにセルビア・モンテネグロ）は別名にせず、`flagCode("CS")`はnullです。近いものを返すと別の国の旗を描いてしまうためです。オリンピック旗のもとで行進したチーム（`EUN`）には収録する旗がなく、理由とともに`LEFT_OUT`にあります。コードをバッジとして表示してください。[すべてのコード・別名・理由](../../historical.md)は一覧にあります。

## 説明を保つ

`flagName`は英語・日本語を選び、名前がない場合にnullです。翻訳を作らず、コードを代わりに表示できます。`flagAspect`は幅を高さで割った値で、既定の旗がなければnullです。言語で絵や資料は変わりません。既定の旗がない地域は[別の旗](variants.md)を読めます。
