"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Volume2, X } from "lucide-react";
import { Bayem, BayemSays } from "@/components/bayem";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { speak } from "@/lib/audio";
import { words as ALL, type Phrase, type Word } from "@/lib/content";
import { shuffle } from "@/lib/game";
import { useI18n } from "@/lib/i18n";
import { UNITS, completeUnit, unitPhrases, unitWords, type Unit } from "@/lib/path";
import { markLearned, markLesson } from "@/lib/progress";
import { boop, confetti, ding, fanfare } from "@/lib/sfx";
import { cn } from "@/lib/utils";

type Step =
  | { k: "card"; w: Word }
  | { k: "quiz"; w: Word; opts: Word[] }
  | { k: "phrase"; p: Phrase }
  | { k: "pquiz"; p: Phrase; opts: Phrase[] }
  | { k: "end" };

const PRAISE = [
  { tt: "Афәрин!", ru: "Ты говоришь как настоящий татарин!", en: "You speak like a real Tatar!" },
  { tt: "Бик яхшы!", ru: "Точно как у әби на кухне.", en: "Just like at grandma's kitchen." },
  { tt: "Менә шулай!", ru: "Вот так! Хвост распушил от радости.", en: "That's it! My tail is fluffed with joy." },
];
const OOPS = [
  { tt: "Кабатла!", ru: "Син булдырасың — у тебя получится.", en: "You can do it — try again." },
  { tt: "Борчылма!", ru: "Не переживай, повторим ещё раз.", en: "Don't worry, we'll go again." },
];

function build(u: Unit): Step[] {
  const ws = unitWords(u);
  const ps = unitPhrases(u);
  const steps: Step[] = ws.slice(0, 5).map((w) => ({ k: "card", w }));
  shuffle(ws.slice(0, 5)).forEach((w) =>
    steps.push({ k: "quiz", w, opts: shuffle([w, ...shuffle(ALL.filter((x) => x.tt !== w.tt)).slice(0, 3)]) }));
  ps.slice(0, 3).forEach((p) => steps.push({ k: "phrase", p }));
  if (ps.length >= 3) {
    const p = ps[Math.floor(Math.random() * ps.length)];
    steps.push({ k: "pquiz", p, opts: shuffle([p, ...shuffle(ps.filter((x) => x.tt !== p.tt)).slice(0, 2)]) });
  }
  steps.push({ k: "end" });
  return steps;
}

