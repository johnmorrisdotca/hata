---
title: 船の信号旗
section: how-to
order: 25
description: 国際信号書の旗（文字旗、数字旗、代表旗、応答旗）と米海軍の特別旗を専用の入口から描き、英語と日本語の意味を読みます。
---

船が文字を綴ったり信号を送ったりするために掲げる旗は、国際信号書の26の文字旗、10の数字旗、3つの代表旗、そして応答旗です。これらは専用の入口 `@johnmorrisdotca/hata/signals` にあり、国の旗だけを描くページはこれを読み込みません。idは `ics:` に小文字の名前を続けたもので、`ics:a` から `ics:z`、`ics:0` から `ics:9`、`ics:sub-1` から `ics:sub-3`、`ics:answer` です。米海軍の特別旗のうち18（回頭旗、針路旗、速力旗、配置旗、隊形旗など）は、同じ入口に `tactical` というグループとして入っています。idは `usn:` に小文字の名前を続けたもので、`usn:turn`、`usn:corpen`、`usn:substitute-4` のようになります。米海軍の数字旗は国際信号書と同じものなので、`ics:0` から `ics:9` です。国や地域のコードにはコロン（:）が含まれないため、信号旗のidが国のコードに成り代わることはなく、`isFlagCode("ics:a")` は偽です。

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

`signalFlag(id)` はSVG文字列を（Promiseとして）読み込み、`signalName(id, lang)` は名前（「A: Alfa」「A旗（アルファ）」）、`signalMeaning(id, lang)` は旗の意味や働き、`signalAspect(id)` は幅÷高さ、`signalInfo(id)` はパッケージが知っているすべて、`signalsFor(text)` は文を綴る旗を返します。`signalId("a")` は緩く書いたidを読み取り `"ics:a"` を返し、`SIGNAL_IDS` は、国際信号書の40を図版の順に、続けて米海軍の特別旗のうち18を並べます。国際信号書にないidにはどれも `null` を返します。

## サイズと、1枚だけ読み込む方法

入口にあるのは記録だけです（ID、名前、説明、期間、出典、注記。約91 KB、gzipで8.6 KB）。絵は入っていません。絵はそれぞれ別のモジュール `@johnmorrisdotca/hata/signals/a`（中央値324 B、最大500 B）で、国の旗に `/load` がするのと同じく、検索が頼まれたときに動的importで読み込みます。そのため、ページに入るのは頼んだ絵だけです。モジュールは自分で読み込むこともできます（`import svg from "@johnmorrisdotca/hata/signals/a"` は `ics:a` の絵）。絵に行く道は、IDかモジュールだけです。

## 絵の出どころ

どの旗も、このパッケージのために、MITライセンスで、`scripts/draw-signals.ts` に書いた幾何として描いたものです（`pnpm draw` で `src/sets/signals.data.ts` を作ります）。絵をなぞったり複製したりはしていません。仕様は国際信号書そのものです。1969年のアメリカ版（2003年改訂）Pub. 102で、アメリカ政府の著作物であり、著作権は主張されていません。その図版がすべての旗を示し、本文が5つの色（赤、黄、青、黒、白）の名前と、1文字信号それぞれの意味を定めています。英語の意味は国際信号書の言葉そのままです。

国際信号書には寸法図も寸法もないので、図案は図版に従い、縦横の比は図版から測って丸めました。文字旗は長さ6に対して高さ5、AとBは燕尾形で切り込みの深さが長さの3分の1、数字旗は旗竿側の高さ2に対して長さ7で、はためく側では旗竿側の0.38倍まで細くなり、代表旗は長さ3に対して高さ2の三角形、応答旗は長さ3に対して高さ1です。色の値はこのパッケージのものです（国際信号書は色の名前を定めるだけで、値を定めていません）。同じ旗を描いたほかの絵とは、この比が少し違うことがあり、どの記録も `note` でそう述べています。

ここにある米海軍の特別旗18は、別の種類です。国の旗と同じく、Wikimedia Commonsのファイルを取ったもので、どれもパブリックドメインで、作者はCarl Lindbergです。「米海軍の仕様どおり」に描かれた絵で、ファイルのページは、単純な図形なので著作権の対象にならないとしています。ライセンスはCommonsから読み取り、絵は国の旗と同じく最適化し、ページ、ライセンス、作者は記録（`signalInfo("usn:turn")?.source`）と `NOTICE.md` にあります。意味は、米海軍の信号員の教本NAVEDTRA 14244（navyaviation.tpub.com/14244の「Basic Maneuvering Flags」「Substitutes」「Correcting a Signal」）と、カナダ海軍の視覚信号のページ（jproc.ca/rrp/rrp2/visual_flags.html。予令旗、指定旗、質問旗、緊急旗、小隊旗の使い方）に、おおまかに従っています。旗の名前は、Sea Flagsのジョセフ・マクミランの「Signal Flags」のページと、ウィキペディアの「Naval flag signalling」も読んで確かめました。3桁未満の数字旗は10度単位なので、「回頭、右舷、15」は、そろって150度回頭することです。3桁なら、落ち着く針路を表します。海上では、米海軍自身の信号書が基準です。ここにないのは、左舷旗、大隊旗、戦隊旗、小艦隊旗です。これも米海軍の旗ですが、パブリックドメインのファイルがCommonsにありません。また、米海軍の旗と違う部分のあるNATO（北大西洋条約機構）のACP 129の旗も、ここにはありません。

旗は信号と、その絵のためのものです。海上での旗の意味は国際信号書のものであり、このパッケージは、信号を送る船にとって国際信号書の代わりにはなりません。続けて[コードと名前](codes-and-names.md)を読んでください。
