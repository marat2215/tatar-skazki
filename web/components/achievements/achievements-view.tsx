"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Bayem, BayemSays } from "@/components/bayem";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BADGES, LEVELS, STREAK_MILESTONES, levelOf, type Ctx } from "@/lib/achievements";
import { QUESTS, applyFreeze, dayKey, useDaily } from "@/lib/daily";
import { useI18n } from "@/lib/i18n";
import { usePath } from "@/lib/path";
import { useProgress, type Progress } from "@/lib/progress";
import { cn } from "@/lib/utils";

/** Серия с учётом «заморозок» */
function streakWith(p: Progress, frozen: string[]) {
  let n = 0;
  const d = new Date();
  const active = (k: string) => !!p.days[k] || frozen.includes(k);
  if (!active(dayKey(d))) d.setDate(d.getDate() - 1);
  while (active(dayKey(d))) { n++; d.setDate(d.getDate() - 1); }
  return n;
}

export function AchievementsView() {
  const { pick, locale } = useI18n();
  const p = useProgress();
  const daily = useDaily();
  const path = usePath();
  const [extra, setExtra] = useState({ gameXp: 0, tower: 0 });
  const [frozen, setFrozen] = useState<string[]>([]);

  useEffect(() => {
    try {
      const g = JSON.parse(localStorage.getItem("tt.game.v1") ?? "{}");
      const t = JSON.parse(localStorage.getItem("tt.tower.v1") ?? "{}");
      setExtra({ gameXp: g.xp ?? 0, tower: t.s ?? 0 });
    } catch { /* ignore */ }
  }, []);
  useEffect(() => { if (p) setFrozen(applyFreeze(p.days)); }, [p]);

  const ctx: Ctx | null = useMemo(() => p && daily && path ? {
    p, streak: streakWith(p, frozen), units: path.done, early: daily.early, night: daily.night, ...extra,
  } : null, [p, daily, path, frozen, extra]);

  if (!ctx || !daily) return <div className="mx-auto max-w-content px-4 py-10"><Skeleton className="h-96 w-full" /></div>;

  const lv = levelOf(ctx.p.learned.length);
  const got = BADGES.filter((b) => b.ok(ctx));
  const today = { ...{ new: 0, dialog: 0, listen: 0, review: 0 }, ...daily.days[dayKey()] };
  const week = Array.from({ length: 7 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - (6 - i)); return d; });
  const nextMs = STREAK_MILESTONES.find((m) => m.days > ctx.streak);
  const bubble = ctx.streak >= 7 ? { tt: "Афәрин!", ru: `${ctx.streak} дней подряд! Ты — герой!`, en: `${ctx.streak} days in a row! You're a hero!` }
    : got.length ? { tt: "Мур!", ru: `У тебя уже ${got.length} бейджей из ${BADGES.length}.`, en: `You have ${got.length} of ${BADGES.length} badges.` }
    : { tt: "Әйдә!", ru: "Пройди первый урок — и тут появится первый бейдж.", en: "Finish a lesson to earn your first badge." };

  return (
    <div className="mx-auto w-full max-w-content px-4 py-8 sm:px-6 lg:px-8">
      {/* Уровень */}
      <Card className="flex flex-wrap items-center gap-5 p-6">
        <Bayem size={110} />
        <div className="min-w-[220px] flex-1">
          <p className="text-sm font-bold uppercase tracking-wide text-muted-foreground">{pick({ ru: "Твой уровень", en: "Your level" })}</p>
          <h1 className="text-3xl"><span aria-hidden>{lv.cur.ava}</span> {pick(lv.cur.t)} · <span lang="tt" className="italic text-primary">{lv.cur.tt}</span></h1>
          <div className="mt-3 h-4 overflow-hidden rounded-full bg-muted">
            <motion.div className="h-full rounded-full bg-accent" initial={{ width: 0 }} animate={{ width: `${lv.pct}%` }} transition={{ duration: 1 }} />
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {lv.next ? pick({ ru: `${ctx.p.learned.length} / ${lv.next.min} слов до уровня «${lv.next.t.ru}»`, en: `${ctx.p.learned.length} / ${lv.next.min} words to “${lv.next.t.en}”` }) : pick({ ru: "Высший уровень!", en: "Top level!" })}
          </p>
        </div>
        <BayemSays tt={bubble.tt} sub={pick(bubble)} />
      </Card>

      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        {LEVELS.map((l, i) => (
          <Card key={l.tt} className={cn("p-4 text-center", i === lv.i && "ring-4 ring-accent/50", i > lv.i && "opacity-50")}>
            <div className="text-4xl" aria-hidden>{l.ava}</div>
            <p className="font-bold">{pick(l.t)}</p>
            <p lang="tt" className="text-sm italic" style={{ color: l.color }}>{l.tt}</p>
            <p className="mt-1 text-xs text-muted-foreground">{l.min}+ {pick({ ru: "слов", en: "words" })} · 🎁 {pick(l.reward)}</p>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {/* Серия */}
        <Card className="p-6">
          <h2 className="text-2xl">🔥 {pick({ ru: `Серия: ${ctx.streak} дн.`, en: `Streak: ${ctx.streak} days` })}</h2>
          <div className="mt-4 grid grid-cols-7 gap-2">
            {week.map((d) => {
              const k = dayKey(d), on = !!ctx.p.days[k], fr = frozen.includes(k);
              return (
                <div key={k} className="text-center text-xs">
                  <div className={cn("grid h-11 place-items-center rounded-btn text-xl", on ? "bg-primary" : fr ? "bg-sky-200" : "bg-muted")}>{on ? "🔥" : fr ? "❄️" : "·"}</div>
                  {d.toLocaleDateString(locale === "tt" ? "ru" : locale, { weekday: "short" })}
                </div>
              );
            })}
          </div>
          <p className="mt-3 text-sm text-muted-foreground">❄️ {pick({ ru: "Заморозка: 1 раз в неделю пропущенный день не обнуляет серию.", en: "Freeze: once a week a missed day won't break your streak." })}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {STREAK_MILESTONES.map((m) => (
              <span key={m.days} className={cn("rounded-full border px-3 py-1 text-sm font-bold", ctx.streak >= m.days ? "border-accent bg-accent/30" : "opacity-50")}>
                {m.ico} {m.days} · {pick(m.t)}
              </span>
            ))}
          </div>
          {nextMs && <p className="mt-2 text-sm">{pick({ ru: `До «${nextMs.t.ru}» — ${nextMs.days - ctx.streak} дн.`, en: `${nextMs.days - ctx.streak} days to “${nextMs.t.en}”` })}</p>}
        </Card>

        {/* Задания дня */}
        <Card className="p-6">
          <h2 className="text-2xl">🎯 {pick({ ru: "Задания дня", en: "Daily quests" })}</h2>
          <ul className="mt-4 grid gap-3">
            {QUESTS.map((q) => {
              const v = Math.min(today[q.kind], q.goal), done = v >= q.goal;
              return (
                <li key={q.kind} className="flex items-center gap-3">
                  <span className="text-2xl" aria-hidden>{done ? "✅" : q.ico}</span>
                  <div className="flex-1">
                    <p className={cn("font-bold", done && "text-success")}>{pick(q)}</p>
                    <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-muted"><motion.div className="h-full bg-accent" animate={{ width: `${(v / q.goal) * 100}%` }} /></div>
                  </div>
                  <span className="text-sm tabular-nums text-muted-foreground">{v}/{q.goal} · +{q.xp}</span>
                </li>
              );
            })}
          </ul>
        </Card>
      </div>

      {/* Бейджи */}
      <h2 className="mb-4 mt-8 text-3xl">🏅 {pick({ ru: `Бейджи: ${got.length} из ${BADGES.length}`, en: `Badges: ${got.length} of ${BADGES.length}` })}</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {BADGES.map((b) => {
          const on = b.ok(ctx);
          return (
            <motion.div key={b.id} whileHover={{ y: -4, rotate: 1 }}>
              <Card className={cn("flex h-full flex-col items-center gap-1 p-4 text-center", !on && "opacity-55")}>
                <span className={cn("grid size-16 place-items-center rounded-full border-4 border-card text-3xl", on ? "bg-gradient-to-br from-[#F3D7A8] to-accent shadow-[0_0_0_3px_hsl(var(--accent))]" : "bg-muted grayscale")}>{b.ico}</span>
                <p lang="tt" className="mt-1 font-display font-bold italic text-primary">{b.tt}</p>
                <p className="text-sm font-bold">{pick(b.t)}</p>
                <p className="text-xs text-muted-foreground">{on ? "✓ " + pick({ ru: "получен", en: "earned" }) : pick(b.how)}</p>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
