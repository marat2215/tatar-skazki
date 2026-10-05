"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toLatin } from "./translit";

// Проверка произношения через Web Speech API (Chrome/Edge/Safari).
// Татарский распознаётся не везде, поэтому сравниваем латинские написания «по похожести».
type Rec = {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  abort: () => void;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
};
type RecCtor = new () => Rec;

const norm = (s: string) => toLatin(s.toLowerCase()).replace(/[^a-zäöüçşğıñ]/g, "");

function similarity(a: string, b: string): number {
  if (!a || !b) return 0;
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return 1 - dp[a.length][b.length] / Math.max(a.length, b.length);
}

export type PronState = "idle" | "listening" | "good" | "retry" | "unsupported";

export function usePronunciation(target: string) {
  const [state, setState] = useState<PronState>("idle");
  const rec = useRef<Rec | null>(null);

  useEffect(() => {
    setState("idle");
    return () => rec.current?.abort();
  }, [target]);

  const check = useCallback(() => {
    const w = window as unknown as { SpeechRecognition?: RecCtor; webkitSpeechRecognition?: RecCtor };
    const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
    if (!Ctor) return setState("unsupported");
    const r = new Ctor();
    r.lang = "tt-RU";
    r.interimResults = false;
    r.maxAlternatives = 5;
    let heard = false;
    r.onresult = (e) => {
      heard = true;
      const alts = Array.from(e.results[0] ?? [], (a) => a.transcript);
      const best = Math.max(0, ...alts.map((t) => similarity(norm(t), norm(target))));
      setState(best >= 0.6 ? "good" : "retry");
    };
    r.onerror = () => setState("unsupported");
    r.onend = () => setState((s) => (s === "listening" && !heard ? "retry" : s));
    rec.current = r;
    setState("listening");
    r.start();
  }, [target]);

  return { state, check, setState };
}
