// Уровни, бейджи и серии — считаются из прогресса ученика (всё хранится в браузере).
import { words } from "./content";
import type { Progress } from "./progress";

type T = { ru: string; en: string };

export const LEVELS: { min: number; tt: string; t: T; ava: string; color: string; reward: T }[] = [
  { min: 0, tt: "Яңа башлаучы", t: { ru: "Новичок", en: "Beginner" }, ava: "🐣", color: "#D4A574", reward: { ru: "Баем-котёнок и тема «Знакомство»", en: "Kitten Bayem and the “Greetings” theme" } },
  { min: 10, tt: "Шәкерт", t: { ru: "Ученик", en: "Student" }, ava: "📖", color: "#C4704F", reward: { ru: "Тюбетейка для Баема и диалоги «Кафе»", en: "A skullcap for Bayem and “Café” dialogues" } },
  { min: 50, tt: "Белгеч", t: { ru: "Знаток", en: "Expert" }, ava: "🦉", color: "#2E7D5B", reward: { ru: "Курай для Баема и легенды", en: "A kuray for Bayem and legends" } },
  { min: 150, tt: "Тел сакчысы", t: { ru: "Хранитель языка", en: "Keeper of the language" }, ava: "🕌", color: "#1E3A5F", reward: { ru: "Камзол с орнаментом и золотая тема", en: "An ornamented kamzol and the gold theme" } },
];

export function levelOf(learned: number) {
  let i = 0;
  LEVELS.forEach((l, k) => { if (learned >= l.min) i = k; });
  const next = LEVELS[i + 1];
  return { i, cur: LEVELS[i], next, pct: next ? ((learned - LEVELS[i].min) / (next.min - LEVELS[i].min)) * 100 : 100 };
}

export const STREAK_MILESTONES: { days: number; t: T; ico: string }[] = [
  { days: 1, t: { ru: "Начало", en: "Start" }, ico: "🌱" },
  { days: 3, t: { ru: "Три дня", en: "Three days" }, ico: "🔥" },
  { days: 7, t: { ru: "Неделя", en: "A week" }, ico: "🌙" },
  { days: 30, t: { ru: "Месяц", en: "A month" }, ico: "⭐" },
  { days: 100, t: { ru: "Легенда", en: "Legend" }, ico: "👑" },
];

export type Ctx = { p: Progress; streak: number; units: string[]; early: boolean; night: boolean; gameXp: number; tower: number };

const topicDone = (c: Ctx, topic: string) => {
  const ws = words.filter((w) => w.topic === topic);
  return ws.length > 0 && ws.filter((w) => c.p.learned.includes(w.tt)).length >= Math.min(ws.length, 8);
};

