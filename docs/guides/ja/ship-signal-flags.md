---
title: 船の信号旗
section: how-to
order: 25
description: 国際信号書の旗（文字旗、数字旗、代表旗、応答旗）を専用の入口から描き、英語と日本語の意味を読みます。
---

船が文字を綴ったり信号を送ったりするために掲げる旗は、国際信号書の26の文字旗、10の数字旗、3つの代表旗、そして応答旗です。これらは専用の入口 `@johnmorrisdotca/hata/signals` にあり、国の旗だけを描くページはこれを読み込みません。idは `ics:` に小文字の名前を続けたもので、`ics:a` から `ics:z`、`ics:0` から `ics:9`、`ics:sub-1` から `ics:sub-3`、`ics:answer` です。国や地域のコードにはコロン（:）が含まれないため、信号旗のidが国のコードに成り代わることはなく、`isFlagCode("ics:a")` は偽です。

```mjs
import { frame } from "@johnmorrisdotca/hata";
import { signalFlag, signalMeaning, signalsFor } from "@johnmorrisdotca/hata/signals";

// A hoist that spells a word: one flag a letter, each an SVG string framed like a country's; its id begins with "ics:".
const hoist = signalsFor("SOS 7");
const first = await signalFlag(hoist[0] ?? "");
const round = frame(first ?? "", { shape: "round", label: "S" });
console.log(hoist.join(" "), round?.includes("clipPath"));
console.log(signalMeaning("ics:o"), signalMeaning("ics:o", "ja"));
```

`signalFlag(id)` はSVG文字列を（Promiseとして）読み込み、`signalName(id, lang)` は名前（「A: Alfa」「A旗（アルファ）」）、`signalMeaning(id, lang)` は旗の意味や働き、`signalAspect(id)` は幅÷高さ、`signalInfo(id)` はパッケージが知っているすべて、`signalsFor(text)` は文を綴る旗を返します。`signalId("a")` は緩く書いたidを読み取り `"ics:a"` を返し、`SIGNAL_IDS` は国際信号書の図版の順にすべてのidを並べます。国際信号書にないidにはどれも `null` を返します。

## サイズと、1枚だけ読み込む方法

入口にあるのは記録だけです（ID、名前、説明、期間、出典、注記。約58 KB、gzipで5.8 KB）。絵は入っていません。絵はそれぞれ別のモジュール `@johnmorrisdotca/hata/signals/a`（中央値321 B、最大448 B）で、国の旗に `/load` がするのと同じく、検索が頼まれたときに動的importで読み込みます。そのため、ページに入るのは頼んだ絵だけです。モジュールは自分で読み込むこともできます（`import svg from "@johnmorrisdotca/hata/signals/a"` は `ics:a` の絵）。絵に行く道は、IDかモジュールだけです。

## 絵の出どころ

どの旗も、このパッケージのために、MITライセンスで、`scripts/draw-signals.ts` に書いた幾何として描いたものです（`pnpm draw` で `src/sets/signals.data.ts` を作ります）。絵をなぞったり複製したりはしていません。仕様は国際信号書そのものです。1969年のアメリカ版（2003年改訂）Pub. 102で、アメリカ政府の著作物であり、著作権は主張されていません。その図版がすべての旗を示し、本文が5つの色（赤、黄、青、黒、白）の名前と、1文字信号それぞれの意味を定めています。英語の意味は国際信号書の言葉そのままです。

国際信号書には寸法図も寸法もないので、図案は図版に従い、縦横の比は図版から測って丸めました。文字旗は長さ6に対して高さ5、AとBは燕尾形で切り込みの深さが長さの3分の1、数字旗は旗竿側の高さ2に対して長さ7で、はためく側では旗竿側の0.38倍まで細くなり、代表旗は長さ3に対して高さ2の三角形、応答旗は長さ3に対して高さ1です。色の値はこのパッケージのものです（国際信号書は色の名前を定めるだけで、値を定めていません）。同じ旗を描いたほかの絵とは、この比が少し違うことがあり、どの記録も `note` でそう述べています。

旗は信号と、その絵のためのものです。海上での旗の意味は国際信号書のものであり、このパッケージは、信号を送る船にとって国際信号書の代わりにはなりません。続けて[コードと名前](codes-and-names.md)を読んでください。
