"use client";

import { useEffect, useState } from "react";
import { lessons, words, type Phrase, type Word } from "./content";

// Путь ученика: этапы от «Исәнмесез» до Сабантуя. Каждый этап = 5 минут:
// слова темы → проверка → фразы → «а ты знал?».
type T = { ru: string; en: string };
export type Unit = { id: string; emoji: string; tt: string; t: T; topic: string; lesson?: string; fact: T };

export const UNITS: Unit[] = [
  { id: "hello", emoji: "👋", tt: "Исәнмесез", t: { ru: "Приветствия", en: "Greetings" }, topic: "words", lesson: "Сәламләү",
    fact: { ru: "«Исәнмесез» дословно значит «здоровы ли вы?». Старших приветствуют на «вы», друзей — просто «Сәлам!».", en: "“Isänmesez” literally means “are you well?”. Elders get the polite form, friends a simple “Sälam!”." } },
  { id: "family", emoji: "👨‍👩‍👧", tt: "Гаилә", t: { ru: "Семья", en: "Family" }, topic: "family", lesson: "Гаилә",
    fact: { ru: "«Абый» и «апа» говорят не только брату и сестре, но и любому старшему — это знак уважения.", en: "“Abıy” and “apa” are said not only to siblings but to any elder — a sign of respect." } },
  { id: "num", emoji: "🔢", tt: "Саннар", t: { ru: "Числа", en: "Numbers" }, topic: "num",
    fact: { ru: "Татарские числа похожи на турецкие: бер — bir, ике — iki, өч — üç. Языки — родственники!", en: "Tatar numbers resemble Turkish ones: ber — bir, ike — iki, öç — üç. The languages are relatives!" } },
  { id: "food", emoji: "🍯", tt: "Ашамлык", t: { ru: "Еда", en: "Food" }, topic: "food", lesson: "Кибеттә",
    fact: { ru: "Чак-чак дарят на свадьбу — чтобы жизнь молодых была сладкой. А чай пьют с молоком.", en: "Chak-chak is a wedding gift — so the couple's life is sweet. Tea is drunk with milk." } },
  { id: "home", emoji: "🏡", tt: "Өй", t: { ru: "Дом и село", en: "Home & village" }, topic: "home", lesson: "Өйдә",
    fact: { ru: "В татарском доме гостя сразу сажают за стол: «Әйдәгез, чәй эчәбез!» — «Проходите, попьём чаю!».", en: "In a Tatar home a guest is seated at the table at once: “Äydägez, çäy eçäbez!” — “Come, let's have tea!”." } },
  { id: "color", emoji: "🎨", tt: "Төсләр", t: { ru: "Цвета", en: "Colours" }, topic: "color",
    fact: { ru: "В татарском орнаменте главные цвета — красный, зелёный и золотой: тюльпаны на ичигах и тюбетейках.", en: "The main colours of Tatar ornament are red, green and gold — tulips on boots and skullcaps." } },
  { id: "nature", emoji: "🌲", tt: "Табигать", t: { ru: "Природа", en: "Nature" }, topic: "nature",
    fact: { ru: "Волга по-татарски — Идел, а Кама — Чулман. Казань стоит у их слияния.", en: "The Volga in Tatar is İdel, the Kama is Çulman. Kazan stands near where they meet." } },
  { id: "animal", emoji: "🐾", tt: "Хайваннар", t: { ru: "Животные", en: "Animals" }, topic: "animal",
    fact: { ru: "Шүрәле — лесной дух из поэмы Тукая. Его обманул дровосек Былтыр, зажав пальцы в бревне.", en: "Şüräle is a forest spirit from Tuqay's poem, tricked by the woodcutter Bıltır." } },
  { id: "body", emoji: "🖐", tt: "Тән", t: { ru: "Тело", en: "Body" }, topic: "body",
    fact: { ru: "«Йөрәк» — сердце. «Йөрәгем белән» — «всем сердцем», так говорят о самом искреннем.", en: "“Yöräk” is heart. “Yörägem belän” — “with all my heart”." } },
  { id: "time", emoji: "🕰", tt: "Вакыт", t: { ru: "Время", en: "Time" }, topic: "time",
    fact: { ru: "Пятница — «җомга»: в этот день на Сабантуй и праздники собирается вся родня.", en: "Friday is “comğa” — a day when families gather." } },
  { id: "verb", emoji: "🏃", tt: "Хәрәкәт", t: { ru: "Действия", en: "Actions" }, topic: "verb",
    fact: { ru: "В татарском глагол всегда в конце: «Мин чәй эчәм» — «Я чай пью».", en: "In Tatar the verb comes last: “Min çäy eçäm” — “I tea drink”." } },
  { id: "sabantuy", emoji: "🐓", tt: "Сабантуй", t: { ru: "Финал: Сабантуй", en: "Finale: Sabantuy" }, topic: "*",
    fact: { ru: "Сабантуй — «праздник плуга». На вершине столба-баганы часто ждёт живой петух!", en: "Sabantuy is the “plough feast”. A live rooster often waits atop the pole!" } },
];

export function unitWords(u: Unit): Word[] {
  if (u.topic === "*") return words.filter((_, i) => i % 9 === 0).slice(0, 8);
  return words.filter((w) => w.topic === u.topic).slice(0, 8);
}
export function unitPhrases(u: Unit): Phrase[] {
  const les = lessons.find((l) => l.tt === u.lesson);
  return (les?.items ?? []).slice(0, 4);
}

const KEY = "tt.path.v1";
type PathState = { done: string[] };
const listeners = new Set<(s: PathState) => void>();
function load(): PathState {
  try { return { done: [], ...(JSON.parse(localStorage.getItem(KEY) ?? "{}") as Partial<PathState>) }; } catch { return { done: [] }; }
}
export function completeUnit(id: string) {
  const s = load();
  if (!s.done.includes(id)) s.done.push(id);
  try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* ignore */ }
  listeners.forEach((fn) => fn(s));
}
export function usePath(): PathState | null {
  const [s, setS] = useState<PathState | null>(null);
  useEffect(() => { setS(load()); listeners.add(setS); return () => void listeners.delete(setS); }, []);
  return s;
}
/** Индекс текущего (первого непройденного) этапа */
export const currentIndex = (done: string[]) => Math.max(0, UNITS.findIndex((u) => !done.includes(u.id)) === -1 ? UNITS.length - 1 : UNITS.findIndex((u) => !done.includes(u.id)));
