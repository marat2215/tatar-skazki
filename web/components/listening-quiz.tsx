"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Headphones, RotateCcw, Volume2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Bi, TT } from "@/components/bi";
import { words, type Word } from "@/lib/content";
import { speak } from "@/lib/audio";
import { markLearned, markLesson } from "@/lib/progress";
import { useI18n } from "@/lib/i18n";
import { S } from "@/lib/strings";
import { cn } from "@/lib/utils";

const ROUNDS = 10;
const shuffle = <T,>(a: T[]) => {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
};
type Q = { word: Word; options: Word[] };
const makeQuiz = (): Q[] =>
  shuffle(words).slice(0, ROUNDS).map((w) => ({ word: w, options: shuffle([w, ...shuffle(words.filter((x) => x.tt !== w.tt)).slice(0, 3)]) }));

export function ListeningQuiz() {
  const { tt, pick: trl } = useI18n();
  const [quiz, setQuiz] = useState<Q[] | null>(null);
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  useEffect(() => setQuiz(makeQuiz()), []); // перемешиваем только в браузере

  const q = quiz?.[i];
  const finished = quiz !== null && i >= ROUNDS;

  const pick = useCallback(
    (w: Word) => {
      if (!q || picked) return;
      setPicked(w.tt);
      if (w.tt === q.word.tt) {
        setScore((s) => s + 1);
        markLearned(q.word.tt);
      }
      window.setTimeout(() => {
        setPicked(null);
        setI((n) => {
          if (n + 1 >= ROUNDS) markLesson();
          return n + 1;
        });
      }, 900);
    },
    [q, picked],
  );

  const restart = () => {
    setQuiz(makeQuiz());
    setI(0);
    setScore(0);
  };

  return (
    <div className="mx-auto w-full max-w-xl px-4 py-10 sm:px-6">
      <Card className="p-6">
        {quiz === null ? (
          <div className="flex flex-col gap-4">
            <Skeleton className="h-2 w-full" />
            <Skeleton className="mx-auto size-20 rounded-full" />
            {Array.from({ length: 4 }, (_, k) => <Skeleton key={k} className="h-12 w-full" />)}
          </div>
        ) : finished ? (
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <span className="flex size-14 items-center justify-center rounded-card bg-accent/15 text-accent-foreground dark:text-accent">
              <Headphones className="size-7" aria-hidden />
            </span>
            <Bi line={S.score} className="text-lg font-semibold" />
            <div className="text-4xl font-semibold tabular-nums">{score} / {ROUNDS}</div>
            <Button onClick={restart}>
              <RotateCcw aria-hidden />
              <TT line={S.again} />
            </Button>
          </div>
        ) : (
          q && (
            <>
              <div className="mb-6 flex items-center gap-3">
                <Progress value={(i / ROUNDS) * 100} label="Аудирование" />
                <span className="shrink-0 text-sm tabular-nums text-muted-foreground">{i + 1}/{ROUNDS}</span>
              </div>
              <Bi line={S.question} className="text-center text-lg font-semibold" subClassName="text-sm" />
              <div className="my-6 flex justify-center">
                <Button size="icon" className="size-20 rounded-full" aria-label={S.play.ru} onClick={() => void speak(q.word.tt)}>
                  <Volume2 className="!size-8" aria-hidden />
                </Button>
              </div>
              <AnimatePresence mode="wait" initial={false}>
                <motion.ul key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15, ease: "easeOut" }} className="grid gap-2">
                  {q.options.map((o) => {
                    const right = picked && o.tt === q.word.tt;
                    const wrong = picked === o.tt && o.tt !== q.word.tt;
                    return (
                      <li key={o.tt}>
                        <button
                          type="button"
                          disabled={!!picked}
                          onClick={() => pick(o)}
                          className={cn(
                            "flex h-12 w-full items-center justify-between rounded-btn border bg-card px-4 text-left font-tt text-lg transition-colors duration-150 ease-out hover:border-primary disabled:cursor-default",
                            right && "border-success bg-success/10",
                            wrong && "border-danger bg-danger/10",
                          )}
                        >
                          <span lang="tt">{tt(o.tt)}</span>
                          {right && <span className="inline-flex items-center gap-1 font-sans text-sm text-success"><Check className="size-4" aria-hidden />{trl(o)}</span>}
                          {wrong && <X className="size-4 text-danger" aria-label={S.wrong.ru} />}
                        </button>
                      </li>
                    );
                  })}
                </motion.ul>
              </AnimatePresence>
            </>
          )
        )}
      </Card>
    </div>
  );
}
