"use client";

import { BookCheck, Flame, GraduationCap, type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Bi } from "@/components/bi";
import { Section } from "@/components/section";
import { ActivityChart } from "@/components/activity-chart";
import { lastDays, streakOf, useProgress } from "@/lib/progress";
import { S, type Line } from "@/lib/strings";

function Stat({ icon: Icon, value, line }: { icon: LucideIcon; value: number | null; line: Line }) {
  return (
    <Card className="flex items-center gap-4 p-5">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-btn bg-primary/10 text-primary">
        <Icon className="size-5" aria-hidden />
      </span>
      <div className="min-w-0">
        {value === null ? <Skeleton className="mb-2 h-7 w-12" /> : <div className="text-2xl font-semibold tabular-nums">{value}</div>}
        <Bi line={line} className="text-sm text-muted-foreground" />
      </div>
    </Card>
  );
}

export function ProgressDashboard() {
  const p = useProgress();
  return (
    <Section id="progress" labelledBy="dash-title">
      <h2 id="dash-title" className="mb-8 text-3xl">
        <Bi line={S.dashTitle} />
      </h2>
      <div className="grid gap-4 md:grid-cols-3">
        <Stat icon={Flame} value={p ? streakOf(p) : null} line={S.streak} />
        <Stat icon={BookCheck} value={p ? p.learned.length : null} line={S.learned} />
        <Stat icon={GraduationCap} value={p ? p.lessonsDone : null} line={S.lessons} />
      </div>
      <Card className="mt-4 p-5 sm:p-6">
        <Bi line={S.activity} as="h3" className="mb-4 text-base" />
        {p ? <ActivityChart data={lastDays(p)} label={S.activity.ru} /> : <Skeleton className="h-48 w-full" />}
      </Card>
    </Section>
  );
}
