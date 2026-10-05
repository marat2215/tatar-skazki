"use client";

import { Globe } from "lucide-react";
import { LOCALES, useI18n, type Locale } from "@/lib/i18n";

/** Заметный выбор языка интерфейса в шапке */
export function LanguageSelect() {
  const { locale, setLocale } = useI18n();
  return (
    <label className="relative inline-flex h-9 items-center gap-1.5 rounded-btn border bg-card pl-2.5 pr-1 text-sm font-medium shadow-soft focus-within:ring-2 focus-within:ring-ring">
      <Globe className="size-4 text-primary" aria-hidden />
      <span className="sr-only">Language / Язык</span>
      <select
        value={locale}
        onChange={(e) => setLocale(e.target.value as Locale)}
        className="cursor-pointer appearance-none bg-transparent py-1 pr-5 outline-none"
      >
        {LOCALES.map((l) => (
          <option key={l.id} value={l.id}>
            {l.flag} {l.label}
          </option>
        ))}
      </select>
      <span aria-hidden className="pointer-events-none absolute right-2 text-[10px] text-muted-foreground">▼</span>
    </label>
  );
}
