"use client";

import Link from "next/link";
import { Bayem } from "@/components/bayem";
import { ThemeToggle } from "@/components/theme-toggle";
import { ScriptToggle } from "@/components/script-toggle";
import { LanguageSelect } from "@/components/language-select";
import { TT } from "@/components/bi";
import { S, type Line } from "@/lib/strings";
import { useI18n } from "@/lib/i18n";

const NAV = [
  { href: "/#path", line: S.navLearn, ico: "🗺️" },
  { href: "/play/", line: S.navPlay, ico: "🎮" },
  { href: "/achievements/", line: S.navProgress, ico: "🏅" },
  { href: "/#sections", line: S.navSections, ico: "📚" },
];

function NavLabel({ line }: { line: Line }) {
  const { tt, sub } = useI18n();
  return <span>{sub(line) ?? tt(line.tt)}</span>;
}

export function SiteHeader() {
  return (
    <>
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-16 w-full max-w-content items-center gap-2 px-4 sm:gap-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 rounded-btn font-semibold" aria-label="TatarTel">
          <Bayem size={34} />
          <span className="hidden font-display text-xl font-bold text-primary min-[400px]:inline">TatarTel</span>
        </Link>
        <nav aria-label="Main" className="ml-4 hidden items-center gap-1 md:flex">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="rounded-btn px-3 py-2 text-sm text-muted-foreground transition-colors duration-150 ease-out hover:bg-muted hover:text-foreground">
              <NavLabel line={n.line} />
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <LanguageSelect />
          <span className="hidden sm:inline-flex"><ScriptToggle /></span>
          <ThemeToggle />
        </div>
      </div>
    </header>
      <nav aria-label="Mobile" className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
        {NAV.map((n) => (
          <Link key={n.href} href={n.href} className="flex flex-col items-center gap-0.5 py-2 text-[11px] font-bold text-muted-foreground">
            <span className="text-xl" aria-hidden>{n.ico}</span>
            <NavLabel line={n.line} />
          </Link>
        ))}
      </nav>
    </>
  );
}
