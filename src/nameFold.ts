// The same fold Kuni uses for a name (kuni 1.18.0's fold, then its spaces taken out): width, case, accents
// apart from the two marks that make が and ぱ, katakana to hiragana, apostrophes dropped. Kept here so a
// name lookup does not pull Kuni in. A small kana stays small, as it does in that release.

const KATAKANA_FIRST = 0x30a1;
const KATAKANA_LAST = 0x30f6;
const KANA_OFFSET = 0x60;
const VOICED_MARK = "\u3099";
const SEMI_VOICED_MARK = "\u309a";

const fold = (text: string): string =>
  String(text)
    .normalize("NFKC")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, (mark: string) => (mark === VOICED_MARK || mark === SEMI_VOICED_MARK ? mark : ""))
    .normalize("NFC")
    .replace(/[\u30a1-\u30f6]/g, (katakana: string) => {
      const code = katakana.charCodeAt(0);

      return code >= KATAKANA_FIRST && code <= KATAKANA_LAST ? String.fromCharCode(code - KANA_OFFSET) : katakana;
    })
    .replace(/['\u2018\u2019`]/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();

/** The key a name lookup compares: the fold with its spaces taken out, so "Viet Nam" and "Vietnam" meet. */
const foldKey = (text: string): string => fold(text).replace(/ /g, "");

export { foldKey };
