"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, Eye, EyeOff, Play, RotateCcw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BuildStep, ChoiceStep, MatchStep, OddStep, OrderStep, SayStep, VocabStep } from "@/components/tower/tower-steps";
import { markLearned, markLesson } from "@/lib/progress";
import { speak } from "@/lib/audio";
import { useI18n } from "@/lib/i18n";
import { ENDINGS, SCENES, UI, type L, type Opt, type Step } from "@/lib/tower-data";
import { cn } from "@/lib/utils";

type Save = { s: number; i: number; mistakes: number; diary: string[]; ending: 0 | 1 | 2 | 3; ei: number; showT: boolean };
const KEY = "tt.tower.v1";
const fresh: Save = { s: 0, i: 0, mistakes: 0, diary: [], ending: 0, ei: 0, showT: true };

// словарь всех слов игры: слово → перевод
const DICT = new Map<string, L>();
SCENES.forEach((sc) => sc.steps.forEach((st) => st.k === "vocab" && st.words.forEach(([w, t]) => DICT.set(w, t))));

function Ornament({ hue }: { hue: number }) {
  // татарский тюльпан — фоновой узор этажа
  return (
    <svg aria-hidden viewBox="0 0 200 200" className="pointer-events-none absolute -right-10 -top-10 size-56 opacity-[0.12]" style={{ color: `hsl(${hue} 70% 45%)` }}>
      <g fill="currentColor">
        <path d="M100 30c18 22 30 42 30 62 0 20-13 33-30 33s-30-13-30-33c0-20 12-40 30-62z" />
        <path d="M100 125c-30-4-55 8-62 30 22 6 46-4 62-30zM100 125c30-4 55 8 62 30-22 6-46-4-62-30z" opacity=".7" />
        <rect x="97" y="125" width="6" height="55" rx="3" />
      </g>
    </svg>
  );
}

function TowerMeter({ floor }: { floor: number }) {
  return (
    <div className="flex flex-col-reverse gap-1" aria-label={`floor ${floor}`}>
      {Array.from({ length: 9 }, (_, k) => (
        <span key={k} className={cn("h-2 w-6 rounded-sm transition-colors", k < floor ? "bg-primary" : k === floor ? "bg-accent" : "bg-muted")} />
      ))}
    </div>
  );
}

