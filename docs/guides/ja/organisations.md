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

欧州連合の旗は、連合自身の説明から、その利用条件に従って、このパッケージのために描いたものです。ほかの6つは、パブリックドメインかCC0のWikimedia Commonsの絵で、ライセンスの確認を通し、国の旗と同じく最適化したものです：カリブ共同体（CARICOM）、アラブ連盟、独立国家共同体、英連邦（コモンウェルス）、アンデス共同体、イスラム協力機構（1981年から2011年の旗）。これらが入っているのは、その機関自身のページが旗や紋章について条件を定めていないためですが、それはライセンスではありません。どの記録にも、条件が見つからなかったこと、ページ、読んだ日が書いてあり（`organisationTerms(id)`）、`organisationSource(id)` はCommonsのファイル、ページ、ライセンス、作者を返します。機関自身の条件や法律が旗や紋章を制限しているものは、絵のライセンスにかかわらず入れません：国際連合、NATO、赤十字・赤新月、アフリカ連合、ASEAN、北欧理事会、オリンピックの五輪です。国の法律が旗の使い方を制限することは、どの旗でも同じです。除いた機関は、理由、読んだページ、各日に何が書いてあったかとともに [NOTICE.md](https://github.com/johnmorrisdotca/hata/blob/main/NOTICE.md)（英語）に、規則は[判断の記録](../../decisions.md)（英語）にあります。続けて [コードと名前](codes-and-names.md) を読んでください。
