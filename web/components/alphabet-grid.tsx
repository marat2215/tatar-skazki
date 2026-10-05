"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Bi } from "@/components/bi";
import { PlayButton } from "@/components/play-button";
import { ALPHABET, type Letter } from "@/lib/alphabet";
import { words } from "@/lib/content";
import { useI18n } from "@/lib/i18n";
import { S } from "@/lib/strings";
import { cn } from "@/lib/utils";

const exampleFor = (l: Letter) => words.find((w) => w.tt.toLowerCase().startsWith(l.cyr.toLowerCase()));

export function AlphabetGrid() {
  const [active, setActive] = useState<Letter>(ALPHABET[1]);
  const { tt, sub, locale } = useI18n();
  const ex = exampleFor(active);

  return (
    <div className="mx-auto grid w-full max-w-content gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
      <ul className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-7 xl:grid-cols-8" aria-label="Әлифба">
        {ALPHABET.map((l) => (
          <li key={l.cyr}>
            <button
              type="button"
              onClick={() => setActive(l)}
              aria-pressed={active.cyr === l.cyr}
              className={cn(
                "relative flex aspect-square w-full flex-col items-center justify-center rounded-card border bg-card shadow-soft transition-colors duration-150 ease-out hover:border-primary",
                active.cyr === l.cyr && "border-primary bg-primary text-primary-foreground",
              )}
            >
              <span className="font-tt text-2xl font-semibold">{l.cyr}</span>
              <span className={cn("text-xs", active.cyr === l.cyr ? "text-primary-foreground/80" : "text-muted-foreground")}>{l.lat}</span>
              {l.special && <span className="absolute right-2 top-2 size-1.5 rounded-full bg-accent" aria-label={S.special.ru} />}
            </button>
          </li>
        ))}
      </ul>

      <div className="lg:sticky lg:top-24 lg:self-start">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={active.cyr} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18, ease: "easeOut" }}>
            <Card className="p-6" aria-live="polite">
              <div className="flex items-baseline gap-4">
                <span className="font-tt text-6xl font-semibold">{active.cyr}{active.cyr.toLowerCase()}</span>
                <span className="text-2xl text-muted-foreground">{active.lat}</span>
              </div>
              {active.special && (
                <div className="mt-4 rounded-btn bg-accent/15 p-3 text-sm">
                  <span className="mb-1 inline-flex items-center gap-1.5 font-semibold">
                    <Sparkles className="size-4" aria-hidden /> <Bi line={S.special} className="inline" />
                  </span>
                  <p className="text-muted-foreground">{locale === "en" ? active.special.en : active.special.ru}</p>
                </div>
              )}
              {ex && (
                <div className="mt-6 flex items-center gap-3 border-t pt-4">
                  <PlayButton text={ex.tt} />
                  <div>
                    <div className="text-xs text-muted-foreground">{tt(S.example.tt)}{sub(S.example) ? ` · ${sub(S.example)}` : ""}</div>
                    <div lang="tt" className="font-tt text-lg font-semibold">{tt(ex.tt)}</div>
                    <div className="text-sm text-muted-foreground">{locale === "en" ? ex.en : ex.ru}</div>
                  </div>
                </div>
              )}
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
