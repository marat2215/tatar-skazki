"use client";

import { useEffect, useState } from "react";
import { words, type Word } from "./content";

// Очки и рекорды игр — в localStorage, без регистрации
export type Mode = "match" | "speed" | "ear";
type GameState = { xp: number; best: Partial<Record<Mode, number>> };
const KEY = "tt.game.v1";
const listeners = new Set<(s: GameState) => void>();
let state: GameState | null = null;

function load(): GameState {
  if (state) return state;
  try {
    state = { xp: 0, best: {}, ...(JSON.parse(localStorage.getItem(KEY) ?? "{}") as Partial<GameState>) };
  } catch {
    state = { xp: 0, best: {} };
  }
  return state;
}

/** Записать результат партии; вернёт true, если это новый рекорд */
export function finishGame(mode: Mode, score: number): boolean {
  const s = load();
  const record = score > (s.best[mode] ?? 0);
  state = { xp: s.xp + score, best: record ? { ...s.best, [mode]: score } : s.best };
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* ignore */ }
  listeners.forEach((fn) => fn(state!));
  return record;
}

export function useGame(): GameState | null {
  const [s, setS] = useState<GameState | null>(null);
  useEffect(() => {
    setS(load());
    listeners.add(setS);
    return () => void listeners.delete(setS);
  }, []);
  return s;
}

/** Уровень: каждый следующий требует на 100 очков больше */
export function levelOf(xp: number) {
  let level = 1, need = 100, rest = xp;
  while (rest >= need) { rest -= need; level++; need += 100; }
  return { level, into: rest, need };
}

export const shuffle = <T,>(a: T[]) => {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
};

export const sample = (n: number, from: Word[] = words) => shuffle(from).slice(0, n);
export const optionsFor = (w: Word) => shuffle([w, ...sample(3, words.filter((x) => x.tt !== w.tt))]);
