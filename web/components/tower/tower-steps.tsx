"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Check, RotateCcw, Volume2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { speak } from "@/lib/audio";
import { shuffle } from "@/lib/game";
import { useI18n } from "@/lib/i18n";
import { UI, WHO, type L, type Opt, type Step } from "@/lib/tower-data";
import { cn } from "@/lib/utils";

export type StepProps<K extends Step["k"]> = {
  step: Extract<Step, { k: K }>;
  showT: boolean;
  onDone: (opt?: Opt) => void;
  onMistake: () => void;
};

function Say({ tt: text, t, showT, big }: { tt?: string; t: L; showT: boolean; big?: boolean }) {
  const { tt, pick } = useI18n();
  return (
    <div className="flex items-start gap-3">
      {text && (
        <button type="button" onClick={() => void speak(text)} aria-label="play" className="mt-1 flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary transition hover:bg-primary/25">
          <Volume2 className="size-5" aria-hidden />
        </button>
      )}
      <div>
        {text && <p lang="tt" className={cn("font-tt font-semibold leading-snug", big ? "text-2xl sm:text-3xl" : "text-xl")}>{tt(text)}</p>}
        {(showT || !text) && <p className={cn("text-muted-foreground", text ? "mt-1" : "text-lg text-foreground")}>{pick(t)}</p>}
      </div>
    </div>
  );
}

export function SayStep({ step, showT, onDone }: StepProps<"say">) {
  const { pick } = useI18n();
  const name = pick(WHO[step.who]);
  return (
    <div className="flex flex-col gap-5">
      {name && <span className="w-fit rounded-full bg-accent/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent-foreground dark:text-accent">{name}</span>}
      <Say tt={step.tt} t={step.t} showT={showT} big />
      <Button className="self-end" onClick={() => onDone()} autoFocus>{pick(UI.next)} →</Button>
    </div>
  );
}

export function VocabStep({ step, onDone }: StepProps<"vocab">) {
  const { tt, pick } = useI18n();
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm font-semibold uppercase tracking-wide text-accent-foreground dark:text-accent">📜 {pick(UI.newWords)}</p>
      <ul className="grid gap-2 sm:grid-cols-2">
        {step.words.map(([w, t], i) => (
          <motion.li key={w} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <button type="button" onClick={() => void speak(w)} className="flex w-full items-center gap-3 rounded-btn border bg-card px-3 py-2 text-left hover:border-primary">
              <Volume2 className="size-4 shrink-0 text-primary" aria-hidden />
              <span lang="tt" className="font-tt font-semibold">{tt(w)}</span>
              <span className="ml-auto text-sm text-muted-foreground">{pick(t)}</span>
            </button>
          </motion.li>
        ))}
      </ul>
      <Button className="self-end" onClick={() => onDone()}>{pick(UI.next)} →</Button>
    </div>
  );
}

function Feedback({ ok }: { ok: boolean | null }) {
  const { pick } = useI18n();
  if (ok === null) return null;
  return (
    <motion.p initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className={cn("flex items-center gap-2 font-semibold", ok ? "text-success" : "text-danger")}>
      {ok ? <Check className="size-5" aria-hidden /> : <X className="size-5" aria-hidden />}
      {pick(ok ? UI.right : UI.wrong)}
    </motion.p>
  );
}

