// The United States Navy's special signal pennants taken from Wikimedia Commons, as the package takes the military flags: each file's licence is
// read from Commons and only public domain and CC0 ship (scripts/licence.ts); the file is optimised and kept with its author and licence
// (scripts/draw-signals.ts). The fetch is scripts/fetch-tactical.ts. Every file is by Carl Lindberg, "per the U.S. Navy specification", and its
// page says it is ineligible for copyright (plain geometry, no original authorship). The meanings are general descriptions written for this
// package from the two references below; the Navy's own signal books, which this package does not hold, are the authority at sea.
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
  f("code-answer", "CodeAnswer", "Code or answering pennant (US Navy)", "コード旗・応答旗（米海軍）", "The answering pennant: hoisted at the dip to answer a hoist, and closed up when it is understood. Flown above a hoist by a warship, it says the hoist is to be read with its international meaning.", "応答旗です。信号に応答するときは半分まで上げ、理解したら一番上まで上げます。軍艦が信号の上に掲げると、その信号を国際信号書の意味で読むことを表します。"),
  f("corpen", "Corpen", "Course pennant (Corpen)", "針路旗（コーペン）", "The course pennant: followed by numerals, it gives a course for the ships to steer.", "針路旗です。数字旗が続くと、艦が進む針路を表します。"),
  f("designation", "Designation", "Designation pennant", "指定旗", "The designation pennant: the flags that follow name the ships or units the signal is for.", "指定旗です。続く旗が、その信号の宛先になる艦や部隊を表します。"),
  f("emergency", "Emergency", "Emergency pennant", "緊急旗", "The emergency pennant: the signal it is flown with is to be acted on as soon as it is understood.", "緊急旗です。この旗とともに掲げた信号は、理解したらすぐ実行します。"),
  f("formation", "Formation", "Formation pennant", "隊形旗", "The formation pennant: the flags that follow name a formation for the ships to take up.", "隊形旗です。続く旗が、艦がとる隊形を表します。"),
  f("interrogative", "Interrogative", "Interrogative pennant", "疑問旗", "The interrogative pennant: the signal is a question.", "疑問旗です。その信号が質問であることを表します。"),
  f("negative", "Negative", "Negative pennant", "否定旗", "The negative pennant: it makes the meaning of the hoist negative.", "否定旗です。信号の意味を否定にします。"),
  f("preparative", "Preparative", "Preparative pennant", "予令旗", "The preparative pennant: marks a signal that is a preparation, to be carried out later.", "予令旗です。あとで実行する、準備の信号であることを表します。"),
  f("screen", "Screen", "Screen pennant", "警戒旗", "The screen pennant: the flags that follow give an order to the screening ships.", "警戒旗です。続く旗が、警戒にあたる艦への命令を表します。"),
  f("speed", "Speed", "Speed pennant", "速力旗", "The speed pennant: followed by numerals, it gives a speed in knots.", "速力旗です。数字旗が続くと、ノットで表した速力を表します。"),
  f("starboard", "Starboard", "Starboard pennant", "右舷旗", "The starboard pennant: to starboard. With the turn pennant, TURN STARBOARD 15 is an order for the ships to turn together 150 degrees to starboard.", "右舷旗です。右舷へ、を表します。回頭旗と組み合わせ、「回頭、右舷、15」なら、艦がそろって右舷へ150度回頭する命令です。"),
  f("station", "Station", "Station pennant", "配置旗", "The station pennant: the flags that follow name the station a ship is to take.", "配置旗です。続く旗が、艦がつく配置を表します。"),
  f("subdivision", "Subdivision", "Subdivision pennant", "小隊旗", "The subdivision pennant: the numeral that follows says which subdivision of ships is meant.", "小隊旗です。続く数字旗が、どの小隊の艦かを表します。"),
  f("substitute-1", "Substitute1", "First substitute (US Navy)", "第1代表旗（米海軍）", "Repeats the first flag of a hoist, so that a flag need not be flown twice.", "信号の最初の旗をくり返すことを表します。同じ旗を2度掲げずにすみます。"),
  f("substitute-2", "Substitute2", "Second substitute (US Navy)", "第2代表旗（米海軍）", "Repeats the second flag of a hoist.", "信号の2番目の旗をくり返すことを表します。"),
  f("substitute-3", "Substitute3", "Third substitute (US Navy)", "第3代表旗（米海軍）", "Repeats the third flag of a hoist.", "信号の3番目の旗をくり返すことを表します。"),
  f("substitute-4", "Substitute4", "Fourth substitute (US Navy)", "第4代表旗（米海軍）", "Repeats the fourth flag of a hoist; the Navy's tactical signals have a fourth substitute that the International Code lacks.", "信号の4番目の旗をくり返すことを表します。米海軍の戦術信号には、国際信号書にない第4代表旗があります。"),
  f("turn", "Turn", "Turn pennant", "回頭旗", "The turn pennant: an order for the ships to turn together, as the flags that follow say (TURN STARBOARD 15: turn together 150 degrees to starboard).", "回頭旗です。艦がそろって回頭する命令で、向きと角度は続く旗が示します（「回頭、右舷、15」なら、そろって右舷へ150度）。"),
];

export { TACTICAL_FILES };
export type { TacticalFile };