export function TowerGame() {
  const { tt, pick } = useI18n();
  const [save, setSave] = useState<Save | null>(null);
  const [started, setStarted] = useState(false);
  const [diaryOpen, setDiaryOpen] = useState(false);

  useEffect(() => {
    try { setSave({ ...fresh, ...(JSON.parse(localStorage.getItem(KEY) ?? "null") ?? {}) }); } catch { setSave(fresh); }
  }, []);
  useEffect(() => { if (save) try { localStorage.setItem(KEY, JSON.stringify(save)); } catch { /* ignore */ } }, [save]);

  const scene = save ? SCENES[Math.min(save.s, SCENES.length - 1)] : null;
  const step: Step | null = useMemo(() => {
    if (!save || !scene) return null;
    if (save.ending) return ENDINGS[save.ending].steps[save.ei] ?? null;
    return scene.steps[save.i] ?? null;
  }, [save, scene]);

  const advance = useCallback((opt?: Opt) => {
    setSave((sv) => {
      if (!sv) return sv;
      const cur = sv.ending ? ENDINGS[sv.ending].steps[sv.ei] : SCENES[sv.s].steps[sv.i];
      let diary = sv.diary;
      if (cur?.k === "vocab") {
        diary = Array.from(new Set([...diary, ...cur.words.map(([w]) => w)]));
        cur.words.forEach(([w]) => markLearned(w));
      }
      if (opt?.ending) { markLesson(); return { ...sv, diary, ending: opt.ending, ei: 0 }; }
      if (sv.ending) return { ...sv, diary, ei: sv.ei + 1 };
      if (sv.i + 1 < SCENES[sv.s].steps.length) return { ...sv, diary, i: sv.i + 1 };
      markLesson();
      return { ...sv, diary, s: sv.s + 1, i: 0 };
    });
  }, []);
  const mistake = useCallback(() => setSave((sv) => (sv ? { ...sv, mistakes: sv.mistakes + 1 } : sv)), []);

  if (!save || !scene) return <div className="mx-auto max-w-2xl px-4 py-10"><Skeleton className="h-96 w-full" /></div>;

  const fresh0 = save.s === 0 && save.i === 0 && !save.ending;
  const endingDone = !!save.ending && !step;

  if (!started) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6">
        <Card className="relative overflow-hidden p-8 text-center">
          <Ornament hue={45} />
          <div className="mx-auto mb-6 flex w-fit items-end gap-4">
            <TowerMeter floor={save.ending ? 9 : scene.floor} />
            <span className="text-7xl" aria-hidden>🕌</span>
          </div>
          <h2 className="font-tt text-3xl font-semibold">Сөембикә манарасы</h2>
          <p className="mt-1 text-lg text-muted-foreground">{pick(UI.title)}</p>
          <p className="mx-auto mt-4 max-w-md text-muted-foreground">{pick(UI.lead)}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button size="lg" onClick={() => { setStarted(true); void speak("Исәнме, кызым."); }}>
              <Play aria-hidden />{pick(fresh0 ? UI.start : UI.cont)}
            </Button>
            {!fresh0 && <Button size="lg" variant="outline" onClick={() => { setSave({ ...fresh, showT: save.showT }); setStarted(true); }}><RotateCcw aria-hidden />{pick(UI.restart)}</Button>}
          </div>
          {save.diary.length > 0 && <p className="mt-6 text-sm text-muted-foreground">📜 {save.diary.length} {pick(UI.words)}</p>}
        </Card>
      </div>
    );
  }

  const hue = save.ending ? 45 : scene.hue;
  const key = save.ending ? `e${save.ending}-${save.ei}` : `${save.s}-${save.i}`;
  const common = { showT: save.showT, onDone: advance, onMistake: mistake };

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-6 sm:px-6">
      <div className="mb-4 flex items-center gap-3">
        <TowerMeter floor={save.ending ? 9 : scene.floor} />
        <div className="min-w-0 flex-1">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            {save.ending ? `${pick(UI.ending)} ${save.ending}` : scene.floor === 0 || scene.floor === 8 ? pick(scene.place) : `${pick(UI.floor)} ${scene.floor} · ${pick(scene.place)}`}
          </p>
          <h2 lang="tt" className="truncate font-tt text-2xl font-semibold">
            «{tt(save.ending ? ENDINGS[save.ending].tt : scene.tt)}» <span className="font-sans text-base font-normal text-muted-foreground">{pick(save.ending ? ENDINGS[save.ending].t : scene.t)}</span>
          </h2>
        </div>
        <Button variant="ghost" size="icon" aria-label={pick(UI.hint)} aria-pressed={save.showT} onClick={() => setSave({ ...save, showT: !save.showT })}>
          {save.showT ? <Eye aria-hidden /> : <EyeOff aria-hidden />}
        </Button>
        <Button variant="outline" onClick={() => setDiaryOpen(true)}><BookOpen aria-hidden /><span className="tabular-nums">{save.diary.length}</span></Button>
      </div>

      <Card className="relative overflow-hidden p-5 sm:p-7" style={{ backgroundImage: `linear-gradient(160deg, hsl(${hue} 70% 50% / 0.10), transparent 55%)` }}>
        <Ornament hue={hue} />
        <AnimatePresence mode="wait">
          <motion.div key={key} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.22 }} className="relative">
            {endingDone ? (
              <div className="flex flex-col items-center gap-4 py-6 text-center">
                <span className="text-6xl" aria-hidden>{save.ending === 3 ? "💛" : save.ending === 2 ? "📖" : "🌙"}</span>
                <h3 lang="tt" className="font-tt text-3xl font-semibold">«{tt(ENDINGS[save.ending].tt)}»</h3>
                <p className="text-muted-foreground">{pick(UI.ending)} {save.ending} / 3 · {pick(UI.mistakes)}: {save.mistakes} · 📜 {save.diary.length}</p>
                <Button onClick={() => setSave({ ...fresh, showT: save.showT })}><RotateCcw aria-hidden />{pick(UI.restart)}</Button>
              </div>
            ) : step?.k === "say" ? <SayStep step={step} {...common} />
              : step?.k === "vocab" ? <VocabStep step={step} {...common} />
              : step?.k === "build" ? <BuildStep step={step} {...common} />
              : step?.k === "choice" ? <ChoiceStep step={step} {...common} />
              : step?.k === "match" ? <MatchStep step={step} {...common} />
              : step?.k === "order" ? <OrderStep step={step} {...common} />
              : step?.k === "odd" ? <OddStep step={step} {...common} />
              : null}
          </motion.div>
        </AnimatePresence>
      </Card>

      <AnimatePresence>
        {diaryOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center" onClick={() => setDiaryOpen(false)}>
            <motion.div initial={{ y: 30 }} animate={{ y: 0 }} exit={{ y: 30 }} role="dialog" aria-label={pick(UI.diary)} onClick={(e) => e.stopPropagation()}
              className="max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-card border bg-card p-5 shadow-lift">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold">📜 {pick(UI.diary)} · {save.diary.length}</h3>
                <Button variant="ghost" size="icon" aria-label={pick(UI.close)} onClick={() => setDiaryOpen(false)}><X aria-hidden /></Button>
              </div>
              <ul className="grid gap-1">
                {save.diary.map((w) => (
                  <li key={w}>
                    <button type="button" onClick={() => void speak(w)} className="flex w-full items-center gap-3 rounded-btn px-2 py-1.5 text-left hover:bg-muted">
                      <span lang="tt" className="font-tt font-semibold">{tt(w)}</span>
                      <span className="ml-auto text-sm text-muted-foreground">{DICT.get(w) ? pick(DICT.get(w)!) : ""}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
