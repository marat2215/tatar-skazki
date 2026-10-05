"use client";

import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import type { Line } from "@/lib/strings";

type Props = {
  line: Line;
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
  className?: string;
  subClassName?: string;
};

/** Татарский текст + подстрочник на русском/английском */
export function Bi({ line, as: Tag = "span", className, subClassName }: Props) {
  const { tt, sub } = useI18n();
  const s = sub(line);
  return (
    <Tag className={cn("block", className)}>
      <span lang="tt" className="block font-tt">{tt(line.tt)}</span>
      {s && <span className={cn("mt-1 block text-[0.7em] font-normal text-muted-foreground", subClassName)}>{s}</span>}
    </Tag>
  );
}

/** Только татарская строка (для кнопок и коротких подписей) */
export function TT({ line, className }: { line: Line; className?: string }) {
  const { tt } = useI18n();
  return <span lang="tt" className={cn("font-tt", className)}>{tt(line.tt)}</span>;
}
