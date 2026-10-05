"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { S, type Key, type Line } from "./strings";
import { toLatin } from "./translit";

export type Locale = "tt" | "ru" | "en" | "tr" | "fi";
export const LOCALES: { id: Locale; label: string; flag: string }[] = [
  { id: "tt", label: "Татарча", flag: "🟢" },
  { id: "ru", label: "Русский", flag: "🇷🇺" },
  { id: "en", label: "English", flag: "🇬🇧" },
  { id: "tr", label: "Türkçe", flag: "🇹🇷" },
  { id: "fi", label: "Suomi", flag: "🇫🇮" },
];
type Tr = { ru: string; en: string; tr?: string; fi?: string };
export type Script = "cyr" | "lat";

type Ctx = {
  locale: Locale;
  script: Script;
  setLocale: (l: Locale) => void;
  setScript: (s: Script) => void;
  /** Татарский текст в выбранной письменности */
  tt: (s: string) => string;
  /** Подстрочник (ru/en), null — если выбран только татарский */
  sub: (l: Tr) => string | null;
  /** Перевод на выбранный язык (для татарского — русский) */
  pick: (l: Tr) => string;
  line: (k: Key) => Line;
};

const I18n = createContext<Ctx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("ru");
  const [script, setScriptState] = useState<Script>("cyr");

  useEffect(() => {
    try {
      const l = localStorage.getItem("tt.locale") as Locale | null;
      const s = localStorage.getItem("tt.script") as Script | null;
      const nav = (navigator.language || "ru").slice(0, 2);
      if (l && LOCALES.some((x) => x.id === l)) setLocaleState(l);
      else if (LOCALES.some((x) => x.id === nav)) setLocaleState(nav as Locale);
      else if (nav !== "ru") setLocaleState("en");
      if (s === "cyr" || s === "lat") setScriptState(s);
    } catch {
      /* приватный режим — оставляем значения по умолчанию */
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try { localStorage.setItem("tt.locale", l); } catch { /* ignore */ }
  }, []);
  const setScript = useCallback((s: Script) => {
    setScriptState(s);
    try { localStorage.setItem("tt.script", s); } catch { /* ignore */ }
  }, []);

  const tt = useCallback((s: string) => (script === "lat" ? toLatin(s) : s), [script]);
  const pick = useCallback((l: Tr) => (locale === "tt" ? l.ru : l[locale] ?? l.en), [locale]);
  const sub = useCallback((l: Tr) => (locale === "tt" ? null : pick(l)), [locale, pick]);
  const line = useCallback((k: Key) => S[k], []);

  return (
    <I18n.Provider value={{ locale, script, setLocale, setScript, tt, sub, pick, line }}>{children}</I18n.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18n);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}
