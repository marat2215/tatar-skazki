"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { PlayButton } from "@/components/play-button";
import { lessons } from "@/lib/content";
import { useI18n } from "@/lib/i18n";
import { toLatin } from "@/lib/translit";
import { S } from "@/lib/strings";
import { cn } from "@/lib/utils";

export function PhrasebookList() {
  const { tt, sub, locale } = useI18n();
  const [q, setQ] = useState("");
  const [topic, setTopic] = useState<number | null>(null);

  const groups = useMemo(() => {
    const s = q.trim().toLowerCase();
    return lessons
      .map((l, i) => ({
        i,
        l,
        items: l.items.filter(
          (p) => !s || [p.tt, toLatin(p.tt), p.ru, p.en].some((x) => x.toLowerCase().includes(s)),
        ),
      }))
      .filter((g) => (topic === null || g.i === topic) && g.items.length);
  }, [q, topic]);

  const tr = (o: { ru: string; en: string }) => (locale === "en" ? o.en : o.ru);

  return (
    <div className="mx-auto w-full max-w-content px-4 py-10 sm:px-6 lg:px-8">
      <label className="relative block max-w-xl">
        <span className="sr-only">{S.search.ru}</span>
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={`${tt(S.search.tt)}${sub(S.search) ? " / " + sub(S.search) : ""}`}
          className="h-11 w-full rounded-btn border bg-card pl-9 pr-3 text-base shadow-soft placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
        />
      </label>
      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Темы">
        {[null, ...lessons.map((_, i) => i)].map((i) => (
          <button
            key={String(i)}
            type="button"
            aria-pressed={topic === i}
            onClick={() => setTopic(i)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-sm transition-colors duration-150 ease-out",
              topic === i ? "border-primary bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:text-foreground",
            )}
          >
            <span lang="tt" className="font-tt">{i === null ? tt(S.allTopics.tt) : tt(lessons[i].tt)}</span>
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {groups.map(({ i, l, items }) => (
          <Card key={i} className="p-2">
            <h2 className="px-4 pb-2 pt-4 text-lg">
              <span lang="tt" className="font-tt">{tt(l.tt)}</span>
              {sub(l) && <span className="ml-2 text-sm font-normal text-muted-foreground">{tr(l)}</span>}
            </h2>
            <ul>
              {items.map((p) => (
                <li key={p.tt} className="flex items-center gap-2 rounded-btn px-2 py-2 hover:bg-muted">
                  <PlayButton text={p.tt} />
                  <div className="min-w-0">
                    <div lang="tt" className="font-tt font-semibold">{tt(p.tt)}</div>
                    <div className="text-sm text-muted-foreground">{tr(p)}</div>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </div>
  );
}
