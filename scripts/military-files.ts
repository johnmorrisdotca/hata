// The military flags taken from Wikimedia Commons, as the package takes country flags: each file's licence is read from Commons and only public
// domain and CC0 ship (scripts/licence.ts); the file is optimised and kept with its author and licence (scripts/draw-military.ts). The fetch is
// scripts/fetch-military.ts. A flag's `dates` are the ones its file's title or description gives, and null where the page gives none (the flag is
// then the current one, as read on 2026-11-24). `kind`: ensign (the flag a warship flies at the stern), jack (at the bow) or war (a war ensign or
// the colour of an army unit).
interface MilitaryFile {
  slug: string;
  country: { en: string; ja: string };
  kind: "ensign" | "jack" | "war";
  /** What it is called beyond its kind, in both languages: "Kaiserliche Marine", "1947 to 2012". */
  label?: { en: string; ja: string };
  file: string;
  dates: { from: string | null; until: string | null };
  /** Shipped for history and education and never given by default (the Confederate battle flags). */
  restricted?: boolean;
}

const DE = { en: "Germany", ja: "ドイツ" };
const IT = { en: "Italy", ja: "イタリア" };
const f = (slug: string, country: { en: string; ja: string }, kind: MilitaryFile["kind"], file: string, from: string | null = null, until: string | null = null, label?: { en: string; ja: string }): MilitaryFile => ({ slug, country, kind, file, dates: { from, until }, ...(label === undefined ? {} : { label }) });
const c = (en: string, ja: string): { en: string; ja: string } => ({ en, ja });

