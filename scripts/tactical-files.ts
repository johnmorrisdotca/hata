// The United States Navy's special signal pennants taken from Wikimedia Commons, as the package takes the military flags: each file's licence is
// read from Commons and only public domain and CC0 ship (scripts/licence.ts); the file is optimised and kept with its author and licence
// (scripts/draw-signals.ts). The fetch is scripts/fetch-tactical.ts. Every file is by Carl Lindberg, "per the U.S. Navy specification", and its
// page says it is ineligible for copyright (plain geometry, no original authorship). The meanings follow, in general terms, the Navy's Signalman
// training manual, NAVEDTRA 14244 (navyaviation.tpub.com/14244: "Basic Maneuvering Flags", "Substitutes", "Correcting a Signal"), and the RCN's
// visual signalling page (jproc.ca/rrp/rrp2/visual_flags.html), which gives the Preparative, Designation, Interrogative, Emergency and Subdivision
// pennants their uses; the Navy's own signal books, which this package does not hold, are the authority at sea.
//
// The numeral pennants of the Navy's tactical signals are the International Code's own (`ics:0` to `ics:9`), so they are not repeated here.
interface TacticalFile {
  slug: string;
  file: string;
  name: { en: string; ja: string };
  meaning: { en: string; ja: string };
}

const f = (slug: string, file: string, en: string, ja: string, meaningEn: string, meaningJa: string): TacticalFile => ({
  slug,
  file: `SpecialSignalPennant-${file}-USNSpec.svg`,
  name: { en, ja },
  meaning: { en: meaningEn, ja: meaningJa },
});

