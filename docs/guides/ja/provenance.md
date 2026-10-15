---
title: 資料とライセンスを保つ
section: how-to
order: 5
description: 絵を再利用する前に、選んだ記録を読みます。
---

## 標準のAPIを使う

```ts
import { manifest,leftOut } from "@johnmorrisdotca/hata/manifest";
const drawing=manifest("JP-13");
console.log(drawing?.source,drawing?.author,drawing?.licence.name);
console.log(leftOut("XX"));
```

旗の記録は資料・作者・ライセンス・資料のURL・寸法・枠の判断を保ちます。パッケージのMITから旗のライセンスを推測せず、SVGごとの資料を読みます。必要な出典を保ち、紋章に関する注意も読んで使います。

## 確認した判断を保つ

元の[出典](../../provenance.md)、[判断](../../decisions.md)、[収録しない一覧](../../left-out.md)、[NOTICE](../../../NOTICE.md)を省略せず保ちます。`manifest`は既定の絵がない場合にnull、`leftOut`は既知の理由を説明できますが、不明なコードや収録した旗にもnullです。旗がない、適切なSVGがない、ライセンスの制約を区別します。この説明の更新で絵やライセンスを新しく選びません。
