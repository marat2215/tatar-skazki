"use client";

import Link from "next/link";
import { Languages, Send } from "lucide-react";
import { Bi, TT } from "@/components/bi";
import { ScriptToggle } from "@/components/script-toggle";
import { LOCALES, useI18n } from "@/lib/i18n";
import { S } from "@/lib/strings";
import { cn } from "@/lib/utils";


export function SiteFooter() {
  const { locale, setLocale } = useI18n();
  return (
    <footer className="mt-16 border-t bg-card">
      <div className="mx-auto grid w-full max-w-content gap-8 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 font-semibold">
            <span className="flex size-8 items-center justify-center rounded-btn bg-primary text-primary-foreground">
              <Languages className="size-4" aria-hidden />
            </span>
            TatarTel
          </div>
          <Bi line={S.footerAbout} as="p" className="text-sm text-muted-foreground" subClassName="text-xs" />
        </div>

        <nav aria-label="Footer" className="flex flex-col gap-2 text-sm">
          <Bi line={S.navSections} className="mb-1 font-semibold" subClassName="text-xs" />
          {[
            ["/alphabet/", S.alphabet],
            ["/grammar/", S.grammar],
            ["/phrasebook/", S.phrasebook],
            ["/listening/", S.listeningS],
            ["/play/", S.navPlay],
          ].map(([href, line]) => (
            <Link key={href as string} href={href as string} className="w-fit rounded-btn text-muted-foreground hover:text-foreground">
              <TT line={line as typeof S.alphabet} />
            </Link>
          ))}
        </nav>

        <div className="flex flex-col gap-4 text-sm">
          <div>
            <Bi line={S.footerLang} className="mb-2 font-semibold" subClassName="text-xs" />
            <div role="radiogroup" aria-label="Language" className="inline-flex flex-wrap gap-1 rounded-btn border bg-background p-0.5">
              {LOCALES.map((l) => (
                <button
                  key={l.id}
                  type="button"
                  role="radio"
                  aria-checked={locale === l.id}
                  onClick={() => setLocale(l.id)}
                  className={cn(
                    "rounded-[6px] px-3 py-1.5 text-xs font-semibold transition-colors duration-150 ease-out",
                    locale === l.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <Bi line={S.footerScript} className="mb-2 font-semibold" subClassName="text-xs" />
            <ScriptToggle />
          </div>
          <div>
            <Bi line={S.footerContact} className="mb-2 font-semibold" subClassName="text-xs" />
            <div className="flex flex-col gap-1 text-muted-foreground">
              <a className="inline-flex w-fit items-center gap-1.5 rounded-btn hover:text-foreground" href="https://t.me/TatarlargaBot" target="_blank" rel="noopener noreferrer">
                <Send className="size-3.5" aria-hidden /> @TatarlargaBot
              </a>
              <a className="inline-flex w-fit items-center gap-1.5 rounded-btn hover:text-foreground" href="https://t.me/marat_2215" target="_blank" rel="noopener noreferrer">
                <Send className="size-3.5" aria-hidden /> @marat_2215
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t py-6 text-center text-xs text-muted-foreground">© 2026 TatarTel · tatartel.ru</div>
    </footer>
  );
}
