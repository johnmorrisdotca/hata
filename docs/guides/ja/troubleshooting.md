---
title: 問題への対処とよくある質問
section: troubleshooting
order: 10
description: 絵や名前がない場合と、表示側の読み込みの失敗を区別します。
---

## 値がない場合を読む

`frame` と `aspectOf` は、使える SVG でない場合に null です。`flagCode`・`flagUrl`・`flagName`・`flagAspect`・`manifest`・非同期の読み込みは、説明した結果がない場合に null です。`variantsOf` は別の旗がなければ空の一覧です。`leftOut` は既知の理由だけを説明し、不明なコードや既定の旗がある場合にも null です。任意の資料の項目は、作った空の値ではなく欠けることがあります。

## 表示側を調べる

読み込みを await し、対応する別の旗の id と完全な地域コードを使います。要素は登録の import とブラウザーが必要です。素材が読めない場合は、ビルドの動的なファイルや自分の SVG の base を調べます。data URI と URL では CSP の許可が違います。無効にせず、元の CSP 用の例を使います。枠で色が欠ける場合は whole・auto を比べ、切り抜きの記録を読みます。
