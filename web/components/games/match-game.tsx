"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Hud } from "@/components/games/hud";
import { GameOver } from "@/components/games/game-over";
import { TT } from "@/components/bi";
import { type Word } from "@/lib/content";
import { finishGame, sample, shuffle } from "@/lib/game";
import { markLearned } from "@/lib/progress";
import { speak } from "@/lib/audio";
import { useI18n } from "@/lib/i18n";
import { S } from "@/lib/strings";
import { cn } from "@/lib/utils";

const PAIRS = 6;
const TIME = 60;

export function MatchGame({ onBack }: { onBack: () => void }) {
  const { tt, pick } = useI18n();
  const [round, setRound] = useState<{ left: Word[]; right: Word[] } | null>(null);
  const [done, setDone] = useState<string[]>([]);
  const [selL, setSelL] = useState<string | null>(null);
  const [selR, setSelR] = useState<string | null>(null);
  const [bad, setBad] = useState(false);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [time, setTime] = useState(TIME);
  const [over, setOver] = useState<{ record: boolean } | null>(null);

  const deal = () => {
    const w = sample(PAIRS);
    setRound({ left: w, right: shuffle(w) });
    setDone([]);
  };
  const start = useCallback(() => {
    deal(); setScore(0); setCombo(0); setTime(TIME); setOver(null); setSelL(null); setSelR(null);
  }, []);
  useEffect(() => start(), [start]);

  const end = useCallback((s: number) => setOver({ record: finishGame("match", s) }), []);

  useEffect(() => {
    if (over || !round) return;
    if (time <= 0) { end(score); return; }
    const t = window.setTimeout(() => setTime((s) => s - 1), 1000);
    return () => window.clearTimeout(t);
  }, [time, over, round, score, end]);

  // проверка выбранной пары
  useEffect(() => {
    if (!selL || !selR) return;
    if (selL === selR) {
      const c = combo + 1;
      setCombo(c);
      setScore((s) => s + 10 * Math.min(c, 5));
      markLearned(selL);
      const nd = [...done, selL];
      setDone(nd);
      setSelL(null); setSelR(null);
      if (nd.length === PAIRS) { setTime((t) => t + 15); window.setTimeout(deal, 400); }
    } else {
      setBad(true); setCombo(0);
      const t = window.setTimeout(() => { setBad(false); setSelL(null); setSelR(null); }, 600);
      return () => window.clearTimeout(t);
    }
  }, [selL, selR]); // eslint-disable-line react-hooks/exhaustive-deps

  if (over) return <GameOver score={score} record={over.record} onAgain={start} onBack={onBack} />;
  if (!round) return null;

  const cell = (active: boolean, gone: boolean) =>
    cn(
      "min-h-14 w-full rounded-btn border-2 bg-card px-3 py-2 text-base font-medium transition-colors hover:border-primary",
      active && (bad ? "border-danger bg-danger/10" : "border-primary bg-primary/10"),
      gone && "pointer-events-none opacity-0",
    );

  return (
    <div>
      <Hud score={score} combo={combo} time={time} />
      <p className="mb-4 text-center text-sm text-muted-foreground">{PAIRS - done.length} <TT line={S.pairsLeft} /></p>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          {round.left.map((w) => (
            <motion.button key={w.tt} type="button" layout whileTap={{ scale: 0.96 }} lang="tt"
              className={cn(cell(selL === w.tt, done.includes(w.tt)), "font-tt")}
              onClick={() => { setSelL(w.tt); void speak(w.tt); }}>
              {tt(w.tt)}
            </motion.button>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          {round.right.map((w) => (
            <motion.button key={w.tt} type="button" layout whileTap={{ scale: 0.96 }}
              className={cell(selR === w.tt, done.includes(w.tt))}
              onClick={() => setSelR(w.tt)}>
              {pick(w)}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
