"use client";

import Link from "next/link";
import { Languages } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { ScriptToggle } from "@/components/script-toggle";
import { LanguageSelect } from "@/components/language-select";
import { TT } from "@/components/bi";
import { S } from "@/lib/strings";

const NAV = [
  { href: "/#learn", line: S.navLearn },
  { href: "/play/", line: S.navPlay },
  { href: "/#progress", line: S.navProgress },
  { href: "/#sections", line: S.navSections },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-16 w-full max-w-content items-center gap-2 px-4 sm:gap-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 rounded-btn font-semibold" aria-label="TatarTel">
          <span className="flex size-8 items-center justify-center rounded-btn bg-primary text-primary-foreground">
            <Languages className="size-4" aria-hidden />
          </span>
          <span className="hidden text-lg min-[400px]:inline">TatarTel</span>
        </Link>
        <nav aria-label="Main" className="ml-4 hidden items-center gap-1 md:flex">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="rounded-btn px-3 py-2 text-sm text-muted-foreground transition-colors duration-150 ease-out hover:bg-muted hover:text-foreground">
              <TT line={n.line} />
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
  );
}
