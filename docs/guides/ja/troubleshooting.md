---
title: 問題への対処とよくある質問
section: troubleshooting
order: 10
description: 絵や名前がない場合と、表示側の読み込みの失敗を区別します。
---

## 値がない場合を読む

`frame`と`aspectOf`は、使えるSVGでない場合にnullです。`flagCode`・`flagUrl`・`flagName`・`flagAspect`・`manifest`・非同期の読み込みは、説明した結果がない場合にnullです。`variantsOf`は別の旗がなければ空の一覧です。`leftOut`は既知の理由だけを説明し、不明なコードや既定の旗がある場合にもnullです。任意の資料の項目は、作った空の値ではなく欠けることがあります。

## 表示側を調べる

読み込みをawaitし、対応する別の旗のidと完全な地域コードを使います。要素は登録のimportとブラウザーが必要です。素材が読めない場合は、ビルドの動的なファイルや自分のSVGのbaseを調べます。data URIとURLではCSPの許可が違います。無効にせず、元のCSP用の例を使います。枠で色が欠ける場合はwhole・autoを比べ、切り抜きの記録を読みます。
