"use client";

import { motion } from "framer-motion";
import { ArrowLeft, RotateCcw, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Bi, TT } from "@/components/bi";
import { S } from "@/lib/strings";

export function GameOver({ score, record, onAgain, onBack }: { score: number; record: boolean; onAgain: () => void; onBack: () => void }) {
  return (
    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center gap-4 py-6 text-center">
      <span className="flex size-16 items-center justify-center rounded-full bg-accent/20 text-accent-foreground dark:text-accent">
        <Trophy className="size-8" aria-hidden />
      </span>
      <Bi line={record ? S.newRecord : S.gameOver} className="text-xl font-semibold" />
      <div className="text-5xl font-semibold tabular-nums">+{score}</div>
      <TT line={S.xp} className="text-muted-foreground" />
      <div className="flex gap-2">
        <Button onClick={onAgain}><RotateCcw aria-hidden /><TT line={S.playAgain} /></Button>
        <Button variant="outline" onClick={onBack}><ArrowLeft aria-hidden /><TT line={S.back} /></Button>
      </div>
    </motion.div>
  );
}
