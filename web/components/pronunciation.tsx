"use client";

import { Check, Mic, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TT } from "@/components/bi";
import { usePronunciation } from "@/lib/speech";
import { useI18n } from "@/lib/i18n";
import { S } from "@/lib/strings";
import { cn } from "@/lib/utils";

/** Проверка произношения: распознавание речи или самооценка, если браузер не умеет */
export function Pronunciation({ target, onSuccess }: { target: string; onSuccess: () => void }) {
  const { state, check, setState } = usePronunciation(target);
  const { sub } = useI18n();

  const ok = () => {
    setState("good");
    onSuccess();
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <Button variant="outline" onClick={check} disabled={state === "listening"} aria-live="polite">
        <Mic aria-hidden className={cn(state === "listening" && "text-danger")} />
        <TT line={state === "listening" ? S.listening : S.speak} />
      </Button>
      <p role="status" className="min-h-6 text-center text-sm">
        {state === "good" && (
          <span className="inline-flex items-center gap-1.5 font-semibold text-success">
            <Check className="size-4" aria-hidden /> <TT line={S.pronGood} />
          </span>
        )}
        {state === "retry" && (
          <span className="inline-flex items-center gap-1.5 text-muted-foreground">
            <RotateCcw className="size-4" aria-hidden /> <TT line={S.pronTry} />
          </span>
        )}
        {state === "unsupported" && <span className="text-muted-foreground">{sub(S.pronUnsupported) ?? S.pronUnsupported.tt}</span>}
      </p>
      {(state === "unsupported" || state === "retry") && (
        <Button variant="ghost" size="sm" onClick={ok}>
          <Check aria-hidden />
          <TT line={S.pronSelf} />
        </Button>
      )}
    </div>
  );
}
