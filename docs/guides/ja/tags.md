---
title: 旗にあるもので旗を探す
section: how-to
order: 20
description: 旗のタグ（縞、星、十字、紋章など）をそれぞれの出どころと一緒に読み、指定したタグを持つ旗の一覧を出します。
---

旗には、決まった一覧から選んだタグが付いています。`stripes-horizontal`（横の縞）、`stars`（星）、`cross`（十字）、`emblem`（紋章など）のようなものです。タグは色と同じ入口 `@johnmorrisdotca/hata/search` にあります。`tagsOf(code)` は旗のタグを返し、タグごとに出どころがわかるので、確かめた事実と機械の推測を分けて見せられます。

```mjs
import { countsWith, FLAG_TAGS, flagsWith, tagsOf } from "@johnmorrisdotca/hata/search";

// Germany is three bands across and nothing else: measured from the drawing.
console.log(tagsOf("DE"));
// The flags Wikidata says carry a Nordic cross.
console.log(flagsWith({ tags: ["nordic-cross"] }).includes("DK"));
// Only what was measured or checked by a person: the guesses are left out.
console.log(flagsWith({ tags: ["stripes-vertical"], sources: ["reviewed", "computed"] }).includes("FR"));
// Every tag a flag can have, for a row of chips.
console.log(FLAG_TAGS.length);
// Among the countries only, and how many of those flags each chip would leave once "stars" is chosen.
console.log(flagsWith({ tags: ["stars"], within: "countries" }).length);
console.log(countsWith({ tags: ["stars"], within: "countries" }).colours.red);
```

## チップの列を作る

`within` は、探す範囲を `"countries"`（国だけ）、国のコード（`"JP"` なら日本の地域）、またはコードの一覧で指定します。`countsWith` は `flagsWith` と同じ指定を受け取り、色とタグのそれぞれについて、それを一つ足したら何枚の旗が見つかるかを返します。チップに書く数字です。デモのギャラリーがその例で、未確認の推定は、読む人が求めたときだけ含めます。

## タグの出どころ

- `computed`：絵から測ったもので、人の判断は入っていません。旗の全体が横か縦の帯だけ、または一色だけ、という場合です。
- `wikidata`：ウィキデータのその旗の項目が「描かれているもの」として挙げているものです。五つの角の星、紋章、北欧十字などです。
- `unreviewed`：機械の推測で、まだだれも確かめていません。ウィキメディア・コモンズでその絵のファイルが入っているカテゴリ、旗の両はしに同じ帯があること、色の数がとても多いこと、から付けています。
- `reviewed`：人が旗を見て確かめたものです。

機械が付けたタグを、確かめたものとして出すことはありません。`unreviewed` のタグは推測として見せるか、`sources` を使って外してください。まだタグのない旗は空の一覧を返しますが、それは「無地」という意味ではありません。タグは国の旗から順に、確かめながら増やしていきます。

## もっと読む

`manifest(code).tags` には同じタグと、それぞれの根拠（測った結果、ウィキデータの記述、コモンズのカテゴリ）が入っています。それぞれのタグがいつ当てはまるかは、[すべての旗のタグの一覧](https://github.com/johnmorrisdotca/hata/blob/main/docs/tags.md)（英語）にあります。`flagsWith` は色とタグを一緒に指定できます。[色で旗を探す](colours.md) も読んでください。
