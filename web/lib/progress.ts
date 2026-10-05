"use client";

import { useEffect, useState } from "react";

// Прогресс хранится в браузере ученика (localStorage) — без регистрации.
export type Progress = {
  learned: string[];
  lessonsDone: number;
  /** YYYY-MM-DD → сколько действий за день */
  days: Record<string, number>;
};

const KEY = "tt.progress.v1";
const empty: Progress = { learned: [], lessonsDone: 0, days: {} };
const listeners = new Set<(p: Progress) => void>();
let state: Progress | null = null;

const today = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

function load(): Progress {
  if (state) return state;
  try {
    const raw = localStorage.getItem(KEY);
    state = raw ? { ...empty, ...(JSON.parse(raw) as Progress) } : { ...empty };
  } catch {
    state = { ...empty };
  }
  return state;
}

function save(next: Progress) {
  state = next;
  try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* ignore */ }
  listeners.forEach((fn) => fn(next));
}

function bump(p: Progress): Progress["days"] {
  const d = today();
  return { ...p.days, [d]: (p.days[d] ?? 0) + 1 };
}

export function markLearned(word: string) {
  const p = load();
  if (p.learned.includes(word)) return save({ ...p, days: bump(p) });
  save({ ...p, learned: [...p.learned, word], days: bump(p) });
}

export function markLesson() {
  const p = load();
  save({ ...p, lessonsDone: p.lessonsDone + 1, days: bump(p) });
}

export function streakOf(p: Progress): number {
  let n = 0;
  const d = new Date();
  if (!p.days[today(d)]) d.setDate(d.getDate() - 1); // сегодня ещё не занимались — считаем со вчера
  while (p.days[today(d)]) {
    n++;
    d.setDate(d.getDate() - 1);
  }
  return n;
}

export function lastDays(p: Progress, count = 14) {
  const out: { day: string; label: string; value: number }[] = [];
  const d = new Date();
  d.setDate(d.getDate() - (count - 1));
  for (let i = 0; i < count; i++) {
    const key = today(d);
    out.push({ day: key, label: `${d.getDate()}.${String(d.getMonth() + 1).padStart(2, "0")}`, value: p.days[key] ?? 0 });
    d.setDate(d.getDate() + 1);
  }
  return out;
}

/** null — пока данные не прочитаны (показываем skeleton) */
export function useProgress(): Progress | null {
  const [p, setP] = useState<Progress | null>(null);
  useEffect(() => {
    setP(load());
    listeners.add(setP);
    return () => { listeners.delete(setP); };
  }, []);
  return p;
}