export function LessonPlayer() {
  const { tt, pick } = useI18n();
  const [unit, setUnit] = useState<Unit | null>(null);
  const [steps, setSteps] = useState<Step[]>([]);
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [flipped, setFlipped] = useState(false);
  const [bubble, setBubble] = useState<{ tt: string; ru: string; en: string } | null>(null);
  const [mistakes, setMistakes] = useState(0);

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("u") ?? "hello";
    const u = UNITS.find((x) => x.id === id) ?? UNITS[0];
    setUnit(u); setSteps(build(u));
  }, []);

  const step = steps[i];
  const next = () => { setI((n) => n + 1); setPicked(null); setFlipped(false); setBubble(null); };

  useEffect(() => {
    if (!step || !unit) return;
    if (step.k === "card") window.setTimeout(() => void speak(step.w.tt), 300);
    if (step.k === "quiz") window.setTimeout(() => void speak(step.w.tt), 300);
    if (step.k === "phrase") window.setTimeout(() => void speak(step.p.tt), 300);
    if (step.k === "end") { completeUnit(unit.id); markLesson(); fanfare(); confetti(); }
  }, [step, unit]);

  const answer = (ok: boolean, key: string, w?: string) => {
    if (picked) return;
    setPicked(key);
    if (ok) { ding(); if (w) markLearned(w); setBubble(PRAISE[Math.floor(Math.random() * PRAISE.length)]); if (Math.random() < 0.4) confetti(); }
    else { boop(); setMistakes((m) => m + 1); setBubble(OOPS[Math.floor(Math.random() * OOPS.length)]); }
  };

  const nextUnit = useMemo(() => (unit ? UNITS[UNITS.findIndex((u) => u.id === unit.id) + 1] : undefined), [unit]);

  if (!unit || !step) return <div className="mx-auto max-w-xl px-4 py-10"><Skeleton className="h-96 w-full" /></div>;

  const progress = (i / (steps.length - 1)) * 100;
  const label =
    step.k === "card" || step.k === "quiz" ? pick({ ru: "1 · Слова", en: "1 · Words" }) :
    step.k === "phrase" || step.k === "pquiz" ? pick({ ru: "2 · Фразы", en: "2 · Phrases" }) : "";

  return (
    <div className="mx-auto w-full max-w-xl px-4 py-6 sm:px-6">
      <div className="mb-5 flex items-center gap-3">
        <Link href="/#path" aria-label="close" className="rounded-full p-2 text-muted-foreground hover:bg-muted"><X className="size-5" /></Link>
        <div className="h-3 flex-1 overflow-hidden rounded-full bg-muted">
          <motion.div className="h-full rounded-full bg-success" animate={{ width: `${progress}%` }} />
        </div>
        <span className="text-2xl" aria-hidden>{unit.emoji}</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={i} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.22 }}>
          {label && <span className="mb-3 inline-block rounded-full bg-accent px-3 py-0.5 text-xs font-extrabold text-accent-foreground">{label}</span>}

          {step.k === "card" && (
            <div className="flex flex-col gap-5">
              <button type="button" onClick={() => { setFlipped((f) => !f); void speak(step.w.tt); }} className="h-64 [perspective:1000px]" aria-label="flip">
                <motion.div className="relative h-full [transform-style:preserve-3d]" animate={{ rotateY: flipped ? 180 : 0 }} transition={{ type: "spring", stiffness: 160, damping: 14 }}>
                  <div className="absolute inset-0 grid place-items-center rounded-card bg-gradient-to-br from-primary to-[#A9432F] p-6 text-primary-foreground [backface-visibility:hidden]">
                    <div><p lang="tt" className="font-display text-5xl font-bold">{tt(step.w.tt)}</p><p className="mt-3 flex items-center justify-center gap-2 text-sm opacity-80"><Volume2 className="size-4" />{pick({ ru: "нажми — переверни", en: "tap to flip" })}</p></div>
                  </div>
                  <div className="absolute inset-0 grid place-items-center rounded-card bg-gradient-to-br from-success to-[#155C43] p-6 text-white [backface-visibility:hidden] [transform:rotateY(180deg)]">
                    <p className="font-display text-4xl font-bold">{pick(step.w)}</p>
                  </div>
                </motion.div>
              </button>
              <Button size="lg" className="h-14 text-lg" onClick={next}>{pick({ ru: "Запомнил", en: "Got it" })} <ArrowRight aria-hidden /></Button>
            </div>
          )}

          {step.k === "quiz" && (
            <div className="flex flex-col gap-4">
              <Card className="flex items-center gap-4 p-5">
                <button type="button" onClick={() => void speak(step.w.tt)} className="grid size-14 place-items-center rounded-full bg-primary text-primary-foreground" aria-label="play"><Volume2 /></button>
                <div><p className="text-sm text-muted-foreground">{pick({ ru: "Что значит?", en: "What does it mean?" })}</p><p lang="tt" className="font-display text-3xl font-bold">{tt(step.w.tt)}</p></div>
              </Card>
              <div className="grid gap-2 sm:grid-cols-2">
                {step.opts.map((o) => {
                  const ok = o.tt === step.w.tt;
                  return (
                    <motion.button key={o.tt} type="button" whileTap={{ scale: 0.97 }} animate={picked === o.tt && !ok ? { x: [0, -8, 8, -5, 5, 0] } : {}}
                      onClick={() => answer(ok, o.tt, step.w.tt)}
                      className={cn("min-h-14 rounded-btn border-2 bg-card px-4 py-3 text-lg font-bold transition hover:-rotate-1 hover:border-accent",
                        picked && ok && "border-success bg-success/15", picked === o.tt && !ok && "border-danger bg-danger/10")}>
                      {pick(o)}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          )}

          {step.k === "phrase" && (
            <div className="flex flex-col gap-5">
              <Card className="p-6">
                <button type="button" onClick={() => void speak(step.p.tt)} className="flex items-start gap-3 text-left">
                  <Volume2 className="mt-2 size-6 shrink-0 text-primary" />
                  <span><span lang="tt" className="block font-display text-3xl font-bold">{tt(step.p.tt)}</span><span className="mt-2 block text-lg text-muted-foreground">{pick(step.p)}</span></span>
                </button>
              </Card>
              <Button size="lg" className="h-14 text-lg" onClick={next}>{pick({ ru: "Дальше", en: "Next" })} <ArrowRight aria-hidden /></Button>
            </div>
          )}

          {step.k === "pquiz" && (
            <div className="flex flex-col gap-4">
              <p className="text-lg font-bold">{pick({ ru: `Как сказать: «${step.p.ru}»?`, en: `How do you say: “${step.p.en}”?` })}</p>
              <div className="grid gap-2">
                {step.opts.map((o) => {
                  const ok = o.tt === step.p.tt;
                  return (
                    <motion.button key={o.tt} type="button" whileTap={{ scale: 0.98 }} animate={picked === o.tt && !ok ? { x: [0, -8, 8, -5, 5, 0] } : {}}
                      onClick={() => { answer(ok, o.tt); void speak(o.tt); }} lang="tt"
                      className={cn("rounded-btn border-2 bg-card px-4 py-3 text-left font-display text-xl font-bold hover:border-accent",
                        picked && ok && "border-success bg-success/15", picked === o.tt && !ok && "border-danger bg-danger/10")}>
                      {tt(o.tt)}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          )}

          {step.k === "end" && (
            <div className="flex flex-col items-center gap-5 py-4 text-center">
              <Bayem size={140} />
              <BayemSays tt="Афәрин!" sub={pick({ ru: `Этап «${unit.t.ru}» пройден! Ошибок: ${mistakes}.`, en: `Stage “${unit.t.en}” complete! Mistakes: ${mistakes}.` })} />
              <Card className="w-full border-l-4 border-l-accent p-5 text-left">
                <p className="font-display font-bold">☕ {pick({ ru: "А ты знал?", en: "Did you know?" })}</p>
                <p className="mt-1">{pick(unit.fact)}</p>
              </Card>
              <div className="flex flex-wrap justify-center gap-3">
                {nextUnit && <Button asChild size="lg" className="h-14 text-lg"><a href={`/lesson/?u=${nextUnit.id}`}>{nextUnit.emoji} {pick({ ru: "Следующий этап", en: "Next stage" })}</a></Button>}
                <Button asChild size="lg" variant="outline" className="h-14"><Link href="/#path">{pick({ ru: "К пути", en: "Back to path" })}</Link></Button>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {(step.k === "quiz" || step.k === "pquiz") && picked && (
        <motion.div initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          className="fixed inset-x-0 bottom-0 z-40 border-t bg-card/95 p-4 backdrop-blur">
          <div className="mx-auto flex max-w-xl items-center gap-3">
            <Bayem size={56} />
            {bubble && <div className="flex-1"><p lang="tt" className="font-display text-lg font-bold text-primary">{bubble.tt}</p><p className="text-sm">{pick(bubble)}</p></div>}
            <Button size="lg" onClick={next}>{pick({ ru: "Дальше", en: "Next" })} <ArrowRight aria-hidden /></Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
