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
import { ENDINGS, SCENES, UI, WHO, type L, type Opt, type Step, type Who } from "@/lib/tower-data";
import dynamic from "next/dynamic";
import { PORTRAIT } from "@/components/tower/art";
const Tower3D = dynamic(() => import("@/components/tower/tower-3d").then((m) => m.Tower3D), { ssr: false, loading: () => <div className="absolute inset-0 bg-gradient-to-b from-[#3b2a6a] to-[#ffb27a]" /> });
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

function _TowerMeter({ floor }: { floor: number }) {
  return (
    <div className="flex flex-col-reverse gap-1" aria-label={`floor ${floor}`}>
      {Array.from({ length: 9 }, (_, k) => (
        <span key={k} className={cn("h-2 w-6 rounded-sm transition-colors", k < floor ? "bg-primary" : k === floor ? "bg-accent" : "bg-muted")} />
      ))}
    </div>
  );
}


const PHOTO = new Set<Who>(["dania", "cat", "ildar", "babi", "syuy"]);
const NAME_COLOR: Partial<Record<Who, string>> = { dania: "#1d8f86", cat: "#e0782f", ildar: "#e0561c", babi: "#b0284c", syuy: "#0f8a5f", voice: "#c98a00" };

function Art({ html, className }: { html: string; className?: string }) {
  return <div className={className} aria-hidden dangerouslySetInnerHTML={{ __html: html }} />;
}