export function BuildStep({ step, onDone, onMistake }: StepProps<"build">) {
  const { tt, pick } = useI18n();
  const pool = useMemo(() => shuffle(step.words.map((w, i) => ({ w, i }))), [step]);
  const [picked, setPicked] = useState<number[]>([]);
  const [ok, setOk] = useState<boolean | null>(null);
  const phrase = picked.map((i) => step.words[i]);
  const check = () => {
    const good = phrase.join(" ").toLowerCase() === step.answer.join(" ").toLowerCase();
    setOk(good);
    if (good) { void speak(step.answer.join(" ")); window.setTimeout(() => onDone(), 1100); }
    else onMistake();
  };
  return (
    <div className="flex flex-col gap-4">
      <p className="text-lg font-semibold">{pick(step.prompt)}</p>
      <p className="text-xs text-muted-foreground">{pick(UI.tapWords)}</p>
      <div className={cn("flex min-h-16 flex-wrap items-center gap-2 rounded-card border-2 border-dashed p-3", ok === true && "border-success bg-success/10", ok === false && "border-danger")}>
        {phrase.map((w, n) => (
          <motion.button layout key={`${w}-${n}`} type="button" onClick={() => { setOk(null); setPicked((p) => p.filter((_, k) => k !== n)); }} lang="tt" className="rounded-btn bg-primary px-3 py-2 font-tt text-lg font-semibold text-primary-foreground">
            {tt(w)}
          </motion.button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {pool.map(({ w, i }) => (
          <motion.button layout key={i} type="button" whileTap={{ scale: 0.95 }} disabled={picked.includes(i)} onClick={() => { setOk(null); setPicked((p) => [...p, i]); }} lang="tt"
            className="rounded-btn border-2 bg-card px-3 py-2 font-tt text-lg hover:border-primary disabled:opacity-25">
            {tt(w)}
          </motion.button>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Feedback ok={ok} />
        <Button variant="ghost" className="ml-auto" onClick={() => { setPicked([]); setOk(null); }}><RotateCcw aria-hidden />{pick(UI.reset)}</Button>
        <Button onClick={check} disabled={!picked.length || ok === true}>{pick(UI.check)}</Button>
      </div>
    </div>
  );
}

export function ChoiceStep({ step, showT, onDone, onMistake }: StepProps<"choice">) {
  const { tt, pick } = useI18n();
  const [chosen, setChosen] = useState<Opt | null>(null);
  const choose = (o: Opt) => {
    if (o.ok === false) { onMistake(); setChosen(o); return; }
    setChosen(o);
    void speak(o.tt);
    if (o.ending) window.setTimeout(() => onDone(o), 900);
  };
  const name = pick(WHO[step.who]);
  return (
    <div className="flex flex-col gap-4">
      {name && <span className="w-fit rounded-full bg-accent/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent-foreground dark:text-accent">{name}</span>}
      <Say tt={step.tt} t={step.t} showT={showT} big />
      <div className="grid gap-2">
        {step.opts.map((o) => (
          <motion.button key={o.tt} type="button" whileTap={{ scale: 0.98 }} disabled={!!chosen && chosen.ok !== false} onClick={() => choose(o)}
            className={cn("rounded-btn border-2 bg-card px-4 py-3 text-left transition-colors hover:border-primary disabled:cursor-default",
              chosen === o && o.ok !== false && "border-primary bg-primary/10",
              chosen === o && o.ok === false && "border-danger bg-danger/10")}>
            <span lang="tt" className="block font-tt text-lg font-semibold">{tt(o.tt)}</span>
            {showT && <span className="text-sm text-muted-foreground">{pick(o.t)}</span>}
          </motion.button>
        ))}
      </div>
      {chosen?.reply && (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="rounded-card bg-muted p-4">
          <Say tt={chosen.reply.tt || undefined} t={chosen.reply.t} showT={showT} />
        </motion.div>
      )}
      {chosen && chosen.ok !== false && !chosen.ending && <Button className="self-end" onClick={() => onDone(chosen)}>{pick(UI.next)} →</Button>}
    </div>
  );
}

export function MatchStep({ step, onDone, onMistake }: StepProps<"match">) {
  const { tt, pick } = useI18n();
  const right = useMemo(() => shuffle(step.pairs.map((p) => p[0])), [step]);
  const [sel, setSel] = useState<string | null>(null);
  const [done, setDone] = useState<string[]>([]);
  const [bad, setBad] = useState<string | null>(null);
  const tryPair = (key: string) => {
    if (!sel) return;
    if (sel === key) {
      void speak(key);
      const d = [...done, key];
      setDone(d); setSel(null);
      if (d.length === step.pairs.length) window.setTimeout(() => onDone(), 700);
    } else { setBad(key); onMistake(); window.setTimeout(() => { setBad(null); setSel(null); }, 600); }
  };
  return (
    <div className="flex flex-col gap-4">
      <p className="text-lg font-semibold">{pick(step.prompt)}</p>
      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col gap-2">
          {step.pairs.map(([w]) => (
            <button key={w} type="button" disabled={done.includes(w)} onClick={() => { setSel(w); void speak(w); }} lang="tt"
              className={cn("min-h-12 rounded-btn border-2 bg-card px-3 py-2 font-tt text-lg font-semibold transition hover:border-primary",
                sel === w && "border-primary bg-primary/10", done.includes(w) && "border-success bg-success/10 opacity-60")}>
              {tt(w)}
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          {right.map((key) => {
            const t = step.pairs.find((p) => p[0] === key)![1];
            return (
              <motion.button key={key} type="button" animate={bad === key ? { x: [0, -6, 6, -4, 4, 0] } : {}} disabled={done.includes(key)} onClick={() => tryPair(key)}
                className={cn("min-h-12 rounded-btn border-2 bg-card px-3 py-2 transition hover:border-primary", bad === key && "border-danger", done.includes(key) && "border-success bg-success/10 opacity-60")}>
                {pick(t)}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function OrderStep({ step, onDone, onMistake }: StepProps<"order">) {
  const { tt, pick } = useI18n();
  const pool = useMemo(() => shuffle(step.items.map((it, i) => ({ it, i }))), [step]);
  const [n, setN] = useState(0);
  const [bad, setBad] = useState<number | null>(null);
  const tap = (i: number) => {
    if (i === n) {
      void speak(step.items[i][0]);
      if (n + 1 === step.items.length) window.setTimeout(() => onDone(), 700);
      setN(n + 1);
    } else { setBad(i); onMistake(); window.setTimeout(() => setBad(null), 500); }
  };
  return (
    <div className="flex flex-col gap-4">
      <p className="text-lg font-semibold">{pick(step.prompt)}</p>
      <p className="text-xs text-muted-foreground">{pick(UI.tapOrder)}</p>
      <ol className="flex flex-wrap gap-2">
        {step.items.slice(0, n).map(([w], k) => (
          <li key={w} lang="tt" className="rounded-btn bg-primary px-3 py-1.5 font-tt font-semibold text-primary-foreground">{k + 1}. {tt(w)}</li>
        ))}
      </ol>
      <div className="grid gap-2 sm:grid-cols-2">
        {pool.map(({ it: [w, t], i }) => (
          <motion.button key={w} type="button" animate={bad === i ? { x: [0, -6, 6, -4, 4, 0] } : {}} disabled={i < n} onClick={() => tap(i)}
            className={cn("rounded-btn border-2 bg-card px-3 py-2 text-left hover:border-primary disabled:opacity-25", bad === i && "border-danger")}>
            <span lang="tt" className="block font-tt text-lg font-semibold">{tt(w)}</span>
            <span className="text-sm text-muted-foreground">{pick(t)}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

export function OddStep({ step, onDone, onMistake }: StepProps<"odd">) {
  const { tt, pick } = useI18n();
  const [bad, setBad] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  return (
    <div className="flex flex-col gap-4">
      <p className="text-lg font-semibold">{pick(step.prompt)}</p>
      <div className="grid grid-cols-2 gap-2">
        {step.items.map((it) => (
          <motion.button key={it} type="button" whileTap={{ scale: 0.96 }} animate={bad === it ? { x: [0, -6, 6, -4, 4, 0] } : {}}
            onClick={() => {
              if (ok) return;
              if (it === step.answer) { setOk(true); window.setTimeout(() => onDone(), 1400); }
              else { setBad(it); void speak(it); onMistake(); window.setTimeout(() => setBad(null), 500); }
            }}
            lang="tt" className={cn("min-h-16 rounded-card border-2 bg-card font-tt text-xl font-semibold hover:border-primary", bad === it && "border-danger", ok && it === step.answer && "border-success bg-success/10")}>
            {tt(it)}
          </motion.button>
        ))}
      </div>
      {ok && <p className="font-semibold text-success">✓ {pick(step.why)}</p>}
    </div>
  );
}
