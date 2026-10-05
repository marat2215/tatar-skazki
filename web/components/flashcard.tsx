"use client";

import { motion } from "framer-motion";
import { RotateCw } from "lucide-react";
import { TT } from "@/components/bi";
import { useI18n } from "@/lib/i18n";
import { S } from "@/lib/strings";
import type { Word } from "@/lib/content";

type Props = { word: Word; flipped: boolean; onFlip: () => void };

/** Флешкарта: лицевая сторона — татарское слово, оборот — перевод */
export function Flashcard({ word, flipped, onFlip }: Props) {
  const { tt, script, pick } = useI18n();
  const translation = pick(word);
  return (
    <div className="perspective h-64 w-full sm:h-72">
      <motion.button
        type="button"
        onClick={onFlip}
        aria-pressed={flipped}
        aria-label={`${tt(word.tt)}. ${S.flip.ru}`}
        className="preserve-3d relative block h-full w-full rounded-card"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        <span className="backface-hidden absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-card border bg-card p-6 shadow-lift">
          <span lang="tt" className="font-tt text-4xl font-semibold sm:text-5xl">{tt(word.tt)}</span>
          {script === "lat" && <span className="text-sm text-muted-foreground">{word.tt}</span>}
          <span className="mt-2 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <RotateCw className="size-3.5" aria-hidden />
            <TT line={S.flip} />
          </span>
        </span>
        <span className="backface-hidden rotate-y-180 absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-card bg-primary p-6 text-primary-foreground shadow-lift">
          <span className="text-3xl font-semibold sm:text-4xl">{translation}</span>
          <span lang="tt" className="font-tt text-primary-foreground/80">{tt(word.tt)}</span>
        </span>
      </motion.button>
      <p className="sr-only" aria-live="polite">{flipped ? translation : ""}</p>
    </div>
  );
}
