"use client";

import { useEffect, useState } from "react";

// Ежедневные задания и мелкая статистика (ранняя птица, ночной ученик, заморозки).
export type Kind = "new" | "dialog" | "listen" | "review";
type Day = Record<Kind, number>;
export type Daily = { days: Record<string, Day>; early: boolean; night: boolean; frozen: string[] };

const KEY = "tt.daily.v1";
const empty: Daily = { days: {}, early: false, night: false, frozen: [] };
const listeners = new Set<(d: Daily) => void>();
export const dayKey = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

function load(): Daily {
  try { return { ...empty, ...(JSON.parse(localStorage.getItem(KEY) ?? "{}") as Partial<Daily>) }; } catch { return { ...empty }; }
}
function save(d: Daily) {
  try { localStorage.setItem(KEY, JSON.stringify(d)); } catch { /* ignore */ }
  listeners.forEach((fn) => fn(d));
}

export function bump(kind: Kind) {
  if (typeof window === "undefined") return;
  const d = load(), k = dayKey(), h = new Date().getHours();
  const day: Day = { ...{ new: 0, dialog: 0, listen: 0, review: 0 }, ...d.days[k] };
  day[kind]++;
  save({ ...d, days: { ...d.days, [k]: day }, early: d.early || h < 8, night: d.night || h >= 23 });
}

/** «Заморозка»: 1 раз в неделю спасает пропущенный вчерашний день */
export function applyFreeze(activeDays: Record<string, number>) {
  const d = load();
  const y = new Date(); y.setDate(y.getDate() - 1);
  const yk = dayKey(y), b = new Date(); b.setDate(b.getDate() - 2);
  if (activeDays[yk] || !activeDays[dayKey(b)] || d.frozen.includes(yk)) return d.frozen;
  const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7);
  if (d.frozen.some((f) => f >= dayKey(weekAgo))) return d.frozen;
  const frozen = [...d.frozen, yk];
  save({ ...d, frozen });
  return frozen;
}

export function useDaily(): Daily | null {
  const [d, setD] = useState<Daily | null>(null);
  useEffect(() => { setD(load()); listeners.add(setD); return () => void listeners.delete(setD); }, []);
  return d;
}

export const QUESTS: { kind: Kind; goal: number; xp: number; ru: string; en: string; ico: string }[] = [
  { kind: "new", goal: 3, xp: 10, ru: "Выучи 3 новых слова", en: "Learn 3 new words", ico: "🆕" },
  { kind: "dialog", goal: 1, xp: 15, ru: "Пройди 1 урок с фразами", en: "Finish 1 lesson with phrases", ico: "💬" },
  { kind: "listen", goal: 5, xp: 10, ru: "Послушай 5 фраз", en: "Listen to 5 phrases", ico: "🎧" },
  { kind: "review", goal: 10, xp: 10, ru: "Повтори 10 карточек", en: "Review 10 cards", ico: "🃏" },
];