export const BADGES: { id: string; ico: string; tt: string; t: T; how: T; ok: (c: Ctx) => boolean }[] = [
  { id: "first", ico: "👣", tt: "Беренче адым", t: { ru: "Первый урок", en: "First lesson" }, how: { ru: "Пройди первый урок", en: "Finish your first lesson" }, ok: (c) => c.p.lessonsDone >= 1 },
  { id: "week", ico: "🔥", tt: "Атна", t: { ru: "7 дней подряд", en: "7-day streak" }, how: { ru: "Занимайся 7 дней подряд", en: "Learn 7 days in a row" }, ok: (c) => c.streak >= 7 },
  { id: "month", ico: "🌙", tt: "Ай", t: { ru: "30 дней подряд", en: "30-day streak" }, how: { ru: "30 дней без пропусков", en: "30 days without a break" }, ok: (c) => c.streak >= 30 },
  { id: "w100", ico: "💯", tt: "Йөз сүз", t: { ru: "100 слов", en: "100 words" }, how: { ru: "Выучи 100 слов", en: "Learn 100 words" }, ok: (c) => c.p.learned.length >= 100 },
  { id: "food", ico: "🍯", tt: "Тәмле", t: { ru: "Знаю всё о еде", en: "Food expert" }, how: { ru: "Выучи слова темы «Еда»", en: "Learn the Food words" }, ok: (c) => topicDone(c, "food") },
  { id: "cafe", ico: "☕", tt: "Кафеда", t: { ru: "Могу заказать в кафе", en: "Can order in a café" }, how: { ru: "Пройди этап «Еда»", en: "Finish the Food stage" }, ok: (c) => c.units.includes("food") },
  { id: "family", ico: "👨‍👩‍👧", tt: "Гаилә", t: { ru: "Знаю семью", en: "Family" }, how: { ru: "Выучи слова «Семья»", en: "Learn the Family words" }, ok: (c) => topicDone(c, "family") },
  { id: "city", ico: "🏙", tt: "Шәһәр", t: { ru: "Знаю город", en: "City" }, how: { ru: "Выучи слова «Дом и село»", en: "Learn Home & village words" }, ok: (c) => topicDone(c, "home") },
  { id: "nature", ico: "🌲", tt: "Табигать", t: { ru: "Знаю природу", en: "Nature" }, how: { ru: "Выучи слова «Природа»", en: "Learn the Nature words" }, ok: (c) => topicDone(c, "nature") },
  { id: "feel", ico: "💛", tt: "Хисләр", t: { ru: "Знаю чувства", en: "Feelings" }, how: { ru: "Пройди 6-й этаж башни", en: "Clear floor 6 of the tower" }, ok: (c) => c.tower >= 7 },
  { id: "time", ico: "🕰", tt: "Вакыт", t: { ru: "Знаю время", en: "Time" }, how: { ru: "Выучи слова «Время»", en: "Learn the Time words" }, ok: (c) => topicDone(c, "time") },
  { id: "kamil", ico: "💎", tt: "Камил", t: { ru: "Камил — без ошибок", en: "Flawless" }, how: { ru: "Пройди 5 этапов пути", en: "Finish 5 path stages" }, ok: (c) => c.units.length >= 5 },
  { id: "poly", ico: "🌍", tt: "Полиглот", t: { ru: "Полиглот", en: "Polyglot" }, how: { ru: "Выучи все слова сайта", en: "Learn every word on the site" }, ok: (c) => c.p.learned.length >= words.length },
  { id: "night", ico: "🦉", tt: "Төнге шәкерт", t: { ru: "Ночной ученик", en: "Night owl" }, how: { ru: "Позанимайся после 23:00", en: "Study after 11 pm" }, ok: (c) => c.night },
  { id: "early", ico: "🐓", tt: "Иртәнге кош", t: { ru: "Ранняя птица", en: "Early bird" }, how: { ru: "Позанимайся до 8:00", en: "Study before 8 am" }, ok: (c) => c.early },
  { id: "friend", ico: "🐈", tt: "Баем дусты", t: { ru: "Друг Баема", en: "Bayem's friend" }, how: { ru: "Набери 100 очков в играх", en: "Score 100 points in games" }, ok: (c) => c.gameXp >= 100 },
  { id: "sabantuy", ico: "🏆", tt: "Сабантуй", t: { ru: "Сабантуй", en: "Sabantuy" }, how: { ru: "Дойди до финала пути", en: "Reach the end of the path" }, ok: (c) => c.units.includes("sabantuy") },
  { id: "kuray", ico: "🎵", tt: "Курай", t: { ru: "Курай", en: "Kuray" }, how: { ru: "Пройди 10 уроков", en: "Finish 10 lessons" }, ok: (c) => c.p.lessonsDone >= 10 },
  { id: "chakchak", ico: "🍯", tt: "Чәк-чәк", t: { ru: "Чак-чак", en: "Chak-chak" }, how: { ru: "Выучи 50 слов", en: "Learn 50 words" }, ok: (c) => c.p.learned.length >= 50 },
  { id: "keeper", ico: "🕌", tt: "Тел сакчысы", t: { ru: "Хранитель", en: "Keeper" }, how: { ru: "Выучи 150 слов", en: "Learn 150 words" }, ok: (c) => c.p.learned.length >= Math.min(150, words.length) },
];
