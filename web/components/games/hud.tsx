"use client";

import { Flame, Heart, Timer } from "lucide-react";

/** Верхняя панель партии: очки, комбо, жизни, таймер */
export function Hud({ score, combo, lives, time }: { score: number; combo?: number; lives?: number; time?: number }) {
  return (
    <div className="mb-5 flex items-center gap-3 text-sm font-semibold tabular-nums">
      <span className="rounded-btn bg-primary px-2.5 py-1 text-primary-foreground">★ {score}</span>
      {combo !== undefined && combo > 1 && (
        <span className="inline-flex items-center gap-1 text-accent-foreground dark:text-accent"><Flame className="size-4" aria-hidden />×{combo}</span>
      )}
      <span className="ml-auto flex items-center gap-3">
        {time !== undefined && (
          <span className={time <= 3 ? "inline-flex items-center gap-1 text-danger" : "inline-flex items-center gap-1 text-muted-foreground"}>
            <Timer className="size-4" aria-hidden />{time}s
          </span>
        )}
        {lives !== undefined && (
          <span className="inline-flex gap-0.5" aria-label={`lives ${lives}`}>
            {[0, 1, 2].map((i) => (
              <Heart key={i} className={i < lives ? "size-5 fill-danger text-danger" : "size-5 text-muted"} aria-hidden />
            ))}
          </span>
        )}
      </span>
    </div>
  );
}
