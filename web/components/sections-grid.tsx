"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, BookA, Headphones, MessageCircle, Puzzle, type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Bi } from "@/components/bi";
import { Section } from "@/components/section";
import { S, type Line } from "@/lib/strings";

const ITEMS: { href: string; icon: LucideIcon; title: Line; text: Line }[] = [
  { href: "/alphabet/", icon: BookA, title: S.alphabet, text: S.alphabetD },
  { href: "/grammar/", icon: Puzzle, title: S.grammar, text: S.grammarD },
  { href: "/phrasebook/", icon: MessageCircle, title: S.phrasebook, text: S.phrasebookD },
  { href: "/listening/", icon: Headphones, title: S.listeningS, text: S.listeningD },
];

export function SectionsGrid() {
  return (
    <Section id="sections" labelledBy="sections-title">
      <h2 id="sections-title" className="mb-8 text-3xl">
        <Bi line={S.sectionsTitle} />
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {ITEMS.map((it) => (
          <motion.div key={it.href} whileHover={{ y: -2 }} transition={{ duration: 0.15, ease: "easeOut" }}>
            <Link href={it.href} className="group block h-full rounded-card">
              <Card className="flex h-full flex-col gap-4 p-6 transition-shadow duration-200 ease-out group-hover:shadow-lift">
                <div className="flex items-center justify-between">
                  <span className="flex size-11 items-center justify-center rounded-btn bg-accent/15 text-accent-foreground dark:text-accent">
                    <it.icon className="size-5" aria-hidden />
                  </span>
                  <ArrowUpRight className="size-4 text-muted-foreground transition-colors duration-150 group-hover:text-foreground" aria-hidden />
                </div>
                <Bi line={it.title} as="h3" className="text-lg" />
                <Bi line={it.text} as="p" className="text-sm text-muted-foreground" subClassName="text-xs" />
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
