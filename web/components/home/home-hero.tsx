"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { Bayem, BayemSays } from "@/components/bayem";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n";
import { streakOf, useProgress } from "@/lib/progress";
import { UNITS, currentIndex, usePath } from "@/lib/path";
import { ding, purr } from "@/lib/sfx";

// Реплика Баема зависит от времени суток и прогресса
function greeting(hour: number, learned: number): { tt: string; ru: string; en: string } {
  if (learned >= 50) return { tt: "Афәрин!", ru: `Ты выучил ${learned} слов. Твоя әби гордилась бы!`, en: `You've learned ${learned} words. Your grandma would be proud!` };
  if (learned >= 10) return { tt: "Сәлам!", ru: `Уже ${learned} слов — продолжаем?`, en: `${learned} words already — shall we go on?` };
  if (hour < 12) return { tt: "Хәерле иртә!", ru: "Чай готов, слова тоже. 5 минут?", en: "Tea is ready, and so are the words. 5 minutes?" };
  if (hour >= 18) return { tt: "Хәерле кич!", ru: "Пять минут перед сном?", en: "Five minutes before bed?" };
  return { tt: "Исәнмесез!", ru: "Давай учиться вместе. Готов на 5 минут?", en: "Let's learn together. Ready for 5 minutes?" };
}

export function HomeHero() {
  const { pick, locale } = useI18n();
  const p = useProgress();
  const path = usePath();
  const [hour, setHour] = useState(12);
  useEffect(() => setHour(new Date().getHours()), []);
  const g = greeting(hour, p?.learned.length ?? 0);
  const cur = UNITS[currentIndex(path?.done ?? [])];
  const stats = [
    { ico: "🔥", n: p ? streakOf(p) : "–", l: { ru: "дней подряд", en: "day streak" } },
    { ico: "📚", n: p ? p.learned.length : "–", l: { ru: "слов", en: "words" } },
    { ico: "🏆", n: path ? path.done.length : "–", l: { ru: "этапов", en: "stages" } },
  ];
  return (
    <section className="mx-auto w-full max-w-content px-4 pb-6 pt-8 sm:px-6 lg:px-8">
      <div className="grid items-center gap-6 md:grid-cols-[auto_1fr_auto]">
        <div className="flex items-end gap-3 md:flex-col md:items-center">
          <button type="button" onClick={() => purr()} aria-label="Баем"><Bayem size={130} /></button>
          <BayemSays tt={g.tt} sub={locale === "tt" ? null : pick(g)} />
        </div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center md:text-left">
          <p className="font-display text-sm font-bold uppercase tracking-widest text-primary">Татар теле · 5 минут в день</p>
          <h1 className="mt-2 text-4xl leading-tight sm:text-5xl">
            <span lang="tt">Туган телне</span> <span className="text-primary">бергә өйрәник</span>
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">{pick({ ru: "Слова → фразы → диалоги. С живым голосом, играми и котом Баемом.", en: "Words → phrases → dialogues. With real voice, games and Bayem the cat." })}</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 md:justify-start">
            <Button asChild size="lg" onMouseEnter={() => ding()} className="h-14 animate-[softpulse_2.6s_ease-in-out_infinite] px-8 text-lg">
              <Link href={`/lesson/?u=${cur.id}`}><Play className="!size-5" aria-hidden />{pick({ ru: "Начать урок", en: "Start lesson" })} · {cur.emoji} {cur.tt}</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-14 px-6 text-base">
              <Link href="/play/">🎮 {pick({ ru: "Игры", en: "Games" })}</Link>
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-3 gap-3 md:grid-cols-1">
          {stats.map((s) => (
            <Card key={s.ico} className="flex flex-col items-center gap-1 p-3 text-center md:flex-row md:gap-3 md:px-5 md:text-left">
              <span className="text-2xl" aria-hidden>{s.ico}</span>
              <div><div className="text-2xl font-extrabold tabular-nums leading-none">{s.n}</div><div className="text-xs text-muted-foreground">{pick(s.l)}</div></div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
