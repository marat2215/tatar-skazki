"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Lock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n";
import { UNITS, currentIndex, usePath } from "@/lib/path";
import { cn } from "@/lib/utils";

/** Карта пути: змейка этапов, пройдено / сейчас / закрыто */
export function PathMap() {
  const { tt, pick } = useI18n();
  const path = usePath();
  const done = path?.done ?? [];
  const cur = currentIndex(done);
  return (
    <section id="path" className="mx-auto w-full max-w-content px-4 py-8 sm:px-6 lg:px-8">
      <Card className="mx-auto max-w-2xl p-6">
        <h2 className="text-center text-3xl">{pick({ ru: "Твой путь", en: "Your path" })}</h2>
        <p className="mt-1 text-center text-muted-foreground">
          {pick({ ru: `Ты на ${Math.min(done.length + 1, UNITS.length)} из ${UNITS.length} этапов`, en: `You're on stage ${Math.min(done.length + 1, UNITS.length)} of ${UNITS.length}` })}
        </p>
        <div className="mt-4 h-3 overflow-hidden rounded-full bg-muted">
          <motion.div className="h-full bg-gradient-to-r from-accent to-primary" initial={{ width: 0 }} animate={{ width: `${(done.length / UNITS.length) * 100}%` }} transition={{ duration: 0.8 }} />
        </div>
        <ol className="mt-6 flex flex-col items-center">
          {UNITS.map((u, i) => {
            const state = done.includes(u.id) ? "done" : i === cur ? "open" : i < cur ? "open" : "lock";
            const left = i % 2 === 0;
            const node = (
              <span className={cn("relative grid size-20 shrink-0 place-items-center rounded-full border-4 border-card text-3xl shadow-[0_6px_0_rgb(0_0_0/0.12)]",
                state === "done" && "bg-success", state === "open" && "bg-accent", state === "lock" && "bg-muted grayscale")}>
                {state === "lock" ? <Lock className="size-6 text-muted-foreground" aria-hidden /> : u.emoji}
                {state === "done" && <Check className="absolute -right-1 -top-1 size-6 rounded-full bg-card p-1 text-success" aria-hidden />}
                {i === cur && <span className="absolute -inset-2.5 animate-[spin_12s_linear_infinite] rounded-full border-[3px] border-dashed border-accent" aria-hidden />}
              </span>
            );
            const label = (
              <span className={cn("flex flex-col", left ? "items-end text-right" : "items-start text-left")}>
                <span lang="tt" className="font-display text-lg font-bold">{tt(u.tt)}</span>
                <span className="text-sm text-muted-foreground">{pick(u.t)}</span>
              </span>
            );
            return (
              <li key={u.id} className="flex w-full flex-col items-center">
                {i > 0 && <span className="my-1 h-7 w-1.5 rounded bg-[repeating-linear-gradient(hsl(var(--border))_0_6px,transparent_6px_12px)]" aria-hidden />}
                {state === "lock" ? (
                  <div className={cn("flex w-full max-w-sm items-center gap-4 opacity-70", left ? "-translate-x-6 flex-row-reverse" : "translate-x-6")}>{node}{label}</div>
                ) : (
                  <Link href={`/lesson/?u=${u.id}`} className={cn("group flex w-full max-w-sm items-center gap-4", left ? "-translate-x-6 flex-row-reverse" : "translate-x-6")}>
                    <motion.span whileHover={{ y: -4, rotate: -2 }} animate={i === cur ? { y: [0, -6, 0] } : {}} transition={i === cur ? { repeat: Infinity, duration: 2.6 } : {}}>{node}</motion.span>
                    {label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </Card>
    </section>
  );
}