const TACTICAL_FILES: readonly TacticalFile[] = [
  f("code-answer", "CodeAnswer", "Code or answering pennant (US Navy)", "コード旗・応答旗（米海軍）", "The answering pennant: hoisted at the dip to answer a hoist, and closed up when it is understood. In a group of numerals it is the decimal point (SPEED 1 6 ANS is 16.5 knots).", "応答旗です。信号に応えて半ばまで掲げ、意味がわかったら一杯に掲げます。数字旗の群では小数点になります（「速力、1、6、応答」は16.5ノット）。"),
  f("corpen", "Corpen", "Course pennant (Corpen)", "針路旗（コーペン）", "The course pennant: the ships alter course in succession, following one another round the turn as in a column wheel; with a modifier it gives the course of a formation. Numerals of fewer than three digits count in tens of degrees (CORPEN STBD 9 is a wheel of 90 degrees to starboard); three digits give the course to steady on.", "針路旗です。艦が1隻ずつ順に、前の艦に続いて針路を変えます（逐次回頭）。修飾する旗が付くと、隊形の針路を表します。3桁未満の数字旗は10度単位で、「コーペン、右舷、9」は右舷へ90度の逐次回頭、3桁なら落ち着く針路を表します。"),
  f("designation", "Designation", "Designation pennant", "指定旗", "The designation pennant: the flags that follow name or describe a unit, place or object.", "指定旗です。続く旗が、部隊、場所、物のいずれかを名指しするか、説明します。"),
  f("emergency", "Emergency", "Emergency pennant", "緊急旗", "The emergency pennant: a signal it precedes is to be acted on as soon as it is understood.", "緊急旗です。この旗に続く信号は、意味がわかったらすぐ実行します。"),
  f("formation", "Formation", "Formation pennant", "隊形旗", "The formation pennant (FORM): the flags that follow say how ships are to assemble or change formation, most often onto a line of bearing from the guide; with Port or Starboard the bearing is relative, in tens of degrees.", "隊形旗です。続く旗が、艦が集まるか隊形を変える方法を示し、多くは基準艦から見た方位線に並ぶ命令です。左舷旗か右舷旗が付くと相対方位で、10度単位です。"),
  f("interrogative", "Interrogative", "Interrogative pennant", "質問旗", "The interrogative pennant: the signal is a question. It is also the reply to a hoist that cannot be read or understood.", "質問旗です。その信号が質問であることを表します。読めない信号や、意味がわからない信号への返事にも使います。"),
  f("negative", "Negative", "Negative pennant", "否定旗", "The negative pennant: it makes the meaning of the hoist negative. Hoisted alone on an adjacent halyard, it cancels the signal.", "否定旗です。信号の意味を否定にします。隣の掲揚索に単独で掲げると、その信号を取り消します。"),
  f("preparative", "Preparative", "Preparative pennant", "予令旗", "The preparative pennant, \"prepare to\": the signal that follows says what to get ready for.", "予令旗です。「〜の用意」を表し、続く信号が、何の用意をするかを示します。"),
  f("screen", "Screen", "Screen pennant", "警戒旗", "The screen pennant: the flags that follow give a signal about the screen, the ships guarding the main body.", "警戒旗です。続く旗が、警戒陣（本隊を守る艦）についての信号を表します。"),
  f("speed", "Speed", "Speed pennant", "速力旗", "The speed pennant: the numerals that follow give a speed in knots, and the answering pennant is the decimal point (SPEED 1 6 ANS is 16.5 knots).", "速力旗です。続く数字旗が、ノットで表した速力を示し、応答旗は小数点です（「速力、1、6、応答」は16.5ノット）。"),
  f("starboard", "Starboard", "Starboard pennant", "右舷旗", "The starboard pennant: to starboard, the right side. It gives the direction in Turn, Corpen and Formation signals.", "右舷旗です。右舷（右側）を表します。回頭旗、針路旗、隊形旗とともに使い、向きを示します。"),
  f("station", "Station", "Station pennant", "配置旗", "The station pennant: assigns a ship its position in a formation, or moves it to another; with a distance signal it gives the distance from the guide.", "配置旗です。艦に隊形の中の位置を割り当てるか、別の位置へ移します。距離の信号と使うと、基準艦からの距離を表します。"),
  f("subdivision", "Subdivision", "Subdivision pennant", "小隊旗", "The subdivision pennant: addresses a subdivision of a formation; the flags that follow say which.", "小隊旗です。隊形の中の小隊に宛てることを表し、続く旗が、どの小隊かを示します。"),
  f("substitute-1", "Substitute1", "1st substitute (US Navy)", "第1代表旗（米海軍）", "Repeats the first flag or pennant of the hoist, so that none need be flown twice in it.", "信号の最初の旗を繰り返します。1つの信号で、同じ旗を2度掲げずにすみます。"),
  f("substitute-2", "Substitute2", "2nd substitute (US Navy)", "第2代表旗（米海軍）", "Repeats the second flag or pennant of the hoist.", "信号の2番目の旗を繰り返します。"),
  f("substitute-3", "Substitute3", "3rd substitute (US Navy)", "第3代表旗（米海軍）", "Repeats the third flag or pennant of the hoist.", "信号の3番目の旗を繰り返します。"),
  f("substitute-4", "Substitute4", "4th substitute (US Navy)", "第4代表旗（米海軍）", "Repeats the fourth flag or pennant of the hoist. The Navy has a fourth substitute that the International Code lacks.", "信号の4番目の旗を繰り返します。米海軍には、国際信号書にない第4代表旗があります。"),
  f("turn", "Turn", "Turn pennant", "回頭旗", "The turn pennant: the ships turn together, putting their rudders over at the execute signal, to port or starboard as the flags that follow say. Numerals of fewer than three digits count in tens of degrees (TURN STARBOARD 15 is a turn together of 150 degrees to starboard); three digits give the course to steady on.", "回頭旗です。艦が一斉に、実行の信号で舵を切り、続く旗が示す左舷か右舷へ回頭します（一斉回頭）。3桁未満の数字旗は10度単位で、「回頭、右舷、15」は右舷へ150度の一斉回頭、3桁なら落ち着く針路を表します。"),
];

export { TACTICAL_FILES };
export type { TacticalFile };
