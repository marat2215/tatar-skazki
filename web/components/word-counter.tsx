"use client";

import { useEffect, useState } from "react";
import { animate } from "framer-motion";
import { BookCheck } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Bi } from "@/components/bi";
import { useProgress } from "@/lib/progress";
import { S } from "@/lib/strings";

/** Живой счётчик выученных слов — обновляется сразу после каждой карточки */
export function WordCounter() {
  const p = useProgress();
  const target = p?.learned.length ?? 0;
  const [shown, setShown] = useState(0);

  useEffect(() => {
    const ctrl = animate(shown, target, { duration: 0.25, ease: "easeOut", onUpdate: (v) => setShown(Math.round(v)) });
    return () => ctrl.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  return (
    <div className="inline-flex items-center gap-4 rounded-card border bg-card px-5 py-4 shadow-soft" aria-live="polite">
      <span className="flex size-10 items-center justify-center rounded-btn bg-accent/15 text-accent-foreground dark:text-accent">
        <BookCheck className="size-5" aria-hidden />
      </span>
      {p === null ? (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-7 w-16" />
          <Skeleton className="h-3 w-28" />
        </div>
      ) : (
        <div className="text-left">
          <div className="text-2xl font-semibold tabular-nums">{shown}</div>
          <Bi line={S.counter} className="text-sm text-muted-foreground" />
        </div>
      )}
    </div>
  );
}
