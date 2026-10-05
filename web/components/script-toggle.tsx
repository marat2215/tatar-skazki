"use client";

import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/** Кириллица / латиница для татарского текста */
export function ScriptToggle({ className }: { className?: string }) {
  const { script, setScript } = useI18n();
  return (
    <div role="group" aria-label="Кириллица / Latin" className={cn("inline-flex rounded-btn border bg-card p-0.5", className)}>
      {(["cyr", "lat"] as const).map((s) => (
        <button
          key={s}
          type="button"
          aria-pressed={script === s}
          onClick={() => setScript(s)}
          className={cn(
            "rounded-[6px] px-2.5 py-1 text-xs font-semibold transition-colors duration-150 ease-out",
            script === s ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
          )}
        >
          {s === "cyr" ? "Әә" : "Ää"}
        </button>
      ))}
    </div>
  );
}