/** Сцена визуальной новеллы: фон этажа, герой(и), мини-башня прогресса */
function Stage({ sceneId, who, floor, title, sub, children, overview }: { overview?: boolean; sceneId: string; who: Who[]; floor: number; title?: string; sub?: string; children?: React.ReactNode }) {
  void sceneId;
  const { pick } = useI18n();
  return (
    <div className="tw-stage relative w-full overflow-hidden rounded-[22px] border-4 border-[#2a1638] shadow-[0_14px_34px_rgba(42,22,56,.35)]" style={{ aspectRatio: "var(--tw-ar, 16 / 10)" }}>
      <Tower3D floor={floor} overview={overview} className="absolute inset-0" />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/35 to-transparent" />
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 flex items-end justify-between gap-2 px-1">
        <AnimatePresence mode="popLayout">
          {who.map((w, k) => PORTRAIT[w] && (
            <motion.div key={w} initial={{ opacity: 0, y: 40, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 30 }} transition={{ type: "spring", stiffness: 260, damping: 22 }}
              className={cn("tw-bob w-[34%] max-w-[250px]", k > 0 && "w-[27%]")} style={{ animationDelay: `${k * -1.1}s` }}>
              {PHOTO.has(w) ? <img src={`/tower/${w}.webp`} alt={pick(WHO[w])} className="h-auto w-full [filter:drop-shadow(0_14px_18px_rgba(0,0,0,.55))_drop-shadow(0_0_3px_rgba(255,236,190,.9))]" draggable={false} /> : <Art html={PORTRAIT[w]!()} className="[&>svg]:h-auto [&>svg]:w-full" />}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      {title && (
        <div className="absolute left-3 top-3 max-w-[70%] rounded-2xl bg-[#2a1638]/70 px-3 py-1.5 text-white backdrop-blur-sm">
          {sub && <p className="text-[11px] uppercase tracking-wider text-[#ffd34d]">{sub}</p>}
          <p lang="tt" className="font-tt text-lg font-semibold leading-tight sm:text-xl">{title}</p>
        </div>
      )}
      {children}
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
      <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6">
        <Stage overview sceneId="prologue" who={["dania", "cat"]} floor={6}>
          <div className="absolute inset-x-0 top-0 bg-gradient-to-b from-[#2a1638]/70 to-transparent px-5 pb-10 pt-4 text-center text-white">
            <h1 lang="tt" className="font-tt text-3xl font-bold !text-white drop-shadow-[0_3px_0_#2a1638] sm:text-5xl">Сөембикә манарасы</h1>
            <p className="mt-1 text-sm text-[#ffe7b8] sm:text-base">{pick(UI.title)}</p>
          </div>
        </Stage>
        <div className="-mt-6 relative z-10 mx-3 rounded-[20px] border-4 border-[#2a1638] bg-[#fff6e6] p-5 text-center text-[#2a1638] shadow-xl dark:bg-[#2a1638] dark:text-[#fff6e6] dark:border-[#ffd34d]">
          <p className="mx-auto max-w-md">{pick(UI.lead)}</p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <button type="button" className="tw-btn" onClick={() => { setStarted(true); void speak("Исәнме, кызым."); }}>
              <Play aria-hidden className="size-5" />{pick(fresh0 ? UI.start : UI.cont)}
            </button>
            {!fresh0 && <button type="button" className="tw-btn tw-btn-alt" onClick={() => { setSave({ ...fresh, showT: save.showT }); setStarted(true); }}><RotateCcw aria-hidden className="size-5" />{pick(UI.restart)}</button>}
          </div>
          {save.diary.length > 0 && <p className="mt-4 text-sm opacity-75">📜 {save.diary.length} {pick(UI.words)}</p>}
        </div>
      </div>
    );
  }

  const hue = save.ending ? 45 : scene.hue;
  const key = save.ending ? `e${save.ending}-${save.ei}` : `${save.s}-${save.i}`;
  const common = { showT: save.showT, onDone: advance, onMistake: mistake };

  const speaker: Who | null = step && (step.k === "say" || step.k === "choice") ? step.who : null;
  const cast: Who[] = endingDone ? (save.ending === 3 ? ["dania", "syuy"] : ["dania"]) : speaker && speaker !== "narr" ? (speaker === "dania" ? ["dania"] : [speaker, "dania"]) : speaker === "narr" ? [] : ["dania", "cat"];
  const nameColor = speaker ? NAME_COLOR[speaker] : undefined;
  const sceneId = save.ending ? "top" : scene.id;
  const floorLabel = save.ending ? `${pick(UI.ending)} ${save.ending}` : scene.floor === 0 || scene.floor === 8 ? pick(scene.place) : `${pick(UI.floor)} ${scene.floor} · ${pick(scene.place)}`;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-4 sm:px-6">
      <Stage sceneId={sceneId} who={cast} floor={save.ending ? 8 : scene.floor} title={`«${tt(save.ending ? ENDINGS[save.ending].tt : scene.tt)}»`} sub={floorLabel} />
      <div className="relative z-10 -mt-5 mx-1 sm:mx-3">
        {speaker && speaker !== "narr" && (
          <span className="absolute -top-4 left-5 z-10 rounded-full border-[3px] border-[#2a1638] px-4 py-1 text-sm font-bold text-white shadow" style={{ background: nameColor ?? "#2a1638" }}>{pick(WHO[speaker])}</span>
        )}
        <div className="absolute -top-4 right-4 z-10 flex gap-2">
          <Button variant="outline" size="icon" className="rounded-full border-[3px] border-[#2a1638] bg-card" aria-label={pick(UI.hint)} aria-pressed={save.showT} onClick={() => setSave({ ...save, showT: !save.showT })}>
            {save.showT ? <Eye aria-hidden /> : <EyeOff aria-hidden />}
          </Button>
          <Button variant="outline" className="rounded-full border-[3px] border-[#2a1638] bg-card" onClick={() => setDiaryOpen(true)}><BookOpen aria-hidden /><span className="tabular-nums">{save.diary.length}</span></Button>
        </div>
        <Card className="tw-dialog relative overflow-hidden rounded-[20px] border-4 border-[#2a1638] p-5 pt-7 sm:p-7 sm:pt-8" style={{ backgroundImage: `linear-gradient(160deg, hsl(${hue} 80% 55% / 0.16), transparent 60%)` }}>
          <Ornament hue={hue} />
          <AnimatePresence mode="wait">
            <motion.div key={key} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.22 }} className="relative">
              {endingDone ? (
                <div className="flex flex-col items-center gap-4 py-4 text-center">
                  <h3 lang="tt" className="font-tt text-3xl font-semibold">«{tt(ENDINGS[save.ending].tt)}»</h3>
                  <p className="text-muted-foreground">{pick(UI.ending)} {save.ending} / 3 · {pick(UI.mistakes)}: {save.mistakes} · 📜 {save.diary.length}</p>
                  <button type="button" className="tw-btn" onClick={() => setSave({ ...fresh, showT: save.showT })}><RotateCcw aria-hidden className="size-5" />{pick(UI.restart)}</button>
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
      </div>

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
