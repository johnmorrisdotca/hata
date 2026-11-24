// The medieval banners taken from Wikimedia Commons, as the package takes country flags: each file's licence is read from Commons and only public
// domain and CC0 ship (scripts/licence.ts); the file is optimised and kept with its author and licence (scripts/draw-medieval.ts). The fetch is
// scripts/fetch-medieval.ts. Every one is a modern drawing of a banner that is known from a seal, an armorial, a chronicle or a map, so each is a
// `reconstruction`; its `dates` are the ones the file's title or description gives (a century where it gives that), and null where it gives none.
interface MedievalFile {
  slug: string;
  name: { en: string; ja: string };
  group: "kingdom" | "empire" | "city" | "order" | "cross";
  file: string;
  dates: { from: string | null; until: string | null };
  /** What the file's page says of the banner, for the record's `source.says`. */
  says: string;
}

const m = (slug: string, group: MedievalFile["group"], en: string, ja: string, file: string, from: string | null, until: string | null, says: string): MedievalFile => ({ slug, group, name: { en, ja }, file, dates: { from, until }, says });

const MEDIEVAL_FILES: readonly MedievalFile[] = [
  m("fr-blue-banner", "kingdom", "France: the plain blue banner", "フランス：無地の青い旗", "Banner of France (10th century-12th century).svg", "late 10th century", "early 12th century", "Plain blue banner of France, used from the late 10th century until the early 12th century."),
  m("fr-valois-lis", "kingdom", "France: gold fleurs-de-lis on blue", "フランス：青地に金のユリ", "Flag of medieval France.svg", "1328", null, "In 1328 the arms of the House of Valois were blue with gold fleurs-de-lis, the banner of the kings of France from then on."),
  m("fr-navarre-1284", "kingdom", "France and Navarre united, 1284 to 1328", "フランスとナバラの合同の旗（1284年から1328年）", "Flag of France and Navarre (1284 -1328).svg", "1284", "1328", "The banner of arms of the Kingdoms of Navarre and France when united, from Louis X to Charles IV."),
  m("gb-royal-banner", "kingdom", "England: the Royal Banner (three lions)", "イングランド：王の旗（三頭の獅子）", "Royal Banner of England.svg", null, null, "The Royal Banner of England at 3 to 5, redrawn from the flag of the Duchy of Lancaster."),
  m("hre-red-cross", "empire", "Holy Roman Empire: white cross on red", "神聖ローマ帝国：赤地に白十字", "Flag of the Holy Roman Empire (1200-1350).svg", "1200", "1350", "A flag with a white cross on a red field, taken to be an early form of the Reichssturmfahne, the imperial war flag, used alongside the imperial banner."),
  m("hre-war-flag", "empire", "Holy Roman Empire: the Reichssturmfahne", "神聖ローマ帝国：帝国軍旗（ライヒスシュトゥルムファーネ）", "War flag of the Holy Roman Empire (1200-1350).svg", "1200", "1350", "The Reichssturmfahne, the military banner of the Holy Roman Empire of the German Nation, about 1200 to 1350."),
  m("venice-lion", "city", "Venice: the Lion of Saint Mark", "ヴェネツィア：聖マルコの獅子", "Lion of St Mark.svg", null, null, "The Lion of Saint Mark, the emblem of the Republic of Venice."),
  m("genoa-cross", "city", "Genoa: the red cross on white", "ジェノヴァ：白地に赤い十字", "Flag of Genoa.svg", null, null, "The flag of Genoa."),
  m("teutonic-banner", "order", "The Teutonic Order's banner", "ドイツ騎士団の旗", "Flag of the Teutonic Order.svg", null, null, "The banner of the Order of Teutonic Knights."),
  m("teutonic-state", "order", "The State of the Teutonic Order", "ドイツ騎士団国の旗", "Flag of the State of the Teutonic Order.svg", null, null, "The flag of the State of the Teutonic Order."),
  m("leon", "kingdom", "León: the purple lion", "レオン王国の旗", "Flag of Leon.svg", null, null, "The flag of the Kingdom of León and the region of León."),
  m("navarre-chains", "kingdom", "Navarre: the chains", "ナバラ王国の旗（1212年から1589年）", "Flag of Navarre (1212–1589).svg", "1212", "1589", "The old flag of the Kingdom of Navarre from 1212 to 1589."),
  m("portugal-first", "kingdom", "Portugal: the first banner", "ポルトガル：最初の旗", "First banner of Portugal.svg", "1185", "1247", "The first banner of Portugal, used in the reigns of Sancho I, Afonso II and Sancho II."),
  m("hungary-arpad", "kingdom", "Hungary: the royal standard, 11th and 12th centuries", "ハンガリー：王旗（11世紀から12世紀）", "Flag of Hungary (11th-12th century).svg", "mid-11th century", "late 12th century", "Royal standard of the Kingdom of Hungary from the mid-11th century to the late 12th century."),
  m("hungary-1170", "kingdom", "Hungary: the royal standard, late 12th century", "ハンガリー：王旗（12世紀後半）", "Flag of Hungary (late 12th century).svg", "late 12th century", null, "Royal standard of the Kingdom of Hungary in the late 12th century."),
  m("hungary-1467", "kingdom", "Hungary: the flag at the battle of Baia, 1467", "ハンガリー：バイアの戦いの旗（1467年）", "Flag of Hungary (15th century).svg", "1467", null, "The Hungarian flag at the battle of Baia (1467) according to the Chronica Hungarorum."),
  m("poland-eagle", "kingdom", "Poland: the crowned eagle, 14th century", "ポーランド：冠をかぶった鷲の旗（14世紀）", "Flag of the Kingdom of Poland.svg", "14th century", null, "Banner of the Kingdom of Poland in the 14th century; a seal of Duke Premislaus II of 1290 shows the ruler holding a banner with a crowned eagle."),
  m("burgundy-saltire", "cross", "The Cross of Burgundy", "ブルゴーニュ十字の旗", "Flag of Cross of Burgundy.svg", null, null, "A flag with the Cross of Burgundy (a saltire), later used in the Catholic Monarchy and its viceroyalties."),
  m("palaiologos-1250", "empire", "Byzantium: the Palaiologos arms before 1259", "ビザンツ：パレオロゴス家の紋の旗（1259年より前）", "Palaiologos Flag 1250.svg", null, null, "A flag with the arms of the Palaiologos family in use before Michael VIII Palaiologos took the imperial throne."),
  m("byzantium-1375", "empire", "Byzantium: the imperial flag in the Catalan Atlas, 1375", "ビザンツ：カタルーニャ地図の帝国旗（1375年）", "Byzantine imperial flag, 14th century, square.svg", "1375", null, "The flag of the late Eastern Roman Empire under the Palaiologos dynasty, as depicted in the Catalan Atlas of 1375."),
  m("papal-states", "city", "The Papal States", "教皇領の旗", "Flag of the Papal States (pre 1808).svg", null, "1808", "The flag of the Papal States before 1808."),
  m("jerusalem-1162", "kingdom", "The Kingdom of Jerusalem: the second banner, from 1162", "エルサレム王国：第2の旗（1162年から）", "Flag of Kingdom of Jerusalem.svg", "1162", null, "The second banner of the Kingdom of Jerusalem, from 1162."),
  m("florence-ghibelline", "city", "Florence: the Ghibellines' flag, until 1250", "フィレンツェ：ギベリン派の旗（1250年まで）", "Flag of Florence (until 1250).svg", "11th century", "1250", "The flag of Florence used by the Ghibellines from the 11th century until their defeat in 1250."),
  m("pisa", "city", "The Republic of Pisa", "ピサ共和国の旗", "Flag of the Republic of Pisa.svg", null, null, "The flag of the Republic of Pisa."),
  m("milan-1450", "city", "The Duchy of Milan, about 1450", "ミラノ公国の旗（1450年ごろ）", "Flag of the Duchy of Milan (1450, 2-3 ratio).svg", "1450", null, "The flag of the Duchy of Milan from about 1450."),
  m("corsica-14c", "kingdom", "Corsica, 14th century", "コルシカの旗（14世紀）", "Flag of Corsica (14th century).svg", "14th century", null, "The flag of Corsica in the 14th century."),
  m("serbia-1339", "kingdom", "Serbia on Dulcert's map, 1339", "デュルセールの地図のセルビアの旗（1339年）", "Flag of Serbia (1339).svg", "1339", null, "The flag of Serbia on the map by Angelino Dulcert (1339)."),
  m("serbian-church", "order", "The Serbian Church, 13th century", "セルビア教会の旗（13世紀）", "Serbian Church later Patriarchate flag 13th century.svg", "13th century", null, "The Serbian Church's later Patriarchate flag, derived from the map of Gabriel de Vallseca of August 1439."),
  m("almoravid", "empire", "The Almoravids' banner", "ムラービト朝の旗（11世紀から12世紀）", "Flag of Almoravid dynasty 1073 1147.svg", "1073", "1147", "A white flag inscribed with the Shahada, supposedly a banner of the Almoravid dynasty in Morocco (11th to 12th centuries); the page doubts the claim."),
  m("ayyubid", "empire", "The Ayyubid banner", "アイユーブ朝の旗", "Flag of Ayyubid Dynasty.svg", null, null, "The flag of the Ayyubid dynasty, often shown in yellow."),
  m("saladin", "empire", "Saladin's personal standard", "サラディンの個人の旗", "Flag of Saladin.svg", null, null, "The personal battle standard of Salah ad-Din."),
  m("morocco-medieval", "empire", "Morocco, 11th to 13th centuries", "モロッコの旗（11世紀から13世紀）", "Flag of Morocco (11th-13th Century) (Schwenkel).svg", "11th century", "13th century", "A flag of Morocco of the 11th to the 13th century."),
  m("wales-dragon", "kingdom", "Wales: Owain Glyn Dŵr's golden dragon", "ウェールズ：オワイン・グリンドゥールの金の竜の旗", "Golden Dragon War Flag of Wales (created 1400).svg", "1400", null, "The war flag of Wales as used by the 15th-century Prince Owain Glyn Dŵr, created in 1400."),
  m("rostock-14c", "city", "Rostock: the Hanseatic banner, 14th century", "ロストック：ハンザ都市の旗（14世紀）", "Flag of Rostock (Hanging flag, 14th century).svg", "14th century", null, "The Hanseatic banner of Rostock in the 14th century."),
  m("swiss-cross", "cross", "The early Swiss cross, 1470s", "初期のスイス十字の旗（1470年代）", "Early Swiss cross.svg", "1470", null, "An early form of the Swiss flag, used as a field sign by troops under confederate command from about the 1470s."),
  m("unterwalden-1309", "city", "Unterwalden's old flag", "ウンターヴァルデンの古い旗（1309年）", "Old flag of Unterwalden.svg", "1309", null, "A historical flag of the canton of Unterwalden."),
  m("ragusa-secondary", "city", "Ragusa: the secondary flag", "ラグーザ共和国の副旗", "Secondary flag of Republic of Ragusa.svg", null, null, "The secondary flag of the Republic of Ragusa."),
];

