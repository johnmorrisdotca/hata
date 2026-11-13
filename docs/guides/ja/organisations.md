---
title: 国際機関の旗を使う
section: how-to
order: 7
description: 国コードと重ならないidで、専用の入口から国際機関の旗を描きます。
---

国際機関の旗は専用の入口 `@johnmorrisdotca/hata/organisations` にあり、国の旗だけを描くページはこれを読み込みません。機関のidは `org:` に小文字の名前を続けたもの（`org:eu` など）です。国や地域のコードにはコロン（:）が含まれないため、機関のidが国のコードに成り代わることはなく、`isFlagCode("org:eu")` は偽です。ページが自分で登録する旗のidは、同じ理由で別の名前空間 `custom:` で始めます。

```mjs
import { frame } from "@johnmorrisdotca/hata";
import { organisationFlag, organisationName } from "@johnmorrisdotca/hata/organisations";

// An organisation's flag is an SVG string, framed like a country's; its id begins with "org:".
const svg = organisationFlag("org:eu");
const round = svg === null ? "" : frame(svg, { shape: "round", label: organisationName("org:eu", "ja") ?? "" });
console.log(svg?.startsWith("<svg"), round.includes("clipPath"), organisationName("org:eu", "ja"));
```

`organisationFlag(id)` はSVG文字列、`organisationName(id, lang)` は英語か日本語の名前、`organisationAspect(id)` は幅÷高さ、`organisationTerms(id)` は旗の利用条件を読んだページ・日付・内容を返します。`organisationId("EU")` は緩く書いたidを読み取り `"org:eu"` を返し、`ORGANISATION_IDS` は全idの一覧です。旗がないidにはどれも `null` を返します。

## どの機関があるか

機関の旗は、その旗や紋章の利用条件がMITライセンスのパッケージでの同梱を認める場合にだけ入れ、絵はその機関が公表する説明から描き起こし、複製はしません。現在は欧州連合です。除いた機関は理由と読んだページとともに [NOTICE.md](https://github.com/johnmorrisdotca/hata/blob/main/NOTICE.md)（英語）に載せています。国の法律が旗の使い方を制限することは、どの旗でも同じです。続けて [コードと名前](codes-and-names.md) を読んでください。
