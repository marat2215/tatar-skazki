"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, PartyPopper, RotateCcw, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Bi, TT } from "@/components/bi";
import { Section } from "@/components/section";
import { Flashcard } from "@/components/flashcard";
import { Pronunciation } from "@/components/pronunciation";
import { demoWords } from "@/lib/content";
import { markLearned, markLesson } from "@/lib/progress";
import { speak } from "@/lib/audio";
import { S } from "@/lib/strings";

export function DemoLesson() {
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [done, setDone] = useState(false);
  const word = demoWords[i];
  const total = demoWords.length;

  const go = (n: number) => {
    setFlipped(false);
    setI(n);
  };
  const know = () => {
    markLearned(word.tt);
    if (i + 1 < total) go(i + 1);
    else {
      markLesson();
      setDone(true);
    }
  };
  const restart = () => {
    setDone(false);
    go(0);
  };

  return (
    <Section id="learn" labelledBy="demo-title">
      <div className="mx-auto max-w-xl">
        <h2 id="demo-title" className="text-center text-3xl">
          <Bi line={S.demoTitle} />
        </h2>
        <Bi line={S.demoLead} as="p" className="mt-3 text-center text-muted-foreground" subClassName="text-xs" />

        <Card className="mt-8 p-4 sm:p-6">
          <div className="mb-4 flex items-center gap-3">
            <Progress value={((done ? total : i) / total) * 100} label="Урок" />
            <span className="shrink-0 text-sm tabular-nums text-muted-foreground">
              {done ? total : i + 1}/{total}
            </span>
          </div>

          <AnimatePresence mode="wait" initial={false}>
            {done ? (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="flex flex-col items-center gap-4 py-10 text-center"
              >
                <span className="flex size-14 items-center justify-center rounded-card bg-accent/15 text-accent-foreground dark:text-accent">
                  <PartyPopper className="size-7" aria-hidden />
                </span>
                <Bi line={S.done} className="text-xl font-semibold" subClassName="text-sm" />
                <Button variant="outline" onClick={restart}>
                  <RotateCcw aria-hidden />
                  <TT line={S.again} />
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key={word.tt}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="flex flex-col gap-6"
              >
                <Flashcard word={word} flipped={flipped} onFlip={() => setFlipped((f) => !f)} />
                <div className="flex justify-center">
                  <Button variant="ghost" onClick={() => void speak(word.tt)}>
                    <Volume2 aria-hidden />
                    <TT line={S.listen} />
                  </Button>
                </div>
                <Pronunciation target={word.tt} onSuccess={() => undefined} />
                <div className="flex items-center justify-between gap-2 border-t pt-4">
                  <Button variant="ghost" onClick={() => go(Math.max(0, i - 1))} disabled={i === 0}>
                    <ArrowLeft aria-hidden />
                    <TT line={S.prev} />
                  </Button>
                  <Button onClick={know}>
                    <Check aria-hidden />
                    <TT line={S.know} />
                    <ArrowRight aria-hidden />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </div>
    </Section>
  );
}
