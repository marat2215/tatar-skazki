"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Ear, ExternalLink, Shuffle, Trophy, Zap, type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Bi, TT } from "@/components/bi";
import { MatchGame } from "@/components/games/match-game";
import { QuizGame } from "@/components/games/quiz-game";
import { levelOf, useGame, type Mode } from "@/lib/game";
import { UI as TOWER } from "@/lib/tower-data";
import { useI18n } from "@/lib/i18n";
import { S, type Line } from "@/lib/strings";

const MODES: { id: Mode; icon: LucideIcon; title: Line; text: Line }[] = [
  { id: "match", icon: Shuffle, title: S.gameMatch, text: S.gameMatchD },
  { id: "speed", icon: Zap, title: S.gameSpeed, text: S.gameSpeedD },
  { id: "ear", icon: Ear, title: S.gameEar, text: S.gameEarD },
];

const CLASSIC = [
  { href: "/games/echpochmak.html", emoji: "🥟", name: "Эчпочмак" },
  { href: "/games/shurale.html", emoji: "🌲", name: "Шүрәле" },
  { href: "/games/suz.html", emoji: "🔤", name: "Сүз уены" },
];

export function GameHub() {
  const g = useGame();
  const { pick } = useI18n();
  const [mode, setMode] = useState<Mode | null>(null);
  const lv = levelOf(g?.xp ?? 0);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
      <Card className="mb-6 flex items-center gap-4 p-5">
        <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-accent text-2xl font-bold text-accent-foreground">{g ? lv.level : "…"}</span>
        <div className="flex-1">
          <div className="mb-1 flex justify-between text-sm font-semibold">
            <TT line={S.level} />
            {g ? <span className="tabular-nums text-muted-foreground">{lv.into}/{lv.need} <TT line={S.xp} /></span> : <Skeleton className="h-4 w-16" />}
          </div>
          <Progress value={(lv.into / lv.need) * 100} label="level" />
        </div>
      </Card>

      {mode ? (
        <Card className="p-5 sm:p-6">
          {mode === "match" ? <MatchGame onBack={() => setMode(null)} /> : <QuizGame key={mode} mode={mode} onBack={() => setMode(null)} />}
        </Card>
      ) : (
        <>
          <a href="/tower/" className="group mb-6 block">
            <Card className="relative flex items-center gap-5 overflow-hidden border-accent/60 bg-gradient-to-br from-primary/15 to-accent/15 p-6 transition-shadow group-hover:shadow-lift">
              <span className="text-6xl" aria-hidden>🕌</span>
              <div className="flex-1">
                <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-bold text-accent-foreground">NEW</span>
                <h3 className="mt-2 font-tt text-2xl font-semibold">Сөембикә манарасы</h3>
                <p className="font-semibold">{pick(TOWER.title)}</p>
                <p className="mt-1 text-sm text-muted-foreground">{pick(TOWER.lead)}</p>
              </div>
            </Card>
          </a>
          <div className="grid gap-4 sm:grid-cols-3">
            {MODES.map((m) => (
              <motion.button key={m.id} type="button" whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }} onClick={() => setMode(m.id)} className="text-left">
                <Card className="flex h-full flex-col gap-3 p-5 transition-shadow hover:shadow-lift">
                  <span className="flex size-12 items-center justify-center rounded-btn bg-primary text-primary-foreground"><m.icon className="size-6" aria-hidden /></span>
                  <Bi line={m.title} as="h3" className="text-lg font-semibold" />
                  <Bi line={m.text} as="p" className="text-sm text-muted-foreground" subClassName="text-xs" />
                  <span className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-accent-foreground dark:text-accent">
                    <Trophy className="size-4" aria-hidden /> <TT line={S.best} />: {g?.best[m.id] ?? 0}
                  </span>
                </Card>
              </motion.button>
            ))}
          </div>
          <Bi line={S.gameMore} as="h2" className="mb-3 mt-10 text-xl font-semibold" subClassName="text-sm" />
          <div className="grid gap-3 sm:grid-cols-3">
            {CLASSIC.map((c) => (
              <a key={c.href} href={c.href} className="flex items-center gap-3 rounded-card border bg-card p-4 font-tt font-semibold hover:border-primary">
                <span className="text-2xl" aria-hidden>{c.emoji}</span>{c.name}
                <ExternalLink className="ml-auto size-4 text-muted-foreground" aria-hidden />
              </a>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
