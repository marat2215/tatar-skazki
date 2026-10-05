"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Hud } from "@/components/games/hud";
import { GameOver } from "@/components/games/game-over";
import { Bi } from "@/components/bi";
import { words, type Word } from "@/lib/content";
import { finishGame, optionsFor, shuffle } from "@/lib/game";
import { markLearned } from "@/lib/progress";
import { speak } from "@/lib/audio";
import { useI18n } from "@/lib/i18n";
import { S } from "@/lib/strings";
import { cn } from "@/lib/utils";

const LIMIT = 8;
type Q = { word: Word; options: Word[] };

/** speed — слово на экране, выбрать перевод на время; ear — слово звучит, выбрать написание */
export function QuizGame({ mode, onBack }: { mode: "speed" | "ear"; onBack: () => void }) {
  const { tt, pick } = useI18n();
  const deck = useRef<Word[]>([]);
  const [q, setQ] = useState<Q | null>(null);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [lives, setLives] = useState(3);
  const [time, setTime] = useState(LIMIT);
  const [picked, setPicked] = useState<string | null>(null);
  const [over, setOver] = useState<{ record: boolean } | null>(null);

  const nextQ = useCallback(() => {
    if (deck.current.length === 0) deck.current = shuffle(words);
    const w = deck.current.pop()!;
    setQ({ word: w, options: optionsFor(w) });
    setPicked(null);
    setTime(LIMIT);
    if (mode === "ear") window.setTimeout(() => void speak(w.tt), 250);
  }, [mode]);

  const start = useCallback(() => {
    deck.current = shuffle(words);
    setScore(0); setCombo(0); setLives(3); setOver(null);
    nextQ();
  }, [nextQ]);

  useEffect(() => start(), [start]);

  const answer = useCallback(
    (w: Word | null) => {
      if (!q || picked || over) return;
      const ok = w?.tt === q.word.tt;
      setPicked(w?.tt ?? "—");
      let left = lives;
      let total = score;
      if (ok) {
        const c = combo + 1;
        total = score + 10 * Math.min(c, 5);
        setCombo(c); setScore(total);
        markLearned(q.word.tt);
        if (mode === "speed") void speak(q.word.tt);
      } else {
        left = lives - 1;
        setCombo(0); setLives(left);
      }
      window.setTimeout(() => {
        if (left <= 0) setOver({ record: finishGame(mode, total) });
        else nextQ();
      }, ok ? 650 : 1300);
    },
    [q, picked, over, lives, score, combo, mode, nextQ],
  );

  // таймер только в «Быстром ответе»
  useEffect(() => {
    if (mode !== "speed" || !q || picked || over) return;
    if (time <= 0) { answer(null); return; }
    const t = window.setTimeout(() => setTime((s) => s - 1), 1000);
    return () => window.clearTimeout(t);
  }, [mode, q, picked, over, time, answer]);

  if (over) return <GameOver score={score} record={over.record} onAgain={start} onBack={onBack} />;
  if (!q) return null;

  return (
    <div>
      <Hud score={score} combo={combo} lives={lives} time={mode === "speed" ? time : undefined} />
      {mode === "speed" && (
        <div className="mb-2 h-1.5 overflow-hidden rounded-full bg-muted">
          <motion.div className="h-full bg-accent" animate={{ width: `${(time / LIMIT) * 100}%` }} transition={{ duration: 0.3 }} />
        </div>
      )}
      <AnimatePresence mode="wait">
        <motion.div key={q.word.tt} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.18 }}>
          <div className="my-6 flex flex-col items-center gap-3">
            {mode === "speed" ? (
              <div lang="tt" className="font-tt text-4xl font-semibold">{tt(q.word.tt)}</div>
            ) : (
              <>
                <Bi line={S.question} className="text-center font-semibold" subClassName="text-sm" />
                <Button size="icon" className="size-20 rounded-full" aria-label="play" onClick={() => void speak(q.word.tt)}>
                  <Volume2 className="!size-8" aria-hidden />
                </Button>
              </>
            )}
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {q.options.map((o) => {
              const right = picked && o.tt === q.word.tt;
              const wrong = picked === o.tt && !right;
              return (
                <motion.button
                  key={o.tt}
                  type="button"
                  whileTap={{ scale: 0.97 }}
                  animate={wrong ? { x: [0, -8, 8, -5, 5, 0] } : {}}
                  disabled={!!picked}
                  onClick={() => answer(o)}
                  className={cn(
                    "min-h-14 rounded-btn border-2 bg-card px-4 py-3 text-lg font-medium transition-colors hover:border-primary",
                    mode === "ear" && "font-tt",
                    right && "border-success bg-success/15",
                    wrong && "border-danger bg-danger/10",
                  )}
                >
                  {mode === "speed" ? pick(o) : <span lang="tt">{tt(o.tt)}</span>}
                </motion.button>
              );
            })}
          </div>
          {picked && mode === "ear" && <p className="mt-4 text-center text-muted-foreground">{tt(q.word.tt)} — {pick(q.word)}</p>}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