/** What each file's page says, in Japanese, for the Japanese `about` of its record (the English is `says`). */
const SAYS_JA: Readonly<Record<string, string>> = {
  "fr-blue-banner": "10世紀後半から12世紀前半まで使われた、フランスの無地の青い旗です。",
  "fr-valois-lis": "1328年のヴァロワ家の紋章は青地に金のユリで、以後フランス王の旗となりました。",
  "fr-navarre-1284": "ナバラ王国とフランス王国が同君連合だった時期（ルイ10世からシャルル4世まで）の紋章旗です。",
  "gb-royal-banner": "ランカスター公領の旗から描き直した、縦横比3対5のイングランド王の旗です。",
  "hre-red-cross": "赤地に白い十字の旗で、帝国の軍旗ライヒスシュトゥルムファーネ（Reichssturmfahne）の初期の形とみられ、帝国の旗とともに使われました。",
  "hre-war-flag": "ドイツ国民の神聖ローマ帝国の軍旗、ライヒスシュトゥルムファーネ。1200年ごろから1350年ごろです。",
  "venice-lion": "ヴェネツィア共和国の紋章、聖マルコの獅子です。",
  "genoa-cross": "ジェノヴァの旗です。",
  "teutonic-banner": "ドイツ騎士団の旗です。",
  "teutonic-state": "ドイツ騎士団国の旗です。",
  "leon": "レオン王国と、レオン地方の旗です。",
  "navarre-chains": "1212年から1589年までのナバラ王国の古い旗です。",
  "portugal-first": "ポルトガルの最初の旗で、サンショ1世、アフォンソ2世、サンショ2世の治世に使われました。",
  "hungary-arpad": "11世紀半ばから12世紀後半までのハンガリー王国の王旗です。",
  "hungary-1170": "12世紀後半のハンガリー王国の王旗です。",
  "hungary-1467": "『ハンガリー年代記』（Chronica Hungarorum）によるバイアの戦い（1467年）のハンガリーの旗です。",
  "poland-eagle": "14世紀のポーランド王国の旗です。1290年のプシェミスウ2世公の印章には、冠をかぶった鷲の旗を持つ君主が描かれています。",
  "burgundy-saltire": "ブルゴーニュ十字（斜め十字）の旗で、のちにカトリック君主国（スペイン）とその副王領で使われました。",
  "palaiologos-1250": "ミカエル8世パレオロゴスが帝位に就く前に使われた、パレオロゴス家の紋の旗です。",
  "byzantium-1375": "1375年のカタルーニャ地図に描かれた、パレオロゴス朝のもとの後期東ローマ帝国の旗です。",
  "papal-states": "1808年より前の教皇領の旗です。",
  "jerusalem-1162": "1162年からのエルサレム王国の2番目の旗です。",
  "florence-ghibelline": "11世紀から、1250年に敗れるまで、ギベリン派が使ったフィレンツェの旗です。",
  "pisa": "ピサ共和国の旗です。",
  "milan-1450": "1450年ごろからのミラノ公国の旗です。",
  "corsica-14c": "14世紀のコルシカの旗です。",
  "serbia-1339": "アンジェリーノ・ドゥルチェルトの地図（1339年）に描かれたセルビアの旗です。",
  "serbian-church": "セルビア教会（のちの総主教座）の旗で、1439年8月のガブリエル・デ・バルセカの地図に基づきます。",
  "almoravid": "シャハーダ（信仰告白）を記した白い旗で、モロッコのムラービト朝（11世紀から12世紀）の旗とされますが、ページはその説に疑いを示しています。",
  "ayyubid": "アイユーブ朝の旗で、黄色で示されることが多いものです。",
  "saladin": "サラーフ・アッディーン（サラディン）の個人の軍旗です。",
  "morocco-medieval": "11世紀から13世紀のモロッコの旗です。",
  "wales-dragon": "15世紀のオワイン・グリンドゥール公が用いたウェールズの軍旗で、1400年に作られました。",
  "rostock-14c": "14世紀のロストックのハンザの旗です。",
  "swiss-cross": "スイスの旗の初期の形で、1470年代ごろから、誓約同盟軍の指揮下の部隊が戦場の目印として使いました。",
  "unterwalden-1309": "ウンターヴァルデン州の歴史的な旗です。",
  "ragusa-secondary": "ラグーザ共和国の副旗です。",
};

export { MEDIEVAL_FILES, SAYS_JA };
export type { MedievalFile };