const US = { en: "United States", ja: "アメリカ" };
const CS = { en: "Confederate States", ja: "アメリカ連合国" };
const MILITARY_FILES: readonly MilitaryFile[] = [
  f("de-naval-ensign", DE, "ensign", "Naval Ensign of Germany.svg"),
  f("de-war-ensign-1871", DE, "war", "War Ensign of Germany (1867–1892).svg", "1871", "1892", c("North German Federal Navy and Imperial Navy, 1871 to 1892", "北ドイツ連邦海軍と帝国海軍、1871年から1892年")),
  f("de-war-ensign-1892", DE, "war", "War Ensign of Germany (1892–1903).svg", "1892", "1903", c("Imperial Navy, 1892 to 1903", "帝国海軍、1892年から1903年")),
  f("de-war-ensign-1903", DE, "war", "War Ensign of Germany (1903–1919).svg", "1903", "1919", c("Imperial Navy (Kaiserliche Marine), 1903 to 1919", "帝国海軍（カイザーリッヒェ・マリーネ）、1903年から1919年")),
  f("de-war-ensign-1919", DE, "war", "War Ensign of Germany (1919–1921).svg", "1919", "1921", c("Weimar Republic, adopted in 1919 and never used", "ワイマール共和国、1919年に制定され使われなかった旗")),
  f("de-war-ensign-1921", DE, "war", "War Ensign of Germany (1921–1933).svg", "1921", "1933", c("Reichsmarine, 1921 to 1933", "ライヒスマリーネ（海軍）、1921年から1933年")),
  f("fr-naval-ensign", c("France", "フランス"), "ensign", "Ensign of France.svg", "1848"),
  f("it-naval-ensign", IT, "ensign", "Naval ensign of Italy.svg", "2012-12-16"),
  f("it-naval-ensign-1947", IT, "ensign", "Naval Ensign of Italy (1947-2013).svg", "1947-11-09", "2012-12-16", c("1947 to 2012", "1947年から2012年")),
  f("it-naval-jack", IT, "jack", "Naval Jack of Italy.svg"),
  f("it-war-flag", IT, "war", "War flag of Italy.svg"),
  f("be-naval-ensign", c("Belgium", "ベルギー"), "ensign", "Naval Ensign of Belgium.svg"),
  f("be-naval-jack", c("Belgium", "ベルギー"), "jack", "Naval Jack of Belgium.svg"),
  f("dk-naval-ensign", c("Denmark", "デンマーク"), "ensign", "Naval Ensign of Denmark.svg"),
  f("fi-naval-ensign", c("Finland", "フィンランド"), "ensign", "Naval Ensign of Finland.svg"),
  f("fi-naval-jack", c("Finland", "フィンランド"), "jack", "Naval Jack of Finland.svg"),
  f("pl-naval-ensign", c("Poland", "ポーランド"), "ensign", "Naval Ensign of Poland.svg"),
  f("pl-naval-ensign-1919", c("Poland", "ポーランド"), "ensign", "Naval Ensign of Poland (1919-1928).svg", "1919", "1927", c("1919 to 1927", "1919年から1927年")),
  f("pl-naval-jack", c("Poland", "ポーランド"), "jack", "Naval Jack of Poland.svg"),
  f("gr-naval-ensign", c("Greece", "ギリシャ"), "ensign", "Naval Ensign of Greece.svg"),
  f("ru-naval-ensign", c("Russia", "ロシア"), "ensign", "Naval Ensign of Russia.svg"),
  f("ru-naval-jack", c("Russia", "ロシア"), "jack", "Naval Jack of Russia.svg"),
  f("su-naval-ensign", c("Soviet Union", "ソビエト連邦"), "ensign", "Naval Ensign of the Soviet Union.svg"),
  f("su-naval-jack", c("Soviet Union", "ソビエト連邦"), "jack", "Naval Jack of the Soviet Union.svg", "1932", "1964"),
  f("in-naval-ensign", c("India", "インド"), "ensign", "Naval Ensign of India.svg"),
  f("pk-naval-ensign", c("Pakistan", "パキスタン"), "ensign", "Naval Ensign of Pakistan.svg"),
  f("pk-naval-jack", c("Pakistan", "パキスタン"), "jack", "Naval Jack of Pakistan.svg"),
  f("cn-naval-ensign", c("China", "中国"), "ensign", "Naval Ensign of the People's Republic of China.svg", null, null, c("People's Liberation Army Navy", "人民解放軍海軍")),
  f("tw-naval-jack", c("Republic of China (Taiwan)", "中華民国（台湾）"), "jack", "Naval Jack of the Republic of China.svg", "1928"),
  f("au-naval-ensign", c("Australia", "オーストラリア"), "ensign", "Naval Ensign of Australia.svg"),
  f("au-naval-jack", c("Australia", "オーストラリア"), "jack", "Naval Jack of Australia.svg"),
  f("ca-naval-ensign", c("Canada", "カナダ"), "ensign", "Naval Ensign of Canada.svg", "2013"),
  f("ca-naval-jack", c("Canada", "カナダ"), "jack", "Naval Jack of Canada.svg", "1968"),
  f("nz-naval-ensign", c("New Zealand", "ニュージーランド"), "ensign", "Naval Ensign of New Zealand.svg"),
  f("th-naval-ensign", c("Thailand", "タイ"), "ensign", "Naval Ensign of Thailand.svg"),
  f("th-naval-jack", c("Thailand", "タイ"), "jack", "Naval Jack of Thailand.svg", "2017"),
  f("sg-naval-ensign", c("Singapore", "シンガポール"), "ensign", "Naval Ensign of Singapore.svg"),
  f("za-naval-ensign", c("South Africa", "南アフリカ"), "ensign", "Naval Ensign of South Africa.svg"),
  f("eg-naval-ensign", c("Egypt", "エジプト"), "ensign", "Naval Ensign of Egypt.svg"),
  f("il-naval-ensign", c("Israel", "イスラエル"), "ensign", "Naval Ensign of Israel.svg"),
  f("ua-naval-ensign", c("Ukraine", "ウクライナ"), "ensign", "Naval Ensign of Ukraine.svg", "2006-06-20"),
  f("co-naval-ensign", c("Colombia", "コロンビア"), "ensign", "Naval Ensign of Colombia.svg"),
  f("id-naval-ensign", c("Indonesia", "インドネシア"), "ensign", "Naval ensign of Indonesia.svg"),
  f("id-naval-jack", c("Indonesia", "インドネシア"), "jack", "Naval Jack of Indonesia.svg"),
  f("ar-naval-jack", c("Argentina", "アルゼンチン"), "jack", "Naval Jack of Argentina.svg"),
  f("cl-naval-jack", c("Chile", "チリ"), "jack", "Naval Jack of Chile.svg"),
  f("mx-naval-jack", c("Mexico", "メキシコ"), "jack", "Naval Jack of Mexico.svg"),
  f("no-naval-jack", c("Norway", "ノルウェー"), "jack", "Naval Jack of Norway.svg", "1905"),
  f("pt-naval-jack", c("Portugal", "ポルトガル"), "jack", "Naval Jack of Portugal.svg"),
  f("es-naval-jack", c("Spain", "スペイン"), "jack", "Naval Jack of Spain.svg"),
  f("kr-naval-jack", c("South Korea", "韓国"), "jack", "Naval Jack of South Korea.svg", "1955"),
  f("ph-naval-jack", c("Philippines", "フィリピン"), "jack", "Naval Jack of the Philippines.svg"),
  f("ph-war-flag", c("Philippines", "フィリピン"), "war", "War Flag of the Philippines.svg"),
  f("ie-naval-jack", c("Ireland", "アイルランド"), "jack", "Naval Jack of Ireland.svg"),
  f("pe-naval-jack", c("Peru", "ペルー"), "jack", "Naval Jack of Peru.svg"),
  f("pe-war-flag", c("Peru", "ペルー"), "war", "War flag of Peru.svg"),
  f("us-flag-1861", US, "war", "Flag of the United States (1861–1863).svg", "1861-07-04", "1863-07-04", c("the national flag of the Union's armies and navy, 34 stars", "北軍と海軍の国旗、星34個")),
  f("us-flag-1863", US, "war", "Flag of the United States (1863–1865).svg", "1863-07-04", "1865-07-04", c("the national flag of the Union's armies and navy, 35 stars", "北軍と海軍の国旗、星35個")),
  { ...f("cs-battle-flag", CS, "war", "Battle flag of the Confederate States of America (1-1).svg", "1861", "1865", c("battle flag of the Army of Northern Virginia, square", "北バージニア軍、正方形")), restricted: true },
  { ...f("cs-naval-jack", CS, "jack", "Naval jack of the Confederate States (1863–1865).svg", "1863", "1865", c("the Confederate States Navy's jack, rectangular", "海軍、長方形")), restricted: true },
  f("ro-naval-jack", c("Romania", "ルーマニア"), "jack", "Naval Jack of Romania.svg"),
];

export { MILITARY_FILES };
export type { MilitaryFile };
